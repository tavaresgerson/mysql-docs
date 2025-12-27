### 9.1.7 NULL Values

The `NULL` value means “no data.” `NULL` can be written in any lettercase. A synonym is `\N` (case-sensitive). Treatment of `\N` as a synonym for `NULL` in SQL statements is deprecated as of MySQL 5.7.18 and is removed in MySQL 8.0; use `NULL` instead.

Be aware that the `NULL` value is different from values such as `0` for numeric types or the empty string for string types. For more information, see Section B.3.4.3, “Problems with NULL Values”.

For text file import or export operations performed with `LOAD DATA` or `SELECT ... INTO OUTFILE`, `NULL` is represented by the `\N` sequence. See Section 13.2.6, “LOAD DATA Statement”. Use of `\N` in text files is unaffected by the deprecation of `\N` in SQL statements.

For sorting with `ORDER BY`, `NULL` values sort before other values for ascending sorts, after other values for descending sorts.
