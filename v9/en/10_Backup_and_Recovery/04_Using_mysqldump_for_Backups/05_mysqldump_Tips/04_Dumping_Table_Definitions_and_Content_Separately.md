#### 9.4.5.4 Dumping Table Definitions and Content Separately

The `--no-data` option tells **mysqldump** not to dump table data, resulting in the dump file containing only statements to create the tables. Conversely, the `--no-create-info` option tells **mysqldump** to suppress `CREATE` statements from the output, so that the dump file contains only table data.

For example, to dump table definitions and data separately for the `test` database, use these commands:

```
$> mysqldump --no-data test > dump-defs.sql
$> mysqldump --no-create-info test > dump-data.sql
```

For a definition-only dump, add the `--routines` and `--events` options to also include stored routine and event definitions:

```
$> mysqldump --no-data --routines --events test > dump-defs.sql
```
