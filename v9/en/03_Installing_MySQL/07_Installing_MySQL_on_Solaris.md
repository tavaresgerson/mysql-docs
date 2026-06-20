## 2.7 Installing MySQL on Solaris

Note

MySQL 9.5 supports Solaris 11.4 and higher

MySQL on Solaris is available in a number of different formats.

* For information on installing using the native Solaris PKG format, see Section 2.7.1, “Installing MySQL on Solaris Using a Solaris PKG”.

* To use a standard `tar` binary installation, use the notes provided in Section 2.2, “Installing MySQL on Unix/Linux Using Generic Binaries”. Check the notes and hints at the end of this section for Solaris specific notes that you may need before or after installation.

To obtain a binary MySQL distribution for Solaris in tarball or PKG format, <https://dev.mysql.com/downloads/mysql/9.5.html>.

Additional notes to be aware of when installing and using MySQL on Solaris:

* If you want to use MySQL with the `mysql` user and group, use the **groupadd** and **useradd** commands:

  ```
  groupadd mysql
  useradd -g mysql -s /bin/false mysql
  ```

* If you install MySQL using a binary tarball distribution on Solaris, because the Solaris **tar** cannot handle long file names, use GNU **tar** (**gtar**) to unpack the distribution. If you do not have GNU **tar** on your system, install it with the following command:

  ```
  pkg install archiver/gnu-tar
  ```

* You should mount any file systems on which you intend to store `InnoDB` files with the `forcedirectio` option. (By default mounting is done without this option.) Failing to do so causes a significant drop in performance when using the `InnoDB` storage engine on this platform.

* If you would like MySQL to start automatically, you can copy `support-files/mysql.server` to `/etc/init.d` and create a symbolic link to it named `/etc/rc3.d/S99mysql.server`.

* If too many processes try to connect very rapidly to **mysqld**, you should see this error in the MySQL log:

  ```
  Error in accept: Protocol error
  ```

  You might try starting the server with the `--back_log=50` option as a workaround for this.

* To configure the generation of core files on Solaris you should use the **coreadm** command. Because of the security implications of generating a core on a `setuid()` application, by default, Solaris does not support core files on `setuid()` programs. However, you can modify this behavior using **coreadm**. If you enable `setuid()` core files for the current user, they are generated using mode 600 and are owned by the superuser.


### 2.7.1 Installing MySQL on Solaris Using a Solaris PKG

You can install MySQL on Solaris using a binary package of the native Solaris PKG format instead of the binary tarball distribution.

To use this package, download the corresponding `mysql-VERSION-solaris11-PLATFORM.pkg.gz` file, then uncompress it. For example:

```
$> gunzip mysql-9.5.0-solaris11-x86_64.pkg.gz
```

To install a new package, use **pkgadd** and follow the onscreen prompts. You must have root privileges to perform this operation:

```
$> pkgadd -d mysql-9.5.0-solaris11-x86_64.pkg

The following packages are available:
  1  mysql     MySQL Community Server (GPL)
               (i86pc) 9.5.0

Select package(s) you wish to process (or 'all' to process
all packages). (default: all) [?,??,q]:
```

The PKG installer installs all of the files and tools needed, and then initializes your database if one does not exist. To complete the installation, you should set the root password for MySQL as provided in the instructions at the end of the installation. Alternatively, you can run the **mysql_secure_installation** script that comes with the installation.

By default, the PKG package installs MySQL under the root path `/opt/mysql`. You can change only the installation root path when using **pkgadd**, which can be used to install MySQL in a different Solaris zone. If you need to install in a specific directory, use a binary **tar** file distribution.

The `pkg` installer copies a suitable startup script for MySQL into `/etc/init.d/mysql`. To enable MySQL to startup and shutdown automatically, you should create a link between this file and the init script directories. For example, to ensure safe startup and shutdown of MySQL you could use the following commands to add the right links:

```
$> ln /etc/init.d/mysql /etc/rc3.d/S91mysql
$> ln /etc/init.d/mysql /etc/rc0.d/K02mysql
```

To remove MySQL, the installed package name is `mysql`. You can use this in combination with the **pkgrm** command to remove the installation.

To upgrade when using the Solaris package file format, you must remove the existing installation before installing the updated package. Removal of the package does not delete the existing database information, only the server, binaries and support files. The typical upgrade sequence is therefore:

```
$> mysqladmin shutdown
$> pkgrm mysql
$> pkgadd -d mysql-9.5.0-solaris11-x86_64.pkg
$> mysqld_safe &
```

You should check the notes in Chapter 3, *Upgrading MySQL* before performing any upgrade.
