#### 22.5.6.3 Variáveis de Status do Plugin X

As variáveis de status do plugin X têm os seguintes significados.

* `Mysqlx_aborted_clients`

  O número de clientes desconectados devido a um erro de entrada ou saída.

* `Mysqlx_address`

  O endereço de rede ou endereços para os quais o plugin X aceita conexões TCP/IP. Se vários endereços foram especificados usando a variável de sistema `mysqlx_bind_address`, `Mysqlx_address` exibe apenas esses endereços para os quais a vinculação teve sucesso. Se a vinculação falhou para todos os endereços de rede especificados por `mysqlx_bind_address`, ou se a opção `skip_networking` foi usada, o valor de `Mysqlx_address` é `UNDEFINED`. Se o início do plugin X ainda não estiver completo, o valor de `Mysqlx_address` é vazio.

* `Mysqlx_bytes_received`

  O número total de bytes recebidos através da rede. Se a compressão for usada para a conexão, esse número inclui os payloads de mensagens comprimidas medidos antes da descompactação (`Mysqlx_bytes_received_compressed_payload`), quaisquer itens em mensagens comprimidas que não foram comprimidos, como cabeçalhos do Protocolo X, e quaisquer mensagens não comprimidas.

* `Mysqlx_bytes_received_compressed_payload`

  O número de bytes recebidos como payloads de mensagens comprimidas, medidos antes da descompactação.

* `Mysqlx_bytes_received_uncompressed_frame`

  O número de bytes recebidos como payloads de mensagens comprimidas, medidos após a descompactação.

* `Mysqlx_bytes_sent`

  O número total de bytes enviados através da rede. Se a compressão for usada para a conexão, esse número inclui os payloads de mensagens comprimidas medidos após a compressão (`Mysqlx_bytes_sent_compressed_payload`), quaisquer itens em mensagens comprimidas que não foram comprimidos, como cabeçalhos do Protocolo X, e quaisquer mensagens não comprimidas.

* `Mysqlx_bytes_sent_compressed_payload`

O número de bytes enviados como cargas úteis de mensagens compactadas, medido após a compactação.

* `Mysqlx_bytes_sent_uncompressed_frame`

O número de bytes enviados como cargas úteis de mensagens compactadas, medido antes da compactação.

* `Mysqlx_compression_algorithm`

(Alcance de sessão) O algoritmo de compactação em uso para a conexão do Protocolo X para esta sessão. Os algoritmos de compactação permitidos estão listados na variável de sistema `mysqlx_compression_algorithms`.

* `Mysqlx_compression_level`

(Alcance de sessão) O nível de compactação em uso para a conexão do Protocolo X para esta sessão.

* `Mysqlx_connection_accept_errors`

O número de conexões que causaram erros de aceitação.

* `Mysqlx_connection_errors`

O número de conexões que causaram erros.

* `Mysqlx_connections_accepted`

O número de conexões que foram aceitas.

* `Mysqlx_connections_closed`

O número de conexões que foram fechadas.

* `Mysqlx_connections_rejected`

O número de conexões que foram rejeitadas.

* `Mysqlx_crud_create_view`

O número de solicitações de criação de visualizações recebidas.

* `Mysqlx_crud_delete`

O número de solicitações de exclusão recebidas.

* `Mysqlx_crud_drop_view`

O número de solicitações de exclusão de visualizações recebidas.

* `Mysqlx_crud_find`

O número de solicitações de busca recebidas.

* `Mysqlx_crud_insert`

O número de solicitações de inserção recebidas.

* `Mysqlx_crud_modify_view`

O número de solicitações de modificação de visualizações recebidas.

* `Mysqlx_crud_update`

O número de solicitações de atualização recebidas.

* `Mysqlx_cursor_close`

O número de mensagens de fechamento de cursor recebidas.

* `Mysqlx_cursor_fetch`

O número de mensagens de recuperação de cursor recebidas.

* `Mysqlx_cursor_open`

O número de mensagens de abertura de cursor recebidas.

* `Mysqlx_errors_sent`

O número de erros enviados aos clientes.

* `Mysqlx_errors_unknown_message_type`

  O número de tipos de mensagens desconhecidos recebidos.

* `Mysqlx_expect_close`

  O número de blocos de expectativa fechados.

* `Mysqlx_expect_open`

  O número de blocos de expectativa abertos.

* `Mysqlx_init_error`

  O número de erros durante a inicialização.

* `Mysqlx_messages_sent`

  O número total de mensagens de todos os tipos enviadas aos clientes.

* `Mysqlx_notice_global_sent`

  O número de notificações globais enviadas aos clientes.

* `Mysqlx_notice_other_sent`

  O número de outros tipos de notificações enviadas de volta aos clientes.

* `Mysqlx_notice_warning_sent`

  O número de avisos enviados de volta aos clientes.

* `Mysqlx_notified_by_group_replication`

  Número de notificações de Grupo de Replicação enviadas aos clientes.

* `Mysqlx_port`

  A porta TCP para a qual o Plugin X está ouvindo. Se uma ligação de rede falhou ou se a variável de sistema `skip_networking` estiver habilitada, o valor mostra `UNDEFINED`.

* `Mysqlx_prep_deallocate`

  O número de mensagens de alocação de declarações preparadas recebidas

* `Mysqlx_prep_execute`

  O número de mensagens de execução de declarações preparadas recebidas

* `Mysqlx_prep_prepare`

  O número de mensagens de preparação de declarações recebidas

* `Mysqlx_rows_sent`

  O número de linhas enviadas de volta aos clientes.

* `Mysqlx_sessions`

  O número de sessões que foram abertas.

* `Mysqlx_sessions_accepted`

  O número de tentativas de sessão que foram aceitas.

* `Mysqlx_sessions_closed`

  O número de sessões que foram fechadas.

* `Mysqlx_sessions_fatal_error`

  O número de sessões que foram fechadas com um erro fatal.

* `Mysqlx_sessions_killed`

  O número de sessões que foram encerradas.

* `Mysqlx_sessions_rejected`

  O número de tentativas de sessão que foram rejeitadas.

* `Mysqlx_socket`

O socket Unix no qual o X Plugin está ouvindo.

* `Mysqlx_ssl_accept_renegotiates`

  O número de negociações necessárias para estabelecer a conexão.

* `Mysqlx_ssl_accepts`

  O número de conexões SSL aceitas.

* `Mysqlx_ssl_active`

  Se o SSL está ativo.

* `Mysqlx_ssl_cipher`

  O cifrador SSL atual (vazio para conexões não SSL).

* `Mysqlx_ssl_cipher_list`

  Uma lista de cifradores SSL possíveis (vazio para conexões não SSL).

* `Mysqlx_ssl_ctx_verify_depth`

  O limite de profundidade de verificação de certificado atualmente definido em ctx.

* `Mysqlx_ssl_ctx_verify_mode`

  O modo de verificação de certificado atualmente definido em ctx.

* `Mysqlx_ssl_finished_accepts`

  O número de conexões SSL bem-sucedidas com o servidor.

* `Mysqlx_ssl_server_not_after`

  A última data para a qual o certificado SSL é válido.

* `Mysqlx_ssl_server_not_before`

  A primeira data para a qual o certificado SSL é válido.

* `Mysqlx_ssl_verify_depth`

  A profundidade de verificação de certificado para conexões SSL.

* `Mysqlx_ssl_verify_mode`

  O modo de verificação de certificado para conexões SSL.

* `Mysqlx_ssl_version`

  O nome do protocolo usado para conexões SSL.

* `Mysqlx_stmt_create_collection`

  O número de declarações de criação de coleção recebidas.

* `Mysqlx_stmt_create_collection_index`

  O número de declarações de criação de índice de coleção recebidas.

* `Mysqlx_stmt_disable_notices`

  O número de declarações de desabilitação de avisos recebidas.

* `Mysqlx_stmt_drop_collection`

  O número de declarações de eliminação de coleção recebidas.

* `Mysqlx_stmt_drop_collection_index`

  O número de declarações de eliminação de índice de coleção recebidas.

* `Mysqlx_stmt_enable_notices`

  O número de declarações de habilitação de avisos recebidas.

* `Mysqlx_stmt_ensure_collection`

  O número de declarações de garantia de coleção recebidas.

* `Mysqlx_stmt_execute_mysqlx`

  O número de mensagens StmtExecute recebidas com o namespace definido como `mysqlx`.

* `Mysqlx_stmt_execute_sql`

  O número de solicitações StmtExecute recebidas para o namespace SQL.

* `Mysqlx_stmt_execute_xplugin`

  Esta variável de status não é mais usada.

* `Mysqlx_stmt_get_collection_options`

  O número de solicitações de obter objeto de coleção recebidas.

* `Mysqlx_stmt_kill_client`

  O número de solicitações de matar cliente recebidas.

* `Mysqlx_stmt_list_clients`

  O número de solicitações de listar clientes recebidas.

* `Mysqlx_stmt_list_notices`

  O número de solicitações de listar avisos recebidas.

* `Mysqlx_stmt_list_objects`

  O número de solicitações de listar objetos recebidas.

* `Mysqlx_stmt_modify_collection_options`

  O número de solicitações de modificar opções de coleção recebidas.

* `Mysqlx_stmt_ping`

  O número de solicitações ping recebidas.

* `Mysqlx_worker_threads`

  O número de threads de trabalho disponíveis.

* `Mysqlx_worker_threads_active`

  O número de threads de trabalho atualmente em uso.