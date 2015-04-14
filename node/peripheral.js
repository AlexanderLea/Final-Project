process.env.BLENO_HCI_DEVICE_ID=0;

var bleno = require('bleno'),
	async = require('async'),	
	slog = require('./server_log_queue').serverDbQueue;
	
var GattPeripheral = require('./lib/gatt_peripheral');

var gattPeripheral = new GattPeripheral();

//if Bluetooth is on, let's go
	
gattPeripheral.run(function(err){
	if(err){
		slog.push({
					source: 'observer', 
					message: 'error: ' + err, 
					priority: 'err'
				});
	}
});



