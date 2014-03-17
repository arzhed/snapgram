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
				console.log('yo')
				//(app.get(sessions)).push(sessionId);				
				res.redirect('/feed');
		}
		else{
			console.log('Wrong password')
			req.session.errorMessage = 'Wrong password';
			res.redirect('/sessions/new');
			//res.render('index', { title: 'Snapgram', wrongSignIn: 'Wrong password' });
		}

	});

	conn.end();
	
  //res.render('index', { title: 'Snapgram' });
};
