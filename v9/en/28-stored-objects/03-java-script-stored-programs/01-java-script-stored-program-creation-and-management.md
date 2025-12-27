### 27.3.1 JavaScript Stored Program Creation and Management

A stored function or stored procedure written in JavaScript is created, invoked, and maintained in much the same fashion as one written in SQL, subject to the differences listed here:

* The stored program language must be declared explicitly using `LANGUAGE JAVASCRIPT` in the `CREATE FUNCTION` or `CREATE PROCEDURE` statement used to create the stored program; otherwise, MySQL assumes the intended language is SQL.

  The syntax of the routine body is checked at creation time; any errors cause the `CREATE` statement to be rejected, and the stored program not to be created.

* The program body must be demarcated using the `AS` keyword plus dollar-quoted delimiters such as `$$`, `$js$`, `$mysql$`, and so on. You must use the same delimiter to mark both the beginning and end of the routine body. It is possible to use quotation marks to delimit the routine body, but dollar-quoted delimiters are preferred, since this avoids issues with quoting strings in function or procedure code. Following the first dollar-quoted delimiter, the **mysql** client prompt changes to `$>` for each new line within the routine body, until it reaches a closing dollar-quoted delimiter, after which the prompt reverts to the default (normally `->`). This can be seen in the `CREATE FUNCTION` statement used to create the `add_nos()` function previously.

* It is not necessary to specify a statement delimiter or terminator as it is for SQL stored routines. If you employ the optional `;` character to separate JavaScript statements, this is interpreted correctly as being part of the JavaScript routine, and not as an SQL statement delimiter, as shown here:

  ```
  mysql> CREATE FUNCTION js_pow(arg1 INT, arg2 INT)
      -> RETURNS INT LANGUAGE JAVASCRIPT
      -> AS
      ->   $$
      $>     let x = Math.pow(arg1, arg2);
      $>     return x;
      $>   $$
      -> ;
  Query OK, 0 rows affected (0.02 sec)

  mysql> SELECT js_pow(2,3);
  +-------------+
  | js_pow(2,3) |
  +-------------+
  |           8 |
  +-------------+
  1 row in set (0.00 sec)
  ```

  To minimize possible confusion, we do not use the `;` separator for any JavaScript statements in the remaining examples in this section.

* The text of the routine body is always treated as `utfmb4` regardless of the character set actually used. What this means is that, whatever character set is used by the client for the routine body, the server converts it to `utf8mb4` before storing it in the data dictionary. Since utf8mb4 subsumes all other supported character sets, this should not be an issue.

  JavaScript program argument and routine names must use the `utfmb3` character set, as with SQL stored programs. See Section 12.9, “Unicode Support”.

* String arguments and return types are expected to be `utf8mb4`; this means that, if the default character set of the schema to which the JavaScript stored program belongs is some other character set, all of its arguments must be declared explicitly as `utf8mb4`.

  Input argument names must adhere to the rules for JavaScript identifiers: They can contain Unicode letters, `$`, `_`, and digits (0-9), but may not start with a digit.

  Using a word that is reserved in JavaScript (such as `var` or `function`) as the name of an argument raises an error. Since MySQL JavaScript stored programs always use strict mode, this also includes keywords such as `package` and `let`. See [Reserved Words](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#reserved_words) for a complete listing of these. In addition, the keywords `mysql`, `console`, and `graal` are also reserved by the MLE component, and cannot be used as variable or argument names in MySQL JavaScript stored programs.

* You can modify a JavaScript stored program using `ALTER FUNCTION` and `ALTER PROCEDURE` as you would an SQL stored function or procedure. Changing the language using `ALTER` is not supported; in such cases, you must use `DROP FUNCTION` or `DROP PROCEDURE` as applicable, then re-create the stored program using the appropriate `CREATE` statement.

To obtain a listing of all JavaScript stored programs in all databases on the server, query the Information Schema `ROUTINES` table similarly to this:

```
mysql> SELECT CONCAT(ROUTINE_SCHEMA, '.', ROUTINE_NAME) AS "JS Stored Routines"
    ->   FROM INFORMATION_SCHEMA.ROUTINES
    ->   WHERE EXTERNAL_LANGUAGE="JAVASCRIPT";
+------------------------+
| JS Stored Routines     |
+------------------------+
| test.pc1               |
| test.pc2               |
| world.jssp_simple1     |
| test.jssp_vsimple      |
| test.jssp_simple       |
| world.jssp_vsimple     |
| world.jssp_vsimple2    |
| world.jssp_simple_meta |
+------------------------+
8 rows in set (0.00 sec)
```
