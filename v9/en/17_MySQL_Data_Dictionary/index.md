# Chapter 16 MySQL Data Dictionary

**Table of Contents**

[16.1 Data Dictionary Schema](data-dictionary-schema.html)

[16.2 Removal of File-based Metadata Storage](data-dictionary-file-removal.html)

[16.3 Transactional Storage of Dictionary Data](data-dictionary-transactional-storage.html)

[16.4 Dictionary Object Cache](data-dictionary-object-cache.html)

[16.5 INFORMATION\_SCHEMA and Data Dictionary Integration](data-dictionary-information-schema.html)

[16.6 Serialized Dictionary Information (SDI)](serialized-dictionary-information.html)

[16.7 Data Dictionary Usage Differences](data-dictionary-usage-differences.html)

[16.8 Data Dictionary Limitations](data-dictionary-limitations.html)

MySQL Server incorporates a transactional data dictionary that
stores information about database objects. In previous MySQL
releases, dictionary data was stored in metadata files,
nontransactional tables, and storage engine-specific data
dictionaries.

This chapter describes the main features, benefits, usage
differences, and limitations of the data dictionary. For other
implications of the data dictionary feature, refer to the
“Data Dictionary Notes” section in the
[MySQL
9.5 Release Notes](/doc/relnotes/mysql/9.5/en/).

Benefits of the MySQL data dictionary include:

* Simplicity of a centralized data dictionary schema that
  uniformly stores dictionary data. See
  [Section 16.1, “Data Dictionary Schema”](data-dictionary-schema.html "16.1 Data Dictionary Schema").

* Removal of file-based metadata storage. See
  [Section 16.2, “Removal of File-based Metadata Storage”](data-dictionary-file-removal.html "16.2 Removal of File-based Metadata Storage").

* Transactional, crash-safe storage of dictionary data. See
  [Section 16.3, “Transactional Storage of Dictionary Data”](data-dictionary-transactional-storage.html "16.3 Transactional Storage of Dictionary Data").

* Uniform and centralized caching for dictionary objects. See
  [Section 16.4, “Dictionary Object Cache”](data-dictionary-object-cache.html "16.4 Dictionary Object Cache").

* A simpler and improved implementation for some
  [`INFORMATION_SCHEMA`](information-schema.html "Chapter 28 INFORMATION_SCHEMA Tables") tables. See
  [Section 16.5, “INFORMATION\_SCHEMA and Data Dictionary Integration”](data-dictionary-information-schema.html "16.5 INFORMATION_SCHEMA and Data Dictionary Integration").

* Atomic DDL. See [Section 15.1.1, “Atomic Data Definition Statement Support”](atomic-ddl.html "15.1.1 Atomic Data Definition Statement Support").