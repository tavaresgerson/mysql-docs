### 24.3.2 The INFORMATION_SCHEMA CHARACTER_SETS Table

The [`CHARACTER_SETS`](information-schema-character-sets-table.html "24.3.2 The INFORMATION_SCHEMA CHARACTER_SETS Table") table provides information about available character sets.

The [`CHARACTER_SETS`](information-schema-character-sets-table.html "24.3.2 The INFORMATION_SCHEMA CHARACTER_SETS Table") table has these columns:

* `CHARACTER_SET_NAME`

  The character set name.

* `DEFAULT_COLLATE_NAME`

  The default collation for the character set.

* `DESCRIPTION`

  A description of the character set.

* `MAXLEN`

  The maximum number of bytes required to store one character.

#### Notes

Character set information is also available from the [`SHOW CHARACTER SET`](show-character-set.html "13.7.5.3 SHOW CHARACTER SET Statement") statement. See [Section 13.7.5.3, “SHOW CHARACTER SET Statement”](show-character-set.html "13.7.5.3 SHOW CHARACTER SET Statement"). The following statements are equivalent:

```sql
SELECT * FROM INFORMATION_SCHEMA.CHARACTER_SETS
  [WHERE CHARACTER_SET_NAME LIKE 'wild']

SHOW CHARACTER SET
  [LIKE 'wild']
```
