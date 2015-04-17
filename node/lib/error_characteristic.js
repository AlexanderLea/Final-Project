var util = require('util'),
	bleno = require('bleno'),
	slog = require('./server_log_queue').serverDbQueue;

var err;
var poll;

var ErrorCharacteristic = function() {
	bleno.Characteristic.call(this, {
		uuid: '1818',
		properties: ['read', 'notify'],
		secure: ['read', 'notify'],
		//Read event
		onReadRequest: function(offset, callback) {
     		if(cmd){
			//slog.push({source: 'car_characteristic', message: 'characteristic read', priority: 'debug'});
		  		callback(this.RESULT_SUCCESS, new Buffer(cmd));
      		}
		},
		//Subscribe event
		onSubscribe: function(maxSize, updateValueCallback){
			//slog.push({source: 'car_characteristic', message: 'characteristic subscribe', priority: 'debug'});	
			
			//if subscribed to, poll cmd every half second, and send update if has changed.
			var poll = setInterval(function() { 
				if(err){
					
					updateValueCallback(err);					
					err = null;
				}
			}, 500);						
		}, 
		onUnsubscribe: function(){
			//slog.push({source: 'car_characteristic', message: 'characteristic unsubscribe', priority: 'debug'});
			clearInterval(poll);
		}
	});
}

util.inherits(ErrorCharacteristic, bleno.Characteristic);

ErrorCharacteristic.prototype.updateCharacteristicValue = function(_err){
	err = _err;	
}

module.exports = ErrorCharacteristic;
