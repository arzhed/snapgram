var http = require('http');
var fs = require('fs');

var bulkScript = function() {
		var options1 = {
			hostname: '127.0.0.1',
			port: 8250,
			path: '/bulk/clear?password=:password',
			method: 'GET'
		};

		var req1 = http.request(options1, function(res1) {
			console.log('STATUS: ' + res1.statusCode);
			console.log('HEADERS: ' + JSON.stringify(res1.headers));
			res1.setEncoding('utf8');
			res1.on('data', function (chunk) {
				console.log('BODY: ' + chunk);
			});
		});

		req1.on('error', function(e) {
			console.log('problem with request: ' + e.message);
		});

		req1.end();
		console.log('clear finished');

	/*


		var options2 = {
			hostname: '127.0.0.1',
			port: 8250,
			path: '/bulk/users?password=:password',
			method: 'POST'
		};


		var req2 = http.request(options2, function(res2) {
			res2.setEncoding('utf8');
			res2.on('data', function (chunk) {
			});
		});
		req2.setHeader("Content-Type", "application/json");
		req2.on('error', function(e) {
			console.log('problem with request: ' + e.message);
		});

		var content2 = fs.readFileSync('../bulk/users.json', 'binary', function (err,data) {
			if (err) {
				return console.log(err);
			}
		});

		req2.write(content2);
		req2.end();
		console.log('users finished');

*/

/*

		var options3 = {
			hostname: '127.0.0.1',
			port: 8250,
			path: '/bulk/streams?password=:password',
			method: 'POST'
		};

		var req3 = http.request(options3, function(res3) {
			res3.setEncoding('utf8');
			res3.on('data', function (chunk) {
			});
		});
		req3.setHeader("Content-Type", "application/json");
		req3.on('error', function(e) {
			console.log('problem with request: ' + e.message);
		});

		var content3 = fs.readFileSync('../bulk/photos.json', 'binary', function (err,data) {
			if (err) {
				return console.log(err);
			}
		});

		req3.write(content3);
		req3.end();
		console.log('photos finished');
*/
}
bulkScript();