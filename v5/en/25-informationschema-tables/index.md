# Chapter 24 INFORMATION_SCHEMA Tables

**Table of Contents**

[24.1 Introduction](information-schema-introduction.html)

[24.2 INFORMATION_SCHEMA Table Reference](information-schema-table-reference.html)

[24.3 INFORMATION_SCHEMA General Tables](general-information-schema-tables.html) :   [24.3.1 INFORMATION_SCHEMA General Table Reference](information-schema-general-table-reference.html)

    [24.3.2 The INFORMATION_SCHEMA CHARACTER_SETS Table](information-schema-character-sets-table.html)

    [24.3.3 The INFORMATION_SCHEMA COLLATIONS Table](information-schema-collations-table.html)

    [24.3.4 The INFORMATION_SCHEMA COLLATION_CHARACTER_SET_APPLICABILITY Table](information-schema-collation-character-set-applicability-table.html)

    [24.3.5 The INFORMATION_SCHEMA COLUMNS Table](information-schema-columns-table.html)

    [24.3.6 The INFORMATION_SCHEMA COLUMN_PRIVILEGES Table](information-schema-column-privileges-table.html)

    [24.3.7 The INFORMATION_SCHEMA ENGINES Table](information-schema-engines-table.html)

    [24.3.8 The INFORMATION_SCHEMA EVENTS Table](information-schema-events-table.html)

    [24.3.9 The INFORMATION_SCHEMA FILES Table](information-schema-files-table.html)

    [24.3.10 The INFORMATION_SCHEMA GLOBAL_STATUS and SESSION_STATUS Tables](information-schema-status-table.html)

    [24.3.11 The INFORMATION_SCHEMA GLOBAL_VARIABLES and SESSION_VARIABLES Tables](information-schema-variables-table.html)

    [24.3.12 The INFORMATION_SCHEMA KEY_COLUMN_USAGE Table](information-schema-key-column-usage-table.html)

    [24.3.13 The INFORMATION_SCHEMA ndb_transid_mysql_connection_map Table](information-schema-ndb-transid-mysql-connection-map-table.html)

    [24.3.14 The INFORMATION_SCHEMA OPTIMIZER_TRACE Table](information-schema-optimizer-trace-table.html)

    [24.3.15 The INFORMATION_SCHEMA PARAMETERS Table](information-schema-parameters-table.html)

    [24.3.16 The INFORMATION_SCHEMA PARTITIONS Table](information-schema-partitions-table.html)

    [24.3.17 The INFORMATION_SCHEMA PLUGINS Table](information-schema-plugins-table.html)

    [24.3.18 The INFORMATION_SCHEMA PROCESSLIST Table](information-schema-processlist-table.html)

    [24.3.19 The INFORMATION_SCHEMA PROFILING Table](information-schema-profiling-table.html)

    [24.3.20 The INFORMATION_SCHEMA REFERENTIAL_CONSTRAINTS Table](information-schema-referential-constraints-table.html)

    [24.3.21 The INFORMATION_SCHEMA ROUTINES Table](information-schema-routines-table.html)

    [24.3.22 The INFORMATION_SCHEMA SCHEMATA Table](information-schema-schemata-table.html)

    [24.3.23 The INFORMATION_SCHEMA SCHEMA_PRIVILEGES Table](information-schema-schema-privileges-table.html)

    [24.3.24 The INFORMATION_SCHEMA STATISTICS Table](information-schema-statistics-table.html)

    [24.3.25 The INFORMATION_SCHEMA TABLES Table](information-schema-tables-table.html)

    [24.3.26 The INFORMATION_SCHEMA TABLESPACES Table](information-schema-tablespaces-table.html)

    [24.3.27 The INFORMATION_SCHEMA TABLE_CONSTRAINTS Table](information-schema-table-constraints-table.html)

    [24.3.28 The INFORMATION_SCHEMA TABLE_PRIVILEGES Table](information-schema-table-privileges-table.html)

    [24.3.29 The INFORMATION_SCHEMA TRIGGERS Table](information-schema-triggers-table.html)

    [24.3.30 The INFORMATION_SCHEMA USER_PRIVILEGES Table](information-schema-user-privileges-table.html)

    [24.3.31 The INFORMATION_SCHEMA VIEWS Table](information-schema-views-table.html)

[24.4 INFORMATION_SCHEMA InnoDB Tables](innodb-information-schema-tables.html) :   [24.4.1 INFORMATION_SCHEMA InnoDB Table Reference](information-schema-innodb-table-reference.html)

    [24.4.2 The INFORMATION_SCHEMA INNODB_BUFFER_PAGE Table](information-schema-innodb-buffer-page-table.html)

    [24.4.3 The INFORMATION_SCHEMA INNODB_BUFFER_PAGE_LRU Table](information-schema-innodb-buffer-page-lru-table.html)

    [24.4.4 The INFORMATION_SCHEMA INNODB_BUFFER_POOL_STATS Table](information-schema-innodb-buffer-pool-stats-table.html)

    [24.4.5 The INFORMATION_SCHEMA INNODB_CMP and INNODB_CMP_RESET Tables](information-schema-innodb-cmp-table.html)

    [24.4.6 The INFORMATION_SCHEMA INNODB_CMPMEM and INNODB_CMPMEM_RESET Tables](information-schema-innodb-cmpmem-table.html)

    [24.4.7 The INFORMATION_SCHEMA INNODB_CMP_PER_INDEX and INNODB_CMP_PER_INDEX_RESET Tables](information-schema-innodb-cmp-per-index-table.html)

    [24.4.8 The INFORMATION_SCHEMA INNODB_FT_BEING_DELETED Table](information-schema-innodb-ft-being-deleted-table.html)

    [24.4.9 The INFORMATION_SCHEMA INNODB_FT_CONFIG Table](information-schema-innodb-ft-config-table.html)

    [24.4.10 The INFORMATION_SCHEMA INNODB_FT_DEFAULT_STOPWORD Table](information-schema-innodb-ft-default-stopword-table.html)

    [24.4.11 The INFORMATION_SCHEMA INNODB_FT_DELETED Table](information-schema-innodb-ft-deleted-table.html)

    [24.4.12 The INFORMATION_SCHEMA INNODB_FT_INDEX_CACHE Table](information-schema-innodb-ft-index-cache-table.html)

    [24.4.13 The INFORMATION_SCHEMA INNODB_FT_INDEX_TABLE Table](information-schema-innodb-ft-index-table-table.html)

    [24.4.14 The INFORMATION_SCHEMA INNODB_LOCKS Table](information-schema-innodb-locks-table.html)

    [24.4.15 The INFORMATION_SCHEMA INNODB_LOCK_WAITS Table](information-schema-innodb-lock-waits-table.html)

    [24.4.16 The INFORMATION_SCHEMA INNODB_METRICS Table](information-schema-innodb-metrics-table.html)

    [24.4.17 The INFORMATION_SCHEMA INNODB_SYS_COLUMNS Table](information-schema-innodb-sys-columns-table.html)

    [24.4.18 The INFORMATION_SCHEMA INNODB_SYS_DATAFILES Table](information-schema-innodb-sys-datafiles-table.html)

    [24.4.19 The INFORMATION_SCHEMA INNODB_SYS_FIELDS Table](information-schema-innodb-sys-fields-table.html)

    [24.4.20 The INFORMATION_SCHEMA INNODB_SYS_FOREIGN Table](information-schema-innodb-sys-foreign-table.html)

    [24.4.21 The INFORMATION_SCHEMA INNODB_SYS_FOREIGN_COLS Table](information-schema-innodb-sys-foreign-cols-table.html)

    [24.4.22 The INFORMATION_SCHEMA INNODB_SYS_INDEXES Table](information-schema-innodb-sys-indexes-table.html)

    [24.4.23 The INFORMATION_SCHEMA INNODB_SYS_TABLES Table](information-schema-innodb-sys-tables-table.html)

    [24.4.24 The INFORMATION_SCHEMA INNODB_SYS_TABLESPACES Table](information-schema-innodb-sys-tablespaces-table.html)

    [24.4.25 The INFORMATION_SCHEMA INNODB_SYS_TABLESTATS View](information-schema-innodb-sys-tablestats-table.html)

    [24.4.26 The INFORMATION_SCHEMA INNODB_SYS_VIRTUAL Table](information-schema-innodb-sys-virtual-table.html)

    [24.4.27 The INFORMATION_SCHEMA INNODB_TEMP_TABLE_INFO Table](information-schema-innodb-temp-table-info-table.html)

    [24.4.28 The INFORMATION_SCHEMA INNODB_TRX Table](information-schema-innodb-trx-table.html)

[24.5 INFORMATION_SCHEMA Thread Pool Tables](thread-pool-information-schema-tables.html) :   [24.5.1 INFORMATION_SCHEMA Thread Pool Table Reference](information-schema-thread-pool-table-reference.html)

    [24.5.2 The INFORMATION_SCHEMA TP_THREAD_GROUP_STATE Table](information-schema-tp-thread-group-state-table.html)

    [24.5.3 The INFORMATION_SCHEMA TP_THREAD_GROUP_STATS Table](information-schema-tp-thread-group-stats-table.html)

    [24.5.4 The INFORMATION_SCHEMA TP_THREAD_STATE Table](information-schema-tp-thread-state-table.html)

[24.6 INFORMATION_SCHEMA Connection Control Tables](connection-control-information-schema-tables.html) :   [24.6.1 INFORMATION_SCHEMA Connection Control Table Reference](information-schema-connection-control-table-reference.html)

    [24.6.2 The INFORMATION_SCHEMA CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS Table](information-schema-connection-control-failed-login-attempts-table.html)

[24.7 INFORMATION_SCHEMA MySQL Enterprise Firewall Tables](firewall-information-schema-tables.html) :   [24.7.1 INFORMATION_SCHEMA Firewall Table Reference](information-schema-firewall-table-reference.html)

    [24.7.2 The INFORMATION_SCHEMA MYSQL_FIREWALL_USERS Table](information-schema-mysql-firewall-users-table.html)

    [24.7.3 The INFORMATION_SCHEMA MYSQL_FIREWALL_WHITELIST Table](information-schema-mysql-firewall-whitelist-table.html)

[24.8 Extensions to SHOW Statements](extended-show.html)

`INFORMATION_SCHEMA` provides access to database metadata, information about the MySQL server such as the name of a database or table, the data type of a column, or access privileges. Other terms that are sometimes used for this information are data dictionary and system catalog.
