#### 26.4.5.22 The version_patch() Function

This function returns the patch release version of the MySQL server.

##### Parameters

None.

##### Return Value

A `TINYINT UNSIGNED` value.

##### Example

```sql
mysql> SELECT VERSION(), sys.version_patch();
+------------------+---------------------+
| VERSION()        | sys.version_patch() |
+------------------+---------------------+
| 5.7.24-debug-log |                  24 |
+------------------+---------------------+
```
