--- title: MySQL 8.4 Reference Manual :: 9.4.5.3 Dumping Stored Programs url: https://dev.mysql.com/doc/refman/8.4/en/mysqldump-stored-programs.html order: 16 ---



#### 9.4.5.3 Dumping Stored Programs

Several options control how  `mysqldump` handles stored programs (stored procedures and functions, triggers, and events):

*  `--events`: Dump Event Scheduler events
*  `--routines`: Dump stored procedures and functions
*  `--triggers`: Dump triggers for tables

The  `--triggers` option is enabled by default so that when tables are dumped, they are accompanied by any triggers they have. The other options are disabled by default and must be specified explicitly to dump the corresponding objects. To disable any of these options explicitly, use its skip form: `--skip-events`, `--skip-routines`, or `--skip-triggers`.


