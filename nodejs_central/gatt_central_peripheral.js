/**
* Using https://github.com/sandeepmistry/bleno
*/

var util = require('util');
var bleno = require('bleno');

var CarService = require('./car_service');

var name = 'BLE_Central';

var carService;

//TODO: on connection and disconnection events

function GattPeripheral() {
	carService = new CarService();
	
}

GattPeripheral.prototype.run = function(callback){
	//start advertising!
	bleno.startAdvertising(name, [carService.uuid]);

	bleno.on('advertisingStart', function(err) {
//  		if (!err) {
			console.log('advertising...');

			//Add services
			bleno.setServices([
		  		carService
			]);
					
			//return callback
			callback(null);
//	 	} else{
	 		//console.log('err ', err);
//	 		callback(err);
//	 	}
	});
}

GattPeripheral.prototype.stop = function(){
	console.log("Stop peripheral");
	bleno.stopAdvertising();
}

GattPeripheral.prototype.broadcastCommand = function(_cmd){
	carService.sendCommand(_cmd);
}

module.exports = GattPeripheral;
