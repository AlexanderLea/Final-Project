/**
* Using https://github.com/sandeepmistry/bleno
*/

var util = require('util');
var bleno = require('bleno');

var CarService = require('./car_service');

var name = 'BLE_Central';

var carService;

//TODO: on connection and disconnection events

function GattPeripheral() {
	carService = new CarService();
	
}

GattPeripheral.prototype.run = function(callback){
	//
	// Wait until the BLE radio powers on before attempting to advertise.
	// If you don't have a BLE radio, then it will never power on!
	//
	//bleno.on('stateChange', function(state) {
	//	if (state === 'poweredOn') {
		//
		// We will also advertise the service ID in the advertising packet,
		// so it's easier to find.
		//
			bleno.startAdvertising(name, [carService.uuid], function(err) {
			  	if (err) {
			   		console.log(err);
			  	}
			});
	  //}
	  //else {
	//	bleno.stopAdvertising();
	  //}
		//});

	bleno.on('advertisingStart', function(err) {
	  if (!err) {
		console.log('advertising...');
		//
		// Once we are advertising, it's time to set up our services,
		// along with our characteristics.
		//
		bleno.setServices([
	  		carService
		]);
		
		//return callback
		callback(null);
	 } else{
	 	console.log('err ', err);
	 }
	});
}

GattPeripheral.prototype.stop = function(){
	console.log("Stop peripheral");
	bleno.stopAdvertising();
}

GattPeripheral.prototype.broadcastCommand = function(_cmd){
	carService.sendCommand(_cmd);
}

module.exports = GattPeripheral;
