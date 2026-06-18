### 2.9.5 Starting and Stopping MySQL Automatically

This section discusses methods for starting and stopping the MySQL
server.

Generally, you start the [**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server") server in one
of these ways:

* Invoke [**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server") directly. This works on any
  platform.

* On Windows, you can set up a MySQL service that runs
  automatically when Windows starts. See
  [Section 2.3.3.8, “Starting MySQL as a Windows Service”](windows-start-service.html "2.3.3.8 Starting MySQL as a Windows Service").

* On Unix and Unix-like systems, you can invoke
  [**mysqld\_safe**](mysqld-safe.html "6.3.2 mysqld_safe — MySQL Server Startup Script"), which tries to determine the
  proper options for [**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server") and then runs it
  with those options. See [Section 6.3.2, “mysqld\_safe — MySQL Server Startup Script”](mysqld-safe.html "6.3.2 mysqld_safe — MySQL Server Startup Script").

* On Linux systems that support systemd, you can use it to
  control the server. See [Section 2.5.9, “Managing MySQL Server with systemd”](using-systemd.html "2.5.9 Managing MySQL Server with systemd").

* On systems that use System V-style run directories (that is,
  `/etc/init.d` and run-level specific
  directories), invoke [**mysql.server**](mysql-server.html "6.3.3 mysql.server — MySQL Server Startup Script"). This
  script is used primarily at system startup and shutdown. It
  usually is installed under the name `mysql`.
  The [**mysql.server**](mysql-server.html "6.3.3 mysql.server — MySQL Server Startup Script") script starts the server
  by invoking [**mysqld\_safe**](mysqld-safe.html "6.3.2 mysqld_safe — MySQL Server Startup Script"). See
  [Section 6.3.3, “mysql.server — MySQL Server Startup Script”](mysql-server.html "6.3.3 mysql.server — MySQL Server Startup Script").

* On macOS, install a launchd daemon to enable automatic MySQL
  startup at system startup. The daemon starts the server by
  invoking [**mysqld\_safe**](mysqld-safe.html "6.3.2 mysqld_safe — MySQL Server Startup Script"). For details, see
  [Section 2.4.3, “Installing and Using the MySQL Launch Daemon”](macos-installation-launchd.html "2.4.3 Installing and Using the MySQL Launch Daemon"). A MySQL
  Preference Pane also provides control for starting and
  stopping MySQL through the System Preferences. See
  [Section 2.4.4, “Installing and Using the MySQL Preference Pane”](macos-installation-prefpane.html "2.4.4 Installing and Using the MySQL Preference Pane").

* On Solaris, use the service management framework (SMF) system
  to initiate and control MySQL startup.

systemd, the [**mysqld\_safe**](mysqld-safe.html "6.3.2 mysqld_safe — MySQL Server Startup Script") and
[**mysql.server**](mysql-server.html "6.3.3 mysql.server — MySQL Server Startup Script") scripts, Solaris SMF, and the
macOS Startup Item (or MySQL Preference Pane) can be used to start
the server manually, or automatically at system startup time.
systemd, [**mysql.server**](mysql-server.html "6.3.3 mysql.server — MySQL Server Startup Script"), and the Startup Item
also can be used to stop the server.

The following table shows which option groups the server and
startup scripts read from option files.

**Table 2.16 MySQL Startup Scripts and Supported Server Option Groups**

<table summary="MySQL startup scripts and the server option groups they support."><col style="width: 20%"/><col style="width: 80%"/><thead><tr>
<th>Script</th>
<th>Option Groups</th>
</tr></thead><tbody><tr>
<td><a class="link" href="mysqld.html" title="6.3.1 mysqld — The MySQL Server"><span class="command"><strong>mysqld</strong></span></a></td>
<td><code class="literal">[mysqld]</code>, <code class="literal">[server]</code>,
            <code class="literal">[mysqld-<em class="replaceable"><code>major_version</code></em>]</code></td>
</tr><tr>
<td><a class="link" href="mysqld-safe.html" title="6.3.2 mysqld_safe — MySQL Server Startup Script"><span class="command"><strong>mysqld_safe</strong></span></a></td>
<td><code class="literal">[mysqld]</code>, <code class="literal">[server]</code>,
            <code class="literal">[mysqld_safe]</code></td>
</tr><tr>
<td><a class="link" href="mysql-server.html" title="6.3.3 mysql.server — MySQL Server Startup Script"><span class="command"><strong>mysql.server</strong></span></a></td>
<td><code class="literal">[mysqld]</code>, <code class="literal">[mysql.server]</code>,
            <code class="literal">[server]</code></td>
</tr></tbody></table>

`[mysqld-major_version]`
means that groups with names like
`[mysqld-9.4]` and
`[mysqld-9.5]` are read by servers
having versions 9.4.x, 9.5.x, and so
forth. This feature can be used to specify options that can be
read only by servers within a given release series.

For backward compatibility, [**mysql.server**](mysql-server.html "6.3.3 mysql.server — MySQL Server Startup Script") also
reads the `[mysql_server]` group and
[**mysqld\_safe**](mysqld-safe.html "6.3.2 mysqld_safe — MySQL Server Startup Script") also reads the
`[safe_mysqld]` group. To be current, you should
update your option files to use the
`[mysql.server]` and
`[mysqld_safe]` groups instead.

For more information on MySQL configuration files and their
structure and contents, see [Section 6.2.2.2, “Using Option Files”](option-files.html "6.2.2.2 Using Option Files").