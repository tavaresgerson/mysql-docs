### 2.5.2 Replacing a Third-Party Distribution of MySQL Using the MySQL Yum Repository

For supported Yum-based platforms (see Section 2.5.1, “Installing MySQL on Linux Using the MySQL Yum Repository”, for a list), you can replace a third-party distribution of MySQL with the latest GA release (from the MySQL 5.7 series currently) from the MySQL Yum repository. According to how your third-party distribution of MySQL was installed, there are different steps to follow:

#### Replacing a Native Third-Party Distribution of MySQL

If you have installed a third-party distribution of MySQL from a native software repository (that is, a software repository provided by your own Linux distribution), follow these steps:

1. #### Backing Up Your Database

   To avoid loss of data, always back up your database before trying to replace your MySQL installation using the MySQL Yum repository. See Chapter 7, *Backup and Recovery*, on how to back up your database.

2. #### Adding the MySQL Yum Repository

   Add the MySQL Yum repository to your system's repository list by following the instructions given in Adding the MySQL Yum Repository.

3. #### Replacing the Native Third-Party Distribution by a Yum Update or a DNF Upgrade

   By design, the MySQL Yum repository replaces your native third-party MySQL with the latest GA release (from the MySQL 5.7 series currently) from the MySQL Yum repository when you perform a **yum update** command on the system, or a **yum update mysql-server**.

After updating MySQL using the Yum repository, applications compiled with older versions of the shared client libraries should continue to work. However, *if you want to recompile applications and dynamically link them with the updated libraries*, see Upgrading the Shared Client Libraries, for some special considerations.

#### Replacing a Nonnative Third-Party Distribution of MySQL

If you have installed a third-party distribution of MySQL from a nonnative software repository (that is, a software repository not provided by your own Linux distribution), follow these steps:

1. #### Backing Up Your Database

   To avoid loss of data, always back up your database before trying to replace your MySQL installation using the MySQL Yum repository. See Chapter 7, *Backup and Recovery*, on how to back up your database.

2. #### Stopping Yum from Receiving MySQL Packages from Third-Party, Nonnative Repositories

   Before you can use the MySQL Yum repository for installing MySQL, you must stop your system from receiving MySQL packages from any third-party, nonnative Yum repositories.

   For example, if you have installed MariaDB using their own software repository, get a list of the installed MariaDB packages using the following command:

   ```sql
   $> yum list installed mariadb\*
   MariaDB-common.i686                      10.0.4-1                       @mariadb
   MariaDB-compat.i686                      10.0.4-1                       @mariadb
   MariaDB-server.i686                      10.0.4-1                       @mariadb
   ```

   From the command output, we can identify the installed packages (`MariaDB-common`, `MariaDB-compat`, and `MariaDB-server`) and the source of them (a nonnative software repository named `mariadb`).

   As another example, if you have installed Percona using their own software repository, get a list of the installed Percona packages using the following command:

   ```sql
   $> yum list installed Percona\*
   Percona-Server-client-55.i686     5.5.39-rel36.0.el6          @percona-release-i386
   Percona-Server-server-55.i686     5.5.39-rel36.0.el6          @percona-release-i386
   Percona-Server-shared-55.i686     5.5.39-rel36.0.el6          @percona-release-i386
   percona-release.noarch            0.1-3                       @/percona-release-0.1-3.noarch
   ```

   From the command output, we can identify the installed packages (`Percona-Server-client`, `Percona-Server-server`, `Percona-Server-shared`, and `percona-release.noarch`) and the source of them (a nonnative software repository named `percona-release`).

   If you are not sure which third-party MySQL fork you have installed, this command should reveal it and list the RPM packages installed for it, as well as the third-party repository that supplies the packages:

   ```sql
   $> yum --disablerepo=\* provides mysql\*
   ```

   The next step is to stop Yum from receiving packages from the nonnative repository. If the **yum-config-manager** utility is supported on your platform, you can, for example, use this command for stopping delivery from MariaDB:

   ```sql
   $> sudo yum-config-manager --disable mariadb
   ```

   Use this command for stopping delivery from Percona:

   ```sql
   $> sudo yum-config-manager --disable percona-release
   ```

   You can perform the same task by removing the entry for the software repository existing in one of the repository files under the `/etc/yum.repos.d/` directory. This is how the entry typically looks for MariaDB:

   ```sql
   [mariadb] name = MariaDB
    baseurl = [base URL for repository]
    gpgkey = [URL for GPG key]
    gpgcheck =1
   ```

   The entry is usually found in the file `/etc/yum.repos.d/MariaDB.repo` for MariaDB—delete the file, or remove entry from it (or from the file in which you find the entry).

   Note

   This step is not necessary for an installation that was configured with a Yum repository release package (like Percona) if you are going to remove the release package (`percona-release.noarch` for Percona), as shown in the uninstall command for Percona in Step 3 below.

3. #### Uninstalling the Nonnative Third-Party MySQL Distribution of MySQL

   The nonnative third-party MySQL distribution must first be uninstalled before you can use the MySQL Yum repository to install MySQL. For the MariaDB packages found in Step 2 above, uninstall them with the following command:

   ```sql
   $> sudo yum remove MariaDB-common MariaDB-compat MariaDB-server
   ```

   For the Percona packages we found in Step 2 above:

   ```sql
   $> sudo yum remove Percona-Server-client-55 Percona-Server-server-55 \
     Percona-Server-shared-55.i686 percona-release
   ```

4. #### Installing MySQL with the MySQL Yum Repository

   Then, install MySQL with the MySQL Yum repository by following the instructions given in Section 2.5.1, “Installing MySQL on Linux Using the MySQL Yum Repository”: .

   Important

   If you have chosen to replace your third-party MySQL distribution with a newer version of MySQL from the MySQL Yum repository, remember to run **mysql_upgrade** after the server starts, to check and possibly resolve any incompatibilities between the old data and the upgraded software. **mysql_upgrade** also performs other functions; see Section 4.4.7, “mysql_upgrade — Check and Upgrade MySQL Tables” for details.

   *For EL7-based platforms:* See Compatibility Information for EL7-based platforms.
