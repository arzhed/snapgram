exports.feed = function(req,res) {
	mysql = require('mysql');
	conn = mysql.createConnection({
	  host: 'localhost',
	  user: 'root',
	  password: '',
	  database: 'snapgram'
	});
	conn.connect();

/*
	var queryImage = 'SELECT picture FROM photos WHERE uid=7';
	conn.query(queryImage,function(err,rows) {
		console.log(rows[0].picture)
	});
*/
	res.render('layout', { name: req.session.user});
	
	var fs = require('fs');

	fs.writeFile(__dirname + "/../views/feed.jade",
		"h1 Hey there!",	
		function(err) {
		    if(err) {
		        console.log(err);
		    } else {
		        res.render('layout');
		    }
		}
	);
}

exports.upload = function(req,res) {
	mysql = require('mysql');
	conn = mysql.createConnection({
	  host: 'localhost',
	  user: 'root',
	  password: '',
	  database: 'snapgram'
	});
	conn.connect();
console.log(req.files.photoFile)
	var type = req.files.photoFile.headers['content-type'];
	if(type=='image/jpeg' || type=='image/png') {
		conn.query('INSERT INTO photos(uid,picture) VALUES((SELECT uid FROM user WHERE username=?),LOAD_FILE(?))',['arzhed',req.files.photoFile.path], function(err,result){
			console.log(err)
			//neat!
		});

	}
	res.render('layout');
}