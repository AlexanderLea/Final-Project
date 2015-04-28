/***
* Class object module for the CarService - holds the car and error
* characteristics and coordinates their updation
*/

var util = require('util'),
	bleno = require('bleno'),
	CarCharacteristic = require('./car_characteristic');
	ErrCharacteristic = require('./error_characteristic');
var BlenoPrimaryService = bleno.PrimaryService;

var carCharacteristic = new CarCharacteristic();
var errCharacteristic = new ErrCharacteristic();

function CarService(_isCentral) {
	console.log('is central ', _isCentral);
	var chars;
	
	//determine which characteristics to advertise/include
	if(_isCentral){
		chars = [carCharacteristic];
	} else {
		chars = [carCharacteristic, errCharacteristic];
	}
	
    CarService.super_.call(this, {
        uuid: '2a67',
        characteristics: chars
    });   
}

util.inherits(CarService, BlenoPrimaryService);

/**  */
CarService.prototype.sendCommand = function(cmd){
	carCharacteristic.updateCharacteristicValue(cmd);
}

CarService.prototype.registerError = function(_err){
	errCharacteristic.updateCharacteristicValue(_err);
}

module.exports = CarService;
