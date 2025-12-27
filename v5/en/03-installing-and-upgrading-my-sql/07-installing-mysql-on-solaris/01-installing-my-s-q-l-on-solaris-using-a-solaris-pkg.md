### 2.7.1 Installing MySQL on Solaris Using a Solaris PKG

You can install MySQL on Solaris using a binary package of the native Solaris PKG format instead of the binary tarball distribution.

Important

The installation package has a dependency on the Oracle Developer Studio 12.5 Runtime Libraries, which must be installed before you run the MySQL installation package. See the download options for Oracle Developer Studio here. The installation package enables you to install the runtime libraries only instead of the full Oracle Developer Studio; see instructions in [Installing Only the Runtime Libraries on Oracle Solaris 11](https://docs.oracle.com/cd/E60778_01/html/E60743/gozsu.html).

To use this package, download the corresponding `mysql-VERSION-solaris11-PLATFORM.pkg.gz` file, then uncompress it. For example:

```sql
$> gunzip mysql-5.7.44-solaris11-x86_64.pkg.gz
```

To install a new package, use **pkgadd** and follow the onscreen prompts. You must have root privileges to perform this operation:

```sql
$> pkgadd -d mysql-5.7.44-solaris11-x86_64.pkg

The following packages are available:
  1  mysql     MySQL Community Server (GPL)
               (i86pc) 5.7.44

Select package(s) you wish to process (or 'all' to process
all packages). (default: all) [?,??,q]:
```

The PKG installer installs all of the files and tools needed, and then initializes your database if one does not exist. To complete the installation, you should set the root password for MySQL as provided in the instructions at the end of the installation. Alternatively, you can run the **mysql\_secure\_installation** script that comes with the installation.

By default, the PKG package installs MySQL under the root path `/opt/mysql`. You can change only the installation root path when using **pkgadd**, which can be used to install MySQL in a different Solaris zone. If you need to install in a specific directory, use a binary **tar** file distribution.

The `pkg` installer copies a suitable startup script for MySQL into `/etc/init.d/mysql`. To enable MySQL to startup and shutdown automatically, you should create a link between this file and the init script directories. For example, to ensure safe startup and shutdown of MySQL you could use the following commands to add the right links:

```sql
$> ln /etc/init.d/mysql /etc/rc3.d/S91mysql
$> ln /etc/init.d/mysql /etc/rc0.d/K02mysql
```

To remove MySQL, the installed package name is `mysql`. You can use this in combination with the **pkgrm** command to remove the installation.

To upgrade when using the Solaris package file format, you must remove the existing installation before installing the updated package. Removal of the package does not delete the existing database information, only the server, binaries and support files. The typical upgrade sequence is therefore:

```sql
$> mysqladmin shutdown
$> pkgrm mysql
$> pkgadd -d mysql-5.7.44-solaris11-x86_64.pkg
$> mysqld_safe &
$> mysql_upgrade
```

You should check the notes in Section 2.10, “Upgrading MySQL” before performing any upgrade.
