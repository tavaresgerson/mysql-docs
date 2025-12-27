## 3.8 Upgrading MySQL with the MySQL Yum Repository

For supported Yum-based platforms (see Section 2.5.1, “Installing MySQL on Linux Using the MySQL Yum Repository”, for a list), you can perform an in-place upgrade for MySQL (that is, replacing the old version and then running the new version using the old data files) with the MySQL Yum repository.

Notes

* An innovation series, such as MySQL 9.5, is in a separate track than an LTS series, such as MySQL 8.4. The LTS series is active by default.

* Before performing any update to MySQL, follow carefully the instructions in Chapter 3, *Upgrading MySQL*. Among other instructions discussed there, it is especially important to back up your database before the update.

* The following instructions assume you have installed MySQL with the MySQL Yum repository or with an RPM package directly downloaded from [MySQL Developer Zone's MySQL Download page](https://dev.mysql.com/downloads/); if that is not the case, following the instructions in Replacing a Native Third-Party Distribution of MySQL.

1. ### Selecting a Target Series

   By default, the MySQL Yum repository updates MySQL to the latest version in the release track you have chosen during installation (see Selecting a Release Series for details), which means, for example, a 8.0.x installation is *not* updated to a 8.4.x release automatically. To update to another release series, you must first disable the subrepository for the series that has been selected (by default, or by yourself) and enable the subrepository for your target series. To do that, see the general instructions given in Selecting a Release Series for editing the subrepository entries in the `/etc/yum.repos.d/mysql-community.repo` file.

   As a general rule, to upgrade from one bugfix series to another, go to the next bugfix series rather than skipping a bugfix series. For example, if you are currently running MySQL 5.7 and wish to upgrade to MySQL 8.4, upgrade to MySQL 8.0 first before upgrading to MySQL 8.4. For additional details, see Section 3.5, “Changes in MySQL 9.5”.

   * For important information about upgrading from MySQL 5.7 to 8.0, see Upgrading from MySQL 5.7 to 8.0.

   * For important information about upgrading from MySQL 8.0 to 8.4, see Upgrading from MySQL 8.0 to 8.4.

   * In-place downgrading of MySQL is not supported by the MySQL Yum repository. Follow the instructions in Chapter 4, *Downgrading MySQL*.

2. ### Upgrading MySQL

   Upgrade MySQL components using standard yum (or dnf) commands, such as MySQL Server:

   ```
   sudo yum update mysql-server
   ```

   For platforms that are dnf-enabled:

   ```
   sudo dnf upgrade mysql-server
   ```

   Alternatively, you can update MySQL by telling Yum to update everything on your system, which might take considerably more time. For platforms that are not dnf-enabled:

   ```
   sudo yum update
   ```

   For platforms that are dnf-enabled:

   ```
   sudo dnf upgrade
   ```

   Note

   The MySQL server always restarts after an update by Yum.

You can also update only a specific component. Use the following command to list all the installed packages for the MySQL components (for dnf-enabled systems, replace **yum** in the command with **dnf**):

```
sudo yum list installed | grep "^mysql"
```

After identifying the package name of the component of your choice, update the package with the following command, replacing *`package-name`* with the name of the package. For platforms that are not dnf-enabled:

```
sudo yum update package-name
```

For dnf-enabled platforms:

```
sudo dnf upgrade package-name
```

### Upgrading the Shared Client Libraries

After updating MySQL using the Yum repository, applications compiled with older versions of the shared client libraries should continue to work.

*If you recompile applications and dynamically link them with the updated libraries:*  As typical with new versions of shared libraries where there are differences or additions in symbol versioning between the newer and older libraries (for example, between the newer, standard 9.5 shared client libraries and some older—prior or variant—versions of the shared libraries shipped natively by the Linux distributions' software repositories, or from some other sources), any applications compiled using the updated, newer shared libraries require those updated libraries on systems where the applications are deployed. As expected, if those libraries are not in place, the applications requiring the shared libraries fail. For this reason, be sure to deploy the packages for the shared libraries from MySQL on those systems. To do this, add the MySQL Yum repository to the systems (see Adding the MySQL Yum Repository) and install the latest shared libraries using the instructions given in Installing Additional MySQL Products and Components with Yum.
