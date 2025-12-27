#### 22.5.6.3 X Plugin Status Variables

The X Plugin status variables have the following meanings.

* `Mysqlx_aborted_clients`

  The number of clients that were disconnected because of an input or output error.

* `Mysqlx_address`

  The network address or addresses for which X Plugin accepts TCP/IP connections. If multiple addresses were specified using the `mysqlx_bind_address` system variable, `Mysqlx_address` displays only those addresses for which the bind succeeded. If the bind has failed for every network address specified by `mysqlx_bind_address`, or if the `skip_networking` option has been used, the value of `Mysqlx_address` is `UNDEFINED`. If X Plugin startup is not yet complete, the value of `Mysqlx_address` is empty.

* `Mysqlx_bytes_received`

  The total number of bytes received through the network. If compression is used for the connection, this figure comprises compressed message payloads measured before decompression (`Mysqlx_bytes_received_compressed_payload`), any items in compressed messages that were not compressed such as X Protocol headers, and any uncompressed messages.

* `Mysqlx_bytes_received_compressed_payload`

  The number of bytes received as compressed message payloads, measured before decompression.

* `Mysqlx_bytes_received_uncompressed_frame`

  The number of bytes received as compressed message payloads, measured after decompression.

* `Mysqlx_bytes_sent`

  The total number of bytes sent through the network. If compression is used for the connection, this figure comprises compressed message payloads measured after compression (`Mysqlx_bytes_sent_compressed_payload`), any items in compressed messages that were not compressed such as X Protocol headers, and any uncompressed messages.

* `Mysqlx_bytes_sent_compressed_payload`

  The number of bytes sent as compressed message payloads, measured after compression.

* `Mysqlx_bytes_sent_uncompressed_frame`

  The number of bytes sent as compressed message payloads, measured before compression.

* `Mysqlx_compression_algorithm`

  (Session scope) The compression algorithm in use for the X Protocol connection for this session. The permitted compression algorithms are listed by the `mysqlx_compression_algorithms` system variable.

* `Mysqlx_compression_level`

  (Session scope) The compression level in use for the X Protocol connection for this session.

* `Mysqlx_connection_accept_errors`

  The number of connections which have caused accept errors.

* `Mysqlx_connection_errors`

  The number of connections which have caused errors.

* `Mysqlx_connections_accepted`

  The number of connections which have been accepted.

* `Mysqlx_connections_closed`

  The number of connections which have been closed.

* `Mysqlx_connections_rejected`

  The number of connections which have been rejected.

* `Mysqlx_crud_create_view`

  The number of create view requests received.

* `Mysqlx_crud_delete`

  The number of delete requests received.

* `Mysqlx_crud_drop_view`

  The number of drop view requests received.

* `Mysqlx_crud_find`

  The number of find requests received.

* `Mysqlx_crud_insert`

  The number of insert requests received.

* `Mysqlx_crud_modify_view`

  The number of modify view requests received.

* `Mysqlx_crud_update`

  The number of update requests received.

* `Mysqlx_cursor_close`

  The number of cursor-close messages received

* `Mysqlx_cursor_fetch`

  The number of cursor-fetch messages received

* `Mysqlx_cursor_open`

  The number of cursor-open messages received

* `Mysqlx_errors_sent`

  The number of errors sent to clients.

* `Mysqlx_errors_unknown_message_type`

  The number of unknown message types that have been received.

* `Mysqlx_expect_close`

  The number of expectation blocks closed.

* `Mysqlx_expect_open`

  The number of expectation blocks opened.

* `Mysqlx_init_error`

  The number of errors during initialisation.

* `Mysqlx_messages_sent`

  The total number of messages of all types sent to clients.

* `Mysqlx_notice_global_sent`

  The number of global notifications sent to clients.

* `Mysqlx_notice_other_sent`

  The number of other types of notices sent back to clients.

* `Mysqlx_notice_warning_sent`

  The number of warning notices sent back to clients.

* `Mysqlx_notified_by_group_replication`

  Number of Group Replication notifications sent to clients.

* `Mysqlx_port`

  The TCP port which X Plugin is listening to. If a network bind has failed, or if the `skip_networking` system variable is enabled, the value shows `UNDEFINED`.

* `Mysqlx_prep_deallocate`

  The number of prepared-statement-deallocate messages received

* `Mysqlx_prep_execute`

  The number of prepared-statement-execute messages received

* `Mysqlx_prep_prepare`

  The number of prepared-statement messages received

* `Mysqlx_rows_sent`

  The number of rows sent back to clients.

* `Mysqlx_sessions`

  The number of sessions that have been opened.

* `Mysqlx_sessions_accepted`

  The number of session attempts which have been accepted.

* `Mysqlx_sessions_closed`

  The number of sessions that have been closed.

* `Mysqlx_sessions_fatal_error`

  The number of sessions that have closed with a fatal error.

* `Mysqlx_sessions_killed`

  The number of sessions which have been killed.

* `Mysqlx_sessions_rejected`

  The number of session attempts which have been rejected.

* `Mysqlx_socket`

  The Unix socket which X Plugin is listening to.

* `Mysqlx_ssl_accept_renegotiates`

  The number of negotiations needed to establish the connection.

* `Mysqlx_ssl_accepts`

  The number of accepted SSL connections.

* `Mysqlx_ssl_active`

  If SSL is active.

* `Mysqlx_ssl_cipher`

  The current SSL cipher (empty for non-SSL connections).

* `Mysqlx_ssl_cipher_list`

  A list of possible SSL ciphers (empty for non-SSL connections).

* `Mysqlx_ssl_ctx_verify_depth`

  The certificate verification depth limit currently set in ctx.

* `Mysqlx_ssl_ctx_verify_mode`

  The certificate verification mode currently set in ctx.

* `Mysqlx_ssl_finished_accepts`

  The number of successful SSL connections to the server.

* `Mysqlx_ssl_server_not_after`

  The last date for which the SSL certificate is valid.

* `Mysqlx_ssl_server_not_before`

  The first date for which the SSL certificate is valid.

* `Mysqlx_ssl_verify_depth`

  The certificate verification depth for SSL connections.

* `Mysqlx_ssl_verify_mode`

  The certificate verification mode for SSL connections.

* `Mysqlx_ssl_version`

  The name of the protocol used for SSL connections.

* `Mysqlx_stmt_create_collection`

  The number of create collection statements received.

* `Mysqlx_stmt_create_collection_index`

  The number of create collection index statements received.

* `Mysqlx_stmt_disable_notices`

  The number of disable notice statements received.

* `Mysqlx_stmt_drop_collection`

  The number of drop collection statements received.

* `Mysqlx_stmt_drop_collection_index`

  The number of drop collection index statements received.

* `Mysqlx_stmt_enable_notices`

  The number of enable notice statements received.

* `Mysqlx_stmt_ensure_collection`

  The number of ensure collection statements received.

* `Mysqlx_stmt_execute_mysqlx`

  The number of StmtExecute messages received with namespace set to `mysqlx`.

* `Mysqlx_stmt_execute_sql`

  The number of StmtExecute requests received for the SQL namespace.

* `Mysqlx_stmt_execute_xplugin`

  This status variable is no longer used.

* `Mysqlx_stmt_get_collection_options`

  The number of get collection object statements received.

* `Mysqlx_stmt_kill_client`

  The number of kill client statements received.

* `Mysqlx_stmt_list_clients`

  The number of list client statements received.

* `Mysqlx_stmt_list_notices`

  The number of list notice statements received.

* `Mysqlx_stmt_list_objects`

  The number of list object statements received.

* `Mysqlx_stmt_modify_collection_options`

  The number of modify collection options statements received.

* `Mysqlx_stmt_ping`

  The number of ping statements received.

* `Mysqlx_worker_threads`

  The number of worker threads available.

* `Mysqlx_worker_threads_active`

  The number of worker threads currently used.
