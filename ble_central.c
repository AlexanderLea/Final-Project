/*
* Compile using: gcc ble_central.c -o ble_central
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
#include <pthread.h>

#include "ble_database.h"

extern char **environ;
pthread_mutex_t lock;

/* This is our thread function.  It is like main(), but for a thread */
void *threadFunc(void *arg)
{ //TODO: This blocks forever

//Assuming C4:4F:B7:B1:41:D7 is in range and connectable
	
	//Acquire lock
	pthread_mutex_lock(&lock);	
	printf("Acquired lock!\n");
	
	char *str;
	str=(char*)arg; //take threadID here instead
		
	const char *cmd = "sudo gatttool -b C4:4F:B7:B1:41:D7 --char-write-req --handle=0x000f --value=0100 --listen";

	//printf("Cmd: %s\n", cmd);
				
	FILE *ble_listen 
		= popen(cmd, "r"); 
		
	printf("Connected\n");	
	       
	char buf[1024];              

	//read each line of incoming text
	while (fgets(buf, sizeof(buf), ble_listen) != 0) {
		printf("%s\n", buf);
	    
		//want substring of: Notification handle = 0x000e value: 2a 20 00 20 10 3f 00 20
		//TODO: this causes segmentation fault. 
		//TODO: there must be a nicer way of doing this than substring?
		
		/*
		char *sub;
		int position = 37, length = 23, c = 0;
	 
		while (c < length) {
      			sub[c] = buf[position+c-1];
      			c++;
   		}
   		sub[c] = '\0';
	    
	    
	    	printf("%s\n", sub);
	    	*/
	    	
		//log it in transaction log			
		//comms_log_add("IN", whitelist[i], sub, 1);

		//send it on			
	}
	
	pclose(ble_listen);
	
	printf("Disconnected\n"); 
	//TODO: need to deal with disconnections here, otherwise we wait forever
	
	//release lock
	pthread_mutex_unlock(&lock);
	
	return NULL;
}

int main(int argc, char *argv[])
{
	//setup GATT server


	//Foreach device in whitelist, create connection and listen
	int whitelistSize = getWhitelistSize();	
	char *whitelist[whitelistSize];	
	int i = 0;
	int status;   	   
   	int pid[whitelistSize]; //pid_t pid;
   	pid_t wpid;
   	pthread_t tID[whitelistSize];
   	
   	getListWhitelistMAC(whitelistSize, whitelist);	
	printf("Whitelist size: %d\n", whitelistSize);
	
   	int err;

   	if (pthread_mutex_init(&lock, NULL) != 0)
    	{
     		printf("\n mutex init failed\n");
		return 1;
    	}
   	
   	//TODO: This won't work for more than one device from the whitelist - 
   	//the first one gets lock and blocks forever
	for (i=0; i < whitelistSize; i++) {
		printf("Creating thread %d\n", i);
		/* Create worker thread */
		err = pthread_create(&(tID[i]),NULL,threadFunc, "hello world");
	}
	
	/* wait for our thread to finish before continuing */
	pthread_join((tID[0]), NULL); //would be nice to do this dynamically!
	
	pthread_mutex_destroy(&lock);   	 	
    
    	return 0;
}
