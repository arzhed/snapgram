exports.signin = function(req, res){
	
	var passwordHash = require('password-hash');
/*
	mysql = require('mysql');
	conn = mysql.createConnection({
	  host: 'web2.cpsc.ucalgary.ca',
	  user: 's513_apsbanva',
	  password: '10037085',
	  database: 's513_apsbanva'
	});
*/
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

	conn.query('SELECT pwd FROM user WHERE username=?', [user], function(err, rows, fields) {
  		if (err) throw err;
		if (rows[0] == undefined)
			res.render('index', { title: 'Snapgram', wrongSignIn: 'Username not found' });
		else if(passwordHash.verify(password, rows[0].pwd)) {
				req.session.user = user;
				req.session.pass = password;
				res.redirect('/feed');
		}
		else
			res.render('index', { title: 'Snapgram', wrongSignIn: 'Wrong password' });
	});

	conn.end();
	
  //res.render('index', { title: 'Snapgram' });
};