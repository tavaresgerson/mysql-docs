--- title: MySQL 8.4 Reference Manual :: 14.11 XML Functions url: https://dev.mysql.com/doc/refman/8.4/en/xml-functions.html order: 30 ---



## 14.11 XML Functions

**Table 14.16 XML Functions**

<table><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Name</th> <th>Description</th> </tr></thead><tbody><tr><td><code>ExtractValue()</code></td> <td> Extract a value from an XML string using XPath notation </td> </tr><tr><td><code>UpdateXML()</code></td> <td> Return replaced XML fragment </td> </tr></tbody></table>

This section discusses XML and related functionality in MySQL.

::: info Note

It is possible to obtain XML-formatted output from MySQL in the **mysql** and  **mysqldump** clients by invoking them with the `--xml` option. See Section 6.5.1, “mysql — The MySQL Command-Line Client”, and  Section 6.5.4, “mysqldump — A Database Backup Program”.


:::

Two functions providing basic XPath 1.0 (XML Path Language, version 1.0) capabilities are available. Some basic information about XPath syntax and usage is provided later in this section; however, an in-depth discussion of these topics is beyond the scope of this manual, and you should refer to the [XML Path Language (XPath) 1.0 standard](http://www.w3.org/TR/xpath) for definitive information. A useful resource for those new to XPath or who desire a refresher in the basics is the [Zvon.org XPath Tutorial](http://www.zvon.org/xxl/XPathTutorial/), which is available in several languages.

::: info Note

These functions remain under development. We continue to improve these and other aspects of XML and XPath functionality in MySQL 8.4 and onwards. You may discuss these, ask questions about them, and obtain help from other users with them in the [MySQL XML User Forum](https://forums.mysql.com/list.php?44).


:::

XPath expressions used with these functions support user variables and local stored program variables. User variables are weakly checked; variables local to stored programs are strongly checked (see also Bug #26518):

* **User variables (weak checking).** Variables using the syntax `$@variable_name` (that is, user variables) are not checked. No warnings or errors are issued by the server if a variable has the wrong type or has previously not been assigned a value. This also means the user is fully responsible for any typographical errors, since no warnings are given if (for example) `$@myvairable` is used where `$@myvariable` was intended.

  Example:

  ```
  mysql> SET @xml = '<a><b>X</b><b>Y</b></a>';
  Query OK, 0 rows affected (0.00 sec)

  mysql> SET @i =1, @j = 2;
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT @i, ExtractValue(@xml, '//b[$@i]');
  +------+--------------------------------+
  | @i   | ExtractValue(@xml, '//b[$@i]') |
  +------+--------------------------------+
  |    1 | X                              |
  +------+--------------------------------+
  1 row in set (0.00 sec)

  mysql> SELECT @j, ExtractValue(@xml, '//b[$@j]');
  +------+--------------------------------+
  | @j   | ExtractValue(@xml, '//b[$@j]') |
  +------+--------------------------------+
  |    2 | Y                              |
  +------+--------------------------------+
  1 row in set (0.00 sec)

  mysql> SELECT @k, ExtractValue(@xml, '//b[$@k]');
  +------+--------------------------------+
  | @k   | ExtractValue(@xml, '//b[$@k]') |
  +------+--------------------------------+
  | NULL |                                |
  +------+--------------------------------+
  1 row in set (0.00 sec)
  ```
* **Variables in stored programs (strong checking).** Variables using the syntax `$variable_name` can be declared and used with these functions when they are called inside stored programs. Such variables are local to the stored program in which they are defined, and are strongly checked for type and value.

  Example:

  ```
  mysql> DELIMITER |

  mysql> CREATE PROCEDURE myproc ()
      -> BEGIN
      ->   DECLARE i INT DEFAULT 1;
      ->   DECLARE xml VARCHAR(25) DEFAULT '<a>X</a><a>Y</a><a>Z</a>';
      ->
      ->   WHILE i < 4 DO
      ->     SELECT xml, i, ExtractValue(xml, '//a[$i]');
      ->     SET i = i+1;
      ->   END WHILE;
      -> END |
  Query OK, 0 rows affected (0.01 sec)

  mysql> DELIMITER ;

  mysql> CALL myproc();
  +--------------------------+---+------------------------------+
  | xml                      | i | ExtractValue(xml, '//a[$i]') |
  +--------------------------+---+------------------------------+
  | <a>X</a><a>Y</a><a>Z</a> | 1 | X                            |
  +--------------------------+---+------------------------------+
  1 row in set (0.00 sec)

  +--------------------------+---+------------------------------+
  | xml                      | i | ExtractValue(xml, '//a[$i]') |
  +--------------------------+---+------------------------------+
  | <a>X</a><a>Y</a><a>Z</a> | 2 | Y                            |
  +--------------------------+---+------------------------------+
  1 row in set (0.01 sec)

  +--------------------------+---+------------------------------+
  | xml                      | i | ExtractValue(xml, '//a[$i]') |
  +--------------------------+---+------------------------------+
  | <a>X</a><a>Y</a><a>Z</a> | 3 | Z                            |
  +--------------------------+---+------------------------------+
  1 row in set (0.01 sec)
  ```

  **Parameters.** Variables used in XPath expressions inside stored routines that are passed in as parameters are also subject to strong checking.

Expressions containing user variables or variables local to stored programs must otherwise (except for notation) conform to the rules for XPath expressions containing variables as given in the XPath 1.0 specification.

::: info Note

A user variable used to store an XPath expression is treated as an empty string. Because of this, it is not possible to store an XPath expression as a user variable. (Bug #32911)


:::

* [`ExtractValue(xml_frag, xpath_expr)`](xml-functions.html#function_extractvalue)

   `ExtractValue()` takes two string arguments, a fragment of XML markup *`xml_frag`* and an XPath expression *`xpath_expr`* (also known as a locator); it returns the text (`CDATA`) of the first text node which is a child of the element or elements matched by the XPath expression.

  Using this function is the equivalent of performing a match using the *`xpath_expr`* after appending `/text()`. In other words, [`ExtractValue('<a><b>Sakila</b></a>', '/a/b')`](xml-functions.html#function_extractvalue) and [`ExtractValue('<a><b>Sakila</b></a>', '/a/b/text()')`](xml-functions.html#function_extractvalue) produce the same result. If *`xml_frag`* or *`xpath_expr`* is `NULL`, the function returns `NULL`.

  If multiple matches are found, the content of the first child text node of each matching element is returned (in the order matched) as a single, space-delimited string.

  If no matching text node is found for the expression (including the implicit `/text()`)—for whatever reason, as long as *`xpath_expr`* is valid, and *`xml_frag`* consists of elements which are properly nested and closed—an empty string is returned. No distinction is made between a match on an empty element and no match at all. This is by design.

  If you need to determine whether no matching element was found in *`xml_frag`* or such an element was found but contained no child text nodes, you should test the result of an expression that uses the XPath `count()` function. For example, both of these statements return an empty string, as shown here:

  ```
  mysql> SELECT ExtractValue('<a><b/></a>', '/a/b');
  +-------------------------------------+
  | ExtractValue('<a><b/></a>', '/a/b') |
  +-------------------------------------+
  |                                     |
  +-------------------------------------+
  1 row in set (0.00 sec)

  mysql> SELECT ExtractValue('<a><c/></a>', '/a/b');
  +-------------------------------------+
  | ExtractValue('<a><c/></a>', '/a/b') |
  +-------------------------------------+
  |                                     |
  +-------------------------------------+
  1 row in set (0.00 sec)
  ```

  However, you can determine whether there was actually a matching element using the following:

  ```
  mysql> SELECT ExtractValue('<a><b/></a>', 'count(/a/b)');
  +-------------------------------------+
  | ExtractValue('<a><b/></a>', 'count(/a/b)') |
  +-------------------------------------+
  | 1                                   |
  +-------------------------------------+
  1 row in set (0.00 sec)

  mysql> SELECT ExtractValue('<a><c/></a>', 'count(/a/b)');
  +-------------------------------------+
  | ExtractValue('<a><c/></a>', 'count(/a/b)') |
  +-------------------------------------+
  | 0                                   |
  +-------------------------------------+
  1 row in set (0.01 sec)
  ```

  Important

   `ExtractValue()` returns only `CDATA`, and does not return any tags that might be contained within a matching tag, nor any of their content (see the result returned as `val1` in the following example).

  ```
  mysql> SELECT
      ->   ExtractValue('<a>ccc<b>ddd</b></a>', '/a') AS val1,
      ->   ExtractValue('<a>ccc<b>ddd</b></a>', '/a/b') AS val2,
      ->   ExtractValue('<a>ccc<b>ddd</b></a>', '//b') AS val3,
      ->   ExtractValue('<a>ccc<b>ddd</b></a>', '/b') AS val4,
      ->   ExtractValue('<a>ccc<b>ddd</b><b>eee</b></a>', '//b') AS val5;

  +------+------+------+------+---------+
  | val1 | val2 | val3 | val4 | val5    |
  +------+------+------+------+---------+
  | ccc  | ddd  | ddd  |      | ddd eee |
  +------+------+------+------+---------+
  ```

  This function uses the current SQL collation for making comparisons with `contains()`, performing the same collation aggregation as other string functions (such as `CONCAT()`), in taking into account the collation coercibility of their arguments; see Section 12.8.4, “Collation Coercibility in Expressions”, for an explanation of the rules governing this behavior.

  (Previously, binary—that is, case-sensitive—comparison was always used.)

  `NULL` is returned if *`xml_frag`* contains elements which are not properly nested or closed, and a warning is generated, as shown in this example:

  ```
  mysql> SELECT ExtractValue('<a>c</a><b', '//a');
  +-----------------------------------+
  | ExtractValue('<a>c</a><b', '//a') |
  +-----------------------------------+
  | NULL                              |
  +-----------------------------------+
  1 row in set, 1 warning (0.00 sec)

  mysql> SHOW WARNINGS\G
  *************************** 1. row ***************************
    Level: Warning
     Code: 1525
  Message: Incorrect XML value: 'parse error at line 1 pos 11:
           END-OF-INPUT unexpected ('>' wanted)'
  1 row in set (0.00 sec)

  mysql> SELECT ExtractValue('<a>c</a><b/>', '//a');
  +-------------------------------------+
  | ExtractValue('<a>c</a><b/>', '//a') |
  +-------------------------------------+
  | c                                   |
  +-------------------------------------+
  1 row in set (0.00 sec)
  ```
* [`UpdateXML(xml_target, xpath_expr, new_xml)`](xml-functions.html#function_updatexml)

  This function replaces a single portion of a given fragment of XML markup *`xml_target`* with a new XML fragment *`new_xml`*, and then returns the changed XML. The portion of *`xml_target`* that is replaced matches an XPath expression *`xpath_expr`* supplied by the user.

  If no expression matching *`xpath_expr`* is found, or if multiple matches are found, the function returns the original *`xml_target`* XML fragment. All three arguments should be strings. If any of the arguments to `UpdateXML()` are `NULL`, the function returns `NULL`.

  ```
  mysql> SELECT
      ->   UpdateXML('<a><b>ccc</b><d></d></a>', '/a', '<e>fff</e>') AS val1,
      ->   UpdateXML('<a><b>ccc</b><d></d></a>', '/b', '<e>fff</e>') AS val2,
      ->   UpdateXML('<a><b>ccc</b><d></d></a>', '//b', '<e>fff</e>') AS val3,
      ->   UpdateXML('<a><b>ccc</b><d></d></a>', '/a/d', '<e>fff</e>') AS val4,
      ->   UpdateXML('<a><d></d><b>ccc</b><d></d></a>', '/a/d', '<e>fff</e>') AS val5
      -> \G

  *************************** 1. row ***************************
  val1: <e>fff</e>
  val2: <a><b>ccc</b><d></d></a>
  val3: <a><e>fff</e><d></d></a>
  val4: <a><b>ccc</b><e>fff</e></a>
  val5: <a><d></d><b>ccc</b><d></d></a>
  ```
::: info Note

A discussion in depth of XPath syntax and usage are beyond the scope of this manual. Please see the [XML Path Language (XPath) 1.0 specification](http://www.w3.org/TR/xpath) for definitive information. A useful resource for those new to XPath or who are wishing a refresher in the basics is the [Zvon.org XPath Tutorial](http://www.zvon.org/xxl/XPathTutorial/), which is available in several languages.


:::

Descriptions and examples of some basic XPath expressions follow:

* `/tag`

  Matches `<tag/>` if and only if `<tag/>` is the root element.

  Example: `/a` has a match in `<a><b/></a>` because it matches the outermost (root) tag. It does not match the inner *`a`* element in `<b><a/></b>` because in this instance it is the child of another element.
* `/tag1/tag2`

  Matches `<tag2/>` if and only if it is a child of `<tag1/>`, and `<tag1/>` is the root element.

  Example: `/a/b` matches the *`b`* element in the XML fragment `<a><b/></a>` because it is a child of the root element *`a`*. It does not have a match in `<b><a/></b>` because in this case, *`b`* is the root element (and hence the child of no other element). Nor does the XPath expression have a match in `<a><c><b/></c></a>`; here, *`b`* is a descendant of *`a`*, but not actually a child of *`a`*.

  This construct is extendable to three or more elements. For example, the XPath expression `/a/b/c` matches the *`c`* element in the fragment `<a><b><c/></b></a>`.
* `//tag`

  Matches any instance of `<tag>`.

  Example: `//a` matches the *`a`* element in any of the following: `<a><b><c/></b></a>`; `<c><a><b/></a></b>`; `<c><b><a/></b></c>`.

  `//` can be combined with `/`. For example, `//a/b` matches the *`b`* element in either of the fragments `<a><b/></a>` or `<c><a><b/></a></c>`.

  ::: info Note

  `//tag` is the equivalent of `/descendant-or-self::*/tag`. A common error is to confuse this with `/descendant-or-self::tag`, although the latter expression can actually lead to very different results, as can be seen here:

  ```
  mysql> SET @xml = '<a><b><c>w</c><b>x</b><d>y</d>z</b></a>';
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT @xml;
  +-----------------------------------------+
  | @xml                                    |
  +-----------------------------------------+
  | <a><b><c>w</c><b>x</b><d>y</d>z</b></a> |
  +-----------------------------------------+
  1 row in set (0.00 sec)

  mysql> SELECT ExtractValue(@xml, '//b[1]');
  +------------------------------+
  | ExtractValue(@xml, '//b[1]') |
  +------------------------------+
  | x z                          |
  +------------------------------+
  1 row in set (0.00 sec)

  mysql> SELECT ExtractValue(@xml, '//b[2]');
  +------------------------------+
  | ExtractValue(@xml, '//b[2]') |
  +------------------------------+
  |                              |
  +------------------------------+
  1 row in set (0.01 sec)

  mysql> SELECT ExtractValue(@xml, '/descendant-or-self::*/b[1]');
  +---------------------------------------------------+
  | ExtractValue(@xml, '/descendant-or-self::*/b[1]') |
  +---------------------------------------------------+
  | x z                                               |
  +---------------------------------------------------+
  1 row in set (0.06 sec)

  mysql> SELECT ExtractValue(@xml, '/descendant-or-self::*/b[2]');
  +---------------------------------------------------+
  | ExtractValue(@xml, '/descendant-or-self::*/b[2]') |
  +---------------------------------------------------+
  |                                                   |
  +---------------------------------------------------+
  1 row in set (0.00 sec)


  mysql> SELECT ExtractValue(@xml, '/descendant-or-self::b[1]');
  +-------------------------------------------------+
  | ExtractValue(@xml, '/descendant-or-self::b[1]') |
  +-------------------------------------------------+
  | z                                               |
  +-------------------------------------------------+
  1 row in set (0.00 sec)

  mysql> SELECT ExtractValue(@xml, '/descendant-or-self::b[2]');
  +-------------------------------------------------+
  | ExtractValue(@xml, '/descendant-or-self::b[2]') |
  +-------------------------------------------------+
  | x                                               |
  +-------------------------------------------------+
  1 row in set (0.00 sec)
  ```


  :::
* The `*` operator acts as a “wildcard” that matches any element. For example, the expression `/*/b` matches the *`b`* element in either of the XML fragments `<a><b/></a>` or `<c><b/></c>`. However, the expression does not produce a match in the fragment `<b><a/></b>` because *`b`* must be a child of some other element. The wildcard may be used in any position: The expression `/*/b/*` matches any child of a *`b`* element that is itself not the root element.
* You can match any of several locators using the `|` ( `UNION`) operator. For example, the expression `//b|//c` matches all *`b`* and *`c`* elements in the XML target.
* It is also possible to match an element based on the value of one or more of its attributes. This done using the syntax `tag[@attribute="value"]`. For example, the expression `//b[@id="idB"]` matches the second *`b`* element in the fragment `<a><b id="idA"/><c/><b id="idB"/></a>`. To match against *any* element having `attribute="value"`, use the XPath expression `//*[attribute="value"]`.

  To filter multiple attribute values, simply use multiple attribute-comparison clauses in succession. For example, the expression `//b[@c="x"][@d="y"]` matches the element `<b c="x" d="y"/>` occurring anywhere in a given XML fragment.

  To find elements for which the same attribute matches any of several values, you can use multiple locators joined by the `|` operator. For example, to match all *`b`* elements whose *`c`* attributes have either of the values 23 or 17, use the expression `//b[@c="23"]|//b[@c="17"]`. You can also use the logical `or` operator for this purpose: `//b[@c="23" or @c="17"]`.

  ::: info Note

  The difference between `or` and `|` is that `or` joins conditions, while `|` joins result sets.


  :::

**XPath Limitations.** The XPath syntax supported by these functions is currently subject to the following limitations:

* Nodeset-to-nodeset comparison (such as `'/a/b[@c=@d]'`) is not supported.
* All of the standard XPath comparison operators are supported. (Bug #22823)
* Relative locator expressions are resolved in the context of the root node. For example, consider the following query and result:

  ```
  mysql> SELECT ExtractValue(
      ->   '<a><b c="1">X</b><b c="2">Y</b></a>',
      ->    'a/b'
      -> ) AS result;
  +--------+
  | result |
  +--------+
  | X Y    |
  +--------+
  1 row in set (0.03 sec)
  ```

  In this case, the locator `a/b` resolves to `/a/b`.

  Relative locators are also supported within predicates. In the following example, `d[../@c="1"]` is resolved as `/a/b[@c="1"]/d`:

  ```
  mysql> SELECT ExtractValue(
      ->      '<a>
      ->        <b c="1"><d>X</d></b>
      ->        <b c="2"><d>X</d></b>
      ->      </a>',
      ->      'a/b/d[../@c="1"]')
      -> AS result;
  +--------+
  | result |
  +--------+
  | X      |
  +--------+
  1 row in set (0.00 sec)
  ```
* Locators prefixed with expressions that evaluate as scalar values—including variable references, literals, numbers, and scalar function calls—are not permitted, and their use results in an error.
* The `::` operator is not supported in combination with node types such as the following:

  + `axis::comment()`
  + `axis::text()`
  + `axis::processing-instructions()`
  + `axis::node()`

  However, name tests (such as `axis::name` and `axis::*`) are supported, as shown in these examples:

  ```
  mysql> SELECT ExtractValue('<a><b>x</b><c>y</c></a>','/a/child::b');
  +-------------------------------------------------------+
  | ExtractValue('<a><b>x</b><c>y</c></a>','/a/child::b') |
  +-------------------------------------------------------+
  | x                                                     |
  +-------------------------------------------------------+
  1 row in set (0.02 sec)

  mysql> SELECT ExtractValue('<a><b>x</b><c>y</c></a>','/a/child::*');
  +-------------------------------------------------------+
  | ExtractValue('<a><b>x</b><c>y</c></a>','/a/child::*') |
  +-------------------------------------------------------+
  | x y                                                   |
  +-------------------------------------------------------+
  1 row in set (0.01 sec)
  ```
* “Up-and-down” navigation is not supported in cases where the path would lead “above” the root element. That is, you cannot use expressions which match on descendants of ancestors of a given element, where one or more of the ancestors of the current element is also an ancestor of the root element (see Bug #16321).
* The following XPath functions are not supported, or have known issues as indicated:

  + `id()`
  + `lang()`
  + `local-name()`
  + `name()`
  + `namespace-uri()`
  + `normalize-space()`
  + `starts-with()`
  + `string()`
  + `substring-after()`
  + `substring-before()`
  + `translate()`
* The following axes are not supported:

  + `following-sibling`
  + `following`
  + `preceding-sibling`
  + `preceding`

XPath expressions passed as arguments to `ExtractValue()` and `UpdateXML()` may contain the colon character (`:`) in element selectors, which enables their use with markup employing XML namespaces notation. For example:

```
mysql> SET @xml = '<a>111<b:c>222<d>333</d><e:f>444</e:f></b:c></a>';
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT ExtractValue(@xml, '//e:f');
+-----------------------------+
| ExtractValue(@xml, '//e:f') |
+-----------------------------+
| 444                         |
+-----------------------------+
1 row in set (0.00 sec)

mysql> SELECT UpdateXML(@xml, '//b:c', '<g:h>555</g:h>');
+--------------------------------------------+
| UpdateXML(@xml, '//b:c', '<g:h>555</g:h>') |
+--------------------------------------------+
| <a>111<g:h>555</g:h></a>                   |
+--------------------------------------------+
1 row in set (0.00 sec)
```

This is similar in some respects to what is permitted by Apache Xalan and some other parsers, and is much simpler than requiring namespace declarations or the use of the `namespace-uri()` and `local-name()` functions.

**Error handling.** For both  `ExtractValue()` and `UpdateXML()`, the XPath locator used must be valid and the XML to be searched must consist of elements which are properly nested and closed. If the locator is invalid, an error is generated:

```
mysql> SELECT ExtractValue('<a>c</a><b/>', '/&a');
ERROR 1105 (HY000): XPATH syntax error: '&a'
```

If *`xml_frag`* does not consist of elements which are properly nested and closed, `NULL` is returned and a warning is generated, as shown in this example:

```
mysql> SELECT ExtractValue('<a>c</a><b', '//a');
+-----------------------------------+
| ExtractValue('<a>c</a><b', '//a') |
+-----------------------------------+
| NULL                              |
+-----------------------------------+
1 row in set, 1 warning (0.00 sec)

mysql> SHOW WARNINGS\G
*************************** 1. row ***************************
  Level: Warning
   Code: 1525
Message: Incorrect XML value: 'parse error at line 1 pos 11:
         END-OF-INPUT unexpected ('>' wanted)'
1 row in set (0.00 sec)

mysql> SELECT ExtractValue('<a>c</a><b/>', '//a');
+-------------------------------------+
| ExtractValue('<a>c</a><b/>', '//a') |
+-------------------------------------+
| c                                   |
+-------------------------------------+
1 row in set (0.00 sec)
```

Important

The replacement XML used as the third argument to `UpdateXML()` is *not* checked to determine whether it consists solely of elements which are properly nested and closed.

**XPath Injection.** code injection occurs when malicious code is introduced into the system to gain unauthorized access to privileges and data. It is based on exploiting assumptions made by developers about the type and content of data input from users. XPath is no exception in this regard.

A common scenario in which this can happen is the case of application which handles authorization by matching the combination of a login name and password with those found in an XML file, using an XPath expression like this one:

```
//user[login/text()='neapolitan' and password/text()='1c3cr34m']/attribute::id
```

This is the XPath equivalent of an SQL statement like this one:

```
SELECT id FROM users WHERE login='neapolitan' AND password='1c3cr34m';
```

A PHP application employing XPath might handle the login process like this:

```
<?php

  $file     =   "users.xml";

  $login    =   $POST["login"];
  $password =   $POST["password"];

  $xpath = "//user[login/text()=$login and password/text()=$password]/attribute::id";

  if( file_exists($file) )
  {
    $xml = simplexml_load_file($file);

    if($result = $xml->xpath($xpath))
      echo "You are now logged in as user $result[0].";
    else
      echo "Invalid login name or password.";
  }
  else
    exit("Failed to open $file.");

?>
```

No checks are performed on the input. This means that a malevolent user can “short-circuit” the test by entering `' or 1=1` for both the login name and password, resulting in `$xpath` being evaluated as shown here:

```
//user[login/text()='' or 1=1 and password/text()='' or 1=1]/attribute::id
```

Since the expression inside the square brackets always evaluates as `true`, it is effectively the same as this one, which matches the `id` attribute of every `user` element in the XML document:

```
//user/attribute::id
```

One way in which this particular attack can be circumvented is simply by quoting the variable names to be interpolated in the definition of `$xpath`, forcing the values passed from a Web form to be converted to strings:

```
$xpath = "//user[login/text()='$login' and password/text()='$password']/attribute::id";
```

This is the same strategy that is often recommended for preventing SQL injection attacks. In general, the practices you should follow for preventing XPath injection attacks are the same as for preventing SQL injection:

* Never accepted untested data from users in your application.
* Check all user-submitted data for type; reject or convert data that is of the wrong type
* Test numeric data for out of range values; truncate, round, or reject values that are out of range. Test strings for illegal characters and either strip them out or reject input containing them.
* Do not output explicit error messages that might provide an unauthorized user with clues that could be used to compromise the system; log these to a file or database table instead.

Just as SQL injection attacks can be used to obtain information about database schemas, so can XPath injection be used to traverse XML files to uncover their structure, as discussed in Amit Klein's paper [Blind XPath Injection](http://www.packetstormsecurity.org/papers/bypass/Blind_XPath_Injection_20040518.pdf) (PDF file, 46KB).

It is also important to check the output being sent back to the client. Consider what can happen when we use the MySQL `ExtractValue()` function:

```
mysql> SELECT ExtractValue(
    ->     LOAD_FILE('users.xml'),
    ->     '//user[login/text()="" or 1=1 and password/text()="" or 1=1]/attribute::id'
    -> ) AS id;
+-------------------------------+
| id                            |
+-------------------------------+
| 00327 13579 02403 42354 28570 |
+-------------------------------+
1 row in set (0.01 sec)
```

Because  `ExtractValue()` returns multiple matches as a single space-delimited string, this injection attack provides every valid ID contained within `users.xml` to the user as a single row of output. As an extra safeguard, you should also test output before returning it to the user. Here is a simple example:

```
mysql> SELECT @id = ExtractValue(
    ->     LOAD_FILE('users.xml'),
    ->     '//user[login/text()="" or 1=1 and password/text()="" or 1=1]/attribute::id'
    -> );
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT IF(
    ->     INSTR(@id, ' ') = 0,
    ->     @id,
    ->     'Unable to retrieve user ID')
    -> AS singleID;
+----------------------------+
| singleID                   |
+----------------------------+
| Unable to retrieve user ID |
+----------------------------+
1 row in set (0.00 sec)
```

In general, the guidelines for returning data to users securely are the same as for accepting user input. These can be summed up as:

* Always test outgoing data for type and permissible values.
* Never permit unauthorized users to view error messages that might provide information about the application that could be used to exploit it.

