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
	console.log(fname)
	console.log(lname)
	console.log(user)
	console.log(password)


	if(fname && lname && user && password) {
		conn.query('INSERT INTO user(username, lname, fname, pwd) VALUES(?,?,?,?)', [user,lname,fname,hashedPassword], function(err, rows, fields) {
	  		if (err) {
	  			console.log(err);
	  		} else {
	  			res.redirect('/feed');
	  		}
		});
	}
	else {		
		res.render('index', { title: 'Snapgram', wrongSignUp: 'Missing field' });
	}

	conn.end();

  //res.render('index', { title: 'Snapgram' });
};