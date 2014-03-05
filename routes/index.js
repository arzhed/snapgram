
/*
 * GET home page.
 */

exports.index = function(req, res){
	if (req.session.user == undefined || req.session.pass == undefined){
		res.render('index', { title: 'SNAPGRAM' });
	}
	else{
		res.redirect('/feed')
	}
};
