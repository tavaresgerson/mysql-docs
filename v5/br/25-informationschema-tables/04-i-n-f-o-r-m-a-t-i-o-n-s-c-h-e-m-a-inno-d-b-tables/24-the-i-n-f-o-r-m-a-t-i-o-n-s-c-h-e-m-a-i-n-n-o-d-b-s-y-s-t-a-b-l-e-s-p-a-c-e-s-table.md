### 24.4.24 The INFORMATION_SCHEMA INNODB_SYS_TABLESPACES Table

The [`INNODB_SYS_TABLESPACES`](information-schema-innodb-sys-tablespaces-table.html "24.4.24 The INFORMATION_SCHEMA INNODB_SYS_TABLESPACES Table") table provides metadata about `InnoDB` file-per-table and general tablespaces, equivalent to the information in the `SYS_TABLESPACES` table in the `InnoDB` data dictionary.

For related usage information and examples, see [Section 14.16.3, “InnoDB INFORMATION_SCHEMA System Tables”](innodb-information-schema-system-tables.html "14.16.3 InnoDB INFORMATION_SCHEMA System Tables").

Note

The `INFORMATION_SCHEMA` [`FILES`](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table") table reports metadata for all `InnoDB` tablespace types including file-per-table tablespaces, general tablespaces, the system tablespace, the temporary tablespace, and undo tablespaces, if present.

The [`INNODB_SYS_TABLESPACES`](information-schema-innodb-sys-tablespaces-table.html "24.4.24 The INFORMATION_SCHEMA INNODB_SYS_TABLESPACES Table") table has these columns:

* `SPACE`

  The tablespace ID.

* `NAME`

  The schema (database) and table name.

* `FLAG`

  A numeric value that represents bit-level information about tablespace format and storage characteristics.

* `FILE_FORMAT`

  The tablespace file format. For example, [Antelope](glossary.html#glos_antelope "Antelope"), [Barracuda](glossary.html#glos_barracuda "Barracuda"), or `Any` ([general tablespaces](glossary.html#glos_general_tablespace "general tablespace") support any row format). The data in this field is interpreted from the tablespace flags information that resides in the [.ibd file](glossary.html#glos_ibd_file ".ibd file"). For more information about `InnoDB` file formats, see [Section 14.10, “InnoDB File-Format Management”](innodb-file-format.html "14.10 InnoDB File-Format Management").

* `ROW_FORMAT`

  The tablespace row format (`Compact or Redundant`, `Dynamic`, or `Compressed`). The data in this column is interpreted from the tablespace flags information that resides in the [`.ibd` file](glossary.html#glos_ibd_file ".ibd file").

* `PAGE_SIZE`

  The tablespace page size. The data in this column is interpreted from the tablespace flags information that resides in the [`.ibd` file](glossary.html#glos_ibd_file ".ibd file").

* `ZIP_PAGE_SIZE`

  The tablespace zip page size. The data in this column is interpreted from the tablespace flags information that resides in the [`.ibd` file](glossary.html#glos_ibd_file ".ibd file").

* `SPACE_TYPE`

  The type of tablespace. Possible values include `General` for general tablespaces and `Single` for file-per-table tablespaces.

* `FS_BLOCK_SIZE`

  The file system block size, which is the unit size used for hole punching. This column pertains to the `InnoDB` [transparent page compression](innodb-page-compression.html "14.9.2 InnoDB Page Compression") feature.

* `FILE_SIZE`

  The apparent size of the file, which represents the maximum size of the file, uncompressed. This column pertains to the `InnoDB` [transparent page compression](innodb-page-compression.html "14.9.2 InnoDB Page Compression") feature.

* `ALLOCATED_SIZE`

  The actual size of the file, which is the amount of space allocated on disk. This column pertains to the `InnoDB` [transparent page compression](innodb-page-compression.html "14.9.2 InnoDB Page Compression") feature.

#### Example

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_TABLESPACES WHERE SPACE = 26\G
*************************** 1. row ***************************
         SPACE: 26
          NAME: test/t1
          FLAG: 0
   FILE_FORMAT: Antelope
    ROW_FORMAT: Compact or Redundant
     PAGE_SIZE: 16384
 ZIP_PAGE_SIZE: 0
    SPACE_TYPE: Single
 FS_BLOCK_SIZE: 4096
     FILE_SIZE: 98304
ALLOCATED_SIZE: 65536
```

#### Notes

* You must have the [`PROCESS`](privileges-provided.html#priv_process) privilege to query this table.

* Use the `INFORMATION_SCHEMA` [`COLUMNS`](information-schema-columns-table.html "24.3.5 The INFORMATION_SCHEMA COLUMNS Table") table or the [`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement") statement to view additional information about the columns of this table, including data types and default values.

* Because tablespace flags are always zero for all Antelope file formats (unlike table flags), there is no way to determine from this flag integer if the tablespace row format is Redundant or Compact. As a result, the possible values for the `ROW_FORMAT` field are “Compact or Redundant”, “Compressed”, or “Dynamic.”

* With the introduction of general tablespaces, `InnoDB` system tablespace data (for SPACE 0) is exposed in `INNODB_SYS_TABLESPACES`.
