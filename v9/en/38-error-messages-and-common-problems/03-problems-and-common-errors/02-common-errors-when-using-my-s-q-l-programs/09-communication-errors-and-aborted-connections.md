#### B.3.2.9 Communication Errors and Aborted Connections

If connection problems occur such as communication errors or aborted connections, use these sources of information to diagnose problems:

* The error log. See Section 7.4.2, “The Error Log”.
* The general query log. See Section 7.4.3, “The General Query Log”.
* The `Aborted_xxx` and `Connection_errors_xxx` status variables. See Section 7.1.10, “Server Status Variables”.

* The host cache, which is accessible using the Performance Schema `host_cache` table. See Section 7.1.12.3, “DNS Lookups and the Host Cache”, and Section 29.12.22.4, “The host\_cache Table”.

If the `log_error_verbosity` system variable is set to 3, you might find messages like this in your error log:

```
[Note] Aborted connection 854 to db: 'employees' user: 'josh'
```

If a client is unable even to connect, the server increments the `Aborted_connects` status variable. Unsuccessful connection attempts can occur for the following reasons:

* A client attempts to access a database but has no privileges for it.

* A client uses an incorrect password.
* A connection packet does not contain the right information.

* It takes more than `connect_timeout` seconds to obtain a connect packet. See Section 7.1.8, “Server System Variables”.

If these kinds of things happen, it might indicate that someone is trying to break into your server! If the general query log is enabled, messages for these types of problems are logged to it.

If a client successfully connects but later disconnects improperly or is terminated, the server increments the `Aborted_clients` status variable, and logs an Aborted connection message to the error log. The cause can be any of the following:

* The client program did not call `mysql_close()` before exiting.

* The client had been sleeping more than `wait_timeout` or `interactive_timeout` seconds without issuing any requests to the server. See Section 7.1.8, “Server System Variables”.

* The client program ended abruptly in the middle of a data transfer.

Other reasons for problems with aborted connections or aborted clients:

* The `max_allowed_packet` variable value is too small or queries require more memory than you have allocated for **mysqld**. See Section B.3.2.8, “Packet Too Large”.

* Use of Ethernet protocol with Linux, both half and full duplex. Some Linux Ethernet drivers have this bug. You should test for this bug by transferring a huge file using FTP between the client and server machines. If a transfer goes in burst-pause-burst-pause mode, you are experiencing a Linux duplex syndrome. Switch the duplex mode for both your network card and hub/switch to either full duplex or to half duplex and test the results to determine the best setting.

* A problem with the thread library that causes interrupts on reads.

* Badly configured TCP/IP.
* Faulty Ethernets, hubs, switches, cables, and so forth. This can be diagnosed properly only by replacing hardware.

See also Section B.3.2.7, “MySQL server has gone away”.
