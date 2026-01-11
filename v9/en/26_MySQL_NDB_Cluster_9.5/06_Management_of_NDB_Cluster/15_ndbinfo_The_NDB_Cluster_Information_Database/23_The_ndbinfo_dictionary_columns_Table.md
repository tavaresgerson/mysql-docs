#### 25.6.15.23 The ndbinfo dictionary\_columns Table

The table provides `NDB` dictionary information about columns of `NDB` tables. `dictionary_columns` has the columns listed here (with brief descriptions):

* `table_id`

  ID of the table containing the column

* `column_id`

  The column's unique ID

* `name`

  Name of the column

* `column_type`

  Data type of the column from the NDB API; see Column::Type, for possible values

* `default_value`

  The column's default value, if any

* `nullable`

  Either of `NULL` or `NOT NULL`

* `array_type`

  The column's internal attribute storage format; one of `FIXED`, `SHORT_VAR`, or `MEDIUM_VAR`; for more information, see Column::ArrayType, in the NDB API documentation

* `storage_type`

  Type of storage used by the table; either of `MEMORY` or `DISK`

* `primary_key`

  `1` if this is a primary key column, otherwise `0`

* `partition_key`

  `1` if this is a partitioning key column, otherwise `0`

* `dynamic`

  `1` if the column is dynamic, otherwise `0`

* `auto_inc`

  `1` if this is an `AUTO_INCREMENT` column, otherwise `0`

You can obtain information about all of the columns in a given table by joining `dictionary_columns` with the `dictionary_tables` table, like this:

```
SELECT dc.*
  FROM dictionary_columns dc
JOIN dictionary_tables dt
  ON dc.table_id=dt.table_id
WHERE dt.table_name='t1'
  AND dt.database_name='mydb';
```

Note

Blob columns are not shown in this table. This is a known issue.
