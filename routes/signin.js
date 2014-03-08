var sessions = require('./sessionIds');
exports.signin = function(req, res){
	
	var passwordHash = require('password-hash');

	mysql = require('mysql');
	conn = mysql.createConnection({
		host: 'web2.cpsc.ucalgary.ca',
		user: 's513_apsbanva',
		password: '10037085',
		database: 's513_apsbanva'
	});
	conn.connect();

	var user = req.body.uname;
	var password = req.body.pwd;

	conn.query('SELECT pwd,uid FROM user WHERE username=?', [user], function(err, rows, fields) {
  		if (err){
  			res.status(500).redirect('/internalError');
  			//throw err;
  		}
		else if (rows[0] == undefined){
			req.session.errorMessage = 'Username not found';
			res.redirect('/sessions/new');
			//res.render('index', { title: 'Snapgram', wrongSignIn: 'Username not found' });	
		}
		else if(passwordHash.verify(password, rows[0].pwd)) {
				req.session.user = user;
				req.session.pwd = rows[0].pwd;
				req.session.uid = rows[0].uid;
				var sessionId = Math.round(Math.random()*10000);
				sessions.sessionIds.push(sessionId);
				console.log(sessions.sessionIds);
				req.session.sessionId = sessionId;
				//(app.get(sessions)).push(sessionId);
				res.redirect('/');
		}
		else{
			req.session.errorMessage = 'Wrong password';
			res.redirect('/sessions/new');
			//res.render('index', { title: 'Snapgram', wrongSignIn: 'Wrong password' });
		}

	});

	conn.end();
	
  //res.render('index', { title: 'Snapgram' });
};
