### 11.1.7 NULL Values

The `NULL` value means “no data.”
`NULL` can be written in any lettercase.

Be aware that the `NULL` value is different
from values such as `0` for numeric types or
the empty string for string types. For more information, see
[Section B.3.4.3, “Problems with NULL Values”](problems-with-null.html "B.3.4.3 Problems with NULL Values").

For text file import or export operations performed with
[`LOAD DATA`](load-data.html "15.2.9 LOAD DATA Statement") or
[`SELECT ... INTO
OUTFILE`](select-into.html "15.2.13.1 SELECT ... INTO Statement"), `NULL` is represented by the
`\N` sequence. See [Section 15.2.9, “LOAD DATA Statement”](load-data.html "15.2.9 LOAD DATA Statement").

For sorting with `ORDER BY`,
`NULL` values sort before other values for
ascending sorts, after other values for descending sorts.