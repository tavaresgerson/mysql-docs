#### 15.7.1.4 DROP ROLE Statement

```
DROP ROLE [IF EXISTS] role [, role ] ...
```

[`DROP ROLE`](drop-role.html "15.7.1.4 DROP ROLE Statement") removes one or more
roles (named collections of privileges). To use this statement,
you must have the global [`DROP
ROLE`](privileges-provided.html#priv_drop-role) or [`CREATE USER`](privileges-provided.html#priv_create-user)
privilege. When the [`read_only`](server-system-variables.html#sysvar_read_only)
system variable is enabled, [`DROP
ROLE`](drop-role.html "15.7.1.4 DROP ROLE Statement") additionally requires the
[`CONNECTION_ADMIN`](privileges-provided.html#priv_connection-admin) privilege (or
the deprecated [`SUPER`](privileges-provided.html#priv_super) privilege).

Users who have the [`CREATE USER`](privileges-provided.html#priv_create-user)
privilege can use this statement to drop accounts that are
locked or unlocked. Users who have the [`DROP
ROLE`](privileges-provided.html#priv_drop-role) privilege can use this statement only to drop
accounts that are locked (unlocked accounts are presumably user
accounts used to log in to the server and not just as roles).

Roles named in the
[`mandatory_roles`](server-system-variables.html#sysvar_mandatory_roles) system variable
value cannot be dropped.

[`DROP ROLE`](drop-role.html "15.7.1.4 DROP ROLE Statement") either succeeds for all
named roles or rolls back and has no effect if any error occurs.
By default, an error occurs if you try to drop a role that does
not exist. If the `IF EXISTS` clause is given,
the statement produces a warning for each named role that does
not exist, rather than an error.

The statement is written to the binary log if it succeeds, but
not if it fails; in that case, rollback occurs and no changes
are made. A statement written to the binary log includes all
named roles. If the `IF EXISTS` clause is
given, this includes even roles that do not exist and were not
dropped.

Each role name uses the format described in
[Section 8.2.5, “Specifying Role Names”](role-names.html "8.2.5 Specifying Role Names"). For example:

```
DROP ROLE 'admin', 'developer';
DROP ROLE 'webapp'@'localhost';
```

The host name part of the role name, if omitted, defaults to
`'%'`.

A dropped role is automatically revoked from any user account
(or role) to which the role was granted. Within any current
session for such an account, its adjusted privileges apply
beginning with the next statement executed.

For role usage examples, see [Section 8.2.10, “Using Roles”](roles.html "8.2.10 Using Roles").