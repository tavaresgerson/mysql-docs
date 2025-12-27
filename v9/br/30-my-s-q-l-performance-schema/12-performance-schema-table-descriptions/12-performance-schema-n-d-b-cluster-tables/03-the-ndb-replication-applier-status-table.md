#### 29.12.12.3 A tabela ndb_replication_applier_status

O `NDBCLUSTER` expõe o estado interno do aplicativo de replicação para observação usando variáveis de status globais, como `Ndb_replica_max_replicated_epoch` e `Ndb_api_trans_start_count_replica`, mas esses valores refletem o estado do canal de replicação padrão apenas. A `ndb_replication_applier_status` fornece as mesmas informações, mas por canal; com exceção de `CHANNEL_NAME`, cada coluna nesta tabela corresponde a uma variável de status do servidor; onde aplicável, essa informação é incluída nas descrições das colunas fornecidas mais adiante nesta seção.

Esta tabela é uma extensão específica do NDB da tabela `replication_applier_status`.

A tabela `ndb_replication_applier_status` tem as colunas mostradas e descritas na lista a seguir:

* `CHANNEL_NAME`:

  O nome do canal de replicação. O padrão é uma string vazia (`""`).

* `MAX_REPLICATED_EPOCH`:

  O epoch mais recentemente comprometido na replica. `Ndb_replica_max_replicated_epoch` mostra esse valor para o canal de replicação padrão.

* `API_WAIT_EXEC_COMPLETE_COUNT`:

  O número de vezes que este thread foi bloqueado enquanto aguardava a conclusão de uma operação por este nó SQL. `Ndb_api_wait_exec_complete_count_replica` mostra esse valor para o canal de replicação padrão.

* `API_WAIT_SCAN_RESULT_COUNT`:

  O número de vezes que este thread foi bloqueado enquanto aguardava um sinal baseado em varredura por este nó SQL. `Ndb_api_wait_scan_result_count_replica` mostra esse valor para o canal de replicação padrão.

* `API_WAIT_META_REQUEST_COUNT`:

O número de vezes que este fio foi bloqueado esperando por um sinal baseado em metadados por este nó SQL. `Ndb_api_wait_meta_request_count_replica` mostra esse valor para o canal de replicação padrão.

* `API_WAIT_NANOS_COUNT`:

  O tempo acumulado em nanosegundos gasto esperando por algum tipo de sinal dos nós de dados por este nó SQL. `Ndb_api_wait_nanos_count_replica` mostra esse valor para o canal de replicação padrão.

* `API_BYTES_SENT_COUNT`:

  O número de bytes enviados aos nós de dados por este nó SQL. `Ndb_api_bytes_sent_count_replica` mostra esse valor para o canal de replicação padrão.

* `API_BYTES_RECEIVED_COUNT`:

  O número de bytes recebidos dos nós de dados por este nó SQL. `Ndb_api_bytes_received_count_replica` mostra esse valor para o canal de replicação padrão.

* `API_TRANS_START_COUNT`:

  O número de transações iniciadas por este nó SQL. `Ndb_api_trans_start_count_replica` mostra esse valor para o canal de replicação padrão.

* `API_TRANS_COMMIT_COUNT`:

  O número de transações comprometidas por este nó SQL. `Ndb_api_trans_commit_count_replica` mostra esse valor para o canal de replicação padrão.

* `API_TRANS_ABORT_COUNT`:

  O número de transações abortadas por este nó SQL. `Ndb_api_trans_abort_count_replica` mostra esse valor para o canal de replicação padrão.

* `API_TRANS_CLOSE_COUNT`:

  O número de transações que foram fechadas por este nó SQL; esse valor pode ser maior que a soma de `API_TRANS_COMMIT_COUNT` e `API_TRANS_ABORT_COUNT`. `Ndb_api_trans_close_count_replica` mostra esse valor para o canal de replicação padrão.

* `API_PK_OP_COUNT`:

O número de operações de chave primária realizadas por este nó SQL. `Ndb_api_pk_op_count_replica` mostra esse valor para o canal de replicação padrão.

* `API_UK_OP_COUNT`:

  O número de operações de chave única realizadas por este nó SQL. `Ndb_api_uk_op_count_replica` mostra esse valor para o canal de replicação padrão.

* `API_TABLE_SCAN_COUNT`:

  O número de varreduras de tabela iniciadas por este nó SQL. Isso inclui varreduras de tabelas internas. `Ndb_api_table_scan_count_replica` mostra esse valor para o canal de replicação padrão.

* `API_RANGE_SCAN_COUNT`:

  O número de varreduras de intervalo iniciadas por este nó SQL. `Ndb_api_range_scan_count_replica` mostra esse valor para o canal de replicação padrão.

* `API_PRUNED_SCAN_COUNT`:

  O número de varreduras que foram reduzidas a uma única partição por este nó SQL. `Ndb_api_pruned_scan_count_replica` mostra esse valor para o canal de replicação padrão.

* `API_SCAN_BATCH_COUNT`:

  O número de lotes de linhas recebidos por este nó SQL. `Ndb_api_scan_batch_count_replica` mostra esse valor para o canal de replicação padrão.

* `API_READ_ROW_COUNT`:

  O número total de linhas lidas por este nó SQL. `Ndb_api_read_row_count_replica` mostra esse valor para o canal de replicação padrão.

* `API_TRANS_LOCAL_READ_ROW_COUNT`:

  O número total de linhas lidas por este nó SQL localmente. `Ndb_api_trans_local_read_row_count_replica` mostra esse valor para o canal de replicação padrão.

* `API_ADAPTIVE_SEND_FORCED_COUNT`:

  O número de envios adaptativos forçados enviados por este nó SQL que faz uso do envio forçado. `Ndb_api_adaptive_send_forced_count_replica` mostra esse valor para o canal de replicação padrão.

* `API_ADAPTIVE_SEND_UNFORCED_COUNT`:

  O número de envios adaptativos que foram enviados por este nó SQL sem usar envio forçado. `Ndb_api_adaptive_send_unforced_count_replica` mostra esse valor para o canal de replicação padrão.

* `API_ADAPTIVE_SEND_DEFERRED_COUNT`:

  O número de envios adaptativos que não foram realmente enviados por este nó SQL. `Ndb_api_adaptive_send_deferred_count_replica` mostra esse valor para o canal de replicação padrão.

* `CONFLICT_FN_MAX`:

  O número de vezes que a resolução de conflitos de replicação NDB “maior timestamp vence” foi aplicada a operações de atualização e exclusão. `Ndb_conflict_fn_max` mostra esse valor para o canal de replicação padrão.

* `CONFLICT_FN_OLD`:

  O número de vezes que a resolução de conflitos de replicação NDB “mesmo timestamp vence” foi aplicada. `Ndb_conflict_fn_old` mostra esse valor para o canal de replicação padrão.

* `CONFLICT_FN_MAX_DEL_WIN`:

  O número de vezes que a resolução de conflitos de replicação NDB foi aplicada com base no resultado de `NDB$MAX_DELETE_WIN()` a operações de atualização e exclusão. `Ndb_conflict_fn_max_del_win` mostra esse valor para o canal de replicação padrão.

* `CONFLICT_FN_MAX_INS`:

  O número de vezes que a resolução de conflitos de replicação NDB “maior timestamp vence” foi aplicada a operações de inserção. `Ndb_conflict_fn_max_ins` mostra esse valor para o canal de replicação padrão.

* `CONFLICT_FN_MAX_DEL_WIN_INS`:

  O número de vezes que a resolução de conflitos de replicação NDB foi aplicada com base no resultado de `NDB$MAX_DELETE_WIN_INS()` a operações de atualização e exclusão. `Ndb_conflict_fn_max_del_win_ins` mostra esse valor para o canal de replicação padrão.

* `CONFLICT_FN_EPOCH`:

O número de linhas que foram encontradas em conflito pela função de detecção de conflitos de replicação NDB `NDB$EPOCH()` (`Ndb_conflict_fn_epoch`). `Ndb_conflict_fn_epoch` mostra esse valor para o canal de replicação padrão.

* `CONFLICT_FN_EPOCH_TRANS`:

  O número de linhas que foram encontradas em conflito pela função de detecção de conflitos de replicação NDB `NDB$EPOCH_TRANS()` (`Ndb_conflict_fn_epoch_trans`). `Ndb_conflict_fn_epoch_trans` mostra esse valor para o canal de replicação padrão.

* `CONFLICT_FN_EPOCH2`:

  O número de linhas que foram encontradas em conflito pela função de detecção de conflitos de replicação NDB `NDB$EPOCH2()` (`Ndb_conflict_fn_epoch2`). `Ndb_conflict_fn_epoch2` mostra esse valor para o canal de replicação padrão.

* `CONFLICT_FN_EPOCH2_TRANS`:

  O número de linhas que foram encontradas em conflito pela função de detecção de conflitos de replicação NDB `NDB$EPOCH2_TRANS()` (`Ndb_conflict_fn_epoch2_trans`). `Ndb_conflict_fn_epoch2_trans` mostra esse valor para o canal de replicação padrão.

* `CONFLICT_TRANS_ROW_CONFLICT_COUNT`:

  O número de linhas que foram encontradas em conflito por uma função de detecção de conflitos transacionais, incluindo quaisquer linhas que foram incluídas em transações conflitantes ou dependiam delas. `Ndb_conflict_trans_row_conflict_count` mostra esse valor para o canal de replicação padrão.

* `CONFLICT_TRANS_ROW_REJECT_COUNT`:

  O número total de linhas que foram realineadas após serem encontradas em conflito por uma função de detecção de conflitos transacionais, incluindo `CONFLICT_TRANS_ROW_CONFLICT_COUNT` e quaisquer linhas que foram incluídas em transações conflitantes ou dependiam delas. `Ndb_conflict_trans_row_reject_count` mostra esse valor para o canal de replicação padrão.

* `CONFLICT_TRANS_REJECT_COUNT`:

O número de transações que foram rejeitadas após serem encontradas em conflito por uma função de detecção de conflito de transação. `Ndb_conflict_trans_reject_count` mostra esse valor para o canal de replicação padrão.

* `CONFLICT_TRANS_DETECT_ITER_COUNT`:

  O número de iterações internas que foram necessárias para confirmar as transações de época. Esse valor normalmente deve ser ligeiramente maior ou igual ao valor de `CONFLICT_TRANS_CONFLICT_COMMIT_COUNT`. `Ndb_conflict_trans_detect_iter_count` mostra esse valor para o canal de replicação padrão.

* `CONFLICT_TRANS_CONFLICT_COMMIT_COUNT`:

  O número de transações de época que foram confirmadas após a necessidade de lidar com conflitos de transação. `Ndb_conflict_trans_conflict_commit_count` mostra esse valor para o canal de replicação padrão.

* `CONFLICT_EPOCH_DELETE_DELETE_COUNT`:

  O número de conflitos delete-delete detectados. Um conflito delete-delete ocorre quando uma operação de exclusão é aplicada, mas a linha não existe. `Ndb_epoch_delete_delete_count` mostra esse valor para o canal de replicação padrão.

* `CONFLICT_REFLECTED_OP_PREPARE_COUNT`:

  O número de operações refletidas que foram recebidas e preparadas para execução. `Ndb_conflict_reflected_op_prepare_count` mostra esse valor para o canal de replicação padrão.

* `CONFLICT_REFLECTED_OP_DISCARD_COUNT`:

  O número de operações refletidas que não foram aplicadas devido a erros durante a execução. `Ndb_conflict_reflected_op_discard_count` mostra esse valor para o canal de replicação padrão.

* `CONFLICT_REFRESH_OP_COUNT`:

  O número de operações de atualização que foram preparadas. `Ndb_conflict_refresh_op_count` mostra esse valor para o canal de replicação padrão.

* `CONFLICT_LAST_CONFLICT_EPOCH`:

A época mais recente do NDB nesta replica durante a qual um conflito foi detectado. `Ndb_conflict_last_conflict_epoch` mostra esse valor para o canal de replicação padrão.

* `CONFLICT_LAST_STABLE_EPOCH`:

  A época mais recente do NDB durante a qual nenhum conflito foi detectado. `Ndb_conflict_last_stable_epoch` mostra esse valor para o canal de replicação de cluster do NDB padrão.

Para obter mais informações, consulte as descrições das variáveis de status do servidor indicadas, bem como a Seção 25.7, “Replicação de Clusters do NDB”.