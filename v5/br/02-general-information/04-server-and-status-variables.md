## 1.4 Variáveis e opções de servidor e status adicionadas, descontinuadas ou removidas no MySQL 5.7

Esta seção lista as variáveis de servidor, as variáveis de status e as opções que foram adicionadas pela primeira vez, foram descontinuadas ou foram removidas no MySQL 5.7.

### Opções e variáveis introduzidas no MySQL 5.7

As seguintes variáveis de sistema, variáveis de status e opções de servidor foram adicionadas no MySQL 5.7.

- `Audit_log_current_size`: Tamanho atual do arquivo de registro de auditoria. Adicionada no MySQL 5.7.9.

- `Audit_log_event_max_drop_size`: Tamanho do maior evento auditado que foi descartado. Foi adicionado no MySQL 5.7.9.

- `Audit_log_events`: Número de eventos auditados processados. Adicionado no MySQL 5.7.9.

- `Audit_log_events_filtered`: Número de eventos auditados filtrados. Adicionado no MySQL 5.7.9.

- `Audit_log_events_lost`: Número de eventos auditados perdidos. Adicionado no MySQL 5.7.9.

- `Audit_log_events_written`: Número de eventos auditados escritos. Adicionado no MySQL 5.7.9.

- `Audit_log_total_size`: Tamanho combinado dos eventos auditados escritos. Adicionado no MySQL 5.7.9.

- `Audit_log_write_waits`: Número de eventos auditados com escrita adiada. Adicionada no MySQL 5.7.9.

- `Com_change_repl_filter`: Número de declarações de `CHANGE REPLICATION FILTER`. Adicionado no MySQL 5.7.3.

- `Com_explain_other`: Contagem de instruções `EXPLAIN FOR CONNECTION`. Adicionada no MySQL 5.7.2.

- `Com_group_replication_start`: Contagem de instruções `START GROUP_REPLICATION`. Adicionada no MySQL 5.7.6.

- `Com_group_replication_stop`: Número de declarações `STOP GROUP_REPLICATION`. Adicionada no MySQL 5.7.6.

- `Com_show_create_user`: Número de instruções `SHOW CREATE USER`. Adicionada no MySQL 5.7.6.

- `Com_show_slave_status_nonblocking`: Número de instruções `SHOW REPLICA | SLAVE STATUS NONBLOCKING`. Adicionada no MySQL 5.7.0.

- `Com_shutdown`: Contagem de declarações de SHUTDOWN. Adicionada no MySQL 5.7.9.

- `Connection_control_delay_generated`: Quantas vezes o servidor atrasou a solicitação de conexão. Adicionada no MySQL 5.7.17.

- `Firewall_access_denied`: Número de declarações rejeitadas pelo plugin do Firewall Enterprise MySQL. Adicionada no MySQL 5.7.9.

- `Firewall_access_granted`: Número de declarações aceitas pelo plugin do Firewall Enterprise MySQL. Adicionada no MySQL 5.7.9.

- `Firewall_cached_entries`: Número de declarações registradas pelo plugin do Firewall Enterprise MySQL. Adicionada no MySQL 5.7.9.

- `Innodb_buffer_pool_resize_status`: Status da operação de redimensionamento dinâmico do pool de buffers. Adicionada no MySQL 5.7.5.

- `Locked_connects`: Número de tentativas de conexão com contas bloqueadas. Adicionado no MySQL 5.7.6.

- `Max_execution_time_exceeded`: Número de instruções que excederam o valor do tempo de execução. Adicionado no MySQL 5.7.8.

- `Max_execution_time_set`: Número de instruções para as quais o tempo de execução foi definido. Adicionado no MySQL 5.7.8.

- `Max_execution_time_set_failed`: Número de instruções para as quais o ajuste do tempo limite de execução falhou. Adicionado no MySQL 5.7.8.

- `Max_statement_time_exceeded`: Número de declarações que excederam o valor do tempo de execução. Adicionado no MySQL 5.7.4.

- `Max_statement_time_set`: Número de instruções para as quais o tempo de espera de execução foi definido. Adicionado no MySQL 5.7.4.

- `Max_statement_time_set_failed`: Número de instruções para as quais o ajuste do tempo de espera de execução falhou. Adicionado no MySQL 5.7.4.

- `Max_used_connections_time`: Tempo em que o `Max_used_connections` atingiu seu valor atual. Adicionado no MySQL 5.7.5.

- `Performance_schema_index_stat_lost`: Número de índices para os quais as estatísticas foram perdidas. Adicionado no MySQL 5.7.6.

- `Performance_schema_memory_classes_lost`: Quantos instrumentos de memória não puderam ser carregados. Adicionado no MySQL 5.7.2.

- `Performance_schema_metadata_lock_lost`: Número de bloqueios de metadados que não puderam ser registrados. Adicionado no MySQL 5.7.3.

- `Performance_schema_nested_statement_lost`: Número de instruções de programa armazenado para as quais as estatísticas foram perdidas. Adicionado no MySQL 5.7.2.

- `Performance_schema_prepared_statements_lost`: Número de declarações preparadas que não puderam ser instrumentadas. Adicionada no MySQL 5.7.4.

- `Performance_schema_program_lost`: Número de programas armazenados para os quais as estatísticas foram perdidas. Adicionado no MySQL 5.7.2.

- `Performance_schema_table_lock_stat_lost`: Número de tabelas para as quais as estatísticas de bloqueio foram perdidas. Adicionada no MySQL 5.7.6.

- `Rewriter_number_loaded_rules`: Número de regras de reescrita carregadas com sucesso na memória. Adicionada no MySQL 5.7.6.

- `Rewriter_number_reloads`: Número de recargas da tabela de regras na memória. Adicionado no MySQL 5.7.6.

- `Rewriter_number_rewritten_queries`: Número de consultas reescritas desde que o plugin foi carregado. Adicionado no MySQL 5.7.6.

- `Rewriter_reload_error`: Se ocorreu um erro ao carregar as regras de reescrita na memória na última vez. Adicionado no MySQL 5.7.6.

- `audit-log`: Se ativar o plugin de log de auditoria. Adicionado no MySQL 5.7.9.

- `audit_log_buffer_size`: Tamanho do buffer do log de auditoria. Adicionada no MySQL 5.7.9.

- `audit_log_compression`: Método de compressão do arquivo de registro de auditoria. Adicionado no MySQL 5.7.21.

- `audit_log_connection_policy`: Política de registro de auditoria para eventos relacionados à conexão. Adicionada no MySQL 5.7.9.

- `audit_log_current_session`: Se deve auditar a sessão atual. Adicionado no MySQL 5.7.9.

- `audit_log_disable`: Se desabilitar o log de auditoria. Adicionado no MySQL 5.7.37.

- `audit_log_encryption`: Método de criptografia do arquivo de registro de auditoria. Adicionado no MySQL 5.7.21.

- `audit_log_exclude_accounts`: Contas que não serão auditadas. Adicionada no MySQL 5.7.9.

- `audit_log_file`: Nome do arquivo de registro de auditoria. Adicionado no MySQL 5.7.9.

- `audit_log_filter_id`: ID do filtro de log de auditoria atual. Adicionado no MySQL 5.7.13.

- `audit_log_flush`: Fechar e reabrir o arquivo de registro de auditoria. Adicionado no MySQL 5.7.9.

- `audit_log_format`: Formato do arquivo de registro de auditoria. Adicionado no MySQL 5.7.9.

- `audit_log_format_unix_timestamp`: Se incluir o timestamp Unix no log de auditoria no formato JSON. Adicionado no MySQL 5.7.35.

- `audit_log_include_accounts`: Contas para auditoria. Adicionada no MySQL 5.7.9.

- `audit_log_policy`: Política de registro de auditoria. Adicionada no MySQL 5.7.9.

- `audit_log_read_buffer_size`: Tamanho do buffer de leitura do arquivo de log de auditoria. Adicionado no MySQL 5.7.21.

- `audit_log_rotate_on_size`: Feche e reabra o arquivo de registro de auditoria neste tamanho. Adicionado no MySQL 5.7.9.

- `audit_log_statement_policy`: Política de registro de auditoria para eventos relacionados a declarações. Adicionada no MySQL 5.7.9.

- `audit_log_strategy`: Estratégia de registro de auditoria. Adicionada no MySQL 5.7.9.

- `authentication_ldap_sasl_auth_method_name`: Nome do método de autenticação. Adicionada no MySQL 5.7.19.

- `authentication_ldap_sasl_bind_base_dn`: Nome distinto da base do servidor LDAP. Adicionada no MySQL 5.7.19.

- `authentication_ldap_sasl_bind_root_dn`: Nome distinto do servidor LDAP raiz. Adicionada no MySQL 5.7.19.

- `authentication_ldap_sasl_bind_root_pwd`: Senha de vinculação do servidor LDAP raiz. Adicionada no MySQL 5.7.19.

- `authentication_ldap_sasl_ca_path`: Nome do arquivo da autoridade de certificação do servidor LDAP. Adicionada no MySQL 5.7.19.

- `authentication_ldap_sasl_group_search_attr`: atributo de pesquisa de grupo do servidor LDAP. Adicionado no MySQL 5.7.19.

- `authentication_ldap_sasl_group_search_filter`: Filtro de pesquisa de grupo personalizado LDAP. Adicionado no MySQL 5.7.21.

- `authentication_ldap_sasl_init_pool_size`: Tamanho do pool de inicialização de conexão do servidor LDAP. Adicionada no MySQL 5.7.19.

- `authentication_ldap_sasl_log_status`: Nível de log do servidor LDAP. Adicionada no MySQL 5.7.19.

- `authentication_ldap_sasl_max_pool_size`: Tamanho máximo do pool de conexões do servidor LDAP. Adicionada no MySQL 5.7.19.

- `authentication_ldap_sasl_server_host`: Nome do host ou endereço IP do servidor LDAP. Adicionada no MySQL 5.7.19.

- `authentication_ldap_sasl_server_port`: Número da porta do servidor LDAP. Adicionada no MySQL 5.7.19.

- `authentication_ldap_sasl_tls`: Se usar conexões criptografadas para o servidor LDAP. Adicionada no MySQL 5.7.19.

- `authentication_ldap_sasl_user_search_attr`: atributo de pesquisa de usuário do servidor LDAP. Adicionado no MySQL 5.7.19.

- `authentication_ldap_simple_auth_method_name`: Nome do método de autenticação. Adicionada no MySQL 5.7.19.

- `authentication_ldap_simple_bind_base_dn`: Nome distinto da base do servidor LDAP. Adicionada no MySQL 5.7.19.

- `authentication_ldap_simple_bind_root_dn`: Nome distinto do servidor LDAP raiz. Adicionada no MySQL 5.7.19.

- `authentication_ldap_simple_bind_root_pwd`: Senha de vinculação do servidor LDAP raiz. Adicionada no MySQL 5.7.19.

- `authentication_ldap_simple_ca_path`: Nome do arquivo da autoridade de certificação do servidor LDAP. Adicionada no MySQL 5.7.19.

- `authentication_ldap_simple_group_search_attr`: atributo de pesquisa de grupo do servidor LDAP. Adicionado no MySQL 5.7.19.

- `authentication_ldap_simple_group_search_filter`: Filtro de pesquisa de grupo personalizado LDAP. Adicionado no MySQL 5.7.21.

- `authentication_ldap_simple_init_pool_size`: Tamanho do pool de conexão inicial do servidor LDAP. Adicionada no MySQL 5.7.19.

- `authentication_ldap_simple_log_status`: Nível de log do servidor LDAP. Adicionada no MySQL 5.7.19.

- `authentication_ldap_simple_max_pool_size`: Tamanho máximo do pool de conexões do servidor LDAP. Adicionada no MySQL 5.7.19.

- `authentication_ldap_simple_server_host`: Nome do host ou endereço IP do servidor LDAP. Adicionada no MySQL 5.7.19.

- `authentication_ldap_simple_server_port`: Número da porta do servidor LDAP. Adicionada no MySQL 5.7.19.

- `authentication_ldap_simple_tls`: Se usar conexões criptografadas para o servidor LDAP. Adicionada no MySQL 5.7.19.

- `authentication_ldap_simple_user_search_attr`: atributo de pesquisa de usuário do servidor LDAP. Adicionado no MySQL 5.7.19.

- `authentication_windows_log_level`: Nível de registro do plugin de autenticação do Windows. Adicionado no MySQL 5.7.9.

- `authentication_windows_use_principal_name`: Se usar o nome do principal do plugin de autenticação do Windows. Adicionado no MySQL 5.7.9.

- `auto_generate_certs`: Se os arquivos de chave e certificado SSL devem ser gerados automaticamente. Adicionado no MySQL 5.7.5.

- `avoid_temporal_upgrade`: Se o ALTER TABLE deve atualizar as colunas temporais anteriores à versão 5.6.4. Adicionada no MySQL 5.7.6.

- `binlog_error_action`: Controla o que acontece quando o servidor não consegue gravar no log binário. Foi adicionado no MySQL 5.7.6.

- `binlog_group_commit_sync_delay`: Define o número de microsegundos para aguardar antes de sincronizar as transações com o disco. Foi adicionado no MySQL 5.7.5.

- `binlog_group_commit_sync_no_delay_count`: Define o número máximo de transações a serem esperadas antes de abortar o atraso atual especificado por binlog_group_commit_sync_delay. Adicionada no MySQL 5.7.5.

- `binlog_gtid_simple_recovery`: Controla a forma como os logs binários são iterados durante a recuperação do GTID. Adicionada no MySQL 5.7.6.

- `binlog_transaction_dependency_history_size`: Número de hashes de linha mantidos para procurar transações que atualizaram a última linha. Adicionado no MySQL 5.7.22.

- `binlog_transaction_dependency_tracking`: Fonte de informações de dependência (marcadores de commit ou conjuntos de escrita de transações) a partir da qual se pode avaliar quais transações podem ser executadas em paralelo pelo aplicativo multithread da replica. Adicionada no MySQL 5.7.22.

- `binlogging_impossible_mode`: Desatualizado e posteriormente removido. Use binlog_error_action em vez disso. Foi adicionado no MySQL 5.7.5.

- `block_encryption_mode`: Modo para algoritmos de criptografia baseados em blocos. Adicionado no MySQL 5.7.4.

- `check_proxy_users`: Se os plugins de autenticação integrados fazem o proxying. Adicionado no MySQL 5.7.7.

- `connection_control_failed_connections_threshold`: Tentativas de conexão falhas consecutivas antes que os atrasos ocorram. Adicionada no MySQL 5.7.17.

- `connection_control_max_connection_delay`: Retardo máximo (em milissegundos) para a resposta do servidor a tentativas de conexão falhas. Adicionado no MySQL 5.7.17.

- `connection_control_min_connection_delay`: Retardo mínimo (em milissegundos) para a resposta do servidor a tentativas de conexão falhas. Adicionado no MySQL 5.7.17.

- `daemonize`: Execute como daemon do System V. Adicionada no MySQL 5.7.6.

- `default_authentication_plugin`: Plugin de autenticação padrão. Adicionado no MySQL 5.7.2.

- `default_password_lifetime`: Idade em dias quando as senhas efetivamente expiram. Adicionada no MySQL 5.7.4.

- `disable-partition-engine-check`: Se desabilitar a verificação de inicialização para tabelas sem particionamento nativo. Adicionado no MySQL 5.7.17.

- `disabled_storage_engines`: Motores de armazenamento que não podem ser usados para criar tabelas. Adicionados no MySQL 5.7.8.

- `disconnect_on_expired_password`: Se o servidor desconectar os clientes com senhas expiradas se os clientes não conseguirem lidar com essas contas. Adicionado no MySQL 5.7.1.

- `early-plugin-load`: Especifique plugins para carregar antes de carregar plugins integrados obrigatórios e antes da inicialização do mecanismo de armazenamento. Adicionado no MySQL 5.7.11.

- `executed_gtids_compression_period`: Renomeado para gtid_executed_compression_period. Adicionado no MySQL 5.7.5.

- `group_replication_allow_local_disjoint_gtids_join`: Permitir que o servidor atual se junte ao grupo mesmo que ele tenha transações ausentes no grupo. Adicionado no MySQL 5.7.17.

- `group_replication_allow_local_lower_version_join`: Permitir que o servidor atual se junte ao grupo mesmo que tenha uma versão de plugin menor que a do grupo. Adicionada no MySQL 5.7.17.

- `group_replication_auto_increment_increment`: Determina o intervalo entre os valores sucessivos da coluna para as transações que executam neste servidor. Adicionada no MySQL 5.7.17.

- `group_replication_bootstrap_group`: Configure este servidor para inicializar o grupo. Adicionado no MySQL 5.7.17.

- `group_replication_components_stop_timeout`: Tempo de espera, em segundos, que o plugin aguarda para cada componente ao desligar. Adicionado no MySQL 5.7.17.

- `group_replication_compression_threshold`: Valor em bytes acima do qual a compressão (LZ4) é aplicada; quando definido como zero, desativa a compressão. Adicionada no MySQL 5.7.17.

- `group_replication_enforce_update_everywhere_checks`: Ative ou desative verificações de consistência rigorosas para atualização de várias fontes em todos os lugares. Adicionada no MySQL 5.7.17.

- `group_replication_exit_state_action`: Como a instância se comporta quando sai do grupo involuntariamente. Adicionada no MySQL 5.7.24.

- `group_replication_flow_control_applier_threshold`: Número de transações em espera na fila de aplicador que desencadeiam o controle de fluxo. Adicionado no MySQL 5.7.17.

- `group_replication_flow_control_certifier_threshold`: Número de transações em espera na fila de certificadores que desencadeiam o controle de fluxo. Adicionado no MySQL 5.7.17.

- `group_replication_flow_control_mode`: Modo usado para controle de fluxo. Adicionado no MySQL 5.7.17.

- `group_replication_force_members`: Lista separada por vírgula de endereços de pares, como host1:port1, host2:port2. Adicionada no MySQL 5.7.17.

- `group_replication_group_name`: Nome do grupo. Adicionada no MySQL 5.7.17.

- `group_replication_group_seeds`: Lista de endereços de pares, lista separada por vírgula, como host1:port1, host2:port2. Adicionada no MySQL 5.7.17.

- `group_replication_gtid_assignment_block_size`: Número de GTIDs consecutivos reservados para cada membro; cada membro consome seus blocos e reserva mais quando necessário. Adicionado no MySQL 5.7.17.

- `group_replication_ip_whitelist`: Lista de hosts permitidos para se conectar ao grupo. Foi adicionado no MySQL 5.7.17.

- `group_replication_local_address`: Endereço local no formato host:port. Adicionado no MySQL 5.7.17.

- `group_replication_member_weight`: Probabilidade de esse membro ser eleito como primário. Adicionada no MySQL 5.7.20.

- `group_replication_poll_spin_loops`: Número de vezes que o thread de comunicação do grupo espera. Adicionado no MySQL 5.7.17.

- `group_replication_recovery_complete_at`: Políticas de recuperação ao lidar com transações em cache após a transferência de estado. Adicionada no MySQL 5.7.17.

- `group_replication_recovery_reconnect_interval`: Tempo de espera, em segundos, entre as tentativas de reconexão quando nenhum dador foi encontrado no grupo. Adicionado no MySQL 5.7.17.

- `group_replication_recovery_retry_count`: Número de vezes que o membro que faz a replicação em grupo tenta se conectar aos doadores disponíveis antes de desistir. Foi adicionado no MySQL 5.7.17.

- `group_replication_recovery_ssl_ca`: Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis. Adicionado no MySQL 5.7.17.

- `group_replication_recovery_ssl_capath`: Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis. Adicionado no MySQL 5.7.17.

- `group_replication_recovery_ssl_cert`: Nome do arquivo de certificado SSL a ser usado para estabelecer uma conexão criptografada. Adicionado no MySQL 5.7.17.

- `group_replication_recovery_ssl_cipher`: Cifres permitidos para criptografia SSL. Adicionada no MySQL 5.7.17.

- `group_replication_recovery_ssl_crl`: Arquivo que contém listas de revogação de certificados. Foi adicionado no MySQL 5.7.17.

- `group_replication_recovery_ssl_crlpath`: Diretório que contém arquivos de lista de revogação de certificados. Foi adicionado no MySQL 5.7.17.

- `group_replication_recovery_ssl_key`: Nome do arquivo de chave SSL a ser usado para estabelecer uma conexão criptografada. Adicionada no MySQL 5.7.17.

- `group_replication_recovery_ssl_verify_server_cert`: Faça com que o processo de recuperação verifique o valor do Nome Comum do servidor no certificado enviado pelo doador. Adicionado no MySQL 5.7.17.

- `group_replication_recovery_use_ssl`: Se a conexão de recuperação da Replicação em Grupo deve usar SSL. Adicionada no MySQL 5.7.17.

- `group_replication_single_primary_mode`: Instrui o grupo a usar um único servidor para a carga de trabalho de leitura/escrita. Adicionado no MySQL 5.7.17.

- `group_replication_ssl_mode`: Estado de segurança desejado da conexão entre os membros da Replicação em Grupo. Adicionado no MySQL 5.7.17.

- `group_replication_start_on_boot`: Se o servidor deve iniciar a Replicação em Grupo durante a inicialização do servidor. Adicionada no MySQL 5.7.17.

- `group_replication_transaction_size_limit`: Define o tamanho máximo da transação em bytes que o grupo aceita. Foi adicionado no MySQL 5.7.19.

- `group_replication_unreachable_majority_timeout`: Quanto tempo esperar por partições de rede que resultem na saída da maioria do grupo. Adicionado no MySQL 5.7.19.

- `gtid_executed_compression_period`: Comprimir a tabela `gtid_executed` a cada vez que ocorrerem tantas transações. 0 significa nunca comprimir essa tabela. Aplica-se apenas quando o registro binário está desativado. Adicionada no MySQL 5.7.6.

- `have_statement_timeout`: Se o tempo limite de execução da declaração está disponível. Adicionado no MySQL 5.7.4.

- `initialize`: Se deve ser executado no modo de inicialização (seguro). Adicionado no MySQL 5.7.6.

- `initialize-insecure`: Se deve executar no modo de inicialização (inseguro). Adicionado no MySQL 5.7.6.

- `innodb_adaptive_hash_index_parts`: Sistema de busca de índice de hash adaptável em n partições, com cada partição protegida por trava separada. Cada índice está vinculado a uma partição específica com base nos atributos ID de espaço e ID de índice. Adicionado no MySQL 5.7.8.

- `innodb_background_drop_list_empty`: Aguarda a criação da tabela até que a lista de eliminação em segundo plano esteja vazia (depuração). Adicionada no MySQL 5.7.10.

- `innodb_buffer_pool_chunk_size`: Tamanho do bloco usado ao redimensionar o pool de buffer. Foi adicionado no MySQL 5.7.5.

- `innodb_buffer_pool_dump_pct`: Porcentagem das páginas mais recentemente usadas para cada pool de buffer para serem salvas e descartadas. Foi adicionado no MySQL 5.7.2.

- `innodb_compress_debug`: Compacta todas as tabelas usando o algoritmo de compactação especificado. Foi adicionado no MySQL 5.7.8.

- `innodb_deadlock_detect`: Habilita ou desabilita a detecção de transtornos de deadlock. Foi adicionado no MySQL 5.7.15.

- `innodb_default_row_format`: Formato padrão de linha para tabelas InnoDB. Adicionada no MySQL 5.7.9.

- `innodb_disable_resize_buffer_pool_debug`: Desabilita o redimensionamento do pool de buffers do InnoDB. Foi adicionado no MySQL 5.7.6.

- `innodb_fill_factor`: Porcentagem do espaço de páginas de folhas e não folhas da árvore B que será preenchida com dados. O espaço restante é reservado para o crescimento futuro. Adicionada no MySQL 5.7.5.

- `innodb_flush_sync`: Ative `innodb_flush_sync` para ignorar as configurações `innodb_io_capacity` e `innodb_io_capacity_max` para picos de atividade de E/S que ocorrem em pontos de verificação. Desative `innodb_flush_sync` para aderir aos limites de atividade de E/S definidos por `innodb_io_capacity` e `innodb_io_capacity_max`. Adicionada no MySQL 5.7.8.

- `innodb_ft_result_cache_limit`: Limite de cache de resultados de consulta de pesquisa FULLTEXT do InnoDB. Adicionado no MySQL 5.7.2.

- `innodb_ft_total_cache_size`: Memória total alocada para o cache do índice de pesquisa FULLTEXT do InnoDB. Adicionada no MySQL 5.7.2.

- `innodb_log_checkpoint_now`: Opção de depuração que obriga o InnoDB a escrever o ponto de verificação. Adicionada no MySQL 5.7.2.

- `innodb_log_checksum_algorithm`: Especifica como gerar e verificar o checksum armazenado em cada bloco de disco do log de recuperação. Adicionado no MySQL 5.7.8.

- `innodb_log_checksums`: Habilita ou desabilita os checksums para as páginas do log de reverso. Adicionada no MySQL 5.7.9.

- `innodb_log_write_ahead_size`: Redimensiona o tamanho do bloco de escrita antecipada do log. Foi adicionado no MySQL 5.7.4.

- `innodb_max_undo_log_size`: Define o limite para o truncamento do log de desfazer do InnoDB. Foi adicionado no MySQL 5.7.5.

- `innodb_merge_threshold_set_all_debug`: Substitui o valor atual de MERGE_THRESHOLD pelo valor especificado para todos os índices que estão atualmente no cache do dicionário. Foi adicionado no MySQL 5.7.6.

- `innodb_numa_interleave`: Habilita a política de memória NUMA MPOL_INTERLEAVE para alocação do pool de buffers do InnoDB. Adicionada no MySQL 5.7.9.

- `innodb_optimize_point_storage`: Ative esta opção para armazenar dados POINT como dados de comprimento fixo em vez de dados de comprimento variável. Adicionada no MySQL 5.7.5.

- `innodb_page_cleaners`: Número de threads de limpadores de página. Adicionado no MySQL 5.7.4.

- `innodb_purge_rseg_truncate_frequency`: Taxa na qual a purga do log de desfazer deve ser invocada como parte da ação de purga. O valor = n invoca a purga do log de desfazer em cada nª iteração da invocação de purga. Adicionada no MySQL 5.7.5.

- `innodb_stats_include_delete_marked`: Incluir registros marcados para exclusão ao calcular estatísticas persistentes do InnoDB. Adicionado no MySQL 5.7.17.

- `innodb_status_output`: Usado para habilitar ou desabilitar a saída periódica para o Monitor padrão InnoDB. Também usado em combinação com `innodb_status_output_locks` para habilitar e desabilitar a saída periódica para o Monitor de Bloqueio InnoDB. Adicionado no MySQL 5.7.4.

- `innodb_status_output_locks`: Usado para habilitar ou desabilitar a saída periódica do Monitor de Bloqueio InnoDB padrão. O `innodb_status_output` também deve ser habilitado para produzir saída periódica do Monitor de Bloqueio InnoDB. Adicionado no MySQL 5.7.4.

- `innodb_sync_debug`: Habilita a verificação de depuração da sincronização do InnoDB. Adicionada no MySQL 5.7.8.

- `innodb_temp_data_file_path`: Caminho para os arquivos de dados do espaço de tabelas temporários e seus tamanhos. Adicionado no MySQL 5.7.1.

- `innodb_tmpdir`: Local de diretório para arquivos de tabela temporários criados durante operações de ALTER TABLE online. Adicionada no MySQL 5.7.11.

- `innodb_undo_log_truncate`: Ative esta opção para marcar o espaço de log de desfazer do InnoDB para truncação. Adicionada no MySQL 5.7.5.

- `internal_tmp_disk_storage_engine`: Motor de armazenamento para tabelas temporárias internas. Adicionado no MySQL 5.7.5.

- `keyring-migration-destination`: Bloco de plug-in de destino de migração de chaveiros. Adicionado no MySQL 5.7.21.

- `keyring-migration-host`: Nome do host para se conectar ao servidor em execução para migração de chaves. Adicionado no MySQL 5.7.21.

- `keyring-migration-password`: Senha para se conectar ao servidor em execução para migração de chaves. Adicionada no MySQL 5.7.21.

- `keyring-migration-port`: Número de porta TCP/IP para conectar-se ao servidor em execução para migração de chaves. Adicionado no MySQL 5.7.21.

- `keyring-migration-socket`: Arquivo de socket Unix ou canal nomeado do Windows para conectar-se ao servidor em execução para migração de chaves. Adicionado no MySQL 5.7.21.

- `keyring-migration-source`: Bloco de plug-in de chave de origem de migração. Adicionado no MySQL 5.7.21.

- `keyring-migration-user`: Nome do usuário para conectar ao servidor em execução para migração de chaves. Adicionado no MySQL 5.7.21.

- `keyring_aws_cmk_id`: ID do chave mestre do cliente do plugin de chave de guarda-chuva da AWS. Adicionada no MySQL 5.7.19.

- `keyring_aws_conf_file`: Local do arquivo de configuração do plugin de chaveira AWS. Adicionada no MySQL 5.7.19.

- `keyring_aws_data_file`: Local de armazenamento do arquivo de plugin do guarda-chave da AWS. Adicionada no MySQL 5.7.19.

- `keyring_aws_region`: região do plugin de chaveira AWS. Adicionada no MySQL 5.7.19.

- `keyring_encrypted_file_data`: arquivo de dados do plugin keyring_encrypted_file. Adicionado no MySQL 5.7.21.

- `keyring_encrypted_file_password`: senha do plugin keyring_encrypted_file. Adicionada no MySQL 5.7.21.

- `keyring_file_data`: arquivo de dados do plugin keyring_file. Adicionado no MySQL 5.7.11.

- `keyring_okv_conf_dir`: diretório de configuração do plugin de chave do Oracle Key Vault. Adicionado no MySQL 5.7.12.

- `keyring_operations`: Se as operações do bloco de chaves estão habilitadas. Adicionado no MySQL 5.7.21.

- `log_backward_compatible_user_definitions`: Se deve registrar as operações CREATE/ALTER USER e GRANT de forma compatível com versões anteriores. Adicionada no MySQL 5.7.6.

- `log_builtin_as_identified_by_password`: Se deve registrar CREATE/ALTER USER, GRANT de forma compatível com versões anteriores. Adicionada no MySQL 5.7.9.

- `log_error_verbosity`: Nível de verbosidade do registro de erros. Adicionada no MySQL 5.7.2.

- `log_slow_admin_statements`: Registre declarações administrativas lentas de OPTIMIZE, ANALYZE, ALTER e outras declarações administrativas no log de consultas lentas se este estiver aberto. Adicionado no MySQL 5.7.1.

- `log_slow_slave_statements`: Faça com que as instruções lentas executadas pela replica sejam escritas no log de consultas lentas. Adicionada no MySQL 5.7.1.

- `log_statements_unsafe_for_binlog`: Desabilita as mensagens de erro 1592 sendo escritas no log de erro. Adicionada no MySQL 5.7.11.

- `log_syslog`: Se deve escrever o log de erro no syslog. Adicionado no MySQL 5.7.5.

- `log_syslog_facility`: Instalação para mensagens syslog. Adicionada no MySQL 5.7.5.

- `log_syslog_include_pid`: Se incluir o PID do servidor nas mensagens do syslog. Adicionado no MySQL 5.7.5.

- `log_syslog_tag`: Marca para o identificador do servidor nas mensagens syslog. Adicionada no MySQL 5.7.5.

- `log_timestamps`: Formato de marcação de tempo do log. Adicionado no MySQL 5.7.2.

- `max_digest_length`: Tamanho máximo do digest em bytes. Adicionado no MySQL 5.7.6.

- `max_execution_time`: Valor de tempo de espera para a execução da declaração. Adicionada no MySQL 5.7.8.

- `max_points_in_geometry`: Número máximo de pontos nos valores de geometria para a estratégia ST_Buffer_. Adicionada no MySQL 5.7.8.

- `max_statement_time`: Valor de tempo de espera para a execução da declaração. Foi adicionado no MySQL 5.7.4.

- `mecab_charset`: Conjunto de caracteres atualmente utilizado pelo plugin de parser de texto completo do MeCab. Adicionado no MySQL 5.7.6.

- `mecab_rc_file`: Caminho para o arquivo de configuração mecabrc do analisador MeCab para pesquisa de texto completo. Adicionado no MySQL 5.7.6.

- `mysql_firewall_mode`: Se o plugin do Firewall do MySQL Enterprise está operacional. Adicionado no MySQL 5.7.9.

- `mysql_firewall_trace`: Se o plugin de firewall do MySQL Enterprise deve ser rastreado. Adicionado no MySQL 5.7.9.

- `mysql_native_password_proxy_users`: Se o plugin de autenticação mysql_native_password faz o proxeamento. Adicionado no MySQL 5.7.7.

- `mysqlx`: Se o Plugin X está inicializado. Adicionado no MySQL 5.7.12.

- `mysqlx_bind_address`: Endereço de rede do X Plugin usado para conexões. Adicionado no MySQL 5.7.17.

- `mysqlx_connect_timeout`: Tempo máximo permitido de espera em segundos para que uma conexão estabeleça uma sessão. Adicionada no MySQL 5.7.12.

- `mysqlx_idle_worker_thread_timeout`: Tempo em segundos após o qual os threads de trabalhadores ociosos são encerrados. Adicionado no MySQL 5.7.12.

- `mysqlx_max_allowed_packet`: Tamanho máximo de pacotes de rede que podem ser recebidos pelo X Plugin. Adicionado no MySQL 5.7.12.

- `mysqlx_max_connections`: Número máximo de conexões de clientes concorrentes que o Plugin X pode aceitar. Adicionado no MySQL 5.7.12.

- `mysqlx_min_worker_threads`: Número mínimo de threads de trabalho usadas para lidar com solicitações de clientes. Adicionada no MySQL 5.7.12.

- `mysqlx_port`: Número de porta no qual o X Plugin aceita conexões TCP/IP. Adicionada no MySQL 5.7.12.

- `mysqlx_port_open_timeout`: Tempo que o X Plugin espera ao aceitar conexões. Foi adicionado no MySQL 5.7.17.

- `mysqlx_socket`: Caminho para o soquete onde o Plugin X escuta as conexões. Foi adicionado no MySQL 5.7.15.

- `mysqlx_ssl_ca`: Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis. Adicionado no MySQL 5.7.12.

- `mysqlx_ssl_capath`: Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis. Adicionado no MySQL 5.7.12.

- `mysqlx_ssl_cert`: Arquivo que contém o certificado X.509. Adicionado no MySQL 5.7.12.

- `mysqlx_ssl_cipher`: Cifras permitidas para criptografia de conexão. Adicionada no MySQL 5.7.12.

- `mysqlx_ssl_crl`: Arquivo que contém listas de revogação de certificados. Foi adicionado no MySQL 5.7.12.

- `mysqlx_ssl_crlpath`: Diretório que contém arquivos de lista de revogação de certificados. Foi adicionado no MySQL 5.7.12.

- `mysqlx_ssl_key`: Arquivo que contém a chave X.509. Adicionada no MySQL 5.7.12.

- `named_pipe_full_access_group`: Nome do grupo do Windows que concede acesso total ao tubo nomeado. Adicionado no MySQL 5.7.25.

- `ngram_token_size`: Define o tamanho do token de n-gramas para o analisador de pesquisa de texto completo. Foi adicionado no MySQL 5.7.6.

- `offline_mode`: Se o servidor está offline. Adicionado no MySQL 5.7.5.

- `parser_max_mem_size`: Quantidade máxima de memória disponível para o analisador. Adicionada no MySQL 5.7.12.

- `performance-schema-consumer-events-transactions-current`: Configure o consumidor de eventos-transações-atual. Adicionado no MySQL 5.7.3.

- `performance-schema-consumer-events-transactions-history`: Configure o consumidor de eventos-transações-história. Adicionado no MySQL 5.7.3.

- `performance-schema-consumer-events-transactions-history-long`: Configure o consumidor de `events-transactions-history-long`. Adicionado no MySQL 5.7.3.

- `performance_schema_events_transactions_history_long_size`: Número de linhas na tabela events_transactions_history_long. Adicionada no MySQL 5.7.3.

- `performance_schema_events_transactions_history_size`: Número de linhas por thread na tabela `events_transactions_history`. Adicionada no MySQL 5.7.3.

- `performance_schema_max_digest_length`: Tamanho máximo do digest do Schema de Desempenho em bytes. Adicionado no MySQL 5.7.8.

- `performance_schema_max_index_stat`: Número máximo de índices para os quais as estatísticas devem ser mantidas. Foi adicionado no MySQL 5.7.6.

- `performance_schema_max_memory_classes`: Número máximo de instrumentos de memória. Adicionado no MySQL 5.7.2.

- `performance_schema_max_metadata_locks`: Número máximo de bloqueios de metadados a serem rastreados. Foi adicionado no MySQL 5.7.3.

- `performance_schema_max_prepared_statements_instances`: Número de linhas na tabela prepared_statements_instances. Adicionada no MySQL 5.7.4.

- `performance_schema_max_program_instances`: Número máximo de programas armazenados para estatísticas. Foi adicionado no MySQL 5.7.2.

- `performance_schema_max_sql_text_length`: Número máximo de bytes armazenados a partir de instruções SQL. Adicionado no MySQL 5.7.6.

- `performance_schema_max_statement_stack`: Nesting máximo de programas armazenados para estatísticas. Adicionado no MySQL 5.7.2.

- `performance_schema_max_table_lock_stat`: Número máximo de tabelas para as quais as estatísticas de bloqueio devem ser mantidas. Foi adicionado no MySQL 5.7.6.

- `performance_schema_show_processlist`: Selecione a implementação SHOW PROCESSLIST. Adicionada no MySQL 5.7.39.

- `range_optimizer_max_mem_size`: Limite para o consumo de memória do otimizador de intervalo. Adicionado no MySQL 5.7.9.

- `rbr_exec_mode`: Permite alternar o servidor entre o modo `IDEMPOTENT` (chave e alguns outros erros suprimidos) e o modo STRICT; o modo STRICT é o padrão. Adicionado no MySQL 5.7.1.

- `replication_optimize_for_static_plugin_config`: Blocos compartilhados para replicação semiesincrônica. Adicionado no MySQL 5.7.33.

- `replication_sender_observe_commit_only`: Chamadas de retorno limitadas para replicação semi-sincronizada. Adicionada no MySQL 5.7.33.

- `require_secure_transport`: Se as conexões do cliente devem usar transporte seguro. Adicionado no MySQL 5.7.8.

- `rewriter_enabled`: Se o plugin de reescrita de consulta está habilitado. Adicionado no MySQL 5.7.6.

- `rewriter_verbose`: Para uso interno. Adicionada no MySQL 5.7.6.

- `rpl_semi_sync_master_wait_for_slave_count`: Número de confirmações de replicação que a fonte deve receber por transação antes de prosseguir. Adicionado no MySQL 5.7.3.

- `rpl_semi_sync_master_wait_point`: Ponto de espera para o reconhecimento da confirmação da transação de replica. Adicionado no MySQL 5.7.2.

- `rpl_stop_slave_timeout`: Número de segundos que o `STOP REPLICA` ou `STOP SLAVE` espera antes de expirar o tempo limite. Adicionado no MySQL 5.7.2.

- `session_track_gtids`: Habilita o rastreador, que pode ser configurado para rastrear diferentes GTIDs. Foi adicionado no MySQL 5.7.6.

- `session_track_schema`: Se deve ou não rastrear alterações no esquema. Adicionado no MySQL 5.7.4.

- `session_track_state_change`: Se deve ou não rastrear as mudanças de estado da sessão. Adicionado no MySQL 5.7.4.

- `session_track_system_variables`: Variáveis de sessão para acompanhar as alterações. Adicionada no MySQL 5.7.4.

- `session_track_transaction_info`: Como realizar o rastreamento de transações. Adicionado no MySQL 5.7.8.

- `sha256_password_auto_generate_rsa_keys`: Se deve gerar arquivos de par de chaves RSA automaticamente. Adicionado no MySQL 5.7.5.

- `sha256_password_proxy_users`: Se o plugin de autenticação sha256_password faz o proxeamento. Adicionado no MySQL 5.7.7.

- `show_compatibility_56`: Compatibilidade para o comando `SHOW STATUS/VARIABLES`. Adicionada no MySQL 5.7.6.

- `show_create_table_verbosity`: Se deve exibir o `ROW_FORMAT` em `SHOW CREATE TABLE`, mesmo que tenha um valor padrão. Adicionado no MySQL 5.7.22.

- `show_old_temporals`: Se `SHOW CREATE TABLE` deve indicar se as colunas temporais pré-5.6.4 estão presentes. Adicionado no MySQL 5.7.6.

- `simplified_binlog_gtid_recovery`: Renomeado para `binlog_gtid_simple_recovery`. Adicionado no MySQL 5.7.5.

- `slave_parallel_type`: Indica ao replica que use informações de data e hora (`CLOCK_LOGICAL`) ou particionamento de banco de dados (DATABASE) para paralelizar as transações. Foi adicionado no MySQL 5.7.2.

- `slave_preserve_commit_order`: Garante que todos os commits dos trabalhadores replicados ocorram na mesma ordem que no banco de origem para manter a consistência ao usar threads de aplicação paralelas. Adicionada no MySQL 5.7.5.

- `super_read_only`: Se ignorar as exceções `SUPER` para o modo de leitura. Adicionado no MySQL 5.7.8.

- `thread_pool_algorithm`: Algoritmo de pool de threads. Adicionado no MySQL 5.7.9.

- `thread_pool_high_priority_connection`: Se a sessão atual é de alta prioridade. Adicionada no MySQL 5.7.9.

- `thread_pool_max_unused_threads`: Número máximo de threads não utilizadas. Foi adicionado no MySQL 5.7.9.

- `thread_pool_prio_kickup_timer`: Quanto tempo antes a declaração é movida para execução de alta prioridade. Adicionada no MySQL 5.7.9.

- `thread_pool_size`: Número de grupos de threads no pool de threads. Adicionada no MySQL 5.7.9.

- `thread_pool_stall_limit`: Quanto tempo antes a declaração é definida como travada. Adicionada no MySQL 5.7.9.

- `tls_version`: Protocolos TLS permitidos para conexões criptografadas. Adicionado no MySQL 5.7.10.

- `transaction_write_set_extraction`: Define o algoritmo usado para hash as escritas extraídas durante a transação. Foi adicionado no MySQL 5.7.6.

- `validate_password_check_user_name`: Se deve verificar as senhas contra o nome do usuário. Adicionada no MySQL 5.7.15.

- `validate_password_dictionary_file_last_parsed`: Quando o arquivo de dicionário foi analisado pela última vez. Adicionado no MySQL 5.7.8.

- `validate_password_dictionary_file_words_count`: Número de palavras no arquivo de dicionário. Adicionada no MySQL 5.7.8.

- `version_tokens_session`: Lista de tokens do cliente para Tokens de Versão. Adicionada no MySQL 5.7.8.

- `version_tokens_session_number`: Para uso interno. Adicionada no MySQL 5.7.8.

### Opções e variáveis descontinuadas no MySQL 5.7

As seguintes variáveis de sistema, variáveis de status e opções foram descontinuadas no MySQL 5.7.

- `Innodb_available_undo_logs`: Número total de segmentos de rollback do InnoDB; diferente de innodb_rollback_segments, que exibe o número de segmentos de rollback ativos. Desatualizado no MySQL 5.7.19.

- `Qcache_free_blocks`: Número de blocos de memória livres no cache de consultas. Desatualizado no MySQL 5.7.20.

- `Qcache_free_memory`: Quantidade de memória livre para o cache de consultas. Desatualizado no MySQL 5.7.20.

- `Qcache_hits`: Número de acertos no cache de consultas. Desatualizado no MySQL 5.7.20.

- `Qcache_inserts`: Número de inserções no cache de consultas. Desatualizado no MySQL 5.7.20.

- `Qcache_lowmem_prunes`: Número de consultas que foram excluídas do cache de consultas devido à falta de memória livre no cache. Desatualizado no MySQL 5.7.20.

- `Qcache_not_cached`: Número de consultas não armazenadas no cache (que não podem ser armazenadas no cache ou não foram armazenadas no cache devido à configuração query_cache_type). Desatualizado no MySQL 5.7.20.

- `Qcache_queries_in_cache`: Número de consultas registradas no cache de consultas. Desatualizado no MySQL 5.7.20.

- `Qcache_total_blocks`: Número total de blocos no cache de consultas. Desatualizado no MySQL 5.7.20.

- `Slave_heartbeat_period`: Intervalo de batida de replicação da réplica, em segundos. Desatualizado no MySQL 5.7.6.

- `Slave_last_heartbeat`: Mostra quando o último sinal de batimento cardíaco foi recebido, no formato TIMESTAMP. Desatualizado no MySQL 5.7.6.

- `Slave_received_heartbeats`: Número de batimentos cardíacos recebidos pela réplica desde o último reinicialização. Desatualizado no MySQL 5.7.6.

- `Slave_retried_transactions`: Número total de vezes desde o início em que o thread de replicação do SQL tentou novamente as transações. Desatualizado no MySQL 5.7.6.

- `Slave_running`: Estado deste servidor como replica (status da thread de I/O de replicação). Desatualizado no MySQL 5.7.6.

- `avoid_temporal_upgrade`: Se o ALTER TABLE deve atualizar as colunas temporais anteriores à versão 5.6.4. Descontinuado no MySQL 5.7.6.

- `binlog_max_flush_queue_time`: Quanto tempo aguardar para ler as transações antes de enviá-las para o log binário. Desatualizado no MySQL 5.7.9.

- `bootstrap`: Usado por scripts de instalação do MySQL. Desatualizado no MySQL 5.7.6.

- `des-key-file`: Carregar chaves para `des_encrypt()` e `des_encrypt` a partir do arquivo fornecido. Desatualizado no MySQL 5.7.6.

- `disable-partition-engine-check`: Se desabilitar a verificação de inicialização para tabelas sem particionamento nativo. Desatualizado no MySQL 5.7.17.

- `group_replication_allow_local_disjoint_gtids_join`: Permitir que o servidor atual se junte ao grupo mesmo que ele tenha transações ausentes no grupo. Desatualizado no MySQL 5.7.21.

- `have_crypt`: Disponibilidade da chamada de sistema crypt(). Desatualizada no MySQL 5.7.6.

- `have_query_cache`: Se o mysqld suporta cache de consultas. Desatualizado no MySQL 5.7.20.

- `ignore-db-dir`: Trate o diretório como um diretório não-banco de dados. Desatualizado no MySQL 5.7.16.

- `ignore_db_dirs`: Diretórios tratados como diretórios não-de-banco de dados. Desatualizado no MySQL 5.7.16.

- `innodb`: Ative o InnoDB (se esta versão do MySQL o suportar). Desatualizado no MySQL 5.7.5.

- `innodb_file_format`: Formato para novas tabelas InnoDB. Desatualizado no MySQL 5.7.7.

- `innodb_file_format_check`: Se o InnoDB realiza a verificação de compatibilidade do formato de arquivo. Desatualizado no MySQL 5.7.7.

- `innodb_file_format_max`: Marca de formato de arquivo no espaço de tabela compartilhado. Desatualizada no MySQL 5.7.7.

- `innodb_large_prefix`: Habilita chaves mais longas para índices de prefixo de coluna. Desatualizado no MySQL 5.7.7.

- `innodb_support_xa`: Habilitar o suporte do InnoDB para o compromisso de dois estágios XA. Desatualizado no MySQL 5.7.10.

- `innodb_undo_logs`: Número de logs de desfazer (segmentos de rollback) usados pelo InnoDB; alias para innodb_rollback_segments. Desatualizado no MySQL 5.7.19.

- `innodb_undo_tablespaces`: Número de arquivos de tablespace para os quais os segmentos de rollback são divididos. Desatualizado no MySQL 5.7.21.

- `log-warnings`: Escreva alguns avisos não críticos no arquivo de log. Desatualizado no MySQL 5.7.2.

- `metadata_locks_cache_size`: Tamanho do cache de bloqueios de metadados. Desatualizado no MySQL 5.7.4.

- `metadata_locks_hash_instances`: Número de hashes de bloqueio de metadados. Desatualizado no MySQL 5.7.4.

- `myisam_repair_threads`: Número de threads a serem usadas durante a reparação de tabelas MyISAM. 1 desabilita a reparação paralela. Desatualizado no MySQL 5.7.38.

- `old_passwords`: Seleciona o método de hashing de senha para `PASSWORD()`. Desatualizado no MySQL 5.7.6.

- `partition`: Habilitar (ou desabilitar) o suporte de particionamento. Desatualizado no MySQL 5.7.16.

- `query_cache_limit`: Não cache resultados maiores que este valor. Desatualizado no MySQL 5.7.20.

- `query_cache_min_res_unit`: Tamanho mínimo da unidade em que o espaço para os resultados é alocado (a última unidade é descartada após a escrita de todos os dados dos resultados). Desatualizado no MySQL 5.7.20.

- `query_cache_size`: Memória alocada para armazenar resultados de consultas antigas. Desatualizado no MySQL 5.7.20.

- `query_cache_type`: Tipo de cache de consulta. Desatualizado no MySQL 5.7.20.

- `query_cache_wlock_invalidate`: Invalidate consultas no cache de consultas com bloqueio para escrita. Desatualizado no MySQL 5.7.20.

- `secure_auth`: Desative a autenticação para contas que tenham senhas antigas (pré-4.1). Desatualizado no MySQL 5.7.5.

- `show_compatibility_56`: Compatibilidade para `SHOW STATUS/VARIABLES`. Desatualizado no MySQL 5.7.6.

- `show_old_temporals`: Se `SHOW CREATE TABLE` deve indicar as colunas temporais anteriores à versão 5.6.4. Desatualizado no MySQL 5.7.6.

- `skip-partition`: Não habilite a partição definida pelo usuário. Desatualizado no MySQL 5.7.16.

- `sync_frm`: Sincronize .frm no disco ao criar. Ativado por padrão. Desatualizado no MySQL 5.7.6.

- `temp-pool`: Ao usar essa opção, a maioria dos arquivos temporários criados usará um conjunto pequeno de nomes, em vez de um nome único para cada novo arquivo. Desatualizado no MySQL 5.7.18.

- `tx_isolation`: Nível de isolamento de transação padrão. Desatualizado no MySQL 5.7.20.

- `tx_read_only`: Modo de acesso padrão para transações. Desatualizado no MySQL 5.7.20.

### Opções e variáveis removidas no MySQL 5.7

As seguintes variáveis de sistema, variáveis de status e opções foram removidas no MySQL 5.7.

- `Com_show_slave_status_nonblocking`: Número de instruções `SHOW REPLICA | SLAVE STATUS NONBLOCKING`. Removido no MySQL 5.7.6.

- `Max_statement_time_exceeded`: Número de declarações que excederam o valor do tempo de execução. Removido no MySQL 5.7.8.

- `Max_statement_time_set`: Número de instruções para as quais o tempo de espera de execução foi definido. Removido no MySQL 5.7.8.

- `Max_statement_time_set_failed`: Número de instruções para as quais o ajuste do tempo de espera de execução falhou. Removido no MySQL 5.7.8.

- `binlogging_impossible_mode`: Desatualizado e posteriormente removido. Use binlog_error_action em vez disso. Removido no MySQL 5.7.6.

- `default-authentication-plugin`: Plugin de autenticação padrão. Removido no MySQL 5.7.2.

- `executed_gtids_compression_period`: Renomeado para `gtid_executed_compression_period`. Removido no MySQL 5.7.6.

- `innodb_additional_mem_pool_size`: Tamanho do pool de memória que o InnoDB usa para armazenar informações do dicionário de dados e outras estruturas de dados internas. Removido no MySQL 5.7.4.

- `innodb_log_checksum_algorithm`: Especifica como gerar e verificar o checksum armazenado em cada bloco de disco do log de recuperação. Removido no MySQL 5.7.9.

- `innodb_optimize_point_storage`: Ative esta opção para armazenar dados POINT como dados de comprimento fixo em vez de dados de comprimento variável. Removido no MySQL 5.7.6.

- `innodb_use_sys_malloc`: Se o InnoDB usa o alocador de memória do sistema operacional ou o seu próprio alocador de memória. Removido no MySQL 5.7.4.

- `log-slow-admin-statements`: Registre as declarações administrativas lentas de OPTIMIZE, ANALYZE, ALTER e outras para atrasar o log de consulta se estiver aberto. Removido no MySQL 5.7.1.

- `log-slow-slave-statements`: Faça com que as declarações lentas executadas pela replica sejam escritas no log de consultas lentas. Removido no MySQL 5.7.1.

- `log_backward_compatible_user_definitions`: Se deve registrar as operações CREATE/ALTER USER e GRANT de forma compatível com versões anteriores. Removido no MySQL 5.7.9.

- `max_statement_time`: Valor de tempo de espera para a execução da declaração. Removido no MySQL 5.7.8.

- `myisam_repair_threads`: Número de threads a serem usadas durante a reparação de tabelas MyISAM. 1 desabilita a reparação paralela. Removido no MySQL 5.7.39.

- `simplified_binlog_gtid_recovery`: Renomeado para `binlog_gtid_simple_recovery`. Removido no MySQL 5.7.6.

- `storage_engine`: Motor de armazenamento padrão. Removido no MySQL 5.7.5.

- `thread_concurrency`: Permite que o aplicativo forneça uma dica ao sistema de threads sobre o número desejado de threads que devem ser executadas de uma vez. Removido no MySQL 5.7.2.

- `timed_mutexes`: Especifique se os mutexes devem ser temporizados (apenas os mutexes do InnoDB são suportados atualmente). Removido no MySQL 5.7.5.
