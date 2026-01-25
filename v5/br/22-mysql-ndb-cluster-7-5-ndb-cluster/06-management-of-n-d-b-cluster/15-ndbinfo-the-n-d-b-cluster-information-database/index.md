### 21.6.15 ndbinfo: O Database de Informações do NDB Cluster

[21.6.15.1 A Tabela ndbinfo arbitrator_validity_detail](mysql-cluster-ndbinfo-arbitrator-validity-detail.html)

[21.6.15.2 A Tabela ndbinfo arbitrator_validity_summary](mysql-cluster-ndbinfo-arbitrator-validity-summary.html)

[21.6.15.3 A Tabela ndbinfo blocks](mysql-cluster-ndbinfo-blocks.html)

[21.6.15.4 A Tabela ndbinfo cluster_locks](mysql-cluster-ndbinfo-cluster-locks.html)

[21.6.15.5 A Tabela ndbinfo cluster_operations](mysql-cluster-ndbinfo-cluster-operations.html)

[21.6.15.6 A Tabela ndbinfo cluster_transactions](mysql-cluster-ndbinfo-cluster-transactions.html)

[21.6.15.7 A Tabela ndbinfo config_nodes](mysql-cluster-ndbinfo-config-nodes.html)

[21.6.15.8 A Tabela ndbinfo config_params](mysql-cluster-ndbinfo-config-params.html)

[21.6.15.9 A Tabela ndbinfo config_values](mysql-cluster-ndbinfo-config-values.html)

[21.6.15.10 A Tabela ndbinfo counters](mysql-cluster-ndbinfo-counters.html)

[21.6.15.11 A Tabela ndbinfo cpustat](mysql-cluster-ndbinfo-cpustat.html)

[21.6.15.12 A Tabela ndbinfo cpustat_50ms](mysql-cluster-ndbinfo-cpustat-50ms.html)

[21.6.15.13 A Tabela ndbinfo cpustat_1sec](mysql-cluster-ndbinfo-cpustat-1sec.html)

[21.6.15.14 A Tabela ndbinfo cpustat_20sec](mysql-cluster-ndbinfo-cpustat-20sec.html)

[21.6.15.15 A Tabela ndbinfo dict_obj_info](mysql-cluster-ndbinfo-dict-obj-info.html)

[21.6.15.16 A Tabela ndbinfo dict_obj_types](mysql-cluster-ndbinfo-dict-obj-types.html)

[21.6.15.17 A Tabela ndbinfo disk_write_speed_base](mysql-cluster-ndbinfo-disk-write-speed-base.html)

[21.6.15.18 A Tabela ndbinfo disk_write_speed_aggregate](mysql-cluster-ndbinfo-disk-write-speed-aggregate.html)

[21.6.15.19 A Tabela ndbinfo disk_write_speed_aggregate_node](mysql-cluster-ndbinfo-disk-write-speed-aggregate-node.html)

[21.6.15.20 A Tabela ndbinfo diskpagebuffer](mysql-cluster-ndbinfo-diskpagebuffer.html)

[21.6.15.21 A Tabela ndbinfo error_messages](mysql-cluster-ndbinfo-error-messages.html)

[21.6.15.22 A Tabela ndbinfo locks_per_fragment](mysql-cluster-ndbinfo-locks-per-fragment.html)

[21.6.15.23 A Tabela ndbinfo logbuffers](mysql-cluster-ndbinfo-logbuffers.html)

[21.6.15.24 A Tabela ndbinfo logspaces](mysql-cluster-ndbinfo-logspaces.html)

[21.6.15.25 A Tabela ndbinfo membership](mysql-cluster-ndbinfo-membership.html)

[21.6.15.26 A Tabela ndbinfo memoryusage](mysql-cluster-ndbinfo-memoryusage.html)

[21.6.15.27 A Tabela ndbinfo memory_per_fragment](mysql-cluster-ndbinfo-memory-per-fragment.html)

[21.6.15.28 A Tabela ndbinfo nodes](mysql-cluster-ndbinfo-nodes.html)

[21.6.15.29 A Tabela ndbinfo operations_per_fragment](mysql-cluster-ndbinfo-operations-per-fragment.html)

[21.6.15.30 A Tabela ndbinfo processes](mysql-cluster-ndbinfo-processes.html)

[21.6.15.31 A Tabela ndbinfo resources](mysql-cluster-ndbinfo-resources.html)

[21.6.15.32 A Tabela ndbinfo restart_info](mysql-cluster-ndbinfo-restart-info.html)

[21.6.15.33 A Tabela ndbinfo server_locks](mysql-cluster-ndbinfo-server-locks.html)

[21.6.15.34 A Tabela ndbinfo server_operations](mysql-cluster-ndbinfo-server-operations.html)

[21.6.15.35 A Tabela ndbinfo server_transactions](mysql-cluster-ndbinfo-server-transactions.html)

[21.6.15.36 A Tabela ndbinfo table_distribution_status](mysql-cluster-ndbinfo-table-distribution-status.html)

[21.6.15.37 A Tabela ndbinfo table_fragments](mysql-cluster-ndbinfo-table-fragments.html)

[21.6.15.38 A Tabela ndbinfo table_info](mysql-cluster-ndbinfo-table-info.html)

[21.6.15.39 A Tabela ndbinfo table_replicas](mysql-cluster-ndbinfo-table-replicas.html)

[21.6.15.40 A Tabela ndbinfo tc_time_track_stats](mysql-cluster-ndbinfo-tc-time-track-stats.html)

[21.6.15.41 A Tabela ndbinfo threadblocks](mysql-cluster-ndbinfo-threadblocks.html)

[21.6.15.42 A Tabela ndbinfo threads](mysql-cluster-ndbinfo-threads.html)

[21.6.15.43 A Tabela ndbinfo threadstat](mysql-cluster-ndbinfo-threadstat.html)

[21.6.15.44 A Tabela ndbinfo transporters](mysql-cluster-ndbinfo-transporters.html)

`ndbinfo` é um Database que contém informações específicas do NDB Cluster.

Este Database contém diversas tabelas, cada uma fornecendo um tipo diferente de dados sobre o status do node do NDB Cluster, uso de recursos e operações. Você pode encontrar informações mais detalhadas sobre cada uma dessas tabelas nas próximas seções.

O `ndbinfo` está incluído no suporte ao NDB Cluster no MySQL Server; nenhuma etapa especial de compilação ou configuração é necessária; as tabelas são criadas pelo MySQL Server quando ele se conecta ao Cluster. Você pode verificar se o suporte a `ndbinfo` está ativo em uma determinada instância do MySQL Server usando [`SHOW PLUGINS`](show-plugins.html "13.7.5.25 SHOW PLUGINS Statement"); se o suporte a `ndbinfo` estiver habilitado, você deverá ver uma linha contendo `ndbinfo` na coluna `Name` e `ACTIVE` na coluna `Status`, conforme mostrado aqui (texto em destaque):

```sql
mysql> SHOW PLUGINS;
+----------------------------------+--------+--------------------+---------+---------+
| Name                             | Status | Type               | Library | License |
+----------------------------------+--------+--------------------+---------+---------+
| binlog                           | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| mysql_native_password            | ACTIVE | AUTHENTICATION     | NULL    | GPL     |
| sha256_password                  | ACTIVE | AUTHENTICATION     | NULL    | GPL     |
| MRG_MYISAM                       | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| MEMORY                           | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| CSV                              | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| MyISAM                           | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| InnoDB                           | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| INNODB_TRX                       | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_LOCKS                     | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_LOCK_WAITS                | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_CMP                       | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_CMP_RESET                 | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_CMPMEM                    | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_CMPMEM_RESET              | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_CMP_PER_INDEX             | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_CMP_PER_INDEX_RESET       | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_BUFFER_PAGE               | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_BUFFER_PAGE_LRU           | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_BUFFER_POOL_STATS         | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_TEMP_TABLE_INFO           | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_METRICS                   | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_FT_DEFAULT_STOPWORD       | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_FT_DELETED                | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_FT_BEING_DELETED          | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_FT_CONFIG                 | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_FT_INDEX_CACHE            | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_FT_INDEX_TABLE            | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_SYS_TABLES                | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_SYS_TABLESTATS            | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_SYS_INDEXES               | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_SYS_COLUMNS               | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_SYS_FIELDS                | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_SYS_FOREIGN               | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_SYS_FOREIGN_COLS          | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_SYS_TABLESPACES           | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_SYS_DATAFILES             | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_SYS_VIRTUAL               | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| PERFORMANCE_SCHEMA               | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| ndbCluster                      | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| ndbinfo                          | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| ndb_transid_mysql_connection_map | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| BLACKHOLE                        | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| ARCHIVE                          | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| partition                        | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| ngram                            | ACTIVE | FTPARSER           | NULL    | GPL     |
+----------------------------------+--------+--------------------+---------+---------+
46 rows in set (0.00 sec)
```

Você também pode fazer isso verificando a saída de [`SHOW ENGINES`](show-engines.html "13.7.5.16 SHOW ENGINES Statement") para uma linha que inclua `ndbinfo` na coluna `Engine` e `YES` na coluna `Support`, conforme mostrado aqui (texto em destaque):

```sql
mysql> SHOW ENGINES\G
*************************** 1. row ***************************
      Engine: ndbcluster
     Support: YES
     Comment: Clustered, fault-tolerant tables
Transactions: YES
          XA: NO
  Savepoints: NO
*************************** 2. row ***************************
      Engine: CSV
     Support: YES
     Comment: CSV storage engine
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 3. row ***************************
      Engine: InnoDB
     Support: DEFAULT
     Comment: Supports transactions, row-level locking, and foreign keys
Transactions: YES
          XA: YES
  Savepoints: YES
*************************** 4. row ***************************
      Engine: BLACKHOLE
     Support: YES
     Comment: /dev/null storage engine (anything you write to it disappears)
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 5. row ***************************
      Engine: MyISAM
     Support: YES
     Comment: MyISAM storage engine
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 6. row ***************************
      Engine: MRG_MYISAM
     Support: YES
     Comment: Collection of identical MyISAM tables
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 7. row ***************************
      Engine: ARCHIVE
     Support: YES
     Comment: Archive storage engine
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 8. row ***************************
      Engine: ndbinfo
     Support: YES
     Comment: NDB Cluster system information storage engine
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 9. row ***************************
      Engine: PERFORMANCE_SCHEMA
     Support: YES
     Comment: Performance Schema
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 10. row ***************************
      Engine: MEMORY
     Support: YES
     Comment: Hash based, stored in memory, useful for temporary tables
Transactions: NO
          XA: NO
  Savepoints: NO
10 rows in set (0.00 sec)
```

Se o suporte a `ndbinfo` estiver habilitado, você poderá acessar `ndbinfo` usando instruções SQL em [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") ou em outro cliente MySQL. Por exemplo, você pode ver `ndbinfo` listado na saída de [`SHOW DATABASES`](show-databases.html "13.7.5.14 SHOW DATABASES Statement"), conforme mostrado aqui (texto em destaque):

```sql
mysql> SHOW DATABASES;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| ndbinfo            |
| performance_schema |
| sys                |
+--------------------+
5 rows in set (0.04 sec)
```

Se o processo [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") não foi iniciado com a opção [`--ndbcluster`](mysql-cluster-options-variables.html#option_mysqld_ndbcluster), `ndbinfo` não estará disponível e não será exibido por [`SHOW DATABASES`](show-databases.html "13.7.5.14 SHOW DATABASES Statement"). Se o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") estava anteriormente conectado a um NDB Cluster, mas o Cluster se torna indisponível (devido a eventos como desligamento do Cluster, perda de conectividade de rede, etc.), `ndbinfo` e suas tabelas permanecem visíveis, mas uma tentativa de acessar quaisquer tabelas (exceto `blocks` ou `config_params`) falha com Got error 157 'Connection to NDB failed' from NDBINFO.

Com exceção das tabelas [`blocks`](mysql-cluster-ndbinfo-blocks.html "21.6.15.3 The ndbinfo blocks Table") e [`config_params`](mysql-cluster-ndbinfo-config-params.html "21.6.15.8 The ndbinfo config_params Table"), o que nos referimos como "tabelas" `ndbinfo` são, na verdade, Views geradas a partir de tabelas internas do [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") que normalmente não são visíveis para o MySQL Server. Você pode tornar essas tabelas visíveis definindo a variável de sistema [`ndbinfo_show_hidden`](mysql-cluster-options-variables.html#sysvar_ndbinfo_show_hidden) como `ON` (ou `1`), mas isso normalmente não é necessário.

Todas as tabelas `ndbinfo` são somente leitura (read-only) e são geradas sob demanda quando consultadas. Como muitas delas são geradas em paralelo pelos data nodes, enquanto outras são específicas para um determinado SQL node, elas não têm garantia de fornecer um Snapshot consistente.

Além disso, o "pushing down" de JOINs não é suportado em tabelas `ndbinfo`; portanto, realizar um JOIN em tabelas `ndbinfo` grandes pode exigir a transferência de uma grande quantidade de dados para o API node solicitante, mesmo quando a Query utiliza uma cláusula `WHERE`.

As tabelas `ndbinfo` não estão incluídas no query cache. (Bug #59831)

Você pode selecionar o Database `ndbinfo` com uma instrução [`USE`](use.html "13.8.4 USE Statement") e, em seguida, emitir uma instrução [`SHOW TABLES`](show-tables.html "13.7.5.37 SHOW TABLES Statement") para obter uma lista de tabelas, assim como faria com qualquer outro Database, desta forma:

```sql
mysql> USE ndbinfo;
Database changed

mysql> SHOW TABLES;
+---------------------------------+
| Tables_in_ndbinfo               |
+---------------------------------+
| arbitrator_validity_detail      |
| arbitrator_validity_summary     |
| blocks                          |
| cluster_locks                   |
| cluster_operations              |
| cluster_transactions            |
| config_nodes                    |
| config_params                   |
| config_values                   |
| counters                        |
| cpustat                         |
| cpustat_1sec                    |
| cpustat_20sec                   |
| cpustat_50ms                    |
| dict_obj_info                   |
| dict_obj_types                  |
| disk_write_speed_aggregate      |
| disk_write_speed_aggregate_node |
| disk_write_speed_base           |
| diskpagebuffer                  |
| error_messages                  |
| locks_per_fragment              |
| logbuffers                      |
| logspaces                       |
| membership                      |
| memory_per_fragment             |
| memoryusage                     |
| nodes                           |
| operations_per_fragment         |
| processes                       |
| resources                       |
| restart_info                    |
| server_locks                    |
| server_operations               |
| server_transactions             |
| table_distribution_status       |
| table_fragments                 |
| table_info                      |
| table_replicas                  |
| tc_time_track_stats             |
| threadblocks                    |
| threads                         |
| threadstat                      |
| transporters                    |
+---------------------------------+
44 rows in set (0.00 sec)
```

No NDB 7.5.0 (e posterior), todas as tabelas `ndbinfo` usam o storage engine `NDB`; no entanto, uma entrada `ndbinfo` ainda aparece na saída de [`SHOW ENGINES`](show-engines.html "13.7.5.16 SHOW ENGINES Statement") e [`SHOW PLUGINS`](show-plugins.html "13.7.5.25 SHOW PLUGINS Statement"), conforme descrito anteriormente.

A tabela [`config_values`](mysql-cluster-ndbinfo-config-values.html "21.6.15.9 The ndbinfo config_values Table") foi adicionada no NDB 7.5.0.

As tabelas [`cpustat`](mysql-cluster-ndbinfo-cpustat.html "21.6.15.11 The ndbinfo cpustat Table"), [`cpustat_50ms`](mysql-cluster-ndbinfo-cpustat-50ms.html "21.6.15.12 The ndbinfo cpustat_50ms Table"), [`cpustat_1sec`](mysql-cluster-ndbinfo-cpustat-1sec.html "21.6.15.13 The ndbinfo cpustat_1sec Table"), [`cpustat_20sec`](mysql-cluster-ndbinfo-cpustat-20sec.html "21.6.15.14 The ndbinfo cpustat_20sec Table") e [`threads`](mysql-cluster-ndbinfo-threads.html "21.6.15.42 The ndbinfo threads Table") foram adicionadas no NDB 7.5.2.

As tabelas [`cluster_locks`](mysql-cluster-ndbinfo-cluster-locks.html "21.6.15.4 The ndbinfo cluster_locks Table"), [`locks_per_fragment`](mysql-cluster-ndbinfo-locks-per-fragment.html "21.6.15.22 The ndbinfo locks_per_fragment Table") e [`server_locks`](mysql-cluster-ndbinfo-server-locks.html "21.6.15.33 The ndbinfo server_locks Table") foram adicionadas no NDB 7.5.3.

As tabelas [`dict_obj_info`](mysql-cluster-ndbinfo-dict-obj-info.html "21.6.15.15 The ndbinfo dict_obj_info Table"), [`table_distribution_status`](mysql-cluster-ndbinfo-table-distribution-status.html "21.6.15.36 The ndbinfo table_distribution_status Table"), [`table_fragments`](mysql-cluster-ndbinfo-table-fragments.html "21.6.15.37 The ndbinfo table_fragments Table"), [`table_info`](mysql-cluster-ndbinfo-table-info.html "21.6.15.38 The ndbinfo table_info Table") e [`table_replicas`](mysql-cluster-ndbinfo-table-replicas.html "21.6.15.39 The ndbinfo table_replicas Table") foram adicionadas no NDB 7.5.4.

As tabelas [`config_nodes`](mysql-cluster-ndbinfo-config-nodes.html "21.6.15.7 The ndbinfo config_nodes Table") e [`processes`](mysql-cluster-ndbinfo-processes.html "21.6.15.30 The ndbinfo processes Table") foram adicionadas no NDB 7.5.7.

A tabela [`error_messages`](mysql-cluster-ndbinfo-error-messages.html "21.6.15.21 The ndbinfo error_messages Table") foi adicionada no NDB 7.6.

Você pode executar instruções [`SELECT`](select.html "13.2.9 SELECT Statement") nessas tabelas, exatamente como esperaria normalmente:

```sql
mysql> SELECT * FROM memoryusage;
+---------+---------------------+--------+------------+------------+-------------+
| node_id | memory_type         | used   | used_pages | total      | total_pages |
+---------+---------------------+--------+------------+------------+-------------+
|       5 | Data memory         | 753664 |         23 | 1073741824 |       32768 |
|       5 | Index memory        | 163840 |         20 | 1074003968 |      131104 |
|       5 | Long message buffer |   2304 |          9 |   67108864 |      262144 |
|       6 | Data memory         | 753664 |         23 | 1073741824 |       32768 |
|       6 | Index memory        | 163840 |         20 | 1074003968 |      131104 |
|       6 | Long message buffer |   2304 |          9 |   67108864 |      262144 |
+---------+---------------------+--------+------------+------------+-------------+
6 rows in set (0.02 sec)
```

Queries mais complexas, como as duas instruções [`SELECT`](select.html "13.2.9 SELECT Statement") a seguir usando a tabela [`memoryusage`](mysql-cluster-ndbinfo-memoryusage.html "21.6.15.26 The ndbinfo memoryusage Table"), são possíveis:

```sql
mysql> SELECT SUM(used) as 'Data Memory Used, All Nodes'
     >     FROM memoryusage
     >     WHERE memory_type = 'Data memory';
+-----------------------------+
| Data Memory Used, All Nodes |
+-----------------------------+
|                        6460 |
+-----------------------------+
1 row in set (0.37 sec)

mysql> SELECT SUM(max) as 'Total IndexMemory Available'
     >     FROM memoryusage
     >     WHERE memory_type = 'Index memory';
+-----------------------------+
| Total IndexMemory Available |
+-----------------------------+
|                       25664 |
+-----------------------------+
1 row in set (0.33 sec)
```

Os nomes de tabelas e colunas `ndbinfo` diferenciam maiúsculas de minúsculas (case-sensitive) (assim como o nome do Database `ndbinfo` em si). Esses identificadores estão em letras minúsculas. Tentar usar a capitalização incorreta resulta em um erro, conforme mostrado neste exemplo:

```sql
mysql> SELECT * FROM nodes;
+---------+--------+---------+-------------+
| node_id | uptime | status  | start_phase |
+---------+--------+---------+-------------+
|       1 |  13602 | STARTED |           0 |
|       2 |     16 | STARTED |           0 |
+---------+--------+---------+-------------+
2 rows in set (0.04 sec)

mysql> SELECT * FROM Nodes;
ERROR 1146 (42S02): Table 'ndbinfo.Nodes' doesn't exist
```

O [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") ignora o Database `ndbinfo` inteiramente e o exclui de qualquer saída. Isso é verdade mesmo ao usar as opções [`--databases`](mysqldump.html#option_mysqldump_databases) ou [`--all-databases`](mysqldump.html#option_mysqldump_all-databases).

O NDB Cluster também mantém tabelas no Database de informações `INFORMATION_SCHEMA`, incluindo a tabela [`FILES`](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table") que contém informações sobre arquivos usados para armazenamento NDB Cluster Disk Data, e a tabela [`ndb_transid_mysql_connection_map`](information-schema-ndb-transid-mysql-connection-map-table.html "24.3.13 The INFORMATION_SCHEMA ndb_transid_mysql_connection_map Table"), que mostra as relações entre Transactions, coordenadores de Transaction e API nodes do NDB Cluster. Para mais informações, consulte as descrições das tabelas ou [Seção 21.6.16, “Tabelas INFORMATION_SCHEMA para NDB Cluster”](mysql-cluster-information-schema-tables.html "21.6.16 INFORMATION_SCHEMA Tables for NDB Cluster").