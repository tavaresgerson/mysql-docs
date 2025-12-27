# Chapter 24 INFORMATION\_SCHEMA Tables

**Table of Contents**

[24.1 Introduction](information-schema-introduction.html)

[24.2 INFORMATION\_SCHEMA Table Reference](information-schema-table-reference.html)

[24.3 INFORMATION\_SCHEMA General Tables](general-information-schema-tables.html) :   [24.3.1 INFORMATION\_SCHEMA General Table Reference](information-schema-general-table-reference.html)

    [24.3.2 The INFORMATION\_SCHEMA CHARACTER\_SETS Table](information-schema-character-sets-table.html)

    [24.3.3 The INFORMATION\_SCHEMA COLLATIONS Table](information-schema-collations-table.html)

    [24.3.4 The INFORMATION\_SCHEMA COLLATION\_CHARACTER\_SET\_APPLICABILITY Table](information-schema-collation-character-set-applicability-table.html)

    [24.3.5 The INFORMATION\_SCHEMA COLUMNS Table](information-schema-columns-table.html)

    [24.3.6 The INFORMATION\_SCHEMA COLUMN\_PRIVILEGES Table](information-schema-column-privileges-table.html)

    [24.3.7 The INFORMATION\_SCHEMA ENGINES Table](information-schema-engines-table.html)

    [24.3.8 The INFORMATION\_SCHEMA EVENTS Table](information-schema-events-table.html)

    [24.3.9 The INFORMATION\_SCHEMA FILES Table](information-schema-files-table.html)

    [24.3.10 The INFORMATION\_SCHEMA GLOBAL\_STATUS and SESSION\_STATUS Tables](information-schema-status-table.html)

    [24.3.11 The INFORMATION\_SCHEMA GLOBAL\_VARIABLES and SESSION\_VARIABLES Tables](information-schema-variables-table.html)

    [24.3.12 The INFORMATION\_SCHEMA KEY\_COLUMN\_USAGE Table](information-schema-key-column-usage-table.html)

    [24.3.13 The INFORMATION\_SCHEMA ndb\_transid\_mysql\_connection\_map Table](information-schema-ndb-transid-mysql-connection-map-table.html)

    [24.3.14 The INFORMATION\_SCHEMA OPTIMIZER\_TRACE Table](information-schema-optimizer-trace-table.html)

    [24.3.15 The INFORMATION\_SCHEMA PARAMETERS Table](information-schema-parameters-table.html)

    [24.3.16 The INFORMATION\_SCHEMA PARTITIONS Table](information-schema-partitions-table.html)

    [24.3.17 The INFORMATION\_SCHEMA PLUGINS Table](information-schema-plugins-table.html)

    [24.3.18 The INFORMATION\_SCHEMA PROCESSLIST Table](information-schema-processlist-table.html)

    [24.3.19 The INFORMATION\_SCHEMA PROFILING Table](information-schema-profiling-table.html)

    [24.3.20 The INFORMATION\_SCHEMA REFERENTIAL\_CONSTRAINTS Table](information-schema-referential-constraints-table.html)

    [24.3.21 The INFORMATION\_SCHEMA ROUTINES Table](information-schema-routines-table.html)

    [24.3.22 The INFORMATION\_SCHEMA SCHEMATA Table](information-schema-schemata-table.html)

    [24.3.23 The INFORMATION\_SCHEMA SCHEMA\_PRIVILEGES Table](information-schema-schema-privileges-table.html)

    [24.3.24 The INFORMATION\_SCHEMA STATISTICS Table](information-schema-statistics-table.html)

    [24.3.25 The INFORMATION\_SCHEMA TABLES Table](information-schema-tables-table.html)

    [24.3.26 The INFORMATION\_SCHEMA TABLESPACES Table](information-schema-tablespaces-table.html)

    [24.3.27 The INFORMATION\_SCHEMA TABLE\_CONSTRAINTS Table](information-schema-table-constraints-table.html)

    [24.3.28 The INFORMATION\_SCHEMA TABLE\_PRIVILEGES Table](information-schema-table-privileges-table.html)

    [24.3.29 The INFORMATION\_SCHEMA TRIGGERS Table](information-schema-triggers-table.html)

    [24.3.30 The INFORMATION\_SCHEMA USER\_PRIVILEGES Table](information-schema-user-privileges-table.html)

    [24.3.31 The INFORMATION\_SCHEMA VIEWS Table](information-schema-views-table.html)

[24.4 INFORMATION\_SCHEMA InnoDB Tables](innodb-information-schema-tables.html) :   [24.4.1 INFORMATION\_SCHEMA InnoDB Table Reference](information-schema-innodb-table-reference.html)

    [24.4.2 The INFORMATION\_SCHEMA INNODB\_BUFFER\_PAGE Table](information-schema-innodb-buffer-page-table.html)

    [24.4.3 The INFORMATION\_SCHEMA INNODB\_BUFFER\_PAGE\_LRU Table](information-schema-innodb-buffer-page-lru-table.html)

    [24.4.4 The INFORMATION\_SCHEMA INNODB\_BUFFER\_POOL\_STATS Table](information-schema-innodb-buffer-pool-stats-table.html)

    [24.4.5 The INFORMATION\_SCHEMA INNODB\_CMP and INNODB\_CMP\_RESET Tables](information-schema-innodb-cmp-table.html)

    [24.4.6 The INFORMATION\_SCHEMA INNODB\_CMPMEM and INNODB\_CMPMEM\_RESET Tables](information-schema-innodb-cmpmem-table.html)

    [24.4.7 The INFORMATION\_SCHEMA INNODB\_CMP\_PER\_INDEX and INNODB\_CMP\_PER\_INDEX\_RESET Tables](information-schema-innodb-cmp-per-index-table.html)

    [24.4.8 The INFORMATION\_SCHEMA INNODB\_FT\_BEING\_DELETED Table](information-schema-innodb-ft-being-deleted-table.html)

    [24.4.9 The INFORMATION\_SCHEMA INNODB\_FT\_CONFIG Table](information-schema-innodb-ft-config-table.html)

    [24.4.10 The INFORMATION\_SCHEMA INNODB\_FT\_DEFAULT\_STOPWORD Table](information-schema-innodb-ft-default-stopword-table.html)

    [24.4.11 The INFORMATION\_SCHEMA INNODB\_FT\_DELETED Table](information-schema-innodb-ft-deleted-table.html)

    [24.4.12 The INFORMATION\_SCHEMA INNODB\_FT\_INDEX\_CACHE Table](information-schema-innodb-ft-index-cache-table.html)

    [24.4.13 The INFORMATION\_SCHEMA INNODB\_FT\_INDEX\_TABLE Table](information-schema-innodb-ft-index-table-table.html)

    [24.4.14 The INFORMATION\_SCHEMA INNODB\_LOCKS Table](information-schema-innodb-locks-table.html)

    [24.4.15 The INFORMATION\_SCHEMA INNODB\_LOCK\_WAITS Table](information-schema-innodb-lock-waits-table.html)

    [24.4.16 The INFORMATION\_SCHEMA INNODB\_METRICS Table](information-schema-innodb-metrics-table.html)

    [24.4.17 The INFORMATION\_SCHEMA INNODB\_SYS\_COLUMNS Table](information-schema-innodb-sys-columns-table.html)

    [24.4.18 The INFORMATION\_SCHEMA INNODB\_SYS\_DATAFILES Table](information-schema-innodb-sys-datafiles-table.html)

    [24.4.19 The INFORMATION\_SCHEMA INNODB\_SYS\_FIELDS Table](information-schema-innodb-sys-fields-table.html)

    [24.4.20 The INFORMATION\_SCHEMA INNODB\_SYS\_FOREIGN Table](information-schema-innodb-sys-foreign-table.html)

    [24.4.21 The INFORMATION\_SCHEMA INNODB\_SYS\_FOREIGN\_COLS Table](information-schema-innodb-sys-foreign-cols-table.html)

    [24.4.22 The INFORMATION\_SCHEMA INNODB\_SYS\_INDEXES Table](information-schema-innodb-sys-indexes-table.html)

    [24.4.23 The INFORMATION\_SCHEMA INNODB\_SYS\_TABLES Table](information-schema-innodb-sys-tables-table.html)

    [24.4.24 The INFORMATION\_SCHEMA INNODB\_SYS\_TABLESPACES Table](information-schema-innodb-sys-tablespaces-table.html)

    [24.4.25 The INFORMATION\_SCHEMA INNODB\_SYS\_TABLESTATS View](information-schema-innodb-sys-tablestats-table.html)

    [24.4.26 The INFORMATION\_SCHEMA INNODB\_SYS\_VIRTUAL Table](information-schema-innodb-sys-virtual-table.html)

    [24.4.27 The INFORMATION\_SCHEMA INNODB\_TEMP\_TABLE\_INFO Table](information-schema-innodb-temp-table-info-table.html)

    [24.4.28 The INFORMATION\_SCHEMA INNODB\_TRX Table](information-schema-innodb-trx-table.html)

[24.5 INFORMATION\_SCHEMA Thread Pool Tables](thread-pool-information-schema-tables.html) :   [24.5.1 INFORMATION\_SCHEMA Thread Pool Table Reference](information-schema-thread-pool-table-reference.html)

    [24.5.2 The INFORMATION\_SCHEMA TP\_THREAD\_GROUP\_STATE Table](information-schema-tp-thread-group-state-table.html)

    [24.5.3 The INFORMATION\_SCHEMA TP\_THREAD\_GROUP\_STATS Table](information-schema-tp-thread-group-stats-table.html)

    [24.5.4 The INFORMATION\_SCHEMA TP\_THREAD\_STATE Table](information-schema-tp-thread-state-table.html)

[24.6 INFORMATION\_SCHEMA Connection Control Tables](connection-control-information-schema-tables.html) :   [24.6.1 INFORMATION\_SCHEMA Connection Control Table Reference](information-schema-connection-control-table-reference.html)

    [24.6.2 The INFORMATION\_SCHEMA CONNECTION\_CONTROL\_FAILED\_LOGIN\_ATTEMPTS Table](information-schema-connection-control-failed-login-attempts-table.html)

[24.7 INFORMATION\_SCHEMA MySQL Enterprise Firewall Tables](firewall-information-schema-tables.html) :   [24.7.1 INFORMATION\_SCHEMA Firewall Table Reference](information-schema-firewall-table-reference.html)

    [24.7.2 The INFORMATION\_SCHEMA MYSQL\_FIREWALL\_USERS Table](information-schema-mysql-firewall-users-table.html)

    [24.7.3 The INFORMATION\_SCHEMA MYSQL\_FIREWALL\_WHITELIST Table](information-schema-mysql-firewall-whitelist-table.html)

[24.8 Extensions to SHOW Statements](extended-show.html)

`INFORMATION_SCHEMA` provides access to database metadata, information about the MySQL server such as the name of a database or table, the data type of a column, or access privileges. Other terms that are sometimes used for this information are data dictionary and system catalog.
