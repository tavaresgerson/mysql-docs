### 15.6.3 DECLARE Statement

The [`DECLARE`](declare.html "15.6.3 DECLARE Statement") statement is used to
define various items local to a program:

* Local variables. See
  [Section 15.6.4, “Variables in Stored Programs”](stored-program-variables.html "15.6.4 Variables in Stored Programs").

* Conditions and handlers. See
  [Section 15.6.7, “Condition Handling”](condition-handling.html "15.6.7 Condition Handling").

* Cursors. See [Section 15.6.6, “Cursors”](cursors.html "15.6.6 Cursors").

[`DECLARE`](declare.html "15.6.3 DECLARE Statement") is permitted only inside a
[`BEGIN ... END`](begin-end.html "15.6.1 BEGIN ... END Compound Statement")
compound statement and must be at its start, before any other
statements.

Declarations must follow a certain order. Cursor declarations must
appear before handler declarations. Variable and condition
declarations must appear before cursor or handler declarations.