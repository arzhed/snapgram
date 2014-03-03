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
	  host: 'localhost',
	  user: 'root',
	  password: '',
	  database: 'snapgram'
	});
	conn.connect();

	var user = req.body.uname;
	var password = req.body.pwd;

	conn.query('SELECT pwd FROM user WHERE username=?', [user], function(err, rows, fields) {
  		if (err) throw err;
		if (rows[0] == undefined)
			res.send(200,'wrong username');
		else {
			if(passwordHash.verify(password, rows[0].pwd))
				res.send(200,'login successful')
			else
				res.send(200, 'wrong password')
		}
	});

	conn.end();
	
  //res.render('index', { title: 'Snapgram' });
};