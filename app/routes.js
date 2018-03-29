var Todo = require('./models/todo');
var BotList = require('./models/bot_user_list');
var mongoose = require('mongoose').set('debug', true);

var Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;
var todo = new Schema({
	text		:String
});

module.exports = function(app) {

	// api ---------------------------------------------------------------------
	// get all todos
	app.get('/api/todos', function(req, res) {
		// use mongoose to get all todos in the database
		Todo.find(function(err, todos) {
			// console.log(todos);

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)

			res.json(todos); // return all todos in JSON format
		});
	});

	app.get('/list',function(req,res){
		BotList.count(function(err,cnt){
			if(err) console.log(err);

			res.json({"cnt":cnt});
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