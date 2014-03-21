exports.internalError = function(req,res){
	res.status(500);
	res.render('500', {title: 'SNAPGRAM'});
}