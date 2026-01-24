#### 13.6.5.1 CASE Statement

```sql
CASE case_value
    WHEN when_value THEN statement_list
    [WHEN when_value THEN statement_list] ...
    [ELSE statement_list]
END CASE
```

Or:

```sql
CASE
    WHEN search_condition THEN statement_list
    [WHEN search_condition THEN statement_list] ...
    [ELSE statement_list]
END CASE
```

The [`CASE`](case.html "13.6.5.1 CASE Statement") statement for stored programs implements a complex conditional construct.

Note

There is also a [`CASE`](flow-control-functions.html#operator_case) *operator*, which differs from the [`CASE`](case.html "13.6.5.1 CASE Statement") *statement* described here. See [Section 12.5, “Flow Control Functions”](flow-control-functions.html "12.5 Flow Control Functions"). The [`CASE`](case.html "13.6.5.1 CASE Statement") statement cannot have an `ELSE NULL` clause, and it is terminated with `END CASE` instead of `END`.

For the first syntax, *`case_value`* is an expression. This value is compared to the *`when_value`* expression in each `WHEN` clause until one of them is equal. When an equal *`when_value`* is found, the corresponding `THEN` clause *`statement_list`* executes. If no *`when_value`* is equal, the `ELSE` clause *`statement_list`* executes, if there is one.

This syntax cannot be used to test for equality with `NULL` because `NULL = NULL` is false. See [Section 3.3.4.6, “Working with NULL Values”](working-with-null.html "3.3.4.6 Working with NULL Values").

For the second syntax, each `WHEN` clause *`search_condition`* expression is evaluated until one is true, at which point its corresponding `THEN` clause *`statement_list`* executes. If no *`search_condition`* is equal, the `ELSE` clause *`statement_list`* executes, if there is one.

If no *`when_value`* or *`search_condition`* matches the value tested and the [`CASE`](case.html "13.6.5.1 CASE Statement") statement contains no `ELSE` clause, a Case not found for CASE statement error results.

Each *`statement_list`* consists of one or more SQL statements; an empty *`statement_list`* is not permitted.

To handle situations where no value is matched by any `WHEN` clause, use an `ELSE` containing an empty [`BEGIN ... END`](begin-end.html "13.6.1 BEGIN ... END Compound Statement") block, as shown in this example. (The indentation used here in the `ELSE` clause is for purposes of clarity only, and is not otherwise significant.)

```sql
DELIMITER |

CREATE PROCEDURE p()
  BEGIN
    DECLARE v INT DEFAULT 1;

    CASE v
      WHEN 2 THEN SELECT v;
      WHEN 3 THEN SELECT 0;
      ELSE
        BEGIN
        END;
    END CASE;
  END;
  |
```
