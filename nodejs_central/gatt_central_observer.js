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

var dbQueue = async.queue(function(data, callback){
	//for each item in queue, call save to db method, replacing any null
	// character values in the string
	db.serverLogAdd(dbSource, data.message.replace('\0', ''));
	console.log(data);
	callback();
}, 2);

//Callback for when the queue is empty
dbQueue.drain = function(){
	//console.log('all items have been processed');
}

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
	dbQueue.push({message: 'scanning for peripherals'});
		
	/** Listen to onDiscover to hopefully discover some devices. */
	noble.on('discover', function(peripheral) {
	
		//We found one!
		//log in database
		dbQueue.push({message: peripheral.advertisement.localName + ': found'});
	
		//Connect to everything!! TODO: only connect to whitelist devices
		peripheral.connect(function(err) {
			//log in database
			dbQueue.push({message: peripheral.advertisement.localName + ': connected'});
			
			//We are now connected, so discover if it exposes carServiceUuid
			peripheral.discoverServices([carServiceUuid], function(err, services) {
				services.forEach(function(service) {
				
					//If it's found, it must have that service running
					//log in database
					dbQueue.push({message: peripheral.advertisement.localName + ': found service: ' + service.uuid});

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
							});

							//enable notifications so we get updates
							carCharacteristic.notify(true, function(error) {
								//log in database
								dbQueue.push({message: peripheral.advertisement.localName + ': listening for notifications'});									
							});
							
							callback(null);
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
