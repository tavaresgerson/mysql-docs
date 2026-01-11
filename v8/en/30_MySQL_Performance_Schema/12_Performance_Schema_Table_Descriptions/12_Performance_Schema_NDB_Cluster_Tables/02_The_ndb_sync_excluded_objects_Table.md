#### 29.12.12.2 The ndb_sync_excluded_objects Table

This table provides information about `NDB` database objects which cannot be automatically synchronized between NDB Cluster's dictionary and the MySQL data dictionary.

Example information about `NDB` database objects which cannot be synchronized with the MySQL data dictionary:

```
mysql> SELECT * FROM performance_schema.ndb_sync_excluded_objects\G
*************************** 1. row ***************************
SCHEMA_NAME: NULL
       NAME: lg1
       TYPE: LOGFILE GROUP
     REASON: Injected failure
*************************** 2. row ***************************
SCHEMA_NAME: NULL
       NAME: ts1
       TYPE: TABLESPACE
     REASON: Injected failure
*************************** 3. row ***************************
SCHEMA_NAME: db1
       NAME: NULL
       TYPE: SCHEMA
     REASON: Injected failure
*************************** 4. row ***************************
SCHEMA_NAME: test
       NAME: t1
       TYPE: TABLE
     REASON: Injected failure
*************************** 5. row ***************************
SCHEMA_NAME: test
       NAME: t2
       TYPE: TABLE
     REASON: Injected failure
*************************** 6. row ***************************
SCHEMA_NAME: test
       NAME: t3
       TYPE: TABLE
     REASON: Injected failure
```

The `ndb_sync_excluded_objects` table has these columns:

* `SCHEMA_NAME`: The name of the schema (database) in which the object which has failed to synchronize resides; this is `NULL` for tablespaces and log file groups

* `NAME`: The name of the object which has failed to synchronize; this is `NULL` if the object is a schema

* `TYPE`: The type of the object has failed to synchronize; this is one of `LOGFILE GROUP`, `TABLESPACE`, `SCHEMA`, or `TABLE`

* `REASON`: The reason for exclusion (blocklisting) of the object; that is, the reason for the failure to synchronize this object

  Possible reasons include the following:

  + `Injected failure`
  + `Failed to determine if object existed in NDB`

  + `Failed to determine if object existed in DD`

  + `Failed to drop object in DD`
  + `Failed to get undofiles assigned to logfile group`

  + `Failed to get object id and version`
  + `Failed to install object in DD`
  + `Failed to get datafiles assigned to tablespace`

  + `Failed to create schema`
  + `Failed to determine if object was a local table`

  + `Failed to invalidate table references`

  + `Failed to set database name of NDB object`

  + `Failed to get extra metadata of table`

  + `Failed to migrate table with extra metadata version 1`

  + `Failed to get object from DD`
  + `Definition of table has changed in NDB Dictionary`

  + `Failed to setup binlogging for table`

  This list is not necessarily exhaustive, and is subject to change in future `NDB` releases.

The `ndb_sync_excluded_objects` table was added in NDB 8.0.21.
