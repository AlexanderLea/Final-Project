/*
* Compile using: gcc ble_central.c -o ble_central
* db = carDB; tbl = log; sql = create table log(id integer primary key, sender text, recipient text, service_uuid integer, command integer);
*
*
*   BLE node MAC 	= C4:4F:B7:B1:41:D7
*	PC MAC 			= 00:02:72:D9:FA:ED
* to set up beacon from commandline: sudo hcitool -i hci0 cmd 0x08 0x0008 1e 02 01 1a 1a ff 4c 00 02 15 e2 c5 6d b5 df fb 48 d2 b0 60 d0 f5 a7 10 96 e0 00 00 00 00 c5 00 00 00 00 00 00 00 00 00 00 00 00 00
* to then advertise: sudo hciconfig hcix leadv
*/


#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <errno.h>
#include <string.h>
#include <sys/wait.h>

#include "ble_database.h"

extern char **environ;

char * getValue(char *_input)
{
	char **ap, *argv[10], *inputstring;

   	for (ap = argv; (*ap = strsep(&inputstring, " \t")) != NULL;)
           if (**ap != '\0')
                   if (++ap >= &argv[10])
                           break;
                                   
	return 	argv[sizeof(argv)];
}

int main(int argc, char *argv[])
{
    //setup GATT server
//how to call serverUp from gatt_Service.c - need to include in makefile	serverUp();

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

        //Scan for devices (should this be done in another thread?)
        //See if whitelist broadcast devices are in range
        //Connect if they are, raise error if not
        
        //Assuming C4:4F:B7:B1:41:D7 is in range and connectable
        //system("sudo gatttool -b C4:4F:B7:B1:41:D7 --char-write-req --handle=0x000f --value=0100 --listen");
        FILE *ble_listen = popen("sudo gatttool -b C4:4F:B7:B1:41:D7 --char-write-req --handle=0x000f --value=0100 --listen", "r");        
        char buf[1024];              
        
        //read each line of incoming text
        while (fgets(buf, sizeof(buf), ble_listen) != 0) {
            //printf("%s", buf);
            //printf("Value = %s", getValue(buf));
            
            //log it in transaction log
	        //send it on
	        
//	        sendCommand();
        }
               
        pclose(ble_listen);
    }
    else
    {   //PARENT PROCESS
        int status;
        
        //Wait for the child to exit
        wpid = wait(&status);
        
    }
    
    return 0;
}
