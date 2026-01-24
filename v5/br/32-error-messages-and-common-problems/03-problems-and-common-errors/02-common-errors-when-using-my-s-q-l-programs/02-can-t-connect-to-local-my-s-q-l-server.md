#### B.3.2.2 Can't connect to [local] MySQL server

A MySQL client on Unix can connect to the [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") server in two different ways: By using a Unix socket file to connect through a file in the file system (default `/tmp/mysql.sock`), or by using TCP/IP, which connects through a port number. A Unix socket file connection is faster than TCP/IP, but can be used only when connecting to a server on the same computer. A Unix socket file is used if you do not specify a host name or if you specify the special host name `localhost`.

If the MySQL server is running on Windows, you can connect using TCP/IP. If the server is started with the [`named_pipe`](server-system-variables.html#sysvar_named_pipe) system variable enabled, you can also connect with named pipes if you run the client on the host where the server is running. The name of the named pipe is `MySQL` by default. If you do not give a host name when connecting to [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"), a MySQL client first tries to connect to the named pipe. If that does not work, it connects to the TCP/IP port. You can force the use of named pipes on Windows by using `.` as the host name.

The error (2002) `Can't connect to ...` normally means that there is no MySQL server running on the system or that you are using an incorrect Unix socket file name or TCP/IP port number when trying to connect to the server. You should also check that the TCP/IP port you are using has not been blocked by a firewall or port blocking service.

The error (2003) `Can't connect to MySQL server on 'server' (10061)` indicates that the network connection has been refused. You should check that there is a MySQL server running, that it has network connections enabled, and that the network port you specified is the one configured on the server.

Start by checking whether there is a process named [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") running on your server host. (Use **ps xa | grep mysqld** on Unix or the Task Manager on Windows.) If there is no such process, you should start the server. See [Section 2.9.2, “Starting the Server”](starting-server.html "2.9.2 Starting the Server").

If a [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") process is running, you can check it by trying the following commands. The port number or Unix socket file name might be different in your setup. `host_ip` represents the IP address of the machine where the server is running.

```sql
$> mysqladmin version
$> mysqladmin variables
$> mysqladmin -h `hostname` version variables
$> mysqladmin -h `hostname` --port=3306 version
$> mysqladmin -h host_ip version
$> mysqladmin --protocol=SOCKET --socket=/tmp/mysql.sock version
```

Note the use of backticks rather than forward quotation marks with the **hostname** command; these cause the output of **hostname** (that is, the current host name) to be substituted into the [**mysqladmin**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") command. If you have no **hostname** command or are running on Windows, you can manually type the host name of your machine (without backticks) following the `-h` option. You can also try `-h 127.0.0.1` to connect with TCP/IP to the local host.

Make sure that the server has not been configured to ignore network connections or (if you are attempting to connect remotely) that it has not been configured to listen only locally on its network interfaces. If the server was started with the [`skip_networking`](server-system-variables.html#sysvar_skip_networking) system variable enabled, it does not accept TCP/IP connections at all. If the server was started with the [`bind_address`](server-system-variables.html#sysvar_bind_address) system variable set to `127.0.0.1`, it listens for TCP/IP connections only locally on the loopback interface and does not accept remote connections.

Check to make sure that there is no firewall blocking access to MySQL. Your firewall may be configured on the basis of the application being executed, or the port number used by MySQL for communication (3306 by default). Under Linux or Unix, check your IP tables (or similar) configuration to ensure that the port has not been blocked. Under Windows, applications such as ZoneAlarm or Windows Firewall may need to be configured not to block the MySQL port.

Here are some reasons the `Can't connect to local MySQL server` error might occur:

* [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") is not running on the local host. Check your operating system's process list to ensure the [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") process is present.

* You're running a MySQL server on Windows with many TCP/IP connections to it. If you're experiencing that quite often your clients get that error, you can find a workaround here: [Section B.3.2.2.1, “Connection to MySQL Server Failing on Windows”](can-not-connect-to-server.html#can-not-connect-to-server-on-windows "B.3.2.2.1 Connection to MySQL Server Failing on Windows").

* Someone has removed the Unix socket file that [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") uses (`/tmp/mysql.sock` by default). For example, you might have a **cron** job that removes old files from the `/tmp` directory. You can always run [**mysqladmin version**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") to check whether the Unix socket file that [**mysqladmin**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") is trying to use really exists. The fix in this case is to change the **cron** job to not remove `mysql.sock` or to place the socket file somewhere else. See [Section B.3.3.6, “How to Protect or Change the MySQL Unix Socket File”](problems-with-mysql-sock.html "B.3.3.6 How to Protect or Change the MySQL Unix Socket File").

* You have started the [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") server with the [`--socket=/path/to/socket`](server-options.html#option_mysqld_socket) option, but forgotten to tell client programs the new name of the socket file. If you change the socket path name for the server, you must also notify the MySQL clients. You can do this by providing the same [`--socket`](connection-options.html#option_general_socket) option when you run client programs. You also need to ensure that clients have permission to access the `mysql.sock` file. To find out where the socket file is, you can do:

  ```sql
  $> netstat -ln | grep mysql
  ```

  See [Section B.3.3.6, “How to Protect or Change the MySQL Unix Socket File”](problems-with-mysql-sock.html "B.3.3.6 How to Protect or Change the MySQL Unix Socket File").

* You are using Linux and one server thread has died (dumped core). In this case, you must kill the other [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") threads (for example, with [**kill**](kill.html "13.7.6.4 KILL Statement")) before you can restart the MySQL server. See [Section B.3.3.3, “What to Do If MySQL Keeps Crashing”](crashing.html "B.3.3.3 What to Do If MySQL Keeps Crashing").

* The server or client program might not have the proper access privileges for the directory that holds the Unix socket file or the socket file itself. In this case, you must either change the access privileges for the directory or socket file so that the server and clients can access them, or restart [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") with a [`--socket`](server-options.html#option_mysqld_socket) option that specifies a socket file name in a directory where the server can create it and where client programs can access it.

If you get the error message `Can't connect to MySQL server on some_host`, you can try the following things to find out what the problem is:

* Check whether the server is running on that host by executing `telnet some_host 3306` and pressing the Enter key a couple of times. (3306 is the default MySQL port number. Change the value if your server is listening to a different port.) If there is a MySQL server running and listening to the port, you should get a response that includes the server's version number. If you get an error such as `telnet: Unable to connect to remote host: Connection refused`, then there is no server running on the given port.

* If the server is running on the local host, try using [**mysqladmin -h localhost variables**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") to connect using the Unix socket file. Verify the TCP/IP port number that the server is configured to listen to (it is the value of the [`port`](server-system-variables.html#sysvar_port) variable.)

* If you are running under Linux and Security-Enhanced Linux (SELinux) is enabled, see [Section 6.7, “SELinux”](selinux.html "6.7 SELinux").

##### B.3.2.2.1 Connection to MySQL Server Failing on Windows

When you're running a MySQL server on Windows with many TCP/IP connections to it, and you're experiencing that quite often your clients get a `Can't connect to MySQL server` error, the reason might be that Windows does not allow for enough ephemeral (short-lived) ports to serve those connections.

The purpose of `TIME_WAIT` is to keep a connection accepting packets even after the connection has been closed. This is because Internet routing can cause a packet to take a slow route to its destination and it may arrive after both sides have agreed to close. If the port is in use for a new connection, that packet from the old connection could break the protocol or compromise personal information from the original connection. The `TIME_WAIT` delay prevents this by ensuring that the port cannot be reused until after some time has been permitted for those delayed packets to arrive.

It is safe to reduce `TIME_WAIT` greatly on LAN connections because there is little chance of packets arriving at very long delays, as they could through the Internet with its comparatively large distances and latencies.

Windows permits ephemeral (short-lived) TCP ports to the user. After any port is closed it remains in `TIME_WAIT` status for 120 seconds. The port is not available again until this time expires. The default range of port numbers depends on the version of Windows, with a more limited number of ports in older versions:

* Windows through Server 2003: Ports in range 1025–5000

* Windows Vista, Server 2008, and newer: Ports in range 49152–65535

With a small stack of available TCP ports (5000) and a high number of TCP ports being open and closed over a short period of time along with the `TIME_WAIT` status you have a good chance for running out of ports. There are two ways to address this problem:

* Reduce the number of TCP ports consumed quickly by investigating connection pooling or persistent connections where possible

* Tune some settings in the Windows registry (see below)

Important

The following procedure involves modifying the Windows registry. Before you modify the registry, make sure to back it up and make sure that you understand how to restore it if a problem occurs. For information about how to back up, restore, and edit the registry, view the following article in the Microsoft Knowledge Base: <http://support.microsoft.com/kb/256986/EN-US/>.

1. Start Registry Editor (`Regedt32.exe`).

2. Locate the following key in the registry:

   ```sql
   HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters
   ```

3. On the `Edit` menu, click `Add Value`, and then add the following registry value:

   ```sql
   Value Name: MaxUserPort
   Data Type: REG_DWORD
   Value: 65534
   ```

   This sets the number of ephemeral ports available to any user. The valid range is between 5000 and 65534 (decimal). The default value is 0x1388 (5000 decimal).

4. On the `Edit` menu, click `Add Value`, and then add the following registry value:

   ```sql
   Value Name: TcpTimedWaitDelay
   Data Type: REG_DWORD
   Value: 30
   ```

   This sets the number of seconds to hold a TCP port connection in `TIME_WAIT` state before closing. The valid range is between 30 and 300 decimal, although you may wish to check with Microsoft for the latest permitted values. The default value is 0x78 (120 decimal).

5. Quit Registry Editor.
6. Reboot the machine.

Note: Undoing the above should be as simple as deleting the registry entries you've created.
