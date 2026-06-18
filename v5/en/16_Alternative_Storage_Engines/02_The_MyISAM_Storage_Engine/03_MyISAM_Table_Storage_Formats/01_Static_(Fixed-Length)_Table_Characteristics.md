#### 15.2.3.1 Static (Fixed-Length) Table Characteristics

Static format is the default for `MyISAM`
tables. It is used when the table contains no variable-length
columns ([`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"),
[`VARBINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types"),
[`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types"), or
[`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types")). Each row is stored using a
fixed number of bytes.

Of the three `MyISAM` storage formats, static
format is the simplest and most secure (least subject to
corruption). It is also the fastest of the on-disk formats due
to the ease with which rows in the data file can be found on
disk: To look up a row based on a row number in the index,
multiply the row number by the row length to calculate the row
position. Also, when scanning a table, it is very easy to read a
constant number of rows with each disk read operation.

The security is evidenced if your computer crashes while the
MySQL server is writing to a fixed-format
`MyISAM` file. In this case,
[**myisamchk**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility") can easily determine where each row
starts and ends, so it can usually reclaim all rows except the
partially written one. `MyISAM` table indexes
can always be reconstructed based on the data rows.

Note

Fixed-length row format is only available for tables without
[`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") or
[`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") columns. Creating a table
with these columns with an explicit
`ROW_FORMAT` clause does not raise an error
or warning; the format specification is ignored.

Static-format tables have these characteristics:

* [`CHAR`](char.html "11.3.2 The CHAR and VARCHAR Types") and
  [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types") columns are
  space-padded to the specified column width, although the
  column type is not altered.
  [`BINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types") and
  [`VARBINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types") columns are padded
  with `0x00` bytes to the column width.

* `NULL` columns require additional space in
  the row to record whether their values are
  `NULL`. Each `NULL` column
  takes one bit extra, rounded up to the nearest byte.

* Very quick.
* Easy to cache.
* Easy to reconstruct after a crash, because rows are located
  in fixed positions.

* Reorganization is unnecessary unless you delete a huge
  number of rows and want to return free disk space to the
  operating system. To do this, use
  [`OPTIMIZE TABLE`](optimize-table.html "13.7.2.4 OPTIMIZE TABLE Statement") or
  [**myisamchk -r**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility").

* Usually require more disk space than dynamic-format tables.
* The expected row length in bytes for static-sized rows is
  calculated using the following expression:

  ```sql
  row length = 1
               + (sum of column lengths)
               + (number of NULL columns + delete_flag + 7)/8
               + (number of variable-length columns)
  ```

  *`delete_flag`* is 1 for tables with
  static row format. Static tables use a bit in the row record
  for a flag that indicates whether the row has been deleted.
  *`delete_flag`* is 0 for dynamic
  tables because the flag is stored in the dynamic row header.