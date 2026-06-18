#### 15.7.7.4 SHOW CHARACTER SET Statement

```
SHOW {CHARACTER SET | CHARSET}
    [LIKE 'pattern' | WHERE expr]
```

The [`SHOW CHARACTER SET`](show-character-set.html "15.7.7.4 SHOW CHARACTER SET Statement") statement
shows all available character sets. The
[`LIKE`](string-comparison-functions.html#operator_like) clause, if present, indicates
which character set names to match. The `WHERE`
clause can be given to select rows using more general
conditions, as discussed in [Section 28.8, “Extensions to SHOW Statements”](extended-show.html "28.8 Extensions to SHOW Statements"). For
example:

```
mysql> SHOW CHARACTER SET LIKE 'latin%';
+---------+-----------------------------+-------------------+--------+
| Charset | Description                 | Default collation | Maxlen |
+---------+-----------------------------+-------------------+--------+
| latin1  | cp1252 West European        | latin1_swedish_ci |      1 |
| latin2  | ISO 8859-2 Central European | latin2_general_ci |      1 |
| latin5  | ISO 8859-9 Turkish          | latin5_turkish_ci |      1 |
| latin7  | ISO 8859-13 Baltic          | latin7_general_ci |      1 |
+---------+-----------------------------+-------------------+--------+
```

[`SHOW CHARACTER SET`](show-character-set.html "15.7.7.4 SHOW CHARACTER SET Statement") output has
these columns:

* `Charset`

  The character set name.

* `Description`

  A description of the character set.

* `Default collation`

  The default collation for the character set.

* `Maxlen`

  The maximum number of bytes required to store one character.

The `filename` character set is for internal
use only; consequently, [`SHOW CHARACTER
SET`](show-character-set.html "15.7.7.4 SHOW CHARACTER SET Statement") does not display it.

Character set information is also available from the
`INFORMATION_SCHEMA`
[`CHARACTER_SETS`](information-schema-character-sets-table.html "28.3.4 The INFORMATION_SCHEMA CHARACTER_SETS Table") table.