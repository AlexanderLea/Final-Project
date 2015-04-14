var util = require('util'),
	bleno = require('bleno'),
	ErrCharacteristic = require('./error_characteristic');
var BlenoPrimaryService = bleno.PrimaryService;

var errCharacteristic = new ErrCharacterisitc();

function CarService() {
    CarService.super_.call(this, {
        uuid: '2a67',
        characteristics: [
            errCharacteristic
        ]
    });   
}

util.inherits(CarService, BlenoPrimaryService);

CarService.prototype.reportError = function(_err){
	errCharacteristic.updateCharacteristicValue(_err);
}

module.exports = CarService;
