#### 17.6.2.2 The Physical Structure of an InnoDB Index

With the exception of spatial indexes, `InnoDB`
indexes are [B-tree](glossary.html#glos_b_tree "B-tree") data
structures. Spatial indexes use
[R-trees](glossary.html#glos_r_tree "R-tree"), which are
specialized data structures for indexing multi-dimensional data.
Index records are stored in the leaf pages of their B-tree or
R-tree data structure. The default size of an index page is 16KB.
The page size is determined by the
[`innodb_page_size`](innodb-parameters.html#sysvar_innodb_page_size) setting when the
MySQL instance is initialized. See
[Section 17.8.1, “InnoDB Startup Configuration”](innodb-init-startup-configuration.html "17.8.1 InnoDB Startup Configuration").

When new records are inserted into an `InnoDB`
[clustered index](glossary.html#glos_clustered_index "clustered index"),
`InnoDB` tries to leave 1/16 of the page free for
future insertions and updates of the index records. If index
records are inserted in a sequential order (ascending or
descending), the resulting index pages are about 15/16 full. If
records are inserted in a random order, the pages are from 1/2 to
15/16 full.

`InnoDB` performs a bulk load when creating or
rebuilding B-tree indexes. This method of index creation is known
as a sorted index build. The
[`innodb_fill_factor`](innodb-parameters.html#sysvar_innodb_fill_factor) variable
defines the percentage of space on each B-tree page that is filled
during a sorted index build, with the remaining space reserved for
future index growth. Sorted index builds are not supported for
spatial indexes. For more information, see
[Section 17.6.2.3, “Sorted Index Builds”](sorted-index-builds.html "17.6.2.3 Sorted Index Builds"). An
[`innodb_fill_factor`](innodb-parameters.html#sysvar_innodb_fill_factor) setting of 100
leaves 1/16 of the space in clustered index pages free for future
index growth.

If the fill factor of an `InnoDB` index page
drops below the `MERGE_THRESHOLD`, which is 50%
by default if not specified, `InnoDB` tries to
contract the index tree to free the page. The
`MERGE_THRESHOLD` setting applies to both B-tree
and R-tree indexes. For more information, see
[Section 17.8.11, “Configuring the Merge Threshold for Index Pages”](index-page-merge-threshold.html "17.8.11 Configuring the Merge Threshold for Index Pages").