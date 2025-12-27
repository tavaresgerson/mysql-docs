#### 21.6.2.4 NDB Cluster: NDB Transporter Errors

This section lists error codes, names, and messages that are written to the cluster log in the event of transporter errors.

0x00 :   TE\_NO\_ERROR

    No error

0x01 :   TE\_ERROR\_CLOSING\_SOCKET

    Error found during closing of socket

0x02 :   TE\_ERROR\_IN\_SELECT\_BEFORE\_ACCEPT

    Error found before accept. The transporter will retry

0x03 :   TE\_INVALID\_MESSAGE\_LENGTH

    Error found in message (invalid message length)

0x04 :   TE\_INVALID\_CHECKSUM

    Error found in message (checksum)

0x05 :   TE\_COULD\_NOT\_CREATE\_SOCKET

    Error found while creating socket(can't create socket)

0x06 :   TE\_COULD\_NOT\_BIND\_SOCKET

    Error found while binding server socket

0x07 :   TE\_LISTEN\_FAILED

    Error found while listening to server socket

0x08 :   TE\_ACCEPT\_RETURN\_ERROR

    Error found during accept(accept return error)

0x0b :   TE\_SHM\_DISCONNECT

    The remote node has disconnected

0x0c :   TE\_SHM\_IPC\_STAT

    Unable to check shm segment

0x0d :   TE\_SHM\_UNABLE\_TO\_CREATE\_SEGMENT

    Unable to create shm segment

0x0e :   TE\_SHM\_UNABLE\_TO\_ATTACH\_SEGMENT

    Unable to attach shm segment

0x0f :   TE\_SHM\_UNABLE\_TO\_REMOVE\_SEGMENT

    Unable to remove shm segment

0x10 :   TE\_TOO\_SMALL\_SIGID

    Sig ID too small

0x11 :   TE\_TOO\_LARGE\_SIGID

    Sig ID too large

0x12 :   TE\_WAIT\_STACK\_FULL

    Wait stack was full

0x13 :   TE\_RECEIVE\_BUFFER\_FULL

    Receive buffer was full

0x14 :   TE\_SIGNAL\_LOST\_SEND\_BUFFER\_FULL

    Send buffer was full,and trying to force send fails

0x15 :   TE\_SIGNAL\_LOST

    Send failed for unknown reason(signal lost)

0x16 :   TE\_SEND\_BUFFER\_FULL

    The send buffer was full, but sleeping for a while solved

0x21 :   TE\_SHM\_IPC\_PERMANENT

    Shm ipc Permanent error

Note

Transporter error codes 0x17 through 0x20 and 0x22 are reserved for SCI connections, which are not supported in this version of NDB Cluster, and so are not included here.
