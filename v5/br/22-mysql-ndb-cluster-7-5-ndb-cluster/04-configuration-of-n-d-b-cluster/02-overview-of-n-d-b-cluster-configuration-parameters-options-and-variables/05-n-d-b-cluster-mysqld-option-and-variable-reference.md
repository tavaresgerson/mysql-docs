#### 21.4.2.5 Referência de Opções e Variáveis do mysqld para NDB Cluster

A lista a seguir inclui opções de linha de comando, variáveis de sistema e variáveis de status aplicáveis dentro do `mysqld` quando ele está em execução como um SQL Node em um NDB Cluster. Para uma referência a *todas* as opções de linha de comando, variáveis de sistema e variáveis de status usadas com ou relacionadas ao [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"), consulte [Section 5.1.3, “Server Option, System Variable, and Status Variable Reference”](server-option-variable-reference.html "5.1.3 Server Option, System Variable, and Status Variable Reference").

* `Com_show_ndb_status`: Contagem de instruções SHOW NDB STATUS.

* `Handler_discover`: Número de vezes que as tables foram descobertas.

* `ndb-batch-size`: Tamanho (em bytes) a ser usado para batches de Transaction NDB.

* `ndb-blob-read-batch-bytes`: Especifica o tamanho em bytes no qual grandes BLOB Reads devem ser agrupados em batches. 0 = sem limite.

* `ndb-blob-write-batch-bytes`: Especifica o tamanho em bytes no qual grandes BLOB Writes devem ser agrupados em batches. 0 = sem limite.

* `ndb-cluster-connection-pool`: Número de Connections para o Cluster usadas pelo MySQL.

* `ndb-cluster-connection-pool-nodeids`: Lista separada por vírgulas de IDs de Node para Connections para o Cluster usadas pelo MySQL; o número de nodes na lista deve corresponder ao valor definido para --ndb-cluster-connection-pool.

* `ndb-connectstring`: Endereço do Servidor de Gerenciamento NDB que distribui informações de configuração para este Cluster.

* `ndb-default-column-format`: Usa este valor (FIXED ou DYNAMIC) por padrão para as opções COLUMN_FORMAT e ROW_FORMAT ao criar ou adicionar colunas de table.

* `ndb-deferred-constraints`: Especifica que as verificações de Constraint em Unique Indexes (onde forem suportados) devem ser adiadas até o Commit time. Normalmente não é necessário ou usado; apenas para fins de teste.

* `ndb-distribution`: Distribution padrão para novas tables em NDBCLUSTER (KEYHASH ou LINHASH, o padrão é KEYHASH).

* `ndb-log-apply-status`: Faz com que o MySQL Server atuando como Replica registre as atualizações `mysql.ndb_apply_status` recebidas de sua Source imediata em seu próprio Binary Log, usando seu próprio Server ID. Efetivo apenas se o servidor for iniciado com a opção --ndbcluster.

* `ndb-log-empty-epochs`: Quando ativado, faz com que epochs nas quais não houve alterações sejam gravadas nas tables `ndb_apply_status` e `ndb_binlog_index`, mesmo quando --log-slave-updates estiver ativado.

* `ndb-log-empty-update`: Quando ativado, faz com que updates que não produziram alterações sejam gravados nas tables `ndb_apply_status` e `ndb_binlog_index`, mesmo quando --log-slave-updates estiver ativado.

* `ndb-log-exclusive-reads`: Registra Primary Key Reads com Exclusive Locks; permite a resolução de conflitos baseada em Read Conflicts.

* `ndb-log-fail-terminate`: Encerra o processo mysqld se o registro completo de todos os Row Events encontrados não for possível.

* `ndb-log-orig`: Registra o Server ID e o epoch de origem na table `mysql.ndb_binlog_index`.

* `ndb-log-transaction-id`: Grava NDB Transaction IDs no Binary Log. Requer --log-bin-v1-events=OFF.

* `ndb-log-update-minimal`: Registra updates em formato minimal.

* `ndb-log-updated-only`: Registra apenas updates (ON) ou Rows completas (OFF).

* `ndb-log-update-as-write`: Alterna o logging de updates na Source entre updates (OFF) e Writes (ON).

* `ndb-mgmd-host`: Define o host (e a port, se desejado) para conexão com o Servidor de Gerenciamento.

* `ndb-nodeid`: NDB Cluster Node ID para este MySQL Server.

* `ndb-optimized-node-selection`: Ativa otimizações para seleção de nodes para Transactions. Ativado por padrão; use --skip-ndb-optimized-node-selection para desativar.

* `ndb-transid-mysql-connection-map`: Ativa ou desativa o plugin `ndb_transid_mysql_connection_map`; ou seja, ativa ou desativa a table INFORMATION_SCHEMA com esse nome.

* `ndb-wait-connected`: Tempo (em segundos) para o MySQL Server esperar pela Connection com os Nodes de Gerenciamento e Data do Cluster antes de aceitar Client Connections do MySQL.

* `ndb-wait-setup`: Tempo (em segundos) para o MySQL Server esperar que a configuração do NDB Engine seja concluída.

* `ndb-allow-copying-alter-table`: Define como OFF para evitar que ALTER TABLE use operações de cópia em tables NDB.

* `Ndb_api_adaptive_send_deferred_count`: Número de chamadas adaptive send não enviadas de fato por este MySQL Server (SQL Node).

* `Ndb_api_adaptive_send_deferred_count_session`: Número de chamadas adaptive send não enviadas de fato nesta Client Session.

* `Ndb_api_adaptive_send_deferred_count_slave`: Número de chamadas adaptive send não enviadas de fato por esta Replica.

* `Ndb_api_adaptive_send_forced_count`: Número de adaptive sends com forced-send definido enviados por este MySQL Server (SQL Node).

* `Ndb_api_adaptive_send_forced_count_session`: Número de adaptive sends com forced-send definido nesta Client Session.

* `Ndb_api_adaptive_send_forced_count_slave`: Número de adaptive sends com forced-send definido enviados por esta Replica.

* `Ndb_api_adaptive_send_unforced_count`: Número de adaptive sends sem forced-send enviados por este MySQL Server (SQL Node).

* `Ndb_api_adaptive_send_unforced_count_session`: Número de adaptive sends sem forced-send nesta Client Session.

* `Ndb_api_adaptive_send_unforced_count_slave`: Número de adaptive sends sem forced-send enviados por esta Replica.

* `Ndb_api_bytes_received_count`: Quantidade de dados (em bytes) recebidos dos Data Nodes por este MySQL Server (SQL Node).

* `Ndb_api_bytes_received_count_session`: Quantidade de dados (em bytes) recebidos dos Data Nodes nesta Client Session.

* `Ndb_api_bytes_received_count_slave`: Quantidade de dados (em bytes) recebidos dos Data Nodes por esta Replica.

* `Ndb_api_bytes_sent_count`: Quantidade de dados (em bytes) enviados para os Data Nodes por este MySQL Server (SQL Node).

* `Ndb_api_bytes_sent_count_session`: Quantidade de dados (em bytes) enviados para os Data Nodes nesta Client Session.

* `Ndb_api_bytes_sent_count_slave`: Quantidade de dados (em bytes) enviados para os Data Nodes por esta Replica.

* `Ndb_api_event_bytes_count`: Número de bytes de Events recebidos por este MySQL Server (SQL Node).

* `Ndb_api_event_bytes_count_injector`: Número de bytes de Event Data recebidos pelo Thread Injetor do NDB Binary Log.

* `Ndb_api_event_data_count`: Número de Row Change Events recebidos por este MySQL Server (SQL Node).

* `Ndb_api_event_data_count_injector`: Número de Row Change Events recebidos pelo Thread Injetor do NDB Binary Log.

* `Ndb_api_event_nondata_count`: Número de Events recebidos, exceto Row Change Events, por este MySQL Server (SQL Node).

* `Ndb_api_event_nondata_count_injector`: Número de Events recebidos, exceto Row Change Events, pelo Thread Injetor do NDB Binary Log.

* `Ndb_api_pk_op_count`: Número de operações baseadas ou que usam Primary Keys por este MySQL Server (SQL Node).

* `Ndb_api_pk_op_count_session`: Número de operações baseadas ou que usam Primary Keys nesta Client Session.

* `Ndb_api_pk_op_count_slave`: Número de operações baseadas ou que usam Primary Keys por esta Replica.

* `Ndb_api_pruned_scan_count`: Número de Scans que foram reduzidos (pruned) a uma Partition por este MySQL Server (SQL Node).

* `Ndb_api_pruned_scan_count_session`: Número de Scans que foram reduzidos (pruned) a uma Partition nesta Client Session.

* `Ndb_api_pruned_scan_count_slave`: Número de Scans que foram reduzidos (pruned) a uma Partition por esta Replica.

* `Ndb_api_range_scan_count`: Número de Range Scans que foram iniciados por este MySQL Server (SQL Node).

* `Ndb_api_range_scan_count_session`: Número de Range Scans que foram iniciados nesta Client Session.

* `Ndb_api_range_scan_count_slave`: Número de Range Scans que foram iniciados por esta Replica.

* `Ndb_api_read_row_count`: Número total de Rows que foram lidas por este MySQL Server (SQL Node).

* `Ndb_api_read_row_count_session`: Número total de Rows que foram lidas nesta Client Session.

* `Ndb_api_read_row_count_slave`: Número total de Rows que foram lidas por esta Replica.

* `Ndb_api_scan_batch_count`: Número de batches de Rows recebidas por este MySQL Server (SQL Node).

* `Ndb_api_scan_batch_count_session`: Número de batches de Rows recebidas nesta Client Session.

* `Ndb_api_scan_batch_count_slave`: Número de batches de Rows recebidas por esta Replica.

* `Ndb_api_table_scan_count`: Número de Table Scans que foram iniciados, incluindo Scans de tables internas, por este MySQL Server (SQL Node).

* `Ndb_api_table_scan_count_session`: Número de Table Scans que foram iniciados, incluindo Scans de tables internas, nesta Client Session.

* `Ndb_api_table_scan_count_slave`: Número de Table Scans que foram iniciados, incluindo Scans de tables internas, por esta Replica.

* `Ndb_api_trans_abort_count`: Número de Transactions Aborted por este MySQL Server (SQL Node).

* `Ndb_api_trans_abort_count_session`: Número de Transactions Aborted nesta Client Session.

* `Ndb_api_trans_abort_count_slave`: Número de Transactions Aborted por esta Replica.

* `Ndb_api_trans_close_count`: Número de Transactions fechadas por este MySQL Server (SQL Node); pode ser maior que a soma de TransCommitCount e TransAbortCount.

* `Ndb_api_trans_close_count_session`: Número de Transactions fechadas (pode ser maior que a soma de TransCommitCount e TransAbortCount) nesta Client Session.

* `Ndb_api_trans_close_count_slave`: Número de Transactions fechadas (pode ser maior que a soma de TransCommitCount e TransAbortCount) por esta Replica.

* `Ndb_api_trans_commit_count`: Número de Transactions Committed por este MySQL Server (SQL Node).

* `Ndb_api_trans_commit_count_session`: Número de Transactions Committed nesta Client Session.

* `Ndb_api_trans_commit_count_slave`: Número de Transactions Committed por esta Replica.

* `Ndb_api_trans_local_read_row_count`: Número total de Rows que foram lidas por este MySQL Server (SQL Node).

* `Ndb_api_trans_local_read_row_count_session`: Número total de Rows que foram lidas nesta Client Session.

* `Ndb_api_trans_local_read_row_count_slave`: Número total de Rows que foram lidas por esta Replica.

* `Ndb_api_trans_start_count`: Número de Transactions iniciadas por este MySQL Server (SQL Node).

* `Ndb_api_trans_start_count_session`: Número de Transactions iniciadas nesta Client Session.

* `Ndb_api_trans_start_count_slave`: Número de Transactions iniciadas por esta Replica.

* `Ndb_api_uk_op_count`: Número de operações baseadas ou que usam Unique Keys por este MySQL Server (SQL Node).

* `Ndb_api_uk_op_count_session`: Número de operações baseadas ou que usam Unique Keys nesta Client Session.

* `Ndb_api_uk_op_count_slave`: Número de operações baseadas ou que usam Unique Keys por esta Replica.

* `Ndb_api_wait_exec_complete_count`: Número de vezes que o Thread foi bloqueado esperando a conclusão da execução de operação por este MySQL Server (SQL Node).

* `Ndb_api_wait_exec_complete_count_session`: Número de vezes que o Thread foi bloqueado esperando a conclusão da execução de operação nesta Client Session.

* `Ndb_api_wait_exec_complete_count_slave`: Número de vezes que o Thread foi bloqueado esperando a conclusão da execução de operação por esta Replica.

* `Ndb_api_wait_meta_request_count`: Número de vezes que o Thread foi bloqueado esperando por um sinal baseado em metadata por este MySQL Server (SQL Node).

* `Ndb_api_wait_meta_request_count_session`: Número de vezes que o Thread foi bloqueado esperando por um sinal baseado em metadata nesta Client Session.

* `Ndb_api_wait_meta_request_count_slave`: Número de vezes que o Thread foi bloqueado esperando por um sinal baseado em metadata por esta Replica.

* `Ndb_api_wait_nanos_count`: Tempo total (em nanosegundos) gasto esperando por algum tipo de sinal dos Data Nodes por este MySQL Server (SQL Node).

* `Ndb_api_wait_nanos_count_session`: Tempo total (em nanosegundos) gasto esperando por algum tipo de sinal dos Data Nodes nesta Client Session.

* `Ndb_api_wait_nanos_count_slave`: Tempo total (em nanosegundos) gasto esperando por algum tipo de sinal dos Data Nodes por esta Replica.

* `Ndb_api_wait_scan_result_count`: Número de vezes que o Thread foi bloqueado esperando por um sinal baseado em Scan por este MySQL Server (SQL Node).

* `Ndb_api_wait_scan_result_count_session`: Número de vezes que o Thread foi bloqueado esperando por um sinal baseado em Scan nesta Client Session.

* `Ndb_api_wait_scan_result_count_slave`: Número de vezes que o Thread foi bloqueado esperando por um sinal baseado em Scan por esta Replica.

* `ndb_autoincrement_prefetch_sz`: Tamanho do Prefetch de Auto-Increment NDB.

* `ndb_cache_check_time`: Número de milissegundos entre as verificações de SQL Nodes do Cluster feitas pelo MySQL Query Cache.

* `ndb_clear_apply_status`: Faz com que RESET SLAVE/RESET REPLICA limpe todas as rows da table `ndb_apply_status`; ON por padrão.

* `Ndb_cluster_node_id`: Node ID deste servidor ao atuar como NDB Cluster SQL Node.

* `Ndb_config_from_host`: Host name ou Endereço IP do Servidor de Gerenciamento do NDB Cluster.

* `Ndb_config_from_port`: Port para conexão com o Servidor de Gerenciamento do NDB Cluster.

* `Ndb_conflict_fn_epoch`: Número de Rows que foram encontradas em conflito pela função de detecção de conflito de Replication NDB NDB$EPOCH().

* `Ndb_conflict_fn_epoch2`: Número de Rows que foram encontradas em conflito pela função de detecção de conflito de Replication NDB NDB$EPOCH2().

* `Ndb_conflict_fn_epoch2_trans`: Número de Rows que foram encontradas em conflito pela função de detecção de conflito de Replication NDB NDB$EPOCH2_TRANS().

* `Ndb_conflict_fn_epoch_trans`: Número de Rows que foram encontradas em conflito pela função de detecção de conflito NDB$EPOCH_TRANS().

* `Ndb_conflict_fn_max`: Número de vezes que a resolução de conflito de Replication NDB baseada em "o maior timestamp vence" foi aplicada a operações de Update e Delete.

* `Ndb_conflict_fn_max_del_win`: Número de vezes que a resolução de conflito de Replication NDB baseada no resultado de NDB$MAX_DELETE_WIN() foi aplicada a operações de Update e Delete.

* `Ndb_conflict_fn_old`: Número de vezes que a resolução de conflito NDB "o mesmo timestamp vence" foi aplicada.

* `Ndb_conflict_last_conflict_epoch`: Epoch NDB mais recente nesta Replica na qual algum conflito foi detectado.

* `Ndb_conflict_last_stable_epoch`: Epoch mais recente que não contém conflitos.

* `Ndb_conflict_reflected_op_discard_count`: Número de operações refletidas que não foram aplicadas devido a erro durante a execução.

* `Ndb_conflict_reflected_op_prepare_count`: Número de operações refletidas recebidas que foram preparadas para execução.

* `Ndb_conflict_refresh_op_count`: Número de operações de Refresh que foram preparadas.

* `Ndb_conflict_trans_conflict_commit_count`: Número de Epoch Transactions Committed após exigirem Transactional Conflict Handling.

* `Ndb_conflict_trans_detect_iter_count`: Número de iterações internas necessárias para Commitar a Epoch Transaction. Deve ser (ligeiramente) maior ou igual a Ndb_conflict_trans_conflict_commit_count.

* `Ndb_conflict_trans_reject_count`: Número de Transactions Rejected após serem encontradas em conflito pela função de Conflito Transactional.

* `Ndb_conflict_trans_row_conflict_count`: Número de Rows encontradas em conflito pela função de Conflito Transactional. Inclui quaisquer Rows incluídas ou dependentes de Transactions conflitantes.

* `Ndb_conflict_trans_row_reject_count`: Número total de Rows realinhadas após serem encontradas em conflito pela função de Conflito Transactional. Inclui Ndb_conflict_trans_row_conflict_count e quaisquer Rows incluídas ou dependentes de Transactions conflitantes.

* `ndb_data_node_neighbour`: Especifica o Data Node do Cluster "mais próximo" deste MySQL Server, para Transaction Hinting e tables totalmente replicadas.

* `ndb_default_column_format`: Define o Row Format e Column Format padrão (FIXED ou DYNAMIC) usados para novas tables NDB.

* `ndb_deferred_constraints`: Especifica que as verificações de Constraint devem ser adiadas (onde forem suportadas). Normalmente não é necessário ou usado; apenas para fins de teste.

* `ndb_distribution`: Distribution padrão para novas tables em NDBCLUSTER (KEYHASH ou LINHASH, o padrão é KEYHASH).

* `Ndb_epoch_delete_delete_count`: Número de conflitos delete-delete detectados (operação Delete é aplicada, mas a Row não existe).

* `ndb_eventbuffer_free_percent`: Porcentagem de memória livre que deve estar disponível no Event Buffer antes da retomada do buffering, após atingir o limite definido por ndb_eventbuffer_max_alloc.

* `ndb_eventbuffer_max_alloc`: Memória máxima que pode ser alocada para buffering de Events pela NDB API. O padrão é 0 (sem limite).

* `Ndb_execute_count`: Número de Round Trips para o kernel NDB realizadas pelas operações.

* `ndb_extra_logging`: Controla o logging de Schema NDB Cluster, Connection e Data Distribution Events no Error Log do MySQL.

* `ndb_force_send`: Força o envio de Buffers para o NDB imediatamente, sem esperar por outros Threads.

* `ndb_fully_replicated`: Se novas tables NDB são totalmente replicadas.

* `ndb_index_stat_enable`: Usa NDB Index Statistics na Query Optimization.

* `ndb_index_stat_option`: Lista de opções configuráveis separadas por vírgula para NDB Index Statistics; a lista não deve conter espaços.

* `ndb_join_pushdown`: Ativa o Pushing Down de Joins para Data Nodes.

* `Ndb_last_commit_epoch_server`: Epoch Committed mais recentemente pelo NDB.

* `Ndb_last_commit_epoch_session`: Epoch Committed mais recentemente por este NDB Client.

* `ndb_log_apply_status`: Se o MySQL Server atuando como Replica registra ou não as atualizações `mysql.ndb_apply_status` recebidas de sua Source imediata em seu próprio Binary Log, usando seu próprio Server ID.

* `ndb_log_bin`: Grava Updates em tables NDB no Binary Log. Efetivo apenas se o Binary Logging estiver ativado com --log-bin.

* `ndb_log_binlog_index`: Insere mapeamento entre epochs e Binary Log Positions na table `ndb_binlog_index`. O padrão é ON. Efetivo apenas se o Binary Logging estiver ativado.

* `ndb_log_empty_epochs`: Quando ativado, epochs nas quais não houve alterações são gravadas nas tables `ndb_apply_status` e `ndb_binlog_index`, mesmo quando log_replica_updates ou log_slave_updates estiver ativado.

* `ndb_log_empty_update`: Quando ativado, updates que não produzem alterações são gravados nas tables `ndb_apply_status` e `ndb_binlog_index`, mesmo quando log_replica_updates ou log_slave_updates estiver ativado.

* `ndb_log_exclusive_reads`: Registra Primary Key Reads com Exclusive Locks; permite a resolução de conflitos baseada em Read Conflicts.

* `ndb_log_orig`: Se o ID e o epoch do servidor de origem são registrados na table `mysql.ndb_binlog_index`. Definido usando a opção --ndb-log-orig ao iniciar o mysqld.

* `ndb_log_transaction_id`: Se NDB Transaction IDs são gravados no Binary Log (Somente leitura).

* `Ndb_number_of_data_nodes`: Número de Data Nodes neste NDB Cluster; definido apenas se o servidor participa do Cluster.

* `ndb-optimization-delay`: Número de milissegundos a aguardar entre o processamento de conjuntos de Rows por OPTIMIZE TABLE em tables NDB.

* `ndb_optimized_node_selection`: Determina como o SQL Node escolhe o Data Node do Cluster para usar como Transaction Coordinator.

* `Ndb_pruned_scan_count`: Número de Scans executados pelo NDB desde a última inicialização do Cluster, onde a otimização de Partition Pruning pôde ser usada.

* `Ndb_pushed_queries_defined`: Número de Joins que os API Nodes tentaram empurrar (push down) para os Data Nodes.

* `Ndb_pushed_queries_dropped`: Número de Joins que os API Nodes tentaram empurrar, mas falharam.

* `Ndb_pushed_queries_executed`: Número de Joins empurrados com sucesso e executados nos Data Nodes.

* `Ndb_pushed_reads`: Número de Reads executados nos Data Nodes por Joins empurrados (pushed-down).

* `ndb_read_backup`: Ativa Read de qualquer Replica para todas as tables NDB; use NDB_TABLE=READ_BACKUP={0|1} com CREATE TABLE ou ALTER TABLE para ativar ou desativar para tables NDB individuais.

* `ndb_recv_thread_activation_threshold`: Activation Threshold quando o Receive Thread assume o Polling da Cluster Connection (medido em Threads ativos simultaneamente).

* `ndb_recv_thread_cpu_mask`: Máscara de CPU para fixar Receiver Threads em CPUs específicas; especificado em hexadecimal. Consulte a documentação para detalhes.

* `ndb_report_thresh_binlog_epoch_slip`: NDB 7.5 e posterior: Threshold para o número de epochs completamente buffered, mas ainda não consumidos pelo Binlog Injector Thread, que quando excedido gera a mensagem de status de Buffer de Evento BUFFERED_EPOCHS_OVER_THRESHOLD; anterior ao NDB 7.5: Threshold para o número de epochs a atrasar antes de reportar o status do Binary Log.

* `ndb_report_thresh_binlog_mem_usage`: Threshold para a porcentagem de memória livre restante antes de reportar o status do Binary Log.

* `ndb_row_checksum`: Quando ativado, define Row Checksums; ativado por padrão.

* `Ndb_scan_count`: Número total de Scans executados pelo NDB desde a última inicialização do Cluster.

* `ndb_show_foreign_key_mock_tables`: Mostra as Mock Tables usadas para suportar foreign_key_checks=0.

* `ndb_slave_conflict_role`: Função (Role) para a Replica desempenhar na detecção e resolução de conflitos. O valor é um de PRIMARY, SECONDARY, PASS ou NONE (padrão). Só pode ser alterado quando o Thread SQL de Replication estiver parado. Consulte a documentação para mais informações.

* `Ndb_slave_max_replicated_epoch`: Epoch NDB Committed mais recentemente nesta Replica. Quando este valor é maior ou igual a Ndb_conflict_last_conflict_epoch, nenhum conflito foi detectado ainda.

* `Ndb_system_name`: System Name do Cluster configurado; vazio se o servidor não estiver conectado ao NDB.

* `ndb_table_no_logging`: As tables NDB criadas quando esta configuração está ativada não são Checkpointed para o disco (embora os arquivos de Schema da table sejam criados). A configuração em vigor quando a table é criada ou alterada para usar NDBCLUSTER persiste durante toda a vida útil da table.

* `ndb_table_temporary`: As tables NDB não são persistentes em disco: nenhum arquivo de Schema é criado e as tables não são registradas (logged).

* `ndb_use_copying_alter_table`: Usa operações de ALTER TABLE com cópia no NDB Cluster.

* `ndb_use_exact_count`: Força o NDB a usar uma contagem exata de registros durante o Query Planning de SELECT COUNT(\*) para acelerar este tipo de Query.

* `ndb_use_transactions`: Define como OFF para desativar o suporte a Transactions pelo NDB. Não recomendado, exceto em certos casos especiais; consulte a documentação para detalhes.

* `ndb_version`: Mostra o Build e a versão do NDB Engine como um Integer.

* `ndb_version_string`: Mostra as informações do Build, incluindo a versão do NDB Engine no formato ndb-x.y.z.

* `ndbcluster`: Ativa o NDB Cluster (se esta versão do MySQL o suportar). Desativado por [`--skip-ndbcluster`](mysql-cluster-options-variables.html#option_mysqld_skip-ndbcluster).

* `ndbinfo_database`: Nome usado para o NDB Information Database; somente leitura.

* `ndbinfo_max_bytes`: Usado apenas para Debugging.

* `ndbinfo_max_rows`: Usado apenas para Debugging.

* `ndbinfo_offline`: Coloca o Database `ndbinfo` no modo Offline, no qual nenhuma Row é retornada de tables ou Views.

* `ndbinfo_show_hidden`: Se deve mostrar as Base Tables internas do `ndbinfo` no MySQL Client; o padrão é OFF.

* `ndbinfo_table_prefix`: Prefix a ser usado para nomear as Base Tables internas do `ndbinfo`; somente leitura.

* `ndbinfo_version`: Versão do Engine ndbinfo; somente leitura.

* `server_id_bits`: Número de bits menos significativos em server_id realmente usados para identificar o servidor, permitindo que as aplicações NDB API armazenem dados da aplicação nos bits mais significativos. O server_id deve ser menor que 2 elevado à potência deste valor.

* `skip-ndbcluster`: Desativa o NDB Cluster Storage Engine.

* `slave_allow_batching`: Ativa e desativa o Update Batching para a Replica.

* `transaction_allow_batching`: Permite o Batching de Statements dentro de uma única Transaction. Desative AUTOCOMMIT para usar.
