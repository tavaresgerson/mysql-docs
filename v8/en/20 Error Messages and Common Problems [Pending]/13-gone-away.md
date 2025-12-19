#### B.3.2.7 MySQL server has gone away

This section also covers the related `Lost connection to server during query` error.

The most common reason for the `MySQL server has gone away` error is that the server timed out and closed the connection. In this case, you normally get one of the following error codes (which one you get is operating system-dependent).

<table><col style="width: 35%"/><col style="width: 65%"/><thead><tr> <th>Error Code</th> <th>Description</th> </tr></thead><tbody><tr> <td><code>CR_SERVER_GONE_ERROR</code></td> <td>The client couldn't send a question to the server.</td> </tr><tr> <td><code>CR_SERVER_LOST</code></td> <td>The client didn't get an error when writing to the server, but it didn't get a full answer (or any answer) to the question.</td> </tr></tbody></table>

By default, the server closes the connection after eight hours if nothing has happened. You can change the time limit by setting the  `wait_timeout` variable when you start  **mysqld**. See  Section 7.1.8, “Server System Variables”.

If you have a script, you just have to issue the query again for the client to do an automatic reconnection. This assumes that you have automatic reconnection in the client enabled (which is the default for the `mysql` command-line client).

Some other common reasons for the `MySQL server has gone away` error are:

* You (or the db administrator) has killed the running thread with a  `KILL` statement or a  **mysqladmin kill** command.
* You tried to run a query after closing the connection to the server. This indicates a logic error in the application that should be corrected.
* A client application running on a different host does not have the necessary privileges to connect to the MySQL server from that host.
* You got a timeout from the TCP/IP connection on the client side. This may happen if you have been using the commands:  `mysql_options(..., MYSQL_OPT_READ_TIMEOUT,...)` or  `mysql_options(..., MYSQL_OPT_WRITE_TIMEOUT,...)`. In this case increasing the timeout may help solve the problem.
* You have encountered a timeout on the server side and the automatic reconnection in the client is disabled (the `reconnect` flag in the `MYSQL` structure is equal to 0).
* You are using a Windows client and the server had dropped the connection (probably because  `wait_timeout` expired) before the command was issued.

  The problem on Windows is that in some cases MySQL does not get an error from the OS when writing to the TCP/IP connection to the server, but instead gets the error when trying to read the answer from the connection.

  The solution to this is to either do a  `mysql_ping()` on the connection if there has been a long time since the last query (this is what Connector/ODBC does) or set  `wait_timeout` on the  **mysqld** server so high that it in practice never times out.
* You can also get these errors if you send a query to the server that is incorrect or too large. If  **mysqld** receives a packet that is too large or out of order, it assumes that something has gone wrong with the client and closes the connection. If you need big queries (for example, if you are working with big  `BLOB` columns), you can increase the query limit by setting the server's  `max_allowed_packet` variable, which has a default value of 64MB. You may also need to increase the maximum packet size on the client end. More information on setting the packet size is given in  Section B.3.2.8, “Packet Too Large”.

  An  `INSERT` or  `REPLACE` statement that inserts a great many rows can also cause these sorts of errors. Either one of these statements sends a single request to the server irrespective of the number of rows to be inserted; thus, you can often avoid the error by reducing the number of rows sent per  `INSERT` or  `REPLACE`.
* It is also possible to see this error if host name lookups fail (for example, if the DNS server on which your server or network relies goes down). This is because MySQL is dependent on the host system for name resolution, but has no way of knowing whether it is working—from MySQL's point of view the problem is indistinguishable from any other network timeout.

  You may also see the `MySQL server has gone away` error if MySQL is started with the  `skip_networking` system variable enabled.

  Another networking issue that can cause this error occurs if the MySQL port (default 3306) is blocked by your firewall, thus preventing any connections at all to the MySQL server.
* You can also encounter this error with applications that fork child processes, all of which try to use the same connection to the MySQL server. This can be avoided by using a separate connection for each child process.
* You have encountered a bug where the server died while executing the query.

You can check whether the MySQL server died and restarted by executing  **mysqladmin version** and examining the server's uptime. If the client connection was broken because  **mysqld** crashed and restarted, you should concentrate on finding the reason for the crash. Start by checking whether issuing the query again kills the server again. See  Section B.3.3.3, “What to Do If MySQL Keeps Crashing”.

You can obtain more information about lost connections by starting  **mysqld** with the  `log_error_verbosity` system variable set to 3. This logs some of the disconnection messages in the `hostname.err` file. See  Section 7.4.2, “The Error Log”.

If you want to create a bug report regarding this problem, be sure that you include the following information:

* Indicate whether the MySQL server died. You can find information about this in the server error log. See  Section B.3.3.3, “What to Do If MySQL Keeps Crashing”.
* If a specific query kills  **mysqld** and the tables involved were checked with  `CHECK TABLE` before you ran the query, can you provide a reproducible test case? See  Section 7.9, “Debugging MySQL”.
* What is the value of the  `wait_timeout` system variable in the MySQL server? ( **mysqladmin variables** gives you the value of this variable.)
* Have you tried to run  **mysqld** with the general query log enabled to determine whether the problem query appears in the log? (See  Section 7.4.3, “The General Query Log”.)

See also  Section B.3.2.9, “Communication Errors and Aborted Connections”, and  Section 1.6, “How to Report Bugs or Problems”.


