### 17.8.12 Enabling Automatic InnoDB Configuration for a Dedicated MySQL Server

When the server is started with `--innodb-dedicated-server`, `InnoDB` automatically calculates values for and sets the following system variables:

* `innodb_buffer_pool_size`
* `innodb_redo_log_capacity` (MySQL 8.0.30 and later)

* `innodb_log_file_size` (prior to MySQL 8.0.30)

* `innodb_log_files_in_group` (prior to MySQL 8.0.30)

* `innodb_flush_method`

Note

`innodb_log_file_size` and `innodb_log_files_in_group` are deprecated as of MySQL 8.0.30, and are superseded by `innodb_redo_log_capacity`. You should expect `innodb_log_file_size` and `innodb_log_files_in_group` to be removed in a future version of MySQL.

You should consider using `--innodb-dedicated-server` only if the MySQL instance resides on a dedicated server where it can use all available system resources—for example, if you run MySQL Server in a Docker container or dedicated VM that runs MySQL only. using `--innodb-dedicated-server` is not recommended if the MySQL instance shares system resources with other applications.

The value for each affected variable is determined and applied by `--innodb-dedicated-server` as described in the following list:

* `innodb_buffer_pool_size`

  Buffer pool size is calculated according to the amount of memory detected on the server, as shown in the following table:

  **Table 17.8 Automatically Configured Buffer Pool Size**

  <table summary="The first column           shows the amount of server memory detected. The second column shows           the buffer pool size which is automatically determined."><thead><tr> <th>Detected Server Memory</th> <th>Buffer Pool Size</th> </tr></thead><tbody><tr> <td>Less than 1GB</td> <td>128MB (the default value)</td> </tr><tr> <td>1GB to 4GB</td> <td><em class="replaceable"><code>detected server memory</code></em> * 0.5</td> </tr><tr> <td>Greater than 4GB</td> <td><em class="replaceable"><code>detected server memory</code></em> * 0.75</td> </tr></tbody></table>

* `innodb_redo_log_capacity`

  Redo log capacity is configured according to the amount of memory detected on the server and, in some cases, whether `innodb_buffer_pool_size` is configured explicitly. If `innodb_buffer_pool_size` is not configured explicitly, the default value is assumed.

  Warning

  Automatic redo log capacity configuration behavior is undefined if `innodb_buffer_pool_size` is set to a value larger than the detected amount of server memory.

  **Table 17.9 Automatically Configured Log File Size**

  <table summary="The first column shows the buffer pool size. The second column shows the automatically configured redo log capacity."><thead><tr> <th>Detected Server Memory</th> <th>Buffer Pool Size</th> <th>Redo Log Capacity</th> </tr></thead><tbody><tr> <td>Less than 1GB</td> <td>Not configured</td> <td>100MB</td> </tr><tr> <td>Less than 1GB</td> <td>Less than 1GB</td> <td>100MB</td> </tr><tr> <td>1GB to 2GB</td> <td>Not applicable</td> <td>100MB</td> </tr><tr> <td>2GB to 4GB</td> <td>Not configured</td> <td>1GB</td> </tr><tr> <td>2GB to 4GB</td> <td>Any configured value</td> <td>round(0.5 * <em class="replaceable"><code>detected server memory</code></em> in GB) * 0.5 GB</td> </tr><tr> <td>4GB to 10.66GB</td> <td>Not applicable</td> <td>round(0.75 * <em class="replaceable"><code>detected server memory</code></em> in GB) * 0.5 GB</td> </tr><tr> <td>10.66GB to 170.66GB</td> <td>Not applicable</td> <td>round(0.5625 * <em class="replaceable"><code>detected server memory</code></em> in GB)
                * 1 GB</td> </tr><tr> <td>Greater than 170.66GB</td> <td>Not applicable</td> <td>128GB</td> </tr></tbody></table>

* `innodb_log_file_size` (deprecated)

  Log file size is set according to the automatically configured buffer pool size, as shown in the following table:

  **Table 17.10 Automatically Configured Log File Size**

  <table summary="The first column           shows the buffer pool size. The second column shows the log file size           which is automatically determined."><thead><tr> <th>Buffer Pool Size</th> <th>Log File Size</th> </tr></thead><tbody><tr> <td>Less than 8GB</td> <td>512MB</td> </tr><tr> <td>8GB to 128GB</td> <td>1024MB</td> </tr><tr> <td>Greater than 128GB</td> <td>2048MB</td> </tr></tbody></table>

* `innodb_log_files_in_group` (deprecated)

  The number of log files is determined according to the automatically configured buffer pool size, as shown in the following table:

  **Table 17.11 Automatically Configured Number of Log Files**

  <table summary="The first column shows           the buffer pool size. The second column shows the number of log files           which is automatically determined."><thead><tr> <th>Buffer Pool Size</th> <th>Number of Log Files</th> </tr></thead><tbody><tr> <td>Less than 8GB</td> <td>round(<em class="replaceable"><code>buffer pool size</code></em>)</td> </tr><tr> <td>8GB to 128GB</td> <td>round(<em class="replaceable"><code>buffer pool size</code></em> * 0.75)</td> </tr><tr> <td>Greater than 128GB</td> <td>64</td> </tr></tbody></table>

  Note

  The minimum value for `innodb_log_files_in_group` value is `2`; this lower limit is enforced if the rounded buffer pool size value is less than this number.

* `innodb_flush_method`

  The flush method is set to `O_DIRECT_NO_FSYNC` when the server is started with `--innodb-dedicated-server`. If `O_DIRECT_NO_FSYNC` is not available, the default value for `innodb_flush_method`.

  `InnoDB` uses `O_DIRECT` during flushing I/O, but skips the `fsync()` system call after each write operation.

  Warning

  Prior to MySQL 8.0.14, `O_DIRECT_NO_FSYNC` was not suitable for file systems such as XFS and EXT4, which require an `fsync()` system call to synchronize file system metadata changes.

  As of MySQL 8.0.14, `fsync()` is called after creating a new file, after increasing file size, and after closing a file, to ensure that file system metadata changes are synchronized. The `fsync()` system call is still skipped after each write operation.

  Data loss is possible if redo log files and data files reside on different storage devices, and an unexpected exit occurs before data file writes are flushed from a device cache that is not battery-backed. If you use or intend to use different storage devices for redo log files and data files, and your data files reside on a device with a cache that is not battery-backed, use `O_DIRECT` instead.

If one of the variables listed previously is set explicitly in an option file or elsewhere, this explicit value is used, and a startup warning similar to this one is printed to `stderr`:

[Warning] [000000] InnoDB: Option innodb_dedicated_server is ignored for innodb_buffer_pool_size because innodb_buffer_pool_size=134217728 is specified explicitly.

Setting one variable explicitly does not prevent the automatic configuration of other options.

If the server is started with `--innodb-dedicated-server` and `innodb_buffer_pool_size` is set explicitly, variable settings based on buffer pool size use the buffer pool size value calculated according to the amount of memory detected on the server rather than the explicitly defined buffer pool size value.

Note

Automatic configuration settings are applied by `--innodb-dedicated-server` *only* when the MySQL server is started. If you later set any of the affected variables explicitly, this overrides its predetermined value, and the value that was explicitly set is applied. Setting one of these variables to `DEFAULT` causes it to be set to the actual default value as shown in the variable's description in the Manual, and does *not* cause it to revert to the value set by `--innodb-dedicated-server`. The corresponding system variable `innodb_dedicated_server` is changed only by starting the server with `--innodb-dedicated-server` (or with `--innodb-dedicated-server=ON` or `--innodb-dedicated-server=OFF`); it is otherwise read-only.
