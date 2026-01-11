#### 15.7.8.6 RESET Statement

```
RESET reset_option [, reset_option] ...

reset_option: {
    MASTER
  | REPLICA
  | SLAVE
}
```

The `RESET` statement is used to clear the state of various server operations. You must have the `RELOAD` privilege to execute `RESET`.

For information about the `RESET PERSIST` statement that removes persisted global system variables, see Section 15.7.8.7, “RESET PERSIST Statement”.

`RESET` acts as a stronger version of the `FLUSH` statement. See Section 15.7.8.3, “FLUSH Statement”.

The `RESET` statement causes an implicit commit. See Section 15.3.3, “Statements That Cause an Implicit Commit”.

The following list describes the permitted `RESET` statement *`reset_option`* values:

* `RESET MASTER`

  Deletes all binary logs listed in the index file, resets the binary log index file to be empty, and creates a new binary log file.

* `RESET REPLICA`

  Makes the replica forget its replication position in the source binary logs. Also resets the relay log by deleting any existing relay log files and beginning a new one. Use `RESET REPLICA` in place of `RESET SLAVE` from MySQL 8.0.22.
