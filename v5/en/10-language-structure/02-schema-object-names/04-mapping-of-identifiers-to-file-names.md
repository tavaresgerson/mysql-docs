### 9.2.4 Mapping of Identifiers to File Names

There is a correspondence between database and table identifiers and names in the file system. For the basic structure, MySQL represents each database as a directory in the data directory, and each table by one or more files in the appropriate database directory. For the table format files (`.FRM`), the data is always stored in this structure and location.

For the data and index files, the exact representation on disk is storage engine specific. These files may be stored in the same location as the `FRM` files, or the information may be stored in a separate file. `InnoDB` data is stored in the InnoDB data files. If you are using tablespaces with `InnoDB`, then the specific tablespace files you create are used instead.

Any character is legal in database or table identifiers except ASCII NUL (`X'00'`). MySQL encodes any characters that are problematic in the corresponding file system objects when it creates database directories or table files:

* Basic Latin letters (`a..zA..Z`), digits (`0..9`) and underscore (`_`) are encoded as is. Consequently, their case sensitivity directly depends on file system features.

* All other national letters from alphabets that have uppercase/lowercase mapping are encoded as shown in the following table. Values in the Code Range column are UCS-2 values.

  <table summary="The encoding for national letters from alphabets that have uppercase/lowercase mapping, excluding basic Latin letters (a..zA..Z), digits (0..9) and underscore (_), which are encoded as is."><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 25%"/><thead><tr> <th>Code Range</th> <th>Pattern</th> <th>Number</th> <th>Used</th> <th>Unused</th> <th>Blocks</th> </tr></thead><tbody><tr> <th>00C0..017F</th> <td>[@][0..4][g..z]</td> <td>5*20= 100</td> <td>97</td> <td>3</td> <td>Latin-1 Supplement + Latin Extended-A</td> </tr><tr> <th>0370..03FF</th> <td>[@][5..9][g..z]</td> <td>5*20= 100</td> <td>88</td> <td>12</td> <td>Greek and Coptic</td> </tr><tr> <th>0400..052F</th> <td>[@][g..z][0..6]</td> <td>20*7= 140</td> <td>137</td> <td>3</td> <td>Cyrillic + Cyrillic Supplement</td> </tr><tr> <th>0530..058F</th> <td>[@][g..z][7..8]</td> <td>20*2= 40</td> <td>38</td> <td>2</td> <td>Armenian</td> </tr><tr> <th>2160..217F</th> <td>[@][g..z][9]</td> <td>20*1= 20</td> <td>16</td> <td>4</td> <td>Number Forms</td> </tr><tr> <th>0180..02AF</th> <td>[@][g..z][a..k]</td> <td>20*11=220</td> <td>203</td> <td>17</td> <td>Latin Extended-B + IPA Extensions</td> </tr><tr> <th>1E00..1EFF</th> <td>[@][g..z][l..r]</td> <td>20*7= 140</td> <td>136</td> <td>4</td> <td>Latin Extended Additional</td> </tr><tr> <th>1F00..1FFF</th> <td>[@][g..z][s..z]</td> <td>20*8= 160</td> <td>144</td> <td>16</td> <td>Greek Extended</td> </tr><tr> <th>.... ....</th> <td>[@][a..f][g..z]</td> <td>6*20= 120</td> <td>0</td> <td>120</td> <td>RESERVED</td> </tr><tr> <th>24B6..24E9</th> <td>[@][@][a..z]</td> <td>26</td> <td>26</td> <td>0</td> <td>Enclosed Alphanumerics</td> </tr><tr> <th>FF21..FF5A</th> <td>[@][a..z][@]</td> <td>26</td> <td>26</td> <td>0</td> <td>Halfwidth and Fullwidth forms</td> </tr></tbody></table>

  One of the bytes in the sequence encodes lettercase. For example: `LATIN CAPITAL LETTER A WITH GRAVE` is encoded as `@0G`, whereas `LATIN SMALL LETTER A WITH GRAVE` is encoded as `@0g`. Here the third byte (`G` or `g`) indicates lettercase. (On a case-insensitive file system, both letters are treated as the same.)

  For some blocks, such as Cyrillic, the second byte determines lettercase. For other blocks, such as Latin1 Supplement, the third byte determines lettercase. If two bytes in the sequence are letters (as in Greek Extended), the leftmost letter character stands for lettercase. All other letter bytes must be in lowercase.

* All nonletter characters except underscore (`_`), as well as letters from alphabets that do not have uppercase/lowercase mapping (such as Hebrew) are encoded using hexadecimal representation using lowercase letters for hexadecimal digits `a..f`:

  ```sql
  0x003F -> @003f
  0xFFFF -> @ffff
  ```

  The hexadecimal values correspond to character values in the `ucs2` double-byte character set.

On Windows, some names such as `nul`, `prn`, and `aux` are encoded by appending `@@@` to the name when the server creates the corresponding file or directory. This occurs on all platforms for portability of the corresponding database object between platforms.

If you have databases or tables from a version of MySQL older than 5.1.6 that contain special characters and for which the underlying directory names or file names have not been updated to use the new encoding, the server displays their names with a prefix of `#mysql50#` in the output from `INFORMATION_SCHEMA` tables or `SHOW` statements. For example, if you have a table named `a@b` and its name encoding has not been updated, `SHOW TABLES` displays it like this:

```sql
mysql> SHOW TABLES;
+----------------+
| Tables_in_test |
+----------------+
| #mysql50#a@b   |
+----------------+
```

To refer to such a name for which the encoding has not been updated, you must supply the `#mysql50#` prefix:

```sql
mysql> SHOW COLUMNS FROM `a@b`;
ERROR 1146 (42S02): Table 'test.a@b' doesn't exist

mysql> SHOW COLUMNS FROM `#mysql50#a@b`;
+-------+---------+------+-----+---------+-------+
| Field | Type    | Null | Key | Default | Extra |
+-------+---------+------+-----+---------+-------+
| i     | int(11) | YES  |     | NULL    |       |
+-------+---------+------+-----+---------+-------+
```

To update old names to eliminate the need to use the special prefix to refer to them, re-encode them with **mysqlcheck**. The following commands update all names to the new encoding:

```sql
mysqlcheck --check-upgrade --all-databases
mysqlcheck --fix-db-names --fix-table-names --all-databases
```

To check only specific databases or tables, omit `--all-databases` and provide the appropriate database or table arguments. For information about **mysqlcheck** invocation syntax, see Section 4.5.3, “mysqlcheck — A Table Maintenance Program”.

Note

The `#mysql50#` prefix is intended only to be used internally by the server. You should not create databases or tables with names that use this prefix.

Also, **mysqlcheck** cannot fix names that contain literal instances of the `@` character that is used for encoding special characters. If you have databases or tables that contain this character, use **mysqldump** to dump them before upgrading to MySQL 5.1.6 or later, and then reload the dump file after upgrading.

Note

Conversion of pre-MySQL 5.1 database names containing special characters to 5.1 format with the addition of a `#mysql50#` prefix is deprecated; expect it to be removed in a future version of MySQL. Because such conversions are deprecated, the `--fix-db-names` and `--fix-table-names` options for **mysqlcheck** and the `UPGRADE DATA DIRECTORY NAME` clause for the `ALTER DATABASE` statement are also deprecated.

Upgrades are supported only from one release series to another (for example, 5.0 to 5.1, or 5.1 to 5.5), so there should be little remaining need for conversion of older 5.0 database names to current versions of MySQL. As a workaround, upgrade a MySQL 5.0 installation to MySQL 5.1 before upgrading to a more recent release.
