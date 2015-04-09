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
	console.log('peripheral');	
}

GattPeripheral.prototype.run = function(){
	//start advertising!
	bleno.on('stateChange', function(state) {
		if (state === 'poweredOn') {

			//start advertising!
			console.log('start advertising');
			bleno.startAdvertising(name, [carService.uuid], function(err) {
				if (err) {
					console.log(err);
				}
			});
		}
		else {
			bleno.stopAdvertising();
		}
	});

	bleno.on('advertisingStart', function(err) {
  		if (!err) {
			//slog.push({source: dbSource, message: name + ': advertising'});
				console.log('add services');
			//Add services
			bleno.setServices([
		  		carService
			]);
	 	} else {
	 		console.log('err ', err);
	 	}
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
