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
		if(req.session.userId)
		{
			db.api.bot_user_lists.find().exec(function(err,result){
				if(err) console.log(err);
				res.json({"cnt":result.length,"session":req.session.userId});
			});
		}
		else res.status(404);
	});

	app.get('/pages/:name',function(req,res){
		if(req.session.userId)
		{
			res.render("pages/" + req.params.name);
		}
		else res.redirect("/");
	});

	app.get('/confirmEmail',function(req, res){
		var token = req.param('token');
		var email = req.param('email');
		if(token && email) {
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
		}else res.send(404);
	});

	app.post('/login',function(req,res){
		if(req.body.btn == "Sign In")
		{
			if(req.body.email && req.body.pass)
			{
				var email	= req.body.email;
				var pass	= req.body.pass;
				db.dashboard.userses.find({"local.email":email}).exec(function(err,user){
					if(err) res.send(err);
					console.log(user.length);
					if(user.length == 0){
						res.render(__dirname + '/login.ejs',{message:"User not found!",status:"Y"});
					}
					else if(user.length > 0){
						// console.log(user[0].local.password);
						bcrypt.compare(pass, user[0].local.password, function (err, result) {
							if(err) res.send(err);
							if(result)
							{
								req.session.userId = user[0]._id;
								// res.send(req.session.userId);
								res.redirect("/auth");
							}else if(!result)
							{
								res.render(__dirname + '/login.ejs',{message:"Invalid password",status:"R"});
							}
						});
					}
				});
			}
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
		else res.send(404); 
	});

	app.get('/logout',function(req,res){
		req.session.destroy(function(err) {
			res.redirect("/");
		});
	});

	app.get('/auth',function(req,res){
		if(req.session.userId){
				res.sendFile('index.html', { root: __dirname });
		}else {
			res.redirect("/");
		}
	})

	// application -------------------------------------------------------------
	app.get('/', function(req, res) {
				if(req.session.userId){
					res.redirect('/auth');
				}
				else
				{
					res.render(__dirname + "/login.ejs",{message:"",status:"G"});
				}
				res.sendFile('index.html', { root: __dirname });

	});

	// HTTP statuses -----------------------------------------------------------

	app.use(function (req, res, next) {
		res.status(404).render(__dirname + "/404.ejs");
	});
};