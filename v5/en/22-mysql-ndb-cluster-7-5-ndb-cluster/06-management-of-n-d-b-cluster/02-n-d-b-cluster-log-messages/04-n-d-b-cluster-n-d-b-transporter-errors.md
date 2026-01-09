#### 21.6.2.4 NDB Cluster: NDB Transporter Errors

This section lists error codes, names, and messages that are written to the cluster log in the event of transporter errors.

0x00 :   TE_NO_ERROR

    No error

0x01 :   TE_ERROR_CLOSING_SOCKET

    Error found during closing of socket

0x02 :   TE_ERROR_IN_SELECT_BEFORE_ACCEPT

    Error found before accept. The transporter will retry

0x03 :   TE_INVALID_MESSAGE_LENGTH

    Error found in message (invalid message length)

0x04 :   TE_INVALID_CHECKSUM

    Error found in message (checksum)

0x05 :   TE_COULD_NOT_CREATE_SOCKET

    Error found while creating socket(can't create socket)

0x06 :   TE_COULD_NOT_BIND_SOCKET

    Error found while binding server socket

0x07 :   TE_LISTEN_FAILED

    Error found while listening to server socket

0x08 :   TE_ACCEPT_RETURN_ERROR

    Error found during accept(accept return error)

0x0b :   TE_SHM_DISCONNECT

    The remote node has disconnected

0x0c :   TE_SHM_IPC_STAT

    Unable to check shm segment

0x0d :   TE_SHM_UNABLE_TO_CREATE_SEGMENT

    Unable to create shm segment

0x0e :   TE_SHM_UNABLE_TO_ATTACH_SEGMENT

    Unable to attach shm segment

0x0f :   TE_SHM_UNABLE_TO_REMOVE_SEGMENT

    Unable to remove shm segment

0x10 :   TE_TOO_SMALL_SIGID

    Sig ID too small

0x11 :   TE_TOO_LARGE_SIGID

    Sig ID too large

0x12 :   TE_WAIT_STACK_FULL

    Wait stack was full

0x13 :   TE_RECEIVE_BUFFER_FULL

    Receive buffer was full

0x14 :   TE_SIGNAL_LOST_SEND_BUFFER_FULL

    Send buffer was full,and trying to force send fails

0x15 :   TE_SIGNAL_LOST

    Send failed for unknown reason(signal lost)

0x16 :   TE_SEND_BUFFER_FULL

    The send buffer was full, but sleeping for a while solved

0x21 :   TE_SHM_IPC_PERMANENT

    Shm ipc Permanent error

Note

Transporter error codes 0x17 through 0x20 and 0x22 are reserved for SCI connections, which are not supported in this version of NDB Cluster, and so are not included here.
