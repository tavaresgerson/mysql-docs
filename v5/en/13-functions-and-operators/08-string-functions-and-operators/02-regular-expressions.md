### 12.8.2 Regular Expressions

**Table 12.14 Regular Expression Functions and Operators**

<table frame="box" rules="all" summary="A reference that lists regular expression functions and operators."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Name</th> <th>Description</th> </tr></thead><tbody><tr><td><a class="link" href="regexp.html#operator_not-regexp"><code>NOT REGEXP</code></a></td> <td> Negation of REGEXP </td> </tr><tr><td><a class="link" href="regexp.html#operator_regexp"><code>REGEXP</code></a></td> <td> Whether string matches regular expression </td> </tr><tr><td><a class="link" href="regexp.html#operator_regexp"><code>RLIKE</code></a></td> <td> Whether string matches regular expression </td> </tr></tbody></table>

A regular expression is a powerful way of specifying a pattern for a complex search. This section discusses the operators available for regular expression matching and illustrates, with examples, some of the special characters and constructs that can be used for regular expression operations. See also Section 3.3.4.7, “Pattern Matching”.

MySQL uses Henry Spencer's implementation of regular expressions, which is aimed at conformance with POSIX 1003.2. MySQL uses the extended version to support regular expression pattern-matching operations in SQL statements. This section does not contain all the details that can be found in Henry Spencer's `regex(7)` manual page. That manual page is included in MySQL source distributions, in the `regex.7` file under the `regex` directory.

* Regular Expression Function and Operator Descriptions
* Regular Expression Syntax

#### Regular Expression Function and Operator Descriptions

* `expr NOT REGEXP pat`, `expr NOT RLIKE pat`

  This is the same as `NOT (expr REGEXP pat)`.

* `expr REGEXP pat`, `expr RLIKE pat`

  Returns 1 if the string *`expr`* matches the regular expression specified by the pattern *`pat`*, 0 otherwise. If either *`expr`* or *`pat`* is `NULL`, the return value is `NULL`.

  `RLIKE` is a synonym for `REGEXP`.

  The pattern can be an extended regular expression, the syntax for which is discussed in Regular Expression Syntax. The pattern need not be a literal string. For example, it can be specified as a string expression or table column.

  Note

  MySQL uses C escape syntax in strings (for example, `\n` to represent the newline character). If you want your *`expr`* or *`pat`* argument to contain a literal `\`, you must double it. (Unless the `NO_BACKSLASH_ESCAPES` SQL mode is enabled, in which case no escape character is used.)

  Regular expression operations use the character set and collation of the string expression and pattern arguments when deciding the type of a character and performing the comparison. If the arguments have different character sets or collations, coercibility rules apply as described in Section 10.8.4, “Collation Coercibility in Expressions”. If either argument is a binary string, the arguments are handled in case-sensitive fashion as binary strings.

  ```sql
  mysql> SELECT 'Michael!' REGEXP '.*';
  +------------------------+
  | 'Michael!' REGEXP '.*' |
  +------------------------+
  |                      1 |
  +------------------------+
  mysql> SELECT 'new*\n*line' REGEXP 'new\\*.\\*line';
  +---------------------------------------+
  | 'new*\n*line' REGEXP 'new\\*.\\*line' |
  +---------------------------------------+
  |                                     0 |
  +---------------------------------------+
  mysql> SELECT 'a' REGEXP '^[a-d]';
  +---------------------+
  | 'a' REGEXP '^[a-d]' |
  +---------------------+
  |                   1 |
  +---------------------+
  ```

  Warning

  The `REGEXP` and `RLIKE` operators work in byte-wise fashion, so they are not multibyte safe and may produce unexpected results with multibyte character sets. In addition, these operators compare characters by their byte values and accented characters may not compare as equal even if a given collation treats them as equal.

#### Regular Expression Syntax

A regular expression describes a set of strings. The simplest regular expression is one that has no special characters in it. For example, the regular expression `hello` matches `hello` and nothing else.

Nontrivial regular expressions use certain special constructs so that they can match more than one string. For example, the regular expression `hello|world` contains the `|` alternation operator and matches either the `hello` or `world`.

As a more complex example, the regular expression `B[an]*s` matches any of the strings `Bananas`, `Baaaaas`, `Bs`, and any other string starting with a `B`, ending with an `s`, and containing any number of `a` or `n` characters in between.

A regular expression for the `REGEXP` operator may use any of the following special characters and constructs:

* `^`

  Match the beginning of a string.

  ```sql
  mysql> SELECT 'fo\nfo' REGEXP '^fo$';                   -> 0
  mysql> SELECT 'fofo' REGEXP '^fo';                      -> 1
  ```

* `$`

  Match the end of a string.

  ```sql
  mysql> SELECT 'fo\no' REGEXP '^fo\no$';                 -> 1
  mysql> SELECT 'fo\no' REGEXP '^fo$';                    -> 0
  ```

* `.`

  Match any character (including carriage return and newline).

  ```sql
  mysql> SELECT 'fofo' REGEXP '^f.*$';                    -> 1
  mysql> SELECT 'fo\r\nfo' REGEXP '^f.*$';                -> 1
  ```

* `a*`

  Match any sequence of zero or more `a` characters.

  ```sql
  mysql> SELECT 'Ban' REGEXP '^Ba*n';                     -> 1
  mysql> SELECT 'Baaan' REGEXP '^Ba*n';                   -> 1
  mysql> SELECT 'Bn' REGEXP '^Ba*n';                      -> 1
  ```

* `a+`

  Match any sequence of one or more `a` characters.

  ```sql
  mysql> SELECT 'Ban' REGEXP '^Ba+n';                     -> 1
  mysql> SELECT 'Bn' REGEXP '^Ba+n';                      -> 0
  ```

* `a?`

  Match either zero or one `a` character.

  ```sql
  mysql> SELECT 'Bn' REGEXP '^Ba?n';                      -> 1
  mysql> SELECT 'Ban' REGEXP '^Ba?n';                     -> 1
  mysql> SELECT 'Baan' REGEXP '^Ba?n';                    -> 0
  ```

* `de|abc`

  Alternation; match either of the sequences `de` or `abc`.

  ```sql
  mysql> SELECT 'pi' REGEXP 'pi|apa';                     -> 1
  mysql> SELECT 'axe' REGEXP 'pi|apa';                    -> 0
  mysql> SELECT 'apa' REGEXP 'pi|apa';                    -> 1
  mysql> SELECT 'apa' REGEXP '^(pi|apa)$';                -> 1
  mysql> SELECT 'pi' REGEXP '^(pi|apa)$';                 -> 1
  mysql> SELECT 'pix' REGEXP '^(pi|apa)$';                -> 0
  ```

* `(abc)*`

  Match zero or more instances of the sequence `abc`.

  ```sql
  mysql> SELECT 'pi' REGEXP '^(pi)*$';                    -> 1
  mysql> SELECT 'pip' REGEXP '^(pi)*$';                   -> 0
  mysql> SELECT 'pipi' REGEXP '^(pi)*$';                  -> 1
  ```

* `{1}`, `{2,3}`

  Repetition; `{n}` and `{m,n}` notation provide a more general way of writing regular expressions that match many occurrences of the previous atom (or “piece”) of the pattern. *`m`* and *`n`* are integers.

  + `a*`

    Can be written as `a{0,}`.

  + `a+`

    Can be written as `a{1,}`.

  + `a?`

    Can be written as `a{0,1}`.

  To be more precise, `a{n}` matches exactly *`n`* instances of `a`. `a{n,}` matches *`n`* or more instances of `a`. `a{m,n}` matches *`m`* through *`n`* instances of `a`, inclusive. If both *`m`* and *`n`* are given, *`m`* must be less than or equal to *`n`*.

  *`m`* and *`n`* must be in the range from `0` to `RE_DUP_MAX` (default 255), inclusive.

  ```sql
  mysql> SELECT 'abcde' REGEXP 'a[bcd]{2}e';              -> 0
  mysql> SELECT 'abcde' REGEXP 'a[bcd]{3}e';              -> 1
  mysql> SELECT 'abcde' REGEXP 'a[bcd]{1,10}e';           -> 1
  ```

* `[a-dX]`, `[^a-dX]`

  Matches any character that is (or is not, if `^` is used) either `a`, `b`, `c`, `d` or `X`. A `-` character between two other characters forms a range that matches all characters from the first character to the second. For example, `[0-9]` matches any decimal digit. To include a literal `]` character, it must immediately follow the opening bracket `[`. To include a literal `-` character, it must be written first or last. Any character that does not have a defined special meaning inside a `[]` pair matches only itself.

  ```sql
  mysql> SELECT 'aXbc' REGEXP '[a-dXYZ]';                 -> 1
  mysql> SELECT 'aXbc' REGEXP '^[a-dXYZ]$';               -> 0
  mysql> SELECT 'aXbc' REGEXP '^[a-dXYZ]+$';              -> 1
  mysql> SELECT 'aXbc' REGEXP '^[^a-dXYZ]+$';             -> 0
  mysql> SELECT 'gheis' REGEXP '^[^a-dXYZ]+$';            -> 1
  mysql> SELECT 'gheisa' REGEXP '^[^a-dXYZ]+$';           -> 0
  ```

* `[.characters.]`

  Within a bracket expression (written using `[` and `]`), matches the sequence of characters of that collating element. `characters` is either a single character or a character name like `newline`. The following table lists the permissible character names.

  The following table shows the permissible character names and the characters that they match. For characters given as numeric values, the values are represented in octal.

  <table summary="Permissible character names and characters they match. To save space, the column pairing of Name and Character are presented in a four column table format in this order: Name, Character, Name, Character. For characters given as numeric values, the values are represented in octal."><col style="width: 25%"/><col style="width: 25%"/><col style="width: 25%"/><col style="width: 25%"/><thead><tr> <th scope="col">Name</th> <th scope="col">Character</th> <th scope="col">Name</th> <th scope="col">Character</th> </tr></thead><tbody><tr> <th scope="row"><code>NUL</code></th> <td><code>0</code></td> <td><code>SOH</code></td> <td><code>001</code></td> </tr><tr> <th scope="row"><code>STX</code></th> <td><code>002</code></td> <td><code>ETX</code></td> <td><code>003</code></td> </tr><tr> <th scope="row"><code>EOT</code></th> <td><code>004</code></td> <td><code>ENQ</code></td> <td><code>005</code></td> </tr><tr> <th scope="row"><code>ACK</code></th> <td><code>006</code></td> <td><code>BEL</code></td> <td><code>007</code></td> </tr><tr> <th scope="row"><code>alert</code></th> <td><code>007</code></td> <td><code>BS</code></td> <td><code>010</code></td> </tr><tr> <th scope="row"><code>backspace</code></th> <td><code>'\b'</code></td> <td><code>HT</code></td> <td><code>011</code></td> </tr><tr> <th scope="row"><code>tab</code></th> <td><code>'\t'</code></td> <td><code>LF</code></td> <td><code>012</code></td> </tr><tr> <th scope="row"><code>newline</code></th> <td><code>'\n'</code></td> <td><code>VT</code></td> <td><code>013</code></td> </tr><tr> <th scope="row"><code>vertical-tab</code></th> <td><code>'\v'</code></td> <td><code>FF</code></td> <td><code>014</code></td> </tr><tr> <th scope="row"><code>form-feed</code></th> <td><code>'\f'</code></td> <td><code>CR</code></td> <td><code>015</code></td> </tr><tr> <th scope="row"><code>carriage-return</code></th> <td><code>'\r'</code></td> <td><code>SO</code></td> <td><code>016</code></td> </tr><tr> <th scope="row"><code>SI</code></th> <td><code>017</code></td> <td><code>DLE</code></td> <td><code>020</code></td> </tr><tr> <th scope="row"><code>DC1</code></th> <td><code>021</code></td> <td><code>DC2</code></td> <td><code>022</code></td> </tr><tr> <th scope="row"><code>DC3</code></th> <td><code>023</code></td> <td><code>DC4</code></td> <td><code>024</code></td> </tr><tr> <th scope="row"><code>NAK</code></th> <td><code>025</code></td> <td><code>SYN</code></td> <td><code>026</code></td> </tr><tr> <th scope="row"><code>ETB</code></th> <td><code>027</code></td> <td><code>CAN</code></td> <td><code>030</code></td> </tr><tr> <th scope="row"><code>EM</code></th> <td><code>031</code></td> <td><code>SUB</code></td> <td><code>032</code></td> </tr><tr> <th scope="row"><code>ESC</code></th> <td><code>033</code></td> <td><code>IS4</code></td> <td><code>034</code></td> </tr><tr> <th scope="row"><code>FS</code></th> <td><code>034</code></td> <td><code>IS3</code></td> <td><code>035</code></td> </tr><tr> <th scope="row"><code>GS</code></th> <td><code>035</code></td> <td><code>IS2</code></td> <td><code>036</code></td> </tr><tr> <th scope="row"><code>RS</code></th> <td><code>036</code></td> <td><code>IS1</code></td> <td><code>037</code></td> </tr><tr> <th scope="row"><code>US</code></th> <td><code>037</code></td> <td><code>space</code></td> <td><code>' '</code></td> </tr><tr> <th scope="row"><code>exclamation-mark</code></th> <td><code>'!'</code></td> <td><code>quotation-mark</code></td> <td><code>'"'</code></td> </tr><tr> <th scope="row"><code>number-sign</code></th> <td><code>'#'</code></td> <td><code>dollar-sign</code></td> <td><code>'$'</code></td> </tr><tr> <th scope="row"><code>percent-sign</code></th> <td><code>'%'</code></td> <td><code>ampersand</code></td> <td><code>'&amp;'</code></td> </tr><tr> <th scope="row"><code>apostrophe</code></th> <td><code>'\''</code></td> <td><code>left-parenthesis</code></td> <td><code>'('</code></td> </tr><tr> <th scope="row"><code>right-parenthesis</code></th> <td><code>')'</code></td> <td><code>asterisk</code></td> <td><code>'*'</code></td> </tr><tr> <th scope="row"><code>plus-sign</code></th> <td><code>'+'</code></td> <td><code>comma</code></td> <td><code>','</code></td> </tr><tr> <th scope="row"><code>hyphen</code></th> <td><code>'-'</code></td> <td><code>hyphen-minus</code></td> <td><code>'-'</code></td> </tr><tr> <th scope="row"><code>period</code></th> <td><code>'.'</code></td> <td><code>full-stop</code></td> <td><code>'.'</code></td> </tr><tr> <th scope="row"><code>slash</code></th> <td><code>'/'</code></td> <td><code>solidus</code></td> <td><code>'/'</code></td> </tr><tr> <th scope="row"><code>zero</code></th> <td><code>'0'</code></td> <td><code>one</code></td> <td><code>'1'</code></td> </tr><tr> <th scope="row"><code>two</code></th> <td><code>'2'</code></td> <td><code>three</code></td> <td><code>'3'</code></td> </tr><tr> <th scope="row"><code>four</code></th> <td><code>'4'</code></td> <td><code>five</code></td> <td><code>'5'</code></td> </tr><tr> <th scope="row"><code>six</code></th> <td><code>'6'</code></td> <td><code>seven</code></td> <td><code>'7'</code></td> </tr><tr> <th scope="row"><code>eight</code></th> <td><code>'8'</code></td> <td><code>nine</code></td> <td><code>'9'</code></td> </tr><tr> <th scope="row"><code>colon</code></th> <td><code>':'</code></td> <td><code>semicolon</code></td> <td><code>';'</code></td> </tr><tr> <th scope="row"><code>less-than-sign</code></th> <td><code>'&lt;'</code></td> <td><code>equals-sign</code></td> <td><code>'='</code></td> </tr><tr> <th scope="row"><code>greater-than-sign</code></th> <td><code>'&gt;'</code></td> <td><code>question-mark</code></td> <td><code>'?'</code></td> </tr><tr> <th scope="row"><code>commercial-at</code></th> <td><code>'@'</code></td> <td><code>left-square-bracket</code></td> <td><code>'['</code></td> </tr><tr> <th scope="row"><code>backslash</code></th> <td><code>'\\'</code></td> <td><code>reverse-solidus</code></td> <td><code>'\\'</code></td> </tr><tr> <th scope="row"><code>right-square-bracket</code></th> <td><code>']'</code></td> <td><code>circumflex</code></td> <td><code>'^'</code></td> </tr><tr> <th scope="row"><code>circumflex-accent</code></th> <td><code>'^'</code></td> <td><code>underscore</code></td> <td><code>'_'</code></td> </tr><tr> <th scope="row"><code>low-line</code></th> <td><code>'_'</code></td> <td><code>grave-accent</code></td> <td><code>'`'</code></td> </tr><tr> <th scope="row"><code>left-brace</code></th> <td><code>'{'</code></td> <td><code>left-curly-bracket</code></td> <td><code>'{'</code></td> </tr><tr> <th scope="row"><code>vertical-line</code></th> <td><code>'|'</code></td> <td><code>right-brace</code></td> <td><code>'}'</code></td> </tr><tr> <th scope="row"><code>right-curly-bracket</code></th> <td><code>'}'</code></td> <td><code>tilde</code></td> <td><code>'~'</code></td> </tr><tr> <th scope="row"><code>DEL</code></th> <td><code>177</code></td> <td></td> <td></td> </tr></tbody></table>

  ```sql
  mysql> SELECT '~' REGEXP '[[.~.]]';                     -> 1
  mysql> SELECT '~' REGEXP '[[.tilde.]]';                 -> 1
  ```

* `[=character_class=]`

  Within a bracket expression (written using `[` and `]`), `[=character_class=]` represents an equivalence class. It matches all characters with the same collation value, including itself. For example, if `o` and `(+)` are the members of an equivalence class, `[[=o=]]`, `[[=(+)=]]`, and `[o(+)]` are all synonymous. An equivalence class may not be used as an endpoint of a range.

* `[:character_class:]`

  Within a bracket expression (written using `[` and `]`), `[:character_class:]` represents a character class that matches all characters belonging to that class. The following table lists the standard class names. These names stand for the character classes defined in the `ctype(3)` manual page. A particular locale may provide other class names. A character class may not be used as an endpoint of a range.

  <table summary="Character class names and the meaning of each class."><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Character Class Name</th> <th>Meaning</th> </tr></thead><tbody><tr> <td><code>alnum</code></td> <td>Alphanumeric characters</td> </tr><tr> <td><code>alpha</code></td> <td>Alphabetic characters</td> </tr><tr> <td><code>blank</code></td> <td>Whitespace characters</td> </tr><tr> <td><code>cntrl</code></td> <td>Control characters</td> </tr><tr> <td><code>digit</code></td> <td>Digit characters</td> </tr><tr> <td><code>graph</code></td> <td>Graphic characters</td> </tr><tr> <td><code>lower</code></td> <td>Lowercase alphabetic characters</td> </tr><tr> <td><code>print</code></td> <td>Graphic or space characters</td> </tr><tr> <td><code>punct</code></td> <td>Punctuation characters</td> </tr><tr> <td><code>space</code></td> <td>Space, tab, newline, and carriage return</td> </tr><tr> <td><code>upper</code></td> <td>Uppercase alphabetic characters</td> </tr><tr> <td><code>xdigit</code></td> <td>Hexadecimal digit characters</td> </tr></tbody></table>

  ```sql
  mysql> SELECT 'justalnums' REGEXP '[[:alnum:]]+';       -> 1
  mysql> SELECT '!!' REGEXP '[[:alnum:]]+';               -> 0
  ```

* `[[:<:]]`, `[[:>:]]`

  These markers stand for word boundaries. They match the beginning and end of words, respectively. A word is a sequence of word characters that is not preceded by or followed by word characters. A word character is an alphanumeric character in the `alnum` class or an underscore (`_`).

  ```sql
  mysql> SELECT 'a word a' REGEXP '[[:<:]]word[[:>:]]';   -> 1
  mysql> SELECT 'a xword a' REGEXP '[[:<:]]word[[:>:]]';  -> 0
  ```

To use a literal instance of a special character in a regular expression, precede it by two backslash (\) characters. The MySQL parser interprets one of the backslashes, and the regular expression library interprets the other. For example, to match the string `1+2` that contains the special `+` character, only the last of the following regular expressions is the correct one:

```sql
mysql> SELECT '1+2' REGEXP '1+2';                       -> 0
mysql> SELECT '1+2' REGEXP '1\+2';                      -> 0
mysql> SELECT '1+2' REGEXP '1\\+2';                     -> 1
```
