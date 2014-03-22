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
	var conn = dbconnection.mySqlConnection('web2.cpsc.ucalgary.ca','s513_apsbanva','10037085','s513_apsbanva');
	var uid = req.session.uid;
	var pwd = req.session.pwd;

	conn.query('SELECT uid, pwd FROM user WHERE uid=? AND pwd=?', [uid,pwd], function(err,result) {
		if(err){
			console.log(err);
  			res.status(500);
			res.redirect('/internalError');
		}
		else if (sessions.sessionIds.indexOf(req.session.sessionId) < 0 || result.length < 1 ){
			res.redirect(302,'/sessions/new');
		}
		else {
			var url = require('url')
			var urlc = url.parse(req.url)
			if(urlc.query)
				var limit = parseInt(urlc.query.split('=')[1]*30);
			else
				var limit = 30

			var queryImage = 'SELECT DISTINCT p.path, p.uid, p.time_uploaded, u.username FROM follows f '
				+'JOIN photos p ON f.followee = p.uid JOIN user u ON u.uid = f.followee '
				+'WHERE f.follower=? AND ((p.time_uploaded<f.end AND p.time_uploaded>f.start) '
				+'OR (f.end="0000-00-00 00:00:00" AND p.time_uploaded>f.start)) '
				+'UNION '
				+'SELECT q.path, q.uid, q.time_uploaded, u.username FROM photos q '
				+'JOIN user u ON u.uid = q.uid WHERE u.uid=? '
				+'ORDER BY time_uploaded DESC '
				+'LIMIT 0,?';
			conn.query(queryImage,[req.session.uid, req.session.uid, limit], function(err,pictures) {
				if(err){
					console.log(err);
		  			res.status(500);
					res.redirect('/internalError');
				}
				else {					
					var feedPhotos = '';
					for(var i=0;i<pictures.length;i++) {						
						var filePath = pictures[i].path;
						var time = getTimeAgo(new Date(), pictures[i].time_uploaded)				
						feedPhotos += '<div class="imgBox">'
							+'<a href="' + filePath + '">'
							+'<img src="' + filePath +'" width = 400 alt="image ici"/></a></br>'
							+'<a href="'+pictures[i].uid+'"></br>'
							+pictures[i].username+'</a></br>'
							+'<span class="time">'+time+'</span>'+'</div>';
					}
					var page = limit/30+1
					feedPhotos += '<br><a href="/feed?page='+page+'"><button class="btn-links" type="submit"><h5>MORE</h5></button></a>'
					res.render('feed', { title: 'SNAPGRAM', name: req.session.user, html : feedPhotos});
				}
			});
		}
		conn.end();
	});
	
};

exports.upload = function(req,res) {
	if (!(sessions.sessionIds.indexOf(req.session.sessionId) > -1)) {
		res.redirect(302, '/sessions/new');
	}
	else {
		mysql = require('mysql');
		var conn = dbconnection.mySqlConnection('web2.cpsc.ucalgary.ca','s513_apsbanva','10037085','s513_apsbanva');

		var fs= require('fs-extra') //FIRST: $npm install fs-extra
		var type = req.files.photoFile.headers['content-type'];
		var name = req.files.photoFile.headers['content-disposition'].split("=")[2].replace(/"/g, '');
		var localPath = __dirname + '/../public/pictures/' + req.session.uid +'/'+name;
		var queryPath = 'pictures/' + req.session.uid +'/'+name;
		console.log(localPath);
		console.log(queryPath);
		if(type=='image/jpeg' || type=='image/png') {
			var user = req.session.user
			var toInsert = [user,queryPath];
			var queryString = 'INSERT INTO photos(uid,time_uploaded,path) VALUES((SELECT uid FROM user WHERE username=?),now(),?)'
			conn.query(queryString,toInsert, function(err,result){
				if(err){
					console.log(err);
		  			res.status(500);
					res.redirect('/internalError');
				}
				else {
					fs.copy(req.files.photoFile.path, localPath);
				}
			});
		}
		conn.end();
		res.redirect('/feed');
	}
}

exports.stream = function(req,res) {
	if (sessions.sessionIds.indexOf(req.session.sessionId) < 0) {
		console.log('/users/1')
		res.redirect(302, '/sessions/new');
	}
	else {
		mysql = require('mysql');
		var conn = dbconnection.mySqlConnection('web2.cpsc.ucalgary.ca','s513_apsbanva','10037085','s513_apsbanva');

		var parsed = req.url.split('/');
		var followeeUid = parsed[parsed.length-1];
		var followButton = ''

		if(parseInt(followeeUid)!=req.session.uid) {
			followButton = '<a href="'+followeeUid;
			var attributes = [req.session.uid,followeeUid]
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
							+'ORDER BY time_uploaded DESC';
		conn.query(queryImage,[followeeUid], function(err,rows) {
			console.log(rows);
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
						var filePath = rows[i].path;
						console.log(filePath);
						var time = getTimeAgo(new Date(), rows[i].time_uploaded);
						feedPhotos += '<div class="imgBox">'
									+'<a href="../' + filePath + '">'
									+'<img src="../' + filePath +'" width = 400 alt="image ici"/></a></br>'
									+'<a href="'+rows[i].uid+'"></br>'
									+rows[i].username+'</a></br>'
									+'<span class="time">'+time+'</span>'+'</div>';
					}	
				}
				res.render('feed', {title: 'SNAPGRAM', name: req.session.user, html : feedPhotos, follow:followButton});
			}
		});
		conn.end();
	}
};

