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

	var user = req.query.uname;
	var password = req.query.pwd;

	conn.query('SELECT password FROM user WHERE username=?', [user], function(err, rows, fields) {
  		if (err) throw err;
		console.log('The solution is: '+rows[0].password);
		console.log(passwordHash.verify(password, rows[0].password));
	});

	conn.end();

	
  //res.render('index', { title: 'Snapgram' });
};