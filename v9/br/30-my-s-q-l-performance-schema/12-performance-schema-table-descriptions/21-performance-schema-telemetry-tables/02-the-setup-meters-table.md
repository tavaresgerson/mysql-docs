#### 29.12.21.2 Tabela `setup_meters`

A tabela `setup_meters` lista os medidores registrados:

```
mysql> select * from performance_schema.setup_meters;
+------------------------+-----------+---------+-------------------------------------------+
| NAME                   | FREQUENCY | ENABLED | DESCRIPTION                               |
+------------------------+-----------+---------+-------------------------------------------+
| mysql.inno             |        10 | YES     | MySql InnoDB metrics                      |
| mysql.inno.buffer_pool |        10 | YES     | MySql InnoDB buffer pool metrics          |
| mysql.inno.data        |        10 | YES     | MySql InnoDB data metrics                 |
| mysql.x                |        10 | YES     | MySql X plugin metrics                    |
| mysql.x.stmt           |        10 | YES     | MySql X plugin statement statistics       |
| mysql.stats            |        10 | YES     | MySql core metrics                        |
| mysql.stats.com        |        10 | YES     | MySql command stats                       |
| mysql.stats.connection |        10 | YES     | MySql connection stats                    |
| mysql.stats.handler    |        10 | YES     | MySql handler stats                       |
| mysql.stats.ssl        |        10 | YES     | MySql TLS related stats                   |
| mysql.myisam           |        10 | YES     | MySql MyISAM storage engine stats         |
| mysql.perf_schema      |        10 | YES     | MySql performance_schema lost instruments |
+------------------------+-----------+---------+-------------------------------------------+
```

* `NAME`: Nome do medidor.
* `FREQUENCY`: Frequência em segundos de exportação métrica. O padrão é a cada 10 segundos. Esse valor pode ser editado para medidores registrados.

* `ENABLED`: Se o medidor está habilitado. O valor é SIM ou NÃO. Um medidor desabilitado não exporta métricas. Essa coluna pode ser modificada

* `DESCRIPTION`: Uma string que descreve o medidor.

`FREQUENCY` e `ENABLED` podem ser editados.