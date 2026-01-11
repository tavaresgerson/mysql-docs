### 2.5.4 Installing MySQL on Linux Using RPM Packages from Oracle

The recommended way to install MySQL on RPM-based Linux distributions is by using the RPM packages provided by Oracle. There are two sources for obtaining them, for the Community Edition of MySQL:

* From the MySQL software repositories:

  + The MySQL Yum repository (see Section 2.5.1, “Installing MySQL on Linux Using the MySQL Yum Repository” for details).

  + The MySQL SLES repository (see Section 2.5.3, “Using the MySQL SLES Repository” for details).

* From the  [Download MySQL Community Server](https://dev.mysql.com/downloads/mysql/) page in the [MySQL Developer Zone](https://dev.mysql.com/).

Note

RPM distributions of MySQL are also provided by other vendors. Be aware that they may differ from those built by Oracle in features, capabilities, and conventions (including communication setup), and that the installation instructions in this manual do not necessarily apply to them. The vendor's instructions should be consulted instead.

#### MySQL RPM Packages

**Table 2.10 RPM Packages for MySQL Community Edition**

<table frame="all"><col style="width: 35%"/><col style="width: 25%"/><thead><tr> <th>Package Name</th> <th>Summary</th> </tr></thead><tbody><tr> <td><code class="literal">mysql-community-client</code></td> <td>MySQL client applications and tools</td> </tr><tr> <td><code class="literal">mysql-community-client-plugins</code></td> <td>Shared plugins for MySQL client applications</td> </tr><tr> <td><code class="literal">mysql-community-common</code></td> <td>Common files for server and client libraries</td> </tr><tr> <td><code class="literal">mysql-community-devel</code></td> <td>Development header files and libraries for MySQL database client applications</td> </tr><tr> <td><code class="literal">mysql-community-embedded-compat</code></td> <td>MySQL server as an embedded library with compatibility for applications using version 18 of the library</td> </tr><tr> <td><code class="literal">mysql-community-icu-data-files</code></td> <td>MySQL packaging of ICU data files needed by MySQL regular expressions</td> </tr><tr> <td><code class="literal">mysql-community-libs</code></td> <td>Shared libraries for MySQL database client applications</td> </tr><tr> <td><code class="literal">mysql-community-libs-compat</code></td> <td>Shared compatibility libraries for previous MySQL installations; only present if previous MySQL versions are supported by the platform</td> </tr><tr> <td><code class="literal">mysql-community-server</code></td> <td>Database server and related tools</td> </tr><tr> <td><code class="literal">mysql-community-server-debug</code></td> <td>Debug server and plugin binaries</td> </tr><tr> <td><code class="literal">mysql-community-test</code></td> <td>Test suite for the MySQL server</td> </tr><tr> <td><code class="literal">mysql-community</code></td> <td>The source code RPM looks similar to mysql-community-9.5.0-1.el7.src.rpm, depending on selected OS</td> </tr><tr> <td>Additional *debuginfo* RPMs</td> <td>There are several <code class="literal">debuginfo</code> packages: mysql-community-client-debuginfo, mysql-community-libs-debuginfo mysql-community-server-debug-debuginfo mysql-community-server-debuginfo, and mysql-community-test-debuginfo.</td> </tr></tbody></table>

**Table 2.11 RPM Packages for the MySQL Enterprise Edition**

<table frame="all"><col style="width: 35%"/><col style="width: 25%"/><thead><tr> <th>Package Name</th> <th>Summary</th> </tr></thead><tbody><tr> <td><code class="literal">mysql-commercial-backup</code></td> <td>MySQL Enterprise Backup</td> </tr><tr> <td><code class="literal">mysql-commercial-client</code></td> <td>MySQL client applications and tools</td> </tr><tr> <td><code class="literal">mysql-commercial-client-plugins</code></td> <td>Shared plugins for MySQL client applications</td> </tr><tr> <td><code class="literal">mysql-commercial-common</code></td> <td>Common files for server and client libraries</td> </tr><tr> <td><code class="literal">mysql-commercial-devel</code></td> <td>Development header files and libraries for MySQL database client applications</td> </tr><tr> <td><code class="literal">mysql-commercial-embedded-compat</code></td> <td>MySQL server as an embedded library with compatibility for applications using version 18 of the library</td> </tr><tr> <td><code class="literal">mysql-commercial-icu-data-files</code></td> <td>MySQL packaging of ICU data files needed by MySQL regular expressions</td> </tr><tr> <td><code class="literal">mysql-commercial-libs</code></td> <td>Shared libraries for MySQL database client applications</td> </tr><tr> <td><code class="literal">mysql-commercial-libs-compat</code></td> <td>Shared compatibility libraries for previous MySQL installations; only present if previous MySQL versions are supported by the platform. The version of the libraries matches the version of the libraries installed by default by the distribution you are using.</td> </tr><tr> <td><code class="literal">mysql-commercial-server</code></td> <td>Database server and related tools</td> </tr><tr> <td><code class="literal">mysql-commercial-test</code></td> <td>Test suite for the MySQL server</td> </tr><tr> <td>Additional *debuginfo* RPMs</td> <td>There are several <code class="literal">debuginfo</code> packages: mysql-commercial-client-debuginfo, mysql-commercial-libs-debuginfo mysql-commercial-server-debug-debuginfo mysql-commercial-server-debuginfo, and mysql-commercial-test-debuginfo.</td> </tr></tbody></table>

The full names for the RPMs have the following syntax:

```
packagename-version-distribution-arch.rpm
```

The *`distribution`* and *`arch`* values indicate the Linux distribution and the processor type for which the package was built. See the table below for lists of the distribution identifiers:

**Table 2.12 MySQL Linux RPM Package Distribution Identifiers**

<table><thead><tr> <th>Distribution Value</th> <th>Intended Use</th> </tr></thead><tbody><tr> <td>el<em><code>{version}</code></em> where <em><code>{version}</code></em> is the major Enterprise Linux version, such as <code class="literal">el8</code></td> <td>EL6 (8.0), EL7, EL8, EL9, and EL10-based platforms (for example, the corresponding versions of Oracle Linux, Red Hat Enterprise Linux, and CentOS)</td> </tr><tr> <td>fc<em><code>{version}</code></em> where <em><code>{version}</code></em> is the major Fedora version, such as <code class="literal">fc37</code></td> <td>Fedora 41 and 42</td> </tr><tr> <td><code class="literal">sl5</code></td> <td>SUSE Linux Enterprise Server 15</td> </tr></tbody></table>

To see all files in an RPM package (for example, `mysql-community-server`), use the following command:

```
$> rpm -qpl mysql-community-server-version-distribution-arch.rpm
```

*The discussion in the rest of this section applies only to an installation process using the RPM packages directly downloaded from Oracle, instead of through a MySQL repository.*

Dependency relationships exist among some of the packages. If you plan to install many of the packages, you may wish to download the RPM bundle **tar** file instead, which contains all the RPM packages listed above, so that you need not download them separately.

In most cases, you need to install the `mysql-community-server`, `mysql-community-client`, `mysql-community-client-plugins`, `mysql-community-libs`, `mysql-community-icu-data-files`, `mysql-community-common`, and `mysql-community-libs-compat` packages to get a functional, standard MySQL installation. To perform such a standard, basic installation, go to the folder that contains all those packages (and, preferably, no other RPM packages with similar names), and issue the following command:

```
$> sudo yum install mysql-community-{server,client,client-plugins,icu-data-files,common,libs}-*
```

Replace **yum** with **zypper** for SLES, and with **dnf** for Fedora.

While it is much preferable to use a high-level package management tool like **yum** to install the packages, users who prefer direct **rpm** commands can replace the **yum install** command with the **rpm -Uvh** command; however, using **rpm -Uvh** instead makes the installation process more prone to failure, due to potential dependency issues the installation process might run into.

To install only the client programs, you can skip `mysql-community-server` in your list of packages to install; issue the following command:

```
$> sudo yum install mysql-community-{client,client-plugins,common,libs}-*
```

Replace **yum** with **zypper** for SLES, and with **dnf** for Fedora.

A standard installation of MySQL using the RPM packages result in files and resources created under the system directories, shown in the following table.

**Table 2.13 MySQL Installation Layout for Linux RPM Packages from the MySQL Developer Zone**

<table><col style="width: 55%"/><col style="width: 45%"/><thead><tr> <th>Files or Resources</th> <th>Location</th> </tr></thead><tbody><tr> <td>Client programs and scripts</td> <td><code>/usr/bin</code></td> </tr><tr> <td><span><strong>mysqld</strong></span> server</td> <td><code>/usr/sbin</code></td> </tr><tr> <td>Configuration file</td> <td><code>/etc/my.cnf</code></td> </tr><tr> <td>Data directory</td> <td><code>/var/lib/mysql</code></td> </tr><tr> <td>Error log file</td> <td><p> For RHEL, Oracle Linux, CentOS or Fedora platforms: <code>/var/log/mysqld.log</code> </p><p> For SLES: <code>/var/log/mysql/mysqld.log</code> </p></td> </tr><tr> <td>Value of <code class="literal">secure_file_priv</code></td> <td><code>/var/lib/mysql-files</code></td> </tr><tr> <td>System V init script</td> <td><p> For RHEL, Oracle Linux, CentOS or Fedora platforms: <code>/etc/init.d/mysqld</code> </p><p> For SLES: <code>/etc/init.d/mysql</code> </p></td> </tr><tr> <td>Systemd service</td> <td><p> For RHEL, Oracle Linux, CentOS or Fedora platforms: <code>mysqld</code> </p><p> For SLES: <code>mysql</code> </p></td> </tr><tr> <td>Pid file</td> <td><code> /var/run/mysql/mysqld.pid</code></td> </tr><tr> <td>Socket</td> <td><code>/var/lib/mysql/mysql.sock</code></td> </tr><tr> <td>Keyring directory</td> <td><code>/var/lib/mysql-keyring</code></td> </tr><tr> <td>Unix manual pages</td> <td><code>/usr/share/man</code></td> </tr><tr> <td>Include (header) files</td> <td><code>/usr/include/mysql</code></td> </tr><tr> <td>Libraries</td> <td><code>/usr/lib/mysql</code></td> </tr><tr> <td>Miscellaneous support files (for example, error messages, and character set files)</td> <td><code>/usr/share/mysql</code></td> </tr></tbody></table>

The installation also creates a user named `mysql` and a group named `mysql` on the system.

Notes

* The `mysql` user is created using the `-r` and `-s /bin/false` options of the **useradd** command, so that it does not have login permissions to your server host (see Creating the mysql User and Group for details). To switch to the `mysql` user on your OS, use the `--shell=/bin/bash` option for the **su** command:

  ```
  $> su - mysql --shell=/bin/bash
  ```

* Installation of previous versions of MySQL using older packages might have created a configuration file named `/usr/my.cnf`. It is highly recommended that you examine the contents of the file and migrate the desired settings inside to the file `/etc/my.cnf` file, then remove `/usr/my.cnf`.

MySQL is NOT automatically started at the end of the installation process. For Red Hat Enterprise Linux, Oracle Linux, CentOS, and Fedora systems, use the following command to start MySQL:

```
$> systemctl start mysqld
```

For SLES systems, the command is the same, but the service name is different:

```
$> systemctl start mysql
```

If the operating system is systemd enabled, standard **systemctl** (or alternatively, **service** with the arguments reversed) commands such as **stop**, **start**, **status**, and **restart** should be used to manage the MySQL server service. The `mysqld` service is enabled by default, and it starts at system reboot. Notice that certain things might work differently on systemd platforms: for example, changing the location of the data directory might cause issues. See Section 2.5.9, “Managing MySQL Server with systemd” for additional information.

During an upgrade installation using RPM and DEB packages, if the MySQL server is running when the upgrade occurs then the MySQL server is stopped, the upgrade occurs, and the MySQL server is restarted. One exception: if the edition also changes during an upgrade (such as community to commercial, or vice-versa), then MySQL server is not restarted.

At the initial start up of the server, the following happens, given that the data directory of the server is empty:

* The server is initialized.
* An SSL certificate and key files are generated in the data directory.

* `validate_password` is installed and enabled.

* A superuser account `'root'@'localhost'` is created. A password for the superuser is set and stored in the error log file. To reveal it, use the following command for RHEL, Oracle Linux, CentOS, and Fedora systems:

  ```
  $> sudo grep 'temporary password' /var/log/mysqld.log
  ```

  Use the following command for SLES systems:

  ```
  $> sudo grep 'temporary password' /var/log/mysql/mysqld.log
  ```

  The next step is to log in with the generated, temporary password and set a custom password for the superuser account:

```
$> mysql -uroot -p
```

```
mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'MyNewPass4!';
```

Note

`validate_password` is installed by default. The default password policy implemented by `validate_password` requires that passwords contain at least one uppercase letter, one lowercase letter, one digit, and one special character, and that the total password length is at least 8 characters.

If something goes wrong during installation, you might find debug information in the error log file `/var/log/mysqld.log`.

For some Linux distributions, it might be necessary to increase the limit on number of file descriptors available to **mysqld**. See Section B.3.2.16, “File Not Found and Similar Errors”

**Installing Client Libraries from Multiple MySQL Versions.** It is possible to install multiple client library versions, such as for the case that you want to maintain compatibility with older applications linked against previous libraries. To install an older client library, use the `--oldpackage` option with **rpm**. For example, to install `mysql-community-libs-5.5` on an EL6 system that has `libmysqlclient.21` from MySQL 8.0, use a command like this:

```
$> rpm --oldpackage -ivh mysql-community-libs-5.5.50-2.el6.x86_64.rpm
```

**Debug Package.** A special variant of MySQL Server compiled with the debug package has been included in the server RPM packages. It performs debugging and memory allocation checks and produces a trace file when the server is running. To use that debug version, start MySQL with `/usr/sbin/mysqld-debug`, instead of starting it as a service or with `/usr/sbin/mysqld`. See Section 7.9.4, “The DBUG Package” for the debug options you can use.

Note

The default plugin directory is `/usr/lib64/mysql/plugin/debug` and is configurable with `plugin_dir`.

**Rebuilding RPMs from source SRPMs.** Source code SRPM packages for MySQL are available for download. They can be used as-is to rebuild the MySQL RPMs with the standard **rpmbuild** tool chain.
