#### 29.12.12.1 The ndb_sync_pending_objects Table

This table provides information about `NDB` database objects for which mismatches have been detected and which are waiting to be synchronized between the `NDB` dictionary and the MySQL data dictionary.

Example information about `NDB` database objects awaiting synchronization:

```
mysql> SELECT * FROM performance_schema.ndb_sync_pending_objects;
+-------------+------+----------------+
| SCHEMA_NAME | NAME |  TYPE          |
+-------------+------+----------------+
| NULL        | lg1  |  LOGFILE GROUP |
| NULL        | ts1  |  TABLESPACE    |
| db1         | NULL |  SCHEMA        |
| test        | t1   |  TABLE         |
| test        | t2   |  TABLE         |
| test        | t3   |  TABLE         |
+-------------+------+----------------+
```

The `ndb_sync_pending_objects` table has these columns:

* `SCHEMA_NAME`: The name of the schema (database) in which the object awaiting synchronization resides; this is `NULL` for tablespaces and log file groups

* `NAME`: The name of the object awaiting synchronization; this is `NULL` if the object is a schema

* `TYPE`: The type of the object awaiting synchronization; this is one of `LOGFILE GROUP`, `TABLESPACE`, `SCHEMA`, or `TABLE`
