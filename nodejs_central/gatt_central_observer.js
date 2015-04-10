/**
* Using https://github.com/sandeepmistry/noble, which using Bluez
* Based fairly heavily on the demos on the wiki
*/	

console.log('observer using device: ', process.env.NOBLE_HCI_DEVICE_ID);

var noble = require('noble'),
	events = require('events'),
	sys = require('sys'),
	slog = require('./server_log_queue').serverDbQueue,
	clog = require('./server_log_queue').commsDbQueue;

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
	//console.log('scanning');
	//log in database
	slog.push({source: dbSource, message: 'scanning for peripherals', priority: 'info'});
		
	/** Listen to onDiscover to hopefully discover some devices. */
	noble.on('discover', function(peripheral) {
	
		//We found one!
		//log in database
		slog.push({source: dbSource, message: peripheral.advertisement.localName + ': found', priority: 'info'});
		
		//Connect to everything!! TODO: only connect to whitelist devices
		if(peripheral.advertisement.localName != 'BLE_Central'){
			peripheral.connect(function(err) {
				//log in database
				slog.push({source: dbSource, message: peripheral.advertisement.localName + ': connected', priority: 'info'});
			
				//We are now connected, so discover if it exposes carServiceUuid
				peripheral.discoverServices([carServiceUuid], function(err, services) {
					services.forEach(function(service) {
				
						//If it's found, it must have that service running
						//log in database
						slog.push({source: dbSource, message: peripheral.advertisement.localName + ': found service: ' + service.uuid, priority: 'info'});

						// So, discover if it has the carChatacteristic
						//TODO: Perhaps car and error should be characteristics in the same service rather than different services?
						service.discoverCharacteristics([carCharacteristicUuid], function(err, characteristics) {
							characteristics.forEach(function(characteristic) {
													
								//get characteristic object
								carCharacteristic = characteristic;
					
								//read characteristic value
								carCharacteristic.on('read', function(data, isNotification) { 					
			 						//console.log('observer data', data);
			 						self.emit('data-recieved', data);
									//direction, from, message, logType
			 						clog.push({
			 							direction: 'IN', 
			 							from: 'TODO: '+ peripheral.advertisement.localName,
			 							message: data.toString('hex'),
			 							logType: '1'
		 							});
								});

								//enable notifications so we get updates
								carCharacteristic.notify(true, function(error) {
									//log in database
									slog.push({source: dbSource, message: peripheral.advertisement.localName + ': listening for notifications', priority: 'info'});									
								});
							
								callback(null);
							});
						});
					});
				});
			});
		}
	});
}

GattObserver.prototype.stop = function(){
	//TODO
	console.log('TODO: need to close some stuff here.');
}

module.exports = GattObserver;
