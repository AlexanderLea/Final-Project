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

var bleno 	= require('bleno'),
	async 	= require('async'),
	Promise = require('bluebird'),
	gpio 	= require('rpi-gpio'),
	GattPeripheral 	= require('./lib/gatt_peripheral'),
	GattObserver 	= require('./lib/gatt_observer');
	
//initialise Observer and Peripheral
var gattPeripheral = new GattPeripheral('RPI_Observer');
var gattObserver = new GattObserver();

//setup GPIO on pin 26
gpio.setup(26, gpio.DIR_OUT, gpioCallback)
var tick, indicatorOn;

function gpioCallback(){};

//1
var gattPeripheralPromise = gattPeripheral.run()
		.then(function(msg) {
			
			//3
			bleno.on('accept', function(clientAddress) {
				//serverAddr = clientAddress
				console.log('Connected to ' + clientAddress + ' as peripheral sender');
				
//connect to 5C:F3:70:60:DC:38
				return gattObserver.run(['00:1a:7d:da:71:0c'])
				
			});

		},
		function(err){
			console.log(err);
		})
		//.then(function(clientAddress) {
		//	console.log('running observer');
			//3.1 & 3.2
			
		//})
		.catch(function(err) {
			console.log(err)
		});							
		

Promise.all([gattPeripheralPromise]).then(function() {
			//peripheral has finished, so now run observer
			//console.log('peripheral has connected - run observer');
			//gattObserver.run([serverAddr]);
		})
		.catch(function(err) {
			console.log(err)
		})	

//3.2.1
gattObserver.on('data-recieved', function(data) {
	//3.2.1.1
	switch(data.toString('hex')){
		case '2220002032000000':
			console.log('indicator on');
			tick = setInterval(function(){
				gpio.write(26, indicatorOn, function(err){
				  if (err) throw err;
				  indicatorOn = !on;   
			  	});
			  }, 500);
			break;
		case '2a20002032000000':
			console.log('indicator off');
			clearInterval(tick);
			gpio.write(26, indicatorOn, function(err){
				  if (err) throw err;
				  indicatorOn = !on ;     
			  	});
			break;
	}
	
	console.log('data recieved!: ', data.toString('hex'));
});
