var sessions = require('./sessionIds');
var dbconnection = require('./dbConnection');

exports.bulk = function(req, res){
	if (!(sessions.sessionIds.indexOf(req.session.sessionId) > -1)) {
		res.redirect('/sessions/new');
	}
	else{
		res.render('bulk', {title: 'SNAPGRAM', name: req.session.user})
	}
};


exports.clear = function(req,res){

	mysql = require('mysql');

	var conn = dbconnection.mySqlConnection('web2.cpsc.ucalgary.ca','s513_simona','10141382','s513_simona');

	//truncate all tables
	var queryString1 = 'TRUNCATE TABLE s513_apsbanva.user';
	var queryString2 = 'TRUNCATE TABLE s513_apsbanva.follows';
	var queryString3 = 'TRUNCATE TABLE s513_apsbanva.photos';

	conn.query(queryString1, function(err,result){
		if(err){
			console.log(err);
            res.status(500);
			res.redirect('/internalError');
		}
	});

	conn.query(queryString2, function(err,result){
		if(err){
			console.log(err);
            res.status(500);
			res.redirect('/internalError');
		}
	});

	conn.query(queryString3, function(err,result){
		if(err){
			console.log(err);
            res.status(500);
			res.redirect('/internalError');
		}
		conn.end();
	});
}

exports.users = function(req,res){

	mysql = require('mysql');

	var conn = dbconnection.mySqlConnection('web2.cpsc.ucalgary.ca','s513_simona','10141382','s513_simona');

	var type = req.headers['content-type'];
	if (type=='application/json'){

		var passwordHash = require('password-hash');

		var jsonContent = JSON.parse(JSON.stringify(req.body));

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

			if(!fs.existsSync(__dirname + '/../public/pictures/'+uid)){
				fs.mkdirSync(__dirname + '/../public/pictures/'+uid);
			}

			conn.query(queryString,toInsert, function(err,result){
				if(err){
					console.log(err);
				}
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
		conn.end();
		res.redirect('/feed');
	}

}

exports.streams = function(req,res){

	mysql = require('mysql');

	var conn = dbconnection.mySqlConnection('web2.cpsc.ucalgary.ca','s513_simona','10141382','s513_simona');

	var type = req.headers['content-type'];

	if (type=='application/json'){

		var fs = require('fs-extra');
		var moment = require('moment');

		var jsonContent = JSON.parse(JSON.stringify(req.body));

		var index;

		for(index = 0; index < jsonContent.length; index++){

			// USER TABLE
			var pid = jsonContent[index]["id"];
			var uid = jsonContent[index]["user_id"];
			var path = jsonContent[index]["path"];
			var timestamp = jsonContent[index]["timestamp"];
			var datetime = moment(timestamp).format('YYYY-MM-DD HH:mm:ss');

			var pathSplit = path.split('/');
			var filename = pathSplit[pathSplit.length-1];
			var localPath = 'pictures/' + uid +'/'+filename;
			__dirname + '/../public/pictures/' + uid +'/'+filename;
			var toInsert =[pid, uid, datetime, localPath];
			var queryString = 'INSERT INTO photos(pid,uid,time_uploaded,path) VALUES(?,?,?,?)';

			if(!fs.existsSync(__dirname + '/../public/pictures/'+uid)){
				fs.mkdirSync(__dirname + '/../public/pictures/'+uid);
			}
			fs.copy(path, localPath);

			conn.query(queryString,toInsert, function(err,result){
				if(err){
					console.log(err);
				}
			});

		}
		conn.end();
		res.redirect('/feed');
	}
}