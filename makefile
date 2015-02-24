#compiler
CC=gcc

#default
default: ble_central

ble_central: ble_central.c
    $(CC) ble_central.c

clean:
  	$(RM) ble_central