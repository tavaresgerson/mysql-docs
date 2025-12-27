#### 16.4.1.35 Replication and TRUNCATE TABLE

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") is normally regarded as a DML statement, and so would be expected to be logged and replicated using row-based format when the binary logging mode is `ROW` or `MIXED`. However this caused issues when logging or replicating, in `STATEMENT` or `MIXED` mode, tables that used transactional storage engines such as [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") when the transaction isolation level was `READ COMMITTED` or `READ UNCOMMITTED`, which precludes statement-based logging.

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") is treated for purposes of logging and replication as DDL rather than DML so that it can be logged and replicated as a statement. However, the effects of the statement as applicable to [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") and other transactional tables on replicas still follow the rules described in [Section 13.1.34, “TRUNCATE TABLE Statement”](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") governing such tables. (Bug
#36763)
