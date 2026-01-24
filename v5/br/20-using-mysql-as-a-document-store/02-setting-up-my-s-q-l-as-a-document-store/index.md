## 19.2 Setting Up MySQL as a Document Store

19.2.1 Installing MySQL Shell

19.2.2 Starting MySQL Shell

To use MySQL 5.7 as a document store, the X Plugin needs to be installed. Then you can use X Protocol to communicate with the server. Without the X Plugin running, X Protocol clients cannot connect to the server. The X Plugin is supplied with MySQL (5.7.12 or higher) — installing it does not involve a separate download. This section describes how to install X Plugin.

Follow the steps outlined here:

1. **Install or upgrade to MySQL 5.7.12 or higher.**

   When the installation or upgrade is done, start the server. For server startup instructions, see Section 2.9.2, “Starting the Server”.

   Note

   MySQL Installer enables you to perform this and the next step (Install the X Plugin) at the same time for new installations on Microsoft Windows. In the Plugin and Extensions screen, check mark the Enable X Protocol/MySQL as a Document Store check box. After the installation, verify that the X Plugin has been installed.

2. **Install the X Plugin.** A non-root account can be used to install the plugin as long as the account has `INSERT` privilege for the `mysql.plugin` table.

   Always save your existing configuration settings before reconfiguring the server.

   To install the built-in X Plugin, do one of the following:

   * Using MySQL Installer for Windows:

     1. Launch MySQL Installer for Windows. MySQL Installer dashboard opens.

     2. Click the Reconfigure quick action for MySQL Server. Use Next and Back to configure the following items:

        + In Accounts and Roles, confirm the current `root` account password.

        + In Plugin and Extensions, check mark the Enable X Protocol/MySQL as a Document Store check box. MySQL Installer provides a default port number and opens the firewall port for network access.

        + In Apply Server Configuration, click Execute.

        + Click Finish to close MySQL Installer.

     3. Install MySQL Shell.

   * Using MySQL Shell:

     1. Install MySQL Shell.

     2. Open a terminal window (command prompt on Windows) and navigate to the MySQL binaries location (for example, `/usr/bin/` on Linux).

     3. Run the following command:

        ```sql
        mysqlsh -u user -h localhost --classic --dba enableXProtocol
        ```

   * Using the MySQL Client program:

     1. Open a terminal window (command prompt on Windows) and navigate to the MySQL binaries location (for example, `/usr/bin/` on Linux).

     2. Invoke the **mysql** command-line client:

        ```sql
        mysql -u user -p
        ```

     3. Issue the following statement:

        ```sql
        mysql> INSTALL PLUGIN mysqlx SONAME 'mysqlx.so';
        ```

        Replace `mysqlx.so` with `mysqlx.dll` for Windows.

        Important

        The `mysql.session` user must exist before you can load X Plugin. `mysql.session` was added in MySQL version 5.7.19. If your data dictionary was initialized using an earlier version you must run the **mysql_upgrade** procedure. If the upgrade is not run, X Plugin fails to start with the error message There was an error when trying to access the server with user: mysql.session@localhost. Make sure the user is present in the server and that mysql_upgrade was ran after a server update..

     4. Install MySQL Shell.

3. **Verify that the X Plugin has been installed.**

   When the X Plugin is installed properly, it shows up in the list when you query for active plugins on the server with one of the following commands:

   * MySQL Shell command:

     ```sql
     mysqlsh -u user --sqlc -e "show plugins"
     ```

   * MySQL Client program command:

     ```sql
     mysql -u user -p -e "show plugins"
     ```

   If you encounter problems with the X Plugin installation, or if you want to learn about alternative ways of installing, configuring, or uninstalling server plugins, see Section 5.5.1, “Installing and Uninstalling Plugins”.

### `mysqlxsys@localhost` User Account

Installing the X Plugin creates a `mysqlxsys@localhost` user account. If, for some reason, creating the user account fails, the X Plugin installation fails, too. Here is an explanation on what the `mysqlxsys@localhost` user account is for and what to do when its creation fails.

The X Plugin installation process uses the MySQL `root` user to create an internal account for the `mysqlxsys@localhost` user. The `mysqlxsys@localhost` account is used by the X Plugin for authentication of external users against the MySQL account system and for killing sessions when requested by a privileged user. The `mysqlxsys@localhost` account is created as locked, so it cannot be used to log in by external users. If for some reason the MySQL `root` account is not available, before you start the X Plugin installation you must manually create the `mysqlxsys@localhost` user by issuing the following statements in the **mysql** command-line client:

```sql
CREATE USER IF NOT EXISTS mysqlxsys@localhost IDENTIFIED WITH
mysql_native_password AS 'password' ACCOUNT LOCK;
GRANT SELECT ON mysql.user TO mysqlxsys@localhost;
GRANT SUPER ON *.* TO mysqlxsys@localhost;
```

### Uninstalling the X Plugin

If you ever want to uninstall (deactivate) the X Plugin, issue the following statement in the **mysql** command-line client:

```sql
UNINSTALL PLUGIN mysqlx;
```

Do not use MySQL Shell to issue the previous statement. It works from MySQL Shell, but you get an error (code 1130). Also, uninstalling the plugin removes the mysqlxsys user.
