var assert = require("assert");
var myconn = require('../routes/dbConnection');



describe("Test if the parameters passed to the function are correct so connction can be created ", function(){
	it("Passes if returns wrong host error message", function(){
		var dbconnection = myconn.mySqlConnection("whatever","s513_apsbanva","10037085","s513_apsbanva");
		var actual = dbconnection;
		var expected = 'Wrong Host';
		//console.log(actual);
		assert.equal(actual,expected);

		}
	);

});
