### 10.3.8 Character Set Introducers

A character string literal, hexadecimal literal, or bit-value literal may have an optional character set introducer and `COLLATE` clause, to designate it as a string that uses a particular character set and collation:

```sql
[_charset_name] literal [COLLATE collation_name]
```

The `_charset_name` expression is formally called an *introducer*. It tells the parser, “the string that follows uses character set *`charset_name`*.” An introducer does not change the string to the introducer character set like `CONVERT()` would do. It does not change the string value, although padding may occur. The introducer is just a signal.

For character string literals, space between the introducer and the string is permitted but optional.

For character set literals, an introducer indicates the character set for the following string, but does not change how the parser performs escape processing within the string. Escapes are always interpreted by the parser according to the character set given by `character_set_connection`. For additional discussion and examples, see Section 10.3.6, “Character String Literal Character Set and Collation”.

Examples:

```sql
SELECT 'abc';
SELECT _latin1'abc';
SELECT _binary'abc';
SELECT _utf8'abc' COLLATE utf8_danish_ci;

SELECT _latin1 X'4D7953514C';
SELECT _utf8 0x4D7953514C COLLATE utf8_danish_ci;

SELECT _latin1 b'1000001';
SELECT _utf8 0b1000001 COLLATE utf8_danish_ci;
```

Character set introducers and the `COLLATE` clause are implemented according to standard SQL specifications.

Character string literals can be designated as binary strings by using the `_binary` introducer. Hexadecimal literals and bit-value literals are binary strings by default, so `_binary` is permitted, but unnecessary.

MySQL determines the character set and collation of a character string literal, hexadecimal literal, or bit-value literal in the following manner:

* If both *`_charset_name`* and `COLLATE collation_name` are specified, character set *`charset_name`* and collation *`collation_name`* are used. *`collation_name`* must be a permitted collation for *`charset_name`*.

* If *`_charset_name`* is specified but `COLLATE` is not specified, character set *`charset_name`* and its default collation are used. To see the default collation for each character set, use the `SHOW CHARACTER SET` statement or query the `INFORMATION_SCHEMA` `CHARACTER_SETS` table.

* If *`_charset_name`* is not specified but `COLLATE collation_name` is specified:

  + For a character string literal, the connection default character set given by the `character_set_connection` system variable and collation *`collation_name`* are used. *`collation_name`* must be a permitted collation for the connection default character set.

  + For a hexadecimal literal or bit-value literal, the only permitted collation is `binary` because these types of literals are binary strings by default.

* Otherwise (neither *`_charset_name`* nor `COLLATE collation_name` is specified):

  + For a character string literal, the connection default character set and collation given by the `character_set_connection` and `collation_connection` system variables are used.

  + For a hexadecimal literal or bit-value literal, the character set and collation are `binary`.

Examples:

* Nonbinary strings with `latin1` character set and `latin1_german1_ci` collation:

  ```sql
  SELECT _latin1'Müller' COLLATE latin1_german1_ci;
  SELECT _latin1 X'0A0D' COLLATE latin1_german1_ci;
  SELECT _latin1 b'0110' COLLATE latin1_german1_ci;
  ```

* Nonbinary strings with `utf8` character set and its default collation (that is, `utf8_general_ci`):

  ```sql
  SELECT _utf8'Müller';
  SELECT _utf8 X'0A0D';
  SELECT _utf8 b'0110';
  ```

* Binary strings with `binary` character set and its default collation (that is, `binary`):

  ```sql
  SELECT _binary'Müller';
  SELECT X'0A0D';
  SELECT b'0110';
  ```

  The hexadecimal literal and bit-value literal need no introducer because they are binary strings by default.

* A nonbinary string with the connection default character set and `utf8_general_ci` collation (fails if the connection character set is not `utf8`):

  ```sql
  SELECT 'Müller' COLLATE utf8_general_ci;
  ```

  This construction (`COLLATE` only) does not work for hexadecimal literals or bit literals because their character set is `binary` no matter the connection character set, and `binary` is not compatible with the `utf8_general_ci` collation. The only permitted `COLLATE` clause in the absence of an introducer is `COLLATE binary`.

* A string with the connection default character set and collation:

  ```sql
  SELECT 'Müller';
  ```
