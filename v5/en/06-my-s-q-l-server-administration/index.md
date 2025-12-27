# Chapter 5 MySQL Server Administration

**Table of Contents**

[5.1 The MySQL Server](mysqld-server.html) :   [5.1.1 Configuring the Server](server-configuration.html)

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

[5.2 The MySQL Data Directory](data-directory.html)

[5.3 The mysql System Database](system-schema.html)

[5.4 MySQL Server Logs](server-logs.html) :   [5.4.1 Selecting General Query Log and Slow Query Log Output Destinations](log-destinations.html)

    [5.4.2 The Error Log](error-log.html)

    [5.4.3 The General Query Log](query-log.html)

    [5.4.4 The Binary Log](binary-log.html)

    [5.4.5 The Slow Query Log](slow-query-log.html)

    [5.4.6 The DDL Log](ddl-log.html)

    [5.4.7 Server Log Maintenance](log-file-maintenance.html)

[5.5 MySQL Server Plugins](server-plugins.html) :   [5.5.1 Installing and Uninstalling Plugins](plugin-loading.html)

    [5.5.2 Obtaining Server Plugin Information](obtaining-plugin-information.html)

    [5.5.3 MySQL Enterprise Thread Pool](thread-pool.html)

    [5.5.4 The Rewriter Query Rewrite Plugin](rewriter-query-rewrite-plugin.html)

    [5.5.5 Version Tokens](version-tokens.html)

    [5.5.6 MySQL Plugin Services](plugin-services.html)

[5.6 MySQL Server Loadable Functions](server-loadable-functions.html) :   [5.6.1 Installing and Uninstalling Loadable Functions](function-loading.html)

    [5.6.2 Obtaining Information About Loadable Functions](obtaining-loadable-function-information.html)

[5.7 Running Multiple MySQL Instances on One Machine](multiple-servers.html) :   [5.7.1 Setting Up Multiple Data Directories](multiple-data-directories.html)

    [5.7.2 Running Multiple MySQL Instances on Windows](multiple-windows-servers.html)

    [5.7.3 Running Multiple MySQL Instances on Unix](multiple-unix-servers.html)

    [5.7.4 Using Client Programs in a Multiple-Server Environment](multiple-server-clients.html)

[5.8 Debugging MySQL](debugging-mysql.html) :   [5.8.1 Debugging a MySQL Server](debugging-server.html)

    [5.8.2 Debugging a MySQL Client](debugging-client.html)

    [5.8.3 The DBUG Package](dbug-package.html)

    [5.8.4 Tracing mysqld Using DTrace](dba-dtrace-server.html)

MySQL Server ([**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server")) is the main program that does most of the work in a MySQL installation. This chapter provides an overview of MySQL Server and covers general server administration:

* Server configuration
* The data directory, particularly the `mysql` system database

* The server log files
* Management of multiple servers on a single machine

For additional information on administrative topics, see also:

* [Chapter 6, *Security*](security.html "Chapter 6 Security")
* [Chapter 7, *Backup and Recovery*](backup-and-recovery.html "Chapter 7 Backup and Recovery")
* [Chapter 16, *Replication*](replication.html "Chapter 16 Replication")
