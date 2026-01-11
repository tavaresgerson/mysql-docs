### 15.6.5 Flow Control Statements

15.6.5.1 CASE Statement

15.6.5.2 IF Statement

15.6.5.3 ITERATE Statement

15.6.5.4 LEAVE Statement

15.6.5.5 LOOP Statement

15.6.5.6 REPEAT Statement

15.6.5.7 RETURN Statement

15.6.5.8 WHILE Statement

MySQL supports the `IF`, `CASE`, `ITERATE`, `LEAVE` `LOOP`, `WHILE`, and `REPEAT` constructs for flow control within stored programs. It also supports `RETURN` within stored functions.

Many of these constructs contain other statements, as indicated by the grammar specifications in the following sections. Such constructs may be nested. For example, an `IF` statement might contain a `WHILE` loop, which itself contains a `CASE` statement.

MySQL does not support `FOR` loops.
