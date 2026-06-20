## 17.15 InnoDB INFORMATION_SCHEMA Tables

This section provides information and usage examples for `InnoDB` `INFORMATION_SCHEMA` tables.

`InnoDB` `INFORMATION_SCHEMA` tables provide metadata, status information, and statistics about various aspects of the `InnoDB` storage engine. You can view a list of `InnoDB` `INFORMATION_SCHEMA` tables by issuing a `SHOW TABLES` statement on the `INFORMATION_SCHEMA` database:

```
mysql> SHOW TABLES FROM INFORMATION_SCHEMA LIKE 'INNODB%';
```

For table definitions, see Section 28.4, “INFORMATION_SCHEMA InnoDB Tables”. For general information regarding the `MySQL` `INFORMATION_SCHEMA` database, see Chapter 28, *INFORMATION_SCHEMA Tables*.