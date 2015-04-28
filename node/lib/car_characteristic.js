/***
* Class object module for the CarCharacteristic, which carries the commands 
* central to the system
*/

var util = require('util'),
	bleno = require('bleno'),
	slog = require('./server_log_queue').serverDbQueue,
	Descriptor = bleno.Descriptor;

var cmd;
var poll;

var CarCharacteristic = function() {
	bleno.Characteristic.call(this, {
		uuid: '1817',
		properties: ['read', 'notify'],
		//secure: ['read', 'notify'],
		descriptors: [ new Descriptor({uuid: '1817', value: 'Car characteristic'}) ],
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
			
			//if subscribed to, poll cmd every quarter second, and send update if has changed.
			var poll = setInterval(function() { 
				if(cmd){
					
					updateValueCallback(cmd);					
					cmd = null;
				}
			}, 250);						
		}, 
		onUnsubscribe: function(){
			//slog.push({source: 'car_characteristic', message: 'characteristic unsubscribe', priority: 'debug'});
			clearInterval(poll);
		}
	});
}

util.inherits(CarCharacteristic, bleno.Characteristic);

CarCharacteristic.prototype.updateCharacteristicValue = function(_newCmd){
	cmd = _newCmd;
	
}

module.exports = CarCharacteristic;
