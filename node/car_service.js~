var util = require('util'),
	bleno = require('bleno'),
	CarCharacteristic = require('./car_characteristic');
var BlenoPrimaryService = bleno.PrimaryService;

var carCharacteristic = new CarCharacteristic();

function CarService() {
    CarService.super_.call(this, {
        uuid: '2a67',
        characteristics: [
            carCharacteristic
        ]
    });   
}

util.inherits(CarService, BlenoPrimaryService);

/**  */
CarService.prototype.sendCommand = function(cmd){
	//console.log('bum titty');
	carCharacteristic.updateCharacteristicValue(cmd);
}

module.exports = CarService;
