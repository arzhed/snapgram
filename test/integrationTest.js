var assert = require("assert");
var http = require('http');
var Browser = require("zombie")

//RUN TEST WITH:
//$ mocha --timeout 10000 integrationTest.js
//Because the test takes in average 2s to run

describe('Integration testing', function() {
	before(function(){
      this.browser = new Browser();
    })
	it('Test a scenario where a user logs in, upload picture and check that redirected to feed where new picture is displayed', function(done) {
		var browser = this.browser;
		browser.visit('http://localhost:8250/sessions/new',  function(err){
	        browser.fill('uname','prmoreira')
	          	.fill('pwd','123456')
	          	.pressButton('signinButton',function(){
	            	assert.equal(browser.statusCode,200);
					assert.equal(browser.location.pathname,'/feed');
					browser.visit('http://localhost:8250/photos/new',  function(){
          				assert.equal(browser.statusCode,200);
          				assert.equal(browser.location.pathname,'/photos/new');
          				console.log('DIRNAME '+__dirname)
          				browser.attach('photoFile', __dirname+'/integrationTest.jpg')
          					.pressButton('uploadButton', function(){
          						assert.equal(browser.statusCode,200)
	      						assert.equal(browser.location.pathname,'/feed')
          						assert(browser.html('.imgBox').match(/<img src=\"pictures\/101\/integrationTest\.jpg\" width=\"400\" alt=\"image ici\" \/><\/a><br \/><a href=\"101\"><br \/>prmoreira<\/a><br \/><span class=\"time\">a few seconds ago<\/span>/))
	      						done();
      						})
          			});
				});
		});

	});

})