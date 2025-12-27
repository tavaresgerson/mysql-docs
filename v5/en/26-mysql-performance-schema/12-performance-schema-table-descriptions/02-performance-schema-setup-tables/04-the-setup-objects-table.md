#### 25.12.2.4 The setup\_objects Table

The [`setup_objects`](performance-schema-setup-objects-table.html "25.12.2.4 The setup_objects Table") table controls whether the Performance Schema monitors particular objects. This table has a maximum size of 100 rows by default. To change the table size, modify the [`performance_schema_setup_objects_size`](performance-schema-system-variables.html#sysvar_performance_schema_setup_objects_size) system variable at server startup.

The initial [`setup_objects`](performance-schema-setup-objects-table.html "25.12.2.4 The setup_objects Table") contents look like this:

```sql
mysql> SELECT * FROM performance_schema.setup_objects;
+-------------+--------------------+-------------+---------+-------+
| OBJECT_TYPE | OBJECT_SCHEMA      | OBJECT_NAME | ENABLED | TIMED |
+-------------+--------------------+-------------+---------+-------+
| EVENT       | mysql              | %           | NO      | NO    |
| EVENT       | performance_schema | %           | NO      | NO    |
| EVENT       | information_schema | %           | NO      | NO    |
| EVENT       | %                  | %           | YES     | YES   |
| FUNCTION    | mysql              | %           | NO      | NO    |
| FUNCTION    | performance_schema | %           | NO      | NO    |
| FUNCTION    | information_schema | %           | NO      | NO    |
| FUNCTION    | %                  | %           | YES     | YES   |
| PROCEDURE   | mysql              | %           | NO      | NO    |
| PROCEDURE   | performance_schema | %           | NO      | NO    |
| PROCEDURE   | information_schema | %           | NO      | NO    |
| PROCEDURE   | %                  | %           | YES     | YES   |
| TABLE       | mysql              | %           | NO      | NO    |
| TABLE       | performance_schema | %           | NO      | NO    |
| TABLE       | information_schema | %           | NO      | NO    |
| TABLE       | %                  | %           | YES     | YES   |
| TRIGGER     | mysql              | %           | NO      | NO    |
| TRIGGER     | performance_schema | %           | NO      | NO    |
| TRIGGER     | information_schema | %           | NO      | NO    |
| TRIGGER     | %                  | %           | YES     | YES   |
+-------------+--------------------+-------------+---------+-------+
```

Modifications to the [`setup_objects`](performance-schema-setup-objects-table.html "25.12.2.4 The setup_objects Table") table affect object monitoring immediately.

For object types listed in [`setup_objects`](performance-schema-setup-objects-table.html "25.12.2.4 The setup_objects Table"), the Performance Schema uses the table to how to monitor them. Object matching is based on the `OBJECT_SCHEMA` and `OBJECT_NAME` columns. Objects for which there is no match are not monitored.

The effect of the default object configuration is to instrument all tables except those in the `mysql`, `INFORMATION_SCHEMA`, and `performance_schema` databases. (Tables in the `INFORMATION_SCHEMA` database are not instrumented regardless of the contents of [`setup_objects`](performance-schema-setup-objects-table.html "25.12.2.4 The setup_objects Table"); the row for `information_schema.%` simply makes this default explicit.)

When the Performance Schema checks for a match in [`setup_objects`](performance-schema-setup-objects-table.html "25.12.2.4 The setup_objects Table"), it tries to find more specific matches first. For example, with a table `db1.t1`, it looks for a match for `'db1'` and `'t1'`, then for `'db1'` and `'%'`, then for `'%'` and `'%'`. The order in which matching occurs matters because different matching [`setup_objects`](performance-schema-setup-objects-table.html "25.12.2.4 The setup_objects Table") rows can have different `ENABLED` and `TIMED` values.

Rows can be inserted into or deleted from [`setup_objects`](performance-schema-setup-objects-table.html "25.12.2.4 The setup_objects Table") by users with the [`INSERT`](privileges-provided.html#priv_insert) or [`DELETE`](privileges-provided.html#priv_delete) privilege on the table. For existing rows, only the `ENABLED` and `TIMED` columns can be modified, by users with the [`UPDATE`](privileges-provided.html#priv_update) privilege on the table.

For more information about the role of the [`setup_objects`](performance-schema-setup-objects-table.html "25.12.2.4 The setup_objects Table") table in event filtering, see [Section 25.4.3, “Event Pre-Filtering”](performance-schema-pre-filtering.html "25.4.3 Event Pre-Filtering").

The [`setup_objects`](performance-schema-setup-objects-table.html "25.12.2.4 The setup_objects Table") table has these columns:

* `OBJECT_TYPE`

  The type of object to instrument. The value is one of `'EVENT'` (Event Scheduler event), `'FUNCTION'` (stored function), `'PROCEDURE'` (stored procedure), `'TABLE'` (base table), or `'TRIGGER'` (trigger).

  `TABLE` filtering affects table I/O events (`wait/io/table/sql/handler` instrument) and table lock events (`wait/lock/table/sql/handler` instrument).

* `OBJECT_SCHEMA`

  The schema that contains the object. This should be a literal name, or `'%'` to mean “any schema.”

* `OBJECT_NAME`

  The name of the instrumented object. This should be a literal name, or `'%'` to mean “any object.”

* `ENABLED`

  Whether events for the object are instrumented. The value is `YES` or `NO`. This column can be modified.

* `TIMED`

  Whether events for the object are timed. The value is `YES` or `NO`. This column can be modified.

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") is permitted for the [`setup_objects`](performance-schema-setup-objects-table.html "25.12.2.4 The setup_objects Table") table. It removes the rows.
