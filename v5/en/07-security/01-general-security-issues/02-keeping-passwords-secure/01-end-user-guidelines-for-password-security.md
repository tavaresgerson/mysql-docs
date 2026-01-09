#### 6.1.2.1 End-User Guidelines for Password Security

MySQL users should use the following guidelines to keep passwords secure.

When you run a client program to connect to the MySQL server, it is inadvisable to specify your password in a way that exposes it to discovery by other users. The methods you can use to specify your password when you run client programs are listed here, along with an assessment of the risks of each method. In short, the safest methods are to have the client program prompt for the password or to specify the password in a properly protected option file.

* Use the [**mysql_config_editor**](mysql-config-editor.html "4.6.6 mysql_config_editor — MySQL Configuration Utility") utility, which enables you to store authentication credentials in an encrypted login path file named `.mylogin.cnf`. The file can be read later by MySQL client programs to obtain authentication credentials for connecting to MySQL Server. See [Section 4.6.6, “mysql_config_editor — MySQL Configuration Utility”](mysql-config-editor.html "4.6.6 mysql_config_editor — MySQL Configuration Utility").

* Use a `--password=password` or `-ppassword` option on the command line. For example:

  ```sql
  $> mysql -u francis -pfrank db_name
  ```

  Warning

  This is convenient *but insecure*. On some systems, your password becomes visible to system status programs such as **ps** that may be invoked by other users to display command lines. MySQL clients typically overwrite the command-line password argument with zeros during their initialization sequence. However, there is still a brief interval during which the value is visible. Also, on some systems this overwriting strategy is ineffective and the password remains visible to **ps**. (SystemV Unix systems and perhaps others are subject to this problem.)

  If your operating environment is set up to display your current command in the title bar of your terminal window, the password remains visible as long as the command is running, even if the command has scrolled out of view in the window content area.

* Use the [`--password`](connection-options.html#option_general_password) or `-p` option on the command line with no password value specified. In this case, the client program solicits the password interactively:

  ```sql
  $> mysql -u francis -p db_name
  Enter password: ********
  ```

  The `*` characters indicate where you enter your password. The password is not displayed as you enter it.

  It is more secure to enter your password this way than to specify it on the command line because it is not visible to other users. However, this method of entering a password is suitable only for programs that you run interactively. If you want to invoke a client from a script that runs noninteractively, there is no opportunity to enter the password from the keyboard. On some systems, you may even find that the first line of your script is read and interpreted (incorrectly) as your password.

* Store your password in an option file. For example, on Unix, you can list your password in the `[client]` section of the `.my.cnf` file in your home directory:

  ```sql
  [client]
  password=password
  ```

  To keep the password safe, the file should not be accessible to anyone but yourself. To ensure this, set the file access mode to `400` or `600`. For example:

  ```sql
  $> chmod 600 .my.cnf
  ```

  To name from the command line a specific option file containing the password, use the [`--defaults-file=file_name`](option-file-options.html#option_general_defaults-file) option, where `file_name` is the full path name to the file. For example:

  ```sql
  $> mysql --defaults-file=/home/francis/mysql-opts
  ```

  [Section 4.2.2.2, “Using Option Files”](option-files.html "4.2.2.2 Using Option Files"), discusses option files in more detail.

* Store your password in the `MYSQL_PWD` environment variable. See [Section 4.9, “Environment Variables”](environment-variables.html "4.9 Environment Variables").

  This method of specifying your MySQL password must be considered *extremely insecure* and should not be used. Some versions of **ps** include an option to display the environment of running processes. On some systems, if you set `MYSQL_PWD`, your password is exposed to any other user who runs **ps**. Even on systems without such a version of **ps**, it is unwise to assume that there are no other methods by which users can examine process environments.

On Unix, the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client writes a record of executed statements to a history file (see [Section 4.5.1.3, “mysql Client Logging”](mysql-logging.html "4.5.1.3 mysql Client Logging")). By default, this file is named `.mysql_history` and is created in your home directory. Passwords can be written as plain text in SQL statements such as [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") and [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement"), so if you use these statements, they are logged in the history file. To keep this file safe, use a restrictive access mode, the same way as described earlier for the `.my.cnf` file.

If your command interpreter is configured to maintain a history, any file in which the commands are saved contains MySQL passwords entered on the command line. For example, **bash** uses `~/.bash_history`. Any such file should have a restrictive access mode.
