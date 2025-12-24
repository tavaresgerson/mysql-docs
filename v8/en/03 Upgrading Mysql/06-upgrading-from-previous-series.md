## 3.5 Changes in MySQL 8.4

Before upgrading to MySQL 8.4, review the changes described in the following sections to identify those that apply to your current MySQL installation and applications.

*  Incompatible Changes in MySQL 8.4
*  Changed Server Defaults

In addition, you can consult the resources listed here:

*  Section 1.4, “What Is New in MySQL 8.4 since MySQL 8.0”
* MySQL 8.4 Release Notes

### Incompatible Changes in MySQL 8.4

This section contains information about incompatible changes in MySQL 8.4.

**Spatial indexes.**
When upgrading to MySQL 8.4.4 or later, it is recommended that you drop any spatial indexes beforehand, then re-create them after the upgrade is complete. Alternatively, you can drop and re-create such indexes immediately following the upgrade, but before making use of any of the tables in which they occur.

For more information, see Section 13.4.10, “Creating Spatial Indexes”.

**`WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()` function removed.**
The `WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()` SQL function, deprecated in MySQL 8.0 has been removed; attempting to invoke it now causes a syntax error. Use `WAIT_FOR_EXECUTED_GTID_SET()` instead.

**`authentication_fido` and `authentication_fido_client` no longer available on some platforms.**
Due to upgrading the libfido2 library bundled with the server to version 1.13.0, which requires OpenSSL 1.1.1 or higher, the `authentication_fido` and `authentication_fido_client` authentication plugins are no longer available on Enterprise Linux 6, Enterprise Linux 7, Solaris 11, or SUSE Enterprise Linux 12.

**`NULL` disallowed for command-line options.**
Setting server variables equal to SQL `NULL` on the command line is not supported. In MySQL 8.4, setting any of these to `NULL` is specifically disallowed, and attempting to do is rejected with an error.

The following variables are excepted from this restriction: `admin_ssl_ca`, `admin_ssl_capath`, `admin_ssl_cert`, `admin_ssl_cipher`, `admin_tls_ciphersuites`, `admin_ssl_key`, `admin_ssl_crl`, `admin_ssl_crlpath`, `basedir`, `character_sets_dir`, `ft_stopword_file`, `group_replication_recovery_tls_ciphersuites`, `init_file`, `lc_messages_dir`, `plugin_dir`, `relay_log`, `relay_log_info_file`, `replica_load_tmpdir`, `ssl_ca`, `ssl_capath`, `ssl_cert`, `ssl_cipher`, `ssl_crl`, `ssl_crlpath`, `ssl_key`, `socket`, `tls_ciphersuites`, and `tmpdir`.

See also  Section 7.1.8, “Server System Variables”.

For additional information about changes in MySQL 8.4, see Section 1.4, “What Is New in MySQL 8.4 since MySQL 8.0”.

### Changed Server Defaults

This section contains information about MySQL server system variables whose default values have changed in MySQL 8.4 as compared to MySQL 8.0.

<table><col style="width: 33%"/><col style="width: 33%"/><col style="width: 33%"/><thead><tr> <th>System Variable</th> <th>Old Default</th> <th>New Default</th> </tr></thead><tbody><tr> <td><span><em>InnoDB changes</em></span></td> <td></td> <td></td> </tr><tr> <td><code>innodb_adaptive_hash_index</code></td> <td><code>ON</code></td> <td><code>OFF</code></td> </tr><tr> <td><code>innodb_buffer_pool_in_core_file</code></td> <td><code>ON</code></td> <td><code>OFF</code></td> </tr><tr> <td><code>innodb_buffer_pool_instances</code></td> <td><code>innodb_buffer_pool_size</code> &lt; 1GB: 1; otherwise: 8</td> <td><code>innodb_buffer_pool_size</code> &lt;= 1GB: 1; otherwise: <code>MIN</code><code>( 0.5 * (</code><code>innodb_buffer_pool_size</code><code> / </code><code>innodb_buffer_pool_chunk_size</code><code>), 0.25 * <em><code>number_of_cpus</code></em>)</code></td> </tr><tr> <td><code>innodb_change_buffering</code></td> <td><code>all</code></td> <td><code>none</code></td> </tr><tr> <td><code>innodb_doublewrite_files</code></td> <td><code>innodb_buffer_pool_instances</code><code> * 2</code></td> <td>2</td> </tr><tr> <td><code>innodb_doublewrite_pages</code></td> <td>Value of <code>innodb_write_io_threads</code></td> <td>128</td> </tr><tr> <td><code>innodb_flush_method</code></td> <td><code>fsync</code></td> <td><code>O_DIRECT</code> if supported, otherwise <code>fsync</code></td> </tr><tr> <td><code>innodb_io_capacity</code></td> <td>200</td> <td>10000</td> </tr><tr> <td><code>innodb_io_capacity_max</code></td> <td><code>MIN(2 * </code><code>innodb_io_capacity</code><code>, 2000)</code></td> <td><code>2 * innodb_io_capacity</code></td> </tr><tr> <td><code>innodb_log_buffer_size</code></td> <td>16777216</td> <td>67108864</td> </tr><tr> <td><code>innodb_numa_interleave</code></td> <td><code>OFF</code></td> <td><code>ON</code></td> </tr><tr> <td><code>innodb_page_cleaners</code></td> <td>4</td> <td>Value of <code>innodb_buffer_pool_instances</code></td> </tr><tr> <td><code>innodb_parallel_read_threads</code></td> <td>4</td> <td><code>MIN(<em><code>number_of_cpus</code></em> / 8, 4)</code></td> </tr><tr> <td><code>innodb_purge_threads</code></td> <td>4</td> <td>If number_of_cpus &lt;= 16: 1; otherwise: 4</td> </tr><tr> <td><code>innodb_use_fdatasync</code></td> <td><code>OFF</code></td> <td><code>ON</code></td> </tr><tr> <td><span><em>Group Replication changes</em></span></td> <td></td> <td></td> </tr><tr> <td><code>group_replication_consistency</code></td> <td><code>EVENTUAL</code></td> <td><code>BEFORE_ON_PRIMARY_FAILOVER</code></td> </tr><tr> <td><code>group_replication_exit_state_action</code></td> <td><code>READ_ONLY</code></td> <td><code>OFFLINE_MODE</code></td> </tr><tr> <td><span><em>Temporary table changes</em></span></td> <td></td> <td></td> </tr><tr> <td><code>temptable_max_mmap</code></td> <td>1073741824</td> <td>0</td> </tr><tr> <td><code>temptable_max_ram</code></td> <td>1073741824</td> <td>3% of total memory within a range of 1-4 (GB)</td> </tr><tr> <td><code>temptable_use_mmap</code></td> <td><code>ON</code></td> <td><code>OFF</code></td> </tr></tbody></table>

For more information about options or variables which have been added, see  Option and Variable Changes for MySQL 8.4, in the *MySQL Server Version Reference*.

Although the new defaults are the best configuration choices for most use cases, there are special cases, as well as legacy reasons for using existing configuration choices. For example, some people prefer to upgrade to MySQL 8.4 with as few changes to their applications or operational environment as possible. We recommend to evaluate all the new defaults and use as many as you can.

The Performance Schema `variables_info` table shows, for each system variable, the source from which it was most recently set, as well as its range of values. This provides SQL access to all there is to know about a system variable and its values.
