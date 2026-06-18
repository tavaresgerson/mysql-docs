### 17.9.1 InnoDB Table Compression

[17.9.1.1 Overview of Table Compression](innodb-compression-background.html)

[17.9.1.2 Creating Compressed Tables](innodb-compression-usage.html)

[17.9.1.3 Tuning Compression for InnoDB Tables](innodb-compression-tuning.html)

[17.9.1.4 Monitoring InnoDB Table Compression at Runtime](innodb-compression-tuning-monitoring.html)

[17.9.1.5 How Compression Works for InnoDB Tables](innodb-compression-internals.html)

[17.9.1.6 Compression for OLTP Workloads](innodb-performance-compression-oltp.html)

[17.9.1.7 SQL Compression Syntax Warnings and Errors](innodb-compression-syntax-warnings.html)

This section describes `InnoDB` table
compression, which is supported with `InnoDB`
tables that reside in
[file\_per\_table](glossary.html#glos_file_per_table "file-per-table")
tablespaces or [general
tablespaces](glossary.html#glos_general_tablespace "general tablespace"). Table compression is enabled using the
`ROW_FORMAT=COMPRESSED` attribute with
[`CREATE TABLE`](create-table.html "15.1.24 CREATE TABLE Statement") or
[`ALTER TABLE`](alter-table.html "15.1.11 ALTER TABLE Statement").