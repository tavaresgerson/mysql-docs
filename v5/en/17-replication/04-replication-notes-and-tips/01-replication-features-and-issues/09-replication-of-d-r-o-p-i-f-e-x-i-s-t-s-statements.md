#### 16.4.1.9 Replication of DROP ... IF EXISTS Statements

The [`DROP DATABASE IF EXISTS`](drop-database.html "13.1.22 DROP DATABASE Statement"), [`DROP TABLE IF EXISTS`](drop-table.html "13.1.29 DROP TABLE Statement"), and [`DROP VIEW IF EXISTS`](drop-view.html "13.1.32 DROP VIEW Statement") statements are always replicated, even if the database, table, or view to be dropped does not exist on the source. This is to ensure that the object to be dropped no longer exists on either the source or the replica, once the replica has caught up with the source.

`DROP ... IF EXISTS` statements for stored programs (stored procedures and functions, triggers, and events) are also replicated, even if the stored program to be dropped does not exist on the source.
