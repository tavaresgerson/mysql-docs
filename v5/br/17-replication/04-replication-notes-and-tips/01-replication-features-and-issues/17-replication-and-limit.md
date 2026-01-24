#### 16.4.1.17 Replication and LIMIT

Statement-based replication of `LIMIT` clauses in [`DELETE`](delete.html "13.2.2 DELETE Statement"), [`UPDATE`](update.html "13.2.11 UPDATE Statement"), and [`INSERT ... SELECT`](insert-select.html "13.2.5.1 INSERT ... SELECT Statement") statements is unsafe since the order of the rows affected is not defined. (Such statements can be replicated correctly with statement-based replication only if they also contain an `ORDER BY` clause.) When such a statement is encountered:

* When using `STATEMENT` mode, a warning that the statement is not safe for statement-based replication is now issued.

  When using `STATEMENT` mode, warnings are issued for DML statements containing `LIMIT` even when they also have an `ORDER BY` clause (and so are made deterministic). This is a known issue. (Bug #42851)

* When using `MIXED` mode, the statement is now automatically replicated using row-based mode.
