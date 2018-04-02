// set up ======================================================================
var express  = require('express');
var app      = express(); 								// create our app w/ express
var mongoose = require('mongoose'); 					// mongoose for mongodb
var port  	 = process.env.PORT || 8080; 				// set the port
var session = require('express-session');

var morgan = require('morgan'); 		// log requests to the console (express4)
var bodyParser = require('body-parser'); 	// pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

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
require('./app/routes.js')(app);

// listen (start app with node server.js) ======================================
app.listen(port);

// db.api.bot_user_lists.find().exec(function(err,docs){
//     console.log(docs);
// });

console.log("App listening on port " + port);
