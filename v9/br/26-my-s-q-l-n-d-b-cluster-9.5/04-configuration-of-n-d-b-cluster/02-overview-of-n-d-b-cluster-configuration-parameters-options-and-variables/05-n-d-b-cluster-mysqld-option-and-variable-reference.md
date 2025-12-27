#### 25.4.2.5 Referência de Opções e Variáveis do NDB Cluster mysqld

A lista a seguir inclui opções de linha de comando, variáveis de sistema e variáveis de status aplicáveis no `mysqld` quando ele está executando como um nó SQL em um NDB Cluster. Para uma referência a *todas* as opções de linha de comando, variáveis de sistema e variáveis de status usadas com ou relacionadas a **mysqld**, consulte a Seção 7.1.4, “Referência de Opções de Servidor, Variáveis de Sistema e Variáveis de Status”.

* `Com_show_ndb_status`: Contagem de instruções SHOW NDB STATUS.

* `Handler_discover`: Número de vezes que as tabelas foram descobertas.

* `ndb-applier-allow-skip-epoch`: Permite que o aplicador de replicação ignore épocas.

* `ndb-batch-size`: Tamanho (em bytes) a ser usado para lotes de transações NDB.

* `ndb-blob-read-batch-bytes`: Especifica o tamanho em bytes em que leituras de BLOB grandes devem ser agrupadas. 0 = sem limite.

* `ndb-blob-write-batch-bytes`: Especifica o tamanho em bytes em que escritas de BLOB grandes devem ser agrupadas. 0 = sem limite.

* `ndb-cluster-connection-pool`: Número de conexões ao cluster usadas pelo MySQL.

* `ndb-cluster-connection-pool-nodeids`: Lista separada por vírgula de IDs de nó para conexões ao cluster usadas pelo MySQL; o número de nós na lista deve corresponder ao valor definido para --ndb-cluster-connection-pool.

* `ndb-connectstring`: Endereço do servidor de gerenciamento NDB que distribui informações de configuração para este cluster.

* `ndb-default-column-format`: Use este valor (FIXED ou DYNAMIC) como padrão para as opções COLUMN\_FORMAT e ROW\_FORMAT ao criar ou adicionar colunas de tabela.

* `ndb-deferred-constraints`: Especifica que os verificações de restrições em índices únicos (onde esses são suportados) devem ser adiadas até o momento do commit. Normalmente não é necessário ou usado; apenas para fins de teste.

* `ndb-distribution`: Distribuição padrão para novas tabelas no NDBCLUSTER (KEYHASH ou LINHASH, padrão é KEYHASH).

* `ndb-log-apply-status`: Faça com que o servidor MySQL que atua como replica registre as atualizações de `mysql.ndb\_apply\_status` recebidas de sua fonte imediata em seu próprio log binário, usando seu próprio ID de servidor. Efetivo apenas se o servidor for iniciado com a opção `--ndbcluster`.

* `ndb-log-empty-epochs`: Quando ativado, faz com que as épocas em que não houve alterações sejam escritas nas tabelas `ndb\_apply\_status` e `ndb\_binlog\_index`, mesmo quando `--log-slave-updates` está ativado.

* `ndb-log-empty-update`: Quando ativado, faz com que as atualizações que não produziram alterações sejam escritas nas tabelas `ndb\_apply\_status` e `ndb\_binlog\_index`, mesmo quando `--log-slave-updates` está ativado.

* `ndb-log-exclusive-reads`: Registre leituras de chave primária com bloqueios exclusivos; permita a resolução de conflitos com base em conflitos de leitura.

* `ndb-log-fail-terminate`: Terminate o processo mysqld se não for possível registrar completamente todos os eventos de linha encontrados.

* `ndb-log-orig`: Registre o ID do servidor de origem e a época na tabela `mysql.ndb\_binlog\_index`.

* `ndb-log-row-slice-count`: Número de fatias a serem calculadas por este servidor ao se inscrever em fluxos de eventos de alteração de tabela NDB usados para gravação de logs binários.

* `ndb-log-row-slice-id`: ID da fatia virtual (de fluxos de eventos de alteração de tabela NDB) ao qual este servidor está inscrito.

* `ndb-log-transaction-dependency`: Faça com que o thread de log binário calcule as dependências de transação para cada transação que escreve no log binário.

* `ndb-log-transaction-id`: Escreva IDs de transações NDB no log binário. Requer `--log-bin-v1-events=OFF`.

* `ndb-log-update-minimal`: Registre atualizações no formato mínimo.

* `ndb-log-updated-only`: Registre apenas atualizações (ON) ou linhas completas (OFF).

* `ndb-log-update-as-write`: Habilita ou desabilita o registro de atualizações na fonte entre atualizações (DESATIVADO) e escritas (ATIVADO).

* `ndb-mgm-tls`: Define se os requisitos de conexão TLS são rigorosos ou flexíveis.

* `ndb-mgmd-host`: Define o host (e a porta, se desejado) para a conexão com o servidor de gerenciamento.

* `ndb-nodeid`: ID do nó do NDB Cluster para este servidor MySQL.

* `ndb-optimized-node-selection`: Habilita otimizações para a seleção de nós para transações. Ativado por padrão; use --skip-ndb-optimized-node-selection para desativá-lo.

* `ndb-tls-search-path`: Diretórios para pesquisar CA e chaves privadas NDB TLS.

* `ndb-transid-mysql-connection-map`: Habilita ou desabilita o plugin `ndb_transid_mysql_connection_map`; ou seja, habilita ou desabilita a tabela `INFORMATION_SCHEMA` com esse nome.

* `ndb-wait-connected`: Tempo (em segundos) para o servidor MySQL esperar a conexão com o gerenciamento do cluster e os nós de dados antes de aceitar conexões de clientes MySQL.

* `ndb-wait-setup`: Tempo (em segundos) para o servidor MySQL esperar a conclusão da configuração do motor NDB.

* `ndb-allow-copying-alter-table`: Defina para `DESATIVADO` para impedir que a operação `ALTER TABLE` use operações de cópia em tabelas NDB.

* `Ndb_api_adaptive_send_deferred_count`: Número de chamadas de envio adaptativas que não foram realmente enviadas por este servidor MySQL (nó SQL).

* `Ndb_api_adaptive_send_deferred_count_session`: Número de chamadas de envio adaptativas que não foram realmente enviadas nesta sessão do cliente.

* `Ndb_api_adaptive_send_deferred_count_replica`: Número de chamadas de envio adaptativas que não foram realmente enviadas por esta replica.

* `Ndb_api_adaptive_send_forced_count`: Número de envios adaptativos com o envio forçado definido como `FORCED` enviados por este servidor MySQL (nó SQL).

* `Ndb_api_adaptive_send_forced_count_session`: Número de envios adaptativos com o envio forçado definido nesta sessão do cliente.

* `Ndb_api_adaptive_send_forced_count_replica`: Número de envios adaptativos com o envio forçado definido enviados por esta replica.

* `Ndb_api_adaptive_send_forced_count_slave`: Número de envios adaptativos com o envio forçado definido enviados por esta replica.

* `Ndb_api_adaptive_send_unforced_count`: Número de envios adaptativos sem envio forçado enviados por este servidor MySQL (nó SQL).

* `Ndb_api_adaptive_send_unforced_count_session`: Número de envios adaptativos sem envio forçado nesta sessão do cliente.

* `Ndb_api_adaptive_send_unforced_count_replica`: Número de envios adaptativos sem envio forçado enviados por esta replica.

* `Ndb_api_adaptive_send_unforced_count_slave`: Número de envios adaptativos sem envio forçado enviados por esta replica.

* `Ndb_api_bytes_received_count`: Quantidade de dados (em bytes) recebidos dos nós de dados por este servidor MySQL (nó SQL).

* `Ndb_api_bytes_received_count_session`: Quantidade de dados (em bytes) recebidos dos nós de dados nesta sessão do cliente.

* `Ndb_api_bytes_received_count_replica`: Quantidade de dados (em bytes) recebidos dos nós de dados por esta replica.

* `Ndb_api_bytes_received_count_slave`: Quantidade de dados (em bytes) recebidos dos nós de dados por esta replica.

* `Ndb_api_bytes_sent_count`: Quantidade de dados (em bytes) enviados aos nós de dados por este servidor MySQL (nó SQL).

* `Ndb_api_bytes_sent_count_session`: Quantidade de dados (em bytes) enviados aos nós de dados nesta sessão do cliente.

* `Ndb_api_bytes_sent_count_replica`: Quantidade de dados (em bytes) enviados aos nós de dados por esta replica.

* `Ndb_api_bytes_sent_count_slave`: Quantidade de dados (em bytes) enviados aos nós de dados por esta replica.

* `Ndb_api_event_bytes_count`: Número de bytes de eventos recebidos por este servidor MySQL (nó SQL).

* `Ndb_api_event_bytes_count_injector`: Número de bytes de dados de eventos recebidos pelo fio de injetor de log binário NDB.

* `Ndb_api_event_data_count`: Número de eventos de mudança de linha recebidos por este servidor MySQL (nó SQL).

* `Ndb_api_event_data_count_injector`: Número de eventos de mudança de linha recebidos pelo fio de injetor de log binário NDB.

* `Ndb_api_nondata_count`: Número de eventos recebidos, além dos eventos de mudança de linha, por este servidor MySQL (nó SQL).

* `Ndb_api_nondata_count_injector`: Número de eventos recebidos, além dos eventos de mudança de linha, pelo fio de injetor de log binário NDB.

* `Ndb_api_pk_op_count`: Número de operações baseadas em ou que utilizam chaves primárias por este servidor MySQL (nó SQL).

* `Ndb_api_pk_op_count_session`: Número de operações baseadas em ou que utilizam chaves primárias nesta sessão do cliente.

* `Ndb_api_pk_op_count_replica`: Número de operações baseadas em ou que utilizam chaves primárias por esta replica.

* `Ndb_api_pk_op_count_slave`: Número de operações baseadas em ou que utilizam chaves primárias por esta replica.

* `Ndb_api_pruned_scan_count`: Número de varreduras que foram cortam para uma partição por este servidor MySQL (nó SQL).

* `Ndb_api_pruned_scan_count_session`: Número de varreduras que foram cortam para uma partição nesta sessão do cliente.

* `Ndb_api_pruned_scan_count_replica`: Número de varreduras que foram cortam para uma partição por esta replica.

* `Ndb_api_pruned_scan_count_slave`: Número de varreduras que foram cortam para uma partição por esta replica.

* `Ndb_api_range_scan_count`: Número de varreduras de intervalo que foram iniciadas por este servidor MySQL (nó SQL).

* `Ndb_api_range_scan_count_session`: Número de varreduras de intervalo que foram iniciadas nesta sessão do cliente.

* `Ndb_api_range_scan_count_replica`: Número de varreduras de intervalo iniciadas por esta replica.

* `Ndb_api_range_scan_count_slave`: Número de varreduras de intervalo iniciadas por esta replica.

* `Ndb_api_read_row_count`: Número total de linhas lidas por este servidor MySQL (nó SQL).

* `Ndb_api_read_row_count_session`: Número total de linhas lidas nesta sessão do cliente.

* `Ndb_api_read_row_count_replica`: Número total de linhas lidas por esta replica.

* `Ndb_api_read_row_count_slave`: Número total de linhas lidas por esta replica.

* `Ndb_api_scan_batch_count`: Número de lotes de linhas recebidos por este servidor MySQL (nó SQL).

* `Ndb_api_scan_batch_count_session`: Número de lotes de linhas recebidos nesta sessão do cliente.

* `Ndb_api_scan_batch_count_replica`: Número de lotes de linhas recebidos por esta replica.

* `Ndb_api_scan_batch_count_slave`: Número de lotes de linhas recebidos por esta replica.

* `Ndb_api_table_scan_count`: Número de varreduras de tabela iniciadas, incluindo varreduras de tabelas internas, por este servidor MySQL (nó SQL).

* `Ndb_api_table_scan_count_session`: Número de varreduras de tabela iniciadas, incluindo varreduras de tabelas internas, nesta sessão do cliente.

* `Ndb_api_table_scan_count_replica`: Número de varreduras de tabela iniciadas, incluindo varreduras de tabelas internas, por esta replica.

* `Ndb_api_table_scan_count_slave`: Número de varreduras de tabela iniciadas, incluindo varreduras de tabelas internas, por esta replica.

* `Ndb_api_trans_abort_count`: Número de transações abortadas por este servidor MySQL (nó SQL).

* `Ndb_api_trans_abort_count_session`: Número de transações abortadas nesta sessão do cliente.

* `Ndb_api_trans_abort_count_replica`: Número de transações abortadas por esta replica.

* `Ndb_api_trans_abort_count_slave`: Número de transações abortadas por esta replica.

* `Ndb_api_trans_close_count`: Número de transações fechadas por este servidor MySQL (nó SQL); pode ser maior que a soma de TransCommitCount e TransAbortCount.

* `Ndb_api_trans_close_count_session`: Número de transações abortadas (pode ser maior que a soma de TransCommitCount e TransAbortCount) nesta sessão do cliente.

* `Ndb_api_trans_close_count_replica`: Número de transações abortadas (pode ser maior que a soma de TransCommitCount e TransAbortCount) por esta replica.

* `Ndb_api_trans_close_count_slave`: Número de transações abortadas (pode ser maior que a soma de TransCommitCount e TransAbortCount) por esta replica.

* `Ndb_api_trans_commit_count`: Número de transações confirmadas por este servidor MySQL (nó SQL).

* `Ndb_api_trans_commit_count_session`: Número de transações confirmadas nesta sessão do cliente.

* `Ndb_api_trans_commit_count_replica`: Número de transações confirmadas por esta replica.

* `Ndb_api_trans_commit_count_slave`: Número de transações confirmadas por esta replica.

* `Ndb_api_trans_local_read_row_count`: Número total de linhas que foram lidas por este servidor MySQL (nó SQL).

* `Ndb_api_trans_local_read_row_count_session`: Número total de linhas que foram lidas nesta sessão do cliente.

* `Ndb_api_trans_local_read_row_count_replica`: Número total de linhas que foram lidas por esta replica.

* `Ndb_api_trans_local_read_row_count_slave`: Número total de linhas que foram lidas por esta replica.

* `Ndb_api_trans_start_count`: Número de transações iniciadas por este servidor MySQL (nó SQL).

* `Ndb_api_trans_start_count_session`: Número de transações iniciadas nesta sessão do cliente.

* `Ndb_api_trans_start_count_replica`: Número de transações iniciadas por esta replica.

* `Ndb_api_trans_start_count_slave`: Número de transações iniciadas por esta replica.

* `Ndb_api_uk_op_count`: Número de operações baseadas em ou que utilizam chaves únicas por este servidor MySQL (nó SQL).

* `Ndb_api_uk_op_count_session`: Número de operações baseadas em ou que utilizam chaves únicas nesta sessão do cliente.

* `Ndb_api_uk_op_count_replica`: Número de operações baseadas em ou que utilizam chaves únicas por esta replica.

* `Ndb_api_uk_op_count_slave`: Número de operações baseadas em ou que utilizam chaves únicas por esta replica.

* `Ndb_api_wait_exec_complete_count`: Número de vezes que o fio de execução foi bloqueado enquanto aguardava a conclusão da execução da operação por este servidor MySQL (nó SQL).

* `Ndb_api_wait_exec_complete_count_session`: Número de vezes que o fio de execução foi bloqueado enquanto aguardava a conclusão da execução da operação nesta sessão do cliente.

* `Ndb_api_wait_exec_complete_count_replica`: Número de vezes que o fio de execução foi bloqueado enquanto aguardava a conclusão da execução da operação por esta replica.

* `Ndb_api_wait_exec_complete_count_slave`: Número de vezes que o fio de execução foi bloqueado enquanto aguardava a conclusão da execução da operação por esta replica.

* `Ndb_api_wait_meta_request_count`: Número de vezes que o fio de execução foi bloqueado enquanto aguardava por um sinal baseado em metadados por este servidor MySQL (nó SQL).

* `Ndb_api_wait_meta_request_count_session`: Número de vezes que o fio de execução foi bloqueado enquanto aguardava por um sinal baseado em metadados nesta sessão do cliente.

* `Ndb_api_wait_meta_request_count_replica`: Número de vezes que o fio de execução foi bloqueado enquanto aguardava por um sinal baseado em metadados por esta replica.

* `Ndb_api_wait_meta_request_count_slave`: Número de vezes que o fio de execução foi bloqueado esperando por um sinal baseado em metadados por essa replica.

* `Ndb_api_wait_nanos_count`: Tempo total (em nanosegundos) gasto esperando por algum tipo de sinal de nós de dados por esse servidor MySQL (nó SQL).

* `Ndb_api_wait_nanos_count_session`: Tempo total (em nanosegundos) gasto esperando por algum tipo de sinal de nós de dados nesta sessão do cliente.

* `Ndb_api_wait_nanos_count_replica`: Tempo total (em nanosegundos) gasto esperando por algum tipo de sinal de nós de dados por essa replica.

* `Ndb_api_wait_nanos_count_slave`: Tempo total (em nanosegundos) gasto esperando por algum tipo de sinal de nós de dados por essa replica.

* `Ndb_api_wait_scan_result_count`: Número de vezes que o fio de execução foi bloqueado enquanto esperava por um sinal baseado em varredura por esse servidor MySQL (nó SQL).

* `Ndb_api_wait_scan_result_count_session`: Número de vezes que o fio de execução foi bloqueado enquanto esperava por um sinal baseado em varredura nesta sessão do cliente.

* `Ndb_api_wait_scan_result_count_replica`: Número de vezes que o fio de execução foi bloqueado enquanto esperava por um sinal baseado em varredura por essa replica.

* `Ndb_api_wait_scan_result_count_slave`: Número de vezes que o fio de execução foi bloqueado enquanto esperava por um sinal baseado em varredura por essa replica.

* `ndb_autoincrement_prefetch_sz`: Tamanho de pré-carga de incremento automático de NDB.

* `ndb_clear_apply_status`: Faz com que RESET SLAVE/RESET REPLICA limpem todas as linhas da tabela ndb\_apply\_status; ativado por padrão.

* `Ndb_cluster_node_id`: ID do nó deste servidor quando atuando como nó SQL do NDB Cluster.

* `Ndb_config_from_host`: Nome do host ou endereço IP do servidor de gerenciamento do NDB Cluster.

* `Ndb_config_from_port`: Porta para se conectar ao servidor de gerenciamento do NDB Cluster.

* `Ndb_config_generation`: Número de geração da configuração atual do cluster.

* `Ndb_conflict_fn_epoch`: Número de linhas que foram encontradas em conflito pela função de detecção de conflitos de replicação NDB$EPOCH() (NDB$EPOCH() ).

* `Ndb_conflict_fn_epoch2`: Número de linhas que foram encontradas em conflito pela função de detecção de conflitos de replicação NDB NDB$EPOCH2() (NDB$EPOCH2() ).

* `Ndb_conflict_fn_epoch2_trans`: Número de linhas que foram encontradas em conflito pela função de detecção de conflitos de replicação NDB NDB$EPOCH2\_TRANS() (NDB$EPOCH2\_TRANS() ).

* `Ndb_conflict_fn_epoch_trans`: Número de linhas que foram encontradas em conflito pela função de detecção de conflitos de replicação NDB$EPOCH\_TRANS() (NDB$EPOCH\_TRANS() ).

* `Ndb_conflict_fn_max`: Número de vezes que a resolução de conflitos de replicação NDB foi aplicada com base no "maior timestamp vence" para operações de atualização e exclusão.

* `Ndb_conflict_fn_max_del_win`: Número de vezes que a resolução de conflitos de replicação NDB foi aplicada com base no resultado de NDB$MAX\_DELETE\_WIN() para operações de atualização e exclusão.

* `Ndb_conflict_fn_max_ins`: Número de vezes que a resolução de conflitos de replicação NDB foi aplicada com base no "maior timestamp vence" para operações de inserção.

* `Ndb_conflict_fn_max_del_win_ins`: Número de vezes que a resolução de conflitos de replicação NDB foi aplicada com base no resultado de NDB$MAX\_DEL\_WIN\_INS() para operações de inserção.

* `Ndb_conflict_fn_old`: Número de vezes que a resolução de conflitos de replicação "maior timestamp vence" foi aplicada.

* `Ndb_conflict_last_conflict_epoch`: A mais recente época NDB nesta replica em que algum conflito foi detectado.

* `Ndb_conflict_last_stable_epoch`: A mais recente época que não contém conflitos.

* `Ndb_conflict_reflected_op_discard_count`: Número de operações refletidas que não foram aplicadas devido a um erro durante a execução.

* `Ndb_conflict_reflected_op_prepare_count`: Número de operações refletidas recebidas que foram preparadas para execução.

* `Ndb_conflict_refresh_op_count`: Número de operações de atualização que foram preparadas.

* `ndb_conflict_role`: Papel que a replica desempenha na detecção e resolução de conflitos. O valor é um dos PRIMARY, SECONDARY, PASS ou NONE (padrão). Pode ser alterado apenas quando o thread SQL de replicação é interrompido. Consulte a documentação para obter mais informações.

* `Ndb_conflict_trans_conflict_commit_count`: Número de transações de época comprometidas após a exigência de tratamento de conflitos transacionais.

* `Ndb_conflict_trans_detect_iter_count`: Número de iterações internas necessárias para comprometer a transação de época. Deve ser (levemente) maior ou igual a Ndb_conflict_trans_conflict_commit_count.

* `Ndb_conflict_trans_reject_count`: Número de transações rejeitadas após serem encontradas em conflito pela função de conflito transacional.

* `Ndb_conflict_trans_row_conflict_count`: Número de linhas encontradas em conflito pela função de conflito transacional. Inclui quaisquer linhas incluídas em transações conflitantes ou dependentes delas.

* `Ndb_conflict_trans_row_reject_count`: Número total de linhas realineadas após serem encontradas em conflito pela função de conflito transacional. Inclui `Ndb_conflict_trans_row_conflict_count` e quaisquer linhas incluídas em transações conflitantes ou dependentes delas.

* `ndb_data_node_neighbour`: Especifica o nó de dados do cluster "mais próximo" deste servidor MySQL, para dicas de transações e tabelas totalmente replicadas.

* `ndb_default_column_format`: Define o formato de linha e o formato de coluna padrão (FIXO ou DINÂMICO) usado para novas tabelas NDB.

* `ndb_deferred_constraints`: Especifica que as verificações de restrições devem ser adiadas (onde essas sejam suportadas). Normalmente não é necessário ou usado; apenas para fins de teste.

* `ndb_dbg_check_shares`: Verifique quaisquer compartilhamentos persistentes (apenas builds de depuração).

* `ndb-schema-dist-timeout`: Quanto tempo esperar antes de detectar o tempo de espera durante a distribuição do esquema.

* `ndb_distribution`: Distribuição padrão para novas tabelas no NDBCLUSTER (KEYHASH ou LINHASH, padrão é KEYHASH).

* `Ndb_epoch_delete_delete_count`: Número de conflitos de delete-delete detectados (operação de delete é aplicada, mas a linha não existe).

* `ndb_eventbuffer_free_percent`: Porcentagem de memória livre que deve estar disponível no buffer de eventos antes da retomada do bufferamento, após atingir o limite definido por ndb_eventbuffer_max_alloc.

* `ndb_eventbuffer_max_alloc`: Memória máxima que pode ser alocada para o buffer de eventos pela API NDB. Definições padrão são 0 (sem limite).

* `ndb_extra_logging`: Controla o registro de eventos do esquema do NDB Cluster, conexões e eventos de distribuição de dados no log de erro do MySQL.

* `Ndb_fetch_table_stats`: Número de vezes que as estatísticas da tabela foram obtidas das tabelas em vez do cache.

* `ndb_force_send`: Força o envio de buffers para o NDB imediatamente, sem esperar por outros threads.

* `ndb_fully_replicated`: Se novas tabelas NDB são totalmente replicadas.

* `ndb_index_stat_enable`: Use estatísticas de índice NDB na otimização de consultas.

* `ndb_index_stat_option`: Lista de opções ajustáveis para estatísticas de índice NDB, separadas por vírgulas; a lista não deve conter espaços.

* `ndb_join_pushdown`: Habilita a empurrar as junções para os nós de dados.

* `Ndb_last_commit_epoch_server`: Epoca em que o NDB mais recentemente comprometeu.

* `Ndb_last_commit_epoch_session`: Epoca em que o NDB mais recentemente comprometeu.

* `ndb_log_apply_status`: Se o servidor MySQL que atua como replica registra ou não as atualizações do mysql.ndb_apply_status recebidas de sua fonte imediata em seu próprio log binário, usando seu próprio ID de servidor.

* `ndb_log_bin`: Escrever atualizações em tabelas NDB no log binário. Efetivo apenas se o registro binário estiver habilitado com a opção --log-bin.

* `ndb_log_binlog_index`: Inserir mapeamento entre épocas e posições no log binário no ndb_binlog_index table. Definições padrão: ON. Efetivo apenas se o registro binário estiver habilitado.

* `ndb_log_cache_size`: Definir o tamanho do cache de transações usado para gravar o log binário NDB.

* `ndb_log_empty_epochs`: Quando habilitado, épocas em que não houve alterações são escritas nas tabelas ndb_apply_status e ndb_binlog_index, mesmo quando o log_replica_updates ou log_slave_updates estiver habilitado.

* `ndb_log_empty_update`: Quando habilitado, atualizações que não produzem alterações são escritas nas tabelas ndb_apply_status e ndb_binlog_index, mesmo quando o log_replica_updates ou log_slave_updates estiver habilitado.

* `ndb_log_exclusive_reads`: Registrar leituras de chave primária com bloqueios exclusivos; permitir a resolução de conflitos com base em conflitos de leitura.

* `ndb_log_orig`: Se o ID e a época do servidor de origem são registrados na tabela mysql.ndb_binlog_index. Defina usando a opção --ndb-log-orig ao iniciar o mysqld.

* `ndb_log_transaction_id`: Se os IDs de transações NDB são escritos no log binário (somente leitura).

* `ndb_log_transaction_compression`: Se comprimir o log binário NDB; também pode ser habilitado no início, ativando a opção --binlog-transaction-compression.

* `ndb_log_transaction_compression_level_zstd`: O nível de compressão ZSTD a ser usado ao gravar transações comprimidas no log binário NDB.

* `ndb_metadata_check`: Ative a detecção automática de alterações no metadados do NDB em relação ao dicionário de dados do MySQL; ativado por padrão.

* `ndb_metadata_check_interval`: Intervalo em segundos para realizar a verificação de alterações no metadados do NDB em relação ao dicionário de dados do MySQL.

* `Ndb_metadata_detected_count`: Número de vezes que o fio de monitoramento de alterações no metadados do NDB detectou alterações.

* `Ndb_metadata_excluded_count`: Número de objetos de metadados do NDB que o fio de binlog do NDB não conseguiu sincronizar.

* `ndb_metadata_sync`: Desenha a sincronização imediata de todas as alterações entre o dicionário do NDB e o dicionário de dados do MySQL; faz com que os valores de `ndb_metadata_check` e `ndb_metadata_check_interval` sejam ignorados. Reinicia para `false` quando a sincronização estiver completa.

* `Ndb_metadata_synced_count`: Número de objetos de metadados do NDB que foram sincronizados.

* `Ndb_number_of_data_nodes`: Número de nós de dados neste clúster do NDB; definido apenas se o servidor participar do clúster.

* `ndb-optimization-delay`: Número de milissegundos para esperar entre o processamento de conjuntos de linhas pelo `OPTIMIZE TABLE` em tabelas do NDB.

* `ndb_optimized_node_selection`: Determina como o nó SQL escolhe o nó de dados do clúster a ser usado como coordenador de transação.

* `Ndb_pruned_scan_count`: Número de varreduras executadas pelo NDB desde que o clúster foi iniciado pela última vez, onde a poda de partição poderia ser usada.

* `Ndb_pushed_queries_defined`: Número de junções que os nós da API tentaram empurrar para baixo para os nós de dados.

* `Ndb_pushed_queries_dropped`: Número de junções que os nós da API tentaram empurrar para baixo, mas falharam.

* `Ndb_pushed_queries_executed`: Número de junções empurradas para baixo e executadas com sucesso nos nós de dados.

* `Ndb_pushed_reads`: Número de leituras executadas nos nós de dados por junções empurradas para baixo.

* `ndb_read_backup`: Habilitar a leitura de qualquer replica para todas as tabelas NDB; use NDB\_TABLE=READ\_BACKUP={0|1} com CREATE TABLE ou ALTER TABLE para habilitar ou desabilitar para tabelas NDB individuais.

* `ndb_recv_thread_activation_threshold`: Limiar de ativação quando o thread de recebimento assume a coleta de conexões do cluster (medido em threads ativos simultaneamente).

* `ndb_recv_thread_cpu_mask`: Máscara de CPU para bloquear threads de recebimento em CPUs específicas; especificada como hexadecimal. Consulte a documentação para detalhes.

* `Ndb_replica_max_replicated_epoch`: Epoch NDB mais recentemente comprometido nesta replica. Quando esse valor for maior ou igual a Ndb\_conflict\_last\_conflict\_epoch, nenhum conflito foi detectado ainda.

* `ndb_replica_batch_size`: Tamanho do lote em bytes para o aplicador de replica.

* `ndb_report_thresh_binlog_epoch_slip`: NDB 7.5 e versões posteriores: Limiar para o número de épocas completamente buffereadas, mas ainda não consumidas pelo thread de injetor de binlog, que, quando excedido, gera a mensagem de status de buffer de evento BUFFERED\_EPOCHS\_OVER\_THRESHOLD; antes de NDB 7.5: Limiar para o número de épocas para ficar para trás antes de relatar o status do log binário.

* `ndb_report_thresh_binlog_mem_usage`: Limiar para a porcentagem de memória livre restante antes de relatar o status do log binário.

* `ndb_row_checksum`: Quando habilitado, definir checksums de linha; habilitado por padrão.

* `Ndb_scan_count`: Número total de varreduras executadas pelo NDB desde que o cluster foi iniciado pela última vez.

* `ndb_schema_dist_lock_wait_timeout`: Tempo durante a distribuição de esquema para esperar pelo bloqueio antes de retornar o erro.

* `ndb_schema_dist_timeout`: Tempo para esperar antes de detectar o tempo de espera durante a distribuição de esquema.

* `ndb_schema_dist_upgrade_allowed`: Permitir a atualização da tabela de distribuição de esquema ao se conectar ao NDB.

* `Ndb_schema_participant_count`: Número de servidores MySQL que participam da distribuição de alterações no esquema NDB.

* `ndb_show_foreign_key_mock_tables`: Mostrar tabelas fictícias usadas para suportar as verificações de chave estrangeira=0.

* `ndb_slave_conflict_role`: Papel que a replica desempenha na detecção e resolução de conflitos. O valor é um dos PRIMARY, SECONDARY, PASS ou NONE (padrão). Pode ser alterado apenas quando o thread SQL de replicação é interrompido. Consulte a documentação para obter mais informações.

* `Ndb_slave_max_replicated_epoch`: Epoch NDB mais recentemente comprometido nesta replica. Quando esse valor for maior ou igual a Ndb_conflict_last_conflict_epoch, nenhum conflito ainda foi detectado.

* `Ndb_system_name`: Nome do sistema do clúster configurado; vazio se o servidor não estiver conectado ao NDB.

* `ndb_table_no_logging`: Tabelas NDB criadas quando essa configuração é habilitada não são checkpoint em disco (embora arquivos de esquema de tabela sejam criados). A configuração entra em vigor quando a tabela é criada ou alterada para usar NDBCLUSTER e permanece válida por toda a vida útil da tabela.

* `ndb_table_temporary`: Tabelas NDB não são persistentes em disco: não são criados arquivos de esquema e as tabelas não são registradas.

* `Ndb_trans_hint_count_session`: Número de transações que usam dicas que foram iniciadas nesta sessão.

* `ndb_use_copying_alter_table`: Usar operações ALTER TABLE de cópia no NDB Cluster.

* `ndb_use_exact_count`: Força o NDB a usar um contagem de registros durante o planejamento da consulta SELECT COUNT(\*) para acelerar esse tipo de consulta.

* `ndb_use_transactions`: Definido como OFF, para desabilitar o suporte a transações pelo NDB. Não é recomendado, exceto em certos casos especiais; consulte a documentação para detalhes.

* `ndb_version`: Mostra a versão do compilador e do motor NDB como um inteiro.

* `ndb_version_string`: Mostra as informações de compilação, incluindo a versão do motor NDB, no formato ndb-x.y.z.

* `ndbcluster`: Ative o motor de armazenamento NDB Cluster (se essa versão do MySQL o suportar). Desativado por `--skip-ndbcluster`.

* `ndbinfo`: Ative o plugin ndbinfo, se suportado.

* `ndbinfo_database`: Nome usado para o banco de dados de informações NDB; apenas leitura.

* `ndbinfo_max_bytes`: Usado apenas para depuração.

* `ndbinfo_max_rows`: Usado apenas para depuração.

* `ndbinfo_offline`: Coloque o banco de dados ndbinfo no modo offline, em que nenhuma linha é retornada das tabelas ou visualizações.

* `ndbinfo_show_hidden`: Se deve mostrar as tabelas de base internas do ndbinfo no cliente mysql; o padrão é OFF.

* `ndbinfo_table_prefix`: Prefixo a ser usado para nomear as tabelas de base internas do ndbinfo; apenas leitura.

* `ndbinfo_version`: Versão do motor ndbinfo; apenas leitura.

* `replica_allow_batching`: Ativa ou desativa a batching de atualizações para a replica.

* `server_id_bits`: Número de bits menos significativos no `server\_id` realmente usados para identificar o servidor, permitindo que aplicativos da API NDB armazenem dados de aplicativos nos bits mais significativos. `server\_id` deve ser menor que 2 elevado a esse valor.

* `skip-ndbcluster`: Desative o motor de armazenamento NDB Cluster.

* `slave_allow_batching`: Ativa ou desativa a batching de atualizações para a replica.

* `transaction_allow_batching`: Permite a batching de declarações dentro de uma transação. Desative AUTOCOMMIT para usar.