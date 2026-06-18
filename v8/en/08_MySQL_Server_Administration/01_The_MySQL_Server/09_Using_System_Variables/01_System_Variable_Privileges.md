#### 7.1.9.1 System Variable Privileges

A system variable can have a global value that affects server
operation as a whole, a session value that affects only the
current session, or both:

* For dynamic system variables, the
  [`SET`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment")
  statement can be used to change their global or session
  runtime value (or both), to affect operation of the current
  server instance. (For information about dynamic variables,
  see [Section 7.1.9.2, “Dynamic System Variables”](dynamic-system-variables.html "7.1.9.2 Dynamic System Variables").)

* For certain global system variables,
  [`SET`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment")
  can be used to persist their value to the
  `mysqld-auto.cnf` file in the data
  directory, to affect server operation for subsequent
  startups. (For information about persisting system variables
  and the `mysqld-auto.cnf` file, see
  [Section 7.1.9.3, “Persisted System Variables”](persisted-system-variables.html "7.1.9.3 Persisted System Variables").)

* For persisted global system variables,
  [`RESET PERSIST`](reset-persist.html "15.7.8.7 RESET PERSIST Statement") can be used to
  remove their value from
  `mysqld-auto.cnf`, to affect server
  operation for subsequent startups.

This section describes the privileges required for operations
that assign values to system variables at runtime. This includes
operations that affect runtime values, and operations that
persist values.

To set a global system variable, use a
[`SET`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment")
statement with the appropriate keyword. These privileges apply:

* To set a global system variable runtime value, use the
  [`SET
  GLOBAL`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment") statement, which requires the
  [`SYSTEM_VARIABLES_ADMIN`](privileges-provided.html#priv_system-variables-admin)
  privilege (or the deprecated
  [`SUPER`](privileges-provided.html#priv_super) privilege).

* To persist a global system variable to the
  `mysqld-auto.cnf` file (and set the
  runtime value), use the
  [`SET
  PERSIST`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment") statement, which requires the
  [`SYSTEM_VARIABLES_ADMIN`](privileges-provided.html#priv_system-variables-admin) or
  [`SUPER`](privileges-provided.html#priv_super) privilege.

* To persist a global system variable to the
  `mysqld-auto.cnf` file (without setting
  the runtime value), use the
  [`SET
  PERSIST_ONLY`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment") statement, which requires the
  [`SYSTEM_VARIABLES_ADMIN`](privileges-provided.html#priv_system-variables-admin) and
  [`PERSIST_RO_VARIABLES_ADMIN`](privileges-provided.html#priv_persist-ro-variables-admin)
  privileges.
  [`SET
  PERSIST_ONLY`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment") can be used for both dynamic and
  read-only system variables, but is particularly useful for
  persisting read-only variables, for which
  [`SET
  PERSIST`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment") cannot be used.

* Some global system variables are persist-restricted (see
  [Section 7.1.9.4, “Nonpersistible and Persist-Restricted System Variables”](nonpersistible-system-variables.html "7.1.9.4 Nonpersistible and Persist-Restricted System Variables")). To
  persist these variables, use the
  [`SET
  PERSIST_ONLY`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment") statement, which requires the
  privileges described previously. In addition, you must
  connect to the server using an encrypted connection and
  supply an SSL certificate with the Subject value specified
  by the
  [`persist_only_admin_x509_subject`](server-system-variables.html#sysvar_persist_only_admin_x509_subject)
  system variable.

To remove a persisted global system variable from the
`mysqld-auto.cnf` file, use the
[`RESET PERSIST`](reset-persist.html "15.7.8.7 RESET PERSIST Statement") statement. These
privileges apply:

* For dynamic system variables, [`RESET
  PERSIST`](reset-persist.html "15.7.8.7 RESET PERSIST Statement") requires the
  [`SYSTEM_VARIABLES_ADMIN`](privileges-provided.html#priv_system-variables-admin) or
  [`SUPER`](privileges-provided.html#priv_super) privilege.

* For read-only system variables, [`RESET
  PERSIST`](reset-persist.html "15.7.8.7 RESET PERSIST Statement") requires the
  [`SYSTEM_VARIABLES_ADMIN`](privileges-provided.html#priv_system-variables-admin) and
  [`PERSIST_RO_VARIABLES_ADMIN`](privileges-provided.html#priv_persist-ro-variables-admin)
  privileges.

* For persist-restricted variables, [`RESET
  PERSIST`](reset-persist.html "15.7.8.7 RESET PERSIST Statement") does not require an encrypted connection
  to the server made using a particular SSL certificate.

If a global system variable has any exceptions to the preceding
privilege requirements, the variable description indicates those
exceptions. Examples include
[`default_table_encryption`](server-system-variables.html#sysvar_default_table_encryption) and
[`mandatory_roles`](server-system-variables.html#sysvar_mandatory_roles), which require
additional privileges. These additional privileges apply to
operations that set the global runtime value, but not operations
that persist the value.

To set a session system variable runtime value, use the
[`SET
SESSION`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment") statement. In contrast to setting global
runtime values, setting session runtime values normally requires
no special privileges and can be done by any user to affect the
current session. For some system variables, setting the session
value may have effects outside the current session and thus is a
restricted operation that can be done only by users who have a
special privilege:

* As of MySQL 8.0.14, the privilege required is
  [`SESSION_VARIABLES_ADMIN`](privileges-provided.html#priv_session-variables-admin).

  Note

  Any user who has
  [`SYSTEM_VARIABLES_ADMIN`](privileges-provided.html#priv_system-variables-admin) or
  [`SUPER`](privileges-provided.html#priv_super) effectively has
  [`SESSION_VARIABLES_ADMIN`](privileges-provided.html#priv_session-variables-admin) by
  implication and need not be granted
  [`SESSION_VARIABLES_ADMIN`](privileges-provided.html#priv_session-variables-admin)
  explicitly.

* Prior to MySQL 8.0.14, the privilege required is
  [`SYSTEM_VARIABLES_ADMIN`](privileges-provided.html#priv_system-variables-admin) or
  [`SUPER`](privileges-provided.html#priv_super).

If a session system variable is restricted, the variable
description indicates that restriction. Examples include
[`binlog_format`](replication-options-binary-log.html#sysvar_binlog_format) and
[`sql_log_bin`](replication-options-binary-log.html#sysvar_sql_log_bin). Setting the
session value of these variables affects binary logging for the
current session, but may also have wider implications for the
integrity of server replication and backups.

[`SESSION_VARIABLES_ADMIN`](privileges-provided.html#priv_session-variables-admin) enables
administrators to minimize the privilege footprint of users who
may previously have been granted
[`SYSTEM_VARIABLES_ADMIN`](privileges-provided.html#priv_system-variables-admin) or
[`SUPER`](privileges-provided.html#priv_super) for the purpose of enabling
them to modify restricted session system variables. Suppose that
an administrator has created the following role to confer the
ability to set restricted session system variables:

```
CREATE ROLE set_session_sysvars;
GRANT SYSTEM_VARIABLES_ADMIN ON *.* TO set_session_sysvars;
```

Any user granted the `set_session_sysvars` role
(and who has that role active) is able to set restricted session
system variables. However, that user is also able to set global
system variables, which may be undesirable.

By modifying the role to have
[`SESSION_VARIABLES_ADMIN`](privileges-provided.html#priv_session-variables-admin) instead
of [`SYSTEM_VARIABLES_ADMIN`](privileges-provided.html#priv_system-variables-admin), the
role privileges can be reduced to the ability to set restricted
session system variables and nothing else. To modify the role,
use these statements:

```
GRANT SESSION_VARIABLES_ADMIN ON *.* TO set_session_sysvars;
REVOKE SYSTEM_VARIABLES_ADMIN ON *.* FROM set_session_sysvars;
```

Modifying the role has an immediate effect: Any account granted
the `set_session_sysvars` role no longer has
[`SYSTEM_VARIABLES_ADMIN`](privileges-provided.html#priv_system-variables-admin) and is not
able to set global system variables without being granted that
ability explicitly. A similar
[`GRANT`](grant.html "15.7.1.6 GRANT Statement")/[`REVOKE`](revoke.html "15.7.1.8 REVOKE Statement")
sequence can be applied to any account that was granted
[`SYSTEM_VARIABLES_ADMIN`](privileges-provided.html#priv_system-variables-admin) directly
rather than by means of a role.