## 14.16 InnoDB INFORMATION_SCHEMA Tables

14.16.1 InnoDB INFORMATION_SCHEMA Tables about Compression

14.16.2 InnoDB INFORMATION_SCHEMA Transaction and Locking Information

14.16.3 InnoDB INFORMATION_SCHEMA System Tables

14.16.4 InnoDB INFORMATION_SCHEMA FULLTEXT Index Tables

14.16.5 InnoDB INFORMATION_SCHEMA Buffer Pool Tables

14.16.6 InnoDB INFORMATION_SCHEMA Metrics Table

14.16.7 InnoDB INFORMATION_SCHEMA Temporary Table Info Table

14.16.8 Retrieving InnoDB Tablespace Metadata from INFORMATION_SCHEMA.FILES

This section provides information and usage examples for `InnoDB` `INFORMATION_SCHEMA` tables.

`InnoDB` `INFORMATION_SCHEMA` tables provide metadata, status information, and statistics about various aspects of the `InnoDB` storage engine. You can view a list of `InnoDB` `INFORMATION_SCHEMA` tables by issuing a `SHOW TABLES` statement on the `INFORMATION_SCHEMA` database:

```sql
mysql> SHOW TABLES FROM INFORMATION_SCHEMA LIKE 'INNODB%';
```

For table definitions, see Section 24.4, “INFORMATION_SCHEMA InnoDB Tables”. For general information regarding the `MySQL` `INFORMATION_SCHEMA` database, see Chapter 24, *INFORMATION_SCHEMA Tables*.
