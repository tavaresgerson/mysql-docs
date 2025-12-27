### 13.1.6 ALTER PROCEDURE Statement

```sql
ALTER PROCEDURE proc_name [characteristic ...]

characteristic: {
    COMMENT 'string'
  | LANGUAGE SQL
  | { CONTAINS SQL | NO SQL | READS SQL DATA | MODIFIES SQL DATA }
  | SQL SECURITY { DEFINER | INVOKER }
}
```

This statement can be used to change the characteristics of a stored procedure. More than one change may be specified in an [`ALTER PROCEDURE`](alter-procedure.html "13.1.6 ALTER PROCEDURE Statement") statement. However, you cannot change the parameters or body of a stored procedure using this statement; to make such changes, you must drop and re-create the procedure using [`DROP PROCEDURE`](drop-procedure.html "13.1.27 DROP PROCEDURE and DROP FUNCTION Statements") and [`CREATE PROCEDURE`](create-procedure.html "13.1.16 CREATE PROCEDURE and CREATE FUNCTION Statements").

You must have the [`ALTER ROUTINE`](privileges-provided.html#priv_alter-routine) privilege for the procedure. By default, that privilege is granted automatically to the procedure creator. This behavior can be changed by disabling the [`automatic_sp_privileges`](server-system-variables.html#sysvar_automatic_sp_privileges) system variable. See [Section 23.2.2, “Stored Routines and MySQL Privileges”](stored-routines-privileges.html "23.2.2 Stored Routines and MySQL Privileges").
