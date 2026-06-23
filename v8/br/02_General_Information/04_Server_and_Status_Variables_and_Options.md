## 1.4 Variáveis e opções de servidor e status adicionadas, depreciadas ou removidas no MySQL 8.0

* Opções e variáveis introduzidas no MySQL 8.0
* Opções e variáveis descontinuadas no MySQL 8.0
* Opções e variáveis removidas no MySQL 8.0

Esta seção lista as variáveis de servidor, as variáveis de status e as opções que foram adicionadas pela primeira vez, foram descontinuadas ou foram removidas no MySQL 8.0.

### Opções e Variáveis Introduzidas no MySQL 8.0

As seguintes variáveis de sistema, variáveis de status e opções de servidor foram adicionadas no MySQL 8.0.

* `Acl_cache_items_count`: Número de objetos de privilégio cacheados. Adicionado no MySQL 8.0.0.

* `Audit_log_current_size`: Tamanho atual do arquivo de registro de auditoria. Adicionado no MySQL 8.0.11.

* `Audit_log_event_max_drop_size`: Tamanho do maior evento audenciado que foi descartado. Foi adicionado no MySQL 8.0.11.

* `Audit_log_events`: Número de eventos auditados tratados. Adicionado no MySQL 8.0.11.

* `Audit_log_events_filtered`: Número de eventos filtrados auditados. Adicionado no MySQL 8.0.11.

* `Audit_log_events_lost`: Número de eventos auditados que foram descartados. Foi adicionado no MySQL 8.0.11.

* `Audit_log_events_written`: Número de eventos auditados escritos. Adicionado no MySQL 8.0.11.

* `Audit_log_total_size`: Tamanho combinado de eventos auditados escritos. Adicionado no MySQL 8.0.11.

* `Audit_log_write_waits`: Número de eventos auditados com atraso na escrita. Adicionado no MySQL 8.0.11.

* `Authentication_ldap_sasl_supported_methods`: Métodos de autenticação suportados para autenticação SASL LDAP. Adicionada no MySQL 8.0.21.

* `Caching_sha2_password_rsa_public_key`: Valor do plugin de autenticação RSA chave pública `caching_sha2_password`. Adicionado no MySQL 8.0.4.

* `Com_alter_resource_group`: Contagem de declarações de `ALTER RESOURCE GROUP`. Adicionada no MySQL 8.0.3.

* `Com_alter_user_default_role`: Contagem de declarações de `ALTER USER ... DEFAULT ROLE`. Adicionada no MySQL 8.0.0.

* `Com_change_replication_source`: Contagem das declarações de `CHANGE REPLICATION SOURCE TO` e `CHANGE MASTER TO`. Adicionada no MySQL 8.0.23.

* `Com_clone`: Contagem de declarações CLONE. Adicionada no MySQL 8.0.2.

* `Com_create_resource_group`: Contagem de declarações de `CREATE RESOURCE GROUP`. Adicionada no MySQL 8.0.3.

* `Com_create_role`: Contagem de declarações de `CREATE ROLE`. Adicionada no MySQL 8.0.0.

* `Com_drop_resource_group`: Contagem de declarações de `DROP RESOURCE GROUP`. Adicionada no MySQL 8.0.3.

* `Com_drop_role`: Contagem de declarações de `DROP ROLE`. Adicionada no MySQL 8.0.0.

* `Com_grant_roles`: Contagem de declarações de `GRANT ROLE`. Adicionada no MySQL 8.0.0.

* `Com_install_component`: Contagem de declarações de `INSTALL COMPONENT`. Adicionada no MySQL 8.0.0.

* `Com_replica_start`: Contagem das declarações de `START REPLICA` e `START SLAVE`. Adicionada no MySQL 8.0.22.

* `Com_replica_stop`: Contagem das declarações de `STOP REPLICA` e `STOP SLAVE`. Adicionada no MySQL 8.0.22.

* `Com_restart`: Contagem de declarações de `RESTART`. Adicionada no MySQL 8.0.4.

* `Com_revoke_roles`: Contagem de declarações de `REVOKE ROLES`. Adicionada no MySQL 8.0.0.

* `Com_set_resource_group`: Contagem de declarações de `SET RESOURCE GROUP`. Adicionada no MySQL 8.0.3.

* `Com_set_role`: Contagem de declarações de `SET ROLE`. Adicionada no MySQL 8.0.0.

* `Com_show_replica_status`: Contagem das declarações de `SHOW REPLICA STATUS` e `SHOW SLAVE STATUS`. Adicionada no MySQL 8.0.22.

* `Com_show_replicas`: Contagem das declarações de `SHOW REPLICAS` e `SHOW SLAVE HOSTS`. Adicionada no MySQL 8.0.22.

* `Com_uninstall_component`: Contagem de declarações de `UINSTALL COMPONENT`. Adicionada no MySQL 8.0.0.

* `Compression_algorithm`: Algoritmo de compressão para conexão atual. Adicionado no MySQL 8.0.18.

* `Compression_level`: Nível de compressão para a conexão atual. Adicionado no MySQL 8.0.18.

* `Connection_control_delay_generated`: Quantas vezes o servidor atrasou a solicitação de conexão. Adicionada no MySQL 8.0.1.

* `Current_tls_ca`: Valor atual da variável de sistema `ssl_ca`. Adicionada no MySQL 8.0.16.

* `Current_tls_capath`: Valor atual da variável de sistema `ssl_capath`. Adicionada no MySQL 8.0.16.

* `Current_tls_cert`: Valor atual da variável de sistema `ssl_cert`. Adicionada no MySQL 8.0.16.

* `Current_tls_cipher`: Valor atual da variável de sistema `ssl_cipher`. Adicionada no MySQL 8.0.16.

* `Current_tls_ciphersuites`: Valor atual da variável de sistema `tsl_ciphersuites`. Adicionada no MySQL 8.0.16.

* `Current_tls_crl`: Valor atual da variável de sistema `ssl_crl`. Adicionada no MySQL 8.0.16.

* `Current_tls_crlpath`: Valor atual da variável de sistema `ssl_crlpath`. Adicionada no MySQL 8.0.16.

* `Current_tls_key`: Valor atual da variável de sistema `ssl_key`. Adicionada no MySQL 8.0.16.

* `Current_tls_version`: Valor atual da variável de sistema `tls_version`. Adicionada no MySQL 8.0.16.

* `Error_log_buffered_bytes`: Número de bytes utilizados na tabela `error_log`. Adicionada no MySQL 8.0.22.

* `Error_log_buffered_events`: Número de eventos na tabela `error_log`. Adicionada no MySQL 8.0.22.

* `Error_log_expired_events`: Número de eventos descartados da tabela `error_log`. Adicionada no MySQL 8.0.22.

* `Error_log_latest_write`: Hora da última escrita na tabela `error_log`. Adicionada no MySQL 8.0.22.

* `Firewall_access_denied`: Número de declarações rejeitadas pelo plugin de Firewall Empresarial MySQL. Adicionado no MySQL 8.0.11.

* `Firewall_access_granted`: Número de declarações aceitas pelo plugin de Firewall Empresarial MySQL. Adicionada no MySQL 8.0.11.

* `Firewall_cached_entries`: Número de declarações registradas pelo plugin do Firewall Empresarial MySQL. Adicionado no MySQL 8.0.11.

* `Global_connection_memory`: Quantidade de memória atualmente utilizada por todos os threads do usuário. Adicionada no MySQL 8.0.28.

* `Innodb_buffer_pool_resize_status_code`: Código de status de redimensionamento do pool de buffers de InnoDB. Adicionado no MySQL 8.0.31.

* `Innodb_buffer_pool_resize_status_progress`: progresso do status de redimensionamento do pool de buffers do InnoDB. Adicionado no MySQL 8.0.31.

* `Innodb_redo_log_capacity_resized`: Capacidade de log refeito após a última operação de redimensionamento de capacidade concluída. Adicionada no MySQL 8.0.30.

* `Innodb_redo_log_checkpoint_lsn`: O ponto de verificação do log de refazer LSN. Adicionado no MySQL 8.0.30.

* `Innodb_redo_log_current_lsn`: O LSN atual do log de refazer. Adicionado no MySQL 8.0.30.

* `Innodb_redo_log_enabled`: Status do log de refazer InnoDB. Adicionado no MySQL 8.0.21.

* `Innodb_redo_log_flushed_to_disk_lsn`: O LSN (Last Seen Time) do log vermelho que foi descarregado no disco. Foi adicionado no MySQL 8.0.30.

* `Innodb_redo_log_logical_size`: O tamanho lógico do log de refazer. Adicionado no MySQL 8.0.30.

* `Innodb_redo_log_physical_size`: O tamanho físico do log de refazer. Adicionado no MySQL 8.0.30.

* `Innodb_redo_log_read_only`: Se o log de refazer é somente de leitura. Adicionado no MySQL 8.0.30.

* `Innodb_redo_log_resize_status`: O status de redimensionamento do log de revisão. Adicionado no MySQL 8.0.30.

* `Innodb_redo_log_uuid`: O UUID do log de refazer. Adicionado no MySQL 8.0.30.

* `Innodb_system_rows_deleted`: Número de linhas excluídas das tabelas do esquema do sistema. Adicionada no MySQL 8.0.19.

* `Innodb_system_rows_inserted`: Número de linhas inseridas nas tabelas do esquema do sistema. Adicionado no MySQL 8.0.19.

* `Innodb_system_rows_read`: Número de linhas lidas das tabelas do esquema do sistema. Adicionado no MySQL 8.0.19.

* `Innodb_system_rows_updated`: Número de linhas atualizadas nas tabelas do esquema do sistema. Adicionado no MySQL 8.0.19.

* `Innodb_undo_tablespaces_active`: Número de tabelas espaços de desfazer ativos. Adicionado no MySQL 8.0.14.

* `Innodb_undo_tablespaces_explicit`: Número de espaços de tabela de desfazer criados pelo usuário. Adicionado no MySQL 8.0.14.

* `Innodb_undo_tablespaces_implicit`: Número de tabelas de desfazer criadas pelo InnoDB. Adicionada no MySQL 8.0.14.

* `Innodb_undo_tablespaces_total`: Número total de espaços de tabela desfazer. Adicionado no MySQL 8.0.14.

* `Mysqlx_bytes_received_compressed_payload`: Número de bytes recebidos como cargas úteis de mensagens comprimidas, medido antes da descomprimagem. Adicionado no MySQL 8.0.19.

* `Mysqlx_bytes_received_uncompressed_frame`: Número de bytes recebidos como cargas úteis de mensagens comprimidas, medido após a descomprimagem. Adicionado no MySQL 8.0.19.

* `Mysqlx_bytes_sent_compressed_payload`: Número de bytes enviados como cargas úteis de mensagens comprimidas, medido após a compressão. Adicionado no MySQL 8.0.19.

* `Mysqlx_bytes_sent_uncompressed_frame`: Número de bytes enviados como cargas úteis de mensagens comprimidas, medido antes da compressão. Adicionado no MySQL 8.0.19.

* `Mysqlx_compression_algorithm`: Algoritmo de compressão em uso para a conexão do X Protocol nesta sessão. Adicionado no MySQL 8.0.20.

* `Mysqlx_compression_level`: Nível de compressão utilizado para a conexão do protocolo X para esta sessão. Adicionado no MySQL 8.0.20.

* `Replica_open_temp_tables`: Número de tabelas temporárias que o thread de replicação SQL atualmente tem aberto. Adicionado no MySQL 8.0.26.

* `Replica_rows_last_search_algorithm_used`: Algoritmo de pesquisa mais recentemente utilizado por esta replica para localizar linhas para replicação baseada em linha (índice, tabela ou varredura hash). Adicionado no MySQL 8.0.26.

* `Resource_group_supported`: Se o servidor suporta a funcionalidade de grupo de recursos. Adicionada no MySQL 8.0.31.

* `Rpl_semi_sync_replica_status`: Se a replicação semi-sincronizada está operacional na replica. Adicionada no MySQL 8.0.26.

* `Rpl_semi_sync_source_clients`: Número de réplicas semi-síncronas. Adicionada no MySQL 8.0.26.

* `Rpl_semi_sync_source_net_avg_wait_time`: Tempo médio que a fonte de dados esperou por respostas da réplica. Adicionado no MySQL 8.0.26.

* `Rpl_semi_sync_source_net_wait_time`: O tempo total que a fonte de replicação esperou por respostas foi adicionado no MySQL 8.0.26.

* `Rpl_semi_sync_source_net_waits`: Número total de vezes que a fonte esperou por respostas da réplica. Adicionado no MySQL 8.0.26.

* `Rpl_semi_sync_source_no_times`: Número de vezes que a fonte desligou a replicação semiesincronizada. Adicionada no MySQL 8.0.26.

* `Rpl_semi_sync_source_no_tx`: Número de compromissos que não foram reconhecidos com sucesso. Adicionado no MySQL 8.0.26.

* `Rpl_semi_sync_source_status`: Se a replicação semi-sincronizada está operacional na fonte. Adicionada no MySQL 8.0.26.

* `Rpl_semi_sync_source_timefunc_failures`: Número de vezes que a fonte falhou ao chamar funções de tempo. Adicionado no MySQL 8.0.26.

* `Rpl_semi_sync_source_tx_avg_wait_time`: Tempo médio que a fonte esperou por cada transação. Adicionada no MySQL 8.0.26.

* `Rpl_semi_sync_source_tx_wait_time`: Tempo total que a fonte de transações esperou. Adicionado no MySQL 8.0.26.

* `Rpl_semi_sync_source_tx_waits`: Número total de vezes que a fonte esperou por transações. Adicionado no MySQL 8.0.26.

* `Rpl_semi_sync_source_wait_pos_backtraverse`: Número total de vezes que a fonte esperou por um evento com coordenadas binárias inferiores às esperadas anteriormente. Adicionado no MySQL 8.0.26.

* `Rpl_semi_sync_source_wait_sessions`: Número de sessões atualmente aguardando respostas replicadas. Adicionada no MySQL 8.0.26.

* `Rpl_semi_sync_source_yes_tx`: Número de compromissos reconhecidos com sucesso. Adicionado no MySQL 8.0.26.

* `Secondary_engine_execution_count`: Número de consultas descarregadas para um motor secundário. Adicionado no MySQL 8.0.13.

* `Ssl_session_cache_timeout`: Valor atual do tempo de espera da sessão SSL no cache. Foi adicionado no MySQL 8.0.29.

* `Telemetry_traces_supported`: Se as traços de telemetria do servidor são suportados. Adicionado no MySQL 8.0.33.

* `Tls_library_version`: Versão em execução da biblioteca OpenSSL em uso. Adicionada no MySQL 8.0.30.

* `activate_all_roles_on_login`: Se deve ativar todos os papéis do usuário no momento da conexão. Adicionado no MySQL 8.0.2.

* `admin-ssl`: Habilitar criptografia de conexão. Adicionada no MySQL 8.0.21.

* `admin_address`: Endereço IP para se ligar para conexões na interface administrativa. Adicionado no MySQL 8.0.14.

* `admin_port`: Número TCP/IP a ser usado para conexões na interface administrativa. Adicionado no MySQL 8.0.14.

* `admin_ssl_ca`: Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis. Adicionado no MySQL 8.0.21.

* `admin_ssl_capath`: Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis. Adicionado no MySQL 8.0.21.

* `admin_ssl_cert`: Arquivo que contém o certificado X.509. Adicionado no MySQL 8.0.21.

* `admin_ssl_cipher`: Cifras permitidas para criptografia de conexão. Adicionada no MySQL 8.0.21.

* `admin_ssl_crl`: Arquivo que contém listas de revogação de certificados. Adicionado no MySQL 8.0.21.

* `admin_ssl_crlpath`: Diretório que contém arquivos de lista de revogação de certificados. Adicionado no MySQL 8.0.21.

* `admin_ssl_key`: Arquivo que contém a chave X.509. Adicionada no MySQL 8.0.21.

* `admin_tls_ciphersuites`: Suíços de cifra TLSv1.3 permitidos para conexões criptografadas. Adicionada no MySQL 8.0.21.

* `admin_tls_version`: Protocolos TLS permitidos para conexões criptografadas. Adicionado no MySQL 8.0.21.

* `audit-log`: Se deve ativar o plugin de registro de auditoria. Adicionado no MySQL 8.0.11.

* `audit_log_buffer_size`: Tamanho do buffer do log de auditoria. Adicionado no MySQL 8.0.11.

* `audit_log_compression`: Método de compactação do arquivo de registro de auditoria. Adicionado no MySQL 8.0.11.

* `audit_log_connection_policy`: Política de registro de auditoria para eventos relacionados à conexão. Adicionada no MySQL 8.0.11.

* `audit_log_current_session`: Se deve auditar a sessão atual. Adicionada no MySQL 8.0.11.

* `audit_log_database`: Esquema onde as tabelas de auditoria são armazenadas. Adicionada no MySQL 8.0.33.

* `audit_log_disable`: Se desabilitar o registro de auditoria. Adicionado no MySQL 8.0.28.

* `audit_log_encryption`: Método de criptografia do arquivo de registro de auditoria. Adicionado no MySQL 8.0.11.

* `audit_log_exclude_accounts`: Contas que não devem ser auditadas. Adicionada no MySQL 8.0.11.

* `audit_log_file`: Nome do arquivo de registro de auditoria. Adicionado no MySQL 8.0.11.

* `audit_log_filter_id`: ID do filtro atual do log de auditoria. Adicionado no MySQL 8.0.11.

* `audit_log_flush`: Feche e volte a abrir o arquivo de registro de auditoria. Adicionado no MySQL 8.0.11.

* `audit_log_flush_interval_seconds`: Se deve realizar um esvaziamento recorrente do cache de memória. Adicionado no MySQL 8.0.34.

* `audit_log_format`: Formato do arquivo de registro de auditoria. Adicionado no MySQL 8.0.11.

* `audit_log_format_unix_timestamp`: Se incluir o timestamp Unix no registro de auditoria em formato JSON. Adicionado no MySQL 8.0.26.

* `audit_log_include_accounts`: Contas para auditoria. Adicionada no MySQL 8.0.11.

* `audit_log_max_size`: Limite no tamanho combinado dos arquivos de registro de auditoria JSON. Adicionado no MySQL 8.0.26.

* `audit_log_password_history_keep_days`: Número de dias para reter senhas de criptografia de registro de auditoria arquivado. Adicionado no MySQL 8.0.17.

* `audit_log_policy`: Política de registro de auditoria. Adicionada no MySQL 8.0.11.

* `audit_log_prune_seconds`: O número de segundos após os arquivos de registro de auditoria passarem a ser sujeitos à poda. Adicionado no MySQL 8.0.24.

* `audit_log_read_buffer_size`: Tamanho do buffer de leitura do log de auditoria. Adicionado no MySQL 8.0.11.

* `audit_log_rotate_on_size`: Feche e volte a abrir o arquivo de registro de auditoria neste tamanho. Adicionado no MySQL 8.0.11.

* `audit_log_statement_policy`: Política de registro de auditoria para eventos relacionados a declarações. Adicionada no MySQL 8.0.11.

* `audit_log_strategy`: Estratégia de registro de auditoria. Adicionada no MySQL 8.0.11.

* `authentication_fido_rp_id`: ID da parte dependente para autenticação multifator `FIDO`. Adicionada no MySQL 8.0.27.

* `authentication_kerberos_service_key_tab`: Arquivo contendo chaves de serviço Kerberos para autenticar o ingresso TGS. Adicionado no MySQL 8.0.26.

* `authentication_kerberos_service_principal`: Nome do principal do serviço Kerberos. Adicionado no MySQL 8.0.26.

* `authentication_ldap_sasl_auth_method_name`: Nome do método de autenticação. Adicionada no MySQL 8.0.11.

* `authentication_ldap_sasl_bind_base_dn`: Nome de base distinguido do servidor LDAP. Adicionada no MySQL 8.0.11.

* `authentication_ldap_sasl_bind_root_dn`: Nome distinto raiz do servidor LDAP. Adicionada no MySQL 8.0.11.

* `authentication_ldap_sasl_bind_root_pwd`: Senha de vinculação da raiz do servidor LDAP. Adicionada no MySQL 8.0.11.

* `authentication_ldap_sasl_ca_path`: Nome do arquivo de autoridade de certificação do servidor LDAP. Adicionado no MySQL 8.0.11.

* `authentication_ldap_sasl_group_search_attr`: Atributo de pesquisa de grupo de servidor LDAP. Adicionado no MySQL 8.0.11.

* `authentication_ldap_sasl_group_search_filter`: Filtro de busca de grupo personalizado LDAP. Adicionado no MySQL 8.0.11.

* `authentication_ldap_sasl_init_pool_size`: Tamanho do conjunto inicial de conexões do servidor LDAP. Foi adicionado no MySQL 8.0.11.

* `authentication_ldap_sasl_log_status`: Nível de log do servidor LDAP. Adicionado no MySQL 8.0.11.

* `authentication_ldap_sasl_max_pool_size`: Tamanho máximo do conjunto de conexões do servidor LDAP. Adicionada no MySQL 8.0.11.

* `authentication_ldap_sasl_referral`: Se deve habilitar a pesquisa de referência LDAP. Adicionada no MySQL 8.0.20.

* `authentication_ldap_sasl_server_host`: Nome do host ou endereço IP do servidor LDAP. Adicionada no MySQL 8.0.11.

* `authentication_ldap_sasl_server_port`: Número de porta do servidor LDAP. Adicionada no MySQL 8.0.11.

* `authentication_ldap_sasl_tls`: Se deve usar conexões criptografadas para o servidor LDAP. Adicionada no MySQL 8.0.11.

* `authentication_ldap_sasl_user_search_attr`: Atributo de pesquisa de usuário do servidor LDAP. Adicionado no MySQL 8.0.11.

* `authentication_ldap_simple_auth_method_name`: Nome do método de autenticação. Adicionada no MySQL 8.0.11.

* `authentication_ldap_simple_bind_base_dn`: Nome de base distinguido do servidor LDAP. Adicionada no MySQL 8.0.11.

* `authentication_ldap_simple_bind_root_dn`: Nome distinto raiz do servidor LDAP. Adicionada no MySQL 8.0.11.

* `authentication_ldap_simple_bind_root_pwd`: Senha de vinculação da raiz do servidor LDAP. Adicionada no MySQL 8.0.11.

* `authentication_ldap_simple_ca_path`: Nome do arquivo de autoridade de certificação do servidor LDAP. Adicionado no MySQL 8.0.11.

* `authentication_ldap_simple_group_search_attr`: Atributo de pesquisa de grupo de servidor LDAP. Adicionado no MySQL 8.0.11.

* `authentication_ldap_simple_group_search_filter`: Filtro de busca de grupo personalizado LDAP. Adicionado no MySQL 8.0.11.

* `authentication_ldap_simple_init_pool_size`: Tamanho do conjunto inicial de conexões do servidor LDAP. Adicionada no MySQL 8.0.11.

* `authentication_ldap_simple_log_status`: Nível de log do servidor LDAP. Adicionada no MySQL 8.0.11.

* `authentication_ldap_simple_max_pool_size`: Tamanho máximo do conjunto de conexões do servidor LDAP. Adicionada no MySQL 8.0.11.

* `authentication_ldap_simple_referral`: Se deve habilitar a pesquisa de referência LDAP. Adicionada no MySQL 8.0.20.

* `authentication_ldap_simple_server_host`: Nome do servidor LDAP ou endereço IP. Adicionada no MySQL 8.0.11.

* `authentication_ldap_simple_server_port`: Número de porta do servidor LDAP. Adicionada no MySQL 8.0.11.

* `authentication_ldap_simple_tls`: Se deve usar conexões criptografadas para o servidor LDAP. Adicionada no MySQL 8.0.11.

* `authentication_ldap_simple_user_search_attr`: Atributo de pesquisa de usuário do servidor LDAP. Adicionado no MySQL 8.0.11.

* `authentication_policy`: Plugins para autenticação multifator; consulte a documentação para a sintaxe. Adicionada no MySQL 8.0.27.

* `authentication_windows_log_level`: Nível de registro do plugin de autenticação do Windows. Adicionado no MySQL 8.0.11.

* `authentication_windows_use_principal_name`: Se deve usar o nome do principal do plugin de autenticação do Windows. Adicionada no MySQL 8.0.11.

* `binlog_encryption`: Habilitar criptografia para arquivos de registro binários e arquivos de registro de retransmissão neste servidor. Adicionada no MySQL 8.0.14.

* `binlog_expire_logs_auto_purge`: Controla a purga automática de arquivos de registro binários; pode ser ignorado quando habilitado, definindo tanto `binlog_expire_logs_seconds` quanto `expire_logs_days` para 0. Adicionado no MySQL 8.0.29.

* `binlog_expire_logs_seconds`: Limpe os logs binários após tantos segundos. Adicionado no MySQL 8.0.1.

* `binlog_rotate_encryption_master_key_at_startup`: Rotacionar a chave mestre do log binário na inicialização do servidor. Adicionada no MySQL 8.0.14.

* `binlog_row_metadata`: Se deve registrar todos ou apenas metadados mínimos relacionados a tabela no log binário ao usar registro baseado em linha. Adicionado no MySQL 8.0.1.

* `binlog_row_value_options`: Habilita o registro binário de atualizações de JSON parciais para replicação baseada em linha. Adicionado no MySQL 8.0.3.

* `binlog_transaction_compression`: Habilitar a compressão para cargas de transação em arquivos de log binários. Adicionado no MySQL 8.0.20.

* `binlog_transaction_compression_level_zstd`: Nível de compressão para cargas de trabalho de transações em arquivos de log binário. Adicionado no MySQL 8.0.20.

* `binlog_transaction_dependency_history_size`: Número de hashes de linha mantidos para procurar transações que foram atualizadas pela última linha. Adicionada no MySQL 8.0.1.

* `binlog_transaction_dependency_tracking`: Fonte de informações sobre dependência (marcadores de commit ou conjuntos de escrita de transação) a partir da qual se pode avaliar quais transações podem ser executadas em paralelo pelo aplicativo multithread do replica. Adicionada no MySQL 8.0.1.

* `build_id`: Um ID de compilação único gerado no momento da compilação (apenas Linux). Adicionado no MySQL 8.0.31.

* `caching_sha2_password_auto_generate_rsa_keys`: Se deve gerar automaticamente arquivos de par de chave RSA. Adicionada no MySQL 8.0.4.

* `caching_sha2_password_digest_rounds`: Número de rodadas de hash para o plugin de autenticação `caching_sha2_password`. Adicionado no MySQL 8.0.24.

* `caching_sha2_password_private_key_path`: Nome do caminho da chave privada do plugin de autenticação SHA2. Adicionada no MySQL 8.0.3.

* `caching_sha2_password_public_key_path`: Nome do caminho da chave pública do plugin de autenticação SHA2. Adicionada no MySQL 8.0.3.

* `check-table-functions`: Como proceder ao digitalizar o dicionário de funções utilizadas em restrições de tabela e outras expressões, e se uma dessas funções causar um erro. Use WARN para registrar avisos; ABORT (padrão) também registra avisos e interrompe qualquer atualização em andamento. Adicionado no MySQL 8.0.42.

* `clone_autotune_concurrency`: Habilita a criação dinâmica de threads para operações de clonagem remota. Foi adicionado no MySQL 8.0.17.

* `clone_block_ddl`: Habilita um bloqueio de backup exclusivo durante operações de clonagem. Adicionado no MySQL 8.0.27.

* `clone_buffer_size`: Define o tamanho do buffer intermediário na instância do servidor MySQL do doador. Foi adicionado no MySQL 8.0.17.

* `clone_ddl_timeout`: Número de segundos que a operação de clonagem espera pelo bloqueio de backup. Foi adicionado no MySQL 8.0.17.

* `clone_delay_after_data_drop`: O atraso no tempo em segundos antes do processo de clone começar. Foi adicionado no MySQL 8.0.29.

* `clone_donor_timeout_after_network_failure`: O tempo permitido para reiniciar uma operação de clonagem após uma falha na rede. Adicionado no MySQL 8.0.24.

* `clone_enable_compression`: Habilita a compressão de dados na camada de rede durante o clonamento. Foi adicionado no MySQL 8.0.17.

* `clone_max_concurrency`: Número máximo de threads concorrentes usadas para realizar a operação de clonagem. Adicionada no MySQL 8.0.17.

* `clone_max_data_bandwidth`: Taxa máxima de transferência de dados em MiB por segundo para operação de clonagem remota. Adicionada no MySQL 8.0.17.

* `clone_max_network_bandwidth`: Taxa máxima de transferência de rede em MiB por segundo para operação de clonagem remota. Adicionada no MySQL 8.0.17.

* `clone_ssl_ca`: Especifica o caminho para o arquivo da autoridade de certificação (CA). Foi adicionado no MySQL 8.0.14.

* `clone_ssl_cert`: Especifica o caminho para o arquivo de certificado da chave pública. Foi adicionado no MySQL 8.0.14.

* `clone_ssl_key`: Especifica o caminho para o arquivo da chave privada. Foi adicionado no MySQL 8.0.14.

* `clone_valid_donor_list`: Define endereços de hospedagem do doador para operações de clonagem remota. Adicionada no MySQL 8.0.17.

* `component_scheduler.enabled`: Se o agendamento está executando tarefas ativamente. Adicionado no MySQL 8.0.34.

* `connection_control_failed_connections_threshold`: Tentativas consecutivas de conexão falhadas antes de ocorrerem atrasos. Adicionada no MySQL 8.0.1.

* `connection_control_max_connection_delay`: Retardo máximo (em milissegundos) para a resposta do servidor em tentativas de conexão falhadas. Adicionado no MySQL 8.0.1.

* `connection_control_min_connection_delay`: Retardo mínimo (em milissegundos) para a resposta do servidor em tentativas de conexão falhadas. Adicionado no MySQL 8.0.1.

* `connection_memory_chunk_size`: Atualize `Global_connection_memory` apenas quando o uso de memória do usuário mudar nesse valor ou mais; 0 desativa a atualização. Adicionado no MySQL 8.0.28.

* `connection_memory_limit`: Quantia máxima de memória que pode ser consumida por qualquer conexão de usuário antes que todas as consultas deste usuário sejam rejeitadas. Não se aplica a usuários do sistema, como o MySQL root. Adicionada no MySQL 8.0.28.

* `create_admin_listener_thread`: Se deve usar um fio de escuta dedicado para conexões na interface administrativa. Adicionado no MySQL 8.0.14.

* `cte_max_recursion_depth`: Profundidade máxima de recursão da expressão comum da tabela. Adicionada no MySQL 8.0.3.

* `ddl-rewriter`: Se deve ativar o plugin `ddl_rewriter`. Adicionado no MySQL 8.0.16.

* `default_collation_for_utf8mb4`: Colagem padrão para o conjunto de caracteres utf8mb4; para uso interno apenas pela Replicação do MySQL. Adicionada no MySQL 8.0.11.

* `default_table_encryption`: Configuração padrão de esquema e espaço de tabelas criptografado. Adicionada no MySQL 8.0.16.

* `dragnet.Status`: Resultado da atribuição mais recente para `dragnet.log_error_filter_rules`. Adicionada no MySQL 8.0.12.

* `dragnet.log_error_filter_rules`: Regras de filtro para registro de erros. Adicionada no MySQL 8.0.4.

* `early-plugin-load`: Especifique plugins para carregar antes de carregar plugins embutidos obrigatórios e antes da inicialização do mecanismo de armazenamento. Adicionado no MySQL 8.0.0.

* `enterprise_encryption.maximum_rsa_key_size`: Tamanho máximo de chaves RSA geradas pelo MySQL Enterprise Encryption. Adicionada no MySQL 8.0.30.

* `enterprise_encryption.rsa_support_legacy_padding`: Decifre e verifique o conteúdo de criptografia de legado do MySQL Enterprise. Adicionado no MySQL 8.0.30.

* `explain_format`: Determina o formato de saída padrão usado pelas declarações EXPLAIN. Adicionada no MySQL 8.0.32.

* `generated_random_password_length`: Comprimento máximo das senhas geradas. Adicionada no MySQL 8.0.18.

* `global_connection_memory_limit`: Quantia total máxima de memória que pode ser consumida por todas as conexões do usuário. Quando excedido por `Global_connection_memory`, todas as consultas dos usuários regulares são rejeitadas. Não se aplica a usuários do sistema, como o MySQL root. Adicionado no MySQL 8.0.28.

* `global_connection_memory_tracking`: Calcular ou não o uso da memória de conexão global (como mostrado em `Global_connection_memory`); o padrão é desativado. Foi adicionado no MySQL 8.0.28.

* `group_replication_advertise_recovery_endpoints`: Conexões oferecidas para recuperação distribuída. Adicionada no MySQL 8.0.21.

* `group_replication_autorejoin_tries`: Número de tentativas que o membro faz para se juntar ao grupo automaticamente. Adicionado no MySQL 8.0.16.

* `group_replication_clone_threshold`: Lacuna no número de transação entre o doador e o receptor acima da qual a operação de clonagem remota é usada para transferência de estado. Adicionada no MySQL 8.0.17.

* `group_replication_communication_debug_options`: Nível de mensagens de depuração para componentes de Replicação de Grupo. Adicionado no MySQL 8.0.3.

* `group_replication_communication_max_message_size`: Tamanho máximo da mensagem para comunicações de Replicação de Grupo, mensagens maiores são fragmentadas. Adicionada no MySQL 8.0.16.

* `group_replication_communication_stack`: Especifica qual pilha de comunicação (XCom ou MySQL) deve ser usada para estabelecer conexões de comunicação de grupo entre os membros. Adicionada no MySQL 8.0.27.

* `group_replication_consistency`: Tipo de garantia de consistência de transação que o grupo oferece. Adicionada no MySQL 8.0.14.

* `group_replication_exit_state_action`: Como a instância se comporta quando sai do grupo involuntariamente. Adicionada no MySQL 8.0.12.

* `group_replication_flow_control_hold_percent`: Porcentagem da quota do grupo que deve permanecer não utilizada. Adicionada no MySQL 8.0.2.

* `group_replication_flow_control_max_quota`: Quota máxima de controle de fluxo para o grupo. Adicionada no MySQL 8.0.2.

* `group_replication_flow_control_member_quota_percent`: A porcentagem da quota que o membro deve assumir está disponível para si mesmo ao calcular as cotas. Adicionada no MySQL 8.0.2.

* `group_replication_flow_control_min_quota`: Menor cota de controle de fluxo que pode ser atribuída por membro. Adicionada no MySQL 8.0.2.

* `group_replication_flow_control_min_recovery_quota`: Menor cota que pode ser atribuída por membro, pois outro membro do grupo está se recuperando. Adicionada no MySQL 8.0.2.

* `group_replication_flow_control_period`: Define quantos segundos esperar entre as iterações do controle de fluxo. Foi adicionado no MySQL 8.0.2.

* `group_replication_flow_control_release_percent`: Como a quota do grupo deve ser liberada quando o controle de fluxo não precisa mais restringir os membros do escritor. Adicionada no MySQL 8.0.2.

* `group_replication_ip_allowlist`: Lista de hosts permitidos para se conectar ao grupo (MySQL 8.0.22 e versões posteriores). Adicionada no MySQL 8.0.22.

* `group_replication_member_expel_timeout`: Tempo entre o suspeito de falha do membro do grupo e a expulsão dele do grupo, causando reconfiguração da adesão ao grupo. Adicionada no MySQL 8.0.13.

* `group_replication_member_weight`: Chance de este membro ser eleito como primário. Adicionada no MySQL 8.0.2.

* `group_replication_message_cache_size`: Memória máxima para cache de mensagens do motor de comunicação de grupo (XCom). Adicionada no MySQL 8.0.16.

* `group_replication_paxos_single_leader`: Use um único líder de consenso no modo single-primary. Adicionado no MySQL 8.0.27.

* `group_replication_recovery_compression_algorithms`: Algoritmos de compressão permitidos para conexões de recuperação saindo. Adicionado no MySQL 8.0.18.

* `group_replication_recovery_get_public_key`: Se deve aceitar a preferência sobre a obtenção da chave pública do doador. Adicionada no MySQL 8.0.4.

* `group_replication_recovery_public_key_path`: Para aceitar informações de chave pública. Adicionado no MySQL 8.0.4.

* `group_replication_recovery_tls_ciphersuites`: Suítes de cifra permitidas quando o TLSv1.3 é usado para criptografia de conexão com esta instância como membro cliente (membro associado). Adicionada no MySQL 8.0.19.

* `group_replication_recovery_tls_version`: Protocolos TLS permitidos para criptografia de conexão como membro cliente (membro que se junta). Adicionado no MySQL 8.0.19.

* `group_replication_recovery_zstd_compression_level`: Nível de compressão para conexões de recuperação que utilizam compressão zstd. Adicionado no MySQL 8.0.18.

* `group_replication_tls_source`: Fonte de material TLS para Replicação de Grupo. Adicionada no MySQL 8.0.21.

* `group_replication_unreachable_majority_timeout`: Quanto tempo esperar por partições de rede que resultem na saída de minoria do grupo. Adicionada no MySQL 8.0.2.

* `group_replication_view_change_uuid`: UUID para eventos de alteração de visualização GTIDs. Adicionada no MySQL 8.0.26.

* `histogram_generation_max_mem_size`: Memória máxima para criar estatísticas de histograma. Adicionada no MySQL 8.0.2.

* `immediate_server_version`: Número de versão do servidor MySQL do qual é a fonte de replicação imediata. Foi adicionado no MySQL 8.0.14.

* `information_schema_stats_expiry`: Configuração de expiração para estatísticas de tabela em cache. Adicionada no MySQL 8.0.3.

* `init_replica`: Declarações que são executadas quando a replica se conecta à fonte. Adicionada no MySQL 8.0.26.

* `innodb-dedicated-server`: Habilita a configuração automática do tamanho do pool de tampão, tamanho do arquivo de registro e método de esvaziamento. Adicionado no MySQL 8.0.3.

* `innodb_buffer_pool_debug`: Permite múltiplas instâncias de pool de buffer quando o tamanho do pool de buffer é menor que 1 GB. Adicionado no MySQL 8.0.0.

* `innodb_buffer_pool_in_core_file`: Controla a escrita de páginas do pool de buffer em arquivos de núcleo, com padrão OFF (a partir da versão 8.4) em sistemas que suportam `MADV_DONTDUMP`. Foi adicionado no MySQL 8.0.14.

* `innodb_checkpoint_disabled`: Desabilita os pontos de verificação para que a saída deliberada do servidor sempre inicie a recuperação. Foi adicionado no MySQL 8.0.2.

* `innodb_ddl_buffer_size`: O tamanho máximo do buffer para operações DDL. Adicionada no MySQL 8.0.27.

* `innodb_ddl_log_crash_reset_debug`: Opção de depuração que refaz os contadores de injeção de falhas no registro DDL. Adicionada no MySQL 8.0.3.

* `innodb_ddl_threads`: O número máximo de threads paralelas para a criação de índices. Foi adicionado no MySQL 8.0.27.

* `innodb_deadlock_detect`: Habilita ou desabilita a detecção de travamento. Adicionada no MySQL 8.0.0.

* `innodb_directories`: Define diretórios para varredura no início para arquivos de dados de espaço de tabela. Adicionada no MySQL 8.0.4.

* `innodb_doublewrite_batch_size`: Essa funcionalidade foi substituída por `innodb_doublewrite_pages`. Adicionada no MySQL 8.0.20.

* `innodb_doublewrite_dir`: Diretório do arquivo de buffer de escrita dupla. Adicionado no MySQL 8.0.20.

* `innodb_doublewrite_files`: Número de arquivos de dupla escrita. Adicionado no MySQL 8.0.20.

* `innodb_doublewrite_pages`: Número de páginas de escrita dupla por thread. Adicionada no MySQL 8.0.20.

* `innodb_extend_and_initialize`: Controla como as páginas do novo espaço de tabela são alocadas no Linux. Adicionada no MySQL 8.0.22.

* `innodb_fsync_threshold`: Controla a frequência com que o InnoDB realiza o fsync ao criar um novo arquivo. Foi adicionado no MySQL 8.0.13.

* `innodb_idle_flush_pct`: Limita operações I/0 quando o InnoDB está parado. Foi adicionado no MySQL 8.0.18.

* `innodb_log_checkpoint_fuzzy_now`: Opção de depuração que obriga o InnoDB a escrever um ponto de verificação difuso. Adicionada no MySQL 8.0.13.

* `innodb_log_spin_cpu_abs_lwm`: Quantia mínima de uso de CPU abaixo da qual os threads do usuário não giram mais enquanto aguardam um redo esvaziado. Foi adicionado no MySQL 8.0.11.

* `innodb_log_spin_cpu_pct_hwm`: Quantia máxima de uso de CPU acima da qual os threads do usuário não giram mais enquanto aguardam um redo esvaziado. Foi adicionado no MySQL 8.0.11.

* `innodb_log_wait_for_flush_spin_hwm`: Tempo médio máximo de esvaziamento de log após o qual os threads do usuário não retornam a girar enquanto aguardam um redo esvaziado. Foi adicionado no MySQL 8.0.11.

* `innodb_log_writer_threads`: Habilita threads de escritor de log dedicado para gravação e esvaziamento de logs de refazer. Adicionado no MySQL 8.0.22.

* `innodb_parallel_read_threads`: Número de threads para leituras paralelas de índice. Adicionado no MySQL 8.0.14.

* `innodb_print_ddl_logs`: Se deve ou não imprimir logs de DDL no log de erro. Adicionada no MySQL 8.0.3.

* `innodb_redo_log_archive_dirs`: Diretórios de arquivo de registro de correção rotulados. Adicionado no MySQL 8.0.17.

* `innodb_redo_log_capacity`: Limite de tamanho para arquivos de registro de refazer. Adicionado no MySQL 8.0.30.

* `innodb_redo_log_encrypt`: Controla a criptografia dos dados do log de revisão para espaços de tabela criptografados. Foi adicionado no MySQL 8.0.1.

* `innodb_scan_directories`: Define diretórios para varredura de arquivos de espaço de tabela durante a recuperação do InnoDB. Adicionada no MySQL 8.0.2.

* `innodb_segment_reserve_factor`: A porcentagem de páginas de segmento de espaço de tabela reservadas como páginas vazias. Adicionada no MySQL 8.0.26.

* `innodb_spin_wait_pause_multiplier`: Valor do multiplicador usado para determinar o número de instruções PAUSE em loops de espera de rotação. Foi adicionado no MySQL 8.0.16.

* `innodb_stats_include_delete_marked`: Inclua registros marcados para exclusão ao calcular estatísticas persistentes do InnoDB. Adicionada no MySQL 8.0.1.

* `innodb_temp_tablespaces_dir`: Caminho de espaços de tabelas temporários da sessão. Adicionado no MySQL 8.0.13.

* `innodb_tmpdir`: Local de diretório para arquivos de tabela temporários criados durante operações de ALTER TABLE online. Adicionada no MySQL 8.0.0.

* `innodb_undo_log_encrypt`: Controla a criptografia dos dados do registro de desfazer para espaços de tabela criptografados. Adicionada no MySQL 8.0.1.

* `innodb_use_fdatasync`: Se o InnoDB usa `fdatasync()` em vez de `fsync()` ao limpar dados para o sistema operacional. Adicionado no MySQL 8.0.26.

* `innodb_validate_tablespace_paths`: Habilita a validação do caminho do espaço de tabela no início. Foi adicionado no MySQL 8.0.21.

* `internal_tmp_mem_storage_engine`: Motor de armazenamento a ser utilizado para tabelas temporárias internas em memória. Adicionado no MySQL 8.0.2.

* `keyring-migration-destination`: Plugin de chave de destino de migração chave. Adicionado no MySQL 8.0.4.

* `keyring-migration-host`: Nome do host para conectar ao servidor em execução para migração de chave. Adicionado no MySQL 8.0.4.

* `keyring-migration-password`: Senha para conectar ao servidor em execução para migração de chave. Adicionada no MySQL 8.0.4.

* `keyring-migration-port`: Número de porta TCP/IP para conectar ao servidor em execução para migração de chave. Adicionado no MySQL 8.0.4.

* `keyring-migration-socket`: Arquivo de socket Unix ou tubo nomeado do Windows para conectar-se ao servidor em execução para migração de chave. Adicionado no MySQL 8.0.4.

* `keyring-migration-source`: Plugin de chave de segurança de origem migratória. Adicionado no MySQL 8.0.4.

* `keyring-migration-to-component`: Migração de chaveiro é de plugin para componente. Adicionada no MySQL 8.0.24.

* `keyring-migration-user`: Nome do usuário para conectar ao servidor em execução para migração de chave. Adicionado no MySQL 8.0.4.

* `keyring_aws_cmk_id`: Valor do ID da chave mestre do cliente do plugin do chaveiro AWS. Adicionado no MySQL 8.0.11.

* `keyring_aws_conf_file`: Localização do arquivo de configuração do plugin do chaveiro AWS. Adicionada no MySQL 8.0.11.

* `keyring_aws_data_file`: Localização do arquivo de armazenamento do plugin do chaveiro AWS. Adicionada no MySQL 8.0.11.

* `keyring_aws_region`: região do plugin de chave de segurança AWS. Adicionada no MySQL 8.0.11.

* `keyring_encrypted_file_data`: arquivo de dados do plugin `keyring_encrypted_file`. Adicionado no MySQL 8.0.11.

* `keyring_encrypted_file_password`: Senha do plugin `keyring_encrypted_file`. Adicionada no MySQL 8.0.11.

* `keyring_hashicorp_auth_path`: Caminho de autenticação do AppRole do HashiCorp Vault. Adicionado no MySQL 8.0.18.

* `keyring_hashicorp_ca_path`: Caminho para o arquivo CA `keyring_hashicorp`. Adicionado no MySQL 8.0.18.

* `keyring_hashicorp_caching`: Se deve habilitar o cache do `keyring_hashicorp`. Adicionada no MySQL 8.0.18.

* `keyring_hashicorp_commit_auth_path`: Valor `keyring_hashicorp_auth_path` em uso. Adicionado no MySQL 8.0.18.

* `keyring_hashicorp_commit_ca_path`: Valor `keyring_hashicorp_ca_path` em uso. Adicionado no MySQL 8.0.18.

* `keyring_hashicorp_commit_caching`: Valor `keyring_hashicorp_caching` em uso. Adicionado no MySQL 8.0.18.

* `keyring_hashicorp_commit_role_id`: Valor `keyring_hashicorp_role_id` em uso. Adicionado no MySQL 8.0.18.

* `keyring_hashicorp_commit_server_url`: Valor `keyring_hashicorp_server_url` em uso. Adicionado no MySQL 8.0.18.

* `keyring_hashicorp_commit_store_path`: Valor `keyring_hashicorp_store_path` em uso. Adicionado no MySQL 8.0.18.

* `keyring_hashicorp_role_id`: ID do papel de autenticação HashiCorp Vault AppRole. Adicionado no MySQL 8.0.18.

* `keyring_hashicorp_secret_id`: ID do segredo de autenticação do AppRole do HashiCorp Vault. Adicionado no MySQL 8.0.18.

* `keyring_hashicorp_server_url`: URL do servidor HashiCorp Vault. Adicionada no MySQL 8.0.18.

* `keyring_hashicorp_store_path`: Caminho da loja HashiCorp Vault. Adicionado no MySQL 8.0.18.

* `keyring_oci_ca_certificate`: Arquivo de certificado CA para autenticação de pares. Adicionado no MySQL 8.0.22.

* `keyring_oci_compartment`: Computador OCI OCID. Adicionado no MySQL 8.0.22.

* `keyring_oci_encryption_endpoint`: Ponto final do servidor de criptografia OCI. Adicionado no MySQL 8.0.22.

* `keyring_oci_key_file`: Arquivo de chave privada RSA do OCI. Adicionada no MySQL 8.0.22.

* `keyring_oci_key_fingerprint`: O arquivo de impressão digital da chave privada RSA do OCI. Adicionada no MySQL 8.0.22.

* `keyring_oci_management_endpoint`: Ponto final do servidor de gerenciamento do OCI. Adicionado no MySQL 8.0.22.

* `keyring_oci_master_key`: Chave mestre OCI OCID. Adicionada no MySQL 8.0.22.

* `keyring_oci_secrets_endpoint`: Ponto final do servidor de segredos do OCI. Adicionado no MySQL 8.0.22.

* `keyring_oci_tenancy`: OCID de locação OCI. Adicionada no MySQL 8.0.22.

* `keyring_oci_user`: O usuário OCI OCID. Adicionado no MySQL 8.0.22.

* `keyring_oci_vaults_endpoint`: Ponto final do servidor de armazém OCI. Adicionado no MySQL 8.0.22.

* `keyring_oci_virtual_vault`: OCI vault OCID. Adicionada no MySQL 8.0.22.

* `keyring_okv_conf_dir`: Diretório de configuração do plugin de chave do Oracle Key Vault. Adicionado no MySQL 8.0.11.

* `keyring_operations`: Se as operações de chave de segurança estão habilitadas. Adicionada no MySQL 8.0.4.

* `lock_order`: Se deve habilitar a ferramenta `LOCK_ORDER` no runtime. Adicionada no MySQL 8.0.17.

* `lock_order_debug_loop`: Se deve causar uma assertiva de depuração quando a ferramenta `LOCK_ORDER` encontra uma dependência marcada como loop. Adicionada no MySQL 8.0.17.

* `lock_order_debug_missing_arc`: Se deve causar uma assertiva de depuração quando a ferramenta `LOCK_ORDER` encontra uma dependência não declarada. Adicionada no MySQL 8.0.17.

* `lock_order_debug_missing_key`: Se deve causar uma assertiva de depuração quando a ferramenta `LOCK_ORDER` encontra um objeto que não está adequadamente instrumentado com o Gerador de Desempenho. Adicionada no MySQL 8.0.17.

* `lock_order_debug_missing_unlock`: Se deve causar uma assertiva de depuração quando a ferramenta `LOCK_ORDER` encontra um bloqueio que é destruído, mas ainda mantido. Adicionada no MySQL 8.0.17.

* `lock_order_dependencies`: Caminho para o arquivo `lock_order_dependencies.txt`. Adicionado no MySQL 8.0.17.

* `lock_order_extra_dependencies`: Caminho para o segundo arquivo de dependência. Adicionado no MySQL 8.0.17.

* `lock_order_output_directory`: Diretório onde a ferramenta `LOCK_ORDER` escreve logs. Adicionada no MySQL 8.0.17.

* `lock_order_print_txt`: Se deve realizar a análise de gráfico de ordem de bloqueio e imprimir relatório textual. Adicionado no MySQL 8.0.17.

* `lock_order_trace_loop`: Se deve imprimir o registro do arquivo de rastreamento quando a ferramenta `LOCK_ORDER` encontra uma dependência marcada como loop. Adicionada no MySQL 8.0.17.

* `lock_order_trace_missing_arc`: Se deve imprimir o registro do arquivo de rastreamento quando a ferramenta `LOCK_ORDER` encontra uma dependência não declarada. Adicionada no MySQL 8.0.17.

* `lock_order_trace_missing_key`: Se deve imprimir o registro do arquivo de rastreamento quando a ferramenta `LOCK_ORDER` encontra um objeto que não está adequadamente instrumentado com o Gerador de Dados de Desempenho. Adicionada no MySQL 8.0.17.

* `lock_order_trace_missing_unlock`: Se deve imprimir o registro do arquivo de rastreamento quando a ferramenta `LOCK_ORDER` encontra um bloqueio que é destruído, mas ainda mantido. Adicionada no MySQL 8.0.17.

* `log_error_filter_rules`: Regras de filtro para registro de erros. Adicionada no MySQL 8.0.2.

* `log_error_services`: Componentes a serem usados para registro de erros. Adicionado no MySQL 8.0.2.

* `log_error_suppression_list`: Mensagens de log de erro de aviso/informação para suprimir. Adicionada no MySQL 8.0.13.

* `log_replica_updates`: Se a replica deve registrar as atualizações realizadas pelo seu próprio thread de replicação SQL no seu próprio log binário. Adicionada no MySQL 8.0.26.

* `log_slow_extra`: Se deve escrever informações adicionais para retardar o arquivo de registro de consulta. Adicionado no MySQL 8.0.14.

* `log_slow_replica_statements`: As declarações lentas executadas pela replica são escritas no log de consulta lenta. Foi adicionado no MySQL 8.0.26.

* `mandatory_roles`: Papéis concedidos automaticamente para todos os usuários. Adicionada no MySQL 8.0.2.

* `mysql_firewall_mode`: Se o plugin do Firewall Empresarial MySQL está operacional. Adicionado no MySQL 8.0.11.

* `mysql_firewall_trace`: Se deve habilitar o rastreamento do plugin de firewall empresarial do MySQL. Adicionado no MySQL 8.0.11.

* `mysqlx`: Se o Plugin X está inicializado. Adicionado no MySQL 8.0.11.

* `mysqlx_compression_algorithms`: Algoritmos de compressão permitidos para conexões do X Protocol. Adicionado no MySQL 8.0.19.

* `mysqlx_deflate_default_compression_level`: Nível de compressão padrão para o algoritmo Deflate em conexões do X Protocol. Adicionado no MySQL 8.0.20.

* `mysqlx_deflate_max_client_compression_level`: Nível máximo de compressão permitido para o algoritmo Deflate em conexões do X Protocol. Adicionada no MySQL 8.0.20.

* `mysqlx_interactive_timeout`: Número de segundos para esperar que clientes interativos expirem o tempo. Foi adicionado no MySQL 8.0.4.

* `mysqlx_lz4_default_compression_level`: Nível de compressão padrão para o algoritmo LZ4 em conexões do X Protocol. Adicionado no MySQL 8.0.20.

* `mysqlx_lz4_max_client_compression_level`: Nível máximo de compressão permitido para o algoritmo LZ4 em conexões do X Protocol. Adicionado no MySQL 8.0.20.

* `mysqlx_read_timeout`: Número de segundos para esperar que as operações de leitura bloqueadas sejam concluídas. Adicionado no MySQL 8.0.4.

* `mysqlx_wait_timeout`: Número de segundos para esperar atividade da conexão. Adicionado no MySQL 8.0.4.

* `mysqlx_write_timeout`: Número de segundos para esperar que as operações de escrita sejam concluídas. Foi adicionado no MySQL 8.0.4.

* `mysqlx_zstd_default_compression_level`: Nível de compressão padrão para o algoritmo zstd em conexões do X Protocol. Adicionado no MySQL 8.0.20.

* `mysqlx_zstd_max_client_compression_level`: Nível máximo de compressão permitido para o algoritmo zstd em conexões do X Protocol. Adicionada no MySQL 8.0.20.

* `named_pipe_full_access_group`: Nome do grupo do Windows que recebeu acesso total ao tubo nomeado. Adicionado no MySQL 8.0.14.

* `no-dd-upgrade`: Impedir a atualização automática das tabelas do dicionário de dados no início. Adicionada no MySQL 8.0.4.

* `no-monitor`: Não bifurque o processo de monitoramento necessário para `RESTART`. Adicionado no MySQL 8.0.12.

* `original_commit_timestamp`: Hora em que a transação foi realizada na fonte original. Adicionada no MySQL 8.0.1.

* `original_server_version`: Número de versão do servidor MySQL do qual a transação foi originalmente comprometida. Foi adicionado no MySQL 8.0.14.

* `partial_revokes`: Se a revogação parcial está habilitada. Adicionada no MySQL 8.0.16.

* `password_history`: Número de alterações de senha necessárias antes da reutilização da senha. Adicionada no MySQL 8.0.3.

* `password_require_current`: Se as alterações de senha exigem verificação da senha atual. Adicionada no MySQL 8.0.13.

* `password_reuse_interval`: Número de dias que se passaram antes da reutilização da senha. Adicionada no MySQL 8.0.3.

* `performance-schema-consumer-events-statements-cpu`: Configure a declaração de consumo de uso de CPU. Adicionada no MySQL 8.0.28.

* `performance_schema_max_digest_sample_age`: Pergunta para resampling de idade em segundos. Adicionada no MySQL 8.0.3.

* `performance_schema_show_processlist`: Selecione a implementação de `SHOW PROCESSLIST`. Adicionada no MySQL 8.0.22.

* `persist_only_admin_x509_subject`: Certificado SSL X.509 do sujeito que permite a persistência de variáveis de sistema restritas. Foi adicionado no MySQL 8.0.14.

* `persist_sensitive_variables_in_plaintext`: Se o servidor é permitido armazenar os valores das variáveis de sistema sensíveis em um formato não criptografado. Adicionada no MySQL 8.0.29.

* `persisted_globals_load`: Se carregar configurações de configuração persistentes. Adicionado no MySQL 8.0.0.

* `print_identified_with_as_hex`: Para `SHOW CREATE USER`, imprima os valores de hash que contêm caracteres não imprimíveis em hexadecimal. Adicionada no MySQL 8.0.17.

* `protocol_compression_algorithms`: Algoritmos de compressão permitidos para conexões de entrada. Adicionado no MySQL 8.0.18.

* `pseudo_replica_mode`: Para uso interno do servidor. Adicionada no MySQL 8.0.26.

* `regexp_stack_limit`: Limite de tamanho da pilha de correspondência de expressão regular. Adicionada no MySQL 8.0.4.

* `regexp_time_limit`: Limite de tempo de correspondência com expressão regular. Adicionada no MySQL 8.0.4.

* `replica_checkpoint_group`: Número máximo de transações processadas por replica multithread antes que a operação de verificação de ponto seja chamada para atualizar o status do progresso. Não é suportado pelo NDB Cluster. Adicionado no MySQL 8.0.26.

* `replica_checkpoint_period`: Atualize o status do progresso da replica multithread e limpe as informações do log do relay para disco após este número de milissegundos. Não é suportado pelo NDB Cluster. Adicionado no MySQL 8.0.26.

* `replica_compressed_protocol`: Use compressão do protocolo de fonte/replica. Adicionada no MySQL 8.0.26.

* `replica_exec_mode`: Permite alternar o fio de replicação entre o modo IDEMPOTENT (chave e alguns outros erros suprimidos) e o modo STRICT; o modo STRICT é o padrão, exceto para o NDB Cluster, onde o IDEMPOTENT é sempre usado. Adicionado no MySQL 8.0.26.

* `replica_load_tmpdir`: Local onde a replica deve colocar seus arquivos temporários ao replicar as instruções LOAD DATA. Adicionada no MySQL 8.0.26.

* `replica_max_allowed_packet`: Tamanho máximo, em bytes, do pacote que pode ser enviado do servidor de origem de replicação para a réplica; substitui `max_allowed_packet`. Adicionado no MySQL 8.0.26.

* `replica_net_timeout`: Número de segundos para esperar mais dados da conexão de fonte/replica antes de abortar a leitura. Adicionado no MySQL 8.0.26.

* `replica_parallel_type`: Diz ao replica que use informações de marca-horário (`LOGICAL_CLOCK`) ou particionamento de banco de dados (DATABASE) para paralelizar as transações. Adicionado no MySQL 8.0.26.

* `replica_parallel_workers`: Número de threads do aplicativo para executar transações de replicação. NDB Cluster: consulte a documentação. Adicionada no MySQL 8.0.26.

* `replica_pending_jobs_size_max`: Tamanho máximo das filas de replicação de trabalhadores que retêm eventos ainda não aplicados. Adicionada no MySQL 8.0.26.

* `replica_preserve_commit_order`: Garante que todos os commits dos trabalhadores replicados ocorram na mesma ordem que na fonte para manter a consistência ao usar threads de aplicação paralela. Adicionado no MySQL 8.0.26.

* `replica_skip_errors`: Diz ao thread de replicação para continuar a replicação quando a consulta retorna um erro da lista fornecida. Adicionado no MySQL 8.0.26.

* `replica_sql_verify_checksum`: Faça com que a replica examine os checksums ao ler do log do relé. Adicionado no MySQL 8.0.26.

* `replica_transaction_retries`: Número de vezes que o SQL thread de replicação refaz a transação no caso de falhar com bloqueio ou timeout de espera de bloqueio, antes de desistir e parar. Foi adicionado no MySQL 8.0.26.

* `replica_type_conversions`: Controla o modo de conversão de tipo na replica. O valor é uma lista de zero ou mais elementos desta lista: `ALL_LOSSY`, `ALL_NON_LOSSY`. Defina como uma string vazia para não permitir conversões de tipo entre a fonte e a replica. Adicionado no MySQL 8.0.26.

* `replication_optimize_for_static_plugin_config`: Lâminas compartilhadas para replicação semiesincronizada. Adicionada no MySQL 8.0.23.

* `replication_sender_observe_commit_only`: Chamadas de retorno limitadas para replicação semiesincrônica. Adicionada no MySQL 8.0.23.

* `require_row_format`: Para uso interno do servidor. Adicionada no MySQL 8.0.19.

* `resultset_metadata`: Se o servidor retorna metadados do conjunto de resultados. Adicionado no MySQL 8.0.3.

* `rewriter_enabled_for_threads_without_privilege_checks`: Se estiver definido como OFF, as reescritas são ignoradas para os threads de replicação que executam com verificações de privilégio desativadas (`PRIVILEGE_CHECKS_USER` é NULL). Adicionado no MySQL 8.0.31.

* `rpl_read_size`: Defina o valor mínimo de dados em bytes que são lidos dos arquivos de registro binários e dos arquivos de registro de relevo. Foi adicionado no MySQL 8.0.11.

* `rpl_semi_sync_replica_enabled`: Se a replicação semi-sincronizada está habilitada no replica. Adicionada no MySQL 8.0.26.

* `rpl_semi_sync_replica_trace_level`: Nível de depuração de rastreamento de replicação semiesincrona no replica. Adicionado no MySQL 8.0.26.

* `rpl_semi_sync_source_enabled`: Se a replicação semisíncrona está habilitada na fonte. Adicionada no MySQL 8.0.26.

* `rpl_semi_sync_source_timeout`: Número de milissegundos para esperar o reconhecimento da réplica. Foi adicionado no MySQL 8.0.26.

* `rpl_semi_sync_source_trace_level`: Nível de rastreamento de depuração de replicação semiesincronizada na fonte. Adicionado no MySQL 8.0.26.

* `rpl_semi_sync_source_wait_for_replica_count`: Número de confirmações de replicação que a fonte deve receber por transação antes de prosseguir. Adicionado no MySQL 8.0.26.

* `rpl_semi_sync_source_wait_no_replica`: Se a fonte espera o tempo limite mesmo sem réplicas. Adicionada no MySQL 8.0.26.

* `rpl_semi_sync_source_wait_point`: Ponto de espera para o reconhecimento do recebimento de transação replicada. Adicionado no MySQL 8.0.26.

* `rpl_stop_replica_timeout`: Número de segundos que o STOP REPLICA espera antes de expirar o tempo. Foi adicionado no MySQL 8.0.26.

* `schema_definition_cache`: Número de objetos de definição de esquema que podem ser mantidos no cache do objeto do dicionário. Adicionado no MySQL 8.0.0.

* `secondary_engine_cost_threshold`: Limiar de custo do otimizador para transferência de consulta para um motor secundário. Adicionado no MySQL 8.0.16.

* `select_into_buffer_size`: Tamanho do buffer usado para o arquivo de exportação OUTFILE ou DUMPFILE; substitui `read_buffer_size`. Adicionado no MySQL 8.0.22.

* `select_into_disk_sync`: Sincronize dados com o dispositivo de armazenamento após o esvaziamento do buffer para o arquivo de exportação OUTFILE ou DUMPFILE; OFF desativa a sincronização e é o valor padrão. Adicionada no MySQL 8.0.22.

* `select_into_disk_sync_delay`: Quando `select_into_sync_disk = ON`, define um atraso em milissegundos após cada sincronização do buffer de arquivo de exportação de `OUTFILE` ou `DUMPFILE`, não há efeito de outra forma. Adicionado no MySQL 8.0.22.

* `show-replica-auth-info`: Mostre o nome do usuário e a senha na opção REPLICAS desta fonte. Adicionada no MySQL 8.0.26.

* `show_create_table_skip_secondary_engine`: Se deve excluir a cláusula SECONDARY ENGINE do resultado da EXIBIR CRIAR Tabela. Adicionada no MySQL 8.0.18.

* `show_create_table_verbosity`: Se deve exibir `ROW_FORMAT` em `SHOW CREATE TABLE` mesmo que tenha o valor padrão. Adicionada no MySQL 8.0.11.

* `show_gipk_in_create_table_and_information_schema`: Se as chaves primárias primárias invisíveis geradas são exibidas em declarações SHOW e nas tabelas `INFORMATION_SCHEMA`. Adicionada no MySQL 8.0.30.

* `skip-replica-start`: Se definido, a replicação não é iniciada automaticamente quando o servidor de replicação é iniciado. Foi adicionado no MySQL 8.0.26.

* `source_verify_checksum`: Faça com que a fonte da causa examine os checksums ao ler do log binário. Foi adicionado no MySQL 8.0.26.

* `sql_generate_invisible_primary_key`: Se deve gerar chaves primárias invisíveis para quaisquer tabelas InnoDB que foram criadas neste servidor e que não possuem PKs explícitos. Adicionada no MySQL 8.0.30.

* `sql_replica_skip_counter`: Número de eventos da fonte que a replicação deve ignorar. Não é compatível com a replicação GTID. Adicionada no MySQL 8.0.26.

* `sql_require_primary_key`: Se as tabelas devem ter chave primária. Adicionada no MySQL 8.0.13.

* `ssl_fips_mode`: Se deve habilitar o modo FIPS no lado do servidor. Adicionada no MySQL 8.0.11.

* `ssl_session_cache_mode`: Se deve habilitar a geração de ticket de sessão pelo servidor. Adicionada no MySQL 8.0.29.

* `ssl_session_cache_timeout`: Valor do tempo de espera da sessão SSL em segundos. Adicionado no MySQL 8.0.29.

* `sync_source_info`: Sincronize as informações de origem após cada evento a cada # evento. Adicionado no MySQL 8.0.26.

* `syseventlog.facility`: Instalação para mensagens syslog. Adicionada no MySQL 8.0.13.

* `syseventlog.include_pid`: Se incluir o PID do servidor nas mensagens do syslog. Adicionada no MySQL 8.0.13.

* `syseventlog.tag`: Marca para o identificador do servidor em mensagens de syslog. Adicionada no MySQL 8.0.13.

* `table_encryption_privilege_check`: Habilita a verificação de privilégio `TABLE_ENCRYPTION_ADMIN`. Adicionado no MySQL 8.0.16.

* `tablespace_definition_cache`: Número de objetos de definição de espaço de tabela que podem ser mantidos no cache do objeto dicionário. Adicionado no MySQL 8.0.0.

* `temptable_max_mmap`: O valor máximo de memória que o motor de armazenamento TempTable pode alocar a partir de arquivos temporários mapeados de memória. Adicionado no MySQL 8.0.23.

* `temptable_max_ram`: Define o valor máximo de memória que pode ser ocupado pelo motor de armazenamento TempTable antes dos dados serem armazenados no disco. Foi adicionado no MySQL 8.0.2.

* `temptable_use_mmap`: Define se o mecanismo de armazenamento TempTable aloca arquivos mapeados por memória quando o limite `temptable_max_ram` é atingido. Adicionado no MySQL 8.0.16.

* `terminology_use_previous`: Use a terminologia da versão anterior onde as alterações são incompatíveis. Adicionada no MySQL 8.0.26.

* `thread_pool_algorithm`: Algoritmo de pilha de threads. Adicionado no MySQL 8.0.11.

* `thread_pool_dedicated_listeners`: Dedica um fio de escuta em cada grupo de fios para ouvir eventos de rede. Adicionado no MySQL 8.0.23.

* `thread_pool_high_priority_connection`: Se a sessão atual é de alta prioridade. Adicionada no MySQL 8.0.11.

* `thread_pool_max_active_query_threads`: Número máximo permitido de threads de consulta ativa por grupo. Adicionada no MySQL 8.0.19.

* `thread_pool_max_transactions_limit`: Número máximo de transações permitidas durante a operação do pool de threads. Foi adicionado no MySQL 8.0.23.

* `thread_pool_max_unused_threads`: Número máximo permitido de fios não utilizados. Adicionado no MySQL 8.0.11.

* `thread_pool_prio_kickup_timer`: Quanto tempo antes a declaração é movida para execução de alta prioridade. Adicionada no MySQL 8.0.11.

* `thread_pool_query_threads_per_group`: Número máximo de threads de consulta para um grupo de threads. Adicionado no MySQL 8.0.31.

* `thread_pool_size`: Número de grupos de fios no conjunto de fios. Adicionado no MySQL 8.0.11.

* `thread_pool_stall_limit`: Quanto tempo antes a declaração é definida como travada. Adicionada no MySQL 8.0.11.

* `thread_pool_transaction_delay`: Período de atraso antes que o pool de threads execute uma nova transação. Foi adicionado no MySQL 8.0.31.

* `tls_ciphersuites`: Suítes de cifras TLSv1.3 permitidas para conexões criptografadas. Adicionada no MySQL 8.0.16.

* `upgrade`: Controle a atualização automática no início. Adicionado no MySQL 8.0.16.

* `use_secondary_engine`: Se executar consultas usando um motor secundário. Adicionado no MySQL 8.0.13.

* `validate-config`: Valide a configuração do servidor. Adicionada no MySQL 8.0.16.

* `validate_password.changed_characters_percentage`: Porcentagem mínima de caracteres alterados necessária para novas senhas. Adicionada no MySQL 8.0.34.

* `validate_password.check_user_name`: Se deve verificar senhas contra o nome do usuário. Adicionada no MySQL 8.0.4.

* `validate_password.dictionary_file`: arquivo de dicionário `validate_password`. Adicionado no MySQL 8.0.4.

* `validate_password.dictionary_file_last_parsed`: Quando o arquivo do dicionário foi analisado pela última vez. Adicionado no MySQL 8.0.4.

* `validate_password.dictionary_file_words_count`: Número de palavras no arquivo do dicionário. Adicionado no MySQL 8.0.4.

* `validate_password.length`: `validate_password` exigiu o comprimento da senha. Adicionada no MySQL 8.0.4.

* `validate_password.mixed_case_count`: Número necessário de caracteres maiúsculos/minúsculos. Adicionado no MySQL 8.0.4.

* `validate_password.number_count`: número necessário de caracteres numéricos. Adicionada no MySQL 8.0.4.

* `validate_password.policy`: política `validate_password password`. Adicionada no MySQL 8.0.4.

* `validate_password.special_char_count`: número necessário de caracteres especiais. Adicionado no MySQL 8.0.4.

* `version_compile_zlib`: Versão da biblioteca zlib compilada. Adicionada no MySQL 8.0.11.

* `windowing_use_high_precision`: Se deve calcular funções de janela com alta precisão. Adicionada no MySQL 8.0.2.

### Opções e variáveis descontinuadas no MySQL 8.0

As seguintes variáveis de sistema, variáveis de status e opções foram descontinuadas no MySQL 8.0.

* `Compression`: Se a conexão do cliente usa compressão no protocolo cliente/servidor. Desatualizado no MySQL 8.0.18.

* `Rpl_semi_sync_master_clients`: Número de réplicas semisíncronas. Desatualizado no MySQL 8.0.26.

* `Rpl_semi_sync_master_net_avg_wait_time`: Tempo médio que a fonte de dados esperou por respostas da réplica. Descontinuado no MySQL 8.0.26.

* `Rpl_semi_sync_master_net_wait_time`: A fonte de tempo total esperou por respostas da réplica. Desatualizada no MySQL 8.0.26.

* `Rpl_semi_sync_master_net_waits`: Número total de vezes que a fonte esperou por respostas da réplica. Desatualizado no MySQL 8.0.26.

* `Rpl_semi_sync_master_no_times`: Número de vezes que a fonte desligou a replicação semiesincronizada. Desatualizado no MySQL 8.0.26.

* `Rpl_semi_sync_master_no_tx`: Número de compromissos que não foram reconhecidos com sucesso. Desatualizado no MySQL 8.0.26.

* `Rpl_semi_sync_master_status`: Se a replicação semisíncrona está operacional na fonte. Descontinuada no MySQL 8.0.26.

* `Rpl_semi_sync_master_timefunc_failures`: Número de vezes que a fonte falhou ao chamar funções de tempo. Desatualizado no MySQL 8.0.26.

* `Rpl_semi_sync_master_tx_avg_wait_time`: Tempo médio que a fonte esperou por cada transação. Desatualizado no MySQL 8.0.26.

* `Rpl_semi_sync_master_tx_wait_time`: Tempo total que a fonte de transações esperou. Desatualizado no MySQL 8.0.26.

* `Rpl_semi_sync_master_tx_waits`: Número total de vezes que a fonte esperou por transações. Desatualizado no MySQL 8.0.26.

* `Rpl_semi_sync_master_wait_pos_backtraverse`: Número total de vezes que a fonte esperou por um evento com coordenadas binárias inferiores às esperadas anteriormente. Desatualizado no MySQL 8.0.26.

* `Rpl_semi_sync_master_wait_sessions`: Número de sessões atualmente aguardando respostas replicadas. Desatualizado no MySQL 8.0.26.

* `Rpl_semi_sync_master_yes_tx`: Número de commits reconhecidos com sucesso. Desatualizado no MySQL 8.0.26.

* `Rpl_semi_sync_slave_status`: Se a replicação semi-sincronizada está operacional no replica. Descontinuada no MySQL 8.0.26.

* `Rsa_public_key`: Valor da chave pública de autenticação RSA do plugin `sha256_password`. Desatualizado no MySQL 8.0.16.

* `Slave_open_temp_tables`: Número de tabelas temporárias que o thread de replicação SQL atualmente tem aberto. Desatualizado no MySQL 8.0.26.

* `Slave_rows_last_search_algorithm_used`: Algoritmo de pesquisa mais recentemente utilizado por esta replica para localizar linhas para replicação baseada em linha (índice, tabela ou varredura hash). Desatualizado no MySQL 8.0.26.

* `abort-slave-event-count`: Opção usada pelo mysql-test para depuração e teste de replicação. Desatualizada no MySQL 8.0.29.

* `admin-ssl`: Habilitar criptografia de conexão. Desatualizado no MySQL 8.0.26.

* `audit_log_connection_policy`: Política de registro de auditoria para eventos relacionados à conexão. Desatualizada no MySQL 8.0.34.

* `audit_log_exclude_accounts`: Contas que não devem ser auditadas. Desatualizado no MySQL 8.0.34.

* `audit_log_include_accounts`: Contas para auditoria. Descontinuada no MySQL 8.0.34.

* `audit_log_policy`: Política de registro de auditoria. Desatualizada no MySQL 8.0.34.

* `audit_log_statement_policy`: Política de registro de auditoria para eventos relacionados a declarações. Desatualizada no MySQL 8.0.34.

* `authentication_fido_rp_id`: ID da parte dependente para autenticação multifator FIDO. Desatualizado no MySQL 8.0.35.

* `binlog_format`: Especifica o formato do log binário. Desatualizado no MySQL 8.0.34.

* `binlog_transaction_dependency_tracking`: Fonte de informações sobre dependência (marcadores de commit ou conjuntos de escrita de transação) a partir da qual se pode avaliar quais transações podem ser executadas em paralelo pelo aplicativo multithread do replica. Desatualizado no MySQL 8.0.35.

* `character-set-client-handshake`: Não ignore o valor do conjunto de caracteres do lado do cliente enviado durante o handshake. Desatualizado no MySQL 8.0.35.

* `daemon_memcached_enable_binlog`: . Desatualizado no MySQL 8.0.22.

* `daemon_memcached_engine_lib_name`: Biblioteca compartilhada que implementa o plugin InnoDB memcached. Desatualizada no MySQL 8.0.22.

* `daemon_memcached_engine_lib_path`: Diretório que contém a biblioteca compartilhada que implementa o plugin InnoDB memcached. Desatualizado no MySQL 8.0.22.

* `daemon_memcached_option`: Opções separadas por espaço que são passadas ao daemon subjacente do memcached no início. Desatualizada no MySQL 8.0.22.

* `daemon_memcached_r_batch_size`: Especifica quantas operações de leitura do memcached devem ser realizadas antes de realizar o COMMIT para iniciar uma nova transação. Desatualizado no MySQL 8.0.22.

* `daemon_memcached_w_batch_size`: Especifica quantas operações de escrita no Memcached devem ser realizadas antes de realizar o COMMIT para iniciar uma nova transação. Desatualizado no MySQL 8.0.22.

* `default_authentication_plugin`: Plugin de autenticação padrão. Desatualizado no MySQL 8.0.27.

* `disconnect-slave-event-count`: Opção usada pelo mysql-test para depuração e teste de replicação. Desatualizada no MySQL 8.0.29.

* `expire_logs_days`: Limpe os logs binários após tantos dias. Desatualizado no MySQL 8.0.3.

* `group_replication_ip_whitelist`: Lista de hosts permitidos para se conectar ao grupo. Desatualizada no MySQL 8.0.22.

* `group_replication_primary_member`: UUID do membro primário quando o grupo opera no modo de único primário. String vazia se o grupo estiver operando no modo de múltiplos primários. Desatualizado no MySQL 8.0.4.

* `group_replication_recovery_complete_at`: Políticas de recuperação ao lidar com transações em cache após a transferência de estado. Desatualizada no MySQL 8.0.34.

* `have_openssl`: Se o mysqld suporta conexões SSL. Desatualizado no MySQL 8.0.26.

* `have_ssl`: Se o mysqld suporta conexões SSL. Desatualizado no MySQL 8.0.26.

* `init_slave`: Declarações que são executadas quando a replica se conecta à fonte. Desatualizada no MySQL 8.0.26.

* `innodb_api_bk_commit_interval`: Com que frequência auto-commitar conexões ociosas que utilizam a interface InnoDB memcached, em segundos. Desatualizado no MySQL 8.0.22.

* `innodb_api_disable_rowlock`: . Desatualizado no MySQL 8.0.22.

* `innodb_api_enable_binlog`: Permite o uso do plugin InnoDB memcached com o log binário do MySQL. Desatualizado no MySQL 8.0.22.

* `innodb_api_enable_mdl`: Bloqueia a tabela usada pelo plugin InnoDB memcached, para que não possa ser removida ou alterada por DDL através da interface SQL. Desatualizada no MySQL 8.0.22.

* `innodb_api_trx_level`: Permite o controle do nível de isolamento de transação em consultas processadas pela interface memcached. Desatualizado no MySQL 8.0.22.

* `innodb_log_file_size`: Tamanho de cada arquivo de registro no grupo de registros. Desatualizado no MySQL 8.0.30.

* `innodb_log_files_in_group`: Número de arquivos de registro do InnoDB no grupo de registro. Desatualizado no MySQL 8.0.30.

* `innodb_undo_tablespaces`: Número de arquivos do espaço de tabela para os quais os segmentos de rollback são divididos. Desatualizado no MySQL 8.0.4.

* `keyring_encrypted_file_data`: arquivo de dados do plugin `keyring_encrypted_file`. Desatualizado no MySQL 8.0.34.

* `keyring_encrypted_file_password`: senha do plugin `keyring_encrypted_file`. Desatualizada no MySQL 8.0.34.

* `keyring_file_data`: arquivo de dados do plugin `keyring_file`. Desatualizado no MySQL 8.0.34.

* `keyring_oci_ca_certificate`: Arquivo de certificado CA para autenticação de pares. Desatualizado no MySQL 8.0.31.

* `keyring_oci_compartment`: Computador de OCI OCID. Desatualizado no MySQL 8.0.31.

* `keyring_oci_encryption_endpoint`: Ponto final do servidor de criptografia OCI. Desatualizado no MySQL 8.0.31.

* `keyring_oci_key_file`: Arquivo de chave privada RSA do OCI. Desatualizado no MySQL 8.0.31.

* `keyring_oci_key_fingerprint`: O arquivo de impressão digital da chave privada RSA do OCI. Desatualizado no MySQL 8.0.31.

* `keyring_oci_management_endpoint`: Ponto final do servidor de gerenciamento do OCI. Desatualizado no MySQL 8.0.31.

* `keyring_oci_master_key`: Chave mestre OCI OCID. Desatualizada no MySQL 8.0.31.

* `keyring_oci_secrets_endpoint`: Ponto final do servidor de segredos do OCI. Desatualizado no MySQL 8.0.31.

* `keyring_oci_tenancy`: OC tenancy OCID. Descontinuada no MySQL 8.0.31.

* `keyring_oci_user`: OCI usuário OCID. Descontinuado no MySQL 8.0.31.

* `keyring_oci_vaults_endpoint`: Ponto final do servidor de armazém OCI. Desatualizado no MySQL 8.0.31.

* `keyring_oci_virtual_vault`: OCI vault OCID. Desatualizado no MySQL 8.0.31.

* `log_bin_trust_function_creators`: Se igual a 0 (padrão), então, quando o `--log-bin` é usado, a criação de função armazenada é permitida apenas para usuários com privilégio SUPER e apenas se a função criada não quebrar o registro binário. Desatualizado no MySQL 8.0.34.

* `log_bin_use_v1_row_events`: Se o servidor está usando eventos de linha de registro binário da versão 1. Descontinuado no MySQL 8.0.18.

* `log_slave_updates`: Se a replica deve registrar as atualizações realizadas pelo seu próprio thread de replicação SQL no seu próprio log binário. Desatualizado no MySQL 8.0.26.

* `log_slow_slave_statements`: As declarações lentas executadas por replica são escritas no log de consulta lenta. Desatualizado no MySQL 8.0.26.

* `log_statements_unsafe_for_binlog`: Desativa as advertências do erro 1592 que estão sendo escritas no log de erro. Desatualizado no MySQL 8.0.34.

* `log_syslog`: Se deve escrever o log de erro no syslog. Desatualizado no MySQL 8.0.2.

* `master-info-file`: Local e nome do arquivo que lembra a origem e onde o fio de replicação de E/S está no log binário da origem. Desatualizado no MySQL 8.0.18.

* `master_info_repository`: Se deve escrever o repositório de metadados de conexão, contendo informações de origem e localização da thread de I/O de replicação no log binário da fonte, em arquivo ou tabela. Desatualizado no MySQL 8.0.23.

* `master_verify_checksum`: Faça com que a fonte da causa examine os checksums ao ler do log binário. Depreendido no MySQL 8.0.26.

* `max_length_for_sort_data`: Número máximo de bytes em registros ordenados. Desatualizado no MySQL 8.0.20.

* `myisam_repair_threads`: Número de threads a serem usadas ao reparar tabelas MyISAM. 1 desativa a reparação paralela. Desatualizada no MySQL 8.0.29.

* `mysql_native_password_proxy_users`: Se o plugin de autenticação `mysql_native_password` faz proxeamento. Desatualizado no MySQL 8.0.16.

* `new`: Use funções muito novas, possivelmente "inseguras". Descontinuada no MySQL 8.0.35.

* `no-dd-upgrade`: Impedir a atualização automática das tabelas do dicionário de dados no início. Desatualizado no MySQL 8.0.16.

* `old`: Faça com que o servidor retorne a certos comportamentos presentes em versões anteriores. Depreendido no MySQL 8.0.35.

* `old-style-user-limits`: Habilitar limites de usuário de estilo antigo (antes da versão 5.0.3, os recursos do usuário eram contados por cada usuário + host em vez de por conta). Desatualizado no MySQL 8.0.30.

* `performance_schema_show_processlist`: Selecionar a implementação SHOW PROCESSLIST. Desatualizada no MySQL 8.0.35.

* `pseudo_slave_mode`: Para uso interno do servidor. Desatualizado no MySQL 8.0.26.

* `query_prealloc_size`: Buffer persistente para a análise e execução de consultas. Desatualizado no MySQL 8.0.29.

* `relay_log_info_file`: Nome do arquivo para o repositório de metadados do aplicativo no qual os registros replicam informações sobre os registros de retransmissão. Desatualizado no MySQL 8.0.18.

* `relay_log_info_repository`: Se deve escrever a localização do fio de replicação SQL nos logs do relé em arquivo ou tabela. Desatualizado no MySQL 8.0.23.

* `replica_parallel_type`: Diz ao replica que use informações de marca-horário (`LOGICAL_CLOCK`) ou particionamento de banco de dados (`DATABASE`) para paralelizar as transações. Desatualizado no MySQL 8.0.29.

* `rpl_semi_sync_master_enabled`: Se a replicação semi-sincronizada está habilitada na fonte. Desatualizada no MySQL 8.0.26.

* `rpl_semi_sync_master_timeout`: Número de milissegundos para esperar o reconhecimento da réplica. Desatualizado no MySQL 8.0.26.

* `rpl_semi_sync_master_trace_level`: Nível de depuração de rastreamento de replicação semiesincrona na fonte. Desatualizado no MySQL 8.0.26.

* `rpl_semi_sync_master_wait_for_slave_count`: Número de confirmações de replicação que a fonte deve receber por transação antes de prosseguir. Desatualizado no MySQL 8.0.26.

* `rpl_semi_sync_master_wait_point`: Ponto de espera para o reconhecimento do recibo de transação replicada. Desatualizado no MySQL 8.0.26.

* `rpl_semi_sync_slave_enabled`: Se a replicação semi-sincronizada está habilitada no replica. Desatualizado no MySQL 8.0.26.

* `rpl_semi_sync_slave_trace_level`: Nível de depuração de rastreamento de replicação semiesincrona no replica. Desatualizado no MySQL 8.0.26.

* `rpl_stop_slave_timeout`: Número de segundos que o STOP REPLICA ou o STOP SLAVE espera antes de expirar o tempo. Desatualizado no MySQL 8.0.26.

* `safe-user-create`: Não permita a criação de novos usuários por usuários que não tenham privilégios de escrita na tabela `mysql.user`; esta opção é desatualizada e ignorada. Desatualizada no MySQL 8.0.11.

* `sha256_password_auto_generate_rsa_keys`: Se deve gerar arquivos de par de chave RSA automaticamente. Desatualizado no MySQL 8.0.16.

* `sha256_password_private_key_path`: Nome do caminho da chave privada do plugin de autenticação SHA256. Desatualizado no MySQL 8.0.16.

* `sha256_password_proxy_users`: Se o plugin de autenticação `sha256_password` faz proxeamento. Desatualizado no MySQL 8.0.16.

* `sha256_password_public_key_path`: Nome do caminho da chave pública do plugin de autenticação SHA256. Desatualizado no MySQL 8.0.16.

* `show-slave-auth-info`: Mostre o nome do usuário e a senha nas opções SHOW REPLICAS e SHOW SLAVE HOSTS nesta fonte. Desatualizada no MySQL 8.0.26.

* `skip-character-set-client-handshake`: Ignorar o valor do conjunto de caracteres do lado do cliente enviado durante o handshake. Desatualizado no MySQL 8.0.35.

* `skip-host-cache`: Não cache nomes de host. Desatualizado no MySQL 8.0.30.

* `skip-new`: Não use novas rotinas, que podem estar erradas. Descontinuada no MySQL 8.0.35.

* `skip-slave-start`: Se definido, a replicação não é iniciada automaticamente quando o servidor de replicação é iniciado. Desatualizado no MySQL 8.0.26.

* `skip-ssl`: Desative a criptografia de conexão. Desatualizado no MySQL 8.0.26.

* `slave-skip-errors`: Diga ao thread de replicação que continue a replicação quando a consulta retorna um erro da lista fornecida. Desatualizado no MySQL 8.0.26.

* `slave_checkpoint_group`: Número máximo de transações processadas por replica multithread antes que a operação de verificação de ponto seja chamada para atualizar o status do progresso. Não é suportado pelo NDB Cluster. Desatualizado no MySQL 8.0.26.

* `slave_checkpoint_period`: Atualize o status do progresso da replica multithread e limpe as informações do log do relay para disco após este número de milissegundos. Não é suportado pelo NDB Cluster. Desatualizado no MySQL 8.0.26.

* `slave_compressed_protocol`: Use compressão do protocolo de fonte/replica. Desatualizado no MySQL 8.0.18.

* `slave_exec_mode`: Permite alternar o fio de replicação entre o modo IDEMPOTENT (chave e alguns outros erros suprimidos) e o modo STRICT; o modo STRICT é o padrão, exceto para o NDB Cluster, onde o IDEMPOTENT é sempre usado. Desatualizado no MySQL 8.0.26.

* `slave_load_tmpdir`: Local onde a replica deve colocar seus arquivos temporários ao replicar as instruções LOAD DATA. Desatualizado no MySQL 8.0.26.

* `slave_max_allowed_packet`: Tamanho máximo, em bytes, do pacote que pode ser enviado do servidor de origem de replicação para a réplica; substitui `max_allowed_packet`. Desatualizado no MySQL 8.0.26.

* `slave_net_timeout`: Número de segundos para esperar mais dados da conexão de fonte/replica antes de abortar a leitura. Desatualizado no MySQL 8.0.26.

* `slave_parallel_type`: Diz ao replica que use informações de marca-horário (`LOGICAL_CLOCK`) ou particionamento de banco de dados (`DATABASE`) para paralelizar as transações. Desatualizado no MySQL 8.0.26.

* `slave_parallel_workers`: Número de threads do aplicativo para executar transações de replicação em paralelo; 0 ou 1 desativa a replicação multithreading. NDB Cluster: consulte a documentação. Desatualizado no MySQL 8.0.26.

* `slave_pending_jobs_size_max`: Tamanho máximo das filas de trabalho de replicação que retêm eventos ainda não aplicados. Desatualizado no MySQL 8.0.26.

* `slave_preserve_commit_order`: Garante que todos os commits dos trabalhadores replicados ocorram na mesma ordem que na fonte para manter a consistência ao usar threads de aplicação paralela. Desatualizado no MySQL 8.0.26.

* `slave_rows_search_algorithms`: Determina os algoritmos de pesquisa utilizados para o agrupamento de lotes de atualização de réplica. Qualquer um dos 2 ou 3 itens desta lista: `INDEX_SEARCH`, `TABLE_SCAN`, `HASH_SCAN`. Desatualizado no MySQL 8.0.18.

* `slave_sql_verify_checksum`: Faça com que a replica examine os checksums ao ler do log do relé. Desatualizado no MySQL 8.0.26.

* `slave_transaction_retries`: Número de vezes que o fio de replicação SQL refaz a transação no caso de falhar com bloqueio ou timeout de espera de bloqueio, antes de desistir e parar. Desatualizado no MySQL 8.0.26.

* `slave_type_conversions`: Controla o modo de conversão de tipo na replica. O valor é uma lista de zero ou mais elementos desta lista: `ALL_LOSSY`, `ALL_NON_LOSSY`. Defina como uma string vazia para não permitir conversões de tipo entre a fonte e a replica. Desatualizada no MySQL 8.0.26.

* `sql_slave_skip_counter`: Número de eventos da fonte que a replicação deve ignorar. Não é compatível com a replicação GTID. Desatualizado no MySQL 8.0.26.

* `ssl`: Habilitar criptografia de conexão. Desatualizado no MySQL 8.0.26.

* `ssl_fips_mode`: Se deve habilitar o modo FIPS no lado do servidor. Desatualizado no MySQL 8.0.34.

* `symbolic-links`: Permitir links simbólicos para tabelas MyISAM. Desatualizado no MySQL 8.0.2.

* `sync_master_info`: Sincronize as informações de origem após cada evento a cada # evento. Desatualizado no MySQL 8.0.26.

* `sync_relay_log_info`: Sincronize o arquivo relay.info no disco após cada evento no #. Desatualizado no MySQL 8.0.34.

* `temptable_use_mmap`: Define se o mecanismo de armazenamento TempTable aloca arquivos mapeados por memória quando o limite `temptable_max_ram` é atingido. Desatualizado no MySQL 8.0.26.

* `transaction_prealloc_size`: Buffer persistente para transações serem armazenadas em log binário. Desatualizado no MySQL 8.0.29.

* `transaction_write_set_extraction`: Define o algoritmo usado para hashar os dados extraídos durante a transação. Desatualizado no MySQL 8.0.26.

### Opções e Variáveis Removidas no MySQL 8.0

As seguintes variáveis de sistema, variáveis de status e opções foram removidas no MySQL 8.0.

* `Com_alter_db_upgrade`: Contagem de declarações de ALTER DATABASE... UPGRADE DATA DIRECTORY NAME. Removida no MySQL 8.0.0.

* `Innodb_available_undo_logs`: Número total de segmentos de rollback do InnoDB; diferente de `innodb_rollback_segments`, que exibe o número de segmentos de rollback ativos. Removido no MySQL 8.0.2.

* `Qcache_free_blocks`: Número de blocos de memória livres na cache de consulta. Removido no MySQL 8.0.3.

* `Qcache_free_memory`: Quantidade de memória livre para cache de consulta. Removido no MySQL 8.0.3.

* `Qcache_hits`: Número de acertos no cache de consultas. Removido no MySQL 8.0.3.

* `Qcache_inserts`: Número de inserções de cache de consulta. Removido no MySQL 8.0.3.

* `Qcache_lowmem_prunes`: Número de consultas que foram excluídas do cache de consultas devido à falta de memória livre no cache. Removido no MySQL 8.0.3.

* `Qcache_not_cached`: Número de consultas não armazenadas em cache (não armazenáveis ou não armazenadas em cache devido à configuração `query_cache_type`). Removido no MySQL 8.0.3.

* `Qcache_queries_in_cache`: Número de consultas registradas na cache de consultas. Removido no MySQL 8.0.3.

* `Qcache_total_blocks`: Número total de blocos na cache de consulta. Removido no MySQL 8.0.3.

* `Slave_heartbeat_period`: Intervalo de batida de replicação da replica, em segundos. Removido no MySQL 8.0.1.

* `Slave_last_heartbeat`: Mostra quando o sinal mais recente do batimento cardíaco foi recebido, no formato TIMESTAMP. Removido no MySQL 8.0.1.

* `Slave_received_heartbeats`: Número de batimentos cardíacos recebidos pela réplica desde o último reajuste. Removido no MySQL 8.0.1.

* `Slave_retried_transactions`: Número total de vezes desde a inicialização em que o fio de replicação SQL refez as transações. Removido no MySQL 8.0.1.

* `Slave_running`: Estado deste servidor como replica (status de thread de I/O de replicação). Removido no MySQL 8.0.1.

* `bootstrap`: Usado pelos scripts de instalação do MySQL. Removido no MySQL 8.0.0.

* `date_format`: `DATE ` format (não utilizado). Removido no MySQL 8.0.3.

* `datetime_format`: formato `DATETIME/TIMESTAMP` (não utilizado). Removido no MySQL 8.0.3.

* `des-key-file`: Carregar chaves para `des_encrypt()` e `des_encrypt` a partir do arquivo fornecido. Removido no MySQL 8.0.3.

* `group_replication_allow_local_disjoint_gtids_join`: Permitir que o servidor atual se junte ao grupo mesmo que tenha transações não presentes no grupo. Removido no MySQL 8.0.4.

* `have_crypt`: Disponibilidade da chamada de sistema `crypt()`. Removida no MySQL 8.0.3.

* `ignore-db-dir`: Trate o diretório como um diretório não-de-banco. Removido no MySQL 8.0.0.

* `ignore_builtin_innodb`: Ignore built-in InnoDB. Removido no MySQL 8.0.3.

* `ignore_db_dirs`: Diretórios tratados como diretórios não-de-banco de dados. Removido no MySQL 8.0.0.

* `innodb_checksums`: Habilitar a validação de verificações de checksum do InnoDB. Removido no MySQL 8.0.0.

* `innodb_disable_resize_buffer_pool_debug`: Desabilita o redimensionamento do buffer pool do InnoDB. Removido no MySQL 8.0.0.

* `innodb_file_format`: Formato para novas tabelas InnoDB. Removido no MySQL 8.0.0.

* `innodb_file_format_check`: Se o InnoDB realiza verificação de compatibilidade de formato de arquivo. Removido no MySQL 8.0.0.

* `innodb_file_format_max`: Marca de formato de arquivo em espaço de tabela compartilhado. Removida no MySQL 8.0.0.

* `innodb_large_prefix`: Habilita chaves mais longas para índices de prefixo de coluna. Removido no MySQL 8.0.0.

* `innodb_locks_unsafe_for_binlog`: Forçar o InnoDB a não usar o bloqueio de próxima chave. Em vez disso, use apenas bloqueio de nível de linha. Removido no MySQL 8.0.0.

* `innodb_scan_directories`: Define diretórios para varredura de arquivos de espaço de tabela durante a recuperação do InnoDB. Removido no MySQL 8.0.4.

* `innodb_stats_sample_pages`: Número de páginas de índice a serem amostradas para estatísticas de distribuição de índice. Removido no MySQL 8.0.0.

* `innodb_support_xa`: Habilitar suporte InnoDB para XA dois-fase de compromisso. Removido no MySQL 8.0.0.

* `innodb_undo_logs`: Número de registros de desfazer (segmentos de rollback) usados pelo InnoDB; sinônimo de `innodb_rollback_segments`. Removido no MySQL 8.0.2.

* `internal_tmp_disk_storage_engine`: Motor de armazenamento para tabelas temporárias internas. Removido no MySQL 8.0.16.

* `log-warnings`: Escreva alguns avisos não críticos no arquivo de registro. Removido no MySQL 8.0.3.

* `log_builtin_as_identified_by_password`: Se deve registrar `CREATE/ALTER USER`, `GRANT` de forma retrocompatível. Removido no MySQL 8.0.11.

* `log_error_filter_rules`: Regras de filtro para registro de erros. Removido no MySQL 8.0.4.

* `log_syslog`: Se deve escrever o log de erro no syslog. Removido no MySQL 8.0.13.

* `log_syslog_facility`: Instalação para mensagens syslog. Removida no MySQL 8.0.13.

* `log_syslog_include_pid`: Se incluir o PID do servidor nas mensagens do syslog. Removido no MySQL 8.0.13.

* `log_syslog_tag`: Marca para o identificador do servidor em mensagens de syslog. Removido no MySQL 8.0.13.

* `max_tmp_tables`: Desutilizado. Removido no MySQL 8.0.3.

* `metadata_locks_cache_size`: Tamanho do cache de bloqueios de metadados. Removido no MySQL 8.0.13.

* `metadata_locks_hash_instances`: Número de hashes de bloqueio de metadados. Removido no MySQL 8.0.13.

* `multi_range_count`: Número máximo de intervalos a serem enviados ao manipulador de tabela de uma vez durante seleções de intervalo. Removido no MySQL 8.0.3.

* `myisam_repair_threads`: Número de fios a serem usados ao reparar tabelas MyISAM. 1 desativa a reparação paralela. Removido no MySQL 8.0.30.

* `old_passwords`: Seleciona o método de hashing de senha para `PASSWORD()`. Removido no MySQL 8.0.11.

* `partition`: Habilitar (ou desabilitar) suporte de particionamento. Removido no MySQL 8.0.0.

* `query_cache_limit`: Não cache os resultados que são maiores que este. Removido no MySQL 8.0.3.

* `query_cache_min_res_unit`: Tamanho mínimo da unidade na qual o espaço para os resultados é alocado (a última unidade é recortada após a escrita de todos os dados dos resultados). Removido no MySQL 8.0.3.

* `query_cache_size`: Memória alocada para armazenar resultados de consultas antigas. Removida no MySQL 8.0.3.

* `query_cache_type`: Tipo de cache de consulta. Removido no MySQL 8.0.3.

* `query_cache_wlock_invalidate`: Invalida consultas no cache de consultas no LOCK para escrita. Removido no MySQL 8.0.3.

* `secure_auth`: Não permita autenticação para contas que tenham senhas antigas (pré-4.1). Removido no MySQL 8.0.3.

* `show_compatibility_56`: Compatibilidade para `SHOW STATUS/VARIABLES`. Removida no MySQL 8.0.1.

* `skip-partition`: Não habilite a partição definida pelo usuário. Removido no MySQL 8.0.0.

* `sync_frm`: Sincronize `.frm` no disco ao criar. Ativado por padrão. Removido no MySQL 8.0.0.

* `temp-pool`: A utilização desta opção faz com que a maioria dos ficheiros temporários criados utilizem um conjunto pequeno de nomes, em vez de um nome único para cada novo ficheiro. Removido no MySQL 8.0.1.

* `time_format`: formato `TIME` (não utilizado). Removido no MySQL 8.0.3.

* `tx_isolation`: Nível de isolamento de transação padrão. Removido no MySQL 8.0.3.

* `tx_read_only`: Modo padrão de acesso à transação. Removido no MySQL 8.0.3.