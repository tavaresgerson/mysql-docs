### 2.9.5 Starting and Stopping MySQL Automatically

This section discusses methods for starting and stopping the MySQL server.

Generally, you start the  `mysqld` server in one of these ways:

* Invoke  `mysqld` directly. This works on any platform.
* On Windows, you can set up a MySQL service that runs automatically when Windows starts. See Section 2.3.3.8, “Starting MySQL as a Windows Service”.
* On Unix and Unix-like systems, you can invoke `mysqld_safe`, which tries to determine the proper options for  `mysqld` and then runs it with those options. See  Section 6.3.2, “mysqld_safe — MySQL Server Startup Script”.
* On Linux systems that support systemd, you can use it to control the server. See  Section 2.5.9, “Managing MySQL Server with systemd”.
* On systems that use System V-style run directories (that is, `/etc/init.d` and run-level specific directories), invoke  `mysql.server`. This script is used primarily at system startup and shutdown. It usually is installed under the name `mysql`. The  `mysql.server` script starts the server by invoking  `mysqld_safe`. See Section 6.3.3, “mysql.server — MySQL Server Startup Script”.
* On macOS, install a launchd daemon to enable automatic MySQL startup at system startup. The daemon starts the server by invoking  `mysqld_safe`. For details, see Section 2.4.3, “Installing and Using the MySQL Launch Daemon”. A MySQL Preference Pane also provides control for starting and stopping MySQL through the System Preferences. See Section 2.4.4, “Installing and Using the MySQL Preference Pane”.
* On Solaris, use the service management framework (SMF) system to initiate and control MySQL startup.

systemd, the `mysqld_safe` and `mysql.server` scripts, Solaris SMF, and the macOS Startup Item (or MySQL Preference Pane) can be used to start the server manually, or automatically at system startup time. systemd, `mysql.server`, and the Startup Item also can be used to stop the server.

The following table shows which option groups the server and startup scripts read from option files.

**Table 2.16 MySQL Startup Scripts and Supported Server Option Groups**

<table><thead><tr> <th>Script</th> <th>Option Groups</th> </tr></thead><tbody><tr> <td><span><strong>mysqld</strong></span></td> <td><code>[mysqld]</code>, <code>[server]</code>, <code>[mysqld-<em><code>major_version</code></em>]</code></td> </tr><tr> <td><span><strong>mysqld_safe</strong></span></td> <td><code>[mysqld]</code>, <code>[server]</code>, <code>[mysqld_safe]</code></td> </tr><tr> <td><span><strong>mysql.server</strong></span></td> <td><code>[mysqld]</code>, <code>[mysql.server]</code>, <code>[server]</code></td> </tr></tbody></table>

`[mysqld-major_version]` means that groups with names like `[mysqld-8.3]` and `[mysqld-8.4]` are read by servers having versions 8.3.x, 8.4.x, and so forth. This feature can be used to specify options that can be read only by servers within a given release series.

For backward compatibility,  `mysql.server` also reads the `[mysql_server]` group and `mysqld_safe` also reads the `[safe_mysqld]` group. To be current, you should update your option files to use the `[mysql.server]` and `[mysqld_safe]` groups instead.

For more information on MySQL configuration files and their structure and contents, see  Section 6.2.2.2, “Using Option Files”.
