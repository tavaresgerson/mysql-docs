### 17.7.2 InnoDB Transaction Model

17.7.2.1 Transaction Isolation Levels

17.7.2.2 autocommit, Commit, and Rollback

17.7.2.3 Consistent Nonlocking Reads

17.7.2.4 Locking Reads

The `InnoDB` transaction model aims to combine the best properties of a multi-versioning database with traditional two-phase locking. `InnoDB` performs locking at the row level and runs queries as nonlocking consistent reads by default, in the style of Oracle. The lock information in `InnoDB` is stored space-efficiently so that lock escalation is not needed. Typically, several users are permitted to lock every row in `InnoDB` tables, or any random subset of the rows, without causing `InnoDB` memory exhaustion.
