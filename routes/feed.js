exports.feed = function(req,res) {
	mysql = require('mysql');
	conn = mysql.createConnection({
	  host: 'localhost',
	  user: 'root',
	  password: '',
	  database: 'snapgram'
	});
	conn.connect();

	var queryImage = 'SELECT picture FROM photos WHERE uid=1';
	conn.query(queryImage,function(err,rows) {
		console.log(rows)
		if(rows[0]) {
			console.log('rows[0]')
		}
			//console.log('COUCOU' +rows[0])
	});
	
	var fs = require('fs');

	fs.writeFile(__dirname + "/../views/feed.jade",
		"h1 Hey there!",	
		function(err) {
		    if(err) {
		        console.log(err);
		    } else {
		        res.render('layout', { name: req.session.user});
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

	var type = req.files.photoFile.headers['content-type'];
	if(type=='image/jpeg' || type=='image/png') {
		console.log('type OK')
		var date_time = new Date().toISOString().slice(0, 19).replace('T', ' ');
		var toInsert = ['arzhed',date_time,req.files.photoFile.path];
		var queryString = 'INSERT INTO photos(uid,time_uploaded,picture) VALUES((SELECT uid FROM user WHERE username=?),?,LOAD_FILE(?))'
		conn.query(queryString,toInsert, function(err,result){
			console.log(err)
			//neat!
		});

	}
	res.redirect('/feed');
}