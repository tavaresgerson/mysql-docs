#### 13.6.4.1 Local Variable DECLARE Statement

```sql
DECLARE var_name [, var_name] ... type [DEFAULT value]
```

This statement declares local variables within stored programs. To provide a default value for a variable, include a `DEFAULT` clause. The value can be specified as an expression; it need not be a constant. If the `DEFAULT` clause is missing, the initial value is `NULL`.

Local variables are treated like stored routine parameters with respect to data type and overflow checking. See [Section 13.1.16, “CREATE PROCEDURE and CREATE FUNCTION Statements”](create-procedure.html "13.1.16 CREATE PROCEDURE and CREATE FUNCTION Statements").

Variable declarations must appear before cursor or handler declarations.

Local variable names are not case-sensitive. Permissible characters and quoting rules are the same as for other identifiers, as described in [Section 9.2, “Schema Object Names”](identifiers.html "9.2 Schema Object Names").

The scope of a local variable is the [`BEGIN ... END`](begin-end.html "13.6.1 BEGIN ... END Compound Statement") block within which it is declared. The variable can be referred to in blocks nested within the declaring block, except those blocks that declare a variable with the same name.

For examples of variable declarations, see [Section 13.6.4.2, “Local Variable Scope and Resolution”](local-variable-scope.html "13.6.4.2 Local Variable Scope and Resolution").
