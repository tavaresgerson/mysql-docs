## 9.4 Using mysqldump for Backups

[9.4.1 Dumping Data in SQL Format with mysqldump](mysqldump-sql-format.html)

[9.4.2 Reloading SQL-Format Backups](reloading-sql-format-dumps.html)

[9.4.3 Dumping Data in Delimited-Text Format with mysqldump](mysqldump-delimited-text.html)

[9.4.4 Reloading Delimited-Text Format Backups](reloading-delimited-text-dumps.html)

[9.4.5 mysqldump Tips](mysqldump-tips.html)

Tip

Consider using the [MySQL Shell dump utilities](/doc/mysql-shell/9.5/en/mysql-shell-utilities-dump-instance-schema.html), which provide parallel dumping with multiple threads, file compression, and progress information display, as well as cloud features such as Oracle Cloud Infrastructure Object Storage streaming, and MySQL HeatWave compatibility checks and modifications. Dumps can be easily imported into a MySQL Server instance or a MySQL HeatWave DB System using the [MySQL Shell load dump utilities](/doc/mysql-shell/9.5/en/mysql-shell-utilities-load-dump.html). Installation instructions for MySQL Shell can be found [here](/doc/mysql-shell/9.5/en/mysql-shell-install.html).

This section describes how to use [**mysqldump**](mysqldump.html "6.5.4 mysqldump — A Database Backup Program") to
produce dump files, and how to reload dump files. A dump file can
be used in several ways:

* As a backup to enable data recovery in case of data loss.
* As a source of data for setting up replicas.
* As a source of data for experimentation:

  + To make a copy of a database that you can use without
    changing the original data.

  + To test potential upgrade incompatibilities.

[**mysqldump**](mysqldump.html "6.5.4 mysqldump — A Database Backup Program") produces two types of output,
depending on whether the [`--tab`](mysqldump.html#option_mysqldump_tab)
option is given:

* Without [`--tab`](mysqldump.html#option_mysqldump_tab),
  [**mysqldump**](mysqldump.html "6.5.4 mysqldump — A Database Backup Program") writes SQL statements to the
  standard output. This output consists of
  `CREATE` statements to create dumped objects
  (databases, tables, stored routines, and so forth), and
  `INSERT` statements to load data into tables.
  The output can be saved in a file and reloaded later using
  [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") to recreate the dumped objects.
  Options are available to modify the format of the SQL
  statements, and to control which objects are dumped.

* With [`--tab`](mysqldump.html#option_mysqldump_tab),
  [**mysqldump**](mysqldump.html "6.5.4 mysqldump — A Database Backup Program") produces two output files for
  each dumped table. The server writes one file as tab-delimited
  text, one line per table row. This file is named
  `tbl_name.txt`
  in the output directory. The server also sends a
  [`CREATE TABLE`](create-table.html "15.1.24 CREATE TABLE Statement") statement for the
  table to [**mysqldump**](mysqldump.html "6.5.4 mysqldump — A Database Backup Program"), which writes it as a
  file named
  `tbl_name.sql`
  in the output directory.