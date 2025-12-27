### 12.14.1 Collation Implementation Types

MySQL implements several types of collations:

**Simple collations for 8-bit character sets**

This kind of collation is implemented using an array of 256 weights that defines a one-to-one mapping from character codes to weights. `latin1_swedish_ci` is an example. It is a case-insensitive collation, so the uppercase and lowercase versions of a character have the same weights and they compare as equal.

```
mysql> SET NAMES 'latin1' COLLATE 'latin1_swedish_ci';
Query OK, 0 rows affected (0.01 sec)

mysql> SELECT HEX(WEIGHT_STRING('a')), HEX(WEIGHT_STRING('A'));
+-------------------------+-------------------------+
| HEX(WEIGHT_STRING('a')) | HEX(WEIGHT_STRING('A')) |
+-------------------------+-------------------------+
| 41                      | 41                      |
+-------------------------+-------------------------+
1 row in set (0.01 sec)

mysql> SELECT 'a' = 'A';
+-----------+
| 'a' = 'A' |
+-----------+
|         1 |
+-----------+
1 row in set (0.12 sec)
```

For implementation instructions, see Section 12.14.3, “Adding a Simple Collation to an 8-Bit Character Set”.

**Complex collations for 8-bit character sets**

This kind of collation is implemented using functions in a C source file that define how to order characters, as described in Section 12.13, “Adding a Character Set”.

**Collations for non-Unicode multibyte character sets**

For this type of collation, 8-bit (single-byte) and multibyte characters are handled differently. For 8-bit characters, character codes map to weights in case-insensitive fashion. (For example, the single-byte characters `'a'` and `'A'` both have a weight of `0x41`.) For multibyte characters, there are two types of relationship between character codes and weights:

* Weights equal character codes. `sjis_japanese_ci` is an example of this kind of collation. The multibyte character `'ぢ'` has a character code of `0x82C0`, and the weight is also `0x82C0`.

  ```
  mysql> CREATE TABLE t1
         (c1 VARCHAR(2) CHARACTER SET sjis COLLATE sjis_japanese_ci);
  Query OK, 0 rows affected (0.01 sec)

  mysql> INSERT INTO t1 VALUES ('a'),('A'),(0x82C0);
  Query OK, 3 rows affected (0.00 sec)
  Records: 3  Duplicates: 0  Warnings: 0

  mysql> SELECT c1, HEX(c1), HEX(WEIGHT_STRING(c1)) FROM t1;
  +------+---------+------------------------+
  | c1   | HEX(c1) | HEX(WEIGHT_STRING(c1)) |
  +------+---------+------------------------+
  | a    | 61      | 41                     |
  | A    | 41      | 41                     |
  | ぢ    | 82C0    | 82C0                   |
  +------+---------+------------------------+
  3 rows in set (0.00 sec)
  ```
* Character codes map one-to-one to weights, but a code is not necessarily equal to the weight. `gbk_chinese_ci` is an example of this kind of collation. The multibyte character `'膰'` has a character code of `0x81B0` but a weight of `0xC286`.

  ```
  mysql> CREATE TABLE t1
         (c1 VARCHAR(2) CHARACTER SET gbk COLLATE gbk_chinese_ci);
  Query OK, 0 rows affected (0.33 sec)

  mysql> INSERT INTO t1 VALUES ('a'),('A'),(0x81B0);
  Query OK, 3 rows affected (0.00 sec)
  Records: 3  Duplicates: 0  Warnings: 0

  mysql> SELECT c1, HEX(c1), HEX(WEIGHT_STRING(c1)) FROM t1;
  +------+---------+------------------------+
  | c1   | HEX(c1) | HEX(WEIGHT_STRING(c1)) |
  +------+---------+------------------------+
  | a    | 61      | 41                     |
  | A    | 41      | 41                     |
  | 膰    | 81B0    | C286                   |
  +------+---------+------------------------+
  3 rows in set (0.00 sec)
  ```

For implementation instructions, see Section 12.13, “Adding a Character Set”.

**Collations for Unicode multibyte character sets**

Some of these collations are based on the Unicode Collation Algorithm (UCA), others are not.

Non-UCA collations have a one-to-one mapping from character code to weight. In MySQL, such collations are case-insensitive and accent-insensitive. `utf8mb4_general_ci` is an example: `'a'`, `'A'`, `'À'`, and `'á'` each have different character codes but all have a weight of `0x0041` and compare as equal.

```
mysql> SET NAMES 'utf8mb4' COLLATE 'utf8mb4_general_ci';
Query OK, 0 rows affected (0.00 sec)

mysql> CREATE TABLE t1
       (c1 CHAR(1) CHARACTER SET UTF8MB4 COLLATE utf8mb4_general_ci);
Query OK, 0 rows affected (0.01 sec)

mysql> INSERT INTO t1 VALUES ('a'),('A'),('À'),('á');
Query OK, 4 rows affected (0.00 sec)
Records: 4  Duplicates: 0  Warnings: 0

mysql> SELECT c1, HEX(c1), HEX(WEIGHT_STRING(c1)) FROM t1;
+------+---------+------------------------+
| c1   | HEX(c1) | HEX(WEIGHT_STRING(c1)) |
+------+---------+------------------------+
| a    | 61      | 0041                   |
| A    | 41      | 0041                   |
| À    | C380    | 0041                   |
| á    | C3A1    | 0041                   |
+------+---------+------------------------+
4 rows in set (0.00 sec)
```

UCA-based collations in MySQL have these properties:

* If a character has weights, each weight uses 2 bytes (16 bits).
* A character may have zero weights (or an empty weight). In this case, the character is ignorable. Example: "U+0000 NULL" does not have a weight and is ignorable.
* A character may have one weight. Example: `'a'` has a weight of `0x0E33`.

  ```
  mysql> SET NAMES 'utf8mb4' COLLATE 'utf8mb4_unicode_ci';
  Query OK, 0 rows affected (0.05 sec)

  mysql> SELECT HEX('a'), HEX(WEIGHT_STRING('a'));
  +----------+-------------------------+
  | HEX('a') | HEX(WEIGHT_STRING('a')) |
  +----------+-------------------------+
  | 61       | 0E33                    |
  +----------+-------------------------+
  1 row in set (0.02 sec)
  ```
* A character may have many weights. This is an expansion. Example: The German letter `'ß'` (SZ ligature, or SHARP S) has a weight of `0x0FEA0FEA`.

  ```
  mysql> SET NAMES 'utf8mb4' COLLATE 'utf8mb4_unicode_ci';
  Query OK, 0 rows affected (0.11 sec)

  mysql> SELECT HEX('ß'), HEX(WEIGHT_STRING('ß'));
  +-----------+--------------------------+
  | HEX('ß')  | HEX(WEIGHT_STRING('ß'))  |
  +-----------+--------------------------+
  | C39F      | 0FEA0FEA                 |
  +-----------+--------------------------+
  1 row in set (0.00 sec)
  ```
* Many characters may have one weight. This is a contraction. Example: `'ch'` is a single letter in Czech and has a weight of `0x0EE2`.

  ```
  mysql> SET NAMES 'utf8mb4' COLLATE 'utf8mb4_czech_ci';
  Query OK, 0 rows affected (0.09 sec)

  mysql> SELECT HEX('ch'), HEX(WEIGHT_STRING('ch'));
  +-----------+--------------------------+
  | HEX('ch') | HEX(WEIGHT_STRING('ch')) |
  +-----------+--------------------------+
  | 6368      | 0EE2                     |
  +-----------+--------------------------+
  1 row in set (0.00 sec)
  ```

A many-characters-to-many-weights mapping is also possible (this is contraction with expansion), but is not supported by MySQL.

For implementation instructions, for a non-UCA collation, see Section 12.13, “Adding a Character Set”. For a UCA collation, see Section 12.14.4, “Adding a UCA Collation to a Unicode Character Set”.

**Miscellaneous collations**

There are also a few collations that do not fall into any of the previous categories.


