
/*
 * GET home page.
 */

exports.index = function(req, res){
	if (req.session.user == undefined || req.session.uid == undefined || req.session.pwd == undefined){
		res.render('index', {title : 'SNAPGRAM'})
	}
	else{
		res.redirect('/feed');
	}
};

exports.formSignUp = function(req,res){
	if (req.session.user == undefined || req.session.uid == undefined || req.session.pwd == undefined){
		res.render('signup', {title: 'SNAPGRAM'});
	}
	else{
		res.redirect('/feed');
	}
}