### 17.9.1 InnoDB Table Compression

17.9.1.1 Overview of Table Compression

17.9.1.2 Creating Compressed Tables

17.9.1.3 Tuning Compression for InnoDB Tables

17.9.1.4 Monitoring InnoDB Table Compression at Runtime

17.9.1.5 How Compression Works for InnoDB Tables

17.9.1.6 Compression for OLTP Workloads

17.9.1.7 SQL Compression Syntax Warnings and Errors

This section describes `InnoDB` table compression, which is supported with `InnoDB` tables that reside in file\_per\_table tablespaces or general tablespaces. Table compression is enabled using the `ROW_FORMAT=COMPRESSED` attribute with `CREATE TABLE` or `ALTER TABLE`.
