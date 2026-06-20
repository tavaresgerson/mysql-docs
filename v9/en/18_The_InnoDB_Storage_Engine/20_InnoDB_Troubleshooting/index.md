## 17.20 InnoDB Troubleshooting

The following general guidelines apply to troubleshooting
`InnoDB` problems:

* When an operation fails or you suspect a bug, look at the MySQL
  server error log (see [Section 7.4.2, “The Error Log”](error-log.html "7.4.2 The Error Log")).
  [Server Error Message Reference](/doc/mysql-errors/9.5/en/server-error-reference.html) provides
  troubleshooting information for some of the common
  `InnoDB`-specific errors that you may
  encounter.

* If the failure is related to a
  [deadlock](glossary.html#glos_deadlock "deadlock"), run with the
  [`innodb_print_all_deadlocks`](innodb-parameters.html#sysvar_innodb_print_all_deadlocks)
  option enabled so that details about each deadlock are printed
  to the MySQL server error log. For information about deadlocks,
  see [Section 17.7.5, “Deadlocks in InnoDB”](innodb-deadlocks.html "17.7.5 Deadlocks in InnoDB").

* If the issue is related to the `InnoDB` data
  dictionary, see
  [Section 17.20.4, “Troubleshooting InnoDB Data Dictionary Operations”](innodb-troubleshooting-datadict.html "17.20.4 Troubleshooting InnoDB Data Dictionary Operations").

* When troubleshooting, it is usually best to run the MySQL server
  from the command prompt, rather than through
  [**mysqld\_safe**](mysqld-safe.html "6.3.2 mysqld_safe — MySQL Server Startup Script") or as a Windows service. You can
  then see what [**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server") prints to the console,
  and so have a better grasp of what is going on. On Windows,
  start [**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server") with the
  [`--console`](server-options.html#option_mysqld_console) option to direct the
  output to the console window.

* Enable the `InnoDB` Monitors to obtain
  information about a problem (see
  [Section 17.17, “InnoDB Monitors”](innodb-monitors.html "17.17 InnoDB Monitors")). If the problem is
  performance-related, or your server appears to be hung, you
  should enable the standard Monitor to print information about
  the internal state of `InnoDB`. If the problem
  is with locks, enable the Lock Monitor. If the problem is with
  table creation, tablespaces, or data dictionary operations,
  refer to the
  [InnoDB
  Information Schema system tables](innodb-information-schema-system-tables.html "17.15.3 InnoDB INFORMATION_SCHEMA Schema Object Tables") to examine contents of
  the `InnoDB` internal data dictionary.

  `InnoDB` temporarily enables standard
  `InnoDB` Monitor output under the following
  conditions:

  + A long semaphore wait
  + `InnoDB` cannot find free blocks in the
    buffer pool

  + Over 67% of the buffer pool is occupied by lock heaps or the
    adaptive hash index

* If you suspect that a table is corrupt, run
  [`CHECK TABLE`](check-table.html "15.7.3.2 CHECK TABLE Statement") on that table.