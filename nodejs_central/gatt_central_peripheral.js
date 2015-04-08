/**
* Using https://github.com/sandeepmistry/bleno
*/

var util = require('util'),
	bleno = require('bleno'),
	slog = require('./server_log_queue');

var CarService = require('./car_service');

var name = 'BLE_Central';
var dbSource = 'gatt_central_peripheral';

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
			//console.log('advertising...');
			slog.push({source: dbSource, message: name + ': advertising'});
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
	slog.push({source: dbSource, message: name + ': stop advertising'});
	bleno.stopAdvertising();
}

GattPeripheral.prototype.broadcastCommand = function(_cmd){
	carService.sendCommand(_cmd);
}

module.exports = GattPeripheral;
