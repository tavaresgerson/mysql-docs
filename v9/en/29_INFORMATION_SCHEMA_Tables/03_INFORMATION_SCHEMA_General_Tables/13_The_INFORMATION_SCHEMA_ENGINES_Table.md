### 28.3.13 The INFORMATION\_SCHEMA ENGINES Table

The `ENGINES` table provides information about storage engines. This is particularly useful for checking whether a storage engine is supported, or to see what the default engine is.

The `ENGINES` table has these columns:

* `ENGINE`

  The name of the storage engine.

* `SUPPORT`

  The server's level of support for the storage engine, as shown in the following table.

  <table summary="Values for the SUPPORT column in the INFORMATION_SCHEMA.ENGINES table."><thead><tr> <th>Value</th> <th>Meaning</th> </tr></thead><tbody><tr> <td><code>YES</code></td> <td>The engine is supported and is active</td> </tr><tr> <td><code>DEFAULT</code></td> <td>Like <code>YES</code>, plus this is the default engine</td> </tr><tr> <td><code>NO</code></td> <td>The engine is not supported</td> </tr><tr> <td><code>DISABLED</code></td> <td>The engine is supported but has been disabled</td> </tr></tbody></table>

  A value of `NO` means that the server was compiled without support for the engine, so it cannot be enabled at runtime.

  A value of `DISABLED` occurs either because the server was started with an option that disables the engine, or because not all options required to enable it were given. In the latter case, the error log should contain a reason indicating why the option is disabled. See Section 7.4.2, “The Error Log”.

  You might also see `DISABLED` for a storage engine if the server was compiled to support it, but was started with a `--skip-engine_name` option. For the `NDB` storage engine, `DISABLED` means the server was compiled with support for NDB Cluster, but was not started with the `--ndbcluster` option.

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

* `ENGINES` is a nonstandard `INFORMATION_SCHEMA` table.

Storage engine information is also available from the `SHOW ENGINES` statement. See Section 15.7.7.18, “SHOW ENGINES Statement”. The following statements are equivalent:

```
SELECT * FROM INFORMATION_SCHEMA.ENGINES

SHOW ENGINES
```
