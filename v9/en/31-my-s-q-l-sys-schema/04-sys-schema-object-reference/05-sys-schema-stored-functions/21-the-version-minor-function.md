#### 30.4.5.21 The version\_minor() Function

This function returns the minor version of the MySQL server.

##### Parameters

None.

##### Return Value

A `TINYINT UNSIGNED` value.

##### Example

```
mysql> SELECT VERSION(), sys.version_minor();
+-----------+---------------------+
| VERSION() | sys.version_minor() |
+-----------+---------------------+
| 9.4.0     |                   4 |
+-----------+---------------------+
```
