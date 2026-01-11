### 12.9.2 The utf8mb3 Character Set (3-Byte UTF-8 Unicode Encoding)

The `utf8mb3` character set has these characteristics:

* Supports BMP characters only (no support for supplementary characters)

* Requires a maximum of three bytes per multibyte character.

Applications that use UTF-8 data but require supplementary character support should use `utf8mb4` rather than `utf8mb3` (see Section 12.9.1, “The utf8mb4 Character Set (4-Byte UTF-8 Unicode Encoding)”")).

Exactly the same set of characters is available in `utf8mb3` and `ucs2`. That is, they have the same repertoire.

Note

The recommended character set for MySQL is `utf8mb4`. All new applications should use `utf8mb4`.

The `utf8mb3` character set is deprecated. `utf8mb3` remains supported for the lifetimes of the MySQL 8.0.x and MySQL 8.4.x LTS release series.

Expect `utf8mb3` to be removed in a future major release of MySQL.

Since changing character sets can be a complex and time-consuming task, you should begin to prepare for this change now by using `utf8mb4` for new applications. For guidance in converting existing applications which use utfmb3, see Section 12.9.8, “Converting Between 3-Byte and 4-Byte Unicode Character Sets”.

`utf8mb3` can be used in `CHARACTER SET` clauses, and `utf8mb3_collation_substring` in `COLLATE` clauses, where *`collation_substring`* is `bin`, `czech_ci`, `danish_ci`, `esperanto_ci`, `estonian_ci`, and so forth. For example:

```
CREATE TABLE t (s1 CHAR(1)) CHARACTER SET utf8mb3;
SELECT * FROM t WHERE s1 COLLATE utf8mb3_general_ci = 'x';
DECLARE x VARCHAR(5) CHARACTER SET utf8mb3 COLLATE utf8mb3_danish_ci;
SELECT CAST('a' AS CHAR CHARACTER SET utf8mb4) COLLATE utf8mb4_czech_ci;
```

In statements such as `SHOW CREATE TABLE` or `SELECT CHARACTER_SET_NAME FROM INFORMATION_SCHEMA.COLUMNS` or `SELECT COLLATION_NAME FROM INFORMATION_SCHEMA.COLUMNS`, character sets or collation names prefixed with `utf8` or `utf8_` are displayed using `utf8mb3` or `utf8mb3_`, respectively.

`utf8mb3` is also valid (but deprecated) in contexts other than `CHARACTER SET` clauses. For example:

```
mysqld --character-set-server=utf8mb3
```

```
SET NAMES 'utf8mb3'; /* and other SET statements that have similar effect */
SELECT _utf8mb3 'a';
```

For information about data type storage as it relates to multibyte character sets, see String Type Storage Requirements.
