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
        
        //Assuming C4:4F:B7:B1:41:D7 is in range and connectable
        //system("sudo gatttool -b C4:4F:B7:B1:41:D7 --char-write-req --handle=0x000f --value=0100 --listen");
        FILE *ble_listen = popen("sudo gatttool -b C4:4F:B7:B1:41:D7 --char-write-req --handle=0x000f --value=0100 --listen", "r");        
        char buf[1024];              
        
        //read each line of incoming text
        while (fgets(buf, sizeof(buf), ble_listen) != 0) {
            printf("%s", buf);
        }
        
        //log it in transaction log
        //send it on
        
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
