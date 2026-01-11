#### 15.7.7.11 SHOW CREATE TRIGGER Statement

```
SHOW CREATE TRIGGER trigger_name
```

This statement shows the `CREATE TRIGGER` statement that creates the named trigger. This statement requires the `TRIGGER` privilege for the table associated with the trigger.

```
mysql> SHOW CREATE TRIGGER ins_sum\G
*************************** 1. row ***************************
               Trigger: ins_sum
              sql_mode: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,
                        NO_ZERO_IN_DATE,NO_ZERO_DATE,
                        ERROR_FOR_DIVISION_BY_ZERO,
                        NO_ENGINE_SUBSTITUTION
SQL Original Statement: CREATE DEFINER=`me`@`localhost` TRIGGER `ins_sum`
                        BEFORE INSERT ON `account`
                        FOR EACH ROW SET @sum = @sum + NEW.amount
  character_set_client: utf8mb4
  collation_connection: utf8mb4_0900_ai_ci
    Database Collation: utf8mb4_0900_ai_ci
               Created: 2018-08-08 10:10:12.61
```

`SHOW CREATE TRIGGER` output has these columns:

* `Trigger`: The trigger name.
* `sql_mode`: The SQL mode in effect when the trigger executes.

* `SQL Original Statement`: The `CREATE TRIGGER` statement that defines the trigger.

* `character_set_client`: The session value of the `character_set_client` system variable when the trigger was created.

* `collation_connection`: The session value of the `collation_connection` system variable when the trigger was created.

* `Database Collation`: The collation of the database with which the trigger is associated.

* `Created`: The date and time when the trigger was created. This is a `TIMESTAMP(2)` value (with a fractional part in hundredths of seconds) for triggers.

Trigger information is also available from the `INFORMATION_SCHEMA` `TRIGGERS` table. See Section 28.3.45, “The INFORMATION_SCHEMA TRIGGERS Table”.
