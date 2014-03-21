var assert = require("assert");
var http = require('http');
var fs = require('fs');
var bulk = require('../routes/bulk');

/*
 app.get('/bulk/clear', bulk.clear);
 app.post('/bulk/users', bulk.users);
 app.post('/bulk/streams', bulk.streams);

//make a function into bulk.js for inserting users into DB
//test for file existing
//test for .json extension
//test for correct structure of the json
//test for error when trying to insert username that already exists
//test for error when trying to follow a uid that does not exist
//test for records well inserted into database
*/

describe("Test for Bulk Upload Functionality", function(){
	/*
	it("Passes if database is updated with users JSON", function(){
		var options = {
			hostname: '127.0.0.1',
			port: 8250,
			path: '/bulk/users?password=:password',
			method: 'POST'
		};


		var req = http.request(options, function(res) {
			//console.log('STATUS: ' + res.statusCode);
			//console.log('HEADERS: ' + JSON.stringify(res.headers));
			res.setEncoding('utf8');
			res.on('data', function (chunk) {
				//console.log('BODY: ' + chunk);
			});
		});
		req.setHeader("Content-Type", "application/json");
		req.on('error', function(e) {
			console.log('problem with request: ' + e.message);
		});

		var content = fs.readFileSync('public/bulk/users.json', 'binary', function (err,data) {
			if (err) {
				return console.log(err);
			}
		});

		req.write(content);
		//console.log(req);
		req.end();
	});
*/
	it("Passes if database is updated with stream JSON", function(){
		var options = {
			hostname: '127.0.0.1',
			port: 8250,
			path: '/bulk/streams?password=:password',
			method: 'POST'
		};

		var req = http.request(options, function(res) {
			res.setEncoding('utf8');
			res.on('data', function (chunk) {
			});
		});
		req.setHeader("Content-Type", "application/json");
		req.on('error', function(e) {
			console.log('problem with request: ' + e.message);
		});

		var content = fs.readFileSync('public/bulk/photos.json', 'binary', function (err,data) {
			if (err) {
				return console.log(err);
			}
		});

		req.write(content);
		//console.log(req);
		req.end();

	});
/*
	it("Passes if database is cleared", function(){
		var options = {
			hostname: '127.0.0.1',
			port: 8250,
			path: '/bulk/clear?password=:password',
			method: 'GET'
		};

		var req = http.request(options, function(res) {
			console.log('STATUS: ' + res.statusCode);
			console.log('HEADERS: ' + JSON.stringify(res.headers));
			res.setEncoding('utf8');
			res.on('data', function (chunk) {
				console.log('BODY: ' + chunk);
			});
		});

		req.on('error', function(e) {
			console.log('problem with request: ' + e.message);
		});

		req.end();
	});
	*/
});