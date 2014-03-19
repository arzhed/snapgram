var assert = require("assert");
var functionTimeAgo = require('../routes/feed');


describe("Test for function calculating difference between date and now", function(){
	it("Passes if timestamp is past", function(){
		var timestamp = new Date("2014-01-15 16:24:33");


		var actual = functionTimeAgo.getTimeAgo(new Date(), timestamp);
		var expected = "Timestamp in the future!";

		assert.notEqual(actual, expected);
	});

	it("Passes if fixedDate's format is as expected (passing a timestamp more than 31 days ago)", function(){
		var timestamp = new Date("2014-01-15 16:24:33");
		var result = functionTimeAgo.getTimeAgo(new Date(), timestamp);
		
		var dateReturned = result.split(' ')[2];
		var regexpDateFormat = /^[0-9]{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])/;
		var actual = regexpDateFormat.test(dateReturned);
		var expected = true;
		assert.equal(actual, expected);
	});

	it("Passes if returns a few seconds ago when the 2 dates have less than 60 seconds difference", function(){
		var actualDate = new Date("2014-03-17 16:24:00");
		//timestamp with 59 secs difference:
		var timestamp1min = new Date("2014-03-17 16:23:01");

		//timestamp equal to actualDate:
		var timestampEq = new Date("2014-03-17 16:24:00");

		var actual1min = functionTimeAgo.getTimeAgo(actualDate, timestamp1min);
		var actualEq = functionTimeAgo.getTimeAgo(actualDate, timestampEq);
		var expected = 'a few seconds ago';

		assert.equal(actualEq, expected);
		assert.equal(actual1min, expected);
	});

	it("Passes if returns the right number of minutes for two dates having less than 60 minutes difference, and more than 59 seconds", function(){
		var actualDate = new Date("2014-03-17 16:24:00");
		//timestamp with 1 minute difference:
		var timestamp1min = new Date("2014-03-17 16:23:00");

		//timestamp with 59 minutes difference:
		var timestamp59min = new Date("2014-03-17 15:24:01");

		var diff1min = actualDate - timestamp1min;
		var diff59min = actualDate - timestamp59min;

		var actual1min = functionTimeAgo.getTimeAgo(actualDate, timestamp1min);
		var expected1min = Math.floor(diff1min/1000/60)+' minute(s) ago';

		var actual59min = functionTimeAgo.getTimeAgo(actualDate, timestamp59min);
		var expected59min = Math.floor(diff59min/1000/60)+' minute(s) ago';

		assert.equal(actual1min, expected1min);
		assert.equal(actual59min, expected59min);
	});

	it("Passes if returns the right number of hours for two dates having less than 24 hours, and 60 minutes or more difference", function(){
		var actualDate = new Date("2014-03-17 16:24:00");
		//timestamp with 1 hours difference:
		var timestamp1hr = new Date("2014-03-17 13:24:00");

		//timestamp with less than 24 hours difference:
		var timestamp23hr = new Date("2014-03-16 16:24:01");

		var diff1hr = actualDate - timestamp1hr;
		var diff23hr = actualDate - timestamp23hr;

		var actual1hr = functionTimeAgo.getTimeAgo(actualDate, timestamp1hr);
		var expected1hr = Math.floor(diff1hr/3600000)+' hour(s) ago';

		var actual23hr = functionTimeAgo.getTimeAgo(actualDate, timestamp23hr);
		var expected23hr = Math.floor(diff23hr/3600000)+' hour(s) ago';

		assert.equal(actual1hr, expected1hr);
		assert.equal(actual23hr, expected23hr);
	});

	it("Passes if returns the right number of days for two dates having a 24 hours or more, and less than 31 days difference", function(){
		var actualDate = new Date("2014-03-17 16:24:00");
		//timestamp with 1 day difference:
		var timestamp1d = new Date("2014-03-16 16:24:00");

		//timestamp with less than 31 day difference (taking in account the time changing on Sunday, march 9th)
		var timestamp31d = new Date("2014-02-14 15:24:01");

		var diff1d = actualDate - timestamp1d;
		var diff31d = actualDate - timestamp31d;

		var actual1d = functionTimeAgo.getTimeAgo(actualDate, timestamp1d);
		var expected1d = Math.floor(diff1d/86400000)+' day(s) ago';

		var actual31d = functionTimeAgo.getTimeAgo(actualDate, timestamp31d);
		var expected31d = Math.floor(diff31d/86400000)+' day(s) ago';
		console.log(actual31d);

		assert.equal(actual1d, expected1d);
		assert.equal(actual31d,expected31d);
	});
});