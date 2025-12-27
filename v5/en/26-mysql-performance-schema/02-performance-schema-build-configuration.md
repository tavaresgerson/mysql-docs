## 25.2 Performance Schema Build Configuration

The Performance Schema is mandatory and always compiled in. It is possible to exclude certain parts of the Performance Schema instrumentation. For example, to exclude stage and statement instrumentation, do this:

```sql
$> cmake . \
        -DDISABLE_PSI_STAGE=1 \
        -DDISABLE_PSI_STATEMENT=1
```

For more information, see the descriptions of the `DISABLE_PSI_XXX` **CMake** options in [Section 2.8.7, “MySQL Source-Configuration Options”](source-configuration-options.html "2.8.7 MySQL Source-Configuration Options").

If you install MySQL over a previous installation that was configured without the Performance Schema (or with an older version of the Performance Schema that has missing or out-of-date tables). One indication of this issue is the presence of messages such as the following in the error log:

```sql
[ERROR] Native table 'performance_schema'.'events_waits_history'
has the wrong structure
[ERROR] Native table 'performance_schema'.'events_waits_history_long'
has the wrong structure
...
```

To correct that problem, perform the MySQL upgrade procedure. See [Section 2.10, “Upgrading MySQL”](upgrading.html "2.10 Upgrading MySQL").

To verify whether a server was built with Performance Schema support, check its help output. If the Performance Schema is available, the output mentions several variables with names that begin with `performance_schema`:

```sql
$> mysqld --verbose --help
...
  --performance_schema
                      Enable the performance schema.
  --performance_schema_events_waits_history_long_size=#
                      Number of rows in events_waits_history_long.
...
```

You can also connect to the server and look for a line that names the [`PERFORMANCE_SCHEMA`](performance-schema.html "Chapter 25 MySQL Performance Schema") storage engine in the output from [`SHOW ENGINES`](show-engines.html "13.7.5.16 SHOW ENGINES Statement"):

```sql
mysql> SHOW ENGINES\G
...
      Engine: PERFORMANCE_SCHEMA
     Support: YES
     Comment: Performance Schema
Transactions: NO
          XA: NO
  Savepoints: NO
...
```

If the Performance Schema was not configured into the server at build time, no row for [`PERFORMANCE_SCHEMA`](performance-schema.html "Chapter 25 MySQL Performance Schema") appears in the output from [`SHOW ENGINES`](show-engines.html "13.7.5.16 SHOW ENGINES Statement"). You might see `performance_schema` listed in the output from [`SHOW DATABASES`](show-databases.html "13.7.5.14 SHOW DATABASES Statement"), but it has no tables and cannot be used.

A line for [`PERFORMANCE_SCHEMA`](performance-schema.html "Chapter 25 MySQL Performance Schema") in the [`SHOW ENGINES`](show-engines.html "13.7.5.16 SHOW ENGINES Statement") output means that the Performance Schema is available, not that it is enabled. To enable it, you must do so at server startup, as described in the next section.
