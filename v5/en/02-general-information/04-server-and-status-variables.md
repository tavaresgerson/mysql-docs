## 1.4 Variáveis, Variáveis de Status e Opções do Servidor Adicionadas, Descontinuadas ou Removidas no MySQL 5.7

Esta seção lista variáveis do servidor, variáveis de status e opções que foram adicionadas pela primeira vez, foram descontinuadas (deprecated) ou foram removidas no MySQL 5.7.

### Opções e Variáveis Introduzidas no MySQL 5.7

As seguintes variáveis de sistema, variáveis de status e opções do servidor foram adicionadas no MySQL 5.7.

* `Audit_log_current_size`: Tamanho atual do arquivo de log de auditoria. Adicionado no MySQL 5.7.9.

* `Audit_log_event_max_drop_size`: Tamanho do maior evento auditado descartado (dropped). Adicionado no MySQL 5.7.9.

* `Audit_log_events`: Número de eventos auditados manipulados. Adicionado no MySQL 5.7.9.

* `Audit_log_events_filtered`: Número de eventos auditados filtrados. Adicionado no MySQL 5.7.9.

* `Audit_log_events_lost`: Número de eventos auditados descartados (dropped). Adicionado no MySQL 5.7.9.

* `Audit_log_events_written`: Número de eventos auditados escritos. Adicionado no MySQL 5.7.9.

* `Audit_log_total_size`: Tamanho combinado de eventos auditados escritos. Adicionado no MySQL 5.7.9.

* `Audit_log_write_waits`: Número de eventos auditados com escrita atrasada (write-delayed). Adicionado no MySQL 5.7.9.

* `Com_change_repl_filter`: Contagem de comandos CHANGE REPLICATION FILTER. Adicionado no MySQL 5.7.3.

* `Com_explain_other`: Contagem de comandos EXPLAIN FOR CONNECTION. Adicionado no MySQL 5.7.2.

* `Com_group_replication_start`: Contagem de comandos START GROUP_REPLICATION. Adicionado no MySQL 5.7.6.

* `Com_group_replication_stop`: Contagem de comandos STOP GROUP_REPLICATION. Adicionado no MySQL 5.7.6.

* `Com_show_create_user`: Contagem de comandos SHOW CREATE USER. Adicionado no MySQL 5.7.6.

* `Com_show_slave_status_nonblocking`: Contagem de comandos SHOW REPLICA | SLAVE STATUS NONBLOCKING. Adicionado no MySQL 5.7.0.

* `Com_shutdown`: Contagem de comandos SHUTDOWN. Adicionado no MySQL 5.7.9.

* `Connection_control_delay_generated`: Quantas vezes o servidor atrasou a requisição de conexão. Adicionado no MySQL 5.7.17.

* `Firewall_access_denied`: Número de statements rejeitados pelo Plugin MySQL Enterprise Firewall. Adicionado no MySQL 5.7.9.

* `Firewall_access_granted`: Número de statements aceitos pelo Plugin MySQL Enterprise Firewall. Adicionado no MySQL 5.7.9.

* `Firewall_cached_entries`: Número de statements registrados pelo Plugin MySQL Enterprise Firewall. Adicionado no MySQL 5.7.9.

* `Innodb_buffer_pool_resize_status`: Status da operação de redimensionamento dinâmico do Buffer Pool. Adicionado no MySQL 5.7.5.

* `Locked_connects`: Número de tentativas de conexão a contas bloqueadas. Adicionado no MySQL 5.7.6.

* `Max_execution_time_exceeded`: Número de statements que excederam o valor de Timeout de execução. Adicionado no MySQL 5.7.8.

* `Max_execution_time_set`: Número de statements para os quais o Timeout de execução foi definido. Adicionado no MySQL 5.7.8.

* `Max_execution_time_set_failed`: Número de statements para os quais a definição do Timeout de execução falhou. Adicionado no MySQL 5.7.8.

* `Max_statement_time_exceeded`: Número de statements que excederam o valor de Timeout de execução. Adicionado no MySQL 5.7.4.

* `Max_statement_time_set`: Número de statements para os quais o Timeout de execução foi definido. Adicionado no MySQL 5.7.4.

* `Max_statement_time_set_failed`: Número de statements para os quais a definição do Timeout de execução falhou. Adicionado no MySQL 5.7.4.

* `Max_used_connections_time`: Tempo em que `Max_used_connections` atingiu seu valor atual. Adicionado no MySQL 5.7.5.

* `Performance_schema_index_stat_lost`: Número de Indexes para os quais as estatísticas foram perdidas. Adicionado no MySQL 5.7.6.

* `Performance_schema_memory_classes_lost`: Quantos instrumentos de memória não puderam ser carregados. Adicionado no MySQL 5.7.2.

* `Performance_schema_metadata_lock_lost`: Número de Locks de Metadata que não puderam ser registrados. Adicionado no MySQL 5.7.3.

* `Performance_schema_nested_statement_lost`: Número de statements de stored program para os quais as estatísticas foram perdidas. Adicionado no MySQL 5.7.2.

* `Performance_schema_prepared_statements_lost`: Número de Prepared Statements que não puderam ser instrumentados. Adicionado no MySQL 5.7.4.

* `Performance_schema_program_lost`: Número de stored programs para os quais as estatísticas foram perdidas. Adicionado no MySQL 5.7.2.

* `Performance_schema_table_lock_stat_lost`: Número de tabelas para as quais as estatísticas de Lock foram perdidas. Adicionado no MySQL 5.7.6.

* `Rewriter_number_loaded_rules`: Número de regras de Rewrite carregadas com sucesso na memória. Adicionado no MySQL 5.7.6.

* `Rewriter_number_reloads`: Número de recarregamentos da tabela de regras na memória. Adicionado no MySQL 5.7.6.

* `Rewriter_number_rewritten_queries`: Número de Queries reescritas desde que o Plugin foi carregado. Adicionado no MySQL 5.7.6.

* `Rewriter_reload_error`: Indica se ocorreu um erro ao carregar as regras de reescrita na memória pela última vez. Adicionado no MySQL 5.7.6.

* `audit-log`: Se deve ativar o Plugin de Audit Log. Adicionado no MySQL 5.7.9.

* `audit_log_buffer_size`: Tamanho do Buffer do Audit Log. Adicionado no MySQL 5.7.9.

* `audit_log_compression`: Método de compressão do arquivo de Audit Log. Adicionado no MySQL 5.7.21.

* `audit_log_connection_policy`: Política de log de auditoria para eventos relacionados à conexão. Adicionado no MySQL 5.7.9.

* `audit_log_current_session`: Se deve auditar a sessão atual. Adicionado no MySQL 5.7.9.

* `audit_log_disable`: Se deve desabilitar o Audit Log. Adicionado no MySQL 5.7.37.

* `audit_log_encryption`: Método de Encryption do arquivo de Audit Log. Adicionado no MySQL 5.7.21.

* `audit_log_exclude_accounts`: Contas a não auditar. Adicionado no MySQL 5.7.9.

* `audit_log_file`: Nome do arquivo de Audit Log. Adicionado no MySQL 5.7.9.

* `audit_log_filter_id`: ID do Filter atual do Audit Log. Adicionado no MySQL 5.7.13.

* `audit_log_flush`: Fecha e reabre o arquivo de Audit Log. Adicionado no MySQL 5.7.9.

* `audit_log_format`: Formato do arquivo de Audit Log. Adicionado no MySQL 5.7.9.

* `audit_log_format_unix_timestamp`: Se deve incluir o Unix Timestamp no Audit Log com formato JSON. Adicionado no MySQL 5.7.35.

* `audit_log_include_accounts`: Contas a auditar. Adicionado no MySQL 5.7.9.

* `audit_log_policy`: Política de log de auditoria. Adicionado no MySQL 5.7.9.

* `audit_log_read_buffer_size`: Tamanho do Buffer de leitura do arquivo de Audit Log. Adicionado no MySQL 5.7.21.

* `audit_log_rotate_on_size`: Fecha e reabre o arquivo de Audit Log neste tamanho. Adicionado no MySQL 5.7.9.

* `audit_log_statement_policy`: Política de log de auditoria para eventos relacionados a statements. Adicionado no MySQL 5.7.9.

* `audit_log_strategy`: Estratégia de log de auditoria. Adicionado no MySQL 5.7.9.

* `authentication_ldap_sasl_auth_method_name`: Nome do método de Authentication. Adicionado no MySQL 5.7.19.

* `authentication_ldap_sasl_bind_base_dn`: Distinguished Name Base do servidor LDAP. Adicionado no MySQL 5.7.19.

* `authentication_ldap_sasl_bind_root_dn`: Distinguished Name Root do servidor LDAP. Adicionado no MySQL 5.7.19.

* `authentication_ldap_sasl_bind_root_pwd`: Senha Root Bind do servidor LDAP. Adicionado no MySQL 5.7.19.

* `authentication_ldap_sasl_ca_path`: Nome do arquivo da Certificate Authority SSL do servidor LDAP. Adicionado no MySQL 5.7.19.

* `authentication_ldap_sasl_group_search_attr`: Atributo de busca de grupo do servidor LDAP. Adicionado no MySQL 5.7.19.

* `authentication_ldap_sasl_group_search_filter`: Filtro de busca de grupo LDAP personalizado. Adicionado no MySQL 5.7.21.

* `authentication_ldap_sasl_init_pool_size`: Tamanho inicial do Pool de conexão do servidor LDAP. Adicionado no MySQL 5.7.19.

* `authentication_ldap_sasl_log_status`: Nível de Log do servidor LDAP. Adicionado no MySQL 5.7.19.

* `authentication_ldap_sasl_max_pool_size`: Tamanho máximo do Pool de conexão do servidor LDAP. Adicionado no MySQL 5.7.19.

* `authentication_ldap_sasl_server_host`: Nome do Host ou endereço IP do servidor LDAP. Adicionado no MySQL 5.7.19.

* `authentication_ldap_sasl_server_port`: Número da Porta do servidor LDAP. Adicionado no MySQL 5.7.19.

* `authentication_ldap_sasl_tls`: Se deve usar conexões criptografadas com o servidor LDAP. Adicionado no MySQL 5.7.19.

* `authentication_ldap_sasl_user_search_attr`: Atributo de busca de usuário do servidor LDAP. Adicionado no MySQL 5.7.19.

* `authentication_ldap_simple_auth_method_name`: Nome do método de Authentication. Adicionado no MySQL 5.7.19.

* `authentication_ldap_simple_bind_base_dn`: Distinguished Name Base do servidor LDAP. Adicionado no MySQL 5.7.19.

* `authentication_ldap_simple_bind_root_dn`: Distinguished Name Root do servidor LDAP. Adicionado no MySQL 5.7.19.

* `authentication_ldap_simple_bind_root_pwd`: Senha Root Bind do servidor LDAP. Adicionado no MySQL 5.7.19.

* `authentication_ldap_simple_ca_path`: Nome do arquivo da Certificate Authority SSL do servidor LDAP. Adicionado no MySQL 5.7.19.

* `authentication_ldap_simple_group_search_attr`: Atributo de busca de grupo do servidor LDAP. Adicionado no MySQL 5.7.19.

* `authentication_ldap_simple_group_search_filter`: Filtro de busca de grupo LDAP personalizado. Adicionado no MySQL 5.7.21.

* `authentication_ldap_simple_init_pool_size`: Tamanho inicial do Pool de conexão do servidor LDAP. Adicionado no MySQL 5.7.19.

* `authentication_ldap_simple_log_status`: Nível de Log do servidor LDAP. Adicionado no MySQL 5.7.19.

* `authentication_ldap_simple_max_pool_size`: Tamanho máximo do Pool de conexão do servidor LDAP. Adicionado no MySQL 5.7.19.

* `authentication_ldap_simple_server_host`: Nome do Host ou endereço IP do servidor LDAP. Adicionado no MySQL 5.7.19.

* `authentication_ldap_simple_server_port`: Número da Porta do servidor LDAP. Adicionado no MySQL 5.7.19.

* `authentication_ldap_simple_tls`: Se deve usar conexões criptografadas com o servidor LDAP. Adicionado no MySQL 5.7.19.

* `authentication_ldap_simple_user_search_attr`: Atributo de busca de usuário do servidor LDAP. Adicionado no MySQL 5.7.19.

* `authentication_windows_log_level`: Nível de Logging do Plugin de Windows Authentication. Adicionado no MySQL 5.7.9.

* `authentication_windows_use_principal_name`: Se deve usar o Principal Name do Plugin de Windows Authentication. Adicionado no MySQL 5.7.9.

* `auto_generate_certs`: Se deve autogerar arquivos de chave e certificado SSL. Adicionado no MySQL 5.7.5.

* `avoid_temporal_upgrade`: Se ALTER TABLE deve atualizar colunas temporais pré-5.6.4. Adicionado no MySQL 5.7.6.

* `binlog_error_action`: Controla o que acontece quando o servidor não pode escrever no Binary Log. Adicionado no MySQL 5.7.6.

* `binlog_group_commit_sync_delay`: Define o número de microssegundos a aguardar antes de sincronizar transactions para o disco. Adicionado no MySQL 5.7.5.

* `binlog_group_commit_sync_no_delay_count`: Define o número máximo de transactions a aguardar antes de abortar o atraso atual especificado por `binlog_group_commit_sync_delay`. Adicionado no MySQL 5.7.5.

* `binlog_gtid_simple_recovery`: Controla como os Binary Logs são iterados durante a recuperação de GTID. Adicionado no MySQL 5.7.6.

* `binlog_transaction_dependency_history_size`: Número de Hashes de linha mantidos para procurar a Transaction que atualizou uma linha pela última vez. Adicionado no MySQL 5.7.22.

* `binlog_transaction_dependency_tracking`: Fonte de informação de dependência (Timestamps de Commit ou Write Sets de Transaction) a partir da qual se avalia quais transactions podem ser executadas em paralelo pelo aplicador multi-threaded da Replica. Adicionado no MySQL 5.7.22.

* `binlogging_impossible_mode`: Descontinuada e posteriormente removida. Use `binlog_error_action` em vez disso. Adicionado no MySQL 5.7.5.

* `block_encryption_mode`: Modo para algoritmos de Encryption baseados em bloco. Adicionado no MySQL 5.7.4.

* `check_proxy_users`: Se Plugins de Authentication embutidos realizam Proxying. Adicionado no MySQL 5.7.7.

* `connection_control_failed_connections_threshold`: Tentativas consecutivas de conexão falhadas antes que os atrasos ocorram. Adicionado no MySQL 5.7.17.

* `connection_control_max_connection_delay`: Atraso máximo (em milissegundos) para a resposta do servidor a tentativas de conexão falhadas. Adicionado no MySQL 5.7.17.

* `connection_control_min_connection_delay`: Atraso mínimo (em milissegundos) para a resposta do servidor a tentativas de conexão falhadas. Adicionado no MySQL 5.7.17.

* `daemonize`: Executa como um Daemon System V. Adicionado no MySQL 5.7.6.

* `default_authentication_plugin`: Plugin de Authentication padrão. Adicionado no MySQL 5.7.2.

* `default_password_lifetime`: Idade em dias em que as senhas efetivamente expiram. Adicionado no MySQL 5.7.4.

* `disable-partition-engine-check`: Se deve desabilitar a verificação de inicialização para tabelas sem particionamento nativo. Adicionado no MySQL 5.7.17.

* `disabled_storage_engines`: Storage Engines que não podem ser usados para criar tabelas. Adicionado no MySQL 5.7.8.

* `disconnect_on_expired_password`: Se o servidor desconecta clientes com senhas expiradas caso os clientes não consigam lidar com tais contas. Adicionado no MySQL 5.7.1.

* `early-plugin-load`: Especifica Plugins a serem carregados antes de carregar Plugins embutidos obrigatórios e antes da inicialização do Storage Engine. Adicionado no MySQL 5.7.11.

* `executed_gtids_compression_period`: Renomeada para `gtid_executed_compression_period`. Adicionado no MySQL 5.7.5.

* `group_replication_allow_local_disjoint_gtids_join`: Permite que o servidor atual se junte ao Group, mesmo que tenha transactions não presentes no Group. Adicionado no MySQL 5.7.17.

* `group_replication_allow_local_lower_version_join`: Permite que o servidor atual se junte ao Group, mesmo que tenha uma versão de Plugin inferior à do Group. Adicionado no MySQL 5.7.17.

* `group_replication_auto_increment_increment`: Determina o intervalo entre valores de coluna sucessivos para transactions executadas neste servidor. Adicionado no MySQL 5.7.17.

* `group_replication_bootstrap_group`: Configura este servidor para inicializar (bootstrap) o Group. Adicionado no MySQL 5.7.17.

* `group_replication_components_stop_timeout`: Timeout, em segundos, que o Plugin aguarda por cada componente ao desligar. Adicionado no MySQL 5.7.17.

* `group_replication_compression_threshold`: Valor em bytes acima do qual a compressão (LZ4) é aplicada; quando definido como zero, desativa a compressão. Adicionado no MySQL 5.7.17.

* `group_replication_enforce_update_everywhere_checks`: Habilita ou desabilita verificações rigorosas de consistência para atualização multi-source em todos os lugares. Adicionado no MySQL 5.7.17.

* `group_replication_exit_state_action`: Como a instância se comporta quando sai involuntariamente do Group. Adicionado no MySQL 5.7.24.

* `group_replication_flow_control_applier_threshold`: Número de transactions esperando na fila do Applier que acionam o Flow Control. Adicionado no MySQL 5.7.17.

* `group_replication_flow_control_certifier_threshold`: Número de transactions esperando na fila do Certifier que acionam o Flow Control. Adicionado no MySQL 5.7.17.

* `group_replication_flow_control_mode`: Modo usado para Flow Control. Adicionado no MySQL 5.7.17.

* `group_replication_force_members`: Lista de endereços de pares separados por vírgula, como host1:port1,host2:port2. Adicionado no MySQL 5.7.17.

* `group_replication_group_name`: Nome do Group. Adicionado no MySQL 5.7.17.

* `group_replication_group_seeds`: Lista de endereços de pares, lista separada por vírgula, como host1:port1,host2:port2. Adicionado no MySQL 5.7.17.

* `group_replication_gtid_assignment_block_size`: Número de GTIDs consecutivos que são reservados para cada membro; cada membro consome seus blocos e reserva mais quando necessário. Adicionado no MySQL 5.7.17.

* `group_replication_ip_whitelist`: Lista de Hosts permitidos para conectar-se ao Group. Adicionado no MySQL 5.7.17.

* `group_replication_local_address`: Endereço local no formato Host:Port. Adicionado no MySQL 5.7.17.

* `group_replication_member_weight`: Chance deste membro ser eleito como Primary. Adicionado no MySQL 5.7.20.

* `group_replication_poll_spin_loops`: Número de vezes que a Thread de comunicação do Group aguarda. Adicionado no MySQL 5.7.17.

* `group_replication_recovery_complete_at`: Políticas de Recovery ao lidar com transactions em cache após a transferência de estado. Adicionado no MySQL 5.7.17.

* `group_replication_recovery_reconnect_interval`: Tempo de Sleep, em segundos, entre as tentativas de reconexão quando nenhum Donor foi encontrado no Group. Adicionado no MySQL 5.7.17.

* `group_replication_recovery_retry_count`: Número de vezes que o membro que está se juntando tenta conectar-se a Donors disponíveis antes de desistir. Adicionado no MySQL 5.7.17.

* `group_replication_recovery_ssl_ca`: Arquivo que contém a lista de Certificate Authorities SSL confiáveis. Adicionado no MySQL 5.7.17.

* `group_replication_recovery_ssl_capath`: Diretório que contém os arquivos de certificado da Certificate Authority SSL confiável. Adicionado no MySQL 5.7.17.

* `group_replication_recovery_ssl_cert`: Nome do arquivo de certificado SSL a ser usado para estabelecer a conexão criptografada. Adicionado no MySQL 5.7.17.

* `group_replication_recovery_ssl_cipher`: Cifras permissíveis para Encryption SSL. Adicionado no MySQL 5.7.17.

* `group_replication_recovery_ssl_crl`: Arquivo que contém as listas de revogação de certificado. Adicionado no MySQL 5.7.17.

* `group_replication_recovery_ssl_crlpath`: Diretório que contém os arquivos de lista de revogação de certificado. Adicionado no MySQL 5.7.17.

* `group_replication_recovery_ssl_key`: Nome do arquivo de chave SSL a ser usado para estabelecer a conexão criptografada. Adicionado no MySQL 5.7.17.

* `group_replication_recovery_ssl_verify_server_cert`: Faz com que o processo de Recovery verifique o valor do Common Name do servidor no certificado enviado pelo Donor. Adicionado no MySQL 5.7.17.

* `group_replication_recovery_use_ssl`: Se a conexão de Recovery do Group Replication deve usar SSL. Adicionado no MySQL 5.7.17.

* `group_replication_single_primary_mode`: Instruiu o Group a usar um único servidor para cargas de trabalho de leitura/escrita (Read/Write). Adicionado no MySQL 5.7.17.

* `group_replication_ssl_mode`: Estado de segurança desejado da conexão entre os membros do Group Replication. Adicionado no MySQL 5.7.17.

* `group_replication_start_on_boot`: Se o servidor deve iniciar o Group Replication durante a inicialização do servidor. Adicionado no MySQL 5.7.17.

* `group_replication_transaction_size_limit`: Define o tamanho máximo da Transaction em bytes que o Group aceita. Adicionado no MySQL 5.7.19.

* `group_replication_unreachable_majority_timeout`: Quanto tempo esperar por partições de rede que resultam na minoria deixando o Group. Adicionado no MySQL 5.7.19.

* `gtid_executed_compression_period`: Compacta a tabela `gtid_executed` cada vez que este número de transactions tiver ocorrido. 0 significa nunca compactar esta tabela. Aplica-se apenas quando o Binary Logging está desabilitado. Adicionado no MySQL 5.7.6.

* `have_statement_timeout`: Se o Timeout de execução de statement está disponível. Adicionado no MySQL 5.7.4.

* `initialize`: Se deve ser executado no modo de initialization (seguro). Adicionado no MySQL 5.7.6.

* `initialize-insecure`: Se deve ser executado no modo de initialization (inseguro). Adicionado no MySQL 5.7.6.

* `innodb_adaptive_hash_index_parts`: Particiona o sistema de busca de Adaptive Hash Index em n partições, com cada partição protegida por um Latch separado. Cada Index está vinculado à partição específica com base nos atributos de ID de espaço e ID de Index. Adicionado no MySQL 5.7.8.

* `innodb_background_drop_list_empty`: Atrasos na criação de tabelas até que a lista de Drop em Background esteja vazia (debug). Adicionado no MySQL 5.7.10.

* `innodb_buffer_pool_chunk_size`: Tamanho do Chunk usado ao redimensionar o Buffer Pool. Adicionado no MySQL 5.7.5.

* `innodb_buffer_pool_dump_pct`: Porcentagem das páginas usadas mais recentemente para cada Buffer Pool a serem lidas e despejadas (dump). Adicionado no MySQL 5.7.2.

* `innodb_compress_debug`: Compacta todas as tabelas usando o algoritmo de compressão especificado. Adicionado no MySQL 5.7.8.

* `innodb_deadlock_detect`: Habilita ou desabilita a detecção de Deadlock. Adicionado no MySQL 5.7.15.

* `innodb_default_row_format`: Row Format padrão para tabelas InnoDB. Adicionado no MySQL 5.7.9.

* `innodb_disable_resize_buffer_pool_debug`: Desabilita o redimensionamento do Buffer Pool do InnoDB. Adicionado no MySQL 5.7.6.

* `innodb_fill_factor`: Porcentagem de espaço da página folha e não folha da B-tree a ser preenchida com dados. O espaço restante é reservado para crescimento futuro. Adicionado no MySQL 5.7.5.

* `innodb_flush_sync`: Habilita `innodb_flush_sync` para ignorar as configurações `innodb_io_capacity` e `innodb_io_capacity_max` para picos de atividade de I/O que ocorrem nos Checkpoints. Desabilita `innodb_flush_sync` para aderir aos limites de atividade de I/O conforme definido por `innodb_io_capacity` e `innodb_io_capacity_max`. Adicionado no MySQL 5.7.8.

* `innodb_ft_result_cache_limit`: Limite do Cache de resultados de Query de busca FULLTEXT do InnoDB. Adicionado no MySQL 5.7.2.

* `innodb_ft_total_cache_size`: Memória total alocada para o Cache de Index de busca FULLTEXT do InnoDB. Adicionado no MySQL 5.7.2.

* `innodb_log_checkpoint_now`: Opção de Debug que força o InnoDB a escrever um Checkpoint. Adicionado no MySQL 5.7.2.

* `innodb_log_checksum_algorithm`: Especifica como gerar e verificar o Checksum armazenado em cada bloco de disco do Redo Log. Adicionado no MySQL 5.7.8.

* `innodb_log_checksums`: Habilita ou desabilita Checksums para páginas de Redo Log. Adicionado no MySQL 5.7.9.

* `innodb_log_write_ahead_size`: Tamanho do bloco Write-Ahead do Redo Log. Adicionado no MySQL 5.7.4.

* `innodb_max_undo_log_size`: Define o limite para truncar o Undo Log do InnoDB. Adicionado no MySQL 5.7.5.

* `innodb_merge_threshold_set_all_debug`: Sobrescreve a configuração MERGE_THRESHOLD atual com o valor especificado para todos os Indexes que estão atualmente no Dictionary Cache. Adicionado no MySQL 5.7.6.

* `innodb_numa_interleave`: Habilita a política de memória NUMA MPOL_INTERLEAVE para alocação do Buffer Pool do InnoDB. Adicionado no MySQL 5.7.9.

* `innodb_optimize_point_storage`: Habilita esta opção para armazenar dados POINT como dados de comprimento fixo (fixed-length) em vez de dados de comprimento variável (variable-length). Adicionado no MySQL 5.7.5.

* `innodb_page_cleaners`: Número de Threads de Page Cleaner. Adicionado no MySQL 5.7.4.

* `innodb_purge_rseg_truncate_frequency`: Taxa na qual o Purge do Undo Log deve ser invocado como parte da ação de Purge. Valor = n invoca o Purge do Undo Log a cada n-ésima iteração da invocação de Purge. Adicionado no MySQL 5.7.5.

* `innodb_stats_include_delete_marked`: Inclui registros marcados para exclusão ao calcular estatísticas persistentes do InnoDB. Adicionado no MySQL 5.7.17.

* `innodb_status_output`: Usado para habilitar ou desabilitar a saída periódica para o Monitor InnoDB padrão. Também usado em combinação com `innodb_status_output_locks` para habilitar e desabilitar a saída periódica para o Monitor de Lock do InnoDB. Adicionado no MySQL 5.7.4.

* `innodb_status_output_locks`: Usado para habilitar ou desabilitar a saída periódica para o Monitor de Lock do InnoDB padrão. `innodb_status_output` também deve estar habilitado para produzir a saída periódica para o Monitor de Lock do InnoDB. Adicionado no MySQL 5.7.4.

* `innodb_sync_debug`: Habilita a verificação de Debug de Sync do InnoDB. Adicionado no MySQL 5.7.8.

* `innodb_temp_data_file_path`: Caminho para arquivos de dados de tablespace temporário e seus tamanhos. Adicionado no MySQL 5.7.1.

* `innodb_tmpdir`: Localização do diretório para arquivos de tabelas temporárias criados durante operações online de ALTER TABLE. Adicionado no MySQL 5.7.11.

* `innodb_undo_log_truncate`: Habilita esta opção para marcar o tablespace de Undo do InnoDB para truncamento. Adicionado no MySQL 5.7.5.

* `internal_tmp_disk_storage_engine`: Storage Engine para tabelas temporárias internas. Adicionado no MySQL 5.7.5.

* `keyring-migration-destination`: Plugin Keyring de destino da migração de chave. Adicionado no MySQL 5.7.21.

* `keyring-migration-host`: Nome do Host para conectar-se ao servidor em execução para migração de chave. Adicionado no MySQL 5.7.21.

* `keyring-migration-password`: Senha para conectar-se ao servidor em execução para migração de chave. Adicionado no MySQL 5.7.21.

* `keyring-migration-port`: Número da porta TCP/IP para conectar-se ao servidor em execução para migração de chave. Adicionado no MySQL 5.7.21.

* `keyring-migration-socket`: Arquivo de Unix Socket ou Named Pipe do Windows para conectar-se ao servidor em execução para migração de chave. Adicionado no MySQL 5.7.21.

* `keyring-migration-source`: Plugin Keyring de origem da migração de chave. Adicionado no MySQL 5.7.21.

* `keyring-migration-user`: Nome de usuário para conectar-se ao servidor em execução para migração de chave. Adicionado no MySQL 5.7.21.

* `keyring_aws_cmk_id`: Valor do Customer Master Key ID do Plugin AWS Keyring. Adicionado no MySQL 5.7.19.

* `keyring_aws_conf_file`: Localização do arquivo de configuração do Plugin AWS Keyring. Adicionado no MySQL 5.7.19.

* `keyring_aws_data_file`: Localização do arquivo de Storage do Plugin AWS Keyring. Adicionado no MySQL 5.7.19.

* `keyring_aws_region`: Região do Plugin AWS Keyring. Adicionado no MySQL 5.7.19.

* `keyring_encrypted_file_data`: Arquivo de dados do Plugin `keyring_encrypted_file`. Adicionado no MySQL 5.7.21.

* `keyring_encrypted_file_password`: Senha do Plugin `keyring_encrypted_file`. Adicionado no MySQL 5.7.21.

* `keyring_file_data`: Arquivo de dados do Plugin `keyring_file`. Adicionado no MySQL 5.7.11.

* `keyring_okv_conf_dir`: Diretório de configuração do Plugin Oracle Key Vault Keyring. Adicionado no MySQL 5.7.12.

* `keyring_operations`: Se as operações de Keyring estão habilitadas. Adicionado no MySQL 5.7.21.

* `log_backward_compatible_user_definitions`: Se deve registrar CREATE/ALTER USER, GRANT de forma compatível com versões anteriores. Adicionado no MySQL 5.7.6.

* `log_builtin_as_identified_by_password`: Se deve registrar CREATE/ALTER USER, GRANT de forma compatível com versões anteriores. Adicionado no MySQL 5.7.9.

* `log_error_verbosity`: Nível de verbosidade do Log de erro. Adicionado no MySQL 5.7.2.

* `log_slow_admin_statements`: Registra statements lentos de OPTIMIZE, ANALYZE, ALTER e outros statements administrativos no Slow Query Log, se estiver aberto. Adicionado no MySQL 5.7.1.

* `log_slow_slave_statements`: Causa o registro de statements lentos executados pela Replica no Slow Query Log. Adicionado no MySQL 5.7.1.

* `log_statements_unsafe_for_binlog`: Desabilita os Warnings de erro 1592 sendo escritos no Error Log. Adicionado no MySQL 5.7.11.

* `log_syslog`: Se deve escrever o Error Log para o Syslog. Adicionado no MySQL 5.7.5.

* `log_syslog_facility`: Facility para mensagens Syslog. Adicionado no MySQL 5.7.5.

* `log_syslog_include_pid`: Se deve incluir o PID do servidor nas mensagens Syslog. Adicionado no MySQL 5.7.5.

* `log_syslog_tag`: Tag para o identificador do servidor nas mensagens Syslog. Adicionado no MySQL 5.7.5.

* `log_timestamps`: Formato de Timestamp de Log. Adicionado no MySQL 5.7.2.

* `max_digest_length`: Tamanho máximo do Digest em bytes. Adicionado no MySQL 5.7.6.

* `max_execution_time`: Valor de Timeout de execução de statement. Adicionado no MySQL 5.7.8.

* `max_points_in_geometry`: Número máximo de pontos em valores Geometry para ST_Buffer_Strategy(). Adicionado no MySQL 5.7.8.

* `max_statement_time`: Valor de Timeout de execução de statement. Adicionado no MySQL 5.7.4.

* `mecab_charset`: Character Set atualmente usado pelo Plugin de parser FULL-TEXT MeCab. Adicionado no MySQL 5.7.6.

* `mecab_rc_file`: Caminho para o arquivo de configuração `mecabrc` para o parser MeCab para busca FULL-TEXT. Adicionado no MySQL 5.7.6.

* `mysql_firewall_mode`: Se o Plugin MySQL Enterprise Firewall está operacional. Adicionado no MySQL 5.7.9.

* `mysql_firewall_trace`: Se deve habilitar o Trace do Plugin MySQL Enterprise Firewall. Adicionado no MySQL 5.7.9.

* `mysql_native_password_proxy_users`: Se o Plugin de Authentication `mysql_native_password` realiza Proxying. Adicionado no MySQL 5.7.7.

* `mysqlx`: Se o X Plugin está inicializado. Adicionado no MySQL 5.7.12.

* `mysqlx_bind_address`: Endereço de rede que o X Plugin usa para conexões. Adicionado no MySQL 5.7.17.

* `mysqlx_connect_timeout`: Tempo máximo de espera permitido em segundos para uma conexão configurar uma sessão. Adicionado no MySQL 5.7.12.

* `mysqlx_idle_worker_thread_timeout`: Tempo em segundos após o qual as Worker Threads ociosas são encerradas. Adicionado no MySQL 5.7.12.

* `mysqlx_max_allowed_packet`: Tamanho máximo dos pacotes de rede que podem ser recebidos pelo X Plugin. Adicionado no MySQL 5.7.12.

* `mysqlx_max_connections`: Número máximo de conexões de cliente simultâneas que o X Plugin pode aceitar. Adicionado no MySQL 5.7.12.

* `mysqlx_min_worker_threads`: Número mínimo de Worker Threads usadas para lidar com requisições de clientes. Adicionado no MySQL 5.7.12.

* `mysqlx_port`: Número da Porta na qual o X Plugin aceita conexões TCP/IP. Adicionado no MySQL 5.7.12.

* `mysqlx_port_open_timeout`: Tempo que o X Plugin aguarda ao aceitar conexões. Adicionado no MySQL 5.7.17.

* `mysqlx_socket`: Caminho para o Socket onde o X Plugin escuta por conexões. Adicionado no MySQL 5.7.15.

* `mysqlx_ssl_ca`: Arquivo que contém a lista de Certificate Authorities SSL confiáveis. Adicionado no MySQL 5.7.12.

* `mysqlx_ssl_capath`: Diretório que contém os arquivos de certificado da Certificate Authority SSL confiável. Adicionado no MySQL 5.7.12.

* `mysqlx_ssl_cert`: Arquivo que contém o certificado X.509. Adicionado no MySQL 5.7.12.

* `mysqlx_ssl_cipher`: Cifras permissíveis para Encryption de conexão. Adicionado no MySQL 5.7.12.

* `mysqlx_ssl_crl`: Arquivo que contém listas de revogação de certificado. Adicionado no MySQL 5.7.12.

* `mysqlx_ssl_crlpath`: Diretório que contém os arquivos de lista de revogação de certificado. Adicionado no MySQL 5.7.12.

* `mysqlx_ssl_key`: Arquivo que contém a chave X.509. Adicionado no MySQL 5.7.12.

* `named_pipe_full_access_group`: Nome do grupo Windows com acesso total concedido ao Named Pipe. Adicionado no MySQL 5.7.25.

* `ngram_token_size`: Define o tamanho do Token N-gram para o parser N-gram de busca FULL-TEXT. Adicionado no MySQL 5.7.6.

* `offline_mode`: Se o servidor está offline. Adicionado no MySQL 5.7.5.

* `parser_max_mem_size`: Quantidade máxima de memória disponível para o Parser. Adicionado no MySQL 5.7.12.

* `performance-schema-consumer-events-transactions-current`: Configura o Consumer `events-transactions-current`. Adicionado no MySQL 5.7.3.

* `performance-schema-consumer-events-transactions-history`: Configura o Consumer `events-transactions-history`. Adicionado no MySQL 5.7.3.

* `performance-schema-consumer-events-transactions-history-long`: Configura o Consumer `events-transactions-history-long`. Adicionado no MySQL 5.7.3.

* `performance_schema_events_transactions_history_long_size`: Número de linhas na tabela `events_transactions_history_long`. Adicionado no MySQL 5.7.3.

* `performance_schema_events_transactions_history_size`: Número de linhas por Thread na tabela `events_transactions_history`. Adicionado no MySQL 5.7.3.

* `performance_schema_max_digest_length`: Tamanho máximo do Digest do Performance Schema em bytes. Adicionado no MySQL 5.7.8.

* `performance_schema_max_index_stat`: Número máximo de Indexes para os quais manter estatísticas. Adicionado no MySQL 5.7.6.

* `performance_schema_max_memory_classes`: Número máximo de instrumentos de memória. Adicionado no MySQL 5.7.2.

* `performance_schema_max_metadata_locks`: Número máximo de Locks de Metadata a serem rastreados. Adicionado no MySQL 5.7.3.

* `performance_schema_max_prepared_statements_instances`: Número de linhas na tabela `prepared_statements_instances`. Adicionado no MySQL 5.7.4.

* `performance_schema_max_program_instances`: Número máximo de Stored Programs para estatísticas. Adicionado no MySQL 5.7.2.

* `performance_schema_max_sql_text_length`: Número máximo de bytes armazenados de statements SQL. Adicionado no MySQL 5.7.6.

* `performance_schema_max_statement_stack`: Aninhamento máximo de Stored Program para estatísticas. Adicionado no MySQL 5.7.2.

* `performance_schema_max_table_lock_stat`: Número máximo de tabelas para as quais manter estatísticas de Lock. Adicionado no MySQL 5.7.6.

* `performance_schema_show_processlist`: Seleciona a implementação de SHOW PROCESSLIST. Adicionado no MySQL 5.7.39.

* `range_optimizer_max_mem_size`: Limite de consumo de memória do Range Optimizer. Adicionado no MySQL 5.7.9.

* `rbr_exec_mode`: Permite alternar o servidor entre o modo IDEMPOTENT (erros de chave e alguns outros suprimidos) e o modo STRICT; o modo STRICT é o padrão. Adicionado no MySQL 5.7.1.

* `replication_optimize_for_static_plugin_config`: Shared Locks para replicação semi-síncrona. Adicionado no MySQL 5.7.33.

* `replication_sender_observe_commit_only`: Callbacks limitados para replicação semi-síncrona. Adicionado no MySQL 5.7.33.

* `require_secure_transport`: Se as conexões do cliente devem usar transporte seguro. Adicionado no MySQL 5.7.8.

* `rewriter_enabled`: Se o Plugin de Query Rewrite está habilitado. Adicionado no MySQL 5.7.6.

* `rewriter_verbose`: Para uso interno. Adicionado no MySQL 5.7.6.

* `rpl_semi_sync_master_wait_for_slave_count`: Número de acknowledgments da Replica que o Source deve receber por Transaction antes de prosseguir. Adicionado no MySQL 5.7.3.

* `rpl_semi_sync_master_wait_point`: Ponto de espera para o acknowledgment de recebimento de Transaction da Replica. Adicionado no MySQL 5.7.2.

* `rpl_stop_slave_timeout`: Número de segundos que STOP REPLICA ou STOP SLAVE aguarda antes de atingir o Timeout. Adicionado no MySQL 5.7.2.

* `session_track_gtids`: Habilita o Tracker que pode ser configurado para rastrear GTIDs diferentes. Adicionado no MySQL 5.7.6.

* `session_track_schema`: Se deve rastrear alterações de Schema. Adicionado no MySQL 5.7.4.

* `session_track_state_change`: Se deve rastrear alterações de estado da sessão. Adicionado no MySQL 5.7.4.

* `session_track_system_variables`: Variáveis de sessão para rastrear alterações. Adicionado no MySQL 5.7.4.

* `session_track_transaction_info`: Como realizar o rastreamento de Transaction. Adicionado no MySQL 5.7.8.

* `sha256_password_auto_generate_rsa_keys`: Se deve gerar pares de chave RSA automaticamente. Adicionado no MySQL 5.7.5.

* `sha256_password_proxy_users`: Se o Plugin de Authentication `sha256_password` realiza Proxying. Adicionado no MySQL 5.7.7.

* `show_compatibility_56`: Compatibilidade para SHOW STATUS/VARIABLES. Adicionado no MySQL 5.7.6.

* `show_create_table_verbosity`: Se deve exibir ROW_FORMAT em SHOW CREATE TABLE, mesmo que tenha o valor padrão. Adicionado no MySQL 5.7.22.

* `show_old_temporals`: Se SHOW CREATE TABLE deve indicar colunas temporais pré-5.6.4. Adicionado no MySQL 5.7.6.

* `simplified_binlog_gtid_recovery`: Renomeada para `binlog_gtid_simple_recovery`. Adicionado no MySQL 5.7.5.

* `slave_parallel_type`: Indica à Replica para usar informações de Timestamp (LOGICAL_CLOCK) ou particionamento de Database (DATABASE) para paralelizar transactions. Adicionado no MySQL 5.7.2.

* `slave_preserve_commit_order`: Garante que todos os Commits pelos Workers da Replica ocorram na mesma ordem que no Source para manter a consistência ao usar Threads de Applier paralelos. Adicionado no MySQL 5.7.5.

* `super_read_only`: Se deve ignorar exceções SUPER para o modo Read-Only. Adicionado no MySQL 5.7.8.

* `thread_pool_algorithm`: Algoritmo do Thread Pool. Adicionado no MySQL 5.7.9.

* `thread_pool_high_priority_connection`: Se a sessão atual é de alta prioridade. Adicionado no MySQL 5.7.9.

* `thread_pool_max_unused_threads`: Número máximo permitido de Threads não utilizadas. Adicionado no MySQL 5.7.9.

* `thread_pool_prio_kickup_timer`: Quanto tempo antes que o statement seja movido para execução de alta prioridade. Adicionado no MySQL 5.7.9.

* `thread_pool_size`: Número de grupos de Thread no Thread Pool. Adicionado no MySQL 5.7.9.

* `thread_pool_stall_limit`: Quanto tempo antes que o statement seja definido como paralisado (stalled). Adicionado no MySQL 5.7.9.

* `tls_version`: Protocolos TLS permissíveis para conexões criptografadas. Adicionado no MySQL 5.7.10.

* `transaction_write_set_extraction`: Define o algoritmo usado para fazer o Hash das gravações (writes) extraídas durante a Transaction. Adicionado no MySQL 5.7.6.

* `validate_password_check_user_name`: Se deve verificar senhas em relação ao nome de usuário. Adicionado no MySQL 5.7.15.

* `validate_password_dictionary_file_last_parsed`: Quando o arquivo de dicionário foi analisado pela última vez. Adicionado no MySQL 5.7.8.

* `validate_password_dictionary_file_words_count`: Número de palavras no arquivo de dicionário. Adicionado no MySQL 5.7.8.

* `version_tokens_session`: Lista de Tokens do cliente para Version Tokens. Adicionado no MySQL 5.7.8.

* `version_tokens_session_number`: Para uso interno. Adicionado no MySQL 5.7.8.

### Opções e Variáveis Descontinuadas no MySQL 5.7

As seguintes variáveis de sistema, variáveis de status e opções foram descontinuadas no MySQL 5.7.

* `Innodb_available_undo_logs`: Número total de segmentos de Rollback do InnoDB; diferente de `innodb_rollback_segments`, que exibe o número de segmentos de Rollback ativos. Descontinuada no MySQL 5.7.19.

* `Qcache_free_blocks`: Número de blocos de memória livre no Query Cache. Descontinuada no MySQL 5.7.20.

* `Qcache_free_memory`: Quantidade de memória livre para o Query Cache. Descontinuada no MySQL 5.7.20.

* `Qcache_hits`: Número de acertos do Query Cache. Descontinuada no MySQL 5.7.20.

* `Qcache_inserts`: Número de inserções no Query Cache. Descontinuada no MySQL 5.7.20.

* `Qcache_lowmem_prunes`: Número de Queries que foram excluídas do Query Cache devido à falta de memória livre no Cache. Descontinuada no MySQL 5.7.20.

* `Qcache_not_cached`: Número de Queries não armazenadas em Cache (não cacheáveis, ou não armazenadas devido à configuração de `query_cache_type`). Descontinuada no MySQL 5.7.20.

* `Qcache_queries_in_cache`: Número de Queries registradas no Query Cache. Descontinuada no MySQL 5.7.20.

* `Qcache_total_blocks`: Número total de blocos no Query Cache. Descontinuada no MySQL 5.7.20.

* `Slave_heartbeat_period`: Intervalo de Heartbeat de replicação da Replica, em segundos. Descontinuada no MySQL 5.7.6.

* `Slave_last_heartbeat`: Mostra quando o último sinal de Heartbeat foi recebido, no formato TIMESTAMP. Descontinuada no MySQL 5.7.6.

* `Slave_received_heartbeats`: Número de Heartbeats recebidos pela Replica desde o reset anterior. Descontinuada no MySQL 5.7.6.

* `Slave_retried_transactions`: Número total de vezes desde a inicialização que a Thread SQL de replicação repetiu Transactions. Descontinuada no MySQL 5.7.6.

* `Slave_running`: Estado deste servidor como Replica (status da Thread I/O de replicação). Descontinuada no MySQL 5.7.6.

* `avoid_temporal_upgrade`: Se ALTER TABLE deve atualizar colunas temporais pré-5.6.4. Descontinuada no MySQL 5.7.6.

* `binlog_max_flush_queue_time`: Quanto tempo para ler Transactions antes de fazer Flush para o Binary Log. Descontinuada no MySQL 5.7.9.

* `bootstrap`: Usada por scripts de instalação do mysql. Descontinuada no MySQL 5.7.6.

* `des-key-file`: Carrega chaves para `des_encrypt()` e `des_encrypt` do arquivo fornecido. Descontinuada no MySQL 5.7.6.

* `disable-partition-engine-check`: Se deve desabilitar a verificação de inicialização para tabelas sem particionamento nativo. Descontinuada no MySQL 5.7.17.

* `group_replication_allow_local_disjoint_gtids_join`: Permite que o servidor atual se junte ao Group, mesmo que tenha Transactions não presentes no Group. Descontinuada no MySQL 5.7.21.

* `have_crypt`: Disponibilidade da chamada de sistema `crypt()`. Descontinuada no MySQL 5.7.6.

* `have_query_cache`: Se o mysqld suporta o Query Cache. Descontinuada no MySQL 5.7.20.

* `ignore-db-dir`: Trata o diretório como um diretório não-Database. Descontinuada no MySQL 5.7.16.

* `ignore_db_dirs`: Diretórios tratados como diretórios não-Database. Descontinuada no MySQL 5.7.16.

* `innodb`: Habilita o InnoDB (se esta versão do MySQL o suportar). Descontinuada no MySQL 5.7.5.

* `innodb_file_format`: Formato para novas tabelas InnoDB. Descontinuada no MySQL 5.7.7.

* `innodb_file_format_check`: Se o InnoDB executa verificação de compatibilidade de formato de arquivo. Descontinuada no MySQL 5.7.7.

* `innodb_file_format_max`: Tag de formato de arquivo no Tablespace compartilhado. Descontinuada no MySQL 5.7.7.

* `innodb_large_prefix`: Habilita chaves mais longas para Indexes de prefixo de coluna. Descontinuada no MySQL 5.7.7.

* `innodb_support_xa`: Habilita o suporte do InnoDB para XA Two-Phase Commit. Descontinuada no MySQL 5.7.10.

* `innodb_undo_logs`: Número de Undo Logs (segmentos de Rollback) usados pelo InnoDB; alias para `innodb_rollback_segments`. Descontinuada no MySQL 5.7.19.

* `innodb_undo_tablespaces`: Número de arquivos de Tablespace pelos quais os segmentos de Rollback são divididos. Descontinuada no MySQL 5.7.21.

* `log-warnings`: Escreve alguns Warnings não críticos no arquivo de Log. Descontinuada no MySQL 5.7.2.

* `metadata_locks_cache_size`: Tamanho do Cache de Locks de Metadata. Descontinuada no MySQL 5.7.4.

* `metadata_locks_hash_instances`: Número de Hashes de Lock de Metadata. Descontinuada no MySQL 5.7.4.

* `myisam_repair_threads`: Número de Threads a serem usadas ao reparar tabelas MyISAM. 1 desabilita o Repair paralelo. Descontinuada no MySQL 5.7.38.

* `old_passwords`: Seleciona o método de Hash de senha para PASSWORD(). Descontinuada no MySQL 5.7.6.

* `partition`: Habilita (ou desabilita) o suporte a Particionamento. Descontinuada no MySQL 5.7.16.

* `query_cache_limit`: Não armazena em Cache resultados maiores que este. Descontinuada no MySQL 5.7.20.

* `query_cache_min_res_unit`: Tamanho mínimo da unidade na qual o espaço para resultados é alocado (a última unidade é aparada após escrever todos os dados de resultado). Descontinuada no MySQL 5.7.20.

* `query_cache_size`: Memória alocada para armazenar resultados de Queries antigas. Descontinuada no MySQL 5.7.20.

* `query_cache_type`: Tipo de Query Cache. Descontinuada no MySQL 5.7.20.

* `query_cache_wlock_invalidate`: Invalida Queries no Query Cache em LOCK para escrita (Write). Descontinuada no MySQL 5.7.20.

* `secure_auth`: Desautoriza Authentication para contas que possuem senhas antigas (pré-4.1). Descontinuada no MySQL 5.7.5.

* `show_compatibility_56`: Compatibilidade para SHOW STATUS/VARIABLES. Descontinuada no MySQL 5.7.6.

* `show_old_temporals`: Se SHOW CREATE TABLE deve indicar colunas temporais pré-5.6.4. Descontinuada no MySQL 5.7.6.

* `skip-partition`: Não habilita o particionamento definido pelo usuário. Descontinuada no MySQL 5.7.16.

* `sync_frm`: Sincroniza .frm para o disco na criação. Habilitado por padrão. Descontinuada no MySQL 5.7.6.

* `temp-pool`: Usar esta opção faz com que a maioria dos arquivos temporários criados use um pequeno conjunto de nomes, em vez de um nome único para cada novo arquivo. Descontinuada no MySQL 5.7.18.

* `tx_isolation`: Nível de Isolation de Transaction padrão. Descontinuada no MySQL 5.7.20.

* `tx_read_only`: Modo de acesso de Transaction padrão. Descontinuada no MySQL 5.7.20.

### Opções e Variáveis Removidas no MySQL 5.7

As seguintes variáveis de sistema, variáveis de status e opções foram removidas no MySQL 5.7.

* `Com_show_slave_status_nonblocking`: Contagem de comandos SHOW REPLICA | SLAVE STATUS NONBLOCKING. Removida no MySQL 5.7.6.

* `Max_statement_time_exceeded`: Número de statements que excederam o valor de Timeout de execução. Removida no MySQL 5.7.8.

* `Max_statement_time_set`: Número de statements para os quais o Timeout de execução foi definido. Removida no MySQL 5.7.8.

* `Max_statement_time_set_failed`: Número de statements para os quais a definição do Timeout de execução falhou. Removida no MySQL 5.7.8.

* `binlogging_impossible_mode`: Descontinuada e posteriormente removida. Use `binlog_error_action` em vez disso. Removida no MySQL 5.7.6.

* `default-authentication-plugin`: Plugin de Authentication padrão. Removida no MySQL 5.7.2.

* `executed_gtids_compression_period`: Renomeada para `gtid_executed_compression_period`. Removida no MySQL 5.7.6.

* `innodb_additional_mem_pool_size`: Tamanho do Pool de memória adicional que o InnoDB usa para armazenar informações de dicionário de dados e outras estruturas de dados internas. Removida no MySQL 5.7.4.

* `innodb_log_checksum_algorithm`: Especifica como gerar e verificar o Checksum armazenado em cada bloco de disco do Redo Log. Removida no MySQL 5.7.9.

* `innodb_optimize_point_storage`: Habilita esta opção para armazenar dados POINT como dados de comprimento fixo em vez de dados de comprimento variável. Removida no MySQL 5.7.6.

* `innodb_use_sys_malloc`: Se o InnoDB usa o OS ou seu próprio alocador de memória. Removida no MySQL 5.7.4.

* `log-slow-admin-statements`: Registra statements lentos de OPTIMIZE, ANALYZE, ALTER e outros statements administrativos no Slow Query Log, se estiver aberto. Removida no MySQL 5.7.1.

* `log-slow-slave-statements`: Causa o registro de statements lentos executados pela Replica no Slow Query Log. Removida no MySQL 5.7.1.

* `log_backward_compatible_user_definitions`: Se deve registrar CREATE/ALTER USER, GRANT de forma compatível com versões anteriores. Removida no MySQL 5.7.9.

* `max_statement_time`: Valor de Timeout de execução de statement. Removida no MySQL 5.7.8.

* `myisam_repair_threads`: Número de Threads a serem usadas ao reparar tabelas MyISAM. 1 desabilita o Repair paralelo. Removida no MySQL 5.7.39.

* `simplified_binlog_gtid_recovery`: Renomeada para `binlog_gtid_simple_recovery`. Removida no MySQL 5.7.6.

* `storage_engine`: Storage Engine padrão. Removida no MySQL 5.7.5.

* `thread_concurrency`: Permite que a aplicação forneça uma sugestão ao sistema de Threads para o número desejado de Threads que devem ser executadas simultaneamente. Removida no MySQL 5.7.2.

* `timed_mutexes`: Especifica se deve cronometrar Mutexes (apenas Mutexes InnoDB são atualmente suportados). Removida no MySQL 5.7.5.