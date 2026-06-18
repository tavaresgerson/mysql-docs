### 21.6.15 ndbinfo: O Database de Informações do NDB Cluster

21.6.15.1 A Tabela ndbinfo arbitrator_validity_detail

21.6.15.2 A Tabela ndbinfo arbitrator_validity_summary

21.6.15.3 A Tabela ndbinfo blocks

21.6.15.4 A Tabela ndbinfo cluster_locks

21.6.15.5 A Tabela ndbinfo cluster_operations

21.6.15.6 A Tabela ndbinfo cluster_transactions

21.6.15.7 A Tabela ndbinfo config_nodes

21.6.15.8 A Tabela ndbinfo config_params

21.6.15.9 A Tabela ndbinfo config_values

21.6.15.10 A Tabela ndbinfo counters

21.6.15.11 A Tabela ndbinfo cpustat

21.6.15.12 A Tabela ndbinfo cpustat_50ms

21.6.15.13 A Tabela ndbinfo cpustat_1sec

21.6.15.14 A Tabela ndbinfo cpustat_20sec

21.6.15.15 A Tabela ndbinfo dict_obj_info

21.6.15.16 A Tabela ndbinfo dict_obj_types

21.6.15.17 A Tabela ndbinfo disk_write_speed_base

21.6.15.18 A Tabela ndbinfo disk_write_speed_aggregate

21.6.15.19 A Tabela ndbinfo disk_write_speed_aggregate_node

21.6.15.20 A Tabela ndbinfo diskpagebuffer

21.6.15.21 A Tabela ndbinfo error_messages

21.6.15.22 A Tabela ndbinfo locks_per_fragment

21.6.15.23 A Tabela ndbinfo logbuffers

21.6.15.24 A Tabela ndbinfo logspaces

21.6.15.25 A Tabela ndbinfo membership

21.6.15.26 A Tabela ndbinfo memoryusage

21.6.15.27 A Tabela ndbinfo memory_per_fragment

21.6.15.28 A Tabela ndbinfo nodes

21.6.15.29 A Tabela ndbinfo operations_per_fragment

21.6.15.30 A Tabela ndbinfo processes

21.6.15.31 A Tabela ndbinfo resources

21.6.15.32 A Tabela ndbinfo restart_info

21.6.15.33 A Tabela ndbinfo server_locks

21.6.15.34 A Tabela ndbinfo server_operations

21.6.15.35 A Tabela ndbinfo server_transactions

21.6.15.36 A Tabela ndbinfo table_distribution_status

21.6.15.37 A Tabela ndbinfo table_fragments

21.6.15.38 A Tabela ndbinfo table_info

21.6.15.39 A Tabela ndbinfo table_replicas

21.6.15.40 A Tabela ndbinfo tc_time_track_stats

21.6.15.41 A Tabela ndbinfo threadblocks

21.6.15.42 A Tabela ndbinfo threads

21.6.15.43 A Tabela ndbinfo threadstat

21.6.15.44 A Tabela ndbinfo transporters

`ndbinfo` é um Database que contém informações específicas do NDB Cluster.

Este Database contém diversas tabelas, cada uma fornecendo um tipo diferente de dados sobre o status do node do NDB Cluster, uso de recursos e operações. Você pode encontrar informações mais detalhadas sobre cada uma dessas tabelas nas próximas seções.

O `ndbinfo` está incluído no suporte ao NDB Cluster no MySQL Server; nenhuma etapa especial de compilação ou configuração é necessária; as tabelas são criadas pelo MySQL Server quando ele se conecta ao Cluster. Você pode verificar se o suporte a `ndbinfo` está ativo em uma determinada instância do MySQL Server usando `SHOW PLUGINS`; se o suporte a `ndbinfo` estiver habilitado, você deverá ver uma linha contendo `ndbinfo` na coluna `Name` e `ACTIVE` na coluna `Status`, conforme mostrado aqui (texto em destaque):

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

Você também pode fazer isso verificando a saída de `SHOW ENGINES` para uma linha que inclua `ndbinfo` na coluna `Engine` e `YES` na coluna `Support`, conforme mostrado aqui (texto em destaque):

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

Se o suporte a `ndbinfo` estiver habilitado, você poderá acessar `ndbinfo` usando instruções SQL em **mysql** ou em outro cliente MySQL. Por exemplo, você pode ver `ndbinfo` listado na saída de `SHOW DATABASES`, conforme mostrado aqui (texto em destaque):

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

Se o processo **mysqld** não foi iniciado com a opção `--ndbcluster`, `ndbinfo` não estará disponível e não será exibido por `SHOW DATABASES`. Se o **mysqld** estava anteriormente conectado a um NDB Cluster, mas o Cluster se torna indisponível (devido a eventos como desligamento do Cluster, perda de conectividade de rede, etc.), `ndbinfo` e suas tabelas permanecem visíveis, mas uma tentativa de acessar quaisquer tabelas (exceto `blocks` ou `config_params`) falha com Got error 157 'Connection to NDB failed' from NDBINFO.

Com exceção das tabelas `blocks` e `config_params`, o que nos referimos como "tabelas" `ndbinfo` são, na verdade, Views geradas a partir de tabelas internas do `NDB` que normalmente não são visíveis para o MySQL Server. Você pode tornar essas tabelas visíveis definindo a variável de sistema `ndbinfo_show_hidden` como `ON` (ou `1`), mas isso normalmente não é necessário.

Todas as tabelas `ndbinfo` são somente leitura (read-only) e são geradas sob demanda quando consultadas. Como muitas delas são geradas em paralelo pelos data nodes, enquanto outras são específicas para um determinado SQL node, elas não têm garantia de fornecer um Snapshot consistente.

Além disso, o "pushing down" de JOINs não é suportado em tabelas `ndbinfo`; portanto, realizar um JOIN em tabelas `ndbinfo` grandes pode exigir a transferência de uma grande quantidade de dados para o API node solicitante, mesmo quando a Query utiliza uma cláusula `WHERE`.

As tabelas `ndbinfo` não estão incluídas no query cache. (Bug #59831)

Você pode selecionar o Database `ndbinfo` com uma instrução `USE` e, em seguida, emitir uma instrução `SHOW TABLES` para obter uma lista de tabelas, assim como faria com qualquer outro Database, desta forma:

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

No NDB 7.5.0 (e posterior), todas as tabelas `ndbinfo` usam o storage engine `NDB`; no entanto, uma entrada `ndbinfo` ainda aparece na saída de `SHOW ENGINES` e `SHOW PLUGINS`, conforme descrito anteriormente.

A tabela `config_values` foi adicionada no NDB 7.5.0.

As tabelas `cpustat`, `cpustat_50ms`, `cpustat_1sec`, `cpustat_20sec` e `threads` foram adicionadas no NDB 7.5.2.

As tabelas `cluster_locks`, `locks_per_fragment` e `server_locks` foram adicionadas no NDB 7.5.3.

As tabelas `dict_obj_info`, `table_distribution_status`, `table_fragments`, `table_info` e `table_replicas` foram adicionadas no NDB 7.5.4.

As tabelas `config_nodes` e `processes` foram adicionadas no NDB 7.5.7.

A tabela `error_messages` foi adicionada no NDB 7.6.

Você pode executar instruções `SELECT` nessas tabelas, exatamente como esperaria normalmente:

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

Queries mais complexas, como as duas instruções `SELECT` a seguir usando a tabela `memoryusage`, são possíveis:

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

O **mysqldump** ignora o Database `ndbinfo` inteiramente e o exclui de qualquer saída. Isso é verdade mesmo ao usar as opções `--databases` ou `--all-databases`.

O NDB Cluster também mantém tabelas no Database de informações `INFORMATION_SCHEMA`, incluindo a tabela `FILES` que contém informações sobre arquivos usados para armazenamento NDB Cluster Disk Data, e a tabela `ndb_transid_mysql_connection_map`, que mostra as relações entre Transactions, coordenadores de Transaction e API nodes do NDB Cluster. Para mais informações, consulte as descrições das tabelas ou Seção 21.6.16, “Tabelas INFORMATION_SCHEMA para NDB Cluster”.