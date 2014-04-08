var sessions = require('./sessionIds');
var dbconnection = require('./dbConnection');

exports.signup = function(req, res){
	if (sessions.sessionIds.indexOf(req.cookies.sid) < 0){
		var passwordHash = require('password-hash');
		var fs = require('fs')
		mysql = require('mysql');

		var conn = dbconnection.mySqlConnection('web2.cpsc.ucalgary.ca','s513_simona','10141382','s513_simona');

		var fname = req.body.fname;
		var lname = req.body.lname;
		var user = req.body.username;
		var password = req.body.password;
		var hashedPassword = passwordHash.generate(password);

		if(fname && lname && user && password) {
			
			conn.query('INSERT INTO user(username, lname, fname, pwd) VALUES(?,?,?,?)', [user,lname,fname,hashedPassword], function(err, result) {
				if (err) {
		  			if (err.errno === 1062) {
						req.session.errorMessage = 'Username already exists';
						res.redirect('/users/new');
		  			} 
		  			else {
						console.log(err);
			  			res.status(500);
						res.redirect('/internalError');
		  			}
		  		}
		  		else {
		  			fs.mkdirSync(__dirname + '/../public/photos/'+result.insertId);
		  			fs.mkdirSync(__dirname + '/../public/photos/thumbnail/'+result.insertId);
  					var sessionId = Math.round(Math.random()*10000);
					
					var sessionIdConcat = sessionId + ':' + result.insertId + ':' + user + ':' + hashedPassword;
					sessions.sessionIds.push(sessionIdConcat);
					res.cookie('sid', sessionIdConcat);
					//res.cookie('user', user);//, { maxAge: 3600000 });
					//res.cookie('uid', rows[0].uid);//, { maxAge: 3600000 });
					//res.cookie('pwd', rows[0].pwd);//, { maxAge: 3600000 });
		  			res.redirect('/feed');
		  		}
		  		conn.end();
			});
		}
		else {
			req.session.errorMessage = 'Missing field';
			res.redirect('/users/new');
			//res.render('signup', { title: 'SNAPGRAM', wrongSignUp: 'Missing field' });
		}
	} else {
		res.redirect(302, '/feed');
	}
};
