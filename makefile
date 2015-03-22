#compiler
CC=gcc

#default
default: ble_central

ble_central: ble_central.c
	$(CC) ble_central.c -o ble_central

gatt_service: gatt_service.c
	$(CC) gatt_service.c -Wall -o gatt_service -lbluetooth `pkg-config --cflags --libs glib-2.0`

clean:
	$(RM) ble_central
