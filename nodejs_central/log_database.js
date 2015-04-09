var sqlite3 = require('sqlite3').verbose(),
	async = require('async');  
	
var db = new sqlite3.Database('../log.db');

module.exports = {
	/**
	* Logs server activity in the database
	* priority: info, err, warn, debug
	*/
	serverLogAdd: function(source, message, priority){
		db.serialize(function() {
			db.run("INSERT INTO server_log (log_source, log_message, priority) VALUES (?,?,?)", source, message, priority);
		});
	},

	commsLogAdd: function(direction, from, message, logType, callback){
		db.serialize(function() {
			db.run("INSERT INTO communication_log (message_direction, message_from, message_contents, comms_log_type) VALUES (?,?,?,?)", direction, from, message, logType, callback);
		});
	}

};

