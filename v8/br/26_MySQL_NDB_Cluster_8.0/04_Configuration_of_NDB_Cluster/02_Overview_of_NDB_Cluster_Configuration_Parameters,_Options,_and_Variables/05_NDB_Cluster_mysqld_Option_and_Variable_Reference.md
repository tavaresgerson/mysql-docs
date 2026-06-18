#### 25.4.2.5 Referência de opção e variável do cluster NDB mysqld

A lista a seguir inclui opções de linha de comando, variáveis de sistema e variáveis de status aplicáveis dentro de `mysqld` quando ele está rodando como um nó SQL em um NDB Cluster. Para uma referência a *todas* as opções de linha de comando, variáveis de sistema e variáveis de status usadas com ou relacionadas a **mysqld**, consulte a Seção 7.1.4, “Referência de Opção do Servidor, Variável de Sistema e Variável de Status”.

- `Com_show_ndb_status`: Contagem de declarações SHOW NDB STATUS.

- `Handler_discover`: Número de vezes que as tabelas foram descobertas.

- `ndb-applier-allow-skip-epoch`: Deixe o aplicativo de replicação ignorar épocas.

- `ndb-batch-size`: Tamanho (em bytes) a ser usado para lotes de transações NDB.

- `ndb-blob-read-batch-bytes`: Especifica o tamanho em bytes em que os grandes leitores de BLOB devem ser agrupados. 0 = sem limite.

- `ndb-blob-write-batch-bytes`: Especifica o tamanho em bytes em que os grandes escritos de BLOB devem ser agrupados. 0 = sem limite.

- `ndb-cluster-connection-pool`: Número de conexões ao clúster usadas pelo MySQL.

- `ndb-cluster-connection-pool-nodeids`: Lista separada por vírgula dos IDs de nó para conexões ao clúster usadas pelo MySQL; o número de nós na lista deve corresponder ao valor definido para --ndb-cluster-connection-pool.

- `ndb-connectstring`: Endereço do servidor de gerenciamento do NDB que distribui as informações de configuração para este clúster.

- `ndb-default-column-format`: Use este valor (FIXO ou DINÂMICO) como padrão para as opções COLUMN\_FORMAT e ROW\_FORMAT ao criar ou adicionar colunas da tabela.

- `ndb-deferred-constraints`: Especifica que os controles de restrição em índices únicos (onde esses são suportados) devem ser adiados até o momento do commit. Normalmente não é necessário ou usado; apenas para fins de teste.

- `ndb-distribution`: Distribuição padrão para novas tabelas em NDBCLUSTER (KEYHASH ou LINHASH, padrão é KEYHASH).

- `ndb-log-apply-status`: Faça com que o servidor MySQL que atua como replica registre as atualizações do mysql.ndb\_apply\_status recebidas de sua fonte imediata em seu próprio log binário, usando seu próprio ID de servidor. Efetivo apenas se o servidor for iniciado com a opção --ndbcluster.

- `ndb-log-empty-epochs`: Quando ativado, faz com que as épocas em que não houve alterações sejam escritas nas tabelas ndb\_apply\_status e ndb\_binlog\_index, mesmo quando a opção --log-slave-updates está ativada.

- `ndb-log-empty-update`: Quando ativado, faz com que as atualizações que não produziram alterações sejam escritas nas tabelas ndb\_apply\_status e ndb\_binlog\_index, mesmo quando a opção --log-slave-updates está ativada.

- `ndb-log-exclusive-reads`: Leia as chaves primárias do log com bloqueios exclusivos; permita a resolução de conflitos com base em conflitos de leitura.

- `ndb-log-fail-terminate`: Finalize o processo mysqld se a registro completo de todos os eventos das linhas encontradas não for possível.

- `ndb-log-orig`: Registre o ID do servidor de origem e o epócio na tabela mysql.ndb\_binlog\_index.

- `ndb-log-transaction-dependency`: Faça com que o thread de log binário calcule as dependências de transação para cada transação que ele escreve no log binário.

- `ndb-log-transaction-id`: Escreva os IDs de transações NDB no log binário. Requer --log-bin-v1-events=OFF.

- `ndb-log-update-minimal`: Atualizações de log em formato mínimo.

- `ndb-log-updated-only`: Atualizações de log apenas (ON) ou linhas completas (OFF).

- `ndb-log-update-as-write`: Ativa ou desativa o registro de atualizações na fonte entre as atualizações (DESATIVADO) e as escritas (ATIVADO).

- `ndb-mgmd-host`: Defina o host (e a porta, se desejar) para a conexão com o servidor de gerenciamento.

- `ndb-nodeid`: ID do nó do NDB Cluster para este servidor MySQL.

- `ndb-optimized-node-selection`: Habilitar otimizações para a seleção de nós para transações. Ativado por padrão; use --skip-ndb-optimized-node-selection para desativá-lo.

- `ndb-transid-mysql-connection-map`: Ative ou desative o plugin ndb\_transid\_mysql\_connection\_map; ou seja, ative ou desative a tabela INFORMATION\_SCHEMA com esse nome.

- `ndb-wait-connected`: Tempo (em segundos) que o servidor MySQL deve esperar para se conectar ao gerenciamento do cluster e aos nós de dados antes de aceitar conexões de clientes MySQL.

- `ndb-wait-setup`: Tempo (em segundos) que o servidor MySQL leva para aguardar a conclusão da configuração do motor NDB.

- `ndb-allow-copying-alter-table`: Defina para OFF para impedir que o ALTER TABLE use operações de cópia em tabelas NDB.

- `Ndb_api_adaptive_send_deferred_count`: Número de chamadas de envio adaptativas que não foram realmente enviadas por este servidor MySQL (nó SQL).

- `Ndb_api_adaptive_send_deferred_count_session`: Número de chamadas de envio adaptativas que não foram realmente enviadas nesta sessão do cliente.

- `Ndb_api_adaptive_send_deferred_count_replica`: Número de chamadas de envio adaptativas que não foram realmente enviadas por esta réplica.

- `Ndb_api_adaptive_send_deferred_count_slave`: Número de chamadas de envio adaptativas que não foram realmente enviadas por esta réplica.

- `Ndb_api_adaptive_send_forced_count`: Número de envios adaptativos com o envio forçado definido enviados por este servidor MySQL (nó SQL).

- `Ndb_api_adaptive_send_forced_count_session`: Número de envios adaptativos com envio forçado configurado nesta sessão do cliente.

- `Ndb_api_adaptive_send_forced_count_replica`: Número de envios adaptativos com o envio forçado definido por esta réplica.

- `Ndb_api_adaptive_send_forced_count_slave`: Número de envios adaptativos com o envio forçado definido por esta réplica.

- `Ndb_api_adaptive_send_unforced_count`: Número de envios adaptativos sem envios forçados enviados por este servidor MySQL (nó SQL).

- `Ndb_api_adaptive_send_unforced_count_session`: Número de envios adaptativos sem envio forçado nesta sessão do cliente.

- `Ndb_api_adaptive_send_unforced_count_replica`: Número de envios adaptativos sem envios forçados enviados por esta réplica.

- `Ndb_api_adaptive_send_unforced_count_slave`: Número de envios adaptativos sem envios forçados enviados por esta réplica.

- `Ndb_api_bytes_received_count`: Quantidade de dados (em bytes) recebidos dos nós de dados por este servidor MySQL (nó SQL).

- `Ndb_api_bytes_received_count_session`: Quantidade de dados (em bytes) recebidos dos nós de dados nesta sessão do cliente.

- `Ndb_api_bytes_received_count_replica`: Quantidade de dados (em bytes) recebidos por esta réplica dos nós de dados.

- `Ndb_api_bytes_received_count_slave`: Quantidade de dados (em bytes) recebidos por esta réplica dos nós de dados.

- `Ndb_api_bytes_sent_count`: Quantidade de dados (em bytes) enviados para os nós de dados por este servidor MySQL (nó SQL).

- `Ndb_api_bytes_sent_count_session`: Quantidade de dados (em bytes) enviados para os nós de dados nesta sessão do cliente.

- `Ndb_api_bytes_sent_count_replica`: Quantidade de dados (em bytes) enviados para os nós de dados por esta replica.

- `Ndb_api_bytes_sent_count_slave`: Quantidade de dados (em bytes) enviados para os nós de dados por esta replica.

- `Ndb_api_event_bytes_count`: Número de bytes de eventos recebidos por este servidor MySQL (nó SQL).

- `Ndb_api_event_bytes_count_injector`: Número de bytes de dados de evento recebidos pelo fio de injetor de log binário NDB.

- `Ndb_api_event_data_count`: Número de eventos de alteração de linha recebidos por este servidor MySQL (nó SQL).

- `Ndb_api_event_data_count_injector`: Número de eventos de alteração de linha recebidos pelo fio de injeção de log binário do NDB.

- `Ndb_api_event_nondata_count`: Número de eventos recebidos, além dos eventos de alteração de linha, por este servidor MySQL (nó SQL).

- `Ndb_api_event_nondata_count_injector`: Número de eventos recebidos, além dos eventos de alteração de linha, pelo fio de injeção de log binário NDB.

- `Ndb_api_pk_op_count`: Número de operações baseadas em ou que utilizam chaves primárias por este servidor MySQL (nó SQL).

- `Ndb_api_pk_op_count_session`: Número de operações baseadas em ou que utilizam chaves primárias nesta sessão do cliente.

- `Ndb_api_pk_op_count_replica`: Número de operações baseadas em ou que utilizam chaves primárias por esta réplica.

- `Ndb_api_pk_op_count_slave`: Número de operações baseadas em ou que utilizam chaves primárias por esta réplica.

- `Ndb_api_pruned_scan_count`: Número de varreduras que foram reduzidas a uma partição por este servidor MySQL (nó SQL).

- `Ndb_api_pruned_scan_count_session`: Número de varreduras que foram reduzidas a uma partição nesta sessão do cliente.

- `Ndb_api_pruned_scan_count_replica`: Número de varreduras que foram reduzidas a uma partição por esta réplica.

- `Ndb_api_pruned_scan_count_slave`: Número de varreduras que foram reduzidas a uma partição por esta réplica.

- `Ndb_api_range_scan_count`: Número de varreduras de intervalo iniciadas por este servidor MySQL (nó SQL).

- `Ndb_api_range_scan_count_session`: Número de varreduras de intervalo iniciadas nesta sessão do cliente.

- `Ndb_api_range_scan_count_replica`: Número de varreduras de intervalo iniciadas por esta réplica.

- `Ndb_api_range_scan_count_slave`: Número de varreduras de intervalo iniciadas por esta réplica.

- `Ndb_api_read_row_count`: Número total de linhas que foram lidas por este servidor MySQL (nó SQL).

- `Ndb_api_read_row_count_session`: Número total de linhas que foram lidas nesta sessão do cliente.

- `Ndb_api_read_row_count_replica`: Número total de linhas que foram lidas por esta réplica.

- `Ndb_api_read_row_count_slave`: Número total de linhas que foram lidas por esta réplica.

- `Ndb_api_scan_batch_count`: Número de lotes de linhas recebidos por este servidor MySQL (nó SQL).

- `Ndb_api_scan_batch_count_session`: Número de lotes de linhas recebidos nesta sessão do cliente.

- `Ndb_api_scan_batch_count_replica`: Número de lotes de linhas recebidos por esta réplica.

- `Ndb_api_scan_batch_count_slave`: Número de lotes de linhas recebidos por esta réplica.

- `Ndb_api_table_scan_count`: Número de varreduras de tabela que foram iniciadas, incluindo varreduras de tabelas internas, por este servidor MySQL (nó SQL).

- `Ndb_api_table_scan_count_session`: Número de varreduras de tabela que foram iniciadas, incluindo varreduras de tabelas internas, nesta sessão do cliente.

- `Ndb_api_table_scan_count_replica`: Número de varreduras de tabela que foram iniciadas, incluindo varreduras de tabelas internas, por esta réplica.

- `Ndb_api_table_scan_count_slave`: Número de varreduras de tabela que foram iniciadas, incluindo varreduras de tabelas internas, por esta réplica.

- `Ndb_api_trans_abort_count`: Número de transações abortadas por este servidor MySQL (nó SQL).

- `Ndb_api_trans_abort_count_session`: Número de transações abortadas nesta sessão do cliente.

- `Ndb_api_trans_abort_count_replica`: Número de transações abortadas por esta réplica.

- `Ndb_api_trans_abort_count_slave`: Número de transações abortadas por esta réplica.

- `Ndb_api_trans_close_count`: Número de transações fechadas por este servidor MySQL (nó SQL); pode ser maior que a soma de TransCommitCount e TransAbortCount.

- `Ndb_api_trans_close_count_session`: Número de transações abortadas (pode ser maior que a soma de TransCommitCount e TransAbortCount) nesta sessão do cliente.

- `Ndb_api_trans_close_count_replica`: Número de transações abortadas (pode ser maior que a soma de TransCommitCount e TransAbortCount) por esta réplica.

- `Ndb_api_trans_close_count_slave`: Número de transações abortadas (pode ser maior que a soma de TransCommitCount e TransAbortCount) por esta réplica.

- `Ndb_api_trans_commit_count`: Número de transações realizadas por este servidor MySQL (nó SQL).

- `Ndb_api_trans_commit_count_session`: Número de transações realizadas nesta sessão do cliente.

- `Ndb_api_trans_commit_count_replica`: Número de transações realizadas por esta réplica.

- `Ndb_api_trans_commit_count_slave`: Número de transações realizadas por esta réplica.

- `Ndb_api_trans_local_read_row_count`: Número total de linhas que foram lidas por este servidor MySQL (nó SQL).

- `Ndb_api_trans_local_read_row_count_session`: Número total de linhas que foram lidas nesta sessão do cliente.

- `Ndb_api_trans_local_read_row_count_replica`: Número total de linhas que foram lidas por esta réplica.

- `Ndb_api_trans_local_read_row_count_slave`: Número total de linhas que foram lidas por esta réplica.

- `Ndb_api_trans_start_count`: Número de transações iniciadas por este servidor MySQL (nó SQL).

- `Ndb_api_trans_start_count_session`: Número de transações iniciadas nesta sessão do cliente.

- `Ndb_api_trans_start_count_replica`: Número de transações iniciadas por esta réplica.

- `Ndb_api_trans_start_count_slave`: Número de transações iniciadas por esta réplica.

- `Ndb_api_uk_op_count`: Número de operações baseadas em ou que utilizam chaves únicas por este servidor MySQL (nó SQL).

- `Ndb_api_uk_op_count_session`: Número de operações baseadas em ou que utilizam chaves únicas nesta sessão do cliente.

- `Ndb_api_uk_op_count_replica`: Número de operações baseadas em ou que utilizam chaves únicas por esta réplica.

- `Ndb_api_uk_op_count_slave`: Número de operações baseadas em ou que utilizam chaves únicas por esta réplica.

- `Ndb_api_wait_exec_complete_count`: Número de vezes que o fio foi bloqueado enquanto aguardava a conclusão da execução da operação por este servidor MySQL (nó SQL).

- `Ndb_api_wait_exec_complete_count_session`: Número de vezes que o fio foi bloqueado enquanto aguardava a conclusão da execução da operação nesta sessão do cliente.

- `Ndb_api_wait_exec_complete_count_replica`: Número de vezes que o fio foi bloqueado enquanto aguardava a conclusão da execução da operação por esta réplica.

- `Ndb_api_wait_exec_complete_count_slave`: Número de vezes que o fio foi bloqueado enquanto aguardava a conclusão da execução da operação por esta réplica.

- `Ndb_api_wait_meta_request_count`: Número de vezes que o fio foi bloqueado esperando por um sinal baseado em metadados por este servidor MySQL (nó SQL).

- `Ndb_api_wait_meta_request_count_session`: Número de vezes que o fio foi bloqueado esperando por um sinal baseado em metadados nesta sessão do cliente.

- `Ndb_api_wait_meta_request_count_replica`: Número de vezes que o fio foi bloqueado esperando por um sinal baseado em metadados por esta réplica.

- `Ndb_api_wait_meta_request_count_slave`: Número de vezes que o fio foi bloqueado esperando por um sinal baseado em metadados por esta réplica.

- `Ndb_api_wait_nanos_count`: Tempo total (em nanosegundos) gasto esperando por algum tipo de sinal dos nós de dados por este servidor MySQL (nó SQL).

- `Ndb_api_wait_nanos_count_session`: Tempo total (em nanosegundos) gasto esperando por algum tipo de sinal dos nós de dados nesta sessão do cliente.

- `Ndb_api_wait_nanos_count_replica`: Tempo total (em nanosegundos) gasto esperando por algum tipo de sinal dos nós de dados por esta réplica.

- `Ndb_api_wait_nanos_count_slave`: Tempo total (em nanosegundos) gasto esperando por algum tipo de sinal dos nós de dados por esta réplica.

- `Ndb_api_wait_scan_result_count`: Número de vezes que o fio foi bloqueado enquanto aguardava por um sinal baseado em varredura por este servidor MySQL (nó SQL).

- `Ndb_api_wait_scan_result_count_session`: Número de vezes que o fio foi bloqueado enquanto aguardava por um sinal baseado em varredura nesta sessão do cliente.

- `Ndb_api_wait_scan_result_count_replica`: Número de vezes que o fio foi bloqueado enquanto aguardava por um sinal baseado em varredura por esta réplica.

- `Ndb_api_wait_scan_result_count_slave`: Número de vezes que o fio foi bloqueado enquanto aguardava por um sinal baseado em varredura por esta réplica.

- `ndb_autoincrement_prefetch_sz`: Tamanho de pré-visualização de incremento automático do NDB.

- `ndb_clear_apply_status`: Faz com que RESET SLAVE/RESET REPLICA limpem todas as linhas da tabela ndb\_apply\_status; ativado por padrão.

- `Ndb_cluster_node_id`: ID do nó deste servidor quando atuando como nó SQL do NDB Cluster.

- `Ndb_config_from_host`: Nome do host ou endereço IP do servidor de gerenciamento do NDB Cluster.

- `Ndb_config_from_port`: Porta para conexão com o servidor de gerenciamento do NDB Cluster.

- `Ndb_config_generation`: Número de geração da configuração atual do cluster.

- `Ndb_conflict_fn_epoch`: Número de linhas que foram encontradas em conflito pela função de detecção de conflitos de replicação NDB$EPOCH().

- `Ndb_conflict_fn_epoch2`: Número de linhas que foram encontradas em conflito pela função de detecção de conflitos NDB$EPOCH2().

- `Ndb_conflict_fn_epoch2_trans`: Número de linhas que foram encontradas em conflito pela função de detecção de conflitos NDB$EPOCH2\_TRANS() da replicação NDB.

- `Ndb_conflict_fn_epoch_trans`: Número de linhas que foram encontradas em conflito pela função de detecção de conflitos NDB$EPOCH\_TRANS().

- `Ndb_conflict_fn_max`: Número de vezes que a resolução de conflitos de replicação do NDB com base na regra "o timestamp maior vence" foi aplicada em operações de atualização e exclusão.

- `Ndb_conflict_fn_max_del_win`: Número de vezes que a resolução de conflitos de replicação NDB com base no resultado de NDB$MAX\_DELETE\_WIN() foi aplicada para operações de atualização e exclusão.

- `Ndb_conflict_fn_max_ins`: Número de vezes que a resolução de conflitos de replicação NDB com base na regra "o timestamp maior vence" foi aplicada em operações de inserção.

- `Ndb_conflict_fn_max_del_win_ins`: Número de vezes que a resolução de conflitos de replicação NDB com base no resultado de NDB$MAX\_DEL\_WIN\_INS() foi aplicada às operações de inserção.

- `Ndb_conflict_fn_old`: Número de vezes que a resolução de conflitos da replicação NDB "mesmo timestamp vence" foi aplicada.

- `Ndb_conflict_last_conflict_epoch`: Época mais recente do NDB nesta réplica na qual foi detectado algum conflito.

- `Ndb_conflict_last_stable_epoch`: A época mais recente sem conflitos.

- `Ndb_conflict_reflected_op_discard_count`: Número de operações refletidas que não foram aplicadas devido a um erro durante a execução.

- `Ndb_conflict_reflected_op_prepare_count`: Número de operações refletidas recebidas que foram preparadas para execução.

- `Ndb_conflict_refresh_op_count`: Número de operações de atualização preparadas.

- `ndb_conflict_role`: Papel que a réplica deve desempenhar na detecção e resolução de conflitos. O valor é um dos valores PRIMARY, SECONDARY, PASS ou NONE (padrão). Pode ser alterado apenas quando o thread de SQL de replicação é interrompido. Consulte a documentação para obter mais informações.

- `Ndb_conflict_trans_conflict_commit_count`: Número de transações de época comprometidas após a exigência de tratamento de conflitos transacionais.

- `Ndb_conflict_trans_detect_iter_count`: Número de iterações internas necessárias para confirmar a transação de época. Deve ser (levemente) maior ou igual a Ndb\_conflict\_trans\_conflict\_commit\_count.

- `Ndb_conflict_trans_reject_count`: Número de transações rejeitadas após serem encontradas em conflito pela função de conflito transacional.

- `Ndb_conflict_trans_row_conflict_count`: Número de linhas encontradas em conflito pela função de conflito transacional. Inclui quaisquer linhas incluídas em transações conflitantes ou dependentes delas.

- `Ndb_conflict_trans_row_reject_count`: Número total de linhas realinhadas após serem encontradas em conflito pela função de conflito transacional. Inclui Ndb\_conflict\_trans\_row\_conflict\_count e quaisquer linhas incluídas em transações conflitantes ou dependentes delas.

- `ndb_data_node_neighbour`: Especifica o nó de dados do cluster "mais próximo" deste servidor MySQL, para dicas de transações e tabelas totalmente replicadas.

- `ndb_default_column_format`: Define o formato padrão da linha e do cabeçalho (FIXO ou DINÂMICO) usado para novas tabelas NDB.

- `ndb_deferred_constraints`: Especifica que os controles de restrição devem ser adiados (onde esses forem suportados). Normalmente não é necessário ou usado; apenas para fins de teste.

- `ndb_dbg_check_shares`: Verifique se há ações persistentes (apenas builds de depuração).

- `ndb-schema-dist-timeout`: Quanto tempo esperar antes de detectar o tempo limite durante a distribuição do esquema.

- `ndb_distribution`: Distribuição padrão para novas tabelas em NDBCLUSTER (KEYHASH ou LINHASH, padrão é KEYHASH).

- `Ndb_epoch_delete_delete_count`: Número de conflitos de exclusão-exclusão detectados (a operação de exclusão é aplicada, mas a linha não existe).

- `ndb_eventbuffer_free_percent`: Porcentagem de memória livre que deve estar disponível no buffer de eventos antes da retomada do buffer, após atingir o limite definido por ndb\_eventbuffer\_max\_alloc.

- `ndb_eventbuffer_max_alloc`: Memória máxima que pode ser alocada para o bufferamento de eventos pela API NDB. O padrão é 0 (sem limite).

- `Ndb_execute_count`: Número de viagens de ida e volta feitas pelo kernel NDB pelas operações.

- `ndb_extra_logging`: Controla o registro de eventos de esquema do NDB Cluster, conexão e distribuição de dados no log de erro do MySQL.

- `Ndb_fetch_table_stats`: Número de vezes que as estatísticas da tabela foram obtidas das tabelas em vez do cache.

- `ndb_force_send`: Força o envio de buffers para o NDB imediatamente, sem esperar por outros threads.

- `ndb_fully_replicated`: Se as novas tabelas NDB são totalmente replicadas.

- `ndb_index_stat_enable`: Use estatísticas de índice NDB na otimização de consultas.

- `ndb_index_stat_option`: Lista separada por vírgula das opções ajustáveis para estatísticas do índice NDB; a lista não deve conter espaços.

- `ndb_join_pushdown`: Habilita a empurrar as junções para os nós de dados.

- `Ndb_last_commit_epoch_server`: Epoch mais recentemente comprometido pelo NDB.

- `Ndb_last_commit_epoch_session`: Epoch mais recentemente comprometido por este cliente NDB.

- `ndb_log_apply_status`: Se o servidor MySQL que atua como replica registrar ou não as atualizações do mysql.ndb\_apply\_status recebidas de sua fonte imediata em seu próprio log binário, usando seu próprio ID de servidor.

- `ndb_log_bin`: Escreva atualizações em tabelas NDB no log binário. Efetivo apenas se o registro binário estiver habilitado com --log-bin.

- `ndb_log_binlog_index`: Insira a mapeamento entre épocas e posições do log binário na tabela ndb\_binlog\_index. Definições padrão: ON. Efetiva apenas se o registro binário estiver habilitado.

- `ndb_log_cache_size`: Defina o tamanho do cache de transações usado para gravar o log binário NDB.

- `ndb_log_empty_epochs`: Quando ativado, as épocas em que não houve alterações são escritas nas tabelas ndb\_apply\_status e ndb\_binlog\_index, mesmo quando o log\_replica\_updates ou log\_slave\_updates está ativado.

- `ndb_log_empty_update`: Quando ativado, as atualizações que não produzem alterações são escritas nas tabelas ndb\_apply\_status e ndb\_binlog\_index, mesmo quando o log\_replica\_updates ou log\_slave\_updates está ativado.

- `ndb_log_exclusive_reads`: Leia as chaves primárias do log com bloqueios exclusivos; permita a resolução de conflitos com base em conflitos de leitura.

- `ndb_log_orig`: Se o id e o epócio do servidor de origem são registrados na tabela mysql.ndb\_binlog\_index. Defina usando a opção --ndb-log-orig ao iniciar o mysqld.

- `ndb_log_transaction_id`: Se os IDs de transação do NDB são escritos no log binário (somente leitura).

- `ndb_log_transaction_compression`: Se comprimir o log binário do NDB; também pode ser ativado ao iniciar, habilitando a opção --binlog-transaction-compression.

- `ndb_log_transaction_compression_level_zstd`: O nível de compressão ZSTD a ser usado ao gravar transações comprimidas no log binário NDB.

- `ndb_metadata_check`: Ative a detecção automática de alterações nos metadados do NDB em relação ao dicionário de dados do MySQL; ativado por padrão.

- `Ndb_metadata_blacklist_size`: Número de objetos de metadados do NDB que o NDB binlog thread não conseguiu sincronizar; renomeado no NDB 8.0.22 como Ndb\_metadata\_excluded\_count.

- `ndb_metadata_check_interval`: Intervalo em segundos para realizar a verificação de alterações nos metadados do NDB em relação ao dicionário de dados do MySQL.

- `Ndb_metadata_detected_count`: Número de vezes que o monitor de alterações de metadados do NDB detectou alterações.

- `Ndb_metadata_excluded_count`: Número de objetos de metadados do NDB que o thread do binlog do NDB não conseguiu sincronizar.

- `ndb_metadata_sync`: Desenha a sincronização imediata de todas as alterações entre o dicionário NDB e o dicionário de dados MySQL; faz com que os valores ndb\_metadata\_check e ndb\_metadata\_check\_interval sejam ignorados. Redefine para false quando a sincronização estiver concluída.

- `Ndb_metadata_synced_count`: Número de objetos de metadados do NDB que foram sincronizados.

- `Ndb_number_of_data_nodes`: Número de nós de dados neste cluster NDB; definido apenas se o servidor participar do cluster.

- `ndb-optimization-delay`: Número de milissegundos para esperar entre o processamento de conjuntos de linhas por OPTIMIZE TABLE em tabelas NDB.

- `ndb_optimized_node_selection`: Determina como o nó SQL escolhe o nó de dados do cluster a ser usado como coordenador de transação.

- `Ndb_pruned_scan_count`: Número de varreduras executadas pelo NDB desde que o clúster foi iniciado pela última vez, onde a poda de partição pode ser usada.

- `Ndb_pushed_queries_defined`: Número de junções que os nós da API tentaram enviar para os nós de dados.

- `Ndb_pushed_queries_dropped`: Número de junções que os nós da API tentaram enviar para baixo, mas falharam.

- `Ndb_pushed_queries_executed`: Número de junções que foram empurradas com sucesso e executadas nos nós de dados.

- `Ndb_pushed_reads`: Número de leituras executadas nos nós de dados por junções empurradas para baixo.

- `ndb_read_backup`: Habilitar a leitura de qualquer replica para todas as tabelas NDB; use NDB\_TABLE=READ\_BACKUP={0|1} com CREATE TABLE ou ALTER TABLE para habilitar ou desabilitar para tabelas NDB individuais.

- `ndb_recv_thread_activation_threshold`: Limiar de ativação quando o fio de recebimento assume a verificação da conexão do cluster (medido em fios ativos simultaneamente].

- `ndb_recv_thread_cpu_mask`: Máscara de CPU para bloquear os threads do receptor em CPUs específicas; especificada como hexadecimal. Consulte a documentação para detalhes.

- `Ndb_replica_max_replicated_epoch`: Época da NDB mais recentemente comprometida nesta replica. Quando esse valor for maior ou igual a Ndb\_conflict\_last\_conflict\_epoch, nenhum conflito ainda foi detectado.

- `ndb_replica_batch_size`: Tamanho do lote em bytes para o aplicativo de replicação.

- `ndb_report_thresh_binlog_epoch_slip`: NDB 7.5 e versões posteriores: Limiar para o número de épocas completamente em buffer, mas ainda não consumidas pelo fio injetor binlog, que, quando ultrapassado, gera a mensagem de status de buffer do evento BUFFERED\_EPOCHS\_OVER\_THRESHOLD; antes da NDB 7.5: Limiar para o número de épocas para ficar para trás antes de relatar o status do log binário.

- `ndb_report_thresh_binlog_mem_usage`: Limiar para a porcentagem de memória livre restante antes de relatar o status do log binário.

- `ndb_row_checksum`: Quando ativado, defina os checksums das linhas; ativado por padrão.

- `Ndb_scan_count`: Número total de varreduras executadas pelo NDB desde que o clúster foi iniciado pela última vez.

- `ndb_schema_dist_lock_wait_timeout`: Tempo durante a distribuição do esquema para esperar por bloqueio antes de retornar o erro.

- `ndb_schema_dist_timeout`: Tempo de espera antes de detectar o tempo limite durante a distribuição do esquema.

- `ndb_schema_dist_upgrade_allowed`: Permita a atualização da tabela de distribuição do esquema ao se conectar ao NDB.

- `Ndb_schema_participant_count`: Número de servidores MySQL que participam da distribuição de alterações no esquema NDB.

- `ndb_show_foreign_key_mock_tables`: Mostrar tabelas fictícias usadas para suportar foreign\_key\_checks=0.

- `ndb_slave_conflict_role`: Papel que a réplica deve desempenhar na detecção e resolução de conflitos. O valor é um dos valores PRIMARY, SECONDARY, PASS ou NONE (padrão). Pode ser alterado apenas quando o thread de SQL de replicação é interrompido. Consulte a documentação para obter mais informações.

- `Ndb_slave_max_replicated_epoch`: Época da NDB mais recentemente comprometida nesta replica. Quando esse valor for maior ou igual a Ndb\_conflict\_last\_conflict\_epoch, nenhum conflito ainda foi detectado.

- `Ndb_system_name`: Nome do sistema de clúster configurado; vazio se o servidor não estiver conectado ao NDB.

- `ndb_table_no_logging`: As tabelas NDB criadas quando essa configuração é habilitada não são checkpointeadas no disco (embora os arquivos de esquema da tabela sejam criados). A configuração entra em vigor quando a tabela é criada ou alterada para usar NDBCLUSTER e permanece válida por toda a vida útil da tabela.

- `ndb_table_temporary`: As tabelas NDB não são persistentes no disco: não são criados arquivos de esquema e as tabelas não são registradas.

- `Ndb_trans_hint_count_session`: Número de transações que utilizam dicas que foram iniciadas nesta sessão.

- `ndb_use_copying_alter_table`: Use operações de cópia ALTER TABLE no NDB Cluster.

- `ndb_use_exact_count`: Força o NDB a usar um contagem de registros durante o planejamento da consulta SELECT COUNT(\*) para acelerar esse tipo de consulta.

- `ndb_use_transactions`: Definido para OFF, para desativar o suporte de transações pelo NDB. Não recomendado, exceto em certos casos especiais; consulte a documentação para obter detalhes.

- `ndb_version`: Mostra a versão do motor NDB e da compilação como um número inteiro.

- `ndb_version_string`: Exibe informações de compilação, incluindo a versão do motor NDB no formato ndb-x.y.z.

- `ndbcluster`: Habilitar NDB Cluster (se esta versão do MySQL o suportar). Desativado por `--skip-ndbcluster`.

- `ndbinfo`: Habilitar o plugin ndbinfo, se suportado.

- `ndbinfo_database`: Nome usado para o banco de dados de informações NDB; apenas leitura.

- `ndbinfo_max_bytes`: Usado apenas para depuração.

- `ndbinfo_max_rows`: Usado apenas para depuração.

- `ndbinfo_offline`: Coloque o banco de dados ndbinfo no modo offline, no qual nenhuma linha é retornada das tabelas ou visualizações.

- `ndbinfo_show_hidden`: Se deve exibir as tabelas de base internas ndbinfo no cliente mysql; o padrão é desativado.

- `ndbinfo_table_prefix`: Prefixo a ser usado para nomear as tabelas de base internas do ndbinfo; apenas leitura.

- `ndbinfo_version`: versão do motor ndbinfo; apenas leitura.

- `replica_allow_batching`: Ativa e desativa o agrupamento de lotes de atualização para replica.

- `server_id_bits`: Número de bits menos significativos no \_server\_id realmente utilizados para identificar o servidor, permitindo que os aplicativos da API NDB armazenem dados de aplicativos nos bits mais significativos. \_server\_id deve ser menor que 2 elevado a esse valor.

- `skip-ndbcluster`: Desative o motor de armazenamento do NDB Cluster.

- `slave_allow_batching`: Ativa e desativa o agrupamento de lotes de atualização para replica.

- `transaction_allow_batching`: Permite a agrupamento de declarações dentro de uma única transação. Desative o AUTOCOMMIT para usar.
