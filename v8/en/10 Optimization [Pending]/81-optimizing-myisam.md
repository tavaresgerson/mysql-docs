--- title: MySQL 8.4 Reference Manual :: 10.6 Optimizing for MyISAM Tables url: https://dev.mysql.com/doc/refman/8.4/en/optimizing-myisam.html order: 81 ---



## 10.6 Optimizing for MyISAM Tables

 10.6.1 Optimizing MyISAM Queries

 10.6.2 Bulk Data Loading for MyISAM Tables

 10.6.3 Optimizing REPAIR TABLE Statements

The  `MyISAM` storage engine performs best with read-mostly data or with low-concurrency operations, because table locks limit the ability to perform simultaneous updates. In MySQL,  `InnoDB` is the default storage engine rather than `MyISAM`.


