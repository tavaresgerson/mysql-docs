## 17.15 InnoDB INFORMATION_SCHEMA Tables

17.15.1 InnoDB INFORMATION_SCHEMA Tables about Compression

17.15.2 InnoDB INFORMATION_SCHEMA Transaction and Locking Information

17.15.3 InnoDB INFORMATION_SCHEMA Schema Object Tables

17.15.4 InnoDB INFORMATION_SCHEMA FULLTEXT Index Tables

17.15.5 InnoDB INFORMATION_SCHEMA Buffer Pool Tables

17.15.6 InnoDB INFORMATION_SCHEMA Metrics Table

17.15.7 InnoDB INFORMATION_SCHEMA Temporary Table Info Table

17.15.8 Retrieving InnoDB Tablespace Metadata from INFORMATION_SCHEMA.FILES

This section provides information and usage examples for `InnoDB` `INFORMATION_SCHEMA` tables.

`InnoDB` `INFORMATION_SCHEMA` tables provide metadata, status information, and statistics about various aspects of the `InnoDB` storage engine. You can view a list of `InnoDB` `INFORMATION_SCHEMA` tables by issuing a `SHOW TABLES` statement on the `INFORMATION_SCHEMA` database:

```
mysql> SHOW TABLES FROM INFORMATION_SCHEMA LIKE 'INNODB%';
```

For table definitions, see Section 28.4, “INFORMATION_SCHEMA InnoDB Tables”. For general information regarding the `MySQL` `INFORMATION_SCHEMA` database, see Chapter 28, *INFORMATION_SCHEMA Tables*.
