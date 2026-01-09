## 13.9 Using Data Types from Other Database Engines

To facilitate the use of code written for SQL implementations from other vendors, MySQL maps data types as shown in the following table. These mappings make it easier to import table definitions from other database systems into MySQL.

<table summary="Mapping of MySQL data types to data types from other vendors."><col style="width: 35%"/><col style="width: 55%"/><thead><tr> <th>Other Vendor Type</th> <th>MySQL Type</th> </tr></thead><tbody><tr> <td><code class="literal">BOOL</code></td> <td><code class="literal">TINYINT</code></td> </tr><tr> <td><code class="literal">BOOLEAN</code></td> <td><code class="literal">TINYINT</code></td> </tr><tr> <td><code class="literal">CHARACTER VARYING(<em class="replaceable"><code>M</code></em>)</code></td> <td><code class="literal">VARCHAR(<em class="replaceable"><code>M</code></em>)</code></td> </tr><tr> <td><code class="literal">FIXED</code></td> <td><code class="literal">DECIMAL</code></td> </tr><tr> <td><code class="literal">FLOAT4</code></td> <td><code class="literal">FLOAT</code></td> </tr><tr> <td><code class="literal">FLOAT8</code></td> <td><code class="literal">DOUBLE</code></td> </tr><tr> <td><code class="literal">INT1</code></td> <td><code class="literal">TINYINT</code></td> </tr><tr> <td><code class="literal">INT2</code></td> <td><code class="literal">SMALLINT</code></td> </tr><tr> <td><code class="literal">INT3</code></td> <td><code class="literal">MEDIUMINT</code></td> </tr><tr> <td><code class="literal">INT4</code></td> <td><code class="literal">INT</code></td> </tr><tr> <td><code class="literal">INT8</code></td> <td><code class="literal">BIGINT</code></td> </tr><tr> <td><code class="literal">LONG VARBINARY</code></td> <td><code class="literal">MEDIUMBLOB</code></td> </tr><tr> <td><code class="literal">LONG VARCHAR</code></td> <td><code class="literal">MEDIUMTEXT</code></td> </tr><tr> <td><code class="literal">LONG</code></td> <td><code class="literal">MEDIUMTEXT</code></td> </tr><tr> <td><code class="literal">MIDDLEINT</code></td> <td><code class="literal">MEDIUMINT</code></td> </tr><tr> <td><code class="literal">NUMERIC</code></td> <td><code class="literal">DECIMAL</code></td> </tr></tbody></table>

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
