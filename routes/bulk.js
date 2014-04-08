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
	connectionDB = dbconnection.mySqlConnection('web2.cpsc.ucalgary.ca','s513_simona','10141382','s513_simona');
	mysql = require('mysql');

	//truncate all tables
	var queryString1 = 'TRUNCATE TABLE s513_simona.user';
	var queryString2 = 'TRUNCATE TABLE s513_simona.follows';
	var queryString3 = 'TRUNCATE TABLE s513_simona.photos';

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

	var type = req.headers['content-type'];
	if (type=='application/json'){
		var fs = require('fs-extra');
		var passwordHash = require('password-hash');
		var jsonContent = JSON.parse(JSON.stringify(req.body));

		for(var index2 = 0; index2 < jsonContent.length; index2++){
			(function(index){
				// USER TABLE		
				var uid = jsonContent[index]["id"];
				var username = jsonContent[index]["name"];
				var fname = jsonContent[index]["name"];
				var lname = jsonContent[index]["name"];
				var follows = jsonContent[index]["follows"];

				var password = jsonContent[index]["password"];
				var hashedPassword = passwordHash.generate(password);

				var toInsert =[uid, username, lname, fname, hashedPassword];
				var queryString = 'INSERT INTO user(uid,username,lname,fname,pwd) VALUES(?,?,?,?,?)';

				if(!fs.existsSync(__dirname + '/../public/photos/'+uid)){
					fs.mkdirSync(__dirname + '/../public/photos/'+uid);
				}

				if(!fs.existsSync(__dirname + '/../public/photos/thumbnail/'+uid)){
					fs.mkdirSync(__dirname + '/../public/photos/thumbnail/'+uid);
				}

				connectionDB.query(queryString,toInsert, function(err,result){
					if(err)
						console.log('USERS : ' + err);
					//console.log('index '+index)

					// FOLLOWS TABLE
					for(var j = 0; j < follows.length; j++){
						(function (i,followsLength) {
							var toInsert2 =[uid, follows[i]];
							var queryString2 = 'INSERT INTO follows(follower,followee,start,end) VALUES(?,?,now(),0)';
							connectionDB.query(queryString2,toInsert2, function(err,result){
								if(err)
									console.log('STREAMS : ' + err);
								//console.log('follows.length (index) '+followsLength)
								//console.log('i '+i)
								if(index == jsonContent.length - 1 && i== followsLength - 1) {
									console.log('END of ENDS !!!')
									res.send(200,"users upload successful");
								}
							});
						}(j, follows.length));
					};
				});	
			}(index2))
		}
	}
}

exports.streams = function(req,res){
	//console.log(connectionDB);
	mysql = require('mysql');

	var type = req.headers['content-type'];

	if (type=='application/json'){

		var fs = require('fs-extra');
		var moment = require('moment');

		var jsonContent = JSON.parse(JSON.stringify(req.body));

		for(var index2 = 0; index2 < jsonContent.length; index2++){
			(function(index) {
					// USER TABLE
					var pid = jsonContent[index]["id"];
					var uid = jsonContent[index]["user_id"];
					var path = jsonContent[index]["path"];
					var timestamp = jsonContent[index]["timestamp"];
					var datetime = moment(timestamp).format('YYYY-MM-DD HH:mm:ss');

					var pathSplit = path.split('/');
					var filename = pathSplit[pathSplit.length-1];
					var localPath = 'photos/' + uid +'/'+filename;
					__dirname + '/../public/photos/' + uid +'/'+filename;
					var toInsert =[pid, uid, datetime, localPath];
					var queryString = 'INSERT INTO photos(pid,uid,time_uploaded,path) VALUES(?,?,?,?)';

					if(!fs.existsSync(__dirname + '/../public/photos/'+uid)){
						fs.mkdirSync(__dirname + '/../public/photos/'+uid);
					}
					fs.copy(path, localPath);
					
					connectionDB.query(queryString,toInsert, function(err,result){
						if(err){
							console.log('PHOTOS: ' + err);
						}
						if(index == jsonContent.length - 1) {
							res.send(200,"upload streams successful");
							console.log('upload streams successful');
							connectionDB.end();
						}
					})
			}(index2));
		}
	}
}
