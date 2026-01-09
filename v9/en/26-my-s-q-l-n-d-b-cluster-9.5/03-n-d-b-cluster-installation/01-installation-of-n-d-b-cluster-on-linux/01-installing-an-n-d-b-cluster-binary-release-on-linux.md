#### 25.3.1.1 Installing an NDB Cluster Binary Release on Linux

This section covers the steps necessary to install the correct executables for each type of Cluster node from precompiled binaries supplied by Oracle.

For setting up a cluster using precompiled binaries, the first step in the installation process for each cluster host is to download the binary archive from the [NDB Cluster downloads page](https://dev.mysql.com/downloads/cluster/). (For the most recent 64-bit NDB 9.5 release, this is `mysql-cluster-gpl-9.4.0-linux-glibc2.12-x86_64.tar.gz`.) We assume that you have placed this file in each machine's `/var/tmp` directory.

If you require a custom binary, see Section 2.8.5, “Installing MySQL Using a Development Source Tree”.

Note

After completing the installation, do not yet start any of the binaries. We show you how to do so following the configuration of the nodes (see Section 25.3.3, “Initial Configuration of NDB Cluster”).

**SQL nodes.** On each of the machines designated to host SQL nodes, perform the following steps as the system `root` user:

1. Check your `/etc/passwd` and `/etc/group` files (or use whatever tools are provided by your operating system for managing users and groups) to see whether there is already a `mysql` group and `mysql` user on the system. Some OS distributions create these as part of the operating system installation process. If they are not already present, create a new `mysql` user group, and then add a `mysql` user to this group:

   ```
   $> groupadd mysql
   $> useradd -g mysql -s /bin/false mysql
   ```

   The syntax for **useradd** and **groupadd** may differ slightly on different versions of Unix, or they may have different names such as **adduser** and **addgroup**.

2. Change location to the directory containing the downloaded file, unpack the archive, and create a symbolic link named `mysql` to the `mysql` directory.

   Note

   The actual file and directory names vary according to the NDB Cluster version number.

   ```
   $> cd /var/tmp
   $> tar -C /usr/local -xzvf mysql-cluster-gpl-9.4.0-linux-glibc2.12-x86_64.tar.gz
   $> ln -s /usr/local/mysql-cluster-gpl-9.4.0-linux-glibc2.12-x86_64 /usr/local/mysql
   ```

3. Change location to the `mysql` directory and set up the system databases using **mysqld** `--initialize` as shown here:

   ```
   $> cd mysql
   $> mysqld --initialize
   ```

   This generates a random password for the MySQL `root` account. If you do *not* want the random password to be generated, you can substitute the `--initialize-insecure` option for `--initialize`. In either case, you should review Section 2.9.1, “Initializing the Data Directory”, for additional information before performing this step. See also Section 6.4.2, “mysql_secure_installation — Improve MySQL Installation Security”.

4. Set the necessary permissions for the MySQL server and data directories:

   ```
   $> chown -R root .
   $> chown -R mysql data
   $> chgrp -R mysql .
   ```

5. Copy the MySQL startup script to the appropriate directory, make it executable, and set it to start when the operating system is booted up:

   ```
   $> cp support-files/mysql.server /etc/rc.d/init.d/
   $> chmod +x /etc/rc.d/init.d/mysql.server
   $> chkconfig --add mysql.server
   ```

   (The startup scripts directory may vary depending on your operating system and version—for example, in some Linux distributions, it is `/etc/init.d`.)

   Here we use Red Hat's **chkconfig** for creating links to the startup scripts; use whatever means is appropriate for this purpose on your platform, such as **update-rc.d** on Debian.

Remember that the preceding steps must be repeated on each machine where an SQL node is to reside.

**Data nodes.** Installation of the data nodes does not require the **mysqld** binary. Only the NDB Cluster data node executable **ndbd** (single-threaded) or **ndbmtd**") (multithreaded) is required. These binaries can also be found in the `.tar.gz` archive. Again, we assume that you have placed this archive in `/var/tmp`.

As system `root` (that is, after using **sudo**, **su root**, or your system's equivalent for temporarily assuming the system administrator account's privileges), perform the following steps to install the data node binaries on the data node hosts:

1. Change location to the `/var/tmp` directory, and extract the **ndbd** and **ndbmtd**") binaries from the archive into a suitable directory such as `/usr/local/bin`:

   ```
   $> cd /var/tmp
   $> tar -zxvf mysql-cluster-gpl-9.4.0-linux-glibc2.12-x86_64.tar.gz
   $> cd mysql-cluster-gpl-9.4.0-linux-glibc2.12-x86_64
   $> cp bin/ndbd /usr/local/bin/ndbd
   $> cp bin/ndbmtd /usr/local/bin/ndbmtd
   ```

   (You can safely delete the directory created by unpacking the downloaded archive, and the files it contains, from `/var/tmp` once **ndb_mgm** and **ndb_mgmd** have been copied to the executables directory.)

2. Change location to the directory into which you copied the files, and then make both of them executable:

   ```
   $> cd /usr/local/bin
   $> chmod +x ndb*
   ```

The preceding steps should be repeated on each data node host.

Although only one of the data node executables is required to run an NDB Cluster data node, we have shown you how to install both **ndbd** and **ndbmtd**") in the preceding instructions. We recommend that you do this when installing or upgrading NDB Cluster, even if you plan to use only one of them, since this saves time and trouble in the event that you later decide to change from one to the other.

Note

The data directory on each machine hosting a data node is `/usr/local/mysql/data`. This piece of information is essential when configuring the management node. (See Section 25.3.3, “Initial Configuration of NDB Cluster”.)

**Management nodes.** Installation of the management node does not require the **mysqld** binary. Only the NDB Cluster management server (**ndb_mgmd**) is required; you most likely want to install the management client (**ndb_mgm**) as well. Both of these binaries also be found in the `.tar.gz` archive. Again, we assume that you have placed this archive in `/var/tmp`.

As system `root`, perform the following steps to install **ndb_mgmd** and **ndb_mgm** on the management node host:

1. Change location to the `/var/tmp` directory, and extract the **ndb_mgm** and **ndb_mgmd** from the archive into a suitable directory such as `/usr/local/bin`:

   ```
   $> cd /var/tmp
   $> tar -zxvf mysql-cluster-gpl-9.4.0-linux-glibc2.12-x86_64.tar.gz
   $> cd mysql-cluster-gpl-9.4.0-linux-glibc2.12-x86_64
   $> cp bin/ndb_mgm* /usr/local/bin
   ```

   (You can safely delete the directory created by unpacking the downloaded archive, and the files it contains, from `/var/tmp` once **ndb_mgm** and **ndb_mgmd** have been copied to the executables directory.)

2. Change location to the directory into which you copied the files, and then make both of them executable:

   ```
   $> cd /usr/local/bin
   $> chmod +x ndb_mgm*
   ```

In Section 25.3.3, “Initial Configuration of NDB Cluster”, we create configuration files for all of the nodes in our example NDB Cluster.
