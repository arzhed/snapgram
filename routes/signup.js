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

	var fname = req.query.fnmae;
	var lname = req.query.lname;
	var user = req.query.uname;
	var password = req.query.pwd;
	var hashedPassword = passwordHash.generate(password);


	conn.query('INSERT INTO user(username, lastname, firstname, password) VALUES(?,?,?,?)', [user,lname,fname,hashedPassword], function(err, rows, fields) {
  		if (err) {
  			catch(err) {
  				console.log(err);
  			}
  		}
	});

	conn.end();

	
  //res.render('index', { title: 'Snapgram' });
};