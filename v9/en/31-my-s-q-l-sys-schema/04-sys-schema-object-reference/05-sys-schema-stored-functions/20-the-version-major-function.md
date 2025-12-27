#### 30.4.5.20 The version\_major() Function

This function returns the major version of the MySQL server.

##### Parameters

None.

##### Return Value

A `TINYINT UNSIGNED` value.

##### Example

```
mysql> SELECT VERSION(), sys.version_major();
+-----------+---------------------+
| VERSION() | sys.version_major() |
+-----------+---------------------+
| 9.5.0     |                   9 |
+-----------+---------------------+
```
