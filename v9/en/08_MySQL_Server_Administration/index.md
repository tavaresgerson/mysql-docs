# Chapter 7 MySQL Server Administration

**Table of Contents**

[7.1 The MySQL Server](mysqld-server.html)
:   [7.1.1 Configuring the Server](server-configuration.html)

    [7.1.2 Server Configuration Defaults](server-configuration-defaults.html)

    [7.1.3 Server Configuration Validation](server-configuration-validation.html)

    [7.1.4 Server Option, System Variable, and Status Variable Reference](server-option-variable-reference.html)

    [7.1.5 Server System Variable Reference](server-system-variable-reference.html)

    [7.1.6 Server Status Variable Reference](server-status-variable-reference.html)

    [7.1.7 Server Command Options](server-options.html)

    [7.1.8 Server System Variables](server-system-variables.html)

    [7.1.9 Using System Variables](using-system-variables.html)

    [7.1.10 Server Status Variables](server-status-variables.html)

    [7.1.11 Server SQL Modes](sql-mode.html)

    [7.1.12 Connection Management](connection-management.html)

    [7.1.13 IPv6 Support](ipv6-support.html)

    [7.1.14 Network Namespace Support](network-namespace-support.html)

    [7.1.15 MySQL Server Time Zone Support](time-zone-support.html)

    [7.1.16 Resource Groups](resource-groups.html)

    [7.1.17 Server-Side Help Support](server-side-help-support.html)

    [7.1.18 Server Tracking of Client Session State](session-state-tracking.html)

    [7.1.19 The Server Shutdown Process](server-shutdown.html)

[7.2 The MySQL Data Directory](data-directory.html)

[7.3 The mysql System Schema](system-schema.html)

[7.4 MySQL Server Logs](server-logs.html)
:   [7.4.1 Selecting General Query Log and Slow Query Log Output Destinations](log-destinations.html)

    [7.4.2 The Error Log](error-log.html)

    [7.4.3 The General Query Log](query-log.html)

    [7.4.4 The Binary Log](binary-log.html)

    [7.4.5 The Slow Query Log](slow-query-log.html)

    [7.4.6 Server Log Maintenance](log-file-maintenance.html)

[7.5 MySQL Components](components.html)
:   [7.5.1 Installing and Uninstalling Components](component-loading.html)

    [7.5.2 Obtaining Component Information](obtaining-component-information.html)

    [7.5.3 Error Log Components](error-log-components.html)

    [7.5.4 Query Attribute Components](query-attribute-components.html)

    [7.5.5 Scheduler Component](scheduler-component.html)

    [7.5.6 Replication Components](replication-components.html)

    [7.5.7 Multilingual Engine Component (MLE)](mle-component.html)

    [7.5.8 Option Tracker Component](option-tracker-component.html)

[7.6 MySQL Server Plugins](server-plugins.html)
:   [7.6.1 Installing and Uninstalling Plugins](plugin-loading.html)

    [7.6.2 Obtaining Server Plugin Information](obtaining-plugin-information.html)

    [7.6.3 MySQL Enterprise Thread Pool](thread-pool.html)

    [7.6.4 The Rewriter Query Rewrite Plugin](rewriter-query-rewrite-plugin.html)

    [7.6.5 The ddl\_rewriter Plugin](ddl-rewriter.html)

    [7.6.6 The Clone Plugin](clone-plugin.html)

    [7.6.7 The Keyring Proxy Bridge Plugin](daemon-keyring-proxy-plugin.html)

    [7.6.8 MySQL Plugin Services](plugin-services.html)

[7.7 MySQL Server Loadable Functions](server-loadable-functions.html)
:   [7.7.1 Installing and Uninstalling Loadable Functions](function-loading.html)

    [7.7.2 Obtaining Information About Loadable Functions](obtaining-loadable-function-information.html)

[7.8 Running Multiple MySQL Instances on One Machine](multiple-servers.html)
:   [7.8.1 Setting Up Multiple Data Directories](multiple-data-directories.html)

    [7.8.2 Running Multiple MySQL Instances on Windows](multiple-windows-servers.html)

    [7.8.3 Running Multiple MySQL Instances on Unix](multiple-unix-servers.html)

    [7.8.4 Using Client Programs in a Multiple-Server Environment](multiple-server-clients.html)

[7.9 Debugging MySQL](debugging-mysql.html)
:   [7.9.1 Debugging a MySQL Server](debugging-server.html)

    [7.9.2 Debugging a MySQL Client](debugging-client.html)

    [7.9.3 The LOCK\_ORDER Tool](lock-order-tool.html)

    [7.9.4 The DBUG Package](dbug-package.html)

MySQL Server ([**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server")) is the main program that
does most of the work in a MySQL installation. This chapter provides
an overview of MySQL Server and covers general server
administration:

* Server configuration
* The data directory, particularly the `mysql`
  system schema

* The server log files
* Management of multiple servers on a single machine

For additional information on administrative topics, see also:

* [Chapter 8, *Security*](security.html "Chapter 8 Security")
* [Chapter 9, *Backup and Recovery*](backup-and-recovery.html "Chapter 9 Backup and Recovery")
* [Chapter 19, *Replication*](replication.html "Chapter 19 Replication")