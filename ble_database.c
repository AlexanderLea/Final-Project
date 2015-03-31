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


void whitelist_mac_read(int _whitelistSize, char *data[_whitelistSize]){
 	sqlite3 *db;  	
	sqlite3_stmt *stmt;
	int row = 0;
    
    	int rc = sqlite3_open("devices.db", &db);
    
	if (rc != SQLITE_OK) {

		fprintf(stderr, "Cannot open database: %s\n", 
			sqlite3_errmsg(db));
		sqlite3_close(db);
		exit(1);
	}
    
	//create SQL
	char *sql = "SELECT mac_addr FROM whitelist;";
        
        //prepare SQL statement
        rc = sqlite3_prepare_v2(db, sql, -1, &stmt, 0);
    
	if(rc) {
		fprintf(stderr, "Couldn't prepare database: %s\n", sqlite3_errmsg(db));
		sqlite3_close(db);
		exit(1);
	}

	//execute query
	while( (rc = sqlite3_step(stmt)) == SQLITE_ROW) { /* we only get here if there's a row to process */
		data[row] = sqlite3_column_text(stmt, 0);			
		row++;
	}
	
	/* step() return SQLITE_DONE if it's out of records, but otherwise successful */
	if(rc != SQLITE_DONE) {
		/* this would indicate a problem */
		fprintf(stderr, "Couldn't step through statement: %s\n", sqlite3_errmsg(db));
		sqlite3_close(db);
		exit(1);
	}
	
	//free memory
	rc = sqlite3_finalize(stmt);
	if(rc) {
		fprintf(stderr, "Couldn't finalize statement: %s\n", sqlite3_errmsg(db));
		sqlite3_close(db);
		exit(1);
	}
    
    	sqlite3_close(db);
}

int getWhitelistSize(){
	sqlite3 *db;  	
	sqlite3_stmt *stmt;
	int count;
    
    	int rc = sqlite3_open("devices.db", &db);
    
	if (rc != SQLITE_OK) {

		fprintf(stderr, "Cannot open database: %s\n", 
			sqlite3_errmsg(db));
		sqlite3_close(db);
		exit(1);
	}
    
	//create SQL
	char *sql = "SELECT count(*) FROM whitelist;";
        
        //prepare SQL statement
        rc = sqlite3_prepare_v2(db, sql, -1, &stmt, 0);
    
	if(rc) {
		fprintf(stderr, "Couldn't prepare database: %s\n", sqlite3_errmsg(db));
		sqlite3_close(db);
		exit(1);
	}

	//execute query
	while( (rc = sqlite3_step(stmt)) == SQLITE_ROW) { /* we only get here if there's a row to process */
		count = sqlite3_column_int(stmt, 0);			
	}
	
	/* step() return SQLITE_DONE if it's out of records, but otherwise successful */
	if(rc != SQLITE_DONE) {
		/* this would indicate a problem */
		fprintf(stderr, "Couldn't step through statement: %s\n", sqlite3_errmsg(db));
		sqlite3_close(db);
		exit(1);
	}
	
	//free memory
	rc = sqlite3_finalize(stmt);
	if(rc) {
		fprintf(stderr, "Couldn't finalize statement: %s\n", sqlite3_errmsg(db));
		sqlite3_close(db);
		exit(1);
	}
    
    	sqlite3_close(db);
    	return count;
}

/*
int main(void){
	//int x = comms_log_add("Hello","Alexander","Hello World",1);
	//int x = server_log_add("Hello", "Hello World!");
	
	int whitelistSize = getWhitelistSize();
	
	char *data[whitelistSize];
	
	whitelist_mac_read(whitelistSize, data);
	
	int i,j;
	
	for(i = 0; i < whitelistSize; i++){ 
		//for(j = 0; j < 5; j++){
			printf("%s\n", data[i]);
		//}
	}
	
	
	//if(x ==1)
	//	printf("success\n");
	//else 
	//	printf("unsuccess\n");
	
	return 0;
}*/
