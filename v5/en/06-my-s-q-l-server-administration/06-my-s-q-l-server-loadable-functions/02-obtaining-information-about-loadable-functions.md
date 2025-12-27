### 5.6.2 Obtaining Information About Loadable Functions

The `mysql.func` system table shows which loadable functions have been registered using [`CREATE FUNCTION`](create-function.html "13.1.13 CREATE FUNCTION Statement"):

```sql
SELECT * FROM mysql.func;
```

The `func` table has these columns:

* `name`

  The function name as referred to in SQL statements.

* `ret`

  The function return value type. Permitted values are 0 (`STRING`), 1 (`REAL`), 2 (`INTEGER`), 3 (`ROW`), or 4 (`DECIMAL`).

* `dl`

  The name of the function library file containing the executable function code. The file is located in the directory named by the [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir) system variable.

* `type`

  The function type, either `function` (scalar) or `aggregate`.
