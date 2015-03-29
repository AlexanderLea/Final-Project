//This is where all the database logging stuff should be done
//Should be added to the makefile too

#include <sqlite3.h>
#include <stdio.h> 
#include <string.h>
#include <stdlib.h>
#include "ble_database.h"
                
int server_log_add(char *source, char *message) {
    
    	sqlite3 *db;
    	char *err_msg = 0;
	sqlite3_stmt *stmt;
    
   	 int rc = sqlite3_open("log.db", &db);
    
  	  if (rc != SQLITE_OK) {
   	     
		fprintf(stderr, "Cannot open database: %s\n", sqlite3_errmsg(db));
		sqlite3_close(db);
		
		return 1;
    	}
    	
    	char *sql = "INSERT INTO server_log(log_source, log_message) VALUES(?,?)";
        
    	rc = sqlite3_prepare_v2(db, sql, -1, &stmt, 0);
	
	if(rc == SQLITE_OK) {
		sqlite3_bind_text(stmt, 1, source, strlen(source), 0);
		sqlite3_bind_text(stmt, 2, message, strlen(message), 0);
		
		sqlite3_step(stmt);
    		sqlite3_finalize(stmt);				
	}
	
	sqlite3_close(db);
    
	if(err_msg == 0)
		return 1;
	else
		return 0;
}

int comms_log_add(char *direction, char *from, char *contents, int log_type) {
    
	sqlite3 *db;
	char *err_msg = 0;
	sqlite3_stmt *stmt;

	int rc = sqlite3_open("log.db", &db);

	if (rc != SQLITE_OK) {

		fprintf(stderr, "Cannot open database: %s\n", sqlite3_errmsg(db));
		sqlite3_close(db);

		return 1;
	}

	char *sql = "INSERT INTO communication_log(message_direction, message_from, message_contents, comms_log_type) VALUES(?, ?, ?, ?);";
	
	rc = sqlite3_prepare_v2(db, sql, -1, &stmt, 0);
	
	if(rc == SQLITE_OK) {
		sqlite3_bind_text(stmt, 1, direction, strlen(direction), 0);
		sqlite3_bind_text(stmt, 2, from, strlen(from), 0);
		sqlite3_bind_text(stmt, 3, contents, strlen(contents), 0);
		sqlite3_bind_int(stmt, 4, log_type);
		
		sqlite3_step(stmt);
    		sqlite3_finalize(stmt);				
	}
	
	sqlite3_close(db);

	if(err_msg == 0)
		return 1;
	else
		return 0;
}

/*
char* whitelist_read(){
 	sqlite3 *db;
   	char *err_msg = 0;
    
    	int rc = sqlite3_open("devices.db", &db);
    
	if (rc != SQLITE_OK) {

		fprintf(stderr, "Cannot open database: %s\n", 
			sqlite3_errmsg(db));
		sqlite3_close(db);

		return 1;
	}
    
	char *sql = "SELECT * FROM whitelist";
        
        //TODO: need to exec this - possibly dealing with callbacks
	//rc = sqlite3_exec(db, sql, callback, 0, &err_msg);
    
	if (rc != SQLITE_OK ) {
        
		fprintf(stderr, "Failed to select data\n");
		fprintf(stderr, "SQL error: %s\n", err_msg);

		sqlite3_free(err_msg);
		sqlite3_close(db);
		
		return 1;
    	} 
    
    	sqlite3_close(db);
    
    	return 0;
}

int main(void){
	int x = comms_log_add("Hello","Alexander","Hello World",1);
	//int x = server_log_add("Hello", "Hello World!");
	
	if(x ==1)
		printf("success\n");
	else 
		printf("unsuccess\n");
	
	return 0;
}*/
