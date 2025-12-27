#### 26.4.5.20 The version\_major() Function

This function returns the major version of the MySQL server.

##### Parameters

None.

##### Return Value

A `TINYINT UNSIGNED` value.

##### Example

```sql
mysql> SELECT VERSION(), sys.version_major();
+------------------+---------------------+
| VERSION()        | sys.version_major() |
+------------------+---------------------+
| 5.7.24-debug-log |                   5 |
+------------------+---------------------+
```
