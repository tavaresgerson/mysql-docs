### 2.5.5 Installing MySQL on Linux Using RPM Packages from Oracle

The recommended way to install MySQL on RPM-based Linux distributions is by using the RPM packages provided by Oracle. There are two sources for obtaining them, for the Community Edition of MySQL:

* From the MySQL software repositories:

  + The MySQL Yum repository (see Section 2.5.1, “Installing MySQL on Linux Using the MySQL Yum Repository” for details).

  + The MySQL SLES repository (see Section 2.5.4, “Installing MySQL on Linux Using the MySQL SLES Repository” for details).

* From the  [Download MySQL Community Server](https://dev.mysql.com/downloads/mysql/) page in the [MySQL Developer Zone](https://dev.mysql.com/).

Note

RPM distributions of MySQL are also provided by other vendors. Be aware that they may differ from those built by Oracle in features, capabilities, and conventions (including communication setup), and that the installation instructions in this manual do not necessarily apply to them. The vendor's instructions should be consulted instead.

If you have such a third-party distribution of MySQL running on your system and now want to migrate to Oracle's distribution using the RPM packages downloaded from the MySQL Developer Zone, see Compatibility with RPM Packages from Other Vendors below. The preferred method of migration, however, is to use the MySQL Yum repository or MySQL SLES repository.

RPM packages for MySQL are listed in the following tables:

**Table 2.9 RPM Packages for MySQL Community Edition**

<table frame="all"><col style="width: 35%"/><col style="width: 25%"/><thead><tr> <th>Package Name</th> <th>Summary</th> </tr></thead><tbody><tr> <td><code>mysql-community-server</code></td> <td>Database server and related tools</td> </tr><tr> <td><code>mysql-community-client</code></td> <td>MySQL client applications and tools</td> </tr><tr> <td><code>mysql-community-common</code></td> <td>Common files for server and client libraries</td> </tr><tr> <td><code>mysql-community-devel</code></td> <td>Development header files and libraries for MySQL database client applications</td> </tr><tr> <td><code>mysql-community-libs</code></td> <td>Shared libraries for MySQL database client applications</td> </tr><tr> <td><code>mysql-community-libs-compat</code></td> <td>Shared compatibility libraries for previous MySQL installations</td> </tr><tr> <td><code>mysql-community-embedded</code></td> <td>MySQL embedded library</td> </tr><tr> <td><code>mysql-community-embedded-devel</code></td> <td>Development header files and libraries for MySQL as an embeddable library</td> </tr><tr> <td><code>mysql-community-test</code></td> <td>Test suite for the MySQL server</td> </tr></tbody></table>

**Table 2.10 RPM Packages for the MySQL Enterprise Edition**

<table frame="all"><col style="width: 35%"/><col style="width: 25%"/><thead><tr> <th>Package Name</th> <th>Summary</th> </tr></thead><tbody><tr> <td><code>mysql-commercial-server</code></td> <td>Database server and related tools</td> </tr><tr> <td><code>mysql-commercial-client</code></td> <td>MySQL client applications and tools</td> </tr><tr> <td><code>mysql-commercial-common</code></td> <td>Common files for server and client libraries</td> </tr><tr> <td><code>mysql-commercial-devel</code></td> <td>Development header files and libraries for MySQL database client applications</td> </tr><tr> <td><code>mysql-commercial-libs</code></td> <td>Shared libraries for MySQL database client applications</td> </tr><tr> <td><code>mysql-commercial-libs-compat</code></td> <td>Shared compatibility libraries for previous MySQL installations</td> </tr><tr> <td><code>mysql-commercial-embedded</code></td> <td>MySQL embedded library</td> </tr><tr> <td><code>mysql-commercial-embedded-devel</code></td> <td>Development header files and libraries for MySQL as an embeddable library</td> </tr><tr> <td><code>mysql-commercial-test</code></td> <td>Test suite for the MySQL server</td> </tr></tbody></table>

The full names for the RPMs have the following syntax:

```sql
packagename-version-distribution-arch.rpm
```

The *`distribution`* and *`arch`* values indicate the Linux distribution and the processor type for which the package was built. See the table below for lists of the distribution identifiers:

**Table 2.11 MySQL Linux RPM Package Distribution Identifiers**

<table><col style="width: 25%"/><col style="width: 75%"/><thead><tr> <th>distribution Value</th> <th>Intended Use</th> </tr></thead><tbody><tr> <td>el<em class="replaceable"><code>{version}</code></em> where <em class="replaceable"><code>{version}</code></em> is the major Enterprise Linux version, such as <code>el8</code></td> <td>EL6 (8.0), EL7, EL8, EL9, and EL10-based platforms (for example, the corresponding versions of Oracle Linux, Red Hat Enterprise Linux, and CentOS)</td> </tr><tr> <td><code>sles12</code></td> <td>SUSE Linux Enterprise Server 12</td> </tr></tbody></table>

To see all files in an RPM package (for example, `mysql-community-server`), use the following command:

```sql
$> rpm -qpl mysql-community-server-version-distribution-arch.rpm
```

*The discussion in the rest of this section applies only to an installation process using the RPM packages directly downloaded from Oracle, instead of through a MySQL repository.*

Dependency relationships exist among some of the packages. If you plan to install many of the packages, you may wish to download the RPM bundle **tar** file instead, which contains all the RPM packages listed above, so that you need not download them separately.

In most cases, you need to install the `mysql-community-server`, `mysql-community-client`, `mysql-community-libs`, `mysql-community-common`, and `mysql-community-libs-compat` packages to get a functional, standard MySQL installation. To perform such a standard, basic installation, go to the folder that contains all those packages (and, preferably, no other RPM packages with similar names), and issue the following command for platforms *other than* Red Hat Enterprise Linux/Oracle Linux/CentOS:

```sql
$> sudo yum install mysql-community-{server,client,common,libs}-*
```

Replace **yum** with **zypper** for SLES.

For Red Hat Enterprise Linux/Oracle Linux/CentOS systems:

```sql
$> sudo yum install mysql-community-{server,client,common,libs}-* mysql-5.*­
```

While it is much preferable to use a high-level package management tool like **yum** to install the packages, users who prefer direct **rpm** commands can replace the **yum install** command with the **rpm -Uvh** command; however, using **rpm -Uvh** instead makes the installation process more prone to failure, due to potential dependency issues the installation process might run into.

To install only the client programs, you can skip `mysql-community-server` in your list of packages to install; issue the following command for platforms *other than* Red Hat Enterprise Linux/Oracle Linux/CentOS:

```sql
$> sudo yum install mysql-community-{client,common,libs}-*
```

Replace **yum** with **zypper** for SLES.

For Red Hat Enterprise Linux/Oracle Linux/CentOS systems:

```sql
$> sudo yum install mysql-community-{client,common,libs}-* mysql-5.*
```

A standard installation of MySQL using the RPM packages result in files and resources created under the system directories, shown in the following table.

**Table 2.12 MySQL Installation Layout for Linux RPM Packages from the MySQL Developer Zone**

<table><col style="width: 55%"/><col style="width: 45%"/><thead><tr> <th>Files or Resources</th> <th>Location</th> </tr></thead><tbody><tr> <td>Client programs and scripts</td> <td><code class="filename">/usr/bin</code></td> </tr><tr> <td><a class="link" href="mysqld.html" title="4.3.1 mysqld — The MySQL Server"><span class="command"><strong>mysqld</strong></span></a> server</td> <td><code class="filename">/usr/sbin</code></td> </tr><tr> <td>Configuration file</td> <td><code class="filename">/etc/my.cnf</code></td> </tr><tr> <td>Data directory</td> <td><code class="filename">/var/lib/mysql</code></td> </tr><tr> <td>Error log file</td> <td><p> For RHEL, Oracle Linux, CentOS or Fedora platforms: <code class="filename">/var/log/mysqld.log</code> </p><p> For SLES: <code class="filename">/var/log/mysql/mysqld.log</code> </p></td> </tr><tr> <td>Value of <a class="link" href="server-system-variables.html#sysvar_secure_file_priv"><code>secure_file_priv</code></a></td> <td><code class="filename">/var/lib/mysql-files</code></td> </tr><tr> <td>System V init script</td> <td><p> For RHEL, Oracle Linux, CentOS or Fedora platforms: <code class="filename">/etc/init.d/mysqld</code> </p><p> For SLES: <code class="filename">/etc/init.d/mysql</code> </p></td> </tr><tr> <td>Systemd service</td> <td><p> For RHEL, Oracle Linux, CentOS or Fedora platforms: <code class="filename">mysqld</code> </p><p> For SLES: <code class="filename">mysql</code> </p></td> </tr><tr> <td>Pid file</td> <td><code class="filename"> /var/run/mysql/mysqld.pid</code></td> </tr><tr> <td>Socket</td> <td><code class="filename">/var/lib/mysql/mysql.sock</code></td> </tr><tr> <td>Keyring directory</td> <td><code class="filename">/var/lib/mysql-keyring</code></td> </tr><tr> <td>Unix manual pages</td> <td><code class="filename">/usr/share/man</code></td> </tr><tr> <td>Include (header) files</td> <td><code class="filename">/usr/include/mysql</code></td> </tr><tr> <td>Libraries</td> <td><code class="filename">/usr/lib/mysql</code></td> </tr><tr> <td>Miscellaneous support files (for example, error messages, and character set files)</td> <td><code class="filename">/usr/share/mysql</code></td> </tr></tbody></table>

The installation also creates a user named `mysql` and a group named `mysql` on the system.

Notes

* The `mysql` user is created using the `-r` and `-s /bin/false` options of the `useradd` command, so that it does not have login permissions to your server host (see Creating the mysql User and Group for details). To switch to the `mysql` user on your OS, use the `--shell=/bin/bash` option for the `su` command:

  ```sql
  su - mysql --shell=/bin/bash
  ```

* Installation of previous versions of MySQL using older packages might have created a configuration file named `/usr/my.cnf`. It is highly recommended that you examine the contents of the file and migrate the desired settings inside to the file `/etc/my.cnf` file, then remove `/usr/my.cnf`.

MySQL is not automatically started at the end of the installation process. For Red Hat Enterprise Linux, Oracle Linux, CentOS, and Fedora systems, use the following command to start MySQL:

```sql
$> sudo service mysqld start
```

For SLES systems, the command is the same, but the service name is different:

```sql
$> sudo service mysql start
```

If the operating system is systemd enabled, standard **service** commands such as **stop**, **start**, **status** and **restart** should be used to manage the MySQL server service. The `mysqld` service is enabled by default, and it starts at system reboot. Notice that certain things might work differently on systemd platforms: for example, changing the location of the data directory might cause issues. See Section 2.5.10, “Managing MySQL Server with systemd” for additional information.

During an upgrade installation using RPM and DEB packages, if the MySQL server is running when the upgrade occurs then the MySQL server is stopped, the upgrade occurs, and the MySQL server is restarted. One exception: if the edition also changes during an upgrade (such as community to commercial, or vice-versa), then MySQL server is not restarted.

At the initial start up of the server, the following happens, given that the data directory of the server is empty:

* The server is initialized.
* An SSL certificate and key files are generated in the data directory.

* `validate_password` is installed and enabled.

* A superuser account `'root'@'localhost'` is created. A password for the superuser is set and stored in the error log file. To reveal it, use the following command for RHEL, Oracle Linux, CentOS, and Fedora systems:

  ```sql
  $> sudo grep 'temporary password' /var/log/mysqld.log
  ```

  Use the following command for SLES systems:

  ```sql
  $> sudo grep 'temporary password' /var/log/mysql/mysqld.log
  ```

  The next step is to log in with the generated, temporary password and set a custom password for the superuser account:

```sql
$> mysql -uroot -p
```

```sql
mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'MyNewPass4!';
```

Note

`validate_password` is installed by default. The default password policy implemented by `validate_password` requires that passwords contain at least one uppercase letter, one lowercase letter, one digit, and one special character, and that the total password length is at least 8 characters.

If something goes wrong during installation, you might find debug information in the error log file `/var/log/mysqld.log`.

For some Linux distributions, it might be necessary to increase the limit on number of file descriptors available to **mysqld**. See Section B.3.2.16, “File Not Found and Similar Errors”

**Compatibility with RPM Packages from Other Vendors.** If you have installed packages for MySQL from your Linux distribution's local software repository, it is much preferable to install the new, directly-downloaded packages from Oracle using the package management system of your platform (**yum**, **dnf**, or **zypper**), as described above. The command replaces old packages with new ones to ensure compatibility of old applications with the new installation; for example, the old `mysql-libs` package is replaced with the `mysql-community-libs-compat` package, which provides a replacement-compatible client library for applications that were using your older MySQL installation. If there was an older version of `mysql-community-libs-compat` on the system, it also gets replaced.

If you have installed third-party packages for MySQL that are NOT from your Linux distribution's local software repository (for example, packages directly downloaded from a vendor other than Oracle), you should uninstall all those packages before installing the new, directly-downloaded packages from Oracle. This is because conflicts may arise between those vendor's RPM packages and Oracle's: for example, a vendor's convention about which files belong with the server and which belong with the client library may differ from that used for Oracle packages. Attempts to install an Oracle RPM may then result in messages saying that files in the RPM to be installed conflict with files from an installed package.

**Installing Client Libraries from Multiple MySQL Versions.** It is possible to install multiple client library versions, such as for the case that you want to maintain compatibility with older applications linked against previous libraries. To install an older client library, use the `--oldpackage` option with **rpm**. For example, to install `mysql-community-libs-5.5` on an EL6 system that has `libmysqlclient.20` from MySQL 5.7, use a command like this:

```sql
$> rpm --oldpackage -ivh mysql-community-libs-5.5.50-2.el6.x86_64.rpm
```

**Debug Package.** A special variant of MySQL Server compiled with the debug package has been included in the server RPM packages. It performs debugging and memory allocation checks and produces a trace file when the server is running. To use that debug version, start MySQL with `/usr/sbin/mysqld-debug`, instead of starting it as a service or with `/usr/sbin/mysqld`. See Section 5.8.3, “The DBUG Package” for the debug options you can use.

Note

The default plugin directory for debug builds changed from `/usr/lib64/mysql/plugin` to `/usr/lib64/mysql/plugin/debug` in 5.7.21. Previously, it was necessary to change `plugin_dir` to `/usr/lib64/mysql/plugin/debug` for debug builds.

**Rebuilding RPMs from source SRPMs.** Source code SRPM packages for MySQL are available for download. They can be used as-is to rebuild the MySQL RPMs with the standard **rpmbuild** tool chain.

**`root` passwords for pre-GA releases.**

For MySQL 5.7.4 and 5.7.5, the initial random `root` password is written to the `.mysql_secret` file in the directory named by the `HOME` environment variable. When trying to access the file, bear in mind that depending on operating system, using a command such as **sudo** may cause the value of `HOME` to refer to the home directory of the `root` system user . `.mysql_secret` is created with mode 600 to be accessible only to the system user for whom it is created. Before MySQL 5.7.4, the accounts (including `root`) created in the MySQL grant tables for an RPM installation initially have no passwords; after starting the server, you should assign passwords to them using the instructions in Section 2.9, “Postinstallation Setup and Testing”."
