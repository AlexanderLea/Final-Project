#compiler
CC=gcc

#default
default: ble_central

ble_central: ble_central.c
	$(CC) ble_central.c -o ble_central

gatt_service: gatt_service.c
	$(CC) gatt_service.c -o gatt_service -I/home/alexander/Documents/bluez-5.29

clean:
	$(RM) ble_central
