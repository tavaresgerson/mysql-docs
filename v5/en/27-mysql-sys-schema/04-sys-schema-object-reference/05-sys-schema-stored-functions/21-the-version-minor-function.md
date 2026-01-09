#### 26.4.5.21 The version_minor() Function

This function returns the minor version of the MySQL server.

##### Parameters

None.

##### Return Value

A `TINYINT UNSIGNED` value.

##### Example

```sql
mysql> SELECT VERSION(), sys.version_minor();
+------------------+---------------------+
| VERSION()        | sys.version_minor() |
+------------------+---------------------+
| 5.7.24-debug-log |                   7 |
+------------------+---------------------+
```
