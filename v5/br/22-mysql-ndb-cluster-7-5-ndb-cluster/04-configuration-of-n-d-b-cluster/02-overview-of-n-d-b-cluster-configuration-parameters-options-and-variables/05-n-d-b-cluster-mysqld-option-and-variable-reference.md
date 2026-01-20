#### 21.4.2.5 Referência de opção e variável do cluster NDB mysqld

A lista a seguir inclui opções de linha de comando, variáveis de sistema e variáveis de status aplicáveis no `mysqld` quando ele está rodando como um nó SQL em um NDB Cluster. Para uma referência a *todas* as opções de linha de comando, variáveis de sistema e variáveis de status usadas com ou relacionadas a **mysqld**, consulte Seção 5.1.3, “Referência de Opção do Servidor, Variável de Sistema e Variável de Status”.

- `Com_show_ndb_status`: Contagem de declarações SHOW NDB STATUS.

- `Handler_discover`: Número de vezes que as tabelas foram descobertas.

- `ndb-batch-size`: Tamanho (em bytes) a ser usado para lotes de transações NDB.

- `ndb-blob-read-batch-bytes`: Especifica o tamanho em bytes em que as grandes leituras de BLOBs devem ser agrupadas. 0 = sem limite.

- `ndb-blob-write-batch-bytes`: Especifica o tamanho em bytes em que os grandes escritos de BLOB devem ser agrupados. 0 = sem limite.

- `ndb-cluster-connection-pool`: Número de conexões ao cluster usadas pelo MySQL.

- `ndb-cluster-connection-pool-nodeids`: Lista separada por vírgula dos IDs de nó para conexões ao cluster usadas pelo MySQL; o número de nós na lista deve corresponder ao valor definido para `--ndb-cluster-connection-pool`.

- `ndb-connectstring`: Endereço do servidor de gerenciamento NDB que distribui as informações de configuração para este clúster.

- `ndb-default-column-format`: Use este valor (FIXED ou DYNAMIC) como padrão para as opções COLUMN_FORMAT e ROW_FORMAT ao criar ou adicionar colunas de tabela.

- `ndb-deferred-constraints`: Especifica que os verificações de restrição em índices únicos (onde esses são suportados) devem ser adiadas até o momento do commit. Normalmente não é necessário ou usado; apenas para fins de teste.

- `ndb-distribution`: Distribuição padrão para novas tabelas no NDBCLUSTER (KEYHASH ou LINHASH, padrão é KEYHASH).

- `ndb-log-apply-status`: Faça com que o servidor MySQL que atua como replica registre as atualizações `mysql.ndb_apply_status` recebidas de sua fonte imediata em seu próprio log binário, usando seu próprio ID de servidor. Efetivo apenas se o servidor for iniciado com a opção `--ndbcluster`.

- `ndb-log-empty-epochs`: Quando habilitado, faz com que as épocas em que não houve alterações sejam escritas nas tabelas ndb_apply_status e ndb_binlog_index, mesmo quando a opção `--log-slave-updates` está habilitada.

- `ndb-log-empty-update`: Quando ativado, faz com que as atualizações que não produzam alterações sejam escritas nas tabelas ndb_apply_status e ndb_binlog_index, mesmo quando a opção `--log-slave-updates` está ativada.

- `ndb-log-exclusive-reads`: Registre leituras de chave primária com bloqueios exclusivos; permita a resolução de conflitos com base em conflitos de leitura.

- `ndb-log-fail-terminate`: Termina o processo mysqld se não for possível registrar completamente todos os eventos das linhas encontradas.

- `ndb-log-orig`: ID do servidor de origem do log e época na tabela mysql.ndb_binlog_index.

- `ndb-log-transaction-id`: Escreva os IDs de transações NDB no log binário. Requer `--log-bin-v1-events=OFF`.

- `ndb-log-update-minimal`: Atualizações de log no formato mínimo.

- `ndb-log-updated-only`: Registre apenas as atualizações (A) ou as linhas completas (DESATIVADO).

- `ndb-log-update-as-write`: Habilita ou desabilita o registro de atualizações na fonte entre atualizações (OFF) e escritas (ON).

- `ndb-mgmd-host`: Defina o host (e a porta, se desejado) para a conexão com o servidor de gerenciamento.

- `ndb-nodeid`: ID do nó do NDB Cluster para este servidor MySQL.

- `ndb-optimized-node-selection`: Ative otimizações para a seleção de nós para transações. Ativado por padrão; use --skip-ndb-optimized-node-selection para desativá-lo.

- `ndb-transid-mysql-connection-map`: Ative ou desative o plugin ndb_transid_mysql_connection_map; ou seja, ative ou desative a tabela INFORMATION_SCHEMA com esse nome.

- `ndb-wait-connected`: Tempo (em segundos) que o servidor MySQL deve esperar para se conectar ao gerenciamento do cluster e aos nós de dados antes de aceitar conexões de clientes MySQL.

- `ndb-wait-setup`: Tempo (em segundos) para o servidor MySQL esperar que a configuração do motor NDB seja concluída.

- `ndb-allow-copying-alter-table`: Defina para OFF para impedir que a operação ALTER TABLE use operações de cópia em tabelas NDB.

- `Ndb_api_adaptive_send_deferred_count`: Número de chamadas de envio adaptativo que não foram realmente enviadas por este servidor MySQL (nó SQL).

- `Ndb_api_adaptive_send_deferred_count_session`: Número de chamadas de envio adaptativo que não foram realmente enviadas nesta sessão do cliente.

- `Ndb_api_adaptive_send_deferred_count_slave`: Número de chamadas de envio adaptativo que não foram realmente enviadas por esta réplica.

- `Ndb_api_adaptive_send_forced_count`: Número de envios adaptativos com o envio forçado definido enviados por este servidor MySQL (nó SQL).

- `Ndb_api_adaptive_send_forced_count_session`: Número de envios adaptativos com o envio forçado definido nesta sessão do cliente.

- `Ndb_api_adaptive_send_forced_count_slave`: Número de envios adaptativos com o envio forçado definido, enviados por esta réplica.

- `Ndb_api_adaptive_send_unforced_count`: Número de envios adaptativos sem envios forçados enviados por este servidor MySQL (nó SQL).

- `Ndb_api_adaptive_send_unforced_count_session`: Número de envios adaptativos sem envios forçados nesta sessão do cliente.

- `Ndb_api_adaptive_send_unforced_count_slave`: Número de envios adaptativos sem envios forçados enviados por esta réplica.

- `Ndb_api_bytes_received_count`: Quantidade de dados (em bytes) recebidos dos nós de dados por este servidor MySQL (nó SQL).

- `Ndb_api_bytes_received_count_session`: Quantidade de dados (em bytes) recebidos dos nós de dados nesta sessão do cliente.

- `Ndb_api_bytes_received_count_slave`: Quantidade de dados (em bytes) recebidos dos nós de dados por esta réplica.

- `Ndb_api_bytes_sent_count`: Quantidade de dados (em bytes) enviados para os nós de dados por este servidor MySQL (nó SQL).

- `Ndb_api_bytes_sent_count_session`: Quantidade de dados (em bytes) enviados para os nós de dados nesta sessão do cliente.

- `Ndb_api_bytes_sent_count_slave`: Quantidade de dados (em bytes) enviados para os nós de dados por esta replica.

- `Ndb_api_event_bytes_count`: Número de bytes de eventos recebidos por este servidor MySQL (nó SQL).

- `Ndb_api_event_bytes_count_injector`: Número de bytes de dados de eventos recebidos pelo thread de injetor de log binário NDB.

- `Ndb_api_event_data_count`: Número de eventos de alteração de linha recebidos por este servidor MySQL (nó SQL).

- `Ndb_api_event_data_count_injector`: Número de eventos de alteração de linha recebidos pelo thread de injeção de log binário NDB.

- `Ndb_api_event_nondata_count`: Número de eventos recebidos, exceto eventos de alteração de linha, por este servidor MySQL (nó SQL).

- `Ndb_api_event_nondata_count_injector`: Número de eventos recebidos, exceto eventos de alteração de linha, pelo thread de injeção de log binário NDB.

- `Ndb_api_pk_op_count`: Número de operações baseadas em ou que utilizam chaves primárias por este servidor MySQL (nó SQL).

- `Ndb_api_pk_op_count_session`: Número de operações baseadas em ou que utilizam chaves primárias nesta sessão do cliente.

- `Ndb_api_pk_op_count_slave`: Número de operações baseadas em ou que utilizam chaves primárias por esta réplica.

- `Ndb_api_pruned_scan_count`: Número de varreduras que foram reduzidas a uma partição por este servidor MySQL (nó SQL).

- `Ndb_api_pruned_scan_count_session`: Número de varreduras que foram reduzidas a uma partição nesta sessão do cliente.

- `Ndb_api_pruned_scan_count_slave`: Número de varreduras que foram reduzidas a uma partição por esta réplica.

- `Ndb_api_range_scan_count`: Número de varreduras de intervalo iniciadas por este servidor MySQL (nó SQL).

- `Ndb_api_range_scan_count_session`: Número de varreduras de intervalo iniciadas nesta sessão do cliente.

- `Ndb_api_range_scan_count_slave`: Número de varreduras de intervalo iniciadas por esta réplica.

- `Ndb_api_read_row_count`: Número total de linhas que foram lidas por este servidor MySQL (nó SQL).

- `Ndb_api_read_row_count_session`: Número total de linhas que foram lidas nesta sessão do cliente.

- `Ndb_api_read_row_count_slave`: Número total de linhas que foram lidas por esta réplica.

- `Ndb_api_scan_batch_count`: Número de lotes de linhas recebidos por este servidor MySQL (nó SQL).

- `Ndb_api_scan_batch_count_session`: Número de lotes de linhas recebidos nesta sessão do cliente.

- `Ndb_api_scan_batch_count_slave`: Número de lotes de linhas recebidos por esta réplica.

- `Ndb_api_table_scan_count`: Número de varreduras de tabela que foram iniciadas, incluindo varreduras de tabelas internas, por este servidor MySQL (nó SQL).

- `Ndb_api_table_scan_count_session`: Número de varreduras de tabela iniciadas, incluindo varreduras de tabelas internas, nesta sessão do cliente.

- `Ndb_api_table_scan_count_slave`: Número de varreduras de tabela iniciadas, incluindo varreduras de tabelas internas, por esta réplica.

- `Ndb_api_trans_abort_count`: Número de transações abortadas por este servidor MySQL (nó SQL).

- `Ndb_api_trans_abort_count_session`: Número de transações abortadas nesta sessão do cliente.

- `Ndb_api_trans_abort_count_slave`: Número de transações abortadas por esta réplica.

- `Ndb_api_trans_close_count`: Número de transações fechadas por este servidor MySQL (nó SQL); pode ser maior que a soma de TransCommitCount e TransAbortCount.

- `Ndb_api_trans_close_count_session`: Número de transações abortadas (pode ser maior que a soma de TransCommitCount e TransAbortCount) nesta sessão do cliente.

- `Ndb_api_trans_close_count_slave`: Número de transações abortadas (pode ser maior que a soma de TransCommitCount e TransAbortCount) por esta réplica.

- `Ndb_api_trans_commit_count`: Número de transações confirmadas por este servidor MySQL (nó SQL).

- `Ndb_api_trans_commit_count_session`: Número de transações comprometidas nesta sessão do cliente.

- `Ndb_api_trans_commit_count_slave`: Número de transações confirmadas por esta réplica.

- `Ndb_api_trans_local_read_row_count`: Número total de linhas que foram lidas por este servidor MySQL (nó SQL).

- `Ndb_api_trans_local_read_row_count_session`: Número total de linhas que foram lidas nesta sessão do cliente.

- `Ndb_api_trans_local_read_row_count_slave`: Número total de linhas que foram lidas por esta réplica.

- `Ndb_api_trans_start_count`: Número de transações iniciadas por este servidor MySQL (nó SQL).

- `Ndb_api_trans_start_count_session`: Número de transações iniciadas nesta sessão do cliente.

- `Ndb_api_trans_start_count_slave`: Número de transações iniciadas por esta réplica.

- `Ndb_api_uk_op_count`: Número de operações baseadas em ou que utilizam chaves únicas por este servidor MySQL (nó SQL).

- `Ndb_api_uk_op_count_session`: Número de operações com base em ou que utilizam chaves únicas nesta sessão do cliente.

- `Ndb_api_uk_op_count_slave`: Número de operações baseadas em ou que utilizam chaves únicas por esta réplica.

- `Ndb_api_wait_exec_complete_count`: Número de vezes que o thread foi bloqueado enquanto aguardava a conclusão da execução da operação por este servidor MySQL (nó SQL).

- `Ndb_api_wait_exec_complete_count_session`: Número de vezes que o thread foi bloqueado enquanto aguardava a conclusão da execução da operação nesta sessão do cliente.

- `Ndb_api_wait_exec_complete_count_slave`: Número de vezes que o thread foi bloqueado enquanto aguardava a conclusão da execução da operação por esta réplica.

- `Ndb_api_wait_meta_request_count`: Número de vezes que o thread foi bloqueado esperando por um sinal baseado em metadados por este servidor MySQL (nó SQL).

- `Ndb_api_wait_meta_request_count_session`: Número de vezes que o thread foi bloqueado esperando por um sinal baseado em metadados nesta sessão do cliente.

- `Ndb_api_wait_meta_request_count_slave`: Número de vezes que o thread foi bloqueado esperando por um sinal baseado em metadados por esta réplica.

- `Ndb_api_wait_nanos_count`: Tempo total (em nanosegundos) gasto esperando por algum tipo de sinal dos nós de dados por este servidor MySQL (nó SQL).

- `Ndb_api_wait_nanos_count_session`: Tempo total (em nanosegundos) gasto esperando por algum tipo de sinal dos nós de dados nesta sessão do cliente.

- `Ndb_api_wait_nanos_count_slave`: Tempo total (em nanosegundos) gasto esperando por algum tipo de sinal dos nós de dados por esta réplica.

- `Ndb_api_wait_scan_result_count`: Número de vezes que o thread foi bloqueado enquanto aguardava por um sinal baseado em varredura por este servidor MySQL (nó SQL).

- `Ndb_api_wait_scan_result_count_session`: Número de vezes que o thread foi bloqueado enquanto aguardava por um sinal baseado em varredura nesta sessão do cliente.

- `Ndb_api_wait_scan_result_count_slave`: Número de vezes que o thread foi bloqueado enquanto aguardava por um sinal baseado em varredura por esta réplica.

- `ndb_autoincrement_prefetch_sz`: Tamanho de pré-carga de autoincremento NDB.

- `ndb_cache_check_time`: Número de milissegundos entre as verificações dos nós SQL do cluster feitas pelo cache de consultas do MySQL.

- `ndb_clear_apply_status`: Faz com que RESET SLAVE/RESET REPLICA limpem todas as linhas da tabela ndb_apply_status; ativado por padrão.

- `Ndb_cluster_node_id`: ID do nó deste servidor quando atuando como nó SQL do NDB Cluster.

- `Ndb_config_from_host`: Nome do host ou endereço IP do servidor de gerenciamento do NDB Cluster.

- `Ndb_config_from_port`: Porta para conectar ao servidor de gerenciamento do NDB Cluster.

- `Ndb_conflict_fn_epoch`: Número de linhas que foram encontradas em conflito pela função de detecção de conflitos de replicação NDB$EPOCH().

- `Ndb_conflict_fn_epoch2`: Número de linhas que foram encontradas em conflito pela função de detecção de conflitos NDB$EPOCH2().

- `Ndb_conflict_fn_epoch2_trans`: Número de linhas que foram encontradas em conflito pela função de detecção de conflitos NDB$EPOCH2_TRANS() da replicação NDB.

- `Ndb_conflict_fn_epoch_trans`: Número de linhas que foram encontradas em conflito pela função de detecção de conflito NDB$EPOCH_TRANS().

- `Ndb_conflict_fn_max`: Número de vezes que a resolução de conflitos de replicação NDB com base na regra "o timestamp maior vence" foi aplicada em operações de atualização e exclusão.

- `Ndb_conflict_fn_max_del_win`: Número de vezes que a resolução de conflitos de replicação NDB com base no resultado de NDB$MAX_DELETE_WIN() foi aplicada para atualizar e excluir operações.

- `Ndb_conflict_fn_old`: Número de vezes que a resolução de conflitos de replicação NDB "mesmo timestamp vence" foi aplicada.

- `Ndb_conflict_last_conflict_epoch`: Época mais recente do NDB nesta réplica em que algum conflito foi detectado.

- `Ndb_conflict_last_stable_epoch`: A mais recente época que não contém conflitos.

- `Ndb_conflict_reflected_op_discard_count`: Número de operações refletidas que não foram aplicadas devido a um erro durante a execução.

- `Ndb_conflict_reflected_op_prepare_count`: Número de operações refletidas recebidas que foram preparadas para execução.

- `Ndb_conflict_refresh_op_count`: Número de operações de atualização preparadas.

- `Ndb_conflict_trans_conflict_commit_count`: Número de transações de época comprometidas após a exigência de tratamento de conflitos transacionais.

- `Ndb_conflict_trans_detect_iter_count`: Número de iterações internas necessárias para confirmar a transação do epoc. Deve ser (levemente) maior ou igual a `Ndb_conflict_trans_conflict_commit_count`.

- `Ndb_conflict_trans_reject_count`: Número de transações rejeitadas após serem encontradas em conflito pela função de conflito transacional.

- `Ndb_conflict_trans_row_conflict_count`: Número de linhas encontradas em conflitos pela função de conflito transacional. Inclui quaisquer linhas incluídas em transações conflitantes ou dependentes delas.

- `Ndb_conflict_trans_row_reject_count`: Número total de linhas realinhadas após serem encontradas em conflito pela função de conflito transacional. Inclui `Ndb_conflict_trans_row_conflict_count` e quaisquer linhas incluídas em transações conflitantes ou dependentes delas.

- `ndb_data_node_neighbour`: Especifica o nó de dados do cluster "mais próximo" deste servidor MySQL, para dicas de transações e tabelas totalmente replicadas.

- `ndb_default_column_format`: Define o formato padrão da linha e o formato de coluna (FIXO ou DINÂMICO) usado para novas tabelas NDB.

- `ndb_deferred_constraints`: Especifica que as verificações de restrições devem ser adiadas (onde essas são suportadas). Normalmente não é necessário ou usado; apenas para fins de teste.

- `ndb_distribution`: Distribuição padrão para novas tabelas no NDBCLUSTER (KEYHASH ou LINHASH, padrão é KEYHASH).

- `Ndb_epoch_delete_delete_count`: Número de conflitos de delete-delete detectados (a operação de delete é aplicada, mas a linha não existe).

- `ndb_eventbuffer_free_percent`: Porcentagem de memória livre que deve estar disponível no buffer de eventos antes da retomada do buffer, após atingir o limite definido por ndb_eventbuffer_max_alloc.

- `ndb_eventbuffer_max_alloc`: Memória máxima que pode ser alocada para o bufferamento de eventos pela API NDB. Tem como padrão 0 (sem limite).

- `Ndb_execute_count`: Número de viagens de ida e volta ao kernel do NDB realizadas pelas operações.

- `ndb_extra_logging`: Controla o registro de eventos de esquema do NDB Cluster, conexão e distribuição de dados no log de erro do MySQL.

- `ndb_force_send`: Força o envio de buffers para o NDB imediatamente, sem esperar por outros threads.

- `ndb_fully_replicated`: Se as novas tabelas NDB são totalmente replicadas.

- `ndb_index_stat_enable`: Use estatísticas de índice NDB na otimização de consultas.

- `ndb_index_stat_option`: Lista separada por vírgula de opções ajustáveis para estatísticas de índice NDB; a lista não deve conter espaços.

- `ndb_join_pushdown`: Habilita a empurrar as junções para os nós de dados.

- `Ndb_last_commit_epoch_server`: Epoch mais recentemente comprometido pelo NDB.

- `Ndb_last_commit_epoch_session`: Epoch mais recentemente comprometido por este cliente NDB.

- `ndb_log_apply_status`: Se o servidor MySQL que atua como replica registra ou não as atualizações `mysql.ndb_apply_status` recebidas de sua fonte imediata em seu próprio log binário, usando seu próprio ID de servidor.

- `ndb_log_bin`: Escreva atualizações nas tabelas NDB no log binário. Efetivo apenas se o registro binário estiver habilitado com --log-bin.

- `ndb_log_binlog_index`: Inserir mapeamento entre épocas e posições do log binário na tabela ndb_binlog_index. Definições padrão: ON. Efetivo apenas se o registro binário estiver habilitado.

- `ndb_log_empty_epochs`: Quando habilitado, as épocas em que não houve alterações são escritas nas tabelas ndb_apply_status e ndb_binlog_index, mesmo quando o log_replica_updates ou log_slave_updates está habilitado.

- `ndb_log_empty_update`: Quando habilitado, as atualizações que não produzem alterações são escritas nas tabelas ndb_apply_status e ndb_binlog_index, mesmo quando o log_replica_updates ou log_slave_updates está habilitado.

- `ndb_log_exclusive_reads`: Registre leituras de chave primária com bloqueios exclusivos; permita a resolução de conflitos com base em conflitos de leitura.

- `ndb_log_orig`: Se o ID e a época do servidor de origem são registrados na tabela mysql.ndb_binlog_index. Defina usando a opção `--ndb-log-orig` ao iniciar o mysqld.

- `ndb_log_transaction_id`: Se os IDs de transação do NDB são escritos no log binário (somente leitura).

- `Ndb_number_of_data_nodes`: Número de nós de dados neste cluster NDB; definido apenas se o servidor participar do cluster.

- `ndb-optimization-delay`: Número de milissegundos para esperar entre o processamento de conjuntos de linhas por OPTIMIZE TABLE em tabelas NDB.

- `ndb_optimized_node_selection`: Determina como o nó SQL escolhe o nó de dados do cluster a ser usado como coordenador de transação.

- `Ndb_pruned_scan_count`: Número de varreduras executadas pelo NDB desde que o clúster foi iniciado pela última vez, onde a poda de partição pode ser usada.

- `Ndb_pushed_queries_defined`: Número de junções que os nós da API tentaram enviar para os nós de dados.

- `Ndb_pushed_queries_dropped`: Número de junções que os nós da API tentaram enviar para baixo, mas falharam.

- `Ndb_pushed_queries_executed`: Número de junções executadas com sucesso em nós de dados.

- `Ndb_pushed_reads`: Número de leituras executadas nos nós de dados por junções empurradas para baixo.

- `ndb_read_backup`: Habilitar a leitura de qualquer replica para todas as tabelas NDB; use NDB_TABLE=READ_BACKUP={0|1} com CREATE TABLE ou ALTER TABLE para habilitar ou desabilitar para tabelas NDB individuais.

- `ndb_recv_thread_activation_threshold`: Limiar de ativação quando o thread de recebimento assume a coleta de dados da conexão do cluster (medido em threads ativos simultaneamente).

- `ndb_recv_thread_cpu_mask`: máscara de CPU para bloquear os threads de recebimento em CPUs específicas; especificada como hexadecimal. Consulte a documentação para detalhes.

- `ndb_report_thresh_binlog_epoch_slip`: NDB 7.5 e versões posteriores: Limiar para o número de épocas completamente em buffer, mas ainda não consumidas pelo thread do injetor do binlog, que, quando ultrapassado, gera a mensagem de status de buffer do evento BUFFERED_EPOCHS_OVER_THRESHOLD; antes da NDB 7.5: Limiar para o número de épocas para ficar para trás antes de relatar o status do log binário.

- `ndb_report_thresh_binlog_mem_usage`: Limiar para a porcentagem de memória livre restante antes de relatar o status do log binário.

- `ndb_row_checksum`: Quando ativado, defina os checksums das linhas; ativado por padrão.

- `Ndb_scan_count`: Número total de varreduras executadas pelo NDB desde que o clúster foi iniciado pela última vez.

- `ndb_show_foreign_key_mock_tables`: Mostrar tabelas fictícias usadas para suportar foreign_key_checks=0.

- `ndb_slave_conflict_role`: Papel que a replica deve desempenhar na detecção e resolução de conflitos. O valor é um dos PRIMARY, SECONDARY, PASS ou NONE (padrão). Pode ser alterado apenas quando o thread de SQL de replicação é interrompido. Consulte a documentação para obter mais informações.

- `Ndb_slave_max_replicated_epoch`: Época NDB mais recentemente comprometida nesta replica. Quando esse valor for maior ou igual a `Ndb_conflict_last_conflict_epoch`, ainda não foram detectados conflitos.

- `Ndb_system_name`: Nome do sistema do cluster configurado; vazio se o servidor não estiver conectado ao NDB.

- `ndb_table_no_logging`: As tabelas NDB criadas quando essa configuração é habilitada não são copiadas para o disco (embora os arquivos de esquema da tabela sejam criados). A configuração entra em vigor quando a tabela é criada ou alterada para usar NDBCLUSTER e permanece válida por toda a vida útil da tabela.

- `ndb_table_temporary`: As tabelas NDB não são persistentes no disco: não são criados arquivos de esquema e as tabelas não são registradas.

- `ndb_use_copying_alter_table`: Use operações de ALTER TABLE por cópia no NDB Cluster.

- `ndb_use_exact_count`: Força o NDB a usar um contagem de registros durante o planejamento da consulta SELECT COUNT(\*) para acelerar esse tipo de consulta.

- `ndb_use_transactions`: Definido como OFF, para desabilitar o suporte de transações pelo NDB. Não é recomendado, exceto em casos especiais; consulte a documentação para obter detalhes.

- `ndb_version`: Mostra a versão do motor NDB e da compilação como um número inteiro.

- `ndb_version_string`: Exibe informações de compilação, incluindo a versão do motor NDB no formato ndb-x.y.z.

- `ndbcluster`: Ative o NDB Cluster (se esta versão do MySQL o suportar). Desativado por `--skip-ndbcluster`.

- `ndbinfo_database`: Nome usado para o banco de dados de informações NDB; apenas leitura.

- `ndbinfo_max_bytes`: Usado apenas para depuração.

- `ndbinfo_max_rows`: Usado apenas para depuração.

- `ndbinfo_offline`: Coloque o banco de dados ndbinfo no modo offline, no qual nenhuma linha é retornada das tabelas ou visualizações.

- `ndbinfo_show_hidden`: Se deve mostrar as tabelas de base internas do ndbinfo no cliente mysql; o padrão é OFF.

- `ndbinfo_table_prefix`: Prefix para usar no nome das tabelas de base internas do ndbinfo; apenas leitura.

- `ndbinfo_version`: versão do motor ndbinfo; apenas leitura.

- `server_id_bits`: Número de bits menos significativos no `server_id` realmente usados para identificar o servidor, permitindo que os aplicativos da API NDB armazenem dados de aplicativos nos bits mais significativos. O `server_id` deve ser menor que 2 elevado a esse valor.

- `skip-ndbcluster`: Desabilitar o mecanismo de armazenamento NDB Cluster.

- `slave_allow_batching`: Ativa ou desativa o agrupamento de atualizações para a replica.

- `transaction_allow_batching`: Permite a agrupar instruções dentro de uma única transação. Desative o AUTOCOMMIT para usar.
