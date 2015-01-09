#include <stdio.h>
#include <unistd.h>
#include <sys/socket.h>
#include <bluetooth/bluetooth.h>
#include <bluetooth/rfcomm.h>

int main(int argc, char **argv)
{
    printf("Server Started\n");

    //Variables
    struct sockaddr_rc loc_addr = { 0 }, rem_addr = { 0 };
    struct sockaddr_rc client_addr = { 0 };

    char buf[1024] = { 0 };
    int s, client, bytes_read;
    socklen_t opt = sizeof(rem_addr);
    char dest[18] = "C4:4F:B7:B1:41:D7";
    
    //allocate socket
    s = socket(AF_BLUETOOTH, SOCK_STREAM, BTPROTO_RFCOMM);

    //bind socket to port 1 of the first available Bluetooth adapter
    loc_addr.rc_family = AF_BLUETOOTH;
    loc_addr.rc_bdaddr = *BDADDR_ANY;
    loc_addr.rc_channel = (uint8_t) 1;
    bind(s, (struct sockaddr *)&loc_addr, sizeof(loc_addr));
    
    //connect to client
    printf("Initiating connection\n");
    client_addr.rc_family = AF_BLUETOOTH;
    client_addr.rc_channel = (uint8_t) 1;
    str2ba( dest, &client_addr.rc_bdaddr);

    client = connect(s, (struct sockaddr *)&client_addr, sizeof(client_addr));

    if(client == 0)
    {
        printf("Successfully connected\n");
    }
    else
    {
        perror("There was an error connecting");
    }

    close(client);
    close(s);
    return 0;
}
