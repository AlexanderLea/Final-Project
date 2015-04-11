var //http = require('http'),
	//url = require('url'),
	logDb = require('./log_db'),
	whitelistDb = require('./whitelist_db')
	express = require('express'),
	bodyParser = require('body-parser');
	
var restapi = express();
restapi.use(bodyParser.json());

//Whitelist
restapi.get('/whitelist', function(req, res){
	data = whitelistDb.whitelistAll(function(err, data){
		res.json(data);
	});
	console.log('get all whitelist');
});

restapi.post('/whitelist', function(req, res){
	whitelistDb.whitelistAdd(req.body.mac_addr, req.body.friendly_name, req.body.description, req.body.ble_role);
	
	console.log('inserted new whitelist device');
	res.status(201).end();
});

//Server log
restapi.get('/serverlog', function(req, res){
	data = logDb.serverLogAll(function(err, data){
		res.json(data);
	});
		console.log('get all server log');
});

//Communication log
restapi.get('/communicationlog', function(req, res){
	data = logDb.commsLogAll(function(err, data){
		res.json(data);
	});
		console.log('get all comms log');
});

restapi.listen(3000);

console.log('server running on http://localhost:3000/xyz')
