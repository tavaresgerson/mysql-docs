#### 30.4.5.22 The version\_patch() Function

This function returns the patch release version of the MySQL server.

##### Parameters

None.

##### Return Value

A `TINYINT UNSIGNED` value.

##### Example

```
mysql> SELECT VERSION(), sys.version_patch();
+-----------+---------------------+
| VERSION() | sys.version_patch() |
+-----------+---------------------+
| 9.4.0     |                   0 |
+-----------+---------------------+
```
