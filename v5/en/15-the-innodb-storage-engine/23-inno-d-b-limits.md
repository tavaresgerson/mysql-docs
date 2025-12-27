## 14.23 InnoDB Limits

This section describes limits for `InnoDB` tables, indexes, tablespaces, and other aspects of the `InnoDB` storage engine.

* A table can contain a maximum of 1017 columns (raised in MySQL 5.6.9 from the earlier limit of 1000). Virtual generated columns are included in this limit.

* A table can contain a maximum of 64 secondary indexes.

* If `innodb_large_prefix` is enabled (the default), the index key prefix limit is 3072 bytes for `InnoDB` tables that use the `DYNAMIC` or `COMPRESSED` row format. If `innodb_large_prefix` is disabled, the index key prefix limit is 767 bytes for tables of any row format.

  `innodb_large_prefix` is deprecated; expect it to be removed in a future MySQL release. `innodb_large_prefix` was introduced in MySQL 5.5 to disable large index key prefixes for compatibility with earlier versions of `InnoDB` that do not support large index key prefixes.

  The index key prefix length limit is 767 bytes for `InnoDB` tables that use the `REDUNDANT` or `COMPACT` row format. For example, you might hit this limit with a column prefix index of more than 255 characters on a `TEXT` or `VARCHAR` column, assuming a `utf8mb3` character set and the maximum of 3 bytes for each character.

  Attempting to use an index key prefix length that exceeds the limit returns an error. To avoid such errors in replication configurations, avoid enabling `innodb_large_prefix` on the source if it cannot also be enabled on replicas.

  If you reduce the `InnoDB` page size to 8KB or 4KB by specifying the `innodb_page_size` option when creating the MySQL instance, the maximum length of the index key is lowered proportionally, based on the limit of 3072 bytes for a 16KB page size. That is, the maximum index key length is 1536 bytes when the page size is 8KB, and 768 bytes when the page size is 4KB.

  The limits that apply to index key prefixes also apply to full-column index keys.

* A maximum of 16 columns is permitted for multicolumn indexes. Exceeding the limit returns an error.

  ```sql
  ERROR 1070 (42000): Too many key parts specified; max 16 parts allowed
  ```

* The maximum row size, excluding any variable-length columns that are stored off-page, is slightly less than half of a page for 4KB, 8KB, 16KB, and 32KB page sizes. For example, the maximum row size for the default `innodb_page_size` of 16KB is about 8000 bytes. However, for an `InnoDB` page size of 64KB, the maximum row size is approximately 16000 bytes. `LONGBLOB` and `LONGTEXT` columns must be less than 4GB, and the total row size, including `BLOB` and `TEXT` columns, must be less than 4GB.

  If a row is less than half a page long, all of it is stored locally within the page. If it exceeds half a page, variable-length columns are chosen for external off-page storage until the row fits within half a page, as described in Section 14.12.2, “File Space Management”.

* Although `InnoDB` supports row sizes larger than 65,535 bytes internally, MySQL itself imposes a row-size limit of 65,535 for the combined size of all columns. See Section 8.4.7, “Limits on Table Column Count and Row Size”.

* On some older operating systems, files must be less than 2GB. This is not an `InnoDB` limitation. If you require a large system tablespace, configure it using several smaller data files rather than one large data file, or distribute table data across file-per-table and general tablespace data files.

* The combined maximum size for `InnoDB` log files is 512GB.

* The minimum tablespace size is slightly larger than 10MB. The maximum tablespace size depends on the `InnoDB` page size.

  **Table 14.25 InnoDB Maximum Tablespace Size**

  <table summary="The maximum tablespace size for each InnoDB page size."><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>InnoDB Page Size</th> <th>Maximum Tablespace Size</th> </tr></thead><tbody><tr> <td>4KB</td> <td>16TB</td> </tr><tr> <td>8KB</td> <td>32TB</td> </tr><tr> <td>16KB</td> <td>64TB</td> </tr><tr> <td>32KB</td> <td>128TB</td> </tr><tr> <td>64KB</td> <td>256TB</td> </tr></tbody></table>

  The maximum tablespace size is also the maximum size for a table.

* Tablespace files cannot exceed 4GB on Windows 32-bit systems (Bug #80149).

* An `InnoDB` instance supports up to 2^32 (4294967296) tablespaces, with a small number of those tablespaces reserved for undo and temporary tables.

* Shared tablespaces support up to 2^32 (4294967296) tables.
* The path of a tablespace file, including the file name, cannot exceed the `MAX_PATH` limit on Windows. Prior to Windows 10, the `MAX_PATH` limit is 260 characters. As of Windows 10, version 1607, `MAX_PATH` limitations are removed from common Win32 file and directory functions, but you must enable the new behavior.

* `ROW_FORMAT=COMPRESSED` in the Barracuda file format assumes that the page size is at most 16KB and uses 14-bit pointers.

* For limits associated with concurrent read-write transactions, see Section 14.6.7, “Undo Logs”.
