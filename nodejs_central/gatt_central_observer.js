/**
* Using https://github.com/sandeepmistry/noble, which using Bluez
* Based fairly heavily on the demos on the wiki
*/

var noble = require('noble'),
	events = require('events');

/** UUID declaration */
var carServiceUuid		= '2a67';
var carCharacteristicUuid 	= '1817';
var errorServiceUuid = '';

/** Variable to hold carCharacteristic */
var carCharacteristic = null;

function GattObserver() {
	//construct object
	events.EventEmitter.call(this);
	
	//start scanning
	noble.on('stateChange', function(state) {
		if (state === 'poweredOn') { //If bluetooth, scan
			console.log('scanning...');
			noble.startScanning();
		}
		else { //don't scan
			noble.stopScanning();
			console.log('Adapter isn\'t on - error!');
		}
	});
}

GattObserver.prototype.run = function(){
	var self = this;
	
	/** Listen to onDiscover to hopefully discover some devices. */
	noble.on('discover', function(peripheral) {
	
		//We found one!
		console.log('found peripheral:', peripheral.advertisement.localName);
	
		//Connect to everything!! TODO: only connect to whitelist devices
		peripheral.connect(function(err) {
			console.log('connected to: ', peripheral.advertisement.localName);
			
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
			 						//Buffer buf = data;
			 						console.log('observer data', data);
			 						self.emit('data-recieved', data);
			 						//readValueCallback(null, data);
			 						
	//	     						initiate callback
								});

								//enable notifications so we get updates
								carCharacteristic.notify(true, function(error) {
									console.log('listening...');
								});
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

module.exports = GattObserver;
