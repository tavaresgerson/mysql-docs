#### 15.4.2.5 RESET SLAVE Statement

```
RESET {SLAVE | REPLICA} [ALL] [channel_option]

channel_option:
    FOR CHANNEL channel
```

Makes the replica forget its position in the source's binary log. From MySQL 8.0.22, `RESET SLAVE` is deprecated and the alias `RESET REPLICA` should be used instead. In releases before MySQL 8.0.22, use `RESET SLAVE`. The statement works in the same way as before, only the terminology used for the statement and its output has changed. Both versions of the statement update the same status variables when used. Please see the documentation for `RESET REPLICA` for a description of the statement.
