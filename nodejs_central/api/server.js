var //http = require('http'),
	//url = require('url'),
	logDb = require('./log_db'),
	whitelistDb = require('./whitelist_db')
	express = require('express');
	
var restapi = express();

restapi.get('/whitelist', function(req, res){
	data = whitelistDb.whitelistAll(function(err, data){
		res.json(data);
	});
});

restapi.listen(3000);

console.log('server running on http://localhost:3000/xyz')
/*
var routes = {
  "/whitelist": function(parsedUrl) {    
    var whitelist;
    
    whitelistDb.whitelistAll(function(err, data){
    	if(!err) {
    		return {
				id 				: data.id,
				mac_addr 		: data.mac_addr,
				friendly_name	: data.friendly_name,
				description		: data.description,
				ble_role		: data.ble_role
			};
		}
    });
    
    
  },
  "/serverlog": function(parsedUrl) {    
    return {
      serverlog: "server log"
    };
  },
  "/communicationlog": function(parsedUrl) {    
    return {
      communicationlog: "cmms log"
    };
  }
}

var server = http.createServer(function(req, res) {
	var parsedUrl = url.parse(req.url, true);
  	//console.log(parsedUrl);
  	var resource = routes[parsedUrl.pathname];
  
  	//var path = url.parse(req.url, true).pathname.toString();
  	
	if(resource) {
		switch(req.method){
			case 'GET' : 
				res.writeHead(200, {"Content-Type": "application/json"});
	  			res.end(JSON.stringify(resource(parsedUrl)));
	  			break;
			case 'POST' : 
				res.writeHead(200, {"Content-Type": "application/text"});
	  			res.end('POST ');
	  			break;
			default :
				res.writeHead(405);
				res.end();
	  			break;	
		}
	} else {
		res.writeHead(404);
    	res.end();
	}
});
server.listen(8080);

/*var http = require('http');
var url = require('url');

var routes = {
  "/api/parsetime": function(parsedUrl) {
    d = new Date(parsedUrl.query.iso);
    return {
      hour: d.getHours(),
      minute: d.getMinutes(),
      second: d.getSeconds()
    };
  },
  "/api/unixtime": function(parsedUrl) {
    return {unixtime: (new Date(parsedUrl.query.iso)).getTime()};
  }
}

server = http.createServer(function(request, response) {
  parsedUrl = url.parse(request.url, true);
  resource = routes[parsedUrl.pathname];
  if (resource) {
    response.writeHead(200, {"Content-Type": "application/json"});
    response.end(JSON.stringify(resource(parsedUrl)));
  }
  else {
    response.writeHead(404);
    response.end();
  }
});
server.listen(process.argv[2]);*/
