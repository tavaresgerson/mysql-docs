### 15.2.1 MyISAM Startup Options

The following options to **mysqld** can be used to change the behavior of `MyISAM` tables. For additional information, see Section 5.1.6, “Server Command Options”.

**Table 15.3 MyISAM Option and Variable Reference**

<table frame="box" rules="all" summary="Reference for MyISAM command-line options and system variables."><col style="width: 20%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><thead><tr><th>Name</th> <th>Cmd-Line</th> <th>Option File</th> <th>System Var</th> <th>Status Var</th> <th>Var Scope</th> <th>Dynamic</th> </tr></thead><tbody><tr><th><a class="link" href="server-system-variables.html#sysvar_bulk_insert_buffer_size">bulk_insert_buffer_size</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Both</td> <td>Yes</td> </tr><tr><th><a class="link" href="server-system-variables.html#sysvar_concurrent_insert">concurrent_insert</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th><a class="link" href="server-system-variables.html#sysvar_delay_key_write">delay_key_write</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th><a class="link" href="server-system-variables.html#sysvar_have_rtree_keys">have_rtree_keys</a></th> <td></td> <td></td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th><a class="link" href="server-system-variables.html#sysvar_key_buffer_size">key_buffer_size</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th><a class="link" href="server-options.html#option_mysqld_log-isam">log-isam</a></th> <td>Yes</td> <td>Yes</td> <td></td> <td></td> <td></td> <td></td> </tr><tr><th><a class="link" href="server-options.html#option_mysqld_myisam-block-size">myisam-block-size</a></th> <td>Yes</td> <td>Yes</td> <td></td> <td></td> <td></td> <td></td> </tr><tr><th><a class="link" href="server-system-variables.html#sysvar_myisam_data_pointer_size">myisam_data_pointer_size</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th><a class="link" href="server-system-variables.html#sysvar_myisam_max_sort_file_size">myisam_max_sort_file_size</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th><a class="link" href="server-system-variables.html#sysvar_myisam_mmap_size">myisam_mmap_size</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th><a class="link" href="server-system-variables.html#sysvar_myisam_recover_options">myisam_recover_options</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th><a class="link" href="server-system-variables.html#sysvar_myisam_repair_threads">myisam_repair_threads</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Both</td> <td>Yes</td> </tr><tr><th><a class="link" href="server-system-variables.html#sysvar_myisam_sort_buffer_size">myisam_sort_buffer_size</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Both</td> <td>Yes</td> </tr><tr><th><a class="link" href="server-system-variables.html#sysvar_myisam_stats_method">myisam_stats_method</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Both</td> <td>Yes</td> </tr><tr><th><a class="link" href="server-system-variables.html#sysvar_myisam_use_mmap">myisam_use_mmap</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th><a class="link" href="server-system-variables.html#sysvar_tmp_table_size">tmp_table_size</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Both</td> <td>Yes</td> </tr></tbody></table>

The following system variables affect the behavior of `MyISAM` tables. For additional information, see Section 5.1.7, “Server System Variables”.

* `bulk_insert_buffer_size`

  The size of the tree cache used in bulk insert optimization.

  Note

  This is a limit *per thread*!

* `delay_key_write=ALL`

  Don't flush key buffers between writes for any `MyISAM` table.

  Note

  If you do this, you should not access `MyISAM` tables from another program (such as from another MySQL server or with **myisamchk**) when the tables are in use. Doing so risks index corruption. Using `--external-locking` does not eliminate this risk.

* `myisam_max_sort_file_size`

  The maximum size of the temporary file that MySQL is permitted to use while re-creating a `MyISAM` index (during `REPAIR TABLE`, `ALTER TABLE`, or `LOAD DATA`). If the file size would be larger than this value, the index is created using the key cache instead, which is slower. The value is given in bytes.

* `myisam_recover_options=mode`

  Set the mode for automatic recovery of crashed `MyISAM` tables.

* `myisam_sort_buffer_size`

  Set the size of the buffer used when recovering tables.

Automatic recovery is activated if you start **mysqld** with the `myisam_recover_options` system variable set. In this case, when the server opens a `MyISAM` table, it checks whether the table is marked as crashed or whether the open count variable for the table is not 0 and you are running the server with external locking disabled. If either of these conditions is true, the following happens:

* The server checks the table for errors.
* If the server finds an error, it tries to do a fast table repair (with sorting and without re-creating the data file).

* If the repair fails because of an error in the data file (for example, a duplicate-key error), the server tries again, this time re-creating the data file.

* If the repair still fails, the server tries once more with the old repair option method (write row by row without sorting). This method should be able to repair any type of error and has low disk space requirements.

If the recovery wouldn't be able to recover all rows from previously completed statements and you didn't specify `FORCE` in the value of the `myisam_recover_options` system variable, automatic repair aborts with an error message in the error log:

```sql
Error: Couldn't repair table: test.g00pages
```

If you specify `FORCE`, a warning like this is written instead:

```sql
Warning: Found 344 of 354 rows when repairing ./test/g00pages
```

If the automatic recovery value includes `BACKUP`, the recovery process creates files with names of the form `tbl_name-datetime.BAK`. You should have a **cron** script that automatically moves these files from the database directories to backup media.
