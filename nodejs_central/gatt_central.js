/**
* Using https://github.com/sandeepmistry/noble, which using Bluez
* Based fairly heavily on the demos on the wiki
*/

var noble = require('noble');
var GattObserver = require('./gatt_central_observer');
var GattPeripheral = require('./gatt_central_peripheral')

//var gattPeripheral = new GattPeripheral();
var gattObserver = new GattObserver();

//gattPeripheral.run();

gattObserver.run();

gattObserver.on('data-recieved', function(data){
	console.log('server ', data);
});

/*function(err, data){		
	//return when command is recieved
	
	g
	console.log('Central: ', data);
	//gattObserver.sendCommand('command');
});
*/
