#### 16.1.6.1 Opção de Registro Binário e de Replicação e Referência de Variáveis

As duas seções a seguir fornecem informações básicas sobre as opções de linha de comando do MySQL e as variáveis do sistema aplicáveis à replicação e ao log binário.

##### Opções e variáveis de replicação

As opções de linha de comando e as variáveis de sistema na lista a seguir se referem aos servidores de origem da replicação e às réplicas. Seção 16.1.6.2, “Opções e variáveis de origem da replicação” fornece informações mais detalhadas sobre as opções e variáveis relacionadas aos servidores de origem da replicação. Para mais informações sobre as opções e variáveis relacionadas às réplicas, consulte Seção 16.1.6.3, “Opções e variáveis de servidor de réplica”.

- `abort-slave-event-count`: Opção usada pelo mysql-test para depuração e teste de replicação.

- `auto_increment_increment`: As colunas AUTO\_INCREMENT são incrementadas por esse valor.

- `auto_increment_offset`: Deslocamento adicionado às colunas AUTO\_INCREMENT.

- `Com_change_master`: Número de declarações de REPLICAÇÃO DE MUDANÇA PARA e MUDAR MASTER PARA.

- `Com_show_master_status`: Número de declarações `SHOW MASTER STATUS`.

- `Com_show_slave_hosts`: Contagem de declarações SHOW REPLICAS e SHOW SLAVE HOSTS.

- `Com_show_slave_status`: Contagem de instruções `SHOW REPLICA STATUS` e `SHOW SLAVE STATUS`.

- `Com_slave_start`: Contagem de instruções `START REPLICA` e `START SLAVE`.

- `Com_slave_stop`: Contagem de instruções `STOP REPLICA` e `STOP SLAVE`.

- `disconnect-slave-event-count`: Opção usada pelo mysql-test para depuração e teste de replicação.

- `enforce_gtid_consistency`: impede a execução de instruções que não podem ser registradas de forma segura em transação.

- `expire_logs_days`: Limpe os logs binários após quantos dias.

- `gtid_executed`: Global: Todos os GTIDs no log binário (global) ou na transação atual (sessão). Apenas leitura.

- `gtid_executed_compression_period`: Compressar a tabela gtid\_executed a cada vez que ocorrerem tantas transações. 0 significa nunca comprimir essa tabela. Aplica-se apenas quando o registro binário está desativado.

- `gtid_mode`: Controla se o registro baseado em GTID está habilitado e quais tipos de registros de transações podem conter.

- `gtid_next`: Especifica o GTID para a(s) transação(ões) subsequente(s); consulte a documentação para detalhes.

- `gtid_owned`: Conjunto de GTIDs de propriedade deste cliente (sessão) ou de todos os clientes, juntamente com o ID de thread do proprietário (global). Apenas leitura.

- `gtid_purged`: Conjunto de todos os GTIDs que foram excluídos do log binário.

- `init_slave`: Declarações que são executadas quando a replica se conecta à fonte.

- `log_bin_trust_function_creators`: Se igual a 0 (padrão), então, quando a opção `--log-bin` é usada, a criação de funções armazenadas é permitida apenas para usuários com privilégio SUPER e apenas se a função criada não quebrar o registro binário.

- `log_builtin_as_identified_by_password`: Se deve registrar as operações CREATE/ALTER USER e GRANT de forma compatível com versões anteriores.

- `log_statements_unsafe_for_binlog`: Desabilita as mensagens de erro 1592 sendo escritas no log de erro.

- `master-info-file`: Local e nome do arquivo que lembra a origem e onde a thread de replicação de E/S está no log binário da origem.

- `master-retry-count`: Número de tentativas que a réplica faz para se conectar à fonte antes de desistir.

- `master_info_repository`: Se deve gravar o repositório de metadados de conexão, contendo informações de origem e localização da thread de I/O de replicação no log binário da origem, em um arquivo ou tabela.

- `max_relay_log_size`: Se não for zero, o log do retransmissor é rotado automaticamente quando seu tamanho exceder esse valor. Se for zero, o tamanho em que a rotação ocorre é determinado pelo valor de `max_binlog_size`.

- `relay_log`: Local e nome de base a serem usados para os logs de retransmissão.

- `relay_log_basename`: Caminho completo para o log do retransmissor, incluindo o nome do arquivo.

- `relay_log_index`: Local e nome a serem usados para o arquivo que mantém a lista dos últimos logs de retransmissão.

- `relay_log_info_file`: Nome do arquivo para o repositório de metadados do aplicativo no qual os registros de replica armazenam informações sobre os logs do retransmissor.

- `relay_log_info_repository`: Se deve escrever a localização do fio de replicação SQL nos logs do relay em um arquivo ou tabela.

- `relay_log_purge`: Determina se os logs do retransmissor são limpos.

- `relay_log_recovery`: Se a recuperação automática dos arquivos de log do relé da fonte ao iniciar o sistema está habilitada; deve ser habilitada para a replica segura em caso de falha.

- `relay_log_space_limit`: Espaço máximo a ser usado para todos os logs do retransmissor.

- `replicate-do-db`: Diz ao fio de SQL de replicação para restringir a replicação ao banco de dados especificado.

- `replicate-do-table`: Diz ao fio de SQL de replicação para restringir a replicação à tabela especificada.

- `replicate-ignore-db`: Diz ao fio de SQL de replicação que não deve replicar para o banco de dados especificado.

- `replicate-ignore-table`: Diz ao thread de SQL de replicação para não replicar para a tabela especificada.

- `replicate-rewrite-db`: Atualizações no banco de dados com um nome diferente do original.

- `replicate-same-server-id`: Na replicação, se habilitado, não ignore eventos com nosso ID de servidor.

- `replicate-wild-do-table`: Diz ao fio de SQL de replicação para restringir a replicação às tabelas que correspondem ao padrão de caracteres curinga especificado.

- `replicate-wild-ignore-table`: Diz ao thread de SQL de replicação para não replicar para tabelas que correspondem ao padrão de caracteres curinga fornecido.

- `replication_optimize_for_static_plugin_config`: Lâminas compartilhadas para replicação semiesincrônica.

- `replication_sender_observe_commit_only`: Chamadas de retorno limitadas para replicação semi-sincronizada.

- `report_host`: Nome do host ou IP da réplica a ser relatada à fonte durante o registro da réplica.

- `report_password`: Senha arbitrária que o servidor de replicação deve relatar para a fonte; não é a mesma senha da conta de usuário de replicação.

- `report_port`: Porta para a conexão com a réplica relatada à fonte durante o registro da réplica.

- `report_user`: Nome de usuário arbitrário ao qual o servidor de replicação deve relatar o ponto de origem; não é o mesmo nome usado para a conta de usuário de replicação.

- `Rpl_semi_sync_master_clients`: Número de réplicas semi-síncronas.

- `rpl_semi_sync_master_enabled`: Se a replicação semi-sincronizada está habilitada na fonte.

- `Rpl_semi_sync_master_net_avg_wait_time`: Tempo médio que a fonte esperou por respostas da réplica.

- `Rpl_semi_sync_master_net_wait_time`: Tempo total que a fonte esperou por respostas da réplica.

- `Rpl_semi_sync_master_net_waits`: Número total de vezes que a fonte esperou por respostas da réplica.

- `Rpl_semi_sync_master_no_times`: Número de vezes que a replicação semiesincronizada da origem foi desligada.

- `Rpl_semi_sync_master_no_tx`: Número de commits não reconhecidos com sucesso.

- `Rpl_semi_sync_master_status`: Se a replicação semi-sincronizada está operacional na fonte.

- `Rpl_semi_sync_master_timefunc_failures`: Número de vezes em que a fonte falhou ao chamar funções de tempo.

- `rpl_semi_sync_master_timeout`: Número de milissegundos para esperar o reconhecimento da replica.

- `rpl_semi_sync_master_trace_level`: Nível de registro de depuração de replicação semi-sincronizada na fonte.

- `Rpl_semi_sync_master_tx_avg_wait_time`: Tempo médio que a fonte esperou por cada transação.

- `Rpl_semi_sync_master_tx_wait_time`: Tempo total que a fonte esperou por transações.

- `Rpl_semi_sync_master_tx_waits`: Número total de vezes que a fonte esperou por transações.

- `rpl_semi_sync_master_wait_for_slave_count`: Número de confirmações de replicação que a fonte deve receber por transação antes de prosseguir.

- `rpl_semi_sync_master_wait_no_slave`: Se o mestre espera pelo tempo limite mesmo sem réplicas.

- `rpl_semi_sync_master_wait_point`: Ponto de espera para o reconhecimento da confirmação da transação replicada.

- `Rpl_semi_sync_master_wait_pos_backtraverse`: Número total de vezes que a fonte esperou por um evento com coordenadas binárias menores que os eventos esperados anteriormente.

- `Rpl_semi_sync_master_wait_sessions`: Número de sessões atualmente aguardando respostas da replica.

- `Rpl_semi_sync_master_yes_tx`: Número de commits reconhecidos com sucesso.

- `rpl_semi_sync_slave_enabled`: Se a replicação semi-sincronizada está habilitada na replica.

- `Rpl_semi_sync_slave_status`: Se a replicação semi-sincronizada está operacional na replica.

- `rpl_semi_sync_slave_trace_level`: Nível de registro de depuração de replicação semi-sincronizada na replica.

- `rpl_stop_slave_timeout`: Número de segundos que o REPLICA PARAR ou o PARAR SLAVE espera antes de expirar o tempo limite.

- `server_uuid`: ID único global do servidor, automaticamente (re)gerado ao iniciar o servidor.

- `show-slave-auth-info`: Mostrar o nome do usuário e a senha nas opções SHOW REPLICAS e SHOW SLAVE HOSTS nesta fonte.

- `skip-slave-start`: Se definido, a replicação não é iniciada automaticamente quando o servidor de replicação é iniciado.

- `slave-skip-errors`: Diz ao thread de replicação para continuar a replicação quando a consulta retorna um erro da lista fornecida.

- `slave_checkpoint_group`: Número máximo de transações processadas pela replica multithread antes que a operação de checkpoint seja chamada para atualizar o status do progresso. Não é suportado pelo NDB Cluster.

- `slave_checkpoint_period`: Atualize o status do progresso da replica multithread e limpe as informações do log do relay no disco após este número de milissegundos. Não é suportado pelo NDB Cluster.

- `slave_compressed_protocol`: Use a compressão do protocolo de origem/replica.

- `slave_exec_mode`: Permite alternar o thread de replicação entre o modo IDEMPOTENT (chave e alguns outros erros suprimidos) e o modo STRICT; o modo STRICT é padrão, exceto para o NDB Cluster, onde o IDEMPOTENT é sempre usado.

- `Slave_heartbeat_period`: Intervalo de batida de replicação da réplica, em segundos.

- `Slave_last_heartbeat`: Mostra quando o último sinal de batimento cardíaco foi recebido, no formato TIMESTAMP.

- `slave_load_tmpdir`: Local onde a replica deve colocar seus arquivos temporários ao replicar as instruções LOAD DATA.

- `slave_max_allowed_packet`: Tamanho máximo, em bytes, do pacote que pode ser enviado do servidor de origem da replicação para a replica; substitui `max_allowed_packet`.

- `slave_net_timeout`: Número de segundos para esperar mais dados da conexão de origem/replica antes de abortar a leitura.

- `Slave_open_temp_tables`: Número de tabelas temporárias que o thread de replicação SQL atualmente tem aberto.

- `slave_parallel_type`: Indica ao replica que use informações de data e hora (CLOCK\_LOGICAL) ou particionamento de banco de dados (DATABASE) para paralelizar as transações.

- `slave_parallel_workers`: Número de threads do aplicador para executar transações de replicação em paralelo; 0 ou 1 desabilita a multitarefa de replica. NDB Cluster: consulte a documentação.

- `slave_pending_jobs_size_max`: Tamanho máximo das filas de trabalhadores de replicação que armazenam eventos ainda não aplicados.

- `slave_preserve_commit_order`: Garante que todos os commits dos trabalhadores replicados ocorram na mesma ordem que no código-fonte para manter a consistência ao usar threads de aplicação paralelas.

- `Slave_received_heartbeats`: Número de batimentos cardíacos recebidos pela réplica desde o último reinicialização.

- `Slave_retried_transactions`: Número total de vezes desde o início que o fio de replicação do SQL tentou novamente as transações.

- `Slave_rows_last_search_algorithm_used`: Algoritmo de pesquisa mais recentemente utilizado por esta replica para localizar linhas para a replicação baseada em linhas (pesquisa por índice, tabela ou hash).

- `slave_rows_search_algorithms`: Determina os algoritmos de busca usados para agrupar o lote de atualização da replica. Qualquer um dos seguintes 2 ou 3: INDEX\_SEARCH, TABLE\_SCAN, HASH\_SCAN.

- `Slave_running`: Estado deste servidor como replica (status da thread de I/O de replicação).

- `slave_transaction_retries`: Número de vezes que o fio de replicação do SQL tenta novamente a transação caso ela falhe devido a um deadlock ou ao tempo limite de espera de bloqueio, antes de desistir e parar.

- `slave_type_conversions`: Controla o modo de conversão de tipo na replica. O valor é uma lista de zero ou mais elementos desta lista: ALL\_LOSSY, ALL\_NON\_LOSSY. Defina como uma string vazia para impedir conversões de tipo entre a fonte e a replica.

- `sql_log_bin`: Controla o registro binário para a sessão atual.

- `sql_slave_skip_counter`: Número de eventos da fonte que a replica deve ignorar. Não é compatível com a replicação GTID.

- `sync_master_info`: Sincronize as informações da fonte após cada evento a cada # evento.

- `sync_relay_log`: Sincronize o log do retransmissor no disco após cada evento a cada # evento.

- `sync_relay_log_info`: Sincronize o arquivo relay.info no disco após cada evento a cada # evento.

- `transaction_write_set_extraction`: Define o algoritmo usado para hash as escritas extraídas durante a transação.

Para uma lista de todas as opções de linha de comando, variáveis de sistema e variáveis de status usadas com **mysqld**, consulte Seção 5.1.3, “Referência de Opção do Servidor, Variável de Sistema e Variável de Status”.

##### Opções e variáveis de registro binário

As opções de linha de comando e as variáveis do sistema na lista a seguir estão relacionadas ao log binário. Seção 16.1.6.4, “Opções e variáveis de registro binário” fornece informações mais detalhadas sobre as opções e variáveis relacionadas ao registro binário. Para informações gerais adicionais sobre o log binário, consulte Seção 5.4.4, “O Log Binário”.

- `binlog-checksum`: Ative ou desative as verificações de checksums do log binário.

- `binlog-do-db`: Limita o registro binário a bancos de dados específicos.

- `binlog-ignore-db`: Diz à fonte que as atualizações do banco de dados fornecido não devem ser escritas no log binário.

- `binlog-row-event-max-size`: Tamanho máximo de evento de log binário.

- `Binlog_cache_disk_use`: Número de transações que usaram arquivo temporário em vez do cache do log binário.

- `binlog_cache_size`: Tamanho do cache para armazenar instruções SQL para o log binário durante a transação.

- `Binlog_cache_use`: Número de transações que usaram o cache temporário do log binário.

- `binlog_checksum`: Ative ou desative as verificações de checksums do log binário.

- `binlog_direct_non_transactional_updates`: Faz com que as atualizações usando o formato de declaração sejam escritas diretamente no log binário para motores não transacionais. Consulte a documentação antes de usar.

- `binlog_error_action`: Controla o que acontece quando o servidor não consegue gravar no log binário.

- `binlog_format`: Especifica o formato do log binário.

- `binlog_group_commit_sync_delay`: Define o número de microsegundos para aguardar antes de sincronizar as transações com o disco.

- `binlog_group_commit_sync_no_delay_count`: Define o número máximo de transações a serem esperadas antes de abortar o atraso atual especificado por binlog\_group\_commit\_sync\_delay.

- `binlog_gtid_simple_recovery`: Controla como os logs binários são iterados durante a recuperação do GTID.

- `binlog_max_flush_queue_time`: Quanto tempo aguardar para ler as transações antes de enviá-las para o log binário.

- `binlog_order_commits`: Se os commits devem ser feitos na mesma ordem que os registros no log binário.

- `binlog_row_image`: Use imagens completas ou mínimas ao registrar alterações de linha.

- `binlog_rows_query_log_events`: Quando ativado, habilita o registro de eventos do log de consulta de linhas ao usar o registro baseado em linhas. Desativado por padrão.

- `Binlog_stmt_cache_disk_use`: Número de declarações não transacionais que usaram arquivo temporário em vez do cache de declaração do log binário.

- `binlog_stmt_cache_size`: Tamanho do cache para armazenar declarações não transacionais do log binário durante a transação.

- `Binlog_stmt_cache_use`: Número de instruções que usaram o cache temporário de instruções de log binário.

- `binlog_transaction_dependency_history_size`: Número de hashes de linha mantidos para procurar transações que atualizaram a última linha.

- `binlog_transaction_dependency_tracking`: Fonte de informações de dependência (marcadores de commit ou conjuntos de escrita de transações) a partir da qual se pode avaliar quais transações podem ser executadas em paralelo pelo aplicativo multithread da replica.

- `Com_show_binlog_events`: Contagem de declarações SHOW BINLOG EVENTS.

- `Com_show_binlogs`: Número de declarações SHOW BINLOGS.

- `log-bin`: Nome base para arquivos de log binários.

- `log-bin-index`: Nome do arquivo de índice de log binário.

- `log_bin`: Se o log binário está habilitado.

- `log_bin_basename`: Caminho e nome base para arquivos de log binários.

- `log_bin_use_v1_row_events`: Se o servidor está usando eventos de linha de log binário da versão 1.

- `log_slave_updates`: Se a replica deve registrar as atualizações realizadas por seu fio de replicação SQL em seu próprio log binário.

- `master_verify_checksum`: Faça com que a fonte examine os checksums ao ler o log binário.

- `max-binlog-dump-events`: Opção usada pelo mysql-test para depuração e teste de replicação.

- `max_binlog_cache_size`: Pode ser usado para restringir o tamanho total em bytes usados para armazenar transações de múltiplos comandos.

- `max_binlog_size`: O log binário é rotado automaticamente quando o tamanho excede esse valor.

- `max_binlog_stmt_cache_size`: Pode ser usado para restringir o tamanho total usado para armazenar em cache todas as declarações não transacionais durante a transação.

- `slave-sql-verify-checksum`: Faça com que a replica examine os checksums ao ler o log do retransmissor.

- `slave_sql_verify_checksum`: Faça com que a replica examine os checksums ao ler o log do retransmissor.

- `sporadic-binlog-dump-fail`: Opção usada pelo mysql-test para depuração e teste de replicação.

- `sync_binlog`: Limpe o log binário em sincronia no disco após cada evento a cada # evento.

Para uma lista de todas as opções de linha de comando, variáveis de sistema e status usadas com **mysqld**, consulte Seção 5.1.3, “Referência de variáveis de opção do servidor, variáveis de sistema e variáveis de status”.
