## 14.16 InnoDB INFORMATION\_SCHEMA Tables

[14.16.1 InnoDB INFORMATION\_SCHEMA Tables about Compression](innodb-information-schema-compression-tables.html)

[14.16.2 InnoDB INFORMATION\_SCHEMA Transaction and Locking Information](innodb-information-schema-transactions.html)

[14.16.3 InnoDB INFORMATION\_SCHEMA System Tables](innodb-information-schema-system-tables.html)

[14.16.4 InnoDB INFORMATION\_SCHEMA FULLTEXT Index Tables](innodb-information-schema-fulltext_index-tables.html)

[14.16.5 InnoDB INFORMATION\_SCHEMA Buffer Pool Tables](innodb-information-schema-buffer-pool-tables.html)

[14.16.6 InnoDB INFORMATION\_SCHEMA Metrics Table](innodb-information-schema-metrics-table.html)

[14.16.7 InnoDB INFORMATION\_SCHEMA Temporary Table Info Table](innodb-information-schema-temp-table-info.html)

[14.16.8 Retrieving InnoDB Tablespace Metadata from INFORMATION\_SCHEMA.FILES](innodb-information-schema-files-table.html)

This section provides information and usage examples for
`InnoDB`
[`INFORMATION_SCHEMA`](information-schema.html "Chapter 24 INFORMATION_SCHEMA Tables") tables.

`InnoDB` `INFORMATION_SCHEMA`
tables provide metadata, status information, and statistics about
various aspects of the `InnoDB` storage engine. You
can view a list of `InnoDB`
`INFORMATION_SCHEMA` tables by issuing a
[`SHOW TABLES`](show-tables.html "13.7.5.37 SHOW TABLES Statement") statement on the
`INFORMATION_SCHEMA` database:

```sql
mysql> SHOW TABLES FROM INFORMATION_SCHEMA LIKE 'INNODB%';
```

For table definitions, see
[Section 24.4, “INFORMATION\_SCHEMA InnoDB Tables”](innodb-information-schema-tables.html "24.4 INFORMATION_SCHEMA InnoDB Tables"). For general
information regarding the `MySQL`
`INFORMATION_SCHEMA` database, see
[Chapter 24, *INFORMATION\_SCHEMA Tables*](information-schema.html "Chapter 24 INFORMATION_SCHEMA Tables").