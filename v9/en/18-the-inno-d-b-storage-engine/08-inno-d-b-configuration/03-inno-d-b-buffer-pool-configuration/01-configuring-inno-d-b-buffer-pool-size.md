#### 17.8.3.1 Configuring InnoDB Buffer Pool Size

You can configure `InnoDB` buffer pool size offline or while the server is running. Behavior described in this section applies to both methods. For additional information about configuring buffer pool size online, see Configuring InnoDB Buffer Pool Size Online.

When increasing or decreasing `innodb_buffer_pool_size`, the operation is performed in chunks. Chunk size is defined by the `innodb_buffer_pool_chunk_size` configuration option, which has a default of `128M`. For more information, see Configuring InnoDB Buffer Pool Chunk Size.

Buffer pool size must always be equal to or a multiple of `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`. If you configure `innodb_buffer_pool_size` to a value that is not equal to or a multiple of `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`, buffer pool size is automatically adjusted to a value that is equal to or a multiple of `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`.

In the following example, `innodb_buffer_pool_size` is set to `8G`, and `innodb_buffer_pool_instances` is set to `16`. `innodb_buffer_pool_chunk_size` is `128M`, which is the default value.

`8G` is a valid `innodb_buffer_pool_size` value because `8G` is a multiple of `innodb_buffer_pool_instances=16` \* `innodb_buffer_pool_chunk_size=128M`, which is `2G`.

```
$> mysqld --innodb-buffer-pool-size=8G --innodb-buffer-pool-instances=16
```

```
mysql> SELECT @@innodb_buffer_pool_size/1024/1024/1024;
+------------------------------------------+
| @@innodb_buffer_pool_size/1024/1024/1024 |
+------------------------------------------+
|                           8.000000000000 |
+------------------------------------------+
```

In this example, `innodb_buffer_pool_size` is set to `9G`, and `innodb_buffer_pool_instances` is set to `16`. `innodb_buffer_pool_chunk_size` is `128M`, which is the default value. In this case, `9G` is not a multiple of `innodb_buffer_pool_instances=16` \* `innodb_buffer_pool_chunk_size=128M`, so `innodb_buffer_pool_size` is adjusted to `10G`, which is a multiple of `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`.

```
$> mysqld --innodb-buffer-pool-size=9G --innodb-buffer-pool-instances=16
```

```
mysql> SELECT @@innodb_buffer_pool_size/1024/1024/1024;
+------------------------------------------+
| @@innodb_buffer_pool_size/1024/1024/1024 |
+------------------------------------------+
|                          10.000000000000 |
+------------------------------------------+
```

##### Configuring InnoDB Buffer Pool Chunk Size

`innodb_buffer_pool_chunk_size` can be increased or decreased in 1MB (1048576 byte) units but can only be modified at startup, in a command line string or in a MySQL configuration file.

Command line:

```
$> mysqld --innodb-buffer-pool-chunk-size=134217728
```

Configuration file:

```
[mysqld]
innodb_buffer_pool_chunk_size=134217728
```

The following conditions apply when altering `innodb_buffer_pool_chunk_size`:

* If the new `innodb_buffer_pool_chunk_size` value \* `innodb_buffer_pool_instances` is larger than the current buffer pool size when the buffer pool is initialized, `innodb_buffer_pool_chunk_size` is truncated to `innodb_buffer_pool_size` / `innodb_buffer_pool_instances`.

  For example, if the buffer pool is initialized with a size of `2GB` (2147483648 bytes), `4` buffer pool instances, and a chunk size of `1GB` (1073741824 bytes), chunk size is truncated to a value equal to `innodb_buffer_pool_size` / `innodb_buffer_pool_instances`, as shown below:

  ```
  $> mysqld --innodb-buffer-pool-size=2147483648 --innodb-buffer-pool-instances=4
  --innodb-buffer-pool-chunk-size=1073741824;
  ```

  ```
  mysql> SELECT @@innodb_buffer_pool_size;
  +---------------------------+
  | @@innodb_buffer_pool_size |
  +---------------------------+
  |                2147483648 |
  +---------------------------+

  mysql> SELECT @@innodb_buffer_pool_instances;
  +--------------------------------+
  | @@innodb_buffer_pool_instances |
  +--------------------------------+
  |                              4 |
  +--------------------------------+

  # Chunk size was set to 1GB (1073741824 bytes) on startup but was
  # truncated to innodb_buffer_pool_size / innodb_buffer_pool_instances

  mysql> SELECT @@innodb_buffer_pool_chunk_size;
  +---------------------------------+
  | @@innodb_buffer_pool_chunk_size |
  +---------------------------------+
  |                       536870912 |
  +---------------------------------+
  ```

* Buffer pool size must always be equal to or a multiple of `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`. If you alter `innodb_buffer_pool_chunk_size`, `innodb_buffer_pool_size` is automatically adjusted to a value that is equal to or a multiple of `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`. The adjustment occurs when the buffer pool is initialized. This behavior is demonstrated in the following example:

  ```
  # The buffer pool has a default size of 128MB (134217728 bytes)

  mysql> SELECT @@innodb_buffer_pool_size;
  +---------------------------+
  | @@innodb_buffer_pool_size |
  +---------------------------+
  |                 134217728 |
  +---------------------------+

  # The chunk size is also 128MB (134217728 bytes)

  mysql> SELECT @@innodb_buffer_pool_chunk_size;
  +---------------------------------+
  | @@innodb_buffer_pool_chunk_size |
  +---------------------------------+
  |                       134217728 |
  +---------------------------------+

  # There is a single buffer pool instance

  mysql> SELECT @@innodb_buffer_pool_instances;
  +--------------------------------+
  | @@innodb_buffer_pool_instances |
  +--------------------------------+
  |                              1 |
  +--------------------------------+

  # Chunk size is decreased by 1MB (1048576 bytes) at startup
  # (134217728 - 1048576 = 133169152):

  $> mysqld --innodb-buffer-pool-chunk-size=133169152

  mysql> SELECT @@innodb_buffer_pool_chunk_size;
  +---------------------------------+
  | @@innodb_buffer_pool_chunk_size |
  +---------------------------------+
  |                       133169152 |
  +---------------------------------+

  # Buffer pool size increases from 134217728 to 266338304
  # Buffer pool size is automatically adjusted to a value that is equal to
  # or a multiple of innodb_buffer_pool_chunk_size * innodb_buffer_pool_instances

  mysql> SELECT @@innodb_buffer_pool_size;
  +---------------------------+
  | @@innodb_buffer_pool_size |
  +---------------------------+
  |                 266338304 |
  +---------------------------+
  ```

  This example demonstrates the same behavior but with multiple buffer pool instances:

  ```
  # The buffer pool has a default size of 2GB (2147483648 bytes)

  mysql> SELECT @@innodb_buffer_pool_size;
  +---------------------------+
  | @@innodb_buffer_pool_size |
  +---------------------------+
  |                2147483648 |
  +---------------------------+

  # The chunk size is .5 GB (536870912 bytes)

  mysql> SELECT @@innodb_buffer_pool_chunk_size;
  +---------------------------------+
  | @@innodb_buffer_pool_chunk_size |
  +---------------------------------+
  |                       536870912 |
  +---------------------------------+

  # There are 4 buffer pool instances

  mysql> SELECT @@innodb_buffer_pool_instances;
  +--------------------------------+
  | @@innodb_buffer_pool_instances |
  +--------------------------------+
  |                              4 |
  +--------------------------------+

  # Chunk size is decreased by 1MB (1048576 bytes) at startup
  # (536870912 - 1048576 = 535822336):

  $> mysqld --innodb-buffer-pool-chunk-size=535822336

  mysql> SELECT @@innodb_buffer_pool_chunk_size;
  +---------------------------------+
  | @@innodb_buffer_pool_chunk_size |
  +---------------------------------+
  |                       535822336 |
  +---------------------------------+

  # Buffer pool size increases from 2147483648 to 4286578688
  # Buffer pool size is automatically adjusted to a value that is equal to
  # or a multiple of innodb_buffer_pool_chunk_size * innodb_buffer_pool_instances

  mysql> SELECT @@innodb_buffer_pool_size;
  +---------------------------+
  | @@innodb_buffer_pool_size |
  +---------------------------+
  |                4286578688 |
  +---------------------------+
  ```

  Care should be taken when changing `innodb_buffer_pool_chunk_size`, as changing this value can increase the size of the buffer pool, as shown in the examples above. Before you change `innodb_buffer_pool_chunk_size`, calculate the effect on `innodb_buffer_pool_size` to ensure that the resulting buffer pool size is acceptable.

Note

To avoid potential performance issues, the number of chunks (`innodb_buffer_pool_size` / `innodb_buffer_pool_chunk_size`) should not exceed 1000.

##### Configuring InnoDB Buffer Pool Size Online

The `innodb_buffer_pool_size` configuration option can be set dynamically using a `SET` statement, allowing you to resize the buffer pool without restarting the server. For example:

```
mysql> SET GLOBAL innodb_buffer_pool_size=402653184;
```

Note

The buffer pool size must be equal to or a multiple of `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`. Changing those variable settings requires restarting the server.

Active transactions and operations performed through `InnoDB` APIs should be completed before resizing the buffer pool. When initiating a resizing operation, the operation does not start until all active transactions are completed. Once the resizing operation is in progress, new transactions and operations that require access to the buffer pool must wait until the resizing operation finishes. The exception to the rule is that concurrent access to the buffer pool is permitted while the buffer pool is defragmented and pages are withdrawn when buffer pool size is decreased. A drawback of allowing concurrent access is that it could result in a temporary shortage of available pages while pages are being withdrawn.

Note

Nested transactions could fail if initiated after the buffer pool resizing operation begins.

##### Monitoring Online Buffer Pool Resizing Progress

The `Innodb_buffer_pool_resize_status` variable reports a string value indicating buffer pool resizing progress; for example:

```
mysql> SHOW STATUS WHERE Variable_name='InnoDB_buffer_pool_resize_status';
+----------------------------------+----------------------------------+
| Variable_name                    | Value                            |
+----------------------------------+----------------------------------+
| Innodb_buffer_pool_resize_status | Resizing also other hash tables. |
+----------------------------------+----------------------------------+
```

You can also monitor an online buffer pool resizing operation using the `Innodb_buffer_pool_resize_status_code` and `Innodb_buffer_pool_resize_status_progress` status variables, which report numeric values, preferable for programmatic monitoring.

The `Innodb_buffer_pool_resize_status_code` status variable reports a status code indicating the stage of an online buffer pool resizing operation. Status codes include:

* 0: No Resize operation in progress
* 1: Starting Resize
* 2: Disabling AHI (Adaptive Hash Index)
* 3: Withdrawing Blocks
* 4: Acquiring Global Lock
* 5: Resizing Pool
* 6: Resizing Hash
* 7: Resizing Failed

The `Innodb_buffer_pool_resize_status_progress` status variable reports a percentage value indicating the progress of each stage. The percentage value is updated after each buffer pool instance is processed. As the status (reported by `Innodb_buffer_pool_resize_status_code`) changes from one status to another, the percentage value is reset to 0.

The following query returns a string value indicating the buffer pool resizing progress, a code indicating the current stage of the operation, and the current progress of that stage, expressed as a percentage value:

```
SELECT variable_name, variable_value
 FROM performance_schema.global_status
 WHERE LOWER(variable_name) LIKE "innodb_buffer_pool_resize%";
```

Buffer pool resizing progress is also visible in the server error log. This example shows notes that are logged when increasing the size of the buffer pool:

```
[Note] InnoDB: Resizing buffer pool from 134217728 to 4294967296. (unit=134217728)
[Note] InnoDB: disabled adaptive hash index.
[Note] InnoDB: buffer pool 0 : 31 chunks (253952 blocks) was added.
[Note] InnoDB: buffer pool 0 : hash tables were resized.
[Note] InnoDB: Resized hash tables at lock_sys, adaptive hash index, dictionary.
[Note] InnoDB: completed to resize buffer pool from 134217728 to 4294967296.
[Note] InnoDB: re-enabled adaptive hash index.
```

This example shows notes that are logged when decreasing the size of the buffer pool:

```
[Note] InnoDB: Resizing buffer pool from 4294967296 to 134217728. (unit=134217728)
[Note] InnoDB: disabled adaptive hash index.
[Note] InnoDB: buffer pool 0 : start to withdraw the last 253952 blocks.
[Note] InnoDB: buffer pool 0 : withdrew 253952 blocks from free list. tried to relocate
0 pages. (253952/253952)
[Note] InnoDB: buffer pool 0 : withdrawn target 253952 blocks.
[Note] InnoDB: buffer pool 0 : 31 chunks (253952 blocks) was freed.
[Note] InnoDB: buffer pool 0 : hash tables were resized.
[Note] InnoDB: Resized hash tables at lock_sys, adaptive hash index, dictionary.
[Note] InnoDB: completed to resize buffer pool from 4294967296 to 134217728.
[Note] InnoDB: re-enabled adaptive hash index.
```

Starting the server with `--log-error-verbosity=3` logs additional information to the error log during an online buffer pool resizing operation. Additional information includes the status codes reported by `Innodb_buffer_pool_resize_status_code` and the percentage progress value reported by `Innodb_buffer_pool_resize_status_progress`.

```
[Note] [MY-012398] [InnoDB] Requested to resize buffer pool. (new size: 1073741824 bytes)
[Note] [MY-013954] [InnoDB] Status code 1: Resizing buffer pool from 134217728 to 1073741824
(unit=134217728).
[Note] [MY-013953] [InnoDB] Status code 1: 100% complete
[Note] [MY-013952] [InnoDB] Status code 1: Completed
[Note] [MY-013954] [InnoDB] Status code 2: Disabling adaptive hash index.
[Note] [MY-011885] [InnoDB] disabled adaptive hash index.
[Note] [MY-013953] [InnoDB] Status code 2: 100% complete
[Note] [MY-013952] [InnoDB] Status code 2: Completed
[Note] [MY-013954] [InnoDB] Status code 3: Withdrawing blocks to be shrunken.
[Note] [MY-013953] [InnoDB] Status code 3: 100% complete
[Note] [MY-013952] [InnoDB] Status code 3: Completed
[Note] [MY-013954] [InnoDB] Status code 4: Latching whole of buffer pool.
[Note] [MY-013953] [InnoDB] Status code 4: 14% complete
[Note] [MY-013953] [InnoDB] Status code 4: 28% complete
[Note] [MY-013953] [InnoDB] Status code 4: 42% complete
[Note] [MY-013953] [InnoDB] Status code 4: 57% complete
[Note] [MY-013953] [InnoDB] Status code 4: 71% complete
[Note] [MY-013953] [InnoDB] Status code 4: 85% complete
[Note] [MY-013953] [InnoDB] Status code 4: 100% complete
[Note] [MY-013952] [InnoDB] Status code 4: Completed
[Note] [MY-013954] [InnoDB] Status code 5: Starting pool resize
[Note] [MY-013954] [InnoDB] Status code 5: buffer pool 0 : resizing with chunks 1 to 8.
[Note] [MY-011891] [InnoDB] buffer pool 0 : 7 chunks (57339 blocks) were added.
[Note] [MY-013953] [InnoDB] Status code 5: 100% complete
[Note] [MY-013952] [InnoDB] Status code 5: Completed
[Note] [MY-013954] [InnoDB] Status code 6: Resizing hash tables.
[Note] [MY-011892] [InnoDB] buffer pool 0 : hash tables were resized.
[Note] [MY-013953] [InnoDB] Status code 6: 100% complete
[Note] [MY-013954] [InnoDB] Status code 6: Resizing also other hash tables.
[Note] [MY-011893] [InnoDB] Resized hash tables at lock_sys, adaptive hash index, dictionary.
[Note] [MY-011894] [InnoDB] Completed to resize buffer pool from 134217728 to 1073741824.
[Note] [MY-011895] [InnoDB] Re-enabled adaptive hash index.
[Note] [MY-013952] [InnoDB] Status code 6: Completed
[Note] [MY-013954] [InnoDB] Status code 0: Completed resizing buffer pool at 220826  6:25:46.
[Note] [MY-013953] [InnoDB] Status code 0: 100% complete
```

##### Online Buffer Pool Resizing Internals

The resizing operation is performed by a background thread. When increasing the size of the buffer pool, the resizing operation:

* Adds pages in `chunks` (chunk size is defined by `innodb_buffer_pool_chunk_size`)

* Converts hash tables, lists, and pointers to use new addresses in memory

* Adds new pages to the free list

While these operations are in progress, other threads are blocked from accessing the buffer pool.

When decreasing the size of the buffer pool, the resizing operation:

* Defragments the buffer pool and withdraws (frees) pages
* Removes pages in `chunks` (chunk size is defined by `innodb_buffer_pool_chunk_size`)

* Converts hash tables, lists, and pointers to use new addresses in memory

Of these operations, only defragmenting the buffer pool and withdrawing pages allow other threads to access to the buffer pool concurrently.
