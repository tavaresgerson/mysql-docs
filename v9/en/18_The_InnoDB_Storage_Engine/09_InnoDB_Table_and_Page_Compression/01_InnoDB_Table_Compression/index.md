### 17.9.1 InnoDB Table Compression

This section describes `InnoDB` table
compression, which is supported with `InnoDB`
tables that reside in
[file\_per\_table](glossary.html#glos_file_per_table "file-per-table")
tablespaces or [general
tablespaces](glossary.html#glos_general_tablespace "general tablespace"). Table compression is enabled using the
`ROW_FORMAT=COMPRESSED` attribute with
[`CREATE TABLE`](create-table.html "15.1.24 CREATE TABLE Statement") or
[`ALTER TABLE`](alter-table.html "15.1.11 ALTER TABLE Statement").