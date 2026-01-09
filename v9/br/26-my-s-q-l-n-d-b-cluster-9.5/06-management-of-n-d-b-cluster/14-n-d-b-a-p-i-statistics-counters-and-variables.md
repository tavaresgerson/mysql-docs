### 25.6.14 Contadores e Variáveis de Estatísticas da API NDB

Existem vários tipos de contadores estatísticos relacionados às ações realizadas por objetos `Ndb` ou que afetam esses objetos. Essas ações incluem iniciar e fechar (ou abortar) transações; operações de chave primária e chave única; varreduras de tabela, intervalo e poda; threads bloqueadas enquanto aguardam a conclusão de várias operações; e dados e eventos enviados e recebidos pelo `NDBCLUSTER`. Os contadores são incrementados dentro do kernel NDB sempre que chamadas da API NDB são feitas ou dados são enviados ou recebidos pelos nós de dados. O **mysqld** expõe esses contadores como variáveis de status do sistema; seus valores podem ser lidos na saída do `SHOW STATUS`, ou por meio da consulta à tabela `session_status` ou `global_status` do Schema de Desempenho. Ao comparar os valores antes e depois das instruções que operam em tabelas `NDB`, é possível observar as ações correspondentes realizadas no nível da API e, assim, o custo de executar a instrução.

Você pode listar todas essas variáveis de status usando a seguinte instrução `SHOW STATUS`:

```
mysql> SHOW STATUS LIKE 'ndb_api%';
+----------------------------------------------+-------------+
| Variable_name                                | Value       |
+----------------------------------------------+-------------+
| Ndb_api_wait_exec_complete_count             | 11          |
| Ndb_api_wait_scan_result_count               | 14          |
| Ndb_api_wait_meta_request_count              | 74          |
| Ndb_api_wait_nanos_count                     | 31453031678 |
| Ndb_api_bytes_sent_count                     | 3336        |
| Ndb_api_bytes_received_count                 | 103568      |
| Ndb_api_trans_start_count                    | 10          |
| Ndb_api_trans_commit_count                   | 2           |
| Ndb_api_trans_abort_count                    | 4           |
| Ndb_api_trans_close_count                    | 10          |
| Ndb_api_pk_op_count                          | 6           |
| Ndb_api_uk_op_count                          | 0           |
| Ndb_api_table_scan_count                     | 3           |
| Ndb_api_range_scan_count                     | 1           |
| Ndb_api_pruned_scan_count                    | 0           |
| Ndb_api_scan_batch_count                     | 3           |
| Ndb_api_read_row_count                       | 11          |
| Ndb_api_trans_local_read_row_count           | 9           |
| Ndb_api_adaptive_send_forced_count           | 5           |
| Ndb_api_adaptive_send_unforced_count         | 11          |
| Ndb_api_adaptive_send_deferred_count         | 0           |
| Ndb_api_event_data_count                     | 0           |
| Ndb_api_event_nondata_count                  | 0           |
| Ndb_api_event_bytes_count                    | 0           |
| Ndb_api_event_data_count_injector            | 0           |
| Ndb_api_event_nondata_count_injector         | 0           |
| Ndb_api_event_bytes_count_injector           | 0           |
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
| Ndb_api_wait_exec_complete_count_replica     | 0           |
| Ndb_api_wait_scan_result_count_replica       | 0           |
| Ndb_api_wait_meta_request_count_replica      | 0           |
| Ndb_api_wait_nanos_count_replica             | 0           |
| Ndb_api_bytes_sent_count_replica             | 0           |
| Ndb_api_bytes_received_count_replica         | 0           |
| Ndb_api_trans_start_count_replica            | 0           |
| Ndb_api_trans_commit_count_replica           | 0           |
| Ndb_api_trans_abort_count_replica            | 0           |
| Ndb_api_trans_close_count_replica            | 0           |
| Ndb_api_pk_op_count_replica                  | 0           |
| Ndb_api_uk_op_count_replica                  | 0           |
| Ndb_api_table_scan_count_replica             | 0           |
| Ndb_api_range_scan_count_replica             | 0           |
| Ndb_api_pruned_scan_count_replica            | 0           |
| Ndb_api_scan_batch_count_replica             | 0           |
| Ndb_api_read_row_count_replica               | 0           |
| Ndb_api_trans_local_read_row_count_replica   | 0           |
| Ndb_api_adaptive_send_forced_count_replica   | 0           |
| Ndb_api_adaptive_send_unforced_count_replica | 0           |
| Ndb_api_adaptive_send_deferred_count_replica | 0           |
| Ndb_api_wait_exec_complete_count_session     | 0           |
| Ndb_api_wait_scan_result_count_session       | 3           |
| Ndb_api_wait_meta_request_count_session      | 6           |
| Ndb_api_wait_nanos_count_session             | 2022486     |
| Ndb_api_bytes_sent_count_session             | 268         |
| Ndb_api_bytes_received_count_session         | 10332       |
| Ndb_api_trans_start_count_session            | 1           |
| Ndb_api_trans_commit_count_session           | 0           |
| Ndb_api_trans_abort_count_session            | 0           |
| Ndb_api_trans_close_count_session            | 1           |
| Ndb_api_pk_op_count_session                  | 0           |
| Ndb_api_uk_op_count_session                  | 0           |
| Ndb_api_table_scan_count_session             | 1           |
| Ndb_api_range_scan_count_session             | 0           |
| Ndb_api_pruned_scan_count_session            | 0           |
| Ndb_api_scan_batch_count_session             | 2           |
| Ndb_api_read_row_count_session               | 2           |
| Ndb_api_trans_local_read_row_count_session   | 2           |
| Ndb_api_adaptive_send_forced_count_session   | 1           |
| Ndb_api_adaptive_send_unforced_count_session | 0           |
| Ndb_api_adaptive_send_deferred_count_session | 0           |
+----------------------------------------------+-------------+
90 rows in set (0.00 sec)
```

Esses variáveis de status também estão disponíveis nas tabelas `session_status` e `global_status` do Schema de Desempenho, conforme mostrado aqui:

```
mysql> SELECT * FROM performance_schema.session_status
    ->   WHERE VARIABLE_NAME LIKE 'ndb_api%';
+----------------------------------------------+----------------+
| VARIABLE_NAME                                | VARIABLE_VALUE |
+----------------------------------------------+----------------+
| Ndb_api_wait_exec_complete_count             | 11             |
| Ndb_api_wait_scan_result_count               | 14             |
| Ndb_api_wait_meta_request_count              | 81             |
| Ndb_api_wait_nanos_count                     | 119485762051   |
| Ndb_api_bytes_sent_count                     | 3476           |
| Ndb_api_bytes_received_count                 | 105372         |
| Ndb_api_trans_start_count                    | 10             |
| Ndb_api_trans_commit_count                   | 2              |
| Ndb_api_trans_abort_count                    | 4              |
| Ndb_api_trans_close_count                    | 10             |
| Ndb_api_pk_op_count                          | 6              |
| Ndb_api_uk_op_count                          | 0              |
| Ndb_api_table_scan_count                     | 3              |
| Ndb_api_range_scan_count                     | 1              |
| Ndb_api_pruned_scan_count                    | 0              |
| Ndb_api_scan_batch_count                     | 3              |
| Ndb_api_read_row_count                       | 11             |
| Ndb_api_trans_local_read_row_count           | 9              |
| Ndb_api_adaptive_send_forced_count           | 5              |
| Ndb_api_adaptive_send_unforced_count         | 11             |
| Ndb_api_adaptive_send_deferred_count         | 0              |
| Ndb_api_event_data_count                     | 0              |
| Ndb_api_event_nondata_count                  | 0              |
| Ndb_api_event_bytes_count                    | 0              |
| Ndb_api_event_data_count_injector            | 0              |
| Ndb_api_event_nondata_count_injector         | 0              |
| Ndb_api_event_bytes_count_injector           | 0              |
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
| Ndb_api_wait_exec_complete_count_replica     | 0              |
| Ndb_api_wait_scan_result_count_replica       | 0              |
| Ndb_api_wait_meta_request_count_replica      | 0              |
| Ndb_api_wait_nanos_count_replica             | 0              |
| Ndb_api_bytes_sent_count_replica             | 0              |
| Ndb_api_bytes_received_count_replica         | 0              |
| Ndb_api_trans_start_count_replica            | 0              |
| Ndb_api_trans_commit_count_replica           | 0              |
| Ndb_api_trans_abort_count_replica            | 0              |
| Ndb_api_trans_close_count_replica            | 0              |
| Ndb_api_pk_op_count_replica                  | 0              |
| Ndb_api_uk_op_count_replica                  | 0              |
| Ndb_api_table_scan_count_replica             | 0              |
| Ndb_api_range_scan_count_replica             | 0              |
| Ndb_api_pruned_scan_count_replica            | 0              |
| Ndb_api_scan_batch_count_replica             | 0              |
| Ndb_api_read_row_count_replica               | 0              |
| Ndb_api_trans_local_read_row_count_replica   | 0              |
| Ndb_api_adaptive_send_forced_count_replica   | 0              |
| Ndb_api_adaptive_send_unforced_count_replica | 0              |
| Ndb_api_adaptive_send_deferred_count_replica | 0              |
| Ndb_api_wait_exec_complete_count_session     | 0              |
| Ndb_api_wait_scan_result_count_session       | 3              |
| Ndb_api_wait_meta_request_count_session      | 6              |
| Ndb_api_wait_nanos_count_session             | 2022486        |
| Ndb_api_bytes_sent_count_session             | 268            |
| Ndb_api_bytes_received_count_session         | 10332          |
| Ndb_api_trans_start_count_session            | 1              |
| Ndb_api_trans_commit_count_session           | 0              |
| Ndb_api_trans_abort_count_session            | 0              |
| Ndb_api_trans_close_count_session            | 1              |
| Ndb_api_pk_op_count_session                  | 0              |
| Ndb_api_uk_op_count_session                  | 0              |
| Ndb_api_table_scan_count_session             | 1              |
| Ndb_api_range_scan_count_session             | 0              |
| Ndb_api_pruned_scan_count_session            | 0              |
| Ndb_api_scan_batch_count_session             | 2              |
| Ndb_api_read_row_count_session               | 2              |
| Ndb_api_trans_local_read_row_count_session   | 2              |
| Ndb_api_adaptive_send_forced_count_session   | 1              |
| Ndb_api_adaptive_send_unforced_count_session | 0              |
| Ndb_api_adaptive_send_deferred_count_session | 0              |
+----------------------------------------------+----------------+
90 rows in set (0.00 sec)

mysql> SELECT * FROM performance_schema.global_status
    ->     WHERE VARIABLE_NAME LIKE 'ndb_api%';
+----------------------------------------------+----------------+
| VARIABLE_NAME                                | VARIABLE_VALUE |
+----------------------------------------------+----------------+
| Ndb_api_wait_exec_complete_count             | 11             |
| Ndb_api_wait_scan_result_count               | 14             |
| Ndb_api_wait_meta_request_count              | 88             |
| Ndb_api_wait_nanos_count                     | 159810484729   |
| Ndb_api_bytes_sent_count                     | 3616           |
| Ndb_api_bytes_received_count                 | 107176         |
| Ndb_api_trans_start_count                    | 10             |
| Ndb_api_trans_commit_count                   | 2              |
| Ndb_api_trans_abort_count                    | 4              |
| Ndb_api_trans_close_count                    | 10             |
| Ndb_api_pk_op_count                          | 6              |
| Ndb_api_uk_op_count                          | 0              |
| Ndb_api_table_scan_count                     | 3              |
| Ndb_api_range_scan_count                     | 1              |
| Ndb_api_pruned_scan_count                    | 0              |
| Ndb_api_scan_batch_count                     | 3              |
| Ndb_api_read_row_count                       | 11             |
| Ndb_api_trans_local_read_row_count           | 9              |
| Ndb_api_adaptive_send_forced_count           | 5              |
| Ndb_api_adaptive_send_unforced_count         | 11             |
| Ndb_api_adaptive_send_deferred_count         | 0              |
| Ndb_api_event_data_count                     | 0              |
| Ndb_api_event_nondata_count                  | 0              |
| Ndb_api_event_bytes_count                    | 0              |
| Ndb_api_event_data_count_injector            | 0              |
| Ndb_api_event_nondata_count_injector         | 0              |
| Ndb_api_event_bytes_count_injector           | 0              |
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
| Ndb_api_wait_exec_complete_count_replica     | 0              |
| Ndb_api_wait_scan_result_count_replica       | 0              |
| Ndb_api_wait_meta_request_count_replica      | 0              |
| Ndb_api_wait_nanos_count_replica             | 0              |
| Ndb_api_bytes_sent_count_replica             | 0              |
| Ndb_api_bytes_received_count_replica         | 0              |
| Ndb_api_trans_start_count_replica            | 0              |
| Ndb_api_trans_commit_count_replica           | 0              |
| Ndb_api_trans_abort_count_replica            | 0              |
| Ndb_api_trans_close_count_replica            | 0              |
| Ndb_api_pk_op_count_replica                  | 0              |
| Ndb_api_uk_op_count_replica                  | 0              |
| Ndb_api_table_scan_count_replica             | 0              |
| Ndb_api_range_scan_count_replica             | 0              |
| Ndb_api_pruned_scan_count_replica            | 0              |
| Ndb_api_scan_batch_count_replica             | 0              |
| Ndb_api_read_row_count_replica               | 0              |
| Ndb_api_trans_local_read_row_count_replica   | 0              |
| Ndb_api_adaptive_send_forced_count_replica   | 0              |
| Ndb_api_adaptive_send_unforced_count_replica | 0              |
| Ndb_api_adaptive_send_deferred_count_replica | 0              |
| Ndb_api_wait_exec_complete_count_session     | 0              |
| Ndb_api_wait_scan_result_count_session       | 3              |
| Ndb_api_wait_meta_request_count_session      | 6              |
| Ndb_api_wait_nanos_count_session             | 2022486        |
| Ndb_api_bytes_sent_count_session             | 268            |
| Ndb_api_bytes_received_count_session         | 10332          |
| Ndb_api_trans_start_count_session            | 1              |
| Ndb_api_trans_commit_count_session           | 0              |
| Ndb_api_trans_abort_count_session            | 0              |
| Ndb_api_trans_close_count_session            | 1              |
| Ndb_api_pk_op_count_session                  | 0              |
| Ndb_api_uk_op_count_session                  | 0              |
| Ndb_api_table_scan_count_session             | 1              |
| Ndb_api_range_scan_count_session             | 0              |
| Ndb_api_pruned_scan_count_session            | 0              |
| Ndb_api_scan_batch_count_session             | 2              |
| Ndb_api_read_row_count_session               | 2              |
| Ndb_api_trans_local_read_row_count_session   | 2              |
| Ndb_api_adaptive_send_forced_count_session   | 1              |
| Ndb_api_adaptive_send_unforced_count_session | 0              |
| Ndb_api_adaptive_send_deferred_count_session | 0              |
+----------------------------------------------+----------------+
90 rows in set (0.01 sec)
```

Cada objeto `Ndb` tem seus próprios contadores. Aplicações da API NDB podem ler os valores dos contadores para uso na otimização ou monitoramento. Para clientes multithread que usam mais de um objeto `Ndb` simultaneamente, também é possível obter uma visão resumida dos contadores de todos os objetos `Ndb` pertencentes a uma conexão `Ndb_cluster_connection` específica.

Quatro conjuntos desses contadores estão expostos. Um conjunto se aplica apenas à sessão atual; os outros 3 são globais. *Isso ocorre apesar do fato de que seus valores podem ser obtidos como variáveis de status de sessão ou global no cliente **mysql**. Isso significa que especificar a palavra-chave `SESSION` ou `GLOBAL` com `SHOW STATUS` não tem efeito nos valores relatados para as variáveis de status de estatísticas da API NDB, e o valor de cada uma dessas variáveis é o mesmo, independentemente de o valor ser obtido da coluna equivalente da tabela `session_status` ou `global_status`.

* *Contadores de sessão (específicos da sessão)*

  Os contadores de sessão estão relacionados aos objetos `Ndb` usados apenas pela sessão atual. O uso desses objetos por outros clientes MySQL não influencia esses contagem.

  Para minimizar a confusão com as variáveis de sessão padrão do MySQL, referenciamos as variáveis que correspondem a esses contadores de sessão da API NDB como “variáveis `_session`”, com um sublinhado antes.

* *Contadores de replica (globais)*

  Este conjunto de contadores está relacionado aos objetos `Ndb` usados pelo fio de SQL da replica, se houver. Se este **mysqld** não atuar como uma replica ou não usar tabelas `NDB`, então todos esses contagem são 0.

  Referenciamos as variáveis de status relacionadas como “variáveis `_replica`” (com um sublinhado antes).

* *Contadores de injetor (globais)*

  Os contadores de injetor estão relacionados ao objeto `Ndb` usado para ouvir eventos do cluster pelo fio de injetor do log binário. Mesmo quando não está escrevendo um log binário, os **mysqld** processados ligados a um NDB Cluster continuam a ouvir alguns eventos, como mudanças de esquema.

  Referenciamos as variáveis de status que correspondem aos contadores de injetor da API NDB como “variáveis `_injector`” (com um sublinhado antes).

* *Contadores de servidor (Global) (global)*

Este conjunto de contadores está relacionado a todos os objetos `Ndb` atualmente usados por este **mysqld**. Isso inclui todas as aplicações de cliente MySQL, o fio de SQL replica (se houver), o injetor de log binário e o fio de utilitário `NDB`.

Referenciamos as variáveis de status que correspondem a esses contadores como "variáveis globais" ou "variáveis de nível **mysqld**".

Você pode obter valores para um conjunto específico de variáveis filtrando adicionalmente a substring `session`, `replica` ou `injector` no nome da variável (junto com o prefixo comum `Ndb_api`). Para variáveis `_session`, isso pode ser feito como mostrado aqui:

```
mysql> SHOW STATUS LIKE 'ndb_api%session';
+----------------------------------------------+---------+
| Variable_name                                | Value   |
+----------------------------------------------+---------+
| Ndb_api_wait_exec_complete_count_session     | 0       |
| Ndb_api_wait_scan_result_count_session       | 3       |
| Ndb_api_wait_meta_request_count_session      | 6       |
| Ndb_api_wait_nanos_count_session             | 2022486 |
| Ndb_api_bytes_sent_count_session             | 268     |
| Ndb_api_bytes_received_count_session         | 10332   |
| Ndb_api_trans_start_count_session            | 1       |
| Ndb_api_trans_commit_count_session           | 0       |
| Ndb_api_trans_abort_count_session            | 0       |
| Ndb_api_trans_close_count_session            | 1       |
| Ndb_api_pk_op_count_session                  | 0       |
| Ndb_api_uk_op_count_session                  | 0       |
| Ndb_api_table_scan_count_session             | 1       |
| Ndb_api_range_scan_count_session             | 0       |
| Ndb_api_pruned_scan_count_session            | 0       |
| Ndb_api_scan_batch_count_session             | 2       |
| Ndb_api_read_row_count_session               | 2       |
| Ndb_api_trans_local_read_row_count_session   | 2       |
| Ndb_api_adaptive_send_forced_count_session   | 1       |
| Ndb_api_adaptive_send_unforced_count_session | 0       |
| Ndb_api_adaptive_send_deferred_count_session | 0       |
+----------------------------------------------+---------+
21 rows in set (0.00 sec)
```

Para obter uma lista das variáveis de status de nível **mysqld** da API NDB, filtre por nomes de variáveis que comecem com `ndb_api` e terminem com `_count`, assim:

```
mysql> SELECT * FROM performance_schema.session_status
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

Nem todos os contadores são refletidos em todos os 4 conjuntos de variáveis de status. Para os contadores de eventos `DataEventsRecvdCount`, `NondataEventsRecvdCount` e `EventBytesRecvdCount`, estão disponíveis apenas as variáveis de status `_injector` e da API NDB de nível **mysqld**:

```
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

As variáveis de status `_injector` não são implementadas para nenhum outro contador da API NDB, como mostrado aqui:

```
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

Os nomes das variáveis de status podem ser facilmente associados aos nomes dos contadores correspondentes. Cada contador de estatísticas da API NDB é listado na tabela seguinte com uma descrição, bem como os nomes de quaisquer variáveis de status do servidor MySQL correspondentes a este contador.

**Tabela 25.39 Contadores de estatísticas da API NDB**

_scan_count</code></a> </p></li></ul> </div> </td> </tr><tr> <th><code>TableScanCompleteCount</code></th> <td>Number of table scans that have completed.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-type: disc; "><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_table_scan_complete_count_session"><code>Ndb_api_table_scan_complete_count_session</code></a> </p></li><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_table_scan_complete_count_replica"><code>Ndb_api_table_scan_complete_count_replica</code></a> </p></li><li class="listitem"><p> [none] </p></li><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_table_scan_complete_count"><code>Ndb_api_table_scan_complete_count</code></a> </p></li></ul> </div> </td> </tr><tr> <th><code>TableScanFailedCount</code></th> <td>Number of table scans that have failed.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-type: disc; "><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_table_scan_failed_count_session"><code>Ndb_api_table_scan_failed_count_session</code></a> </p></li><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_table_scan_failed_count_replica"><code>Ndb_api_table_scan_failed_count_replica</code></a> </p></li><li class="listitem"><p> [none] </p></li><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_table_scan_failed_count"><code>Ndb_api_table_scan_failed_count</code></a> </p></li></ul> </div> </td> </tr><tr> <th><code>TableScanTime</code></th> <td>Total time (in nanoseconds) spent on table scans.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_table_scan_time_session"><code>Ndb_api_table_scan_time_session</code></a> </p></li><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_table_scan_time_replica"><code>Ndb_api_table_scan_time_replica</code></a> </p></li><li class="listitem"><p> [none] </p></li><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_table_scan_time"><code>Ndb_api_table_scan_time</code></a> </p></li></ul> </div> </td> </tr><tr> <th><code>TableScanBytes</code></th> <td>Total amount of data (in bytes) sent to the data nodes during table scans.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_table_scan_bytes_session"><code>Ndb_api_table_scan_bytes_session</code>

Para ver todas as contagens de transações confirmadas — ou seja, todas as variáveis de contador `TransCommitCount` — você pode filtrar os resultados da consulta `SHOW STATUS` para a substring `trans_commit_count`, assim:

```
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

A partir disso, você pode determinar que 1 transação foi confirmada na sessão atual do cliente `mysql`, e 2 transações foram confirmadas neste `mysqld` desde que ele foi reiniciado pela última vez.

Você pode ver como vários contadores da API NDB são incrementados por uma determinada instrução SQL comparando os valores das variáveis de status `_session` correspondentes imediatamente antes e depois de executar a instrução. Neste exemplo, após obter os valores iniciais da consulta `SHOW STATUS`, criamos na base de dados `test` uma tabela `NDB`, chamada `t`, que tem uma única coluna:

```
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

Agora você pode executar uma nova consulta `SHOW STATUS` e observar as mudanças, como mostrado aqui (com as linhas alteradas destacadas na saída):

```
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

Da mesma forma, você pode ver as mudanças nos contadores de estatísticas da API NDB causadas pela inserção de uma linha em `t`: Insira a linha, então execute a mesma consulta `SHOW STATUS` usada no exemplo anterior, como mostrado aqui:

```
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

Podemos fazer várias observações desses resultados:

* Embora tenhamos criado `t` sem uma chave primária explícita, 5 operações de chave primária foram realizadas ao fazê-lo (a diferença nos valores de “antes” e “depois” de `Ndb_api_pk_op_count_session`, ou 6 menos 1). Isso reflete a criação da chave primária oculta que é uma característica de todas as tabelas que usam o motor de armazenamento `NDB`.

* Ao comparar os valores sucessivos de `Ndb_api_wait_nanos_count_session`, podemos ver que as operações da API NDB que implementam a instrução `CREATE TABLE` esperaram muito mais tempo (706051004 nanosegundos, ou aproximadamente 0,7 segundo) para obter respostas dos nós de dados do que aquelas executadas pela instrução `INSERT` (498709 ns ou aproximadamente 0,0005 segundo). Os tempos de execução relatados para essas instruções no cliente **mysql** estão aproximadamente correlacionados com esses valores.

* Em plataformas sem resolução de tempo (nanosegundos) suficiente, pequenas mudanças no valor do contador `WaitNanosCount` da API NDB devido a instruções SQL que executam muito rapidamente podem não ser sempre visíveis nos valores de `Ndb_api_wait_nanos_count_session`, `Ndb_api_wait_nanos_count_replica` ou `Ndb_api_wait_nanos_count`.

* A instrução `INSERT` incrementou tanto os contadores de estatísticas da API NDB `ReadRowCount` quanto `TransLocalReadRowCount`, conforme refletido pelos valores aumentados de `Ndb_api_read_row_count_session` e `Ndb_api_trans_local_read_row_count_session`.