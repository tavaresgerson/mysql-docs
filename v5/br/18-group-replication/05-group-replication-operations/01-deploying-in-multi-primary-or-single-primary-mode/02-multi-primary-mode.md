#### 17.5.1.2 Multi-Primary Mode

In multi-primary mode, there is no notion of a single primary. There is no need to engage an election procedure because there is no server playing any special role.

**Figure 17.6 Client Failover**

![Five server instances, S1, S2, S3, S4, and S5, are deployed as an interconnected group. All of the servers are primaries. Write clients are communicating with servers S1 and S2, and a read client is communicating with server S4. Server S1 then fails, breaking communication with its write client. This client reconnects to server S3.](images/multi-primary.png)

All servers are set to read-write mode when joining the group.
