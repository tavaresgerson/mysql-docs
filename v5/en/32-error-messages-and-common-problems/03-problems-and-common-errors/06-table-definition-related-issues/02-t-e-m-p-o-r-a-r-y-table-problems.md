#### B.3.6.2 TEMPORARY Table Problems

Temporary tables created with [`CREATE TEMPORARY TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") have the following limitations:

* `TEMPORARY` tables are supported only by the `InnoDB`, `MEMORY`, `MyISAM`, and `MERGE` storage engines.

* Temporary tables are not supported for NDB Cluster.
* The [`SHOW TABLES`](show-tables.html "13.7.5.37 SHOW TABLES Statement") statement does not list `TEMPORARY` tables.

* To rename `TEMPORARY` tables, `RENAME TABLE` does not work. Use [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") instead:

  ```sql
  ALTER TABLE old_name RENAME new_name;
  ```

* You cannot refer to a `TEMPORARY` table more than once in the same query. For example, the following does not work:

  ```sql
  SELECT * FROM temp_table JOIN temp_table AS t2;
  ```

  The statement produces this error:

  ```sql
  ERROR 1137: Can't reopen table: 'temp_table'
  ```

* The Can't reopen table error also occurs if you refer to a temporary table multiple times in a stored function under different aliases, even if the references occur in different statements within the function. It may occur for temporary tables created outside stored functions and referred to across multiple calling and callee functions.

* If a `TEMPORARY` is created with the same name as an existing non-`TEMPORARY` table, the non-`TEMPORARY` table is hidden until the `TEMPORARY` table is dropped, even if the tables use different storage engines.

* There are known issues in using temporary tables with replication. See [Section 16.4.1.29, “Replication and Temporary Tables”](replication-features-temptables.html "16.4.1.29 Replication and Temporary Tables"), for more information.
