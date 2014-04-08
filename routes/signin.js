var sessions = require('./sessionIds');
var dbconnection = require('./dbConnection');


exports.signin = function(req, res){
	if (sessions.sessionIds.indexOf(req.cookies.sid) < 0){
		var passwordHash = require('password-hash');

		mysql = require('mysql');
		var conn = dbconnection.mySqlConnection('web2.cpsc.ucalgary.ca','s513_simona','10141382','s513_simona');

		var user = req.body.username;
		var password = req.body.password;

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
					var sessionId = Math.round(Math.random()*10000);
					var sessionIdConcat = sessionId + ':' + rows[0].uid + ':' + user;
					sessions.sessionIds.push(sessionIdConcat);
					console.log(sessionIdConcat);
					res.cookie('sid', sessionIdConcat);
					res.redirect('/feed');
			}
			else{
				console.log('Wrong password')
				req.session.errorMessage = 'Wrong password';
				res.redirect('/sessions/new');
			}
			conn.end();
		});

	} else {
		res.redirect(302, '/feed');
	}
};
