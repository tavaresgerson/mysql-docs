### 23.2.2 Stored Routines and MySQL Privileges

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

The server manipulates the `mysql.proc` table in
response to statements that create, alter, or drop stored
routines. Manual manipulation of this table is not supported.