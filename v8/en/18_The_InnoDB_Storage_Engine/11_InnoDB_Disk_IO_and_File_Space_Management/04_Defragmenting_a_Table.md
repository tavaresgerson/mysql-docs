### 17.11.4 Defragmenting a Table

Random insertions into or deletions from a secondary index can
cause the index to become fragmented. Fragmentation means that the
physical ordering of the index pages on the disk is not close to
the index ordering of the records on the pages, or that there are
many unused pages in the 64-page blocks that were allocated to the
index.

One symptom of fragmentation is that a table takes more space than
it “should” take. How much that is exactly, is
difficult to determine. All `InnoDB` data and
indexes are stored in [B-trees](glossary.html#glos_b_tree "B-tree"),
and their [fill factor](glossary.html#glos_fill_factor "fill factor") may
vary from 50% to 100%. Another symptom of fragmentation is that a
table scan such as this takes more time than it
“should” take:

```
SELECT COUNT(*) FROM t WHERE non_indexed_column <> 12345;
```

The preceding query requires MySQL to perform a full table scan,
the slowest type of query for a large table.

To speed up index scans, you can periodically perform a
“null” [`ALTER TABLE`](alter-table.html "15.1.9 ALTER TABLE Statement")
operation, which causes MySQL to rebuild the table:

```
ALTER TABLE tbl_name ENGINE=INNODB
```

You can also use
[`ALTER TABLE
tbl_name FORCE`](alter-table.html "15.1.9 ALTER TABLE Statement") to perform a
“null” alter operation that rebuilds the table.

Both [`ALTER TABLE
tbl_name ENGINE=INNODB`](alter-table.html "15.1.9 ALTER TABLE Statement") and
[`ALTER TABLE
tbl_name FORCE`](alter-table.html "15.1.9 ALTER TABLE Statement") use
[online DDL](innodb-online-ddl.html "17.12 InnoDB and Online DDL"). For more
information, see [Section 17.12, “InnoDB and Online DDL”](innodb-online-ddl.html "17.12 InnoDB and Online DDL").

Another way to perform a defragmentation operation is to use
[**mysqldump**](mysqldump.html "6.5.4 mysqldump — A Database Backup Program") to dump the table to a text file,
drop the table, and reload it from the dump file.

If the insertions into an index are always ascending and records
are deleted only from the end, the `InnoDB`
filespace management algorithm guarantees that fragmentation in
the index does not occur.