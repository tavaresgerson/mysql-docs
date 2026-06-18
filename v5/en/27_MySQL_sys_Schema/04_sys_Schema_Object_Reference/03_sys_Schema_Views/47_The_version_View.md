#### 26.4.3.47 The version View

This view provides the current
[`sys`](sys-schema.html "Chapter 26 MySQL sys Schema") schema and MySQL server
versions.

Note

As of MySQL 5.7.28, this view is deprecated and subject to
removal in a future MySQL version. Applications that use it
should be migrated to use an alternative instead. For
example, use the [`VERSION()`](information-functions.html#function_version)
function to retrieve the MySQL server version.

The [`version`](sys-version.html "26.4.3.47 The version View") view has these
columns:

* `sys_version`

  The [`sys`](sys-schema.html "Chapter 26 MySQL sys Schema") schema version.

* `mysql_version`

  The MySQL server version.