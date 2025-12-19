## 7.1 The MySQL Server

**mysqld** is the MySQL server. The following discussion covers these MySQL server configuration topics:

* Startup options that the server supports. You can specify these options on the command line, through configuration files, or both.
* Server system variables. These variables reflect the current state and values of the startup options, some of which can be modified while the server is running.
* Server status variables. These variables contain counters and statistics about runtime operation.
* How to set the server SQL mode. This setting modifies certain aspects of SQL syntax and semantics, for example for compatibility with code from other database systems, or to control the error handling for particular situations.
* How the server manages client connections.
* Configuring and using IPv6 and network namespace support.
* Configuring and using time zone support.
* Using resource groups.
* Server-side help capabilities.
* Capabilities provided to enable client session state changes.
* The server shutdown process. There are performance and reliability considerations depending on the type of table (transactional or nontransactional) and whether you use replication.

For listings of MySQL server variables and options that have been added, deprecated, or removed in MySQL 8.4, see [Section 1.5, “Server and Status Variables and Options Added, Deprecated, or Removed in MySQL 8.4 since 8.0”](added-deprecated-removed.html "1.5 Server and Status Variables and Options Added, Deprecated, or Removed in MySQL 8.4 since 8.0").

::: info Note

Not all storage engines are supported by all MySQL server binaries and configurations. To find out how to determine which storage engines your MySQL server installation supports, see Section 15.7.7.17, “SHOW ENGINES Statement”.

:::
