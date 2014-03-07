exports.feed = function(req,res) {
	if (req.session.user == undefined || req.session.pwd == undefined || req.session.uid==undefined){
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
							//+'LIMIT 0,30';
		conn.query(queryImage,[req.session.user,req.session.user], function(err,rows) {
			var feedPhotos = '';
			for(var i=0; i<rows.length; i++) {
				var filePath = 'pictures/' + rows[i].uid +'/'+ rows[i].pid +'.'+ rows[i].type;
				var time = getTimeAgo(rows[i].time_uploaded);
				feedPhotos += '<div class="imgBox">'
							+'<a href="' + filePath + '">'
							+'<img src="' + filePath +'" width = 400 alt="image ici"/></a></br>'
							+'<a href="/users/'+rows[i].uid+'"></br>'
							+rows[i].username+'</a></br>'
							+'<span class="time">'+time+'</span>'+'</div>';
			}
			res.render('feed', { title: 'SNAPGRAM', name: req.session.user, html : feedPhotos});
		});
	}
};

exports.upload = function(req,res) {
	if (req.session.user == undefined || req.session.pwd == undefined || req.session.uid==undefined) {
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
			var user = req.session.user
			var toInsert = [user,extension];
			var queryString = 'INSERT INTO photos(uid,time_uploaded,type) VALUES((SELECT uid FROM user WHERE username=?),now(),?)'
			conn.query(queryString,toInsert, function(err,result){
				if(err)
					console.log(err);
				else {
					fs.copy(req.files.photoFile.path, __dirname + '/../public/pictures/' + req.session.uid +'/'+result.insertId+'.'+ extension);
				}
			});
		}
		res.redirect('/feed');
	}
}

exports.stream = function(req,res) {
	if (req.session.user == undefined || req.session.pwd == undefined || req.session.uid==undefined) {
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
		var followeeUid = parsed[parsed.length-1];

		var followButton = '<a href="/users/'+followeeUid;;

		var attributes = [req.session.uid,followeeUid]
		var unfollowQuery = 'SELECT * FROM follows WHERE follower = ? AND followee = ? ORDER BY end'
		conn.query(unfollowQuery,attributes,function(err,rows){
			console.log('FOLLOWS relation?'+rows[0]+' '+typeof rows[0])
			if(rows[0] != undefined && rows[0].end == '0000-00-00 00:00:00') {
				followButton += '/unfollow"><button class="btn-links" type="submit"><h5>UNFOLLOW</h5></button></a>';
			}
			else {
				followButton += '/follow"><button class="btn-links" type="submit"><h5>FOLLOW</h5></button></a>'
			}
			
		})

		var queryImage = 'SELECT p.pid, u.uid, u.username, p.time_uploaded, p.type '
							+'FROM photos p NATURAL JOIN user u WHERE uid=?'
							+'ORDER BY time_uploaded DESC';
		conn.query(queryImage,[followeeUid], function(err,rows) {
			var feedPhotos = '';
			for(var i=0; i<rows.length; i++) {
				var filePath = '/pictures/' + rows[i].uid +'/'+ rows[i].pid +'.'+ rows[i].type;
				var time = getTimeAgo(rows[i].time_uploaded);
				feedPhotos += '<div class="imgBox">'
							+'<a href="' + filePath + '">'
							+'<img src="' + filePath +'" width = 400 alt="image ici"/></a></br>'
							+'<a href="/users/'+rows[i].uid+'"></br>'
							+rows[i].username+'</a></br>'
							+'<span class="time">'+time+'</span>'+'</div>';
			}
			res.render('feed', {title: 'SNAPGRAM', name: req.session.user, html : feedPhotos, follow:followButton});
		});
	}
};

function getTimeAgo(timestamp) {
	var diff = new Date()-timestamp;

	if(diff< 60000) {
		return 'a few seconds ago';
	}
	else if(diff <3600000) {
		return (Math.floor(diff/1000/60)+' minute(s) ago');
	}
	else if(diff<86400000) {
		return (Math.floor(diff/3600000)+' hour(s) ago');
	}
	else if(diff<3600000*24*31) {
		return Math.floor(diff/86400000)+' day(s) ago';
	}
	else { 
		return 'Posted on '+ older;
	}

}