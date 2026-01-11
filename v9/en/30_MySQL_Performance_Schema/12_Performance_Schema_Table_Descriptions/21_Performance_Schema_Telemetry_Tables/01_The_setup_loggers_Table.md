#### 29.12.21.1 The setup\_loggers Table

The `setup_loggers` table lists the registered loggers:

```
mysql>  select * from performance_schema.setup_loggers;
+------------------------+-------+--------------------+
| NAME                   | LEVEL | DESCRIPTION        |
+------------------------+-------+--------------------+
| logger/error/error_log | info  | MySQL error logger |
+------------------------+-------+--------------------+
```

* `NAME`: The name of the logger.
* `LEVEL`: The log level. This can be set to one of the following values:

  + `none`
  + `error`
  + `warn`
  + `info`
  + `debug`
* `DESCRIPTION`: A text description of the logger.
