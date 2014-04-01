
 function mySqlConnection(host,user,password,database){
	 var mysql = require('mysql') ;
	 //var db = mysql.createConnection({
	 var db = mysql.createConnection({
		 host: host,
		 user: user,
		 password: password,
		 database: database,
		 connectTimeout: 300000,
		 globalTimeout: 300000
	 });

	 db.connect(function(err){

	 });
	 return db;
};


 exports.mySqlConnection = mySqlConnection;