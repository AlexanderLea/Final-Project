/**
* Using https://github.com/sandeepmistry/noble, which using Bluez
* Based fairly heavily on the demos on the wiki
*/

var noble = require('noble'),
	events = require('events'),
	sys = require('sys'),
	async = require('async'),
	db = require('./log_database');

/** UUID declaration */
var carServiceUuid		= '2a67';
var carCharacteristicUuid 	= '1817';
var errorServiceUuid = '';

/** Variable to hold carCharacteristic */
var carCharacteristic = null;

var dbSource = 'gatt_central_observer';

function GattObserver() {
	//construct object
	events.EventEmitter.call(this);
}
sys.inherits(GattObserver, events.EventEmitter);


GattObserver.prototype.run = function(callback){
	var self = this;

	noble.startScanning();
	console.log('scanning');
	db.serverLogAdd(dbSource, 'scanning for peripherals', []);
	
	/** Listen to onDiscover to hopefully discover some devices. */
	noble.on('discover', function(peripheral) {
	
		//We found one!
		console.log('found peripheral:', peripheral.advertisement.localName);
	
		//Connect to everything!! TODO: only connect to whitelist devices
		peripheral.connect(function(err) {
			console.log('connected to: ', peripheral.advertisement.localName);
			//var x = 'connected to ' + peripheral.advertisement.localName;
			//db.serverLogAdd(dbSource, x, []);
			
			//We are now connected, so discover if it exposes carServiceUuid
			peripheral.discoverServices([carServiceUuid], function(err, services) {
				services.forEach(function(service) {
				
					//If it's found, it must have that service running
					console.log('found car comms service:', service.uuid);

					// So, discover its characteristics.
					service.discoverCharacteristics([carCharacteristicUuid], function(err, characteristics) {
						characteristics.forEach(function(characteristic) {
						
							//found a characteristic
							console.log('found characteristic:', characteristic.uuid, ' in service: ', service.uuid);

							//is it the characteristic we're looking for?
							//TODO: Perhaps car and error should be characteristics in the same service rather than different services?
							if (carCharacteristicUuid == characteristic.uuid) {
								//yes it is!
								//get characteristic object
								carCharacteristic = characteristic;
						
								//read characteristic value
								carCharacteristic.on('read', function(data, isNotification) { 					
			 						//console.log('observer data', data);
			 						self.emit('data-recieved', data);
								});

								//enable notifications so we get updates
								carCharacteristic.notify(true, function(error) {
									console.log('listening...');
									//TODO: need fancy async stuf
									//db.serverLogAdd(dbSource, 
									//	'listening to '+ peripheral.advertisement.localName +' for notifications'
									//	, []);
									
								});
								
								callback(null);
							}
							else {
								console.log('cannot find car comms characteristic');
							}
						});
					});
				});
			});
		});
	});
}

GattObserver.prototype.stop = function(){
	console.log('TODO: need to close some stuff here.');
}

module.exports = GattObserver;
