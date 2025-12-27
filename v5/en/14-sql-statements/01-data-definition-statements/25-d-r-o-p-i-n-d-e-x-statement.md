### 13.1.25 DROP INDEX Statement

```sql
DROP INDEX index_name ON tbl_name
    [algorithm_option | lock_option] ...

algorithm_option:
    ALGORITHM [=] {DEFAULT | INPLACE | COPY}

lock_option:
    LOCK [=] {DEFAULT | NONE | SHARED | EXCLUSIVE}
```

[`DROP INDEX`](drop-index.html "13.1.25 DROP INDEX Statement") drops the index named *`index_name`* from the table *`tbl_name`*. This statement is mapped to an [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") statement to drop the index. See [Section 13.1.8, “ALTER TABLE Statement”](alter-table.html "13.1.8 ALTER TABLE Statement").

To drop a primary key, the index name is always `PRIMARY`, which must be specified as a quoted identifier because `PRIMARY` is a reserved word:

```sql
DROP INDEX `PRIMARY` ON t;
```

Indexes on variable-width columns of [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables are dropped online; that is, without any table copying. The table is not locked against access from other NDB Cluster API nodes, although it is locked against other operations on the *same* API node for the duration of the operation. This is done automatically by the server whenever it determines that it is possible to do so; you do not have to use any special SQL syntax or server options to cause it to happen.

`ALGORITHM` and `LOCK` clauses may be given to influence the table copying method and level of concurrency for reading and writing the table while its indexes are being modified. They have the same meaning as for the [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") statement. For more information, see [Section 13.1.8, “ALTER TABLE Statement”](alter-table.html "13.1.8 ALTER TABLE Statement")

NDB Cluster formerly supported online `DROP INDEX` operations using the `ONLINE` and `OFFLINE` keywords. These keywords are no longer supported in MySQL NDB Cluster 7.5 and later, and their use causes a syntax error. Instead, MySQL NDB Cluster 7.5 and later support online operations using the same `ALGORITHM=INPLACE` syntax used with the standard MySQL Server. See [Section 21.6.12, “Online Operations with ALTER TABLE in NDB Cluster”](mysql-cluster-online-operations.html "21.6.12 Online Operations with ALTER TABLE in NDB Cluster"), for more information.
