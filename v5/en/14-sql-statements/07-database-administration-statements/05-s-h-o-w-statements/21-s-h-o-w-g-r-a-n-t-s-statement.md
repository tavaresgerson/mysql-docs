#### 13.7.5.21 SHOW GRANTS Statement

```sql
SHOW GRANTS [FOR user]
```

This statement displays the privileges that are assigned to a MySQL user account, in the form of [`GRANT`](grant.html "13.7.1.4 GRANT Statement") statements that must be executed to duplicate the privilege assignments.

Note

To display nonprivilege information for MySQL accounts, use the [`SHOW CREATE USER`](show-create-user.html "13.7.5.12 SHOW CREATE USER Statement") statement. See [Section 13.7.5.12, “SHOW CREATE USER Statement”](show-create-user.html "13.7.5.12 SHOW CREATE USER Statement").

[`SHOW GRANTS`](show-grants.html "13.7.5.21 SHOW GRANTS Statement") requires the [`SELECT`](privileges-provided.html#priv_select) privilege for the `mysql` system database, except to display privileges for the current user.

To name the account for [`SHOW GRANTS`](show-grants.html "13.7.5.21 SHOW GRANTS Statement"), use the same format as for the [`GRANT`](grant.html "13.7.1.4 GRANT Statement") statement (for example, `'jeffrey'@'localhost'`):

```sql
mysql> SHOW GRANTS FOR 'jeffrey'@'localhost';
+------------------------------------------------------------------+
| Grants for jeffrey@localhost                                     |
+------------------------------------------------------------------+
| GRANT USAGE ON *.* TO `jeffrey`@`localhost`                      |
| GRANT SELECT, INSERT, UPDATE ON `db1`.* TO `jeffrey`@`localhost` |
+------------------------------------------------------------------+
```

The host part, if omitted, defaults to `'%'`. For additional information about specifying account names, see [Section 6.2.4, “Specifying Account Names”](account-names.html "6.2.4 Specifying Account Names").

To display the privileges granted to the current user (the account you are using to connect to the server), you can use any of the following statements:

```sql
SHOW GRANTS;
SHOW GRANTS FOR CURRENT_USER;
SHOW GRANTS FOR CURRENT_USER();
```

If `SHOW GRANTS FOR CURRENT_USER` (or any equivalent syntax) is used in definer context, such as within a stored procedure that executes with definer rather than invoker privileges, the grants displayed are those of the definer and not the invoker.

[`SHOW GRANTS`](show-grants.html "13.7.5.21 SHOW GRANTS Statement") does not display privileges that are available to the named account but are granted to a different account. For example, if an anonymous account exists, the named account might be able to use its privileges, but [`SHOW GRANTS`](show-grants.html "13.7.5.21 SHOW GRANTS Statement") does not display them.

`SHOW GRANTS` output does not include `IDENTIFIED BY PASSWORD` clauses. Use the [`SHOW CREATE USER`](show-create-user.html "13.7.5.12 SHOW CREATE USER Statement") statement instead. See [Section 13.7.5.12, “SHOW CREATE USER Statement”](show-create-user.html "13.7.5.12 SHOW CREATE USER Statement").
