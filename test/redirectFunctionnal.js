var assert = require("assert")
var http = require('http')
var Browser = require("zombie")
//var fs = require('fs')
var browser = new Browser();


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

    it('should redirect from /photos/new to /sessions/new',function(done){
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

    it('should redirect from /users/1 to /sessions/new',function(done){
      var options = {
        host: 'localhost',
        port: 8250,
        path: '/users/1',
      };
      var req = http.get(options, function(res) {
        assert.equal(res.statusCode,302)
        assert.equal(res.headers.location,'/sessions/new')
        done()
      });
      req.end()
    })

    it('should redirect from /users/200/follow to /sessions/new',function(done){
      var options = {
        host: 'localhost',
        port: 8250,
        path: '/users/200/follow',
      };
      var req = http.get(options, function(res) {
        assert.equal(res.statusCode,302)
        assert.equal(res.headers.location,'/sessions/new')
        done()
      });
      req.end()
    })

    it('should redirect from /users/3000/unfollow to /sessions/new',function(done){
      var options = {
        host: 'localhost',
        port: 8250,
        path: '/users/3000/unfollow',
      };
      var req = http.get(options, function(res) {
        assert.equal(res.statusCode,302)
        assert.equal(res.headers.location,'/sessions/new')
        done()
      });
      req.end()
    })


    before(function(){
      //this.browser = new Browser()
    })

    it('should sign in, be redirected "/feed", then "GET /users" and not be redirected', function(done){
      browser.visit('http://localhost:8250/sessions/new',  function(err){
        console.log('STATUS '+browser.statusCode)
        console.log(browser.location)
        console.log(browser.location.pathname)
        browser.fill('uname','arzhed')
          .fill('pwd','arzhed')
          .pressButton('signinButton',function(){
            console.log('Button pressed!!')
            assert.equal(browser.statusCode,200)
            assert.equal(browser.location.pathname,'/feed')
            browser.visit('http://localhost:8250/users',  function(){
              assert.equal(browser.statusCode,200);
              assert.equal(browser.location.pathname,'/users')
              done()
            })
          })
        //console.log(browser.statusCode)
        //console.log(browser.location)
/*
        fs.writeFile("./logTest", browser.resources.dump(), function(err) {
          if(err) {
              console.log(err);
          } else {
              console.log("The file was saved!");
          }
        }); 

{ debug: true, runScripts: false },

*/
      })
    });

  });
});

