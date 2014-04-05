var sessions = require('./sessionIds');
var dbconnection = require('./dbConnection');

function getTimeAgo(actualDate,timestamp){
	var diff = actualDate-timestamp;
	if(diff < 0){
		return 'Timestamp in the future!';
	}
	var moment = require('moment');
	var  fixedDate = moment(timestamp).format('YYYY-MM-DD');
	if(diff< 60000) {
		return 'a few seconds ago';
	}
	else if(diff <3600000) {
		return (Math.floor(diff/1000/60)+' minute(s) ago');
	}
	else if(diff<86400000) {
		return (Math.floor(diff/3600000)+' hour(s) ago');
	}
	else if(diff<3600000*24*31) {
		return Math.floor(diff/86400000)+' day(s) ago';
	}
	else { 
		return 'Posted on ' + fixedDate;
	}
}

exports.getTimeAgo = getTimeAgo;

exports.feed = function(req,res) {
	var mysql = require('mysql');
	var conn = dbconnection.mySqlConnection('web2.cpsc.ucalgary.ca','s513_simona','10141382','s513_simona');
	var uid = req.cookies.uid;
	var pwd = req.cookies.pwd;
	var siduid = req.cookies.sid.split(':')[1];
	uid = siduid;

	conn.query('SELECT uid FROM user WHERE uid=?', [siduid], function(err,result) {

		if(err){
			console.log(err);
			res.status(500);
			res.redirect('/internalError');
		}
		else if (sessions.sessionIds.indexOf(req.cookies.sid) < 0 || result.length < 1 ){
			res.redirect(302,'/sessions/new');
		}
		else {
			console.log(siduid);
			var limit
			var url = require('url')
			var urlc = url.parse(req.url)
			if(urlc.query)
				limit = parseInt(urlc.query.split('=')[1]*30);
			else
				limit = 30

			var queryImage = 'SELECT DISTINCT p.path, p.uid, p.time_uploaded, u.username FROM follows f '
				+'JOIN photos p ON f.followee = p.uid JOIN user u ON u.uid = f.followee '
				+'WHERE f.follower=? AND ((p.time_uploaded<f.end AND p.time_uploaded>f.start) '
				+'OR (f.end="0000-00-00 00:00:00" AND p.time_uploaded>f.start)) '
				+'UNION '
				+'SELECT q.path, q.uid, q.time_uploaded, u.username FROM photos q '
				+'JOIN user u ON u.uid = q.uid WHERE u.uid=? '
				+'ORDER BY time_uploaded DESC '
				+'LIMIT 0,?';
			conn.query(queryImage,[uid, uid, limit], function(err,photos) {
				if(err){
					console.log(err);
					res.status(500);
					res.redirect('/internalError');
				}
				else {
					var feedPhotos = '';
					for(var i=0;i<photos.length;i++) {
						if(!(photos[i].pid === null)){
							var filePath = photos[i].path;
							var thumbPath = filePath.replace('photos', 'photos/thumbnail')
							var time = getTimeAgo(new Date(), photos[i].time_uploaded)
							feedPhotos += '<div class="imgBox">'
								+'<a href="/' + filePath + '">'
								+'<img src = "/' + thumbPath +'" width = 400 alt="image ici"/></a></br>'
								+'<a href="/users/'+photos[i].uid+'"></br>'
								+photos[i].username+i+'</a></br>'
								+'<span class="time">'+time+'</span>'+'</div>';
						}
					}
					var page = limit/30+1

					feedPhotos += '<br><a href="/feed?page='+page+'"><button class="btn-links" type="submit"><h5>MORE</h5></button></a>';
					conn.end();
					res.render('feed', { title: 'SNAPGRAM', name: req.cookies.user, html : feedPhotos});
				}
			});
		}
	});

};

exports.upload = function(req,res) {
	if (!(sessions.sessionIds.indexOf(req.cookies.sid) > -1)) {
		console.log('not logged in');
		res.redirect(302, '/sessions/new');
	}
	else {
		mysql = require('mysql');
		gm = require('gm');


		var conn = dbconnection.mySqlConnection('web2.cpsc.ucalgary.ca','s513_simona','10141382','s513_simona');
		var uidForUploading = req.cookies.sid.split(':')[1];
		var fs= require('fs-extra') //FIRST: $npm install fs-extra

		var type = req.files.image.headers['content-type'];
		var name = req.files.image.headers['content-disposition'].split("=")[2].replace(/"/g, '');

		var localPath = __dirname + '/../public/photos/' + uidForUploading +'/'+name;
		var thumbPath = __dirname + '/../public/photos/thumbnail/' + uidForUploading +'/'+name;
		var queryPath = 'photos/' + uidForUploading +'/'+name;

		if(type=='image/jpeg' || type=='image/png') {
			//var user = req.cookies.user
			var toInsert = [uidForUploading,queryPath];
			var queryString = 'INSERT INTO photos(uid,time_uploaded,path) VALUES(?,now(),?)'
			conn.query(queryString,toInsert, function(err,result){
				console.log('8');
				if(err){
					console.log(err);
		  			res.status(500);
					res.redirect('/internalError');
				}
				else {

					//write photo to filesystem
					fs.copy(req.files.image.path, localPath);
					//write thumbnail to filesystem
					gm(req.files.image.path).resize(400).stream(function(err, stdout, stderr) {
						var writeStream = fs.createWriteStream(thumbPath, {
							encoding: 'base64'
						});
						stdout.pipe(writeStream);
					});
					res.redirect(303,'/feed');
				}
				conn.end();
			});
		}
		
	}
}

exports.stream = function(req,res) {
	if (sessions.sessionIds.indexOf(req.cookies.sid) < 0) {
		res.redirect(302, '/sessions/new');
	}
	else {
		mysql = require('mysql');
		var conn = dbconnection.mySqlConnection('web2.cpsc.ucalgary.ca','s513_simona','10141382','s513_simona');
		var parsed = req.url.split('/');
		var followeeUid = parsed[parsed.length-1];
		var followButton = ''

		var limit
		var url = require('url')
		var urlc = url.parse(req.url)
		if(urlc.query)
			limit = parseInt(urlc.query.split('=')[1]*30);
		else
			limit = 30

		if(parseInt(followeeUid)!=req.cookies.uid) {
			followButton = '<a href="'+followeeUid;
			var attributes = [req.cookies.uid,followeeUid]
			var unfollowQuery = 'SELECT * FROM follows WHERE follower = ? AND followee = ? ORDER BY end';
			conn.query(unfollowQuery,attributes,function(err,rows){
				if(err){
					console.log(err);
		  			res.status(500);
					res.redirect('/internalError');
				}
				else if(rows.length > 0 && rows[0].end == '0000-00-00 00:00:00') {
					followButton += '/unfollow"><button class="btn-links" type="submit"><h5>UNFOLLOW</h5></button></a>';
				}
				else {
					followButton += '/follow"><button class="btn-links" type="submit"><h5>FOLLOW</h5></button></a>'
				}
				
			})
		}

		var queryImage = 'SELECT p.path, u.uid, u.username, p.time_uploaded '
							+'FROM photos p RIGHT JOIN user u ON p.uid = u.uid WHERE u.uid=?'
							+'ORDER BY time_uploaded DESC '
							+'LIMIT 0,?';
		conn.query(queryImage,[followeeUid, limit], function(err,rows) {
			if(err){
				console.log(err);
	  			res.status(500);
				res.redirect('/internalError');
			}
			else if(rows.length === 0){
				res.status(404);
				res.redirect('/notFound');
			} else {
				var feedPhotos = '';
				if(!(rows[0].pid === null)){
					for(var i=0; i<rows.length; i++) {
						if(!(rows[i].path === null)){
							var filePath = rows[i].path;
							var thumbPath = filePath.replace('photos', 'photos/thumbnail')
							var time = getTimeAgo(new Date(), rows[i].time_uploaded);
							feedPhotos += '<div class="imgBox">'
										+'<a href="../' + filePath + '">'
										+'<img src ="../' + thumbPath +'"width="400" alt="image ici"/></a></br>'
										+'<a href="'+rows[i].uid+'"></br>'
										+rows[i].username+i+'</a></br>'
										+'<span class="time">'+time+'</span>'+'</div>';
						}
					}
				}

				//voodoo magic going on here, don't touch!!!!!
				var page = limit/30+1;
				feedPhotos += '<br><a href="/users/'+followeeUid+'?page='+page+'"><button class="btn-links" type="submit"><h5>MORE</h5></button></a>';
				feedPhotos = feedPhotos.replace(('?page='+(page-1)), '');
				res.render('feed', {title: 'SNAPGRAM', name: req.cookies.user, html : feedPhotos, follow:followButton});

			}
		});
		conn.end();
	}
};

