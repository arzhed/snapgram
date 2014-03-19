
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
	db.connect(function(err){
		console.log(err);
		if (err.errno === 'ENOTFOUND'){
			return 'Wrong Host';
		}
	});
	return db;

 }
 var dbconnection = mySqlConnection('whatever','s513_apsbanva','10037085','s513_apsbanva');
 exports.mySqlConnection = mySqlConnection;