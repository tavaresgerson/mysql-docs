## 7.4 Using mysqldump for Backups

[7.4.1 Dumping Data in SQL Format with mysqldump](mysqldump-sql-format.html)

[7.4.2 Reloading SQL-Format Backups](reloading-sql-format-dumps.html)

[7.4.3 Dumping Data in Delimited-Text Format with mysqldump](mysqldump-delimited-text.html)

[7.4.4 Reloading Delimited-Text Format Backups](reloading-delimited-text-dumps.html)

[7.4.5 mysqldump Tips](mysqldump-tips.html)

This section describes how to use [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") to
produce dump files, and how to reload dump files. A dump file can
be used in several ways:

* As a backup to enable data recovery in case of data loss.
* As a source of data for setting up replicas.
* As a source of data for experimentation:

  + To make a copy of a database that you can use without
    changing the original data.

  + To test potential upgrade incompatibilities.

[**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") produces two types of output,
depending on whether the [`--tab`](mysqldump.html#option_mysqldump_tab)
option is given:

* Without [`--tab`](mysqldump.html#option_mysqldump_tab),
  [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") writes SQL statements to the
  standard output. This output consists of
  `CREATE` statements to create dumped objects
  (databases, tables, stored routines, and so forth), and
  `INSERT` statements to load data into tables.
  The output can be saved in a file and reloaded later using
  [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") to recreate the dumped objects.
  Options are available to modify the format of the SQL
  statements, and to control which objects are dumped.

* With [`--tab`](mysqldump.html#option_mysqldump_tab),
  [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") produces two output files for
  each dumped table. The server writes one file as tab-delimited
  text, one line per table row. This file is named
  `tbl_name.txt`
  in the output directory. The server also sends a
  [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") statement for the
  table to [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program"), which writes it as a
  file named
  `tbl_name.sql`
  in the output directory.