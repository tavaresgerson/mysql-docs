#### 19.5.1.11 Replication of DROP ... IF EXISTS Statements

The [`DROP DATABASE
IF EXISTS`](drop-database.html "15.1.28 DROP DATABASE Statement"),
[`DROP TABLE IF
EXISTS`](drop-table.html "15.1.37 DROP TABLE Statement"), and
[`DROP VIEW IF
EXISTS`](drop-view.html "15.1.40 DROP VIEW Statement") statements are always replicated, even if the
database, table, or view to be dropped does not exist on the
source. This is to ensure that the object to be dropped no
longer exists on either the source or the replica, once the
replica has caught up with the source.

`DROP ... IF EXISTS` statements for stored
programs (stored procedures and functions, triggers, and events)
are also replicated, even if the stored program to be dropped
does not exist on the source.