## 29.4 Performance Schema Runtime Configuration

[29.4.1 Performance Schema Event Timing](performance-schema-timing.html)

[29.4.2 Performance Schema Event Filtering](performance-schema-filtering.html)

[29.4.3 Event Pre-Filtering](performance-schema-pre-filtering.html)

[29.4.4 Pre-Filtering by Instrument](performance-schema-instrument-filtering.html)

[29.4.5 Pre-Filtering by Object](performance-schema-object-filtering.html)

[29.4.6 Pre-Filtering by Thread](performance-schema-thread-filtering.html)

[29.4.7 Pre-Filtering by Consumer](performance-schema-consumer-filtering.html)

[29.4.8 Example Consumer Configurations](performance-schema-consumer-configurations.html)

[29.4.9 Naming Instruments or Consumers for Filtering Operations](performance-schema-filtering-names.html)

[29.4.10 Determining What Is Instrumented](performance-schema-instrumentation-checking.html)

Specific Performance Schema features can be enabled at runtime to
control which types of event collection occur.

Performance Schema setup tables contain information about
monitoring configuration:

```
mysql> SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
       WHERE TABLE_SCHEMA = 'performance_schema'
       AND TABLE_NAME LIKE 'setup%';
+-------------------+
| TABLE_NAME        |
+-------------------+
| setup_actors      |
| setup_consumers   |
| setup_instruments |
| setup_objects     |
| setup_threads     |
+-------------------+
```

You can examine the contents of these tables to obtain information
about Performance Schema monitoring characteristics. If you have
the [`UPDATE`](privileges-provided.html#priv_update) privilege, you can
change Performance Schema operation by modifying setup tables to
affect how monitoring occurs. For additional details about these
tables, see [Section 29.12.2, “Performance Schema Setup Tables”](performance-schema-setup-tables.html "29.12.2 Performance Schema Setup Tables").

The [`setup_instruments`](performance-schema-setup-instruments-table.html "29.12.2.3 The setup_instruments Table") and
[`setup_consumers`](performance-schema-setup-consumers-table.html "29.12.2.2 The setup_consumers Table") tables list the
instruments for which events can be collected and the types of
consumers for which event information actually is collected,
respectively. Other setup tables enable further modification of
the monitoring configuration.
[Section 29.4.2, “Performance Schema Event Filtering”](performance-schema-filtering.html "29.4.2 Performance Schema Event Filtering"), discusses how you
can modify these tables to affect event collection.

If there are Performance Schema configuration changes that must be
made at runtime using SQL statements and you would like these
changes to take effect each time the server starts, put the
statements in a file and start the server with the
[`init_file`](server-system-variables.html#sysvar_init_file) system variable set to
name the file. This strategy can also be useful if you have
multiple monitoring configurations, each tailored to produce a
different kind of monitoring, such as casual server health
monitoring, incident investigation, application behavior
troubleshooting, and so forth. Put the statements for each
monitoring configuration into their own file and specify the
appropriate file as the [`init_file`](server-system-variables.html#sysvar_init_file)
value when you start the server.