exports.list = function(req, res){
  if (req.session.user == undefined || req.session.pwd == undefined || req.session.uid==undefined) {
		res.redirect('/');
	}
	else {
		mysql = require('mysql');
		conn = mysql.createConnection({
			host: 'web2.cpsc.ucalgary.ca',
			user: 's513_apsbanva',
			password: '10037085',
			database: 's513_apsbanva'
		});
		conn.connect();


		var queryImage = 'SELECT username, uid FROM user';
		conn.query(queryImage, function(err,rows) {
			var userList = '';
			for(var i=0;i<rows.length;i++){
				userList += '<a href="/users/' + rows[i].uid
							+'">'+rows[i].username +'</a></br>';
			}
			res.render('feed', {html : userList})
		});
	}
}

exports.follow = function(req,res) {
	console.log('yiyi')
	if (req.session.user == undefined || req.session.pwd == undefined || req.session.uid==undefined) {
		res.redirect('/');
	}
	else {
		mysql = require('mysql');
		conn = mysql.createConnection({
			host: 'web2.cpsc.ucalgary.ca',
			user: 's513_apsbanva',
			password: '10037085',
			database: 's513_apsbanva'
		});
		conn.connect();

		var parsedUrl = req.url.split('/');
		var followeeId = parsedUrl[parsedUrl.length - 2]

		var insertFollow = 'INSERT INTO follows(follower,followee,start) VALUES(?,?,now())';
		var usersId = [req.session.uid,followeeId]
		conn.query(insertFollow, usersId, function(err,rows) {
			if(err)
				console.log(err)
			else
				res.redirect('/users/'+followeeId)
		})
	}
}

exports.unfollow = function(req,res) {
	console.log('yiyi')
	if (req.session.user == undefined || req.session.pwd == undefined || req.session.uid==undefined) {
		res.redirect('/');
	}
	else {
		mysql = require('mysql');
		conn = mysql.createConnection({
			host: 'web2.cpsc.ucalgary.ca',
			user: 's513_apsbanva',
			password: '10037085',
			database: 's513_apsbanva'
		});
		conn.connect();

		var parsedUrl = req.url.split('/');
		var followeeId = parsedUrl[parsedUrl.length - 2]

		var insertUnfollowTime = 'UPDATE follows SET end=now() WHERE follower=? AND followee=? ';
		var usersId = [req.session.uid,followeeId]
		conn.query(insertUnfollowTime, usersId, function(err,rows) {
			console.log('unfollow:'+rows[0])
			if(err)
				console.log(err)
			else
				res.redirect('/users/'+followeeId)
		})
	}
}