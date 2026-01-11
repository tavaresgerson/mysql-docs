#### 15.4.2.9 STOP SLAVE Statement

```
STOP {SLAVE | REPLICA} [thread_types] [channel_option]

thread_types:
    [thread_type [, thread_type] ... ]

thread_type: IO_THREAD | SQL_THREAD

channel_option:
    FOR CHANNEL channel
```

Stops the replication threads. From MySQL 8.0.22, `STOP SLAVE` is deprecated and the alias `STOP REPLICA` should be used instead. The statement works in the same way as before, only the terminology used for the statement and its output has changed. Both versions of the statement update the same status variables when used. Please see the documentation for `STOP REPLICA` for a description of the statement.
