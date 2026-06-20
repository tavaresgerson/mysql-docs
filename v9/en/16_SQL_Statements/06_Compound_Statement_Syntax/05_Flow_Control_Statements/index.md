### 15.6.5 Flow Control Statements

MySQL supports the [`IF`](if.html "15.6.5.2 IF Statement"),
[`CASE`](case.html "15.6.5.1 CASE Statement"),
[`ITERATE`](iterate.html "15.6.5.3 ITERATE Statement"),
[`LEAVE`](leave.html "15.6.5.4 LEAVE Statement")
[`LOOP`](loop.html "15.6.5.5 LOOP Statement"),
[`WHILE`](while.html "15.6.5.8 WHILE Statement"), and
[`REPEAT`](repeat.html "15.6.5.6 REPEAT Statement") constructs for flow control
within stored programs. It also supports
[`RETURN`](return.html "15.6.5.7 RETURN Statement") within stored functions.

Many of these constructs contain other statements, as indicated by
the grammar specifications in the following sections. Such
constructs may be nested. For example, an
[`IF`](if.html "15.6.5.2 IF Statement") statement might contain a
[`WHILE`](while.html "15.6.5.8 WHILE Statement") loop, which itself contains a
[`CASE`](case.html "15.6.5.1 CASE Statement") statement.

MySQL does not support `FOR` loops.