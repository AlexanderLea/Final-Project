process.env.NOBLE_HCI_DEVICE_ID=0;
process.env.BLENO_HCI_DEVICE_ID=1;

var noble 	= require('noble'),
	async 	= require('async'),
	db		= require('./api/whitelist_db'),
	Promise = require('bluebird');
	
var GattObserver = require('./lib/gatt_observer');
var GattPeripheral = require('./lib/gatt_peripheral');

//Instantiate objects
var gattPeripheral = new GattPeripheral('CAR_Central');
var gattObserver = new GattObserver();

var whitelistAll = Promise.promisify(db.whitelistAll)
var runGattPeripheral = Promise.promisify(gattPeripheral.run)

//if Bluetooth is on, let's go
noble.on('stateChange', function(state) {
	if (state === 'poweredOn') {	
		//TODO: need to run API server here too!
		var gattObserverPromise = whitelistAll()
			.then(function(rows) {
				return rows.map(function(row){
					return row.mac_addr.toLowerCase()
				})
			})
			.then(function(macAddresses) {
				return gattObserver.run(macAddresses)
			})
			.catch(function(err) {
				console.log(err)
			});

		var gattPeripheralPromise = runGattPeripheral()
			.catch(function(err) {
				console.log(err)
			})

		Promise.all([gattObserverPromise, gattPeripheralPromise]).then(function() {
			console.log("all things done");
		})
		.catch(function(err) {
			console.log(err)
		})		
	}
	else { //don't scan		
		gattPeripheral.stop();
		gattObserver.stop();
	}
});

gattObserver.on('data-recieved', function(data) {
	//console.log('recieved (buffer) ', data);	
	gattPeripheral.broadcastCommand(data);
});
