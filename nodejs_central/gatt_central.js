/**
* Using https://github.com/sandeepmistry/noble, which using Bluez
* Based fairly heavily on the demos on the wiki
*/

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
		
		gattObserver.run(function(err){
			if(!err){
				observerRunning = true;
				//gattPeripheral.run(function(err){
				//	if(!err){
				//		peripheralRunning = true;
				//	}
				//});
			} else {
				console.log('err: ', err);
			}
		});		
	}
	else { //don't scan		
		gattPeripheral.stop();
		gattObserver.stop();
	}
});

gattObserver.on('data-recieved', function(data) {
	console.log('recieved (buffer) ', data);	
	//gattPeripheral.broadcastCommand("poo");
});
