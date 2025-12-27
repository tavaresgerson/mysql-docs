### 2.9.2 Starting the Server

2.9.2.1 Troubleshooting Problems Starting the MySQL Server

This section describes how start the server on Unix and Unix-like systems. (For Windows, see Section 2.3.4.5, “Starting the Server for the First Time”.) For some suggested commands that you can use to test whether the server is accessible and working properly, see Section 2.9.3, “Testing the Server”.

Start the MySQL server like this if your installation includes **mysqld\_safe**:

```sql
$> bin/mysqld_safe --user=mysql &
```

Note

For Linux systems on which MySQL is installed using RPM packages, server startup and shutdown is managed using systemd rather than **mysqld\_safe**, and **mysqld\_safe** is not installed. See Section 2.5.10, “Managing MySQL Server with systemd”.

Start the server like this if your installation includes systemd support:

```sql
$> systemctl start mysqld
```

Substitute the appropriate service name if it differs from `mysqld` (for example, `mysql` on SLES systems).

It is important that the MySQL server be run using an unprivileged (non-`root`) login account. To ensure this, run **mysqld\_safe** as `root` and include the `--user` option as shown. Otherwise, you should execute the program while logged in as `mysql`, in which case you can omit the `--user` option from the command.

For further instructions for running MySQL as an unprivileged user, see Section 6.1.5, “How to Run MySQL as a Normal User”.

If the command fails immediately and prints `mysqld ended`, look for information in the error log (which by default is the `host_name.err` file in the data directory).

If the server is unable to access the data directory it starts or read the grant tables in the `mysql` database, it writes a message to its error log. Such problems can occur if you neglected to create the grant tables by initializing the data directory before proceeding to this step, or if you ran the command that initializes the data directory without the `--user` option. Remove the `data` directory and run the command with the `--user` option.

If you have other problems starting the server, see Section 2.9.2.1, “Troubleshooting Problems Starting the MySQL Server”. For more information about **mysqld\_safe**, see Section 4.3.2, “mysqld\_safe — MySQL Server Startup Script”. For more information about systemd support, see Section 2.5.10, “Managing MySQL Server with systemd”.
