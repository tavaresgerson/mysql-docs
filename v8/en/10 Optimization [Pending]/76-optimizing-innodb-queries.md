--- title: MySQL 8.4 Reference Manual :: 10.5.6 Optimizing InnoDB Queries url: https://dev.mysql.com/doc/refman/8.4/en/optimizing-innodb-queries.html order: 76 ---



### 10.5.6 Optimizing InnoDB Queries

To tune queries for `InnoDB` tables, create an appropriate set of indexes on each table. See Section 10.3.1, “How MySQL Uses Indexes” for details. Follow these guidelines for `InnoDB` indexes:

* Because each `InnoDB` table has a primary key (whether you request one or not), specify a set of primary key columns for each table, columns that are used in the most important and time-critical queries.
* Do not specify too many or too long columns in the primary key, because these column values are duplicated in each secondary index. When an index contains unnecessary data, the I/O to read this data and memory to cache it reduce the performance and scalability of the server.
* Do not create a separate secondary index for each column, because each query can only make use of one index. Indexes on rarely tested columns or columns with only a few different values might not be helpful for any queries. If you have many queries for the same table, testing different combinations of columns, try to create a small number of [concatenated indexes](glossary.html#glos_concatenated_index "concatenated index") rather than a large number of single-column indexes. If an index contains all the columns needed for the result set (known as a covering index), the query might be able to avoid reading the table data at all.
* If an indexed column cannot contain any `NULL` values, declare it as `NOT NULL` when you create the table. The optimizer can better determine which index is most effective to use for a query, when it knows whether each column contains `NULL` values.
* You can optimize single-query transactions for `InnoDB` tables, using the technique in Section 10.5.3, “Optimizing InnoDB Read-Only Transactions”.

