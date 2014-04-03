var sessions = require('./sessionIds');
exports.newPicture = function(req, res){
	if (!(sessions.sessionIds.indexOf(req.cookies.sid) > -1)) {
		res.redirect(302, '/sessions/new');
	}
	else{
		res.render('upload', {title: 'SNAPGRAM', name: req.cookies.user})
	}
};