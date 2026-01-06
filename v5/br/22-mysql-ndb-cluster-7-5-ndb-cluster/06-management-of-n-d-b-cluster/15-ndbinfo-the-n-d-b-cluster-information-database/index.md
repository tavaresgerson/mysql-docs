### 21.6.15 ndbinfo: A Base de Dados de Informação do NDB Cluster

21.6.15.1 Tabela ndbinfo arbitrator\_validity\_detail

21.6.15.2 Tabela de resumo de validade do árbitro ndbinfo

21.6.15.3 Blocos de ndbinfo da tabela

21.6.15.4 A tabela ndbinfo cluster\_locks

21.6.15.5 Tabela de operações de cluster ndbinfo

21.6.15.6 Tabela ndbinfo cluster\_transactions

21.6.15.7 A tabela ndbinfo config\_nodes

21.6.15.8 A tabela ndbinfo config\_params

21.6.15.9 A tabela ndbinfo config\_values

21.6.15.10 Contadores de ndbinfo da tabela

21.6.15.11 Tabela ndbinfo cpustat

21.6.15.12 Tabela ndbinfo cpustat\_50ms

21.6.15.13 Tabela ndbinfo cpustat\_1sec

21.6.15.14 Tabela ndbinfo cpustat\_20sec

21.6.15.15 Tabela ndbinfo dict\_obj\_info

21.6.15.16 Tabela ndbinfo dict\_obj\_types

21.6.15.17 Tabela ndbinfo disk\_write\_speed\_base

21.6.15.18 Tabela ndbinfo disk\_write\_speed\_aggregate

21.6.15.19 A tabela ndbinfo disk\_write\_speed\_aggregate\_node

21.6.15.20 Tabela ndbinfo diskpagebuffer

21.6.15.21 Tabela de mensagens de erro ndbinfo

21.6.15.22 Tabela ndbinfo locks\_per\_fragment

21.6.15.23 A tabela ndbinfo logbuffers

21.6.15.24 A tabela ndbinfo logspaces

21.6.15.25 A tabela de associação ndbinfo

21.6.15.26 Tabela de uso de memória ndbinfo

21.6.15.27 Tabela ndbinfo memory\_per\_fragment

21.6.15.28 A tabela de nós ndbinfo

21.6.15.29 A tabela ndbinfo operations\_per\_fragment

21.6.15.30 Processos da ndbinfo que processam a tabela

21.6.15.31 A tabela de recursos ndbinfo

21.6.15.32 Tabela ndbinfo restart\_info

21.6.15.33 A tabela ndbinfo server\_locks

21.6.15.34 Tabela de operações do servidor ndbinfo

21.6.15.35 A tabela server\_transactions do ndbinfo

21.6.15.36 A tabela ndbinfo table\_distribution\_status

21.6.15.37 A tabela ndbinfo table\_fragments

21.6.15.38 A tabela ndbinfo table\_info

21.6.15.39 A tabela ndbinfo table\_replicas

21.6.15.40 A tabela ndbinfo tc\_time\_track\_stats

21.6.15.41 Bloqueios de threads ndbinfo da tabela

21.6.15.42 Tabela de threads ndbinfo

21.6.15.43 Tabela threadstat do ndbinfo

21.6.15.44 A tabela de transportadores ndbinfo

`ndbinfo` é um banco de dados que contém informações específicas para o NDB Cluster.

Este banco de dados contém várias tabelas, cada uma fornecendo um tipo diferente de dados sobre o status do nó do NDB Cluster, uso de recursos e operações. Você pode encontrar informações mais detalhadas sobre cada uma dessas tabelas nas próximas seções.

O `ndbinfo` está incluído com o suporte ao NDB Cluster no MySQL Server; não são necessários passos de compilação ou configuração especiais; as tabelas são criadas pelo MySQL Server quando ele se conecta ao cluster. Você pode verificar se o suporte ao `ndbinfo` está ativo em uma instância específica do MySQL Server usando `SHOW PLUGINS`; se o suporte ao `ndbinfo` estiver habilitado, você deve ver uma linha contendo `ndbinfo` na coluna `Nome` e `ACTIVE` na coluna `Status`, conforme mostrado aqui (texto em negrito):

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

Você também pode fazer isso verificando a saída de `SHOW ENGINES` em busca de uma linha que inclua `ndbinfo` na coluna `Engine` e `YES` na coluna `Support`, conforme mostrado aqui (texto em destaque):

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

Se o suporte ao `ndbinfo` estiver habilitado, você pode acessar o `ndbinfo` usando instruções SQL no **mysql** ou em outro cliente MySQL. Por exemplo, você pode ver o `ndbinfo` listado na saída de `SHOW DATABASES`, como mostrado aqui (texto destacado):

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

Se o processo **mysqld** não foi iniciado com a opção `--ndbcluster`, o `ndbinfo` não está disponível e não é exibido pelo `SHOW DATABASES`. Se o **mysqld** estava anteriormente conectado a um NDB Cluster, mas o cluster se torna indisponível (devido a eventos como desligamento do cluster, perda de conectividade de rede, etc.), o `ndbinfo` e suas tabelas permanecem visíveis, mas uma tentativa de acessar qualquer tabela (exceto `blocks` ou `config_params`) falha com o erro 157 'Conexão ao NDB falhou' do NDBINFO.

Com exceção das tabelas `blocks` e `config_params`, o que chamamos de "tabelas" `ndbinfo` são na verdade vistas geradas a partir de tabelas internas `NDB` (mysql-cluster.html) que normalmente não são visíveis para o MySQL Server. Você pode tornar essas tabelas visíveis definindo a variável de sistema `ndbinfo_show_hidden` para `ON` (ou `1`), mas isso normalmente não é necessário.

Todas as tabelas `ndbinfo` são de leitura somente e são geradas sob demanda quando consultadas. Como muitas delas são geradas em paralelo pelos nós de dados, enquanto outras são específicas para um determinado nó SQL, não é garantido que elas forneçam uma visão consistente.

Além disso, a redução de junções não é suportada em tabelas `ndbinfo`; portanto, a junção de grandes tabelas `ndbinfo` pode exigir a transferência de uma grande quantidade de dados para o nó da API solicitante, mesmo quando a consulta utiliza uma cláusula `WHERE`.

As tabelas `ndbinfo` não são incluídas no cache de consultas. (Bug #59831)

Você pode selecionar o banco de dados `ndbinfo` com a instrução `USE` e, em seguida, emitir a instrução `SHOW TABLES` para obter uma lista de tabelas, assim como para qualquer outro banco de dados, da seguinte forma:

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

No NDB 7.5.0 (e versões posteriores), todas as tabelas `ndbinfo` usam o mecanismo de armazenamento `NDB`; no entanto, uma entrada `ndbinfo` ainda aparece na saída de `SHOW ENGINES` e `SHOW PLUGINS`, conforme descrito anteriormente.

A tabela `config_values` foi adicionada no NDB 7.5.0.

As tabelas `cpustat`, `cpustat_50ms`, `cpustat_1sec`, `cpustat_20sec` e `threads` foram adicionadas no NDB 7.5.2.

As tabelas `[cluster_locks]` (mysql-cluster-ndbinfo-cluster-locks.html), `[locks_per_fragment]` (mysql-cluster-ndbinfo-locks-per-fragment.html) e `[server_locks]` (mysql-cluster-ndbinfo-server-locks.html) foram adicionadas no NDB 7.5.3.

As tabelas `dict_obj_info`, `table_distribution_status`, `table_fragments`, `table_info` e `table_replicas` foram adicionadas no NDB 7.5.4.

As tabelas `config_nodes` e `processes` foram adicionadas no NDB 7.5.7.

A tabela `error_messages` foi adicionada no NDB 7.6.

Você pode executar instruções `SELECT` nessas tabelas, da mesma forma que você normalmente esperaria:

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

Consultas mais complexas, como as duas seguintes instruções `SELECT` usando a tabela `memoryusage`, são possíveis:

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

Os nomes da tabela `ndbinfo` e das colunas são sensíveis a maiúsculas e minúsculas (assim como o nome da própria base de dados `ndbinfo`). Esses identificadores são em minúsculas. Tentar usar a letra errada resulta em um erro, como mostrado neste exemplo:

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

**mysqldump** ignora completamente o banco de dados `ndbinfo` e o exclui de qualquer saída. Isso é verdadeiro mesmo quando você usa a opção `--databases` ou `--all-databases`.

O NDB Cluster também mantém tabelas no banco de dados de informações `INFORMATION_SCHEMA`, incluindo a tabela `FILES`, que contém informações sobre os arquivos usados para o armazenamento de dados do NDB Cluster, e a tabela `ndb_transid_mysql_connection_map`, que mostra as relações entre transações, coordenadores de transações e nós da API do NDB Cluster. Para mais informações, consulte as descrições das tabelas ou Seção 21.6.16, “Tabelas INFORMATION\_SCHEMA para NDB Cluster”.
