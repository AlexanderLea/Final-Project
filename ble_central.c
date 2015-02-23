/*
* Compile using: gcc ble_central.c -o ble_central
* db = carDB; tbl = log; sql = create table log(id integer primary key, sender text, recipient text, service_uuid integer, command integer);
*/


#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <errno.h>
#include <string.h>
#include <sys/wait.h>

extern char **environ;

int main(int argc, char *argv[])
{
    //setup GATT server


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

        //Scan for devices
        //See if whitelist broadcast devices are in range
        //Connect if they are, raise error if not
        
        //Assuming C4:4F:B7:B1:41:D7 is in range
        system("sudo gatttool -b C4:4F:B7:B1:41:D7 --char-write-req --handle=0x000f --value=0100 --listen");
        
        //read each line of incoming text, and do something with it
    }
    else
    {   //PARENT PROCESS
        int status;
        
        //Wait for the child to exit
        wpid = wait(&status);
        
    }
    
    return 0;
}
