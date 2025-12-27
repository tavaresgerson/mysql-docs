#### 15.7.7.41 SHOW TRIGGERS Statement

```
SHOW TRIGGERS
    [{FROM | IN} db_name]
    [LIKE 'pattern' | WHERE expr]
```

`SHOW TRIGGERS` lists the triggers currently defined for tables in a database (the default database unless a `FROM` clause is given). This statement returns results only for databases and tables for which you have the `TRIGGER` privilege. The `LIKE` clause, if present, indicates which table names (not trigger names) to match and causes the statement to display triggers for those tables. The `WHERE` clause can be given to select rows using more general conditions, as discussed in Section 28.8, “Extensions to SHOW Statements”.

For the `ins_sum` trigger defined in Section 27.4, “Using Triggers”, the output of `SHOW TRIGGERS` is as shown here:

```
mysql> SHOW TRIGGERS LIKE 'acc%'\G
*************************** 1. row ***************************
             Trigger: ins_sum
               Event: INSERT
               Table: account
           Statement: SET @sum = @sum + NEW.amount
              Timing: BEFORE
             Created: 2018-08-08 10:10:12.61
            sql_mode: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,
                      NO_ZERO_IN_DATE,NO_ZERO_DATE,
                      ERROR_FOR_DIVISION_BY_ZERO,
                      NO_ENGINE_SUBSTITUTION
             Definer: me@localhost
character_set_client: utf8mb4
collation_connection: utf8mb4_0900_ai_ci
  Database Collation: utf8mb4_0900_ai_ci
```

`SHOW TRIGGERS` output has these columns:

* `Trigger`

  The name of the trigger.

* `Event`

  The trigger event. This is the type of operation on the associated table for which the trigger activates. The value is `INSERT` (a row was inserted), `DELETE` (a row was deleted), or `UPDATE` (a row was modified).

* `Table`

  The table for which the trigger is defined.

* `Statement`

  The trigger body; that is, the statement executed when the trigger activates.

* `Timing`

  Whether the trigger activates before or after the triggering event. The value is `BEFORE` or `AFTER`.

* `Created`

  The date and time when the trigger was created. This is a `TIMESTAMP(2)` value (with a fractional part in hundredths of seconds) for triggers.

* `sql_mode`

  The SQL mode in effect when the trigger was created, and under which the trigger executes. For the permitted values, see Section 7.1.11, “Server SQL Modes”.

* `Definer`

  The account of the user who created the trigger, in `'user_name'@'host_name'` format.

* `character_set_client`

  The session value of the `character_set_client` system variable when the trigger was created.

* `collation_connection`

  The session value of the `collation_connection` system variable when the trigger was created.

* `Database Collation`

  The collation of the database with which the trigger is associated.

Trigger information is also available from the `INFORMATION_SCHEMA` `TRIGGERS` table. See Section 28.3.50, “The INFORMATION\_SCHEMA TRIGGERS Table”.
