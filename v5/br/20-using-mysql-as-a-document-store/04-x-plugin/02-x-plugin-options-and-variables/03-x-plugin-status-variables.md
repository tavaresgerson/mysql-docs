#### 19.4.2.3 Variáveis de Status do X Plugin

As variáveis de Status do X Plugin têm os seguintes significados.

* `Mysqlx_address`

  O endereço de network ao qual o X Plugin está vinculado. Se a vinculação falhou, ou se a opção `skip_networking` foi utilizada, o valor exibe `UNDEFINED`.

* `Mysqlx_bytes_received`

  O número de bytes recebidos pela network.

* `Mysqlx_bytes_sent`

  O número de bytes enviados pela network.

* `Mysqlx_connection_accept_errors`

  O número de conexões que causaram erros de aceitação (accept errors).

* `Mysqlx_connection_errors`

  O número de conexões que causaram erros.

* `Mysqlx_connections_accepted`

  O número de conexões que foram aceitas.

* `Mysqlx_connections_closed`

  O número de conexões que foram fechadas.

* `Mysqlx_connections_rejected`

  O número de conexões que foram rejeitadas.

* `Mysqlx_crud_create_view`

  O número de requisições de criação de view (create view) recebidas.

* `Mysqlx_crud_delete`

  O número de requisições de delete recebidas.

* `Mysqlx_crud_drop_view`

  O número de requisições de descarte de view (drop view) recebidas.

* `Mysqlx_crud_find`

  O número de requisições de find recebidas.

* `Mysqlx_crud_insert`

  O número de requisições de insert recebidas.

* `Mysqlx_crud_modify_view`

  O número de requisições de modificação de view (modify view) recebidas.

* `Mysqlx_crud_update`

  O número de requisições de update recebidas.

* `Mysqlx_errors_sent`

  O número de erros enviados aos clients.

* `Mysqlx_errors_unknown_message_type`

  O número de tipos de mensagem desconhecidos que foram recebidos.

* `Mysqlx_expect_close`

  O número de blocos de expectativa (expectation blocks) fechados.

* `Mysqlx_expect_open`

  O número de blocos de expectativa (expectation blocks) abertos.

* `Mysqlx_init_error`

  O número de erros durante a inicialização.

* `Mysqlx_notice_other_sent`

  O número de outros tipos de notices enviados de volta aos clients.

* `Mysqlx_notice_warning_sent`

  O número de notices de warning enviados de volta aos clients.

* `Mysqlx_port`

  A porta TCP que o X Plugin está escutando. Se uma vinculação de network falhou, ou se a variável de sistema `skip_networking` estiver habilitada, o valor exibe `UNDEFINED`.

* `Mysqlx_rows_sent`

  O número de rows enviadas de volta aos clients.

* `Mysqlx_sessions`

  O número de sessions que foram abertas.

* `Mysqlx_sessions_accepted`

  O número de tentativas de session que foram aceitas.

* `Mysqlx_sessions_closed`

  O número de sessions que foram fechadas.

* `Mysqlx_sessions_fatal_error`

  O número de sessions que fecharam com um erro fatal.

* `Mysqlx_sessions_killed`

  O número de sessions que foram encerradas (killed).

* `Mysqlx_sessions_rejected`

  O número de tentativas de session que foram rejeitadas.

* `Mysqlx_socket`

  O Unix socket que o X Plugin está escutando.

* `Mysqlx_ssl_accept_renegotiates`

  O número de negociações necessárias para estabelecer a conexão.

* `Mysqlx_ssl_accepts`

  O número de conexões SSL aceitas.

* `Mysqlx_ssl_active`

  Indica se o SSL está ativo.

* `Mysqlx_ssl_cipher`

  O cipher SSL atual (vazio para conexões não-SSL).

* `Mysqlx_ssl_cipher_list`

  Uma lista de ciphers SSL possíveis (vazio para conexões não-SSL).

* `Mysqlx_ssl_ctx_verify_depth`

  O limite de profundidade de verificação do certificado (certificate verification depth limit) atualmente definido no ctx.

* `Mysqlx_ssl_ctx_verify_mode`

  O modo de verificação do certificado (certificate verification mode) atualmente definido no ctx.

* `Mysqlx_ssl_finished_accepts`

  O número de conexões SSL bem-sucedidas ao server.

* `Mysqlx_ssl_server_not_after`

  A última data para a qual o certificado SSL é válido.

* `Mysqlx_ssl_server_not_before`

  A primeira data para a qual o certificado SSL é válido.

* `Mysqlx_ssl_verify_depth`

  A profundidade de verificação do certificado (certificate verification depth) para conexões SSL.

* `Mysqlx_ssl_verify_mode`

  O modo de verificação do certificado (certificate verification mode) para conexões SSL.

* `Mysqlx_ssl_version`

  O nome do protocolo usado para conexões SSL.

* `Mysqlx_stmt_create_collection`

  O número de statements de criação de collection (create collection) recebidas.

* `Mysqlx_stmt_create_collection_index`

  O número de statements de criação de Index de collection (create collection index) recebidas.

* `Mysqlx_stmt_disable_notices`

  O número de statements de desabilitação de notice (disable notice) recebidas.

* `Mysqlx_stmt_drop_collection`

  O número de statements de descarte de collection (drop collection) recebidas.

* `Mysqlx_stmt_drop_collection_index`

  O número de statements de descarte de Index de collection (drop collection index) recebidas.

* `Mysqlx_stmt_enable_notices`

  O número de statements de habilitação de notice (enable notice) recebidas.

* `Mysqlx_stmt_ensure_collection`

  O número de statements de garantia de collection (ensure collection) recebidas.

* `Mysqlx_stmt_execute_mysqlx`

  O número de mensagens StmtExecute recebidas com o namespace definido como `mysqlx`.

* `Mysqlx_stmt_execute_sql`

  O número de requisições StmtExecute recebidas para o namespace SQL.

* `Mysqlx_stmt_execute_xplugin`

  O número de requisições StmtExecute recebidas para o namespace do X Plugin.

* `Mysqlx_stmt_kill_client`

  O número de statements de encerramento de client (kill client) recebidas.

* `Mysqlx_stmt_list_clients`

  O número de statements de listagem de client (list client) recebidas.

* `Mysqlx_stmt_list_notices`

  O número de statements de listagem de notice (list notice) recebidas.

* `Mysqlx_stmt_list_objects`

  O número de statements de listagem de object (list object) recebidas.

* `Mysqlx_stmt_ping`

  O número de statements de ping recebidas.

* `Mysqlx_worker_threads`

  O número de worker threads disponíveis.

* `Mysqlx_worker_threads_active`

  O número de worker threads atualmente em uso.