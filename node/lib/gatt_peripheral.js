/**
* Using https://github.com/sandeepmistry/bleno
*/

console.log('peripheral using device: ', process.env.BLENO_HCI_DEVICE_ID);

var util = require('util'),
	bleno = require('bleno'),
	slog = require('./server_log_queue').serverDbQueue,
	clog = require('./server_log_queue').commsDbQueue;

var CarService = require('./car_service');

var name = 'BLE_Central';
var dbSource = 'gatt_central_peripheral';

var carService;

//TODO: on connection and disconnection events

function GattPeripheral() {

	carService = new CarService();
}

GattPeripheral.prototype.run = function(){
	//start advertising!
	bleno.on('stateChange', function(state) {
		if (state === 'poweredOn') {

			//start advertising!
			bleno.startAdvertising(name, [carService.uuid], function(err) {
				if (err) {
					slog.push({source: dbSource, message: err, priority: 'err'});
				}
			});
		}
		else {
			bleno.stopAdvertising();
			slog.push({source: dbSource, message: name + ': stop advertising', priority: 'info'});
		}
	});

	bleno.on('advertisingStart', function(err) {
  		if (!err) {			
			//Add services
			bleno.setServices([
		  		carService
			]);
			slog.push({source: dbSource, message: name + ': advertising', priority: 'info'});
	 	} else {
	 		slog.push({source: dbSource, message: err, priority: 'err'});
	 	}
	});
}

GattPeripheral.prototype.stop = function(){
	slog.push({source: dbSource, message: name + ': stop advertising', priority: 'info'});
	bleno.stopAdvertising();
}

GattPeripheral.prototype.broadcastCommand = function(_cmd){
	carService.sendCommand(_cmd);
	clog.push({
		direction: 'OUT', 
		from: '',
		message: _cmd.toString('hex'),
		logType: '1'
	});
}

module.exports = GattPeripheral;
