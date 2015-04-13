process.env.NOBLE_HCI_DEVICE_ID=0;

var noble = require('noble'),
	async = require('async');
	
var GattObserver = require('./lib/gatt_observer');

var gattObserver = new GattObserver();

//if Bluetooth is on, let's go
noble.on('stateChange', function(state) {
	if (state === 'poweredOn') {	
	
		gattObserver.run(function(err){
			if(err){
				//TODO: do something with error
			}
		});
	}	
});


