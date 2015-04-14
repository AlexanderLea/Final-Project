process.env.NOBLE_HCI_DEVICE_ID=0;

var noble = require('noble'),
	async = require('async'),	
	slog = require('./server_log_queue').serverDbQueue;
	
var GattObserver = require('./lib/gatt_observer');

var gattObserver = new GattObserver();

//if Bluetooth is on, let's go
noble.on('stateChange', function(state) {
	if (state === 'poweredOn') {	
	
		gattObserver.run(function(err){
			if(err){
				slog.push({
					source: 'observer', 
					message: 'error: ' + err, 
					priority: 'err'
				});
			}
		});
	}	
});


