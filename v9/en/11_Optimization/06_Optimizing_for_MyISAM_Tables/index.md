## 10.6 Optimizing for MyISAM Tables

The [`MyISAM`](myisam-storage-engine.html "18.2 The MyISAM Storage Engine") storage engine performs
best with read-mostly data or with low-concurrency operations,
because table locks limit the ability to perform simultaneous
updates. In MySQL, [`InnoDB`](innodb-storage-engine.html "Chapter 17 The InnoDB Storage Engine") is the
default storage engine rather than `MyISAM`.