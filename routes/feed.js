exports.feed = function(req,res) {
	mysql = require('mysql');
	conn = mysql.createConnection({
		host: 'web2.cpsc.ucalgary.ca',
		user: 's513_apsbanva',
		password: '10037085',
		database: 's513_apsbanva'
	});
	conn.connect();

/*
	var queryImage = 'SELECT picture FROM photos WHERE uid=7';
	conn.query(queryImage,function(err,rows) {
		console.log(rows[0].picture)
	});
*/
	res.render('feed', { name: req.session.user, title: 'SNAPGRAM'});
	
	//var fs = require('fs');

/*	fs.writeFile(__dirname + "/../views/feed.jade",
		"h1 Hey there!",	
		function(err) {
		    if(err) {
		        console.log(err);
		    } else {*/
	//res.render('layout', {  });
		    /*}
		}
	);*/
}

exports.upload = function(req,res) {
	mysql = require('mysql');
	conn = mysql.createConnection({
		host: 'web2.cpsc.ucalgary.ca',
		user: 's513_apsbanva',
		password: '10037085',
		database: 's513_apsbanva'
	});
	conn.connect();

	console.log(req.files.photoFile);
	var type = req.files.photoFile.headers['content-type'];
	if(type=='image/jpeg' || type=='image/png') {
		conn.query('INSERT INTO photos(uid,picture) VALUES((SELECT uid FROM user WHERE username=?),LOAD_FILE(?))',['arzhed',req.files.photoFile.path], function(err,result){
			console.log(err)
			//neat!
		});

	}
	res.render('layout');
}