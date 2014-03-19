
 /*--------------------------------------------------------------------------------

	=============================================================================
	Filename:  
	=============================================================================
	//TODO: file description
-------------------------------------------------------------------------------*/

 function mySqlConnection(host,user,password,database){
	 var mysql = require('mysql') ;
	 var db = mysql.createConnection({
		 host:host,
		 user: user,
		 password: password,
		 database: database

	 });
	db.connect();
	return db;

 }

 exports.mySqlConnection = mySqlConnection;