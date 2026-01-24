### 15.2.3 MyISAM Table Storage Formats

15.2.3.1 Static (Fixed-Length) Table Characteristics

15.2.3.2 Dynamic Table Characteristics

15.2.3.3 Compressed Table Characteristics

`MyISAM` supports three different storage formats. Two of them, fixed and dynamic format, are chosen automatically depending on the type of columns you are using. The third, compressed format, can be created only with the **myisampack** utility (see Section 4.6.5, “myisampack — Generate Compressed, Read-Only MyISAM Tables”).

When you use `CREATE TABLE` or `ALTER TABLE` for a table that has no `BLOB` or `TEXT` columns, you can force the table format to `FIXED` or `DYNAMIC` with the `ROW_FORMAT` table option.

See Section 13.1.18, “CREATE TABLE Statement”, for information about `ROW_FORMAT`.

You can decompress (unpack) compressed `MyISAM` tables using **myisamchk** `--unpack`; see Section 4.6.3, “myisamchk — MyISAM Table-Maintenance Utility”, for more information.
