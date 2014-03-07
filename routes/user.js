
/*
 * GET users listing.
 */

exports.list = function(req, res){
  if (req.session.user == undefined || req.session.pwd == undefined || req.session.uid==undefined) {
		res.redirect('/');
	}
	else {
		mysql = require('mysql');
		conn = mysql.createConnection({
			host: 'web2.cpsc.ucalgary.ca',
			user: 's513_apsbanva',
			password: '10037085',
			database: 's513_apsbanva'
		});
		conn.connect();


		var queryImage = 'SELECT username, uid FROM user';
		conn.query(queryImage, function(err,rows) {
			var userList = '';
			for(var i=0;i<rows.length;i++){
				userList += '<a href="/users/' + rows[i].uid
							+'">'+rows[i].username +'</a></br>';
			}
			res.render('feed', {html : userList})
		});
	}
};