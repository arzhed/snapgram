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
	if (sessions.sessionIds.indexOf(req.cookies.sid) < 0){
		var errorMsg = req.session.errorMessage;
		delete req.session.errorMessage;
		res.render('signin', {title: 'SNAPGRAM', wrongSignUp: errorMsg });
	}
	else{
		res.redirect(302, '/feed');
	}
};