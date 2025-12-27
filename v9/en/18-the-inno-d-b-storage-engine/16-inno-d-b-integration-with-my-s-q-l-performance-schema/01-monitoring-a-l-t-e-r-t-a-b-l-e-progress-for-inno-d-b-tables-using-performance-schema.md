### 17.16.1 Monitoring ALTER TABLE Progress for InnoDB Tables Using Performance Schema

You can monitor `ALTER TABLE` progress for `InnoDB` tables using Performance Schema.

There are seven stage events that represent different phases of `ALTER TABLE`. Each stage event reports a running total of `WORK_COMPLETED` and `WORK_ESTIMATED` for the overall `ALTER TABLE` operation as it progresses through its different phases. `WORK_ESTIMATED` is calculated using a formula that takes into account all of the work that `ALTER TABLE` performs, and may be revised during `ALTER TABLE` processing. `WORK_COMPLETED` and `WORK_ESTIMATED` values are an abstract representation of all of the work performed by `ALTER TABLE`.

In order of occurrence, `ALTER TABLE` stage events include:

* `stage/innodb/alter table (read PK and internal sort)`: This stage is active when `ALTER TABLE` is in the reading-primary-key phase. It starts with `WORK_COMPLETED=0` and `WORK_ESTIMATED` set to the estimated number of pages in the primary key. When the stage is completed, `WORK_ESTIMATED` is updated to the actual number of pages in the primary key.

* `stage/innodb/alter table (merge sort)`: This stage is repeated for each index added by the `ALTER TABLE` operation.

* `stage/innodb/alter table (insert)`: This stage is repeated for each index added by the `ALTER TABLE` operation.

* `stage/innodb/alter table (log apply index)`: This stage includes the application of DML log generated while `ALTER TABLE` was running.

* `stage/innodb/alter table (flush)`: Before this stage begins, `WORK_ESTIMATED` is updated with a more accurate estimate, based on the length of the flush list.

* `stage/innodb/alter table (log apply table)`: This stage includes the application of concurrent DML log generated while `ALTER TABLE` was running. The duration of this phase depends on the extent of table changes. This phase is instant if no concurrent DML was run on the table.

* `stage/innodb/alter table (end)`: Includes any remaining work that appeared after the flush phase, such as reapplying DML that was executed on the table while `ALTER TABLE` was running.

Note

`InnoDB` `ALTER TABLE` stage events do not currently account for the addition of spatial indexes.

#### ALTER TABLE Monitoring Example Using Performance Schema

The following example demonstrates how to enable the `stage/innodb/alter table%` stage event instruments and related consumer tables to monitor `ALTER TABLE` progress. For information about Performance Schema stage event instruments and related consumers, see Section 29.12.5, “Performance Schema Stage Event Tables”.

1. Enable the `stage/innodb/alter%` instruments:

   ```
   mysql> UPDATE performance_schema.setup_instruments
          SET ENABLED = 'YES'
          WHERE NAME LIKE 'stage/innodb/alter%';
   Query OK, 7 rows affected (0.00 sec)
   Rows matched: 7  Changed: 7  Warnings: 0
   ```

2. Enable the stage event consumer tables, which include `events_stages_current`, `events_stages_history`, and `events_stages_history_long`.

   ```
   mysql> UPDATE performance_schema.setup_consumers
          SET ENABLED = 'YES'
          WHERE NAME LIKE '%stages%';
   Query OK, 3 rows affected (0.00 sec)
   Rows matched: 3  Changed: 3  Warnings: 0
   ```

3. Run an `ALTER TABLE` operation. In this example, a `middle_name` column is added to the employees table of the employees sample database.

   ```
   mysql> ALTER TABLE employees.employees ADD COLUMN middle_name varchar(14) AFTER first_name;
   Query OK, 0 rows affected (9.27 sec)
   Records: 0  Duplicates: 0  Warnings: 0
   ```

4. Check the progress of the `ALTER TABLE` operation by querying the Performance Schema `events_stages_current` table. The stage event shown differs depending on which `ALTER TABLE` phase is currently in progress. The `WORK_COMPLETED` column shows the work completed. The `WORK_ESTIMATED` column provides an estimate of the remaining work.

   ```
   mysql> SELECT EVENT_NAME, WORK_COMPLETED, WORK_ESTIMATED
          FROM performance_schema.events_stages_current;
   +------------------------------------------------------+----------------+----------------+
   | EVENT_NAME                                           | WORK_COMPLETED | WORK_ESTIMATED |
   +------------------------------------------------------+----------------+----------------+
   | stage/innodb/alter table (read PK and internal sort) |            280 |           1245 |
   +------------------------------------------------------+----------------+----------------+
   1 row in set (0.01 sec)
   ```

   The `events_stages_current` table returns an empty set if the `ALTER TABLE` operation has completed. In this case, you can check the `events_stages_history` table to view event data for the completed operation. For example:

   ```
   mysql> SELECT EVENT_NAME, WORK_COMPLETED, WORK_ESTIMATED
          FROM performance_schema.events_stages_history;
   +------------------------------------------------------+----------------+----------------+
   | EVENT_NAME                                           | WORK_COMPLETED | WORK_ESTIMATED |
   +------------------------------------------------------+----------------+----------------+
   | stage/innodb/alter table (read PK and internal sort) |            886 |           1213 |
   | stage/innodb/alter table (flush)                     |           1213 |           1213 |
   | stage/innodb/alter table (log apply table)           |           1597 |           1597 |
   | stage/innodb/alter table (end)                       |           1597 |           1597 |
   | stage/innodb/alter table (log apply table)           |           1981 |           1981 |
   +------------------------------------------------------+----------------+----------------+
   5 rows in set (0.00 sec)
   ```

   As shown above, the `WORK_ESTIMATED` value was revised during `ALTER TABLE` processing. The estimated work after completion of the initial stage is

   1213. When `ALTER TABLE` processing completed, `WORK_ESTIMATED` was set to the actual value, which is 1981.
