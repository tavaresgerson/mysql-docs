#### 15.7.8.6 RESET Statement

```
RESET reset_option [, reset_option] ...

reset_option: {
    BINARY LOGS AND GTIDS
  | REPLICA
}
```

The [`RESET`](reset.html "15.7.8.6 RESET Statement") statement is used to
clear the state of various server operations. You must have the
[`RELOAD`](privileges-provided.html#priv_reload) privilege to execute
[`RESET`](reset.html "15.7.8.6 RESET Statement").

For information about the [`RESET
PERSIST`](reset-persist.html "15.7.8.7 RESET PERSIST Statement") statement that removes persisted global system
variables, see [Section 15.7.8.7, “RESET PERSIST Statement”](reset-persist.html "15.7.8.7 RESET PERSIST Statement").

[`RESET`](reset.html "15.7.8.6 RESET Statement") acts as a stronger version
of the [`FLUSH`](flush.html "15.7.8.3 FLUSH Statement") statement. See
[Section 15.7.8.3, “FLUSH Statement”](flush.html "15.7.8.3 FLUSH Statement").

The [`RESET`](reset.html "15.7.8.6 RESET Statement") statement causes an
implicit commit. See [Section 15.3.3, “Statements That Cause an Implicit Commit”](implicit-commit.html "15.3.3 Statements That Cause an Implicit Commit").

The following list describes the permitted
[`RESET`](reset.html "15.7.8.6 RESET Statement") statement
*`reset_option`* values:

* [`RESET BINARY LOGS AND GTIDS`](reset-binary-logs-and-gtids.html "15.4.1.2 RESET BINARY LOGS AND GTIDS Statement")

  Deletes all binary logs listed in the index file, resets the
  binary log index file to be empty, and creates a new binary
  log file.

* [`RESET
  REPLICA`](reset-replica.html "15.4.2.3 RESET REPLICA Statement")

  Makes the replica forget its replication position in the
  source binary logs. Also resets the relay log by deleting
  any existing relay log files and beginning a new one.