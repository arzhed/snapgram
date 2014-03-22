var assert = require("assert")
var http = require('http')
var Browser = require("zombie")
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
      this.browser = new Browser();
    })
    it('should sign in (check username/password), be redirected to "/feed", then "GET /users" and not be redirected', function(done){
      var browser = this.browser
      browser.visit('http://localhost:8250/sessions/new',  function(err){
        if(err)
          console.log(err)
        browser.fill('uname','arzhed')
          .fill('pwd','arzhed')
          .pressButton('signinButton',function(err){
            if(err)
              console.log(err)
            assert.equal(browser.statusCode,200)
            assert.equal(browser.location.pathname,'/feed')
            browser.visit('http://localhost:8250/users',  function(err){
              if(err)
                console.log(err)
              assert.equal(browser.statusCode,200);
              assert.equal(browser.location.pathname,'/users')
              done()
            })
          })
      })
    });

    it('cookie stored in Zombie browser : "GET /sessions/new redirected to /feed', function(done){
      var browser = this.browser
      browser.visit('http://localhost:8250/sessions/new',  function(err){
        if(err)
          console.log(err)
        assert.equal(browser.statusCode,200);
        assert.equal(browser.location.pathname,'/feed')
        done()
      })
    });

    it('cookie stored in Zombie browser : "GET /feed not redirected', function(done){
      var browser = this.browser
      browser.visit('http://localhost:8250/feed',  function(err){
        if(err)
          console.log(err)
        assert.equal(browser.statusCode,200);
        assert.equal(browser.location.pathname,'/feed')
        done()
      })
    });

    it('cookie stored in Zombie browser : "GET /users/2" not redirected', function(done){
      var browser = this.browser
      browser.visit('http://localhost:8250/users/2',  function(err){
        if(err)
          console.log(err)
        assert.equal(browser.statusCode,200);
        assert.equal(browser.location.pathname,'/users/2')
        done()
      })
    });

    it('cookie stored in Zombie browser : "GET /users/2/follow" not redirected', function(done){
      var browser = this.browser
      browser.visit('http://localhost:8250/users/2/follow',  function(err){
        if(err)
          console.log(err)
        assert.equal(browser.statusCode,200);
        assert.equal(browser.location.pathname,'/users/2')
        done()
      })
    });

    it('cookie stored in Zombie browser : "GET /users/2/unfollow" not redirected', function(done){
      var browser = this.browser
      browser.visit('http://localhost:8250/users/2/unfollow',  function(err){
        if(err)
          console.log(err)
        assert.equal(browser.statusCode,200);
        assert.equal(browser.location.pathname,'/users/2')
        done()
      })
    });

    it('cookie stored in Zombie browser : "GET /photos/new" not redirected', function(done){
      var browser = this.browser
      browser.visit('http://localhost:8250/photos/new',  function(err){
        if(err)
          console.log(err)
        assert.equal(browser.statusCode,200);
        assert.equal(browser.location.pathname,'/photos/new')
        done()
      })
    });

    it('cookie stored in Zombie browser : "GET /users/100000" 404', function(done){
      var browser = this.browser
      browser.visit('http://localhost:8250/users/100000',  function(err){
        if(err)
          console.log(err)
        assert.equal(browser.statusCode,404);
        assert.equal(browser.location.pathname,'/notFound')
        done()
      })
    });     

  });
});

