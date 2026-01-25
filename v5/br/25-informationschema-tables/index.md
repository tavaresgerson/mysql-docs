# Capítulo 24 Tabelas INFORMATION_SCHEMA

**Sumário**

[24.1 Introdução](information-schema-introduction.html)

[24.2 Referência de Tabelas INFORMATION_SCHEMA](information-schema-table-reference.html)

[24.3 Tabelas Gerais INFORMATION_SCHEMA](general-information-schema-tables.html) :   [24.3.1 Referência de Tabelas Gerais INFORMATION_SCHEMA](information-schema-general-table-reference.html)

    [24.3.2 A Tabela INFORMATION_SCHEMA CHARACTER_SETS](information-schema-character-sets-table.html)

    [24.3.3 A Tabela INFORMATION_SCHEMA COLLATIONS](information-schema-collations-table.html)

    [24.3.4 A Tabela INFORMATION_SCHEMA COLLATION_CHARACTER_SET_APPLICABILITY](information-schema-collation-character-set-applicability-table.html)

    [24.3.5 A Tabela INFORMATION_SCHEMA COLUMNS](information-schema-columns-table.html)

    [24.3.6 A Tabela INFORMATION_SCHEMA COLUMN_PRIVILEGES](information-schema-column-privileges-table.html)

    [24.3.7 A Tabela INFORMATION_SCHEMA ENGINES](information-schema-engines-table.html)

    [24.3.8 A Tabela INFORMATION_SCHEMA EVENTS](information-schema-events-table.html)

    [24.3.9 A Tabela INFORMATION_SCHEMA FILES](information-schema-files-table.html)

    [24.3.10 As Tabelas INFORMATION_SCHEMA GLOBAL_STATUS e SESSION_STATUS](information-schema-status-table.html)

    [24.3.11 As Tabelas INFORMATION_SCHEMA GLOBAL_VARIABLES e SESSION_VARIABLES](information-schema-variables-table.html)

    [24.3.12 A Tabela INFORMATION_SCHEMA KEY_COLUMN_USAGE](information-schema-key-column-usage-table.html)

    [24.3.13 A Tabela INFORMATION_SCHEMA ndb_transid_mysql_connection_map](information-schema-ndb-transid-mysql-connection-map-table.html)

    [24.3.14 A Tabela INFORMATION_SCHEMA OPTIMIZER_TRACE](information-schema-optimizer-trace-table.html)

    [24.3.15 A Tabela INFORMATION_SCHEMA PARAMETERS](information-schema-parameters-table.html)

    [24.3.16 A Tabela INFORMATION_SCHEMA PARTITIONS](information-schema-partitions-table.html)

    [24.3.17 A Tabela INFORMATION_SCHEMA PLUGINS](information-schema-plugins-table.html)

    [24.3.18 A Tabela INFORMATION_SCHEMA PROCESSLIST](information-schema-processlist-table.html)

    [24.3.19 A Tabela INFORMATION_SCHEMA PROFILING](information-schema-profiling-table.html)

    [24.3.20 A Tabela INFORMATION_SCHEMA REFERENTIAL_CONSTRAINTS](information-schema-referential-constraints-table.html)

    [24.3.21 A Tabela INFORMATION_SCHEMA ROUTINES](information-schema-routines-table.html)

    [24.3.22 A Tabela INFORMATION_SCHEMA SCHEMATA](information-schema-schemata-table.html)

    [24.3.23 A Tabela INFORMATION_SCHEMA SCHEMA_PRIVILEGES](information-schema-schema-privileges-table.html)

    [24.3.24 A Tabela INFORMATION_SCHEMA STATISTICS](information-schema-statistics-table.html)

    [24.3.25 A Tabela INFORMATION_SCHEMA TABLES](information-schema-tables-table.html)

    [24.3.26 A Tabela INFORMATION_SCHEMA TABLESPACES](information-schema-tablespaces-table.html)

    [24.3.27 A Tabela INFORMATION_SCHEMA TABLE_CONSTRAINTS](information-schema-table-constraints-table.html)

    [24.3.28 A Tabela INFORMATION_SCHEMA TABLE_PRIVILEGES](information-schema-table-privileges-table.html)

    [24.3.29 A Tabela INFORMATION_SCHEMA TRIGGERS](information-schema-triggers-table.html)

    [24.3.30 A Tabela INFORMATION_SCHEMA USER_PRIVILEGES](information-schema-user-privileges-table.html)

    [24.3.31 A Tabela INFORMATION_SCHEMA VIEWS](information-schema-views-table.html)

[24.4 Tabelas INFORMATION_SCHEMA InnoDB](innodb-information-schema-tables.html) :   [24.4.1 Referência de Tabelas INFORMATION_SCHEMA InnoDB](information-schema-innodb-table-reference.html)

    [24.4.2 A Tabela INFORMATION_SCHEMA INNODB_BUFFER_PAGE](information-schema-innodb-buffer-page-table.html)

    [24.4.3 A Tabela INFORMATION_SCHEMA INNODB_BUFFER_PAGE_LRU](information-schema-innodb-buffer-page-lru-table.html)

    [24.4.4 A Tabela INFORMATION_SCHEMA INNODB_BUFFER_POOL_STATS](information-schema-innodb-buffer-pool-stats-table.html)

    [24.4.5 As Tabelas INFORMATION_SCHEMA INNODB_CMP e INNODB_CMP_RESET](information-schema-innodb-cmp-table.html)

    [24.4.6 As Tabelas INFORMATION_SCHEMA INNODB_CMPMEM e INNODB_CMPMEM_RESET](information-schema-innodb-cmpmem-table.html)

    [24.4.7 As Tabelas INFORMATION_SCHEMA INNODB_CMP_PER_INDEX e INNODB_CMP_PER_INDEX_RESET](information-schema-innodb-cmp-per-index-table.html)

    [24.4.8 A Tabela INFORMATION_SCHEMA INNODB_FT_BEING_DELETED](information-schema-innodb-ft-being-deleted-table.html)

    [24.4.9 A Tabela INFORMATION_SCHEMA INNODB_FT_CONFIG](information-schema-innodb-ft-config-table.html)

    [24.4.10 A Tabela INFORMATION_SCHEMA INNODB_FT_DEFAULT_STOPWORD](information-schema-innodb-ft-default-stopword-table.html)

    [24.4.11 A Tabela INFORMATION_SCHEMA INNODB_FT_DELETED](information-schema-innodb-ft-deleted-table.html)

    [24.4.12 A Tabela INFORMATION_SCHEMA INNODB_FT_INDEX_CACHE](information-schema-innodb-ft-index-cache-table.html)

    [24.4.13 A Tabela INFORMATION_SCHEMA INNODB_FT_INDEX_TABLE](information-schema-innodb-ft-index-table-table.html)

    [24.4.14 A Tabela INFORMATION_SCHEMA INNODB_LOCKS](information-schema-innodb-locks-table.html)

    [24.4.15 A Tabela INFORMATION_SCHEMA INNODB_LOCK_WAITS](information-schema-innodb-lock-waits-table.html)

    [24.4.16 A Tabela INFORMATION_SCHEMA INNODB_METRICS](information-schema-innodb-metrics-table.html)

    [24.4.17 A Tabela INFORMATION_SCHEMA INNODB_SYS_COLUMNS](information-schema-innodb-sys-columns-table.html)

    [24.4.18 A Tabela INFORMATION_SCHEMA INNODB_SYS_DATAFILES](information-schema-innodb-sys-datafiles-table.html)

    [24.4.19 A Tabela INFORMATION_SCHEMA INNODB_SYS_FIELDS](information-schema-innodb-sys-fields-table.html)

    [24.4.20 A Tabela INFORMATION_SCHEMA INNODB_SYS_FOREIGN](information-schema-innodb-sys-foreign-table.html)

    [24.4.21 A Tabela INFORMATION_SCHEMA INNODB_SYS_FOREIGN_COLS](information-schema-innodb-sys-foreign-cols-table.html)

    [24.4.22 A Tabela INFORMATION_SCHEMA INNODB_SYS_INDEXES](information-schema-innodb-sys-indexes-table.html)

    [24.4.23 A Tabela INFORMATION_SCHEMA INNODB_SYS_TABLES](information-schema-innodb-sys-tables-table.html)

    [24.4.24 A Tabela INFORMATION_SCHEMA INNODB_SYS_TABLESPACES](information-schema-innodb-sys-tablespaces-table.html)

    [24.4.25 A View INFORMATION_SCHEMA INNODB_SYS_TABLESTATS](information-schema-innodb-sys-tablestats-table.html)

    [24.4.26 A Tabela INFORMATION_SCHEMA INNODB_SYS_VIRTUAL](information-schema-innodb-sys-virtual-table.html)

    [24.4.27 A Tabela INFORMATION_SCHEMA INNODB_TEMP_TABLE_INFO](information-schema-innodb-temp-table-info-table.html)

    [24.4.28 A Tabela INFORMATION_SCHEMA INNODB_TRX](information-schema-innodb-trx-table.html)

[24.5 Tabelas INFORMATION_SCHEMA Thread Pool](thread-pool-information-schema-tables.html) :   [24.5.1 Referência de Tabelas INFORMATION_SCHEMA Thread Pool](information-schema-thread-pool-table-reference.html)

    [24.5.2 A Tabela INFORMATION_SCHEMA TP_THREAD_GROUP_STATE](information-schema-tp-thread-group-state-table.html)

    [24.5.3 A Tabela INFORMATION_SCHEMA TP_THREAD_GROUP_STATS](information-schema-tp-thread-group-stats-table.html)

    [24.5.4 A Tabela INFORMATION_SCHEMA TP_THREAD_STATE](information-schema-tp-thread-state-table.html)

[24.6 Tabelas INFORMATION_SCHEMA Connection Control](connection-control-information-schema-tables.html) :   [24.6.1 Referência de Tabelas INFORMATION_SCHEMA Connection Control](information-schema-connection-control-table-reference.html)

    [24.6.2 A Tabela INFORMATION_SCHEMA CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS](information-schema-connection-control-failed-login-attempts-table.html)

[24.7 Tabelas INFORMATION_SCHEMA MySQL Enterprise Firewall](firewall-information-schema-tables.html) :   [24.7.1 Referência de Tabelas INFORMATION_SCHEMA Firewall](information-schema-firewall-table-reference.html)

    [24.7.2 A Tabela INFORMATION_SCHEMA MYSQL_FIREWALL_USERS](information-schema-mysql-firewall-users-table.html)

    [24.7.3 A Tabela INFORMATION_SCHEMA MYSQL_FIREWALL_WHITELIST](information-schema-mysql-firewall-whitelist-table.html)

[24.8 Extensões para Comandos SHOW](extended-show.html)

O `INFORMATION_SCHEMA` fornece acesso a metadata de Database, informações sobre o servidor MySQL, como o nome de um Database ou tabela, o tipo de dado de uma coluna, ou privilégios de acesso. Outros termos que são por vezes usados para esta informação são *data dictionary* e *system catalog*.