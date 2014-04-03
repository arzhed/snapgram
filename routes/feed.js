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

	conn.query('SELECT uid, pwd FROM user WHERE uid=? AND pwd=?', [uid,pwd], function(err,result) {
		if(err){
			console.log(err);
  			res.status(500);
			res.redirect('/internalError');
		}
		else if (sessions.sessionIds.indexOf(req.cookies.sid) < 0 || result.length < 1 ){
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
			conn.query(queryImage,[req.cookies.uid, req.cookies.uid, limit], function(err,pictures) {
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
					res.render('feed', { title: 'SNAPGRAM', name: req.cookies.user, html : feedPhotos});
				}
			});
		}
		conn.end();
	});
	
};

exports.upload = function(req,res) {
	if (!(sessions.sessionIds.indexOf(req.cookies.sid) > -1)) {
		res.redirect(302, '/sessions/new');
	}
	else {
		mysql = require('mysql');
		var conn = dbconnection.mySqlConnection('web2.cpsc.ucalgary.ca','s513_simona','10141382','s513_simona');

		console.log('1');
		var fs= require('fs-extra') //FIRST: $npm install fs-extra
		console.log('2');
		var type = req.files.photoFile.headers['content-type'];
		console.log('3');
		var name = req.files.photoFile.headers['content-disposition'].split("=")[2].replace(/"/g, '');
		console.log('4');
		var localPath = __dirname + '/../public/pictures/' + req.cookies.uid +'/'+name;
		console.log('5');
		var queryPath = 'pictures/' + req.cookies.uid +'/'+name;
		console.log('6');
		if(type=='image/jpeg' || type=='image/png') {
			var user = req.cookies.user
			var toInsert = [req.cookies.uid,queryPath];
			var queryString = 'INSERT INTO photos(uid,time_uploaded,path) VALUES(?,now(),?)'
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
	if (sessions.sessionIds.indexOf(req.cookies.sid) < 0) {
		res.redirect(302, '/sessions/new');
	}
	else {
		mysql = require('mysql');
		var conn = dbconnection.mySqlConnection('web2.cpsc.ucalgary.ca','s513_simona','10141382','s513_simona');
		var parsed = req.url.split('/');
		var followeeUid = parsed[parsed.length-1];
		var followButton = ''

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
							+'ORDER BY time_uploaded DESC';
		conn.query(queryImage,[followeeUid], function(err,rows) {
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
						var time = getTimeAgo(new Date(), rows[i].time_uploaded);
						feedPhotos += '<div class="imgBox">'
									+'<a href="../' + filePath + '">'
									+'<img src="../' + filePath +'" width = 400 alt="image ici"/></a></br>'
									+'<a href="'+rows[i].uid+'"></br>'
									+rows[i].username+'</a></br>'
									+'<span class="time">'+time+'</span>'+'</div>';
					}	
				}
				res.render('feed', {title: 'SNAPGRAM', name: req.cookies.user, html : feedPhotos, follow:followButton});
			}
		});
		conn.end();
	}
};

