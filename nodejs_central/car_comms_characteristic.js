var util = require('util');
var bleno = require('bleno');

function CarCommsCharacteristic(){
	bleno.Characteristic.call(this, {
		uuid: '1817',
		properties: ['read', 'notify'],
		descriptors: [
			new bleno.Descriptor({
				uuid: '2901',
				value: 'Gets the car communication message'
			})
		]
	});
}

util.inherits(CarCommsCharacterisitc, Characteristic);

//how to send information??
