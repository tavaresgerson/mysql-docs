#### 16.1.6.1 Referência de Opções e Variáveis de Replication e Binary Logging

As duas seções a seguir fornecem informações básicas sobre as opções de linha de comando do MySQL e variáveis de sistema aplicáveis à Replication e ao Binary Log.

##### Opções e Variáveis de Replication

As opções de linha de comando e variáveis de sistema na lista a seguir se relacionam a servidores source de Replication e a replicas. [Seção 16.1.6.2, “Opções e Variáveis do Source de Replication”](replication-options-source.html "16.1.6.2 Opções e Variáveis do Source de Replication") fornece informações mais detalhadas sobre opções e variáveis relacionadas a servidores source de Replication. Para mais informações sobre opções e variáveis relacionadas a replicas, consulte [Seção 16.1.6.3, “Opções e Variáveis do Servidor Replica”](replication-options-replica.html "16.1.6.3 Opções e Variáveis do Servidor Replica").

* `abort-slave-event-count`: Opção usada pelo mysql-test para debugging e testes de Replication.

* `auto_increment_increment`: Colunas AUTO_INCREMENT são incrementadas por este valor.

* `auto_increment_offset`: Offset adicionado às colunas AUTO_INCREMENT.

* `Com_change_master`: Contagem de comandos CHANGE REPLICATION SOURCE TO e CHANGE MASTER TO.

* `Com_show_master_status`: Contagem de comandos SHOW MASTER STATUS.

* `Com_show_slave_hosts`: Contagem de comandos SHOW REPLICAS e SHOW SLAVE HOSTS.

* `Com_show_slave_status`: Contagem de comandos SHOW REPLICA STATUS e SHOW SLAVE STATUS.

* `Com_slave_start`: Contagem de comandos START REPLICA e START SLAVE.

* `Com_slave_stop`: Contagem de comandos STOP REPLICA e STOP SLAVE.

* `disconnect-slave-event-count`: Opção usada pelo mysql-test para debugging e testes de Replication.

* `enforce_gtid_consistency`: Impede a execução de comandos que não podem ser registrados de maneira transacionalmente segura.

* `expire_logs_days`: Limpa (Purge) os Binary Logs após este número de dias.

* `gtid_executed`: Global: Todos os GTIDs no Binary Log (global) ou na transação atual (session). Somente leitura (Read-only).

* `gtid_executed_compression_period`: Compacta a tabela `gtid_executed` cada vez que este número de transações ocorre. 0 significa nunca compactar esta tabela. Aplica-se apenas quando o Binary Logging está desabilitado.

* `gtid_mode`: Controla se o logging baseado em GTID está habilitado e qual tipo de transações os logs podem conter.

* `gtid_next`: Especifica o GTID para a transação ou transações subsequentes; veja a documentação para detalhes.

* `gtid_owned`: Conjunto de GTIDs pertencentes a este cliente (session), ou a todos os clientes, juntamente com o ID do Thread do proprietário (global). Somente leitura (Read-only).

* `gtid_purged`: Conjunto de todos os GTIDs que foram limpos (purged) do Binary Log.

* `init_slave`: Comandos que são executados quando a replica se conecta ao source.

* `log_bin_trust_function_creators`: Se igual a 0 (padrão), então quando --log-bin é usado, a criação de Stored Function é permitida apenas a usuários com privilégio SUPER e somente se a função criada não interromper o Binary Logging.

* `log_builtin_as_identified_by_password`: Se deve registrar CREATE/ALTER USER, GRANT de maneira retrocompatível.

* `log_statements_unsafe_for_binlog`: Desabilita os avisos de erro 1592 de serem escritos no Error Log.

* `master-info-file`: Localização e nome do arquivo que lembra o source e onde o Thread de I/O de Replication está no Binary Log do source.

* `master-retry-count`: Número de tentativas que a replica faz para se conectar ao source antes de desistir.

* `master_info_repository`: Se deve escrever o repositório de metadados de conexão, contendo informações do source e a localização do Thread de I/O de Replication no Binary Log do source, para arquivo ou tabela.

* `max_relay_log_size`: Se for diferente de zero, o Relay Log é rotacionado automaticamente quando seu tamanho excede este valor. Se for zero, o tamanho em que a rotação ocorre é determinado pelo valor de `max_binlog_size`.

* `relay_log`: Localização e nome base a serem usados para os Relay Logs.

* `relay_log_basename`: Caminho completo para o Relay Log, incluindo o nome do arquivo.

* `relay_log_index`: Localização e nome a serem usados para o arquivo que mantém a lista dos últimos Relay Logs.

* `relay_log_info_file`: Nome do arquivo para o repositório de metadados do Applier no qual a replica registra informações sobre os Relay Logs.

* `relay_log_info_repository`: Se deve escrever a localização do Thread SQL de Replication nos Relay Logs para arquivo ou tabela.

* `relay_log_purge`: Determina se os Relay Logs são limpos (purged).

* `relay_log_recovery`: Se a recuperação automática dos arquivos de Relay Log a partir do source na inicialização está habilitada; deve estar habilitado para uma replica "crash-safe".

* `relay_log_space_limit`: Espaço máximo a ser usado para todos os Relay Logs.

* `replicate-do-db`: Informa ao Thread SQL de Replication para restringir a Replication ao Database especificado.

* `replicate-do-table`: Informa ao Thread SQL de Replication para restringir a Replication à Table especificada.

* `replicate-ignore-db`: Informa ao Thread SQL de Replication para não replicar para o Database especificado.

* `replicate-ignore-table`: Informa ao Thread SQL de Replication para não replicar para a Table especificada.

* `replicate-rewrite-db`: Atualizações para um Database com nome diferente do original.

* `replicate-same-server-id`: Na Replication, se habilitado, não pula eventos que tenham nosso Server ID.

* `replicate-wild-do-table`: Informa ao Thread SQL de Replication para restringir a Replication a tables que correspondam ao padrão wildcard especificado.

* `replicate-wild-ignore-table`: Informa ao Thread SQL de Replication para não replicar para tables que correspondam ao padrão wildcard fornecido.

* `replication_optimize_for_static_plugin_config`: Locks compartilhados para Replication semissíncrona.

* `replication_sender_observe_commit_only`: Callbacks limitados para Replication semissíncrona.

* `report_host`: Nome do Host ou IP da replica a ser reportado ao source durante o registro da replica.

* `report_password`: Senha arbitrária que o servidor replica deve reportar ao source; não é a mesma senha da conta de usuário de Replication.

* `report_port`: Porta para conexão com a replica reportada ao source durante o registro da replica.

* `report_user`: Nome de usuário arbitrário que o servidor replica deve reportar ao source; não é o mesmo nome usado para a conta de usuário de Replication.

* `Rpl_semi_sync_master_clients`: Número de replicas semissíncronas.

* `rpl_semi_sync_master_enabled`: Se a Replication semissíncrona está habilitada no source.

* `Rpl_semi_sync_master_net_avg_wait_time`: Tempo médio que o source esperou por respostas da replica.

* `Rpl_semi_sync_master_net_wait_time`: Tempo total que o source esperou por respostas da replica.

* `Rpl_semi_sync_master_net_waits`: Número total de vezes que o source esperou por respostas da replica.

* `Rpl_semi_sync_master_no_times`: Número de vezes que o source desativou a Replication semissíncrona.

* `Rpl_semi_sync_master_no_tx`: Número de Commits não confirmados com sucesso.

* `Rpl_semi_sync_master_status`: Se a Replication semissíncrona está operacional no source.

* `Rpl_semi_sync_master_timefunc_failures`: Número de vezes que o source falhou ao chamar funções de tempo.

* `rpl_semi_sync_master_timeout`: Número de milissegundos a aguardar pela confirmação da replica.

* `rpl_semi_sync_master_trace_level`: Nível de Trace de Debug da Replication semissíncrona no source.

* `Rpl_semi_sync_master_tx_avg_wait_time`: Tempo médio que o source esperou por cada transação.

* `Rpl_semi_sync_master_tx_wait_time`: Tempo total que o source esperou por transações.

* `Rpl_semi_sync_master_tx_waits`: Número total de vezes que o source esperou por transações.

* `rpl_semi_sync_master_wait_for_slave_count`: Número de confirmações da replica que o source deve receber por transação antes de prosseguir.

* `rpl_semi_sync_master_wait_no_slave`: Se o source espera pelo timeout mesmo sem replicas.

* `rpl_semi_sync_master_wait_point`: Ponto de espera para confirmação de recebimento de transação da replica.

* `Rpl_semi_sync_master_wait_pos_backtraverse`: Número total de vezes que o source esperou por um evento com coordenadas binárias inferiores aos eventos esperados anteriormente.

* `Rpl_semi_sync_master_wait_sessions`: Número de sessions atualmente esperando por respostas da replica.

* `Rpl_semi_sync_master_yes_tx`: Número de Commits confirmados com sucesso.

* `rpl_semi_sync_slave_enabled`: Se a Replication semissíncrona está habilitada na replica.

* `Rpl_semi_sync_slave_status`: Se a Replication semissíncrona está operacional na replica.

* `rpl_semi_sync_slave_trace_level`: Nível de Trace de Debug da Replication semissíncrona na replica.

* `rpl_stop_slave_timeout`: Número de segundos que STOP REPLICA ou STOP SLAVE aguarda antes de atingir o timeout.

* `server_uuid`: ID globalmente único do Server, automaticamente (re)gerado na inicialização do Server.

* `show-slave-auth-info`: Mostra o nome de usuário e senha em SHOW REPLICAS e SHOW SLAVE HOSTS neste source.

* `skip-slave-start`: Se configurado, a Replication não é iniciada automaticamente quando o servidor replica é iniciado.

* `slave-skip-errors`: Informa ao Thread de Replication para continuar a Replication quando a Query retornar um erro da lista fornecida.

* `slave_checkpoint_group`: Número máximo de transações processadas pela replica multithreaded antes que a operação de Checkpoint seja chamada para atualizar o status de progresso. Não é suportado pelo NDB Cluster.

* `slave_checkpoint_period`: Atualiza o status de progresso da replica multithreaded e faz flush das informações do Relay Log para o disco após este número de milissegundos. Não é suportado pelo NDB Cluster.

* `slave_compressed_protocol`: Usa compressão do Protocolo source/replica.

* `slave_exec_mode`: Permite alternar o Thread de Replication entre o modo IDEMPOTENT (Key e alguns outros erros suprimidos) e o modo STRICT; o modo STRICT é o padrão, exceto para NDB Cluster, onde IDEMPOTENT é sempre usado.

* `Slave_heartbeat_period`: Intervalo de Heartbeat de Replication da replica, em segundos.

* `Slave_last_heartbeat`: Mostra quando o sinal de Heartbeat mais recente foi recebido, no formato TIMESTAMP.

* `slave_load_tmpdir`: Localização onde a replica deve colocar seus arquivos temporários ao replicar comandos LOAD DATA.

* `slave_max_allowed_packet`: Tamanho máximo, em bytes, do Packet que pode ser enviado do servidor source de Replication para a replica; sobrescreve `max_allowed_packet`.

* `slave_net_timeout`: Número de segundos a aguardar por mais dados da conexão source/replica antes de abortar a leitura.

* `Slave_open_temp_tables`: Número de Temporary Tables que o Thread SQL de Replication tem abertas atualmente.

* `slave_parallel_type`: Informa à replica para usar informações de timestamp (LOGICAL_CLOCK) ou partição de Database (DATABASE) para paralelizar transações.

* `slave_parallel_workers`: Número de Threads Applier para executar transações de Replication em paralelo; 0 ou 1 desabilita o multithreading da replica. NDB Cluster: veja a documentação.

* `slave_pending_jobs_size_max`: Tamanho máximo das filas de worker da replica que contêm eventos ainda não aplicados.

* `slave_preserve_commit_order`: Garante que todos os Commits pelos workers da replica ocorram na mesma ordem que no source para manter a consistência ao usar Threads Applier paralelos.

* `Slave_received_heartbeats`: Número de Heartbeats recebidos pela replica desde o último reset.

* `Slave_retried_transactions`: Número total de vezes desde a inicialização que o Thread SQL de Replication tentou novamente as transações (retried transactions).

* `Slave_rows_last_search_algorithm_used`: Algoritmo de busca usado mais recentemente por esta replica para localizar linhas para Replication baseada em linha (Index, Table ou Hash Scan).

* `slave_rows_search_algorithms`: Determina os algoritmos de busca usados para o batching de Update da replica. Quaisquer 2 ou 3 desta lista: INDEX_SEARCH, TABLE_SCAN, HASH_SCAN.

* `Slave_running`: Estado deste servidor como replica (status do Thread de I/O de Replication).

* `slave_transaction_retries`: Número de vezes que o Thread SQL de Replication tenta novamente a transação caso ela falhe com Deadlock ou Lock Wait Timeout expirado, antes de desistir e parar.

* `slave_type_conversions`: Controla o modo de conversão de tipo na replica. O valor é uma lista de zero ou mais elementos desta lista: ALL_LOSSY, ALL_NON_LOSSY. Defina como string vazia para proibir conversões de tipo entre source e replica.

* `sql_log_bin`: Controla o Binary Logging para a session atual.

* `sql_slave_skip_counter`: Número de eventos do source que a replica deve pular. Não é compatível com Replication GTID.

* `sync_master_info`: Sincroniza informações do source após o evento de número #.

* `sync_relay_log`: Sincroniza o Relay Log para o disco após o evento de número #.

* `sync_relay_log_info`: Sincroniza o arquivo relay.info para o disco após o evento de número #.

* `transaction_write_set_extraction`: Define o algoritmo usado para fazer hash das Writes extraídas durante a transação.

Para uma listagem de todas as opções de linha de comando, variáveis de sistema e variáveis de status usadas com [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"), consulte [Seção 5.1.3, “Referência de Opções de Servidor, Variáveis de Sistema e Variáveis de Status”](server-option-variable-reference.html "5.1.3 Referência de Opções de Servidor, Variáveis de Sistema e Variáveis de Status").

##### Opções e Variáveis de Binary Logging

As opções de linha de comando e variáveis de sistema na lista a seguir se relacionam ao Binary Log. [Seção 16.1.6.4, “Opções e Variáveis de Binary Logging”](replication-options-binary-log.html "16.1.6.4 Opções e Variáveis de Binary Logging"), fornece informações mais detalhadas sobre opções e variáveis relacionadas ao Binary Logging. Para informações gerais adicionais sobre o Binary Log, consulte [Seção 5.4.4, “O Binary Log”](binary-log.html "5.4.4 O Binary Log").

* `binlog-checksum`: Habilita ou desabilita os Checksums do Binary Log.

* `binlog-do-db`: Limita o Binary Logging a Databases específicos.

* `binlog-ignore-db`: Informa ao source que Updates para o Database fornecido não devem ser escritos no Binary Log.

* `binlog-row-event-max-size`: Tamanho máximo de evento do Binary Log.

* `Binlog_cache_disk_use`: Número de transações que usaram arquivo temporário em vez do Binary Log Cache.

* `binlog_cache_size`: Tamanho do Cache para armazenar comandos SQL para o Binary Log durante a transação.

* `Binlog_cache_use`: Número de transações que usaram Cache de Binary Log temporário.

* `binlog_checksum`: Habilita ou desabilita os Checksums do Binary Log.

* `binlog_direct_non_transactional_updates`: Faz com que os Updates usando o formato Statement para engines não transacionais sejam escritos diretamente no Binary Log. Consulte a documentação antes de usar.

* `binlog_error_action`: Controla o que acontece quando o Server não consegue escrever no Binary Log.

* `binlog_format`: Especifica o formato do Binary Log.

* `binlog_group_commit_sync_delay`: Define o número de microssegundos a aguardar antes de sincronizar transações para o disco.

* `binlog_group_commit_sync_no_delay_count`: Define o número máximo de transações a aguardar antes de abortar o atraso atual especificado por `binlog_group_commit_sync_delay`.

* `binlog_gtid_simple_recovery`: Controla como os Binary Logs são iterados durante a recuperação de GTID.

* `binlog_max_flush_queue_time`: Quanto tempo ler transações antes de fazer flush para o Binary Log.

* `binlog_order_commits`: Se deve fazer Commit na mesma ordem das Writes para o Binary Log.

* `binlog_row_image`: Usa imagens completas ou mínimas ao registrar alterações de linha (row changes).

* `binlog_rows_query_log_events`: Quando habilitado, permite o logging de eventos de Query de linha ao usar logging baseado em linha (row-based logging). Desabilitado por padrão.

* `Binlog_stmt_cache_disk_use`: Número de comandos não transacionais que usaram arquivo temporário em vez do Binary Log Statement Cache.

* `binlog_stmt_cache_size`: Tamanho do Cache para armazenar comandos não transacionais para o Binary Log durante a transação.

* `Binlog_stmt_cache_use`: Número de comandos que usaram Cache de Binary Log Statement temporário.

* `binlog_transaction_dependency_history_size`: Número de hashes de linha mantidos para buscar a transação que atualizou pela última vez alguma linha.

* `binlog_transaction_dependency_tracking`: Fonte de informações de dependência (timestamps de Commit ou Write Sets de transação) a partir da qual avaliar quais transações podem ser executadas em paralelo pelo Applier multithreaded da replica.

* `Com_show_binlog_events`: Contagem de comandos SHOW BINLOG EVENTS.

* `Com_show_binlogs`: Contagem de comandos SHOW BINLOGS.

* `log-bin`: Nome base para arquivos de Binary Log.

* `log-bin-index`: Nome do arquivo Index do Binary Log.

* `log_bin`: Se o Binary Log está habilitado.

* `log_bin_basename`: Caminho e nome base para arquivos de Binary Log.

* `log_bin_use_v1_row_events`: Se o Server está usando eventos de linha (row events) da versão 1 do Binary Log.

* `log_slave_updates`: Se a replica deve registrar os Updates realizados pelo seu Thread SQL de Replication em seu próprio Binary Log.

* `master_verify_checksum`: Faz com que o source examine Checksums ao ler do Binary Log.

* `max-binlog-dump-events`: Opção usada pelo mysql-test para debugging e testes de Replication.

* `max_binlog_cache_size`: Pode ser usado para restringir o tamanho total em bytes usado para armazenar em Cache transações com múltiplos Statements.

* `max_binlog_size`: O Binary Log é rotacionado automaticamente quando o tamanho excede este valor.

* `max_binlog_stmt_cache_size`: Pode ser usado para restringir o tamanho total usado para armazenar em Cache todos os comandos não transacionais durante a transação.

* `slave-sql-verify-checksum`: Faz com que a replica examine Checksums ao ler do Relay Log.

* `slave_sql_verify_checksum`: Faz com que a replica examine Checksums ao ler do Relay Log.

* `sporadic-binlog-dump-fail`: Opção usada pelo mysql-test para debugging e testes de Replication.

* `sync_binlog`: Faz Flush síncrono do Binary Log para o disco após o evento de número #.

Para uma listagem de todas as opções de linha de comando, variáveis de sistema e status usadas com [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"), consulte [Seção 5.1.3, “Referência de Opções de Servidor, Variáveis de Sistema e Variáveis de Status”](server-option-variable-reference.html "5.1.3 Referência de Opções de Servidor, Variáveis de Sistema e Variáveis de Status").