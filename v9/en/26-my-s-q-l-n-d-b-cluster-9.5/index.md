# Chapter 25 MySQL NDB Cluster 9.5

**Table of Contents**

25.1 General Information

25.2 NDB Cluster Overview :   25.2.1 NDB Cluster Core Concepts

    25.2.2 NDB Cluster Nodes, Node Groups, Fragment Replicas, and Partitions

    25.2.3 NDB Cluster Hardware, Software, and Networking Requirements

    25.2.4 What is New in MySQL NDB Cluster 9.5

    25.2.5 Options, Variables, and Parameters Added, Deprecated or Removed in NDB 9.5

    25.2.6 MySQL Server Using InnoDB Compared with NDB Cluster

    25.2.7 Known Limitations of NDB Cluster

25.3 NDB Cluster Installation :   25.3.1 Installation of NDB Cluster on Linux

    25.3.2 Installing NDB Cluster on Windows

    25.3.3 Initial Configuration of NDB Cluster

    25.3.4 Initial Startup of NDB Cluster

    25.3.5 NDB Cluster Example with Tables and Data

    25.3.6 Safe Shutdown and Restart of NDB Cluster

    25.3.7 Upgrading and Downgrading NDB Cluster

25.4 Configuration of NDB Cluster :   25.4.1 Quick Test Setup of NDB Cluster

    25.4.2 Overview of NDB Cluster Configuration Parameters, Options, and Variables

    25.4.3 NDB Cluster Configuration Files

    25.4.4 Using High-Speed Interconnects with NDB Cluster

25.5 NDB Cluster Programs :   25.5.1 ndbd — The NDB Cluster Data Node Daemon

    25.5.2 ndbinfo_select_all — Select From ndbinfo Tables

    25.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)

    25.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon

    25.5.5 ndb_mgm — The NDB Cluster Management Client

    25.5.6 ndb_blob_tool — Check and Repair BLOB and TEXT columns of NDB Cluster Tables

    25.5.7 ndb_config — Extract NDB Cluster Configuration Information

    25.5.8 ndb_delete_all — Delete All Rows from an NDB Table

    25.5.9 ndb_desc — Describe NDB Tables

    25.5.10 ndb_drop_index — Drop Index from an NDB Table

    25.5.11 ndb_drop_table — Drop an NDB Table

    25.5.12 ndb_error_reporter — NDB Error-Reporting Utility

    25.5.13 ndb_import — Import CSV Data Into NDB

    25.5.14 ndb_index_stat — NDB Index Statistics Utility

    25.5.15 ndb_move_data — NDB Data Copy Utility

    25.5.16 ndb_perror — Obtain NDB Error Message Information

    25.5.17 ndb_print_backup_file — Print NDB Backup File Contents

    25.5.18 ndb_print_file — Print NDB Disk Data File Contents

    25.5.19 ndb_print_frag_file — Print NDB Fragment List File Contents

    25.5.20 ndb_print_schema_file — Print NDB Schema File Contents

    25.5.21 ndb_print_sys_file — Print NDB System File Contents

    25.5.22 ndb_redo_log_reader — Check and Print Content of Cluster Redo Log

    25.5.23 ndb_restore — Restore an NDB Cluster Backup

    25.5.24 ndb_secretsfile_reader — Obtain Key Information from an Encrypted NDB Data File

    25.5.25 ndb_select_all — Print Rows from an NDB Table

    25.5.26 ndb_select_count — Print Row Counts for NDB Tables

    25.5.27 ndb_show_tables — Display List of NDB Tables

    25.5.28 ndb_sign_keys — Create, Sign, and Manage TLS Keys and Certificates for NDB Cluster

    25.5.29 ndb_size.pl — NDBCLUSTER Size Requirement Estimator

    25.5.30 ndb_top — View CPU usage information for NDB threads

    25.5.31 ndb_waiter — Wait for NDB Cluster to Reach a Given Status

    25.5.32 ndbxfrm — Compress, Decompress, Encrypt, and Decrypt Files Created by NDB Cluster

25.6 Management of NDB Cluster :   25.6.1 Commands in the NDB Cluster Management Client

    25.6.2 NDB Cluster Log Messages

    25.6.3 Event Reports Generated in NDB Cluster

    25.6.4 Summary of NDB Cluster Start Phases

    25.6.5 Performing a Rolling Restart of an NDB Cluster

    25.6.6 NDB Cluster Single User Mode

    25.6.7 Adding NDB Cluster Data Nodes Online

    25.6.8 Online Backup of NDB Cluster

    25.6.9 Importing Data Into MySQL Cluster

    25.6.10 MySQL Server Usage for NDB Cluster

    25.6.11 NDB Cluster Disk Data Tables

    25.6.12 Online Operations with ALTER TABLE in NDB Cluster

    25.6.13 Privilege Synchronization and NDB_STORED_USER

    25.6.14 NDB API Statistics Counters and Variables

    25.6.15 ndbinfo: The NDB Cluster Information Database

    25.6.16 INFORMATION_SCHEMA Tables for NDB Cluster

    25.6.17 NDB Cluster and the Performance Schema

    25.6.18 Quick Reference: NDB Cluster SQL Statements

    25.6.19 NDB Cluster Security

25.7 NDB Cluster Replication :   25.7.1 NDB Cluster Replication: Abbreviations and Symbols

    25.7.2 General Requirements for NDB Cluster Replication

    25.7.3 Known Issues in NDB Cluster Replication

    25.7.4 NDB Cluster Replication Schema and Tables

    25.7.5 Preparing the NDB Cluster for Replication

    25.7.6 Starting NDB Cluster Replication (Single Replication Channel)

    25.7.7 Using Two Replication Channels for NDB Cluster Replication

    25.7.8 Implementing Failover with NDB Cluster Replication

    25.7.9 NDB Cluster Backups With NDB Cluster Replication

    25.7.10 NDB Cluster Replication: Bidirectional and Circular Replication

    25.7.11 NDB Cluster Replication Using the Multithreaded Applier

    25.7.12 NDB Cluster Replication Conflict Resolution

25.8 NDB Cluster Release Notes

This chapter provides information about MySQL NDB Cluster, a high-availability, high-redundancy version of MySQL adapted for the distributed computing environment, as well as information specific to NDB Cluster 8.4 (NDB 8.4.7), based on version 8.4 of the NDB storage engine. See Section 25.2.4, “What is New in MySQL NDB Cluster 9.5”, for information about differences in NDB 8.4 as compared to earlier releases. See MySQL NDB Cluster 8.0 for information about NDB Cluster 8.0. Both NDB 8.0 and NDB 8.4 are intended for use in production environments. NDB Cluster 7.6 and 7.5 are previous GA releases still supported in production, although new deployments can and should use either of MySQL NDB Cluster 8.0 or 8.4.

*NDB Cluster 7.4 and older release series are no longer supported or maintained*.
