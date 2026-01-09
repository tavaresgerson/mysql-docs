#### 2.3.3.3 Selecting a MySQL Server Type

The following table shows the available servers for Windows in MySQL 9.5.

<table summary="Servers available for Windows in MySQL 9.5."><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Binary</th> <th>Description</th> </tr></thead><tbody><tr> <td><a class="link" href="mysqld.html" title="6.3.1 mysqld — The MySQL Server"><span><strong>mysqld</strong></span></a></td> <td>Optimized binary with named-pipe support</td> </tr><tr> <td><a class="link" href="mysqld.html" title="6.3.1 mysqld — The MySQL Server"><span><strong>mysqld-debug</strong></span></a></td> <td>Like <a class="link" href="mysqld.html" title="6.3.1 mysqld — The MySQL Server"><span><strong>mysqld</strong></span></a>, but compiled with full debugging and automatic memory allocation checking</td> </tr></tbody></table>

Each of the servers in a distribution support the same set of storage engines. The `SHOW ENGINES` statement displays which engines a given server supports.

All Windows MySQL 9.5 servers have support for symbolic linking of database directories.

MySQL supports TCP/IP on all Windows platforms. MySQL servers on Windows also support named pipes, if you start the server with the `named_pipe` system variable enabled. It is necessary to enable this variable explicitly because some users have experienced problems with shutting down the MySQL server when named pipes were used. The default is to use TCP/IP regardless of platform because named pipes are slower than TCP/IP in many Windows configurations.
