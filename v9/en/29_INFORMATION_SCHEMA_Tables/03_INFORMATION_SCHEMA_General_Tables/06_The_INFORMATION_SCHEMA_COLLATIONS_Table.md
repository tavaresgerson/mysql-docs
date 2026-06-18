### 28.3.6 The INFORMATION\_SCHEMA COLLATIONS Table

The [`COLLATIONS`](information-schema-collations-table.html "28.3.6 The INFORMATION_SCHEMA COLLATIONS Table") table provides
information about collations for each character set.

The [`COLLATIONS`](information-schema-collations-table.html "28.3.6 The INFORMATION_SCHEMA COLLATIONS Table") table has these
columns:

* `COLLATION_NAME`

  The collation name.

* `CHARACTER_SET_NAME`

  The name of the character set with which the collation is
  associated.

* `ID`

  The collation ID.

* `IS_DEFAULT`

  Whether the collation is the default for its character set.

* `IS_COMPILED`

  Whether the character set is compiled into the server.

* `SORTLEN`

  This is related to the amount of memory required to sort
  strings expressed in the character set.

* `PAD_ATTRIBUTE`

  The collation pad attribute, either `NO PAD`
  or `PAD SPACE`. This attribute affects
  whether trailing spaces are significant in string comparisons;
  see
  [Trailing Space Handling in Comparisons](charset-binary-collations.html#charset-binary-collations-trailing-space-comparisons "Trailing Space Handling in Comparisons").

#### Notes

Collation information is also available from the
[`SHOW COLLATION`](show-collation.html "15.7.7.5 SHOW COLLATION Statement") statement. See
[Section 15.7.7.5, “SHOW COLLATION Statement”](show-collation.html "15.7.7.5 SHOW COLLATION Statement"). The following statements are
equivalent:

```
SELECT COLLATION_NAME FROM INFORMATION_SCHEMA.COLLATIONS
  [WHERE COLLATION_NAME LIKE 'wild']

SHOW COLLATION
  [LIKE 'wild']
```