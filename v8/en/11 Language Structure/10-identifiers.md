## 11.2 Schema Object Names

Certain objects within MySQL, including database, table, index, column, alias, view, stored procedure, partition, tablespace, resource group and other object names are known as identifiers. This section describes the permissible syntax for identifiers in MySQL.  Section 11.2.1, “Identifier Length Limits”, indicates the maximum length of each type of identifier. Section 11.2.3, “Identifier Case Sensitivity”, describes which types of identifiers are case-sensitive and under what conditions.

An identifier may be quoted or unquoted. If an identifier contains special characters or is a reserved word, you *must* quote it whenever you refer to it. (Exception: A reserved word that follows a period in a qualified name must be an identifier, so it need not be quoted.) Reserved words are listed at  Section 11.3, “Keywords and Reserved Words”.

Internally, identifiers are converted to and are stored as Unicode (UTF-8). The permissible Unicode characters in identifiers are those in the Basic Multilingual Plane (BMP). Supplementary characters are not permitted. Identifiers thus may contain these characters:

* Permitted characters in unquoted identifiers:

  + ASCII: [0-9,a-z,A-Z$_] (basic Latin letters, digits 0-9, dollar, underscore)
  + Extended: U+0080 .. U+FFFF
* Permitted characters in quoted identifiers include the full Unicode Basic Multilingual Plane (BMP), except U+0000:

  + ASCII: U+0001 .. U+007F
  + Extended: U+0080 .. U+FFFF
* ASCII NUL (U+0000) and supplementary characters (U+10000 and higher) are not permitted in quoted or unquoted identifiers.
* Identifiers may begin with a digit but unless quoted may not consist solely of digits.
* Database, table, and column names cannot end with space characters.
* Use of the dollar sign as the first character in the unquoted name of a database, table, view, column, stored program, or alias is deprecated, including such names used with qualifiers (see  Section 11.2.2, “Identifier Qualifiers”). An unquoted identifier beginning with a dollar sign cannot contain any additional dollar sign characters. Otherwise, the leading dollar sign is permitted but triggers a deprecation warning.

  The dollar sign can still be used as the leading character of such an identifier without producing the warning, when it is quoted according to the rules given later in this section.

The identifier quote character is the backtick (`` ` ``):

```
mysql> SELECT * FROM `select` WHERE `select`.id > 100;
```

If the  `ANSI_QUOTES` SQL mode is enabled, it is also permissible to quote identifiers within double quotation marks:

```
mysql> CREATE TABLE "test" (col INT);
ERROR 1064: You have an error in your SQL syntax...
mysql> SET sql_mode='ANSI_QUOTES';
mysql> CREATE TABLE "test" (col INT);
Query OK, 0 rows affected (0.00 sec)
```

The  `ANSI_QUOTES` mode causes the server to interpret double-quoted strings as identifiers. Consequently, when this mode is enabled, string literals must be enclosed within single quotation marks. They cannot be enclosed within double quotation marks. The server SQL mode is controlled as described in  Section 7.1.11, “Server SQL Modes”.

Identifier quote characters can be included within an identifier if you quote the identifier. If the character to be included within the identifier is the same as that used to quote the identifier itself, then you need to double the character. The following statement creates a table named `` a`b `` that contains a column named `c"d`:

```
mysql> CREATE TABLE `a``b` (`c"d` INT);
```

In the select list of a query, a quoted column alias can be specified using identifier or string quoting characters:

```
mysql> SELECT 1 AS `one`, 2 AS 'two';
+-----+-----+
| one | two |
+-----+-----+
|   1 |   2 |
+-----+-----+
```

Elsewhere in the statement, quoted references to the alias must use identifier quoting or the reference is treated as a string literal.

It is recommended that you do not use names that begin with `Me` or `MeN`, where *`M`* and *`N`* are integers. For example, avoid using `1e` as an identifier, because an expression such as `1e+3` is ambiguous. Depending on context, it might be interpreted as the expression `1e
+ 3` or as the number `1e+3`.

Be careful when using  `MD5()` to produce table names because it can produce names in illegal or ambiguous formats such as those just described.

It is also recommended that you do not use column names that begin with `!hidden!` to ensure that new names do not collide with names used by existing hidden columns for functional indexes.

A user variable cannot be used directly in an SQL statement as an identifier or as part of an identifier. See Section 11.4, “User-Defined Variables”, for more information and examples of workarounds.

Special characters in database and table names are encoded in the corresponding file system names as described in Section 11.2.4, “Mapping of Identifiers to File Names”.


