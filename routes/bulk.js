var sessions = require('./sessionIds');
var dbconnection = require('./dbConnection');
var connectionDB;

exports.bulk = function(req, res){
	if (!(sessions.sessionIds.indexOf(req.cookies.sid) > -1)) {
		res.redirect('/sessions/new');
	}
	else{
		res.render('bulk', {title: 'SNAPGRAM', name: req.cookies.user})
	}
};

exports.clear = function(req,res){
	connectionDB = dbconnection.mySqlConnection('web2.cpsc.ucalgary.ca','s513_rbesson','10141389','s513_rbesson');
	mysql = require('mysql');

	//var conn = dbconnection.mySqlConnection('web2.cpsc.ucalgary.ca','s513_rbesson','10141389','s513_rbesson');

	//truncate all tables
	var queryString1 = 'TRUNCATE TABLE s513_rbesson.user';
	var queryString2 = 'TRUNCATE TABLE s513_rbesson.follows';
	var queryString3 = 'TRUNCATE TABLE s513_rbesson.photos';

	connectionDB.query(queryString1, function(err,result){
		if(err){
			console.log(err);
            res.status(500);
			res.redirect('/internalError');
		} else {
			connectionDB.query(queryString2, function(err,result){
				if(err){
					console.log(err);
		            res.status(500);
					res.redirect('/internalError');
				} else {
					connectionDB.query(queryString3, function(err,result){
						if(err){
							console.log(err);
				            res.status(500);
							res.redirect('/internalError');
						} else {
							console.log('clear successful');
							//conn.end();
							res.send(200,"DB Cleared");
						}
					});
				}
			});
		}
	});
}

exports.users = function(req,res){
	mysql = require('mysql');

	//var conn = dbconnection.mySqlConnection('web2.cpsc.ucalgary.ca','s513_rbesson','10141389','s513_rbesson');

	var type = req.headers['content-type'];
	if (type=='application/json'){
		var fs = require('fs-extra');
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

			if(!fs.existsSync(__dirname + '/../public/pictures/'+id)){
				fs.mkdirSync(__dirname + '/../public/pictures/'+id);
			}
			//console.log("INSERT INTO user(uid,username,lname,fname,pwd) VALUES(" + id + ",'" + username + "','" + lname + "','" + fname + "','" + hashedPassword + "'");
			connectionDB.query(queryString,toInsert, function(err,result, fields){
				//console.log('inserted: ' + result.insertId);
				if(err){
					console.log('USERS : ' + err);
				} else{
					var insertId = result.insertId;
					var follows = jsonContent[insertId - 1]["follows"];
					var i;
					for(i = 0; i < follows.length; i++){
						var queryString = 'INSERT INTO follows(follower,followee,start,end) VALUES(?,?,now(),0)';
						var toInsert =[insertId, follows[i]];
						connectionDB.query(queryString,toInsert, function(err,rows, fields){
							if(err){
								console.log('FOLLOWS : ' + err);
							}
							else{
								if(insertId === 100){
									res.send(200,"users upload successful");
								}
							}
						});
					}
				}
			});
		}
		console.log('upload users successful');
	}
}

exports.streams = function(req,res){
	//console.log(connectionDB);
	mysql = require('mysql');

	//var conn = dbconnection.mySqlConnection('web2.cpsc.ucalgary.ca','s513_rbesson','10141389','s513_rbesson');

	var type = req.headers['content-type'];

	if (type=='application/json'){

		var fs = require('fs-extra');
		var moment = require('moment');

		var jsonContent = JSON.parse(JSON.stringify(req.body));

		var index;

		for(index = 0; index < jsonContent.length; index++){

			// USER TABLE
			var pid = jsonContent[index]["id"];
			pid += 1;
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
			//console.log('id: ' + pid + ' uid : '+ uid + ' date: ' + datetime + ' localPath : ' + localPath);
			connectionDB.query(queryString,toInsert, function(err,result){
				if(err){
					console.log('PHOTOS : ' + err);
				} else {
					if(result.insertId === 500){
						res.send(200,"upload streams successful");
						console.log('upload streams successful');
					}
				}
			});

		}
		connectionDB.end();
	}
}