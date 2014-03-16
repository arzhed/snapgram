var assert = require("assert");
var functionTimeAgo = require('../routes/feed');


describe("Test for function calculating difference between date and now", function(){
	it("test for shit", function(){
		var timestamp = new Date("October 13, 1975 11:13:00");
		console.log(timestamp);
		console.log(functionTimeAgo.getTimeAgo(timestamp));
	});
});