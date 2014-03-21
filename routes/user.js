var sessions = require('./sessionIds');
var dbconnection = require('./dbConnection');

exports.list = function(req, res){
  if (!(sessions.sessionIds.indexOf(req.session.sessionId) > -1)) {
		res.redirect('/');
	}
	else {
		mysql = require('mysql');
	  var conn = dbconnection.mySqlConnection('web2.cpsc.ucalgary.ca','s513_apsbanva','10037085','s513_apsbanva');


		var queryImage = 'SELECT username, uid FROM user';
		conn.query(queryImage, function(err,rows) {
			if (err) {
				console.log(err);
				res.status(500);
				res.redirect('/internalError');
	  		} else {
	  			var userList = '';
				userList += '</br>';
				for(var i=0;i<rows.length;i++){
					userList += '<a href="/users/' + rows[i].uid
								+'">'+rows[i].username +'</a></br>';
				}
				userList += '</br>';
				res.render('feed', {html : userList, title : 'SNAPGRAM'})
	  		}
		});
		conn.end();
	}
}

exports.follow = function(req,res) {
	console.log('yiyi')
	if (!(sessions.sessionIds.indexOf(req.session.sessionId) > -1)) {
		res.redirect('/');
	}
	else {
		mysql = require('mysql');
		var conn = dbconnection.mySqlConnection('web2.cpsc.ucalgary.ca','s513_apsbanva','10037085','s513_apsbanva');

		var parsedUrl = req.url.split('/');
		var followeeId = parsedUrl[parsedUrl.length - 2]

		var insertFollow = 'INSERT INTO follows(follower,followee,start) VALUES(?,?,now())';
		var usersId = [req.session.uid,followeeId]
		conn.query(insertFollow, usersId, function(err,rows) {
			if (err) {
				console.log(err);
				res.status(500);
				res.redirect('/internalError');
	  		} else
				res.redirect('/users/'+followeeId)
		})
		conn.end();
	}
}

exports.unfollow = function(req,res) {
	console.log('yiyi')
	if (!(sessions.sessionIds.indexOf(req.session.sessionId) > -1)) {
		res.redirect('/');
	}
	else {
		mysql = require('mysql');
		var conn = dbconnection.mySqlConnection('web2.cpsc.ucalgary.ca','s513_apsbanva','10037085','s513_apsbanva');

		var parsedUrl = req.url.split('/');
		var followeeId = parsedUrl[parsedUrl.length - 2]

		var insertUnfollowTime = 'UPDATE follows SET end=now() WHERE follower=? AND followee=? ';
		var usersId = [req.session.uid,followeeId]
		conn.query(insertUnfollowTime, usersId, function(err,rows) {
			console.log('unfollow:'+rows[0])
			if (err) {
				console.log(err);
				res.status(500);
				res.redirect('/internalError');
	  		} else
				res.redirect('/users/'+followeeId)
		})
		conn.end();
	}
}