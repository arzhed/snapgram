
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var signin = require('./routes/signin');
var signup = require('./routes/signup');
var feed = require('./routes/feed');
var signout = require('./routes/signout');
var index = require('./routes/index');
var oops = require('./routes/oops')

var app = express();

// all environments
app.set('port', process.env.PORT || 8250);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.multipart());
app.use(express.methodOverride());
app.use(express.cookieParser('S3CRE7'));
app.use(express.cookieSession());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next){
	res.status(404).redirect('/oops');
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/sessions/new', index.formSignIn);
app.get('/users/new', index.formSignUp);
app.post('/signin', signin.signin);
app.post('/users/create', signup.signup);
app.post('/signup', signup.signup);
app.get('/users', user.list);
app.get('/feed',feed.feed);
app.post('/upload',feed.upload)
app.get(/\/users\/\d+/, feed.stream);
app.get('/signout',signout.signout);
app.get('/oops',oops.oops);
app.get(/users\/\d+\/follow/, user.follows)

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
