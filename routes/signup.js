exports.signup = function(req, res){
	var passwordHash = require('password-hash');
	var fs = require('fs')
	mysql = require('mysql');
	conn = mysql.createConnection({
		host: 'web2.cpsc.ucalgary.ca',
		user: 's513_apsbanva',
		password: '10037085',
		database: 's513_apsbanva'
	});
	conn.connect();

	var fname = req.body.fname;
	var lname = req.body.lname;
	var user = req.body.uname;
	var password = req.body.pwd;
	var hashedPassword = passwordHash.generate(password);

	if(fname && lname && user && password) {
		
		conn.query('INSERT INTO user(username, lname, fname, pwd) VALUES(?,?,?,?)', [user,lname,fname,hashedPassword], function(err, result) {
	  		if (err) {
	  			console.log('hello1');
	  			console.log(err);
	  		} else {
	  			console.log('hello');
	  			fs.mkdirSync(__dirname + '/../public/pictures/'+result.insertId);
	  			req.session.user = user;
	  			req.session.password = hashedPassword;
	  			res.redirect('/');
	  			//res.redirect('/feed');
	  		}
		});
	}
	else {
		req.session.errorMessage = 'Missing field';
		res.redirect('/users/new');
		//res.render('signup', { title: 'SNAPGRAM', wrongSignUp: 'Missing field' });
	}

	conn.end();
};
