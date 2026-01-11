#### 13.7.1.6 REVOKE Statement

```sql
REVOKE
    priv_type [(column_list)]
      [, priv_type [(column_list) ...
    ON [object_type] priv_level
    FROM user [, user] ...

REVOKE ALL [PRIVILEGES], GRANT OPTION
    FROM user [, user] ...

REVOKE PROXY ON user
    FROM user [, user] ...
```

The [`REVOKE`](revoke.html "13.7.1.6 REVOKE Statement") statement enables system administrators to revoke privileges from MySQL accounts.

For details on the levels at which privileges exist, the permissible *`priv_type`*, *`priv_level`*, and *`object_type`* values, and the syntax for specifying users and passwords, see [Section 13.7.1.4, “GRANT Statement”](grant.html "13.7.1.4 GRANT Statement").

When the [`read_only`](server-system-variables.html#sysvar_read_only) system variable is enabled, [`REVOKE`](revoke.html "13.7.1.6 REVOKE Statement") requires the [`SUPER`](privileges-provided.html#priv_super) privilege in addition to any other required privileges described in the following discussion.

Each account name uses the format described in [Section 6.2.4, “Specifying Account Names”](account-names.html "6.2.4 Specifying Account Names"). For example:

```sql
REVOKE INSERT ON *.* FROM 'jeffrey'@'localhost';
```

The host name part of the account name, if omitted, defaults to `'%'`.

To use the first [`REVOKE`](revoke.html "13.7.1.6 REVOKE Statement") syntax, you must have the [`GRANT OPTION`](privileges-provided.html#priv_grant-option) privilege, and you must have the privileges that you are revoking.

To revoke all privileges, use the second syntax, which drops all global, database, table, column, and routine privileges for the named user or users:

```sql
REVOKE ALL PRIVILEGES, GRANT OPTION FROM user [, user] ...
```

To use this [`REVOKE`](revoke.html "13.7.1.6 REVOKE Statement") syntax, you must have the global [`CREATE USER`](privileges-provided.html#priv_create-user) privilege, or the [`UPDATE`](privileges-provided.html#priv_update) privilege for the `mysql` system database.

User accounts from which privileges are to be revoked must exist, but the privileges to be revoked need not be currently granted to them.

[`REVOKE`](revoke.html "13.7.1.6 REVOKE Statement") removes privileges, but does not remove rows from the `mysql.user` system table. To remove a user account entirely, use [`DROP USER`](drop-user.html "13.7.1.3 DROP USER Statement"). See [Section 13.7.1.3, “DROP USER Statement”](drop-user.html "13.7.1.3 DROP USER Statement").

If the grant tables hold privilege rows that contain mixed-case database or table names and the [`lower_case_table_names`](server-system-variables.html#sysvar_lower_case_table_names) system variable is set to a nonzero value, [`REVOKE`](revoke.html "13.7.1.6 REVOKE Statement") cannot be used to revoke these privileges. It is necessary to manipulate the grant tables directly. ([`GRANT`](grant.html "13.7.1.4 GRANT Statement") does not create such rows when [`lower_case_table_names`](server-system-variables.html#sysvar_lower_case_table_names) is set, but such rows might have been created prior to setting the variable.)

When successfully executed from the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") program, [`REVOKE`](revoke.html "13.7.1.6 REVOKE Statement") responds with `Query OK, 0 rows affected`. To determine what privileges remain after the operation, use [`SHOW GRANTS`](show-grants.html "13.7.5.21 SHOW GRANTS Statement"). See [Section 13.7.5.21, “SHOW GRANTS Statement”](show-grants.html "13.7.5.21 SHOW GRANTS Statement").
