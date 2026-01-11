### 18.2.1 MyISAM Startup Options

The following options to **mysqld** can be used to change the behavior of `MyISAM` tables. For additional information, see Section 7.1.7, “Server Command Options”.

**Table 18.3 MyISAM Option and Variable Reference**

<table summary="Reference for MyISAM command-line options and system variables."><thead><tr><th scope="col">Name</th> <th scope="col">Cmd-Line</th> <th scope="col">Option File</th> <th scope="col">System Var</th> <th scope="col">Status Var</th> <th scope="col">Var Scope</th> <th scope="col">Dynamic</th> </tr></thead><tbody><tr><th>bulk_insert_buffer_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Both</td> <td>Yes</td> </tr><tr><th>concurrent_insert</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>delay_key_write</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>have_rtree_keys</th> <td></td> <td></td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th>key_buffer_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>log-isam</th> <td>Yes</td> <td>Yes</td> <td></td> <td></td> <td></td> <td></td> </tr><tr><th>myisam-block-size</th> <td>Yes</td> <td>Yes</td> <td></td> <td></td> <td></td> <td></td> </tr><tr><th>myisam_data_pointer_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>myisam_max_sort_file_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>myisam_mmap_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th>myisam_recover_options</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th>myisam_repair_threads</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Both</td> <td>Yes</td> </tr><tr><th>myisam_sort_buffer_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Both</td> <td>Yes</td> </tr><tr><th>myisam_stats_method</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Both</td> <td>Yes</td> </tr><tr><th>myisam_use_mmap</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>tmp_table_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Both</td> <td>Yes</td> </tr></tbody></table>

The following system variables affect the behavior of `MyISAM` tables. For additional information, see Section 7.1.8, “Server System Variables”.

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

```
Error: Couldn't repair table: test.g00pages
```

If you specify `FORCE`, a warning like this is written instead:

```
Warning: Found 344 of 354 rows when repairing ./test/g00pages
```

If the automatic recovery value includes `BACKUP`, the recovery process creates files with names of the form `tbl_name-datetime.BAK`. You should have a **cron** script that automatically moves these files from the database directories to backup media.
