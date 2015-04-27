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
	slog 	= require('./lib/server_log_queue').serverDbQueue,	
	GattPeripheral 	= require('./lib/gatt_peripheral'),
	GattObserver 	= require('./lib/gatt_observer');
	
//initialise Observer and Peripheral
var gattPeripheral = new GattPeripheral('RPI_Observer', false);
var gattObserver = new GattObserver();

//setup GPIO on pin 26
gpio.setup(26, gpio.DIR_OUT, gpioCallback)
gpio.setup(24, gpio.DIR_OUT, gpioCallback)
var tick, indicatorOn;

function gpioCallback(){};

gattObserver.run(['00:1a:7d:da:71:0c'])
/*
var gattPeripheralPromise = gattPeripheral.run()
		.then(function() {
			
			//3
			bleno.on('accept', function(clientAddress) {
				//serverAddr = clientAddress
				console.log('Connected to ' + clientAddress + ' as peripheral sender');
				
				return gattObserver.run(['00:1a:7d:da:71:0c']);				
			});

		},
		function(err){
			console.log(err);
		})
		.catch(function(err) {
			console.log(err)
		});							
		*/
//3.2.1
gattObserver.on('data-recieved', function(data) {
	//3.2.1.1
	switch(data.toString('hex')){
		/* Indicator on */
		case '242000201000efdf':
			console.log('indicator on');
			tick = setInterval(function(){
				indicatorOn = !indicatorOn;   
				gpio.write(26, indicatorOn, function(err){
				  if (err) throw err;
			  	});
			  }, 500);
			break;
		/* Indicator off */			
		case '2c2000201000efdf':
			console.log('indicator off');
			clearInterval(tick);
			gpio.write(26, false, function(err){
				  if (err) throw err;
				  indicatorOn = false;     
			  	});
			break;
		/* Brake on */
		case '342000201000efdf':
			console.log('brake on');
			gpio.write(24, true, function(err){
				  if (err) throw err;
				  indicatorOn = false;     
			  	});
			break;
		/* Brake off */			
		case '342000201000efdf':
			console.log('brake off');
			gpio.write(24, false, function(err){
				  if (err) throw err;
				  indicatorOn = false;     
			  	});
			break;
	}
	
	//console.log('data recieved!: ', data.toString('hex'));
});

//TODO: Random time errors
var randomErrGenerator = setInterval(function(){
	gattPeripheral.registerError('34');
}, Math.random()*100000)
/*
gattPeripheral.on('disconnect', function(clientAddress){
	slog.push({
		source: 'rpi observer', 
		message: 'disconnected', 
		priority: 'info'
	});	
	gattPeripheral.stop();
});*/
