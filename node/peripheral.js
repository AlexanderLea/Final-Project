/***
* Advertises services as a peripheral. Used for dev testing, not in prototype
*/

process.env.BLENO_HCI_DEVICE_ID=1;

var bleno = require('bleno'),
	async = require('async'),	
	slog = require('./lib/server_log_queue').serverDbQueue,
	Promise = require('bluebird');
	
var GattPeripheral = require('./lib/gatt_peripheral');

var gattPeripheral = new GattPeripheral('TEST_PERIPHERAL', true);

//if Bluetooth is on, let's go
	
var gattPeripheralPromise = gattPeripheral.run()
			.catch(function(err) {
				console.log(err)
			})
			
var i = 1;
var randomErrGenerator = setInterval(function(){
	i++;
	gattPeripheral.registerError(i.toString());
}, Math.random()*100000)			


