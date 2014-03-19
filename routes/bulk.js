var sessions = require('./sessionIds');
var dbconnection = require('./dbConnection');

exports.bulk = function(req, res){
	if (!(sessions.sessionIds.indexOf(req.session.sessionId) > -1)) {
		res.redirect('/');
	}
	else{
		res.render('bulk', {title: 'SNAPGRAM', name: req.session.user})
	}
};


exports.clear = function(req,res){
	mysql = require('mysql');

	var conn = dbconnection.mySqlConnection('web2.cpsc.ucalgary.ca','s513_apsbanva','10037085','s513_apsbanva');

	//truncate all tables
	var queryString1 = 'TRUNCATE TABLE s513_apsbanva.user';
	var queryString2 = 'TRUNCATE TABLE s513_apsbanva.follows';
	var queryString3 = 'TRUNCATE TABLE s513_apsbanva.photos';

	conn.query(queryString1, function(err,result){
		if(err)
			console.log(err);
	});

	conn.query(queryString2, function(err,result){
		if(err)
			console.log(err);
	});

	conn.query(queryString3, function(err,result){
		if(err)
			console.log(err);
	});

	conn.end();

}

exports.users = function(req,res){
	mysql = require('mysql');

	var conn = dbconnection.mySqlConnection('web2.cpsc.ucalgary.ca','s513_apsbanva','10037085','s513_apsbanva');

	var type = req.files.usersInput.headers['content-type'];

	if (type=='application/json'){

		var passwordHash = require('password-hash');
		var fs = require('fs');
		var content = fs.readFileSync(req.files.usersInput.path, 'binary', function (err,data) {
			if (err) {
				return console.log(err);
			}
		});

		var jsonContent = JSON.parse(content)["user"];
		var index;
		for(index = 0; index < jsonContent.length; index++){

			// USER TABLE
			var id = jsonContent[index]["id"];
			var username = jsonContent[index]["name"];
			var fname = jsonContent[index]["name"];
			var lname = jsonContent[index]["name"];

			var password = jsonContent[index]["password"];
			var hashedPassword = passwordHash.generate(password);

			var toInsert =[id, username, lname, fname, hashedPassword];
			var queryString = 'INSERT INTO user(uid,username,lname,fname,pwd) VALUES(?,?,?,?,?)';

			conn.query(queryString,toInsert, function(err,result){
				if(err)
					console.log(err);
			});

			// FOLLOWS TABLE
			var follows = jsonContent[index]["follows"];
			var i, j;

			for(i = 0; i < follows.length; i++){
				var toInsert =[id, follows[i]];
				var queryString = 'INSERT INTO follows(follower,followee,start,end) VALUES(?,?,now(),0)';
				conn.query(queryString,toInsert, function(err,result){
					if(err)
						console.log(err);
				});
			}
		}

	}
	conn.end();
	res.redirect('/feed');
}

exports.streams = function(req,res){
	mysql = require('mysql');

	var conn = dbconnection.mySqlConnection('web2.cpsc.ucalgary.ca','s513_apsbanva','10037085','s513_apsbanva');

	var type = req.files.streamsInput.headers['content-type'];

	if (type=='application/json'){
		var moment = require('moment');
		var fs = require('fs');
		var content = fs.readFileSync(req.files.streamsInput.path, 'binary', function (err,data) {
			if (err) {
				return console.log(err);
			}
		});

		var jsonContent = JSON.parse(content)["photos"];
		var index;
		for(index = 0; index < jsonContent.length; index++){

			// USER TABLE
			var pid = jsonContent[index]["id"];
			var uid = jsonContent[index]["user_id"];
			var type = jsonContent[index]["path"].split('.')[1];
			var timestamp = jsonContent[index]["timestamp"];
			var datetime = moment.unix(timestamp).format('YYYY-MM-DD HH:mm:ss');

			var toInsert =[pid, uid, datetime, type];
			var queryString = 'INSERT INTO photos(pid,uid,time_uploaded,type) VALUES(?,?,?,?)';

			conn.query(queryString,toInsert, function(err,result){
				if(err)
					console.log(err);
			});

		}
	}
	conn.end();
	res.redirect('/feed');
}