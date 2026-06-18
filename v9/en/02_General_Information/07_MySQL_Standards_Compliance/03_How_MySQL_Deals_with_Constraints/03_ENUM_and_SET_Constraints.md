#### 1.7.3.3 ENUM and SET Constraints

[`ENUM`](enum.html "13.3.6 The ENUM Type") and
[`SET`](set.html "13.3.7 The SET Type") columns provide an
efficient way to define columns that can contain only a given
set of values. See [Section 13.3.6, “The ENUM Type”](enum.html "13.3.6 The ENUM Type"), and
[Section 13.3.7, “The SET Type”](set.html "13.3.7 The SET Type").

Unless strict mode is disabled (not recommended, but see
[Section 7.1.11, “Server SQL Modes”](sql-mode.html "7.1.11 Server SQL Modes")), the definition of a
[`ENUM`](enum.html "13.3.6 The ENUM Type") or
[`SET`](set.html "13.3.7 The SET Type") column acts as a constraint
on values entered into the column. An error occurs for values
that do not satisfy these conditions:

* An [`ENUM`](enum.html "13.3.6 The ENUM Type") value must be one
  of those listed in the column definition, or the internal
  numeric equivalent thereof. The value cannot be the error
  value (that is, 0 or the empty string). For a column
  defined as
  [`ENUM('a','b','c')`](enum.html "13.3.6 The ENUM Type"), values
  such as `''`, `'d'`, or
  `'ax'` are invalid and are rejected.

* A [`SET`](set.html "13.3.7 The SET Type") value must be the
  empty string or a value consisting only of the values
  listed in the column definition separated by commas. For a
  column defined as
  [`SET('a','b','c')`](set.html "13.3.7 The SET Type"), values
  such as `'d'` or
  `'a,b,c,d'` are invalid and are rejected.

Errors for invalid values can be suppressed in strict mode if
you use [`INSERT
IGNORE`](insert.html "15.2.7 INSERT Statement") or `UPDATE IGNORE`. In this
case, a warning is generated rather than an error. For
[`ENUM`](enum.html "13.3.6 The ENUM Type"), the value is inserted as
the error member (`0`). For
[`SET`](set.html "13.3.7 The SET Type"), the value is inserted as
given except that any invalid substrings are deleted. For
example, `'a,x,b,y'` results in a value of
`'a,b'`.