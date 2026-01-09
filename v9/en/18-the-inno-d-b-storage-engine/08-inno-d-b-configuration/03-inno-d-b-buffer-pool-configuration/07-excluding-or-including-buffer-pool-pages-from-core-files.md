#### 17.8.3.7 Excluding or Including Buffer Pool Pages from Core Files

A core file records the status and memory image of a running process. Because the buffer pool resides in main memory, and the memory image of a running process is dumped to the core file, systems with large buffer pools can produce large core files when the **mysqld** process dies.

Large core files can be problematic for a number of reasons including the time it takes to write them, the amount of disk space they consume, and the challenges associated with transferring large files.

Excluding buffer pool pages may also be desirable from a security perspective if you have concerns about dumping database pages to core files that may be shared inside or outside of your organization for debugging purposes.

Note

Access to the data present in buffer pool pages at the time the **mysqld** process died may be beneficial in some debugging scenarios. If in doubt whether to include or exclude buffer pool pages, consult MySQL Support.

The `innodb_buffer_pool_in_core_file` option is only relevant if the `core_file` variable is enabled and the operating system supports the `MADV_DONTDUMP` non-POSIX extension to the madvise() system call, which is supported in Linux 3.4 and later. The `MADV_DONTDUMP` extension causes pages in a specified range to be excluded from core dumps. The `innodb_buffer_pool_in_core_file` option is disabled by default on systems that support MADV_DONTDUMP, otherwise it defaults to ON.

To generate core files with buffer pool pages, start the server with the `--core-file` and `--innodb-buffer-pool-in-core-file=ON` options.

```
$> mysqld --core-file --innodb-buffer-pool-in-core-file=ON
```

The `core_file` variable is read-only and disabled by default. It is enabled by specifying the `--core-file` option at startup. The `innodb_buffer_pool_in_core_file` variable is dynamic. It can be specified at startup or configured at runtime using a `SET` statement.

```
mysql> SET GLOBAL innodb_buffer_pool_in_core_file=OFF;
```

If the `innodb_buffer_pool_in_core_file` variable is disabled but `MADV_DONTDUMP` is not supported by the operating system, or an `madvise()` failure occurs, a warning is written to the MySQL server error log and the `core_file` variable is disabled to prevent writing core files that unintentionally include buffer pool pages. If the read-only `core_file` variable becomes disabled, the server must be restarted to enable it again.

The following table shows configuration and `MADV_DONTDUMP` support scenarios that determine whether core files are generated and whether they include buffer pool pages.

**Table 17.4 Core File Configuration Scenarios**

<table summary="Core file configuration and         MADV_DONTDUMP support scenarios."><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><col style="width: 40%"/><thead><tr> <th><code>core_file</code> variable</th> <th><code>innodb_buffer_pool_in_core_file</code> variable</th> <th>madvise() MADV_DONTDUMP Support</th> <th>Outcome</th> </tr></thead><tbody><tr> <th>OFF (default)</th> <td>Not relevant to outcome</td> <td>Not relevant to outcome</td> <td>Core file is not generated</td> </tr><tr> <th>ON</th> <td>ON (default on systems without <code>MADV_DONTDUMP</code> support)</td> <td>Not relevant to outcome</td> <td>Core file is generated with buffer pool pages</td> </tr><tr> <th>ON</th> <td>OFF (default on systems with <code>MADV_DONTDUMP</code> support)</td> <td>Yes</td> <td>Core file is generated without buffer pool pages</td> </tr><tr> <th>ON</th> <td>OFF</td> <td>No</td> <td>Core file is not generated, <code>core_file</code> is disabled, and a warning is written to the server error log</td> </tr></tbody></table>

The reduction in core file size achieved by disabling the `innodb_buffer_pool_in_core_file` variable depends on the size of the buffer pool, but it is also affected by the `InnoDB` page size. A smaller page size means more pages are required for the same amount of data, and more pages means more page metadata. The following table provides size reduction examples that you might see for a 1GB buffer pool with different pages sizes.

**Table 17.5 Core File Size with Buffer Pool Pages Included and Excluded**

<table summary="Core file size reduction examples for different pages sizes."><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th><code>innodb_page_size</code> Setting</th> <th>Buffer Pool Pages Included (<code>innodb_buffer_pool_in_core_file=ON</code>)</th> <th>Buffer Pool Pages Excluded (<code>innodb_buffer_pool_in_core_file=OFF</code>)</th> </tr></thead><tbody><tr> <th>4KB</th> <td>2.1GB</td> <td>0.9GB</td> </tr><tr> <th>64KB</th> <td>1.7GB</td> <td>0.7GB</td> </tr></tbody></table>
