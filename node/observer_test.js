process.env.NOBLE_HCI_DEVICE_ID=0;

var noble = require('noble'),
	async = require('async'),
	db = require('./api/whitelist_db');
	
var GattObserver = require('./gatt_central_observer');

var gattObserver = new GattObserver();

var peripheralRunning = false, observerRunning = false;

//if Bluetooth is on, let's go
noble.on('stateChange', function(state) {
	if (state === 'poweredOn') {	
	
		gattObserver.run(function(err){
			if(!err){
				//observerCallback(err);
			} else {
				observerRunning = true;
				//observerCallback();
			}
		});
	}	
});


