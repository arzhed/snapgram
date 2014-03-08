
/*
 * GET home page.
 */

exports.index = function(req, res){
	if (req.session.user == undefined || req.session.uid == undefined || req.session.pwd == undefined){
		//res.writeHead(200);
		res.render('index', {title: 'SNAPGRAM'});
	}
	else{
		res.redirect('/feed');
	}
};

exports.formSignUp = function(req,res){
	if (req.session.user == undefined || req.session.uid == undefined || req.session.pwd == undefined){
		var errorMsg = req.session.errorMessage;
		delete req.session.errorMessage;
		//res.set('Status','200');
		//res.writeHead(200);
		//res.status(200);
		//console.log(res.statusCode);
		res.render('signup', {title: 'SNAPGRAM', wrongSignUp: errorMsg });
	}
	else{
		res.redirect('/feed');
	}
};

exports.formSignIn = function(req,res){
	if (req.session.user == undefined || req.session.uid == undefined || req.session.pwd == undefined){
		var errorMsg = req.session.errorMessage;
		delete req.session.errorMessage;
		//res.set('Status','200');
		//res.writeHead(200);
		
		res.render('signin', {title: 'SNAPGRAM', wrongSignIn: errorMsg });
	}
	else{
		res.redirect('/feed');
	}
};