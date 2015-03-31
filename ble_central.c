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

#include "ble_database.h"

extern char **environ;

/*char * getValue(char *_input)
{
	/*char **ap, *valueString;

   	for (ap = valueString; (*ap = strsep(&_input, " \t")) != NULL;)
           if (**ap != '\0')
                   if (++ap >= &valueString[10])
                           break; 
                                   
	return 	valueString;
	
	
	char sub[1000];
   	int position = 36, length = 23, c = 0;
	 
	while (c < length) {
      		sub[c] = _input[position+c-1];
      		c++;
   	}
   	sub[c] = '\0';
 	
 	return sub;
}*/

int main(int argc, char *argv[])
{
	//setup GATT server


	//Scan for devices (should this be done in another thread?)
	//Foreach device in whitelist, do:
	int whitelistSize = getWhitelistSize();	
	char *whitelist[whitelistSize];	
	getListWhitelistMAC(whitelistSize, whitelist);
	int i = 0;
	
	for(i =0; i < whitelistSize; i++){
			
		//process IDs
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
		
			//Assuming C4:4F:B7:B1:41:D7 is in range and connectable
			
			char *cmd;
			strcpy(cmd, "sudo gatttool -b ");
			strcat(cmd, whitelist[i]);
			strcat(cmd, "--char-write-req --handle=0x000f --value=0100 --listen");

//TODO: Don't think this works!			
			FILE *ble_listen 
				= popen(cmd, "r");        
			char buf[1024];              
		
			//read each line of incoming text
			while (fgets(buf, sizeof(buf), ble_listen) != 0) {
				//printf("%s", buf);
			   	//printf("Value = %s", getValue(buf));
			    
				//want substring of: Notification handle = 0x000e value: 2a 20 00 20 10 3f 00 20
				//TODO: There must be a nicer way of doing this!
				char *sub;
				int position = 37, length = 23, c = 0;
			 
				while (c < length) {
		      			sub[c] = buf[position+c-1];
		      			c++;
		   		}
		   		sub[c] = '\0';
			    
			    	//printf("%s\n", sub);
			    	
				//log it in transaction log		
//TODO: error here!
				comms_log_add("IN", whitelist[i], sub, 1);
			
				//send it on			
			}
			       
			pclose(ble_listen);
		}
		else
	    	{   //PARENT PROCESS
			int status;
		
			//Wait for the child to exit
			wpid = wait(&status);
		
	    	}
    	}
    
    	return 0;
}
