#### 13.4.2.4 SET GLOBAL sql_slave_skip_counter Syntax

```sql
SET GLOBAL sql_slave_skip_counter = N
```

This statement skips the next *`N`* events from the master. This is useful for recovering from replication stops caused by a statement.

This statement is valid only when the slave threads are not running. Otherwise, it produces an error.

When using this statement, it is important to understand that the binary log is actually organized as a sequence of groups known as event groups. Each event group consists of a sequence of events.

* For transactional tables, an event group corresponds to a transaction.

* For nontransactional tables, an event group corresponds to a single SQL statement.

Note

A single transaction can contain changes to both transactional and nontransactional tables.

When you use [`SET GLOBAL sql_slave_skip_counter`](set-global-sql-slave-skip-counter.html "13.4.2.4 SET GLOBAL sql_slave_skip_counter Syntax") to skip events and the result is in the middle of a group, the slave continues to skip events until it reaches the end of the group. Execution then starts with the next event group.
