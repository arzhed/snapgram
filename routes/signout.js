var sessions = require('./sessionIds');

exports.signout = function(req, res){
	var index = sessions.sessionIds.indexOf(req.cookies.sid);
	sessions.sessionIds.splice(index,1);
	//console.log(sessions.sessionIds);
	//res.clearCookie('user');
	//res.clearCookie('uid');
	//res.clearCookie('pwd');
	res.clearCookie('sid');
	res.redirect('/');
};