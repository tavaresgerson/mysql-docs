### 29.19.1 Query Profiling Using Performance Schema

The following example demonstrates how to use Performance Schema statement events and stage events to retrieve data comparable to profiling information provided by `SHOW PROFILES` and `SHOW PROFILE` statements.

The `setup_actors` table can be used to limit the collection of historical events by host, user, or account to reduce runtime overhead and the amount of data collected in history tables. The first step of the example shows how to limit collection of historical events to a specific user.

Performance Schema displays event timer information in picoseconds (trillionths of a second) to normalize timing data to a standard unit. In the following example, `TIMER_WAIT` values are divided by 1000000000000 to show data in units of seconds. Values are also truncated to 6 decimal places to display data in the same format as `SHOW PROFILES` and `SHOW PROFILE` statements.

1. Limit the collection of historical events to the user that runs the query. By default, `setup_actors` is configured to allow monitoring and historical event collection for all foreground threads:

   ```
   mysql> SELECT * FROM performance_schema.setup_actors;
   +------+------+------+---------+---------+
   | HOST | USER | ROLE | ENABLED | HISTORY |
   +------+------+------+---------+---------+
   | %    | %    | %    | YES     | YES     |
   +------+------+------+---------+---------+
   ```

   Update the default row in the `setup_actors` table to disable historical event collection and monitoring for all foreground threads, and insert a new row that enables monitoring and historical event collection for the user that runs the query:

   ```
   mysql> UPDATE performance_schema.setup_actors
          SET ENABLED = 'NO', HISTORY = 'NO'
          WHERE HOST = '%' AND USER = '%';

   mysql> INSERT INTO performance_schema.setup_actors
          (HOST,USER,ROLE,ENABLED,HISTORY)
          VALUES('localhost','test_user','%','YES','YES');
   ```

   Data in the `setup_actors` table should now appear similar to the following:

   ```
   mysql> SELECT * FROM performance_schema.setup_actors;
   +-----------+-----------+------+---------+---------+
   | HOST      | USER      | ROLE | ENABLED | HISTORY |
   +-----------+-----------+------+---------+---------+
   | %         | %         | %    | NO      | NO      |
   | localhost | test_user | %    | YES     | YES     |
   +-----------+-----------+------+---------+---------+
   ```

2. Ensure that statement and stage instrumentation is enabled by updating the `setup_instruments` table. Some instruments may already be enabled by default.

   ```
   mysql> UPDATE performance_schema.setup_instruments
          SET ENABLED = 'YES', TIMED = 'YES'
          WHERE NAME LIKE '%statement/%';

   mysql> UPDATE performance_schema.setup_instruments
          SET ENABLED = 'YES', TIMED = 'YES'
          WHERE NAME LIKE '%stage/%';
   ```

3. Ensure that `events_statements_*` and `events_stages_*` consumers are enabled. Some consumers may already be enabled by default.

   ```
   mysql> UPDATE performance_schema.setup_consumers
          SET ENABLED = 'YES'
          WHERE NAME LIKE '%events_statements_%';

   mysql> UPDATE performance_schema.setup_consumers
          SET ENABLED = 'YES'
          WHERE NAME LIKE '%events_stages_%';
   ```

4. Under the user account you are monitoring, run the statement that you want to profile. For example:

   ```
   mysql> SELECT * FROM employees.employees WHERE emp_no = 10001;
   +--------+------------+------------+-----------+--------+------------+
   | emp_no | birth_date | first_name | last_name | gender | hire_date |
   +--------+------------+------------+-----------+--------+------------+
   |  10001 | 1953-09-02 | Georgi     | Facello   | M      | 1986-06-26 |
   +--------+------------+------------+-----------+--------+------------+
   ```

5. Identify the `EVENT_ID` of the statement by querying the `events_statements_history_long` table. This step is similar to running `SHOW PROFILES` to identify the `Query_ID`. The following query produces output similar to `SHOW PROFILES`:

   ```
   mysql> SELECT EVENT_ID, TRUNCATE(TIMER_WAIT/1000000000000,6) as Duration, SQL_TEXT
          FROM performance_schema.events_statements_history_long WHERE SQL_TEXT like '%10001%';
   +----------+----------+--------------------------------------------------------+
   | event_id | duration | sql_text                                               |
   +----------+----------+--------------------------------------------------------+
   |       31 | 0.028310 | SELECT * FROM employees.employees WHERE emp_no = 10001 |
   +----------+----------+--------------------------------------------------------+
   ```

6. Query the `events_stages_history_long` table to retrieve the statement's stage events. Stages are linked to statements using event nesting. Each stage event record has a `NESTING_EVENT_ID` column that contains the `EVENT_ID` of the parent statement.

   ```
   mysql> SELECT event_name AS Stage, TRUNCATE(TIMER_WAIT/1000000000000,6) AS Duration
          FROM performance_schema.events_stages_history_long WHERE NESTING_EVENT_ID=31;
   +--------------------------------+----------+
   | Stage                          | Duration |
   +--------------------------------+----------+
   | stage/sql/starting             | 0.000080 |
   | stage/sql/checking permissions | 0.000005 |
   | stage/sql/Opening tables       | 0.027759 |
   | stage/sql/init                 | 0.000052 |
   | stage/sql/System lock          | 0.000009 |
   | stage/sql/optimizing           | 0.000006 |
   | stage/sql/statistics           | 0.000082 |
   | stage/sql/preparing            | 0.000008 |
   | stage/sql/executing            | 0.000000 |
   | stage/sql/Sending data         | 0.000017 |
   | stage/sql/end                  | 0.000001 |
   | stage/sql/query end            | 0.000004 |
   | stage/sql/closing tables       | 0.000006 |
   | stage/sql/freeing items        | 0.000272 |
   | stage/sql/cleaning up          | 0.000001 |
   +--------------------------------+----------+
   ```
