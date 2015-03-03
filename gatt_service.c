#include <config.h>
#include <glib.h>
#include <bluetooth/uuid.h>
#include "plugin.h"
#include "hcid.h"
#include "log.h"
#include "attrib-server.h"
#include "att.h"

bool serverUp = false;

void serverUp(){
//set security level to high ?
	serverUp = true;
	
	//FROM: http://stackoverflow.com/questions/21428446/bluetooth-low-energy-use-bluez-stack-as-a-peripheral-with-custom-services-and
	gatt_service_add(adapter, GATT_PRIM_SVC_UUID, 0xFFFF,
    /* Char 1 */
    GATT_OPT_CHR_UUID16, 0xAAAA,
    GATT_OPT_CHR_PROPS, ATT_CHAR_PROPER_READ,
    GATT_OPT_CHR_VALUE_CB, ATTRIB_READ, read_func_callback,

    /* Char 2 Define here */
    ...
    /* Char 3 Define here */
    ...
    GATT_OPT_INVALID);
 
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
		system("sudo hcitool -i hci0 cmd 0x08 0x0008 1e 02 01 1a 1a ff 4c 00 02 15 e2 c5 6d b5 df fb 48 d2 b0 60 d0 f5 a7 10 96 e0 00 00 00 00 c5 00 00 00 00 00 00 00 00 00 00 00 00 00");

		//advertise
		system("");    
	}
	
	return 0;
}	