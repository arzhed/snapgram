var sessions = require('./sessionIds');
var dbconnection = require('./dbConnection');

exports.signup = function(req, res){
	if (sessions.sessionIds.indexOf(req.cookies.sid) < 0){
		var passwordHash = require('password-hash');
		var fs = require('fs')
		mysql = require('mysql');
		var conn = dbconnection.mySqlConnection('web2.cpsc.ucalgary.ca','s513_rbesson','10141389','s513_rbesson');
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
					var connPwd = dbconnection.mySqlConnection('web2.cpsc.ucalgary.ca','s513_rbesson','10141389','s513_rbesson');
						//if(typeof(conn) != 'string'){
		  			connPwd.query('Select pwd from user where uid=?', [result.insertId], function(err, rows, fields){
		  				if (err) {
		  					console.log(err);
			  				res.status(500);
							res.redirect('/internalError');
		  				} else {
				  			fs.mkdirSync(__dirname + '/../public/pictures/'+result.insertId);
		  					var sessionId = Math.round(Math.random()*10000);
							sessions.sessionIds.push(sessionId);
							res.cookie('sid', sessionId);
							res.cookie('user', user);//, { maxAge: 3600000 });
							res.cookie('uid', rows[0].uid);//, { maxAge: 3600000 });
							res.cookie('pwd', rows[0].pwd);//, { maxAge: 3600000 });
				  			res.redirect('/feed');
		  				}
		  				connPwd.end();
		  			});
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
