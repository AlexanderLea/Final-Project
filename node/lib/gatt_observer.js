console.log('observer using device: ', process.env.NOBLE_HCI_DEVICE_ID);

var noble = require('noble'),
	events = require('events'),
	util = require('util'),
	async = require('async'),
	Promise = require('bluebird'),
	slog = require('./server_log_queue').serverDbQueue,
	clog = require('./server_log_queue').commsDbQueue,
	db = require('../api/whitelist_db');

/** UUID declaration */
var carServiceUuid		= '2a67';
var carCharacteristicUuid 	= '1817';
var errorCharacteristicUuid = '1818';

/** Variable to hold carCharacteristic */
var carCharacteristic = null;

var dbSource = 'gatt_central_observer';

function GattObserver() {
	events.EventEmitter.call(this);
}

util.inherits(GattObserver, events.EventEmitter);

GattObserver.prototype.run = function(whitelist, runCallback){

	var _this = this;
	
	noble.startScanning();
	slog.push({
		source: dbSource, 
		message: 'scanning for peripherals', 
		priority: 'info'
	});	

return new Promise(function(resolve, reject){
	noble.on('discover', function(peripheral) {
		//if MAC is in whitelist
		if(whitelist.indexOf(peripheral.address) > -1){
			//connect
			peripheral.connect(function(err) {
				console.log('connecting to ', peripheral.address)
				//log in database
				slog.push({
					source: dbSource, 
					message: peripheral.address + ': connected', 
					priority: 'info'
				});
				
				peripheral.discoverSomeServicesAndCharacteristics(
					[carServiceUuid], [carCharacteristicUuid, errorCharacteristicUuid], 
					function(err, services, characteristics){
				
					characteristics.forEach(function(characteristic){
						
						//read characteristic value
						characteristic.on('data', function(data, isNotification) { 
							//emit data-recieved event
	 						_this.emit('data-recieved', data);
	 						
							//TODO: Distinguish between errors and normal messages
	 						clog.push({
	 							direction: 'IN', 
	 							from: peripheral.address,
	 							message: data.toString('hex'),
	 							logType: '1'
							});							
						});

						//enable notifications so we get updates
						characteristic.notify(true, function(error) {
							//log in database
							slog.push({
								source: dbSource,
								message: peripheral.address 
									+ ', characteristic: ' 
									+ characteristic.uuid
									+ ': listening for notifications', 
								priority: 'info'
							});			
							//callback
							resolve();						
						});						
					})									
				});//perhaps reject something?
			});
					
		}
		else {
			//console.log('not connecting to: ', peripheral.address);
			resolve();
		}
	});
});

	

	
}

GattObserver.prototype.stop = function(){
	console.log("this does nothing. TODO");	
}

module.exports = GattObserver;
