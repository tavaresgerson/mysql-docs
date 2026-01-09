# Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6

**Table of Contents**

[21.1 General Information](mysql-cluster-general-info.html)

[21.2 NDB Cluster Overview](mysql-cluster-overview.html) :   [21.2.1 NDB Cluster Core Concepts](mysql-cluster-basics.html)

    [21.2.2 NDB Cluster Nodes, Node Groups, Fragment Replicas, and Partitions](mysql-cluster-nodes-groups.html)

    [21.2.3 NDB Cluster Hardware, Software, and Networking Requirements](mysql-cluster-overview-requirements.html)

    [21.2.4 What is New in MySQL NDB Cluster](mysql-cluster-what-is-new.html)

    [21.2.5 NDB: Added, Deprecated, and Removed Options, Variables, and Parameters](mysql-cluster-added-deprecated-removed.html)

    [21.2.6 MySQL Server Using InnoDB Compared with NDB Cluster](mysql-cluster-compared.html)

    [21.2.7 Known Limitations of NDB Cluster](mysql-cluster-limitations.html)

[21.3 NDB Cluster Installation](mysql-cluster-installation.html) :   [21.3.1 Installation of NDB Cluster on Linux](mysql-cluster-install-linux.html)

    [21.3.2 Installing NDB Cluster on Windows](mysql-cluster-install-windows.html)

    [21.3.3 Initial Configuration of NDB Cluster](mysql-cluster-install-configuration.html)

    [21.3.4 Initial Startup of NDB Cluster](mysql-cluster-install-first-start.html)

    [21.3.5 NDB Cluster Example with Tables and Data](mysql-cluster-install-example-data.html)

    [21.3.6 Safe Shutdown and Restart of NDB Cluster](mysql-cluster-install-shutdown-restart.html)

    [21.3.7 Upgrading and Downgrading NDB Cluster](mysql-cluster-upgrade-downgrade.html)

    [21.3.8 The NDB Cluster Auto-Installer (NDB 7.5) (NO LONGER SUPPORTED)](mysql-cluster-install-auto.html)

    [21.3.9 The NDB Cluster Auto-Installer (NO LONGER SUPPORTED)](mysql-cluster-installer.html)

[21.4 Configuration of NDB Cluster](mysql-cluster-configuration.html) :   [21.4.1 Quick Test Setup of NDB Cluster](mysql-cluster-quick.html)

    [21.4.2 Overview of NDB Cluster Configuration Parameters, Options, and Variables](mysql-cluster-configuration-overview.html)

    [21.4.3 NDB Cluster Configuration Files](mysql-cluster-config-file.html)

    [21.4.4 Using High-Speed Interconnects with NDB Cluster](mysql-cluster-interconnects.html)

[21.5 NDB Cluster Programs](mysql-cluster-programs.html) :   [21.5.1 ndbd — The NDB Cluster Data Node Daemon](mysql-cluster-programs-ndbd.html)

    [21.5.2 ndbinfo_select_all — Select From ndbinfo Tables](mysql-cluster-programs-ndbinfo-select-all.html)

    [21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)](mysql-cluster-programs-ndbmtd.html)

    [21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon](mysql-cluster-programs-ndb-mgmd.html)

    [21.5.5 ndb_mgm — The NDB Cluster Management Client](mysql-cluster-programs-ndb-mgm.html)

    [21.5.6 ndb_blob_tool — Check and Repair BLOB and TEXT columns of NDB Cluster Tables](mysql-cluster-programs-ndb-blob-tool.html)

    [21.5.7 ndb_config — Extract NDB Cluster Configuration Information](mysql-cluster-programs-ndb-config.html)

    [21.5.8 ndb_cpcd — Automate Testing for NDB Development](mysql-cluster-programs-ndb-cpcd.html)

    [21.5.9 ndb_delete_all — Delete All Rows from an NDB Table](mysql-cluster-programs-ndb-delete-all.html)

    [21.5.10 ndb_desc — Describe NDB Tables](mysql-cluster-programs-ndb-desc.html)

    [21.5.11 ndb_drop_index — Drop Index from an NDB Table](mysql-cluster-programs-ndb-drop-index.html)

    [21.5.12 ndb_drop_table — Drop an NDB Table](mysql-cluster-programs-ndb-drop-table.html)

    [21.5.13 ndb_error_reporter — NDB Error-Reporting Utility](mysql-cluster-programs-ndb-error-reporter.html)

    [21.5.14 ndb_import — Import CSV Data Into NDB](mysql-cluster-programs-ndb-import.html)

    [21.5.15 ndb_index_stat — NDB Index Statistics Utility](mysql-cluster-programs-ndb-index-stat.html)

    [21.5.16 ndb_move_data — NDB Data Copy Utility](mysql-cluster-programs-ndb-move-data.html)

    [21.5.17 ndb_perror — Obtain NDB Error Message Information](mysql-cluster-programs-ndb-perror.html)

    [21.5.18 ndb_print_backup_file — Print NDB Backup File Contents](mysql-cluster-programs-ndb-print-backup-file.html)

    [21.5.19 ndb_print_file — Print NDB Disk Data File Contents](mysql-cluster-programs-ndb-print-file.html)

    [21.5.20 ndb_print_frag_file — Print NDB Fragment List File Contents](mysql-cluster-programs-ndb-print-frag-file.html)

    [21.5.21 ndb_print_schema_file — Print NDB Schema File Contents](mysql-cluster-programs-ndb-print-schema-file.html)

    [21.5.22 ndb_print_sys_file — Print NDB System File Contents](mysql-cluster-programs-ndb-print-sys-file.html)

    [21.5.23 ndb_redo_log_reader — Check and Print Content of Cluster Redo Log](mysql-cluster-programs-ndb-redo-log-reader.html)

    [21.5.24 ndb_restore — Restore an NDB Cluster Backup](mysql-cluster-programs-ndb-restore.html)

    [21.5.25 ndb_select_all — Print Rows from an NDB Table](mysql-cluster-programs-ndb-select-all.html)

    [21.5.26 ndb_select_count — Print Row Counts for NDB Tables](mysql-cluster-programs-ndb-select-count.html)

    [21.5.27 ndb_show_tables — Display List of NDB Tables](mysql-cluster-programs-ndb-show-tables.html)

    [21.5.28 ndb_size.pl — NDBCLUSTER Size Requirement Estimator](mysql-cluster-programs-ndb-size-pl.html)

    [21.5.29 ndb_top — View CPU usage information for NDB threads](mysql-cluster-programs-ndb-top.html)

    [21.5.30 ndb_waiter — Wait for NDB Cluster to Reach a Given Status](mysql-cluster-programs-ndb-waiter.html)

[21.6 Management of NDB Cluster](mysql-cluster-management.html) :   [21.6.1 Commands in the NDB Cluster Management Client](mysql-cluster-mgm-client-commands.html)

    [21.6.2 NDB Cluster Log Messages](mysql-cluster-logs-ndb-messages.html)

    [21.6.3 Event Reports Generated in NDB Cluster](mysql-cluster-event-reports.html)

    [21.6.4 Summary of NDB Cluster Start Phases](mysql-cluster-start-phases.html)

    [21.6.5 Performing a Rolling Restart of an NDB Cluster](mysql-cluster-rolling-restart.html)

    [21.6.6 NDB Cluster Single User Mode](mysql-cluster-single-user-mode.html)

    [21.6.7 Adding NDB Cluster Data Nodes Online](mysql-cluster-online-add-node.html)

    [21.6.8 Online Backup of NDB Cluster](mysql-cluster-backup.html)

    [21.6.9 Importing Data Into MySQL Cluster](mysql-cluster-importing-data.html)

    [21.6.10 MySQL Server Usage for NDB Cluster](mysql-cluster-mysqld.html)

    [21.6.11 NDB Cluster Disk Data Tables](mysql-cluster-disk-data.html)

    [21.6.12 Online Operations with ALTER TABLE in NDB Cluster](mysql-cluster-online-operations.html)

    [21.6.13 Distributed Privileges Using Shared Grant Tables](mysql-cluster-privilege-distribution.html)

    [21.6.14 NDB API Statistics Counters and Variables](mysql-cluster-ndb-api-statistics.html)

    [21.6.15 ndbinfo: The NDB Cluster Information Database](mysql-cluster-ndbinfo.html)

    [21.6.16 INFORMATION_SCHEMA Tables for NDB Cluster](mysql-cluster-information-schema-tables.html)

    [21.6.17 Quick Reference: NDB Cluster SQL Statements](mysql-cluster-sql-statements.html)

    [21.6.18 NDB Cluster Security Issues](mysql-cluster-security.html)

[21.7 NDB Cluster Replication](mysql-cluster-replication.html) :   [21.7.1 NDB Cluster Replication: Abbreviations and Symbols](mysql-cluster-replication-abbreviations.html)

    [21.7.2 General Requirements for NDB Cluster Replication](mysql-cluster-replication-general.html)

    [21.7.3 Known Issues in NDB Cluster Replication](mysql-cluster-replication-issues.html)

    [21.7.4 NDB Cluster Replication Schema and Tables](mysql-cluster-replication-schema.html)

    [21.7.5 Preparing the NDB Cluster for Replication](mysql-cluster-replication-preparation.html)

    [21.7.6 Starting NDB Cluster Replication (Single Replication Channel)](mysql-cluster-replication-starting.html)

    [21.7.7 Using Two Replication Channels for NDB Cluster Replication](mysql-cluster-replication-two-channels.html)

    [21.7.8 Implementing Failover with NDB Cluster Replication](mysql-cluster-replication-failover.html)

    [21.7.9 NDB Cluster Backups With NDB Cluster Replication](mysql-cluster-replication-backups.html)

    [21.7.10 NDB Cluster Replication: Bidirectional and Circular Replication](mysql-cluster-replication-multi-source.html)

    [21.7.11 NDB Cluster Replication Conflict Resolution](mysql-cluster-replication-conflict-resolution.html)

[21.8 NDB Cluster Release Notes](mysql-cluster-news.html)

This chapter provides information about MySQL NDB Cluster, a high-availability, high-redundancy version of MySQL adapted for the distributed computing environment which enables running several computers with MySQL servers and other software in a cluster. This chapter also provides information specific to NDB Cluster 7.5 releases through 5.7.44-ndb-7.5.36 and NDB Cluster 7.6 releases through 5.7.44-ndb-7.6.36, both of which are previous General Availability (GA) releases still supported in production. The latest available releases of these are 5.7.44-ndb-7.5.36 and 5.7.44-ndb-7.6.35, respectively. A more recent NDB Cluster stable release series uses version 8.0 of the [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine (also known as [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6")). NDB Cluster 8.0, now available as a General Availability (GA) release beginning with version 8.0.19, incorporates version 8.0 of the `NDB` storage engine; see [MySQL NDB Cluster 8.0](/doc/refman/8.0/en/mysql-cluster.html), for more information about NDB 8.0. NDB Cluster 8.4 (NDB 8.4.7), based on version 8.4 of the NDB storage engine, is also available as an LTS release. See [What is New in MySQL NDB Cluster 8.4](/doc/refman/8.4/en/mysql-cluster-what-is-new.html), for information about differences in NDB 8.4 as compared to earlier releases. Previous GA releases NDB Cluster 7.4 and NDB Cluster 7.3 incorporated `NDB` versions 7.4 and 7.3, respectively. *NDB 7.4 and older release series are no longer supported or maintained*. Both NDB 8.0 and NDB 8.1 are supported in production, and are recommended for new deployments.
