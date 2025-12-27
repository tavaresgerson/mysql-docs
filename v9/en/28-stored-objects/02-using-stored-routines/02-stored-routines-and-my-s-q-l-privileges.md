### 27.2.2 Stored Routines and MySQL Privileges

The MySQL grant system takes stored routines into account as follows:

* The `CREATE ROUTINE` privilege is needed to create stored routines.

* The `ALTER ROUTINE` privilege is needed to alter or drop stored routines. This privilege is granted automatically to the creator of a routine if necessary, and dropped from the creator when the routine is dropped.

* The `EXECUTE` privilege is required to execute stored routines. However, this privilege is granted automatically to the creator of a routine if necessary (and dropped from the creator when the routine is dropped). Also, the default `SQL SECURITY` characteristic for a routine is `DEFINER`, which enables users who have access to the database with which the routine is associated to execute the routine.

* If the `automatic_sp_privileges` system variable is 0, the `EXECUTE` and `ALTER ROUTINE` privileges are not automatically granted to and dropped from the routine creator.

* The creator of a routine is the account used to execute the `CREATE` statement for it. This might not be the same as the account named as the `DEFINER` in the routine definition.

* The account named as a routine `DEFINER` can see all routine properties, including its definition. The account thus has full access to the routine output as produced by:

  + The contents of the Information Schema `ROUTINES` table.

  + The `SHOW CREATE FUNCTION` and `SHOW CREATE PROCEDURE` statements.

  + The `SHOW FUNCTION CODE` and `SHOW PROCEDURE CODE` statements.

  + The `SHOW FUNCTION STATUS` and `SHOW PROCEDURE STATUS` statements.

* For an account other than the account named as the routine `DEFINER`, access to routine properties depends on the privileges granted to the account:

  + With the `SHOW_ROUTINE` privilege or the global `SELECT` privilege, the account can see all routine properties, including its definition.

  + With the `CREATE ROUTINE`, `ALTER ROUTINE` or `EXECUTE` privilege granted at a scope that includes the routine, the account can see all routine properties except its definition.
