### 27.2.2 Stored Routines and MySQL Privileges

The MySQL grant system takes stored routines into account as
follows:

* The [`CREATE ROUTINE`](privileges-provided.html#priv_create-routine) privilege is
  needed to create stored routines.

* The [`ALTER ROUTINE`](privileges-provided.html#priv_alter-routine) privilege is
  needed to alter or drop stored routines. This privilege is
  granted automatically to the creator of a routine if
  necessary, and dropped from the creator when the routine is
  dropped.

* The [`EXECUTE`](privileges-provided.html#priv_execute) privilege is
  required to execute stored routines. However, this privilege
  is granted automatically to the creator of a routine if
  necessary (and dropped from the creator when the routine is
  dropped). Also, the default `SQL SECURITY`
  characteristic for a routine is `DEFINER`,
  which enables users who have access to the database with which
  the routine is associated to execute the routine.

* If the
  [`automatic_sp_privileges`](server-system-variables.html#sysvar_automatic_sp_privileges)
  system variable is 0, the
  [`EXECUTE`](privileges-provided.html#priv_execute) and
  [`ALTER ROUTINE`](privileges-provided.html#priv_alter-routine) privileges are
  not automatically granted to and dropped from the routine
  creator.

* The creator of a routine is the account used to execute the
  `CREATE` statement for it. This might not be
  the same as the account named as the
  `DEFINER` in the routine definition.

* The account named as a routine `DEFINER` can
  see all routine properties, including its definition. The
  account thus has full access to the routine output as produced
  by:

  + The contents of the Information Schema
    [`ROUTINES`](information-schema-routines-table.html "28.3.36 The INFORMATION_SCHEMA ROUTINES Table") table.

  + The [`SHOW CREATE FUNCTION`](show-create-function.html "15.7.7.9 SHOW CREATE FUNCTION Statement")
    and [`SHOW CREATE PROCEDURE`](show-create-procedure.html "15.7.7.11 SHOW CREATE PROCEDURE Statement")
    statements.

  + The [`SHOW FUNCTION CODE`](show-function-code.html "15.7.7.21 SHOW FUNCTION CODE Statement") and
    [`SHOW PROCEDURE CODE`](show-procedure-code.html "15.7.7.30 SHOW PROCEDURE CODE Statement")
    statements.

  + The [`SHOW FUNCTION STATUS`](show-function-status.html "15.7.7.22 SHOW FUNCTION STATUS Statement")
    and [`SHOW PROCEDURE STATUS`](show-procedure-status.html "15.7.7.31 SHOW PROCEDURE STATUS Statement")
    statements.

* For an account other than the account named as the routine
  `DEFINER`, access to routine properties
  depends on the privileges granted to the account:

  + With the [`SHOW_ROUTINE`](privileges-provided.html#priv_show-routine)
    privilege or the global
    [`SELECT`](privileges-provided.html#priv_select) privilege, the
    account can see all routine properties, including its
    definition.

  + With the [`CREATE ROUTINE`](privileges-provided.html#priv_create-routine),
    [`ALTER ROUTINE`](privileges-provided.html#priv_alter-routine) or
    [`EXECUTE`](privileges-provided.html#priv_execute) privilege granted
    at a scope that includes the routine, the account can see
    all routine properties except its definition.