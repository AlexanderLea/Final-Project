var noble = require('noble');

/** UUID declaration */
var carServiceUuid		= '2a67';
var carCharacteristicUuid 	= '1817';
var errorServiceUuid = '';

/** Variable to hold carCharacteristic */
var carCharacteristic = null;

noble.on('stateChange', function(state) {
	if (state === 'poweredOn') { //If bluetooth, scan
		console.log('scanning...');
		noble.startScanning();
	}
	else { //don't scan
		noble.stopScanning();
	}
});

/** Listen to onDiscover to hopefully discover some devices. */
noble.on('discover', function(peripheral) {
	
	//We found one!
	console.log('found peripheral:', peripheral.advertisement.localName);
	
	//Connect to everything!! TODO: only connect to whitelist devices
	peripheral.connect(function(err) {
		console.log('conntected to: ', peripheral.advertisement.localName);
		
		//We are now connected, so discover if it exposes carServiceUuid
		peripheral.discoverServices([carServiceUuid], function(err, services) {
			services.forEach(function(service) {
				
				//If it's found, it must have that service running
				console.log('found car comms service:', service.uuid);

				// So, discover its characteristics.
				service.discoverCharacteristics([], function(err, characteristics) {
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
	     						console.log('data', data);
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
