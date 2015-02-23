/*
* Compile using: gcc ble_central.c -o ble_central
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
    pid_t pid;
    //process id of the CHILD process
    pid_t wpid;
    //process returned from the WAIT function call
    printf("Hello - I am the parent process. I am about to fork() and make a child (no giggling please)\n");
    //Fork THIS process - execution of the following
    //lines of code will now execute in TWO copies of the same
    //process - except one will be the parent, and the other
    //will be the child.
    pid = fork();
    if (pid == -1) {
        printf("Failed to fork()\n");
        exit(13);
    }
    //Fork was successful
    //Now - which process am I?
    if (pid == 0) {
        //CHILD PROCESS
        //printf("I am the CHILD process. My PID = %ld and my parent PID=%ld\n",
        //(long)getpid(), (long)getppid());
        //printf("I am the CHILD process.\n");

        //do something clever here about reading scan results and then conditionaling whether or not mac is found
        system("sudo gatttool -b C4:4F:B7:B1:41:D7 --char-write-req --handle=0x000f --value=0100 --listen");
    }
    else
    {
        //PARENT PROCESS
        int status; //I shall store the status info about the child in this integer
        //printf("I am the PARENT process. My PID = %ld and my parent PID=%ld\n",
        //(long)getpid(), (long)getppid());
        //printf("I am the PARENT process. My child PID has the PID=%ld\n",
        //(long)pid);
        //printf("I shall now wait on the child to complete its task\n");
        //Wait for the child to exit
        wpid = wait(&status);
        printf("PARENT: Wait returned with status %d and PID=%ld\n",status,
        (long)wpid);
    }
}
