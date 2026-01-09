#### 13.7.5.11 SHOW CREATE TRIGGER Statement

```sql
SHOW CREATE TRIGGER trigger_name
```

This statement shows the [`CREATE TRIGGER`](create-trigger.html "13.1.20 CREATE TRIGGER Statement") statement that creates the named trigger. This statement requires the [`TRIGGER`](privileges-provided.html#priv_trigger) privilege for the table associated with the trigger.

```sql
mysql> SHOW CREATE TRIGGER ins_sum\G
*************************** 1. row ***************************
               Trigger: ins_sum
              sql_mode: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,
                        NO_ZERO_IN_DATE,NO_ZERO_DATE,
                        ERROR_FOR_DIVISION_BY_ZERO,
                        NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION
SQL Original Statement: CREATE DEFINER=`me`@`localhost` TRIGGER ins_sum
                        BEFORE INSERT ON account
                        FOR EACH ROW SET @sum = @sum + NEW.amount
  character_set_client: utf8
  collation_connection: utf8_general_ci
    Database Collation: latin1_swedish_ci
               Created: 2018-08-08 10:10:07.90
```

[`SHOW CREATE TRIGGER`](show-create-trigger.html "13.7.5.11 SHOW CREATE TRIGGER Statement") output has these columns:

* `Trigger`: The trigger name.
* `sql_mode`: The SQL mode in effect when the trigger executes.

* `SQL Original Statement`: The [`CREATE TRIGGER`](create-trigger.html "13.1.20 CREATE TRIGGER Statement") statement that defines the trigger.

* `character_set_client`: The session value of the [`character_set_client`](server-system-variables.html#sysvar_character_set_client) system variable when the trigger was created.

* `collation_connection`: The session value of the [`collation_connection`](server-system-variables.html#sysvar_collation_connection) system variable when the trigger was created.

* `Database Collation`: The collation of the database with which the trigger is associated.

* `Created`: The date and time when the trigger was created. This is a `TIMESTAMP(2)` value (with a fractional part in hundredths of seconds) for triggers created in MySQL 5.7.2 or later, `NULL` for triggers created prior to 5.7.2.

Trigger information is also available from the `INFORMATION_SCHEMA` [`TRIGGERS`](information-schema-triggers-table.html "24.3.29 The INFORMATION_SCHEMA TRIGGERS Table") table. See [Section 24.3.29, “The INFORMATION_SCHEMA TRIGGERS Table”](information-schema-triggers-table.html "24.3.29 The INFORMATION_SCHEMA TRIGGERS Table").
