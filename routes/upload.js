var sessions = require('./sessionIds');
exports.newPicture = function(req, res){
	if (!(sessions.sessionIds.indexOf(req.session.sessionId) > -1)) {
		res.redirect('/');
	}
	else{
		res.render('upload', {title: 'SNAPGRAM', name: req.session.user})
	}
};