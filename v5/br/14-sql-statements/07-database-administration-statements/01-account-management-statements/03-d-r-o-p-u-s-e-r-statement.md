#### 13.7.1.3 DROP USER Statement

```sql
DROP USER [IF EXISTS] user [, user] ...
```

The [`DROP USER`](drop-user.html "13.7.1.3 DROP USER Statement") statement removes one or more MySQL accounts and their privileges. It removes privilege rows for the account from all grant tables.

To use [`DROP USER`](drop-user.html "13.7.1.3 DROP USER Statement"), you must have the global [`CREATE USER`](privileges-provided.html#priv_create-user) privilege, or the [`DELETE`](privileges-provided.html#priv_delete) privilege for the `mysql` system database. When the [`read_only`](server-system-variables.html#sysvar_read_only) system variable is enabled, [`DROP USER`](drop-user.html "13.7.1.3 DROP USER Statement") additionally requires the [`SUPER`](privileges-provided.html#priv_super) privilege.

An error occurs if you try to drop an account that does not exist. If the `IF EXISTS` clause is given, the statement produces a warning for each named user that does not exist, rather than an error.

Each account name uses the format described in [Section 6.2.4, “Specifying Account Names”](account-names.html "6.2.4 Specifying Account Names"). For example:

```sql
DROP USER 'jeffrey'@'localhost';
```

The host name part of the account name, if omitted, defaults to `'%'`.

Important

[`DROP USER`](drop-user.html "13.7.1.3 DROP USER Statement") does not automatically close any open user sessions. Rather, in the event that a user with an open session is dropped, the statement does not take effect until that user's session is closed. Once the session is closed, the user is dropped, and that user's next attempt to log in fails. *This is by design*.

[`DROP USER`](drop-user.html "13.7.1.3 DROP USER Statement") does not automatically drop or invalidate databases or objects within them that the old user created. This includes stored programs or views for which the `DEFINER` attribute names the dropped user. Attempts to access such objects may produce an error if they execute in definer security context. (For information about security context, see [Section 23.6, “Stored Object Access Control”](stored-objects-security.html "23.6 Stored Object Access Control").)
