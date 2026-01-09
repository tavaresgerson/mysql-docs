### 28.4.15 The INFORMATION_SCHEMA INNODB_FT_CONFIG Table

The `INNODB_FT_CONFIG` table provides metadata about the `FULLTEXT` index and associated processing for an `InnoDB` table.

This table is empty initially. Before querying it, set the value of the `innodb_ft_aux_table` system variable to the name (including the database name) of the table that contains the `FULLTEXT` index (for example, `test/articles`).

For related usage information and examples, see Section 17.15.4, “InnoDB INFORMATION_SCHEMA FULLTEXT Index Tables”.

The `INNODB_FT_CONFIG` table has these columns:

* `KEY`

  The name designating an item of metadata for an `InnoDB` table containing a `FULLTEXT` index.

  The values for this column might change, depending on the needs for performance tuning and debugging for `InnoDB` full-text processing. The key names and their meanings include:

  + `optimize_checkpoint_limit`: The number of seconds after which an `OPTIMIZE TABLE` run stops.

  + `synced_doc_id`: The next `DOC_ID` to be issued.

  + `stopword_table_name`: The *`database/table`* name for a user-defined stopword table. The `VALUE` column is empty if there is no user-defined stopword table.

  + `use_stopword`: Indicates whether a stopword table is used, which is defined when the `FULLTEXT` index is created.

* `VALUE`

  The value associated with the corresponding `KEY` column, reflecting some limit or current value for an aspect of a `FULLTEXT` index for an `InnoDB` table.

#### Example

```
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FT_CONFIG;
+---------------------------+-------------------+
| KEY                       | VALUE             |
+---------------------------+-------------------+
| optimize_checkpoint_limit | 180               |
| synced_doc_id             | 0                 |
| stopword_table_name       | test/my_stopwords |
| use_stopword              | 1                 |
+---------------------------+-------------------+
```

#### Notes

* This table is intended only for internal configuration. It is not intended for statistical information purposes.

* You must have the `PROCESS` privilege to query this table.

* Use the `INFORMATION_SCHEMA` `COLUMNS` table or the `SHOW COLUMNS` statement to view additional information about the columns of this table, including data types and default values.

* For more information about `InnoDB` `FULLTEXT` search, see Section 17.6.2.4, “InnoDB Full-Text Indexes”, and Section 14.9, “Full-Text Search Functions”.
