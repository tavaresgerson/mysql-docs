#### 15.7.1.7 RENAME USER Statement

```
RENAME USER old_user TO new_user
    [, old_user TO new_user] ...
```

The [`RENAME USER`](rename-user.html "15.7.1.7 RENAME USER Statement") statement renames
existing MySQL accounts. An error occurs for old accounts that
do not exist or new accounts that already exist.

To use [`RENAME USER`](rename-user.html "15.7.1.7 RENAME USER Statement"), you must have
the global [`CREATE USER`](privileges-provided.html#priv_create-user) privilege,
or the [`UPDATE`](privileges-provided.html#priv_update) privilege for the
`mysql` system schema. When the
[`read_only`](server-system-variables.html#sysvar_read_only) system variable is
enabled, [`RENAME USER`](rename-user.html "15.7.1.7 RENAME USER Statement") additionally
requires the [`CONNECTION_ADMIN`](privileges-provided.html#priv_connection-admin)
privilege (or the deprecated
[`SUPER`](privileges-provided.html#priv_super) privilege).

[`RENAME USER`](rename-user.html "15.7.1.7 RENAME USER Statement") fails with an error
if any account to be renamed is named as the
`DEFINER` attribute for any stored object.
(That is, the statement fails if renaming an account would cause
a stored object to become orphaned.) To perform the operation
anyway, you must have the
[`SET_ANY_DEFINER`](privileges-provided.html#priv_set-any-definer) or
[`ALLOW_NONEXISTENT_DEFINER`](privileges-provided.html#priv_allow-nonexistent-definer)
privilege; in this case, the statement succeeds with a warning
rather than failing with an error. For additional information,
including how to identify which objects name a given account as
the `DEFINER` attribute, see
[Orphan Stored Objects](stored-objects-security.html#stored-objects-security-orphan-objects "Orphan Stored Objects").

Each account name uses the format described in
[Section 8.2.4, “Specifying Account Names”](account-names.html "8.2.4 Specifying Account Names"). For example:

```
RENAME USER 'jeffrey'@'localhost' TO 'jeff'@'127.0.0.1';
```

The host name part of the account name, if omitted, defaults to
`'%'`.

[`RENAME USER`](rename-user.html "15.7.1.7 RENAME USER Statement") causes the privileges
held by the old user to be those held by the new user. However,
[`RENAME USER`](rename-user.html "15.7.1.7 RENAME USER Statement") does not
automatically drop or invalidate databases or objects within
them that the old user created. This includes stored programs or
views for which the `DEFINER` attribute names
the old user. Attempts to access such objects may produce an
error if they execute in definer security context. (For
information about security context, see
[Section 27.8, “Stored Object Access Control”](stored-objects-security.html "27.8 Stored Object Access Control").)

The privilege changes take effect as indicated in
[Section 8.2.13, “When Privilege Changes Take Effect”](privilege-changes.html "8.2.13 When Privilege Changes Take Effect").