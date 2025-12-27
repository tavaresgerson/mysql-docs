#### B.3.3.2 How to Reset the Root Password

If you have never assigned a `root` password for MySQL, the server does not require a password at all for connecting as `root`. However, this is insecure. For instructions on assigning a password, see [Section 2.9.4, “Securing the Initial MySQL Account”](default-privileges.html "2.9.4 Securing the Initial MySQL Account").

If you know the `root` password and want to change it, see [Section 13.7.1.1, “ALTER USER Statement”](alter-user.html "13.7.1.1 ALTER USER Statement"), and [Section 13.7.1.7, “SET PASSWORD Statement”](set-password.html "13.7.1.7 SET PASSWORD Statement").

If you assigned a `root` password previously but have forgotten it, you can assign a new password. The following sections provide instructions for Windows and Unix and Unix-like systems, as well as generic instructions that apply to any system.

##### B.3.3.2.1 Resetting the Root Password: Windows Systems

On Windows, use the following procedure to reset the password for the MySQL `'root'@'localhost'` account. To change the password for a `root` account with a different host name part, modify the instructions to use that host name.

1. Log on to your system as Administrator.
2. Stop the MySQL server if it is running. For a server that is running as a Windows service, go to the Services manager: From the Start menu, select Control Panel, then Administrative Tools, then Services. Find the MySQL service in the list and stop it.

   If your server is not running as a service, you may need to use the Task Manager to force it to stop.

3. Create a text file containing the password-assignment statement on a single line. Replace the password with the password that you want to use.

   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'MyNewPass';
   ```

4. Save the file. This example assumes that you name the file `C:\mysql-init.txt`.

5. Open a console window to get to the command prompt: From the Start menu, select Run, then enter **cmd** as the command to be run.

6. Start the MySQL server with the [`init_file`](server-system-variables.html#sysvar_init_file) system variable set to name the file (notice that the backslash in the option value is doubled):

   ```sql
   C:\> cd "C:\Program Files\MySQL\MySQL Server 5.7\bin"
   C:\> mysqld --init-file=C:\\mysql-init.txt
   ```

   If you installed MySQL to a different location, adjust the **cd** command accordingly.

   The server executes the contents of the file named by the [`init_file`](server-system-variables.html#sysvar_init_file) system variable at startup, changing the `'root'@'localhost'` account password.

   To have server output to appear in the console window rather than in a log file, add the [`--console`](server-options.html#option_mysqld_console) option to the [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") command.

   If you installed MySQL using the MySQL Installation Wizard, you may need to specify a [`--defaults-file`](option-file-options.html#option_general_defaults-file) option. For example:

   ```sql
   C:\> mysqld
            --defaults-file="C:\\ProgramData\\MySQL\\MySQL Server 5.7\\my.ini"
            --init-file=C:\\mysql-init.txt
   ```

   The appropriate [`--defaults-file`](option-file-options.html#option_general_defaults-file) setting can be found using the Services Manager: From the Start menu, select Control Panel, then Administrative Tools, then Services. Find the MySQL service in the list, right-click it, and choose the `Properties` option. The `Path to executable` field contains the [`--defaults-file`](option-file-options.html#option_general_defaults-file) setting.

7. After the server has started successfully, delete `C:\mysql-init.txt`.

You should now be able to connect to the MySQL server as `root` using the new password. Stop the MySQL server and restart it normally. If you run the server as a service, start it from the Windows Services window. If you start the server manually, use whatever command you normally use.

If the [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") statement fails to reset the password, try repeating the procedure using the following statements to modify the `user` table directly:

```sql
UPDATE mysql.user
    SET authentication_string = PASSWORD('MyNewPass'), password_expired = 'N'
    WHERE User = 'root' AND Host = 'localhost';
FLUSH PRIVILEGES;
```

##### B.3.3.2.2 Resetting the Root Password: Unix and Unix-Like Systems

On Unix, use the following procedure to reset the password for the MySQL `'root'@'localhost'` account. To change the password for a `root` account with a different host name part, modify the instructions to use that host name.

The instructions assume that you start the MySQL server from the Unix login account that you normally use for running it. For example, if you run the server using the `mysql` login account, you should log in as `mysql` before using the instructions. Alternatively, you can log in as `root`, but in this case you *must* start [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") with the [`--user=mysql`](server-options.html#option_mysqld_user) option. If you start the server as `root` without using [`--user=mysql`](server-options.html#option_mysqld_user), the server may create `root`-owned files in the data directory, such as log files, and these may cause permission-related problems for future server startups. If that happens, you must either change the ownership of the files to `mysql` or remove them.

1. Log on to your system as the Unix user that the MySQL server runs as (for example, `mysql`).

2. Stop the MySQL server if it is running. Locate the `.pid` file that contains the server's process ID. The exact location and name of this file depend on your distribution, host name, and configuration. Common locations are `/var/lib/mysql/`, `/var/run/mysqld/`, and `/usr/local/mysql/data/`. Generally, the file name has an extension of `.pid` and begins with either `mysqld` or your system's host name.

   Stop the MySQL server by sending a normal `kill` (not `kill -9`) to the [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") process. Use the actual path name of the `.pid` file in the following command:

   ```sql
   $> kill `cat /mysql-data-directory/host_name.pid`
   ```

   Use backticks (not forward quotation marks) with the `cat` command. These cause the output of `cat` to be substituted into the `kill` command.

3. Create a text file containing the password-assignment statement on a single line. Replace the password with the password that you want to use.

   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'MyNewPass';
   ```

4. Save the file. This example assumes that you name the file `/home/me/mysql-init`. The file contains the password, so do not save it where it can be read by other users. If you are not logged in as `mysql` (the user the server runs as), make sure that the file has permissions that permit `mysql` to read it.

5. Start the MySQL server with the [`init_file`](server-system-variables.html#sysvar_init_file) system variable set to name the file:

   ```sql
   $> mysqld --init-file=/home/me/mysql-init &
   ```

   The server executes the contents of the file named by the [`init_file`](server-system-variables.html#sysvar_init_file) system variable at startup, changing the `'root'@'localhost'` account password.

   Other options may be necessary as well, depending on how you normally start your server. For example, [`--defaults-file`](option-file-options.html#option_general_defaults-file) may be needed before the [`init_file`](server-system-variables.html#sysvar_init_file) argument.

6. After the server has started successfully, delete `/home/me/mysql-init`.

You should now be able to connect to the MySQL server as `root` using the new password. Stop the server and restart it normally.

If the [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") statement fails to reset the password, try repeating the procedure using the following statements to modify the `user` table directly:

```sql
UPDATE mysql.user
    SET authentication_string = PASSWORD('MyNewPass'), password_expired = 'N'
    WHERE User = 'root' AND Host = 'localhost';
FLUSH PRIVILEGES;
```

##### B.3.3.2.3 Resetting the Root Password: Generic Instructions

The preceding sections provide password-resetting instructions specifically for Windows and Unix and Unix-like systems. Alternatively, on any platform, you can reset the password using the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client (but this approach is less secure):

1. Stop the MySQL server if necessary, then restart it with the [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables) option. This enables anyone to connect without a password and with all privileges, and disables account-management statements such as [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") and [`SET PASSWORD`](set-password.html "13.7.1.7 SET PASSWORD Statement"). Because this is insecure, you might want to use [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables) in conjunction with enabling the [`skip_networking`](server-system-variables.html#sysvar_skip_networking) system variable to prevent remote clients from connecting. On Windows platforms, if you enable `skip_networking`, you must also enable [`shared_memory`](server-system-variables.html#sysvar_shared_memory) or [`named_pipe`](server-system-variables.html#sysvar_named_pipe); otherwise the server cannot start.

2. Connect to the MySQL server using the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client; no password is necessary because the server was started with [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables):

   ```sql
   $> mysql
   ```

3. In the `mysql` client, tell the server to reload the grant tables so that account-management statements work:

   ```sql
   mysql> FLUSH PRIVILEGES;
   ```

   Then change the `'root'@'localhost'` account password. Replace the password with the password that you want to use. To change the password for a `root` account with a different host name part, modify the instructions to use that host name.

   ```sql
   mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'MyNewPass';
   ```

You should now be able to connect to the MySQL server as `root` using the new password. Stop the server and restart it normally (without the [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables) option and without enabling the [`skip_networking`](server-system-variables.html#sysvar_skip_networking) system variable).

If the [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") statement fails to reset the password, try repeating the procedure using the following statements to modify the `user` table directly:

```sql
UPDATE mysql.user SET authentication_string = PASSWORD('MyNewPass')
WHERE User = 'root' AND Host = 'localhost';
FLUSH PRIVILEGES;
```
