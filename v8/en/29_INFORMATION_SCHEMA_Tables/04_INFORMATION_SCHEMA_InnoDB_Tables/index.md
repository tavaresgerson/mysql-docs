## 28.4 INFORMATION\_SCHEMA InnoDB Tables

[28.4.1 INFORMATION\_SCHEMA InnoDB Table Reference](information-schema-innodb-table-reference.html)

[28.4.2 The INFORMATION\_SCHEMA INNODB\_BUFFER\_PAGE Table](information-schema-innodb-buffer-page-table.html)

[28.4.3 The INFORMATION\_SCHEMA INNODB\_BUFFER\_PAGE\_LRU Table](information-schema-innodb-buffer-page-lru-table.html)

[28.4.4 The INFORMATION\_SCHEMA INNODB\_BUFFER\_POOL\_STATS Table](information-schema-innodb-buffer-pool-stats-table.html)

[28.4.5 The INFORMATION\_SCHEMA INNODB\_CACHED\_INDEXES Table](information-schema-innodb-cached-indexes-table.html)

[28.4.6 The INFORMATION\_SCHEMA INNODB\_CMP and INNODB\_CMP\_RESET Tables](information-schema-innodb-cmp-table.html)

[28.4.7 The INFORMATION\_SCHEMA INNODB\_CMPMEM and INNODB\_CMPMEM\_RESET Tables](information-schema-innodb-cmpmem-table.html)

[28.4.8 The INFORMATION\_SCHEMA INNODB\_CMP\_PER\_INDEX and INNODB\_CMP\_PER\_INDEX\_RESET Tables](information-schema-innodb-cmp-per-index-table.html)

[28.4.9 The INFORMATION\_SCHEMA INNODB\_COLUMNS Table](information-schema-innodb-columns-table.html)

[28.4.10 The INFORMATION\_SCHEMA INNODB\_DATAFILES Table](information-schema-innodb-datafiles-table.html)

[28.4.11 The INFORMATION\_SCHEMA INNODB\_FIELDS Table](information-schema-innodb-fields-table.html)

[28.4.12 The INFORMATION\_SCHEMA INNODB\_FOREIGN Table](information-schema-innodb-foreign-table.html)

[28.4.13 The INFORMATION\_SCHEMA INNODB\_FOREIGN\_COLS Table](information-schema-innodb-foreign-cols-table.html)

[28.4.14 The INFORMATION\_SCHEMA INNODB\_FT\_BEING\_DELETED Table](information-schema-innodb-ft-being-deleted-table.html)

[28.4.15 The INFORMATION\_SCHEMA INNODB\_FT\_CONFIG Table](information-schema-innodb-ft-config-table.html)

[28.4.16 The INFORMATION\_SCHEMA INNODB\_FT\_DEFAULT\_STOPWORD Table](information-schema-innodb-ft-default-stopword-table.html)

[28.4.17 The INFORMATION\_SCHEMA INNODB\_FT\_DELETED Table](information-schema-innodb-ft-deleted-table.html)

[28.4.18 The INFORMATION\_SCHEMA INNODB\_FT\_INDEX\_CACHE Table](information-schema-innodb-ft-index-cache-table.html)

[28.4.19 The INFORMATION\_SCHEMA INNODB\_FT\_INDEX\_TABLE Table](information-schema-innodb-ft-index-table-table.html)

[28.4.20 The INFORMATION\_SCHEMA INNODB\_INDEXES Table](information-schema-innodb-indexes-table.html)

[28.4.21 The INFORMATION\_SCHEMA INNODB\_METRICS Table](information-schema-innodb-metrics-table.html)

[28.4.22 The INFORMATION\_SCHEMA INNODB\_SESSION\_TEMP\_TABLESPACES Table](information-schema-innodb-session-temp-tablespaces-table.html)

[28.4.23 The INFORMATION\_SCHEMA INNODB\_TABLES Table](information-schema-innodb-tables-table.html)

[28.4.24 The INFORMATION\_SCHEMA INNODB\_TABLESPACES Table](information-schema-innodb-tablespaces-table.html)

[28.4.25 The INFORMATION\_SCHEMA INNODB\_TABLESPACES\_BRIEF Table](information-schema-innodb-tablespaces-brief-table.html)

[28.4.26 The INFORMATION\_SCHEMA INNODB\_TABLESTATS View](information-schema-innodb-tablestats-table.html)

[28.4.27 The INFORMATION\_SCHEMA INNODB\_TEMP\_TABLE\_INFO Table](information-schema-innodb-temp-table-info-table.html)

[28.4.28 The INFORMATION\_SCHEMA INNODB\_TRX Table](information-schema-innodb-trx-table.html)

[28.4.29 The INFORMATION\_SCHEMA INNODB\_VIRTUAL Table](information-schema-innodb-virtual-table.html)

This section provides table definitions for
`INFORMATION_SCHEMA` `InnoDB`
tables. For related information and examples, see
[Section 17.15, “InnoDB INFORMATION\_SCHEMA Tables”](innodb-information-schema.html "17.15 InnoDB INFORMATION_SCHEMA Tables").

`INFORMATION_SCHEMA` `InnoDB`
tables can be used to monitor ongoing `InnoDB`
activity, to detect inefficiencies before they turn into issues, or
to troubleshoot performance and capacity issues. As your database
becomes bigger and busier, running up against the limits of your
hardware capacity, you monitor and tune these aspects to keep the
database running smoothly.