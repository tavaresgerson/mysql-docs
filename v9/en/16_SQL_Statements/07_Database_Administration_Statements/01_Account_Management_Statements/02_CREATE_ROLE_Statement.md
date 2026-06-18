#### 15.7.1.2 CREATE ROLE Statement

```
CREATE ROLE [IF NOT EXISTS] role [, role ] ...
```

[`CREATE ROLE`](create-role.html "15.7.1.2 CREATE ROLE Statement") creates one or more
roles, which are named collections of privileges. To use this
statement, you must have the global [`CREATE
ROLE`](privileges-provided.html#priv_create-role) or [`CREATE USER`](privileges-provided.html#priv_create-user)
privilege. When the [`read_only`](server-system-variables.html#sysvar_read_only)
system variable is enabled, [`CREATE
ROLE`](create-role.html "15.7.1.2 CREATE ROLE Statement") additionally requires the
[`CONNECTION_ADMIN`](privileges-provided.html#priv_connection-admin) privilege (or
the deprecated [`SUPER`](privileges-provided.html#priv_super) privilege).

A role when created is locked, has no password, and is assigned
the default authentication plugin. (These role attributes can be
changed later with the [`ALTER USER`](alter-user.html "15.7.1.1 ALTER USER Statement")
statement, by users who have the global
[`CREATE USER`](privileges-provided.html#priv_create-user) privilege.)

[`CREATE ROLE`](create-role.html "15.7.1.2 CREATE ROLE Statement") either succeeds for
all named roles or rolls back and has no effect if any error
occurs. By default, an error occurs if you try to create a role
that already exists. If the `IF NOT EXISTS`
clause is given, the statement produces a warning for each named
role that already exists, rather than an error.

The statement is written to the binary log if it succeeds, but
not if it fails; in that case, rollback occurs and no changes
are made. A statement written to the binary log includes all
named roles. If the `IF NOT EXISTS` clause is
given, this includes even roles that already exist and were not
created.

Each role name uses the format described in
[Section 8.2.5, “Specifying Role Names”](role-names.html "8.2.5 Specifying Role Names"). For example:

```
CREATE ROLE 'admin', 'developer';
CREATE ROLE 'webapp'@'localhost';
```

The host name part of the role name, if omitted, defaults to
`'%'`.

For role usage examples, see [Section 8.2.10, “Using Roles”](roles.html "8.2.10 Using Roles").