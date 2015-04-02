// Hello.
//
// This is JSHint, a tool that helps to detect errors and potential
// problems in your JavaScript code.
//
// To start, simply enter some JavaScript anywhere on this page. Your
// report will appear on the right side.
//
// Additionally, you can toggle specific options in the Configure
// menu.

var noble = require('noble');

var carServiceUuid		= '2a67';
var carCharacteristicUuid 	= '1817';
var errorServiceUuid = '';

noble.on('stateChange', function(state) {
	if (state === 'poweredOn') {
		//
		// Once the BLE radio has been powered on, it is possible
		// to begin scanning for services. Pass an empty array to
		// scan for all services (uses more time and power).
		//
		console.log('scanning...');
		noble.startScanning();
	}
	else {
		noble.stopScanning();
	}
});

var carCharacteristic = null;

noble.on('discover', function(peripheral) {
	//
	// The advertisment data contains a name, power level (if available),
	// certain advertised service uuids, as well as manufacturer data,
	// which could be formatted as an iBeacon.
	//

	console.log('found peripheral:', peripheral.advertisement);
	//
	// Once the peripheral has been discovered, then connect to it.
	// It can also be constructed if the uuid is already known.
	///
	peripheral.connect(function(err) {
		console.log('connected');
		
		
		
	
		//
		// Once the peripheral has been connected, then discover the
		// services and characteristics of interest.
		//
		peripheral.discoverServices([carServiceUuid], function(err, services) {
			services.forEach(function(service) {
				//
				// This must be the service we were looking for.
				//
				console.log('found service:', service.uuid);

				//
				// So, discover its characteristics.
				//
				service.discoverCharacteristics([], function(err, characteristics) {

					characteristics.forEach(function(characteristic) {
						//
						// Loop through each characteristic and match them to the
						// UUIDs that we know about.
						//
						console.log('found characteristic:', characteristic.uuid);

						if (carCharacteristicUuid == characteristic.uuid) {
							carCharacteristic = characteristic;
						}

						//
						// Check to see if we found all of our characteristics.
						//
						if (carCharacteristic) { //TODO: Perhaps car and error should be characteristics in the same service}
							//listen
							
							
							//Reading characteristics works olay!
							carCharacteristic.read(function(error, data){
								if(!err) {
									console.log('Data recieved: ', data);
								} else {
									console.log('err reading: ', err);
								}
							});
							
							
						}
						else {
							console.log('missing characteristics');
						}
					});
				});
			});
		});
	});
});
  
function blah() {
	console.log('Oooh data');
	/*carCharacteristic.on('read', function(data, isNotification) {
		console.log('Oooh data');
            
		if (data.length === 1) { //check data validity
	 		var result = data.readUInt8(0);
	  		//get data
		}
		else {
	 		console.log('result length incorrect')
		}
	});*/
}
