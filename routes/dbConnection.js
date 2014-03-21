
 /*--------------------------------------------------------------------------------

	=============================================================================
	Filename:  
	=============================================================================
	//TODO: file description
-------------------------------------------------------------------------------*/

 function mySqlConnection(host,user,password,database){
	 var mysql = require('mysql') ;
	 //var db = mysql.createConnection({
	 var db = mysql.createConnection({
		 host: host,
		 user: user,
		 password: password,
		 database: database
	 });

	 //db.end();
	 db.connect(function(err){
	 	/*if(err){
	 		if(err.code === 'ENOTFOUND'){
	 			callback('Wrong Host');
	 		} else{
	 			throw err;
	 		}
	 	} else if(err === null) {
	 		callback(db);
	 	}*/
	 	/*if(err){
	 		
	 		console.log(err);
	 		throw err;
	 	}*/
	 });
	 return db;
};

/*var conn = mySqlConnection('web2.cpsc.ucalgary.ca','s513_apsbanva','10037085','s513_apsbanva');
console.log(conn);*/

/*mySqlConnection('web2.cpsc.ucalgary.ca','s513_apsbanva','10037085','s513_apsbanva',function(returnVal){
	console.log(returnVal);
	return;
});*/

var dbconnection = mySqlConnection('web2.cpsc.ucalgary.ca','s513_apsbanva','10037085','s513_apsbanva');

 exports.mySqlConnection = mySqlConnection;