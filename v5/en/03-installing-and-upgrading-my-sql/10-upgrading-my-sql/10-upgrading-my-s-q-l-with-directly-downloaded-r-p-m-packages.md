### 2.10.10 Upgrading MySQL with Directly-Downloaded RPM Packages

It is preferable to use the MySQL Yum repository or [MySQL SLES Repository](https://dev.mysql.com/downloads/repo/suse/) to upgrade MySQL on RPM-based platforms. However, if you have to upgrade MySQL using the RPM packages downloaded directly from the [MySQL Developer Zone](https://dev.mysql.com/) (see Section 2.5.5, “Installing MySQL on Linux Using RPM Packages from Oracle” for information on the packages), go to the folder that contains all the downloaded packages (and, preferably, no other RPM packages with similar names), and issue the following command:

```sql
yum install mysql-community-{server,client,common,libs}-*
```

Replace **yum** with **zypper** for SLES systems, and with **dnf** for dnf-enabled systems.

While it is much preferable to use a high-level package management tool like **yum** to install the packages, users who preferred direct **rpm** commands can replace the **yum install** command with the **rpm -Uvh** command; however, using **rpm -Uvh** instead makes the installation process more prone to failure, due to potential dependency issues the installation process might run into.

For an upgrade installation using RPM packages, the MySQL server is automatically restarted at the end of the installation if it was running when the upgrade installation began. If the server was not running when the upgrade installation began, you have to restart the server yourself after the upgrade installation is completed; do that with, for example, the follow command:

```sql
service mysqld start
```

Once the server restarts, run **mysql\_upgrade** to check and possibly resolve any incompatibilities between the old data and the upgraded software. **mysql\_upgrade** also performs other functions; see Section 4.4.7, “mysql\_upgrade — Check and Upgrade MySQL Tables” for details.

Note

Because of the dependency relationships among the RPM packages, all of the installed packages must be of the same version. Therefore, always update all your installed packages for MySQL. For example, do not just update the server without also upgrading the client, the common files for server and client libraries, and so on.

**Migration and Upgrade from installations by older RPM packages.** Some older versions of MySQL Server RPM packages have names in the form of MySQL-\* (for example, MySQL-server-\* and MySQL-client-\*). The latest versions of RPMs, when installed using the standard package management tool (**yum**, **dnf**, or **zypper**), seamlessly upgrade those older installations, making it unnecessary to uninstall those old packages before installing the new ones. Here are some differences in behavior between the older and the current RPM packages:

**Table 2.16 Differences Between the Previous and the Current RPM Packages for Installing MySQL**

<table frame="all" summary="The differences between the previous and current RPM Packages for installing MySQL."><col style="width: 40%"/><col style="width: 30%"/><col style="width: 30%"/><thead><tr> <th scope="col">Feature</th> <th scope="col">Behavior of Previous Packages</th> <th scope="col">Behavior of Current Packages</th> </tr></thead><tbody><tr> <th scope="row">Service starts after installation is finished</th> <td>Yes</td> <td>No, unless it is an upgrade installation, and the server was running when the upgrade began.</td> </tr><tr> <th scope="row">Service name</th> <td>mysql</td> <td><p> For RHEL, Oracle Linux, CentOS, and Fedora: <a class="link" href="mysqld.html" title="4.3.1 mysqld — The MySQL Server"><span class="command"><strong>mysqld</strong></span></a> </p><p> For SLES: <a class="link" href="mysql.html" title="4.5.1 mysql — The MySQL Command-Line Client"><span class="command"><strong>mysql</strong></span></a> </p></td> </tr><tr> <th scope="row">Error log file</th> <td>At <code class="filename">/var/lib/mysql/<em class="replaceable"><code>hostname</code></em>.err</code></td> <td><p> For RHEL, Oracle Linux, CentOS, and Fedora: at <code class="filename">/var/log/mysqld.log</code> </p><p> For SLES: at <code class="filename">/var/log/mysql/mysqld.log</code> </p></td> </tr><tr> <th scope="row">Shipped with the <code class="filename">/etc/my.cnf</code> file</th> <td>No</td> <td>Yes</td> </tr><tr> <th scope="row">Multilib support</th> <td>No</td> <td>Yes</td> </tr></tbody></table>

Note

Installation of previous versions of MySQL using older packages might have created a configuration file named `/usr/my.cnf`. It is highly recommended that you examine the contents of the file and migrate the desired settings inside to the file `/etc/my.cnf` file, then remove `/usr/my.cnf`.

**Upgrading to MySQL Enterprise Server.** Upgrading from a community version to a commercial version of MySQL requires that you first uninstall the community version and then install the commercial version. In this case, you must restart the server manually after the upgrade.

**Interoperability with operating system native MySQL packages.** Many Linux distributions ship MySQL as an integrated part of the operating system. The latest versions of RPMs from Oracle, when installed using the standard package management tool (**yum**, **dnf**, or **zypper**), seamlessly upgrades and replaces the version of MySQL that comes with the operating system, and the package manager automatically replaces system compatibility packages such as `mysql-community-libs-compat` with the relevant new versions.

**Upgrading from non-native MySQL packages.** If you have installed MySQL with third-party packages NOT from your Linux distribution's native software repository (for example, packages directly downloaded from the vendor), you must uninstall all those packages before you can upgrade using the packages from Oracle.
