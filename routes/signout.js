exports.signout = function(req, res){
	delete req.session.user;
	delete req.session.uid;
	delete req.session.pwd;
	res.redirect('/');
};