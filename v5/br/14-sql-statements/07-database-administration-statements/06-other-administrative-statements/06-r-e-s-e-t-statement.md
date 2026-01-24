#### 13.7.6.6 RESET Statement

```sql
RESET reset_option [, reset_option] ...

reset_option: {
    MASTER
  | QUERY CACHE
  | SLAVE
}
```

The [`RESET`](reset.html "13.7.6.6 RESET Statement") statement is used to clear the state of various server operations. You must have the [`RELOAD`](privileges-provided.html#priv_reload) privilege to execute [`RESET`](reset.html "13.7.6.6 RESET Statement").

[`RESET`](reset.html "13.7.6.6 RESET Statement") acts as a stronger version of the [`FLUSH`](flush.html "13.7.6.3 FLUSH Statement") statement. See [Section 13.7.6.3, “FLUSH Statement”](flush.html "13.7.6.3 FLUSH Statement").

The [`RESET`](reset.html "13.7.6.6 RESET Statement") statement causes an implicit commit. See [Section 13.3.3, “Statements That Cause an Implicit Commit”](implicit-commit.html "13.3.3 Statements That Cause an Implicit Commit").

The following list describes the permitted [`RESET`](reset.html "13.7.6.6 RESET Statement") statement *`reset_option`* values:

* `RESET MASTER`

  Deletes all binary logs listed in the index file, resets the binary log index file to be empty, and creates a new binary log file.

* `RESET QUERY CACHE`

  Removes all query results from the query cache.

  Note

  The query cache is deprecated as of MySQL 5.7.20, and is removed in MySQL 8.0. Deprecation includes [`RESET QUERY CACHE`](reset.html "13.7.6.6 RESET Statement").

* `RESET SLAVE`

  Makes the replica forget its replication position in the source binary logs. Also resets the relay log by deleting any existing relay log files and beginning a new one.
