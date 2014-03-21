var request = require("supertest");
var should = require('should');
var myconn = require('../routes/dbConnection');


describe('Routing', function() {
	var url = 'http://localhost:8250';
	// within before() you can run all the operations that are needed to setup your tests. In this case
	// I want to create a connection with the database, and when I'm done, I call done().
	before(function(done) {
		// In our tests we use the test db
		conn = myconn.mySqlConnection('web2.cpsc.ucalgary.ca','s513_apsbanva','10037085','s513_apsbanva');
		done();
		conn.end();
	});

	// use describe to give a title to your test suite, in this case the tile is "Account"
	// and then specify a function in which we are going to declare all the tests
	// we want to run. Each test starts with the function it() and as a first argument
	// we have to provide a meaningful title for it, whereas as the second argument we
	// specify a function that takes a single parameter, "done", that we will use
	// to specify when our test is completed, and that's what makes easy
	// to perform async test!
	describe('Account', function() {
		it('should return error if trying to save duplicated username', function(done) {
			var profile = {
				username:'prmoreira',
				lname:'Moreira',
				fname:'Paulo',
				password:'123456'

			};
			// once we have specified the info we want to send to the server via POST verb,
			// we need to actually perform the action on the resource, in this case we want to
			// POST on /api/profiles and we want to send some info
			// We do this using the request object, requiring supertest!
			request(url)
				.post('./routes/user')
				.send(profile)
				// end handles the response
				.end(function(err, res) {
					if (err) {
						throw err;
					}
					// this is should.js syntax, very clear
					res.should.have.status(200);
					done();
				});
		});



		it('should sign in', function(done) {
			var profile = {
				username:'prmoreira',
				password:'123456',
			};
			// once we have specified the info we want to send to the server via POST verb,
			// we need to actually perform the action on the resource, in this case we want to
			// POST on /api/profiles and we want to send some info
			// We do this using the request object, requiring supertest!
			request(url)
				.post('./routes/signin')
				.send(profile)
				// end handles the response
				.end(function(err, res) {
					if (err) {
						throw err;
					}
					// this is should.js syntax, very clear
					res.should.have.status(302);
					console.log("yea");
					done();
				});
		});



	});

})