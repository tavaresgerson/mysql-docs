#### 29.12.22.1 The component_scheduler_tasks Table

The `component_scheduler_tasks` table contains a row for each scheduled task. Each row contains information about the ongoing progress of a task that applications, components, and plugins can implement, optionally, using the `scheduler` component (see Section 7.5.5, “Scheduler Component”). For example, the `audit_log` server plugin utilizes the `scheduler` component to run a regular, recurring flush of its memory cache:

```
mysql> select * from performance_schema.component_scheduler_tasks\G
*************************** 1. row ***************************
            NAME: plugin_audit_log_flush_scheduler
          STATUS: WAITING
         COMMENT: Registered by the audit log plugin. Does a periodic refresh of the audit log
                  in-memory rules cache by calling audit_log_flush
INTERVAL_SECONDS: 100
       TIMES_RUN: 5
    TIMES_FAILED: 0
1 row in set (0.02 sec)
```

The `component_scheduler_tasks` table has the following columns:

* `NAME`

  The name supplied during the registration.

* `STATUS`

  The values are:

  + `RUNNING` if the task is active and being executed.

  + `WAITING` if the task is idle and waiting for the background thread to pick it up or waiting for the next time it needs to be run to arrive.

* `COMMENT`

  A compile-time comment provided by an application, component, or plugin. In the previous example, MySQL Enterprise Audit provides the comment using a server plugin named `audit_log`.

* `INTERVAL_SECONDS`

  The time in seconds to run a task, which an application, component, or plugin provides. MySQL Enterprise Audit enables you to specify this value using the `audit_log_flush_interval_seconds` system variable.

* `TIMES_RUN`

  A counter that increments by one every time the task runs successfully. It wraps around.

* `TIMES_FAILED`

  A counter that increments by one every time the execution of the task fails. It wraps around.
