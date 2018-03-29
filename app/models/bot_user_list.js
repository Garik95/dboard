var mongoose = require('mongoose');

module.exports = mongoose.model('bot_user_list',{
	message_id: Number,
	from:{
			id: 			Number,
			is_bot:			Boolean,
			first_name: 	String,
			last_name:		String,
			username:		String,
			language_code:	String
		},
	chat:{
			id: 			Number,
			is_bot:			Boolean,
			first_name: 	String,
			last_name:		String,
			type:			String
		},
	date: String,
	text: String,
	entities:[{
			offset:	Number,
			length:	Number,
			type:	String
		}],
	reply: String,
	addAPIState :Boolean
});