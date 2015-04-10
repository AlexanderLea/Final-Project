var util = require('util'),
	bleno = require('bleno'),
	slog = require('./server_log_queue');

//TODO: deal with disconnections bleno.disconnect(); to stop timer and deal with associated memory leaks
var cmd;

var CarCharacteristic = function() {
	bleno.Characteristic.call(this, {
		uuid: '1817',
		properties: ['read', 'notify'],
		//Read event
		onReadRequest: function(offset, callback) {
     		if(cmd){
			//slog.push({source: dbSource, message: 'characteristic read', priority: 'debug'});
		  		callback(this.RESULT_SUCCESS, new Buffer(cmd));
      		}
		},
		//Subscribe event
		onSubscribe: function(maxSize, updateValueCallback){
			//slog.push({source: dbSource, message: 'characteristic subscribe', priority: 'debug'});	
			
			//if subscribed to, poll cmd every half second, and send update if has changed.
			//TODO: make this better
			setInterval(function() { 
				if(cmd){
					console.log(cmd);
					updateValueCallback(cmd);					
					cmd = null;
				}
			}, 500);						
		}/*,
		//Notify event - fires every time a notification is sent
		onNotify: function(){
			//slog.push({source: dbSource, message: 'characteristic notify', priority: 'debug'});
		}*/
	});
}

util.inherits(CarCharacteristic, bleno.Characteristic);

CarCharacteristic.prototype.updateCharacteristicValue = function(_newCmd){
	cmd = _newCmd;
	
}

module.exports = CarCharacteristic;
