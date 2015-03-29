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
    
    int rc = sqlite3_open("log.db", &db);
    
    if (rc != SQLITE_OK) {
        
        fprintf(stderr, "Cannot open database: %s\n", sqlite3_errmsg(db));
        sqlite3_close(db);
        
        return 1;
    }
    
    //construct string
    char *base = "INSERT INTO server_log(log_source, log_message) VALUES(\"";
    char *join = "\", \"";
    char *end = "\");";
        
    char *sql = malloc(strlen(base) + strlen(source) 
    	+ strlen(join) + strlen(end) + strlen(message));
    strcpy(sql, base);
    strcat(sql, source);
    strcat(sql, join);
    strcat(sql, message);
    strcat(sql, end);

    rc = sqlite3_exec(db, sql, 0, 0, &err_msg);        
    
    free(sql);
    
    if (rc != SQLITE_OK ) {
        
        fprintf(stderr, "SQL error: %s\n", err_msg);
        
        sqlite3_free(err_msg);        
        sqlite3_close(db);
        
        return 1;
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

	int rc = sqlite3_open("log.db", &db);

	if (rc != SQLITE_OK) {

		fprintf(stderr, "Cannot open database: %s\n", sqlite3_errmsg(db));
		sqlite3_close(db);

		return 1;
	}

	//char *sql = "INSERT INTO communication_log(message_direction, message_from, message_contents, comms_log_type) VALUES(\"direction\", \"from\", \"contents\", \"log_type\");";

	//construct string
	char *base = "INSERT INTO communication_log(message_direction, message_from, message_contents, comms_log_type) VALUES(\"";
	char *join = "\", \"";
	char *string_int_join = "\", ";
	char *end = ");";

	char char_log_type[2];	
	snprintf(char_log_type, sizeof(char_log_type), "%d", log_type);

	//work out length
	char *sql = malloc(strlen(base) + strlen(direction) 
	+ strlen(join) + strlen(from) + strlen(join) + strlen(contents)
	+ strlen(string_int_join) + strlen(char_log_type) + strlen(end));

	strcpy(sql, base);
	strcat(sql, direction);
	strcat(sql, join);
	strcat(sql, from);
	strcat(sql, join);
	strcat(sql, contents);
	strcat(sql, string_int_join);
	strcat(sql, char_log_type);
	strcat(sql, end);

	fprintf(stdout, sql);
	
	rc = sqlite3_exec(db, sql, 0, 0, &err_msg);

	free(sql);
	
	if (rc != SQLITE_OK ) {
		fprintf(stderr, "SQL error: %s\n", err_msg);

		sqlite3_free(err_msg);        
		sqlite3_close(db);

		return 1;
	} 

	sqlite3_close(db);

	if(err_msg == 0)
		return 1;
	else
		return 0;
}

/*
char* whitelist_get(){
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
