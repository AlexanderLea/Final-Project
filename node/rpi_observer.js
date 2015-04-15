/**
* 1 - advertise service
* 2 - wait for connection
* 3 - on connection
* 3.1 - scan
* 3.2 - connect to server
* 3.2.1 - listen to server
* 3.2.1.1 - if incoming message, do something
* 3.2.2 - listen to hardware
* 3.2.2.1 - if err, report it
*/

process.env.NOBLE_HCI_DEVICE_ID=0;
process.env.BLENO_HCI_DEVICE_ID=1;

var bleno = require('bleno'),
	async = require('async'),
	Promise = require("bluebird"),
	GattPeripheral = require('./lib/gatt_peripheral'),
	GattObserver = require('./lib/gatt_observer');
	
//initialise Observer and Peripheral
var gattPeripheral = new GattPeripheral('RPI_Observer');
var gattObserver = new GattObserver();

var runGattObserver = Promise.promisify(gattObserver.run)
var runGattPeripheral = Promise.promisify(gattPeripheral.run)

var serverAddr;

//1
var gattPeripheralPromise = runGattPeripheral()
		.then(function() {
			//3
			bleno.on('accept', callback(clientAddress){
				serverAddr = clientAddress
				return clientAddress;
			});
		})
		.then(function(clientAddress) {
			//3.1 & 3.2
			return runGattObserver([clientAddress])
		})
		.catch(function(err) {
			console.log(err)
		});		

//3.2.1
gattObserver.on('data-recieved', function(data) {
	//3.2.1.1
	console.log('data recieved!: ', data.toString('hex'));
});
