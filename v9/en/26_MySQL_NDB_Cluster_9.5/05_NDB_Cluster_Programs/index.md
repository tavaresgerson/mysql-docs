## 25.5 NDB Cluster Programs

25.5.1 ndbd — The NDB Cluster Data Node Daemon

25.5.2 ndbinfo\_select\_all — Select From ndbinfo Tables

25.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)

25.5.4 ndb\_mgmd — The NDB Cluster Management Server Daemon

25.5.5 ndb\_mgm — The NDB Cluster Management Client

25.5.6 ndb\_blob\_tool — Check and Repair BLOB and TEXT columns of NDB Cluster Tables

25.5.7 ndb\_config — Extract NDB Cluster Configuration Information

25.5.8 ndb\_delete\_all — Delete All Rows from an NDB Table

25.5.9 ndb\_desc — Describe NDB Tables

25.5.10 ndb\_drop\_index — Drop Index from an NDB Table

25.5.11 ndb\_drop\_table — Drop an NDB Table

25.5.12 ndb\_error\_reporter — NDB Error-Reporting Utility

25.5.13 ndb\_import — Import CSV Data Into NDB

25.5.14 ndb\_index\_stat — NDB Index Statistics Utility

25.5.15 ndb\_move\_data — NDB Data Copy Utility

25.5.16 ndb\_perror — Obtain NDB Error Message Information

25.5.17 ndb\_print\_backup\_file — Print NDB Backup File Contents

25.5.18 ndb\_print\_file — Print NDB Disk Data File Contents

25.5.19 ndb\_print\_frag\_file — Print NDB Fragment List File Contents

25.5.20 ndb\_print\_schema\_file — Print NDB Schema File Contents

25.5.21 ndb\_print\_sys\_file — Print NDB System File Contents

25.5.22 ndb\_redo\_log\_reader — Check and Print Content of Cluster Redo Log

25.5.23 ndb\_restore — Restore an NDB Cluster Backup

25.5.24 ndb\_secretsfile\_reader — Obtain Key Information from an Encrypted NDB Data File

25.5.25 ndb\_select\_all — Print Rows from an NDB Table

25.5.26 ndb\_select\_count — Print Row Counts for NDB Tables

25.5.27 ndb\_show\_tables — Display List of NDB Tables

25.5.28 ndb\_sign\_keys — Create, Sign, and Manage TLS Keys and Certificates for NDB Cluster

25.5.29 ndb\_size.pl — NDBCLUSTER Size Requirement Estimator

25.5.30 ndb\_top — View CPU usage information for NDB threads

25.5.31 ndb\_waiter — Wait for NDB Cluster to Reach a Given Status

25.5.32 ndbxfrm — Compress, Decompress, Encrypt, and Decrypt Files Created by NDB Cluster

Using and managing an NDB Cluster requires several specialized programs, which we describe in this chapter. We discuss the purposes of these programs in an NDB Cluster, how to use the programs, and what startup options are available for each of them.

These programs include the NDB Cluster data, management, and SQL node processes (**ndbd**, **ndbmtd**"), **ndb\_mgmd**, and **mysqld**) and the management client (**ndb\_mgm**).

For information about using **mysqld** as an NDB Cluster process, see Section 25.6.10, “MySQL Server Usage for NDB Cluster”.

Other `NDB` utility, diagnostic, and example programs are included with the NDB Cluster distribution. These include **ndb\_restore**, **ndb\_show\_tables**, and **ndb\_config**. These programs are also covered in this section.
