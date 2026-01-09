### 28.3.38 The INFORMATION_SCHEMA SCHEMATA_EXTENSIONS Table

The `SCHEMATA_EXTENSIONS` table augments the `SCHEMATA` table with information about schema options.

The `SCHEMATA_EXTENSIONS` table has these columns:

* `CATALOG_NAME`

  The name of the catalog to which the schema belongs. This value is always `def`.

* `SCHEMA_NAME`

  The name of the schema.

* `OPTIONS`

  The options for the schema. If the schema is read only, the value contains `READ ONLY=1`. If the schema is not read only, no `READ ONLY` option appears.

#### Example

```
mysql> ALTER SCHEMA mydb READ ONLY = 1;
mysql> SELECT * FROM INFORMATION_SCHEMA.SCHEMATA_EXTENSIONS
       WHERE SCHEMA_NAME = 'mydb';
+--------------+-------------+-------------+
| CATALOG_NAME | SCHEMA_NAME | OPTIONS     |
+--------------+-------------+-------------+
| def          | mydb        | READ ONLY=1 |
+--------------+-------------+-------------+

mysql> ALTER SCHEMA mydb READ ONLY = 0;
mysql> SELECT * FROM INFORMATION_SCHEMA.SCHEMATA_EXTENSIONS
       WHERE SCHEMA_NAME = 'mydb';
+--------------+-------------+---------+
| CATALOG_NAME | SCHEMA_NAME | OPTIONS |
+--------------+-------------+---------+
| def          | mydb        |         |
+--------------+-------------+---------+
```

#### Notes

* `SCHEMATA_EXTENSIONS` is a nonstandard `INFORMATION_SCHEMA` table.
