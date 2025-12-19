--- title: MySQL 8.4 Reference Manual :: 10.6.3 Optimizing REPAIR TABLE Statements url: https://dev.mysql.com/doc/refman/8.4/en/repair-table-optimization.html order: 84 ---



### 10.6.3 Optimizing REPAIR TABLE Statements

 `REPAIR TABLE` for `MyISAM` tables is similar to using **myisamchk** for repair operations, and some of the same performance optimizations apply:

*  **myisamchk** has variables that control memory allocation. You may be able to its improve performance by setting these variables, as described in Section 6.6.4.6, “myisamchk Memory Usage”.
* For  `REPAIR TABLE`, the same principle applies, but because the repair is done by the server, you set server system variables instead of **myisamchk** variables. Also, in addition to setting memory-allocation variables, increasing the `myisam_max_sort_file_size` system variable increases the likelihood that the repair uses the faster filesort method and avoids the slower repair by key cache method. Set the variable to the maximum file size for your system, after checking to be sure that there is enough free space to hold a copy of the table files. The free space must be available in the file system containing the original table files.

Suppose that a  **myisamchk** table-repair operation is done using the following options to set its memory-allocation variables:

```
--key_buffer_size=128M --myisam_sort_buffer_size=256M
--read_buffer_size=64M --write_buffer_size=64M
```

Some of those  **myisamchk** variables correspond to server system variables:

<table><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th><span><strong>myisamchk</strong></span> Variable</th> <th>System Variable</th> </tr></thead><tbody><tr> <td><code>key_buffer_size</code></td> <td><code>key_buffer_size</code></td> </tr><tr> <td><code>myisam_sort_buffer_size</code></td> <td><code>myisam_sort_buffer_size</code></td> </tr><tr> <td><code>read_buffer_size</code></td> <td><code>read_buffer_size</code></td> </tr><tr> <td><code>write_buffer_size</code></td> <td>none</td> </tr></tbody></table>

Each of the server system variables can be set at runtime, and some of them ( `myisam_sort_buffer_size`, `read_buffer_size`) have a session value in addition to a global value. Setting a session value limits the effect of the change to your current session and does not affect other users. Changing a global-only variable ( `key_buffer_size`, `myisam_max_sort_file_size`) affects other users as well. For `key_buffer_size`, you must take into account that the buffer is shared with those users. For example, if you set the  **myisamchk** `key_buffer_size` variable to 128MB, you could set the corresponding `key_buffer_size` system variable larger than that (if it is not already set larger), to permit key buffer use by activity in other sessions. However, changing the global key buffer size invalidates the buffer, causing increased disk I/O and slowdown for other sessions. An alternative that avoids this problem is to use a separate key cache, assign to it the indexes from the table to be repaired, and deallocate it when the repair is complete. See Section 10.10.2.2, “Multiple Key Caches”.

Based on the preceding remarks, a [`REPAIR TABLE`](repair-table.html "15.7.3.5 REPAIR TABLE Statement") operation can be done as follows to use settings similar to the  **myisamchk** command. Here a separate 128MB key buffer is allocated and the file system is assumed to permit a file size of at least 100GB.

```
SET SESSION myisam_sort_buffer_size = 256*1024*1024;
SET SESSION read_buffer_size = 64*1024*1024;
SET GLOBAL myisam_max_sort_file_size = 100*1024*1024*1024;
SET GLOBAL repair_cache.key_buffer_size = 128*1024*1024;
CACHE INDEX tbl_name IN repair_cache;
LOAD INDEX INTO CACHE tbl_name;
REPAIR TABLE tbl_name ;
SET GLOBAL repair_cache.key_buffer_size = 0;
```

If you intend to change a global variable but want to do so only for the duration of a [`REPAIR TABLE`](repair-table.html "15.7.3.5 REPAIR TABLE Statement") operation to minimally affect other users, save its value in a user variable and restore it afterward. For example:

```
SET @old_myisam_sort_buffer_size = @@GLOBAL.myisam_max_sort_file_size;
SET GLOBAL myisam_max_sort_file_size = 100*1024*1024*1024;
REPAIR TABLE tbl_name ;
SET GLOBAL myisam_max_sort_file_size = @old_myisam_max_sort_file_size;
```

The system variables that affect [`REPAIR TABLE`](repair-table.html "15.7.3.5 REPAIR TABLE Statement") can be set globally at server startup if you want the values to be in effect by default. For example, add these lines to the server `my.cnf` file:

```
[mysqld]
myisam_sort_buffer_size=256M
key_buffer_size=1G
myisam_max_sort_file_size=100G
```

These settings do not include `read_buffer_size`. Setting `read_buffer_size` globally to a large value does so for all sessions and can cause performance to suffer due to excessive memory allocation for a server with many simultaneous sessions.


