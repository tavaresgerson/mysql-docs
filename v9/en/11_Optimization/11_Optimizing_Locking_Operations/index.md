## 10.11 Optimizing Locking Operations

MySQL manages contention for table contents using
[locking](glossary.html#glos_locking "locking"):

* Internal locking is performed within the MySQL server itself
  to manage contention for table contents by multiple threads.
  This type of locking is internal because it is performed
  entirely by the server and involves no other programs. See
  [Section 10.11.1, “Internal Locking Methods”](internal-locking.html "10.11.1 Internal Locking Methods").

* External locking occurs when the server and other programs
  lock [`MyISAM`](myisam-storage-engine.html "18.2 The MyISAM Storage Engine") table files to
  coordinate among themselves which program can access the
  tables at which time. See [Section 10.11.5, “External Locking”](external-locking.html "10.11.5 External Locking").