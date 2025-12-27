### 2.9.5 Starting and Stopping MySQL Automatically

This section discusses methods for starting and stopping the MySQL server.

Generally, you start the **mysqld** server in one of these ways:

* Invoke **mysqld** directly. This works on any platform.

* On Windows, you can set up a MySQL service that runs automatically when Windows starts. See Section 2.3.4.8, “Starting MySQL as a Windows Service”.

* On Unix and Unix-like systems, you can invoke **mysqld\_safe**, which tries to determine the proper options for **mysqld** and then runs it with those options. See Section 4.3.2, “mysqld\_safe — MySQL Server Startup Script”.

* On Linux systems that support systemd, you can use it to control the server. See Section 2.5.10, “Managing MySQL Server with systemd”.

* On systems that use System V-style run directories (that is, `/etc/init.d` and run-level specific directories), invoke **mysql.server**. This script is used primarily at system startup and shutdown. It usually is installed under the name `mysql`. The **mysql.server** script starts the server by invoking **mysqld\_safe**. See Section 4.3.3, “mysql.server — MySQL Server Startup Script”.

* On macOS, install a launchd daemon to enable automatic MySQL startup at system startup. The daemon starts the server by invoking **mysqld\_safe**. For details, see Section 2.4.3, “Installing a MySQL Launch Daemon”. A MySQL Preference Pane also provides control for starting and stopping MySQL through the System Preferences. See Section 2.4.4, “Installing and Using the MySQL Preference Pane”.

* On Solaris, use the service management framework (SMF) system to initiate and control MySQL startup.

systemd, the **mysqld\_safe** and **mysql.server** scripts, Solaris SMF, and the macOS Startup Item (or MySQL Preference Pane) can be used to start the server manually, or automatically at system startup time. systemd, **mysql.server**, and the Startup Item also can be used to stop the server.

The following table shows which option groups the server and startup scripts read from option files.

**Table 2.15 MySQL Startup Scripts and Supported Server Option Groups**

<table summary="MySQL startup scripts and the server option groups they support."><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Script</th> <th>Option Groups</th> </tr></thead><tbody><tr> <td><a class="link" href="mysqld.html" title="4.3.1 mysqld — The MySQL Server"><span class="command"><strong>mysqld</strong></span></a></td> <td><code class="literal">[mysqld]</code>, <code class="literal">[server]</code>, <code class="literal">[mysqld-<em class="replaceable"><code>major_version</code></em>]</code></td> </tr><tr> <td><a class="link" href="mysqld-safe.html" title="4.3.2 mysqld_safe — MySQL Server Startup Script"><span class="command"><strong>mysqld_safe</strong></span></a></td> <td><code class="literal">[mysqld]</code>, <code class="literal">[server]</code>, <code class="literal">[mysqld_safe]</code></td> </tr><tr> <td><a class="link" href="mysql-server.html" title="4.3.3 mysql.server — MySQL Server Startup Script"><span class="command"><strong>mysql.server</strong></span></a></td> <td><code class="literal">[mysqld]</code>, <code class="literal">[mysql.server]</code>, <code class="literal">[server]</code></td> </tr></tbody></table>

`[mysqld-major_version]` means that groups with names like `[mysqld-5.6]` and `[mysqld-5.7]` are read by servers having versions 5.6.x, 5.7.x, and so forth. This feature can be used to specify options that can be read only by servers within a given release series.

For backward compatibility, **mysql.server** also reads the `[mysql_server]` group and **mysqld\_safe** also reads the `[safe_mysqld]` group. To be current, you should update your option files to use the `[mysql.server]` and `[mysqld_safe]` groups instead.

For more information on MySQL configuration files and their structure and contents, see Section 4.2.2.2, “Using Option Files”.
