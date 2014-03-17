var assert = require("assert");
var functionTimeAgo = require('../routes/feed');


describe("Test for function calculating difference between date and now", function(){
	it("Passes if timestamp is past", function(){
		var timestamp = new Date("May 21, 2014 11:13:00");

		var actual = functionTimeAgo.getTimeAgo(timestamp);
		var expected = "Timestamp in the future!??";

		assert.notEqual(actual, expected);
	});
});