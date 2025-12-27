#### 6.5.8.2 Consultas de diagnóstico

Esta seção lista as consultas de diagnóstico executadas pelo **mysqldm**. Existem dois conjuntos de consultas, um executado uma vez no início do diagnóstico e outro executado iterativamente para o número definido de iterações e o atraso definido entre cada iteração.

As seguintes listas as consultas executadas uma vez quando o **mysqldm** inicia e os nomes dos arquivos onde seus resultados são escritos:

* ``` SELECT NOW()
  ```

  `mysqldm_start_time.json`
* ```
  SHOW GLOBAL VARIABLES
  ```

  `show_global_variables.json`

* ``` SELECT * FROM PERFORMANCE_SCHEMA.ERROR_LOG
  ```

  `error_log.json`
* ```
  SELECT * FROM PERFORMANCE_SCHEMA.HOST_CACHE
  ```

  `host_cache.json`

* ``` SELECT * FROM PERFORMANCE_SCHEMA.PERSISTED_VARIABLES
  ```

  `persisted_variables.json`
* ```
  SELECT * FROM PERFORMANCE_SCHEMA.REPLICATION_APPLIER_CONFIGURATION
  ```

  `replication_applier_configuration.json`

* ``` SELECT * FROM PERFORMANCE_SCHEMA.REPLICATION_APPLIER_FILTERS
  ```

  `replication_applier_filters.json`
* ```
  SELECT * FROM PERFORMANCE_SCHEMA.REPLICATION_APPLIER_GLOBAL_FILTERS
  ```

  `replication_applier_global_filters.json`

* ``` SELECT * FROM PERFORMANCE_SCHEMA.REPLICATION_APPLIER_STATUS
  ```

  `replication_applier_status.json`
* ```
  SELECT * FROM PERFORMANCE_SCHEMA.REPLICATION_APPLIER_STATUS_BY_COORDINATOR
  ```

  `replication_applier_status_by_coordinator,json`

* ``` SELECT * FROM PERFORMANCE_SCHEMA.REPLICATION_APPLIER_STATUS_BY_WORKER
  ```

  `replication_applier_status_by_worker.json`
* ```
  SELECT * FROM PERFORMANCE_SCHEMA.REPLICATION_ASYNCHRONOUS_CONNECTION_FAILOVER
  ```

  `replication_asynchronous_connection_failover.json`

* ``` SELECT * FROM PERFORMANCE_SCHEMA.REPLICATION_ASYNCHRONOUS_CONNECTION_FAILOVER_MANAGED
  ```

  `replication_asynchronous_connection_failover_managed.json`
* ```
  SELECT * FROM PERFORMANCE_SCHEMA.REPLICATION_CONNECTION_CONFIGURATION
  ```

  `replication_connection_configuration.json`

* ``` SELECT * FROM PERFORMANCE_SCHEMA.REPLICATION_CONNECTION_STATUS
  ```

  `replication_connection_status.json`
* ```
  SELECT * FROM PERFORMANCE_SCHEMA.REPLICATION_GROUP_MEMBER_STATS
  ```

  `replication_group_member_stats.json`

* ``` SELECT * FROM PERFORMANCE_SCHEMA.REPLICATION_GROUP_MEMBERS
  ```

  `replication_group_members.json`
* ```
  select engine from information_schema.engines where support<>'NO'
  ```

  `available_storage_engines.json`

* ``` SELECT g.variable_name name, g.variable_value value, i.variable_source source FROM performance_schema.global_variables g JOIN performance_schema.variables_info i ON g.variable_name=i.variable_name ORDER BY name
  ```

  `global_variables_details.json`
* ```
  XA RECOVER CONVERT XID
  ```

  `xa_recover.json`

* ``` SHOW ENGINE PERFORMANCE_SCHEMA STATUS
  ```

  `show_engine_performance_schema_status.json`
* ```
  SELECT * FROM PERFORMANCE_SCHEMA.SETUP_ACTORS
  ```

  `performance_schema_setup_actors.json`

* ``` SELECT * FROM PERFORMANCE_SCHEMA.SETUP_OBJECTS
  ```

  `performance_schema_setup_objects.json`

`performance_schema_setup_consumers.json`

* ```
  SELECT NAME AS CONSUMER, ENABLED, SYS.PS_IS_CONSUMER_ENABLED(NAME)
              AS COLLECTS FROM PERFORMANCE_SCHEMA.SETUP_CONSUMERS
  ```

  `performance_schema_setup_instruments_enabled_pct.json`
* ``` SELECT SUBSTRING_INDEX(NAME, '/', 2) AS 'InstrumentClass', ROUND(100*SUM(IF(ENABLED = 'YES', 1, 0))/COUNT(*), 2) AS 'EnabledPct', ROUND(100*SUM(IF(TIMED = 'YES', 1, 0))/COUNT(*), 2) AS 'TimedPct' FROM PERFORMANCE_SCHEMA.SETUP_INSTRUMENTS GROUP BY SUBSTRING_INDEX(NAME, '/', 2) ORDER BY SUBSTRING_INDEX(NAME, '/', 2)
  ```

  `performance_schema_thread_instrumented_pct.json`

* ```
  SELECT
              `TYPE` AS ThreadType,
              COUNT(*) AS 'Total',
              ROUND(100*SUM(IF(INSTRUMENTED = 'YES', 1, 0))
              /COUNT(*), 2) AS 'InstrumentedPct'
              FROM PERFORMANCE_SCHEMA.THREADS GROUP BY TYPE
  ```

  `"instance_summary.json"
* ``` SELECT @@GLOBAL.HOSTNAME AS `HOSTNAME`, @@GLOBAL.PORT AS `PORT`, @@GLOBAL.REPORT_HOST AS `REPORT HOST`, @@GLOBAL.REPORT_PORT AS `REPORT PORT`, @@GLOBAL.SOCKET AS `SOCKET`, @@GLOBAL.DATADIR AS `DATADIR`, @@GLOBAL.SERVER_UUID AS `SERVER UUID`, @@GLOBAL.SERVER_ID AS `SERVER_ID`, VERSION() AS `MYSQL VERSION`, (SELECT SYS_VERSION FROM SYS.VERSION) AS `SYS SCHEMA VERSION`, @@GLOBAL.VERSION_COMMENT AS `VERSION COMMENT`, @@GLOBAL.VERSION_COMPILE_OS AS `VERSION COMPILE OS`, @@GLOBAL.VERSION_COMPILE_MACHINE AS `VERSION COMPILE MACHINE`, UTC_TIMESTAMP() AS `UTC TIME`, NOW() AS `LOCAL TIME`, @@TIME_ZONE AS `TIME ZONE`, @@SYSTEM_TIME_ZONE AS `SYSTEM TIME ZONE`, CAST(TIMEDIFF(NOW(), UTC_TIMESTAMP()) AS CHAR) AS `TIME ZONE OFFSET`)
  ```

  `engine_support.json`

* ```
  SELECT ENGINE FROM INFORMATION_SCHEMA.ENGINES WHERE SUPPORT<>'NO'
  ```

  `engine_summary.json`
* ``` SELECT IFNULL((SELECT SUPPORT FROM INFORMATION_SCHEMA.ENGINES WHERE ENGINE = 'INNODB'), 'NO') AS HAS_INNODB, IFNULL((SELECT SUPPORT FROM INFORMATION_SCHEMA.ENGINES WHERE ENGINE = 'NDBCLUSTER'), 'NO') AS HAS_NDBCLUSTER, IFNULL((SELECT SUPPORT FROM INFORMATION_SCHEMA.ENGINES WHERE ENGINE = 'PERFORMANCE_SCHEMA'), 'NO') AS HAS_PERFORMANCE_SCHEMA, IFNULL((SELECT SUPPORT FROM INFORMATION_SCHEMA.ENGINES WHERE ENGINE = 'PERFORMANCE_SCHEMA'), 'NO') AS HAS_P_S_REPLICATION, IF((SELECT COUNT(*) FROM PERFORMANCE_SCHEMA.REPLICATION_CONNECTION_STATUS) > 0, 'YES', 'NO') AS 'HAS_REPLICATION'
  ```

  `engine_table_usage_summary.json`

* ```
  SELECT ENGINE, COUNT(*) AS NUM_TABLES,
              format_bytes(SUM(DATA_LENGTH)) AS DATA_LENGTH,
              format_bytes(SUM(INDEX_LENGTH)) AS INDEX_LENGTH,
              format_bytes(SUM(DATA_LENGTH+INDEX_LENGTH)) AS TOTAL
              FROM information_schema.TABLES
              WHERE ENGINE IS NOT NULL AND TABLE_SCHEMA NOT IN
              ('performance_schema', 'sys', 'mysql', 'information_schema')
              GROUP BY ENGINE
  ```

  `sys_schema_object_overview.json`
* ``` SELECT * FROM SYS.SCHEMA_OBJECT_OVERVIEW
  ```

  `sys_host_summary.json`

* ```
  SELECT * FROM SYS.HOST_SUMMARY
  ```

  `table_count.json`
* ``` SELECT TABLE_SCHEMA, COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA NOT IN ('PERFORMANCE_SCHEMA', 'SYS', 'MYSQL', 'INFORMATION_SCHEMA')) GROUP BY TABLE_SCHEMA
  ```

  `routine_count.json`

* ```
  SELECT ROUTINE_TYPE, COUNT(*),SUM(LENGTH(ROUTINE_DEFINITION))
      FROM INFORMATION_SCHEMA.ROUTINES
      WHERE ROUTINE_SCHEMA NOT IN ('PERFORMANCE_SCHEMA', 'SYS', 'MYSQL', 'INFORMATION_SCHEMA')
      GROUP BY ROUTINE_TYPE, ROUTINE_SCHEMA
  ```

  `sys_unused_indexes.json`

As seguintes listas contêm as consultas iterativas e os nomes dos arquivos onde seus resultados são escritos, onde *`N`*
é o número da iteração:

* ``` SELECT * FROM SYS.SCHEMA_UNUSED_INDEXES WHERE OBJECT_SCHEMA NOT IN ('PERFORMANCE_SCHEMA', 'SYS', 'MYSQL', 'INFORMATION_SCHEMA')
  ```

  `nowN.json`

* ```
  SELECT NOW()
  ```

  `show_global_statusN.json`
* ``` SHOW GLOBAL STATUS
  ```

  `sys_metricsN.json`

* ```
  SELECT * FROM sys.metrics
  ```

  `show_engine_innodb_statusN.json`
* ``` SHOW ENGINE INNODB STATUS
  ```

  `show_full_processlistN.json`

* ```
  SHOW FULL PROCESSLIST
  ```

  `show_open_tablesN.json`
* ``` SHOW OPEN TABLES
  ```

  `show_binary_log_statusN.json`

* ```
  SHOW BINARY LOG STATUS
  ```

  `show_binary_logsN.json`
* ``` SHOW BINARY LOGS
  ```

  `show_replicasN.json`

* ```
  SHOW REPLICAS
  ```

  `show_replica_statusN.json`
* ``` SHOW REPLICA STATUS
  ```

  `mysql_slave_master_infoN.json`

* ```
  SELECT * FROM mysql.slave_master_info ORDER BY Channel_name
  ```

  `mysql_slave_relay_log_infoN.json`
* ``` SELECT Channel_name, Sql_delay, Number_of_workers, Id FROM mysql.slave_relay_log_info ORDER BY Channel_name
  ```

  `metadata_locksN.json`

* ```
  SELECT * FROM performance_schema.metadata_locks
  ```

  `threadsN.json`
* ``` SELECT * FROM performance_schema.threads
  ```

  `schema_lock_waitsN.json`

* ```
  SELECT * FROM sys.schema_table_lock_waits
  ```

  `session_ssl_statusN.json`
* ``` SELECT * FROM sys.session_ssl_status
  ```

  `sys_sessionN.json`

* ```
  SELECT * FROM sys.session
  ```

  `sys_processlistN.json`
* ``` SELECT * FROM sys.processlist
  ```

  `ps_event_waits_currentN.json`

* ```
  SELECT * FROM performance_schema.events_waits_current
  ```

  `innodb_trxN.json`
* ``` SELECT * FROM information_schema.innodb_trx
  ```

  `innodb_metricsN.json`

* ```
  SELECT * FROM information_schema.innodb_metrics
  ```

`innodb_lock_waitsN.json`
* ``` SELECT * FROM sys.innodb_lock_waits
  ```

`memory_globalN.json`

* ```
  SELECT * FROM sys.memory_global_by_current_bytes
  ```

`memory_by_threadN.json`
* ``` SELECT * FROM sys.memory_by_thread_by_current_bytes
  ```

`memory_by_hostN.json`

* ```
  SELECT * FROM sys.memory_by_host_by_current_bytes
  ```

`memory_by_userN.json`
* ``` SELECT * FROM sys.memory_by_user_by_current_bytes
  ```

`events_statements_summary_global_by_event_nameN.json`