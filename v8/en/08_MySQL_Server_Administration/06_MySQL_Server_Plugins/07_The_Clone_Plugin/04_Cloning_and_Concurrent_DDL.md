#### 7.6.7.4 Cloning and Concurrent DDL

Prior to MySQL 8.0.27, DDL operations on the donor and recipient MySQL Server instances, including `TRUNCATE TABLE`, are not permitted during a cloning operation. This limitation should be considered when selecting data sources. A workaround is to use dedicated donor instances, which can accommodate DDL operations being blocked while data is cloned.

To prevent concurrent DDL during a cloning operation, an exclusive backup lock is acquired on the donor and recipient. The `clone_ddl_timeout` variable defines the time in seconds on the donor and recipient that a cloning operation waits for a backup lock. The default setting is 300 seconds. If a backup lock is not obtained with the specified time limit, the cloning operation fails with an error.

From MySQL 8.0.27, concurrent DDL is permitted on the donor by default. Concurrent DDL support on the donor is controlled by the `clone_block_ddl` variable. Concurrent DDL support can be enabled and disabled dynamically using a `SET` statement.

```
SET GLOBAL clone_block_ddl={OFF|ON}
```

The default setting is `clone_block_ddl=OFF`, which permits concurrent DDL on the donor.

Whether the effect of a concurrent DDL operation is cloned or not depends on whether the DDL operation finishes before the dynamic snapshot is taken by the cloning operation.

DDL operations that are not permitted during a cloning operation regardless of the `clone_block_ddl` setting include:

* `ALTER TABLE tbl_name DISCARD TABLESPACE;`

* `ALTER TABLE tbl_name IMPORT TABLESPACE;`

* `ALTER INSTANCE DISABLE INNODB REDO_LOG;`
