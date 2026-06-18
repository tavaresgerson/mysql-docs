### 15.1.10 ALTER SERVER Statement

```
ALTER SERVER  server_name
    OPTIONS (option[, option] ...)
```

Alters the server information for
`server_name`,
adjusting any of the options permitted in the
[`CREATE SERVER`](create-server.html "15.1.22 CREATE SERVER Statement") statement. The
corresponding fields in the `mysql.servers` table
are updated accordingly. This statement requires the
[`SUPER`](privileges-provided.html#priv_super) privilege.

For example, to update the `USER` option:

```
ALTER SERVER s OPTIONS (USER 'sally');
```

`ALTER SERVER` causes an implicit commit. See
[Section 15.3.3, “Statements That Cause an Implicit Commit”](implicit-commit.html "15.3.3 Statements That Cause an Implicit Commit").

`ALTER SERVER` is not written to the binary log,
regardless of the logging format that is in use.