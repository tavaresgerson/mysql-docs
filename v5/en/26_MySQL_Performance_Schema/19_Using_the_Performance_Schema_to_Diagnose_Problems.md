## 25.19 Using the Performance Schema to Diagnose Problems

The Performance Schema is a tool to help a DBA do performance tuning by taking real measurements instead of “wild guesses.” This section demonstrates some ways to use the Performance Schema for this purpose. The discussion here relies on the use of event filtering, which is described in Section 25.4.2, “Performance Schema Event Filtering”.

The following example provides one methodology that you can use to analyze a repeatable problem, such as investigating a performance bottleneck. To begin, you should have a repeatable use case where performance is deemed “too slow” and needs optimization, and you should enable all instrumentation (no pre-filtering at all).

1. Run the use case.
2. Using the Performance Schema tables, analyze the root cause of the performance problem. This analysis relies heavily on post-filtering.

3. For problem areas that are ruled out, disable the corresponding instruments. For example, if analysis shows that the issue is not related to file I/O in a particular storage engine, disable the file I/O instruments for that engine. Then truncate the history and summary tables to remove previously collected events.

4. Repeat the process at step 1.

   At each iteration, the Performance Schema output, particularly the `events_waits_history_long` table, contains less and less “noise” caused by nonsignificant instruments, and given that this table has a fixed size, contains more and more data relevant to the analysis of the problem at hand.

   At each iteration, investigation should lead closer and closer to the root cause of the problem, as the signal-to-noise ratio improves, making analysis easier.

5. Once a root cause of performance bottleneck is identified, take the appropriate corrective action, such as:

   * Tune the server parameters (cache sizes, memory, and so forth).

   * Tune a query by writing it differently,
   * Tune the database schema (tables, indexes, and so forth).
   * Tune the code (this applies to storage engine or server developers only).

6. Start again at step 1, to see the effects of the changes on performance.

The `mutex_instances.LOCKED_BY_THREAD_ID` and `rwlock_instances.WRITE_LOCKED_BY_THREAD_ID` columns are extremely important for investigating performance bottlenecks or deadlocks. This is made possible by Performance Schema instrumentation as follows:

1. Suppose that thread 1 is stuck waiting for a mutex.
2. You can determine what the thread is waiting for:

   ```sql
   SELECT * FROM performance_schema.events_waits_current
   WHERE THREAD_ID = thread_1;
   ```

   Say the query result identifies that the thread is waiting for mutex A, found in `events_waits_current.OBJECT_INSTANCE_BEGIN`.

3. You can determine which thread is holding mutex A:

   ```sql
   SELECT * FROM performance_schema.mutex_instances
   WHERE OBJECT_INSTANCE_BEGIN = mutex_A;
   ```

   Say the query result identifies that it is thread 2 holding mutex A, as found in `mutex_instances.LOCKED_BY_THREAD_ID`.

4. You can see what thread 2 is doing:

   ```sql
   SELECT * FROM performance_schema.events_waits_current
   WHERE THREAD_ID = thread_2;
   ```


### 25.19.1 Query Profiling Using Performance Schema

The following example demonstrates how to use Performance Schema statement events and stage events to retrieve data comparable to profiling information provided by `SHOW PROFILES` and `SHOW PROFILE` statements.

The `setup_actors` table can be used to limit the collection of historical events by host, user, or account to reduce runtime overhead and the amount of data collected in history tables. The first step of the example shows how to limit collection of historical events to a specific user.

Performance Schema displays event timer information in picoseconds (trillionths of a second) to normalize timing data to a standard unit. In the following example, `TIMER_WAIT` values are divided by 1000000000000 to show data in units of seconds. Values are also truncated to 6 decimal places to display data in the same format as `SHOW PROFILES` and `SHOW PROFILE` statements.

1. Limit the collection of historical events to the user running the query. By default, `setup_actors` is configured to allow monitoring and historical event collection for all foreground threads:

   ```sql
   mysql> SELECT * FROM performance_schema.setup_actors;
   +------+------+------+---------+---------+
   | HOST | USER | ROLE | ENABLED | HISTORY |
   +------+------+------+---------+---------+
   | %    | %    | %    | YES     | YES     |
   +------+------+------+---------+---------+
   ```

   Update the default row in the `setup_actors` table to disable historical event collection and monitoring for all foreground threads, and insert a new row that enables monitoring and historical event collection for the user running the query:

   ```sql
   mysql> UPDATE performance_schema.setup_actors
          SET ENABLED = 'NO', HISTORY = 'NO'
          WHERE HOST = '%' AND USER = '%';

   mysql> INSERT INTO performance_schema.setup_actors
          (HOST,USER,ROLE,ENABLED,HISTORY)
          VALUES('localhost','test_user','%','YES','YES');
   ```

   Data in the `setup_actors` table should now appear similar to the following:

   ```sql
   mysql> SELECT * FROM performance_schema.setup_actors;
   +-----------+-----------+------+---------+---------+
   | HOST      | USER      | ROLE | ENABLED | HISTORY |
   +-----------+-----------+------+---------+---------+
   | %         | %         | %    | NO      | NO      |
   | localhost | test_user | %    | YES     | YES     |
   +-----------+-----------+------+---------+---------+
   ```

2. Ensure that statement and stage instrumentation is enabled by updating the `setup_instruments` table. Some instruments may already be enabled by default.

   ```sql
   mysql> UPDATE performance_schema.setup_instruments
          SET ENABLED = 'YES', TIMED = 'YES'
          WHERE NAME LIKE '%statement/%';

   mysql> UPDATE performance_schema.setup_instruments
          SET ENABLED = 'YES', TIMED = 'YES'
          WHERE NAME LIKE '%stage/%';
   ```

3. Ensure that `events_statements_*` and `events_stages_*` consumers are enabled. Some consumers may already be enabled by default.

   ```sql
   mysql> UPDATE performance_schema.setup_consumers
          SET ENABLED = 'YES'
          WHERE NAME LIKE '%events_statements_%';

   mysql> UPDATE performance_schema.setup_consumers
          SET ENABLED = 'YES'
          WHERE NAME LIKE '%events_stages_%';
   ```

4. Under the user account you are monitoring, run the statement that you want to profile. For example:

   ```sql
   mysql> SELECT * FROM employees.employees WHERE emp_no = 10001;
   +--------+------------+------------+-----------+--------+------------+
   | emp_no | birth_date | first_name | last_name | gender | hire_date |
   +--------+------------+------------+-----------+--------+------------+
   |  10001 | 1953-09-02 | Georgi     | Facello   | M      | 1986-06-26 |
   +--------+------------+------------+-----------+--------+------------+
   ```

5. Identify the `EVENT_ID` of the statement by querying the `events_statements_history_long` table. This step is similar to running `SHOW PROFILES` to identify the `Query_ID`. The following query produces output similar to `SHOW PROFILES`:

   ```sql
   mysql> SELECT EVENT_ID, TRUNCATE(TIMER_WAIT/1000000000000,6) as Duration, SQL_TEXT
          FROM performance_schema.events_statements_history_long WHERE SQL_TEXT like '%10001%';
   +----------+----------+--------------------------------------------------------+
   | event_id | duration | sql_text                                               |
   +----------+----------+--------------------------------------------------------+
   |       31 | 0.028310 | SELECT * FROM employees.employees WHERE emp_no = 10001 |
   +----------+----------+--------------------------------------------------------+
   ```

6. Query the `events_stages_history_long` table to retrieve the statement's stage events. Stages are linked to statements using event nesting. Each stage event record has a `NESTING_EVENT_ID` column that contains the `EVENT_ID` of the parent statement.

   ```sql
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
