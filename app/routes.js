var md5 	= require('md5');
var nodemailer  = require('nodemailer');
var unix       = require('unix-timestamp');
var bcrypt = require('bcrypt-nodejs');

var Todo = require('./models/todo');
var BotList = require('./models/bot_user_list');
var Schemas = require('./models/schemas');
var mongoose = require('mongoose').set('debug', true);
var database = require('../config/database'),  // external network file
    schemaFile = require('./models/schemas.js'),
    mongooseMulti = require('mongoose-multi'),
	db = mongooseMulti.start(database.db, schemaFile);

const from = 'n_garry95@mail.ru';
const route = "localhost:8080/confirmEmail?";
	// configure origin mail
var transporter = nodemailer.createTransport({
	service: 'Mail.ru',
	auth: {
		user: from,
		pass: '2606111'
	}
});

module.exports = function(app) {

	// api ---------------------------------------------------------------------

	app.get('/list', function(req,res){
		db.api.bot_user_lists.find().exec(function(err,result){
			if(err) console.log(err);
			res.json({"cnt":result.length});
		});
	});

	app.get('/pages/:name',function(req,res){
		res.render("pages/" + req.params.name);
	});

	app.get('/confirmEmail',function(req, res){
		var token = req.param('token');
		var email = req.param('email');
		db.dashboard.userses.findOne({'local.email':email,'local.emailHash':token,'local.status':false}, function(err, user) {
		if(!user) {res.render(__dirname + '/login.ejs',{message:"Something went wrong!",status:"R"})}
		else
		{
			var c = parseFloat(user.local.createdAt);
			if((unix.now() - c) <= 24*60*40) { 
				db.dashboard.userses.update({"local.email" : email},{$set:{"local.status":true}}).exec(function(err,user){
					if(err) console.log(err);
					if(user)
					{
						db.dashboard.userses.update({"local.email" : email},{$set:{"local.emailHash":""}}).exec(function(err,user){});
						
						res.render(__dirname + '/login.ejs',{message:"Your account has been confirmed!",status:"G"});
					}
				});
			}
			else {
				db.dashboard.userses.remove({"local.email" : email},function(err,user){
					if(err) console.log(err);
					if(user){
						res.render(__dirname + '/login.ejs',{message:"Your sign up request was expired! Please try to sign up again...",status:"Y"})
					}
				});
			}
		}
		});
	});

	app.post('/login',function(req,res){
		if(req.body.btn == "Submit")
		{
			if(req.body.email && req.body.password)
			{
				var email	= req.body.email;
				var pass	= req.body.password;
				db.dashboard.userses.find({"local.email":email}).exec(function(err,user){
					if(err) res.send(err);
					if(!user){
						res.render(__dirname + '/login.ejs',{message:"User not found!",status:"Y"});
					}
					else if(user){
						res.json(user);
						// bcrypt.compare(password, user.password, function (err, result) {

						// });
					}
				});
			}
			res.json(req.body);
		}
		else if(req.body.btn == "Sign Up")
		{
			if(req.body.f_name && req.body.l_name && req.body.email && req.body.pass)
			{
				var email 	= req.body.email;
				db.dashboard.userses.find({"local.email":email},function(err,result){
					if(err) req.send(err);
					console.log(result.length);
					if(result.length == 0)
					{
						bcrypt.genSalt(10, function(err, salt) {
							bcrypt.hash(req.body.pass, salt, null, function(err, hash) {
								var now 	= unix.now();
								var eHash 	= md5(email + '+' + now);
								var userData = {
									local:{
										email:			email,
										first_name:		req.body.f_name,
										last_name:		req.body.l_name,
										password:		hash,
										status:			false,
										emailHash:		eHash,
										createdAt:		now
									}
								}
								db.dashboard.userses.create(userData,function(err,result){
									if(err) res.send(err);
									if(result)
									{
										var mailOptions = {
											from: from,
											to: email,
											subject: 'Email confirmation',
											html: '<h1>Email Confirmation</h1><br><a href="'+route+'token=' + eHash + '&email=' + email + '" target="_blank">Confirm Email</a>'
										};	
										
										transporter.sendMail(mailOptions, function(error, info){
										if (error) {
											console.log(error);
											} else {
											console.log('Email sent: ' + info.response);
											res.render(__dirname + "/login.ejs",{message:"Email confirmation has been send. Please check your inbox",status: "G"});
											}
										}); 
									}
								});
							});
						});
					}
					else {
						res.render(__dirname + "/login.ejs",{message:"Email already taken!",status:"R"});
					}
				});
				console.log(db.dashboard.userses);
			}
			else res.send("Data validation error!");
		}
	});

	// application -------------------------------------------------------------
	app.get('*', function(req, res) {
		if(req.url == "/") res.render(__dirname + "/login.ejs",{message:""});
		res.sendFile('index.html', { root: __dirname });
	});
};