#### 13.7.5.38 SHOW TRIGGERS Statement

```sql
SHOW TRIGGERS
    [{FROM | IN} db_name]
    [LIKE 'pattern' | WHERE expr]
```

[`SHOW TRIGGERS`](show-triggers.html "13.7.5.38 SHOW TRIGGERS Statement") lists the triggers currently defined for tables in a database (the default database unless a `FROM` clause is given). This statement returns results only for databases and tables for which you have the [`TRIGGER`](privileges-provided.html#priv_trigger) privilege. The [`LIKE`](string-comparison-functions.html#operator_like) clause, if present, indicates which table names (not trigger names) to match and causes the statement to display triggers for those tables. The `WHERE` clause can be given to select rows using more general conditions, as discussed in [Section 24.8, “Extensions to SHOW Statements”](extended-show.html "24.8 Extensions to SHOW Statements").

For the `ins_sum` trigger defined in [Section 23.3, “Using Triggers”](triggers.html "23.3 Using Triggers"), the output of [`SHOW TRIGGERS`](show-triggers.html "13.7.5.38 SHOW TRIGGERS Statement") is as shown here:

```sql
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
                      NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION
             Definer: me@localhost
character_set_client: utf8
collation_connection: utf8_general_ci
  Database Collation: latin1_swedish_ci
```

[`SHOW TRIGGERS`](show-triggers.html "13.7.5.38 SHOW TRIGGERS Statement") output has these columns:

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

  The date and time when the trigger was created. This is a `TIMESTAMP(2)` value (with a fractional part in hundredths of seconds) for triggers created in MySQL 5.7.2 or later, `NULL` for triggers created prior to 5.7.2.

* `sql_mode`

  The SQL mode in effect when the trigger was created, and under which the trigger executes. For the permitted values, see [Section 5.1.10, “Server SQL Modes”](sql-mode.html "5.1.10 Server SQL Modes").

* `Definer`

  The account of the user who created the trigger, in `'user_name'@'host_name'` format.

* `character_set_client`

  The session value of the [`character_set_client`](server-system-variables.html#sysvar_character_set_client) system variable when the trigger was created.

* `collation_connection`

  The session value of the [`collation_connection`](server-system-variables.html#sysvar_collation_connection) system variable when the trigger was created.

* `Database Collation`

  The collation of the database with which the trigger is associated.

Trigger information is also available from the `INFORMATION_SCHEMA` [`TRIGGERS`](information-schema-triggers-table.html "24.3.29 The INFORMATION_SCHEMA TRIGGERS Table") table. See [Section 24.3.29, “The INFORMATION\_SCHEMA TRIGGERS Table”](information-schema-triggers-table.html "24.3.29 The INFORMATION_SCHEMA TRIGGERS Table").
