#### 30.4.3.47 The version View

This view provides the current `sys` schema and MySQL server versions.

Note

This view is deprecated, and subject to removal in a future MySQL version. Applications that use it should be migrated to use an alternative instead. For example, use the `VERSION()` function to retrieve the MySQL server version.

The `version` view has these columns:

* `sys_version`

  The `sys` schema version.

* `mysql_version`

  The MySQL server version.
