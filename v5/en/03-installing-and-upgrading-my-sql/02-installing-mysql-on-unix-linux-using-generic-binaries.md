## 2.2 Installing MySQL on Unix/Linux Using Generic Binaries

Oracle provides a set of binary distributions of MySQL. These include generic binary distributions in the form of compressed **tar** files (files with a `.tar.gz` extension) for a number of platforms, and binaries in platform-specific package formats for selected platforms.

This section covers the installation of MySQL from a compressed **tar** file binary distribution on Unix/Linux platforms. For Linux-generic binary distribution installation instructions with a focus on MySQL security features, refer to the Secure Deployment Guide. For other platform-specific binary package formats, see the other platform-specific sections in this manual. For example, for Windows distributions, see Section 2.3, “Installing MySQL on Microsoft Windows”. See Section 2.1.3, “How to Get MySQL” on how to obtain MySQL in different distribution formats.

MySQL compressed **tar** file binary distributions have names of the form `mysql-VERSION-OS.tar.gz`, where `VERSION` is a number (for example, `5.7.44`), and *`OS`* indicates the type of operating system for which the distribution is intended (for example, `pc-linux-i686` or `winx64`).

Warnings

* If you have previously installed MySQL using your operating system native package management system, such as Yum or APT, you may experience problems installing using a native binary. Make sure your previous MySQL installation has been removed entirely (using your package management system), and that any additional files, such as old versions of your data files, have also been removed. You should also check for configuration files such as `/etc/my.cnf` or the `/etc/mysql` directory and delete them.

  For information about replacing third-party packages with official MySQL packages, see the related APT guide or Yum guide.

* MySQL has a dependency on the `libaio` library. Data directory initialization and subsequent server startup steps fail if this library is not installed locally. If necessary, install it using the appropriate package manager. For example, on Yum-based systems:

  ```sql
  $> yum search libaio  # search for info
  $> yum install libaio # install library
  ```

  Or, on APT-based systems:

  ```sql
  $> apt-cache search libaio # search for info
  $> apt-get install libaio1 # install library
  ```

* *For MySQL 5.7.19 and later:* Support for Non-Uniform Memory Access (NUMA) has been added to the generic Linux build, which has a dependency now on the `libnuma` library; if the library has not been installed on your system, use you system's package manager to search for and install it (see the preceding item for some sample commands).

* **SLES 11**: As of MySQL 5.7.19, the Linux Generic tarball package format is EL6 instead of EL5. As a side effect, the MySQL client **bin/mysql** needs `libtinfo.so.5`.

  A workaround is to create a symlink, such as **ln -s libncurses.so.5.6 /lib64/libtinfo.so.5** on 64-bit systems or **ln -s libncurses.so.5.6 /lib/libtinfo.so.5** on 32-bit systems.

* If no RPM or `.deb` file specific to your distribution is provided by Oracle (or by your Linux vendor), you can try the generic binaries. In some cases, due to library incompatibilities or other issues, these may not work with your Linux installation. In such cases, you can try to compile and install MySQL from source. See Section 2.8, “Installing MySQL from Source”, for more information and instructions.

To install a compressed **tar** file binary distribution, unpack it at the installation location you choose (typically `/usr/local/mysql`). This creates the directories shown in the following table.

**Table 2.3 MySQL Installation Layout for Generic Unix/Linux Binary Package**

<table><col style="width: 45%"/><col style="width: 55%"/><thead><tr> <th>Directory</th> <th>Contents of Directory</th> </tr></thead><tbody><tr> <td><code class="filename">bin</code></td> <td><a class="link" href="mysqld.html" title="4.3.1 mysqld — The MySQL Server"><span><strong>mysqld</strong></span></a> server, client and utility programs</td> </tr><tr> <td><code class="filename">docs</code></td> <td>MySQL manual in Info format</td> </tr><tr> <td><code class="filename">man</code></td> <td>Unix manual pages</td> </tr><tr> <td><code class="filename">include</code></td> <td>Include (header) files</td> </tr><tr> <td><code class="filename">lib</code></td> <td>Libraries</td> </tr><tr> <td><code class="filename">share</code></td> <td>Error messages, dictionary, and SQL for database installation</td> </tr><tr> <td><code>support-files</code></td> <td>Miscellaneous support files</td> </tr></tbody></table>

Debug versions of the **mysqld** binary are available as **mysqld-debug**. To compile your own debug version of MySQL from a source distribution, use the appropriate configuration options to enable debugging support. See Section 2.8, “Installing MySQL from Source”.

To install and use a MySQL binary distribution, the command sequence looks like this:

```sql
$> groupadd mysql
$> useradd -r -g mysql -s /bin/false mysql
$> cd /usr/local
$> tar zxvf /path/to/mysql-VERSION-OS.tar.gz
$> ln -s full-path-to-mysql-VERSION-OS mysql
$> cd mysql
$> mkdir mysql-files
$> chown mysql:mysql mysql-files
$> chmod 750 mysql-files
$> bin/mysqld --initialize --user=mysql
$> bin/mysql_ssl_rsa_setup
$> bin/mysqld_safe --user=mysql &
# Next command is optional
$> cp support-files/mysql.server /etc/init.d/mysql.server
```

Note

This procedure assumes that you have `root` (administrator) access to your system. Alternatively, you can prefix each command using the **sudo** (Linux) or **pfexec** (Solaris) command.

The `mysql-files` directory provides a convenient location to use as the value for the `secure_file_priv` system variable, which limits import and export operations to a specific directory. See Section 5.1.7, “Server System Variables”.

A more detailed version of the preceding description for installing a binary distribution follows.

### Create a mysql User and Group

If your system does not already have a user and group to use for running **mysqld**, you may need to create them. The following commands add the `mysql` group and the `mysql` user. You might want to call the user and group something else instead of `mysql`. If so, substitute the appropriate name in the following instructions. The syntax for **useradd** and **groupadd** may differ slightly on different versions of Unix/Linux, or they may have different names such as **adduser** and **addgroup**.

```sql
$> groupadd mysql
$> useradd -r -g mysql -s /bin/false mysql
```

Note

Because the user is required only for ownership purposes, not login purposes, the **useradd** command uses the `-r` and `-s /bin/false` options to create a user that does not have login permissions to your server host. Omit these options if your **useradd** does not support them.

### Obtain and Unpack the Distribution

Pick the directory under which you want to unpack the distribution and change location into it. The example here unpacks the distribution under `/usr/local`. The instructions, therefore, assume that you have permission to create files and directories in `/usr/local`. If that directory is protected, you must perform the installation as `root`.

```sql
$> cd /usr/local
```

Obtain a distribution file using the instructions in Section 2.1.3, “How to Get MySQL”. For a given release, binary distributions for all platforms are built from the same MySQL source distribution.

Unpack the distribution, which creates the installation directory. **tar** can uncompress and unpack the distribution if it has `z` option support:

```sql
$> tar zxvf /path/to/mysql-VERSION-OS.tar.gz
```

The **tar** command creates a directory named `mysql-VERSION-OS`.

To install MySQL from a compressed **tar** file binary distribution, your system must have GNU `gunzip` to uncompress the distribution and a reasonable **tar** to unpack it. If your **tar** program supports the `z` option, it can both uncompress and unpack the file.

GNU **tar** is known to work. The standard **tar** provided with some operating systems is not able to unpack the long file names in the MySQL distribution. You should download and install GNU **tar**, or if available, use a preinstalled version of GNU tar. Usually this is available as **gnutar**, **gtar**, or as **tar** within a GNU or Free Software directory, such as `/usr/sfw/bin` or `/usr/local/bin`. GNU **tar** is available from <http://www.gnu.org/software/tar/>.

If your **tar** does not have `z` option support, use **gunzip** to unpack the distribution and **tar** to unpack it. Replace the preceding **tar** command with the following alternative command to uncompress and extract the distribution:

```sql
$> gunzip < /path/to/mysql-VERSION-OS.tar.gz | tar xvf -
```

Next, create a symbolic link to the installation directory created by **tar**:

```sql
$> ln -s full-path-to-mysql-VERSION-OS mysql
```

The `ln` command makes a symbolic link to the installation directory. This enables you to refer more easily to it as `/usr/local/mysql`. To avoid having to type the path name of client programs always when you are working with MySQL, you can add the `/usr/local/mysql/bin` directory to your `PATH` variable:

```sql
$> export PATH=$PATH:/usr/local/mysql/bin
```

### Perform Postinstallation Setup

The remainder of the installation process involves setting distribution ownership and access permissions, initializing the data directory, starting the MySQL server, and setting up the configuration file. For instructions, see Section 2.9, “Postinstallation Setup and Testing”.
