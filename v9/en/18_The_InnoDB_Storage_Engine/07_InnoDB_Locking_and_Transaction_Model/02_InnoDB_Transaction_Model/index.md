### 17.7.2 InnoDB Transaction Model

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