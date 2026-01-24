### 25.4.5 Pre-Filtering by Object

The [`setup_objects`](performance-schema-setup-objects-table.html "25.12.2.4 The setup_objects Table") table controls whether the Performance Schema monitors particular table and stored program objects. The initial [`setup_objects`](performance-schema-setup-objects-table.html "25.12.2.4 The setup_objects Table") contents look like this:

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

The `OBJECT_TYPE` column indicates the type of object to which a row applies. `TABLE` filtering affects table I/O events (`wait/io/table/sql/handler` instrument) and table lock events (`wait/lock/table/sql/handler` instrument).

The `OBJECT_SCHEMA` and `OBJECT_NAME` columns should contain a literal schema or object name, or `'%'` to match any name.

The `ENABLED` column indicates whether matching objects are monitored, and `TIMED` indicates whether to collect timing information. Setting the `TIMED` column affects Performance Schema table contents as described in [Section 25.4.1, “Performance Schema Event Timing”](performance-schema-timing.html "25.4.1 Performance Schema Event Timing").

The effect of the default object configuration is to instrument all objects except those in the `mysql`, `INFORMATION_SCHEMA`, and `performance_schema` databases. (Tables in the `INFORMATION_SCHEMA` database are not instrumented regardless of the contents of [`setup_objects`](performance-schema-setup-objects-table.html "25.12.2.4 The setup_objects Table"); the row for `information_schema.%` simply makes this default explicit.)

When the Performance Schema checks for a match in [`setup_objects`](performance-schema-setup-objects-table.html "25.12.2.4 The setup_objects Table"), it tries to find more specific matches first. For rows that match a given `OBJECT_TYPE`, the Performance Schema checks rows in this order:

* Rows with `OBJECT_SCHEMA='literal'` and `OBJECT_NAME='literal'`.

* Rows with `OBJECT_SCHEMA='literal'` and `OBJECT_NAME='%'`.

* Rows with `OBJECT_SCHEMA='%'` and `OBJECT_NAME='%'`.

For example, with a table `db1.t1`, the Performance Schema looks in `TABLE` rows for a match for `'db1'` and `'t1'`, then for `'db1'` and `'%'`, then for `'%'` and `'%'`. The order in which matching occurs matters because different matching [`setup_objects`](performance-schema-setup-objects-table.html "25.12.2.4 The setup_objects Table") rows can have different `ENABLED` and `TIMED` values.

For table-related events, the Performance Schema combines the contents of [`setup_objects`](performance-schema-setup-objects-table.html "25.12.2.4 The setup_objects Table") with [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table") to determine whether to enable instruments and whether to time enabled instruments:

* For tables that match a row in [`setup_objects`](performance-schema-setup-objects-table.html "25.12.2.4 The setup_objects Table"), table instruments produce events only if `ENABLED` is `YES` in both [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table") and [`setup_objects`](performance-schema-setup-objects-table.html "25.12.2.4 The setup_objects Table").

* The `TIMED` values in the two tables are combined, so that timing information is collected only when both values are `YES`.

For stored program objects, the Performance Schema takes the `ENABLED` and `TIMED` columns directly from the [`setup_objects`](performance-schema-setup-objects-table.html "25.12.2.4 The setup_objects Table") row. There is no combining of values with [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table").

Suppose that [`setup_objects`](performance-schema-setup-objects-table.html "25.12.2.4 The setup_objects Table") contains the following `TABLE` rows that apply to `db1`, `db2`, and `db3`:

```sql
+-------------+---------------+-------------+---------+-------+
| OBJECT_TYPE | OBJECT_SCHEMA | OBJECT_NAME | ENABLED | TIMED |
+-------------+---------------+-------------+---------+-------+
| TABLE       | db1           | t1          | YES     | YES   |
| TABLE       | db1           | t2          | NO      | NO    |
| TABLE       | db2           | %           | YES     | YES   |
| TABLE       | db3           | %           | NO      | NO    |
| TABLE       | %             | %           | YES     | YES   |
+-------------+---------------+-------------+---------+-------+
```

If an object-related instrument in [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table") has an `ENABLED` value of `NO`, events for the object are not monitored. If the `ENABLED` value is `YES`, event monitoring occurs according to the `ENABLED` value in the relevant [`setup_objects`](performance-schema-setup-objects-table.html "25.12.2.4 The setup_objects Table") row:

* `db1.t1` events are monitored
* `db1.t2` events are not monitored
* `db2.t3` events are monitored
* `db3.t4` events are not monitored
* `db4.t5` events are monitored

Similar logic applies for combining the `TIMED` columns from the [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table") and [`setup_objects`](performance-schema-setup-objects-table.html "25.12.2.4 The setup_objects Table") tables to determine whether to collect event timing information.

If a persistent table and a temporary table have the same name, matching against [`setup_objects`](performance-schema-setup-objects-table.html "25.12.2.4 The setup_objects Table") rows occurs the same way for both. It is not possible to enable monitoring for one table but not the other. However, each table is instrumented separately.
