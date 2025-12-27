## 14.22 InnoDB Troubleshooting

14.22.1 Troubleshooting InnoDB I/O Problems

14.22.2 Forcing InnoDB Recovery

14.22.3 Troubleshooting InnoDB Data Dictionary Operations

14.22.4 InnoDB Error Handling

The following general guidelines apply to troubleshooting `InnoDB` problems:

* When an operation fails or you suspect a bug, look at the MySQL server error log (see Section 5.4.2, “The Error Log”). Server Error Message Reference provides troubleshooting information for some of the common `InnoDB`-specific errors that you may encounter.

* If the failure is related to a deadlock, run with the `innodb_print_all_deadlocks` option enabled so that details about each deadlock are printed to the MySQL server error log. For information about deadlocks, see Section 14.7.5, “Deadlocks in InnoDB”.

* Issues relating to the `InnoDB` data dictionary include failed `CREATE TABLE` statements (orphan table files), inability to open `InnoDB` files, and system cannot find the path specified errors. For information about these sorts of problems and errors, see Section 14.22.3, “Troubleshooting InnoDB Data Dictionary Operations”.

* When troubleshooting, it is usually best to run the MySQL server from the command prompt, rather than through **mysqld\_safe** or as a Windows service. You can then see what **mysqld** prints to the console, and so have a better grasp of what is going on. On Windows, start **mysqld** with the `--console` option to direct the output to the console window.

* Enable the `InnoDB` Monitors to obtain information about a problem (see Section 14.18, “InnoDB Monitors”). If the problem is performance-related, or your server appears to be hung, you should enable the standard Monitor to print information about the internal state of `InnoDB`. If the problem is with locks, enable the Lock Monitor. If the problem is with table creation, tablespaces, or data dictionary operations, refer to the InnoDB Information Schema system tables to examine contents of the `InnoDB` internal data dictionary.

  `InnoDB` temporarily enables standard `InnoDB` Monitor output under the following conditions:

  + A long semaphore wait
  + `InnoDB` cannot find free blocks in the buffer pool

  + Over 67% of the buffer pool is occupied by lock heaps or the adaptive hash index

* If you suspect that a table is corrupt, run `CHECK TABLE` on that table.
