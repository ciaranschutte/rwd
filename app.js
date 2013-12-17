/**
 * Module dependencies.
 */

var express = require('express')
  , engine = require('ejs-locals')
  , home = require('./routes/home')
  , map = require('./routes/map')
  , http = require('http')
  , path = require('path')
 // , Geo = require('./models/geo')
  , mongoskin = require('mongoskin');
  passport = require('passport')
  , util = require('util')
  , GoogleStrategy = require('passport-google').Strategy;

  
  passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new GoogleStrategy({
    returnURL: 'http://maaap.herokuapp.com/auth/google/return',
    realm: 'http://maaap.herokuapp.com/'
  },
  function(identifier, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's Google profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Google account with a user record in your database,
      // and return that user instead.
      profile.identifier = identifier;
      return done(null, profile);
    });
  }
));

var app = express();

// all environments
app.configure(function() {
app.engine('ejs', engine);
app.set('port', process.env.PORT || 4000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
 app.use(passport.initialize());
  app.use(passport.session());
app.use(express.session({ secret: 'keyboard cat' }));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

});

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

var db = require('mongoskin').db('mongodb://ciaran:password1@ds057538.mongolab.com:57538/heroku_app20430910', {safe:true});
app.param('collectionName', function(req, res, next, collectionName) {
  req.collection = db.collection(collectionName);
  return next();
});



app.get('/', function(req, res) {
      if(req.session.user){
          //console.log("/ req",req.session.user);
          req.user = req.session.user;
      }
      res.render('home/index',{ user: req.user });   
});


app.get('/account', function(req, res){
  res.render('home/account', { user: req.session.user });
});

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve redirecting
//   the user to google.com.  After authenticating, Google will redirect the
//   user back to this application at /auth/google/return
app.get('/auth/google', passport.authenticate('google', {failureRedirect: '/login' }));

// GET /auth/google/return
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/google/return', 
  passport.authenticate('google', {failureRedirect: '/test2' }),
  function(req, res) {
    req.session.user = req.user;
    console.log("auth/google/return",req.session.user);
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  delete req.session.user;
  res.redirect('/');
});

app.listen(3000);




app.get('/collections/:collectionName', map.load);
app.post('/collections/:collectionName', map.create);
app.post('/collections/:collectionName/update', map.update);
app.post('/collections/:collectionName/delete', map.delete);


http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});