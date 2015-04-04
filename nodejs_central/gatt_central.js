/**
* Using https://github.com/sandeepmistry/noble, which using Bluez
* Based fairly heavily on the demos on the wiki
*/

var noble = require('noble');
var observer = require('./gatt_central_observer');
var broadcaster = require('/gatt_central_peripheral')

var gattObserver = new observer();
var gattBroadcaster = new broadcaster();

gattBroadcaster.run();

gattObserver.run(function(err, data){
	//return when command is recieved
	
	gattObserver.sendCommand('command');
});

