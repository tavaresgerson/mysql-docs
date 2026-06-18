### 7.7.2 Obtaining Information About Loadable Functions

The Performance Schema
[`user_defined_functions`](performance-schema-user-defined-functions-table.html "29.12.21.10 The user_defined_functions Table") table contains
information about the currently installed loadable functions:

```
SELECT * FROM performance_schema.user_defined_functions;
```

The `mysql.func` system table also lists
installed loadable functions, but only those installed using
[`CREATE
FUNCTION`](create-function-loadable.html "15.7.4.1 CREATE FUNCTION Statement for Loadable Functions"). The
[`user_defined_functions`](performance-schema-user-defined-functions-table.html "29.12.21.10 The user_defined_functions Table") table lists
loadable functions installed using
[`CREATE
FUNCTION`](create-function-loadable.html "15.7.4.1 CREATE FUNCTION Statement for Loadable Functions") as well as loadable functions installed
automatically by components or plugins. This difference makes
[`user_defined_functions`](performance-schema-user-defined-functions-table.html "29.12.21.10 The user_defined_functions Table") preferable to
`mysql.func` for checking which loadable
functions are installed. See
[Section 29.12.21.10, “The user\_defined\_functions Table”](performance-schema-user-defined-functions-table.html "29.12.21.10 The user_defined_functions Table").