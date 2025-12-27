#### 17.6.3.9 Tablespace AUTOEXTEND\_SIZE Configuration

By default, when a file-per-table or general tablespace requires additional space, the tablespace is extended incrementally according to the following rules:

* If the tablespace is less than an extent in size, it is extended one page at a time.

* If the tablespace is greater than 1 extent but smaller than 32 extents in size, it is extended one extent at a time.

* If the tablespace is more than 32 extents in size, it is extended four extents at a time.

For information about extent size, see Section 17.11.2, “File Space Management”.

The amount by which a file-per-table or general tablespace is extended is configurable by specifying the `AUTOEXTEND_SIZE` option. Configuring a larger extension size can help avoid fragmentation and facilitate ingestion of large amounts of data.

To configure the extension size for a file-per-table tablespace, specify the `AUTOEXTEND_SIZE` size in a `CREATE TABLE` or `ALTER TABLE` statement:

```
CREATE TABLE t1 (c1 INT) AUTOEXTEND_SIZE = 4M;

ALTER TABLE t1 AUTOEXTEND_SIZE = 8M;
```

To configure the extension size for a general tablespace, specify the `AUTOEXTEND_SIZE` size in a `CREATE TABLESPACE` or `ALTER TABLESPACE` statement:

```
CREATE TABLESPACE ts1 AUTOEXTEND_SIZE = 4M;

ALTER TABLESPACE ts1 AUTOEXTEND_SIZE = 8M;
```

Note

The `AUTOEXTEND_SIZE` option can also be used when creating an undo tablespace, but the extension behavior for undo tablespaces differs. For more information, see Section 17.6.3.4, “Undo Tablespaces”.

The `AUTOEXTEND_SIZE` setting must be a multiple of 4M. Specifying an `AUTOEXTEND_SIZE` setting that is not a multiple of 4M returns an error.

The `AUTOEXTEND_SIZE` default setting is 0, which causes the tablespace to be extended according to the default behavior described above.

The maximum allowed `AUTOEXTEND_SIZE` is 4GB. The maximum tablespace size is described at Section 17.21, “InnoDB Limits”.

The minimum `AUTOEXTEND_SIZE` setting depends on the `InnoDB` page size, as shown in the following table:

<table summary="The minimum AUTOEXTEND_SIZE for each InnoDB page size"><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>InnoDB Page Size</th> <th>Minimum AUTOEXTEND_SIZE</th> </tr></thead><tbody><tr> <td><code class="literal">4K</code></td> <td><code class="literal">4M</code></td> </tr><tr> <td><code class="literal">8K</code></td> <td><code class="literal">4M</code></td> </tr><tr> <td><code class="literal">16K</code></td> <td><code class="literal">4M</code></td> </tr><tr> <td><code class="literal">32K</code></td> <td><code class="literal">8M</code></td> </tr><tr> <td><code class="literal">64K</code></td> <td><code class="literal">16M</code></td> </tr></tbody></table>

The default `InnoDB` page size is 16K (16384 bytes). To determine the `InnoDB` page size for your MySQL instance, query the `innodb_page_size` setting:

```
mysql> SELECT @@GLOBAL.innodb_page_size;
+---------------------------+
| @@GLOBAL.innodb_page_size |
+---------------------------+
|                     16384 |
+---------------------------+
```

When the `AUTOEXTEND_SIZE` setting for a tablespace is altered, the first extension that occurs afterward increases the tablespace size to a multiple of the `AUTOEXTEND_SIZE` setting. Subsequent extensions are of the configured size.

When a file-per-table or general tablespace is created with a non-zero `AUTOEXTEND_SIZE` setting, the tablespace is initialized at the specified `AUTOEXTEND_SIZE` size.

`ALTER TABLESPACE` cannot be used to configure the `AUTOEXTEND_SIZE` of a file-per-table tablespace. `ALTER TABLE` must be used.

For tables created in file-per-table tablespaces, `SHOW CREATE TABLE` shows the `AUTOEXTEND_SIZE` option only when it is configured to a non-zero value.

To determine the `AUTOEXTEND_SIZE` for any `InnoDB` tablespace, query the Information Schema `INNODB_TABLESPACES` table. For example:

```
mysql> SELECT NAME, AUTOEXTEND_SIZE FROM INFORMATION_SCHEMA.INNODB_TABLESPACES
       WHERE NAME LIKE 'test/t1';
+---------+-----------------+
| NAME    | AUTOEXTEND_SIZE |
+---------+-----------------+
| test/t1 |         4194304 |
+---------+-----------------+

mysql> SELECT NAME, AUTOEXTEND_SIZE FROM INFORMATION_SCHEMA.INNODB_TABLESPACES
       WHERE NAME LIKE 'ts1';
+------+-----------------+
| NAME | AUTOEXTEND_SIZE |
+------+-----------------+
| ts1  |         4194304 |
+------+-----------------+
```

Note

An `AUTOEXTEND_SIZE` of 0, which is the default setting, means that the tablespace is extended according to the default tablespace extension behavior described above.
