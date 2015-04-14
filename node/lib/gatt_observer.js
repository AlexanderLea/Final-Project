/**
* Using https://github.com/sandeepmistry/noble, which using Bluez
* Based fairly heavily on the demos on the wiki
*/	

console.log('observer using device: ', process.env.NOBLE_HCI_DEVICE_ID);

var noble = require('noble'),
	events = require('events'),
	sys = require('sys'),
	async = require('async'),
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
	//construct object
	events.EventEmitter.call(this);
}
sys.inherits(GattObserver, events.EventEmitter);


GattObserver.prototype.run = function(whitelist, runCallback){
	var self = this;
	
	noble.startScanning();
	slog.push({
		source: dbSource, 
		message: 'scanning for peripherals', 
		priority: 'info'
	});		

	//This won't deal with multiple devices!!
	noble.on('discover', function(peripheral) {
		//if MAC is in whitelist
		if(whitelist.indexOf(peripheral.address) > -1){
			//connect
			peripheral.connect(function(err) {
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
	 						//console.log('observer data', data);
	 						self.emit('data-recieved', data);
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
							runCallback(null);						
						});						
					})									
				});
			});
					
		}
		else {
			console.log('not connecting to: ', peripheral.address);
			runCallback(null);
		}
	});
}

GattObserver.prototype.stop = function(){
	console.log("this does nothing. TODO");	
}

module.exports = GattObserver;
