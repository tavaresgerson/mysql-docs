## 19.2 Setting Up MySQL as a Document Store

To use MySQL 5.7 as a document store, the X Plugin needs to be
installed. Then you can use X Protocol to communicate with the
server. Without the X Plugin running, X Protocol clients cannot
connect to the server. The X Plugin is supplied with MySQL (5.7.12
or higher) — installing it does not involve a separate
download. This section describes how to install X Plugin.

Follow the steps outlined here:

1. **Install or upgrade to MySQL 5.7.12 or
   higher.**

   When the [installation](installing.html "Chapter 2 Installing and Upgrading MySQL") or
   upgrade is done, start the server. For server startup
   instructions, see [Section 2.9.2, “Starting the Server”](starting-server.html "2.9.2 Starting the Server").

   Note

   MySQL Installer enables you to perform this and the next step
   (Install the X Plugin) at the same time for new installations
   on Microsoft Windows. In the Plugin and
   Extensions screen, check mark the Enable
   X Protocol/MySQL as a Document Store check box.
   After the installation, verify that the X Plugin has been
   installed.

2. **Install the X Plugin.** A
   non-root account can be used to install the plugin as long as
   the account has [`INSERT`](privileges-provided.html#priv_insert) privilege
   for the `mysql.plugin` table.

   Always save your existing configuration settings before
   reconfiguring the server.

   To install the built-in X Plugin, do one of the following:

   * Using [MySQL Installer for
     Windows](mysql-installer.html "2.3.3 MySQL Installer for Windows"):

     1. Launch MySQL Installer for Windows. MySQL Installer
        dashboard opens.

     2. Click the Reconfigure quick action
        for MySQL Server. Use Next and
        Back to configure the following
        items:

        + In Accounts and Roles, confirm
          the current `root` account
          password.

        + In Plugin and Extensions, check
          mark the Enable X Protocol/MySQL as a
          Document Store check box. MySQL Installer
          provides a default port number and opens the
          firewall port for network access.

        + In Apply Server Configuration,
          click Execute.

        + Click Finish to close MySQL
          Installer.

     3. [Install
        MySQL Shell](installing-mysql-shell-windows-quick.html "19.2.1.1 Installing MySQL Shell on Microsoft Windows").

   * Using MySQL Shell:

     1. [Install
        MySQL Shell](document-store-shell-install.html "19.2.1 Installing MySQL Shell").

     2. Open a terminal window (command prompt on Windows) and
        navigate to the MySQL binaries location (for example,
        `/usr/bin/` on Linux).

     3. Run the following command:

        ```sql
        mysqlsh -u user -h localhost --classic --dba enableXProtocol
        ```

   * Using the MySQL Client program:

     1. Open a terminal window (command prompt on Windows) and
        navigate to the MySQL binaries location (for example,
        `/usr/bin/` on Linux).

     2. Invoke the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") command-line client:

        ```sql
        mysql -u user -p
        ```

     3. Issue the following statement:

        ```sql
        mysql> INSTALL PLUGIN mysqlx SONAME 'mysqlx.so';
        ```

        Replace `mysqlx.so` with
        `mysqlx.dll` for Windows.

        Important

        The `mysql.session` user must exist
        before you can load X Plugin.
        `mysql.session` was added in MySQL
        version 5.7.19. If your data dictionary was
        initialized using an earlier version you must run the
        [`mysqld_upgrade`](mysql-upgrade.html "4.4.7 mysql_upgrade — Check and Upgrade MySQL Tables") procedure. If the
        upgrade is not run, X Plugin fails to start with the
        error message There was an error when
        trying to access the server with user:
        mysql.session@localhost. Make sure the user is present
        in the server and that mysql_upgrade was ran after a
        server update..

     4. [Install
        MySQL Shell](document-store-shell-install.html "19.2.1 Installing MySQL Shell").

3. **Verify that the X Plugin has been
   installed.**

   When the X Plugin is installed properly, it shows up in the
   list when you query for active plugins on the server with one of
   the following commands:

   * MySQL Shell command:

     ```sql
     mysqlsh -u user --sqlc -e "show plugins"
     ```

   * MySQL Client program command:

     ```sql
     mysql -u user -p -e "show plugins"
     ```

   If you encounter problems with the X Plugin installation, or if
   you want to learn about alternative ways of installing,
   configuring, or uninstalling server plugins, see
   [Section 5.5.1, “Installing and Uninstalling Plugins”](plugin-loading.html "5.5.1 Installing and Uninstalling Plugins").

### `mysqlxsys@localhost` User Account

Installing the X Plugin creates a
`mysqlxsys@localhost` user account. If, for some
reason, creating the user account fails, the X Plugin installation
fails, too. Here is an explanation on what the
`mysqlxsys@localhost` user account is for and what
to do when its creation fails.

The X Plugin installation process uses the MySQL
`root` user to create an internal account for the
`mysqlxsys@localhost` user. The
`mysqlxsys@localhost` account is used by the
X Plugin for authentication of external users against the MySQL
account system and for killing sessions when requested by a
privileged user. The `mysqlxsys@localhost` account
is created as locked, so it cannot be used to log in by external
users. If for some reason the MySQL `root` account
is not available, before you start the X Plugin installation you
must manually create the `mysqlxsys@localhost` user
by issuing the following statements in the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client")
command-line client:

```sql
CREATE USER IF NOT EXISTS mysqlxsys@localhost IDENTIFIED WITH
mysql_native_password AS 'password' ACCOUNT LOCK;
GRANT SELECT ON mysql.user TO mysqlxsys@localhost;
GRANT SUPER ON *.* TO mysqlxsys@localhost;
```

### Uninstalling the X Plugin

If you ever want to uninstall (deactivate) the X Plugin, issue the
following statement in the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") command-line
client:

```sql
UNINSTALL PLUGIN mysqlx;
```

Do not use MySQL Shell to issue the previous statement. It works
from MySQL Shell, but you get an error (code 1130). Also,
uninstalling the plugin removes the mysqlxsys user.


### 19.2.1 Installing MySQL Shell

This section describes how to download, install, and start
MySQL Shell, which is an interactive JavaScript, Python, or SQL
interface supporting development and administration for the MySQL
Server. MySQL Shell is a component that you can install
separately.

#### Requirements

MySQL Shell is available on Microsoft Windows, Linux, and macOS
for 64-bit platforms. MySQL Shell requires that the built-in
X Plugin be active. You can install the server plugin before or
after you install MySQL Shell. For instructions, see
[Installing the
X Plugin](document-store-setting-up.html#installing-xplugin-linux-quick).


#### 19.2.1.1 Installing MySQL Shell on Microsoft Windows

Important

The Community version of MySQL Shell requires the Visual C++
Redistributable for Visual Studio 2013 (available at the
[Microsoft
Download Center](http://www.microsoft.com/en-us/download/default.aspx)) to work; make sure that is installed
on your Windows system before installing MySQL Shell.

Note

MySQL Shell is currently not supplied with an MSI Installer.
See [Installing MySQL Shell Binaries](installing-mysql-shell-windows-quick.html#installing-mysql-shell-binaries "Installing MySQL Shell Binaries") for the
manual install procedure.

To install MySQL Shell on Microsoft Windows using the MSI
Installer, do the following:

1. Download the **Windows (x86, 64-bit),
   MSI Installer** package from
   <http://dev.mysql.com/downloads/shell/>.

2. When prompted, click Run.
3. Follow the steps in the Setup Wizard.

   **Figure 19.1 Installation of MySQL Shell on Windows**

   ![Installation of MySQL Shell on Windows](images/x-installation-mysql-shell-win.png)

If you have installed MySQL without enabling the X Plugin, then
later on decide you want to install the X Plugin, or if you are
installing MySQL *without* using MySQL
Installer, see
[Installing the
X Plugin](document-store-setting-up.html#installing-xplugin-linux-quick).

##### Installing MySQL Shell Binaries

To install MySQL Shell binaries:

1. Unzip the content of the Zip file to the MySQL products
   directory, for example `C:\Program
   Files\MySQL\`.

2. To be able to start MySQL Shell from a command prompt add
   the bin directory `C:\Program
   Files\MySQL\mysql-shell-1.0.8-rc-windows-x86-64bit\bin`
   to the `PATH` system variable.


#### 19.2.1.2 Installing MySQL Shell on Linux

Note

Installation packages for MySQL Shell are available only for
a limited number of Linux distributions, and only for 64-bit
systems.

For supported Linux distributions, the easiest way to install
MySQL Shell on Linux is to use the
[MySQL APT
repository](https://dev.mysql.com/downloads/repo/apt/) or
[MySQL Yum
repository](https://dev.mysql.com/downloads/repo/yum/). For systems not using the MySQL
repositories, MySQL Shell can also be downloaded and installed
directly.

##### Installing MySQL Shell with the MySQL APT Repository

For Linux distributions supported by the
[MySQL APT
repository](https://dev.mysql.com/downloads/repo/apt/), follow one of the paths below:

* If you do not yet have the
  [MySQL APT
  repository](https://dev.mysql.com/downloads/repo/apt/) as a software repository on your
  system, do the following:

  + Follow the steps given in
    [Adding
    the MySQL APT Repository](/doc/mysql-apt-repo-quick-guide/en/#apt-repo-setup), paying special
    attention to the following:

    - During the installation of the configuration
      package, when asked in the dialogue box to
      configure the repository, make sure you choose
      MySQL 5.7 (which is the default option) as the
      release series you want, and enable the
      MySQL Preview Packages
      component.

    - Make sure you do not skip the step for updating
      package information for the MySQL APT repository:

      ```sql
      sudo apt-get update
      ```

  + Install MySQL Shell with this command:

    ```sql
    sudo apt-get install mysql-shell
    ```

* If you already have the
  [MySQL APT
  repository](https://dev.mysql.com/downloads/repo/apt/) as a software repository on your
  system, do the following:

  + Update package information for the MySQL APT
    repository:

    ```sql
    sudo apt-get update
    ```

  + Update the MySQL APT repository configuration package
    with the following command:

    ```sql
    sudo apt-get install mysql-apt-config
    ```

    When asked in the dialogue box to configure the
    repository, make sure you choose MySQL 5.7 (which is
    the default option) as the release series you want,
    and enable the MySQL Preview
    Packages component.

  + Install MySQL Shell with this command:

    ```sql
    sudo apt-get install mysql-shell
    ```

##### Installing MySQL Shell with the MySQL Yum Repository

For Linux distributions supported by the
[MySQL Yum
repository](https://dev.mysql.com/downloads/repo/yum/), follow these steps to install
MySQL Shell:

* Do one of the following:

  + If you already have the
    [MySQL Yum
    repository](https://dev.mysql.com/downloads/repo/yum/) as a software repository on your
    system and the repository was configured with the new
    release package
    `mysql57-community-release`, skip to
    the next step (“Enable the MySQL Tools Preview
    subrepository...”).

  + If you already have the
    [MySQL Yum
    repository](https://dev.mysql.com/downloads/repo/yum/) as a software repository on your
    system but have configured the repository with the old
    release package
    `mysql-community-release`, it is
    easiest to install MySQL Shell by first reconfiguring
    the MySQL Yum repository with the new
    `mysql57-community-release` package.
    To do so, you need to remove your old release package
    first, with the following command :

    ```sql
    sudo yum remove mysql-community-release
    ```

    For dnf-enabled systems, do this instead:

    ```sql
    sudo dnf erase mysql-community-release
    ```

    Then, follow the steps given in
    [Adding
    the MySQL Yum Repository](/doc/mysql-yum-repo-quick-guide/en/#repo-qg-yum-repo-setup) to install the new
    release package,
    `mysql57-community-release`.

  + If you do not yet have the
    [MySQL Yum
    repository](https://dev.mysql.com/downloads/repo/yum/) as a software repository on your
    system, follow the steps given in
    [Adding
    the MySQL Yum Repository](/doc/mysql-yum-repo-quick-guide/en/#repo-qg-yum-repo-setup).

* Enable the MySQL Tools Preview subrepository. You can do
  that by editing manually the
  `/etc/yum.repos.d/mysql-community.repo`
  file. This is an example of the subrepository's default
  entry in the file (the `baseurl` entry in
  your file might look different, depending on your Linux
  distribution):

  ```sql
  [mysql-tools-preview]
  name=MySQL Tools Preview
  baseurl=http://repo.mysql.com/yum/mysql-tools-preview/el/6/$basearch/
  enabled=0
  gpgcheck=1
  gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql
  ```

  Change the entry `enabled=0` to
  `enabled=1` to enable the subrepository.

* Install MySQL Shell with this command:

  ```sql
  sudo yum install mysql-shell
  ```

  For dnf-enabled systems, do this instead:

  ```sql
  sudo dnf install mysql-shell
  ```

##### Installing MySQL Shell from Direct Downloads from the MySQL Developer Zone

RPM, Debian, and source packages for installing MySQL Shell
are also available for download at
[Download MySQL
Shell](https://dev.mysql.com/downloads/shell/).


#### 19.2.1.3 Installing MySQL Shell on macOS

To install MySQL Shell on macOS, do the following:

1. Download the package from
   <http://dev.mysql.com/downloads/shell/>.

2. Double-click the downloaded DMG to mount it. Finder opens.
3. Double-click the `.pkg` file shown in the
   Finder window.

4. Follow the steps in the installation wizard.

   **Figure 19.2 Installation of MySQL Shell on macOS**

   ![Installation of MySQL Shell on macOS](images/x-installation-mysql-shell-macos-1.png)

5. When the installer finishes, eject the DMG. (It can be
   deleted.)


### 19.2.2 Starting MySQL Shell

You need an account name and password to establish a session using
MySQL Shell. Replace *`user`* with your
account name.

On the same system where the server instance is running, open a
terminal window (command prompt on Windows) and start MySQL Shell
with the following command:

```sql
mysqlsh --uri user@localhost
```

You are prompted to input your password and then this establishes
an X Session.

For instructions to get you started using MySQL as a document
store, see the following quick-start guides:

* [Quick-Start
  Guide: MySQL Shell for JavaScript](/doc/refman/8.0/en/mysql-shell-tutorial-javascript.html)

* [Quick-Start
  Guide: MySQL Shell for Python](/doc/refman/8.0/en/mysql-shell-tutorial-python.html)
