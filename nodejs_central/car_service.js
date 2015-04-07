var util = require('util');
var bleno = require('bleno');
var BlenoPrimaryService = bleno.PrimaryService;
var CarCharacteristic = require('./car_characteristic');

function CarService() {
    CarService.super_.call(this, {
        uuid: '2a67',
        characteristics: [
            new CarCharacteristic()
        ]
    });
}

CarService.prototype.sendCommand = function(_cmd){
	CarCharacteristic.updateCharacteristicValue(_cmd);
}

util.inherits(CarService, BlenoPrimaryService);

module.exports = CarService;
