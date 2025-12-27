#### 29.12.21.3 A tabela `setup_metrics`

A tabela `setup_metrics` lista as métricas disponíveis:

```
mysql> select * from performance_schema.setup_metrics\G
*************************** 34. row ***************************
       NAME: undo_tablespaces_active
      METER: mysql.inno
METRIC_TYPE: ASYNC GAUGE COUNTER
   NUM_TYPE: INTEGER
       UNIT:
DESCRIPTION: Number of active undo tablespaces, including implicit and explicit tablespaces (innodb_undo_tablespaces_active)

...
*************************** 48. row ***************************
       NAME: wait_free
      METER: mysql.inno.buffer_pool
METRIC_TYPE: ASYNC COUNTER
   NUM_TYPE: INTEGER
       UNIT:
DESCRIPTION: Number of times waited for free buffer (innodb_buffer_pool_wait_free)

...
*************************** 55. row ***************************
       NAME: reads
      METER: mysql.inno.data
METRIC_TYPE: ASYNC COUNTER
   NUM_TYPE: INTEGER
       UNIT:
DESCRIPTION: Number of reads initiated (innodb_data_reads)

...
*************************** 101. row ***************************
       NAME: ssl_finished_accepts
      METER: mysql.x
METRIC_TYPE: ASYNC COUNTER
   NUM_TYPE: INTEGER
       UNIT:
DESCRIPTION: The number of successful SSL connections to the server (Mysqlx_ssl_finished_accepts)
...
*************************** 115. row ***************************
       NAME: list_clients
      METER: mysql.x.stmt
METRIC_TYPE: ASYNC COUNTER
   NUM_TYPE: INTEGER
       UNIT:
DESCRIPTION: The number of list client statements received (Mysqlx_stmt_list_clients)
...
*************************** 162. row ***************************
       NAME: slow_queries
      METER: mysql.stats
METRIC_TYPE: ASYNC COUNTER
   NUM_TYPE: INTEGER
       UNIT:
DESCRIPTION: The number of queries that have taken more than long_query_time seconds (Slow_queries)

...
*************************** 346. row ***************************
       NAME: stmt_reprepare
      METER: mysql.stats.com
METRIC_TYPE: ASYNC COUNTER
   NUM_TYPE: INTEGER
       UNIT:
DESCRIPTION: Number of times corresponding command statement has been executed.

...
*************************** 353. row ***************************
       NAME: errors_tcpwrap
      METER: mysql.stats.connection
METRIC_TYPE: ASYNC COUNTER
   NUM_TYPE: INTEGER
       UNIT:
DESCRIPTION: The number of connections refused by the libwrap library (Connection_errors_tcpwrap)

...
*************************** 370. row ***************************
       NAME: update
      METER: mysql.stats.handler
METRIC_TYPE: ASYNC COUNTER
   NUM_TYPE: INTEGER
       UNIT:
DESCRIPTION: The number of requests to update a row in a table (Handler_update)

...
*************************** 384. row ***************************
       NAME: callback_cache_hits
      METER: mysql.stats.ssl
METRIC_TYPE: ASYNC COUNTER
   NUM_TYPE: INTEGER
       UNIT:
DESCRIPTION: The number of accepted SSL connections (Ssl_callback_cache_hits)

...
*************************** 391. row ***************************
       NAME: key_writes
      METER: mysql.myisam
METRIC_TYPE: ASYNC COUNTER
   NUM_TYPE: INTEGER
       UNIT:
DESCRIPTION: The number of physical writes of a key block from the MyISAM key cache to disk (Key_writes)
...
*************************** 424. row ***************************
       NAME: users_lost
      METER: mysql.perf_schema
METRIC_TYPE: ASYNC COUNTER
   NUM_TYPE: INTEGER
       UNIT:
DESCRIPTION: The number of times a row could not be added to the users table because it was full (Performance_schema_users_lost)
```

A tabela `setup_metrics` possui as seguintes colunas:

* `NAME`: Nome da métrica.
* `METER`: Nome do grupo de medidores da métrica.

* `METRIC_TYPE`: O tipo de métrica OpenTelemetry.

* `NUM_TYPE`: O tipo numérico. `INTEGER` ou `DOUBLE`.

* `DESCRIPTION`: Uma string que descreve o propósito da métrica.