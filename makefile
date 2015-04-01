#compiler
CC=gcc

#default
default: ble_central

#This command should be complicated - TODO: make it include everything as the all-encompassing file
ble_central: ble_central.c
	$(CC) -o ble_central ble_central.c ble_database.c -lsqlite3

gatt_service: gatt_service.c
	$(CC) -o gatt_service gatt_service.c -lbluetooth -L/usr/lib/bluetooth/plugins -Wl,-rpath=/usr/lib/bluetooth/plugins `pkg-config --cflags --libs glib-2.0` -Wall
	#-I/usr/lib/bluetooth #perhaps should be /plugins too?

ble_database: ble_database.c
	$(CC) -c ble_database.c -Wall -o ble_database -lsqlite3

clean:
	$(RM) ble_central gatt_service ble_database
