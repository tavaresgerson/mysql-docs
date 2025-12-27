### 6.2.15 Account Locking

MySQL supports locking and unlocking user accounts using the `ACCOUNT LOCK` and `ACCOUNT UNLOCK` clauses for the [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") and [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") statements:

* When used with [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement"), these clauses specify the initial locking state for a new account. In the absence of either clause, the account is created in an unlocked state.

  If the `validate_password` plugin is enabled, it does not permit creating an account without a password, even if the account is locked. See [Section 6.4.3, “The Password Validation Plugin”](validate-password.html "6.4.3 The Password Validation Plugin").

* When used with [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement"), these clauses specify the new locking state for an existing account. In the absence of either clause, the account locking state remains unchanged.

Account locking state is recorded in the `account_locked` column of the `mysql.user` system table. The output from [`SHOW CREATE USER`](show-create-user.html "13.7.5.12 SHOW CREATE USER Statement") indicates whether an account is locked or unlocked.

If a client attempts to connect to a locked account, the attempt fails. The server increments the [`Locked_connects`](server-status-variables.html#statvar_Locked_connects) status variable that indicates the number of attempts to connect to a locked account, returns an [`ER_ACCOUNT_HAS_BEEN_LOCKED`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_account_has_been_locked) error, and writes a message to the error log:

```sql
Access denied for user 'user_name'@'host_name'.
Account is locked.
```

Locking an account does not affect being able to connect using a proxy user that assumes the identity of the locked account. It also does not affect the ability to execute stored programs or views that have a `DEFINER` attribute naming the locked account. That is, the ability to use a proxied account or stored programs or views is not affected by locking the account.

The account-locking capability depends on the presence of the `account_locked` column in the `mysql.user` system table. For upgrades from MySQL versions older than 5.7.6, perform the MySQL upgrade procedure to ensure that this column exists. See [Section 2.10, “Upgrading MySQL”](upgrading.html "2.10 Upgrading MySQL"). For nonupgraded installations that have no `account_locked` column, the server treats all accounts as unlocked, and using the `ACCOUNT LOCK` or `ACCOUNT UNLOCK` clauses produces an error.
