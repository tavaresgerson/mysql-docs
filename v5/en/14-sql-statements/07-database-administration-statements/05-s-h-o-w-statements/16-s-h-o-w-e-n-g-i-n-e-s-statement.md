#### 13.7.5.16 SHOW ENGINES Statement

```sql
SHOW [STORAGE] ENGINES
```

[`SHOW ENGINES`](show-engines.html "13.7.5.16 SHOW ENGINES Statement") displays status information about the server's storage engines. This is particularly useful for checking whether a storage engine is supported, or to see what the default engine is.

For information about MySQL storage engines, see [Chapter 14, *The InnoDB Storage Engine*](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"), and [Chapter 15, *Alternative Storage Engines*](storage-engines.html "Chapter 15 Alternative Storage Engines").

```sql
mysql> SHOW ENGINES\G
*************************** 1. row ***************************
      Engine: InnoDB
     Support: DEFAULT
     Comment: Supports transactions, row-level locking, and foreign keys
Transactions: YES
          XA: YES
  Savepoints: YES
*************************** 2. row ***************************
      Engine: MRG_MYISAM
     Support: YES
     Comment: Collection of identical MyISAM tables
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 3. row ***************************
      Engine: MEMORY
     Support: YES
     Comment: Hash based, stored in memory, useful for temporary tables
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 4. row ***************************
      Engine: BLACKHOLE
     Support: YES
     Comment: /dev/null storage engine (anything you write to it disappears)
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 5. row ***************************
      Engine: MyISAM
     Support: YES
     Comment: MyISAM storage engine
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 6. row ***************************
      Engine: CSV
     Support: YES
     Comment: CSV storage engine
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 7. row ***************************
      Engine: ARCHIVE
     Support: YES
     Comment: Archive storage engine
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 8. row ***************************
      Engine: PERFORMANCE_SCHEMA
     Support: YES
     Comment: Performance Schema
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 9. row ***************************
      Engine: FEDERATED
     Support: YES
     Comment: Federated MySQL storage engine
Transactions: NO
          XA: NO
  Savepoints: NO
```

The output from [`SHOW ENGINES`](show-engines.html "13.7.5.16 SHOW ENGINES Statement") may vary according to the MySQL version used and other factors.

[`SHOW ENGINES`](show-engines.html "13.7.5.16 SHOW ENGINES Statement") output has these columns:

* `Engine`

  The name of the storage engine.

* `Support`

  The server's level of support for the storage engine, as shown in the following table.

  <table summary="Values for the Support column in the output of the SHOW ENGINES statement."><col style="width: 15%"/><col style="width: 85%"/><thead><tr> <th>Value</th> <th>Meaning</th> </tr></thead><tbody><tr> <td><code>YES</code></td> <td>The engine is supported and is active</td> </tr><tr> <td><code>DEFAULT</code></td> <td>Like <code>YES</code>, plus this is the default engine</td> </tr><tr> <td><code>NO</code></td> <td>The engine is not supported</td> </tr><tr> <td><code>DISABLED</code></td> <td>The engine is supported but has been disabled</td> </tr></tbody></table>

  A value of `NO` means that the server was compiled without support for the engine, so it cannot be enabled at runtime.

  A value of `DISABLED` occurs either because the server was started with an option that disables the engine, or because not all options required to enable it were given. In the latter case, the error log should contain a reason indicating why the option is disabled. See [Section 5.4.2, “The Error Log”](error-log.html "5.4.2 The Error Log").

  You might also see `DISABLED` for a storage engine if the server was compiled to support it, but was started with a `--skip-engine_name` option. For the [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine, `DISABLED` means the server was compiled with support for NDB Cluster, but was not started with the [`--ndbcluster`](mysql-cluster-options-variables.html#option_mysqld_ndbcluster) option.

  All MySQL servers support `MyISAM` tables. It is not possible to disable `MyISAM`.

* `Comment`

  A brief description of the storage engine.

* `Transactions`

  Whether the storage engine supports transactions.

* `XA`

  Whether the storage engine supports XA transactions.

* `Savepoints`

  Whether the storage engine supports savepoints.

Storage engine information is also available from the `INFORMATION_SCHEMA` [`ENGINES`](information-schema-engines-table.html "24.3.7 The INFORMATION_SCHEMA ENGINES Table") table. See [Section 24.3.7, “The INFORMATION_SCHEMA ENGINES Table”](information-schema-engines-table.html "24.3.7 The INFORMATION_SCHEMA ENGINES Table").
