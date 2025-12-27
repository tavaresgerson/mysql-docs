#### 13.7.5.12 SHOW CREATE USER Statement

```sql
SHOW CREATE USER user
```

This statement shows the [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") statement that creates the named user. An error occurs if the user does not exist. The statement requires the [`SELECT`](privileges-provided.html#priv_select) privilege for the `mysql` system database, except to display information for the current user.

To name the account, use the format described in [Section 6.2.4, “Specifying Account Names”](account-names.html "6.2.4 Specifying Account Names"). The host name part of the account name, if omitted, defaults to `'%'`. It is also possible to specify [`CURRENT_USER`](information-functions.html#function_current-user) or [`CURRENT_USER()`](information-functions.html#function_current-user) to refer to the account associated with the current session.

```sql
mysql> SHOW CREATE USER 'root'@'localhost'\G
*************************** 1. row ***************************
CREATE USER for root@localhost: CREATE USER 'root'@'localhost'
IDENTIFIED WITH 'mysql_native_password'
AS '*2470C0C06DEE42FD1618BB99005ADCA2EC9D1E19'
REQUIRE NONE PASSWORD EXPIRE DEFAULT ACCOUNT UNLOCK
```

The output format is affected by the setting of the [`log_builtin_as_identified_by_password`](replication-options-binary-log.html#sysvar_log_builtin_as_identified_by_password) system variable.

To display the privileges granted to an account, use the [`SHOW GRANTS`](show-grants.html "13.7.5.21 SHOW GRANTS Statement") statement. See [Section 13.7.5.21, “SHOW GRANTS Statement”](show-grants.html "13.7.5.21 SHOW GRANTS Statement").
