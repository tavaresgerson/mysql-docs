#### 14.9.1.7 SQL Compression Syntax Warnings and Errors

This section describes syntax warnings and errors that you may encounter when using the table compression feature with file-per-table tablespaces and general tablespaces.

##### SQL Compression Syntax Warnings and Errors for File-Per-Table Tablespaces

When `innodb_strict_mode` is enabled (the default), specifying `ROW_FORMAT=COMPRESSED` or `KEY_BLOCK_SIZE` in `CREATE TABLE` or `ALTER TABLE` statements produces the following error if `innodb_file_per_table` is disabled or if `innodb_file_format` is set to `Antelope` rather than `Barracuda`.

```sql
ERROR 1031 (HY000): Table storage engine for 't1' does not have this option
```

Note

The table is not created if the current configuration does not permit using compressed tables.

When `innodb_strict_mode` is disabled, specifying `ROW_FORMAT=COMPRESSED` or `KEY_BLOCK_SIZE` in `CREATE TABLE` or `ALTER TABLE` statements produces the following warnings if `innodb_file_per_table` is disabled.

```sql
mysql> SHOW WARNINGS;
+---------+------+---------------------------------------------------------------+
| Level   | Code | Message                                                       |
+---------+------+---------------------------------------------------------------+
| Warning | 1478 | InnoDB: KEY_BLOCK_SIZE requires innodb_file_per_table.        |
| Warning | 1478 | InnoDB: ignoring KEY_BLOCK_SIZE=4.                            |
| Warning | 1478 | InnoDB: ROW_FORMAT=COMPRESSED requires innodb_file_per_table. |
| Warning | 1478 | InnoDB: assuming ROW_FORMAT=DYNAMIC.                          |
+---------+------+---------------------------------------------------------------+
```

Similar warnings are issued if `innodb_file_format` is set to `Antelope` rather than `Barracuda`.

Note

These messages are only warnings, not errors, and the table is created without compression, as if the options were not specified.

The “non-strict” behavior lets you import a `mysqldump` file into a database that does not support compressed tables, even if the source database contained compressed tables. In that case, MySQL creates the table in `ROW_FORMAT=COMPACT` instead of preventing the operation.

To import the dump file into a new database, and have the tables re-created as they exist in the original database, ensure the server has the proper settings for the configuration parameters `innodb_file_format` and `innodb_file_per_table`.

The attribute `KEY_BLOCK_SIZE` is permitted only when `ROW_FORMAT` is specified as `COMPRESSED` or is omitted. Specifying a `KEY_BLOCK_SIZE` with any other `ROW_FORMAT` generates a warning that you can view with `SHOW WARNINGS`. However, the table is non-compressed; the specified `KEY_BLOCK_SIZE` is ignored).

<table summary="Warning level, error code, and message text for messages that could be generated when using conflicting clauses for InnoDB table compression."><col style="width: 20%"/><col style="width: 20%"/><col style="width: 60%"/><thead><tr> <th scope="col">Level</th> <th scope="col">Code</th> <th scope="col">Message</th> </tr></thead><tbody><tr> <th scope="row">Warning</th> <td>1478</td> <td><code> InnoDB: ignoring KEY_BLOCK_SIZE=<em class="replaceable"><code>n</code></em> unless ROW_FORMAT=COMPRESSED. </code></td> </tr></tbody></table>

If you are running with `innodb_strict_mode` enabled, the combination of a `KEY_BLOCK_SIZE` with any `ROW_FORMAT` other than `COMPRESSED` generates an error, not a warning, and the table is not created.

Table 14.6, “ROW\_FORMAT and KEY\_BLOCK\_SIZE Options” provides an overview the `ROW_FORMAT` and `KEY_BLOCK_SIZE` options that are used with `CREATE TABLE` or `ALTER TABLE`.

**Table 14.6 ROW\_FORMAT and KEY\_BLOCK\_SIZE Options**

<table summary="ROW_FORMAT and KEY_BLOCK_SIZE option usage notes and descriptions."><col style="width: 20%"/><col style="width: 40%"/><col style="width: 40%"/><thead><tr> <th scope="col">Option</th> <th scope="col">Usage Notes</th> <th scope="col">Description</th> </tr></thead><tbody><tr> <th scope="row"><code>ROW_FORMAT=​REDUNDANT</code></th> <td>Storage format used prior to MySQL 5.0.3</td> <td>Less efficient than <code>ROW_FORMAT=COMPACT</code>; for backward compatibility</td> </tr><tr> <th scope="row"><code>ROW_FORMAT=​COMPACT</code></th> <td>Default storage format since MySQL 5.0.3</td> <td>Stores a prefix of 768 bytes of long column values in the clustered index page, with the remaining bytes stored in an overflow page</td> </tr><tr> <th scope="row"><code>ROW_FORMAT=​DYNAMIC</code></th> <td>File-per-table tablespaces require <code>innodb_file​_format=Barracuda</code></td> <td>Store values within the clustered index page if they fit; if not, stores only a 20-byte pointer to an overflow page (no prefix)</td> </tr><tr> <th scope="row"><code>ROW_FORMAT=​COMPRESSED</code></th> <td>File-per-table tablespaces require <code>innodb_file​_format=Barracuda</code></td> <td>Compresses the table and indexes using zlib</td> </tr><tr> <th scope="row"><code>KEY_BLOCK_​SIZE=<em class="replaceable"><code>n</code></em></code></th> <td>File-per-table tablespaces require <code>innodb_file​_format=Barracuda</code></td> <td>Specifies compressed page size of 1, 2, 4, 8 or 16 kilobytes; implies <code>ROW_FORMAT=COMPRESSED</code>. For general tablespaces, a <code>KEY_BLOCK_SIZE</code> value equal to the <code>InnoDB</code> page size is not permitted.</td> </tr></tbody></table>

Table 14.7, “CREATE/ALTER TABLE Warnings and Errors when InnoDB Strict Mode is OFF” summarizes error conditions that occur with certain combinations of configuration parameters and options on the `CREATE TABLE` or `ALTER TABLE` statements, and how the options appear in the output of `SHOW TABLE STATUS`.

When `innodb_strict_mode` is `OFF`, MySQL creates or alters the table, but ignores certain settings as shown below. You can see the warning messages in the MySQL error log. When `innodb_strict_mode` is `ON`, these specified combinations of options generate errors, and the table is not created or altered. To see the full description of the error condition, issue the `SHOW ERRORS` statement: example:

```sql
mysql> CREATE TABLE x (id INT PRIMARY KEY, c INT)

-> ENGINE=INNODB KEY_BLOCK_SIZE=33333;

ERROR 1005 (HY000): Can't create table 'test.x' (errno: 1478)

mysql> SHOW ERRORS;
+-------+------+-------------------------------------------+
| Level | Code | Message                                   |
+-------+------+-------------------------------------------+
| Error | 1478 | InnoDB: invalid KEY_BLOCK_SIZE=33333.     |
| Error | 1005 | Can't create table 'test.x' (errno: 1478) |
+-------+------+-------------------------------------------+
```

**Table 14.7 CREATE/ALTER TABLE Warnings and Errors when InnoDB Strict Mode is OFF**

<table summary="CREATE and ALTER TABLE warnings and errors when InnoDB strict mode is OFF."><col style="width: 33%"/><col style="width: 33%"/><col style="width: 33%"/><thead><tr> <th scope="col">Syntax</th> <th scope="col">Warning or Error Condition</th> <th scope="col">Resulting <code>ROW_FORMAT</code>, as shown in <code>SHOW TABLE STATUS</code></th> </tr></thead><tbody><tr> <th scope="row"><code>ROW_FORMAT=REDUNDANT</code></th> <td>None</td> <td><code>REDUNDANT</code></td> </tr><tr> <th scope="row"><code>ROW_FORMAT=COMPACT</code></th> <td>None</td> <td><code>COMPACT</code></td> </tr><tr> <th scope="row"><code>ROW_FORMAT=COMPRESSED</code> or <code>ROW_FORMAT=DYNAMIC</code> or <code>KEY_BLOCK_SIZE</code> is specified</th> <td>Ignored for file-per-table tablespaces unless both <a class="link" href="innodb-parameters.html#sysvar_innodb_file_format"><code>innodb_file_format</code></a><code>=Barracuda</code> and <a class="link" href="innodb-parameters.html#sysvar_innodb_file_per_table"><code>innodb_file_per_table</code></a> are enabled. General tablespaces support all row formats (with some restrictions) regardless of <a class="link" href="innodb-parameters.html#sysvar_innodb_file_format"><code>innodb_file_format</code></a> and <a class="link" href="innodb-parameters.html#sysvar_innodb_file_per_table"><code>innodb_file_per_table</code></a> settings. See <a class="xref" href="general-tablespaces.html" title="14.6.3.3 General Tablespaces">Section 14.6.3.3, “General Tablespaces”</a>.</td> <td><code>the default row format for file-per-table tablespaces; the specified row format for general tablespaces</code></td> </tr><tr> <th scope="row">Invalid <code>KEY_BLOCK_SIZE</code> is specified (not 1, 2, 4, 8 or 16)</th> <td><code>KEY_BLOCK_SIZE</code> is ignored</td> <td>the specified row format, or the default row format</td> </tr><tr> <th scope="row"><code>ROW_FORMAT=COMPRESSED</code> and valid <code>KEY_BLOCK_SIZE</code> are specified</th> <td>None; <code>KEY_BLOCK_SIZE</code> specified is used</td> <td><code>COMPRESSED</code></td> </tr><tr> <th scope="row"><code>KEY_BLOCK_SIZE</code> is specified with <code>REDUNDANT</code>, <code>COMPACT</code> or <code>DYNAMIC</code> row format</th> <td><code>KEY_BLOCK_SIZE</code> is ignored</td> <td><code>REDUNDANT</code>, <code>COMPACT</code> or <code>DYNAMIC</code></td> </tr><tr> <th scope="row"><code>ROW_FORMAT</code> is not one of <code>REDUNDANT</code>, <code>COMPACT</code>, <code>DYNAMIC</code> or <code>COMPRESSED</code></th> <td>Ignored if recognized by the MySQL parser. Otherwise, an error is issued.</td> <td>the default row format or N/A</td> </tr></tbody></table>

When `innodb_strict_mode` is `ON`, MySQL rejects invalid `ROW_FORMAT` or `KEY_BLOCK_SIZE` parameters and issues errors. When `innodb_strict_mode` is `OFF`, MySQL issues warnings instead of errors for ignored invalid parameters. `innodb_strict_mode` is `ON` by default.

When `innodb_strict_mode` is `ON`, MySQL rejects invalid `ROW_FORMAT` or `KEY_BLOCK_SIZE` parameters. For compatibility with earlier versions of MySQL, strict mode is not enabled by default; instead, MySQL issues warnings (not errors) for ignored invalid parameters.

It is not possible to see the chosen `KEY_BLOCK_SIZE` using `SHOW TABLE STATUS`. The statement `SHOW CREATE TABLE` displays the `KEY_BLOCK_SIZE` (even if it was ignored when creating the table). The real compressed page size of the table cannot be displayed by MySQL.

##### SQL Compression Syntax Warnings and Errors for General Tablespaces

* If `FILE_BLOCK_SIZE` was not defined for the general tablespace when the tablespace was created, the tablespace cannot contain compressed tables. If you attempt to add a compressed table, an error is returned, as shown in the following example:

  ```sql
  mysql> CREATE TABLESPACE `ts1` ADD DATAFILE 'ts1.ibd' Engine=InnoDB;

  mysql> CREATE TABLE t1 (c1 INT PRIMARY KEY) TABLESPACE ts1 ROW_FORMAT=COMPRESSED
         KEY_BLOCK_SIZE=8;
  ERROR 1478 (HY000): InnoDB: Tablespace `ts1` cannot contain a COMPRESSED table
  ```

* Attempting to add a table with an invalid `KEY_BLOCK_SIZE` to a general tablespace returns an error, as shown in the following example:

  ```sql
  mysql> CREATE TABLESPACE `ts2` ADD DATAFILE 'ts2.ibd' FILE_BLOCK_SIZE = 8192 Engine=InnoDB;

  mysql> CREATE TABLE t2 (c1 INT PRIMARY KEY) TABLESPACE ts2 ROW_FORMAT=COMPRESSED
         KEY_BLOCK_SIZE=4;
  ERROR 1478 (HY000): InnoDB: Tablespace `ts2` uses block size 8192 and cannot
  contain a table with physical page size 4096
  ```

  For general tablespaces, the `KEY_BLOCK_SIZE` of the table must be equal to the `FILE_BLOCK_SIZE` of the tablespace divided by 1024. For example, if the `FILE_BLOCK_SIZE` of the tablespace is 8192, the `KEY_BLOCK_SIZE` of the table must be 8.

* Attempting to add a table with an uncompressed row format to a general tablespace configured to store compressed tables returns an error, as shown in the following example:

  ```sql
  mysql> CREATE TABLESPACE `ts3` ADD DATAFILE 'ts3.ibd' FILE_BLOCK_SIZE = 8192 Engine=InnoDB;

  mysql> CREATE TABLE t3 (c1 INT PRIMARY KEY) TABLESPACE ts3 ROW_FORMAT=COMPACT;
  ERROR 1478 (HY000): InnoDB: Tablespace `ts3` uses block size 8192 and cannot
  contain a table with physical page size 16384
  ```

`innodb_strict_mode` is not applicable to general tablespaces. Tablespace management rules for general tablespaces are strictly enforced independently of `innodb_strict_mode`. For more information, see Section 13.1.19, “CREATE TABLESPACE Statement”.

For more information about using compressed tables with general tablespaces, see Section 14.6.3.3, “General Tablespaces”.
