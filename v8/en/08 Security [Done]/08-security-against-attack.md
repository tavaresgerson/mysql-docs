### 8.1.3 Making MySQL Secure Against Attackers

When you connect to a MySQL server, you should use a password. The password is not transmitted as cleartext over the connection.

All other information is transferred as text, and can be read by anyone who is able to watch the connection. If the connection between the client and the server goes through an untrusted network, and you are concerned about this, you can use the compressed protocol to make traffic much more difficult to decipher. You can also use MySQL's internal SSL support to make the connection even more secure. See Section 8.3, “Using Encrypted Connections”. Alternatively, use SSH to get an encrypted TCP/IP connection between a MySQL server and a MySQL client. You can find an Open Source SSH client at <http://www.openssh.org/>, and a comparison of both Open Source and Commercial SSH clients at <http://en.wikipedia.org/wiki/Comparison_of_SSH_clients>.

To make a MySQL system secure, you should strongly consider the following suggestions:

* Require all MySQL accounts to have a password. A client program does not necessarily know the identity of the person running it. It is common for client/server applications that the user can specify any user name to the client program. For example, anyone can use the  **mysql** program to connect as any other person simply by invoking it as `mysql -u other_user db_name` if *`other_user`* has no password. If all accounts have a password, connecting using another user's account becomes much more difficult.

  For a discussion of methods for setting passwords, see Section 8.2.14, “Assigning Account Passwords”.
* Make sure that the only Unix user account with read or write privileges in the database directories is the account that is used for running  **mysqld**.
* Never run the MySQL server as the Unix `root` user. This is extremely dangerous, because any user with the `FILE` privilege is able to cause the server to create files as `root` (for example, `~root/.bashrc`). To prevent this, **mysqld** refuses to run as `root` unless that is specified explicitly using the  `--user=root` option.

   **mysqld** can (and should) be run as an ordinary, unprivileged user instead. You can create a separate Unix account named `mysql` to make everything even more secure. Use this account only for administering MySQL. To start  **mysqld** as a different Unix user, add a `user` option that specifies the user name in the `[mysqld]` group of the `my.cnf` option file where you specify server options. For example:

  ```
  [mysqld]
  user=mysql
  ```

  This causes the server to start as the designated user whether you start it manually or by using **mysqld\_safe** or **mysql.server**. For more details, see Section 8.1.5, “How to Run MySQL as a Normal User”.

  Running  **mysqld** as a Unix user other than `root` does not mean that you need to change the `root` user name in the `user` table. *User names for MySQL accounts have nothing to do with user names for Unix accounts*.
* Do not grant the  `FILE` privilege to nonadministrative users. Any user that has this privilege can write a file anywhere in the file system with the privileges of the  **mysqld** daemon. This includes the server's data directory containing the files that implement the privilege tables. To make `FILE`-privilege operations a bit safer, files generated with `SELECT ... INTO OUTFILE` do not overwrite existing files and are writable by everyone.

  The  `FILE` privilege may also be used to read any file that is world-readable or accessible to the Unix user that the server runs as. With this privilege, you can read any file into a database table. This could be abused, for example, by using `LOAD DATA` to load `/etc/passwd` into a table, which then can be displayed with `SELECT`.

  To limit the location in which files can be read and written, set the  `secure_file_priv` system to a specific directory. See Section 7.1.8, “Server System Variables”.
* Encrypt binary log files and relay log files. Encryption helps to protect these files and the potentially sensitive data contained in them from being misused by outside attackers, and also from unauthorized viewing by users of the operating system where they are stored. You enable encryption on a MySQL server by setting the `binlog_encryption` system variable to `ON`. For more information, see Section 19.3.2, “Encrypting Binary Log Files and Relay Log Files”.
* Do not grant the  `PROCESS` or `SUPER` privilege to nonadministrative users. The output of **mysqladmin processlist** and `SHOW PROCESSLIST` shows the text of any statements currently being executed, so any user who is permitted to see the server process list might be able to see statements issued by other users.

   **mysqld** reserves an extra connection for users who have the `CONNECTION_ADMIN` or `SUPER` privilege, so that a MySQL `root` user can log in and check server activity even if all normal connections are in use.

  The  `SUPER` privilege can be used to terminate client connections, change server operation by changing the value of system variables, and control replication servers.
* Do not permit the use of symlinks to tables. (This capability can be disabled with the `--skip-symbolic-links` option.) This is especially important if you run **mysqld** as `root`, because anyone that has write access to the server's data directory then could delete any file in the system! See Section 10.12.2.2, “Using Symbolic Links for MyISAM Tables on Unix”.
* Stored programs and views should be written using the security guidelines discussed in Section 27.6, “Stored Object Access Control”.
* If you do not trust your DNS, you should use IP addresses rather than host names in the grant tables. In any case, you should be very careful about creating grant table entries using host name values that contain wildcards.
* If you want to restrict the number of connections permitted to a single account, you can do so by setting the `max_user_connections` variable in  **mysqld**. The `CREATE USER` and  `ALTER USER` statements also support resource control options for limiting the extent of server use permitted to an account. See Section 15.7.1.3, “CREATE USER Statement”, and Section 15.7.1.1, “ALTER USER Statement”.
* If the plugin directory is writable by the server, it may be possible for a user to write executable code to a file in the directory using `SELECT ... INTO DUMPFILE`. This can be prevented by making `plugin_dir` read only to the server or by setting `secure_file_priv` to a directory where  `SELECT` writes can be made safely.
