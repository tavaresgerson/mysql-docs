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
* `Gr_last_consensus

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
* `have_ssl