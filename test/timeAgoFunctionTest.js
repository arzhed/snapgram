var assert = require("assert");
var functionTimeAgo = require('../routes/feed');


describe("Test for function calculating difference between date and now", function(){
	it("Passes if timestamp is past", function(){
		var timestamp = new Date("2014-01-15 16:24:33");


		var actual = functionTimeAgo.getTimeAgo(timestamp);
		console.log(actual);
		var expected = "Timestamp in the future!";

		assert.notEqual(actual, expected);
	});

	it("Passes if fixedDate's format is as expected (passing a timestamp more than 31 days ago)", function(){
		var timestamp = new Date("2014-01-15 16:24:33");
		var result = functionTimeAgo.getTimeAgo(timestamp);
		
		var dateReturned = result.split(' ')[2];
		console.log(dateReturned);
		var regexpDateFormat = /^[0-9]{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])/;
		var actual = regexpDateFormat.test(dateReturned);
		var expected = true;
		assert.equal(actual, expected);
	});

	it("Passes if the number of seconds ", function(){
		
	});
});