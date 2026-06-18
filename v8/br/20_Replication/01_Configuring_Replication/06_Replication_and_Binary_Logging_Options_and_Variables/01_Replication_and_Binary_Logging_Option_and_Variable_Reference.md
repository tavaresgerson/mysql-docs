#### 19.1.6.1 Opção de Registro Binário e de Replicação e Referência de Variáveis

As duas seções a seguir fornecem informações básicas sobre as opções de linha de comando do MySQL e as variáveis do sistema aplicáveis à replicação e ao log binário.

##### Opções e variáveis de replicação

As opções de linha de comando e as variáveis de sistema na lista a seguir se referem aos servidores de origem da replicação e às réplicas. A seção 19.1.6.2, “Opções e variáveis de origem da replicação”, fornece informações mais detalhadas sobre as opções e variáveis relacionadas aos servidores de origem da replicação. Para mais informações sobre as opções e variáveis relacionadas às réplicas, consulte a seção 19.1.6.3, “Opções e variáveis de servidor de réplica”.

- `abort-slave-event-count`: Opção usada pelo mysql-test para depuração e teste de replicação.

- `auto_increment_increment`: As colunas de AUTO\_INCREMENT são incrementadas por este valor.

- `auto_increment_offset`: Adição de um deslocamento às colunas AUTO\_INCREMENT.

- `Com_change_master`: Contagem de declarações de REPLICAÇÃO DE ALTERAÇÕES PARA e ALCANCE MASTER PARA.

- `Com_change_replication_source`: Contagem de declarações de REPLICAÇÃO DE ALTERAÇÕES PARA e ALCANCE MASTER PARA.

- `Com_replica_start`: Contagem de declarações START REPLICA e START SLAVE.

- `Com_replica_stop`: Contagem de declarações STOP REPLICA e STOP SLAVE.

- `Com_show_master_status`: Contagem de declarações de STATUS MASTER exibidas.

- `Com_show_replica_status`: Contagem de declarações SHOW REPLICA STATUS e SHOW SLAVE STATUS.

- `Com_show_replicas`: Contagem de declarações SHOW REPLICAS e SHOW SLAVE HOSTS.

- `Com_show_slave_hosts`: Contagem de declarações SHOW REPLICAS e SHOW SLAVE HOSTS.

- `Com_show_slave_status`: Contagem de declarações SHOW REPLICA STATUS e SHOW SLAVE STATUS.

- `Com_slave_start`: Contagem de declarações START REPLICA e START SLAVE.

- `Com_slave_stop`: Contagem de declarações STOP REPLICA e STOP SLAVE.

- `disconnect-slave-event-count`: Opção usada pelo mysql-test para depuração e teste de replicação.

- `enforce_gtid_consistency`: Previne a execução de instruções que não podem ser registradas de forma segura em transações.

- `expire_logs_days`: Limpe os logs binários após quantos dias?

- `gtid_executed`: Global: Todos os GTIDs no log binário (global) ou na transação atual (sessão). Apenas leitura.

- `gtid_executed_compression_period`: Comprima a tabela gtid\_executed a cada vez que ocorrer essa quantidade de transações. 0 significa nunca comprimir essa tabela. Aplica-se apenas quando o registro binário está desativado.

- `gtid_mode`: Controla se o registro baseado em GTID está habilitado e quais tipos de registros de transações podem conter.

- `gtid_next`: Especifica o GTID para a(s) transação(ões) subsequente(s); consulte a documentação para detalhes.

- `gtid_owned`: Conjunto de GTIDs de propriedade deste cliente (sessão) ou de todos os clientes, juntamente com o ID de thread do proprietário (global). Apenas leitura.

- `gtid_purged`: Conjunto de todos os GTIDs que foram excluídos do log binário.

- `immediate_server_version`: Número de versão do servidor MySQL do servidor que é a fonte de replicação imediata.

- `init_replica`: Declarações que são executadas quando a replica se conecta à fonte.

- `init_slave`: Declarações que são executadas quando a replica se conecta à fonte.

- `log_bin_trust_function_creators`: Se igual a 0 (padrão), então, quando o comando --log-bin for usado, a criação de funções armazenadas só será permitida para usuários com privilégio SUPER e apenas se a função criada não quebrar o registro binário.

- `log_statements_unsafe_for_binlog`: Desativa as mensagens de erro 1592 que são escritas no log de erro.

- `master-info-file`: Localização e nome do arquivo que lembra a origem e onde a thread de replicação de I/O está no log binário da origem.

- `master-retry-count`: Número de tentativas que a réplica faz para se conectar à fonte antes de desistir.

- `master_info_repository`: Se deve escrever o repositório de metadados de conexão, contendo informações de origem e localização da thread de E/S de replicação no log binário da origem, em um arquivo ou tabela.

- `max_relay_log_size`: Se não for nulo, o log do relé é rotacionado automaticamente quando seu tamanho exceder esse valor. Se for zero, o tamanho em que a rotação ocorre é determinado pelo valor de max\_binlog\_size.

- `original_commit_timestamp`: Hora em que a transação foi confirmada na fonte original.

- `original_server_version`: Número de versão do servidor MySQL do servidor no qual a transação foi originalmente comprometida.

- `relay_log`: Localização e nome de base a serem usados para os logs de retransmissão.

- `relay_log_basename`: Caminho completo para o log de retransmissão, incluindo o nome do arquivo.

- `relay_log_index`: Localização e nome a serem usados para o arquivo que mantém a lista dos últimos logs do retransmissor.

- `relay_log_info_file`: Nome do arquivo para o repositório de metadados do aplicativo, no qual os registros de replica armazenam informações sobre os logs de retransmissão.

- `relay_log_info_repository`: Se deve escrever a localização do fio de replicação SQL nos logs do retransmissor em um arquivo ou tabela.

- `relay_log_purge`: Determina se os logs do relé são limpos.

- `relay_log_recovery`: Se a recuperação automática dos arquivos de log do relé da fonte ao iniciar o sistema está habilitada; deve ser habilitada para a replica segura em caso de falha.

- `relay_log_space_limit`: Espaço máximo a ser utilizado para todos os logs de relé.

- `replica_checkpoint_group`: Número máximo de transações processadas por replica multithread antes que a operação de verificação de ponto seja chamada para atualizar o status do progresso. Não é suportado pelo NDB Cluster.

- `replica_checkpoint_period`: Atualize o status do progresso da replica multithreading e limpe as informações do log do retransmissor no disco após este número de milissegundos. Não é suportado pelo NDB Cluster.

- `replica_compressed_protocol`: Use a compressão do protocolo de origem/replica.

- `replica_exec_mode`: Permite alternar o fio de replicação entre o modo IDEMPOTENT (chave e alguns outros erros suprimidos) e o modo STRICT; o modo STRICT é padrão, exceto para o NDB Cluster, onde o IDEMPOTENT é sempre usado.

- `replica_load_tmpdir`: Local onde a replica deve colocar seus arquivos temporários ao replicar as instruções LOAD DATA.

- `replica_max_allowed_packet`: Tamanho máximo, em bytes, do pacote que pode ser enviado do servidor de origem da replicação para a replica; substitui max\_allowed\_packet.

- `replica_net_timeout`: Número de segundos para esperar por mais dados da conexão de origem/replica antes de abortar a leitura.

- `Replica_open_temp_tables`: Número de tabelas temporárias que o thread de replicação SQL atualmente tem aberto.

- `replica_parallel_type`: Diz à replica para usar informações de data e hora (CLOCK\_LOGICAL) ou particionamento de banco de dados (DATABASE) para paralelizar as transações.

- `replica_parallel_workers`: Número de threads do aplicativo para executar transações de replicação. NDB Cluster: consulte a documentação.

- `replica_pending_jobs_size_max`: Tamanho máximo das filas de trabalhadores de replicação que armazenam eventos ainda não aplicados.

- `replica_preserve_commit_order`: Garante que todos os commits dos trabalhadores replicados ocorram na mesma ordem que no código-fonte para manter a consistência ao usar threads do aplicador paralelo.

- `Replica_rows_last_search_algorithm_used`: Algoritmo de pesquisa mais recentemente utilizado por esta replica para localizar linhas para a replicação baseada em linhas (pesquisa por índice, tabela ou hash).

- `replica_skip_errors`: Diz ao fio de replicação para continuar a replicação quando a consulta retorna um erro da lista fornecida.

- `replica_transaction_retries`: Número de vezes que o fio de replicação do SQL tenta novamente a transação caso ela falhe com um deadlock ou o tempo limite de espera de bloqueio tenha expirado, antes de desistir e parar.

- `replica_type_conversions`: Controla o modo de conversão de tipo na replica. O valor é uma lista de zero ou mais elementos desta lista: ALL\_LOSSY, ALL\_NON\_LOSSY. Defina como uma string vazia para impedir conversões de tipo entre a fonte e a replica.

- `replicate-do-db`: Diz ao fio de SQL de replicação para restringir a replicação ao banco de dados especificado.

- `replicate-do-table`: Diz ao fio de SQL de replicação para restringir a replicação à tabela especificada.

- `replicate-ignore-db`: Diz ao fio de SQL de replicação para não replicar para o banco de dados especificado.

- `replicate-ignore-table`: Diz ao fio de SQL de replicação para não replicar para a tabela especificada.

- `replicate-rewrite-db`: Atualizações no banco de dados com um nome diferente do original.

- `replicate-same-server-id`: Na replicação, se habilitada, não ignore eventos com nosso ID de servidor.

- `replicate-wild-do-table`: Diz ao fio de SQL de replicação para restringir a replicação às tabelas que correspondem ao padrão de caracteres curinga especificado.

- `replicate-wild-ignore-table`: Diz ao fio de SQL de replicação para não replicar para tabelas que correspondem ao padrão de caracteres curinga fornecido.

- `replication_optimize_for_static_plugin_config`: Lâminas compartilhadas para replicação semiesincrônica.

- `replication_sender_observe_commit_only`: Chamadas de retorno limitadas para replicação semi-sincronizada.

- `report_host`: Nome do host ou IP da réplica a ser relatada à fonte durante o registro da réplica.

- `report_password`: Senha aleatória que o servidor replicador deve informar ao usuário fonte; não é a mesma senha da conta de usuário de replicação.

- `report_port`: Porta para conexão com a replica relatada à fonte durante o registro da replica.

- `report_user`: Nome de usuário arbitrário ao qual o servidor de replicação deve se reportar; não é o mesmo nome usado para a conta de usuário de replicação.

- `rpl_read_size`: Defina o valor mínimo de dados em bytes que será lido dos arquivos de log binários e dos arquivos de log de retransmissão.

- `Rpl_semi_sync_master_clients`: Número de réplicas semi-síncronas.

- `rpl_semi_sync_master_enabled`: Se a replicação semi-sincronizada está habilitada na fonte.

- `Rpl_semi_sync_master_net_avg_wait_time`: Tempo médio que a fonte de dados esperou por respostas da réplica.

- `Rpl_semi_sync_master_net_wait_time`: Tempo total que a fonte de tempo esperou por respostas da réplica.

- `Rpl_semi_sync_master_net_waits`: Número total de vezes que a fonte esperou por respostas da réplica.

- `Rpl_semi_sync_master_no_times`: Número de vezes que a replicação semiesincronizada foi desligada na fonte.

- `Rpl_semi_sync_master_no_tx`: Número de commits não reconhecidos com sucesso.

- `Rpl_semi_sync_master_status`: Se a replicação semi-sincronizada está operacional na fonte.

- `Rpl_semi_sync_master_timefunc_failures`: Número de vezes que a fonte falhou ao chamar funções de tempo.

- `rpl_semi_sync_master_timeout`: Número de milissegundos para esperar o reconhecimento da replica.

- `rpl_semi_sync_master_trace_level`: Nível de rastreamento de depuração da replicação semiesincronizada na fonte.

- `Rpl_semi_sync_master_tx_avg_wait_time`: Tempo médio que a fonte esperou por cada transação.

- `Rpl_semi_sync_master_tx_wait_time`: Tempo total que a fonte de transações esperou.

- `Rpl_semi_sync_master_tx_waits`: Número total de vezes que a fonte esperou por transações.

- `rpl_semi_sync_master_wait_for_slave_count`: Número de confirmações de replicação que a fonte deve receber por transação antes de prosseguir.

- `rpl_semi_sync_master_wait_no_slave`: Se a fonte aguarda o tempo limite mesmo sem réplicas.

- `rpl_semi_sync_master_wait_point`: Ponto de espera para o reconhecimento da recepção da transação replicada.

- `Rpl_semi_sync_master_wait_pos_backtraverse`: Número total de vezes que a fonte esperou por um evento com coordenadas binárias inferiores às coordenadas dos eventos esperados anteriormente.

- `Rpl_semi_sync_master_wait_sessions`: Número de sessões atualmente aguardando respostas replicadas.

- `Rpl_semi_sync_master_yes_tx`: Número de commits reconhecidos com sucesso.

- `rpl_semi_sync_replica_enabled`: Se a replicação semi-sincronizada está habilitada na replica.

- `Rpl_semi_sync_replica_status`: Se a replicação semi-sincronizada está operacional na replica.

- `rpl_semi_sync_replica_trace_level`: Nível de rastreamento de depuração da replicação semiesincronizada.

- `rpl_semi_sync_slave_enabled`: Se a replicação semi-sincronizada está habilitada na replica.

- `Rpl_semi_sync_slave_status`: Se a replicação semi-sincronizada está operacional na replica.

- `rpl_semi_sync_slave_trace_level`: Nível de rastreamento de depuração da replicação semiesincronizada.

- `Rpl_semi_sync_source_clients`: Número de réplicas semi-síncronas.

- `rpl_semi_sync_source_enabled`: Se a replicação semi-sincronizada está habilitada na fonte.

- `Rpl_semi_sync_source_net_avg_wait_time`: Tempo médio que a fonte de dados esperou por respostas da réplica.

- `Rpl_semi_sync_source_net_wait_time`: Tempo total que a fonte de tempo esperou por respostas da réplica.

- `Rpl_semi_sync_source_net_waits`: Número total de vezes que a fonte esperou por respostas da réplica.

- `Rpl_semi_sync_source_no_times`: Número de vezes que a replicação semiesincronizada foi desligada na fonte.

- `Rpl_semi_sync_source_no_tx`: Número de commits não reconhecidos com sucesso.

- `Rpl_semi_sync_source_status`: Se a replicação semi-sincronizada está operacional na fonte.

- `Rpl_semi_sync_source_timefunc_failures`: Número de vezes que a fonte falhou ao chamar funções de tempo.

- `rpl_semi_sync_source_timeout`: Número de milissegundos para esperar o reconhecimento da replica.

- `rpl_semi_sync_source_trace_level`: Nível de rastreamento de depuração da replicação semiesincronizada na fonte.

- `Rpl_semi_sync_source_tx_avg_wait_time`: Tempo médio que a fonte esperou por cada transação.

- `Rpl_semi_sync_source_tx_wait_time`: Tempo total que a fonte de transações esperou.

- `Rpl_semi_sync_source_tx_waits`: Número total de vezes que a fonte esperou por transações.

- `rpl_semi_sync_source_wait_for_replica_count`: Número de confirmações de replicação que a fonte deve receber por transação antes de prosseguir.

- `rpl_semi_sync_source_wait_no_replica`: Se a fonte aguarda o tempo limite mesmo sem réplicas.

- `rpl_semi_sync_source_wait_point`: Ponto de espera para o reconhecimento da recepção da transação replicada.

- `Rpl_semi_sync_source_wait_pos_backtraverse`: Número total de vezes que a fonte esperou por um evento com coordenadas binárias inferiores às coordenadas dos eventos esperados anteriormente.

- `Rpl_semi_sync_source_wait_sessions`: Número de sessões atualmente aguardando respostas replicadas.

- `Rpl_semi_sync_source_yes_tx`: Número de commits reconhecidos com sucesso.

- `rpl_stop_replica_timeout`: Número de segundos que o STOP REPLICA espera antes de expirar.

- `rpl_stop_slave_timeout`: Número de segundos que o STOP REPLICA ou o STOP SLAVE aguarda antes de expirar o tempo limite.

- `server_uuid`: ID globalmente único do servidor, automaticamente (re)gerado ao iniciar o servidor.

- `show-replica-auth-info`: Mostrar o nome do usuário e a senha na opção "REPRESENTAR REPLICAS" nesta fonte.

- `show-slave-auth-info`: Mostrar o nome do usuário e a senha nas opções Mostrar Replicas e Mostrar Hospedeiros Escravos nesta fonte.

- `skip-replica-start`: Se definido, a replicação não é iniciada automaticamente quando o servidor de replicação é iniciado.

- `skip-slave-start`: Se definido, a replicação não é iniciada automaticamente quando o servidor de replicação é iniciado.

- `slave-skip-errors`: Diz ao fio de replicação para continuar a replicação quando a consulta retorna um erro da lista fornecida.

- `slave_checkpoint_group`: Número máximo de transações processadas por replica multithread antes que a operação de verificação de ponto seja chamada para atualizar o status do progresso. Não é suportado pelo NDB Cluster.

- `slave_checkpoint_period`: Atualize o status do progresso da replica multithreading e limpe as informações do log do retransmissor no disco após este número de milissegundos. Não é suportado pelo NDB Cluster.

- `slave_compressed_protocol`: Use a compressão do protocolo de origem/replica.

- `slave_exec_mode`: Permite alternar o fio de replicação entre o modo IDEMPOTENT (chave e alguns outros erros suprimidos) e o modo STRICT; o modo STRICT é padrão, exceto para o NDB Cluster, onde o IDEMPOTENT é sempre usado.

- `slave_load_tmpdir`: Local onde a replica deve colocar seus arquivos temporários ao replicar as instruções LOAD DATA.

- `slave_max_allowed_packet`: Tamanho máximo, em bytes, do pacote que pode ser enviado do servidor de origem da replicação para a replica; substitui max\_allowed\_packet.

- `slave_net_timeout`: Número de segundos para esperar por mais dados da conexão de origem/replica antes de abortar a leitura.

- `Slave_open_temp_tables`: Número de tabelas temporárias que o thread de replicação SQL atualmente tem aberto.

- `slave_parallel_type`: Diz à replica para usar informações de data e hora (CLOCK\_LOGICAL) ou particionamento de banco de dados (DATABASE) para paralelizar as transações.

- `slave_parallel_workers`: Número de threads do aplicativo para executar transações de replicação em paralelo; 0 ou 1 desabilita a multitarefa de replicação. NDB Cluster: consulte a documentação.

- `slave_pending_jobs_size_max`: Tamanho máximo das filas de trabalhadores de replicação que armazenam eventos ainda não aplicados.

- `slave_preserve_commit_order`: Garante que todos os commits dos trabalhadores replicados ocorram na mesma ordem que no código-fonte para manter a consistência ao usar threads do aplicador paralelo.

- `Slave_rows_last_search_algorithm_used`: Algoritmo de pesquisa mais recentemente utilizado por esta replica para localizar linhas para a replicação baseada em linhas (pesquisa por índice, tabela ou hash).

- `slave_rows_search_algorithms`: Determina os algoritmos de busca usados para agrupar o lote de atualização da replica. Qualquer um dos seguintes valores de 2 ou 3: INDEX\_SEARCH, TABLE\_SCAN, HASH\_SCAN.

- `slave_transaction_retries`: Número de vezes que o fio de replicação do SQL tenta novamente a transação caso ela falhe com um deadlock ou o tempo limite de espera de bloqueio tenha expirado, antes de desistir e parar.

- `slave_type_conversions`: Controla o modo de conversão de tipo na replica. O valor é uma lista de zero ou mais elementos desta lista: ALL\_LOSSY, ALL\_NON\_LOSSY. Defina como uma string vazia para impedir conversões de tipo entre a fonte e a replica.

- `sql_log_bin`: Controla o registro binário para a sessão atual.

- `sql_replica_skip_counter`: Número de eventos da fonte que a replicação deve ignorar. Não é compatível com a replicação GTID.

- `sql_slave_skip_counter`: Número de eventos da fonte que a replicação deve ignorar. Não é compatível com a replicação GTID.

- `sync_master_info`: Sincronize as informações de origem após cada evento a cada # evento.

- `sync_relay_log`: Sincronize o log do relé no disco após cada evento a cada # evento.

- `sync_relay_log_info`: Sincronize o arquivo relay.info com o disco após cada evento a cada # evento.

- `sync_source_info`: Sincronize as informações de origem após cada evento a cada # evento.

- `terminology_use_previous`: Use a terminologia da versão anterior especificada quando as alterações forem incompatíveis.

- `transaction_write_set_extraction`: Define o algoritmo usado para hash os registros extraídos durante a transação.

Para uma lista de todas as opções de linha de comando, variáveis de sistema e variáveis de status usadas com o **mysqld**, consulte a Seção 7.1.4, “Referência de Opção do Servidor, Variável de Sistema e Variável de Status”.

##### Opções e variáveis de registro binário

As opções de linha de comando e as variáveis de sistema na lista a seguir estão relacionadas ao log binário. A seção 19.1.6.4, “Opções e variáveis de registro binário”, fornece informações mais detalhadas sobre as opções e variáveis relacionadas ao registro binário. Para informações gerais adicionais sobre o log binário, consulte a seção 7.4.4, “O log binário”.

- `binlog-checksum`: Habilitar ou desabilitar verificações de checksums de log binário.

- `binlog-do-db`: Limita o registro binário a bancos de dados específicos.

- `binlog-ignore-db`: Diz à fonte que as atualizações do banco de dados fornecido não devem ser escritas no log binário.

- `binlog-row-event-max-size`: Tamanho máximo do evento no log binário.

- `Binlog_cache_disk_use`: Número de transações que usaram arquivo temporário em vez do cache do log binário.

- `binlog_cache_size`: Tamanho do cache para armazenar instruções SQL para o log binário durante a transação.

- `Binlog_cache_use`: Número de transações que usaram o cache temporário de log binário.

- `binlog_checksum`: Habilitar ou desabilitar verificações de checksums de log binário.

- `binlog_direct_non_transactional_updates`: As atualizações usando o formato de declaração para motores não transacionais são escritas diretamente no log binário. Consulte a documentação antes de usar.

- `binlog_encryption`: Habilitar a criptografia para arquivos de log binários e arquivos de log de retransmissão neste servidor.

- `binlog_error_action`: Controla o que acontece quando o servidor não consegue gravar no log binário.

- `binlog_expire_logs_auto_purge`: Controla a purga automática de arquivos de log binários; pode ser substituído quando ativado, definindo binlog\_expire\_logs\_seconds e expire\_logs\_days para 0.

- `binlog_expire_logs_seconds`: Limpe os logs binários após quantos segundos?

- `binlog_format`: Especifica o formato do log binário.

- `binlog_group_commit_sync_delay`: Define o número de microsegundos para esperar antes de sincronizar as transações com o disco.

- `binlog_group_commit_sync_no_delay_count`: Define o número máximo de transações a serem esperadas antes de abortar o atraso atual especificado por binlog\_group\_commit\_sync\_delay.

- `binlog_gtid_simple_recovery`: Controla a forma como os logs binários são iterados durante a recuperação do GTID.

- `binlog_max_flush_queue_time`: Quanto tempo para ler as transações antes de serem descartadas no log binário.

- `binlog_order_commits`: Se deve comprometer na mesma ordem que os registros no log binário.

- `binlog_rotate_encryption_master_key_at_startup`: Rotular a chave mestre do log binário na inicialização do servidor.

- `binlog_row_image`: Use imagens completas ou mínimas ao registrar alterações de linha.

- `binlog_row_metadata`: Se gravar todos ou apenas metadados mínimos relacionados à tabela no log binário ao usar o registro baseado em linhas.

- `binlog_row_value_options`: Habilita o registro binário de atualizações parciais de JSON para replicação baseada em linhas.

- `binlog_rows_query_log_events`: Quando ativado, habilita o registro de eventos de log de consulta de linhas ao usar o registro baseado em linhas. Desativado por padrão.

- `Binlog_stmt_cache_disk_use`: Número de declarações não transacionais que usaram arquivo temporário em vez do cache de declaração de log binário.

- `binlog_stmt_cache_size`: Tamanho do cache para armazenar declarações não transacionais para o log binário durante a transação.

- `Binlog_stmt_cache_use`: Número de declarações que usaram o cache temporário de declarações de log binário.

- `binlog_transaction_compression`: Habilitar a compressão para os payloads de transações em arquivos de log binários.

- `binlog_transaction_compression_level_zstd`: Nível de compressão para os payloads das transações em arquivos de log binários.

- `binlog_transaction_dependency_history_size`: Número de hashes de linha mantidos para procurar uma transação que foi a última a atualizar alguma linha.

- `binlog_transaction_dependency_tracking`: Fonte de informações de dependência (horários de commit ou conjuntos de escrita de transações) a partir da qual se pode avaliar quais transações podem ser executadas em paralelo pelo aplicativo multithread da replica.

- `Com_show_binlog_events`: Contagem de declarações de SHOW BINLOG EVENTS.

- `Com_show_binlogs`: Contagem de declarações SHOW BINLOGS.

- `log-bin`: Nome base para arquivos de log binários.

- `log-bin-index`: Nome do arquivo de índice de log binário.

- `log_bin`: Se o log binário está habilitado.

- `log_bin_basename`: Caminho e nome de base para arquivos de log binários.

- `log_bin_use_v1_row_events`: Se o servidor está usando eventos de linha de registro binário da versão 1.

- `log_replica_updates`: Se a replica deve registrar as atualizações realizadas pelo seu próprio thread de replicação SQL no seu próprio log binário.

- `log_slave_updates`: Se a replica deve registrar as atualizações realizadas pelo seu próprio thread de replicação SQL no seu próprio log binário.

- `master_verify_checksum`: Faça com que a fonte examine os checksums ao ler o log binário.

- `max-binlog-dump-events`: Opção usada pelo mysql-test para depuração e teste de replicação.

- `max_binlog_cache_size`: Pode ser usado para restringir o tamanho total em bytes usados para armazenar transações de múltiplos comandos.

- `max_binlog_size`: O log binário é rotado automaticamente quando o tamanho excede esse valor.

- `max_binlog_stmt_cache_size`: Pode ser usado para restringir o tamanho total usado para armazenar em cache todas as declarações não transacionais durante a transação.

- `replica_sql_verify_checksum`: Faça com que a replica examine os checksums ao ler o log do relé.

- `slave-sql-verify-checksum`: Faça com que a replica examine os checksums ao ler o log do relé.

- `slave_sql_verify_checksum`: Faça com que a replica examine os checksums ao ler o log do relé.

- `source_verify_checksum`: Faça com que a fonte examine os checksums ao ler o log binário.

- `sporadic-binlog-dump-fail`: Opção usada pelo mysql-test para depuração e teste de replicação.

- `sync_binlog`: Limpe o log binário em sincronia no disco após cada evento a cada #ª vez.

Para uma lista de todas as opções de linha de comando, variáveis de sistema e status usadas com o **mysqld**, consulte a Seção 7.1.4, “Referência de Opção do Servidor, Variável de Sistema e Variável de Status”.
