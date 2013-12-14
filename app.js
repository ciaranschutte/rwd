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

var app = express();

// all environments
app.engine('ejs', engine);
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.param('collectionName', function(req, res, next, collectionName){
  req.collection = db.collection(collectionName)
  return next()
});

app.get('/', function(req, res) {
        home.index(req, res);
   
});

app.post('/collections/:collectionName', map.create);


http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

