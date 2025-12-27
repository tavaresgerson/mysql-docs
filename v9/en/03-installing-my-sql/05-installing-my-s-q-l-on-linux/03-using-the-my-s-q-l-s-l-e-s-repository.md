### 2.5.3 Using the MySQL SLES Repository

The MySQL SLES repository provides RPM packages for installing and managing the MySQL server, client, and other components on SUSE Enterprise Linux Server. This section contains information on obtaining and installing these packages.

#### Adding the MySQL SLES Repository

Add or update the official MySQL SLES repository for your system's repository list:

Note

The beginning part of the configuration file name, such as `mysql84`, describes the default MySQL series that is enabled for installation. In this case, the subrepository for MySQL 8.4 LTS is enabled by default. It also contains other subrepository versions, such as MySQL 8.0 and the MySQL innovation series. MySQL 9.5 is the current innovation release.

##### New MySQL Repository Installation

If the MySQL repository is not yet present on the system then:

1. Go to the download page for MySQL SLES repository at <https://dev.mysql.com/downloads/repo/suse/>.

2. Select and download the release package for your SLES version.
3. Install the downloaded release package with the following command, replacing *`package-name`* with the name of the downloaded package:

   ```
   $> sudo rpm -Uvh package-name.rpm
   ```

   For example, to install the SLES 15 package where *`#`* indicates the release number within a version such as `15-1`:

   ```
   $> sudo rpm -Uvh mysql84-community-release-sl15-#.noarch.rpm
   ```

##### Update an Existing MySQL Repository Installation

If an older version is already present then update it:

* ``` $> sudo zypper update mysql84-community-release
  ```
* Although this is not required for each MySQL release, it does
  update MySQL repository information to include the current
  information. For example,
  `mysql84-community-release-sl15-7.noarch.rpm`
  is the first SUSE 15 repository configuration file that adds
  the innovation release track that begins with MySQL 8.1.
  series.

#### Selecting a Release Series

Within the MySQL SLES repository, different release series of the
MySQL Community Server are hosted in different subrepositories.
The subrepository for the latest bugfix series (currently MySQL
8.4) is enabled by default, and the
subrepositories for all other series are disabled. Use this
command to see all of the subrepositories in the MySQL SLES
repository, and to see which of them are enabled or disabled:

```
$> zypper repos | grep mysql.*community
```

The innovation track is available for SLES 15 with entries such as
`mysql-innovation-community`.

To install the latest release from a specific series, before
running the installation command, make sure that the subrepository
for the series you want is enabled and the subrepositories for
other series are disabled. For example, on SLES 15, to disable the
subrepositories for MySQL 8.4 server and tools,
which are enabled by default, use the following:

```
$> sudo zypper modifyrepo -d mysql-8.4-lts-community $> sudo zypper modifyrepo -d mysql-tools-community
```

Then, enable the subrepositories for the release series you want.
For example, to enable the Innovation track on SLES 15 which
installs MySQL 9.5:

```
$> sudo zypper modifyrepo -e mysql-innovation-community $> sudo zypper modifyrepo -e mysql-tools-innovation-community
```

You should only enable a subrepository for one release series at
any time.

Verify that the correct subrepositories have been enabled by
running the following command and checking its output:

```
$> zypper repos -E | grep mysql.*community

 7 | mysql-connectors-community       | MySQL Connectors Community                  | Yes     | (r ) Yes  | No 10 | mysql-innovation-community       | MySQL Innovation Release Community Server   | Yes     | (r ) Yes  | No 16 | mysql-tools-innovation-community | MySQL Tools Innovation Community            | Yes     | ( p) Yes  | No
```

After that, use the following command to refresh the repository
information for the enabled subrepository:

```
$> sudo zypper refresh
```

#### Installing MySQL with Zypper

With the official MySQL repository enabled, install MySQL Server:

```
$> sudo zypper install mysql-community-server
```

This installs the package for the MySQL server, as well as other
required packages.

#### Starting the MySQL Server

Start the MySQL server with the following command:

```
$> systemctl start mysql
```

You can check the status of the MySQL server with the following
command:

```
$> systemctl status mysql
```

If the operating system is systemd enabled, standard
**systemctl** (or alternatively,
**service** with the arguments reversed) commands
such as **stop**, **start**,
**status**, and **restart** should
be used to manage the MySQL server service. The
`mysql` service is enabled by default, and it
starts at system reboot. See Section 2.5.9, “Managing MySQL Server with systemd” for
additional information.

*MySQL Server Initialization:* When the server
is started for the first time, the server is initialized, and the
following happens (if the data directory of the server is empty
when the initialization process begins):

* The SSL certificate and key files are generated in the data
  directory.
* The [validate\_password
  plugin](validate-password.html "8.4.4 The Password Validation Component") is installed and enabled.
* A superuser account `'root'@'localhost'` is
  created. A password for the superuser is set and stored in the
  error log file. To reveal it, use the following command:

  ```
  $> sudo grep 'temporary password' /var/log/mysql/mysqld.log
  ```

  Change the root password as soon as possible by logging in
  with the generated, temporary password and set a custom
  password for the superuser account:

  ```
  $> mysql -uroot -p
  ```

  ```
  mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'MyNewPass4!';
  ```

Note

MySQL's
validate\_password
plugin is installed by default. This will require that passwords
contain at least one uppercase letter, one lowercase letter, one
digit, and one special character, and that the total password
length is at least 8 characters.

You can stop the MySQL Server with the following command:

```
$> sudo systemctl stop mysql
```

#### Installing Additional MySQL Products and Components

You can install more components of MySQL. List subrepositories in
the MySQL SLES repository with the following command:

```
$> zypper repos | grep mysql.*community
```

Use the following command to list the packages for the MySQL
components available for a certain subrepository, changing
*`subrepo-name`* to the name of the
subrepository you are interested in :

```
$> zypper packages subrepo-name
```

Install any packages of your choice with the following command,
replacing *`package-name`* with name of the
package (you might need to enable first the subrepository for the
package, using the same method for selecting a subrepository for a
specific release series outlined in
Selecting a Release Series):

```
$> sudo zypper install package-name
```

For example, to install the MySQL benchmark suite from the
subrepository for the release series you have already enabled:

```
$> sudo zypper install mysql-community-bench
```

#### Upgrading MySQL with the MySQL SLES Repository

Note

* Before performing any update to MySQL, follow carefully the
  instructions in Chapter 3, *Upgrading MySQL*. Among other
  instructions discussed there, it is especially important to
  back up your database before the update.

Use the MySQL SLES repository to perform an in-place update (that
is, replacing the old version of the server and then running the
new version using the old data files) for your MySQL installation
by following these steps (they assume you have installed MySQL
with the MySQL SLES repository; if that is not the case, following
the instructions in
Replacing MySQL Installed by an RPM from Other Sources instead):

1. ##### Selecting a Target Series

   During an update operation, by default, the MySQL SLES
   repository updates MySQL to the latest version in the
   release series you have chosen during installation (see
   Selecting a Release Series
   for details), which means. For example, an LTS series
   installation, such as 8.4, will
   *not* update to an innovation series,
   such as 9.5. To update to another
   release series, you need to first disable the subrepository
   for the series that has been selected (by default, or by
   yourself) and enable the subrepository for your target
   series. To do that, follow the general instructions given in
   Selecting a Release Series.

   As a general rule, to upgrade from one release series to
   another, go to the next series rather than skipping a
   series.

   Important

   In-place downgrading of MySQL is not supported by the
   MySQL SLES repository. Follow the instructions in
   Chapter 4, *Downgrading MySQL*.
2. ##### Upgrading MySQL

   Upgrade MySQL and its components by the following command:

   ```
   $> sudo zypper update mysql-community-server
   ```

   Alternatively, you can update MySQL by telling Zypper to
   update everything on your system (this might take
   considerably more time):

   ```
   $> sudo zypper update
   ```

You can also update a specific component only. Use the following
command to list all the installed packages from the MySQL SLES
repository:

```
$> zypper packages -i | grep mysql-.*community
```

After identifying the package name of the component of your
choice, update the package with the following command, replacing
*`package-name`* with the name of the
package:

```
$> sudo zypper update package-name
```

#### Replacing MySQL Installed by an RPM from Other Sources

RPMs for installing the MySQL Community Server and its components
can be downloaded from MySQL either from the
[MySQL Developer Zone](https://dev.mysql.com/downloads/),
from the native software repository of SLES, or from the MySQL
SLES repository. The RPMs from the those sources might be
different, and they might install and configure MySQL in different
ways.

If you have installed MySQL with RPMs from the MySQL Developer
Zone or the native software repository of SLES and want to replace
the installation using the RPM from the MySQL SLES repository,
follow these steps:

1. Back up your database to avoid data loss. See
   Chapter 9, *Backup and Recovery* on how to do that.
2. Stop your MySQL Server, if it is running. If the server is
   running as a service, you can stop it with the following
   command:

   ```
   $> systemctl stop mysql
   ```
3. Follow the steps given for
   Adding the MySQL SLES Repository.
4. Follow the steps given for
   Selecting a Release Series.
5. Follow the steps given for
   Installing MySQL with Zypper.
   You will be asked if you want to replace the old packages
   with the new ones; for example:

   ```
   Problem: mysql-community-server-5.6.22-2.sles11.x86_64 requires mysql-community-client = 5.6.22-2.sles11, but this requirement cannot be provided uninstallable providers: mysql-community-client-5.6.22-2.sles11.x86_64[mysql56-community] Solution 1: replacement of mysql-client-5.5.31-0.7.10.x86_64 with mysql-community-client-5.6.22-2.sles11.x86_64 Solution 2: do not install mysql-community-server-5.6.22-2.sles11.x86_64 Solution 3: break mysql-community-server-5.6.22-2.sles11.x86_64 by ignoring some of its dependencies

   Choose from above solutions by number or cancel [1/2/3/c] (c)
   ```

   Choose the “replacement” option
   (“Solution 1” in the example) to finish your
   installation from the MySQL SLES repository.

#### Installing MySQL NDB Cluster Using the SLES Repository

* The following instructions assume that neither the MySQL
  Server nor MySQL NDB Cluster has already been installed on
  your system; if that is not the case, remove the MySQL Server
  or MySQL NDB Cluster, including all its executables,
  libraries, configuration files, log files, and data
  directories, before you continue. However there is no need to
  remove the release package you might have used to enable the
  MySQL SLES repository on your system.
* The NDB Cluster Auto-Installer package has a dependency on the
  `python2-crypto` and
  `python-paramiko` packages. Zypper can take
  care of this dependency if the Python repository has been
  enabled on your system.

#### Selecting the MySQL NDB Cluster Subrepository

Within the MySQL SLES repository, the MySQL Community Server and
MySQL NDB Cluster are hosted in different subrepositories. By
default, the subrepository for the latest bugfix series of the
MySQL Server is enabled and the subrepository for MySQL NDB
Cluster is disabled. To install NDB Cluster, disable the
subrepository for the MySQL Server and enable the subrepository
for NDB Cluster. For example, disable the subrepository for MySQL
8.4, which is enabled by default, with the
following command:

```
$> sudo zypper modifyrepo -d mysql-8.4-lts-community
```

Then, enable the subrepository for MySQL NDB Cluster:

```
$> sudo zypper modifyrepo -e mysql-cluster-8.4-community
```

Verify that the correct subrepositories have been enabled by
running the following command and checking its output:

```
$> zypper repos -E | grep mysql.*community 10 | mysql-cluster-8.4-community | MySQL Cluster 8.4 Community | Yes     | No
```

After that, use the following command to refresh the repository
information for the enabled subrepository:

```
$> sudo zypper refresh
```

#### Installing MySQL NDB Cluster

For a minimal installation of MySQL NDB Cluster, follow these
steps:

* Install the components for SQL nodes:

  ```
  $> sudo zypper install mysql-cluster-community-server
  ```

  After the installation is completed, start and initialize the
  SQL node by following the steps given in
  Starting the MySQL Server.

  If you choose to initialize the data directory manually using
  the `mysqld --initialize` command (see
  Section 2.9.1, “Initializing the Data Directory” for details),
  a `root` password is going to be generated
  and stored in the SQL node's error log; see
  Starting the MySQL Server for how
  to find the password, and for a few things you need to know
  about it.

* Install the executables for management nodes:

  ```
  $> sudo zypper install mysql-cluster-community-management-server
  ```
* Install the executables for data nodes:

  ```
  $> sudo zypper install mysql-cluster-community-data-node
  ```

To install more NDB Cluster components, see
Installing Additional MySQL Products and Components.

See Section 25.3.3, “Initial Configuration of NDB Cluster” on how
to configure MySQL NDB Cluster and
Section 25.3.4, “Initial Startup of NDB Cluster” on how to
start it for the first time.

#### Installing Additional MySQL NDB Cluster Products and Components

You can use Zypper to install individual components and additional
products of MySQL NDB Cluster from the MySQL SLES repository. To do that,
assuming you already have the MySQL SLES repository on your
system's repository list (if not, follow Step 1 and 2 of
Installing MySQL NDB Cluster Using the SLES Repository),
follow the same steps given in
Installing Additional MySQL NDB Cluster Products and Components.

Note

*Known issue:* Currently, not all
components required for running the MySQL NDB Cluster test suite are
installed automatically when you install the test suite
package (`mysql-cluster-community-test`).
Install the following packages with **zypper
install** before you run the test suite:

* `mysql-cluster-community-auto-installer`
* `mysql-cluster-community-management-server`
* `mysql-cluster-community-data-node`
* `mysql-cluster-community-memcached`
* `mysql-cluster-community-java`
* `mysql-cluster-community-ndbclient-devel`
