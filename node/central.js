/***
* Coordinates GATT observer and peripheral roles to act as a GATT central device
*/

process.env.NOBLE_HCI_DEVICE_ID=0;
process.env.BLENO_HCI_DEVICE_ID=1;

var noble 	= require('noble'),
	async 	= require('async'),
	db		= require('./api/whitelist_db'),
	slog 	= require('./lib/server_log_queue').serverDbQueue,
	Promise = require('bluebird'),
	api 	= require('./api/server');
	
var GattObserver = require('./lib/gatt_observer');
var GattPeripheral = require('./lib/gatt_peripheral');

//Instantiate objects
var gattPeripheral = new GattPeripheral('CAR_Central', true);
var gattObserver = new GattObserver();

var whitelistAll = Promise.promisify(db.whitelistAll)

//if Bluetooth is on, let's go
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

var gattPeripheralPromise = gattPeripheral.run()
	.catch(function(err) {
		console.log(err)
	})		

api.on();

gattObserver.on('data-recieved', function(data) {
	//console.log('recieved (buffer) ', data);	
	gattPeripheral.broadcastCommand(data);
});

/*
gattPeripheral.on('disconnect', function(clientAddr){
	console.log('disconnected');
	//slog.push({
	//	source: 'central', 
	//	message: clientAddr + ' disconnected', 
	//	priority: 'err'
	//});
});*/
