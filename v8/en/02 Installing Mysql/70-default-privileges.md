### 2.9.4 Securing the Initial MySQL Account

The MySQL installation process involves initializing the data directory, including the grant tables in the `mysql` system schema that define MySQL accounts. For details, see  Section 2.9.1, “Initializing the Data Directory”.

This section describes how to assign a password to the initial `root` account created during the MySQL installation procedure, if you have not already done so.

::: info Note

Alternative means for performing the process described in this section:

* On Windows, you can perform the process during installation with MySQL Configurator (see  Section 2.3.2, “Configuration: Using MySQL Configurator”).
* On all platforms, the MySQL distribution includes **mysql\_secure\_installation**, a command-line utility that automates much of the process of securing a MySQL installation.
* On all platforms, MySQL Workbench is available and offers the ability to manage user accounts (see Chapter 33, *MySQL Workbench* ).

:::

A password may already be assigned to the initial account under these circumstances:

* On Windows, installations performed using the MSI installer and MySQL Configurator give you the option of assigning a password.
* Installation using the macOS installer generates an initial random password, which the installer displays to the user in a dialog box.
* Installation using RPM packages generates an initial random password, which is written to the server error log.
* Installations using Debian packages give you the option of assigning a password.
* For data directory initialization performed manually using **mysqld --initialize**, `mysqld` generates an initial random password, marks it expired, and writes it to the server error log. See  Section 2.9.1, “Initializing the Data Directory”.

The `mysql.user` grant table defines the initial MySQL user account and its access privileges. Installation of MySQL creates only a `'root'@'localhost'` superuser account that has all privileges and can do anything. If the `root` account has an empty password, your MySQL installation is unprotected: Anyone can connect to the MySQL server as `root` *without a password* and be granted all privileges.

The `'root'@'localhost'` account also has a row in the `mysql.proxies_priv` table that enables granting the  `PROXY` privilege for `''@''`, that is, for all users and all hosts. This enables `root` to set up proxy users, as well as to delegate to other accounts the authority to set up proxy users. See  Section 8.2.19, “Proxy Users”.

To assign a password for the initial MySQL `root` account, use the following procedure. Replace *`root-password`* in the examples with the password that you want to use.

Start the server if it is not running. For instructions, see Section 2.9.2, “Starting the Server”.

The initial `root` account may or may not have a password. Choose whichever of the following procedures applies:

* If the `root` account exists with an initial random password that has been expired, connect to the server as `root` using that password, then choose a new password. This is the case if the data directory was initialized using  **mysqld --initialize**, either manually or using an installer that does not give you the option of specifying a password during the install operation. Because the password exists, you must use it to connect to the server. But because the password is expired, you cannot use the account for any purpose other than to choose a new password, until you do choose one.

  1. If you do not know the initial random password, look in the server error log.
  2. Connect to the server as `root` using the password:

     ```
     $> mysql -u root -p
     Enter password: (enter the random root password here)
     ```
  3. Choose a new password to replace the random password:

     ```
     mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'root-password';
     ```
* If the `root` account exists but has no password, connect to the server as `root` using no password, then assign a password. This is the case if you initialized the data directory using [**mysqld --initialize-insecure**](mysqld.html "6.3.1 mysqld — The MySQL Server").

  1. Connect to the server as `root` using no password:

     ```
     $> mysql -u root --skip-password
     ```
  2. Assign a password:

     ```
     mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'root-password';
     ```

After assigning the `root` account a password, you must supply that password whenever you connect to the server using the account. For example, to connect to the server using the `mysql` client, use this command:

```
$> mysql -u root -p
Enter password: (enter root password here)
```

To shut down the server with  `mysqladmin`, use this command:

```
$> mysqladmin -u root -p shutdown
Enter password: (enter root password here)
```

::: info Note

For additional information about setting passwords, see Section 8.2.14, “Assigning Account Passwords”. If you forget your `root` password after setting it, see Section B.3.3.2, “How to Reset the Root Password”.

To set up additional accounts, see Section 8.2.8, “Adding Accounts, Assigning Privileges, and Dropping Accounts”.

:::
