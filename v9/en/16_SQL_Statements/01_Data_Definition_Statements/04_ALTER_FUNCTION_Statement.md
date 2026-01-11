### 15.1.4 ALTER FUNCTION Statement

```
ALTER FUNCTION func_name [characteristic ...]

characteristic: {
    COMMENT 'string'
  | LANGUAGE {SQL | JAVASCRIPT}
  | { CONTAINS SQL | NO SQL | READS SQL DATA | MODIFIES SQL DATA }
  | SQL SECURITY { DEFINER | INVOKER }
  | USING([library_reference][, library_reference][, ...])
}
```

This statement can be used to change the characteristics of a stored function. More than one change may be specified in an `ALTER FUNCTION` statement. However, you cannot change the parameters or body of a stored function using this statement; to make such changes, you must drop and re-create the function using `DROP FUNCTION` and `CREATE FUNCTION`.

You must have the `ALTER ROUTINE` privilege for the function. (That privilege is granted automatically to the function creator.) If binary logging is enabled, the `ALTER FUNCTION` statement might also require the `SUPER` privilege, as described in Section 27.9, “Stored Program Binary Logging”.

The `USING` clause is specific to stored programs written in JavaScript (see Section 27.3, “JavaScript Stored Programs”), and allows you to specify a list of zero or more libraries to be imported by the stored function, causing any previous such list to be removed, just as it does with `ALTER PROCEDURE`. See Section 15.1.9, “ALTER PROCEDURE Statement”, for more detailed information.
