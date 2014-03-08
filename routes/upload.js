exports.newPicture = function(req, res){
	if (req.session.user == undefined || req.session.pwd == undefined || req.session.uid==undefined) {
		res.redirect('/');
	}
	else{
		res.render('upload', {title: 'SNAPGRAM', name: req.session.user})
	}
};