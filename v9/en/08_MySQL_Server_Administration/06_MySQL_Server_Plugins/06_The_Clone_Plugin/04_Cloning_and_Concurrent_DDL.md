#### 7.6.6.4 Cloning and Concurrent DDL

In MySQL 9.5, concurrent DDL is permitted on the donor by default. Concurrent DDL support on the donor is controlled by the `clone_block_ddl` variable. Concurrent DDL support can be enabled and disabled dynamically using a `SET` statement like this one:

```
SET GLOBAL clone_block_ddl={OFF|ON}
```

The default setting is `clone_block_ddl=OFF`, which permits concurrent DDL on the donor.

Whether the effect of a concurrent DDL operation is cloned or not depends on whether the DDL operation finishes before the dynamic snapshot is taken by the cloning operation.

DDL operations that are not permitted during a cloning operation regardless of the `clone_block_ddl` setting include:

* `ALTER TABLE tbl_name DISCARD TABLESPACE;`

* `ALTER TABLE tbl_name IMPORT TABLESPACE;`

* `ALTER INSTANCE DISABLE INNODB REDO_LOG;`
