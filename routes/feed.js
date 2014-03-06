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
			res.render('feed', { title: 'SNAPGRAM', name: req.session.user, html : feedPhotos});
		});
	}
};

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

		var parsed = req.url.split('/');
		var uid = parsed[parsed.length-1];

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
			res.render('feed', {title: 'SNAPGRAM', name: req.session.user, html : feedPhotos});
		});
	}
};