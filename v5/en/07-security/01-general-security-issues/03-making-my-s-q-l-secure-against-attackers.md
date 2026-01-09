### 6.1.3 Making MySQL Secure Against Attackers

When you connect to a MySQL server, you should use a password. The password is not transmitted as cleartext over the connection. Password handling during the client connection sequence was upgraded in MySQL 4.1.1 to be very secure. If you are still using pre-4.1.1-style passwords, the encryption algorithm is not as strong as the newer algorithm. With some effort, a clever attacker who can sniff the traffic between the client and the server can crack the password. (See [Section 6.1.2.4, “Password Hashing in MySQL”](password-hashing.html "6.1.2.4 Password Hashing in MySQL"), for a discussion of the different password handling methods.)

All other information is transferred as text, and can be read by anyone who is able to watch the connection. If the connection between the client and the server goes through an untrusted network, and you are concerned about this, you can use the compressed protocol to make traffic much more difficult to decipher. You can also use MySQL's internal SSL support to make the connection even more secure. See [Section 6.3, “Using Encrypted Connections”](encrypted-connections.html "6.3 Using Encrypted Connections"). Alternatively, use SSH to get an encrypted TCP/IP connection between a MySQL server and a MySQL client. You can find an Open Source SSH client at <http://www.openssh.org/>, and a comparison of both Open Source and Commercial SSH clients at <http://en.wikipedia.org/wiki/Comparison_of_SSH_clients>.

To make a MySQL system secure, you should strongly consider the following suggestions:

* Require all MySQL accounts to have a password. A client program does not necessarily know the identity of the person running it. It is common for client/server applications that the user can specify any user name to the client program. For example, anyone can use the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") program to connect as any other person simply by invoking it as `mysql -u other_user db_name` if *`other_user`* has no password. If all accounts have a password, connecting using another user's account becomes much more difficult.

  For a discussion of methods for setting passwords, see [Section 6.2.10, “Assigning Account Passwords”](assigning-passwords.html "6.2.10 Assigning Account Passwords").

* Make sure that the only Unix user account with read or write privileges in the database directories is the account that is used for running [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server").

* Never run the MySQL server as the Unix `root` user. This is extremely dangerous, because any user with the [`FILE`](privileges-provided.html#priv_file) privilege is able to cause the server to create files as `root` (for example, `~root/.bashrc`). To prevent this, [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") refuses to run as `root` unless that is specified explicitly using the [`--user=root`](server-options.html#option_mysqld_user) option.

  [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") can (and should) be run as an ordinary, unprivileged user instead. You can create a separate Unix account named `mysql` to make everything even more secure. Use this account only for administering MySQL. To start [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") as a different Unix user, add a `user` option that specifies the user name in the `[mysqld]` group of the `my.cnf` option file where you specify server options. For example:

  ```sql
  [mysqld]
  user=mysql
  ```

  This causes the server to start as the designated user whether you start it manually or by using [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") or [**mysql.server**](mysql-server.html "4.3.3 mysql.server — MySQL Server Startup Script"). For more details, see [Section 6.1.5, “How to Run MySQL as a Normal User”](changing-mysql-user.html "6.1.5 How to Run MySQL as a Normal User").

  Running [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") as a Unix user other than `root` does not mean that you need to change the `root` user name in the `user` table. *User names for MySQL accounts have nothing to do with user names for Unix accounts*.

* Do not grant the [`FILE`](privileges-provided.html#priv_file) privilege to nonadministrative users. Any user that has this privilege can write a file anywhere in the file system with the privileges of the [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") daemon. This includes the server's data directory containing the files that implement the privilege tables. To make [`FILE`](privileges-provided.html#priv_file)-privilege operations a bit safer, files generated with [`SELECT ... INTO OUTFILE`](select-into.html "13.2.9.1 SELECT ... INTO Statement") do not overwrite existing files and are writable by everyone.

  The [`FILE`](privileges-provided.html#priv_file) privilege may also be used to read any file that is world-readable or accessible to the Unix user that the server runs as. With this privilege, you can read any file into a database table. This could be abused, for example, by using [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") to load `/etc/passwd` into a table, which then can be displayed with [`SELECT`](select.html "13.2.9 SELECT Statement").

  To limit the location in which files can be read and written, set the [`secure_file_priv`](server-system-variables.html#sysvar_secure_file_priv) system to a specific directory. See [Section 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables").

* Do not grant the [`PROCESS`](privileges-provided.html#priv_process) or [`SUPER`](privileges-provided.html#priv_super) privilege to nonadministrative users. The output of [**mysqladmin processlist**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") and [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement") shows the text of any statements currently being executed, so any user who is permitted to see the server process list might be able to see statements issued by other users such as `UPDATE user SET password=PASSWORD('not_secure')`.

  [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") reserves an extra connection for users who have the [`SUPER`](privileges-provided.html#priv_super) privilege, so that a MySQL `root` user can log in and check server activity even if all normal connections are in use.

  The [`SUPER`](privileges-provided.html#priv_super) privilege can be used to terminate client connections, change server operation by changing the value of system variables, and control replication servers.

* Do not permit the use of symlinks to tables. (This capability can be disabled with the [`--skip-symbolic-links`](server-options.html#option_mysqld_symbolic-links) option.) This is especially important if you run [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") as `root`, because anyone that has write access to the server's data directory then could delete any file in the system! See [Section 8.12.3.2, “Using Symbolic Links for MyISAM Tables on Unix”](symbolic-links-to-tables.html "8.12.3.2 Using Symbolic Links for MyISAM Tables on Unix").

* Stored programs and views should be written using the security guidelines discussed in [Section 23.6, “Stored Object Access Control”](stored-objects-security.html "23.6 Stored Object Access Control").

* If you do not trust your DNS, you should use IP addresses rather than host names in the grant tables. In any case, you should be very careful about creating grant table entries using host name values that contain wildcards.

* If you want to restrict the number of connections permitted to a single account, you can do so by setting the [`max_user_connections`](server-system-variables.html#sysvar_max_user_connections) variable in [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"). The [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") and [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") statements also support resource control options for limiting the extent of server use permitted to an account. See [Section 13.7.1.2, “CREATE USER Statement”](create-user.html "13.7.1.2 CREATE USER Statement"), and [Section 13.7.1.1, “ALTER USER Statement”](alter-user.html "13.7.1.1 ALTER USER Statement").

* If the plugin directory is writable by the server, it may be possible for a user to write executable code to a file in the directory using [`SELECT ... INTO DUMPFILE`](select.html "13.2.9 SELECT Statement"). This can be prevented by making [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir) read only to the server or by setting [`secure_file_priv`](server-system-variables.html#sysvar_secure_file_priv) to a directory where [`SELECT`](select.html "13.2.9 SELECT Statement") writes can be made safely.
