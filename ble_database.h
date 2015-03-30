#ifndef BLE_DATABASE_H_
#define BLE_DATABASE_H_

#include <sqlite3.h>
#include <stdio.h> 
#include <string.h>
#include <stdlib.h>

int server_log_add(char *source, char *message);

int comms_log_add(char *direction, char *from, char *contents, int log_type);

#endif
