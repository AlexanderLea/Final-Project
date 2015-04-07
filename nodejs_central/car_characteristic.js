var util = require('util');
var bleno = require('bleno');

//TODO: deal with disconnections bleno.disconnect(); to stop timer and deal with associated memory leaks
var cmd;

var CarCharacteristic = function() {
	bleno.Characteristic.call(this, {
		uuid: '1817',
		properties: ['read', 'notify'],
		//Read event
		onReadRequest: function(offset, callback) {
     		if(cmd){
		 		console.log('read');
		  		callback(this.RESULT_SUCCESS, new Buffer(cmd));
      		}
		},
		//Subscribe event
		onSubscribe: function(maxSize, updateValueCallback){
			console.log('subscribe');	
			
			//if subscribed to, poll cmd every half second, and send update if has changed.
			//TODO: make this better and async
			setInterval(function() { 
				if(cmd){
					updateValueCallback(new Buffer([cmd]));
					cmd = null;
				}
			}, 500);						
		},
		//Notify event - fires every time a notification is sent
		onNotify: function(){
			//CarCharacteristic.
			console.log('notify');
		}/*,
		descriptors: [
			new bleno.Descriptor({
				uuid: '2902',
				value: 'Gets the car communication message'
			})
		]*/
	});
}

util.inherits(CarCharacteristic, bleno.Characteristic);

function updateCharacteristicValue(_newCmd){
	cmd = _newCmd;
}

module.exports = CarCharacteristic;
