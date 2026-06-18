### 28.4.11 The INFORMATION\_SCHEMA INNODB\_FIELDS Table

The [`INNODB_FIELDS`](information-schema-innodb-fields-table.html "28.4.11 The INFORMATION_SCHEMA INNODB_FIELDS Table") table provides
metadata about the key columns (fields) of
`InnoDB` indexes.

For related usage information and examples, see
[Section 17.15.3, “InnoDB INFORMATION\_SCHEMA Schema Object Tables”](innodb-information-schema-system-tables.html "17.15.3 InnoDB INFORMATION_SCHEMA Schema Object Tables").

The [`INNODB_FIELDS`](information-schema-innodb-fields-table.html "28.4.11 The INFORMATION_SCHEMA INNODB_FIELDS Table") table has these
columns:

* `INDEX_ID`

  An identifier for the index associated with this key field;
  the same value as `INNODB_INDEXES.INDEX_ID`.

* `NAME`

  The name of the original column from the table; the same value
  as `INNODB_COLUMNS.NAME`.

* `POS`

  The ordinal position of the key field within the index,
  starting from 0 and incrementing sequentially. When a column
  is dropped, the remaining columns are reordered so that the
  sequence has no gaps.

#### Example

```
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FIELDS WHERE INDEX_ID = 117\G
*************************** 1. row ***************************
INDEX_ID: 117
    NAME: col1
     POS: 0
```

#### Notes

* You must have the [`PROCESS`](privileges-provided.html#priv_process)
  privilege to query this table.

* Use the `INFORMATION_SCHEMA`
  [`COLUMNS`](information-schema-columns-table.html "28.3.8 The INFORMATION_SCHEMA COLUMNS Table") table or the
  [`SHOW COLUMNS`](show-columns.html "15.7.7.5 SHOW COLUMNS Statement") statement to view
  additional information about the columns of this table,
  including data types and default values.