var util = require('util');
var bleno = require('bleno');

var cmd = 456;

var CarCharacteristic = function() {
	bleno.Characteristic.call(this, {
		uuid: '1817',
		properties: ['read', 'notify']
		//value: '0000'
		/*,
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

//TODO: deal with disconnections bleno.disconnect(); // Linux only


//how to send information??
CarCharacteristic.prototype.onReadRequest = function(offset, callback) {
      console.log("read");
      //this.value = val;
      callback(this.RESULT_SUCCESS, new Buffer([123]));
};

CarCharacteristic.prototype.onNotify = function(){
	//CarCharacteristic.
	console.log("notify");
};

CarCharacteristic.prototype.onSubscribe = function(maxSize, updateValueCallback){
	console.log("subscribe");	
			
	//get callback for cmd changing!
	setInterval(function() {
		if(cmd){
			updateValueCallback(new Buffer([cmd]));
			cmd = null;
		}
	}, 500);			
		
	//callback(this.RESULT_SUCCESS, new Buffer([val]));
	//gonna have to send something to updateValueCallback!
};

module.exports = CarCharacteristic;
