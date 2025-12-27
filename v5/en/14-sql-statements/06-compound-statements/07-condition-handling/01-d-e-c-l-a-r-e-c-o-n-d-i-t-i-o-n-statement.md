#### 13.6.7.1 DECLARE ... CONDITION Statement

```sql
DECLARE condition_name CONDITION FOR condition_value

condition_value: {
    mysql_error_code
  | SQLSTATE [VALUE] sqlstate_value
}
```

The [`DECLARE ... CONDITION`](declare-condition.html "13.6.7.1 DECLARE ... CONDITION Statement") statement declares a named error condition, associating a name with a condition that needs specific handling. The name can be referred to in a subsequent [`DECLARE ... HANDLER`](declare-handler.html "13.6.7.2 DECLARE ... HANDLER Statement") statement (see [Section 13.6.7.2, “DECLARE ... HANDLER Statement”](declare-handler.html "13.6.7.2 DECLARE ... HANDLER Statement")).

Condition declarations must appear before cursor or handler declarations.

The *`condition_value`* for [`DECLARE ... CONDITION`](declare-condition.html "13.6.7.1 DECLARE ... CONDITION Statement") indicates the specific condition or class of conditions to associate with the condition name. It can take the following forms:

* *`mysql_error_code`*: An integer literal indicating a MySQL error code.

  Do not use MySQL error code 0 because that indicates success rather than an error condition. For a list of MySQL error codes, see [Server Error Message Reference](/doc/mysql-errors/5.7/en/server-error-reference.html).

* SQLSTATE [VALUE] *`sqlstate_value`*: A 5-character string literal indicating an SQLSTATE value.

  Do not use SQLSTATE values that begin with `'00'` because those indicate success rather than an error condition. For a list of SQLSTATE values, see [Server Error Message Reference](/doc/mysql-errors/5.7/en/server-error-reference.html).

Condition names referred to in [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") or use [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") statements must be associated with SQLSTATE values, not MySQL error codes.

Using names for conditions can help make stored program code clearer. For example, this handler applies to attempts to drop a nonexistent table, but that is apparent only if you know that 1051 is the MySQL error code for “unknown table”:

```sql
DECLARE CONTINUE HANDLER FOR 1051
  BEGIN
    -- body of handler
  END;
```

By declaring a name for the condition, the purpose of the handler is more readily seen:

```sql
DECLARE no_such_table CONDITION FOR 1051;
DECLARE CONTINUE HANDLER FOR no_such_table
  BEGIN
    -- body of handler
  END;
```

Here is a named condition for the same condition, but based on the corresponding SQLSTATE value rather than the MySQL error code:

```sql
DECLARE no_such_table CONDITION FOR SQLSTATE '42S02';
DECLARE CONTINUE HANDLER FOR no_such_table
  BEGIN
    -- body of handler
  END;
```
