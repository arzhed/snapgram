exports.signup = function(req, res){
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

	var fname = req.body.fname;
	var lname = req.body.lname;
	var user = req.body.uname;
	var password = req.body.pwd;
	var hashedPassword = passwordHash.generate(password);


	conn.query('INSERT INTO user(username, lname, fname, pwd) VALUES(?,?,?,?)', [user,lname,fname,hashedPassword], function(err, rows, fields) {
  		if (err) {
  			console.log(err);
  		}
	});

	conn.end();

	res.send(200, 'Bravo')
  //res.render('index', { title: 'Snapgram' });
};