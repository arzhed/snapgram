exports.feed = function(req,res) {
	res.render('feed', { name: req.session.user});
	
	/*var fs = require('fs');

	fs.writeFile(__dirname + "/../views/feed.jade",
		"h1 Hey there!",	
		function(err) {
		    if(err) {
		        console.log(err);
		    } else {
		        res.render('layout');
		    }
		}
	);*/
}