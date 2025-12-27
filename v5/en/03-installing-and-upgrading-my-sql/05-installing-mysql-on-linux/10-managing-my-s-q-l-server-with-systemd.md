### 2.5.10 Managing MySQL Server with systemd

If you install MySQL using an RPM or Debian package on the following Linux platforms, server startup and shutdown is managed by systemd:

* RPM package platforms:

  + Enterprise Linux variants version 7 and higher
  + SUSE Linux Enterprise Server 12 and higher
* Debian family platforms:

  + Debian platforms
  + Ubuntu platforms

If you install MySQL from a generic binary distribution on a platform that uses systemd, you can manually configure systemd support for MySQL following the instructions provided in the post-installation setup section of the MySQL 5.7 Secure Deployment Guide.

If you install MySQL from a source distribution on a platform that uses systemd, obtain systemd support for MySQL by configuring the distribution using the `-DWITH_SYSTEMD=1` **CMake** option. See Section 2.8.7, “MySQL Source-Configuration Options”.

The following discussion covers these topics:

* Overview of systemd
* Configuring systemd for MySQL
* Configuring Multiple MySQL Instances Using systemd
* Migrating from mysqld\_safe to systemd

Note

On platforms for which systemd support for MySQL is installed, scripts such as **mysqld\_safe** and the System V initialization script are unnecessary and are not installed. For example, **mysqld\_safe** can handle server restarts, but systemd provides the same capability, and does so in a manner consistent with management of other services rather than by using an application-specific program.

One implication of the non-use of **mysqld\_safe** on platforms that use systemd for server management is that use of `[mysqld_safe]` or `[safe_mysqld]` sections in option files is not supported and might lead to unexpected behavior.

Because systemd has the capability of managing multiple MySQL instances on platforms for which systemd support for MySQL is installed, **mysqld\_multi** and **mysqld\_multi.server** are unnecessary and are not installed.

#### Overview of systemd

systemd provides automatic MySQL server startup and shutdown. It also enables manual server management using the **systemctl** command. For example:

```sql
systemctl {start|stop|restart|status} mysqld
```

Alternatively, use the **service** command (with the arguments reversed), which is compatible with System V systems:

```sql
service mysqld {start|stop|restart|status}
```

Note

For the **systemctl** or **service** commands, if the MySQL service name is not `mysqld`, use the appropriate name. For example, use `mysql` rather than `mysqld` on Debian-based and SLES systems.

Support for systemd includes these files:

* `mysqld.service` (RPM platforms), `mysql.service` (Debian platforms): systemd service unit configuration file, with details about the MySQL service.

* `mysqld@.service` (RPM platforms), `mysql@.service` (Debian platforms): Like `mysqld.service` or `mysql.service`, but used for managing multiple MySQL instances.

* `mysqld.tmpfiles.d`: File containing information to support the `tmpfiles` feature. This file is installed under the name `mysql.conf`.

* `mysqld_pre_systemd` (RPM platforms), `mysql-system-start` (Debian platforms): Support script for the unit file. This script assists in creating the error log file only if the log location matches a pattern (`/var/log/mysql*.log` for RPM platforms, `/var/log/mysql/*.log` for Debian platforms). In other cases, the error log directory must be writable or the error log must be present and writable for the user running the **mysqld** process.

#### Configuring systemd for MySQL

To add or change systemd options for MySQL, these methods are available:

* Use a localized systemd configuration file.
* Arrange for systemd to set environment variables for the MySQL server process.

* Set the `MYSQLD_OPTS` systemd variable.

To use a localized systemd configuration file, create the `/etc/systemd/system/mysqld.service.d` directory if it does not exist. In that directory, create a file that contains a `[Service]` section listing the desired settings. For example:

```sql
[Service]
LimitNOFILE=max_open_files
PIDFile=/path/to/pid/file
Nice=nice_level
LimitCore=core_file_limit
Environment="LD_PRELOAD=/path/to/malloc/library"
Environment="TZ=time_zone_setting"
```

The discussion here uses `override.conf` as the name of this file. Newer versions of systemd support the following command, which opens an editor and permits you to edit the file:

```sql
systemctl edit mysqld  # RPM platforms
systemctl edit mysql   # Debian platforms
```

Whenever you create or change `override.conf`, reload the systemd configuration, then tell systemd to restart the MySQL service:

```sql
systemctl daemon-reload
systemctl restart mysqld  # RPM platforms
systemctl restart mysql   # Debian platforms
```

With systemd, the `override.conf` configuration method must be used for certain parameters, rather than settings in a `[mysqld]`, `[mysqld_safe]`, or `[safe_mysqld]` group in a MySQL option file:

* For some parameters, `override.conf` must be used because systemd itself must know their values and it cannot read MySQL option files to get them.

* Parameters that specify values otherwise settable only using options known to **mysqld\_safe** must be specified using systemd because there is no corresponding **mysqld** parameter.

For additional information about using systemd rather than **mysqld\_safe**, see Migrating from mysqld\_safe to systemd.

You can set the following parameters in `override.conf`:

* To specify the process ID file:

  + As of MySQL 5.7.10: Use `override.conf` and change both `PIDFile` and `ExecStart` to name the PID file path name. Any setting of the process ID file in MySQL option files is ignored. To modify `ExecStart`, it must first be cleared. For example:

    ```sql
    [Service]
    PIDFile=/var/run/mysqld/mysqld-custom.pid
    ExecStart=
    ExecStart=/usr/sbin/mysqld --pid-file=/var/run/mysqld/mysqld-custom.pid $MYSQLD_OPTS
    ```

  + Before MySQL 5.7.10: Use `PIDFile` in `override.conf` rather than the `--pid-file` option for **mysqld** or **mysqld\_safe**. systemd must know the PID file location so that it can restart or stop the server. If the PID file value is specified in a MySQL option file, the value must match the `PIDFile` value or MySQL startup may fail.

* To set the number of file descriptors available to the MySQL server, use `LimitNOFILE` in `override.conf` rather than the `open_files_limit` system variable for **mysqld** or `--open-files-limit` option for **mysqld\_safe**.

* To set the maximum core file size, use `LimitCore` in `override.conf` rather than the `--core-file-size` option for **mysqld\_safe**.

* To set the scheduling priority for the MySQL server, use `Nice` in `override.conf` rather than the `--nice` option for **mysqld\_safe**.

Some MySQL parameters are configured using environment variables:

* `LD_PRELOAD`: Set this variable if the MySQL server should use a specific memory-allocation library.

* `TZ`: Set this variable to specify the default time zone for the server.

There are multiple ways to specify environment variable values for use by the MySQL server process managed by systemd:

* Use `Environment` lines in the `override.conf` file. For the syntax, see the example in the preceding discussion that describes how to use this file.

* Specify the values in the `/etc/sysconfig/mysql` file (create the file if it does not exist). Assign values using the following syntax:

  ```sql
  LD_PRELOAD=/path/to/malloc/library
  TZ=time_zone_setting
  ```

  After modifying `/etc/sysconfig/mysql`, restart the server to make the changes effective:

  ```sql
  systemctl restart mysqld  # RPM platforms
  systemctl restart mysql   # Debian platforms
  ```

To specify options for **mysqld** without modifying systemd configuration files directly, set or unset the `MYSQLD_OPTS` systemd variable. For example:

```sql
systemctl set-environment MYSQLD_OPTS="--general_log=1"
systemctl unset-environment MYSQLD_OPTS
```

`MYSQLD_OPTS` can also be set in the `/etc/sysconfig/mysql` file.

After modifying the systemd environment, restart the server to make the changes effective:

```sql
systemctl restart mysqld  # RPM platforms
systemctl restart mysql   # Debian platforms
```

For platforms that use systemd, the data directory is initialized if empty at server startup. This might be a problem if the data directory is a remote mount that has temporarily disappeared: The mount point would appear to be an empty data directory, which then would be initialized as a new data directory. As of MySQL 5.7.20, to suppress this automatic initialization behavior, specify the following line in the `/etc/sysconfig/mysql` file (create the file if it does not exist):

```sql
NO_INIT=true
```

#### Configuring Multiple MySQL Instances Using systemd

This section describes how to configure systemd for multiple instances of MySQL.

Note

Because systemd has the capability of managing multiple MySQL instances on platforms for which systemd support is installed, **mysqld\_multi** and **mysqld\_multi.server** are unnecessary and are not installed. This is true as of MySQL 5.7.13 for RPM platforms, 5.7.19 for Debian platforms.

To use multiple-instance capability, modify the `my.cnf` option file to include configuration of key options for each instance. These file locations are typical:

* `/etc/my.cnf` or `/etc/mysql/my.cnf` (RPM platforms)

* `/etc/mysql/mysql.conf.d/mysqld.cnf` (Debian platforms)

For example, to manage two instances named `replica01` and `replica02`, add something like this to the option file:

RPM platforms:

```sql
[mysqld@replica01]
datadir=/var/lib/mysql-replica01
socket=/var/lib/mysql-replica01/mysql.sock
port=3307
log-error=/var/log/mysqld-replica01.log

[mysqld@replica02]
datadir=/var/lib/mysql-replica02
socket=/var/lib/mysql-replica02/mysql.sock
port=3308
log-error=/var/log/mysqld-replica02.log
```

Debian platforms:

```sql
[mysqld@replica01]
datadir=/var/lib/mysql-replica01
socket=/var/lib/mysql-replica01/mysql.sock
port=3307
log-error=/var/log/mysql/replica01.log

[mysqld@replica02]
datadir=/var/lib/mysql-replica02
socket=/var/lib/mysql-replica02/mysql.sock
port=3308
log-error=/var/log/mysql/replica02.log
```

The replica names shown here use `@` as the delimiter because that is the only delimiter supported by systemd.

Instances then are managed by normal systemd commands, such as:

```sql
systemctl start mysqld@replica01
systemctl start mysqld@replica02
```

To enable instances to run at boot time, do this:

```sql
systemctl enable mysqld@replica01
systemctl enable mysqld@replica02
```

Use of wildcards is also supported. For example, this command displays the status of all replica instances:

```sql
systemctl status 'mysqld@replica*'
```

For management of multiple MySQL instances on the same machine, systemd automatically uses a different unit file:

* `mysqld@.service` rather than `mysqld.service` (RPM platforms)

* `mysql@.service` rather than `mysql.service` (Debian platforms)

In the unit file, `%I` and `%i` reference the parameter passed in after the `@` marker and are used to manage the specific instance. For a command such as this:

```sql
systemctl start mysqld@replica01
```

systemd starts the server using a command such as this:

```sql
mysqld --defaults-group-suffix=@%I ...
```

The result is that the `[server]`, `[mysqld]`, and `[mysqld@replica01]` option groups are read and used for that instance of the service.

Note

On Debian platforms, AppArmor prevents the server from reading or writing `/var/lib/mysql-replica*`, or anything other than the default locations. To address this, you must customize or disable the profile in `/etc/apparmor.d/usr.sbin.mysqld`.

Note

On Debian platforms, the packaging scripts for MySQL uninstallation cannot currently handle `mysqld@` instances. Before removing or upgrading the package, you must stop any extra instances manually first.

#### Migrating from mysqld\_safe to systemd

Because **mysqld\_safe** is not installed on platforms that use systemd to manage MySQL, options previously specified for that program (for example, in an `[mysqld_safe]` or `[safe_mysqld]` option group) must be specified another way:

* Some **mysqld\_safe** options are also understood by **mysqld** and can be moved from the `[mysqld_safe]` or `[safe_mysqld]` option group to the `[mysqld]` group. This does *not* include `--pid-file`, `--open-files-limit`, or `--nice`. To specify those options, use the `override.conf` systemd file, described previously.

  Note

  On systemd platforms, use of `[mysqld_safe]` and `[safe_mysqld]` option groups is not supported and may lead to unexpected behavior.

* For some **mysqld\_safe** options, there are similar **mysqld** options. For example, the **mysqld\_safe** option for enabling `syslog` logging is `--syslog`, which is deprecated. For **mysqld**, enable the `log_syslog` system variable instead. For details, see Section 5.4.2, “The Error Log”.

* **mysqld\_safe** options not understood by **mysqld** can be specified in `override.conf` or environment variables. For example, with **mysqld\_safe**, if the server should use a specific memory allocation library, this is specified using the `--malloc-lib` option. For installations that manage the server with systemd, arrange to set the `LD_PRELOAD` environment variable instead, as described previously.
