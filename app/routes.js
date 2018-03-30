var Todo = require('./models/todo');
var BotList = require('./models/bot_user_list');
var Schemas = require('./models/schemas');
var mongoose = require('mongoose').set('debug', true);
var database = require('../config/database'),  // external network file
    schemaFile = require('./models/schemas.js'),
    mongooseMulti = require('mongoose-multi'),
    db = mongooseMulti.start(database.db, schemaFile);
var Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;
var todo = new Schema({
	text		:String
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
	// application -------------------------------------------------------------
	app.get('*', function(req, res) {
		res.sendFile('index.html', { root: __dirname });
	});
};