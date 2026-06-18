## 14.10 InnoDB File-Format Management

[14.10.1 Enabling File Formats](innodb-file-format-enabling.html)

[14.10.2 Verifying File Format Compatibility](innodb-file-format-compatibility.html)

[14.10.3 Identifying the File Format in Use](innodb-file-format-identifying.html)

[14.10.4 Modifying the File Format](innodb-file-format-downgrading.html)

As `InnoDB` evolves, data file formats that are not
compatible with prior versions of `InnoDB` are
sometimes required to support new features. To help manage
compatibility in upgrade and downgrade situations, and systems that
run different versions of MySQL, `InnoDB` uses
named file formats. `InnoDB` currently supports two
named file formats, [Antelope](glossary.html#glos_antelope "Antelope")
and [Barracuda](glossary.html#glos_barracuda "Barracuda").

* [Antelope](glossary.html#glos_antelope "Antelope") is the original
  `InnoDB` file format, which previously did not
  have a name. It supports the
  [COMPACT](glossary.html#glos_compact_row_format "compact row format") and
  [REDUNDANT](glossary.html#glos_redundant_row_format "redundant row format") row
  formats for `InnoDB` tables.

* [Barracuda](glossary.html#glos_barracuda "Barracuda") is the newest
  file format. It supports all `InnoDB` row
  formats including the newer
  [COMPRESSED](glossary.html#glos_compressed_row_format "compressed row format") and
  [DYNAMIC](glossary.html#glos_dynamic_row_format "dynamic row format") row
  formats. The features associated with
  [COMPRESSED](glossary.html#glos_compressed_row_format "compressed row format") and
  [DYNAMIC](glossary.html#glos_dynamic_row_format "dynamic row format") row
  formats include compressed tables, efficient storage of off-page
  columns, and index key prefixes up to 3072 bytes
  ([`innodb_large_prefix`](innodb-parameters.html#sysvar_innodb_large_prefix)). See
  [Section 14.11, “InnoDB Row Formats”](innodb-row-format.html "14.11 InnoDB Row Formats").

This section discusses enabling `InnoDB` file
formats for new `InnoDB` tables, verifying
compatibility of different file formats between MySQL releases, and
identifying the file format in use.

InnoDB file format settings do not apply to tables stored in
[general tablespaces](general-tablespaces.html "14.6.3.3 General Tablespaces").
General tablespaces provide support for all row formats and
associated features. For more information, see
[Section 14.6.3.3, “General Tablespaces”](general-tablespaces.html "14.6.3.3 General Tablespaces").

Note

The following file format configuration parameters have new
default values:

* The [`innodb_file_format`](innodb-parameters.html#sysvar_innodb_file_format)
  default value was changed to `Barracuda`. The
  previous default value was `Antelope`.

* The [`innodb_large_prefix`](innodb-parameters.html#sysvar_innodb_large_prefix)
  default value was changed to `ON`. The
  previous default was `OFF`.

The following file format configuration parameters are deprecated
in and may be removed in a future release:

* [`innodb_file_format`](innodb-parameters.html#sysvar_innodb_file_format)
* [`innodb_file_format_check`](innodb-parameters.html#sysvar_innodb_file_format_check)
* [`innodb_file_format_max`](innodb-parameters.html#sysvar_innodb_file_format_max)
* [`innodb_large_prefix`](innodb-parameters.html#sysvar_innodb_large_prefix)

The file format configuration parameters were provided for
creating tables compatible with earlier versions of
`InnoDB` in MySQL 5.1. Now that MySQL 5.1 has
reached the end of its product lifecycle, the parameters are no
longer required.