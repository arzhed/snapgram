var sessions = require('./sessionIds');
var dbconnection = require('./dbConnection');
/*
 * GET home page.
 */

exports.index = function(req, res){
	if (sessions.sessionIds.indexOf(req.cookies.sid) < 0){
		//res.writeHead(200);
		res.render('index', {title: 'SNAPGRAM'});
	}
	else{
		res.redirect(302, '/feed');
	}
};

exports.formSignUp = function(req,res){
	if (sessions.sessionIds.indexOf(req.cookies.sid) < 0){
		var errorMsg = req.session.errorMessage;
		delete req.session.errorMessage;
		res.render('signup', {title: 'SNAPGRAM', wrongSignUp: errorMsg });
	}
	else{
		res.redirect(302, '/feed');
	}
};

exports.formSignIn = function(req,res){
	var mysql = require('mysql');
	var conn = dbconnection.mySqlConnection('web2.cpsc.ucalgary.ca','s513_rbesson','10141389','s513_rbesson');

	var uid = req.cookies.uid;
	var pwd = req.cookies.pwd;

	conn.query('SELECT uid, pwd FROM user WHERE uid=? AND pwd=?',[uid,pwd], function(err,result) {
		if(err){
			console.log(err);
  			res.status(500);
			res.redirect('/internalError');
		}
		else if (sessions.sessionIds.indexOf(req.cookies.sid)< 0 || result.length < 1){
			var errorMsg = req.session.errorMessage;
			delete req.session.errorMessage;
			res.render('signin', {title: 'SNAPGRAM', wrongSignIn: errorMsg });
		}
		else{
			res.redirect(302, '/feed');
		}
		conn.end()
	})
};