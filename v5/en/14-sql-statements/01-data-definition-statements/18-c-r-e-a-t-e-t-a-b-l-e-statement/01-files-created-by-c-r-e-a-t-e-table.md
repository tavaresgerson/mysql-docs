#### 13.1.18.1 Files Created by CREATE TABLE

MySQL represents each table by an `.frm` table format (definition) file in the database directory. The storage engine for the table might create other files as well.

For an `InnoDB` table created in a file-per-table tablespace or general tablespace, table data and associated indexes are stored in a [.ibd file](glossary.html#glos_ibd_file ".ibd file") in the database directory. When an `InnoDB` table is created in the system tablespace, table data and indexes are stored in the [ibdata\* files](glossary.html#glos_ibdata_file "ibdata file") that represent the system tablespace. The [`innodb_file_per_table`](innodb-parameters.html#sysvar_innodb_file_per_table) option controls whether tables are created in file-per-table tablespaces or the system tablespace, by default. The `TABLESPACE` option can be used to place a table in a file-per-table tablespace, general tablespace, or the system tablespace, regardless of the [`innodb_file_per_table`](innodb-parameters.html#sysvar_innodb_file_per_table) setting.

For `MyISAM` tables, the storage engine creates data and index files. Thus, for each `MyISAM` table *`tbl_name`*, there are three disk files.

<table summary="The purpose of MyISAM table tbl_name disk files."><thead><tr> <th>File</th> <th>Purpose</th> </tr></thead><tbody><tr> <td><code><em class="replaceable"><code>tbl_name</code></em>.frm</code></td> <td>Table format (definition) file</td> </tr><tr> <td><code><em class="replaceable"><code>tbl_name</code></em>.MYD</code></td> <td>Data file</td> </tr><tr> <td><code><em class="replaceable"><code>tbl_name</code></em>.MYI</code></td> <td>Index file</td> </tr></tbody></table>

[Chapter 15, *Alternative Storage Engines*](storage-engines.html "Chapter 15 Alternative Storage Engines"), describes what files each storage engine creates to represent tables. If a table name contains special characters, the names for the table files contain encoded versions of those characters as described in [Section 9.2.4, “Mapping of Identifiers to File Names”](identifier-mapping.html "9.2.4 Mapping of Identifiers to File Names").

##### Limits Imposed by .frm File Structure

As described previously, each table has an `.frm` file that contains the table definition. The server uses the following expression to check some of the table information stored in the file against an upper limit of 64KB:

```sql
if (info_length+(ulong) create_fields.elements*FCOMP+288+
    n_length+int_length+com_length > 65535L || int_count > 255)
```

The portion of the information stored in the `.frm` file that is checked against the expression cannot grow beyond the 64KB limit, so if the table definition reaches this size, no more columns can be added.

The relevant factors in the expression are:

* `info_length` is space needed for “screens.” This is related to MySQL's Unireg heritage.

* `create_fields.elements` is the number of columns.

* `FCOMP` is 17.
* `n_length` is the total length of all column names, including one byte per name as a separator.

* `int_length` is related to the list of values for [`ENUM`](enum.html "11.3.5 The ENUM Type") and [`SET`](set.html "11.3.6 The SET Type") columns. In this context, “int” does not mean “integer.” It means “interval,” a term that refers collectively to [`ENUM`](enum.html "11.3.5 The ENUM Type") and [`SET`](set.html "11.3.6 The SET Type") columns.

* `int_count` is the number of unique [`ENUM`](enum.html "11.3.5 The ENUM Type") and [`SET`](set.html "11.3.6 The SET Type") definitions.

* `com_length` is the total length of column comments.

The expression just described has several implications for permitted table definitions:

* Using long column names can reduce the maximum number of columns, as can the inclusion of [`ENUM`](enum.html "11.3.5 The ENUM Type") or [`SET`](set.html "11.3.6 The SET Type") columns, or use of column comments.

* A table can have no more than 255 unique [`ENUM`](enum.html "11.3.5 The ENUM Type") and [`SET`](set.html "11.3.6 The SET Type") definitions. Columns with identical element lists are considered the same against this limt. For example, if a table contains these two columns, they count as one (not two) toward this limit because the definitions are identical:

  ```sql
  e1 ENUM('a','b','c')
  e2 ENUM('a','b','c')
  ```

* The sum of the length of element names in the unique [`ENUM`](enum.html "11.3.5 The ENUM Type") and [`SET`](set.html "11.3.6 The SET Type") definitions counts toward the 64KB limit, so although the theoretical limit on number of elements in a given [`ENUM`](enum.html "11.3.5 The ENUM Type") column is 65,535, the practical limit is less than 3000.
