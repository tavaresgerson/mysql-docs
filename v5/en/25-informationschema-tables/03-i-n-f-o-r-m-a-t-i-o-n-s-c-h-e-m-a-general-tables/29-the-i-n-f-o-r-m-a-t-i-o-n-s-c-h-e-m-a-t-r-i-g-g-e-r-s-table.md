### 24.3.29 The INFORMATION_SCHEMA TRIGGERS Table

The [`TRIGGERS`](information-schema-triggers-table.html "24.3.29 The INFORMATION_SCHEMA TRIGGERS Table") table provides information about triggers. To see information about a table's triggers, you must have the [`TRIGGER`](privileges-provided.html#priv_trigger) privilege for the table.

The [`TRIGGERS`](information-schema-triggers-table.html "24.3.29 The INFORMATION_SCHEMA TRIGGERS Table") table has these columns:

* `TRIGGER_CATALOG`

  The name of the catalog to which the trigger belongs. This value is always `def`.

* `TRIGGER_SCHEMA`

  The name of the schema (database) to which the trigger belongs.

* `TRIGGER_NAME`

  The name of the trigger.

* `EVENT_MANIPULATION`

  The trigger event. This is the type of operation on the associated table for which the trigger activates. The value is `INSERT` (a row was inserted), `DELETE` (a row was deleted), or `UPDATE` (a row was modified).

* `EVENT_OBJECT_CATALOG`, `EVENT_OBJECT_SCHEMA`, and `EVENT_OBJECT_TABLE`

  As noted in [Section 23.3, “Using Triggers”](triggers.html "23.3 Using Triggers"), every trigger is associated with exactly one table. These columns indicate the catalog and schema (database) in which this table occurs, and the table name, respectively. The `EVENT_OBJECT_CATALOG` value is always `def`.

* `ACTION_ORDER`

  The ordinal position of the trigger's action within the list of triggers on the same table with the same `EVENT_MANIPULATION` and `ACTION_TIMING` values.

* `ACTION_CONDITION`

  This value is always `NULL`.

* `ACTION_STATEMENT`

  The trigger body; that is, the statement executed when the trigger activates. This text uses UTF-8 encoding.

* `ACTION_ORIENTATION`

  This value is always `ROW`.

* `ACTION_TIMING`

  Whether the trigger activates before or after the triggering event. The value is `BEFORE` or `AFTER`.

* `ACTION_REFERENCE_OLD_TABLE`

  This value is always `NULL`.

* `ACTION_REFERENCE_NEW_TABLE`

  This value is always `NULL`.

* `ACTION_REFERENCE_OLD_ROW` and `ACTION_REFERENCE_NEW_ROW`

  The old and new column identifiers, respectively. The `ACTION_REFERENCE_OLD_ROW` value is always `OLD` and the `ACTION_REFERENCE_NEW_ROW` value is always `NEW`.

* `CREATED`

  The date and time when the trigger was created. This is a `TIMESTAMP(2)` value (with a fractional part in hundredths of seconds) for triggers created in MySQL 5.7.2 or later, `NULL` for triggers created prior to 5.7.2.

* `SQL_MODE`

  The SQL mode in effect when the trigger was created, and under which the trigger executes. For the permitted values, see [Section 5.1.10, “Server SQL Modes”](sql-mode.html "5.1.10 Server SQL Modes").

* `DEFINER`

  The account named in the `DEFINER` clause (often the user who created the trigger), in `'user_name'@'host_name'` format.

* `CHARACTER_SET_CLIENT`

  The session value of the [`character_set_client`](server-system-variables.html#sysvar_character_set_client) system variable when the trigger was created.

* `COLLATION_CONNECTION`

  The session value of the [`collation_connection`](server-system-variables.html#sysvar_collation_connection) system variable when the trigger was created.

* `DATABASE_COLLATION`

  The collation of the database with which the trigger is associated.

#### Example

The following example uses the `ins_sum` trigger defined in [Section 23.3, “Using Triggers”](triggers.html "23.3 Using Triggers"):

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.TRIGGERS
       WHERE TRIGGER_SCHEMA='test' AND TRIGGER_NAME='ins_sum'\G
*************************** 1. row ***************************
           TRIGGER_CATALOG: def
            TRIGGER_SCHEMA: test
              TRIGGER_NAME: ins_sum
        EVENT_MANIPULATION: INSERT
      EVENT_OBJECT_CATALOG: def
       EVENT_OBJECT_SCHEMA: test
        EVENT_OBJECT_TABLE: account
              ACTION_ORDER: 1
          ACTION_CONDITION: NULL
          ACTION_STATEMENT: SET @sum = @sum + NEW.amount
        ACTION_ORIENTATION: ROW
             ACTION_TIMING: BEFORE
ACTION_REFERENCE_OLD_TABLE: NULL
ACTION_REFERENCE_NEW_TABLE: NULL
  ACTION_REFERENCE_OLD_ROW: OLD
  ACTION_REFERENCE_NEW_ROW: NEW
                   CREATED: 2018-08-08 10:10:12.61
                  SQL_MODE: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,
                            NO_ZERO_IN_DATE,NO_ZERO_DATE,
                            ERROR_FOR_DIVISION_BY_ZERO,
                            NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION
                   DEFINER: me@localhost
      CHARACTER_SET_CLIENT: utf8
      COLLATION_CONNECTION: utf8_general_ci
        DATABASE_COLLATION: latin1_swedish_ci
```

Trigger information is also available from the [`SHOW TRIGGERS`](show-triggers.html "13.7.5.38 SHOW TRIGGERS Statement") statement. See [Section 13.7.5.38, “SHOW TRIGGERS Statement”](show-triggers.html "13.7.5.38 SHOW TRIGGERS Statement").
