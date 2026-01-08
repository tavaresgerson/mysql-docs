### 9.1.1 String Literals

A string is a sequence of bytes or characters, enclosed within either single quote (`'`) or double quote (`"`) characters. Examples:

```sql
'a string'
"another string"
```

Quoted strings placed next to each other are concatenated to a single string. The following lines are equivalent:

```sql
'a string'
'a' ' ' 'string'
```

If the `ANSI_QUOTES` SQL mode is enabled, string literals can be quoted only within single quotation marks because a string quoted within double quotation marks is interpreted as an identifier.

A binary string is a string of bytes. Every binary string has a character set and collation named `binary`. A nonbinary string is a string of characters. It has a character set other than `binary` and a collation that is compatible with the character set.

For both types of strings, comparisons are based on the numeric values of the string unit. For binary strings, the unit is the byte; comparisons use numeric byte values. For nonbinary strings, the unit is the character and some character sets support multibyte characters; comparisons use numeric character code values. Character code ordering is a function of the string collation. (For more information, see Section 10.8.5, “The binary Collation Compared to \_bin Collations”.)

Note

Within the **mysql** client, binary strings display using hexadecimal notation, depending on the value of the `--binary-as-hex`. For more information about that option, see Section 4.5.1, “mysql — The MySQL Command-Line Client”.

A character string literal may have an optional character set introducer and `COLLATE` clause, to designate it as a string that uses a particular character set and collation:

```sql
[_charset_name]'string' [COLLATE collation_name]
```

Examples:

```sql
SELECT _latin1'string';
SELECT _binary'string';
SELECT _utf8'string' COLLATE utf8_danish_ci;
```

You can use `N'literal'` (or `n'literal'`) to create a string in the national character set. These statements are equivalent:

```sql
SELECT N'some text';
SELECT n'some text';
SELECT _utf8'some text';
```

For information about these forms of string syntax, see Section 10.3.7, “The National Character Set”, and Section 10.3.8, “Character Set Introducers”.

Within a string, certain sequences have special meaning unless the `NO_BACKSLASH_ESCAPES` SQL mode is enabled. Each of these sequences begins with a backslash (`\`), known as the *escape character*. MySQL recognizes the escape sequences shown in Table 9.1, “Special Character Escape Sequences”. For all other escape sequences, backslash is ignored. That is, the escaped character is interpreted as if it was not escaped. For example, `\x` is just `x`. These sequences are case-sensitive. For example, `\b` is interpreted as a backspace, but `\B` is interpreted as `B`. Escape processing is done according to the character set indicated by the `character_set_connection` system variable. This is true even for strings that are preceded by an introducer that indicates a different character set, as discussed in Section 10.3.6, “Character String Literal Character Set and Collation”.

**Table 9.1 Special Character Escape Sequences**

<table summary="Escape sequences and the characters they represent."><col style="width: 15%"/><col style="width: 85%"/><thead><tr> <th>Escape Sequence</th> <th>Character Represented by Sequence</th> </tr></thead><tbody><tr> <td><code>\0</code><a class="indexterm" name="id156995"></a><a class="indexterm" name="id156997"></a></td> <td>An ASCII NUL (<code>X'00'</code>) character</td> </tr><tr> <td><code>\'</code><a class="indexterm" name="id157004"></a><a class="indexterm" name="id157006"></a></td> <td>A single quote (<code>'</code>) character</td> </tr><tr> <td><code>\"</code><a class="indexterm" name="id157013"></a><a class="indexterm" name="id157015"></a></td> <td>A double quote (<code>"</code>) character</td> </tr><tr> <td><code>\b</code><a class="indexterm" name="id157022"></a><a class="indexterm" name="id157024"></a></td> <td>A backspace character</td> </tr><tr> <td><code>\n</code><a class="indexterm" name="id157030"></a><a class="indexterm" name="id157032"></a><a class="indexterm" name="id157034"></a><a class="indexterm" name="id157036"></a></td> <td>A newline (linefeed) character</td> </tr><tr> <td><code>\r</code><a class="indexterm" name="id157042"></a><a class="indexterm" name="id157044"></a><a class="indexterm" name="id157046"></a></td> <td>A carriage return character</td> </tr><tr> <td><code>\t</code><a class="indexterm" name="id157052"></a><a class="indexterm" name="id157054"></a></td> <td>A tab character</td> </tr><tr> <td><code>\Z</code><a class="indexterm" name="id157060"></a><a class="indexterm" name="id157062"></a></td> <td>ASCII 26 (Control+Z); see note following the table</td> </tr><tr> <td><code>\\</code><a class="indexterm" name="id157068"></a><a class="indexterm" name="id157070"></a></td> <td>A backslash (<code>\</code>) character</td> </tr><tr> <td><code>\%</code><a class="indexterm" name="id157077"></a><a class="indexterm" name="id157079"></a></td> <td>A <code>%</code> character; see note following the table</td> </tr><tr> <td><code>\_</code><a class="indexterm" name="id157086"></a><a class="indexterm" name="id157088"></a></td> <td>A <code>_</code> character; see note following the table</td> </tr></tbody></table>

The ASCII 26 character can be encoded as `\Z` to enable you to work around the problem that ASCII 26 stands for END-OF-FILE on Windows. ASCII 26 within a file causes problems if you try to use `mysql db_name < file_name`.

The `\%` and `\_` sequences are used to search for literal instances of `%` and `_` in pattern-matching contexts where they would otherwise be interpreted as wildcard characters. See the description of the `LIKE` operator in Section 12.8.1, “String Comparison Functions and Operators”. If you use `\%` or `\_` outside of pattern-matching contexts, they evaluate to the strings `\%` and `\_`, not to `%` and `_`.

There are several ways to include quote characters within a string:

* A `'` inside a string quoted with `'` may be written as `''`.

* A `"` inside a string quoted with `"` may be written as `""`.

* Precede the quote character by an escape character (`\`).

* A `'` inside a string quoted with `"` needs no special treatment and need not be doubled or escaped. In the same way, `"` inside a string quoted with `'` needs no special treatment.

The following `SELECT` statements demonstrate how quoting and escaping work:

```sql
mysql> SELECT 'hello', '"hello"', '""hello""', 'hel''lo', '\'hello';
+-------+---------+-----------+--------+--------+
| hello | "hello" | ""hello"" | hel'lo | 'hello |
+-------+---------+-----------+--------+--------+

mysql> SELECT "hello", "'hello'", "''hello''", "hel""lo", "\"hello";
+-------+---------+-----------+--------+--------+
| hello | 'hello' | ''hello'' | hel"lo | "hello |
+-------+---------+-----------+--------+--------+

mysql> SELECT 'This\nIs\nFour\nLines';
+--------------------+
| This
Is
Four
Lines |
+--------------------+

mysql> SELECT 'disappearing\ backslash';
+------------------------+
| disappearing backslash |
+------------------------+
```

To insert binary data into a string column (such as a `BLOB` column), you should represent certain characters by escape sequences. Backslash (`\`) and the quote character used to quote the string must be escaped. In certain client environments, it may also be necessary to escape `NUL` or Control+Z. The **mysql** client truncates quoted strings containing `NUL` characters if they are not escaped, and Control+Z may be taken for END-OF-FILE on Windows if not escaped. For the escape sequences that represent each of these characters, see Table 9.1, “Special Character Escape Sequences”.

When writing application programs, any string that might contain any of these special characters must be properly escaped before the string is used as a data value in an SQL statement that is sent to the MySQL server. You can do this in two ways:

* Process the string with a function that escapes the special characters. In a C program, you can use the `mysql_real_escape_string_quote()` C API function to escape characters. See mysql\_real\_escape\_string\_quote(). Within SQL statements that construct other SQL statements, you can use the `QUOTE()` function. The Perl DBI interface provides a `quote` method to convert special characters to the proper escape sequences. See Section 27.9, “MySQL Perl API”. Other language interfaces may provide a similar capability.

* As an alternative to explicitly escaping special characters, many MySQL APIs provide a placeholder capability that enables you to insert special markers into a statement string, and then bind data values to them when you issue the statement. In this case, the API takes care of escaping special characters in the values for you.
