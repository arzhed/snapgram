exports.bulk = function(req, res){
	if (req.session.user == undefined || req.session.pwd == undefined || req.session.uid==undefined) {
		res.redirect('/');
	}
	else{
		res.render('bulk', {title: 'SNAPGRAM', name: req.session.user})
	}
};

exports.clear = function(req,res){
	mysql = require('mysql');

	conn = mysql.createConnection({
		host: 'web2.cpsc.ucalgary.ca',
		user: 's513_apsbanva',
		password: '10037085',
		database: 's513_apsbanva'
	});

	conn.connect();

	//truncate all tables
}

exports.users = function(req,res){
	mysql = require('mysql');

	conn = mysql.createConnection({
		host: 'web2.cpsc.ucalgary.ca',
		user: 's513_apsbanva',
		password: '10037085',
		database: 's513_apsbanva'
	});

	conn.connect();

	var jsonObj = require('../public/bulkupload/users.json');
	console.log(jsonObj)
	res.redirect('/feed');

}

exports.streams = function(req,res){
	mysql = require('mysql');

	conn = mysql.createConnection({
		host: 'web2.cpsc.ucalgary.ca',
		user: 's513_apsbanva',
		password: '10037085',
		database: 's513_apsbanva'
	});

	conn.connect();

	var jsonObj = require('../public/bulkupload/streams.json');
	console.log(jsonObj)
	res.redirect('/feed');

}