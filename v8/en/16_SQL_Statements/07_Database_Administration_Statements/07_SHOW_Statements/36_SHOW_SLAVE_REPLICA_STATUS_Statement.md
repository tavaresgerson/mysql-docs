#### 15.7.7.36 SHOW SLAVE | REPLICA STATUS Statement

```
SHOW {SLAVE | REPLICA} STATUS [FOR CHANNEL channel]
```

This statement provides status information on essential parameters of the replica threads. From MySQL 8.0.22, `SHOW SLAVE STATUS` is deprecated and the alias `SHOW REPLICA STATUS` should be used instead. The statement works in the same way as before, only the terminology used for the statement and its output has changed. Both versions of the statement update the same status variables when used. Please see the documentation for `SHOW REPLICA STATUS` for a description of the statement.
