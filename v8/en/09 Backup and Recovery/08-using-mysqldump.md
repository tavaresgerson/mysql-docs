## 9.4 Using mysqldump for Backups

Tip

Consider using the  MySQL Shell dump utilities, which provide parallel dumping with multiple threads, file compression, and progress information display, as well as cloud features such as Oracle Cloud Infrastructure Object Storage streaming, and MySQL HeatWave compatibility checks and modifications. Dumps can be easily imported into a MySQL Server instance or a MySQL HeatWave DB System using the  MySQL Shell load dump utilities. Installation instructions for MySQL Shell can be found  here.

This section describes how to use  `mysqldump` to produce dump files, and how to reload dump files. A dump file can be used in several ways:

* As a backup to enable data recovery in case of data loss.
* As a source of data for setting up replicas.
* As a source of data for experimentation:

  + To make a copy of a database that you can use without changing the original data.
  + To test potential upgrade incompatibilities.

`mysqldump` produces two types of output, depending on whether the  `--tab` option is given:

* Without  `--tab`, `mysqldump` writes SQL statements to the standard output. This output consists of `CREATE` statements to create dumped objects (databases, tables, stored routines, and so forth), and `INSERT` statements to load data into tables. The output can be saved in a file and reloaded later using `mysql` to recreate the dumped objects. Options are available to modify the format of the SQL statements, and to control which objects are dumped.
* With  `--tab`, `mysqldump` produces two output files for each dumped table. The server writes one file as tab-delimited text, one line per table row. This file is named `tbl_name.txt` in the output directory. The server also sends a `CREATE TABLE` statement for the table to  `mysqldump`, which writes it as a file named `tbl_name.sql` in the output directory.
