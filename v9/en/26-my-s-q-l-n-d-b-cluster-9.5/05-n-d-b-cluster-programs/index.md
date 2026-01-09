## 25.5 NDB Cluster Programs

25.5.1 ndbd — The NDB Cluster Data Node Daemon

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

Using and managing an NDB Cluster requires several specialized programs, which we describe in this chapter. We discuss the purposes of these programs in an NDB Cluster, how to use the programs, and what startup options are available for each of them.

These programs include the NDB Cluster data, management, and SQL node processes (**ndbd**, **ndbmtd**"), **ndb_mgmd**, and **mysqld**) and the management client (**ndb_mgm**).

For information about using **mysqld** as an NDB Cluster process, see Section 25.6.10, “MySQL Server Usage for NDB Cluster”.

Other `NDB` utility, diagnostic, and example programs are included with the NDB Cluster distribution. These include **ndb_restore**, **ndb_show_tables**, and **ndb_config**. These programs are also covered in this section.
