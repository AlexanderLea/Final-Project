#ifdef HAVE_CONFIG_H
#include <config.h>
#endif

#include <errno.h>
#include <string.h>
#include <stdbool.h>

#include <glib.h>

#include "lib/bluetooth.h"
#include "lib/sdp.h"
#include "lib/uuid.h"

#include "src/adapter.h"
#include "src/device.h"
#include "src/profile.h"
#include "src/plugin.h"
#include "attrib/gattrib.h"
#include "attrib/att.h"
#include "attrib/gatt.h"
#include "attrib/att-database.h"
#include "src/shared/util.h"
#include "src/attrib-server.h"
#include "attrib/gatt-service.h"
#include "src/log.h"

#define BROADCASTER_SVC_UUID	0x2A67
#define BROADCASTER_UUID		0x1817

enum {
	UPDATE_RESULT_SUCCESSFUL = 0,
	UPDATE_RESULT_CANCELED = 1,
	UPDATE_RESULT_NO_CONN = 2,
	UPDATE_RESULT_ERROR = 3,
	UPDATE_RESULT_TIMEOUT = 4,
	UPDATE_RESULT_NOT_ATTEMPTED = 5,
};

enum {
	UPDATE_STATE_IDLE = 0,
	UPDATE_STATE_PENDING = 1,
};

enum {
	GET_REFERENCE_UPDATE = 1,
	CANCEL_REFERENCE_UPDATE = 2,
};

//bool serverUp = false;

struct gatt_example_adapter 
{
	struct btd_adapter	*adapter;
	GSList			*sdp_handles;
};

static uint8_t command_read(struct attribute *a,
				  struct btd_device *device, gpointer user_data)
{
	struct btd_adapter *adapter = user_data;
	uint8_t value;

	value = 0x04;
	attrib_db_update(adapter, a->handle, NULL, &value, sizeof(value), NULL);

	return 0;
}

static gboolean register_broadcast_service(struct btd_adapter *adapter)
{
	//CReate UUID
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

static int time_server_init(struct btd_profile *p, struct btd_adapter *adapter)
{
	const char *path = adapter_get_path(adapter);

	DBG("path %s", path);

	if (!register_broadcast_service(adapter)) {
		error("Broadcast Service could not be registered");
		return -EIO;
	}

	return 0;
}

static void broadcast_server_exit(struct btd_profile *p,
						struct btd_adapter *adapter)
{
	const char *path = adapter_get_path(adapter);

	DBG("path %s", path);
}

struct btd_profile broadcast_profile = {
	.name		= "gatt-broadcast-server",
	.adapter_probe	= time_server_init,
	.adapter_remove	= time_server_exit,
};

static int broadcast_init(void)
{
	return btd_profile_register(&broadcast_profile);
}

static void broadcast_exit(void)
{
	btd_profile_unregister(&broadcast_profile);
}

/*
int main(int argc, char *argv[])
{


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
	
	return 0;
}	*/
