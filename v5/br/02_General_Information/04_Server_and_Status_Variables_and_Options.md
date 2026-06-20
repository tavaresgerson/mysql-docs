## 1.4 Variáveis e opções de servidor e status adicionadas, depreciadas ou removidas no MySQL 5.7

* Opções e variáveis introduzidas no MySQL 5.7
* Opções e variáveis descontinuadas no MySQL 5.7
* Opções e variáveis removidas no MySQL 5.7

Esta seção lista as variáveis de servidor, as variáveis de status e as opções que foram adicionadas pela primeira vez, foram descontinuadas ou foram removidas no MySQL 5.7.

### Opções e Variáveis Introduzidas no MySQL 5.7

As seguintes variáveis de sistema, variáveis de status e opções de servidor foram adicionadas no MySQL 5.7.

* `Audit_log_current_size`: Tamanho atual do arquivo de registro de auditoria. Adicionado no MySQL 5.7.9.

* `Audit_log_event_max_drop_size`: Tamanho do maior evento audenciado que foi descartado. Foi adicionado no MySQL 5.7.9.

* `Audit_log_events`: Número de eventos auditados tratados. Adicionado no MySQL 5.7.9.

* `Audit_log_events_filtered`: Número de eventos filtrados auditados. Adicionado no MySQL 5.7.9.

* `Audit_log_events_lost`: Número de eventos auditados que foram descartados. Foi adicionado no MySQL 5.7.9.

* `Audit_log_events_written`: Número de eventos auditados escritos. Adicionado no MySQL 5.7.9.

* `Audit_log_total_size`: Tamanho combinado dos eventos auditados escritos. Adicionado no MySQL 5.7.9.

* `Audit_log_write_waits`: Número de eventos auditados com adiamento de escrita. Adicionado no MySQL 5.7.9.

* `Com_change_repl_filter`: Contagem de declarações de REPLICAÇÃO DE FILTRO. Adicionada no MySQL 5.7.3.

* `Com_explain_other`: Contagem de declarações EXPLAIN FOR CONNECTION. Adicionada no MySQL 5.7.2.

* `Com_group_replication_start`: Contagem de declarações do `START GROUP_REPLICATION`. Adicionada no MySQL 5.7.6.

* `Com_group_replication_stop`: Contagem de declarações de `STOP GROUP_REPLICATION`. Adicionada no MySQL 5.7.6.

* `Com_show_create_user`: Contagem de declarações de `SHOW CREATE USER`. Adicionada no MySQL 5.7.6.

* `Com_show_slave_status_nonblocking`: Contagem de declarações de `SHOW REPLICA | SLAVE STATUS NONBLOCKING`. Adicionada no MySQL 5.7.0.

* `Com_shutdown`: Contagem de declarações de `SHUTDOWN`. Adicionada no MySQL 5.7.9.

* `Connection_control_delay_generated`: Quantas vezes o servidor atrasou a solicitação de conexão. Adicionada no MySQL 5.7.17.

* `Firewall_access_denied`: Número de declarações rejeitadas pelo plugin de Firewall Empresarial MySQL. Adicionado no MySQL 5.7.9.

* `Firewall_access_granted`: Número de declarações aceitas pelo plugin de Firewall Empresarial MySQL. Adicionado no MySQL 5.7.9.

* `Firewall_cached_entries`: Número de declarações registradas pelo plugin de Firewall Empresarial MySQL. Adicionado no MySQL 5.7.9.

* `Innodb_buffer_pool_resize_status`: Status da operação de redimensionamento do pool de buffer dinâmico. Adicionada no MySQL 5.7.5.

* `Locked_connects`: Número de tentativas de conexão com contas bloqueadas. Adicionado no MySQL 5.7.6.

* `Max_execution_time_exceeded`: Número de declarações que excederam o valor do tempo de execução. Adicionado no MySQL 5.7.8.

* `Max_execution_time_set`: Número de declarações para as quais o tempo de espera de execução foi definido. Adicionado no MySQL 5.7.8.

* `Max_execution_time_set_failed`: Número de declarações para as quais o ajuste do tempo de espera de execução falhou. Adicionado no MySQL 5.7.8.

* `Max_statement_time_exceeded`: Número de declarações que excederam o valor do tempo de execução. Adicionado no MySQL 5.7.4.

* `Max_statement_time_set`: Número de declarações para as quais o tempo de espera de execução foi definido. Adicionado no MySQL 5.7.4.

* `Max_statement_time_set_failed`: Número de declarações para as quais o ajuste do tempo de espera de execução falhou. Adicionado no MySQL 5.7.4.

* `Max_used_connections_time`: O momento em que `Max_used_connections` atingiu seu valor atual. Adicionada no MySQL 5.7.5.

* `Performance_schema_index_stat_lost`: Número de índices para os quais as estatísticas foram perdidas. Adicionado no MySQL 5.7.6.

* `Performance_schema_memory_classes_lost`: Quantos instrumentos de memória não puderam ser carregados. Adicionado no MySQL 5.7.2.

* `Performance_schema_metadata_lock_lost`: Número de bloqueios de metadados que não puderam ser registrados. Adicionado no MySQL 5.7.3.

* `Performance_schema_nested_statement_lost`: Número de declarações de programa armazenadas para as quais as estatísticas foram perdidas. Adicionada no MySQL 5.7.2.

* `Performance_schema_prepared_statements_lost`: Número de declarações preparadas que não puderam ser instrumentadas. Adicionada no MySQL 5.7.4.

* `Performance_schema_program_lost`: Número de programas armazenados para os quais as estatísticas foram perdidas. Adicionado no MySQL 5.7.2.

* `Performance_schema_table_lock_stat_lost`: Número de tabelas para as quais as estatísticas de bloqueio foram perdidas. Adicionado no MySQL 5.7.6.

* `Rewriter_number_loaded_rules`: Número de regras de reescrita carregadas com sucesso na memória. Adicionada no MySQL 5.7.6.

* `Rewriter_number_reloads`: Número de recargas da tabela de regras na memória. Adicionado no MySQL 5.7.6.

* `Rewriter_number_rewritten_queries`: Número de consultas reescritas desde que o plugin foi carregado. Adicionada no MySQL 5.7.6.

* `Rewriter_reload_error`: Se ocorreu erro ao carregar as regras de reescrita na memória na última vez. Adicionado no MySQL 5.7.6.

* `audit-log`: Se deve ativar o plugin de registro de auditoria. Adicionado no MySQL 5.7.9.

* `audit_log_buffer_size`: Tamanho do buffer do log de auditoria. Adicionado no MySQL 5.7.9.

* `audit_log_compression`: Método de compactação do arquivo de registro de auditoria. Adicionado no MySQL 5.7.21.

* `audit_log_connection_policy`: Política de registro de auditoria para eventos relacionados à conexão. Adicionada no MySQL 5.7.9.

* `audit_log_current_session`: Se deve auditar a sessão atual. Adicionada no MySQL 5.7.9.

* `audit_log_disable`: Se deve desabilitar o registro de auditoria. Adicionada no MySQL 5.7.37.

* `audit_log_encryption`: Método de criptografia do arquivo de registro de auditoria. Adicionado no MySQL 5.7.21.

* `audit_log_exclude_accounts`: Contas que não devem ser auditadas. Adicionada no MySQL 5.7.9.

* `audit_log_file`: Nome do arquivo de registro de auditoria. Adicionado no MySQL 5.7.9.

* `audit_log_filter_id`: ID do filtro atual do log de auditoria. Adicionado no MySQL 5.7.13.

* `audit_log_flush`: Feche e volte a abrir o arquivo de registro de auditoria. Adicionado no MySQL 5.7.9.

* `audit_log_format`: Formato do arquivo de registro de auditoria. Adicionado no MySQL 5.7.9.

* `audit_log_format_unix_timestamp`: Se incluir o timestamp Unix no registro de auditoria em formato JSON. Adicionado no MySQL 5.7.35.

* `audit_log_include_accounts`: Contas para auditoria. Adicionada no MySQL 5.7.9.

* `audit_log_policy`: Política de registro de auditoria. Adicionada no MySQL 5.7.9.

* `audit_log_read_buffer_size`: Tamanho do buffer de leitura do log de auditoria. Adicionado no MySQL 5.7.21.

* `audit_log_rotate_on_size`: Feche e volte a abrir o arquivo de registro de auditoria neste tamanho. Adicionado no MySQL 5.7.9.

* `audit_log_statement_policy`: Política de registro de auditoria para eventos relacionados a declarações. Adicionada no MySQL 5.7.9.

* `audit_log_strategy`: Estratégia de registro de auditoria. Adicionada no MySQL 5.7.9.

* `authentication_ldap_sasl_auth_method_name`: Nome do método de autenticação. Adicionado no MySQL 5.7.19.

* `authentication_ldap_sasl_bind_base_dn`: Nome distinguido da base do servidor LDAP. Adicionada no MySQL 5.7.19.

* `authentication_ldap_sasl_bind_root_dn`: Nome distinto raiz do servidor LDAP. Adicionada no MySQL 5.7.19.

* `authentication_ldap_sasl_bind_root_pwd`: Senha de vinculação da raiz do servidor LDAP. Adicionada no MySQL 5.7.19.

* `authentication_ldap_sasl_ca_path`: Nome do arquivo de autoridade de certificação do servidor LDAP. Adicionado no MySQL 5.7.19.

* `authentication_ldap_sasl_group_search_attr`: Atributo de pesquisa de grupo do servidor LDAP. Adicionado no MySQL 5.7.19.

* `authentication_ldap_sasl_group_search_filter`: Filtro de busca de grupo personalizado LDAP. Adicionado no MySQL 5.7.21.

* `authentication_ldap_sasl_init_pool_size`: Tamanho do conjunto inicial de conexões do servidor LDAP. Adicionada no MySQL 5.7.19.

* `authentication_ldap_sasl_log_status`: Nível de registro do servidor LDAP. Adicionada no MySQL 5.7.19.

* `authentication_ldap_sasl_max_pool_size`: Tamanho máximo do conjunto de conexões do servidor LDAP. Adicionada no MySQL 5.7.19.

* `authentication_ldap_sasl_server_host`: Nome do servidor LDAP ou endereço IP. Adicionada no MySQL 5.7.19.

* `authentication_ldap_sasl_server_port`: Número de porta do servidor LDAP. Adicionada no MySQL 5.7.19.

* `authentication_ldap_sasl_tls`: Se deve usar conexões criptografadas para o servidor LDAP. Adicionada no MySQL 5.7.19.

* `authentication_ldap_sasl_user_search_attr`: Atributo de pesquisa de usuário do servidor LDAP. Adicionado no MySQL 5.7.19.

* `authentication_ldap_simple_auth_method_name`: Nome do método de autenticação. Adicionada no MySQL 5.7.19.

* `authentication_ldap_simple_bind_base_dn`: Nome de base distinguido do servidor LDAP. Adicionada no MySQL 5.7.19.

* `authentication_ldap_simple_bind_root_dn`: Nome distinto raiz do servidor LDAP. Adicionada no MySQL 5.7.19.

* `authentication_ldap_simple_bind_root_pwd`: Senha de vinculação da raiz do servidor LDAP. Adicionada no MySQL 5.7.19.

* `authentication_ldap_simple_ca_path`: Nome do arquivo de autoridade de certificação do servidor LDAP. Adicionado no MySQL 5.7.19.

* `authentication_ldap_simple_group_search_attr`: Atributo de pesquisa de grupo do servidor LDAP. Adicionado no MySQL 5.7.19.

* `authentication_ldap_simple_group_search_filter`: Filtro de busca de grupo personalizado LDAP. Adicionado no MySQL 5.7.21.

* `authentication_ldap_simple_init_pool_size`: Tamanho do conjunto inicial de conexões do servidor LDAP. Adicionada no MySQL 5.7.19.

* `authentication_ldap_simple_log_status`: Nível de registro do servidor LDAP. Adicionada no MySQL 5.7.19.

* `authentication_ldap_simple_max_pool_size`: Tamanho máximo do conjunto de conexões do servidor LDAP. Adicionada no MySQL 5.7.19.

* `authentication_ldap_simple_server_host`: Nome do servidor LDAP ou endereço IP. Adicionada no MySQL 5.7.19.

* `authentication_ldap_simple_server_port`: Número de porta do servidor LDAP. Adicionada no MySQL 5.7.19.

* `authentication_ldap_simple_tls`: Se deve usar conexões criptografadas para o servidor LDAP. Adicionada no MySQL 5.7.19.

* `authentication_ldap_simple_user_search_attr`: Atributo de pesquisa de usuário do servidor LDAP. Adicionado no MySQL 5.7.19.

* `authentication_windows_log_level`: Nível de registro do plugin de autenticação do Windows. Adicionado no MySQL 5.7.9.

* `authentication_windows_use_principal_name`: Se deve usar o nome do principal do plugin de autenticação do Windows. Adicionada no MySQL 5.7.9.

* `auto_generate_certs`: Se deve gerar automaticamente arquivos de chave e certificado SSL. Adicionada no MySQL 5.7.5.

* `avoid_temporal_upgrade`: Se a ALTER TABLE deve atualizar as colunas temporais pré-5.6.4. Adicionada no MySQL 5.7.6.

* `binlog_error_action`: Controla o que acontece quando o servidor não consegue gravar no log binário. Adicionado no MySQL 5.7.6.

* `binlog_group_commit_sync_delay`: Define o número de microsegundos para esperar antes de sincronizar as transações no disco. Foi adicionado no MySQL 5.7.5.

* `binlog_group_commit_sync_no_delay_count`: Define o número máximo de transações a serem esperadas antes de abortar o atraso atual especificado por `binlog_group_commit_sync_delay`. Adicionado no MySQL 5.7.5.

* `binlog_gtid_simple_recovery`: Controla como os registros binários são iterados durante a recuperação do GTID. Adicionado no MySQL 5.7.6.

* `binlog_transaction_dependency_history_size`: Número de hashes de string mantidos para procurar transações que foram atualizadas pela última string. Adicionada no MySQL 5.7.22.

* `binlog_transaction_dependency_tracking`: Fonte de informações sobre a dependência (marcadores de commit ou conjuntos de escrita de transação) a partir da qual se pode avaliar quais transações podem ser executadas em paralelo pelo aplicativo multithread do replica. Adicionado no MySQL 5.7.22.

* `binlogging_impossible_mode`: Desatualizado e posteriormente removido. Use `binlog_error_action` em vez disso. Adicionado no MySQL 5.7.5.

* `block_encryption_mode`: Modo para algoritmos de criptografia baseados em blocos. Adicionado no MySQL 5.7.4.

* `check_proxy_users`: Se os plugins de autenticação embutidos fazem proxeamento. Adicionada no MySQL 5.7.7.

* `connection_control_failed_connections_threshold`: Tentativas consecutivas de conexão falhadas antes de ocorrerem atrasos. Adicionada no MySQL 5.7.17.

* `connection_control_max_connection_delay`: Retardo máximo (em milissegundos) para a resposta do servidor em tentativas de conexão falhadas. Adicionado no MySQL 5.7.17.

* `connection_control_min_connection_delay`: Retardo mínimo (em milissegundos) para a resposta do servidor em tentativas de conexão falhadas. Adicionado no MySQL 5.7.17.

* `daemonize`: Execute como daemon do sistema V. Adicionado no MySQL 5.7.6.

* `default_authentication_plugin`: Plugin de autenticação padrão. Adicionado no MySQL 5.7.2.

* `default_password_lifetime`: Idade em dias em que as senhas efetivamente expiram. Adicionada no MySQL 5.7.4.

* `disable-partition-engine-check`: Se desabilitar a verificação de inicialização para tabelas sem particionamento nativo. Adicionado no MySQL 5.7.17.

* `disabled_storage_engines`: Motores de armazenamento que não podem ser usados para criar tabelas. Adicionado no MySQL 5.7.8.

* `disconnect_on_expired_password`: Se o servidor desconectar clientes com senhas expiradas, se os clientes não conseguirem lidar com essas contas. Adicionado no MySQL 5.7.1.

* `early-plugin-load`: Especifique plugins para carregar antes de carregar plugins embutidos obrigatórios e antes da inicialização do mecanismo de armazenamento. Adicionado no MySQL 5.7.11.

* `executed_gtids_compression_period`: Renomeado para `gtid_executed_compression_period`. Adicionado no MySQL 5.7.5.

* `group_replication_allow_local_disjoint_gtids_join`: Permitir que o servidor atual se junte ao grupo mesmo que tenha transações não presentes no grupo. Adicionado no MySQL 5.7.17.

* `group_replication_allow_local_lower_version_join`: Permitir que o servidor atual se junte ao grupo mesmo que tenha uma versão de plugin inferior à do grupo. Adicionado no MySQL 5.7.17.

* `group_replication_auto_increment_increment`: Determina o intervalo entre os valores sucessivos das colunas para as transações que executam neste servidor. Foi adicionado no MySQL 5.7.17.

* `group_replication_bootstrap_group`: Configure este servidor para inicializar o grupo. Adicionado no MySQL 5.7.17.

* `group_replication_components_stop_timeout`: Tempo de espera, em segundos, que o plugin aguarda por cada componente ao desligar. Adicionada no MySQL 5.7.17.

* `group_replication_compression_threshold`: Valor em bytes acima do qual a compressão (LZ4) é aplicada; quando definido como zero, desativa a compressão. Foi adicionado no MySQL 5.7.17.

* `group_replication_enforce_update_everywhere_checks`: Habilitar ou desabilitar verificações de consistência estritas para atualização de várias fontes em todos os lugares. Adicionada no MySQL 5.7.17.

* `group_replication_exit_state_action`: Como a instância se comporta quando sai do grupo involuntariamente. Adicionada no MySQL 5.7.24.

* `group_replication_flow_control_applier_threshold`: Número de transações em espera na fila de aplicador que desencadeiam o controle de fluxo. Adicionado no MySQL 5.7.17.

* `group_replication_flow_control_certifier_threshold`: Número de transações em espera na fila de certificadores que desencadeiam o controle de fluxo. Adicionado no MySQL 5.7.17.

* `group_replication_flow_control_mode`: Modo utilizado para controle de fluxo. Adicionado no MySQL 5.7.17.

* `group_replication_force_members`: Lista de endereços de pares separados por vírgula, como host1:port1, host2:port2. Adicionada no MySQL 5.7.17.

* `group_replication_group_name`: Nome do grupo. Adicionada no MySQL 5.7.17.

* `group_replication_group_seeds`: Lista de endereços de pares, lista separada por vírgula, como host1:port1, host2:port2. Adicionada no MySQL 5.7.17.

* `group_replication_gtid_assignment_block_size`: Número de GTIDs consecutivos reservados para cada membro; cada membro consome seus blocos e reserva mais quando necessário. Adicionado no MySQL 5.7.17.

* `group_replication_ip_whitelist`: Lista de hosts permitidos para se conectar ao grupo. Adicionada no MySQL 5.7.17.

* `group_replication_local_address`: Endereço local no formato host:port. Adicionado no MySQL 5.7.17.

* `group_replication_member_weight`: Chance de este membro ser eleito como primário. Adicionada no MySQL 5.7.20.

* `group_replication_poll_spin_loops`: Número de vezes que o thread de comunicação do grupo espera. Adicionado no MySQL 5.7.17.

* `group_replication_recovery_complete_at`: Políticas de recuperação ao lidar com transações em cache após a transferência de estado. Adicionada no MySQL 5.7.17.

* `group_replication_recovery_reconnect_interval`: Tempo de sono, em segundos, entre as tentativas de reconexão quando não foi encontrado um doador no grupo. Adicionado no MySQL 5.7.17.

* `group_replication_recovery_retry_count`: Número de vezes que o membro que se junta tenta se conectar aos doadores disponíveis antes de desistir. Adicionado no MySQL 5.7.17.

* `group_replication_recovery_ssl_ca`: Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis. Adicionado no MySQL 5.7.17.

* `group_replication_recovery_ssl_capath`: Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis. Adicionado no MySQL 5.7.17.

* `group_replication_recovery_ssl_cert`: Nome do arquivo de certificado SSL a ser usado para estabelecer uma conexão criptografada. Adicionado no MySQL 5.7.17.

* `group_replication_recovery_ssl_cipher`: Cifras permitidas para criptografia SSL. Adicionada no MySQL 5.7.17.

* `group_replication_recovery_ssl_crl`: Arquivo que contém listas de revogação de certificados. Adicionado no MySQL 5.7.17.

* `group_replication_recovery_ssl_crlpath`: Diretório que contém arquivos de lista de revogação de certificados. Adicionado no MySQL 5.7.17.

* `group_replication_recovery_ssl_key`: Nome do arquivo de chave SSL a ser usado para estabelecer uma conexão criptografada. Adicionado no MySQL 5.7.17.

* `group_replication_recovery_ssl_verify_server_cert`: Verifique o valor do Nome Comum do servidor no processo de recuperação no certificado enviado pelo doador. Foi adicionado no MySQL 5.7.17.

* `group_replication_recovery_use_ssl`: Se a conexão de recuperação da replicação em grupo deve usar SSL. Adicionada no MySQL 5.7.17.

* `group_replication_single_primary_mode`: Instrua o grupo a usar um único servidor para a carga de trabalho de leitura/escrita. Adicionado no MySQL 5.7.17.

* `group_replication_ssl_mode`: Estado de segurança desejado da conexão entre os membros da Replicação em Grupo. Adicionado no MySQL 5.7.17.

* `group_replication_start_on_boot`: Se o servidor deve iniciar a Replicação de Grupo durante a inicialização do servidor. Adicionado no MySQL 5.7.17.

* `group_replication_transaction_size_limit`: Define o tamanho máximo da transação em bytes que o grupo aceita. Foi adicionado no MySQL 5.7.19.

* `group_replication_unreachable_majority_timeout`: Quanto tempo esperar por partições de rede que resultem na saída de minoria do grupo. Adicionada no MySQL 5.7.19.

* `gtid_executed_compression_period`: Compress a tabela `gtid_executed` a cada vez que ocorrer esse número de transações. 0 significa nunca comprimir essa tabela. Aplica-se apenas quando o registro binário está desativado. Adicionado no MySQL 5.7.6.

* `have_statement_timeout`: Se a exibição do limite de tempo de execução da declaração está disponível. Foi adicionado no MySQL 5.7.4.

* `initialize`: Se deve executar no modo de inicialização (seguro). Adicionado no MySQL 5.7.6.

* `initialize-insecure`: Se deve executar no modo de inicialização (inseguro). Adicionado no MySQL 5.7.6.

* `innodb_adaptive_hash_index_parts`: Sistema de busca de índice de hash adaptável em n partições, com cada partição protegida por trava separada. Cada índice é vinculado a uma partição específica com base nos atributos de ID de espaço e ID de índice. Adicionado no MySQL 5.7.8.

* `innodb_background_drop_list_empty`: Aguarda a criação da tabela até que a lista de opções em segundo plano esteja vazia (debuggável). Adicionada no MySQL 5.7.10.

* `innodb_buffer_pool_chunk_size`: Tamanho do bloco usado ao redimensionar o pool de buffer. Foi adicionado no MySQL 5.7.5.

* `innodb_buffer_pool_dump_pct`: Porcentagem das páginas mais recentemente usadas para cada pool de buffer para leitura e descarte. Adicionada no MySQL 5.7.2.

* `innodb_compress_debug`: Compacta todas as tabelas usando o algoritmo de compactação especificado. Adicionado no MySQL 5.7.8.

* `innodb_deadlock_detect`: Habilita ou desabilita a detecção de travamento. Adicionada no MySQL 5.7.15.

* `innodb_default_row_format`: Formato de string padrão para tabelas InnoDB. Adicionada no MySQL 5.7.9.

* `innodb_disable_resize_buffer_pool_debug`: Desabilita o redimensionamento do buffer pool do InnoDB. Foi adicionado no MySQL 5.7.6.

* `innodb_fill_factor`: Porcentagem para o espaço de página de folha e não folha da árvore B que deve ser preenchida com dados. O espaço restante é reservado para crescimento futuro. Adicionado no MySQL 5.7.5.

* `innodb_flush_sync`: Habilitar `innodb_flush_sync` para ignorar as configurações de `innodb_io_capacity` e `innodb_io_capacity_max` para explosões de atividade de E/S que ocorrem em pontos de verificação. Desativar `innodb_flush_sync` para aderir aos limites de atividade de E/S conforme definido por `innodb_io_capacity` e `innodb_io_capacity_max`. Adicionada no MySQL 5.7.8.

* `innodb_ft_result_cache_limit`: Limite do cache do resultado da consulta de pesquisa InnoDB `FULLTEXT`. Adicionado no MySQL 5.7.2.

* `innodb_ft_total_cache_size`: Memória total alocada para o cache de índice de pesquisa InnoDB `FULLTEXT`. Adicionada no MySQL 5.7.2.

* `innodb_log_checkpoint_now`: Opção de depuração que obriga o InnoDB a escrever o ponto de verificação. Adicionada no MySQL 5.7.2.

* `innodb_log_checksum_algorithm`: Especifica como gerar e verificar o checksum armazenado em cada bloco de disco do log de refazer. Adicionado no MySQL 5.7.8.

* `innodb_log_checksums`: Habilita ou desabilita verificações de checksums para páginas de log de refazer. Adicionada no MySQL 5.7.9.

* `innodb_log_write_ahead_size`: Redimensionar o tamanho do bloco de escrita antecipada do log. Adicionado no MySQL 5.7.4.

* `innodb_max_undo_log_size`: Define o limite para o truncamento do log de desfazer do InnoDB. Foi adicionado no MySQL 5.7.5.

* `innodb_merge_threshold_set_all_debug`: Oprime o ajuste atual de MERGE_THRESHOLD com o valor especificado para todos os índices que estão atualmente na cache do dicionário. Foi adicionado no MySQL 5.7.6.

* `innodb_numa_interleave`: Habilita a política de memória `NUMA MPOL_INTERLEAVE` para alocação do pool de buffers InnoDB. Adicionada no MySQL 5.7.9.

* `innodb_optimize_point_storage`: Ative esta opção para armazenar os dados do `POINT` como dados de comprimento fixo, em vez de dados de comprimento variável. Adicionado no MySQL 5.7.5.

* `innodb_page_cleaners`: Número de threads de limpeza de página. Adicionado no MySQL 5.7.4.

* `innodb_purge_rseg_truncate_frequency`: Taxa na qual a purga do log de desfazer deve ser invocada como parte da ação de purga. Valor = n invoca a purga do log de desfazer em cada n-ésima iteração de invocação de purga. Adicionado no MySQL 5.7.5.

* `innodb_stats_include_delete_marked`: Inclua registros marcados para exclusão ao calcular estatísticas persistentes do InnoDB. Adicionada no MySQL 5.7.17.

* `innodb_status_output`: Usado para habilitar ou desabilitar a saída periódica para o Monitor padrão InnoDB. Também usado em combinação com innodb_status_output_locks para habilitar e desabilitar a saída periódica para o Monitor de bloqueio InnoDB. Adicionado no MySQL 5.7.4.

* `innodb_status_output_locks`: Usado para habilitar ou desabilitar a saída periódica para o Monitor de bloqueio padrão InnoDB. `innodb_status_output` também deve ser habilitado para produzir saída periódica para o Monitor de bloqueio InnoDB. Adicionado no MySQL 5.7.4.

* `innodb_sync_debug`: Habilita a verificação de depuração da sincronização InnoDB. Adicionada no MySQL 5.7.8.

* `innodb_temp_data_file_path`: Caminho para os arquivos de dados do espaço de tabela temporário e seus tamanhos. Adicionado no MySQL 5.7.1.

* `innodb_tmpdir`: Local de diretório para arquivos de tabela temporários criados durante operações online de `ALTER TABLE`. Foi adicionado no MySQL 5.7.11.

* `innodb_undo_log_truncate`: Ative esta opção para marcar o espaço de desfazer InnoDB para truncação. Adicionado no MySQL 5.7.5.

* `internal_tmp_disk_storage_engine`: Motor de armazenamento para tabelas temporárias internas. Adicionado no MySQL 5.7.5.

* `keyring-migration-destination`: Plugin de chave de destino de migração chave. Adicionado no MySQL 5.7.21.

* `keyring-migration-host`: Nome do host para conectar ao servidor em execução para migração de chave. Adicionado no MySQL 5.7.21.

* `keyring-migration-password`: Senha para conectar ao servidor em execução para migração de chave. Adicionada no MySQL 5.7.21.

* `keyring-migration-port`: Número de porta TCP/IP para conectar ao servidor em execução para migração de chave. Adicionado no MySQL 5.7.21.

* `keyring-migration-socket`: Arquivo de socket Unix ou pipe nomeado do Windows para conectar-se ao servidor em execução para migração de chave. Adicionado no MySQL 5.7.21.

* `keyring-migration-source`: Plugin de chave de segurança de origem migratória. Adicionado no MySQL 5.7.21.

* `keyring-migration-user`: Nome do usuário para conectar ao servidor em execução para migração de chave. Adicionado no MySQL 5.7.21.

* `keyring_aws_cmk_id`: Valor do ID da chave mestre do cliente do plugin do chaveiro AWS. Adicionado no MySQL 5.7.19.

* `keyring_aws_conf_file`: Localização do arquivo de configuração do plugin do chaveiro AWS. Adicionada no MySQL 5.7.19.

* `keyring_aws_data_file`: Localização do arquivo de armazenamento do plugin do chaveiro AWS. Adicionada no MySQL 5.7.19.

* `keyring_aws_region`: região do plugin de chave de segurança AWS. Adicionada no MySQL 5.7.19.

* `keyring_encrypted_file_data`: arquivo de dados do plugin `keyring_encrypted_file`. Adicionado no MySQL 5.7.21.

* `keyring_encrypted_file_password`: Senha do plugin `keyring_encrypted_file`. Adicionada no MySQL 5.7.21.

* `keyring_file_data`: arquivo de dados do plugin `keyring_file`. Adicionado no MySQL 5.7.11.

* `keyring_okv_conf_dir`: Diretório de configuração do plugin de chave do Oracle Key Vault. Adicionado no MySQL 5.7.12.

* `keyring_operations`: Se as operações de chave de segurança estão habilitadas. Adicionada no MySQL 5.7.21.

* `log_backward_compatible_user_definitions`: Se deve registrar `CREATE/ALTER USER`, `GRANT` de forma retrocompatível. Adicionado no MySQL 5.7.6.

* `log_builtin_as_identified_by_password`: Se deve registrar `CREATE/ALTER USER`, `GRANT` de forma retrocompatível. Adicionado no MySQL 5.7.9.

* `log_error_verbosity`: Nível de verbosidade do registro de erros. Adicionado no MySQL 5.7.2.

* `log_slow_admin_statements`: Registre os logs lents de `OPTIMIZE`, `ANALYZE`, `ALTER` e outros registros administrativos para desacelerar o log de consulta se estiver aberto. Adicionado no MySQL 5.7.1.

* `log_slow_slave_statements`: As declarações lentas executadas pela replica são escritas no log de consulta lenta. Foi adicionado no MySQL 5.7.1.

* `log_statements_unsafe_for_binlog`: Desativa as advertências do erro 1592 que estão sendo escritas no log de erro. Foi adicionado no MySQL 5.7.11.

* `log_syslog`: Se deve escrever o log de erro no syslog. Adicionada no MySQL 5.7.5.

* `log_syslog_facility`: Instalação para mensagens syslog. Adicionada no MySQL 5.7.5.

* `log_syslog_include_pid`: Se incluir o PID do servidor nas mensagens do syslog. Adicionada no MySQL 5.7.5.

* `log_syslog_tag`: Marca para o identificador do servidor em mensagens de syslog. Adicionada no MySQL 5.7.5.

* `log_timestamps`: Formato de marcação de tempo do log. Adicionado no MySQL 5.7.2.

* `max_digest_length`: Tamanho máximo de digestão em bytes. Adicionado no MySQL 5.7.6.

* `max_execution_time`: Valor do tempo de espera para a execução da declaração. Foi adicionado no MySQL 5.7.8.

* `max_points_in_geometry`: Número máximo de pontos nos valores de geometria para `ST_Buffer_Strategy()`. Adicionado no MySQL 5.7.8.

* `max_statement_time`: Valor do tempo de espera para a execução da declaração. Foi adicionado no MySQL 5.7.4.

* `mecab_charset`: Conjunto de caracteres atualmente utilizado pelo plugin de parser de texto completo MeCab. Adicionado no MySQL 5.7.6.

* `mecab_rc_file`: Caminho para o arquivo de configuração mecabrc para o analisador MeCab para pesquisa de texto completo. Adicionado no MySQL 5.7.6.

* `mysql_firewall_mode`: Se o plugin do Firewall Empresarial MySQL está operacional. Adicionado no MySQL 5.7.9.

* `mysql_firewall_trace`: Se deve habilitar o rastreamento do plugin do firewall empresarial do MySQL. Adicionado no MySQL 5.7.9.

* `mysql_native_password_proxy_users`: Se o plugin de autenticação `mysql_native_password` faz proxeamento. Adicionado no MySQL 5.7.7.

* `mysqlx`: Se o Plugin X está inicializado. Adicionado no MySQL 5.7.12.

* `mysqlx_bind_address`: Endereço de rede X Plugin usa para conexões. Adicionado no MySQL 5.7.17.

* `mysqlx_connect_timeout`: Tempo máximo permitido de espera em segundos para uma conexão configurar uma sessão. Adicionada no MySQL 5.7.12.

* `mysqlx_idle_worker_thread_timeout`: Tempo em segundos após o qual os threads de trabalhadores ociosos são terminados. Adicionado no MySQL 5.7.12.

* `mysqlx_max_allowed_packet`: Tamanho máximo dos pacotes de rede que podem ser recebidos pelo X Plugin. Adicionado no MySQL 5.7.12.

* `mysqlx_max_connections`: Número máximo de conexões de clientes concorrentes que o Plugin pode aceitar. Adicionado no MySQL 5.7.12.

* `mysqlx_min_worker_threads`: Número mínimo de threads de trabalhador utilizado para o tratamento de solicitações de clientes. Adicionado no MySQL 5.7.12.

* `mysqlx_port`: Número de porta no qual o X Plugin aceita conexões TCP/IP. Adicionada no MySQL 5.7.12.

* `mysqlx_port_open_timeout`: Tempo que o X Plugin espera ao aceitar conexões. Foi adicionado no MySQL 5.7.17.

* `mysqlx_socket`: Caminho para o soquete onde o X Plugin escuta conexões. Foi adicionado no MySQL 5.7.15.

* `mysqlx_ssl_ca`: Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis. Adicionado no MySQL 5.7.12.

* `mysqlx_ssl_capath`: Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis. Adicionado no MySQL 5.7.12.

* `mysqlx_ssl_cert`: Arquivo que contém o certificado X.509. Adicionado no MySQL 5.7.12.

* `mysqlx_ssl_cipher`: Cifras permitidas para criptografia de conexão. Adicionada no MySQL 5.7.12.

* `mysqlx_ssl_crl`: Arquivo que contém listas de revogação de certificados. Adicionado no MySQL 5.7.12.

* `mysqlx_ssl_crlpath`: Diretório que contém arquivos de lista de revogação de certificados. Adicionado no MySQL 5.7.12.

* `mysqlx_ssl_key`: Arquivo que contém a chave X.509. Adicionada no MySQL 5.7.12.

* `named_pipe_full_access_group`: Nome do grupo do Windows que recebe acesso total ao pipe nomeado. Foi adicionado no MySQL 5.7.25.

* `ngram_token_size`: Define o tamanho do token de n-gramas para o analisador de busca de texto completo ngram. Foi adicionado no MySQL 5.7.6.

* `offline_mode`: Se o servidor está offline. Adicionado no MySQL 5.7.5.

* `parser_max_mem_size`: Quantidade máxima de memória disponível para o analisador. Adicionada no MySQL 5.7.12.

* `performance-schema-consumer-events-transactions-current`: Configure o consumidor `events-transactions-current`. Adicionado no MySQL 5.7.3.

* `performance-schema-consumer-events-transactions-history`: Configure o consumidor `events-transactions-history`. Adicionado no MySQL 5.7.3.

* `performance-schema-consumer-events-transactions-history-long`: Configure o consumidor `events-transactions-history-long`. Adicionado no MySQL 5.7.3.

* `performance_schema_events_transactions_history_long_size`: Número de strings na tabela `events_transactions_history_long`. Adicionada no MySQL 5.7.3.

* `performance_schema_events_transactions_history_size`: Número de strings por thread na tabela `events_transactions_history`. Adicionada no MySQL 5.7.3.

* `performance_schema_max_digest_length`: Tamanho máximo do esquema de digest de desempenho em bytes. Adicionado no MySQL 5.7.8.

* `performance_schema_max_index_stat`: Número máximo de índices para manter estatísticas. Adicionado no MySQL 5.7.6.

* `performance_schema_max_memory_classes`: Número máximo de instrumentos de memória. Adicionado no MySQL 5.7.2.

* `performance_schema_max_metadata_locks`: Número máximo de bloqueios de metadados a serem rastreados. Adicionado no MySQL 5.7.3.

* `performance_schema_max_prepared_statements_instances`: Número de strings na tabela `prepared_statements_instances`. Adicionada no MySQL 5.7.4.

* `performance_schema_max_program_instances`: Número máximo de programas armazenados para estatísticas. Adicionado no MySQL 5.7.2.

* `performance_schema_max_sql_text_length`: Número máximo de bytes armazenados a partir de declarações SQL. Adicionado no MySQL 5.7.6.

* `performance_schema_max_statement_stack`: Nesting máximo de programas armazenados para estatísticas. Adicionado no MySQL 5.7.2.

* `performance_schema_max_table_lock_stat`: Número máximo de tabelas para manter estatísticas de bloqueio. Adicionado no MySQL 5.7.6.

* `performance_schema_show_processlist`: Selecione a implementação de `SHOW PROCESSLIST`. Adicionada no MySQL 5.7.39.

* `range_optimizer_max_mem_size`: Limite para o consumo de memória do otimizador de intervalo. Adicionado no MySQL 5.7.9.

* `rbr_exec_mode`: Permite alternar o servidor entre o modo IDEMPOTENT (chave e alguns outros erros suprimidos) e o modo ESTRITO; o modo ESTRITO é o padrão. Adicionado no MySQL 5.7.1.

* `replication_optimize_for_static_plugin_config`: Lâminas compartilhadas para replicação semiesincronizada. Adicionada no MySQL 5.7.33.

* `replication_sender_observe_commit_only`: Chamadas de retorno limitadas para replicação semiesincrônica. Adicionada no MySQL 5.7.33.

* `require_secure_transport`: Se as conexões do cliente devem usar transporte seguro. Adicionado no MySQL 5.7.8.

* `rewriter_enabled`: Se o plugin de reescrita de consulta está habilitado. Adicionado no MySQL 5.7.6.

* `rewriter_verbose`: Para uso interno. Adicionada no MySQL 5.7.6.

* `rpl_semi_sync_master_wait_for_slave_count`: Número de confirmações de replicação que a fonte deve receber por transação antes de prosseguir. Adicionado no MySQL 5.7.3.

* `rpl_semi_sync_master_wait_point`: Ponto de espera para o reconhecimento do recebimento de transação replicada. Adicionado no MySQL 5.7.2.

* `rpl_stop_slave_timeout`: Número de segundos que `STOP REPLICA` ou `STOP SLAVE` espera antes de expirar. Adicionado no MySQL 5.7.2.

* `session_track_gtids`: Habilita o rastreador que pode ser configurado para rastrear diferentes GTIDs. Adicionado no MySQL 5.7.6.

* `session_track_schema`: Se deve monitorar as alterações do esquema. Adicionada no MySQL 5.7.4.

* `session_track_state_change`: Se deve monitorar as mudanças no estado da sessão. Adicionado no MySQL 5.7.4.

* `session_track_system_variables`: Variáveis de sessão para acompanhar as alterações. Adicionada no MySQL 5.7.4.

* `session_track_transaction_info`: Como realizar o rastreamento de transações. Adicionado no MySQL 5.7.8.

* `sha256_password_auto_generate_rsa_keys`: Se deve gerar arquivos de par de chave RSA automaticamente. Adicionada no MySQL 5.7.5.

* `sha256_password_proxy_users`: Se o plugin de autenticação `sha256_password` faz proxeamento. Adicionado no MySQL 5.7.7.

* `show_compatibility_56`: Compatibilidade para `SHOW STATUS/VARIABLES`. Adicionada no MySQL 5.7.6.

* `show_create_table_verbosity`: Se deve exibir ROW_FORMAT em `SHOW CREATE TABLE`, mesmo que tenha o valor padrão. Adicionada no MySQL 5.7.22.

* `show_old_temporals`: Se `SHOW CREATE TABLE` deve indicar colunas temporais pré-5.6.4. Adicionada no MySQL 5.7.6.

* `simplified_binlog_gtid_recovery`: Renomeado para `binlog_gtid_simple_recovery`. Adicionado no MySQL 5.7.5.

* `slave_parallel_type`: Diz ao replica que use informações de marca-horário (`LOGICAL_CLOCK`) ou particionamento de banco de dados (`DATABASE`) para paralelizar as transações. Adicionado no MySQL 5.7.2.

* `slave_preserve_commit_order`: Garante que todos os commits dos trabalhadores replicados ocorram na mesma ordem que na fonte para manter a consistência ao usar threads de aplicação paralela. Adicionado no MySQL 5.7.5.

* `super_read_only`: Se deve ignorar as exceções `SUPER` para o modo de leitura apenas. Adicionada no MySQL 5.7.8.

* `thread_pool_algorithm`: Algoritmo de pool de threads. Adicionado no MySQL 5.7.9.

* `thread_pool_high_priority_connection`: Se a sessão atual é de alta prioridade. Adicionada no MySQL 5.7.9.

* `thread_pool_max_unused_threads`: Número máximo permitido de threads não utilizados. Adicionado no MySQL 5.7.9.

* `thread_pool_prio_kickup_timer`: Quanto tempo antes a declaração é movida para execução de alta prioridade. Adicionada no MySQL 5.7.9.

* `thread_pool_size`: Número de grupos de threads no conjunto de threads. Adicionado no MySQL 5.7.9.

* `thread_pool_stall_limit`: Quanto tempo antes a declaração é definida como travada. Adicionada no MySQL 5.7.9.

* `tls_version`: Protocolos TLS permitidos para conexões criptografadas. Adicionado no MySQL 5.7.10.

* `transaction_write_set_extraction`: Define o algoritmo usado para hashar os dados extraídos durante a transação. Foi adicionado no MySQL 5.7.6.

* `validate_password_check_user_name`: Se deve verificar senhas contra o nome do usuário. Adicionada no MySQL 5.7.15.

* `validate_password_dictionary_file_last_parsed`: Quando o arquivo do dicionário foi analisado pela última vez. Adicionado no MySQL 5.7.8.

* `validate_password_dictionary_file_words_count`: Número de palavras no arquivo do dicionário. Adicionada no MySQL 5.7.8.

* `version_tokens_session`: Lista de tokens do cliente para Tokens de Versão. Adicionada no MySQL 5.7.8.

* `version_tokens_session_number`: Para uso interno. Adicionada no MySQL 5.7.8.

### Opções e variáveis descontinuadas no MySQL 5.7

As seguintes variáveis de sistema, variáveis de status e opções foram descontinuadas no MySQL 5.7.

* `Innodb_available_undo_logs`: Número total de segmentos de rollback do InnoDB; diferente de `innodb_rollback_segments`, que exibe o número de segmentos de rollback ativos. Desatualizado no MySQL 5.7.19.

* `Qcache_free_blocks`: Número de blocos de memória livres na cache de consulta. Desatualizado no MySQL 5.7.20.

* `Qcache_free_memory`: Quantidade de memória livre para cache de consulta. Desatualizado no MySQL 5.7.20.

* `Qcache_hits`: Número de acertos no cache de consultas. Desatualizado no MySQL 5.7.20.

* `Qcache_inserts`: Número de inserções de cache de consulta. Desatualizado no MySQL 5.7.20.

* `Qcache_lowmem_prunes`: Número de consultas que foram excluídas do cache de consultas devido à falta de memória livre no cache. Desatualizado no MySQL 5.7.20.

* `Qcache_not_cached`: Número de consultas não armazenadas em cache (não armazenáveis ou não armazenadas em cache devido à configuração `query_cache_type`). Desatualizado no MySQL 5.7.20.

* `Qcache_queries_in_cache`: Número de consultas registradas na cache de consultas. Desatualizado no MySQL 5.7.20.

* `Qcache_total_blocks`: Número total de blocos na cache de consulta. Desatualizado no MySQL 5.7.20.

* `Slave_heartbeat_period`: Intervalo de batida de replicação da replica, em segundos. Desatualizado no MySQL 5.7.6.

* `Slave_last_heartbeat`: Mostra quando o sinal mais recente do batimento cardíaco foi recebido, no formato `TIMESTAMP`. Desatualizado no MySQL 5.7.6.

* `Slave_received_heartbeats`: Número de batimentos cardíacos recebidos pela réplica desde o último reajuste. Desatualizado no MySQL 5.7.6.

* `Slave_retried_transactions`: Número total de vezes desde a inicialização em que o thread de replicação SQL refez as transações. Desatualizado no MySQL 5.7.6.

* `Slave_running`: Estado deste servidor como replica (status de thread de I/O de replicação). Desatualizado no MySQL 5.7.6.

* `avoid_temporal_upgrade`: Se a `ALTER TABLE` deve atualizar as colunas temporais pré-5.6.4. Descontinuada no MySQL 5.7.6.

* `binlog_max_flush_queue_time`: Quanto tempo para ler as transações antes de ser descartado no log binário. Desatualizado no MySQL 5.7.9.

* `bootstrap`: Usado pelos scripts de instalação do mysql. Descontinuado no MySQL 5.7.6.

* `des-key-file`: Carregar chaves para `des_encrypt()` e `des_encrypt` a partir do arquivo fornecido. Desatualizado no MySQL 5.7.6.

* `disable-partition-engine-check`: Se deve desabilitar a verificação de inicialização para tabelas sem particionamento nativo. Descontinuado no MySQL 5.7.17.

* `group_replication_allow_local_disjoint_gtids_join`: Permitir que o servidor atual se junte ao grupo mesmo que tenha transações não presentes no grupo. Desatualizado no MySQL 5.7.21.

* `have_crypt`: Disponibilidade da chamada de sistema `crypt()`. Descontinuada no MySQL 5.7.6.

* `have_query_cache`: Se o mysqld suporta cache de consulta. Desatualizado no MySQL 5.7.20.

* `ignore-db-dir`: Trate o diretório como um diretório não-de-banco de dados. Descontinuado no MySQL 5.7.16.

* `ignore_db_dirs`: Diretórios tratados como diretórios não-de-banco de dados. Descontinuado no MySQL 5.7.16.

* `innodb`: Habilite o InnoDB (se esta versão do MySQL o suportar). Desatualizado no MySQL 5.7.5.

* `innodb_file_format`: Formato para novas tabelas InnoDB. Desatualizado no MySQL 5.7.7.

* `innodb_file_format_check`: Se o InnoDB realiza verificação de compatibilidade de formato de arquivo. Desatualizado no MySQL 5.7.7.

* `innodb_file_format_max`: Marca de formato de arquivo em espaço de tabela compartilhado. Desatualizada no MySQL 5.7.7.

* `innodb_large_prefix`: Habilita chaves mais longas para índices de prefixo de coluna. Desatualizado no MySQL 5.7.7.

* `innodb_support_xa`: Habilitar suporte InnoDB para XA comitamento de duas fases. Desatualizado no MySQL 5.7.10.

* `innodb_undo_logs`: Número de registros de desfazer (segmentos de rollback) usados pelo InnoDB; sinônimo de `innodb_rollback_segments`. Desatualizado no MySQL 5.7.19.

* `innodb_undo_tablespaces`: Número de arquivos do espaço de tabela para os quais os segmentos de rollback são divididos. Desatualizado no MySQL 5.7.21.

* `log-warnings`: Escreva alguns avisos não críticos no arquivo de registro. Desatualizado no MySQL 5.7.2.

* `metadata_locks_cache_size`: Tamanho do cache de bloqueios de metadados. Desatualizado no MySQL 5.7.4.

* `metadata_locks_hash_instances`: Número de hashes de bloqueio de metadados. Desatualizado no MySQL 5.7.4.

* `myisam_repair_threads`: Número de threads a serem usados ao reparar tabelas MyISAM. 1 desativa a reparação paralela. Desatualizado no MySQL 5.7.38.

* `old_passwords`: Seleciona o método de hashing de senha para `PASSWORD()`. Desatualizado no MySQL 5.7.6.

* `partition`: Habilitar (ou desabilitar) suporte de particionamento. Desatualizado no MySQL 5.7.16.

* `query_cache_limit`: Não cache os resultados que são maiores que este. Desatualizado no MySQL 5.7.20.

* `query_cache_min_res_unit`: Tamanho mínimo da unidade na qual o espaço para os resultados é alocado (a última unidade é recortada após a escrita de todos os dados dos resultados). Desatualizado no MySQL 5.7.20.

* `query_cache_size`: Memória alocada para armazenar resultados de consultas antigas. Desatualizada no MySQL 5.7.20.

* `query_cache_type`: Tipo de cache de consulta. Desatualizado no MySQL 5.7.20.

* `query_cache_wlock_invalidate`: Invalidate consultas no cache de consultas em `LOCK` para escrita. Desatualizado no MySQL 5.7.20.

* `secure_auth`: Não permita autenticação para contas que tenham senhas antigas (pré-4.1). Desatualizado no MySQL 5.7.5.

* `show_compatibility_56`: Compatibilidade para `SHOW STATUS/VARIABLES`. Descontinuada no MySQL 5.7.6.

* `show_old_temporals`: Se `SHOW CREATE TABLE` deve indicar colunas temporais pré-5.6.4. Descontinuada no MySQL 5.7.6.

* `skip-partition`: Não habilite a partição definida pelo usuário. Desatualizada no MySQL 5.7.16.

* `sync_frm`: Sincronizar `.frm` no disco ao criar. Ativado por padrão. Desatualizado no MySQL 5.7.6.

* `temp-pool`: A utilização desta opção faz com que a maioria dos ficheiros temporários criados utilizem um conjunto pequeno de nomes, em vez de um nome único para cada novo ficheiro. Descontinuada no MySQL 5.7.18.

* `tx_isolation`: Nível de isolamento de transação padrão. Desatualizado no MySQL 5.7.20.

* `tx_read_only`: Modo padrão de acesso à transação. Desatualizado no MySQL 5.7.20.

### Opções e Variáveis Removidas no MySQL 5.7

As seguintes variáveis de sistema, variáveis de status e opções foram removidas no MySQL 5.7.

* `Com_show_slave_status_nonblocking`: Contagem de declarações de `SHOW REPLICA | SLAVE STATUS NONBLOCKING`. Removida no MySQL 5.7.6.

* `Max_statement_time_exceeded`: Número de declarações que excederam o valor do tempo de execução. Removido no MySQL 5.7.8.

* `Max_statement_time_set`: Número de declarações para as quais o tempo de espera de execução foi definido. Removido no MySQL 5.7.8.

* `Max_statement_time_set_failed`: Número de declarações para as quais o ajuste do tempo de espera de execução falhou. Removido no MySQL 5.7.8.

* `binlogging_impossible_mode`: Desatualizada e posteriormente removida. Use `binlog_error_action instead`. Removida no MySQL 5.7.6.

* `default-authentication-plugin`: Plugin de autenticação padrão. Removido no MySQL 5.7.2.

* `executed_gtids_compression_period`: Renomeado para `gtid_executed_compression_period`. Removido no MySQL 5.7.6.

* `innodb_additional_mem_pool_size`: Tamanho do pool de memória que o InnoDB usa para armazenar informações do dicionário de dados e outras estruturas de dados internas. Removido no MySQL 5.7.4.

* `innodb_log_checksum_algorithm`: Especifica como gerar e verificar o checksum armazenado em cada bloco de disco do log de refazer. Removido no MySQL 5.7.9.

* `innodb_optimize_point_storage`: Ative esta opção para armazenar dados POINT como dados de comprimento fixo, em vez de dados de comprimento variável. Removido no MySQL 5.7.6.

* `innodb_use_sys_malloc`: Se o InnoDB usa alocador de memória do sistema operacional ou próprio. Removido no MySQL 5.7.4.

* `log-slow-admin-statements`: Registre os logs lents de `OPTIMIZE`, `ANALYZE`, `ALTER` e outros registros administrativos para desacelerar o log de consulta se estiver aberto. Removido no MySQL 5.7.1.

* `log-slow-slave-statements`: As declarações lentas executadas pela replica são escritas no log de consulta lenta. Removido no MySQL 5.7.1.

* `log_backward_compatible_user_definitions`: Se deve registrar `CREATE/ALTER USER`, `GRANT` de forma retrocompatível. Removido no MySQL 5.7.9.

* `max_statement_time`: Valor do tempo de espera para a execução da declaração. Removido no MySQL 5.7.8.

* `myisam_repair_threads`: Número de threads a serem usados ao reparar tabelas MyISAM. 1 desativa a reparação paralela. Removido no MySQL 5.7.39.

* `simplified_binlog_gtid_recovery`: Renomeado para `binlog_gtid_simple_recovery`. Removido no MySQL 5.7.6.

* `storage_engine`: Motor de armazenamento padrão. Removido no MySQL 5.7.5.

* `thread_concurrency`: Permite que o aplicativo forneça uma dica ao sistema de threads sobre o número desejado de threads que devem ser executadas de uma vez. Removido no MySQL 5.7.2.

* `timed_mutexes`: Especifique se os mutexes devem ser temporizados (apenas os mutexes do InnoDB são suportados atualmente). Removido no MySQL 5.7.5.