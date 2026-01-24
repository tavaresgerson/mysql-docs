## 14.10 InnoDB File-Format Management

14.10.1 Enabling File Formats

14.10.2 Verifying File Format Compatibility

14.10.3 Identifying the File Format in Use

14.10.4 Modifying the File Format

As `InnoDB` evolves, data file formats that are not compatible with prior versions of `InnoDB` are sometimes required to support new features. To help manage compatibility in upgrade and downgrade situations, and systems that run different versions of MySQL, `InnoDB` uses named file formats. `InnoDB` currently supports two named file formats, Antelope and Barracuda.

* Antelope is the original `InnoDB` file format, which previously did not have a name. It supports the COMPACT and REDUNDANT row formats for `InnoDB` tables.

* Barracuda is the newest file format. It supports all `InnoDB` row formats including the newer COMPRESSED and DYNAMIC row formats. The features associated with COMPRESSED and DYNAMIC row formats include compressed tables, efficient storage of off-page columns, and index key prefixes up to 3072 bytes (`innodb_large_prefix`). See Section 14.11, “InnoDB Row Formats”.

This section discusses enabling `InnoDB` file formats for new `InnoDB` tables, verifying compatibility of different file formats between MySQL releases, and identifying the file format in use.

InnoDB file format settings do not apply to tables stored in general tablespaces. General tablespaces provide support for all row formats and associated features. For more information, see Section 14.6.3.3, “General Tablespaces”.

Note

The following file format configuration parameters have new default values:

* The `innodb_file_format` default value was changed to `Barracuda`. The previous default value was `Antelope`.

* The `innodb_large_prefix` default value was changed to `ON`. The previous default was `OFF`.

The following file format configuration parameters are deprecated in and may be removed in a future release:

* `innodb_file_format`
* `innodb_file_format_check`
* `innodb_file_format_max`
* `innodb_large_prefix`

The file format configuration parameters were provided for creating tables compatible with earlier versions of `InnoDB` in MySQL 5.1. Now that MySQL 5.1 has reached the end of its product lifecycle, the parameters are no longer required.
