#### 13.7.1.5 RENAME USER Statement

```sql
RENAME USER old_user TO new_user
    [, old_user TO new_user] ...
```

The [`RENAME USER`](rename-user.html "13.7.1.5 RENAME USER Statement") statement renames existing MySQL accounts. An error occurs for old accounts that do not exist or new accounts that already exist.

To use [`RENAME USER`](rename-user.html "13.7.1.5 RENAME USER Statement"), you must have the global [`CREATE USER`](privileges-provided.html#priv_create-user) privilege, or the [`UPDATE`](privileges-provided.html#priv_update) privilege for the `mysql` system database. When the [`read_only`](server-system-variables.html#sysvar_read_only) system variable is enabled, [`RENAME USER`](rename-user.html "13.7.1.5 RENAME USER Statement") additionally requires the [`SUPER`](privileges-provided.html#priv_super) privilege.

Each account name uses the format described in [Section 6.2.4, “Specifying Account Names”](account-names.html "6.2.4 Specifying Account Names"). For example:

```sql
RENAME USER 'jeffrey'@'localhost' TO 'jeff'@'127.0.0.1';
```

The host name part of the account name, if omitted, defaults to `'%'`.

[`RENAME USER`](rename-user.html "13.7.1.5 RENAME USER Statement") causes the privileges held by the old user to be those held by the new user. However, [`RENAME USER`](rename-user.html "13.7.1.5 RENAME USER Statement") does not automatically drop or invalidate databases or objects within them that the old user created. This includes stored programs or views for which the `DEFINER` attribute names the old user. Attempts to access such objects may produce an error if they execute in definer security context. (For information about security context, see [Section 23.6, “Stored Object Access Control”](stored-objects-security.html "23.6 Stored Object Access Control").)

The privilege changes take effect as indicated in [Section 6.2.9, “When Privilege Changes Take Effect”](privilege-changes.html "6.2.9 When Privilege Changes Take Effect").
