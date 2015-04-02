var util = require('util');
var bleno = require('bleno');

var carCommsCharacteristic = require('./car_comms_characteristic');

function CarService() {
    bleno.PrimaryService.call(this, {
        uuid: '2a67',
        characteristics: [
            new carCommsCharacteristic()
        ]
    });
}

util.inherits(CarService, bleno.PrimaryService);

module.exports = CarService;
