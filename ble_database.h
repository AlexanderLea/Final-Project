#ifndef BLE_DATABASE_H_
#define BLE_DATABASE_H_

int server_log_add(char *source, char *message);

int comms_log_add(char *direction, char *from, char *contents, int log_type);

#endif
