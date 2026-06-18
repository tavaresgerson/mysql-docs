#### 15.7.7.24 SHOW INDEX Statement

```
SHOW [EXTENDED] {INDEX | INDEXES | KEYS}
    {FROM | IN} tbl_name
    [{FROM | IN} db_name]
    [WHERE expr]
```

[`SHOW INDEX`](show-index.html "15.7.7.24 SHOW INDEX Statement") returns table index
information. The format resembles that of the
`SQLStatistics` call in ODBC. This statement
requires some privilege for any column in the table.

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

An alternative to `tbl_name
FROM db_name` syntax is
*`db_name`*.*`tbl_name`*.
These two statements are equivalent:

```
SHOW INDEX FROM mytable FROM mydb;
SHOW INDEX FROM mydb.mytable;
```

The optional `EXTENDED` keyword causes the
output to include information about hidden indexes that MySQL
uses internally and are not accessible by users.

The `WHERE` clause can be given to select rows
using more general conditions, as discussed in
[Section 28.8, “Extensions to SHOW Statements”](extended-show.html "28.8 Extensions to SHOW Statements").

[`SHOW INDEX`](show-index.html "15.7.7.24 SHOW INDEX Statement") returns the following
fields:

* `Table`

  The name of the table.

* `Non_unique`

  0 if the index cannot contain duplicates, 1 if it can.

* `Key_name`

  The name of the index. If the index is the primary key, the
  name is always `PRIMARY`.

* `Seq_in_index`

  The column sequence number in the index, starting with 1.

* `Column_name`

  The column name. See also the description for the
  `Expression` column.

* `Collation`

  How the column is sorted in the index. This can have values
  `A` (ascending), `D`
  (descending), or `NULL` (not sorted).

* `Cardinality`

  An estimate of the number of unique values in the index. To
  update this number, run [`ANALYZE
  TABLE`](analyze-table.html "15.7.3.1 ANALYZE TABLE Statement") or (for `MyISAM` tables)
  [**myisamchk -a**](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility").

  `Cardinality` is counted based on
  statistics stored as integers, so the value is not
  necessarily exact even for small tables. The higher the
  cardinality, the greater the chance that MySQL uses the
  index when doing joins.

* `Sub_part`

  The index prefix. That is, the number of indexed characters
  if the column is only partly indexed,
  `NULL` if the entire column is indexed.

  Note

  Prefix *limits* are measured in bytes.
  However, prefix *lengths* for index
  specifications in [`CREATE
  TABLE`](create-table.html "15.1.24 CREATE TABLE Statement"), [`ALTER
  TABLE`](alter-table.html "15.1.11 ALTER TABLE Statement"), and [`CREATE
  INDEX`](create-index.html "15.1.18 CREATE INDEX Statement") statements are interpreted as number of
  characters for nonbinary string types
  ([`CHAR`](char.html "13.3.2 The CHAR and VARCHAR Types"),
  [`VARCHAR`](char.html "13.3.2 The CHAR and VARCHAR Types"),
  [`TEXT`](blob.html "13.3.4 The BLOB and TEXT Types")) and number of bytes
  for binary string types
  ([`BINARY`](binary-varbinary.html "13.3.3 The BINARY and VARBINARY Types"),
  [`VARBINARY`](binary-varbinary.html "13.3.3 The BINARY and VARBINARY Types"),
  [`BLOB`](blob.html "13.3.4 The BLOB and TEXT Types")). Take this into
  account when specifying a prefix length for a nonbinary
  string column that uses a multibyte character set.

  For additional information about index prefixes, see
  [Section 10.3.5, “Column Indexes”](column-indexes.html "10.3.5 Column Indexes"), and
  [Section 15.1.18, “CREATE INDEX Statement”](create-index.html "15.1.18 CREATE INDEX Statement").

* `Packed`

  Indicates how the key is packed. `NULL` if
  it is not.

* `Null`

  Contains `YES` if the column may contain
  `NULL` values and `''` if
  not.

* `Index_type`

  The index method used (`BTREE`,
  `FULLTEXT`, `HASH`,
  `RTREE`).

* `Comment`

  Information about the index not described in its own column,
  such as `disabled` if the index is
  disabled.

* `Index_comment`

  Any comment provided for the index with a
  `COMMENT` attribute when the index was
  created.

* `Visible`

  Whether the index is visible to the optimizer. See
  [Section 10.3.12, “Invisible Indexes”](invisible-indexes.html "10.3.12 Invisible Indexes").

* `Expression`

  MySQL supports functional key parts (see
  [Functional Key Parts](create-index.html#create-index-functional-key-parts "Functional Key Parts")); this
  affects both the `Column_name` and
  `Expression` columns:

  + For a nonfunctional key part,
    `Column_name` indicates the column
    indexed by the key part and
    `Expression` is
    `NULL`.

  + For a functional key part,
    `Column_name` column is
    `NULL` and
    `Expression` indicates the expression
    for the key part.

Information about table indexes is also available from the
`INFORMATION_SCHEMA`
[`STATISTICS`](information-schema-statistics-table.html "28.3.40 The INFORMATION_SCHEMA STATISTICS Table") table. See
[Section 28.3.40, “The INFORMATION\_SCHEMA STATISTICS Table”](information-schema-statistics-table.html "28.3.40 The INFORMATION_SCHEMA STATISTICS Table"). The
extended information about hidden indexes is available only
using `SHOW EXTENDED INDEX`; it cannot be
obtained from the [`STATISTICS`](information-schema-statistics-table.html "28.3.40 The INFORMATION_SCHEMA STATISTICS Table") table.

You can list a table's indexes with the [**mysqlshow -k
*`db_name`*
*`tbl_name`***](mysqlshow.html "6.5.6 mysqlshow — Display Database, Table, and Column Information") command.

`SHOW INDEX` includes the table's
generated invisible key, if it has one, by default. You can
cause this information to be suppressed in the statement's
output by setting
[`show_gipk_in_create_table_and_information_schema
= OFF`](server-system-variables.html#sysvar_show_gipk_in_create_table_and_information_schema). For more information, see
[Section 15.1.24.11, “Generated Invisible Primary Keys”](create-table-gipks.html "15.1.24.11 Generated Invisible Primary Keys").