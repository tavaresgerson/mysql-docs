#### 19.1.6.1 Opção de Registro Binário e Referência de Variáveis

As duas seções a seguir fornecem informações básicas sobre as opções e variáveis do prompt de comando do MySQL aplicáveis à replicação e ao log binário.

##### Opções e Variáveis de Replicação

As opções e variáveis do prompt de comando na lista a seguir estão relacionadas aos servidores de origem da replicação e às réplicas. A seção 19.1.6.2, “Opções e Variáveis de Fonte de Replicação”, fornece informações mais detalhadas sobre opções e variáveis relacionadas aos servidores de origem da replicação. Para mais informações sobre opções e variáveis relacionadas às réplicas, consulte a seção 19.1.6.3, “Opções e Variáveis de Servidor de Replicação”.

* `auto_increment_increment`: Colunas AUTO_INCREMENT são incrementadas por este valor.

* `auto_increment_offset`: Deslocamento adicionado às colunas AUTO_INCREMENT.

* `Com_change_replication_source`: Número de instruções CHANGE REPLICATION SOURCE TO e CHANGE MASTER TO.

* `Com_replica_start`: Número de instruções START REPLICA e START SLAVE.

* `Com_replica_stop`: Número de instruções STOP REPLICA e STOP SLAVE.

* `Com_show_binary_log_status`: Número de instruções SHOW BINARY LOG STATUS; use em vez de Com_show_master_status.

* `Com_show_replica_status`: Número de instruções SHOW REPLICA STATUS e SHOW SLAVE STATUS.

* `Com_show_replicas`: Número de instruções SHOW REPLICAS e SHOW SLAVE HOSTS.

* `enforce_gtid_consistency`: Impedir a execução de instruções que não podem ser registradas de maneira segura em transação.

* `gtid_executed`: Global: Todos os GTIDs no log binário (global) ou na transação atual (sessão). Apenas leitura.

* `gtid_executed_compression_period`: Compress a tabela gtid_executed a cada vez que ocorrer essa quantidade de transações. 0 significa nunca comprimir essa tabela. Aplica-se apenas quando o registro binário está desativado.

* `gtid_mode`: Controla se o registro baseado em GTID está habilitado e que tipo de logs de transações podem conter.

* `gtid_next`: Especifica o GTID para a(s) transação(ões) subsequente(s); consulte a documentação para detalhes.

* `gtid_owned`: Conjunto de GTIDs de propriedade deste cliente (sessão), ou de todos os clientes, juntamente com o ID de thread do proprietário (global). Apenas leitura.

* `gtid_purged`: Conjunto de todos os GTIDs que foram apagados do log binário.

* `immediate_server_version`: Número de versão do MySQL Server do servidor que é a fonte de replicação imediata.

* `init_replica`: Instruções executadas quando a replica se conecta à fonte.

* `init_slave`: Instruções executadas quando a replica se conecta à fonte.

* `log_bin_trust_function_creators`: Se igual a 0 (padrão), então quando a opção --log-bin é usada, a criação de funções armazenadas é permitida apenas para usuários com privilégio SUPER e apenas se a função criada não quebrar o registro binário.

* `log_statements_unsafe_for_binlog`: Desabilita as mensagens de aviso de erro 1592 sendo escritas no log de erro.

* `master-retry_count`: Número de tentativas que a replica faz para se conectar à fonte antes de desistir.

* `max_relay_log_size`: Se não nulo, o log de relay é rotado automaticamente quando seu tamanho exceder esse valor. Se zero, o tamanho em que a rotação ocorre é determinado pelo valor de max_binlog_size.

* `original_commit_timestamp`: Hora em que a transação foi comprometida na fonte original.

* `original_server_version`: Número de versão do MySQL Server do servidor em que a transação foi originalmente comprometida.

* `relay_log`: Local e nome base a serem usados para logs de relay.

* `relay_log_basename`: Caminho completo para o log do retransmissor, incluindo o nome do arquivo.

* `relay_log_index`: Local e nome a serem usados para o arquivo que mantém a lista dos últimos logs do retransmissor.

* `relay_log_purge`: Determina se os logs do retransmissor serão apagados.

* `relay_log_recovery`: Se a recuperação automática dos arquivos de log do retransmissor da fonte é habilitada ao iniciar; deve ser habilitada para uma replica segura em caso de falha.

* `relay_log_space_limit`: Espaço máximo a ser usado para todos os logs do retransmissor.

* `replica_checkpoint_group`: Número máximo de transações processadas pela replica multisserial antes que a operação de checkpoint seja chamada para atualizar o status do progresso. Não é suportado pelo NDB Cluster.

* `replica_checkpoint_period`: Atualiza o status do progresso da replica multisserial e esvazia as informações do log do retransmissor para o disco após este número de milissegundos. Não é suportado pelo NDB Cluster.

* `replica_compressed_protocol`: Use a compressão do protocolo de fonte/replica.

* `replica_exec_mode`: Permite alternar o thread de replicação entre o modo IDEMPOTENT (erros de chave e outros suprimidos) e o modo STRICT; o modo STRICT é padrão, exceto para o NDB Cluster, onde o IDEMPOTENT é sempre usado.

* `replica_load_tmpdir`: Local onde a replica deve colocar seus arquivos temporários ao replicar instruções LOAD DATA.

* `replica_max_allowed_packet`: Tamanho máximo, em bytes, do pacote que pode ser enviado do servidor de origem da replica para a replica; substitui max_allowed_packet.

* `replica_net_timeout`: Número de segundos para esperar por mais dados da conexão de origem/replica antes de abortar a leitura.

* `Replica_open_temp_tables`: Número de tabelas temporárias que o thread SQL da replica atualmente tem aberto.

* `replica_parallel_workers`: Número de threads de aplicável para executar transações de replicação. NDB Cluster: consulte a documentação.

* `replica_pending_jobs_size_max`: Tamanho máximo das filas de trabalho da replica que armazenam eventos ainda não aplicados.

* `replica_preserve_commit_order`: Garante que todos os commits dos trabalhadores da replica ocorram na mesma ordem que na fonte para manter a consistência ao usar threads de aplicador paralelos.

* `replica_skip_errors`: Diz ao thread de replicação para continuar a replicação quando a consulta retorna um erro da lista fornecida.

* `replica_transaction_retries`: Número de vezes que o thread SQL de replicação tenta a transação novamente se ela falhar com um deadlock ou timeout de espera de bloqueio, antes de desistir e parar.

* `replica_type_conversions`: Controla o modo de conversão de tipo na replica. O valor é uma lista de zero ou mais elementos desta lista: ALL_LOSSY, ALL_NON_LOSSY. Defina para uma string vazia para não permitir conversões de tipo entre a fonte e a replica.

* `replicate-do-db`: Diz ao thread SQL de replicação para restringir a replicação ao banco de dados especificado.

* `replicate-do-table`: Diz ao thread SQL de replicação para restringir a replicação à tabela especificada.

* `replicate-ignore-db`: Diz ao thread SQL de replicação para não replicar para o banco de dados especificado.

* `replicate-ignore-table`: Diz ao thread SQL de replicação para não replicar para a tabela especificada.

* `replicate-rewrite-db`: Atualiza o banco de dados com um nome diferente do original.

* `replicate-same-server_id`: Na replicação, se habilitado, não ignore eventos com nosso ID de servidor.

* `replicate_wild_do_table`: Diz ao thread SQL de replicação para restringir a replicação às tabelas que correspondem ao padrão de wildcard especificado.

* `replicate_wild_ignore_table`: Diz ao thread SQL de replicação para não replicar para tabelas que correspondem ao padrão de wildcard fornecido.

* `replication_optimize_for_static_plugin_config`: Bloqueios compartilhados para replicação semiesincronizada.

* `replication_sender_observe_commit_only`: Chamadas de retorno limitadas para replicação semissíncrona.

* `report_host`: Nome do host ou IP da réplica a ser relatada para a fonte durante o registro da réplica.

* `report_password`: Senha arbitrária que o servidor de réplica deve relatar para a fonte; não é a mesma senha da conta de usuário de replicação.

* `report_port`: Porta para se conectar à réplica relatada para a fonte durante o registro da réplica.

* `report_user`: Nome de usuário arbitrário que o servidor de réplica deve relatar para a fonte; não é o mesmo nome usado para a conta de usuário de replicação.

* `rpl_read_size`: Configurar o tamanho mínimo de dados em bytes que é lido dos arquivos de log binário e dos arquivos de log de relevo.

* `rpl_semi_sync_master_wait_no_slave`: Se a fonte espera pelo tempo limite mesmo sem réplicas.

* `rpl_semi_sync_replica_enabled`: Se a replicação semissíncrona está habilitada na réplica.

* `Rpl_semi_sync_replica_status`: Se a replicação semissíncrona está operacional na réplica.

* `rpl_semi_sync_replica_trace_level`: Nível de rastreamento de depuração da replicação semissíncrona na réplica.

* `Rpl_semi_sync_source_clients`: Número de réplicas semissíncronas.

* `rpl_semi_sync_source_enabled`: Se a replicação semissíncrona está habilitada na fonte.

* `Rpl_semi_sync_source_net_avg_wait_time`: Tempo médio que a fonte esperou por respostas da réplica.

* `Rpl_semi_sync_source_net_wait_time`: Tempo total que a fonte esperou por respostas da réplica.

* `Rpl_semi_sync_source_net_waits`: Número total de vezes que a fonte esperou por respostas da réplica.

* `Rpl_semi_sync_source_no_times`: Número de vezes que a fonte desativou a replicação semissíncrona.

* `Rpl_semi_sync_source_no_tx`: Número de commits que não foram reconhecidos com sucesso.

* `Rpl_semi_sync_source_status`: Se a replicação semi-sincronizada está operacional na fonte.

* `Rpl_semi_sync_source_timefunc_failures`: Número de vezes que a fonte falhou ao chamar funções de tempo.

* `rpl_semi_sync_source_timeout`: Número de milissegundos para esperar o reconhecimento da réplica.

* `rpl_semi_sync_source_trace_level`: Nível de rastreamento de depuração da replicação semi-sincronizada na fonte.

* `Rpl_semi_sync_source_tx_avg_wait_time`: Tempo médio que a fonte esperou por cada transação.

* `Rpl_semi_sync_source_tx_wait_time`: Tempo total que a fonte esperou por transações.

* `Rpl_semi_sync_source_tx_waits`: Número total de vezes que a fonte esperou por transações.

* `rpl_semi_sync_source_wait_for_replica_count`: Número de confirmações de réplica que a fonte deve receber por transação antes de prosseguir.

* `rpl_semi_sync_source_wait_no_replica`: Se a fonte espera pelo tempo limite mesmo sem réplicas.

* `rpl_semi_sync_source_wait_point`: Ponto de espera para o reconhecimento do recibo de transação da réplica.

* `Rpl_semi_sync_source_wait_pos_backtraverse`: Número total de vezes que a fonte esperou por um evento com coordenadas binárias menores que os eventos esperados anteriormente.

* `Rpl_semi_sync_source_wait_sessions`: Número de sessões atualmente esperando por respostas da réplica.

* `Rpl_semi_sync_source_yes_tx`: Número de commits confirmados com sucesso.

* `rpl_stop_replica_timeout`: Número de segundos que o STOP REPLICA espera antes de expirar.

* `rpl_stop_slave_timeout`: Número de segundos que o STOP REPLICA ou STOP SLAVE espera antes de expirar.

* `server_uuid`: ID globalmente único do servidor, automaticamente (re)gerado ao iniciar o servidor.

* `show-replica-auth-info`: Mostrar o nome do usuário e a senha na opção SHOW REPLICAS nesta fonte.

* `show-slave-auth-info`: Mostre o nome do usuário e a senha em SHOW REPLICAS e SHOW SLAVE HOSTS nesta fonte.

* `skip-replica-start`: Se definido, a replicação não é iniciada automaticamente quando o servidor de replicação iniciar.

* `skip-slave-start`: Se definido, a replicação não é iniciada automaticamente quando o servidor de replicação iniciar.

* `slave-skip-errors`: Diz ao thread de replicação para continuar a replicação quando a consulta retornar um erro da lista fornecida.

* `slave_checkpoint_group`: Número máximo de transações processadas pela replica multithread antes que a operação de checkpoint seja chamada para atualizar o status do progresso. Não é suportado pelo NDB Cluster.

* `slave_checkpoint_period`: Atualize o status do progresso da replica multithread e limpe as informações do log do relay no disco após este número de milissegundos. Não é suportado pelo NDB Cluster.

* `slave_compressed_protocol`: Use a compressão do protocolo de origem/replica.

* `slave_exec_mode`: Permite alternar o thread de replicação entre o modo IDEMPOTENT (chave e alguns outros erros suprimidos) e o modo STRICT; o modo STRICT é o padrão, exceto para o NDB Cluster, onde IDEMPOTENT é sempre usado.

* `slave_load_tmpdir`: Local onde a replica deve colocar seus arquivos temporários ao replicar instruções LOAD DATA.

* `slave_max_allowed_packet`: Tamanho máximo, em bytes, do pacote que pode ser enviado do servidor de origem da replicação para a replica; substitui max_allowed_packet.

* `slave_net_timeout`: Número de segundos para esperar por mais dados da conexão de origem/replica antes de abortar a leitura.

* `Slave_open_temp_tables`: Número de tabelas temporárias que o thread SQL de replicação atualmente tem aberto.

* `slave_parallel_workers`: Número de threads de aplicável para executar transações de replicação em paralelo; 0 ou 1 desativa a multithread da replica. NDB Cluster: consulte a documentação.

* `slave_pending_jobs_size_max`: Tamanho máximo das filas de trabalho do replicador que armazenam eventos ainda não aplicados.

* `slave_preserve_commit_order`: Garante que todos os commits feitos pelos trabalhadores do replicador ocorram na mesma ordem que na fonte para manter a consistência ao usar threads de aplicador paralelos.

* `Slave_rows_last_search_algorithm_used`: Algoritmo de pesquisa mais recentemente usado por este replicador para localizar linhas para replicação baseada em linhas (índice, tabela ou varredura hash).

* `slave_transaction_retries`: Número de vezes que o thread de SQL do replicador tenta a transação novamente caso ela falhe com um deadlock ou o tempo de espera de bloqueio esgotado, antes de desistir e parar.

* `slave_type_conversions`: Controla o modo de conversão de tipo no replicador. O valor é uma lista de zero ou mais elementos desta lista: ALL_LOSSY, ALL_NON_LOSSY. Defina para uma string vazia para impedir conversões de tipo entre a fonte e o replicador.

* `sql_log_bin`: Controla o registro binário para a sessão atual.

* `sql_replica_skip_counter`: Número de eventos da fonte que o replicador deve ignorar. Não é compatível com a replicação GTID.

* `sql_slave_skip_counter`: Número de eventos da fonte que o replicador deve ignorar. Não é compatível com a replicação GTID.

* `sync_master_info`: Sincronize as informações da fonte após cada evento #.

* `sync_relay_log`: Sincronize o log do relay para o disco após cada evento #.

* `sync_relay_log_info`: Sincronize o arquivo relay.info para o disco após cada evento #.

* `sync_source_info`: Sincronize as informações da fonte após cada evento #.

* `terminology_use_previous`: Use a terminologia da versão anterior onde as alterações são incompatíveis.

Para uma lista de todas as opções de linha de comando, variáveis de sistema e variáveis de status usadas com **mysqld**, consulte a Seção 7.1.4, “Referência de Opção do Servidor, Variável de Sistema e Variável de Status”.

##### Opções e Variáveis de Registro Binário

As opções de linha de comando e as variáveis de sistema na lista a seguir estão relacionadas ao registro binário. A seção 19.1.6.4, “Opções e Variáveis de Registro Binário”, fornece informações mais detalhadas sobre as opções e variáveis relacionadas ao registro binário. Para informações gerais adicionais sobre o registro binário, consulte a seção 7.4.4, “O Registro Binário”.

* `binlog-checksum`: Ativa ou desativa verificações de checksums no registro binário.

* `binlog-do-db`: Limita o registro binário a bancos de dados específicos.

* `binlog-ignore-db`: Indica à fonte que as atualizações para o banco de dados especificado não devem ser escritas no registro binário.

* `binlog-row-event-max-size`: Tamanho máximo de evento no registro binário.

* `Binlog_cache_disk_use`: Número de transações que usaram arquivo temporário em vez do cache de registro binário.

* `binlog_cache_size`: Tamanho do cache para armazenar instruções SQL para o registro binário durante a transação.

* `Binlog_cache_use`: Número de transações que usaram o cache de registro binário temporário.

* `binlog_checksum`: Ativa ou desativa verificações de checksums no registro binário.

* `binlog_direct_non_transactional_updates`: Faz com que as atualizações usando o formato de declaração para motores não transacionais sejam escritas diretamente no registro binário. Consulte a documentação antes de usar.

* `binlog_encryption`: Ativa a criptografia para arquivos de registro binário e arquivos de registro de retransmissão neste servidor.

* `binlog_error_action`: Controla o que acontece quando o servidor não consegue escrever no registro binário.

* `binlog_expire_logs_auto_purge`: Controla a purga automática de arquivos de registro binário; pode ser sobrescrito quando habilitado, definindo tanto binlog_expire_logs_seconds quanto expire_logs_days para 0.

* `binlog_expire_logs_seconds`: Purga os registros binários após esse número de segundos.

* `binlog_format`: Especifica o formato do registro binário.

* `binlog_group_commit_sync_delay`: Define o número de microsegundos para aguardar antes de sincronizar as transações com o disco.

* `binlog_group_commit_sync_no_delay_count`: Define o número máximo de transações para aguardar antes de abortar o atraso atual especificado por `binlog_group_commit_sync_delay`.

* `binlog_max_flush_queue_time`: Quanto tempo aguardar para ler as transações antes de descartá-las no log binário.

* `binlog_order_commits`: Se as transações devem ser confirmadas na mesma ordem em que foram escritas no log binário.

* `binlog_rotate_encryption_master_key_at_startup`: Rotação da chave mestre do log binário ao iniciar o servidor.

* `binlog_row_image`: Usar imagens completas ou mínimas ao registrar alterações de linhas.

* `binlog_row_metadata`: Se devem ser registrados todos os metadados relacionados à tabela ou apenas os metadados mínimos no log binário ao usar o registro baseado em linhas.

* `binlog_row_value_options`: Habilita o registro de atualizações JSON parciais para a replicação baseada em linhas.

* `binlog_rows_query_log_events`: Quando habilitado, habilita o registro de eventos de consulta de linhas no log de consulta de linhas ao usar o registro baseado em linhas. Desabilitado por padrão.

* `Binlog_stmt_cache_disk_use`: Número de declarações não transacionais que usaram arquivo temporário em vez do cache de declarações do log binário.

* `binlog_stmt_cache_size`: Tamanho do cache para armazenar declarações não transacionais para o log binário durante a transação.

* `Binlog_stmt_cache_use`: Número de declarações que usaram o cache temporário de declarações do log binário.

* `binlog_transaction_compression`: Habilitar a compressão dos payloads de transação nos arquivos do log binário.

* `binlog_transaction_compression_level_zstd`: Nível de compressão para os payloads de transação nos arquivos do log binário.

* `binlog_transaction_dependency_history_size`: Número de hashes de linha mantidos para procurar transações que atualizaram recentemente alguma linha.

* `Com_show_binlog_events`: Número de declarações `SHOW BINLOG EVENTS`.

* `Com_show_binlogs`: Número de declarações `SHOW BINLOGS`.

* `log-bin`: Nome base para arquivos de log binários.

* `log-bin-index`: Nome do arquivo de índice de log binário.

* `log_bin`: Se o log binário está habilitado.

* `log_bin_basename`: Caminho e nome base para arquivos de log binário.

* `log_replica_updates`: Se a replica deve registrar as atualizações realizadas por seu fio de SQL de replicação em seu próprio log binário.

* `log_slave_updates`: Se a replica deve registrar as atualizações realizadas por seu fio de SQL de replicação em seu próprio log binário.

* `master_verify_checksum`: Causa a fonte a examinar os checksums ao ler do log binário.

* `max-binlog-dump-events`: Opção usada pelo mysql-test para depuração e teste de replicação.

* `max_binlog_cache_size`: Pode ser usado para restringir o tamanho total em bytes usado para cachear transações de múltiplos comandos.

* `max_binlog_size`: O log binário é rotado automaticamente quando o tamanho excede esse valor.

* `max_binlog_stmt_cache_size`: Pode ser usado para restringir o tamanho total usado para cachear todos os comandos não transacionais durante a transação.

* `replica_sql_verify_checksum`: Causa a replica a examinar os checksums ao ler do log de relay.

* `slave-sql-verify-checksum`: Causa a replica a examinar os checksums ao ler do log de relay.

* `slave_sql_verify_checksum`: Causa a replica a examinar os checksums ao ler do log de relay.

* `source_verify_checksum`: Causa a fonte a examinar os checksums ao ler do log binário.

* `sporadic-binlog-dump-fail`: Opção usada pelo mysql-test para depuração e teste de replicação.

* `sync_binlog`: Esvazia o log binário de forma síncrona no disco após cada evento #.

Para uma lista de todas as opções de linha de comando, variáveis de sistema e variáveis de status usadas com **mysqld**, consulte a Seção 7.1.4, “Referência de Opção do Servidor, Variável de Sistema e Variável de Status”.