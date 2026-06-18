## 10.3 Optimization and Indexes

[10.3.1 How MySQL Uses Indexes](mysql-indexes.html)

[10.3.2 Primary Key Optimization](primary-key-optimization.html)

[10.3.3 SPATIAL Index Optimization](spatial-index-optimization.html)

[10.3.4 Foreign Key Optimization](foreign-key-optimization.html)

[10.3.5 Column Indexes](column-indexes.html)

[10.3.6 Multiple-Column Indexes](multiple-column-indexes.html)

[10.3.7 Verifying Index Usage](verifying-index-usage.html)

[10.3.8 InnoDB and MyISAM Index Statistics Collection](index-statistics.html)

[10.3.9 Comparison of B-Tree and Hash Indexes](index-btree-hash.html)

[10.3.10 Use of Index Extensions](index-extensions.html)

[10.3.11 Optimizer Use of Generated Column Indexes](generated-column-index-optimizations.html)

[10.3.12 Invisible Indexes](invisible-indexes.html)

[10.3.13 Descending Indexes](descending-indexes.html)

[10.3.14 Indexed Lookups from TIMESTAMP Columns](timestamp-lookups.html)

The best way to improve the performance of
[`SELECT`](select.html "15.2.13 SELECT Statement") operations is to create
indexes on one or more of the columns that are tested in the
query. The index entries act like pointers to the table rows,
allowing the query to quickly determine which rows match a
condition in the `WHERE` clause, and retrieve the
other column values for those rows. All MySQL data types can be
indexed.

Although it can be tempting to create an indexes for every
possible column used in a query, unnecessary indexes waste space
and waste time for MySQL to determine which indexes to use.
Indexes also add to the cost of inserts, updates, and deletes
because each index must be updated. You must find the right
balance to achieve fast queries using the optimal set of indexes.