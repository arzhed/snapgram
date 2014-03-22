var sessions = require('./sessionIds');
var dbconnection = require('./dbConnection');


exports.signin = function(req, res){
	if (sessions.sessionIds.indexOf(req.session.sessionId) < 0){
		var passwordHash = require('password-hash');

		mysql = require('mysql');
		var conn = dbconnection.mySqlConnection('web2.cpsc.ucalgary.ca','s513_apsbanva','10037085','s513_apsbanva');

		var user = req.body.uname;
		var password = req.body.pwd;

		conn.query('SELECT pwd,uid FROM user WHERE username=?', [user], function(err, rows, fields) {
	  		if (err){
	  			console.log(err);
	  			res.status(500);
				res.redirect('/internalError');
	  		}
			else if (rows[0] == undefined){
				
				console.log('Wrong password or username')
				req.session.errorMessage = 'Wrong password or username';
				res.redirect('/sessions/new');
				//res.render('index', { title: 'Snapgram', wrongSignIn: 'Username not found' });	
			}
			else if(passwordHash.verify(password, rows[0].pwd)) {
					req.session.user = user;
					req.session.uid = rows[0].uid;
					req.session.pwd = rows[0].pwd;
					var sessionId = Math.round(Math.random()*10000);
					sessions.sessionIds.push(sessionId);
					req.session.sessionId = sessionId;
					//(app.get(sessions)).push(sessionId);				
					res.redirect('/feed');
			}
			else{
				console.log('Wrong password')
				req.session.errorMessage = 'Wrong password';
				res.redirect('/sessions/new');
				//res.render('index', { title: 'Snapgram', wrongSignIn: 'Wrong password' });
			}
			conn.end();
		});

	} else {
		res.redirect(302, '/feed');
	}
};
