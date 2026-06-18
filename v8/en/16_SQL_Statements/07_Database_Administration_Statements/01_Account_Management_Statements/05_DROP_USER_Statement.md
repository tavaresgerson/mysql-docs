#### 15.7.1.5 DROP USER Statement

```
DROP USER [IF EXISTS] user [, user] ...
```

The [`DROP USER`](drop-user.html "15.7.1.5 DROP USER Statement") statement removes
one or more MySQL accounts and their privileges. It removes
privilege rows for the account from all grant tables.

Roles named in the
[`mandatory_roles`](server-system-variables.html#sysvar_mandatory_roles) system variable
value cannot be dropped.

To use [`DROP USER`](drop-user.html "15.7.1.5 DROP USER Statement"), you must have
the global [`CREATE USER`](privileges-provided.html#priv_create-user) privilege,
or the [`DELETE`](privileges-provided.html#priv_delete) privilege for the
`mysql` system schema. When the
[`read_only`](server-system-variables.html#sysvar_read_only) system variable is
enabled, [`DROP USER`](drop-user.html "15.7.1.5 DROP USER Statement") additionally
requires the [`CONNECTION_ADMIN`](privileges-provided.html#priv_connection-admin)
privilege (or the deprecated
[`SUPER`](privileges-provided.html#priv_super) privilege).

As of MySQL 8.0.22, [`DROP USER`](drop-user.html "15.7.1.5 DROP USER Statement")
fails with an error if any account to be dropped is named as the
`DEFINER` attribute for any stored object.
(That is, the statement fails if dropping an account would cause
a stored object to become orphaned.) To perform the operation
anyway, you must have the
[`SET_USER_ID`](privileges-provided.html#priv_set-user-id) privilege; in this
case, the statement succeeds with a warning rather than failing
with an error. For additional information, including how to
identify which objects name a given account as the
`DEFINER` attribute, see
[Orphan Stored Objects](stored-objects-security.html#stored-objects-security-orphan-objects "Orphan Stored Objects").

[`DROP USER`](drop-user.html "15.7.1.5 DROP USER Statement") either succeeds for all
named users or rolls back and has no effect if any error occurs.
By default, an error occurs if you try to drop a user that does
not exist. If the `IF EXISTS` clause is given,
the statement produces a warning for each named user that does
not exist, rather than an error.

The statement is written to the binary log if it succeeds, but
not if it fails; in that case, rollback occurs and no changes
are made. A statement written to the binary log includes all
named users. If the `IF EXISTS` clause is
given, this includes even users that do not exist and were not
dropped.

Each account name uses the format described in
[Section 8.2.4, “Specifying Account Names”](account-names.html "8.2.4 Specifying Account Names"). For example:

```
DROP USER 'jeffrey'@'localhost';
```

The host name part of the account name, if omitted, defaults to
`'%'`.

Important

[`DROP USER`](drop-user.html "15.7.1.5 DROP USER Statement") does not
automatically close any open user sessions. Rather, in the
event that a user with an open session is dropped, the
statement does not take effect until that user's session is
closed. Once the session is closed, the user is dropped, and
that user's next attempt to log in fails. *This
is by design*.

[`DROP USER`](drop-user.html "15.7.1.5 DROP USER Statement") does not automatically
drop or invalidate databases or objects within them that the old
user created. This includes stored programs or views for which
the `DEFINER` attribute names the dropped user.
Attempts to access such objects may produce an error if they
execute in definer security context. (For information about
security context, see
[Section 27.6, “Stored Object Access Control”](stored-objects-security.html "27.6 Stored Object Access Control").)