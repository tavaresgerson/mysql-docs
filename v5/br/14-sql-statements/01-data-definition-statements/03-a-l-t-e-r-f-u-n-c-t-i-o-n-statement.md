### 13.1.3 ALTER FUNCTION Statement

```sql
ALTER FUNCTION func_name [characteristic ...]

characteristic: {
    COMMENT 'string'
  | LANGUAGE SQL
  | { CONTAINS SQL | NO SQL | READS SQL DATA | MODIFIES SQL DATA }
  | SQL SECURITY { DEFINER | INVOKER }
}
```

This statement can be used to change the characteristics of a stored function. More than one change may be specified in an [`ALTER FUNCTION`](alter-function.html "13.1.3 ALTER FUNCTION Statement") statement. However, you cannot change the parameters or body of a stored function using this statement; to make such changes, you must drop and re-create the function using [`DROP FUNCTION`](drop-function.html "13.1.24 DROP FUNCTION Statement") and [`CREATE FUNCTION`](create-function.html "13.1.13 CREATE FUNCTION Statement").

You must have the [`ALTER ROUTINE`](privileges-provided.html#priv_alter-routine) privilege for the function. (That privilege is granted automatically to the function creator.) If binary logging is enabled, the [`ALTER FUNCTION`](alter-function.html "13.1.3 ALTER FUNCTION Statement") statement might also require the [`SUPER`](privileges-provided.html#priv_super) privilege, as described in [Section 23.7, “Stored Program Binary Logging”](stored-programs-logging.html "23.7 Stored Program Binary Logging").
