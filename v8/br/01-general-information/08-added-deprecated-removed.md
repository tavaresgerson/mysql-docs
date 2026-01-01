## 1.5 Variáveis e Opções de Servidor e Status Adicionadas, Desatualizadas ou Removidas no MySQL 8.4 a partir de 8.0

*  Opções e Variáveis Introduzidas no MySQL 8.4
*  Opções e Variáveis Desatualizadas no MySQL 8.4
*  Opções e Variáveis Removidas no MySQL 8.4

Esta seção lista as variáveis de servidor, variáveis de status e opções que foram adicionadas pela primeira vez, desatualizadas ou removidas no MySQL 8.4 a partir de 8.0.

### Opções e Variáveis Introduzidas no MySQL 8.4

As seguintes variáveis de sistema, variáveis de status e opções de servidor foram adicionadas no MySQL 8.4.

* `audit_log_direct_writes`: Número de escritas diretas no log de auditoria. Adicionada em MySQL 8.1.0.
* `Com_show_binary_log_status`: Contagem de declarações `SHOW BINARY LOG STATUS`. Use em vez de `Com_show_master_status`. Adicionada em MySQL 8.2.0.
* `Deprecated_use_i_s_processlist_count`: Número de vezes que a tabela `INFORMATION_SCHEMA.processlist` foi acessada. Adicionada em MySQL 8.3.0.
* `Deprecated_use_i_s_processlist_last_timestamp`: Hora do último acesso à tabela `INFORMATION_SCHEMA.processlist` (timestamp). Adicionada em MySQL 8.3.0.
* `Gr_all_consensus_proposals_count`: Soma de todas as propostas iniciadas e encerradas neste nó. Adicionada em MySQL 8.1.0.
* `Gr_all_consensus_time_sum`: Soma do tempo total de todas as rodadas de consenso iniciadas e encerradas neste nó. Juntamente com `count_all_consensus_proposals`, podemos identificar se o tempo de cada rodada está aumentando, sinalizando assim um possível problema. Adicionada em MySQL 8.1.0.
* `Gr_certification_garbage_collector_count`: Número de vezes que a coleta de lixo de certificação foi executada. Adicionada em MySQL 8.1.0.
* `Gr_certification_garbage_collector_time_sum`: Soma do tempo em microsegundos que a coleta de lixo de certificação levou. Adicionada em MySQL 8.1.0.
* `Gr_consensus_bytes_received_sum`: Soma de bytes de nível de socket recebidos por nós de grupo que têm como destino este nó. Adicionada em MySQL 8.1.0.
* `Gr_consensus_bytes_sent_sum`: Soma de bytes de nível de socket enviados para todos os nós de grupo que têm origem neste nó. Bytes de nível de socket significam que iremos relatar mais dados aqui do que nos mensagens enviadas. Por exemplo, se tivermos um grupo com 3 membros e enviarmos uma mensagem de 100 bytes, este valor representará 300 bytes, pois enviamos 100 bytes para cada membro. Adicionada em MySQL 8.1.0.
* `Gr_control_messages_sent_bytes_sum`: Soma de bytes dos mensagens de controle enviadas por este membro. O tamanho é o tamanho no nível de rede. Adicionada em MySQL 8.1.0.
* `Gr_control_messages_sent_count`: Número de mensagens de controle enviadas por este membro. Adicionada em MySQL 8.1.0.
* `Gr_control_messages_sent_roundtrip_time_sum`: Soma do tempo de ida e volta das mensagens de controle enviadas por este membro. O tempo é medido entre o envio e a entrega da mensagem no membro remetente. Este tempo mede o tempo entre o envio e a entrega da mensagem no maior número de membros do grupo (que inclui o membro remetente). Adicionada em MySQL 8.1.0.
* `Gr_data_messages_sent_bytes_sum`: Soma de bytes dos mensagens de dados enviadas por este membro. O tamanho é o tamanho no nível de rede. Adicionada em MySQL 8.1.0.
* `Gr_data_messages_sent_count`: Número de mensagens de dados enviadas por este membro. Contagem de mensagens de dados enviadas. Adicionada em MySQL 8.1.0.
* `Gr_data_messages_sent_roundtrip_time_sum`: Soma do tempo de ida e volta das mensagens de dados enviadas por este membro. O tempo é medido entre o envio e a entrega da mensagem no membro remetente. Este tempo mede o tempo entre o envio e a entrega da mensagem no maior número de membros do grupo (que inclui o membro remetente). Adicionada em MySQL 8.1.0.
* `Gr_empty_consensus_proposals_count`: Soma de todas as rodadas de consenso vazias iniciadas e encerradas neste nó. Adicionada em MySQL 8.1.0.
* `Gr_extended_consensus_count`: Número de rodadas de 3 fases PAXOS iniciadas por este nó. Se este número aumentar, significa que pelo menos um dos nós está tendo problemas para responder às propostas, seja por lentidão ou problemas de rede. Use juntamente com `count_member_failure_suspicions` para tentar fazer um diagnóstico. Adicionada em MySQL 8.1.0.
* `Gr_last_consensus_end_timestamp`: O horário em que nossa última proposta de consenso foi aprovada. Relatado em formato de timestamp. Isso indica se o grupo está parado ou progredindo lentamente. Adicionado no MySQL 8.1.0.
* `Gr_total_messages_sent_count`: O número de mensagens de alto nível que este nó enviou ao grupo. Essas mensagens são as que recebemos via API para serem propostas ao grupo. O XCom possui um mecanismo de loteamento que reúne essas mensagens e as propõe em conjunto. Isso contabiliza o número de mensagens antes do loteamento. Adicionado no MySQL 8.1.0.
* `Gr_transactions_consistency_after_sync_count`: Número de transações em servidores secundários que aguardaram para iniciar, enquanto esperavam que as transações do servidor primário com `group_replication_consistency= AFTER` e `BEFORE_AND_AFTER` fossem confirmadas. Adicionado no MySQL 8.1.0. * `Gr_transactions_consistency_after_sync_time_sum`: Soma do tempo em microssegundos que as transações nos servidores secundários aguardaram para iniciar, enquanto esperavam que as transações do servidor primário com `group_replication_consistency= AFTER` e `BEFORE_AND_AFTER` fossem confirmadas. Adicionado no MySQL 8.1.0.

* `Gr_transactions_consistency_after_termination_count`: Número de transações executadas com `group_replication_consistency= AFTER` e `BEFORE_AND_AFTER`. Adicionado no MySQL 8.1.0.

* `Gr_transactions_consistency_after_termination_time_sum`: Soma do tempo em microssegundos decorrido entre a entrega da transação executada com `group_replication_consistency=AFTER` e `BEFORE_AND_AFTER` e o reconhecimento dos outros membros do grupo de que a transação está preparada. Não inclui o tempo de ida e volta do envio da transação. Adicionado no MySQL 8.1.0.
* `Gr_transactions_consistency_before_begin_count`: Número de transações executadas com `group_replication_consistency= BEFORE` e `BEFORE_AND_AFTER`. Adicionado no MySQL 8.1.0.
* `Gr_transactions_consistency_before_begin_time_sum`: Soma do tempo em microssegundos que o membro esperou até que seu canal `group_replication_applier` fosse consumido antes de executar a transação com `group_replication_consistency= BEFORE` e `BEFORE_AND_AFTER`. Adicionado no MySQL 8.1.0.

* `Performance_schema_meter_lost`: Número de instrumentos de medição que não puderam ser criados. Adicionado no MySQL 8.2.0.
* `Performance_schema_metric_lost`: Número de instrumentos de métrica que não puderam ser criados. Adicionado no MySQL 8.2.0.
* `Telemetry_metrics_supported`: Indica se as métricas de telemetria do servidor são suportadas. Adicionado no MySQL 8.2.0.
* `Tls_sni_server_name`: Nome do servidor fornecido pelo cliente. Adicionado no MySQL 8.1.0.
* `authentication_ldap_sasl_connect_timeout`: Tempo limite de conexão do servidor LDAP baseado em SASL. Adicionado no MySQL 8.1.0.
* `authentication_ldap_sasl_response_timeout`: Tempo limite de resposta do servidor LDAP simples. Adicionado no MySQL 8.1.0.

* `authentication_ldap_simple_connect_timeout`: Tempo limite de conexão do servidor LDAP simples. Adicionado no MySQL 8.1.0.
* `authentication_ldap_simple_response_timeout`: Tempo limite de resposta do servidor LDAP simples. Adicionado no MySQL 8.1.0.
* `authentication_webauthn_rp_id`: ID da parte confiável para autenticação multifator. Adicionado no MySQL 8.2.0.
* `check-table-functions`: Como proceder ao verificar o dicionário de dados em busca de funções usadas em restrições de tabela e outras expressões, e se tal função causar um erro. Use WARN para registrar avisos; `ABORT` (padrão) também registra avisos e interrompe qualquer atualização em andamento. Adicionado no MySQL 8.4.5.
* `component_masking.dictionaries_flush_interval_seconds`: Quanto tempo o agendador deve esperar antes de tentar agendar a próxima execução, em segundos. Adicionado no MySQL 8.3.0.

* `component_masking.masking_database`: Banco de dados a ser usado para mascarar dicionários. Adicionado no MySQL 8.3.0.
* `group_replication_preemptive_garbage_collection`: Habilita a coleta de lixo preemptiva no modo primário único; sem efeito no modo multi-primário. Adicionado no MySQL 8.4.0.
* `group_replication_preemptive_garbage_collection_rows_threshold`: Número de linhas de informações de certificação necessárias para acionar a coleta de lixo preemptiva no modo primário único quando habilitada por `group_replication_preemptive_garbage_collection`. Adicionado no MySQL 8.4.0.
* `keyring-migration-from-component`: A migração do chaveiro é de componente para plugin. Adicionado no MySQL 8.4.0.
* `mysql-native-password`: Habilita o plugin de autenticação `mysql_native_password`. Adicionado no MySQL 8.4.0.
* `mysql_firewall_database`: Banco de dados do qual o plugin MySQL Enterprise Firewall obtém suas tabelas e procedimentos armazenados. Adicionado no MySQL 8.2.0.
* `mysql_firewall_reload_interval_seconds`: Recarrega os dados do plugin MySQL Enterprise Firewall em intervalos especificados. Adicionado no MySQL 8.2.0.
* `performance_schema_max_meter_classes`: Número máximo de instrumentos de medição que podem ser criados. Adicionado no MySQL 8.2.0.
* `performance_schema_max_metric_classes`: Número máximo de instrumentos de métrica que podem ser criados. Adicionado no MySQL 8.2.0.
* `restrict_fk_on_non_standard_key`: Impede a criação de chaves estrangeiras em chaves não exclusivas ou parciais. Adicionado no MySQL 8.4.0.
* `set_operations_bu* `ffer_size`: Quantidade de memória disponível para o hashing de operações de conjunto. Adicionado no MySQL 8.2.0.
* `telemetry.live_sessions`: Exibe o número atual de sessões instrumentadas com telemetria. Adicionado no MySQL 8.1.0.
* `telemetry.metrics_enabled`: Controla se as métricas de telemetria são coletadas ou não. Adicionado no MySQL 8.3.0.
* `telemetry.metrics_reader_frequency_1`: Adicionado no MySQL 8.3.0.
* `telemetry.metrics_reader_frequency_2`: Adicionado no MySQL 8.3.0.
* `telemetry.metrics_reader_frequency_3`: Adicionado no MySQL 8.3.0.
* `telemetry.otel_bsp_max_export_batch_size`: Tamanho máximo do lote. Adicionado no MySQL 8.1.0.
* `telemetry.otel_bsp_max_queue_size`: Tamanho máximo da fila. Adicionado no MySQL 8.1.0.
* `telemetry.otel_bsp_schedule_delay`: Intervalo de atraso entre duas exportações consecutivas em milissegundos. Adicionado no MySQL 8.1.0.
* `telemetry.otel_exporter_otlp_metrics_certificates`: O certificado confiável a ser usado ao verificar as credenciais TLS de um servidor. Adicionado no MySQL 8.3.0.
* `telemetry.otel_exporter_otlp_metrics_cipher`: Cifra TLS a ser usada para métricas (TLS 1.2). Adicionado no MySQL 8.3.0.

* `telemetry.otel_exporter_otlp_metrics_cipher_suite`: Cifra TLS a ser usada para métricas (TLS 1.3). Adicionado no MySQL 8.3.0.
* `telemetry.otel_exporter_otlp_metrics_client_certificates`: Certificado/cadeia de confiança do cliente para a chave privada do cliente no formato PEM. Adicionado no MySQL 8.3.0.
* `telemetry.otel_exporter_otlp_metrics_client_key`: Chave privada do cliente no formato PEM. Adicionado no MySQL 8.3.0.
* `telemetry.otel_exporter_otlp_metrics_compression`: Compressão usada pelo exportador. Adicionado no MySQL 8.3.0.
* `telemetry.otel_exporter_otlp_metrics_endpoint`: URL do endpoint de métricas. Adicionado no MySQL 8.3.0.

* `telemetry.otel_exporter_otlp_metrics_headers`: Pares de chave-valor a serem usados ​​como cabeçalhos associados às solicitações HTTP. Adicionado no MySQL 8.3.0.
* `telemetry.otel_exporter_otlp_metrics_max_tls`: Versão máxima do TLS a ser usada para métricas. Adicionado no MySQL 8.3.0.
* `telemetry.otel_exporter_otlp_metrics_min_tls`: Versão mínima do TLS a ser usada para métricas. Adicionado no MySQL 8.3.0.
* `telemetry.otel_exporter_otlp_metrics_protocol`: Especifica o protocolo de transporte OTLP. Adicionado no MySQL 8.3.0.
* `telemetry.otel_exporter_otlp_metrics_timeout`: Tempo que o exportador OLTP aguarda por cada exportação em lote. Adicionado no MySQL 8.3.0.

* `telemetry.otel_exporter_otlp_traces_certificates`: O certificado confiável a ser usado ao verificar as credenciais TLS de um servidor. Adicionado no MySQL 8.1.0.
* `telemetry.otel_exporter_otlp_traces_cipher`: Cifra TLS a ser usada para rastreamentos (TLS 1.2). Adicionado no MySQL 8.3.0.
* `telemetry.otel_exporter_otlp_traces_cipher_suite`: Cifra TLS a ser usada para rastreamentos (TLS 1.3). Adicionado no MySQL 8.3.0.
* `telemetry.otel_exporter_otlp_traces_client_certificates`: Certificado/cadeia de confiança do cliente para a chave privada do cliente no formato PEM. Adicionado no MySQL 8.1.0.
* `telemetry.otel_exporter_otlp_traces_client_key`: Chave privada do cliente no formato PEM. Adicionado no MySQL 8.1.0.
* `telemetry.otel_exporter_otlp_traces_compression`: Compressão usada pelo exportador. Adicionado no MySQL 8.1.0.
* `telemetry.otel_exporter_otlp_traces_endpoint`: URL de destino para a qual o exportador envia rastreamentos. Adicionado no MySQL 8.1.0.
* `telemetry.otel_exporter_otlp_traces_headers`: Pares de chave-valor a serem usados ​​como cabeçalhos associados a solicitações HTTP. Adicionado no MySQL 8.1.0.
* `telemetry.otel_exporter_otlp_traces_max_tls`: Versão máxima do TLS a ser usada para rastreamentos. Adicionado no MySQL 8.3.0.
* `telemetry.otel_exporter_otlp_traces_min_tls`: Versão mínima do TLS a ser usada para rastreamentos. Adicionado no MySQL 8.3.0.
* `telemetry.otel_exporter_otlp_traces_protocol`: Protocolo de transporte OTLP. Adicionado no MySQL 8.1.0.
* `telemetry.otel_exporter_otlp_traces_timeout`: Tempo que o exportador OLTP aguarda por cada exportação em lote. Adicionado no MySQL 8.1.0.
* `telemetry.otel_log_level`: Controla quais logs do OpenTelemetry são impressos nos logs do servidor (somente Linux). Adicionado no MySQL 8.1.0.
* `telemetry.otel_resource_attributes`: Consulte a variável correspondente do OpenTelemetry `OTEL_RESOURCE_ATTRIBUTES`. Adicionado no MySQL 8.1.0.
* `telemetry.query_text_enabled`: Controla se o texto da consulta SQL é incluído no rastreamento (somente Linux). Adicionado no MySQL 8.1.0.
* `telemetry.trace_enabled`: Controla se os rastreamentos de telemetria são coletados ou não (somente Linux). Adicionado no MySQL 8.1.0. * `thread_pool_longrun_trx_limit`: Quando todas as threads que utilizam `thread_pool_max_transactions_limit` estiverem em execução por mais tempo do que este número de milissegundos, o limite para o grupo é suspenso. Adicionado no MySQL 8.4.0.
* `tls_certificates_enforced_validation`: Indica se os certificados do servidor e da CA devem ser validados. Adicionado no MySQL 8.1.0.

### Opções e Variáveis Desatualizadas no MySQL 8.4

As seguintes variáveis de sistema, variáveis de status e opções foram desatualizadas no MySQL 8.4.

* `Com_show_master_status`: Número de declarações `SHOW MASTER STATUS`. Desatualizada no MySQL 8.2.0.
* `authentication_fido_rp_id`: ID de parte confiável para autenticação multifator `FIDO`. Desatualizada no MySQL 8.2.0.
* `binlog_transaction_dependency_tracking`: Fonte de informações de dependência (marcadores de commit ou conjuntos de escrita de transações) a partir da qual se pode avaliar quais transações podem ser executadas em paralelo pelo aplicativo multithread da replica. Desatualizada no MySQL 8.2.0.
* `character-set-client-handshake`: Não ignore o valor do conjunto de caracteres do lado do cliente enviado durante o handshake. Desatualizada no MySQL 8.2.0.
* `group_replication_allow_local_lower_version_join`: Permitir que o servidor atual se junte ao grupo mesmo que tenha uma versão de plugin menor que o grupo. Desatualizada no MySQL 8.4.0.
* `group_replication_view_change_uuid`: UUID para GTIDs de eventos de mudança de visualização. Desatualizada no MySQL 8.3.0.
* `mysql-native-password`: Habilitar o plugin de autenticação `mysql_native_password`. Desatualizada no MySQL 8.4.0.
* `new`: Usar funções muito novas, possivelmente 'inseguras'. Desatualizada no MySQL 8.2.0.
* `old`: Fazer com que o servidor retorne a certos comportamentos presentes em versões mais antigas. Desatualizada no MySQL 8.2.0.
* `performance_schema_show_processlist`: Implementar a seleção `SHOW PROCESSLIST`. Desatualizada no MySQL 8.2.0.
* `restrict_fk_on_non_standard_key`: Proibir a criação de chaves estrangeiras em chaves não únicas ou parciais. Desatualizada no MySQL 8.4.0.
* `skip-character-set-client-handshake`: Ignorar o valor do conjunto de caracteres do lado do cliente enviado durante o handshake. Desatualizada no MySQL 8.2.0.
* `skip-new`: Não usar rotinas novas, possivelmente erradas. Desatualizada no MySQL 8.2.0.

### Opções e variáveis ​​removidas no MySQL 8.4

As seguintes variáveis ​​de sistema, variáveis ​​de status e opções foram removidas no MySQL 8.4.

* `Com_change_master`: Contagem das instruções `ALTER MASTER TO` e `CHANGE REPLICATION SOURCE TO`. Removido no MySQL 8.4.0.
* `Com_show_master_status`: Contagem das instruções `SHOW MASTER STATUS`. Removido no MySQL 8.4.0.
* `Com_show_slave_hosts`: Contagem das instruções `SHOW REPLICAS` e `SHOW SLAVE HOSTS`. Removido no MySQL 8.4.0.
* `Com_show_slave_status`: Contagem das instruções `SHOW REPLICA STATUS` e `SHOW SLAVE STATUS`. Removido no MySQL 8.4.0.
* `Com_slave_start`: Contagem das instruções `START REPLICA` e `START SLAVE`. Removido no MySQL 8.4.0.
* `Com_slave_stop`: Contagem das instruções `STOP REPLICA` e `STOP SLAVE`. Removido no MySQL 8.4.0.
* `Replica_rows_last_search_algorithm_used`: Algoritmo de pesquisa mais recentemente usado por esta replica para localizar linhas para replicação baseada em índice, tabela ou varredura hash. Removido no MySQL 8.3.0.
* `abort-slave-event-count`: Opção usada pelo mysql-test para depuração e teste de replicação. Removido no MySQL 8.2.0.
* `admin_ssl`: Habilitar criptografia de conexão. Removido no MySQL 8.4.0.
* `authentication_fido_rp_id`: ID de parte confiável para autenticação FIDO multifator. Removido no MySQL 8.4.0.
* `avoid_temporal_upgrade`: Se `ALTER TABLE` deve atualizar colunas temporais pré-5.6.4. Removido no MySQL 8.4.0.
* `binlog_transaction_dependency_tracking`: Fonte de informações de dependência (marcadores de commit ou conjuntos de escrita de transação) a partir da qual avaliar quais transações podem ser executadas em paralelo pelo aplicativo multithreading da replica. Removido no MySQL 8.4.0.
* `character-set-client-handshake`: Não ignorar o valor do conjunto de caracteres do lado do cliente enviado durante o handshake. Removido no MySQL 8.3.0.
* `daemon_memcached_enable_binlog`: . Removido no MySQL 8.3.0.
* `daemon_memcached_engine_lib_name`: Nome da biblioteca compartilhada que implementa o plugin InnoDB memcached. Removido no MySQL 8.3.0.
* `daemon_memcached_engine_lib_path`: Diretório que contém a biblioteca compartilhada que implementa o plugin InnoDB memcached. Removido no MySQL 8.3.0.
* `daemon_memcached_option`: Opções separadas por espaços que são passadas ao daemon memcached subjacente no início. Removido no MySQL 8.3.0.
* `daemon_memcached_r_batch_size`: Especifica quantas operações de leitura do memcached devem ser realizadas antes de fazer `COMMIT` para iniciar uma nova transação. Removido no MySQL 8.3.0.
* `daemon_memcached_w_batch_size`: Especifica quantas operações de escrita do memcached devem ser realizadas antes de fazer `COMMIT` para iniciar uma nova transação. Removido no MySQL 8.3.0.
* `default_authentication_plugin`: Plugin de autenticação padrão. Removido no MySQL 8.4.0.
* `disconnect-slave-event-count`: Opção usada pelo mysql-test para depuração e teste de replicação. Removido no MySQL 8.2.0.
* `expire_logs_days`: Limpar logs binários após quantos dias. Removido no MySQL 8.2.0.
* `group_replication_ip_whitelist`: Lista de hosts permitidos para se conectar ao grupo. Removido no MySQL 8.3.0.
* `group_replication_primary_member`: `UUID` do membro primário quando o grupo opera no modo único-primário. Cadeia vazia se o grupo estiver operando no modo multi-primário. Removido no MySQL 8.3.0.
* `group_replication_recovery_complete_at`: Políticas de recuperação quando se lida com transações em cache após a transferência de estado. Removido no MySQL 8.4.0.
* `have_openssl`: Se o mysqld suporta conexões SSL. Removido no MySQL 8.4.0.
* `have_openssl`: Indica se o mysqld suporta conexões SSL. Removido no MySQL 8.4.0.
* `have_ssl`: Indica se o mysqld suporta conexões SSL. Removido no MySQL 8.4.0.
* `innodb`: Habilita o InnoDB (se esta versão do MySQL o suportar). Removido no MySQL 8.3.0.
* `innodb_api_bk_commit_interval`: Define a frequência com que as conexões ociosas que usam a interface memcached do InnoDB devem ser automaticamente confirmadas, em segundos. Removido no MySQL 8.3.0.
* `innodb_api_disable_rowlock`: Removido no MySQL 8.3.0.
* `innodb_api_enable_binlog`: Permite o uso do plugin memcached do InnoDB com o log binário do MySQL. Removido no MySQL 8.3.0.
* `innodb_api_enable_mdl`: Bloqueia a tabela usada pelo plugin InnoDB memcached, impedindo que ela seja descartada ou alterada por meio de comandos DDL na interface SQL. Removido no MySQL 8.3.0.
* `innodb_api_trx_level`: Permite o controle do nível de isolamento de transação em consultas processadas pela interface memcached. Removido no MySQL 8.3.0.
* `keyring_encrypted_file_data`: Arquivo de dados do plugin `keyring_encrypted_file`. Removido no MySQL 8.4.0.
* `keyring_encrypted_file_password`: Senha do plugin `keyring_encrypted_file`. Removido no MySQL 8.4.0.
* `keyring_file_data`: Arquivo de dados do plugin `keyring_file`. Removido no MySQL 8.4.0.
* `keyring_oci_ca_certificate`: Arquivo de certificado CA para autenticação entre pares. Removido no MySQL 8.4.0.
* `keyring_oci_compartment`: OCID do compartimento OCI. Removido no MySQL 8.4.0.
* `keyring_oci_encryption_endpoint`: Endpoint do servidor de criptografia OCI. Removido no MySQL 8.4.0.
* `keyring_oci_key_file`: Arquivo de chave privada RSA OCI. Removido no MySQL 8.4.0.
* `keyring_oci_key_fingerprint`: Impressão digital do arquivo de chave privada RSA OCI. Removido no MySQL 8.4.0.
* `keyring_oci_management_endpoint`: Endpoint do servidor de gerenciamento OCI. Removido no MySQL 8.4.0.
* `keyring_oci_master_key`: OCID da chave mestra OCI. Removido no MySQL 8.4.0.
* `keyring_oci_secrets_endpoint`: Endpoint do servidor de segredos OCI. Removido no MySQL 8.4.0. * `keyring_oci_tenancy`: OCID da tenancy OCI. Removido no MySQL 8.4.0.
* `keyring_oci_user`: OCID do usuário OCI. Removido no MySQL 8.4.0.
* `keyring_oci_vaults_endpoint`: Endpoint do servidor de cofres OCI. Removido no MySQL 8.4.0.
* `keyring_oci_virtual_vault`: OCID do cofre OCI. Removido no MySQL 8.4.0.
* `language`: Mensagens de erro do cliente no idioma especificado. Pode ser fornecido como o caminho completo. Removido no MySQL 8.4.0.
* `log_bin_use_v1_row_events`: Indica se o servidor está usando eventos de linha do log binário versão 1. Removido no MySQL 8.3.0.
* `master-info-file`: Localização e nome do arquivo que armazena a origem e a localização do thread de replicação de E/S no log binário da origem. Removido no MySQL 8.3.0.
* `master_info_repository`: Indica se o repositório de metadados da conexão, contendo informações da origem e a localização do thread de E/S de replicação no log binário da origem, deve ser gravado em arquivo ou tabela. Removido no MySQL 8.3.0.
* `new`: Utiliza funções muito novas, possivelmente 'inseguras'. Removido no MySQL 8.4.0.
* `no-dd-upgrade`: Impede a atualização automática das tabelas do dicionário de dados na inicialização. Removido no MySQL 8.4.0.
* `old`: Faz com que o servidor retorne a certos comportamentos presentes em versões anteriores. Removido no MySQL 8.4.0.
* `old-style-user-limits`: Habilita os limites de usuário no estilo antigo (antes da versão 5.0.3, os recursos do usuário eram contabilizados por usuário + host, em vez de por conta). Removido no MySQL 8.3.0.
* `relay_log_info_file`: Nome do arquivo para o repositório de metadados do aplicador no qual a réplica registra informações sobre os logs de retransmissão. Removido no MySQL 8.3.0.
* `relay_log_info_repository`: Indica se a localização da thread SQL de replicação deve ser gravada nos logs de replicação em um arquivo ou tabela. Removido no MySQL 8.3.0.
* `show_old_temporals`: Indica se o comando `SHOW CREATE TABLE` deve indicar colunas temporais anteriores à versão 5.6.4. Removido no MySQL 8.4.0.
* `skip-character-set-client-handshake`: Ignora o valor do conjunto de caracteres do lado do cliente enviado durante o handshake. Removido no MySQL 8.3.0.
* `skip-host-cache`: Não armazena em cache os nomes de host. Removido no MySQL 8.3.0.
* `skip-ssl`: Desativa a criptografia de conexão. Removido no MySQL 8.4.0.
* `slave_rows_search_algorithms`: Determina os algoritmos de pesquisa usados ​​para o processamento em lote de atualizações de réplicas. Quaisquer 2 ou 3 desta lista: `INDEX_SEARCH`, `TABLE_SCAN`, `HASH_SCAN`. Removido no MySQL 8.3.0.
* `ssl`: Habilita a criptografia de conexão. Removido no MySQL 8.4.0.
* `transaction_write_set_extraction`: Define o algoritmo usado para gerar o hash das gravações extraídas durante a transação. Removido no MySQL 8.3.0.
