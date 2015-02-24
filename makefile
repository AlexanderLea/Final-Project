#compiler
CC=gcc

#default
default: ble_central

ble_central: ble_central.c
	$(CC) ble_central.c -o ble_central

clean:
	$(RM) ble_central