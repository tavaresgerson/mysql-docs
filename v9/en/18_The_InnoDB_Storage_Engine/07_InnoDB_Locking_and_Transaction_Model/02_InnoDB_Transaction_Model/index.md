### 17.7.2 InnoDB Transaction Model

[17.7.2.1 Transaction Isolation Levels](innodb-transaction-isolation-levels.html)

[17.7.2.2 autocommit, Commit, and Rollback](innodb-autocommit-commit-rollback.html)

[17.7.2.3 Consistent Nonlocking Reads](innodb-consistent-read.html)

[17.7.2.4 Locking Reads](innodb-locking-reads.html)

The `InnoDB` transaction model aims to combine
the best properties of a
[multi-versioning](glossary.html#glos_mvcc "MVCC") database with
traditional two-phase locking. `InnoDB` performs
locking at the row level and runs queries as nonlocking
[consistent reads](glossary.html#glos_consistent_read "consistent read") by
default, in the style of Oracle. The lock information in
`InnoDB` is stored space-efficiently so that lock
escalation is not needed. Typically, several users are permitted
to lock every row in `InnoDB` tables, or any
random subset of the rows, without causing
`InnoDB` memory exhaustion.