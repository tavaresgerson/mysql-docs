### 21.6.14 Contadores e variáveis de estatísticas da API do BND

Existem vários tipos de contadores estatísticos relacionados às ações realizadas por objetos de `Ndb` ou que afetam esses objetos. Essas ações incluem iniciar e fechar (ou abortar) transações; operações de chave primária e chave única; varreduras de tabela, intervalo e poda; threads bloqueadas enquanto aguardam a conclusão de várias operações; e dados e eventos enviados e recebidos pelo `NDBCLUSTER`. Os contadores são incrementados dentro do kernel NDB sempre que chamadas da API NDB são feitas ou dados são enviados ou recebidos pelos nós de dados. **mysqld** expõe esses contadores como variáveis de status do sistema; seus valores podem ser lidos na saída de `SHOW STATUS`, ou consultando a tabela do esquema de informações `SESSION_STATUS` ou `GLOBAL_STATUS`. Ao comparar os valores antes e depois das declarações que operam sobre as tabelas de `NDB`, você pode observar as ações correspondentes tomadas no nível da API e, assim, o custo de executar a declaração.

Você pode listar todas essas variáveis de status usando a seguinte instrução `SHOW STATUS`:

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

Essas variáveis de status também estão disponíveis nas tabelas `SESSION_STATUS` e `GLOBAL_STATUS` do banco de dados `INFORMATION_SCHEMA`, conforme mostrado aqui: [information-schema-status-table.html]

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

Cada objeto `Ndb` tem seus próprios contadores. Os aplicativos da API NDB podem ler os valores dos contadores para uso na otimização ou monitoramento. Para clientes multithread que usam mais de um objeto `Ndb` simultaneamente, também é possível obter uma visão resumida dos contadores de todos os objetos `Ndb` pertencentes a uma conexão específica `Ndb_cluster_connection`.

Quatro conjuntos desses contadores estão expostos. Um conjunto se aplica apenas à sessão atual; os outros 3 são globais. \*Isso ocorre apesar do fato de que seus valores podem ser obtidos como variáveis de status de sessão ou global no cliente **mysql**. Isso significa que especificar a palavra-chave `SESSION` ou `GLOBAL` com `SHOW STATUS` não tem efeito nos valores relatados para as variáveis de status de estatísticas da API NDB, e o valor de cada uma dessas variáveis é o mesmo, independentemente de o valor ser obtido da coluna equivalente da tabela **SESSION_STATUS** ou da tabela **GLOBAL_STATUS**.

- *Contadores de sessão (específicos para sessão)*

  Os contadores de sessão se referem aos objetos `Ndb` utilizados apenas pela sessão atual. O uso desses objetos por outros clientes MySQL não influencia esses contagem.

  Para minimizar a confusão com as variáveis de sessão padrão do MySQL, referenciamos as variáveis que correspondem a esses contadores de sessão da API NDB como “variáveis `_session`”, com um sublinhado no início.

- *Mostradores de réplica (global)*

  Este conjunto de contadores está relacionado aos objetos `Ndb` usados pelo fio de SQL replicante, se houver. Se este **mysqld** não atuar como replica ou não usar tabelas `NDB`, então todos esses contagem são 0.

  Referimo-nos às variáveis de status relacionadas como "variáveis `_slave`" (com um sublinhado no início).

- *Contas de injetores (global)*

  Os contadores de injetores estão relacionados ao objeto `Ndb` usado para ouvir eventos do clúster pelo fio de injeção do log binário. Mesmo quando não está escrevendo um log binário, os **mysqld** processados ligados a um NDB Cluster continuam a ouvir alguns eventos, como mudanças de esquema.

  Nos referimos às variáveis de status que correspondem aos contabilistas do injetor da API NDB como variáveis `_injector` (com um sublinhado no início).

- *Contadores de servidor (Global)* (global)

  Este conjunto de contadores está relacionado a todos os objetos `Ndb` atualmente utilizados por este **mysqld**. Isso inclui todas as aplicações de cliente MySQL, o fio de replicação SQL (se houver), o injetor de binlog e o fio de utilitário `NDB`.

  Referimos às variáveis de status que correspondem a esses contadores como "variáveis globais" ou "variáveis de nível **mysqld**".

Você pode obter valores para um conjunto específico de variáveis filtrando adicionalmente a substring `session`, `slave` ou `injector` no nome da variável (junto com o prefixo comum `Ndb_api`). Para variáveis `_session`, isso pode ser feito conforme mostrado aqui:

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

Para obter uma lista das variáveis de status do nível da API NDB **mysqld**, filtre por nomes de variáveis que comecem com `ndb_api` e terminem com `_count`, da seguinte forma:

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

Nem todos os contadores são refletidos em todos os 4 conjuntos de variáveis de status. Para os contadores de eventos `DataEventsRecvdCount`, `NondataEventsRecvdCount` e `EventBytesRecvdCount`, estão disponíveis apenas as variáveis de status da API NDB do nível `_injector` e **mysqld**:

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

As variáveis de status do _injector não são implementadas para nenhum outro contador da API NDB, conforme mostrado aqui:

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

Os nomes das variáveis de status podem ser facilmente associados aos nomes dos respectivos contadores. Cada contador de estatísticas da API NDB está listado na tabela a seguir, com uma descrição, bem como os nomes de quaisquer variáveis de status do servidor MySQL que correspondam a esse contador.

**Tabela 21.61 Contadores de estatísticas da API do NDB**

<table><col style="width: 30%"/><col style="width: 35%"/><col style="width: 40%"/><thead><tr> <th>Nome do balcão</th> <th>Descrição</th> <th>Variáveis de status (por tipo estatístico):<div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p>Sessão</p></li><li class="listitem"><p>Escravo (repro)</p></li><li class="listitem"><p>Injetor</p></li><li class="listitem"><p>Servidor</p></li></ul> </div> </th> </tr></thead><tbody><tr> <th>[[PH_HTML_CODE_<code>Ndb_api_wait_meta_request_count_session</code>]</th> <td>Número de vezes que o fio foi bloqueado enquanto aguardava a execução de uma operação para ser concluída. Inclui todos[[PH_HTML_CODE_<code>Ndb_api_wait_meta_request_count_session</code>]chamadas, bem como execuções implícitas para operações de blob e autoincremento não visíveis para os clientes.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> [[PH_HTML_CODE_<code>Ndb_api_wait_meta_request_count</code>] </p></li><li class="listitem"><p> [[PH_HTML_CODE_<code>WaitNanosCount</code>] </p></li><li class="listitem"><p>[nenhu<code>Ndb_api_wait_meta_request_count_session</code></p></li><li class="listitem"><p> [[PH_HTML_CODE_<code>Ndb_api_wait_nanos_count_session</code>] </p></li></ul> </div> </td> </tr><tr> <th>[[PH_HTML_CODE_<code>Ndb_api_wait_nanos_count_slave</code>]</th> <td>Número de vezes que o fio foi bloqueado enquanto aguardava por um sinal baseado em varredura, como aguardar por resultados adicionais ou por uma varredura para ser concluída.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> [[PH_HTML_CODE_<code>Ndb_api_wait_nanos_count</code>] </p></li><li class="listitem"><p> [[PH_HTML_CODE_<code>BytesSentCount</code>] </p></li><li class="listitem"><p>[nenhu<code>Ndb_api_wait_meta_request_count_session</code></p></li><li class="listitem"><p> [[PH_HTML_CODE_<code>Ndb_api_bytes_sent_count_session</code>] </p></li></ul> </div> </td> </tr><tr> <th>[[PH_HTML_CODE_<code>Ndb_api_bytes_sent_count_slave</code>]</th> <td>Número de vezes que o fio foi bloqueado esperando por um sinal baseado em metadados; isso pode ocorrer ao esperar por uma operação de DDL ou por um epoke ser iniciado (ou encerrado).</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> [[<code>Ndb_api_wait_meta_request_count_session</code>]] </p></li><li class="listitem"><p> [[<code>execute()</code><code>Ndb_api_wait_meta_request_count_session</code>] </p></li><li class="listitem"><p>[nenhu<code>Ndb_api_wait_meta_request_count_session</code></p></li><li class="listitem"><p> [[<code>Ndb_api_wait_meta_request_count</code>]] </p></li></ul> </div> </td> </tr><tr> <th>[[<code>WaitNanosCount</code>]]</th> <td>Tempo total (em nanosegundos) gasto esperando por algum tipo de sinal dos nós de dados.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> [[<code>Ndb_api_wait_nanos_count_session</code>]] </p></li><li class="listitem"><p> [[<code>Ndb_api_wait_nanos_count_slave</code>]] </p></li><li class="listitem"><p>[nenhu<code>Ndb_api_wait_meta_request_count_session</code></p></li><li class="listitem"><p> [[<code>Ndb_api_wait_nanos_count</code>]] </p></li></ul> </div> </td> </tr><tr> <th>[[<code>BytesSentCount</code>]]</th> <td>Quantidade de dados (em bytes) enviados aos nós de dados</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> [[<code>Ndb_api_bytes_sent_count_session</code>]] </p></li><li class="listitem"><p> [[<code>Ndb_api_bytes_sent_count_slave</code>]] </p></li><li class="listitem"><p>[nenhu<code>Ndb_api_wait_meta_request_count_session</code></p></li><li class="listitem"><p> [[<code>Ndb_api_wait_exec_complete_count_session</code><code>Ndb_api_wait_meta_request_count_session</code>] </p></li></ul> </div> </td> </tr><tr> <th>[[<code>Ndb_api_wait_exec_complete_count_session</code><code>Ndb_api_wait_meta_request_count_session</code>]</th> <td>Quantidade de dados (em bytes) recebidos dos nós de dados</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> [[<code>Ndb_api_wait_exec_complete_count_session</code><code>Ndb_api_wait_meta_request_count</code>] </p></li><li class="listitem"><p> [[<code>Ndb_api_wait_exec_complete_count_session</code><code>WaitNanosCount</code>] </p></li><li class="listitem"><p>[nenhu<code>Ndb_api_wait_meta_request_count_session</code></p></li><li class="listitem"><p> [[<code>Ndb_api_wait_exec_complete_count_session</code><code>Ndb_api_wait_nanos_count_session</code>] </p></li></ul> </div> </td> </tr><tr> <th>[[<code>Ndb_api_wait_exec_complete_count_session</code><code>Ndb_api_wait_nanos_count_slave</code>]</th> <td>Número de transações iniciadas.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> [[<code>Ndb_api_wait_exec_complete_count_session</code><code>Ndb_api_wait_nanos_count</code>] </p></li><li class="listitem"><p> [[<code>Ndb_api_wait_exec_complete_count_session</code><code>BytesSentCount</code>] </p></li><li class="listitem"><p>[nenhu<code>Ndb_api_wait_meta_request_count_session</code></p></li><li class="listitem"><p> [[<code>Ndb_api_wait_exec_complete_count_session</code><code>Ndb_api_bytes_sent_count_session</code>] </p></li></ul> </div> </td> </tr><tr> <th>[[<code>Ndb_api_wait_exec_complete_count_session</code><code>Ndb_api_bytes_sent_count_slave</code>]</th> <td>Número de transações comprometidas.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> [[<code>Ndb_api_wait_exec_complete_count_slave</code><code>Ndb_api_wait_meta_request_count_session</code>] </p></li><li class="listitem"><p> [[<code>Ndb_api_wait_exec_complete_count_slave</code><code>Ndb_api_wait_meta_request_count_session</code>] </p></li><li class="listitem"><p>[nenhu<code>Ndb_api_wait_meta_request_count_session</code></p></li><li class="listitem"><p> [[<code>Ndb_api_wait_exec_complete_count_slave</code><code>Ndb_api_wait_meta_request_count</code>] </p></li></ul> </div> </td> </tr><tr> <th>[[<code>Ndb_api_wait_exec_complete_count_slave</code><code>WaitNanosCount</code>]</th> <td>Número de transações abortadas.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> [[<code>Ndb_api_wait_exec_complete_count_slave</code><code>Ndb_api_wait_nanos_count_session</code>] </p></li><li class="listitem"><p> [[<code>Ndb_api_wait_exec_complete_count_slave</code><code>Ndb_api_wait_nanos_count_slave</code>] </p></li><li class="listitem"><p>[nenhu<code>Ndb_api_wait_meta_request_count_session</code></p></li><li class="listitem"><p> [[<code>Ndb_api_wait_exec_complete_count_slave</code><code>Ndb_api_wait_nanos_count</code>] </p></li></ul> </div> </td> </tr><tr> <th>[[<code>Ndb_api_wait_exec_complete_count_slave</code><code>BytesSentCount</code>]</th> <td>Número de transações abortadas. (Este valor pode ser maior que a soma de [[<code>Ndb_api_wait_exec_complete_count_slave</code><code>Ndb_api_bytes_sent_count_session</code>] e [[<code>Ndb_api_wait_exec_complete_count_slave</code><code>Ndb_api_bytes_sent_count_slave</code>]).</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> [[<code>Ndb_api_wait_exec_complete_count</code><code>Ndb_api_wait_meta_request_count_session</code>] </p></li><li class="listitem"><p> [[<code>Ndb_api_wait_exec_complete_count</code><code>Ndb_api_wait_meta_request_count_session</code>] </p></li><li class="listitem"><p>[nenhu<code>Ndb_api_wait_meta_request_count_session</code></p></li><li class="listitem"><p> [[<code>Ndb_api_wait_exec_complete_count</code><code>Ndb_api_wait_meta_request_count</code>] </p></li></ul> </div> </td> </tr><tr> <th>[[<code>Ndb_api_wait_exec_complete_count</code><code>WaitNanosCount</code>]</th> <td>Número de operações baseadas em ou que utilizam chaves primárias. Esse contagem inclui operações de tabelas blob-part, operações de desbloqueio implícitas e operações de autoincremento, além das operações de chave primária normalmente visíveis aos clientes do MySQL.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> [[<code>Ndb_api_wait_exec_complete_count</code><code>Ndb_api_wait_nanos_count_session</code>] </p></li><li class="listitem"><p> [[<code>Ndb_api_wait_exec_complete_count</code><code>Ndb_api_wait_nanos_count_slave</code>] </p></li><li class="listitem"><p>[nenhu<code>Ndb_api_wait_meta_request_count_session</code></p></li><li class="listitem"><p> [[<code>Ndb_api_wait_exec_complete_count</code><code>Ndb_api_wait_nanos_count</code>] </p></li></ul> </div> </td> </tr><tr> <th>[[<code>Ndb_api_wait_exec_complete_count</code><code>BytesSentCount</code>]</th> <td>Número de operações baseadas em ou que utilizam chaves únicas.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> [[<code>Ndb_api_wait_exec_complete_count</code><code>Ndb_api_bytes_sent_count_session</code>] </p></li><li class="listitem"><p> [[<code>Ndb_api_wait_exec_complete_count</code><code>Ndb_api_bytes_sent_count_slave</code>] </p></li><li class="listitem"><p>[nenhu<code>Ndb_api_wait_meta_request_count_session</code></p></li><li class="listitem"><p> [[<code>WaitScanResultCount</code><code>Ndb_api_wait_meta_request_count_session</code>] </p></li></ul> </div> </td> </tr><tr> <th>[[<code>WaitScanResultCount</code><code>Ndb_api_wait_meta_request_count_session</code>]</th> <td>Número de varreduras de tabela que foram iniciadas. Isso inclui varreduras de tabelas internas.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> [[<code>WaitScanResultCount</code><code>Ndb_api_wait_meta_request_count</code>] </p></li><li class="listitem"><p> [[<code>WaitScanResultCount</code><code>WaitNanosCount</code>] </p></li><li class="listitem"><p>[nenhu<code>Ndb_api_wait_meta_request_count_session</code></p></li><li class="listitem"><p> [[<code>WaitScanResultCount</code><code>Ndb_api_wait_nanos_count_session</code>] </p></li></ul> </div> </td> </tr><tr> <th>[[<code>WaitScanResultCount</code><code>Ndb_api_wait_nanos_count_slave</code>]</th> <td>Número de varreduras de alcance que foram iniciadas.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> [[<code>WaitScanResultCount</code><code>Ndb_api_wait_nanos_count</code>] </p></li><li class="listitem"><p> [[<code>WaitScanResultCount</code><code>BytesSentCount</code>] </p></li><li class="listitem"><p>[nenhu<code>Ndb_api_wait_meta_request_count_session</code></p></li><li class="listitem"><p> [[<code>WaitScanResultCount</code><code>Ndb_api_bytes_sent_count_session</code>] </p></li></ul> </div> </td> </tr><tr> <th>[[<code>WaitScanResultCount</code><code>Ndb_api_bytes_sent_count_slave</code>]</th> <td>Número de varreduras que foram reduzidas a uma única partição.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> [[<code>Ndb_api_wait_scan_result_count_session</code><code>Ndb_api_wait_meta_request_count_session</code>] </p></li><li class="listitem"><p> [[<code>Ndb_api_wait_scan_result_count_session</code><code>Ndb_api_wait_meta_request_count_session</code>] </p></li><li class="listitem"><p>[nenhu<code>Ndb_api_wait_meta_request_count_session</code></p></li><li class="listitem"><p> [[<code>Ndb_api_wait_scan_result_count_session</code><code>Ndb_api_wait_meta_request_count</code>] </p></li></ul> </div> </td> </tr><tr> <th>[[<code>Ndb_api_wait_scan_result_count_session</code><code>WaitNanosCount</code>]</th> <td>Número de lotes de linhas recebidos. (A<span class="firstterm">lote</span>Neste contexto, trata-se de um conjunto de resultados de varredura de um único fragmento.)</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> [[<code>Ndb_api_wait_scan_result_count_session</code><code>Ndb_api_wait_nanos_count_session</code>] </p></li><li class="listitem"><p> [[<code>Ndb_api_wait_scan_result_count_session</code><code>Ndb_api_wait_nanos_count_slave</code>] </p></li><li class="listitem"><p>[nenhu<code>Ndb_api_wait_meta_request_count_session</code></p></li><li class="listitem"><p> [[<code>Ndb_api_wait_scan_result_count_session</code><code>Ndb_api_wait_nanos_count</code>] </p></li></ul> </div> </td> </tr><tr> <th>[[<code>Ndb_api_wait_scan_result_count_session</code><code>BytesSentCount</code>]</th> <td>Número total de linhas que foram lidas. Inclui linhas lidas usando chave primária, chave única e operações de varredura.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> [[<code>Ndb_api_wait_scan_result_count_session</code><code>Ndb_api_bytes_sent_count_session</code>] </p></li><li class="listitem"><p> [[<code>Ndb_api_wait_scan_result_count_session</code><code>Ndb_api_bytes_sent_count_slave</code>] </p></li><li class="listitem"><p>[nenhu<code>Ndb_api_wait_meta_request_count_session</code></p></li><li class="listitem"><p> [[<code>Ndb_api_wait_scan_result_count_slave</code><code>Ndb_api_wait_meta_request_count_session</code>] </p></li></ul> </div> </td> </tr><tr> <th>[[<code>Ndb_api_wait_scan_result_count_slave</code><code>Ndb_api_wait_meta_request_count_session</code>]</th> <td>Número de linhas lidas do mesmo nó de dados em que a transação estava sendo executada.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> [[<code>Ndb_api_wait_scan_result_count_slave</code><code>Ndb_api_wait_meta_request_count</code>] </p></li><li class="listitem"><p> [[<code>Ndb_api_wait_scan_result_count_slave</code><code>WaitNanosCount</code>] </p></li><li class="listitem"><p>[nenhu<code>Ndb_api_wait_meta_request_count_session</code></p></li><li class="listitem"><p> [[<code>Ndb_api_wait_scan_result_count_slave</code><code>Ndb_api_wait_nanos_count_session</code>] </p></li></ul> </div> </td> </tr><tr> <th>[[<code>Ndb_api_wait_scan_result_count_slave</code><code>Ndb_api_wait_nanos_count_slave</code>]</th> <td>Número de eventos de mudança de linha recebidos.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p>[nenhu<code>Ndb_api_wait_meta_request_count_session</code></p></li><li class="listitem"><p>[nenhu<code>Ndb_api_wait_meta_request_count_session</code></p></li><li class="listitem"><p> [[<code>Ndb_api_wait_scan_result_count_slave</code><code>Ndb_api_wait_nanos_count</code>] </p></li><li class="listitem"><p> [[<code>Ndb_api_wait_scan_result_count_slave</code><code>BytesSentCount</code>] </p></li></ul> </div> </td> </tr><tr> <th>[[<code>Ndb_api_wait_scan_result_count_slave</code><code>Ndb_api_bytes_sent_count_session</code>]</th> <td>Número de eventos recebidos, exceto eventos de alteração de linha.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p>[nenhu<code>Ndb_api_wait_meta_request_count_session</code></p></li><li class="listitem"><p>[nenhu<code>Ndb_api_wait_meta_request_count_session</code></p></li><li class="listitem"><p> [[<code>Ndb_api_wait_scan_result_count_slave</code><code>Ndb_api_bytes_sent_count_slave</code>] </p></li><li class="listitem"><p> [[<code>Ndb_api_wait_scan_result_count</code><code>Ndb_api_wait_meta_request_count_session</code>] </p></li></ul> </div> </td> </tr><tr> <th>[[<code>Ndb_api_wait_scan_result_count</code><code>Ndb_api_wait_meta_request_count_session</code>]</th> <td>Número de bytes de eventos recebidos.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p>[nenhu<code>Ndb_api_wait_meta_request_count_session</code></p></li><li class="listitem"><p>[nenhu<code>Ndb_api_wait_meta_request_count_session</code></p></li><li class="listitem"><p> [[<code>Ndb_api_wait_scan_result_count</code><code>Ndb_api_wait_meta_request_count</code>] </p></li><li class="listitem"><p> [[<code>Ndb_api_wait_scan_result_count</code><code>WaitNanosCount</code>] </p></li></ul> </div> </td> </tr></tbody></table>

Para ver todas as contagens de transações confirmadas — ou seja, todas as variáveis de status do contador `TransCommitCount` — você pode filtrar os resultados da consulta `SHOW STATUS` para a subcadeia `trans_commit_count`, da seguinte maneira:

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

Com isso, você pode determinar que 1 transação foi comprometida na sessão atual do cliente **mysql** e 2 transações foram comprometidas neste **mysqld** desde que foi reiniciado pela última vez.

Você pode ver como vários contadores da API NDB são incrementados por uma determinada instrução SQL comparando os valores das variáveis de status `_session` correspondentes imediatamente antes e depois de executar a instrução. Neste exemplo, após obter os valores iniciais da instrução `SHOW STATUS`, criamos na base de dados `test` uma tabela `NDB` (mysql-cluster.html) chamada `t`, que tem uma única coluna:

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

Agora você pode executar uma nova instrução `SHOW STATUS` e observar as alterações, conforme mostrado aqui (com as linhas alteradas destacadas na saída):

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

Da mesma forma, você pode ver as mudanças nos contadores de estatísticas da API NDB causadas pelo inserimento de uma linha na `t`: Insira a linha e, em seguida, execute a mesma declaração `SHOW STATUS` usada no exemplo anterior, conforme mostrado aqui:

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

- Embora tenhamos criado `t` sem uma chave primária explícita, foram realizadas 5 operações de chave primária ao fazer isso (a diferença nos valores de “antes” e “depois” de `Ndb_api_pk_op_count_session`, ou 6 menos 1). Isso reflete a criação da chave primária oculta, que é uma característica de todas as tabelas que usam o mecanismo de armazenamento `NDB`.

- Ao comparar os valores sucessivos de `Ndb_api_wait_nanos_count_session`, podemos ver que as operações da API NDB que implementam a instrução `CREATE TABLE` esperaram muito mais tempo (706051004 nanosegundos, ou aproximadamente 0,7 segundo) para obter respostas dos nós de dados do que aquelas executadas pelo `INSERT` (498709 ns ou aproximadamente 0,0005 segundo). Os tempos de execução relatados para essas instruções no cliente **mysql** estão aproximadamente correlacionados com esses números.

  Em plataformas sem resolução de tempo (nanosegundos) suficiente, pequenas mudanças no valor do contador da API NDB `WaitNanosCount` devido a instruções SQL que executam muito rapidamente podem nem sempre ser visíveis nos valores de `Ndb_api_wait_nanos_count_session`, `Ndb_api_wait_nanos_count_slave` ou `Ndb_api_wait_nanos_count`.

- A instrução `INSERT` incrementou tanto os contadores de estatísticas da API NDB `ReadRowCount` quanto `TransLocalReadRowCount`, conforme refletido pelos valores aumentados de `Ndb_api_read_row_count_session` e `Ndb_api_trans_local_read_row_count_session`.
