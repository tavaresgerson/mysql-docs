#### 19.4.2.3 Variáveis de Status do Plugin X

As variáveis de status do X Plugin têm os seguintes significados.

- `Mysqlx_address`

  O endereço de rede ao qual o X Plugin está vinculado. Se a vinculação falhou ou se a opção `skip_networking` foi usada, o valor mostra `UNDEFINED`.

- `Mysqlx_bytes_received`

  O número de bytes recebidos através da rede.

- `Mysqlx_bytes_sent`

  O número de bytes enviados pela rede.

- `Mysqlx_connection_accept_errors`

  O número de conexões que causaram erros de aceitação.

- `Mysqlx_connection_errors`

  O número de conexões que causaram erros.

- `Mysqlx_connections_accepted`

  O número de conexões que foram aceitas.

- `Mysqlx_connections_closed`

  O número de conexões que foram fechadas.

- `Mysqlx_connections_rejected`

  O número de conexões que foram rejeitadas.

- `Mysqlx_crud_create_view`

  Número de solicitações de criação de visualizações recebidas.

- `Mysqlx_crud_delete`

  O número de solicitações de exclusão recebidas.

- `Mysqlx_crud_drop_view`

  O número de solicitações de visualização em queda recebidas.

- `Mysqlx_crud_find`

  O número de solicitações de pesquisa recebidas.

- `Mysqlx_crud_insert`

  O número de pedidos de inserção recebidos.

- `Mysqlx_crud_modify_view`

  Número de solicitações de modificação de visualização recebidas.

- `Mysqlx_crud_update`

  O número de solicitações de atualização recebidas.

- `Mysqlx_errors_sent`

  O número de erros enviados aos clientes.

- `Mysqlx_errors_unknown_message_type`

  O número de tipos de mensagens desconhecidas que foram recebidas.

- `Mysqlx_expect_close`

  O número de blocos de expectativa fechados.

- `Mysqlx_expect_open`

  Número de blocos de expectativa abertos.

- `Mysqlx_init_error`

  Número de erros durante a inicialização.

- `Mysqlx_notice_other_sent`

  O número de outros tipos de avisos enviados de volta aos clientes.

- `Mysqlx_notice_warning_sent`

  O número de avisos enviados de volta aos clientes.

- `Mysqlx_port`

  A porta TCP para a qual o X Plugin está ouvindo. Se uma vinculação de rede falhou ou se a variável de sistema `skip_networking` estiver habilitada, o valor será `UNDEFINED`.

- `Mysqlx_rows_sent`

  O número de linhas enviadas de volta aos clientes.

- `Mysqlx_sessions`

  O número de sessões que foram abertas.

- `Mysqlx_sessions_accepted`

  O número de tentativas de sessão que foram aceitas.

- `Mysqlx_sessions_closed`

  O número de sessões que foram fechadas.

- `Mysqlx_sessions_fatal_error`

  O número de sessões que foram encerradas com um erro fatal.

- `Mysqlx_sessions_killed`

  O número de sessões que foram eliminadas.

- `Mysqlx_sessions_rejected`

  Número de tentativas de sessão que foram rejeitadas.

- `Mysqlx_socket`

  O socket Unix ao qual o X Plugin está ouvindo.

- `Mysqlx_ssl_accept_renegotiates`

  O número de negociações necessárias para estabelecer a conexão.

- `Mysqlx_ssl_accepts`

  O número de conexões SSL aceitas.

- `Mysqlx_ssl_active`

  Se o SSL estiver ativo.

- `Mysqlx_ssl_cipher`

  O cifrador SSL atual (vazio para conexões não SSL).

- `Mysqlx_ssl_cipher_list`

  Uma lista de possíveis cifra SSL (vazia para conexões não SSL).

- `Mysqlx_ssl_ctx_verify_depth`

  O limite de profundidade de verificação de certificado atualmente definido em ctx.

- `Mysqlx_ssl_ctx_verify_mode`

  O modo de verificação de certificado atualmente configurado em ctx.

- `Mysqlx_ssl_finished_accepts`

  O número de conexões SSL bem-sucedidas com o servidor.

- `Mysqlx_ssl_server_not_after`

  A última data em que o certificado SSL é válido.

- `Mysqlx_ssl_server_not_before`

  A primeira data em que o certificado SSL é válido.

- `Mysqlx_ssl_verify_depth`

  A profundidade de verificação de certificado para conexões SSL.

- `Mysqlx_ssl_verify_mode`

  O modo de verificação de certificado para conexões SSL.

- `Mysqlx_ssl_version`

  O nome do protocolo usado para conexões SSL.

- `Mysqlx_stmt_create_collection`

  Número de declarações de criação de coleção recebidas.

- `Mysqlx_stmt_create_collection_index`

  Número de declarações de criação de índice de coleção recebidas.

- `Mysqlx_stmt_disable_notices`

  Número de declarações de aviso de incapacidade recebidas.

- `Mysqlx_stmt_drop_collection`

  O número de declarações de coleta de resíduos recebidas.

- `Mysqlx_stmt_drop_collection_index`

  Número de declarações de índice de coleta de resíduos recebidas.

- `Mysqlx_stmt_enable_notices`

  Número de declarações de notificação de ativação recebidas.

- `Mysqlx_stmt_ensure_collection`

  Número de declarações de cobrança recebidas.

- `Mysqlx_stmt_execute_mysqlx`

  O número de mensagens StmtExecute recebidas com o namespace definido como `mysqlx`.

- `Mysqlx_stmt_execute_sql`

  O número de solicitações StmtExecute recebidas para o namespace SQL.

- `Mysqlx_stmt_execute_xplugin`

  O número de solicitações StmtExecute recebidas para o namespace do Plugin X.

- `Mysqlx_stmt_kill_client`

  Número de declarações de clientes mortos recebidas.

- `Mysqlx_stmt_list_clients`

  Número de declarações de clientes da lista recebidas.

- `Mysqlx_stmt_list_notices`

  Número de declarações de notificação de lista recebidas.

- `Mysqlx_stmt_list_objects`

  Número de declarações de objetos de lista recebidas.

- `Mysqlx_stmt_ping`

  O número de declarações de ping recebidas.

- `Mysqlx_worker_threads`

  O número de threads de trabalho disponíveis.

- `Mysqlx_worker_threads_active`

  O número de threads de trabalhador atualmente utilizadas.
