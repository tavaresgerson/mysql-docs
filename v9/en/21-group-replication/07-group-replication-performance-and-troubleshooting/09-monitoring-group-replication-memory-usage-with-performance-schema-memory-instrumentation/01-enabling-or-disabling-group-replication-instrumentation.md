#### 20.7.9.1 Enabling or Disabling Group Replication Instrumentation

To enable all the Group Replication instrumentation from the command line, run the following in the SQL client of your choice:

```
        UPDATE performance_schema.setup_instruments SET ENABLED = 'YES'
        WHERE NAME LIKE 'memory/group_rpl/%';
```

To disable all the Group Replication instrumentation from the command line, run the following in the SQL client of your choice:

```
        UPDATE performance_schema.setup_instruments SET ENABLED = 'NO'
        WHERE NAME LIKE 'memory/group_rpl/%';
```

To enable all the Group Replication instrumentation at server startup, add the following to your option file:

```
        [mysqld]
        performance-schema-instrument='memory/group_rpl/%=ON'
```

To disable all the Group Replication instrumentation at server startup, add the following to your option file:

```
        [mysqld]
        performance-schema-instrument='memory/group_rpl/%=OFF'
```

To enable or disable individual instruments in that group, replace the wildcard (%) with the full name of the instrument.

For more information, see Section 29.3, “Performance Schema Startup Configuration” and Section 29.4, “Performance Schema Runtime Configuration”.
