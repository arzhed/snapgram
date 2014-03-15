var assert = require("assert");
var feed = require('../routes/feed');
var file = require('fs');

var request = file.readFileSync('./requestImgUpload.txt', 'binary', function (err,data) {
			if (err) {
				return console.log(err);
			}
		});

var brokeRequest = request.split('\n');

console.log(brokeRequest);
 describe("User Bulk Upload testing", function (){

 	it("Fails if the file does not exist", function(){
 		
 	});
 });