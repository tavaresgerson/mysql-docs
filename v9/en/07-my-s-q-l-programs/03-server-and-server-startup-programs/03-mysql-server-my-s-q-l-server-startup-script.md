### 6.3.3 mysql.server — MySQL Server Startup Script

MySQL distributions on Unix and Unix-like system include a script named **mysql.server**, which starts the MySQL server using **mysqld_safe**. It can be used on systems such as Linux and Solaris that use System V-style run directories to start and stop system services. It is also used by the macOS Startup Item for MySQL.

**mysql.server** is the script name as used within the MySQL source tree. The installed name might be different (for example, **mysqld** or **mysql**). In the following discussion, adjust the name **mysql.server** as appropriate for your system.

Note

For some Linux platforms, MySQL installation from RPM or Debian packages includes systemd support for managing MySQL server startup and shutdown. On these platforms, **mysql.server** and **mysqld_safe** are not installed because they are unnecessary. For more information, see Section 2.5.9, “Managing MySQL Server with systemd”.

To start or stop the server manually using the **mysql.server** script, invoke it from the command line with `start` or `stop` arguments:

```
mysql.server start
mysql.server stop
```

**mysql.server** changes location to the MySQL installation directory, then invokes **mysqld_safe**. To run the server as some specific user, add an appropriate `user` option to the `[mysqld]` group of the global `/etc/my.cnf` option file, as shown later in this section. (It is possible that you must edit **mysql.server** if you've installed a binary distribution of MySQL in a nonstandard location. Modify it to change location into the proper directory before it runs **mysqld_safe**. If you do this, your modified version of **mysql.server** may be overwritten if you upgrade MySQL in the future; make a copy of your edited version that you can reinstall.)

**mysql.server stop** stops the server by sending a signal to it. You can also stop the server manually by executing **mysqladmin shutdown**.

To start and stop MySQL automatically on your server, you must add start and stop commands to the appropriate places in your `/etc/rc*` files:

* If you use the Linux server RPM package (`MySQL-server-VERSION.rpm`), or a native Linux package installation, the **mysql.server** script may be installed in the `/etc/init.d` directory with the name `mysqld` or `mysql`. See Section 2.5.4, “Installing MySQL on Linux Using RPM Packages from Oracle”, for more information on the Linux RPM packages.

* If you install MySQL from a source distribution or using a binary distribution format that does not install **mysql.server** automatically, you can install the script manually. It can be found in the `support-files` directory under the MySQL installation directory or in a MySQL source tree. Copy the script to the `/etc/init.d` directory with the name **mysql** and make it executable:

  ```
  cp mysql.server /etc/init.d/mysql
  chmod +x /etc/init.d/mysql
  ```

  After installing the script, the commands needed to activate it to run at system startup depend on your operating system. On Linux, you can use **chkconfig**:

  ```
  chkconfig --add mysql
  ```

  On some Linux systems, the following command also seems to be necessary to fully enable the **mysql** script:

  ```
  chkconfig --level 345 mysql on
  ```

* On FreeBSD, startup scripts generally should go in `/usr/local/etc/rc.d/`. Install the `mysql.server` script as `/usr/local/etc/rc.d/mysql.server.sh` to enable automatic startup. The `rc(8)` manual page states that scripts in this directory are executed only if their base name matches the `*.sh` shell file name pattern. Any other files or directories present within the directory are silently ignored.

* As an alternative to the preceding setup, some operating systems also use `/etc/rc.local` or `/etc/init.d/boot.local` to start additional services on startup. To start up MySQL using this method, append a command like the one following to the appropriate startup file:

  ```
  /bin/sh -c 'cd /usr/local/mysql; ./bin/mysqld_safe --user=mysql &'
  ```

* For other systems, consult your operating system documentation to see how to install startup scripts.

**mysql.server** reads options from the `[mysql.server]` and `[mysqld]` sections of option files. For backward compatibility, it also reads `[mysql_server]` sections, but to be current you should rename such sections to `[mysql.server]`.

You can add options for **mysql.server** in a global `/etc/my.cnf` file. A typical `my.cnf` file might look like this:

```
[mysqld]
datadir=/usr/local/mysql/var
socket=/var/tmp/mysql.sock
port=3306
user=mysql

[mysql.server]
basedir=/usr/local/mysql
```

The **mysql.server** script supports the options shown in the following table. If specified, they *must* be placed in an option file, not on the command line. **mysql.server** supports only `start` and `stop` as command-line arguments.

**Table 6.8 mysql.server Option-File Options**

<table frame="box" rules="all" summary="Option-file options available for mysql.server."><col align="left" style="width: 20%"/><col align="left" style="width: 70%"/><col align="left" style="width: 10%"/><thead><tr><th>Option Name</th> <th>Description</th> <th>Type</th> </tr></thead><tbody><tr><th><code class="literal">basedir</code></th> <td>Path to MySQL installation directory</td> <td>Directory name</td> </tr><tr><th><code class="literal">datadir</code></th> <td>Path to MySQL data directory</td> <td>Directory name</td> </tr><tr><th><code class="literal">pid-file</code></th> <td>File in which server should write its process ID</td> <td>File name</td> </tr><tr><th><code class="literal">service-startup-timeout</code></th> <td>How long to wait for server startup</td> <td>Integer</td> </tr></tbody></table>

* `basedir=dir_name`

  The path to the MySQL installation directory.

* `datadir=dir_name`

  The path to the MySQL data directory.

* `pid-file=file_name`

  The path name of the file in which the server should write its process ID. The server creates the file in the data directory unless an absolute path name is given to specify a different directory.

  If this option is not given, **mysql.server** uses a default value of `host_name.pid`. The PID file value passed to **mysqld_safe** overrides any value specified in the `[mysqld_safe]` option file group. Because **mysql.server** reads the `[mysqld]` option file group but not the `[mysqld_safe]` group, you can ensure that **mysqld_safe** gets the same value when invoked from **mysql.server** as when invoked manually by putting the same `pid-file` setting in both the `[mysqld_safe]` and `[mysqld]` groups.

* `service-startup-timeout=seconds`

  How long in seconds to wait for confirmation of server startup. If the server does not start within this time, **mysql.server** exits with an error. The default value is 900. A value of 0 means not to wait at all for startup. Negative values mean to wait forever (no timeout).
