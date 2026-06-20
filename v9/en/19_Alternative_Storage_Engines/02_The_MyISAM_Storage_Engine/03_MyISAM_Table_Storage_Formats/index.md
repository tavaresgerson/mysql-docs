### 18.2.3 MyISAM Table Storage Formats

`MyISAM` supports three different storage
formats. Two of them, fixed and dynamic format, are chosen
automatically depending on the type of columns you are using. The
third, compressed format, can be created only with the
[**myisampack**](myisampack.html "6.6.6 myisampack — Generate Compressed, Read-Only MyISAM Tables") utility (see
[Section 6.6.6, “myisampack — Generate Compressed, Read-Only MyISAM Tables”](myisampack.html "6.6.6 myisampack — Generate Compressed, Read-Only MyISAM Tables")).

When you use [`CREATE TABLE`](create-table.html "15.1.24 CREATE TABLE Statement") or
[`ALTER TABLE`](alter-table.html "15.1.11 ALTER TABLE Statement") for a table that has no
[`BLOB`](blob.html "13.3.4 The BLOB and TEXT Types") or
[`TEXT`](blob.html "13.3.4 The BLOB and TEXT Types") columns, you can force the
table format to `FIXED` or
`DYNAMIC` with the `ROW_FORMAT`
table option.

See [Section 15.1.24, “CREATE TABLE Statement”](create-table.html "15.1.24 CREATE TABLE Statement"), for information about
`ROW_FORMAT`.

You can decompress (unpack) compressed `MyISAM`
tables using [**myisamchk**](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility")
[`--unpack`](myisamchk-repair-options.html#option_myisamchk_unpack); see
[Section 6.6.4, “myisamchk — MyISAM Table-Maintenance Utility”](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility"), for more information.