var assert = require("assert")
var http = require('http')
//var Browser = require("zombie")
//var fs = require('fs')


describe('/sessions/new', function(){
  describe('not logged in', function() {
    it('should redirect from /feed to /sessions/new',function(done){
      var options = {
        host: 'localhost',
        port: 8250,
        path: '/feed',
      };
      var req = http.get(options, function(res) {
        assert.equal(res.statusCode,302)
        assert.equal(res.headers.location,'/sessions/new')
        done()
      });
      req.end()
    })

    it('should redirect from /feed to /sessions/new',function(done){
      var options = {
        host: 'localhost',
        port: 8250,
        path: '/photos/new',
      };
      var req = http.get(options, function(res) {
        assert.equal(res.statusCode,302)
        assert.equal(res.headers.location,'/sessions/new')
        done()
      });
      req.end()
    })

/*
    before(function(){
      this.browser = new Browser({site :'http://localhost:8250', debug: true })
    })
    it('should return the form to log in', function(done){
      Browser.visit('http://localhost:8250/feed', { debug: true, runScripts: false }, function(err,browser){
        console.log('STATUS '+browser.statusCode)
        //console.log(browser.statusCode)
        //console.log(browser.location)

        fs.writeFile("./logTest", browser.resources.dump(), function(err) {
          if(err) {
              console.log(err);
          } else {
              console.log("The file was saved!");
          }
        }); 
      })
    });*/
  })
});

