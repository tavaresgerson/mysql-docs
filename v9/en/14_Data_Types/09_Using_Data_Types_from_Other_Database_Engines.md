## 13.9 Using Data Types from Other Database Engines

To facilitate the use of code written for SQL implementations from other vendors, MySQL maps data types as shown in the following table. These mappings make it easier to import table definitions from other database systems into MySQL.

<table summary="Mapping of MySQL data types to data types from other vendors."><thead><tr> <th>Other Vendor Type</th> <th>MySQL Type</th> </tr></thead><tbody><tr> <td><code>BOOL</code></td> <td><code>TINYINT</code></td> </tr><tr> <td><code>BOOLEAN</code></td> <td><code>TINYINT</code></td> </tr><tr> <td><code>CHARACTER VARYING(<em><code>M</code></em>)</code></td> <td><code>VARCHAR(<em><code>M</code></em>)</code></td> </tr><tr> <td><code>FIXED</code></td> <td><code>DECIMAL</code></td> </tr><tr> <td><code>FLOAT4</code></td> <td><code>FLOAT</code></td> </tr><tr> <td><code>FLOAT8</code></td> <td><code>DOUBLE</code></td> </tr><tr> <td><code>INT1</code></td> <td><code>TINYINT</code></td> </tr><tr> <td><code>INT2</code></td> <td><code>SMALLINT</code></td> </tr><tr> <td><code>INT3</code></td> <td><code>MEDIUMINT</code></td> </tr><tr> <td><code>INT4</code></td> <td><code>INT</code></td> </tr><tr> <td><code>INT8</code></td> <td><code>BIGINT</code></td> </tr><tr> <td><code>LONG VARBINARY</code></td> <td><code>MEDIUMBLOB</code></td> </tr><tr> <td><code>LONG VARCHAR</code></td> <td><code>MEDIUMTEXT</code></td> </tr><tr> <td><code>LONG</code></td> <td><code>MEDIUMTEXT</code></td> </tr><tr> <td><code>MIDDLEINT</code></td> <td><code>MEDIUMINT</code></td> </tr><tr> <td><code>NUMERIC</code></td> <td><code>DECIMAL</code></td> </tr></tbody></table>

Data type mapping occurs at table creation time, after which the original type specifications are discarded. If you create a table with types used by other vendors and then issue a `DESCRIBE tbl_name` statement, MySQL reports the table structure using the equivalent MySQL types. For example:

```
mysql> CREATE TABLE t (a BOOL, b FLOAT8, c LONG VARCHAR, d NUMERIC);
Query OK, 0 rows affected (0.00 sec)

mysql> DESCRIBE t;
+-------+---------------+------+-----+---------+-------+
| Field | Type          | Null | Key | Default | Extra |
+-------+---------------+------+-----+---------+-------+
| a     | tinyint(1)    | YES  |     | NULL    |       |
| b     | double        | YES  |     | NULL    |       |
| c     | mediumtext    | YES  |     | NULL    |       |
| d     | decimal(10,0) | YES  |     | NULL    |       |
+-------+---------------+------+-----+---------+-------+
4 rows in set (0.01 sec)
```
