/**
* Using https://github.com/sandeepmistry/noble, which using Bluez
* Based fairly heavily on the demos on the wiki
*/
process.env.NOBLE_HCI_DEVICE_ID=0;
process.env.BLENO_HCI_DEVICE_ID=1;

var noble = require('noble'),
	async = require('async');
	
var GattObserver = require('./gatt_central_observer');
var GattPeripheral = require('./gatt_central_peripheral');

//Instantiate objects
var gattPeripheral = new GattPeripheral();
var gattObserver = new GattObserver();

var peripheralRunning = false, observerRunning = false;

//if Bluetooth is on, let's go
noble.on('stateChange', function(state) {
	if (state === 'poweredOn') {		
		async.parallel([
			//start Gatt Observer
			function(observerCallback){
				gattObserver.run(function(err){
					if(err){
						observerCallback(err);
					} else {
						observerRunning = true;
						observerCallback();
					}
				});
			},
			//start Gatt Peripheral
			function(peripheralCallback){
				gattPeripheral.run(function(err){
					if(err){
						peripheralCallback(err);
					} else {
						observerRunning = true;
						peripheralCallback();
					}
				});
			}
		], function(err){
			if(err){
				console.log(err);
			} else {
				console.log('both running!');
			}
		});
		
	}
	else { //don't scan		
		gattPeripheral.stop();
		gattObserver.stop();
	}
});

gattObserver.on('data-recieved', function(data) {
	//console.log('recieved (buffer) ', data);	
	gattPeripheral.broadcastCommand(data.toString('hex'));
});
