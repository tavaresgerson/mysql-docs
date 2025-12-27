## 12.11 Restrictions on Character Sets

* Identifiers are stored in `mysql` database tables (`user`, `db`, and so forth) using `utf8mb3`, but identifiers can contain only characters in the Basic Multilingual Plane (BMP). Supplementary characters are not permitted in identifiers.
* The `ucs2`, `utf16`, `utf16le`, and `utf32` character sets have the following restrictions:

  + None of them can be used as the client character set. See Impermissible Client Character Sets.
  + It is currently not possible to use `LOAD DATA` to load data files that use these character sets.
  + `FULLTEXT` indexes cannot be created on a column that uses any of these character sets. However, you can perform `IN BOOLEAN MODE` searches on the column without an index.
* The  `REGEXP` and `RLIKE` operators work in byte-wise fashion, so they are not multibyte safe and may produce unexpected results with multibyte character sets. In addition, these operators compare characters by their byte values and accented characters may not compare as equal even if a given collation treats them as equal.

