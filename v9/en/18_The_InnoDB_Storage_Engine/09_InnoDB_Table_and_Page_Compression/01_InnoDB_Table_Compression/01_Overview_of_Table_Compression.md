#### 17.9.1.1 Overview of Table Compression

Because processors and cache memories have increased in speed
more than disk storage devices, many workloads are
[disk-bound](glossary.html#glos_disk_bound "disk-bound"). Data
[compression](/doc/refman/8.4/en/glossary.html#glos_compression) enables
smaller database size, reduced I/O, and improved throughput, at
the small cost of increased CPU utilization. Compression is
especially valuable for read-intensive applications, on systems
with enough RAM to keep frequently used data in memory.

An `InnoDB` table created with
`ROW_FORMAT=COMPRESSED` can use a smaller
[page size](glossary.html#glos_page_size "page size") on disk than the
configured [`innodb_page_size`](innodb-parameters.html#sysvar_innodb_page_size)
value. Smaller pages require less I/O to read from and write to
disk, which is especially valuable for
[SSD](glossary.html#glos_ssd "SSD") devices.

The compressed page size is specified through the
[`CREATE TABLE`](create-table.html "15.1.24 CREATE TABLE Statement") or
[`ALTER TABLE`](alter-table.html "15.1.11 ALTER TABLE Statement")
`KEY_BLOCK_SIZE` parameter. The different page
size requires that the table be placed in a
[file-per-table](glossary.html#glos_file_per_table "file-per-table")
tablespace or [general
tablespace](glossary.html#glos_general_tablespace "general tablespace") rather than in the
[system tablespace](/doc/refman/8.4/en/glossary.html#glos_system_tablespace),
as the system tablespace cannot store compressed tables. For
more information, see
[Section 17.6.3.2, “File-Per-Table Tablespaces”](innodb-file-per-table-tablespaces.html "17.6.3.2 File-Per-Table Tablespaces"), and
[Section 17.6.3.3, “General Tablespaces”](general-tablespaces.html "17.6.3.3 General Tablespaces").

The level of compression is the same regardless of the
`KEY_BLOCK_SIZE` value. As you specify smaller
values for `KEY_BLOCK_SIZE`, you get the I/O
benefits of increasingly smaller pages. But if you specify a
value that is too small, there is additional overhead to
reorganize the pages when data values cannot be compressed
enough to fit multiple rows in each page. There is a hard limit
on how small `KEY_BLOCK_SIZE` can be for a
table, based on the lengths of the key columns for each of its
indexes. Specify a value that is too small, and the
[`CREATE TABLE`](create-table.html "15.1.24 CREATE TABLE Statement") or
[`ALTER TABLE`](alter-table.html "15.1.11 ALTER TABLE Statement") statement fails.

In the buffer pool, the compressed data is held in small pages,
with a page size based on the `KEY_BLOCK_SIZE`
value. For extracting or updating the column values, MySQL also
creates an uncompressed page in the buffer pool with the
uncompressed data. Within the buffer pool, any updates to the
uncompressed page are also re-written back to the equivalent
compressed page. You might need to size your buffer pool to
accommodate the additional data of both compressed and
uncompressed pages, although the uncompressed pages are
[evicted](glossary.html#glos_eviction "eviction") from the buffer
pool when space is needed, and then uncompressed again on the
next access.