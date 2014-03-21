exports.notFound = function(req, res){
	res.status(404);
	res.render('404', {title: 'SNAPGRAM'});

};
