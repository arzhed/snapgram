var sessions = require('./sessionIds');

exports.signout = function(req, res){
	var index = sessions.sessionIds.indexOf(req.session.sessionId);
	sessions.sessionIds.splice(index,1);
	console.log(sessions.sessionIds);
	delete req.session.user;
	delete req.session.uid;
	res.redirect('/');
};