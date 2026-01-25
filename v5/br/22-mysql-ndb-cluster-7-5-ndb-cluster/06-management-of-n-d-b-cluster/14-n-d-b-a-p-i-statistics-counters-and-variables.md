### 21.6.14 Contadores e Variáveis de Estatísticas da API NDB

Uma série de tipos de contadores estatísticos relacionados a ações executadas por ou que afetam objetos [`Ndb`](/doc/ndbapi/en/ndb-ndb.html) estão disponíveis. Tais ações incluem iniciar e fechar (ou abortar) Transactions; operações de Primary Key e Unique Key; Table, Range e Pruned Scans; Threads bloqueadas enquanto aguardam a conclusão de várias operações; e dados e Events enviados e recebidos pelo `NDBCLUSTER`. Os contadores são incrementados dentro do kernel NDB sempre que chamadas da API NDB são feitas ou dados são enviados ou recebidos pelos Data Nodes. O [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") expõe esses contadores como System Status Variables; seus valores podem ser lidos na saída do [`SHOW STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), ou consultando as tabelas [`SESSION_STATUS`](information-schema-status-table.html "24.3.10 The INFORMATION_SCHEMA GLOBAL_STATUS and SESSION_STATUS Tables") ou [`GLOBAL_STATUS`](information-schema-status-table.html "24.3.10 The INFORMATION_SCHEMA GLOBAL_STATUS and SESSION_STATUS Tables") do Information Schema. Comparando os valores antes e depois de Statements que operam em tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), você pode observar as ações correspondentes realizadas no nível da API e, portanto, o custo de execução do Statement.

Você pode listar todas essas Status Variables usando o seguinte Statement [`SHOW STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"):

```sql
mysql> SHOW STATUS LIKE 'ndb_api%';
+----------------------------------------------+-------------+
| Variable_name                                | Value       |
+----------------------------------------------+-------------+
| Ndb_api_wait_exec_complete_count             | 2           |
| Ndb_api_wait_scan_result_count               | 3           |
| Ndb_api_wait_meta_request_count              | 101         |
| Ndb_api_wait_nanos_count                     | 83664697215 |
| Ndb_api_bytes_sent_count                     | 13608       |
| Ndb_api_bytes_received_count                 | 142800      |
| Ndb_api_trans_start_count                    | 2           |
| Ndb_api_trans_commit_count                   | 1           |
| Ndb_api_trans_abort_count                    | 0           |
| Ndb_api_trans_close_count                    | 2           |
| Ndb_api_pk_op_count                          | 1           |
| Ndb_api_uk_op_count                          | 0           |
| Ndb_api_table_scan_count                     | 1           |
| Ndb_api_range_scan_count                     | 0           |
| Ndb_api_pruned_scan_count                    | 0           |
| Ndb_api_scan_batch_count                     | 0           |
| Ndb_api_read_row_count                       | 1           |
| Ndb_api_trans_local_read_row_count           | 1           |
| Ndb_api_adaptive_send_forced_count           | 0           |
| Ndb_api_adaptive_send_unforced_count         | 3           |
| Ndb_api_adaptive_send_deferred_count         | 0           |
| Ndb_api_event_data_count                     | 0           |
| Ndb_api_event_nondata_count                  | 0           |
| Ndb_api_event_bytes_count                    | 0           |
| Ndb_api_wait_exec_complete_count_slave       | 0           |
| Ndb_api_wait_scan_result_count_slave         | 0           |
| Ndb_api_wait_meta_request_count_slave        | 0           |
| Ndb_api_wait_nanos_count_slave               | 0           |
| Ndb_api_bytes_sent_count_slave               | 0           |
| Ndb_api_bytes_received_count_slave           | 0           |
| Ndb_api_trans_start_count_slave              | 0           |
| Ndb_api_trans_commit_count_slave             | 0           |
| Ndb_api_trans_abort_count_slave              | 0           |
| Ndb_api_trans_close_count_slave              | 0           |
| Ndb_api_pk_op_count_slave                    | 0           |
| Ndb_api_uk_op_count_slave                    | 0           |
| Ndb_api_table_scan_count_slave               | 0           |
| Ndb_api_range_scan_count_slave               | 0           |
| Ndb_api_pruned_scan_count_slave              | 0           |
| Ndb_api_scan_batch_count_slave               | 0           |
| Ndb_api_read_row_count_slave                 | 0           |
| Ndb_api_trans_local_read_row_count_slave     | 0           |
| Ndb_api_adaptive_send_forced_count_slave     | 0           |
| Ndb_api_adaptive_send_unforced_count_slave   | 0           |
| Ndb_api_adaptive_send_deferred_count_slave   | 0           |
| Ndb_api_event_data_count_injector            | 0           |
| Ndb_api_event_nondata_count_injector         | 0           |
| Ndb_api_event_bytes_count_injector           | 0           |
| Ndb_api_wait_exec_complete_count_session     | 0           |
| Ndb_api_wait_scan_result_count_session       | 0           |
| Ndb_api_wait_meta_request_count_session      | 0           |
| Ndb_api_wait_nanos_count_session             | 0           |
| Ndb_api_bytes_sent_count_session             | 0           |
| Ndb_api_bytes_received_count_session         | 0           |
| Ndb_api_trans_start_count_session            | 0           |
| Ndb_api_trans_commit_count_session           | 0           |
| Ndb_api_trans_abort_count_session            | 0           |
| Ndb_api_trans_close_count_session            | 0           |
| Ndb_api_pk_op_count_session                  | 0           |
| Ndb_api_uk_op_count_session                  | 0           |
| Ndb_api_table_scan_count_session             | 0           |
| Ndb_api_range_scan_count_session             | 0           |
| Ndb_api_pruned_scan_count_session            | 0           |
| Ndb_api_scan_batch_count_session             | 0           |
| Ndb_api_read_row_count_session               | 0           |
| Ndb_api_trans_local_read_row_count_session   | 0           |
| Ndb_api_adaptive_send_forced_count_session   | 0           |
| Ndb_api_adaptive_send_unforced_count_session | 0           |
| Ndb_api_adaptive_send_deferred_count_session | 0           |
+----------------------------------------------+-------------+
69 rows in set (0.00 sec)
```

Essas Status Variables também estão disponíveis nas tabelas [`SESSION_STATUS`](information-schema-status-table.html "24.3.10 The INFORMATION_SCHEMA GLOBAL_STATUS and SESSION_STATUS Tables") e [`GLOBAL_STATUS`](information-schema-status-table.html "24.3.10 The INFORMATION_SCHEMA GLOBAL_STATUS and SESSION_STATUS Tables") do Database `INFORMATION_SCHEMA`, conforme mostrado aqui:

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.SESSION_STATUS
    ->   WHERE VARIABLE_NAME LIKE 'ndb_api%';
+----------------------------------------------+----------------+
| VARIABLE_NAME                                | VARIABLE_VALUE |
+----------------------------------------------+----------------+
| Ndb_api_wait_exec_complete_count             | 2              |
| Ndb_api_wait_scan_result_count               | 3              |
| Ndb_api_wait_meta_request_count              | 101            |
| Ndb_api_wait_nanos_count                     | 74890499869    |
| Ndb_api_bytes_sent_count                     | 13608          |
| Ndb_api_bytes_received_count                 | 142800         |
| Ndb_api_trans_start_count                    | 2              |
| Ndb_api_trans_commit_count                   | 1              |
| Ndb_api_trans_abort_count                    | 0              |
| Ndb_api_trans_close_count                    | 2              |
| Ndb_api_pk_op_count                          | 1              |
| Ndb_api_uk_op_count                          | 0              |
| Ndb_api_table_scan_count                     | 1              |
| Ndb_api_range_scan_count                     | 0              |
| Ndb_api_pruned_scan_count                    | 0              |
| Ndb_api_scan_batch_count                     | 0              |
| Ndb_api_read_row_count                       | 1              |
| Ndb_api_trans_local_read_row_count           | 1              |
| Ndb_api_adaptive_send_forced_count           | 0              |
| Ndb_api_adaptive_send_unforced_count         | 3              |
| Ndb_api_adaptive_send_deferred_count         | 0              |
| Ndb_api_event_data_count                     | 0              |
| Ndb_api_event_nondata_count                  | 0              |
| Ndb_api_event_bytes_count                    | 0              |
| Ndb_api_wait_exec_complete_count_slave       | 0              |
| Ndb_api_wait_scan_result_count_slave         | 0              |
| Ndb_api_wait_meta_request_count_slave        | 0              |
| Ndb_api_wait_nanos_count_slave               | 0              |
| Ndb_api_bytes_sent_count_slave               | 0              |
| Ndb_api_bytes_received_count_slave           | 0              |
| Ndb_api_trans_start_count_slave              | 0              |
| Ndb_api_trans_commit_count_slave             | 0              |
| Ndb_api_trans_abort_count_slave              | 0              |
| Ndb_api_trans_close_count_slave              | 0              |
| Ndb_api_pk_op_count_slave                    | 0              |
| Ndb_api_uk_op_count_slave                    | 0              |
| Ndb_api_table_scan_count_slave               | 0              |
| Ndb_api_range_scan_count_slave               | 0              |
| Ndb_api_pruned_scan_count_slave              | 0              |
| Ndb_api_scan_batch_count_slave               | 0              |
| Ndb_api_read_row_count_slave                 | 0              |
| Ndb_api_trans_local_read_row_count_slave     | 0              |
| Ndb_api_adaptive_send_forced_count_slave     | 0              |
| Ndb_api_adaptive_send_unforced_count_slave   | 0              |
| Ndb_api_adaptive_send_deferred_count_slave   | 0              |
| Ndb_api_event_data_count_injector            | 0              |
| Ndb_api_event_nondata_count_injector         | 0              |
| Ndb_api_event_bytes_count_injector           | 0              |
| Ndb_api_wait_exec_complete_count_session     | 0              |
| Ndb_api_wait_scan_result_count_session       | 0              |
| Ndb_api_wait_meta_request_count_session      | 0              |
| Ndb_api_wait_nanos_count_session             | 0              |
| Ndb_api_bytes_sent_count_session             | 0              |
| Ndb_api_bytes_received_count_session         | 0              |
| Ndb_api_trans_start_count_session            | 0              |
| Ndb_api_trans_commit_count_session           | 0              |
| Ndb_api_trans_abort_count_session            | 0              |
| Ndb_api_trans_close_count_session            | 0              |
| Ndb_api_pk_op_count_session                  | 0              |
| Ndb_api_uk_op_count_session                  | 0              |
| Ndb_api_table_scan_count_session             | 0              |
| Ndb_api_range_scan_count_session             | 0              |
| Ndb_api_pruned_scan_count_session            | 0              |
| Ndb_api_scan_batch_count_session             | 0              |
| Ndb_api_read_row_count_session               | 0              |
| Ndb_api_trans_local_read_row_count_session   | 0              |
| Ndb_api_adaptive_send_forced_count_session   | 0              |
| Ndb_api_adaptive_send_unforced_count_session | 0              |
| Ndb_api_adaptive_send_deferred_count_session | 0              |
+----------------------------------------------+----------------+
69 rows in set (0.00 sec)

mysql> SELECT * FROM INFORMATION_SCHEMA.GLOBAL_STATUS
    ->     WHERE VARIABLE_NAME LIKE 'ndb_api%';
+----------------------------------------------+----------------+
| VARIABLE_NAME                                | VARIABLE_VALUE |
+----------------------------------------------+----------------+
| Ndb_api_wait_exec_complete_count             | 2              |
| Ndb_api_wait_scan_result_count               | 3              |
| Ndb_api_wait_meta_request_count              | 101            |
| Ndb_api_wait_nanos_count                     | 13640285623    |
| Ndb_api_bytes_sent_count                     | 13608          |
| Ndb_api_bytes_received_count                 | 142800         |
| Ndb_api_trans_start_count                    | 2              |
| Ndb_api_trans_commit_count                   | 1              |
| Ndb_api_trans_abort_count                    | 0              |
| Ndb_api_trans_close_count                    | 2              |
| Ndb_api_pk_op_count                          | 1              |
| Ndb_api_uk_op_count                          | 0              |
| Ndb_api_table_scan_count                     | 1              |
| Ndb_api_range_scan_count                     | 0              |
| Ndb_api_pruned_scan_count                    | 0              |
| Ndb_api_scan_batch_count                     | 0              |
| Ndb_api_read_row_count                       | 1              |
| Ndb_api_trans_local_read_row_count           | 1              |
| Ndb_api_adaptive_send_forced_count           | 0              |
| Ndb_api_adaptive_send_unforced_count         | 3              |
| Ndb_api_adaptive_send_deferred_count         | 0              |
| Ndb_api_event_data_count                     | 0              |
| Ndb_api_event_nondata_count                  | 0              |
| Ndb_api_event_bytes_count                    | 0              |
| Ndb_api_wait_exec_complete_count_slave       | 0              |
| Ndb_api_wait_scan_result_count_slave         | 0              |
| Ndb_api_wait_meta_request_count_slave        | 0              |
| Ndb_api_wait_nanos_count_slave               | 0              |
| Ndb_api_bytes_sent_count_slave               | 0              |
| Ndb_api_bytes_received_count_slave           | 0              |
| Ndb_api_trans_start_count_slave              | 0              |
| Ndb_api_trans_commit_count_slave             | 0              |
| Ndb_api_trans_abort_count_slave              | 0              |
| Ndb_api_trans_close_count_slave              | 0              |
| Ndb_api_pk_op_count_slave                    | 0              |
| Ndb_api_uk_op_count_slave                    | 0              |
| Ndb_api_table_scan_count_slave               | 0              |
| Ndb_api_range_scan_count_slave               | 0              |
| Ndb_api_pruned_scan_count_slave              | 0              |
| Ndb_api_scan_batch_count_slave               | 0              |
| Ndb_api_read_row_count_slave                 | 0              |
| Ndb_api_trans_local_read_row_count_slave     | 0              |
| Ndb_api_adaptive_send_forced_count_slave     | 0              |
| Ndb_api_adaptive_send_unforced_count_slave   | 0              |
| Ndb_api_adaptive_send_deferred_count_slave   | 0              |
| Ndb_api_event_data_count_injector            | 0              |
| Ndb_api_event_nondata_count_injector         | 0              |
| Ndb_api_event_bytes_count_injector           | 0              |
| Ndb_api_wait_exec_complete_count_session     | 0              |
| Ndb_api_wait_scan_result_count_session       | 0              |
| Ndb_api_wait_meta_request_count_session      | 0              |
| Ndb_api_wait_nanos_count_session             | 0              |
| Ndb_api_bytes_sent_count_session             | 0              |
| Ndb_api_bytes_received_count_session         | 0              |
| Ndb_api_trans_start_count_session            | 0              |
| Ndb_api_trans_commit_count_session           | 0              |
| Ndb_api_trans_abort_count_session            | 0              |
| Ndb_api_trans_close_count_session            | 0              |
| Ndb_api_pk_op_count_session                  | 0              |
| Ndb_api_uk_op_count_session                  | 0              |
| Ndb_api_table_scan_count_session             | 0              |
| Ndb_api_range_scan_count_session             | 0              |
| Ndb_api_pruned_scan_count_session            | 0              |
| Ndb_api_scan_batch_count_session             | 0              |
| Ndb_api_read_row_count_session               | 0              |
| Ndb_api_trans_local_read_row_count_session   | 0              |
| Ndb_api_adaptive_send_forced_count_session   | 0              |
| Ndb_api_adaptive_send_unforced_count_session | 0              |
| Ndb_api_adaptive_send_deferred_count_session | 0              |
+----------------------------------------------+----------------+
69 rows in set (0.01 sec)
```

Cada objeto [`Ndb`](/doc/ndbapi/en/ndb-ndb.html) possui seus próprios contadores. Aplicações da API NDB podem ler os valores dos contadores para uso em otimização ou monitoramento. Para Clientes multithreaded que usam mais de um objeto [`Ndb`](/doc/ndbapi/en/ndb-ndb.html) concorrentemente, também é possível obter uma visualização somada dos contadores de todos os objetos [`Ndb`](/doc/ndbapi/en/ndb-ndb.html) pertencentes a uma determinada [`Ndb_cluster_connection`](/doc/ndbapi/en/ndb-ndb-cluster-connection.html).

Quatro conjuntos desses contadores são expostos. Um conjunto se aplica apenas à Session atual; os outros 3 são Global. *Isto ocorre apesar do fato de que seus valores podem ser obtidos como Status Variables de Session ou Global no Cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client")*. Isso significa que especificar a palavra-chave `SESSION` ou `GLOBAL` com [`SHOW STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") não tem efeito sobre os valores reportados para as Status Variables de estatísticas da API NDB, e o valor para cada uma dessas variáveis é o mesmo, seja o valor obtido da coluna equivalente da tabela [`SESSION_STATUS`](information-schema-status-table.html "24.3.10 The INFORMATION_SCHEMA GLOBAL_STATUS and SESSION_STATUS Tables") ou da tabela [`GLOBAL_STATUS`](information-schema-status-table.html "24.3.10 The INFORMATION_SCHEMA GLOBAL_STATUS and SESSION_STATUS Tables").

* *Session counters (específicos da Session)*

  Contadores de Session se relacionam aos objetos [`Ndb`](/doc/ndbapi/en/ndb-ndb.html) em uso (apenas) pela Session atual. O uso de tais objetos por outros Clientes MySQL não influencia essas contagens.

  Para minimizar confusão com as variáveis de Session padrão do MySQL, referimo-nos às variáveis que correspondem a esses contadores de Session da API NDB como “variáveis `_session`”, com um underscore inicial.

* *Replica counters (Global)*

  Este conjunto de contadores se relaciona aos objetos [`Ndb`](/doc/ndbapi/en/ndb-ndb.html) usados pelo Thread SQL do Replica, se houver. Se este [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") não atua como um Replica, ou não usa tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), todos esses contadores são 0.

  Nós nos referimos às Status Variables relacionadas como “variáveis `_slave`” (com um underscore inicial).

* *Injector counters (Global)*

  Contadores do Injector se relacionam ao objeto [`Ndb`](/doc/ndbapi/en/ndb-ndb.html) usado para escutar Events do Cluster pelo Thread Binary Log Injector. Mesmo quando não está escrevendo um Binary Log, processos [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") anexados a um NDB Cluster continuam a escutar alguns Events, como mudanças de Schema.

  Nós nos referimos às Status Variables que correspondem aos contadores do Injector da API NDB como “variáveis `_injector`” (com um underscore inicial).

* *Server (Global) counters (Global)*

  Este conjunto de contadores se relaciona a todos os objetos [`Ndb`](/doc/ndbapi/en/ndb-ndb.html) atualmente usados por este [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"). Isso inclui todas as aplicações Cliente MySQL, o Thread SQL do Replica (se houver), o binlog injector e o Thread de utilidade [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6").

  Nós nos referimos às Status Variables que correspondem a esses contadores como “variáveis Global” ou “variáveis de nível [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server")”.

Você pode obter valores para um conjunto específico de variáveis filtrando adicionalmente pela substring `session`, `slave`, ou `injector` no nome da variável (junto com o prefixo comum `Ndb_api`). Para variáveis `_session`, isso pode ser feito conforme mostrado aqui:

```sql
mysql> SHOW STATUS LIKE 'ndb_api%session';
+--------------------------------------------+---------+
| Variable_name                              | Value   |
+--------------------------------------------+---------+
| Ndb_api_wait_exec_complete_count_session   | 2       |
| Ndb_api_wait_scan_result_count_session     | 0       |
| Ndb_api_wait_meta_request_count_session    | 1       |
| Ndb_api_wait_nanos_count_session           | 8144375 |
| Ndb_api_bytes_sent_count_session           | 68      |
| Ndb_api_bytes_received_count_session       | 84      |
| Ndb_api_trans_start_count_session          | 1       |
| Ndb_api_trans_commit_count_session         | 1       |
| Ndb_api_trans_abort_count_session          | 0       |
| Ndb_api_trans_close_count_session          | 1       |
| Ndb_api_pk_op_count_session                | 1       |
| Ndb_api_uk_op_count_session                | 0       |
| Ndb_api_table_scan_count_session           | 0       |
| Ndb_api_range_scan_count_session           | 0       |
| Ndb_api_pruned_scan_count_session          | 0       |
| Ndb_api_scan_batch_count_session           | 0       |
| Ndb_api_read_row_count_session             | 1       |
| Ndb_api_trans_local_read_row_count_session | 1       |
+--------------------------------------------+---------+
18 rows in set (0.50 sec)
```

Para obter uma listagem das Status Variables de nível [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") da API NDB, filtre por nomes de variáveis que começam com `ndb_api` e terminam em `_count`, assim:

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.SESSION_STATUS
    ->     WHERE VARIABLE_NAME LIKE 'ndb_api%count';
+------------------------------------+----------------+
| VARIABLE_NAME                      | VARIABLE_VALUE |
+------------------------------------+----------------+
| NDB_API_WAIT_EXEC_COMPLETE_COUNT   | 4              |
| NDB_API_WAIT_SCAN_RESULT_COUNT     | 3              |
| NDB_API_WAIT_META_REQUEST_COUNT    | 28             |
| NDB_API_WAIT_NANOS_COUNT           | 53756398       |
| NDB_API_BYTES_SENT_COUNT           | 1060           |
| NDB_API_BYTES_RECEIVED_COUNT       | 9724           |
| NDB_API_TRANS_START_COUNT          | 3              |
| NDB_API_TRANS_COMMIT_COUNT         | 2              |
| NDB_API_TRANS_ABORT_COUNT          | 0              |
| NDB_API_TRANS_CLOSE_COUNT          | 3              |
| NDB_API_PK_OP_COUNT                | 2              |
| NDB_API_UK_OP_COUNT                | 0              |
| NDB_API_TABLE_SCAN_COUNT           | 1              |
| NDB_API_RANGE_SCAN_COUNT           | 0              |
| NDB_API_PRUNED_SCAN_COUNT          | 0              |
| NDB_API_SCAN_BATCH_COUNT           | 0              |
| NDB_API_READ_ROW_COUNT             | 2              |
| NDB_API_TRANS_LOCAL_READ_ROW_COUNT | 2              |
| NDB_API_EVENT_DATA_COUNT           | 0              |
| NDB_API_EVENT_NONDATA_COUNT        | 0              |
| NDB_API_EVENT_BYTES_COUNT          | 0              |
+------------------------------------+----------------+
21 rows in set (0.09 sec)
```

Nem todos os contadores são refletidos nos 4 conjuntos de Status Variables. Para os contadores de Event `DataEventsRecvdCount`, `NondataEventsRecvdCount` e `EventBytesRecvdCount`, apenas as Status Variables da API NDB `_injector` e de nível [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") estão disponíveis:

```sql
mysql> SHOW STATUS LIKE 'ndb_api%event%';
+--------------------------------------+-------+
| Variable_name                        | Value |
+--------------------------------------+-------+
| Ndb_api_event_data_count_injector    | 0     |
| Ndb_api_event_nondata_count_injector | 0     |
| Ndb_api_event_bytes_count_injector   | 0     |
| Ndb_api_event_data_count             | 0     |
| Ndb_api_event_nondata_count          | 0     |
| Ndb_api_event_bytes_count            | 0     |
+--------------------------------------+-------+
6 rows in set (0.00 sec)
```

As Status Variables `_injector` não são implementadas para quaisquer outros contadores da API NDB, conforme mostrado aqui:

```sql
mysql> SHOW STATUS LIKE 'ndb_api%injector%';
+--------------------------------------+-------+
| Variable_name                        | Value |
+--------------------------------------+-------+
| Ndb_api_event_data_count_injector    | 0     |
| Ndb_api_event_nondata_count_injector | 0     |
| Ndb_api_event_bytes_count_injector   | 0     |
+--------------------------------------+-------+
3 rows in set (0.00 sec)
```

Os nomes das Status Variables podem ser facilmente associados aos nomes dos contadores correspondentes. Cada contador estatístico da API NDB é listado na tabela a seguir com uma descrição, bem como os nomes de quaisquer Status Variables do MySQL Server correspondentes a este contador.

**Table 21.61 Contadores de estatísticas da API NDB**

<table><col style="width: 30%"/><col style="width: 35%"/><col style="width: 40%"/><thead><tr> <th>Nome do Contador</th> <th>Descrição</th> <th>Status Variables (por tipo estatístico): <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> Session </p></li><li class="listitem"><p> Slave (Replica) </p></li><li class="listitem"><p> Injector </p></li><li class="listitem"><p> Server </p></li></ul> </div> </th> </tr></thead><tbody><tr> <th><code>WaitExecCompleteCount</code></th> <td>Número de vezes que o Thread foi bloqueado enquanto aguardava a conclusão da execução de uma operação. Inclui todas as chamadas <code>execute()</code> bem como executes implícitos para operações BLOB e auto-increment não visíveis aos Clients.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <code>Ndb_api_wait_exec_complete_count_session</code> </p></li><li class="listitem"><p> <code>Ndb_api_wait_exec_complete_count_slave</code> </p></li><li class="listitem"><p> [none] </p></li><li class="listitem"><p> <code>Ndb_api_wait_exec_complete_count</code> </p></li></ul> </div> </td> </tr><tr> <th><code>WaitScanResultCount</code></th> <td>Número de vezes que o Thread foi bloqueado enquanto aguardava um signal baseado em Scan, como esperar por resultados adicionais, ou pelo fechamento de um Scan.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <code>Ndb_api_wait_scan_result_count_session</code> </p></li><li class="listitem"><p> <code>Ndb_api_wait_scan_result_count_slave</code> </p></li><li class="listitem"><p> [none] </p></li><li class="listitem"><p> <code>Ndb_api_wait_scan_result_count</code> </p></li></ul> </div> </td> </tr><tr> <th><code>WaitMetaRequestCount</code></th> <td>Número de vezes que o Thread foi bloqueado aguardando um signal baseado em metadata; isso pode ocorrer ao aguardar uma operação DDL ou para um epoch ser iniciado (ou finalizado).</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <code>Ndb_api_wait_meta_request_count_session</code> </p></li><li class="listitem"><p> <code>Ndb_api_wait_meta_request_count_slave</code> </p></li><li class="listitem"><p> [none] </p></li><li class="listitem"><p> <code>Ndb_api_wait_meta_request_count</code> </p></li></ul> </div> </td> </tr><tr> <th><code>WaitNanosCount</code></th> <td>Tempo total (em nanosegundos) gasto aguardando algum tipo de signal dos Data Nodes.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <code>Ndb_api_wait_nanos_count_session</code> </p></li><li class="listitem"><p> <code>Ndb_api_wait_nanos_count_slave</code> </p></li><li class="listitem"><p> [none] </p></li><li class="listitem"><p> <code>Ndb_api_wait_nanos_count</code> </p></li></ul> </div> </td> </tr><tr> <th><code>BytesSentCount</code></th> <td>Quantidade de dados (em bytes) enviada aos Data Nodes</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <code>Ndb_api_bytes_sent_count_session</code> </p></li><li class="listitem"><p> <code>Ndb_api_bytes_sent_count_slave</code> </p></li><li class="listitem"><p> [none] </p></li><li class="listitem"><p> <code>Ndb_api_bytes_sent_count</code> </p></li></ul> </div> </td> </tr><tr> <th><code>BytesRecvdCount</code></th> <td>Quantidade de dados (em bytes) recebida dos Data Nodes</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <code>Ndb_api_bytes_received_count_session</code> </p></li><li class="listitem"><p> <code>Ndb_api_bytes_received_count_slave</code> </p></li><li class="listitem"><p> [none] </p></li><li class="listitem"><p> <code>Ndb_api_bytes_received_count</code> </p></li></ul> </div> </td> </tr><tr> <th><code>TransStartCount</code></th> <td>Número de Transactions iniciadas.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <code>Ndb_api_trans_start_count_session</code> </p></li><li class="listitem"><p> <code>Ndb_api_trans_start_count_slave</code> </p></li><li class="listitem"><p> [none] </p></li><li class="listitem"><p> <code>Ndb_api_trans_start_count</code> </p></li></ul> </div> </td> </tr><tr> <th><code>TransCommitCount</code></th> <td>Número de Transactions committed.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <code>Ndb_api_trans_commit_count_session</code> </p></li><li class="listitem"><p> <code>Ndb_api_trans_commit_count_slave</code> </p></li><li class="listitem"><p> [none] </p></li><li class="listitem"><p> <code>Ndb_api_trans_commit_count</code> </p></li></ul> </div> </td> </tr><tr> <th><code>TransAbortCount</code></th> <td>Número de Transactions aborted.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <code>Ndb_api_trans_abort_count_session</code> </p></li><li class="listitem"><p> <code>Ndb_api_trans_abort_count_slave</code> </p></li><li class="listitem"><p> [none] </p></li><li class="listitem"><p> <code>Ndb_api_trans_abort_count</code> </p></li></ul> </div> </td> </tr><tr> <th><code>TransCloseCount</code></th> <td>Número de Transactions aborted. (Este valor pode ser maior do que a soma de <code>TransCommitCount</code> e <code>TransAbortCount</code>.)</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <code>Ndb_api_trans_close_count_session</code> </p></li><li class="listitem"><p> <code>Ndb_api_trans_close_count_slave</code> </p></li><li class="listitem"><p> [none] </p></li><li class="listitem"><p> <code>Ndb_api_trans_close_count</code> </p></li></ul> </div> </td> </tr><tr> <th><code>PkOpCount</code></th> <td>Número de operações baseadas ou que usam Primary Keys. Esta contagem inclui operações de tabela de parte BLOB, operações de unlocking implícitas e operações de auto-increment, bem como operações de Primary Key normalmente visíveis aos Clientes MySQL.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <code>Ndb_api_pk_op_count_session</code> </p></li><li class="listitem"><p> <code>Ndb_api_pk_op_count_slave</code> </p></li><li class="listitem"><p> [none] </p></li><li class="listitem"><p> <code>Ndb_api_pk_op_count</code> </p></li></ul> </div> </td> </tr><tr> <th><code>UkOpCount</code></th> <td>Número de operações baseadas ou que usam Unique Keys.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <code>Ndb_api_uk_op_count_session</code> </p></li><li class="listitem"><p> <code>Ndb_api_uk_op_count_slave</code> </p></li><li class="listitem"><p> [none] </p></li><li class="listitem"><p> <code>Ndb_api_uk_op_count</code> </p></li></ul> </div> </td> </tr><tr> <th><code>TableScanCount</code></th> <td>Número de Table Scans que foram iniciados. Isso inclui Scans de tabelas internas.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <code>Ndb_api_table_scan_count_session</code> </p></li><li class="listitem"><p> <code>Ndb_api_table_scan_count_slave</code> </p></li><li class="listitem"><p> [none] </p></li><li class="listitem"><p> <code>Ndb_api_table_scan_count</code> </p></li></ul> </div> </td> </tr><tr> <th><code>RangeScanCount</code></th> <td>Número de Range Scans que foram iniciados.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <code>Ndb_api_range_scan_count_session</code> </p></li><li class="listitem"><p> <code>Ndb_api_range_scan_count_slave</code> </p></li><li class="listitem"><p> [none] </p></li><li class="listitem"><p> <code>Ndb_api_range_scan_count</code> </p></li></ul> </div> </td> </tr><tr> <th><code>PrunedScanCount</code></th> <td>Número de Scans que foram reduzidos (pruned) a uma única Partition.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <code>Ndb_api_pruned_scan_count_session</code> </p></li><li class="listitem"><p> <code>Ndb_api_pruned_scan_count_slave</code> </p></li><li class="listitem"><p> [none] </p></li><li class="listitem"><p> <code>Ndb_api_pruned_scan_count</code> </p></li></ul> </div> </td> </tr><tr> <th><code>ScanBatchCount</code></th> <td>Número de batches de linhas recebidas. (Um <span class="firstterm">batch</span> neste contexto é um conjunto de resultados de Scan de um único fragment.)</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <code>Ndb_api_scan_batch_count_session</code> </p></li><li class="listitem"><p> <code>Ndb_api_scan_batch_count_slave</code> </p></li><li class="listitem"><p> [none] </p></li><li class="listitem"><p> <code>Ndb_api_scan_batch_count</code> </p></li></ul> </div> </td> </tr><tr> <th><code>ReadRowCount</code></th> <td>Número total de linhas que foram lidas. Inclui linhas lidas usando operações de Primary Key, Unique Key e Scan.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <code>Ndb_api_read_row_count_session</code> </p></li><li class="listitem"><p> <code>Ndb_api_read_row_count_slave</code> </p></li><li class="listitem"><p> [none] </p></li><li class="listitem"><p> <code>Ndb_api_read_row_count</code> </p></li></ul> </div> </td> </tr><tr> <th><code>TransLocalReadRowCount</code></th> <td>Número de linhas lidas do mesmo Data Node no qual a Transaction estava sendo executada.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <code>Ndb_api_trans_local_read_row_count_session</code> </p></li><li class="listitem"><p> <code>Ndb_api_trans_local_read_row_count_slave</code> </p></li><li class="listitem"><p> [none] </p></li><li class="listitem"><p> <code>Ndb_api_trans_local_read_row_count</code> </p></li></ul> </div> </td> </tr><tr> <th><code>DataEventsRecvdCount</code></th> <td>Número de eventos de alteração de linha (row change events) recebidos.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> [none] </p></li><li class="listitem"><p> [none] </p></li><li class="listitem"><p> <code>Ndb_api_event_data_count_injector</code> </p></li><li class="listitem"><p> <code>Ndb_api_event_data_count</code> </p></li></ul> </div> </td> </tr><tr> <th><code>NondataEventsRecvdCount</code></th> <td>Número de eventos recebidos, exceto eventos de alteração de linha.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> [none] </p></li><li class="listitem"><p> [none] </p></li><li class="listitem"><p> <code>Ndb_api_event_nondata_count_injector</code> </p></li><li class="listitem"><p> <code>Ndb_api_event_nondata_count</code> </p></li></ul> </div> </td> </tr><tr> <th><code>EventBytesRecvdCount</code></th> <td>Número de bytes de eventos recebidos.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> [none] </p></li><li class="listitem"><p> [none] </p></li><li class="listitem"><p> <code>Ndb_api_event_bytes_count_injector</code> </p></li><li class="listitem"><p> <code>Ndb_api_event_bytes_count</code> </p></li></ul> </div> </td> </tr></tbody></table>

Para ver todas as contagens de Transactions committed — ou seja, todas as Status Variables do contador `TransCommitCount` — você pode filtrar os resultados de [`SHOW STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") pela substring `trans_commit_count`, assim:

```sql
mysql> SHOW STATUS LIKE '%trans_commit_count%';
+------------------------------------+-------+
| Variable_name                      | Value |
+------------------------------------+-------+
| Ndb_api_trans_commit_count_session | 1     |
| Ndb_api_trans_commit_count_slave   | 0     |
| Ndb_api_trans_commit_count         | 2     |
+------------------------------------+-------+
3 rows in set (0.00 sec)
```

Com isso, você pode determinar que 1 Transaction foi committed na Session atual do Cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"), e 2 Transactions foram committed neste [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") desde a última vez que foi reiniciado.

Você pode ver como vários contadores da API NDB são incrementados por um determinado Statement SQL, comparando os valores das Status Variables `_session` correspondentes imediatamente antes e depois de executar o Statement. Neste exemplo, depois de obter os valores iniciais de [`SHOW STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), criamos no Database `test` uma tabela [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), chamada `t`, que possui uma única coluna:

```sql
mysql> SHOW STATUS LIKE 'ndb_api%session%';
+--------------------------------------------+--------+
| Variable_name                              | Value  |
+--------------------------------------------+--------+
| Ndb_api_wait_exec_complete_count_session   | 2      |
| Ndb_api_wait_scan_result_count_session     | 0      |
| Ndb_api_wait_meta_request_count_session    | 3      |
| Ndb_api_wait_nanos_count_session           | 820705 |
| Ndb_api_bytes_sent_count_session           | 132    |
| Ndb_api_bytes_received_count_session       | 372    |
| Ndb_api_trans_start_count_session          | 1      |
| Ndb_api_trans_commit_count_session         | 1      |
| Ndb_api_trans_abort_count_session          | 0      |
| Ndb_api_trans_close_count_session          | 1      |
| Ndb_api_pk_op_count_session                | 1      |
| Ndb_api_uk_op_count_session                | 0      |
| Ndb_api_table_scan_count_session           | 0      |
| Ndb_api_range_scan_count_session           | 0      |
| Ndb_api_pruned_scan_count_session          | 0      |
| Ndb_api_scan_batch_count_session           | 0      |
| Ndb_api_read_row_count_session             | 1      |
| Ndb_api_trans_local_read_row_count_session | 1      |
+--------------------------------------------+--------+
18 rows in set (0.00 sec)

mysql> USE test;
Database changed
mysql> CREATE TABLE t (c INT) ENGINE NDBCLUSTER;
Query OK, 0 rows affected (0.85 sec)
```

Agora você pode executar um novo Statement [`SHOW STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") e observar as mudanças, conforme mostrado aqui (com as linhas alteradas destacadas na saída):

```sql
mysql> SHOW STATUS LIKE 'ndb_api%session%';
+--------------------------------------------+-----------+
| Variable_name                              | Value     |
+--------------------------------------------+-----------+
| Ndb_api_wait_exec_complete_count_session   | 8         |
| Ndb_api_wait_scan_result_count_session     | 0         |
| Ndb_api_wait_meta_request_count_session    | 17        |
| Ndb_api_wait_nanos_count_session           | 706871709 |
| Ndb_api_bytes_sent_count_session           | 2376      |
| Ndb_api_bytes_received_count_session       | 3844      |
| Ndb_api_trans_start_count_session          | 4         |
| Ndb_api_trans_commit_count_session         | 4         |
| Ndb_api_trans_abort_count_session          | 0         |
| Ndb_api_trans_close_count_session          | 4         |
| Ndb_api_pk_op_count_session                | 6         |
| Ndb_api_uk_op_count_session                | 0         |
| Ndb_api_table_scan_count_session           | 0         |
| Ndb_api_range_scan_count_session           | 0         |
| Ndb_api_pruned_scan_count_session          | 0         |
| Ndb_api_scan_batch_count_session           | 0         |
| Ndb_api_read_row_count_session             | 2         |
| Ndb_api_trans_local_read_row_count_session | 1         |
+--------------------------------------------+-----------+
18 rows in set (0.00 sec)
```

Da mesma forma, você pode ver as alterações nos contadores de estatísticas da API NDB causadas pela inserção de uma linha em `t`: Insira a linha e, em seguida, execute o mesmo Statement [`SHOW STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") usado no exemplo anterior, conforme mostrado aqui:

```sql
mysql> INSERT INTO t VALUES (100);
Query OK, 1 row affected (0.00 sec)

mysql> SHOW STATUS LIKE 'ndb_api%session%';
+--------------------------------------------+-----------+
| Variable_name                              | Value     |
+--------------------------------------------+-----------+
| Ndb_api_wait_exec_complete_count_session   | 11        |
| Ndb_api_wait_scan_result_count_session     | 6         |
| Ndb_api_wait_meta_request_count_session    | 20        |
| Ndb_api_wait_nanos_count_session           | 707370418 |
| Ndb_api_bytes_sent_count_session           | 2724      |
| Ndb_api_bytes_received_count_session       | 4116      |
| Ndb_api_trans_start_count_session          | 7         |
| Ndb_api_trans_commit_count_session         | 6         |
| Ndb_api_trans_abort_count_session          | 0         |
| Ndb_api_trans_close_count_session          | 7         |
| Ndb_api_pk_op_count_session                | 8         |
| Ndb_api_uk_op_count_session                | 0         |
| Ndb_api_table_scan_count_session           | 1         |
| Ndb_api_range_scan_count_session           | 0         |
| Ndb_api_pruned_scan_count_session          | 0         |
| Ndb_api_scan_batch_count_session           | 0         |
| Ndb_api_read_row_count_session             | 3         |
| Ndb_api_trans_local_read_row_count_session | 2         |
+--------------------------------------------+-----------+
18 rows in set (0.00 sec)
```

Podemos fazer várias observações a partir desses resultados:

* Embora tenhamos criado `t` sem uma Primary Key explícita, 5 operações de Primary Key foram executadas ao fazê-lo (a diferença nos valores “antes” e “depois” de [`Ndb_api_pk_op_count_session`](mysql-cluster-options-variables.html#statvar_Ndb_api_pk_op_count_session), ou 6 menos 1). Isso reflete a criação da Primary Key oculta que é uma característica de todas as tabelas que usam o Storage Engine [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6").

* Comparando valores sucessivos para [`Ndb_api_wait_nanos_count_session`](mysql-cluster-options-variables.html#statvar_Ndb_api_wait_nanos_count_session), podemos ver que as operações da API NDB que implementam o Statement [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") esperaram muito mais tempo (706871709 - 820705 = 706051004 nanosegundos, ou aproximadamente 0,7 segundo) por respostas dos Data Nodes do que aquelas executadas pelo [`INSERT`](insert.html "13.2.5 INSERT Statement") (707370418 - 706871709 = 498709 ns ou aproximadamente 0,0005 segundo). Os tempos de execução relatados para esses Statements no Cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") correlacionam-se aproximadamente com esses números.

  Em plataformas sem resolução de tempo (nanosegundo) suficiente, pequenas mudanças no valor do contador NDB API `WaitNanosCount` devido a Statements SQL que são executados muito rapidamente podem nem sempre ser visíveis nos valores de [`Ndb_api_wait_nanos_count_session`](mysql-cluster-options-variables.html#statvar_Ndb_api_wait_nanos_count_session), [`Ndb_api_wait_nanos_count_slave`](mysql-cluster-options-variables.html#statvar_Ndb_api_wait_nanos_count_slave), ou [`Ndb_api_wait_nanos_count`](mysql-cluster-options-variables.html#statvar_Ndb_api_wait_nanos_count).

* O Statement [`INSERT`](insert.html "13.2.5 INSERT Statement") incrementou ambos os contadores de estatísticas da API NDB `ReadRowCount` e `TransLocalReadRowCount`, conforme refletido pelos valores aumentados de [`Ndb_api_read_row_count_session`](mysql-cluster-options-variables.html#statvar_Ndb_api_read_row_count_session) e [`Ndb_api_trans_local_read_row_count_session`](mysql-cluster-options-variables.html#statvar_Ndb_api_trans_local_read_row_count_session).
