/***
* Coordinates GATT observer and peripheral roles to act as a GATT central device
*/

var logDb = require('./log_db'),
	whitelistDb = require('./whitelist_db')
	express = require('express'),
	bodyParser = require('body-parser');
	
module.exports {
	on : function(){
		var restapi = express();
		restapi.use(bodyParser.json());
		restapi.use('/', express.static(__dirname + '/public'));

		//Whitelist
		restapi.get('/api/whitelist', function(req, res){
			data = whitelistDb.whitelistAll(function(err, data){
				res.json(data);
			});
			//console.log('get all whitelist');
		});

		restapi.post('/api/whitelist', function(req, res){
			whitelistDb.whitelistAdd(req.body.mac_addr, req.body.friendly_name, req.body.description, req.body.ble_role);
	
			console.log('inserted new whitelist device');
			res.status(201).end();
		});

		//Server log
		restapi.get('/api/serverlog', function(req, res){
			data = logDb.serverLogAll(function(err, data){
				res.json(data);
				//onsole.log('get all server log.');// Data: ', data);
			});		
		});

		//Communication log
		restapi.get('/api/communicationlog', function(req, res){
			data = logDb.commsLogAll(function(err, data){
				res.json(data);
			});
				//console.log('get all comms log');
		});

		restapi.listen(3000);

		console.log('server running on http://localhost:3000/')
	}
}

