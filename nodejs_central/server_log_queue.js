var	async = require('async'),
	db = require('./log_database')

var serverDbQueue = async.queue(function(record, callback){
	//for each item in queue, call save to db method, replacing any null
	// character values in the string
	db.serverLogAdd(record.source, record.message.replace('\0', ''), record.priority);
	console.log(record);
	callback();
}, 2);

//Callback for when the queue is empty
serverDbQueue.drain = function(){
	//console.log('all items have been processed');
}

//direction, from, message, logType
var commsDbQueue = async.queue(function(record, callback){

	db.commsLogAdd(record.direction, record.from, record.message.replace('\0', ''), record.priority);
	console.log(record);
	callback();
}, 1);

//Callback for when the queue is empty
commsDbQueue.drain = function(){
	//console.log('all items have been processed');
}

module.exports = {serverDbQueue: serverDbQueue, commsDbQueue: commsDbQueue};
