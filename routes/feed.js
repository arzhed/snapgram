exports.feed = function(req,res) {
	if (req.session.user == undefined || req.session.pass == undefined){
		res.redirect('/');
	}
	else {
		mysql = require('mysql');
		conn = mysql.createConnection({
			host: 'web2.cpsc.ucalgary.ca',
			user: 's513_apsbanva',
			password: '10037085',
			database: 's513_apsbanva'
		});
		conn.connect();

		var queryImage = 'SELECT p.pid, u.uid, u.username, p.time_uploaded, p.type '
							+'FROM photos p NATURAL JOIN user u WHERE username=? '
							+'UNION '
							+'SELECT p.pid, f.followee, b.username, p.time_uploaded, p.type '
							+'FROM follows f '
							+'JOIN user a ON f.follower = a.uid '
							+'JOIN user b ON f.followee = b.uid '
							+'JOIN photos p ON f.followee = p.uid '
							+'WHERE a.username=?'
							+'ORDER BY time_uploaded DESC';
		conn.query(queryImage,[req.session.user,req.session.user], function(err,rows) {	
			console.log('queryString')	
			var feedPhotos = '';
			console.log(rows)
			for(var i=0; i<rows.length; i++) {
				var filePath = 'pictures/' + rows[i].uid +'/'+ rows[i].pid +'.'+ rows[i].type;
				feedPhotos += '<div class="imag">'
							+'<a href="' + filePath + '">'
							+'<img src="' + filePath +'" width = 200 alt="image ici"/></a></br>'
							+'<a href="/users/'+rows[i].uid+'">'
							+rows[i].username+'</a></div>';				
			}
			res.render('feed', { name: req.session.user, html : feedPhotos});
		});
	}
}

exports.upload = function(req,res) {
	if (req.session.user == undefined || req.session.pass == undefined){
		res.redirect('/');
	}
	else {
		mysql = require('mysql');
		conn = mysql.createConnection({
			host: 'web2.cpsc.ucalgary.ca',
			user: 's513_apsbanva',
			password: '10037085',
			database: 's513_apsbanva'
		});
		conn.connect();

		var fs= require('fs-extra') //FIRST: $npm install fs-extra

		var type = req.files.photoFile.headers['content-type'];
		var extension = type.split('/')[1]
		if(type=='image/jpeg' || type=='image/png') {
			var date_time = new Date().toISOString().slice(0, 19).replace('T', ' ');
			console.log('FILE: '+req.files.photoFile)
			console.log('PATH: '+req.files.photoFile.path)
			var user = req.session.user
			var toInsert = [user,extension];
			var queryString = 'INSERT INTO photos(uid,time_uploaded,type) VALUES((SELECT uid FROM user WHERE username=?),now(),?)'
			conn.query(queryString,toInsert, function(err,result){
				if(err)
					console.log(err)
				else {
					fs.copy(req.files.photoFile.path, __dirname + '/../pictures/' + user +'/'+result.insertId+'.'+ extension)
				}
			});

		}
		res.redirect('/feed');
	}
}

exports.stream = function(req,res) {
	if (req.session.user == undefined || req.session.pass == undefined){
		res.redirect('/');
	}
	else {
		mysql = require('mysql');
		conn = mysql.createConnection({
			host: 'web2.cpsc.ucalgary.ca',
			user: 's513_apsbanva',
			password: '10037085',
			database: 's513_apsbanva'
		});
		conn.connect();

		var parsed = req.url.split('/')
		var uid = parsed[parsed.length-1]

		var queryImage = 'SELECT p.pid, u.uid, u.username, p.time_uploaded, p.type '
							+'FROM photos p NATURAL JOIN user u WHERE uid=?';
		conn.query(queryImage,[uid], function(err,rows) {		
			var feedPhotos = '';
			for(var i=0; i<rows.length; i++) {
				var filePath = '/pictures/' + rows[i].uid +'/'+ rows[i].pid +'.'+ rows[i].type;
				feedPhotos += '<div class="imag">'
							+'<a href="' + filePath + '">'
							+'<img src="' + filePath +'" width = 200 alt="image ici"/></a></br>'
							+'<a href="/users/'+rows[i].uid+'">'
							+rows[i].username+'</a></div>';				
			}
			res.render('layout', { name: req.session.user, html : feedPhotos});
		});
	}
}