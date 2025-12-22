#### 2.3.3.9 Testing The MySQL Installation

You can test whether the MySQL server is working by executing any of the following commands:

```
C:\> "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqlshow"
C:\> "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqlshow" -u root mysql
C:\> "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqladmin" version status proc
C:\> "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql" test
```

If  `mysqld` is slow to respond to TCP/IP connections from client programs, there is probably a problem with your DNS. In this case, start  `mysqld` with the  `skip_name_resolve` system variable enabled and use only `localhost` and IP addresses in the `Host` column of the MySQL grant tables. (Be sure that an account exists that specifies an IP address or you may not be able to connect.)

You can force a MySQL client to use a named-pipe connection rather than TCP/IP by specifying the `--pipe` or `--protocol=PIPE` option, or by specifying `.` (period) as the host name. Use the  `--socket` option to specify the name of the pipe if you do not want to use the default pipe name.

If you have set a password for the `root` account, deleted the anonymous account, or created a new user account, then to connect to the MySQL server you must use the appropriate `-u` and `-p` options with the commands shown previously. See Section 6.2.4, “Connecting to the MySQL Server Using Command Options”.

For more information about  **mysqlshow**, see Section 6.5.6, “mysqlshow — Display Database, Table, and Column Information”.
