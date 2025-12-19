### 35.4.2 Server Meters

The server metrics are organised in groups, called Meters.

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

`FREQUENCY` and `ENABLED` can be edited. For example, to update the frequency of the mysql.inno metrics:

```
       mysql>update performance_schema.setup_meters set FREQUENCY='30' where name = 'mysql.inno';
```

The maximum number of meter instruments which can be created is set by  `performance_schema_max_meter_classes`.


