#### 26.4.5.18 The quote\_identifier() Function

Given a string argument, this function produces a quoted identifier suitable for inclusion in SQL statements. This is useful when a value to be used as an identifier is a reserved word or contains backtick (`` ` ``) characters. It was added in MySQL 5.7.14.

##### Parameters

`in_identifier TEXT`: The identifier to quote.

##### Return Value

A `TEXT` value.

##### Example

```sql
mysql> SELECT sys.quote_identifier('plain');
+-------------------------------+
| sys.quote_identifier('plain') |
+-------------------------------+
| `plain`                       |
+-------------------------------+
mysql> SELECT sys.quote_identifier('trick`ier');
+-----------------------------------+
| sys.quote_identifier('trick`ier') |
+-----------------------------------+
| `trick``ier`                      |
+-----------------------------------+
mysql> SELECT sys.quote_identifier('integer');
+---------------------------------+
| sys.quote_identifier('integer') |
+---------------------------------+
| `integer`                       |
+---------------------------------+
```
