### 10.14.2 Choosing a Collation ID

Each collation must have a unique ID. To add a collation, you
must choose an ID value that is not currently used. MySQL
supports two-byte collation IDs. The range of IDs from 1024 to
2047 is reserved for user-defined collations.

The collation ID that you choose appears in these contexts:

* The `ID` column of the Information Schema
  [`COLLATIONS`](information-schema-collations-table.html "24.3.3 The INFORMATION_SCHEMA COLLATIONS Table") table.

* The `Id` column of
  [`SHOW COLLATION`](show-collation.html "13.7.5.4 SHOW COLLATION Statement") output.

* The `charsetnr` member of the
  `MYSQL_FIELD` C API data structure.

* The `number` member of the
  `MY_CHARSET_INFO` data structure returned
  by the
  [`mysql_get_character_set_info()`](/doc/c-api/5.7/en/mysql-get-character-set-info.html)
  C API function.

To determine the largest currently used ID, issue the following
statement:

```sql
mysql> SELECT MAX(ID) FROM INFORMATION_SCHEMA.COLLATIONS;
+---------+
| MAX(ID) |
+---------+
|     247 |
+---------+
```

To display a list of all currently used IDs, issue this
statement:

```sql
mysql> SELECT ID FROM INFORMATION_SCHEMA.COLLATIONS ORDER BY ID;
+-----+
| ID  |
+-----+
|   1 |
|   2 |
| ... |
|  52 |
|  53 |
|  57 |
|  58 |
| ... |
|  98 |
|  99 |
| 128 |
| 129 |
| ... |
| 247 |
+-----+
```

Warning

Before upgrading, you should save the configuration files that
you change. If you upgrade in place, the process replaces the
modified files.