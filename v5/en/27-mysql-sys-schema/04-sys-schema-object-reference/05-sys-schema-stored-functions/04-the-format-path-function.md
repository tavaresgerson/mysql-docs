#### 26.4.5.4 The format_path() Function

Given a path name, returns the modified path name after replacing subpaths that match the values of the following system variables, in order:

```sql
datadir
tmpdir
slave_load_tmpdir
innodb_data_home_dir
innodb_log_group_home_dir
innodb_undo_directory
basedir
```

A value that matches the value of system variable *`sysvar`* is replaced with the string `@@GLOBAL.sysvar`.

Prior to MySQL 5.7.14, backslashes in Windows path names are converted to forward slashes in the result.

##### Parameters

* `path VARCHAR(512)`: The path name to format.

##### Return Value

A `VARCHAR(512) CHARACTER SET utf8` value.

##### Example

```sql
mysql> SELECT sys.format_path('/usr/local/mysql/data/world/City.ibd');
+---------------------------------------------------------+
| sys.format_path('/usr/local/mysql/data/world/City.ibd') |
+---------------------------------------------------------+
| @@datadir/world/City.ibd                                |
+---------------------------------------------------------+
```
