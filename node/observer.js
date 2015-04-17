process.env.NOBLE_HCI_DEVICE_ID=0;

var noble = require('noble'),
	async = require('async'),	
	slog = require('./lib/server_log_queue').serverDbQueue,
	Promise = require('bluebird');
	
var GattObserver = require('./lib/gatt_observer');

var gattObserver = new GattObserver();

var runGattObserver = Promise.promisify(gattObserver.run)

//if Bluetooth is on, let's go
noble.on('stateChange', function(state) {
	if (state === 'poweredOn') {	
	
		var gattObserverPromise = runGattObserver(['c4:4f:b7:b1:41:d7'])			
			.catch(function(err) {
				console.log(err)
			});
		
		Promise.all([gattObserverPromise]).then(function() {
			console.log("all things done");
		})
		.catch(function(err) {
			console.log('err', err)
		})
/*
		gattObserver.run(['c4:4f:b7:b1:41:d7'], function(err){
			if(err){
				slog.push({
					source: 'observer', 
					message: 'error: ' + err, 
					priority: 'err'
				});
			}
		});*/
	}	
});


