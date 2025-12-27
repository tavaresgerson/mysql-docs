### 13.1.28 DROP SERVER Statement

```sql
DROP SERVER [ IF EXISTS ] server_name
```

Drops the server definition for the server named `server_name`. The corresponding row in the `mysql.servers` table is deleted. This statement requires the [`SUPER`](privileges-provided.html#priv_super) privilege.

Dropping a server for a table does not affect any `FEDERATED` tables that used this connection information when they were created. See [Section 13.1.17, “CREATE SERVER Statement”](create-server.html "13.1.17 CREATE SERVER Statement").

`DROP SERVER` causes an implicit commit. See [Section 13.3.3, “Statements That Cause an Implicit Commit”](implicit-commit.html "13.3.3 Statements That Cause an Implicit Commit").

`DROP SERVER` is not written to the binary log, regardless of the logging format that is in use.
