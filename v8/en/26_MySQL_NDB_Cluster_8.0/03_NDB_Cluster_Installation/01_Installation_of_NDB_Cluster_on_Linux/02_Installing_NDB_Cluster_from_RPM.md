#### 25.3.1.2 Installing NDB Cluster from RPM

This section covers the steps necessary to install the correct executables for each type of NDB Cluster 8.0 node using RPM packages supplied by Oracle.

As an alternative to the method described in this section, Oracle provides MySQL Repositories for NDB Cluster that are compatible with many common Linux distributions. Two repositories, listed here, are available for RPM-based distributions:

* For distributions using **yum** or **dnf**, you can use the MySQL Yum Repository for NDB Cluster. See *Installing MySQL NDB Cluster Using the Yum Repository*, for instructions and additional information.

* For SLES, you can use the MySQL SLES Repository for NDB Cluster. See *Installing MySQL NDB Cluster Using the SLES Repository*, for instructions and additional information.

RPMs are available for both 32-bit and 64-bit Linux platforms. The filenames for these RPMs use the following pattern:

```
mysql-cluster-community-data-node-8.0.43-1.el7.x86_64.rpm

mysql-cluster-license-component-ver-rev.distro.arch.rpm

    license:= {commercial | community}

    component: {management-server | data-node | server | client | other—see text}

    ver: major.minor.release

    rev: major[.minor]

    distro: {el6 | el7 | sles12}

    arch: {i686 | x86_64}
```

*`license`* indicates whether the RPM is part of a Commercial or Community release of NDB Cluster. In the remainder of this section, we assume for the examples that you are installing a Community release.

Possible values for *`component`*, with descriptions, can be found in the following table:

**Table 25.6 Components of the NDB Cluster RPM distribution**

<table><thead><tr> <th>Component</th> <th>Description</th> </tr></thead><tbody><tr> <td><code>auto-installer</code> (DEPRECATED)</td> <td>NDB Cluster Auto Installer program; see Section 25.3.8, “The NDB Cluster Auto-Installer (NO LONGER SUPPORTED)”, for usage</td> </tr><tr> <td><code>client</code></td> <td>MySQL and <code>NDB</code> client programs; includes <span><strong>mysql</strong></span> client, <span><strong>ndb_mgm</strong></span> client, and other client tools</td> </tr><tr> <td><code>common</code></td> <td>Character set and error message information needed by the MySQL server</td> </tr><tr> <td><code>data-node</code></td> <td><span><strong>ndbd</strong></span> and <span><strong>ndbmtd</strong></span> data node binaries</td> </tr><tr> <td><code>devel</code></td> <td>Headers and library files needed for MySQL client development</td> </tr><tr> <td><code>embedded</code></td> <td>Embedded MySQL server</td> </tr><tr> <td><code>embedded-compat</code></td> <td>Backwards-compatible embedded MySQL server</td> </tr><tr> <td><code>embedded-devel</code></td> <td>Header and library files for developing applications for embedded MySQL</td> </tr><tr> <td><code>java</code></td> <td>JAR files needed for support of ClusterJ applications</td> </tr><tr> <td><code>libs</code></td> <td>MySQL client libraries</td> </tr><tr> <td><code>libs-compat</code></td> <td>Backwards-compatible MySQL client libraries</td> </tr><tr> <td><code>management-server</code></td> <td>The NDB Cluster management server (<span><strong>ndb_mgmd</strong></span>)</td> </tr><tr> <td><code>memcached</code></td> <td>Files needed to support <code>ndbmemcache</code></td> </tr><tr> <td><code>minimal-debuginfo</code></td> <td>Debug information for package server-minimal; useful when developing applications that use this package or when debugging this package</td> </tr><tr> <td><code>ndbclient</code></td> <td><code>NDB</code> client library for running NDB API and MGM API applications (<code>libndbclient</code>)</td> </tr><tr> <td><code>ndbclient-devel</code></td> <td>Header and other files needed for developing NDB API and MGM API applications</td> </tr><tr> <td><code>nodejs</code></td> <td>Files needed to set up Node.JS support for NDB Cluster</td> </tr><tr> <td><code>server</code></td> <td>The MySQL server (<span><strong>mysqld</strong></span>) with <code>NDB</code> storage engine support included, and associated MySQL server programs</td> </tr><tr> <td><code>server-minimal</code></td> <td>Minimal installation of the MySQL server for NDB and related tools</td> </tr><tr> <td><code>test</code></td> <td><span><strong>mysqltest</strong></span>, other MySQL test programs, and support files</td> </tr></tbody></table>

A single bundle (`.tar` file) of all NDB Cluster RPMs for a given platform and architecture is also available. The name of this file follows the pattern shown here:

```
mysql-cluster-license-ver-rev.distro.arch.rpm-bundle.tar
```

You can extract the individual RPM files from this file using **tar** or your preferred tool for extracting archives.

The components required to install the three major types of NDB Cluster nodes are given in the following list:

* *Management node*: `management-server`

* *Data node*: `data-node`
* *SQL node*: `server` and `common`

In addition, the `client` RPM should be installed to provide the **ndb_mgm** management client on at least one management node. You may also wish to install it on SQL nodes, to have **mysql** and other MySQL client programs available on these. We discuss installation of nodes by type later in this section.

*`ver`* represents the three-part `NDB` storage engine version number in 8.0.*`x`* format, shown as `8.0.43` in the examples. `rev` provides the RPM revision number in *`major`*.*`minor`* format. In the examples shown in this section, we use `1.1` for this value.

The *`distro`* (Linux distribution) is one of `rhel5` (Oracle Linux 5, Red Hat Enterprise Linux 4 and 5), `el6` (Oracle Linux 6, Red Hat Enterprise Linux 6), `el7` (Oracle Linux 7, Red Hat Enterprise Linux 7), or `sles12` (SUSE Enterprise Linux 12). For the examples in this section, we assume that the host runs Oracle Linux 7, Red Hat Enterprise Linux 7, or the equivalent (`el7`).

*`arch`* is `i686` for 32-bit RPMs and `x86_64` for 64-bit versions. In the examples shown here, we assume a 64-bit platform.

The NDB Cluster version number in the RPM file names (shown here as `8.0.43`) can vary according to the version which you are actually using. *It is very important that all of the Cluster RPMs to be installed have the same version number*. The architecture should also be appropriate to the machine on which the RPM is to be installed; in particular, you should keep in mind that 64-bit RPMs (`x86_64`) cannot be used with 32-bit operating systems (use `i686` for the latter).

**Data nodes.** On a computer that is to host an NDB Cluster data node it is necessary to install only the `data-node` RPM. To do so, copy this RPM to the data node host, and run the following command as the system root user, replacing the name shown for the RPM as necessary to match that of the RPM downloaded from the MySQL website:

```
$> rpm -Uhv mysql-cluster-community-data-node-8.0.43-1.el7.x86_64.rpm
```

This installs the **ndbd** and **ndbmtd**") data node binaries in `/usr/sbin`. Either of these can be used to run a data node process on this host.

**SQL nodes.** Copy the `server` and `common` RPMs to each machine to be used for hosting an NDB Cluster SQL node (`server` requires `common`). Install the `server` RPM by executing the following command as the system root user, replacing the name shown for the RPM as necessary to match the name of the RPM downloaded from the MySQL website:

```
$> rpm -Uhv mysql-cluster-community-server-8.0.43-1.el7.x86_64.rpm
```

This installs the MySQL server binary (**mysqld**), with `NDB` storage engine support, in the `/usr/sbin` directory. It also installs all needed MySQL Server support files and useful MySQL server programs, including the **mysql.server** and **mysqld_safe** startup scripts (in `/usr/share/mysql` and `/usr/bin`, respectively). The RPM installer should take care of general configuration issues (such as creating the `mysql` user and group, if needed) automatically.

Important

You must use the versions of these RPMs released for NDB Cluster; those released for the standard MySQL server do not provide support for the `NDB` storage engine.

To administer the SQL node (MySQL server), you should also install the `client` RPM, as shown here:

```
$> rpm -Uhv mysql-cluster-community-client-8.0.43-1.el7.x86_64.rpm
```

This installs the **mysql** client and other MySQL client programs, such as **mysqladmin** and **mysqldump**, to `/usr/bin`.

**Management nodes.** To install the NDB Cluster management server, it is necessary only to use the `management-server` RPM. Copy this RPM to the computer intended to host the management node, and then install it by running the following command as the system root user (replace the name shown for the RPM as necessary to match that of the `management-server` RPM downloaded from the MySQL website):

```
$> rpm -Uhv mysql-cluster-community-management-server-8.0.43-1.el7.x86_64.rpm
```

This RPM installs the management server binary **ndb_mgmd** in the `/usr/sbin` directory. While this is the only program actually required for running a management node, it is also a good idea to have the **ndb_mgm** NDB Cluster management client available as well. You can obtain this program, as well as other `NDB` client programs such as **ndb_desc** and **ndb_config**, by installing the `client` RPM as described previously.

See Section 2.5.4, “Installing MySQL on Linux Using RPM Packages from Oracle”, for general information about installing MySQL using RPMs supplied by Oracle.

After installing from RPM, you still need to configure the cluster; see Section 25.3.3, “Initial Configuration of NDB Cluster”, for the relevant information.

*It is very important that all of the Cluster RPMs to be installed have the same version number*. The *`architecture`* designation should also be appropriate to the machine on which the RPM is to be installed; in particular, you should keep in mind that 64-bit RPMs cannot be used with 32-bit operating systems.

**Data nodes.** On a computer that is to host a cluster data node it is necessary to install only the `server` RPM. To do so, copy this RPM to the data node host, and run the following command as the system root user, replacing the name shown for the RPM as necessary to match that of the RPM downloaded from the MySQL website:

```
$> rpm -Uhv MySQL-Cluster-server-gpl-8.0.43-1.sles11.i386.rpm
```

Although this installs all NDB Cluster binaries, only the program **ndbd** or **ndbmtd**") (both in `/usr/sbin`) is actually needed to run an NDB Cluster data node.

**SQL nodes.** On each machine to be used for hosting a cluster SQL node, install the `server` RPM by executing the following command as the system root user, replacing the name shown for the RPM as necessary to match the name of the RPM downloaded from the MySQL website:

```
$> rpm -Uhv MySQL-Cluster-server-gpl-8.0.43-1.sles11.i386.rpm
```

This installs the MySQL server binary (**mysqld**) with `NDB` storage engine support in the `/usr/sbin` directory, as well as all needed MySQL Server support files. It also installs the **mysql.server** and **mysqld_safe** startup scripts (in `/usr/share/mysql` and `/usr/bin`, respectively). The RPM installer should take care of general configuration issues (such as creating the `mysql` user and group, if needed) automatically.

To administer the SQL node (MySQL server), you should also install the `client` RPM, as shown here:

```
$> rpm -Uhv MySQL-Cluster-client-gpl-8.0.43-1.sles11.i386.rpm
```

This installs the **mysql** client program.

**Management nodes.** To install the NDB Cluster management server, it is necessary only to use the `server` RPM. Copy this RPM to the computer intended to host the management node, and then install it by running the following command as the system root user (replace the name shown for the RPM as necessary to match that of the `server` RPM downloaded from the MySQL website):

```
$> rpm -Uhv MySQL-Cluster-server-gpl-8.0.43-1.sles11.i386.rpm
```

Although this RPM installs many other files, only the management server binary **ndb_mgmd** (in the `/usr/sbin` directory) is actually required for running a management node. The `server` RPM also installs **ndb_mgm**, the `NDB` management client.

See Section 2.5.4, “Installing MySQL on Linux Using RPM Packages from Oracle”, for general information about installing MySQL using RPMs supplied by Oracle. See Section 25.3.3, “Initial Configuration of NDB Cluster”, for information about required post-installation configuration.
