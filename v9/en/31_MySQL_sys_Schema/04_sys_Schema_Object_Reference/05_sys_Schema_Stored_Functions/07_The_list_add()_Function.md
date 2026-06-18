#### 30.4.5.7 The list\_add() Function

Adds a value to a comma-separated list of values and returns
the result.

This function and [`list_drop()`](sys-list-drop.html "30.4.5.8 The list_drop() Function")
can be useful for manipulating the value of system variables
such as [`sql_mode`](server-system-variables.html#sysvar_sql_mode) and
[`optimizer_switch`](server-system-variables.html#sysvar_optimizer_switch) that take a
comma-separated list of values.

##### Parameters

* `in_list TEXT`: The list to be
  modified.

* `in_add_value TEXT`: The value to add
  to the list.

##### Return Value

A `TEXT` value.

##### Example

```
mysql> SELECT @@sql_mode;
+----------------------------------------+
| @@sql_mode                             |
+----------------------------------------+
| ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES |
+----------------------------------------+
mysql> SET @@sql_mode = sys.list_add(@@sql_mode, 'NO_ENGINE_SUBSTITUTION');
mysql> SELECT @@sql_mode;
+---------------------------------------------------------------+
| @@sql_mode                                                    |
+---------------------------------------------------------------+
| ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION |
+---------------------------------------------------------------+
mysql> SET @@sql_mode = sys.list_drop(@@sql_mode, 'ONLY_FULL_GROUP_BY');
mysql> SELECT @@sql_mode;
+--------------------------------------------+
| @@sql_mode                                 |
+--------------------------------------------+
| STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION |
+--------------------------------------------+
```