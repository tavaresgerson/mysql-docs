## 1.4 Variáveis e opções de servidor e status adicionadas, descontinuadas ou removidas no MySQL 8.0

- Opções e variáveis introduzidas no MySQL 8.0
- Opções e variáveis descontinuadas no MySQL 8.0
- Opções e variáveis removidas no MySQL 8.0

Esta seção lista as variáveis do servidor, as variáveis de status e as opções que foram adicionadas pela primeira vez, foram descontinuadas ou foram removidas no MySQL 8.0.

### Opções e variáveis introduzidas no MySQL 8.0

As seguintes variáveis de sistema, variáveis de status e opções de servidor foram adicionadas no MySQL 8.0.

- `Acl_cache_items_count`: Número de objetos de privilégio armazenados em cache. Adicionado no MySQL 8.0.0.

- `Audit_log_current_size`: Tamanho atual do arquivo de registro de auditoria. Adicionada no MySQL 8.0.11.

- `Audit_log_event_max_drop_size`: Tamanho do maior evento audacado que foi descartado. Foi adicionado no MySQL 8.0.11.

- `Audit_log_events`: Número de eventos auditados processados. Adicionado no MySQL 8.0.11.

- `Audit_log_events_filtered`: Número de eventos auditados filtrados. Adicionado no MySQL 8.0.11.

- `Audit_log_events_lost`: Número de eventos auditados descartados. Adicionado no MySQL 8.0.11.

- `Audit_log_events_written`: Número de eventos auditados escritos. Adicionado no MySQL 8.0.11.

- `Audit_log_total_size`: Tamanho combinado dos eventos auditados escritos. Adicionado no MySQL 8.0.11.

- `Audit_log_write_waits`: Número de eventos auditados com atraso de escrita. Adicionado no MySQL 8.0.11.

- `Authentication_ldap_sasl_supported_methods`: Métodos de autenticação suportados para autenticação SASL LDAP. Adicionada no MySQL 8.0.21.

- `Caching_sha2_password_rsa_public_key`: valor da chave pública RSA do plugin de autenticação de cacheamento sha2\_password. Adicionado no MySQL 8.0.4.

- `Com_alter_resource_group`: Contagem de declarações de ALTER RESOURCE GROUP. Adicionada no MySQL 8.0.3.

- `Com_alter_user_default_role`: Número de declarações ALTER USER ... DEFAULT ROLE. Adicionada no MySQL 8.0.0.

- `Com_change_replication_source`: Contagem de declarações de REPLICAÇÃO DE ALTERAÇÕES PARA e ALTERAÇÃO DO MESTRE EM. Adicionada no MySQL 8.0.23.

- `Com_clone`: Número de declarações CLONE. Adicionada no MySQL 8.0.2.

- `Com_create_resource_group`: Contagem de declarações de CREATE RESOURCE GROUP. Adicionada no MySQL 8.0.3.

- `Com_create_role`: Contagem de declarações CREATE ROLE. Adicionada no MySQL 8.0.0.

- `Com_drop_resource_group`: Contagem de declarações de DROP RESOURCE GROUP. Adicionada no MySQL 8.0.3.

- `Com_drop_role`: Número de declarações DROP ROLE. Adicionada no MySQL 8.0.0.

- `Com_grant_roles`: Contagem de declarações de GRANT ROLE. Adicionada no MySQL 8.0.0.

- `Com_install_component`: Número de declarações de INSTALE COMPONENTES. Adicionada no MySQL 8.0.0.

- `Com_replica_start`: Contagem de declarações START REPLICA e START SLAVE. Adicionada no MySQL 8.0.22.

- `Com_replica_stop`: Contagem de declarações STOP REPLICA e STOP SLAVE. Adicionada no MySQL 8.0.22.

- `Com_restart`: Número de declarações de RESTART. Adicionada no MySQL 8.0.4.

- `Com_revoke_roles`: Número de declarações REVOKE ROLES. Adicionada no MySQL 8.0.0.

- `Com_set_resource_group`: Contagem de declarações de SET RESOURCE GROUP. Adicionada no MySQL 8.0.3.

- `Com_set_role`: Número de declarações de SET ROLE. Adicionada no MySQL 8.0.0.

- `Com_show_replica_status`: Contagem de instruções SHOW REPLICA STATUS e SHOW SLAVE STATUS. Adicionada no MySQL 8.0.22.

- `Com_show_replicas`: Contagem de declarações SHOW REPLICAS e SHOW SLAVE HOSTS. Adicionada no MySQL 8.0.22.

- `Com_uninstall_component`: Número de declarações de UINSTALL COMPONENT. Adicionada no MySQL 8.0.0.

- `Compression_algorithm`: Algoritmo de compressão para a conexão atual. Adicionado no MySQL 8.0.18.

- `Compression_level`: Nível de compressão para a conexão atual. Adicionado no MySQL 8.0.18.

- `Connection_control_delay_generated`: Quantas vezes o servidor atrasou a solicitação de conexão. Adicionada no MySQL 8.0.1.

- `Current_tls_ca`: Valor atual da variável de sistema ssl\_ca. Adicionada no MySQL 8.0.16.

- `Current_tls_capath`: Valor atual da variável de sistema ssl\_capath. Adicionada no MySQL 8.0.16.

- `Current_tls_cert`: Valor atual da variável de sistema ssl\_cert. Adicionada no MySQL 8.0.16.

- `Current_tls_cipher`: Valor atual da variável de sistema ssl\_cipher. Adicionada no MySQL 8.0.16.

- `Current_tls_ciphersuites`: Valor atual da variável de sistema tsl\_ciphersuites. Adicionada no MySQL 8.0.16.

- `Current_tls_crl`: Valor atual da variável de sistema ssl\_crl. Adicionada no MySQL 8.0.16.

- `Current_tls_crlpath`: Valor atual da variável de sistema ssl\_crlpath. Adicionada no MySQL 8.0.16.

- `Current_tls_key`: Valor atual da variável de sistema ssl\_key. Adicionada no MySQL 8.0.16.

- `Current_tls_version`: Valor atual da variável de sistema tls\_version. Adicionada no MySQL 8.0.16.

- `Error_log_buffered_bytes`: Número de bytes usados na tabela error\_log. Adicionada no MySQL 8.0.22.

- `Error_log_buffered_events`: Número de eventos na tabela error\_log. Adicionada no MySQL 8.0.22.

- `Error_log_expired_events`: Número de eventos descartados da tabela error\_log. Adicionada no MySQL 8.0.22.

- `Error_log_latest_write`: Hora da última gravação na tabela error\_log. Adicionada no MySQL 8.0.22.

- `Firewall_access_denied`: Número de declarações rejeitadas pelo plugin MySQL Enterprise Firewall. Adicionada no MySQL 8.0.11.

- `Firewall_access_granted`: Número de declarações aceitas pelo plugin MySQL Enterprise Firewall. Adicionada no MySQL 8.0.11.

- `Firewall_cached_entries`: Número de declarações registradas pelo plugin MySQL Enterprise Firewall. Adicionada no MySQL 8.0.11.

- `Global_connection_memory`: Quantidade de memória atualmente utilizada por todos os threads do usuário. Adicionada no MySQL 8.0.28.

- `Innodb_buffer_pool_resize_status_code`: Código de status de redimensionamento do pool de buffers do InnoDB. Adicionado no MySQL 8.0.31.

- `Innodb_buffer_pool_resize_status_progress`: Status de progresso da redimensionamento do pool de buffers do InnoDB. Adicionada no MySQL 8.0.31.

- `Innodb_redo_log_capacity_resized`: Redimensione o log novamente após a última operação de redimensionamento de capacidade concluída. Adicionado no MySQL 8.0.30.

- `Innodb_redo_log_checkpoint_lsn`: O ponto de verificação do log de refazer LSN. Adicionado no MySQL 8.0.30.

- `Innodb_redo_log_current_lsn`: O LSN atual do log de refazer. Adicionado no MySQL 8.0.30.

- `Innodb_redo_log_enabled`: Status do log de refazer do InnoDB. Adicionado no MySQL 8.0.21.

- `Innodb_redo_log_flushed_to_disk_lsn`: O LSN (Log Sequence Number) do log vermelho enviado para o disco. Adicionado no MySQL 8.0.30.

- `Innodb_redo_log_logical_size`: Tamanho lógico do log de refazer. Adicionado no MySQL 8.0.30.

- `Innodb_redo_log_physical_size`: Tamanho físico do log de refazer. Adicionado no MySQL 8.0.30.

- `Innodb_redo_log_read_only`: Se o log de revisão é somente de leitura. Adicionado no MySQL 8.0.30.

- `Innodb_redo_log_resize_status`: O status de redimensionamento do log de revisão. Adicionado no MySQL 8.0.30.

- `Innodb_redo_log_uuid`: UUID do log de refazer. Adicionado no MySQL 8.0.30.

- `Innodb_system_rows_deleted`: Número de linhas excluídas das tabelas do esquema do sistema. Adicionada no MySQL 8.0.19.

- `Innodb_system_rows_inserted`: Número de linhas inseridas nas tabelas do esquema do sistema. Adicionada no MySQL 8.0.19.

- `Innodb_system_rows_read`: Número de linhas lidas das tabelas do esquema do sistema. Adicionada no MySQL 8.0.19.

- `Innodb_system_rows_updated`: Número de linhas atualizadas nas tabelas do esquema do sistema. Adicionado no MySQL 8.0.19.

- `Innodb_undo_tablespaces_active`: Número de tabelas espaços de desfazer ativos. Adicionado no MySQL 8.0.14.

- `Innodb_undo_tablespaces_explicit`: Número de espaços de tabela de desfazer criados pelo usuário. Adicionado no MySQL 8.0.14.

- `Innodb_undo_tablespaces_implicit`: Número de espaços de tabelas de desfazer criados pelo InnoDB. Adicionado no MySQL 8.0.14.

- `Innodb_undo_tablespaces_total`: Número total de tabelaspaces de desfazer. Adicionado no MySQL 8.0.14.

- `Mysqlx_bytes_received_compressed_payload`: Número de bytes recebidos como cargas úteis de mensagens comprimidas, medido antes da descompactação. Adicionado no MySQL 8.0.19.

- `Mysqlx_bytes_received_uncompressed_frame`: Número de bytes recebidos como cargas úteis de mensagens comprimidas, medido após a descompactação. Adicionado no MySQL 8.0.19.

- `Mysqlx_bytes_sent_compressed_payload`: Número de bytes enviados como cargas úteis de mensagens comprimidas, medido após a compressão. Adicionado no MySQL 8.0.19.

- `Mysqlx_bytes_sent_uncompressed_frame`: Número de bytes enviados como cargas úteis de mensagens comprimidas, medido antes da compressão. Adicionado no MySQL 8.0.19.

- `Mysqlx_compression_algorithm`: Algoritmo de compressão utilizado para a conexão com o X Protocol nesta sessão. Adicionado no MySQL 8.0.20.

- `Mysqlx_compression_level`: Nível de compressão utilizado para a conexão com o X Protocol nesta sessão. Adicionado no MySQL 8.0.20.

- `Replica_open_temp_tables`: Número de tabelas temporárias que o thread de replicação SQL atualmente tem aberto. Adicionado no MySQL 8.0.26.

- `Replica_rows_last_search_algorithm_used`: Algoritmo de pesquisa mais recentemente utilizado por esta replica para localizar linhas para replicação baseada em linhas (índice, tabela ou varredura hash). Adicionado no MySQL 8.0.26.

- `Resource_group_supported`: Se o servidor suporta o recurso do grupo de recursos. Adicionado no MySQL 8.0.31.

- `Rpl_semi_sync_replica_status`: Se a replicação semi-sincronizada estiver operacional no replica. Adicionada no MySQL 8.0.26.

- `Rpl_semi_sync_source_clients`: Número de réplicas semi-síncronas. Adicionada no MySQL 8.0.26.

- `Rpl_semi_sync_source_net_avg_wait_time`: Tempo médio que a fonte de dados esperou por respostas da réplica. Adicionado no MySQL 8.0.26.

- `Rpl_semi_sync_source_net_wait_time`: Tempo total que a fonte de tempo esperou por respostas da réplica. Adicionada no MySQL 8.0.26.

- `Rpl_semi_sync_source_net_waits`: Número total de vezes que a fonte esperou por respostas da réplica. Adicionado no MySQL 8.0.26.

- `Rpl_semi_sync_source_no_times`: Número de vezes que a replicação semiesincronizada foi desligada na fonte. Adicionada no MySQL 8.0.26.

- `Rpl_semi_sync_source_no_tx`: Número de commits não reconhecidos com sucesso. Adicionado no MySQL 8.0.26.

- `Rpl_semi_sync_source_status`: Se a replicação semi-sincronizada estiver operacional na fonte. Adicionada no MySQL 8.0.26.

- `Rpl_semi_sync_source_timefunc_failures`: Número de vezes que a fonte falhou ao chamar funções de tempo. Adicionado no MySQL 8.0.26.

- `Rpl_semi_sync_source_tx_avg_wait_time`: Tempo médio que a fonte esperou por cada transação. Adicionado no MySQL 8.0.26.

- `Rpl_semi_sync_source_tx_wait_time`: Tempo total que a fonte de transações esperou. Adicionada no MySQL 8.0.26.

- `Rpl_semi_sync_source_tx_waits`: Número total de vezes que a fonte esperou por transações. Adicionado no MySQL 8.0.26.

- `Rpl_semi_sync_source_wait_pos_backtraverse`: Número total de vezes que a fonte esperou por um evento com coordenadas binárias inferiores às coordenadas binárias dos eventos esperados anteriormente. Adicionado no MySQL 8.0.26.

- `Rpl_semi_sync_source_wait_sessions`: Número de sessões atualmente aguardando respostas replicadas. Adicionado no MySQL 8.0.26.

- `Rpl_semi_sync_source_yes_tx`: Número de commits reconhecidos com sucesso. Adicionado no MySQL 8.0.26.

- `Secondary_engine_execution_count`: Número de consultas transferidas para um motor secundário. Adicionado no MySQL 8.0.13.

- `Ssl_session_cache_timeout`: Valor atual do tempo de expiração da sessão SSL no cache. Adicionada no MySQL 8.0.29.

- `Telemetry_traces_supported`: Se as traças de telemetria do servidor são suportadas. Adicionada no MySQL 8.0.33.

- `Tls_library_version`: Versão de execução da biblioteca OpenSSL em uso. Adicionada no MySQL 8.0.30.

- `activate_all_roles_on_login`: Se ativar todos os papéis de usuário no momento da conexão. Adicionado no MySQL 8.0.2.

- `admin-ssl`: Habilitar a criptografia de conexão. Adicionado no MySQL 8.0.21.

- `admin_address`: Endereço IP para se ligar para conexões na interface administrativa. Adicionado no MySQL 8.0.14.

- `admin_port`: Número TCP/IP a ser usado para conexões na interface administrativa. Adicionado no MySQL 8.0.14.

- `admin_ssl_ca`: Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis. Adicionado no MySQL 8.0.21.

- `admin_ssl_capath`: Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis. Adicionado no MySQL 8.0.21.

- `admin_ssl_cert`: Arquivo que contém o certificado X.509. Adicionado no MySQL 8.0.21.

- `admin_ssl_cipher`: Cifras permitidas para criptografia de conexão. Adicionada no MySQL 8.0.21.

- `admin_ssl_crl`: Arquivo que contém listas de revogação de certificados. Adicionado no MySQL 8.0.21.

- `admin_ssl_crlpath`: Diretório que contém arquivos da lista de revogação de certificados. Adicionado no MySQL 8.0.21.

- `admin_ssl_key`: Arquivo que contém a chave X.509. Adicionada no MySQL 8.0.21.

- `admin_tls_ciphersuites`: Suítes de criptografia TLSv1.3 permitidas para conexões criptografadas. Adicionada no MySQL 8.0.21.

- `admin_tls_version`: Protocolos TLS permitidos para conexões criptografadas. Adicionado no MySQL 8.0.21.

- `audit-log`: Se ativar o plugin de registro de auditoria. Adicionado no MySQL 8.0.11.

- `audit_log_buffer_size`: Tamanho do buffer do log de auditoria. Adicionado no MySQL 8.0.11.

- `audit_log_compression`: Método de compactação do arquivo de registro de auditoria. Adicionado no MySQL 8.0.11.

- `audit_log_connection_policy`: Política de registro de auditoria para eventos relacionados à conexão. Adicionada no MySQL 8.0.11.

- `audit_log_current_session`: Se auditar a sessão atual. Adicionado no MySQL 8.0.11.

- `audit_log_database`: Esquema onde as tabelas de auditoria são armazenadas. Adicionada no MySQL 8.0.33.

- `audit_log_disable`: Se desabilitar o log de auditoria. Adicionado no MySQL 8.0.28.

- `audit_log_encryption`: Método de criptografia do arquivo de registro de auditoria. Adicionado no MySQL 8.0.11.

- `audit_log_exclude_accounts`: Contas que não serão auditadas. Adicionada no MySQL 8.0.11.

- `audit_log_file`: Nome do arquivo de registro de auditoria. Adicionado no MySQL 8.0.11.

- `audit_log_filter_id`: ID do filtro atual do log de auditoria. Adicionado no MySQL 8.0.11.

- `audit_log_flush`: Feche e volte a abrir o arquivo de registro de auditoria. Adicionado no MySQL 8.0.11.

- `audit_log_flush_interval_seconds`: Se executar um esvaziamento recorrente do cache de memória. Adicionado no MySQL 8.0.34.

- `audit_log_format`: Formato do arquivo de registro de auditoria. Adicionado no MySQL 8.0.11.

- `audit_log_format_unix_timestamp`: Se incluir o timestamp Unix no log de auditoria em formato JSON. Adicionado no MySQL 8.0.26.

- `audit_log_include_accounts`: Contas para auditoria. Adicionada no MySQL 8.0.11.

- `audit_log_max_size`: Limite para o tamanho combinado dos arquivos de registro de auditoria JSON. Adicionado no MySQL 8.0.26.

- `audit_log_password_history_keep_days`: Número de dias para reter senhas de criptografia do log de auditoria arquivado. Adicionado no MySQL 8.0.17.

- `audit_log_policy`: Política de registro de auditoria. Adicionada no MySQL 8.0.11.

- `audit_log_prune_seconds`: O número de segundos após o qual os arquivos do log de auditoria passam a ser sujeitos à poda. Adicionado no MySQL 8.0.24.

- `audit_log_read_buffer_size`: Tamanho do buffer de leitura do arquivo de log de auditoria. Adicionada no MySQL 8.0.11.

- `audit_log_rotate_on_size`: Feche e volte a abrir o arquivo de registro de auditoria neste tamanho. Adicionado no MySQL 8.0.11.

- `audit_log_statement_policy`: Política de registro de auditoria para eventos relacionados a declarações. Adicionada no MySQL 8.0.11.

- `audit_log_strategy`: Estratégia de registro de auditoria. Adicionada no MySQL 8.0.11.

- `authentication_fido_rp_id`: ID do destinatário para autenticação multifator FIDO. Adicionada no MySQL 8.0.27.

- `authentication_kerberos_service_key_tab`: Arquivo contendo as chaves do serviço Kerberos para autenticar o ingresso do TGS. Adicionado no MySQL 8.0.26.

- `authentication_kerberos_service_principal`: Nome do principal do serviço Kerberos. Adicionado no MySQL 8.0.26.

- `authentication_ldap_sasl_auth_method_name`: Nome do método de autenticação. Adicionado no MySQL 8.0.11.

- `authentication_ldap_sasl_bind_base_dn`: Nome distinto da base do servidor LDAP. Adicionada no MySQL 8.0.11.

- `authentication_ldap_sasl_bind_root_dn`: Nome distinto raiz do servidor LDAP. Adicionada no MySQL 8.0.11.

- `authentication_ldap_sasl_bind_root_pwd`: Senha de vinculação da raiz do servidor LDAP. Adicionada no MySQL 8.0.11.

- `authentication_ldap_sasl_ca_path`: Nome do arquivo da autoridade de certificação do servidor LDAP. Adicionada no MySQL 8.0.11.

- `authentication_ldap_sasl_group_search_attr`: Atributo de pesquisa de grupo do servidor LDAP. Adicionado no MySQL 8.0.11.

- `authentication_ldap_sasl_group_search_filter`: Filtro de busca de grupo personalizado LDAP. Adicionado no MySQL 8.0.11.

- `authentication_ldap_sasl_init_pool_size`: Tamanho do pool de conexão inicial do servidor LDAP. Adicionada no MySQL 8.0.11.

- `authentication_ldap_sasl_log_status`: Nível de registro do servidor LDAP. Adicionada no MySQL 8.0.11.

- `authentication_ldap_sasl_max_pool_size`: Tamanho máximo do conjunto de conexões do servidor LDAP. Adicionada no MySQL 8.0.11.

- `authentication_ldap_sasl_referral`: Se habilitar a pesquisa de referência LDAP. Adicionada no MySQL 8.0.20.

- `authentication_ldap_sasl_server_host`: Nome do host ou endereço IP do servidor LDAP. Adicionada no MySQL 8.0.11.

- `authentication_ldap_sasl_server_port`: Número da porta do servidor LDAP. Adicionada no MySQL 8.0.11.

- `authentication_ldap_sasl_tls`: Se usar conexões criptografadas para o servidor LDAP. Adicionada no MySQL 8.0.11.

- `authentication_ldap_sasl_user_search_attr`: Atributo de pesquisa de usuário do servidor LDAP. Adicionado no MySQL 8.0.11.

- `authentication_ldap_simple_auth_method_name`: Nome do método de autenticação. Adicionado no MySQL 8.0.11.

- `authentication_ldap_simple_bind_base_dn`: Nome distinto da base do servidor LDAP. Adicionada no MySQL 8.0.11.

- `authentication_ldap_simple_bind_root_dn`: Nome distinto raiz do servidor LDAP. Adicionada no MySQL 8.0.11.

- `authentication_ldap_simple_bind_root_pwd`: Senha de vinculação da raiz do servidor LDAP. Adicionada no MySQL 8.0.11.

- `authentication_ldap_simple_ca_path`: Nome do arquivo da autoridade de certificação do servidor LDAP. Adicionada no MySQL 8.0.11.

- `authentication_ldap_simple_group_search_attr`: Atributo de pesquisa de grupo do servidor LDAP. Adicionado no MySQL 8.0.11.

- `authentication_ldap_simple_group_search_filter`: Filtro de busca de grupo personalizado LDAP. Adicionado no MySQL 8.0.11.

- `authentication_ldap_simple_init_pool_size`: Tamanho do pool de conexão inicial do servidor LDAP. Adicionada no MySQL 8.0.11.

- `authentication_ldap_simple_log_status`: Nível de registro do servidor LDAP. Adicionada no MySQL 8.0.11.

- `authentication_ldap_simple_max_pool_size`: Tamanho máximo do conjunto de conexões do servidor LDAP. Adicionada no MySQL 8.0.11.

- `authentication_ldap_simple_referral`: Se habilitar a pesquisa de referência LDAP. Adicionada no MySQL 8.0.20.

- `authentication_ldap_simple_server_host`: Nome do host ou endereço IP do servidor LDAP. Adicionada no MySQL 8.0.11.

- `authentication_ldap_simple_server_port`: Número da porta do servidor LDAP. Adicionada no MySQL 8.0.11.

- `authentication_ldap_simple_tls`: Se usar conexões criptografadas para o servidor LDAP. Adicionada no MySQL 8.0.11.

- `authentication_ldap_simple_user_search_attr`: Atributo de pesquisa de usuário do servidor LDAP. Adicionado no MySQL 8.0.11.

- `authentication_policy`: Plugins para autenticação multifator; consulte a documentação para a sintaxe. Adicionado no MySQL 8.0.27.

- `authentication_windows_log_level`: Nível de registro do plugin de autenticação do Windows. Adicionado no MySQL 8.0.11.

- `authentication_windows_use_principal_name`: Se usar o nome do principal do plugin de autenticação do Windows. Adicionado no MySQL 8.0.11.

- `binlog_encryption`: Habilitar a criptografia para arquivos de log binários e arquivos de log de retransmissão neste servidor. Adicionada no MySQL 8.0.14.

- `binlog_expire_logs_auto_purge`: Controla a purga automática de arquivos de log binários; pode ser sobrescrito quando habilitado, definindo binlog\_expire\_logs\_seconds e expire\_logs\_days para 0. Adicionada no MySQL 8.0.29.

- `binlog_expire_logs_seconds`: Limpe os logs binários após tantos segundos. Adicionado no MySQL 8.0.1.

- `binlog_rotate_encryption_master_key_at_startup`: Rotação da chave mestre do log binário ao iniciar o servidor. Adicionada no MySQL 8.0.14.

- `binlog_row_metadata`: Se gravar todos ou apenas metadados mínimos relacionados à tabela no log binário ao usar o registro baseado em linhas. Adicionado no MySQL 8.0.1.

- `binlog_row_value_options`: Habilita o registro binário de atualizações parciais de JSON para replicação baseada em linhas. Adicionada no MySQL 8.0.3.

- `binlog_transaction_compression`: Habilitar a compressão para os payloads de transações em arquivos de log binários. Adicionado no MySQL 8.0.20.

- `binlog_transaction_compression_level_zstd`: Nível de compressão para os payloads das transações em arquivos de log binários. Adicionado no MySQL 8.0.20.

- `binlog_transaction_dependency_history_size`: Número de hashes de linha mantidos para procurar uma transação que foi a última a atualizar alguma linha. Adicionado no MySQL 8.0.1.

- `binlog_transaction_dependency_tracking`: Fonte de informações de dependência (marcadores de commit ou conjuntos de escrita de transações) a partir da qual se pode avaliar quais transações podem ser executadas em paralelo pelo aplicativo multithread da replica. Adicionada no MySQL 8.0.1.

- `build_id`: Um ID de compilação único gerado no momento da compilação (apenas no Linux). Adicionado no MySQL 8.0.31.

- `caching_sha2_password_auto_generate_rsa_keys`: Se os arquivos de par de chaves RSA devem ser gerados automaticamente. Adicionado no MySQL 8.0.4.

- `caching_sha2_password_digest_rounds`: Número de rodadas de hash para o plugin de autenticação caching\_sha2\_password. Adicionada no MySQL 8.0.24.

- `caching_sha2_password_private_key_path`: Nome do caminho da chave privada do plugin de autenticação SHA2. Adicionada no MySQL 8.0.3.

- `caching_sha2_password_public_key_path`: Nome do caminho da chave pública do plugin de autenticação SHA2. Adicionada no MySQL 8.0.3.

- `check-table-functions`: Como proceder ao escanear o dicionário de funções utilizado em restrições de tabela e outras expressões, e essa função causar um erro. Use WARN para registrar avisos; ABORT (padrão) também registra avisos e interrompe qualquer atualização em andamento. Adicionada no MySQL 8.0.42.

- `clone_autotune_concurrency`: Habilita a criação dinâmica de threads para operações de clonagem remota. Adicionada no MySQL 8.0.17.

- `clone_block_ddl`: Habilita um bloqueio de backup exclusivo durante operações de clonagem. Adicionada no MySQL 8.0.27.

- `clone_buffer_size`: Define o tamanho do buffer intermediário na instância do servidor MySQL do doador. Foi adicionado no MySQL 8.0.17.

- `clone_ddl_timeout`: Número de segundos que a operação de clonagem aguarda por bloqueio de backup. Adicionado no MySQL 8.0.17.

- `clone_delay_after_data_drop`: O atraso no tempo em segundos antes que o processo de clone comece. Adicionado no MySQL 8.0.29.

- `clone_donor_timeout_after_network_failure`: O tempo permitido para reiniciar uma operação de clonagem após uma falha na rede. Adicionado no MySQL 8.0.24.

- `clone_enable_compression`: Habilita a compressão de dados na camada de rede durante o clonamento. Adicionada no MySQL 8.0.17.

- `clone_max_concurrency`: Número máximo de threads concorrentes usadas para realizar a operação de clonagem. Adicionada no MySQL 8.0.17.

- `clone_max_data_bandwidth`: Taxa máxima de transferência de dados em MiB por segundo para a operação de clonagem remota. Adicionada no MySQL 8.0.17.

- `clone_max_network_bandwidth`: Taxa máxima de transferência de rede em MiB por segundo para a operação de clonagem remota. Adicionada no MySQL 8.0.17.

- `clone_ssl_ca`: Especifica o caminho para o arquivo da autoridade de certificação (CA). Adicionada no MySQL 8.0.14.

- `clone_ssl_cert`: Especifica o caminho para o arquivo de certificado da chave pública. Adicionado no MySQL 8.0.14.

- `clone_ssl_key`: Especifica o caminho para o arquivo de chave privada. Adicionada no MySQL 8.0.14.

- `clone_valid_donor_list`: Define endereços de hospedeiro do doador para operações de clonagem remota. Adicionado no MySQL 8.0.17.

- `component_scheduler.enabled`: Se o agendamento está executando tarefas ativamente. Adicionado no MySQL 8.0.34.

- `connection_control_failed_connections_threshold`: Tentativas de conexão consecutivas falhas antes que os atrasos ocorram. Adicionada no MySQL 8.0.1.

- `connection_control_max_connection_delay`: Retardo máximo (em milissegundos) para a resposta do servidor a tentativas de conexão falhas. Adicionado no MySQL 8.0.1.

- `connection_control_min_connection_delay`: Retardo mínimo (em milissegundos) para a resposta do servidor a tentativas de conexão falhas. Adicionado no MySQL 8.0.1.

- `connection_memory_chunk_size`: Atualize a memória de conexão global apenas quando o uso de memória do usuário mudar por essa quantidade ou mais; 0 desativa a atualização. Adicionada no MySQL 8.0.28.

- `connection_memory_limit`: Quantidade máxima de memória que pode ser consumida por qualquer conexão de usuário antes que todas as consultas desse usuário sejam rejeitadas. Não se aplica a usuários do sistema, como o MySQL root. Adicionada no MySQL 8.0.28.

- `create_admin_listener_thread`: Se usar um fio de escuta dedicado para conexões na interface administrativa. Adicionado no MySQL 8.0.14.

- `cte_max_recursion_depth`: Profundidade máxima de recursão da expressão da tabela comum. Adicionada no MySQL 8.0.3.

- `ddl-rewriter`: Se ativar o plugin ddl\_rewriter. Adicionado no MySQL 8.0.16.

- `default_collation_for_utf8mb4`: Colagem padrão para o conjunto de caracteres utf8mb4; para uso interno apenas pela replicação do MySQL. Adicionada no MySQL 8.0.11.

- `default_table_encryption`: Configuração padrão de criptografia de esquema e espaço de tabelas. Adicionada no MySQL 8.0.16.

- `dragnet.Status`: Resultado da atribuição mais recente ao dragnet.log\_error\_filter\_rules. Adicionada no MySQL 8.0.12.

- `dragnet.log_error_filter_rules`: Regras de filtro para registro de erros. Adicionada no MySQL 8.0.4.

- `early-plugin-load`: Especifique plugins para carregar antes de carregar plugins integrados obrigatórios e antes da inicialização do mecanismo de armazenamento. Adicionado no MySQL 8.0.0.

- `enterprise_encryption.maximum_rsa_key_size`: Tamanho máximo de chaves RSA geradas pela MySQL Enterprise Encryption. Adicionada no MySQL 8.0.30.

- `enterprise_encryption.rsa_support_legacy_padding`: Descifre e verifique o conteúdo de criptografia do MySQL Enterprise Legacy. Adicionado no MySQL 8.0.30.

- `explain_format`: Determina o formato de saída padrão usado pelas instruções EXPLAIN. Adicionada no MySQL 8.0.32.

- `generated_random_password_length`: Comprimento máximo das senhas geradas. Adicionada no MySQL 8.0.18.

- `global_connection_memory_limit`: Quantidade total máxima de memória que pode ser consumida por todas as conexões do usuário. Quando excedido pelo Global\_connection\_memory, todas as consultas de usuários regulares são rejeitadas. Não se aplica a usuários do sistema, como o MySQL root. Adicionada no MySQL 8.0.28.

- `global_connection_memory_tracking`: Se calcular ou não o uso da memória de conexão global (como mostrado em Global\_connection\_memory); o padrão é desabilitado. Foi adicionado no MySQL 8.0.28.

- `group_replication_advertise_recovery_endpoints`: Conexões oferecidas para recuperação distribuída. Adicionada no MySQL 8.0.21.

- `group_replication_autorejoin_tries`: Número de tentativas que o membro faz para se reiniciar automaticamente no grupo. Adicionado no MySQL 8.0.16.

- `group_replication_clone_threshold`: Lacuna no número de transação entre o doador e o receptor acima da qual a operação de clonagem remota é usada para transferência de estado. Adicionada no MySQL 8.0.17.

- `group_replication_communication_debug_options`: Nível de mensagens de depuração para componentes de Replicação por Grupo. Adicionado no MySQL 8.0.3.

- `group_replication_communication_max_message_size`: Tamanho máximo da mensagem para comunicações de Replicação em Grupo, mensagens maiores são fragmentadas. Adicionada no MySQL 8.0.16.

- `group_replication_communication_stack`: Especifica qual pilha de comunicação (XCom ou MySQL) deve ser usada para estabelecer conexões de comunicação em grupo entre os membros. Adicionada no MySQL 8.0.27.

- `group_replication_consistency`: Tipo de garantia de consistência da transação que o grupo oferece. Adicionada no MySQL 8.0.14.

- `group_replication_exit_state_action`: Como a instância se comporta quando sai do grupo involuntariamente. Adicionada no MySQL 8.0.12.

- `group_replication_flow_control_hold_percent`: Porcentagem da quota do grupo que permanecerá não utilizada. Adicionada no MySQL 8.0.2.

- `group_replication_flow_control_max_quota`: Quota de controle de fluxo máximo para o grupo. Adicionada no MySQL 8.0.2.

- `group_replication_flow_control_member_quota_percent`: Porcentagem da quota que o membro deve assumir disponível para si mesmo ao calcular as cotas. Adicionada no MySQL 8.0.2.

- `group_replication_flow_control_min_quota`: Menor quota de controle de fluxo que pode ser atribuída por membro. Adicionada no MySQL 8.0.2.

- `group_replication_flow_control_min_recovery_quota`: A menor cotas que podem ser atribuídas por membro, pois outro membro do grupo está se recuperando. Adicionada no MySQL 8.0.2.

- `group_replication_flow_control_period`: Define quantos segundos esperar entre as iterações de controle de fluxo. Adicionado no MySQL 8.0.2.

- `group_replication_flow_control_release_percent`: Como a cotas de grupo devem ser liberadas quando o controle de fluxo não precisa mais restringir os membros do escritor. Adicionada no MySQL 8.0.2.

- `group_replication_ip_allowlist`: Lista de hosts permitidos para se conectar ao grupo (MySQL 8.0.22 e versões posteriores). Adicionada no MySQL 8.0.22.

- `group_replication_member_expel_timeout`: Tempo entre a suspeita de falha do membro do grupo e sua expulsão do grupo, causando a reconfiguração da associação ao grupo. Adicionada no MySQL 8.0.13.

- `group_replication_member_weight`: Probabilidade de este membro ser eleito como primário. Adicionado no MySQL 8.0.2.

- `group_replication_message_cache_size`: Memória máxima para o cache de mensagens do motor de comunicação de grupo (XCom). Adicionada no MySQL 8.0.16.

- `group_replication_paxos_single_leader`: Use um único líder de consenso no modo single-primary. Adicionado no MySQL 8.0.27.

- `group_replication_recovery_compression_algorithms`: Algoritmos de compressão permitidos para conexões de recuperação saindo. Adicionado no MySQL 8.0.18.

- `group_replication_recovery_get_public_key`: Se aceitar a preferência de obter a chave pública do doador. Adicionado no MySQL 8.0.4.

- `group_replication_recovery_public_key_path`: Para aceitar informações de chave pública. Adicionado no MySQL 8.0.4.

- `group_replication_recovery_tls_ciphersuites`: Suítes de cifra permitidas quando o TLSv1.3 é usado para criptografia de conexão com essa instância como cliente (membro associado). Adicionada no MySQL 8.0.19.

- `group_replication_recovery_tls_version`: Protocolos TLS permitidos para criptografia de conexão como cliente (membro associado). Adicionado no MySQL 8.0.19.

- `group_replication_recovery_zstd_compression_level`: Nível de compressão para conexões de recuperação que utilizam compressão zstd. Adicionado no MySQL 8.0.18.

- `group_replication_tls_source`: Fonte de material TLS para a Replicação em Grupo. Adicionada no MySQL 8.0.21.

- `group_replication_unreachable_majority_timeout`: Quanto tempo esperar por partições de rede que resultem na saída de minorias do grupo. Adicionado no MySQL 8.0.2.

- `group_replication_view_change_uuid`: UUID para eventos de alteração de visualização GTIDs. Adicionada no MySQL 8.0.26.

- `histogram_generation_max_mem_size`: Memória máxima para criar estatísticas de histogramas. Adicionada no MySQL 8.0.2.

- `immediate_server_version`: Número de versão do servidor MySQL da fonte de replicação imediata. Foi adicionado no MySQL 8.0.14.

- `information_schema_stats_expiry`: Configuração de expiração para estatísticas de tabelas em cache. Adicionada no MySQL 8.0.3.

- `init_replica`: Declarações que são executadas quando a replica se conecta à fonte. Adicionada no MySQL 8.0.26.

- `innodb-dedicated-server`: Habilita a configuração automática do tamanho do pool de buffers, do tamanho do arquivo de log e do método de esvaziamento. Adicionado no MySQL 8.0.3.

- `innodb_buffer_pool_debug`: Permite múltiplas instâncias do pool de buffers quando o tamanho do pool de buffers é menor que 1 GB. Adicionada no MySQL 8.0.0.

- `innodb_buffer_pool_in_core_file`: Controla a gravação de páginas do pool de buffers em arquivos de núcleo, com padrão OFF (a partir da versão 8.4) em sistemas que suportam MADV\_DONTDUMP. Adicionada no MySQL 8.0.14.

- `innodb_checkpoint_disabled`: Desabilita os pontos de verificação para que a saída deliberada do servidor sempre inicie a recuperação. Adicionada no MySQL 8.0.2.

- `innodb_ddl_buffer_size`: O tamanho máximo do buffer para operações DDL. Adicionada no MySQL 8.0.27.

- `innodb_ddl_log_crash_reset_debug`: Opção de depuração que redefini o número de contagens de injeção de falhas no log de DDL. Adicionada no MySQL 8.0.3.

- `innodb_ddl_threads`: Número máximo de threads paralelas para a criação de índices. Adicionado no MySQL 8.0.27.

- `innodb_deadlock_detect`: Habilita ou desabilita a detecção de travamento. Adicionada no MySQL 8.0.0.

- `innodb_directories`: Define diretórios para varredura no momento do início em busca de arquivos de dados de espaço de tabela. Adicionado no MySQL 8.0.4.

- `innodb_doublewrite_batch_size`: Essa funcionalidade foi substituída por innodb\_doublewrite\_pages. Adicionada no MySQL 8.0.20.

- `innodb_doublewrite_dir`: Diretório do arquivo de buffer de escrita dupla. Adicionado no MySQL 8.0.20.

- `innodb_doublewrite_files`: Número de arquivos de escrita dupla. Adicionado no MySQL 8.0.20.

- `innodb_doublewrite_pages`: Número de páginas de escrita dupla por fio. Adicionada no MySQL 8.0.20.

- `innodb_extend_and_initialize`: Controla como as novas páginas do espaço de tabela são alocadas no Linux. Adicionada no MySQL 8.0.22.

- `innodb_fsync_threshold`: Controla com que frequência o InnoDB chama o fsync ao criar um novo arquivo. Foi adicionado no MySQL 8.0.13.

- `innodb_idle_flush_pct`: Limita as operações de I/O quando o InnoDB está parado. Adicionada no MySQL 8.0.18.

- `innodb_log_checkpoint_fuzzy_now`: Opção de depuração que obriga o InnoDB a escrever um ponto de verificação difuso. Adicionada no MySQL 8.0.13.

- `innodb_log_spin_cpu_abs_lwm`: Quantidade mínima de uso da CPU abaixo da qual os threads do usuário não giram mais enquanto aguardam o redo esvaziado. Adicionada no MySQL 8.0.11.

- `innodb_log_spin_cpu_pct_hwm`: Quantidade máxima de uso da CPU acima da qual os threads do usuário não giram mais enquanto aguardam o redo esvaziado. Adicionada no MySQL 8.0.11.

- `innodb_log_wait_for_flush_spin_hwm`: Tempo médio máximo de esvaziamento do log após o qual os threads do usuário não retornam ao estado de espera enquanto aguardam o redo esvaziado. Adicionado no MySQL 8.0.11.

- `innodb_log_writer_threads`: Habilita threads dedicadas para gravação de logs para gravação e esvaziamento de logs de refazer. Adicionada no MySQL 8.0.22.

- `innodb_parallel_read_threads`: Número de threads para leituras de índice paralelas. Adicionado no MySQL 8.0.14.

- `innodb_print_ddl_logs`: Se os logs de DDL devem ou não ser impressos no log de erro. Adicionado no MySQL 8.0.3.

- `innodb_redo_log_archive_dirs`: Diretórios de arquivo de registro de revisão rotulados. Adicionado no MySQL 8.0.17.

- `innodb_redo_log_capacity`: Limite de tamanho para arquivos de log de refazer. Adicionado no MySQL 8.0.30.

- `innodb_redo_log_encrypt`: Controla a criptografia dos dados do log de revisão para espaços de tabela criptografados. Adicionado no MySQL 8.0.1.

- `innodb_scan_directories`: Define diretórios para varredura de arquivos de espaço de tabela durante a recuperação do InnoDB. Adicionada no MySQL 8.0.2.

- `innodb_segment_reserve_factor`: A porcentagem de páginas de segmentos de espaço de tabela reservadas como páginas vazias. Adicionada no MySQL 8.0.26.

- `innodb_spin_wait_pause_multiplier`: Valor do multiplicador usado para determinar o número de instruções PAUSE em loops de espera de rotação. Adicionado no MySQL 8.0.16.

- `innodb_stats_include_delete_marked`: Inclua registros marcados para exclusão ao calcular estatísticas persistentes do InnoDB. Adicionado no MySQL 8.0.1.

- `innodb_temp_tablespaces_dir`: Caminho das tabelas temporárias de sessão. Adicionado no MySQL 8.0.13.

- `innodb_tmpdir`: Local de diretório para arquivos de tabela temporários criados durante operações de ALTER TABLE online. Adicionada no MySQL 8.0.0.

- `innodb_undo_log_encrypt`: Controla a criptografia dos dados do log de desfazer para espaços de tabela criptografados. Adicionada no MySQL 8.0.1.

- `innodb_use_fdatasync`: Se o InnoDB usa fdatasync() em vez de fsync() ao descartar dados para o sistema operacional. Adicionado no MySQL 8.0.26.

- `innodb_validate_tablespace_paths`: Habilita a validação do caminho do espaço de tabela no início. Adicionada no MySQL 8.0.21.

- `internal_tmp_mem_storage_engine`: Motor de armazenamento a ser usado para tabelas temporárias internas em memória. Adicionado no MySQL 8.0.2.

- `keyring-migration-destination`: Plugin de chave de registro de destino de migração. Adicionado no MySQL 8.0.4.

- `keyring-migration-host`: Nome do host para a conexão com o servidor em execução para migração de chaves. Adicionado no MySQL 8.0.4.

- `keyring-migration-password`: Senha para se conectar ao servidor em execução para migração de chaves. Adicionada no MySQL 8.0.4.

- `keyring-migration-port`: Número da porta TCP/IP para conectar-se ao servidor em execução para migração de chaves. Adicionado no MySQL 8.0.4.

- `keyring-migration-socket`: Arquivo de socket Unix ou tubo nomeado do Windows para conectar-se ao servidor em execução para migração de chaves. Adicionado no MySQL 8.0.4.

- `keyring-migration-source`: Plugin de chave de criptografia de chave de origem de migração. Adicionado no MySQL 8.0.4.

- `keyring-migration-to-component`: A migração do keyring passou de um plugin para um componente. Foi adicionada no MySQL 8.0.24.

- `keyring-migration-user`: Nome do usuário para conectar ao servidor em execução para migração de chaves. Adicionado no MySQL 8.0.4.

- `keyring_aws_cmk_id`: ID do valor da chave mestre do cliente do plugin do chaveiro da AWS. Adicionada no MySQL 8.0.11.

- `keyring_aws_conf_file`: Localização do arquivo de configuração do plugin do chaveiro da AWS. Adicionada no MySQL 8.0.11.

- `keyring_aws_data_file`: Localização do arquivo de armazenamento do plugin de chaveira do AWS. Adicionada no MySQL 8.0.11.

- `keyring_aws_region`: Região do plugin de chave de segurança da AWS. Adicionada no MySQL 8.0.11.

- `keyring_encrypted_file_data`: arquivo de dados do plugin keyring\_encrypted\_file. Adicionado no MySQL 8.0.11.

- `keyring_encrypted_file_password`: senha do plugin keyring\_encrypted\_file. Adicionada no MySQL 8.0.11.

- `keyring_hashicorp_auth_path`: Caminho de autenticação do AppRole do HashiCorp Vault. Adicionado no MySQL 8.0.18.

- `keyring_hashicorp_ca_path`: Caminho para o arquivo CA keyring\_hashicorp. Adicionado no MySQL 8.0.18.

- `keyring_hashicorp_caching`: Se habilitar o armazenamento em cache keyring\_hashicorp. Adicionado no MySQL 8.0.18.

- `keyring_hashicorp_commit_auth_path`: O valor `keyring_hashicorp_auth_path` está em uso. Foi adicionado no MySQL 8.0.18.

- `keyring_hashicorp_commit_ca_path`: O caminho do certificado CA do keyring\_hashicorp\_ca está em uso. Foi adicionado no MySQL 8.0.18.

- `keyring_hashicorp_commit_caching`: valor de keyring\_hashicorp\_caching em uso. Adicionado no MySQL 8.0.18.

- `keyring_hashicorp_commit_role_id`: valor `keyring_hashicorp_role_id` em uso. Adicionado no MySQL 8.0.18.

- `keyring_hashicorp_commit_server_url`: valor keyring\_hashicorp\_server\_url em uso. Adicionado no MySQL 8.0.18.

- `keyring_hashicorp_commit_store_path`: caminho do armazenamento keyring\_hashicorp\_store\_path em uso. Adicionado no MySQL 8.0.18.

- `keyring_hashicorp_role_id`: ID da função de autenticação HashiCorp Vault AppRole. Adicionada no MySQL 8.0.18.

- `keyring_hashicorp_secret_id`: ID do segredo de autenticação do AppRole do HashiCorp Vault. Adicionada no MySQL 8.0.18.

- `keyring_hashicorp_server_url`: URL do servidor HashiCorp Vault. Adicionada no MySQL 8.0.18.

- `keyring_hashicorp_store_path`: Caminho da loja HashiCorp Vault. Adicionado no MySQL 8.0.18.

- `keyring_oci_ca_certificate`: Arquivo de certificado CA para autenticação de pares. Adicionado no MySQL 8.0.22.

- `keyring_oci_compartment`: Compartimento OCI OCID. Adicionado no MySQL 8.0.22.

- `keyring_oci_encryption_endpoint`: Ponto de extremidade do servidor de criptografia OCI. Adicionado no MySQL 8.0.22.

- `keyring_oci_key_file`: Arquivo de chave privada RSA do OCI. Adicionada no MySQL 8.0.22.

- `keyring_oci_key_fingerprint`: Impressão digital do arquivo de chave privada RSA do OCI. Adicionada no MySQL 8.0.22.

- `keyring_oci_management_endpoint`: Ponto de extremidade do servidor de gerenciamento do OCI. Adicionado no MySQL 8.0.22.

- `keyring_oci_master_key`: Chave mestre OCI OCID. Adicionada no MySQL 8.0.22.

- `keyring_oci_secrets_endpoint`: Ponto de extremidade do servidor de segredos do OCI. Adicionado no MySQL 8.0.22.

- `keyring_oci_tenancy`: OCI tenancy OCID. Adicionada no MySQL 8.0.22.

- `keyring_oci_user`: O usuário OCI OCID. Adicionado no MySQL 8.0.22.

- `keyring_oci_vaults_endpoint`: Ponto de extremidade do servidor de cofres OCI. Adicionado no MySQL 8.0.22.

- `keyring_oci_virtual_vault`: OCI vault OCID. Adicionada no MySQL 8.0.22.

- `keyring_okv_conf_dir`: Diretório de configuração do plugin de chave do Oracle Key Vault. Adicionado no MySQL 8.0.11.

- `keyring_operations`: Se as operações do chaveiro estão habilitadas. Adicionado no MySQL 8.0.4.

- `lock_order`: Se ativar ou não a ferramenta LOCK\_ORDER no tempo de execução. Adicionada no MySQL 8.0.17.

- `lock_order_debug_loop`: Se deve causar uma asserção de depuração quando a ferramenta LOCK\_ORDER encontra uma dependência marcada como ciclo. Adicionada no MySQL 8.0.17.

- `lock_order_debug_missing_arc`: Se deve causar uma asserção de depuração quando a ferramenta LOCK\_ORDER encontrar uma dependência não declarada. Adicionada no MySQL 8.0.17.

- `lock_order_debug_missing_key`: Se deve causar uma asserção de depuração quando a ferramenta LOCK\_ORDER encontrar um objeto que não está corretamente instrumentado com o Gerenciador de Desempenho. Adicionada no MySQL 8.0.17.

- `lock_order_debug_missing_unlock`: Se deve causar uma asserção de depuração quando a ferramenta LOCK\_ORDER encontra uma chave de bloqueio que é destruída enquanto ainda está sendo mantida. Adicionada no MySQL 8.0.17.

- `lock_order_dependencies`: Caminho para o arquivo lock\_order\_dependencies.txt. Adicionado no MySQL 8.0.17.

- `lock_order_extra_dependencies`: Caminho para o segundo arquivo de dependência. Adicionada no MySQL 8.0.17.

- `lock_order_output_directory`: Diretório onde a ferramenta LOCK\_ORDER grava logs. Adicionada no MySQL 8.0.17.

- `lock_order_print_txt`: Se executar a análise do gráfico de ordem de bloqueio e imprimir o relatório textual. Adicionado no MySQL 8.0.17.

- `lock_order_trace_loop`: Se deve imprimir a traça do arquivo de log quando a ferramenta LOCK\_ORDER encontrar uma dependência marcada como ciclo. Adicionada no MySQL 8.0.17.

- `lock_order_trace_missing_arc`: Se deve imprimir a traça do arquivo de log quando a ferramenta LOCK\_ORDER encontrar uma dependência não declarada. Adicionada no MySQL 8.0.17.

- `lock_order_trace_missing_key`: Se deve imprimir o registro do arquivo de depuração quando a ferramenta LOCK\_ORDER encontrar um objeto que não está corretamente instrumentado com o Gerenciador de Desempenho. Adicionada no MySQL 8.0.17.

- `lock_order_trace_missing_unlock`: Se deve imprimir a traça do arquivo de log quando a ferramenta LOCK\_ORDER encontrar uma trava que está sendo destruída, mas ainda está sendo mantida. Adicionada no MySQL 8.0.17.

- `log_error_filter_rules`: Regras de filtro para registro de erros. Adicionada no MySQL 8.0.2.

- `log_error_services`: Componentes a serem usados para registro de erros. Adicionado no MySQL 8.0.2.

- `log_error_suppression_list`: Mensagens de log de erros de aviso/informação para suprimir. Adicionada no MySQL 8.0.13.

- `log_replica_updates`: Se a replica deve registrar as atualizações realizadas pelo seu fio de replicação SQL no seu próprio log binário. Adicionada no MySQL 8.0.26.

- `log_slow_extra`: Se deve escrever informações extras para o arquivo de log de consulta lenta. Adicionado no MySQL 8.0.14.

- `log_slow_replica_statements`: As declarações lentas executadas pela replica serão escritas no log de consulta lenta. Adicionado no MySQL 8.0.26.

- `mandatory_roles`: Rotas concedidas automaticamente para todos os usuários. Adicionada no MySQL 8.0.2.

- `mysql_firewall_mode`: Se o plugin do Firewall Empresarial do MySQL está operacional. Adicionado no MySQL 8.0.11.

- `mysql_firewall_trace`: Se ativar o rastreamento do plugin do Firewall Empresarial do MySQL. Adicionado no MySQL 8.0.11.

- `mysqlx`: Se o X Plugin está inicializado. Adicionado no MySQL 8.0.11.

- `mysqlx_compression_algorithms`: Algoritmos de compressão permitidos para conexões com o Protocolo X. Adicionado no MySQL 8.0.19.

- `mysqlx_deflate_default_compression_level`: Nível de compressão padrão para o algoritmo Deflate em conexões do Protocolo X. Adicionado no MySQL 8.0.20.

- `mysqlx_deflate_max_client_compression_level`: Nível máximo de compressão permitido para o algoritmo Deflate em conexões do Protocolo X. Adicionado no MySQL 8.0.20.

- `mysqlx_interactive_timeout`: Número de segundos para aguardar o tempo de expiração de clientes interativos. Adicionado no MySQL 8.0.4.

- `mysqlx_lz4_default_compression_level`: Nível de compressão padrão para o algoritmo LZ4 em conexões do Protocolo X. Adicionado no MySQL 8.0.20.

- `mysqlx_lz4_max_client_compression_level`: Nível máximo de compressão permitido para o algoritmo LZ4 em conexões do Protocolo X. Adicionado no MySQL 8.0.20.

- `mysqlx_read_timeout`: Número de segundos para esperar que as operações de leitura bloqueadas sejam concluídas. Adicionado no MySQL 8.0.4.

- `mysqlx_wait_timeout`: Número de segundos para esperar por atividade da conexão. Adicionado no MySQL 8.0.4.

- `mysqlx_write_timeout`: Número de segundos para aguardar a conclusão das operações de escrita bloqueadas. Adicionado no MySQL 8.0.4.

- `mysqlx_zstd_default_compression_level`: Nível de compressão padrão para o algoritmo zstd em conexões do X Protocol. Adicionado no MySQL 8.0.20.

- `mysqlx_zstd_max_client_compression_level`: Nível máximo de compressão permitido para o algoritmo zstd em conexões do Protocolo X. Adicionado no MySQL 8.0.20.

- `named_pipe_full_access_group`: Nome do grupo do Windows que recebeu acesso total ao tubo nomeado. Adicionado no MySQL 8.0.14.

- `no-dd-upgrade`: Impedir a atualização automática das tabelas do dicionário de dados ao iniciar. Adicionado no MySQL 8.0.4.

- `no-monitor`: Não é necessário criar um processo de monitoramento para o RESTART. Foi adicionado no MySQL 8.0.12.

- `original_commit_timestamp`: Hora em que a transação foi confirmada na fonte original. Adicionada no MySQL 8.0.1.

- `original_server_version`: Número de versão do servidor MySQL no qual a transação foi originalmente comprometida. Foi adicionado no MySQL 8.0.14.

- `partial_revokes`: Se a revogação parcial está habilitada. Adicionada no MySQL 8.0.16.

- `password_history`: Número de alterações de senha necessárias antes da reutilização da senha. Adicionada no MySQL 8.0.3.

- `password_require_current`: Se as alterações de senha exigem a verificação da senha atual. Adicionado no MySQL 8.0.13.

- `password_reuse_interval`: Número de dias necessários antes da reutilização da senha. Adicionado no MySQL 8.0.3.

- `performance-schema-consumer-events-statements-cpu`: Configure o consumidor de uso de CPU da declaração. Adicionado no MySQL 8.0.28.

- `performance_schema_max_digest_sample_age`: Pergunta para resample a idade em segundos. Adicionada no MySQL 8.0.3.

- `performance_schema_show_processlist`: Selecione a implementação SHOW PROCESSLIST. Adicionada no MySQL 8.0.22.

- `persist_only_admin_x509_subject`: Certificado SSL X.509 do sujeito que permite a persistência de variáveis de sistema restritas a persistência. Adicionado no MySQL 8.0.14.

- `persist_sensitive_variables_in_plaintext`: Se o servidor está autorizado a armazenar os valores das variáveis de sistema sensíveis em um formato não criptografado. Adicionado no MySQL 8.0.29.

- `persisted_globals_load`: Se carregar as configurações de configuração persistentes. Adicionado no MySQL 8.0.0.

- `print_identified_with_as_hex`: Para a opção SHOW CREATE USER, imprima os valores de hash que contêm caracteres não imprimíveis em hexadecimal. Adicionada no MySQL 8.0.17.

- `protocol_compression_algorithms`: Algoritmos de compressão permitidos para conexões de entrada. Adicionado no MySQL 8.0.18.

- `pseudo_replica_mode`: Para uso em servidores internos. Adicionado no MySQL 8.0.26.

- `regexp_stack_limit`: Limite de tamanho da pilha de correspondência de expressão regular. Adicionada no MySQL 8.0.4.

- `regexp_time_limit`: Limite de tempo de correspondência com expressão regular. Adicionada no MySQL 8.0.4.

- `replica_checkpoint_group`: Número máximo de transações processadas por replica multithread antes que a operação de verificação de ponto seja chamada para atualizar o status do progresso. Não é suportado pelo NDB Cluster. Adicionada no MySQL 8.0.26.

- `replica_checkpoint_period`: Atualize o status do progresso da replica multithreading e limpe as informações do log do retransmissor no disco após este número de milissegundos. Não é suportado pelo NDB Cluster. Adicionada no MySQL 8.0.26.

- `replica_compressed_protocol`: Use a compressão do protocolo de origem/replica. Adicionada no MySQL 8.0.26.

- `replica_exec_mode`: Permite alternar o fio de replicação entre o modo IDEMPOTENT (chave e alguns outros erros suprimidos) e o modo STRICT; o modo STRICT é padrão, exceto para o NDB Cluster, onde o IDEMPOTENT é sempre usado. Adicionado no MySQL 8.0.26.

- `replica_load_tmpdir`: Local onde a replica deve colocar seus arquivos temporários ao replicar as instruções LOAD DATA. Adicionada no MySQL 8.0.26.

- `replica_max_allowed_packet`: Tamanho máximo, em bytes, do pacote que pode ser enviado do servidor de origem da replicação para a replica; substitui max\_allowed\_packet. Adicionada no MySQL 8.0.26.

- `replica_net_timeout`: Número de segundos para esperar por mais dados da conexão de origem/replica antes de abortar a leitura. Adicionado no MySQL 8.0.26.

- `replica_parallel_type`: Diz à replica para usar informações de data e hora (CLOCK\_LOGICAL) ou particionamento de banco de dados (DATABASE) para paralelizar as transações. Adicionado no MySQL 8.0.26.

- `replica_parallel_workers`: Número de threads do aplicativo para executar transações de replicação. NDB Cluster: consulte a documentação. Adicionada no MySQL 8.0.26.

- `replica_pending_jobs_size_max`: Tamanho máximo das filas de trabalhadores de replicação que armazenam eventos ainda não aplicados. Adicionado no MySQL 8.0.26.

- `replica_preserve_commit_order`: Garante que todos os commits dos trabalhadores replicados ocorram na mesma ordem que no banco de origem para manter a consistência ao usar threads do aplicador paralelo. Adicionado no MySQL 8.0.26.

- `replica_skip_errors`: Diz ao fio de replicação para continuar a replicação quando a consulta retorna um erro da lista fornecida. Adicionada no MySQL 8.0.26.

- `replica_sql_verify_checksum`: Faça com que a replica examine os checksums ao ler o log do relé. Adicionada no MySQL 8.0.26.

- `replica_transaction_retries`: Número de vezes que o fio de replicação do SQL tenta novamente a transação caso ela falhe com um deadlock ou o tempo limite de espera de bloqueio tenha expirado, antes de desistir e parar. Adicionado no MySQL 8.0.26.

- `replica_type_conversions`: Controla o modo de conversão de tipo na replica. O valor é uma lista de zero ou mais elementos desta lista: ALL\_LOSSY, ALL\_NON\_LOSSY. Defina como uma string vazia para impedir conversões de tipo entre a fonte e a replica. Adicionada no MySQL 8.0.26.

- `replication_optimize_for_static_plugin_config`: Lâminas compartilhadas para replicação semiesincrônica. Adicionada no MySQL 8.0.23.

- `replication_sender_observe_commit_only`: Chamadas de retorno limitadas para replicação semi-sincronizada. Adicionada no MySQL 8.0.23.

- `require_row_format`: Para uso em servidores internos. Adicionado no MySQL 8.0.19.

- `resultset_metadata`: Se o servidor retorna o metadado do conjunto de resultados. Adicionado no MySQL 8.0.3.

- `rewriter_enabled_for_threads_without_privilege_checks`: Se estiver definido como OFF, as reescritas são ignoradas para os threads de replicação que executam com verificações de privilégio desativadas (PRIVILEGE\_CHECKS\_USER é NULL). Adicionada no MySQL 8.0.31.

- `rpl_read_size`: Defina o valor mínimo de dados em bytes que será lido dos arquivos de log binários e dos arquivos de log de retransmissão. Adicionado no MySQL 8.0.11.

- `rpl_semi_sync_replica_enabled`: Se a replicação semi-sincronizada estiver habilitada no replica. Adicionada no MySQL 8.0.26.

- `rpl_semi_sync_replica_trace_level`: Nível de rastreamento de depuração da replicação semiesincronizada. Adicionado no MySQL 8.0.26.

- `rpl_semi_sync_source_enabled`: Se a replicação semi-sincronizada estiver habilitada na fonte. Adicionada no MySQL 8.0.26.

- `rpl_semi_sync_source_timeout`: Número de milissegundos para aguardar o reconhecimento da replica. Adicionado no MySQL 8.0.26.

- `rpl_semi_sync_source_trace_level`: Nível de rastreamento de depuração da replicação semiesincronizada na fonte. Adicionado no MySQL 8.0.26.

- `rpl_semi_sync_source_wait_for_replica_count`: Número de confirmações de replicação que a fonte deve receber por transação antes de prosseguir. Adicionado no MySQL 8.0.26.

- `rpl_semi_sync_source_wait_no_replica`: Se a fonte aguarda o tempo limite mesmo sem réplicas. Adicionada no MySQL 8.0.26.

- `rpl_semi_sync_source_wait_point`: Ponto de espera para o reconhecimento da recepção da transação replicada. Adicionado no MySQL 8.0.26.

- `rpl_stop_replica_timeout`: Número de segundos que o STOP REPLICA aguarda antes de expirar. Adicionado no MySQL 8.0.26.

- `schema_definition_cache`: Número de objetos de definição de esquema que podem ser mantidos no cache do objeto dicionário. Adicionado no MySQL 8.0.0.

- `secondary_engine_cost_threshold`: Limiar de custo do otimizador para a transferência de consultas para um motor secundário. Adicionado no MySQL 8.0.16.

- `select_into_buffer_size`: Tamanho do buffer usado para o arquivo de exportação OUTFILE ou DUMPFILE; substitui read\_buffer\_size. Adicionada no MySQL 8.0.22.

- `select_into_disk_sync`: Sincronize dados com o dispositivo de armazenamento após o esvaziamento do buffer para o arquivo de exportação OUTFILE ou DUMPFILE; DESATIVAR desativa a sincronização e é o valor padrão. Adicionada no MySQL 8.0.22.

- `select_into_disk_sync_delay`: Quando select\_into\_sync\_disk = ON, define o atraso em milissegundos após cada sincronização do buffer de arquivo de exportação OUTFILE ou DUMPFILE, sem efeito caso contrário. Adicionado no MySQL 8.0.22.

- `show-replica-auth-info`: Mostrar o nome do usuário e a senha na opção "Mostrar réplicas" nesta fonte. Adicionada no MySQL 8.0.26.

- `show_create_table_skip_secondary_engine`: Se deve excluir a cláusula SECONDARY ENGINE do resultado da consulta SHOW CREATE TABLE. Adicionada no MySQL 8.0.18.

- `show_create_table_verbosity`: Se deve exibir o ROW\_FORMAT em SHOW CREATE TABLE, mesmo que tenha um valor padrão. Adicionado no MySQL 8.0.11.

- `show_gipk_in_create_table_and_information_schema`: Se as chaves primárias primárias invisíveis geradas são exibidas em declarações SHOW e em tabelas do INFORMATION\_SCHEMA. Adicionada no MySQL 8.0.30.

- `skip-replica-start`: Se definido, a replicação não é iniciada automaticamente quando o servidor de replicação é iniciado. Adicionada no MySQL 8.0.26.

- `source_verify_checksum`: Faça com que a fonte examine os checksums ao ler o log binário. Adicionada no MySQL 8.0.26.

- `sql_generate_invisible_primary_key`: Se deve gerar chaves primárias invisíveis para quaisquer tabelas InnoDB criadas neste servidor e que não possuem PKs explícitos. Adicionado no MySQL 8.0.30.

- `sql_replica_skip_counter`: Número de eventos da fonte que a replicação deve ignorar. Não é compatível com a replicação GTID. Adicionada no MySQL 8.0.26.

- `sql_require_primary_key`: Se as tabelas devem ter uma chave primária. Adicionado no MySQL 8.0.13.

- `ssl_fips_mode`: Se habilitar o modo FIPS no lado do servidor. Adicionado no MySQL 8.0.11.

- `ssl_session_cache_mode`: Se deve habilitar a geração de tickets de sessão pelo servidor. Adicionado no MySQL 8.0.29.

- `ssl_session_cache_timeout`: Valor do tempo limite da sessão SSL em segundos. Adicionado no MySQL 8.0.29.

- `sync_source_info`: Sincronize as informações de origem após cada evento a cada # evento. Adicionada no MySQL 8.0.26.

- `syseventlog.facility`: Instalação para mensagens syslog. Adicionada no MySQL 8.0.13.

- `syseventlog.include_pid`: Se incluir o PID do servidor nas mensagens do syslog. Adicionado no MySQL 8.0.13.

- `syseventlog.tag`: Marca para o identificador do servidor nas mensagens do syslog. Adicionada no MySQL 8.0.13.

- `table_encryption_privilege_check`: Habilita a verificação do privilégio TABLE\_ENCRYPTION\_ADMIN. Adicionada no MySQL 8.0.16.

- `tablespace_definition_cache`: Número de objetos de definição de espaço de tabela que podem ser mantidos no cache do objeto dicionário. Adicionado no MySQL 8.0.0.

- `temptable_max_mmap`: O valor máximo de memória que o mecanismo de armazenamento TempTable pode alocar a partir de arquivos temporários mapeados na memória. Adicionado no MySQL 8.0.23.

- `temptable_max_ram`: Define o valor máximo de memória que o mecanismo de armazenamento TempTable pode ocupar antes de os dados serem armazenados no disco. Adicionado no MySQL 8.0.2.

- `temptable_use_mmap`: Define se o mecanismo de armazenamento TempTable aloca arquivos mapeados na memória quando o limite temptable\_max\_ram é atingido. Adicionado no MySQL 8.0.16.

- `terminology_use_previous`: Use a terminologia da versão anterior especificada quando as alterações forem incompatíveis. Adicionada no MySQL 8.0.26.

- `thread_pool_algorithm`: Algoritmo de pool de threads. Adicionado no MySQL 8.0.11.

- `thread_pool_dedicated_listeners`: Dedica uma thread de escuta em cada grupo de threads para ouvir eventos de rede. Adicionada no MySQL 8.0.23.

- `thread_pool_high_priority_connection`: Se a sessão atual é de alta prioridade. Adicionado no MySQL 8.0.11.

- `thread_pool_max_active_query_threads`: Número máximo de threads de consulta ativas por grupo. Adicionada no MySQL 8.0.19.

- `thread_pool_max_transactions_limit`: Número máximo de transações permitidas durante a operação do pool de threads. Adicionada no MySQL 8.0.23.

- `thread_pool_max_unused_threads`: Número máximo permitido de fios não utilizados. Adicionado no MySQL 8.0.11.

- `thread_pool_prio_kickup_timer`: Quanto tempo antes a declaração é movida para execução de alta prioridade. Adicionada no MySQL 8.0.11.

- `thread_pool_query_threads_per_group`: Número máximo de threads de consulta para um grupo de threads. Adicionado no MySQL 8.0.31.

- `thread_pool_size`: Número de grupos de threads no pool de threads. Adicionado no MySQL 8.0.11.

- `thread_pool_stall_limit`: Quanto tempo antes a declaração é definida como travada. Adicionada no MySQL 8.0.11.

- `thread_pool_transaction_delay`: Período de atraso antes que o pool de threads execute uma nova transação. Adicionado no MySQL 8.0.31.

- `tls_ciphersuites`: Suítes de criptografia TLSv1.3 permitidas para conexões criptografadas. Adicionada no MySQL 8.0.16.

- `upgrade`: Controle a atualização automática ao iniciar. Adicionado no MySQL 8.0.16.

- `use_secondary_engine`: Se executar consultas usando um motor secundário. Adicionado no MySQL 8.0.13.

- `validate-config`: Valide a configuração do servidor. Adicionada no MySQL 8.0.16.

- `validate_password.changed_characters_percentage`: Porcentagem mínima de caracteres alterados necessária para novas senhas. Adicionada no MySQL 8.0.34.

- `validate_password.check_user_name`: Se deve verificar as senhas contra o nome do usuário. Adicionada no MySQL 8.0.4.

- `validate_password.dictionary_file`: arquivo de dicionário validate\_password. Adicionado no MySQL 8.0.4.

- `validate_password.dictionary_file_last_parsed`: Data da última análise do arquivo de dicionário. Adicionada no MySQL 8.0.4.

- `validate_password.dictionary_file_words_count`: Número de palavras no arquivo de dicionário. Adicionada no MySQL 8.0.4.

- `validate_password.length`: validate\_password exigiu comprimento da senha. Foi adicionado no MySQL 8.0.4.

- `validate_password.mixed_case_count`: é necessário o número de caracteres maiúsculos/minúsculos para validar a senha. Foi adicionado no MySQL 8.0.4.

- `validate_password.number_count`: é necessário o número de caracteres numéricos para validar a senha. Foi adicionado no MySQL 8.0.4.

- `validate_password.policy`: validate\_password política de senha. Adicionada no MySQL 8.0.4.

- `validate_password.special_char_count`: é necessário o número de caracteres especiais para validar a senha. Foi adicionado no MySQL 8.0.4.

- `version_compile_zlib`: Versão da biblioteca zlib compilada. Adicionada no MySQL 8.0.11.

- `windowing_use_high_precision`: Se calcular funções de janela com alta precisão. Adicionado no MySQL 8.0.2.

### Opções e variáveis descontinuadas no MySQL 8.0

As seguintes variáveis de sistema, variáveis de status e opções foram descontinuadas no MySQL 8.0.

- `Compression`: Se a conexão do cliente usa compressão no protocolo cliente/servidor. Desatualizado no MySQL 8.0.18.

- `Rpl_semi_sync_master_clients`: Número de réplicas semi-síncronas. Desatualizado no MySQL 8.0.26.

- `Rpl_semi_sync_master_net_avg_wait_time`: Tempo médio que a fonte de dados esperou por respostas da réplica. Desatualizado no MySQL 8.0.26.

- `Rpl_semi_sync_master_net_wait_time`: O tempo total que a fonte de tempo esperou por respostas da réplica. Desatualizado no MySQL 8.0.26.

- `Rpl_semi_sync_master_net_waits`: Número total de vezes que a fonte esperou por respostas da réplica. Desatualizado no MySQL 8.0.26.

- `Rpl_semi_sync_master_no_times`: Número de vezes que a replicação semiesincronizada foi desligada pela fonte. Desatualizado no MySQL 8.0.26.

- `Rpl_semi_sync_master_no_tx`: Número de commits não reconhecidos com sucesso. Desatualizado no MySQL 8.0.26.

- `Rpl_semi_sync_master_status`: Se a replicação semi-sincronizada estiver operacional na fonte. Desatualizada no MySQL 8.0.26.

- `Rpl_semi_sync_master_timefunc_failures`: Número de vezes que a fonte falhou ao chamar funções de tempo. Desatualizado no MySQL 8.0.26.

- `Rpl_semi_sync_master_tx_avg_wait_time`: Tempo médio que a fonte esperou por cada transação. Desatualizado no MySQL 8.0.26.

- `Rpl_semi_sync_master_tx_wait_time`: Tempo total que a fonte de transações esperou. Desatualizado no MySQL 8.0.26.

- `Rpl_semi_sync_master_tx_waits`: Número total de vezes que a fonte esperou por transações. Desatualizado no MySQL 8.0.26.

- `Rpl_semi_sync_master_wait_pos_backtraverse`: Número total de vezes que a fonte esperou por um evento com coordenadas binárias inferiores às coordenadas binárias dos eventos esperados anteriormente. Desatualizado no MySQL 8.0.26.

- `Rpl_semi_sync_master_wait_sessions`: Número de sessões atualmente aguardando respostas replicadas. Desatualizado no MySQL 8.0.26.

- `Rpl_semi_sync_master_yes_tx`: Número de commits reconhecidos com sucesso. Desatualizado no MySQL 8.0.26.

- `Rpl_semi_sync_slave_status`: Se a replicação semi-sincronizada estiver operacional em replica. Desatualizada no MySQL 8.0.26.

- `Rsa_public_key`: valor da chave pública RSA do plugin de autenticação sha256\_password. Desatualizado no MySQL 8.0.16.

- `Slave_open_temp_tables`: Número de tabelas temporárias que o thread de replicação SQL atualmente tem aberto. Desatualizado no MySQL 8.0.26.

- `Slave_rows_last_search_algorithm_used`: Algoritmo de pesquisa mais recentemente utilizado por esta replica para localizar linhas para replicação baseada em linhas (índice, tabela ou varredura hash). Desatualizado no MySQL 8.0.26.

- `abort-slave-event-count`: Opção usada pelo mysql-test para depuração e teste de replicação. Desatualizada no MySQL 8.0.29.

- `admin-ssl`: Habilitar a criptografia de conexão. Desatualizado no MySQL 8.0.26.

- `audit_log_connection_policy`: Política de registro de auditoria para eventos relacionados à conexão. Desatualizada no MySQL 8.0.34.

- `audit_log_exclude_accounts`: Contas que não serão auditadas. Desatualizado no MySQL 8.0.34.

- `audit_log_include_accounts`: Contas para auditoria. Desatualizado no MySQL 8.0.34.

- `audit_log_policy`: Política de registro de auditoria. Desatualizada no MySQL 8.0.34.

- `audit_log_statement_policy`: Política de registro de auditoria para eventos relacionados a declarações. Desatualizada no MySQL 8.0.34.

- `authentication_fido_rp_id`: ID do destinatário para autenticação multifator FIDO. Desatualizado no MySQL 8.0.35.

- `binlog_format`: Especifica o formato do log binário. Desatualizado no MySQL 8.0.34.

- `binlog_transaction_dependency_tracking`: Fonte de informações de dependência (marcadores de commit ou conjuntos de escrita de transações) a partir da qual se pode avaliar quais transações podem ser executadas em paralelo pelo aplicativo multithread da replica. Desatualizado no MySQL 8.0.35.

- `character-set-client-handshake`: Não ignore o valor do conjunto de caracteres do lado do cliente enviado durante o handshake. Desatualizado no MySQL 8.0.35.

- `daemon_memcached_enable_binlog`: . Desatualizado no MySQL 8.0.22.

- `daemon_memcached_engine_lib_name`: Biblioteca compartilhada que implementa o plugin memcached do InnoDB. Desatualizada no MySQL 8.0.22.

- `daemon_memcached_engine_lib_path`: Diretório que contém a biblioteca compartilhada que implementa o plugin memcached do InnoDB. Desatualizado no MySQL 8.0.22.

- `daemon_memcached_option`: Opções separadas por espaços que são passadas ao daemon subjacente do memcached durante a inicialização. Desatualizado no MySQL 8.0.22.

- `daemon_memcached_r_batch_size`: Especifica quantas operações de leitura do memcached devem ser realizadas antes de realizar o COMMIT para iniciar uma nova transação. Desatualizado no MySQL 8.0.22.

- `daemon_memcached_w_batch_size`: Especifica quantas operações de escrita no Memcached devem ser realizadas antes de realizar o COMMIT para iniciar uma nova transação. Desatualizado no MySQL 8.0.22.

- `default_authentication_plugin`: Plugin de autenticação padrão. Desatualizado no MySQL 8.0.27.

- `disconnect-slave-event-count`: Opção usada pelo mysql-test para depuração e teste de replicação. Desatualizada no MySQL 8.0.29.

- `expire_logs_days`: Limpe os logs binários após quantos dias. Desatualizado no MySQL 8.0.3.

- `group_replication_ip_whitelist`: Lista de hosts permitidos para se conectarem ao grupo. Desatualizado no MySQL 8.0.22.

- `group_replication_primary_member`: UUID do membro primário quando o grupo opera no modo único primário. String vazia se o grupo estiver operando no modo multi-primário. Desatualizado no MySQL 8.0.4.

- `group_replication_recovery_complete_at`: Políticas de recuperação ao lidar com transações em cache após a transferência de estado. Desatualizado no MySQL 8.0.34.

- `have_openssl`: Se o mysqld suporta conexões SSL. Desatualizado no MySQL 8.0.26.

- `have_ssl`: Se o mysqld suporta conexões SSL. Desatualizado no MySQL 8.0.26.

- `init_slave`: Declarações que são executadas quando a replica se conecta à fonte. Desatualizado no MySQL 8.0.26.

- `innodb_api_bk_commit_interval`: Com que frequência comprometer automaticamente conexões ociosas que utilizam a interface InnoDB memcached, em segundos. Desatualizado no MySQL 8.0.22.

- `innodb_api_disable_rowlock`: . Desatualizado no MySQL 8.0.22.

- `innodb_api_enable_binlog`: Permite o uso do plugin InnoDB memcached com o log binário do MySQL. Desatualizado no MySQL 8.0.22.

- `innodb_api_enable_mdl`: Bloqueia a tabela usada pelo plugin memcached do InnoDB, para que não possa ser removida ou alterada por DDL através da interface SQL. Desatualizado no MySQL 8.0.22.

- `innodb_api_trx_level`: Permite o controle do nível de isolamento de transação em consultas processadas pela interface memcached. Desatualizado no MySQL 8.0.22.

- `innodb_log_file_size`: Tamanho de cada arquivo de registro no grupo de registros. Desatualizado no MySQL 8.0.30.

- `innodb_log_files_in_group`: Número de arquivos de log do InnoDB no grupo de log. Desatualizado no MySQL 8.0.30.

- `innodb_undo_tablespaces`: Número de arquivos de espaço de tabela para os quais os segmentos de rollback são divididos. Desatualizado no MySQL 8.0.4.

- `keyring_encrypted_file_data`: arquivo de dados do plugin keyring\_encrypted\_file. Desatualizado no MySQL 8.0.34.

- `keyring_encrypted_file_password`: senha do plugin keyring\_encrypted\_file. Desatualizada no MySQL 8.0.34.

- `keyring_file_data`: arquivo de dados do plugin keyring\_file. Desatualizado no MySQL 8.0.34.

- `keyring_oci_ca_certificate`: Arquivo de certificado CA para autenticação de pares. Desatualizado no MySQL 8.0.31.

- `keyring_oci_compartment`: Compartimento OCI OCID. Desatualizado no MySQL 8.0.31.

- `keyring_oci_encryption_endpoint`: Ponto de extremidade do servidor de criptografia OCI. Desatualizado no MySQL 8.0.31.

- `keyring_oci_key_file`: Arquivo de chave privada RSA do OCI. Desatualizado no MySQL 8.0.31.

- `keyring_oci_key_fingerprint`: Impressão digital do arquivo de chave privada RSA do OCI. Desatualizada no MySQL 8.0.31.

- `keyring_oci_management_endpoint`: Ponto de extremidade do servidor de gerenciamento do OCI. Desatualizado no MySQL 8.0.31.

- `keyring_oci_master_key`: Chave mestre OCI OCID. Desatualizada no MySQL 8.0.31.

- `keyring_oci_secrets_endpoint`: Ponto de extremidade do servidor de segredos do OCI. Desatualizado no MySQL 8.0.31.

- `keyring_oci_tenancy`: OCID de locação OCI. Desatualizado no MySQL 8.0.31.

- `keyring_oci_user`: O usuário OCI OCID. Desatualizado no MySQL 8.0.31.

- `keyring_oci_vaults_endpoint`: Ponto de extremidade do servidor de cofres OCI. Desatualizado no MySQL 8.0.31.

- `keyring_oci_virtual_vault`: OCI vault OCID. Desatualizado no MySQL 8.0.31.

- `log_bin_trust_function_creators`: Se igual a 0 (padrão), então, quando o comando --log-bin for usado, a criação de funções armazenadas só será permitida para usuários com privilégio SUPER e apenas se a função criada não quebrar o registro binário. Desatualizado no MySQL 8.0.34.

- `log_bin_use_v1_row_events`: Se o servidor estiver usando eventos de linha de log binário da versão 1. Desatualizado no MySQL 8.0.18.

- `log_slave_updates`: Se a replica deve registrar as atualizações realizadas pelo seu fio de replicação SQL no seu próprio log binário. Desatualizado no MySQL 8.0.26.

- `log_slow_slave_statements`: Faça com que as declarações lentas sejam escritas no log de consulta lenta executadas pela replica. Desatualizado no MySQL 8.0.26.

- `log_statements_unsafe_for_binlog`: Desativa as mensagens de erro 1592 que são escritas no log de erro. Desatualizado no MySQL 8.0.34.

- `log_syslog`: Se deve escrever o log de erros no syslog. Desatualizado no MySQL 8.0.2.

- `master-info-file`: Localização e nome do arquivo que lembra a origem e onde a thread de replicação de I/O está no log binário da origem. Desatualizado no MySQL 8.0.18.

- `master_info_repository`: Se deve escrever o repositório de metadados de conexão, contendo informações de origem e localização da thread de E/S de replicação no log binário da origem, em um arquivo ou tabela. Desatualizado no MySQL 8.0.23.

- `master_verify_checksum`: Faça com que a fonte examine os checksums ao ler o log binário. Desatualizado no MySQL 8.0.26.

- `max_length_for_sort_data`: Número máximo de bytes em registros ordenados. Desatualizado no MySQL 8.0.20.

- `myisam_repair_threads`: Número de threads a serem usadas ao reparar tabelas MyISAM. 1 desabilita a reparação paralela. Desatualizado no MySQL 8.0.29.

- `mysql_native_password_proxy_users`: Se o plugin de autenticação mysql\_native\_password faz o encaminhamento. Desatualizado no MySQL 8.0.16.

- `new`: Use funções muito novas, possivelmente "inseguras". Descontinuada no MySQL 8.0.35.

- `no-dd-upgrade`: Impedir a atualização automática das tabelas do dicionário de dados ao iniciar. Desatualizado no MySQL 8.0.16.

- `old`: Faça com que o servidor volte a comportamentos presentes em versões anteriores. Depreendido no MySQL 8.0.35.

- `old-style-user-limits`: Habilitar limites de usuário de estilo antigo (antes da versão 5.0.3, os recursos do usuário eram contados por usuário + host em vez por conta). Desatualizado no MySQL 8.0.30.

- `performance_schema_show_processlist`: Selecione a implementação SHOW PROCESSLIST. Desatualizada no MySQL 8.0.35.

- `pseudo_slave_mode`: Para uso em servidores internos. Desatualizado no MySQL 8.0.26.

- `query_prealloc_size`: Buffer persistente para a análise e execução de consultas. Desatualizado no MySQL 8.0.29.

- `relay_log_info_file`: Nome do arquivo para o repositório de metadados do aplicativo, no qual os registros de replica armazenam informações sobre os logs de retransmissão. Desatualizado no MySQL 8.0.18.

- `relay_log_info_repository`: Se deve escrever a localização do fio de transação de replicação na log do retransmissor em um arquivo ou tabela. Desatualizado no MySQL 8.0.23.

- `replica_parallel_type`: Diz à replica para usar informações de data e hora (CLOCK\_LOGICAL) ou particionamento de banco de dados (DATABASE) para paralelizar as transações. Desatualizado no MySQL 8.0.29.

- `rpl_semi_sync_master_enabled`: Se a replicação semi-sincronizada estiver habilitada na fonte. Desatualizada no MySQL 8.0.26.

- `rpl_semi_sync_master_timeout`: Número de milissegundos para aguardar o reconhecimento da replica. Desatualizado no MySQL 8.0.26.

- `rpl_semi_sync_master_trace_level`: Nível de rastreamento de depuração da replicação semiesincronizada na fonte. Desatualizado no MySQL 8.0.26.

- `rpl_semi_sync_master_wait_for_slave_count`: Número de confirmações de replicação que a fonte deve receber por transação antes de prosseguir. Desatualizado no MySQL 8.0.26.

- `rpl_semi_sync_master_wait_point`: Ponto de espera para o reconhecimento da recepção da transação replicada. Desatualizado no MySQL 8.0.26.

- `rpl_semi_sync_slave_enabled`: Se a replicação semi-sincronizada estiver habilitada em replica. Desatualizada no MySQL 8.0.26.

- `rpl_semi_sync_slave_trace_level`: Nível de rastreamento de depuração da replicação semiesincronizada. Desatualizado no MySQL 8.0.26.

- `rpl_stop_slave_timeout`: Número de segundos que o comando STOP REPLICA ou STOP SLAVE aguarda antes de expirar. Desatualizado no MySQL 8.0.26.

- `safe-user-create`: Não permita a criação de novos usuários por usuários que não tenham privilégios de escrita na tabela mysql.user; essa opção está desatualizada e será ignorada. Desatualizada no MySQL 8.0.11.

- `sha256_password_auto_generate_rsa_keys`: Se deve gerar arquivos de par de chaves RSA automaticamente. Desatualizado no MySQL 8.0.16.

- `sha256_password_private_key_path`: Nome do caminho da chave privada do plugin de autenticação SHA256. Desatualizado no MySQL 8.0.16.

- `sha256_password_proxy_users`: Se o plugin de autenticação sha256\_password faz o encaminhamento. Desatualizado no MySQL 8.0.16.

- `sha256_password_public_key_path`: Nome do caminho da chave pública do plugin de autenticação SHA256. Desatualizado no MySQL 8.0.16.

- `show-slave-auth-info`: Mostrar o nome do usuário e a senha nas opções Mostrar réplicas e Mostrar hosts escravos nesta fonte. Desatualizado no MySQL 8.0.26.

- `skip-character-set-client-handshake`: Ignorar o valor do conjunto de caracteres do lado do cliente enviado durante o handshake. Desatualizado no MySQL 8.0.35.

- `skip-host-cache`: Não cache nomes de host. Desatualizado no MySQL 8.0.30.

- `skip-new`: Não use novas rotinas, que podem estar incorretas. Desatualizada no MySQL 8.0.35.

- `skip-slave-start`: Se definido, a replicação não é iniciada automaticamente quando o servidor de replicação é iniciado. Desatualizado no MySQL 8.0.26.

- `skip-ssl`: Desative a criptografia de conexão. Desatualizado no MySQL 8.0.26.

- `slave-skip-errors`: Diz ao fio de replicação para continuar a replicação quando a consulta retorna um erro da lista fornecida. Desatualizado no MySQL 8.0.26.

- `slave_checkpoint_group`: Número máximo de transações processadas por replica multithread antes que a operação de verificação de ponto seja chamada para atualizar o status do progresso. Não é suportado pelo NDB Cluster. Desatualizado no MySQL 8.0.26.

- `slave_checkpoint_period`: Atualize o status do progresso da replica multithreading e limpe as informações do log do retransmissor no disco após este número de milissegundos. Não é suportado pelo NDB Cluster. Desatualizado no MySQL 8.0.26.

- `slave_compressed_protocol`: Use compressão do protocolo de origem/replica. Desatualizado no MySQL 8.0.18.

- `slave_exec_mode`: Permite alternar o fio de replicação entre o modo IDEMPOTENT (chave e alguns outros erros suprimidos) e o modo STRICT; o modo STRICT é padrão, exceto para o NDB Cluster, onde o IDEMPOTENT é sempre usado. Desatualizado no MySQL 8.0.26.

- `slave_load_tmpdir`: Local onde a replica deve colocar seus arquivos temporários ao replicar instruções LOAD DATA. Desatualizado no MySQL 8.0.26.

- `slave_max_allowed_packet`: Tamanho máximo, em bytes, do pacote que pode ser enviado do servidor de origem da replicação para a replica; substitui max\_allowed\_packet. Desatualizado no MySQL 8.0.26.

- `slave_net_timeout`: Número de segundos para esperar por mais dados da conexão de origem/replica antes de abortar a leitura. Desatualizado no MySQL 8.0.26.

- `slave_parallel_type`: Diz à replica para usar informações de data e hora (CLOCK\_LOGICAL) ou particionamento de banco de dados (DATABASE) para paralelizar as transações. Desatualizado no MySQL 8.0.26.

- `slave_parallel_workers`: Número de threads do aplicativo para executar transações de replicação em paralelo; 0 ou 1 desabilita a multitarefa de replicação. NDB Cluster: consulte a documentação. Desatualizado no MySQL 8.0.26.

- `slave_pending_jobs_size_max`: Tamanho máximo das filas de trabalhadores de replicação que armazenam eventos ainda não aplicados. Desatualizado no MySQL 8.0.26.

- `slave_preserve_commit_order`: Garante que todos os commits dos trabalhadores replicados ocorram na mesma ordem que no banco de origem para manter a consistência ao usar threads do aplicador paralelo. Desatualizado no MySQL 8.0.26.

- `slave_rows_search_algorithms`: Determina os algoritmos de busca usados para agrupar o lote de atualização de réplicas. Qualquer um dos seguintes valores de 2 ou 3: INDEX\_SEARCH, TABLE\_SCAN, HASH\_SCAN. Desatualizado no MySQL 8.0.18.

- `slave_sql_verify_checksum`: Faça com que a replica examine os checksums ao ler o log do relé. Desatualizado no MySQL 8.0.26.

- `slave_transaction_retries`: Número de vezes que o fio de replicação do SQL tenta novamente a transação caso ela falhe com um deadlock ou o tempo limite de espera de bloqueio tenha expirado, antes de desistir e parar. Desatualizado no MySQL 8.0.26.

- `slave_type_conversions`: Controla o modo de conversão de tipo na replica. O valor é uma lista de zero ou mais elementos desta lista: ALL\_LOSSY, ALL\_NON\_LOSSY. Defina como uma string vazia para impedir conversões de tipo entre a fonte e a replica. Desatualizado no MySQL 8.0.26.

- `sql_slave_skip_counter`: Número de eventos da fonte que a replicação deve ignorar. Não é compatível com a replicação GTID. Desatualizado no MySQL 8.0.26.

- `ssl`: Habilitar a criptografia de conexão. Desatualizado no MySQL 8.0.26.

- `ssl_fips_mode`: Se habilitar o modo FIPS no lado do servidor. Desatualizado no MySQL 8.0.34.

- `symbolic-links`: Permita links simbólicos para tabelas MyISAM. Desatualizado no MySQL 8.0.2.

- `sync_master_info`: Sincronize as informações de origem após cada evento a cada # evento. Desatualizado no MySQL 8.0.26.

- `sync_relay_log_info`: Sincronize o arquivo relay.info com o disco após cada evento a cada # evento. Desatualizado no MySQL 8.0.34.

- `temptable_use_mmap`: Define se o mecanismo de armazenamento TempTable aloca arquivos mapeados na memória quando o limite temptable\_max\_ram é atingido. Desatualizado no MySQL 8.0.26.

- `transaction_prealloc_size`: Buffer persistente para transações serem armazenadas no log binário. Desatualizado no MySQL 8.0.29.

- `transaction_write_set_extraction`: Define o algoritmo usado para hash os registros extraídos durante a transação. Desatualizado no MySQL 8.0.26.

### Opções e variáveis removidas no MySQL 8.0

As seguintes variáveis de sistema, variáveis de status e opções foram removidas no MySQL 8.0.

- `Com_alter_db_upgrade`: Número de declarações ALTER DATABASE ... UPGRADE DATA DIRECTORY NAME. Removido no MySQL 8.0.0.

- `Innodb_available_undo_logs`: Número total de segmentos de rollback do InnoDB; diferente de innodb\_rollback\_segments, que exibe o número de segmentos de rollback ativos. Removido no MySQL 8.0.2.

- `Qcache_free_blocks`: Número de blocos de memória gratuitos no cache de consulta. Removido no MySQL 8.0.3.

- `Qcache_free_memory`: Quantidade de memória livre para o cache de consultas. Removido no MySQL 8.0.3.

- `Qcache_hits`: Número de acertos no cache de consultas. Removido no MySQL 8.0.3.

- `Qcache_inserts`: Número de inserções no cache de consultas. Removido no MySQL 8.0.3.

- `Qcache_lowmem_prunes`: Número de consultas que foram excluídas do cache de consultas devido à falta de memória livre no cache. Removido no MySQL 8.0.3.

- `Qcache_not_cached`: Número de consultas não armazenadas em cache (não são armazenáveis em cache ou não são armazenadas em cache devido à configuração query\_cache\_type). Removido no MySQL 8.0.3.

- `Qcache_queries_in_cache`: Número de consultas registradas no cache de consultas. Removido no MySQL 8.0.3.

- `Qcache_total_blocks`: Número total de blocos no cache de consultas. Removido no MySQL 8.0.3.

- `Slave_heartbeat_period`: Intervalo de batida de replicação da replica, em segundos. Removido no MySQL 8.0.1.

- `Slave_last_heartbeat`: Mostra quando o último sinal de batimento cardíaco foi recebido, no formato TIMESTAMP. Removido no MySQL 8.0.1.

- `Slave_received_heartbeats`: Número de batimentos cardíacos recebidos pela réplica desde o último reinicialização. Removido no MySQL 8.0.1.

- `Slave_retried_transactions`: Número total de vezes desde a inicialização em que o fio de replicação SQL tentou novamente as transações. Removido no MySQL 8.0.1.

- `Slave_running`: Estado deste servidor como replica (status da thread de I/O de replicação). Removido no MySQL 8.0.1.

- `bootstrap`: Usado por scripts de instalação do MySQL. Removido no MySQL 8.0.0.

- `date_format`: Formato DATE (não utilizado). Removido no MySQL 8.0.3.

- `datetime_format`: Formato DATETIME/TIMESTAMP (não utilizado). Removido no MySQL 8.0.3.

- `des-key-file`: Carregar chaves para des\_encrypt() e des\_encrypt a partir do arquivo fornecido. Removido no MySQL 8.0.3.

- `group_replication_allow_local_disjoint_gtids_join`: Permitir que o servidor atual se junte ao grupo mesmo que ele tenha transações ausentes no grupo. Removido no MySQL 8.0.4.

- `have_crypt`: Disponibilidade da chamada de sistema crypt(). Removida no MySQL 8.0.3.

- `ignore-db-dir`: Trate o diretório como um diretório não-banco de dados. Removido no MySQL 8.0.0.

- `ignore_builtin_innodb`: Ignorar o InnoDB integrado. Removido no MySQL 8.0.3.

- `ignore_db_dirs`: Diretórios tratados como diretórios não-de-banco de dados. Removido no MySQL 8.0.0.

- `innodb_checksums`: Habilitar a validação de verificações de checksum do InnoDB. Removido no MySQL 8.0.0.

- `innodb_disable_resize_buffer_pool_debug`: Desabilita o redimensionamento do pool de buffers do InnoDB. Removido no MySQL 8.0.0.

- `innodb_file_format`: Formato para novas tabelas InnoDB. Removido no MySQL 8.0.0.

- `innodb_file_format_check`: Se o InnoDB realiza a verificação de compatibilidade com o formato de arquivo. Removido no MySQL 8.0.0.

- `innodb_file_format_max`: Marcador de formato de arquivo em espaço de tabela compartilhado. Removido no MySQL 8.0.0.

- `innodb_large_prefix`: Habilita chaves mais longas para índices de prefixo de coluna. Removido no MySQL 8.0.0.

- `innodb_locks_unsafe_for_binlog`: Forçar o InnoDB a não usar o bloqueio de próxima chave. Em vez disso, use apenas o bloqueio de nível de linha. Removido no MySQL 8.0.0.

- `innodb_scan_directories`: Define diretórios para varredura de arquivos de espaço de tabela durante a recuperação do InnoDB. Removido no MySQL 8.0.4.

- `innodb_stats_sample_pages`: Número de páginas de índice a serem amostradas para estatísticas de distribuição de índice. Removido no MySQL 8.0.0.

- `innodb_support_xa`: Habilitar o suporte InnoDB para o compromisso de dois estágios XA. Removido no MySQL 8.0.0.

- `innodb_undo_logs`: Número de registros de desfazer (segmentos de rollback) usados pelo InnoDB; alias para innodb\_rollback\_segments. Removido no MySQL 8.0.2.

- `internal_tmp_disk_storage_engine`: Motor de armazenamento para tabelas temporárias internas. Removido no MySQL 8.0.16.

- `log-warnings`: Escreva alguns avisos não críticos para o arquivo de log. Removido no MySQL 8.0.3.

- `log_builtin_as_identified_by_password`: Se deve registrar CREATE/ALTER USER e GRANT de forma compatível com versões anteriores. Removido no MySQL 8.0.11.

- `log_error_filter_rules`: Regras de filtro para registro de erros. Removido no MySQL 8.0.4.

- `log_syslog`: Se deve escrever o log de erros no syslog. Removido no MySQL 8.0.13.

- `log_syslog_facility`: Instalação para mensagens syslog. Removida no MySQL 8.0.13.

- `log_syslog_include_pid`: Se incluir o PID do servidor nas mensagens do syslog. Removido no MySQL 8.0.13.

- `log_syslog_tag`: Marca para o identificador do servidor nas mensagens syslog. Removido no MySQL 8.0.13.

- `max_tmp_tables`: Não utilizado. Removido no MySQL 8.0.3.

- `metadata_locks_cache_size`: Tamanho do cache de bloqueios de metadados. Removido no MySQL 8.0.13.

- `metadata_locks_hash_instances`: Número de hashes de bloqueio de metadados. Removido no MySQL 8.0.13.

- `multi_range_count`: Número máximo de intervalos para enviar ao manipulador da tabela de uma vez durante seleções de intervalo. Removido no MySQL 8.0.3.

- `myisam_repair_threads`: Número de threads a serem usadas ao reparar tabelas MyISAM. 1 desabilita a reparação paralela. Removido no MySQL 8.0.30.

- `old_passwords`: Seleciona o método de hashing de senha para PASSWORD(). Removido no MySQL 8.0.11.

- `partition`: Habilitar (ou desabilitar) o suporte de particionamento. Removido no MySQL 8.0.0.

- `query_cache_limit`: Não cache os resultados que forem maiores que este valor. Removido no MySQL 8.0.3.

- `query_cache_min_res_unit`: Tamanho mínimo da unidade na qual o espaço para os resultados é alocado (a última unidade é cortada após a escrita de todos os dados dos resultados). Removido no MySQL 8.0.3.

- `query_cache_size`: Memória alocada para armazenar resultados de consultas antigas. Removida no MySQL 8.0.3.

- `query_cache_type`: Tipo de cache de consulta. Removido no MySQL 8.0.3.

- `query_cache_wlock_invalidate`: Invalidate consultas no cache de consultas no LOCK para escrita. Removido no MySQL 8.0.3.

- `secure_auth`: Desative a autenticação para contas com senhas antigas (pré-4.1). Removido no MySQL 8.0.3.

- `show_compatibility_56`: Compatibilidade para EXIBIR STATUS/VARIÁVEIS. Removida no MySQL 8.0.1.

- `skip-partition`: Não habilite a partição definida pelo usuário. Removido no MySQL 8.0.0.

- `sync_frm`: Sincronize .frm no disco ao criar. Ativado por padrão. Removido no MySQL 8.0.0.

- `temp-pool`: A utilização desta opção faz com que a maioria dos arquivos temporários criados usem um conjunto pequeno de nomes, em vez de um nome único para cada novo arquivo. Removido no MySQL 8.0.1.

- `time_format`: Formato TIME (não utilizado). Removido no MySQL 8.0.3.

- `tx_isolation`: Nível de isolamento de transação padrão. Removido no MySQL 8.0.3.

- `tx_read_only`: Modo de acesso padrão à transação. Removido no MySQL 8.0.3.
