process.env.BLENO_HCI_DEVICE_ID=0;

var bleno = require('bleno'),
	async = require('async');
	
var GattPeripheral = require('./lib/gatt_peripheral');

var gattPeripheral = new GattPeripheral();

//if Bluetooth is on, let's go
	
		gattPeripheral.run(function(err){
			if(err){
				//TODO: do something with error
			}
		});



