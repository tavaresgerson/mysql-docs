#### 15.7.7.22 SHOW INDEX Statement

```
SHOW [EXTENDED] {INDEX | INDEXES | KEYS}
    {FROM | IN} tbl_name
    [{FROM | IN} db_name]
    [WHERE expr]
```

`SHOW INDEX` returns table index information. The format resembles that of the `SQLStatistics` call in ODBC. This statement requires some privilege for any column in the table.

```
mysql> SHOW INDEX FROM City\G
*************************** 1. row ***************************
        Table: city
   Non_unique: 0
     Key_name: PRIMARY
 Seq_in_index: 1
  Column_name: ID
    Collation: A
  Cardinality: 4188
     Sub_part: NULL
       Packed: NULL
         Null:
   Index_type: BTREE
      Comment:
Index_comment:
      Visible: YES
   Expression: NULL
*************************** 2. row ***************************
        Table: city
   Non_unique: 1
     Key_name: CountryCode
 Seq_in_index: 1
  Column_name: CountryCode
    Collation: A
  Cardinality: 232
     Sub_part: NULL
       Packed: NULL
         Null:
   Index_type: BTREE
      Comment:
Index_comment:
      Visible: YES
   Expression: NULL
```

An alternative to `tbl_name FROM db_name` syntax is *`db_name`*.*`tbl_name`*. These two statements are equivalent:

```
SHOW INDEX FROM mytable FROM mydb;
SHOW INDEX FROM mydb.mytable;
```

The optional `EXTENDED` keyword causes the output to include information about hidden indexes that MySQL uses internally and are not accessible by users.

The `WHERE` clause can be given to select rows using more general conditions, as discussed in Section 28.8, “Extensions to SHOW Statements”.

`SHOW INDEX` returns the following fields:

* `Table`

  The name of the table.

* `Non_unique`

  0 if the index cannot contain duplicates, 1 if it can.

* `Key_name`

  The name of the index. If the index is the primary key, the name is always `PRIMARY`.

* `Seq_in_index`

  The column sequence number in the index, starting with 1.

* `Column_name`

  The column name. See also the description for the `Expression` column.

* `Collation`

  How the column is sorted in the index. This can have values `A` (ascending), `D` (descending), or `NULL` (not sorted).

* `Cardinality`

  An estimate of the number of unique values in the index. To update this number, run `ANALYZE TABLE` or (for `MyISAM` tables) **myisamchk -a**.

  `Cardinality` is counted based on statistics stored as integers, so the value is not necessarily exact even for small tables. The higher the cardinality, the greater the chance that MySQL uses the index when doing joins.

* `Sub_part`

  The index prefix. That is, the number of indexed characters if the column is only partly indexed, `NULL` if the entire column is indexed.

  Note

  Prefix *limits* are measured in bytes. However, prefix *lengths* for index specifications in `CREATE TABLE`, `ALTER TABLE`, and `CREATE INDEX` statements are interpreted as number of characters for nonbinary string types (`CHAR`, `VARCHAR`, `TEXT`) and number of bytes for binary string types (`BINARY`, `VARBINARY`, `BLOB`). Take this into account when specifying a prefix length for a nonbinary string column that uses a multibyte character set.

  For additional information about index prefixes, see Section 10.3.5, “Column Indexes”, and Section 15.1.15, “CREATE INDEX Statement”.

* `Packed`

  Indicates how the key is packed. `NULL` if it is not.

* `Null`

  Contains `YES` if the column may contain `NULL` values and `''` if not.

* `Index_type`

  The index method used (`BTREE`, `FULLTEXT`, `HASH`, `RTREE`).

* `Comment`

  Information about the index not described in its own column, such as `disabled` if the index is disabled.

* `Index_comment`

  Any comment provided for the index with a `COMMENT` attribute when the index was created.

* `Visible`

  Whether the index is visible to the optimizer. See Section 10.3.12, “Invisible Indexes”.

* `Expression`

  MySQL 8.0.13 and higher supports functional key parts (see Functional Key Parts), which affects both the `Column_name` and `Expression` columns:

  + For a nonfunctional key part, `Column_name` indicates the column indexed by the key part and `Expression` is `NULL`.

  + For a functional key part, `Column_name` column is `NULL` and `Expression` indicates the expression for the key part.

Information about table indexes is also available from the `INFORMATION_SCHEMA` `STATISTICS` table. See Section 28.3.34, “The INFORMATION_SCHEMA STATISTICS Table”. The extended information about hidden indexes is available only using `SHOW EXTENDED INDEX`; it cannot be obtained from the `STATISTICS` table.

You can list a table's indexes with the **mysqlshow -k *`db_name`* *`tbl_name`*** command.

In MySQL 8.0.30 and later, `SHOW INDEX` includes the table's generated invisible key, if it has one, by default. You can cause this information to be suppressed in the statement's output by setting `show_gipk_in_create_table_and_information_schema = OFF`. For more information, see Section 15.1.20.11, “Generated Invisible Primary Keys”.
