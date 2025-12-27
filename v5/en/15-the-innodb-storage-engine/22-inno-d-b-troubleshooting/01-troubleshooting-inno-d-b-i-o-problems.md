### 14.22.1 Troubleshooting InnoDB I/O Problems

The troubleshooting steps for `InnoDB` I/O problems depend on when the problem occurs: during startup of the MySQL server, or during normal operations when a DML or DDL statement fails due to problems at the file system level.

#### Initialization Problems

If something goes wrong when `InnoDB` attempts to initialize its tablespace or its log files, delete all files created by `InnoDB`: all `ibdata` files and all `ib_logfile` files. If you already created some `InnoDB` tables, also delete the corresponding `.frm` files for these tables, and any `.ibd` files if you are using multiple tablespaces, from the MySQL database directories. Then try the `InnoDB` database creation again. For easiest troubleshooting, start the MySQL server from a command prompt so that you see what is happening.

#### Runtime Problems

If `InnoDB` prints an operating system error during a file operation, usually the problem has one of the following solutions:

* Make sure the `InnoDB` data file directory and the `InnoDB` log directory exist.

* Make sure **mysqld** has access rights to create files in those directories.

* Make sure **mysqld** can read the proper `my.cnf` or `my.ini` option file, so that it starts with the options that you specified.

* Make sure the disk is not full and you are not exceeding any disk quota.

* Make sure that the names you specify for subdirectories and data files do not clash.

* Doublecheck the syntax of the `innodb_data_home_dir` and `innodb_data_file_path` values. In particular, any `MAX` value in the `innodb_data_file_path` option is a hard limit, and exceeding that limit causes a fatal error.
