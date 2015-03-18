#include "lib/uuid.h"
#include "src/plugin.h"
#include "src/adapter.h"
#include "src/shared/util.h"
#include "src/log.h"
#include "attrib/gattrib.h"
#include "attrib/gatt-service.h"
#include "attrib/att.h"
#include "attrib/gatt.h"
#include "attrib/att-database.h"
#include "src/attrib-server.h"

#define BROADCASTER_SVC_UUID	0x2A67
#define BROADCASTER_UUID		0x1817

bool serverUp = false;

struct gatt_example_adapter 
{
	struct btd_adapter	*adapter;
	GSList			*sdp_handles;
};

void serverUp(struct btd_adapter *adapter)
{
//set security level to high ?
	
	
	if (!register_broadcast_service(adapter)) 
	{
		//TODO: Log error
		//TODO: Remove gatt adapter - gatt_example_adapter_free(gadapter);
		
		serverUp = false;		
	}
	else 
	{
		serverUp = true;
	} 
}

static gboolean register_broadcast_service(struct btd_adapter *adapter)
{
	//create different uuid ??
	bt_uuid_t uuid;

	bt_uuid16_create(&uuid, BROADCASTER_SVC_UUID);

	//create GATT server
	return gatt_service_add(adapter, GATT_PRIM_SVC_UUID, &uuid,
			/* Broadcaster characteristic */
			GATT_OPT_CHR_UUID16, BROADCASTER_UUID,
			GATT_OPT_CHR_PROPS, GATT_CHR_PROP_READ |
							GATT_CHR_PROP_NOTIFY,
			GATT_OPT_CHR_VALUE_CB, ATTRIB_READ,
						command_read, adapter,
			GATT_OPT_INVALID);
}

static uint8_t command_read(struct attribute *a,
				  struct btd_device *device, gpointer user_data)
{
	struct btd_adapter *adapter = user_data;
	uint8_t value;

	value = 0x04;
	attrib_db_update(adapter, a->handle, NULL, &value, sizeof(value), NULL);

	return 0;
}

void serverDown(){
	serverUp = false;
}

void sendCommand(){
	if(serverUp){
		//send the command
	}
}

int main(int argc, char *argv[])
{

/*
    //proces ID
    pid_t pid;
    pid_t wpid;

    //fork the process
    pid = fork();
    if (pid == -1) {
        printf("Failed to fork()\n"); 
        //TODO: return valid error here, rather than exiting
        exit(13);
    }
    
    //Fork was successful
    if (pid == 0) { //CHILD PROCESS
	    //Setup service
	    //currntly beacon
		
		//system("sudo hcitool -i hci0 cmd 0x08 0x0008 1e 02 01 1a 1a ff 4c 00 02 15 e2 c5 6d b5 df fb 48 d2 b0 60 d0 f5 a7 10 96 e0 00 00 00 00 c5 00 00 00 00 00 00 00 00 00 00 00 00 00");

		//advertise
		system("");    
	}
	*/
	return 0;
}	
