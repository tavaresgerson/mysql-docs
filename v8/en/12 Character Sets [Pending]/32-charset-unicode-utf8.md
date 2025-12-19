--- title: MySQL 8.4 Reference Manual :: 12.9.3 The utf8 Character Set (Deprecated alias for utf8mb3) url: https://dev.mysql.com/doc/refman/8.4/en/charset-unicode-utf8.html order: 32 ---



### 12.9.3 The utf8 Character Set (Deprecated alias for utf8mb3)

`utf8` has been used by MySQL in the past as an alias for the `utf8mb3` character set, but this usage is now deprecated; in MySQL 8.4, `SHOW` statements and columns of `INFORMATION_SCHEMA` tables display `utf8mb3` instead. For more information, see Section 12.9.2, “The utf8mb3 Character Set (3-Byte UTF-8 Unicode Encoding)”").

::: info Note

The recommended character set for MySQL is `utf8mb4`. All new applications should use `utf8mb4`.

The `utf8mb3` character set is deprecated. `utf8mb3` remains supported for the lifetimes of the MySQL 8.0.x and MySQL 8.4.x LTS release series.

Expect `utf8mb3` to be removed in a future major release of MySQL.

Since changing character sets can be a complex and time-consuming task, you should begin to prepare for this change now by using `utf8mb4` for new applications. For guidance in converting existing applications which use utfmb3, see Section 12.9.8, “Converting Between 3-Byte and 4-Byte Unicode Character Sets”.


:::

