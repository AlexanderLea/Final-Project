var	async = require('async'),
	db = require('./log_database')

var dbQueue = async.queue(function(data, callback){
	//for each item in queue, call save to db method, replacing any null
	// character values in the string
	db.serverLogAdd(data.source, data.message.replace('\0', ''));
	console.log(data);
	callback();
}, 2);

//Callback for when the queue is empty
dbQueue.drain = function(){
	//console.log('all items have been processed');
}

module.exports = dbQueue;
