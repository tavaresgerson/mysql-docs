### 2.5.1 Installing MySQL on Linux Using the MySQL Yum Repository

The MySQL Yum repository for Oracle Linux, Red Hat Enterprise Linux, CentOS, and Fedora provides RPM packages for installing the MySQL server, client, MySQL Workbench, MySQL Utilities, MySQL Router, MySQL Shell, Connector/ODBC, Connector/Python and so on (not all packages are available for all the distributions; see Installing Additional MySQL Products and Components with Yum for details).

#### Before You Start

As a popular, open-source software, MySQL, in its original or re-packaged form, is widely installed on many systems from various sources, including different software download sites, software repositories, and so on. The following instructions assume that MySQL is not already installed on your system using a third-party-distributed RPM package; if that is not the case, follow the instructions given in Section 3.8, “Upgrading MySQL with the MySQL Yum Repository” or Replacing a Third-Party Distribution of MySQL Using the MySQL Yum Repository.

Important

Repository setup RPM file names begin with `mysql-84-lts-community` to highlight the default active MySQL subrepository, which is MySQL 8.4 today. MySQL 8.0 must be manually enabled via your local repository configuration to install MySQL 8.0 instead of MySQL 8.4.

#### Steps for a Fresh Installation of MySQL

Follow the steps below to install the latest GA version of MySQL with the MySQL Yum repository:

1. #### Adding the MySQL Yum Repository

   First, add the MySQL Yum repository to your system's repository list. This is a one-time operation, which can be performed by installing an RPM provided by MySQL. Follow these steps:

   1. Go to the Download MySQL Yum Repository page (<https://dev.mysql.com/downloads/repo/yum/>) in the MySQL Developer Zone.

   2. Select and download the release package for your platform.

   3. Install the downloaded release package with the following command, replacing *`platform-and-version-specific-package-name`* with the name of the downloaded RPM package:

      ```
      $> sudo yum install platform-and-version-specific-package-name.rpm
      ```

      For an EL6-based system, the command is in the form of (note the mysql80 prefix instead of mysql84 because EL6-based systems do not support MySQL 8.4):

      ```
      $> sudo yum install mysql80-community-release-el6-{version-number}.noarch.rpm
      ```

      For an EL7-based system:

      ```
      $> sudo yum install mysql84-community-release-el7-{version-number}.noarch.rpm
      ```

      Fpr EL8 or later, change `el7` to the version number of your Enterprise Linux.

      For Fedora 41 and 42:

      ```
      $> sudo dnf install mysql84-community-release-fcnn-{rpm-version-number}.noarch.rpm
      ```

      Replace *`nn`* with the Fedora version and *`{rpm-version-number}`* with the rpm's version number. For example, for:

      ```
      mysql84-community-release-fc42-1.noarch.rpm
      ```

      The installation command adds the MySQL Yum repository to your system's repository list and downloads the GnuPG key to check the integrity of the software packages. See Section 2.1.4.2, “Signature Checking Using GnuPG” for details on GnuPG key checking.

      You can check that the MySQL Yum repository has been successfully added by the following command (for dnf-enabled systems, replace **yum** in the command with **dnf**):

      ```
      $> yum repolist enabled | grep "mysql.*-community.*"
      ```

   Note

   Once the MySQL Yum repository is enabled on your system, any system-wide update by the **yum update** command (or **dnf upgrade** for dnf-enabled systems) upgrades MySQL packages on your system and replaces any native third-party packages, if Yum finds replacements for them in the MySQL Yum repository; see Section 3.8, “Upgrading MySQL with the MySQL Yum Repository”, for a discussion on some possible effects of that on your system, see Upgrading the Shared Client Libraries.

2. #### Selecting a Release Series

   When using the MySQL Yum repository, the latest LTS series (currently MySQL 8.4) is selected for installation by default. If you want to install MySQL 8.4 instead of 8.0 then skip this step.

   Within the MySQL Yum repository, different release series of the MySQL Community Server are hosted in different subrepositories. The subrepository for the latest GA series (currently MySQL 8.4) is enabled by default, and the subrepositories for all other series (for example, the MySQL 8.0 series) are disabled by default. Use this command to see all the subrepositories in the MySQL Yum repository, and see which of them are enabled or disabled (for dnf-enabled systems, replace **yum** in the command with **dnf**):

   ```
   $> yum repolist all | grep mysql
   ```

   To install the latest release from the latest LTS series, no configuration is needed. To install the latest release from a specific series other than the latest LTS series, disable the subrepository for the latest LTS series and enable the subrepository for the specific series before running the installation command. If your platform supports **yum-config-manager**, you can do that by issuing these commands, which disable the subrepository for the 8.4 series and enable the one for the 8.0 series:

   ```
   $> sudo yum-config-manager --disable mysql-8.4-lts-community
   $> sudo yum-config-manager --disable mysql-tools-8.4-lts-community

   $> sudo yum-config-manager --enable mysql80-community
   $> sudo yum-config-manager --enable mysql-tools-community
   ```

   For dnf-enabled platforms:

   ```
   $> sudo dnf config-manager --disable mysql-8.4-lts-community
   $> sudo dnf config-manager --disable mysql-tools-8.4-lts-community

   $> sudo dnf config-manager --enable mysql80-community
   $> sudo dnf config-manager --enable mysql-tools-community
   ```

   Besides using **yum-config-manager** or the **dnf config-manager** command, you can also select a release series by editing manually the `/etc/yum.repos.d/mysql-community.repo` file. This is a typical entry for a MySQL 8.0 subrepository:

   ```
   [mysql80-community]
   name=MySQL 8.0 Community Server
   baseurl=http://repo.mysql.com/yum/mysql-8.0-community/el/9/$basearch/
   enabled=1
   gpgcheck=1
   gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql-2023
   ```

   Find the entry for the subrepository you want to configure, and edit the `enabled` option. Specify `enabled=0` to disable a subrepository, or `enabled=1` to enable a subrepository. For example, to install MySQL 8.0, make sure you have `enabled=0` for the other MySQL series entries and `enabled=1` for MySQL 8.0.

   You should only enable subrepository for one release series at any time. When subrepositories for more than one release series are enabled, Yum uses the latest series.

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

Note

ARM 64-bit (aarch64) is supported on Oracle Linux 7 as of MySQL 8.0.12.

Known Limitation

The 8.0.12 release requires you to adjust the *libstdc++7* path by executing `ln -s /opt/oracle/oracle-armtoolset-1/root/usr/lib64 /usr/lib64/gcc7` after executing the `yum install` step.

#### Updating MySQL with Yum

Besides installation, you can also perform updates for MySQL products and components using the MySQL Yum repository. See Section 3.8, “Upgrading MySQL with the MySQL Yum Repository” for details.
