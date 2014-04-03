
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var fs = require('fs');
var access_logfile = fs.createWriteStream('./access.log', {flags: 'a'});

var signin = require('./routes/signin');
var signup = require('./routes/signup');
var feed = require('./routes/feed');
var signout = require('./routes/signout');
var index = require('./routes/index');
var notFound = require('./routes/notFound');
var internalError = require('./routes/internalError');
var bulk = require('./routes/bulk');
var upload = require('./routes/upload');

var app = express();

// all environments
app.set('port', process.env.PORT || 8254);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('short'));
app.use(express.logger({stream: access_logfile }));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.multipart());
app.use(express.methodOverride());
app.use(express.cookieParser('S3CRE7'));
app.use(express.cookieSession({ path: '/', httpOnly: true, maxAge: 3600000 }));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
/*app.use(function(req, res, next){
  console.log('%s %s', req.method, req.url);
  next();
});*/
app.use(function(req, res){
	res.status(404);
	res.redirect('/notFound');
});
app.use(function(error, req, res, next){
	console.log(error);
	res.status(500);
	res.redirect('/internalError');
});
app.use(express.bodyParser());

// development only
if ('development' == app.get('env')) {
  //app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/sessions/new', index.formSignIn);
app.get('/users/new', index.formSignUp);
app.post('/sessions/create', signin.signin);
app.post('/users/create', signup.signup);
app.get('/users', user.list);
app.get(/^\/feed(\?page=\d+)?$/,feed.feed);
app.get('/photos/new',upload.newPicture);
app.post('/photos/create',feed.upload);
app.get(/^\/users\/\d+\/follow$/, user.follow);
app.get(/^\/users\/\d+\/unfollow$/, user.unfollow);
app.get(/^\/users\/\d+$/, feed.stream);
app.get('/signout',signout.signout);
app.get('/notFound',notFound.notFound);
app.get('/internalError', internalError.internalError);
app.get('/bulk/clear', bulk.clear);
app.post('/bulk/users', bulk.users);
app.post('/bulk/streams', bulk.streams);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});