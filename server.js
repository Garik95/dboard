// set up ======================================================================
var express  = require('express');
var app      = express(); 								// create our app w/ express
var mongoose = require('mongoose'); 					// mongoose for mongodb
var port  	 = process.env.PORT || 8080; 				// set the port
var session = require('express-session');

var morgan = require('morgan'); 		// log requests to the console (express4)
var bodyParser = require('body-parser'); 	// pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

var MongoClient = require('mongodb').MongoClient;
var db;
var local_url = {
  "dboard":"mongodb://192.168.79.128:27017/dboard",
  "api"   :"mongodb://192.168.79.128:27017/api"
};
var remote_url = {
  "dboard":"mongodb://dash_user:123456@ds261078.mlab.com:61078/project_dashboard",
  "api"   :"mongodb://api_user:123456@ds157528.mlab.com:57528/project_api"
};

// configuration ===============================================================
// mongoose.connect(database.url,function(err){console.log(err)}); 	// connect to mongoDB database on modulus.io

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html'); // set up ejs for templating

app.use(session({
    secret: '233F88D911E59C81DE2BC77284FBF',
    resave: true,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));

app.use('/custom', express.static(__dirname + '/custom')); 				// set the static files location /public/img will be /img for users
app.use('/scripts', express.static(__dirname + '/node_modules')); 				// set the static files location /public/img will be /img for users
app.use('/ng', express.static(__dirname + '/ng')); 				// set the static files location /public/img will be /img for users
app.use('/pages', express.static(__dirname + '/pages')); 				// set the static files location /public/img will be /img for users
app.use(morgan('dev')); 										// log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'})); 			// parse application/x-www-form-urlencoded
app.use(bodyParser.json()); 									// parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
// routes ======================================================================
// require('./app/routes.js')(app,db);

// listen (start app with node server.js) ======================================


// db.api.bot_user_lists.find().exec(function(err,docs){
//     console.log(docs);
// });

MongoClient.connect(local_url.api, function(err, database1) {
  console.log("1");
  if(err) throw err;
  else{
    MongoClient.connect(local_url.dboard, function(err, database2) {
      console.log("2");      
        if(err) throw err;
        
        db1 = database1;
        app.listen(port);
        // console.log(db1);
      require('./app/routes.js')(app,database1,database2);
    });
  }
  

});
console.log("App listening on port " + port);