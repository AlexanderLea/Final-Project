var sqlite3 = require('sqlite3').verbose(),
	async = require('async');  
	
var db = new sqlite3.Database('../devices.db');

module.exports = {
	/**
	* id|mac_addr|friendly_name|description|ble_role

	*/
	whitelistAdd: function(mac, friendlyName, description, bleRole){
		db.serialize(function() {
			db.run("INSERT INTO whitelist (mac_addr, friendly_name, description, ble_role) VALUES (?,?,?,?)", 
				mac, friendlyName, description, bleRole);
		});
	},

	whitelistAll: function(getAllWhitelistCallback){		
		db.all('SELECT * FROM whitelist', function(err, rows){
			if(err) {
				getAllWhitelistCallback(err, null);
				return;
			}
			getAllWhitelistCallback(null, rows);
			return;
		});
	}
};
