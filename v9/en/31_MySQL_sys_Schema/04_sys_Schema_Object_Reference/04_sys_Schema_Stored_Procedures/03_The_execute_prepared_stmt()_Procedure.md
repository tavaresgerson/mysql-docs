#### 30.4.4.3 The execute\_prepared\_stmt() Procedure

Given an SQL statement as a string, executes it as a prepared statement. The prepared statement is deallocated after execution, so it is not subject to reuse. Thus, this procedure is useful primarily for executing dynamic statements on a one-time basis.

This procedure uses `sys_execute_prepared_stmt` as the prepared statement name. If that statement name exists when the procedure is called, its previous content is destroyed.

##### Parameters

* `in_query LONGTEXT CHARACTER SET utf8mb3`: The statement string to execute.

##### Configuration Options

`execute_prepared_stmt()` Procedure") operation can be modified using the following configuration options or their corresponding user-defined variables (see Section 30.4.2.1, “The sys\_config Table”):

* `debug`, `@sys.debug`

  If this option is `ON`, produce debugging output. The default is `OFF`.

##### Example

```
mysql> CALL sys.execute_prepared_stmt('SELECT COUNT(*) FROM mysql.user');
+----------+
| COUNT(*) |
+----------+
|       15 |
+----------+
```
