process.env.NOBLE_HCI_DEVICE_ID=0;

var bleno = require('bleno'),
	async = require('async');
	
var GattPeripheral = require('./lib/gatt_peripheral');

var gattPeripheral = new GattPeripheral();

//if Bluetooth is on, let's go
bleno.on('stateChange', function(state) {
	if (state === 'poweredOn') {	
	
		gattPeripheral.run(function(err){
			if(err){
				//log error
			}
		});
	}	
});


