#### 18.2.3.2 Dynamic Table Characteristics

Dynamic storage format is used if a `MyISAM`
table contains any variable-length columns
([`VARCHAR`](char.html "13.3.2 The CHAR and VARCHAR Types"),
[`VARBINARY`](binary-varbinary.html "13.3.3 The BINARY and VARBINARY Types"),
[`BLOB`](blob.html "13.3.4 The BLOB and TEXT Types"), or
[`TEXT`](blob.html "13.3.4 The BLOB and TEXT Types")), or if the table was
created with the `ROW_FORMAT=DYNAMIC` table
option.

Dynamic format is a little more complex than static format
because each row has a header that indicates how long it is. A
row can become fragmented (stored in noncontiguous pieces) when
it is made longer as a result of an update.

You can use [`OPTIMIZE TABLE`](optimize-table.html "15.7.3.4 OPTIMIZE TABLE Statement") or
[**myisamchk -r**](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility") to defragment a table. If you
have fixed-length columns that you access or change frequently
in a table that also contains some variable-length columns, it
might be a good idea to move the variable-length columns to
other tables just to avoid fragmentation.

Dynamic-format tables have these characteristics:

* All string columns are dynamic except those with a length
  less than four.

* Each row is preceded by a bitmap that indicates which
  columns contain the empty string (for string columns) or
  zero (for numeric columns). This does not include columns
  that contain `NULL` values. If a string
  column has a length of zero after trailing space removal, or
  a numeric column has a value of zero, it is marked in the
  bitmap and not saved to disk. Nonempty strings are saved as
  a length byte plus the string contents.

* `NULL` columns require additional space in
  the row to record whether their values are
  `NULL`. Each `NULL` column
  takes one bit extra, rounded up to the nearest byte.

* Much less disk space usually is required than for
  fixed-length tables.

* Each row uses only as much space as is required. However, if
  a row becomes larger, it is split into as many pieces as are
  required, resulting in row fragmentation. For example, if
  you update a row with information that extends the row
  length, the row becomes fragmented. In this case, you may
  have to run [`OPTIMIZE TABLE`](optimize-table.html "15.7.3.4 OPTIMIZE TABLE Statement") or
  [**myisamchk -r**](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility") from time to time to improve
  performance. Use [**myisamchk -ei**](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility") to obtain
  table statistics.

* More difficult than static-format tables to reconstruct
  after a crash, because rows may be fragmented into many
  pieces and links (fragments) may be missing.

* The expected row length for dynamic-sized rows is calculated
  using the following expression:

  ```
  3
  + (number of columns + 7) / 8
  + (number of char columns)
  + (packed size of numeric columns)
  + (length of strings)
  + (number of NULL columns + 7) / 8
  ```

  There is a penalty of 6 bytes for each link. A dynamic row
  is linked whenever an update causes an enlargement of the
  row. Each new link is at least 20 bytes, so the next
  enlargement probably goes in the same link. If not, another
  link is created. You can find the number of links using
  [**myisamchk -ed**](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility"). All links may be removed
  with [`OPTIMIZE TABLE`](optimize-table.html "15.7.3.4 OPTIMIZE TABLE Statement") or
  [**myisamchk -r**](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility").