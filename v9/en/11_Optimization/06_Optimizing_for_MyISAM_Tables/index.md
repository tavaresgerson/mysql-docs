## 10.6 Optimizing for MyISAM Tables

[10.6.1 Optimizing MyISAM Queries](optimizing-queries-myisam.html)

[10.6.2 Bulk Data Loading for MyISAM Tables](optimizing-myisam-bulk-data-loading.html)

[10.6.3 Optimizing REPAIR TABLE Statements](repair-table-optimization.html)

The [`MyISAM`](myisam-storage-engine.html "18.2 The MyISAM Storage Engine") storage engine performs
best with read-mostly data or with low-concurrency operations,
because table locks limit the ability to perform simultaneous
updates. In MySQL, [`InnoDB`](innodb-storage-engine.html "Chapter 17 The InnoDB Storage Engine") is the
default storage engine rather than `MyISAM`.