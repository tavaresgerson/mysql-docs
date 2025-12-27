#### 29.12.21.1 Tabela `setup_loggers`

A tabela `setup_loggers` lista os registradores de log:

```
mysql>  select * from performance_schema.setup_loggers;
+------------------------+-------+--------------------+
| NAME                   | LEVEL | DESCRIPTION        |
+------------------------+-------+--------------------+
| logger/error/error_log | info  | MySQL error logger |
+------------------------+-------+--------------------+
```

* `NAME`: O nome do registrador de log.
* `LEVEL`: O nível de log. Pode ser definido para um dos seguintes valores:

  + `none`
  + `error`
  + `warn`
  + `info`
  + `debug`
* `DESCRIPTION`: Uma descrição textual do registrador de log.