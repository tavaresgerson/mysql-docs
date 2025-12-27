### 2.5.1 Installing MySQL on Linux Using the MySQL Yum Repository

The [MySQL Yum repository](https://dev.mysql.com/downloads/repo/yum/) for Oracle Linux, Red Hat Enterprise Linux and CentOS provides RPM packages for installing the MySQL server, client, MySQL Workbench, MySQL Utilities, MySQL Router, MySQL Shell, Connector/ODBC, Connector/Python and so on (not all packages are available for all the distributions; see Installing Additional MySQL Products and Components with Yum for details).

#### Before You Start

As a popular, open-source software, MySQL, in its original or re-packaged form, is widely installed on many systems from various sources, including different software download sites, software repositories, and so on. The following instructions assume that MySQL is not already installed on your system using a third-party-distributed RPM package; if that is not the case, follow the instructions given in Section 2.10.5, “Upgrading MySQL with the MySQL Yum Repository” or Section 2.5.2, “Replacing a Third-Party Distribution of MySQL Using the MySQL Yum Repository”.

#### Steps for a Fresh Installation of MySQL

Follow the steps below to install the latest GA version of MySQL with the MySQL Yum repository:

1. #### Adding the MySQL Yum Repository

   First, add the MySQL Yum repository to your system's repository list. This is a one-time operation, which can be performed by installing an RPM provided by MySQL. Follow these steps:

   1. Go to the Download MySQL Yum Repository page (<https://dev.mysql.com/downloads/repo/yum/>) in the MySQL Developer Zone.

   2. Select and download the release package for your platform.
   3. Install the downloaded release package with the following command, replacing *`platform-and-version-specific-package-name`* with the name of the downloaded RPM package:

      ```sql
      $> sudo yum localinstall platform-and-version-specific-package-name.rpm
      ```

      For an EL6-based system, the command is in the form of:

      ```sql
      $> sudo yum localinstall mysql57-community-release-el6-{version-number}.noarch.rpm
      ```

      For an EL7-based system:

      ```sql
      $> sudo yum localinstall mysql57-community-release-el7-{version-number}.noarch.rpm
      ```

      For an EL8-based system:

      ```sql
      $> sudo yum localinstall mysql57-community-release-el8-{version-number}.noarch.rpm
      ```

      For Fedora:

      MySQL 5.7 does not support Fedora; support was removed in MySQL 5.7.30. For details, see the [MySQL Product Support EOL Announcements](https://www.mysql.com/support/eol-notice.html).

      The installation command adds the MySQL Yum repository to your system's repository list and downloads the GnuPG key to check the integrity of the software packages. See Section 2.1.4.2, “Signature Checking Using GnuPG” for details on GnuPG key checking.

      You can check that the MySQL Yum repository has been successfully added by the following command:

      ```sql
      $> yum repolist enabled | grep "mysql.*-community.*"
      ```

   Note

   Once the MySQL Yum repository is enabled on your system, any system-wide update by the **yum update** command upgrades MySQL packages on your system and replaces any native third-party packages, if Yum finds replacements for them in the MySQL Yum repository; see Section 2.10.5, “Upgrading MySQL with the MySQL Yum Repository” and, for a discussion on some possible effects of that on your system, see Upgrading the Shared Client Libraries.

2. #### Selecting a Release Series

   When using the MySQL Yum repository, the latest GA series (currently MySQL 5.7) is selected for installation by default. If this is what you want, you can skip to the next step, Installing MySQL.

   Within the MySQL Yum repository, different release series of the MySQL Community Server are hosted in different subrepositories. The subrepository for the latest GA series (currently MySQL 5.7) is enabled by default, and the subrepositories for all other series (for example, the MySQL 5.6 series) are disabled by default. Use this command to see all the subrepositories in the MySQL Yum repository, and see which of them are enabled or disabled:

   ```sql
   $> yum repolist all | grep mysql
   ```

   To install the latest release from the latest GA series, no configuration is needed. To install the latest release from a specific series other than the latest GA series, disable the subrepository for the latest GA series and enable the subrepository for the specific series before running the installation command. If your platform supports **yum-config-manager**, you can do that by issuing these commands, which disable the subrepository for the 5.7 series and enable the one for the 5.6 series:

   ```sql
   $> sudo yum-config-manager --disable mysql57-community
   $> sudo yum-config-manager --enable mysql56-community
   ```

   For Fedora platforms:

   ```sql
   $> sudo dnf config-manager --disable mysql57-community
   $> sudo dnf config-manager --enable mysql56-community
   ```

   Besides using **yum-config-manager** or the **dnf config-manager** command, you can also select a release series by editing manually the `/etc/yum.repos.d/mysql-community.repo` file. This is a typical entry for a release series' subrepository in the file:

   ```sql
   [mysql57-community]
   name=MySQL 5.7 Community Server
   baseurl=http://repo.mysql.com/yum/mysql-5.7-community/el/6/$basearch/
   enabled=1
   gpgcheck=1
   gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql
   ```

   Find the entry for the subrepository you want to configure, and edit the `enabled` option. Specify `enabled=0` to disable a subrepository, or `enabled=1` to enable a subrepository. For example, to install MySQL 5.6, make sure you have `enabled=0` for the above subrepository entry for MySQL 5.7, and have `enabled=1` for the entry for the 5.6 series:

   ```sql
   # Enable to use MySQL 5.6
   [mysql56-community]
   name=MySQL 5.6 Community Server
   baseurl=http://repo.mysql.com/yum/mysql-5.6-community/el/6/$basearch/
   enabled=1
   gpgcheck=1
   gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql
   ```

   You should only enable subrepository for one release series at any time. When subrepositories for more than one release series are enabled, the latest series is used by Yum.

   Verify that the correct subrepositories have been enabled and disabled by running the following command and checking its output:

   ```sql
   $> yum repolist enabled | grep mysql
   ```

3. #### Disabling the Default MySQL Module

   (EL8 systems only) EL8-based systems such as RHEL8 and Oracle Linux 8 include a MySQL module that is enabled by default. Unless this module is disabled, it masks packages provided by MySQL repositories. To disable the included module and make the MySQL repository packages visible, use the following command (for dnf-enabled systems, replace **yum** in the command with **dnf**):

   ```sql
   $> sudo yum module disable mysql
   ```

4. #### Installing MySQL

   Install MySQL by the following command:

   ```sql
   $> sudo yum install mysql-community-server
   ```

   This installs the package for MySQL server (`mysql-community-server`) and also packages for the components required to run the server, including packages for the client (`mysql-community-client`), the common error messages and character sets for client and server (`mysql-community-common`), and the shared client libraries (`mysql-community-libs`).

5. #### Starting the MySQL Server

   Start the MySQL server with the following command:

   ```sql
   $> sudo service mysqld start
   Starting mysqld:[ OK ]
   ```

   You can check the status of the MySQL server with the following command:

   ```sql
   $> sudo service mysqld status
   mysqld (pid 3066) is running.
   ```

At the initial start up of the server, the following happens, given that the data directory of the server is empty:

* The server is initialized.
* SSL certificate and key files are generated in the data directory.

* `validate_password` is installed and enabled.

* A superuser account `'root'@'localhost` is created. A password for the superuser is set and stored in the error log file. To reveal it, use the following command:

  ```sql
  $> sudo grep 'temporary password' /var/log/mysqld.log
  ```

  Change the root password as soon as possible by logging in with the generated, temporary password and set a custom password for the superuser account:

  ```sql
  $> mysql -uroot -p
  ```

  ```sql
  mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'MyNewPass4!';
  ```

  Note

  `validate_password` is installed by default. The default password policy implemented by `validate_password` requires that passwords contain at least one uppercase letter, one lowercase letter, one digit, and one special character, and that the total password length is at least 8 characters.

For more information on the postinstallation procedures, see Section 2.9, “Postinstallation Setup and Testing”.

Note

*Compatibility Information for EL7-based platforms:* The following RPM packages from the native software repositories of the platforms are incompatible with the package from the MySQL Yum repository that installs the MySQL server. Once you have installed MySQL using the MySQL Yum repository, you cannot install these packages (and vice versa).

* akonadi-mysql

#### Installing Additional MySQL Products and Components with Yum

You can use Yum to install and manage individual components of MySQL. Some of these components are hosted in sub-repositories of the MySQL Yum repository: for example, the MySQL Connectors are to be found in the MySQL Connectors Community sub-repository, and the MySQL Workbench in MySQL Tools Community. You can use the following command to list the packages for all the MySQL components available for your platform from the MySQL Yum repository:

```sql
$> sudo yum --disablerepo=\* --enablerepo='mysql*-community*' list available
```

Install any packages of your choice with the following command, replacing *`package-name`* with name of the package:

```sql
$> sudo yum install package-name
```

For example, to install MySQL Workbench on Fedora:

```sql
$> sudo dnf install mysql-workbench-community
```

To install the shared client libraries:

```sql
$> sudo yum install mysql-community-libs
```

#### Updating MySQL with Yum

Besides installation, you can also perform updates for MySQL products and components using the MySQL Yum repository. See Section 2.10.5, “Upgrading MySQL with the MySQL Yum Repository” for details.
