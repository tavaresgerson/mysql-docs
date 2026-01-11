#### 15.1.20.6 CHECK Constraints

Prior to MySQL 8.0.16, `CREATE TABLE` permits only the following limited version of table `CHECK` constraint syntax, which is parsed and ignored:

```
CHECK (expr)
```

As of MySQL 8.0.16, `CREATE TABLE` permits the core features of table and column `CHECK` constraints, for all storage engines. `CREATE TABLE` permits the following `CHECK` constraint syntax, for both table constraints and column constraints:

```
[CONSTRAINT [symbol]] CHECK (expr) [[NOT] ENFORCED]
```

The optional *`symbol`* specifies a name for the constraint. If omitted, MySQL generates a name from the table name, a literal `_chk_`, and an ordinal number (1, 2, 3, ...). Constraint names have a maximum length of 64 characters. They are case-sensitive, but not accent-sensitive.

*`expr`* specifies the constraint condition as a boolean expression that must evaluate to `TRUE` or `UNKNOWN` (for `NULL` values) for each row of the table. If the condition evaluates to `FALSE`, it fails and a constraint violation occurs. The effect of a violation depends on the statement being executed, as described later in this section.

The optional enforcement clause indicates whether the constraint is enforced:

* If omitted or specified as `ENFORCED`, the constraint is created and enforced.

* If specified as `NOT ENFORCED`, the constraint is created but not enforced.

A `CHECK` constraint is specified as either a table constraint or column constraint:

* A table constraint does not appear within a column definition and can refer to any table column or columns. Forward references are permitted to columns appearing later in the table definition.

* A column constraint appears within a column definition and can refer only to that column.

Consider this table definition:

```
CREATE TABLE t1
(
  CHECK (c1 <> c2),
  c1 INT CHECK (c1 > 10),
  c2 INT CONSTRAINT c2_positive CHECK (c2 > 0),
  c3 INT CHECK (c3 < 100),
  CONSTRAINT c1_nonzero CHECK (c1 <> 0),
  CHECK (c1 > c3)
);
```

The definition includes table constraints and column constraints, in named and unnamed formats:

* The first constraint is a table constraint: It occurs outside any column definition, so it can (and does) refer to multiple table columns. This constraint contains forward references to columns not defined yet. No constraint name is specified, so MySQL generates a name.

* The next three constraints are column constraints: Each occurs within a column definition, and thus can refer only to the column being defined. One of the constraints is named explicitly. MySQL generates a name for each of the other two.

* The last two constraints are table constraints. One of them is named explicitly. MySQL generates a name for the other one.

As mentioned, MySQL generates a name for any `CHECK` constraint specified without one. To see the names generated for the preceding table definition, use `SHOW CREATE TABLE`:

```
mysql> SHOW CREATE TABLE t1\G
*************************** 1. row ***************************
       Table: t1
Create Table: CREATE TABLE `t1` (
  `c1` int(11) DEFAULT NULL,
  `c2` int(11) DEFAULT NULL,
  `c3` int(11) DEFAULT NULL,
  CONSTRAINT `c1_nonzero` CHECK ((`c1` <> 0)),
  CONSTRAINT `c2_positive` CHECK ((`c2` > 0)),
  CONSTRAINT `t1_chk_1` CHECK ((`c1` <> `c2`)),
  CONSTRAINT `t1_chk_2` CHECK ((`c1` > 10)),
  CONSTRAINT `t1_chk_3` CHECK ((`c3` < 100)),
  CONSTRAINT `t1_chk_4` CHECK ((`c1` > `c3`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```

The SQL standard specifies that all types of constraints (primary key, unique index, foreign key, check) belong to the same namespace. In MySQL, each constraint type has its own namespace per schema (database). Consequently, `CHECK` constraint names must be unique per schema; no two tables in the same schema can share a `CHECK` constraint name. (Exception: A `TEMPORARY` table hides a non-`TEMPORARY` table of the same name, so it can have the same `CHECK` constraint names as well.)

Beginning generated constraint names with the table name helps ensure schema uniqueness because table names also must be unique within the schema.

`CHECK` condition expressions must adhere to the following rules. An error occurs if an expression contains disallowed constructs.

* Nongenerated and generated columns are permitted, except columns with the `AUTO_INCREMENT` attribute and columns in other tables.

* Literals, deterministic built-in functions, and operators are permitted. A function is deterministic if, given the same data in tables, multiple invocations produce the same result, independently of the connected user. Examples of functions that are nondeterministic and fail this definition: `CONNECTION_ID()`, `CURRENT_USER()`, `NOW()`.

* Stored functions and loadable functions are not permitted.
* Stored procedure and function parameters are not permitted.
* Variables (system variables, user-defined variables, and stored program local variables) are not permitted.

* Subqueries are not permitted.

Foreign key referential actions (`ON UPDATE`, `ON DELETE`) are prohibited on columns used in `CHECK` constraints. Likewise, `CHECK` constraints are prohibited on columns used in foreign key referential actions.

`CHECK` constraints are evaluated for `INSERT`, `UPDATE`, `REPLACE`, `LOAD DATA`, and `LOAD XML` statements and an error occurs if a constraint evaluates to `FALSE`. If an error occurs, handling of changes already applied differs for transactional and nontransactional storage engines, and also depends on whether strict SQL mode is in effect, as described in Strict SQL Mode.

`CHECK` constraints are evaluated for `INSERT IGNORE`, `UPDATE IGNORE`, `LOAD DATA ... IGNORE`, and `LOAD XML ... IGNORE` statements and a warning occurs if a constraint evaluates to `FALSE`. The insert or update for any offending row is skipped.

If the constraint expression evaluates to a data type that differs from the declared column type, implicit coercion to the declared type occurs according to the usual MySQL type-conversion rules. See Section 14.3, “Type Conversion in Expression Evaluation”. If type conversion fails or results in a loss of precision, an error occurs.

Note

Constraint expression evaluation uses the SQL mode in effect at evaluation time. If any component of the expression depends on the SQL mode, different results may occur for different uses of the table unless the SQL mode is the same during all uses.

The Information Schema `CHECK_CONSTRAINTS` table provides information about `CHECK` constraints defined on tables. See Section 28.3.5, “The INFORMATION_SCHEMA CHECK_CONSTRAINTS Table”.
