### 2.5.1 Installing MySQL on Linux Using the MySQL Yum Repository

The [MySQL Yum repository](https://dev.mysql.com/downloads/repo/yum/) for Oracle Linux, Red Hat Enterprise Linux, CentOS, and Fedora provides RPM packages for installing the MySQL server, client, MySQL Workbench, MySQL Utilities, MySQL Router, MySQL Shell, Connector/ODBC, Connector/Python and so on (not all packages are available for all the distributions; see Installing Additional MySQL Products and Components with Yum for details).

#### Before You Start

As a popular, open-source software, MySQL, in its original or re-packaged form, is widely installed on many systems from various sources, including different software download sites, software repositories, and so on. The following instructions assume that MySQL is not already installed on your system using a third-party-distributed RPM package; if that is not the case, follow the instructions given at Replacing a Native Third-Party Distribution of MySQL.

Note

Repository setup RPM file names begin with `mysql84`, which describes the MySQL series that is enabled by default for installation. In this case, the MySQL 8.4 LTS subrepository is enabled by default. It also contains other subrepository versions, such as MySQL 8.0 and the MySQL Innovation Series, which are disabled by default. Choose the innovation series to install MySQL 9.5.

#### Steps for a Fresh Installation of MySQL

Follow these steps to choose and install the latest MySQL products:

1. #### Adding the MySQL Yum Repository

   Add the MySQL Yum repository to your system's repository list. This is typically a one-time operation that is performed by installing the RPM provided by MySQL. Follow these steps:

   1. Download it from the MySQL Yum Repository page (<https://dev.mysql.com/downloads/repo/yum/>) in the MySQL Developer Zone.

   2. Select and download the release package for your platform.

   3. Install the downloaded release package. The package file format is:

      ```
      mysql84-community-release-{platform}-{version-number}.noarch.rpm
      ```

      * *`mysql84`*: Indicates the MySQL version that is enabled by default. In this case, MySQL 8.4 is enabled by default, and both MySQL 8.0 and the MySQL Innovation series are available but disabled by default.

      * *`{platform}`*: The platform code, such as el7, el8, el9, fc41, or fc42. The 'el' represents Enterprise Linux, 'fc' for Fedora, and it ends with the platform's base version number.

      * *`{version-number}`*: Version of the MySQL repository configuration RPM as they do receive occasional updates.

      Install the RPM you downloaded for your system, for example:

      ```
      $> sudo yum localinstall mysql84-community-release-{platform}-{version-number}.noarch.rpm
      ```

      The installation command adds the MySQL Yum repository to your system's repository list and downloads the GnuPG key to check the integrity of the software packages. See Section 2.1.4.2, “Signature Checking Using GnuPG” for details on GnuPG key checking.

      You can check that the MySQL Yum repository has been successfully added and enabled by the following command (for dnf-enabled systems, replace **yum** in the command with **dnf**):

      ```
      $> yum repolist enabled | grep mysql.*-community
      ```

      Example output:

      ```
      mysql-8.4-lts-community               MySQL 8.4 LTS Community Server
      mysql-tools-8.4-lts-community            MySQL Tools 8.4 LTS Community
      ```

      This also demonstrates that the latest LTS MySQL version is enabled by default. Methods to choose a different release series, such as the innovation track (which today is 9.5) or a previous series (such as MySQL 8.0), are described below.

   Note

   Once the MySQL Yum repository is enabled on your system, any system-wide update by the **yum update** command (or **dnf upgrade** for dnf-enabled systems) upgrades MySQL packages on your system and replaces any native third-party packages, if Yum finds replacements for them in the MySQL Yum repository; see Section 3.8, “Upgrading MySQL with the MySQL Yum Repository”, for a discussion on some possible effects of that on your system, see Upgrading the Shared Client Libraries.

2. #### Selecting a Release Series

   When using the MySQL Yum repository, the latest bugfix series (currently MySQL 8.4) is selected for installation by default. If this is what you want, you can skip to the next step, Installing MySQL.

   Within the MySQL Yum repository, each MySQL Community Server release series is hosted in a different subrepository. The subrepository for the latest LTS series (currently MySQL 8.4) is enabled by default, and the subrepositories for all other series' (for example, MySQL 8.0 and the MySQL Innovation series) are disabled by default. Use this command to see all available MySQL-related subrepositories (for dnf-enabled systems, replace **yum** in the command with **dnf**):

   ```
   $> yum repolist all | grep mysql
   ```

   Example output:

   ```
   mysql-connectors-community                 MySQL Connectors Community   enabled
   mysql-tools-8.4-lts-community               MySQL Tools 8.4 LTS Community        enabled
   mysql-tools-community                      MySQL Tools Community        disabled
   mysql-tools-innovation-community           MySQL Tools Innovation Commu disabled
   mysql-innovation-community                 MySQL Innovation Release Com disabled
   mysql-8.4-lts-community                          MySQL 8.4 Community LTS Server   enabled
   mysql-8.4-lts-community-debuginfo                MySQL 8.4 Community LTS Server - disabled
   mysql-8.4-lts-community-source                   MySQL 8.4 Community LTS Server - disabled
   mysql80-community                        MySQL 8.0 Community Server - disabled
   mysql80-community-debuginfo              MySQL 8.0 Community Server - disabled
   mysql80-community-source                 MySQL 8.0 Community Server - disabled
   ```

   To install the latest release from a specific series other than the latest LTS series, disable the bug subrepository for the latest LTS series and enable the subrepository for the specific series before running the installation command. If your platform supports the **yum-config-manager** or **dnf config-manager** command, you can do that by issuing the following commands to disable the subrepository for the 8.4 series and enable the one for the 8.0 series:

   ```
   $> sudo yum-config-manager --disable mysql-8.4-lts-community
   $> sudo yum-config-manager --enable  mysql80-community
   ```

   For dnf-enabled platforms:

   ```
   $> sudo dnf config-manager --disable mysql-8.4-lts-community
   $> sudo dnf config-manager --enable mysql80-community
   ```

   Instead of using the config-manager commands you can manually edit the `/etc/yum.repos.d/mysql-community.repo` file by toggling the `enabled` option. For example, a typical default entry for EL8:

   ```
   [mysql-8.4-lts-community]
   name=MySQL 8.4 LTS Community Server
   baseurl=http://repo.mysql.com/yum/mysql-8.4-community/el/8/$basearch/
   enabled=1
   gpgcheck=1
   gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql-2023
   ```

   Find the entry for the subrepository you want to configure and edit the `enabled` option. Specify `enabled=0` to disable a subrepository or `enabled=1` to enable a subrepository. For example, to install from the MySQL innovation track, make sure you have `enabled=0` for the MySQL 8.4 subrepository entries and have `enabled=1` for the innovation entries:

   ```
   [mysql80-community]
   name=MySQL 8.0 Community Server
   baseurl=http://repo.mysql.com/yum/mysql-8.0-community/el/8/$basearch
   enabled=1
   gpgcheck=1
   gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql-2023
   ```

   You should only enable subrepository for one release series at any time.

   Verify that the correct subrepositories have been enabled and disabled by running the following command and checking its output (for dnf-enabled systems, replace **yum** in the command with **dnf**):

   ```
   $> yum repolist enabled | grep mysql
   ```

3. #### Disabling the Default MySQL Module

   (EL8 systems only) EL8-based systems such as RHEL8 and Oracle Linux 8 include a MySQL module that is enabled by default. Unless this module is disabled, it masks packages provided by MySQL repositories. To disable the included module and make the MySQL repository packages visible, use the following command (for dnf-enabled systems, replace **yum** in the command with **dnf**):

   ```
   $> sudo yum module disable mysql
   ```

4. #### Installing MySQL

   Install MySQL by the following command (for dnf-enabled systems, replace **yum** in the command with **dnf**):

   ```
   $> sudo yum install mysql-community-server
   ```

   This installs the package for MySQL server (`mysql-community-server`) and also packages for the components required to run the server, including packages for the client (`mysql-community-client`), the common error messages and character sets for client and server (`mysql-community-common`), and the shared client libraries (`mysql-community-libs`).

5. #### Starting the MySQL Server

   Start the MySQL server with the following command:

   ```
   $> systemctl start mysqld
   ```

   You can check the status of the MySQL server with the following command:

   ```
   $> systemctl status mysqld
   ```

If the operating system is systemd enabled, standard **systemctl** (or alternatively, **service** with the arguments reversed) commands such as **stop**, **start**, **status**, and **restart** should be used to manage the MySQL server service. The `mysqld` service is enabled by default, and it starts at system reboot. See Section 2.5.9, “Managing MySQL Server with systemd” for additional information.

At the initial start up of the server, the following happens, given that the data directory of the server is empty:

* The server is initialized.
* SSL certificate and key files are generated in the data directory.

* `validate_password` is installed and enabled.

* A superuser account `'root'@'localhost` is created. A password for the superuser is set and stored in the error log file. To reveal it, use the following command:

  ```
  $> sudo grep 'temporary password' /var/log/mysqld.log
  ```

  Change the root password as soon as possible by logging in with the generated, temporary password and set a custom password for the superuser account:

  ```
  $> mysql -uroot -p
  ```

  ```
  mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'MyNewPass4!';
  ```

  Note

  `validate_password` is installed by default. The default password policy implemented by `validate_password` requires that passwords contain at least one uppercase letter, one lowercase letter, one digit, and one special character, and that the total password length is at least 8 characters.

For more information on the postinstallation procedures, see Section 2.9, “Postinstallation Setup and Testing”.

Note

*Compatibility Information for EL7-based platforms:* The following RPM packages from the native software repositories of the platforms are incompatible with the package from the MySQL Yum repository that installs the MySQL server. Once you have installed MySQL using the MySQL Yum repository, you cannot install these packages (and vice versa).

* akonadi-mysql

#### Installing Additional MySQL Products and Components with Yum

You can use Yum to install and manage individual components of MySQL. Some of these components are hosted in sub-repositories of the MySQL Yum repository: for example, the MySQL Connectors are to be found in the MySQL Connectors Community sub-repository, and the MySQL Workbench in MySQL Tools Community. You can use the following command to list the packages for all the MySQL components available for your platform from the MySQL Yum repository (for dnf-enabled systems, replace **yum** in the command with **dnf**):

```
$> sudo yum --disablerepo=\* --enablerepo='mysql*-community*' list available
```

Install any packages of your choice with the following command, replacing *`package-name`* with name of the package (for dnf-enabled systems, replace **yum** in the command with **dnf**):

```
$> sudo yum install package-name
```

For example, to install MySQL Workbench on Fedora:

```
$> sudo dnf install mysql-workbench-community
```

To install the shared client libraries (for dnf-enabled systems, replace **yum** in the command with **dnf**):

```
$> sudo yum install mysql-community-libs
```

#### Platform Specific Notes

ARM Support

ARM 64-bit (aarch64) is supported on Oracle Linux 7 and requires the Oracle Linux 7 Software Collections Repository (ol7_software_collections). For example, to install the server:

```
$> yum-config-manager --enable ol7_software_collections
$> yum install mysql-community-server
```

#### Updating MySQL with Yum

Besides installation, you can also perform updates for MySQL products and components using the MySQL Yum repository. See Section 3.8, “Upgrading MySQL with the MySQL Yum Repository” for details.

#### Replacing a Native Third-Party Distribution of MySQL

If you have installed a third-party distribution of MySQL from a native software repository (that is, a software repository provided by your own Linux distribution), follow these steps:

1. #### Backing Up Your Database

   To avoid loss of data, always back up your database before trying to replace your MySQL installation using the MySQL Yum repository. See Chapter 9, *Backup and Recovery*, on how to back up your database.

2. #### Adding the MySQL Yum Repository

   Add the MySQL Yum repository to your system's repository list by following the instructions given in Adding the MySQL Yum Repository.

3. #### Replacing the Native Third-Party Distribution by a Yum Update or a DNF Upgrade

   By design, the MySQL Yum repository replaces your native, third-party MySQL with the latest bugfix release from the MySQL Yum repository when you perform a **yum update** command (or **dnf upgrade** for dnf-enabled systems) on the system, or a **yum update mysql-server** (or **dnf upgrade mysql-server** for dnf-enabled systems).

After updating MySQL using the Yum repository, applications compiled with older versions of the shared client libraries should continue to work. However, *if you want to recompile applications and dynamically link them with the updated libraries*, see Upgrading the Shared Client Libraries, for some special considerations.

Note

*For EL7-based platforms:* See Compatibility Information for EL7-based platforms.
