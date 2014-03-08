exports.internalError = function(req,res){
	res.render('500', {title: 'SNAPGRAM'});
}