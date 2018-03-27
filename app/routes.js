var Todo = require('./models/todo');
var mongoose = require('mongoose');

var Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;
var todo = new Schema({
	text		:String
});

module.exports = function(app) {

	// api ---------------------------------------------------------------------
	// get all todos
	// app.get('/api/todos', function(req, res) {
	// 	// use mongoose to get all todos in the database
	// 	Todo.find(function(err, todos) {
	// 		console.log(todos);

	// 		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
	// 		if (err)
	// 			res.send(err)

	// 		res.json(todos); // return all todos in JSON format
	// 	});
	// });

	// // create todo and send back all todos after creation
	// app.post('/api/todos', function(req, res) {
	// 	// console.log(req.body.text);
	// 	// create a todo, information comes from AJAX request from Angular
	// 	Todo.create({
	// 		text : req.body.text,
	// 		done : false
	// 	}, function(err, todo) {
	// 		console.log(todo);
	// 		if (err)
	// 			res.send(err);
	// 	// var data 	= mongoose.model('Todo',todo);
	// 	// var n 		= new data();
	// 	// n.text		= req.body.text;
	// 	// // n.done		= false;
	// 	// console.log(n);
	// 	// n.save();
	// 	// n.save(function(err){console.log(err);});
	// 	// res.send("Saved!");
	// 		// get and return all the todos after you create another
	// 		Todo.find(function(err, todos) {
	// 			if (err)
	// 				res.send(err)
	// 			res.json(todos);
	// 		});
	// 	});

	// });

	// // delete a todo
	// app.delete('/api/todos/:todo_id', function(req, res) {
	// 	Todo.remove({
	// 		_id : req.params.todo_id
	// 	}, function(err, todo) {
	// 		if (err)
	// 			res.send(err);

	// 		// get and return all the todos after you create another
	// 		Todo.find(function(err, todos) {
	// 			if (err)
	// 				res.send(err)
	// 			res.json(todos);
	// 		});
	// 	});
	// });

	// app.use(app.router);
	app.get('/about',function(req,res){
		res.render("pages/about.html");
	});
	app.get('/:pages/:name',function(req,res){
		var file = req.params[0];
		console.log(req.params);
		// res.send("123");
		// res.render("pages/" + req.params.name);
		res.render("pages/home.html");
	});
	// application -------------------------------------------------------------
	app.all('/*', function(req, res) {
		// res.sendFile(__dirname + '/index.html'); // load the single view file (angular will handle the page changes on the front-end)
		res.sendFile('index.html', { root: __dirname });
	});
};