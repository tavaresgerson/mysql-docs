#### 15.4.2.5 RESET SLAVE Statement

```
RESET {SLAVE | REPLICA} [ALL] [channel_option]

channel_option:
    FOR CHANNEL channel
```

Makes the replica forget its position in the source's binary
log. From MySQL 8.0.22, [`RESET
SLAVE`](reset-slave.html "15.4.2.5 RESET SLAVE Statement") is deprecated and the alias
[`RESET REPLICA`](reset-replica.html "15.4.2.4 RESET REPLICA Statement") should be used
instead. In releases before MySQL 8.0.22, use
[`RESET SLAVE`](reset-slave.html "15.4.2.5 RESET SLAVE Statement"). The statement works
in the same way as before, only the terminology used for the
statement and its output has changed. Both versions of the
statement update the same status variables when used. Please see
the documentation for [`RESET
REPLICA`](reset-replica.html "15.4.2.4 RESET REPLICA Statement") for a description of the statement.