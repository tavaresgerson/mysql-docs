### 8.12.1 System Factors

Some system-level factors can affect performance in a major way:

* If you have enough RAM, you could remove all swap devices.
  Some operating systems use a swap device in some contexts
  even if you have free memory.

* Avoid external locking for
  [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") tables. The default is
  for external locking to be disabled. The
  [`--external-locking`](server-options.html#option_mysqld_external-locking) and
  [`--skip-external-locking`](server-options.html#option_mysqld_external-locking)
  options explicitly enable and disable external locking.

  Disabling external locking does not affect MySQL's
  functionality as long as you run only one server. Just
  remember to take down the server (or lock and flush the
  relevant tables) before you run
  [**myisamchk**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility"). On some systems it is
  mandatory to disable external locking because it does not
  work, anyway.

  The only case in which you cannot disable external locking
  is when you run multiple MySQL *servers*
  (not clients) on the same data, or if you run
  [**myisamchk**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility") to check (not repair) a table
  without telling the server to flush and lock the tables
  first. Note that using multiple MySQL servers to access the
  same data concurrently is generally *not*
  recommended, except when using NDB Cluster.

  The [`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") and
  [`UNLOCK
  TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") statements use internal locking, so you can
  use them even if external locking is disabled.