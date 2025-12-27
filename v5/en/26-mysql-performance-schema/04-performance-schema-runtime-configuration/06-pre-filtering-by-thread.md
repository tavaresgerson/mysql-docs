### 25.4.6 Pre-Filtering by Thread

The [`threads`](performance-schema-threads-table.html "25.12.16.4 The threads Table") table contains a row for each server thread. Each row contains information about a thread and indicates whether monitoring is enabled for it. For the Performance Schema to monitor a thread, these things must be true:

* The `thread_instrumentation` consumer in the [`setup_consumers`](performance-schema-setup-consumers-table.html "25.12.2.2 The setup_consumers Table") table must be `YES`.

* The `threads.INSTRUMENTED` column must be `YES`.

* Monitoring occurs only for those thread events produced from instruments that are enabled in the [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table") table.

The [`threads`](performance-schema-threads-table.html "25.12.16.4 The threads Table") table also indicates for each server thread whether to perform historical event logging. This includes wait, stage, statement, and transaction events and affects logging to these tables:

```sql
events_waits_history
events_waits_history_long
events_stages_history
events_stages_history_long
events_statements_history
events_statements_history_long
events_transactions_history
events_transactions_history_long
```

For historical event logging to occur, these things must be true:

* The appropriate history-related consumers in the [`setup_consumers`](performance-schema-setup-consumers-table.html "25.12.2.2 The setup_consumers Table") table must be enabled. For example, wait event logging in the [`events_waits_history`](performance-schema-events-waits-history-table.html "25.12.4.2 The events_waits_history Table") and [`events_waits_history_long`](performance-schema-events-waits-history-long-table.html "25.12.4.3 The events_waits_history_long Table") tables requires the corresponding `events_waits_history` and `events_waits_history_long` consumers to be `YES`.

* The `threads.HISTORY` column must be `YES`.

* Logging occurs only for those thread events produced from instruments that are enabled in the [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table") table.

For foreground threads (resulting from client connections), the initial values of the `INSTRUMENTED` and `HISTORY` columns in [`threads`](performance-schema-threads-table.html "25.12.16.4 The threads Table") table rows are determined by whether the user account associated with a thread matches any row in the [`setup_actors`](performance-schema-setup-actors-table.html "25.12.2.1 The setup_actors Table") table. The values come from the `ENABLED` and `HISTORY` columns of the matching [`setup_actors`](performance-schema-setup-actors-table.html "25.12.2.1 The setup_actors Table") table row.

For background threads, there is no associated user. `INSTRUMENTED` and `HISTORY` are `YES` by default and [`setup_actors`](performance-schema-setup-actors-table.html "25.12.2.1 The setup_actors Table") is not consulted.

The initial [`setup_actors`](performance-schema-setup-actors-table.html "25.12.2.1 The setup_actors Table") contents look like this:

```sql
mysql> SELECT * FROM performance_schema.setup_actors;
+------+------+------+---------+---------+
| HOST | USER | ROLE | ENABLED | HISTORY |
+------+------+------+---------+---------+
| %    | %    | %    | YES     | YES     |
+------+------+------+---------+---------+
```

The `HOST` and `USER` columns should contain a literal host or user name, or `'%'` to match any name.

The `ENABLED` and `HISTORY` columns indicate whether to enable instrumentation and historical event logging for matching threads, subject to the other conditions described previously.

When the Performance Schema checks for a match for each new foreground thread in `setup_actors`, it tries to find more specific matches first, using the `USER` and `HOST` columns (`ROLE` is unused):

* Rows with `USER='literal'` and `HOST='literal'`.

* Rows with `USER='literal'` and `HOST='%'`.

* Rows with `USER='%'` and `HOST='literal'`.

* Rows with `USER='%'` and `HOST='%'`.

The order in which matching occurs matters because different matching [`setup_actors`](performance-schema-setup-actors-table.html "25.12.2.1 The setup_actors Table") rows can have different `USER` and `HOST` values. This enables instrumenting and historical event logging to be applied selectively per host, user, or account (user and host combination), based on the `ENABLED` and `HISTORY` column values:

* When the best match is a row with `ENABLED=YES`, the `INSTRUMENTED` value for the thread becomes `YES`. When the best match is a row with `HISTORY=YES`, the `HISTORY` value for the thread becomes `YES`.

* When the best match is a row with `ENABLED=NO`, the `INSTRUMENTED` value for the thread becomes `NO`. When the best match is a row with `HISTORY=NO`, the `HISTORY` value for the thread becomes `NO`.

* When no match is found, the `INSTRUMENTED` and `HISTORY` values for the thread become `NO`.

The `ENABLED` and `HISTORY` columns in [`setup_actors`](performance-schema-setup-actors-table.html "25.12.2.1 The setup_actors Table") rows can be set to `YES` or `NO` independent of one another. This means you can enable instrumentation separately from whether you collect historical events.

By default, monitoring and historical event collection are enabled for all new foreground threads because the [`setup_actors`](performance-schema-setup-actors-table.html "25.12.2.1 The setup_actors Table") table initially contains a row with `'%'` for both `HOST` and `USER`. To perform more limited matching such as to enable monitoring only for some foreground threads, you must change this row because it matches any connection, and add rows for more specific `HOST`/`USER` combinations.

Suppose that you modify [`setup_actors`](performance-schema-setup-actors-table.html "25.12.2.1 The setup_actors Table") as follows:

```sql
UPDATE performance_schema.setup_actors
SET ENABLED = 'NO', HISTORY = 'NO'
WHERE HOST = '%' AND USER = '%';
INSERT INTO performance_schema.setup_actors
(HOST,USER,ROLE,ENABLED,HISTORY)
VALUES('localhost','joe','%','YES','YES');
INSERT INTO performance_schema.setup_actors
(HOST,USER,ROLE,ENABLED,HISTORY)
VALUES('hosta.example.com','joe','%','YES','NO');
INSERT INTO performance_schema.setup_actors
(HOST,USER,ROLE,ENABLED,HISTORY)
VALUES('%','sam','%','NO','YES');
```

The [`UPDATE`](update.html "13.2.11 UPDATE Statement") statement changes the default match to disable instrumentation and historical event collection. The [`INSERT`](insert.html "13.2.5 INSERT Statement") statements add rows for more specific matches.

Now the Performance Schema determines how to set the `INSTRUMENTED` and `HISTORY` values for new connection threads as follows:

* If `joe` connects from the local host, the connection matches the first inserted row. The `INSTRUMENTED` and `HISTORY` values for the thread become `YES`.

* If `joe` connects from `hosta.example.com`, the connection matches the second inserted row. The `INSTRUMENTED` value for the thread becomes `YES` and the `HISTORY` value becomes `NO`.

* If `joe` connects from any other host, there is no match. The `INSTRUMENTED` and `HISTORY` values for the thread become `NO`.

* If `sam` connects from any host, the connection matches the third inserted row. The `INSTRUMENTED` value for the thread becomes `NO` and the `HISTORY` value becomes `YES`.

* For any other connection, the row with `HOST` and `USER` set to `'%'` matches. This row now has `ENABLED` and `HISTORY` set to `NO`, so the `INSTRUMENTED` and `HISTORY` values for the thread become `NO`.

Modifications to the [`setup_actors`](performance-schema-setup-actors-table.html "25.12.2.1 The setup_actors Table") table affect only foreground threads created subsequent to the modification, not existing threads. To affect existing threads, modify the `INSTRUMENTED` and `HISTORY` columns of [`threads`](performance-schema-threads-table.html "25.12.16.4 The threads Table") table rows.
