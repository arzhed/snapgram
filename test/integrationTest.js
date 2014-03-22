var assert = require("assert");
var http = require('http');
var Browser = require("zombie")
var browser = new Browser();

//RUN TEST WITH:
//$ mocha --timeout 10000 integrationTest.js
//Because the test takes in average 2s to run

describe('Integration testing', function() {
	it('Test a scenario where an user log in, upload picture and visit users page', function(done) {

		// load server and redirect it to new session
		var options = {
			host: 'localhost',
			port: 8250,
			path: '/sessions/new'
		};
		var reqFormSignIn = http.get(options, function(res) {
			assert.equal(res.statusCode,200);
			assert.equal(res.location,undefined);

			var uname = "uname: prmoreira";
			var pwd = "pwd: 123456";

			var optionsLogIn = {
				host: 'localhost',
				port: 8250,
				path: '/sessions/create',
				method: 'POST',
				body: "uname=prmoreira,pwd=123456"
			};
			browser.visit('http://localhost:8250/sessions/new',  function(err){
		        browser.fill('uname','prmoreira')
		          	.fill('pwd','123456')
		          	.pressButton('signinButton',function(){
		            	assert.equal(browser.statusCode,200);
						assert.equal(browser.location.pathname,'/feed');
						browser.visit('http://localhost:8250/users',  function(){
              				assert.equal(browser.statusCode,200);
              				assert.equal(browser.location.pathname,'/users');
              				done();
              			});
					});
			});

		});
		reqFormSignIn.end()
	});

})