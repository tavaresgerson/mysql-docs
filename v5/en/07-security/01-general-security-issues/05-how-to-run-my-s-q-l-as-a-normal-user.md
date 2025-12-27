### 6.1.5 How to Run MySQL as a Normal User

On Windows, you can run the server as a Windows service using a normal user account.

On Linux, for installations performed using a MySQL repository, RPM packages, or Debian packages, the MySQL server [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") should be started by the local `mysql` operating system user. Starting by another operating system user is not supported by the init scripts that are included as part of the installation.

On Unix (or Linux for installations performed using `tar` or `tar.gz` packages) , the MySQL server [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") can be started and run by any user. However, you should avoid running the server as the Unix `root` user for security reasons. To change [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") to run as a normal unprivileged Unix user *`user_name`*, you must do the following:

1. Stop the server if it is running (use [**mysqladmin shutdown**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program")).

2. Change the database directories and files so that *`user_name`* has privileges to read and write files in them (you might need to do this as the Unix `root` user):

   ```sql
   $> chown -R user_name /path/to/mysql/datadir
   ```

   If you do not do this, the server is unable to access databases or tables when it runs as *`user_name`*.

   If directories or files within the MySQL data directory are symbolic links, `chown -R` might not follow symbolic links for you. If it does not, you must also follow those links and change the directories and files they point to.

3. Start the server as user *`user_name`*. Another alternative is to start [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") as the Unix `root` user and use the [`--user=user_name`](server-options.html#option_mysqld_user) option. [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") starts, then switches to run as the Unix user *`user_name`* before accepting any connections.

4. To start the server as the given user automatically at system startup time, specify the user name by adding a `user` option to the `[mysqld]` group of the `/etc/my.cnf` option file or the `my.cnf` option file in the server's data directory. For example:

   ```sql
   [mysqld]
   user=user_name
   ```

If your Unix machine itself is not secured, you should assign passwords to the MySQL `root` account in the grant tables. Otherwise, any user with a login account on that machine can run the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client with a [`--user=root`](mysql-command-options.html#option_mysql_user) option and perform any operation. (It is a good idea to assign passwords to MySQL accounts in any case, but especially so when other login accounts exist on the server host.) See [Section 2.9.4, “Securing the Initial MySQL Account”](default-privileges.html "2.9.4 Securing the Initial MySQL Account").
