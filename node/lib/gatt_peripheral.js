/**
* Using https://github.com/sandeepmistry/bleno
*/

console.log('peripheral using device: ', process.env.BLENO_HCI_DEVICE_ID);

var util = require('util'),
	bleno = require('bleno'),
	Promise = require('bluebird'),
	events = require('events'),
	slog = require('./server_log_queue').serverDbQueue,
	clog = require('./server_log_queue').commsDbQueue;

var CarService = require('./car_service');

var name;
var dbSource = 'gatt__peripheral';

var carService;

util.inherits(GattPeripheral, events.EventEmitter);

function GattPeripheral(_name) {
	events.EventEmitter.call(this);
	name = _name;
	carService = new CarService();
}

GattPeripheral.prototype.run = function(){

	return new Promise(function(resolve, reject){
		//start advertising!
		bleno.on('stateChange', function(state) {
			if (state === 'poweredOn') {

				//start advertising!
				bleno.startAdvertising(name, [carService.uuid], function(err) {
					if (err) {
						bleno.stopAdvertising();
						slog.push({source: dbSource, message: err, priority: 'err'});
						reject(err);
					} 
				});
			}
			else {
				bleno.stopAdvertising();
				slog.push({source: dbSource, message: name + ': bleno poweredOff - stop advertising', priority: 'info'});
				reject('Bleno is poweredoff');
			}
		});		
		
		bleno.on('advertisingStart', function(err) {
			if (!err) {			
				//Add services
				bleno.setServices([
			  		carService
				]);
				slog.push({source: dbSource, message: name + ': advertising', priority: 'info'});
				resolve();
		 	} else {
		 		slog.push({source: dbSource, message: err, priority: 'err'});
		 		reject(err);
 			} 		
		});	
	});
}
		
bleno.on('disconnect', function(clientAddress){
	var _this = this;
	
	_this.once('disconnect', clientAddress);
})
		
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

GattPeripheral.prototype.registerError = function(err){
	carService.registerError(err);
	clog.push({
		direction: 'OUT', 
		from: '',
		message: err,
		logType: '2'
	});
}


module.exports = GattPeripheral;
