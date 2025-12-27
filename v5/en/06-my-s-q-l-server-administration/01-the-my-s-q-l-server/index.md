## 5.1 The MySQL Server

[5.1.1 Configuring the Server](server-configuration.html)

[5.1.2 Server Configuration Defaults](server-configuration-defaults.html)

[5.1.3 Server Option, System Variable, and Status Variable Reference](server-option-variable-reference.html)

[5.1.4 Server System Variable Reference](server-system-variable-reference.html)

[5.1.5 Server Status Variable Reference](server-status-variable-reference.html)

[5.1.6 Server Command Options](server-options.html)

[5.1.7 Server System Variables](server-system-variables.html)

[5.1.8 Using System Variables](using-system-variables.html)

[5.1.9 Server Status Variables](server-status-variables.html)

[5.1.10 Server SQL Modes](sql-mode.html)

[5.1.11 Connection Management](connection-management.html)

[5.1.12 IPv6 Support](ipv6-support.html)

[5.1.13 MySQL Server Time Zone Support](time-zone-support.html)

[5.1.14 Server-Side Help Support](server-side-help-support.html)

[5.1.15 Server Tracking of Client Session State](session-state-tracking.html)

[5.1.16 The Server Shutdown Process](server-shutdown.html)

[**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") is the MySQL server. The following discussion covers these MySQL server configuration topics:

* Startup options that the server supports. You can specify these options on the command line, through configuration files, or both.

* Server system variables. These variables reflect the current state and values of the startup options, some of which can be modified while the server is running.

* Server status variables. These variables contain counters and statistics about runtime operation.

* How to set the server SQL mode. This setting modifies certain aspects of SQL syntax and semantics, for example for compatibility with code from other database systems, or to control the error handling for particular situations.

* How the server manages client connections.
* Configuring and using IPv6 support.
* Configuring and using time zone support.
* Server-side help capabilities.
* The server shutdown process. There are performance and reliability considerations depending on the type of table (transactional or nontransactional) and whether you use replication.

For listings of MySQL server variables and options that have been added, deprecated, or removed in MySQL 5.7, see [Section 1.4, “Server and Status Variables and Options Added, Deprecated, or Removed in MySQL 5.7”](added-deprecated-removed.html "1.4 Server and Status Variables and Options Added, Deprecated, or Removed in MySQL 5.7").

Note

Not all storage engines are supported by all MySQL server binaries and configurations. To find out how to determine which storage engines your MySQL server installation supports, see [Section 13.7.5.16, “SHOW ENGINES Statement”](show-engines.html "13.7.5.16 SHOW ENGINES Statement").
