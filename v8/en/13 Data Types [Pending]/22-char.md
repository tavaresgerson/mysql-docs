--- title: MySQL 8.4 Reference Manual :: 13.3.2 The CHAR and VARCHAR Types url: https://dev.mysql.com/doc/refman/8.4/en/char.html order: 22 ---



### 13.3.2 The CHAR and VARCHAR Types

The `CHAR` and `VARCHAR` types are similar, but differ in the way they are stored and retrieved. They also differ in maximum length and in whether trailing spaces are retained.

The `CHAR` and `VARCHAR` types are declared with a length that indicates the maximum number of characters you want to store. For example, `CHAR(30)` can hold up to 30 characters.

The length of a `CHAR` column is fixed to the length that you declare when you create the table. The length can be any value from 0 to 255. When `CHAR` values are stored, they are right-padded with spaces to the specified length. When `CHAR` values are retrieved, trailing spaces are removed unless the `PAD_CHAR_TO_FULL_LENGTH` SQL mode is enabled.

Values in `VARCHAR` columns are variable-length strings. The length can be specified as a value from 0 to 65,535. The effective maximum length of a `VARCHAR` is subject to the maximum row size (65,535 bytes, which is shared among all columns) and the character set used. See  Section 10.4.7, “Limits on Table Column Count and Row Size”.

In contrast to `CHAR`, `VARCHAR` values are stored as a 1-byte or 2-byte length prefix plus data. The length prefix indicates the number of bytes in the value. A column uses one length byte if values require no more than 255 bytes, two length bytes if values may require more than 255 bytes.

If strict SQL mode is not enabled and you assign a value to a `CHAR` or `VARCHAR` column that exceeds the column's maximum length, the value is truncated to fit and a warning is generated. For truncation of nonspace characters, you can cause an error to occur (rather than a warning) and suppress insertion of the value by using strict SQL mode. See  Section 7.1.11, “Server SQL Modes”.

For `VARCHAR` columns, trailing spaces in excess of the column length are truncated prior to insertion and a warning is generated, regardless of the SQL mode in use. For `CHAR` columns, truncation of excess trailing spaces from inserted values is performed silently regardless of the SQL mode.

`VARCHAR` values are not padded when they are stored. Trailing spaces are retained when values are stored and retrieved, in conformance with standard SQL.

The following table illustrates the differences between `CHAR` and `VARCHAR` by showing the result of storing various string values into `CHAR(4)` and `VARCHAR(4)` columns (assuming that the column uses a single-byte character set such as `latin1`).

<table><col style="width: 15%"/><col style="width: 15%"/><col style="width: 20%"/><col style="width: 15%"/><col style="width: 20%"/><thead><tr> <th>Value</th> <th><code>CHAR(4)</code></th> <th>Storage Required</th> <th><code>VARCHAR(4)</code></th> <th>Storage Required</th> </tr></thead><tbody><tr> <th><code>''</code></th> <td><code>'    '</code></td> <td>4 bytes</td> <td><code>''</code></td> <td>1 byte</td> </tr><tr> <th><code>'ab'</code></th> <td><code>'ab  '</code></td> <td>4 bytes</td> <td><code>'ab'</code></td> <td>3 bytes</td> </tr><tr> <th><code>'abcd'</code></th> <td><code>'abcd'</code></td> <td>4 bytes</td> <td><code>'abcd'</code></td> <td>5 bytes</td> </tr><tr> <th><code>'abcdefgh'</code></th> <td><code>'abcd'</code></td> <td>4 bytes</td> <td><code>'abcd'</code></td> <td>5 bytes</td> </tr></tbody></table>

The values shown as stored in the last row of the table apply *only when not using strict SQL mode*; if strict mode is enabled, values that exceed the column length are *not stored*, and an error results.

`InnoDB` encodes fixed-length fields greater than or equal to 768 bytes in length as variable-length fields, which can be stored off-page. For example, a `CHAR(255)` column can exceed 768 bytes if the maximum byte length of the character set is greater than 3, as it is with `utf8mb4`.

If a given value is stored into the `CHAR(4)` and `VARCHAR(4)` columns, the values retrieved from the columns are not always the same because trailing spaces are removed from `CHAR` columns upon retrieval. The following example illustrates this difference:

```
mysql> CREATE TABLE vc (v VARCHAR(4), c CHAR(4));
Query OK, 0 rows affected (0.01 sec)

mysql> INSERT INTO vc VALUES ('ab  ', 'ab  ');
Query OK, 1 row affected (0.00 sec)

mysql> SELECT CONCAT('(', v, ')'), CONCAT('(', c, ')') FROM vc;
+---------------------+---------------------+
| CONCAT('(', v, ')') | CONCAT('(', c, ')') |
+---------------------+---------------------+
| (ab  )              | (ab)                |
+---------------------+---------------------+
1 row in set (0.06 sec)
```

Values in `CHAR`, `VARCHAR`, and `TEXT` columns are sorted and compared according to the character set collation assigned to the column.

MySQL collations have a pad attribute of `PAD SPACE`, other than Unicode collations based on UCA 9.0.0 and higher, which have a pad attribute of `NO PAD`. (see  Section 12.10.1, “Unicode Character Sets”).

To determine the pad attribute for a collation, use the `INFORMATION_SCHEMA` `COLLATIONS` table, which has a `PAD_ATTRIBUTE` column.

For nonbinary strings (`CHAR`, `VARCHAR`, and `TEXT` values), the string collation pad attribute determines treatment in comparisons of trailing spaces at the end of strings. `NO PAD` collations treat trailing spaces as significant in comparisons, like any other character. `PAD SPACE` collations treat trailing spaces as insignificant in comparisons; strings are compared without regard to trailing spaces. See Trailing Space Handling in Comparisons. The server SQL mode has no effect on comparison behavior with respect to trailing spaces.

::: info Note

For more information about MySQL character sets and collations, see  Chapter 12, *Character Sets, Collations, Unicode*. For additional information about storage requirements, see Section 13.7, “Data Type Storage Requirements”.


:::

For those cases where trailing pad characters are stripped or comparisons ignore them, if a column has an index that requires unique values, inserting into the column values that differ only in number of trailing pad characters results in a duplicate-key error. For example, if a table contains `'a'`, an attempt to store `'a '` causes a duplicate-key error.


