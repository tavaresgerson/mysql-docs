#### 13.7.5.22 SHOW INDEX Statement

```sql
SHOW {INDEX | INDEXES | KEYS}
    {FROM | IN} tbl_name
    [{FROM | IN} db_name]
    [WHERE expr]
```

[`SHOW INDEX`](show-index.html "13.7.5.22 SHOW INDEX Statement") returns table index information. The format resembles that of the `SQLStatistics` call in ODBC. This statement requires some privilege for any column in the table.

```sql
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
```

An alternative to `tbl_name FROM db_name` syntax is *`db_name`*.*`tbl_name`*. These two statements are equivalent:

```sql
SHOW INDEX FROM mytable FROM mydb;
SHOW INDEX FROM mydb.mytable;
```

The `WHERE` clause can be given to select rows using more general conditions, as discussed in [Section 24.8, “Extensions to SHOW Statements”](extended-show.html "24.8 Extensions to SHOW Statements").

[`SHOW INDEX`](show-index.html "13.7.5.22 SHOW INDEX Statement") returns the following fields:

* `Table`

  The name of the table.

* `Non_unique`

  0 if the index cannot contain duplicates, 1 if it can.

* `Key_name`

  The name of the index. If the index is the primary key, the name is always `PRIMARY`.

* `Seq_in_index`

  The column sequence number in the index, starting with 1.

* `Column_name`

  The name of the column.

* `Collation`

  How the column is sorted in the index. This can have values `A` (ascending) or `NULL` (not sorted).

* `Cardinality`

  An estimate of the number of unique values in the index. To update this number, run [`ANALYZE TABLE`](analyze-table.html "13.7.2.1 ANALYZE TABLE Statement") or (for `MyISAM` tables) [**myisamchk -a**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility").

  `Cardinality` is counted based on statistics stored as integers, so the value is not necessarily exact even for small tables. The higher the cardinality, the greater the chance that MySQL uses the index when doing joins.

* `Sub_part`

  The index prefix. That is, the number of indexed characters if the column is only partly indexed, `NULL` if the entire column is indexed.

  Note

  Prefix *limits* are measured in bytes. However, prefix *lengths* for index specifications in [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement"), [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement"), and [`CREATE INDEX`](create-index.html "13.1.14 CREATE INDEX Statement") statements are interpreted as number of characters for nonbinary string types ([`CHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types")) and number of bytes for binary string types ([`BINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types"), [`VARBINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types"), [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types")). Take this into account when specifying a prefix length for a nonbinary string column that uses a multibyte character set.

  For additional information about index prefixes, see [Section 8.3.4, “Column Indexes”](column-indexes.html "8.3.4 Column Indexes"), and [Section 13.1.14, “CREATE INDEX Statement”](create-index.html "13.1.14 CREATE INDEX Statement").

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

Information about table indexes is also available from the `INFORMATION_SCHEMA` [`STATISTICS`](information-schema-statistics-table.html "24.3.24 The INFORMATION_SCHEMA STATISTICS Table") table. See [Section 24.3.24, “The INFORMATION\_SCHEMA STATISTICS Table”](information-schema-statistics-table.html "24.3.24 The INFORMATION_SCHEMA STATISTICS Table").

You can list a table's indexes with the [**mysqlshow -k *`db_name`* *`tbl_name`***](mysqlshow.html "4.5.7 mysqlshow — Display Database, Table, and Column Information") command.
