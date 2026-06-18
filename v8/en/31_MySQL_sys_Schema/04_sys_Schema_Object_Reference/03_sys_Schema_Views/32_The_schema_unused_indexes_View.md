#### 30.4.3.32 The schema\_unused\_indexes View

These views display indexes for which there are no events,
which indicates that they are not being used. By default, rows
are sorted by schema and table.

This view is most useful when the server has been up and
processing long enough that its workload is representative.
Otherwise, presence of an index in this view may not be
meaningful.

The [`schema_unused_indexes`](sys-schema-unused-indexes.html "30.4.3.32 The schema_unused_indexes View") view
has these columns:

* `object_schema`

  The schema name.

* `object_name`

  The table name.

* `index_name`

  The unused index name.