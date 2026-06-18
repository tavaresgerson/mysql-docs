### 25.6.16 ndbinfo: A Base de Dados de Informação do NDB Cluster

25.6.16.1 A tabela ndbinfo arbitrator\_validity\_detail

25.6.16.2 A tabela ndbinfo arbitrator\_validity\_summary

25.6.16.3 A tabela ndbinfo backup\_id

25.6.16.4 A tabela ndbinfo blobs

25.6.16.5 Blocos ndbinfo da Tabela

25.6.16.6 A tabela ndbinfo cluster\_locks

25.6.16.7 A tabela ndbinfo cluster\_operations

25.6.16.8 A tabela ndbinfo cluster\_transactions

25.6.16.9 A tabela ndbinfo config\_nodes

25.6.16.10 A tabela ndbinfo config\_params

25.6.16.11 A tabela ndbinfo config\_values

25.6.16.12 Contadores ndbinfo da tabela

25.6.16.13 A tabela ndbinfo cpudata

25.6.16.14 A tabela ndbinfo cpudata\_1sec

25.6.16.15 A tabela ndbinfo cpudata\_20sec

25.6.16.16 A tabela ndbinfo cpudata\_50ms

25.6.16.17 A tabela ndbinfo cpuinfo

25.6.16.18 A tabela ndbinfo cpustat

25.6.16.19 A tabela ndbinfo cpustat\_50ms

25.6.16.20 A tabela ndbinfo cpustat\_1sec

25.6.16.21 A tabela ndbinfo cpustat\_20sec

25.6.16.22 A tabela ndbinfo dictionary\_columns

25.6.16.23 O dicionário ndbinfo\_tables Table

25.6.16.24 A tabela ndbinfo dict\_obj\_info

25.6.16.25 A tabela ndbinfo dict\_obj\_tree

25.6.16.26 A tabela ndbinfo dict\_obj\_types

25.6.16.27 A tabela ndbinfo disk\_write\_speed\_base

25.6.16.28 A tabela ndbinfo disk\_write\_speed\_aggregate

25.6.16.29 A tabela ndbinfo disk\_write\_speed\_aggregate\_node

25.6.16.30 A tabela ndbinfo diskpagebuffer

25.6.16.31 A tabela ndbinfo diskstat

25.6.16.32 A tabela ndbinfo diskstats\_1sec

25.6.16.33 A tabela de mensagens de erro ndbinfo\_error\_messages

25.6.16.34 A tabela de eventos ndbinfo

25.6.16.35 Arquivos ndbinfo Tabela

25.6.16.36 A tabela ndbinfo foreign\_keys (Chave Estrangeira ndbinfo)

25.6.16.37 A tabela ndbinfo hash\_maps

25.6.16.38 A tabela ndbinfo hwinfo

25.6.16.39 A tabela ndbinfo index\_columns

25.6.16.40 A tabela ndbinfo index\_stats

25.6.16.41 A tabela ndbinfo locks\_per\_fragment

25.6.16.42 A tabela ndbinfo logbuffers

25.6.16.43 A tabela ndbinfo logspaces

25.6.16.44 A tabela de associação ndbinfo

25.6.16.45 A tabela ndbinfo memoryusage

25.6.16.46 A tabela ndbinfo memory\_per\_fragment

25.6.16.47 A tabela de nós ndbinfo

25.6.16.48 A tabela ndbinfo operations\_per\_fragment

25.6.16.49 A tabela ndbinfo pgman\_time\_track\_stats

25.6.16.50 O ndbinfo processa a tabela

25.6.16.51 A tabela de recursos ndbinfo

25.6.16.52 A tabela ndbinfo restart\_info

25.6.16.53 A tabela ndbinfo server\_locks

25.6.16.54 A tabela Server\_operations do servidor ndbinfo

25.6.16.55 A tabela ndbinfo server\_transactions

25.6.16.56 A tabela ndbinfo table\_distribution\_status Table

25.6.16.57 A tabela ndbinfo\_table\_fragments

25.6.16.58 A tabela ndbinfo table\_info

25.6.16.59 A tabela ndbinfo table\_replicas

25.6.16.60 A tabela ndbinfo tc\_time\_track\_stats

25.6.16.61 Blocos de threads ndbinfo da tabela

25.6.16.62 A tabela de threads ndbinfo

25.6.16.63 A tabela Threadstat do ndbinfo

25.6.16.64 A tabela Transporte\_detalhes ndbinfo

25.6.16.65 A tabela de transportadores ndbinfo

`ndbinfo` é um banco de dados que contém informações específicas para o NDB Cluster.

Este banco de dados contém várias tabelas, cada uma fornecendo um tipo diferente de dados sobre o status do nó do NDB Cluster, uso de recursos e operações. Você pode encontrar informações mais detalhadas sobre cada uma dessas tabelas nas próximas seções.

O `ndbinfo` está incluído com o suporte ao NDB Cluster no MySQL Server; não são necessários passos de compilação ou configuração especiais; as tabelas são criadas pelo MySQL Server quando ele se conecta ao cluster. Você pode verificar se o suporte ao `ndbinfo` está ativo em uma instância específica do MySQL Server usando `SHOW PLUGINS`; se o suporte ao `ndbinfo` estiver habilitado, você deve ver uma linha contendo `ndbinfo` na coluna `Name` e `ACTIVE` na coluna `Status`, conforme mostrado aqui (texto em destaque):

```
mysql> SHOW PLUGINS;
+----------------------------------+--------+--------------------+---------+---------+
| Name                             | Status | Type               | Library | License |
+----------------------------------+--------+--------------------+---------+---------+
| binlog                           | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| mysql_native_password            | ACTIVE | AUTHENTICATION     | NULL    | GPL     |
| sha256_password                  | ACTIVE | AUTHENTICATION     | NULL    | GPL     |
| caching_sha2_password            | ACTIVE | AUTHENTICATION     | NULL    | GPL     |
| sha2_cache_cleaner               | ACTIVE | AUDIT              | NULL    | GPL     |
| daemon_keyring_proxy_plugin      | ACTIVE | DAEMON             | NULL    | GPL     |
| CSV                              | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| MEMORY                           | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| InnoDB                           | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| INNODB_TRX                       | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
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
| INNODB_TABLES                    | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_TABLESTATS                | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_INDEXES                   | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_TABLESPACES               | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_COLUMNS                   | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_VIRTUAL                   | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_CACHED_INDEXES            | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_SESSION_TEMP_TABLESPACES  | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| MyISAM                           | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| MRG_MYISAM                       | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| PERFORMANCE_SCHEMA               | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| TempTable                        | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| ARCHIVE                          | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| BLACKHOLE                        | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| ndbcluster                       | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| ndbinfo                          | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| ndb_transid_mysql_connection_map | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| ngram                            | ACTIVE | FTPARSER           | NULL    | GPL     |
| mysqlx_cache_cleaner             | ACTIVE | AUDIT              | NULL    | GPL     |
| mysqlx                           | ACTIVE | DAEMON             | NULL    | GPL     |
+----------------------------------+--------+--------------------+---------+---------+
47 rows in set (0.00 sec)
```

Você também pode fazer isso verificando a saída de `SHOW ENGINES` para uma linha que inclui `ndbinfo` na coluna `Engine` e `YES` na coluna `Support`, conforme mostrado aqui (texto em destaque):

```
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

Se o suporte ao `ndbinfo` estiver habilitado, você pode acessar o `ndbinfo` usando instruções SQL no **mysql** ou em outro cliente MySQL. Por exemplo, você pode ver o `ndbinfo` listado na saída do `SHOW DATABASES`, como mostrado aqui (texto em destaque):

```
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

Se o processo **mysqld** não foi iniciado com a opção `--ndbcluster`, `ndbinfo` não está disponível e não é exibido por `SHOW DATABASES`. Se **mysqld** estava anteriormente conectado a um NDB Cluster, mas o cluster se torna indisponível (devido a eventos como desligamento do cluster, perda de conectividade de rede, etc.), `ndbinfo` e suas tabelas permanecem visíveis, mas uma tentativa de acessar qualquer tabela (exceto `blocks` ou `config_params`) falha com o erro 157 'Conexão ao NDB falhou' do NDBINFO.

Com exceção das tabelas `blocks` e `config_params`, o que chamamos de "tabelas" `ndbinfo` são, na verdade, visualizações geradas a partir de tabelas internas `NDB` que normalmente não são visíveis para o MySQL Server. Você pode tornar essas tabelas visíveis definindo a variável de sistema `ndbinfo_show_hidden` para `ON` (ou `1`), mas isso normalmente não é necessário.

Todas as tabelas `ndbinfo` são de leitura somente e são geradas sob demanda quando consultadas. Como muitas delas são geradas em paralelo pelos nós de dados, enquanto outras são específicas para um determinado nó SQL, não é garantido que elas forneçam uma visão consistente.

Além disso, a redução de junções não é suportada em tabelas `ndbinfo`; portanto, a junção de grandes tabelas `ndbinfo` pode exigir a transferência de uma grande quantidade de dados para o nó de API solicitante, mesmo quando a consulta utiliza uma cláusula `WHERE`.

As tabelas `ndbinfo` não estão incluídas no cache de consultas. (Bug #59831)

Você pode selecionar o banco de dados `ndbinfo` com uma declaração `USE` e, em seguida, emitir uma declaração `SHOW TABLES` para obter uma lista de tabelas, assim como para qualquer outro banco de dados, da seguinte forma:

```
mysql> USE ndbinfo;
Database changed

mysql> SHOW TABLES;
+---------------------------------+
| Tables_in_ndbinfo               |
+---------------------------------+
| arbitrator_validity_detail      |
| arbitrator_validity_summary     |
| backup_id                       |
| blobs                           |
| blocks                          |
| cluster_locks                   |
| cluster_operations              |
| cluster_transactions            |
| config_nodes                    |
| config_params                   |
| config_values                   |
| counters                        |
| cpudata                         |
| cpudata_1sec                    |
| cpudata_20sec                   |
| cpudata_50ms                    |
| cpuinfo                         |
| cpustat                         |
| cpustat_1sec                    |
| cpustat_20sec                   |
| cpustat_50ms                    |
| dict_obj_info                   |
| dict_obj_tree                   |
| dict_obj_types                  |
| dictionary_columns              |
| dictionary_tables               |
| disk_write_speed_aggregate      |
| disk_write_speed_aggregate_node |
| disk_write_speed_base           |
| diskpagebuffer                  |
| diskstat                        |
| diskstats_1sec                  |
| error_messages                  |
| events                          |
| files                           |
| foreign_keys                    |
| hash_maps                       |
| hwinfo                          |
| index_columns                   |
| index_stats                     |
| locks_per_fragment              |
| logbuffers                      |
| logspaces                       |
| membership                      |
| memory_per_fragment             |
| memoryusage                     |
| nodes                           |
| operations_per_fragment         |
| pgman_time_track_stats          |
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
| transporter_details             |
| transporters                    |
+---------------------------------+
65 rows in set (0.00 sec)
```

Todas as tabelas `ndbinfo` usam o mecanismo de armazenamento `NDB`; no entanto, uma entrada `ndbinfo` ainda aparece na saída de `SHOW ENGINES` e `SHOW PLUGINS` como descrito anteriormente.

Você pode executar instruções `SELECT` nessas tabelas, da mesma forma que você normalmente esperaria:

```
mysql> SELECT * FROM memoryusage;
+---------+---------------------+--------+------------+------------+-------------+
| node_id | memory_type         | used   | used_pages | total      | total_pages |
+---------+---------------------+--------+------------+------------+-------------+
|       5 | Data memory         | 425984 |         13 | 2147483648 |       65536 |
|       5 | Long message buffer | 393216 |       1536 |   67108864 |      262144 |
|       6 | Data memory         | 425984 |         13 | 2147483648 |       65536 |
|       6 | Long message buffer | 393216 |       1536 |   67108864 |      262144 |
|       7 | Data memory         | 425984 |         13 | 2147483648 |       65536 |
|       7 | Long message buffer | 393216 |       1536 |   67108864 |      262144 |
|       8 | Data memory         | 425984 |         13 | 2147483648 |       65536 |
|       8 | Long message buffer | 393216 |       1536 |   67108864 |      262144 |
+---------+---------------------+--------+------------+------------+-------------+
8 rows in set (0.09 sec)
```

Consultas mais complexas, como as duas seguintes declarações `SELECT` usando a tabela `memoryusage`, são possíveis:

```
mysql> SELECT SUM(used) as 'Data Memory Used, All Nodes'
     >     FROM memoryusage
     >     WHERE memory_type = 'Data memory';
+-----------------------------+
| Data Memory Used, All Nodes |
+-----------------------------+
|                        6460 |
+-----------------------------+
1 row in set (0.09 sec)

mysql> SELECT SUM(used) as 'Long Message Buffer, All Nodes'
     >     FROM memoryusage
     >     WHERE memory_type = 'Long message buffer';
+-------------------------------------+
| Long Message Buffer Used, All Nodes |
+-------------------------------------+
|                             1179648 |
+-------------------------------------+
1 row in set (0.08 sec)
```

Os nomes das tabelas e colunas da tabela `ndbinfo` são sensíveis a maiúsculas e minúsculas (assim como o nome da própria base de dados `ndbinfo`). Esses identificadores são em minúsculas. Tentar usar a letra errada resulta em um erro, como mostrado neste exemplo:

```
mysql> SELECT * FROM nodes;
+---------+--------+---------+-------------+-------------------+
| node_id | uptime | status  | start_phase | config_generation |
+---------+--------+---------+-------------+-------------------+
|       5 |  17707 | STARTED |           0 |                 1 |
|       6 |  17706 | STARTED |           0 |                 1 |
|       7 |  17705 | STARTED |           0 |                 1 |
|       8 |  17704 | STARTED |           0 |                 1 |
+---------+--------+---------+-------------+-------------------+
4 rows in set (0.06 sec)

mysql> SELECT * FROM Nodes;
ERROR 1146 (42S02): Table 'ndbinfo.Nodes' doesn't exist
```

O **mysqldump** ignora completamente o banco de dados `ndbinfo` e o exclui de qualquer saída. Isso é verdadeiro mesmo quando você usa a opção `--databases` ou `--all-databases`.

O NDB Cluster também mantém tabelas no banco de dados de informações `INFORMATION_SCHEMA`, incluindo a tabela `FILES`, que contém informações sobre os arquivos usados para o armazenamento de dados do NDB Cluster, e a tabela `ndb_transid_mysql_connection_map`, que mostra as relações entre transações, coordenadores de transações e nós da API do NDB Cluster. Para mais informações, consulte as descrições das tabelas ou a Seção 25.6.17, “Tabelas INFORMATION\_SCHEMA para NDB Cluster”.
