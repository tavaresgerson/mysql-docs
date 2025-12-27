## 8.6 Optimizing for MyISAM Tables

8.6.1 Optimizing MyISAM Queries

8.6.2 Bulk Data Loading for MyISAM Tables

8.6.3 Optimizing REPAIR TABLE Statements

The `MyISAM` storage engine performs best with read-mostly data or with low-concurrency operations, because table locks limit the ability to perform simultaneous updates. In MySQL, `InnoDB` is the default storage engine rather than `MyISAM`.
