console.log('observer using device: ', process.env.NOBLE_HCI_DEVICE_ID);

var noble = require('noble'),
	events = require('events'),
	util = require('util'),
	async = require('async'),
	Promise = require('bluebird'),
	slog = require('./server_log_queue').serverDbQueue,
	clog = require('./server_log_queue').commsDbQueue,
	db = require('../api/whitelist_db');

/** UUID declaration */
var carServiceUuid		= '2a67';
var carCharacteristicUuid 	= '1817';
var errorCharacteristicUuid = '1818';

/** Variable to hold carCharacteristic */
var carCharacteristic = null;

var dbSource = 'gatt_observer';

function GattObserver() {
	events.EventEmitter.call(this);
}

util.inherits(GattObserver, events.EventEmitter);

GattObserver.prototype.run = function(whitelist, runCallback){
	var devCount = 0;
	var _this = this;
	
	noble.startScanning();
	slog.push({
		source: dbSource, 
		message: 'scanning for peripherals', 
		priority: 'info'
	});	

	return new Promise(function(resolve, reject){
		var timer = setTimeout(function(){
			if(devCount === whitelist.length){
				clearTimeout(timer)
				resolve();
			} else {						
				noble.stopScanning();				
				slog.push({
					source: dbSource, 
					message: 'connection timeout - not all whitelist devices connected', 
					priority: 'err'
				});
				reject('Timeout - not all whitelist devices discovered');
			}
		}, 10000)
	
		noble.on('discover', function(peripheral) {
			//if MAC is in whitelist
			if(whitelist.indexOf(peripheral.address) > -1){
				//connect
				peripheral.connect(function(err) {
					devCount++;					

					//console.log('connecting to ', peripheral.address)
					//log in database
					slog.push({
						source: dbSource, 
						message: peripheral.address + ': connected', 
						priority: 'info'
					});
					peripheral.on('disconnect', function(){
						slog.push({
							source: dbSource, 
							message: peripheral.address + ': disconnected', 
							priority: 'err'
						});
					});
					peripheral.discoverSomeServicesAndCharacteristics(
						[carServiceUuid], [carCharacteristicUuid, errorCharacteristicUuid], 
						function(err, services, characteristics){
				
						characteristics.forEach(function(characteristic){
						
							//read characteristic value
							characteristic.on('data', function(data, isNotification) { 
								
		 						if(characteristic.uuid == errorCharacteristicUuid){
		 							clog.push({
			 							direction: 'IN', 
			 							from: peripheral.address,
			 							message: data.toString('hex'),
			 							logType: '2'
									});
		 						} else {
			 						//emit data-recieved event
			 						_this.emit('data-recieved', data);
			 						
			 						clog.push({
			 							direction: 'IN', 
			 							from: peripheral.address,
			 							message: data.toString('hex'),
			 							logType: '1'
									});		
								}					
							});

							//enable notifications so we get updates
							characteristic.notify(true, function(error) {
								//log in database
								slog.push({
									source: dbSource,
									message: peripheral.address 
										+ ', characteristic: ' 
										+ characteristic.uuid
										+ ': listening for notifications', 
									priority: 'info'
								});			
								//callback
								//resolve();						
							});					
						})									
					});//perhaps reject something?
				});					
			}
		});
	});					
}

module.exports = GattObserver;
