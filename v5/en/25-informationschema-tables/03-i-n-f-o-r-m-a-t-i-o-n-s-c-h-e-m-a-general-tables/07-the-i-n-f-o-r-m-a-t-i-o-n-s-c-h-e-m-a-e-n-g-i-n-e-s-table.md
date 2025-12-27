### 24.3.7 The INFORMATION\_SCHEMA ENGINES Table

The [`ENGINES`](information-schema-engines-table.html "24.3.7 The INFORMATION_SCHEMA ENGINES Table") table provides information about storage engines. This is particularly useful for checking whether a storage engine is supported, or to see what the default engine is.

The [`ENGINES`](information-schema-engines-table.html "24.3.7 The INFORMATION_SCHEMA ENGINES Table") table has these columns:

* `ENGINE`

  The name of the storage engine.

* `SUPPORT`

  The server's level of support for the storage engine, as shown in the following table.

  <table summary="Values for the SUPPORT column in the INFORMATION_SCHEMA.ENGINES table."><col style="width: 15%"/><col style="width: 85%"/><thead><tr> <th>Value</th> <th>Meaning</th> </tr></thead><tbody><tr> <td><code class="literal">YES</code></td> <td>The engine is supported and is active</td> </tr><tr> <td><code class="literal">DEFAULT</code></td> <td>Like <code class="literal">YES</code>, plus this is the default engine</td> </tr><tr> <td><code class="literal">NO</code></td> <td>The engine is not supported</td> </tr><tr> <td><code class="literal">DISABLED</code></td> <td>The engine is supported but has been disabled</td> </tr></tbody></table>

  A value of `NO` means that the server was compiled without support for the engine, so it cannot be enabled at runtime.

  A value of `DISABLED` occurs either because the server was started with an option that disables the engine, or because not all options required to enable it were given. In the latter case, the error log should contain a reason indicating why the option is disabled. See [Section 5.4.2, “The Error Log”](error-log.html "5.4.2 The Error Log").

  You might also see `DISABLED` for a storage engine if the server was compiled to support it, but was started with a `--skip-engine_name` option. For the [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine, `DISABLED` means the server was compiled with support for NDB Cluster, but was not started with the [`--ndbcluster`](mysql-cluster-options-variables.html#option_mysqld_ndbcluster) option.

  All MySQL servers support `MyISAM` tables. It is not possible to disable `MyISAM`.

* `COMMENT`

  A brief description of the storage engine.

* `TRANSACTIONS`

  Whether the storage engine supports transactions.

* `XA`

  Whether the storage engine supports XA transactions.

* `SAVEPOINTS`

  Whether the storage engine supports savepoints.

#### Notes

* [`ENGINES`](information-schema-engines-table.html "24.3.7 The INFORMATION_SCHEMA ENGINES Table") is a nonstandard `INFORMATION_SCHEMA` table.

Storage engine information is also available from the [`SHOW ENGINES`](show-engines.html "13.7.5.16 SHOW ENGINES Statement") statement. See [Section 13.7.5.16, “SHOW ENGINES Statement”](show-engines.html "13.7.5.16 SHOW ENGINES Statement"). The following statements are equivalent:

```sql
SELECT * FROM INFORMATION_SCHEMA.ENGINES

SHOW ENGINES
```
