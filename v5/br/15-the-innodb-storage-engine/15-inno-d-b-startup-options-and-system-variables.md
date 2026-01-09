## 14.15 Opções de inicialização do InnoDB e variáveis do sistema

- As variáveis do sistema que são verdadeiras ou falsas podem ser habilitadas na inicialização do servidor ao nomeá-las ou desabilitadas usando o prefixo `--skip-`. Por exemplo, para habilitar ou desabilitar o índice de hash adaptativo do `InnoDB`, você pode usar `--innodb-adaptive-hash-index` ou `--skip-innodb-adaptive-hash-index` na linha de comando ou `innodb_adaptive_hash_index` ou `skip_innodb_adaptive_hash_index` em um arquivo de opção.

- As variáveis do sistema que aceitam um valor numérico podem ser especificadas como `--var_name=value` na linha de comando ou como `var_name=value` em arquivos de opções.

- Muitas variáveis do sistema podem ser alteradas em tempo de execução (consulte a Seção 5.1.8.2, “Variáveis de sistema dinâmicas”).

- Para obter informações sobre os modificadores de escopo das variáveis `GLOBAL` e `SESSION`, consulte a documentação da instrução `SET`.

- Algumas opções controlam os locais e o layout dos arquivos de dados do `InnoDB`. A Seção 14.8.1, “Configuração de Inicialização do InnoDB”, explica como usar essas opções.

- Algumas opções, que você pode não usar inicialmente, ajudam a ajustar as características de desempenho do `InnoDB` com base na capacidade da máquina e na carga de trabalho do banco de dados.

- Para obter mais informações sobre a especificação de opções e variáveis do sistema, consulte a Seção 4.2.2, “Especificação de Opções do Programa”.

**Tabela 14.18: Referência de Opções e Variáveis do InnoDB**

<table frame="box" rules="all" summary="Referência para as opções de linha de comando do InnoDB e variáveis do sistema."><col style="width: 20%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><thead><tr><th>Nome</th> <th>Linha de comando</th> <th>Arquivo de Opções</th> <th>Sistema Var</th> <th>Status Var</th> <th>Var Scope</th> <th>Dinâmico</th> </tr></thead><tbody><tr><th>daemon_memcached_enable_binlog</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>daemon_memcached_engine_lib_name</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>daemon_memcached_engine_lib_path</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>daemon_memcached_option</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>daemon_memcached_r_batch_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>daemon_memcached_w_batch_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>checks_de_chave_estrangeira</th> <td></td> <td></td> <td>Sim</td> <td></td> <td>Ambos</td> <td>Sim</td> </tr><tr><th>ignorar_builtin_innodb</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb</th> <td>Sim</td> <td>Sim</td> <td></td> <td></td> <td></td> <td></td> </tr><tr><th>innodb_adaptive_flushing</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_adaptive_flushing_lwm</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_adaptive_hash_index</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_adaptive_hash_index_parts</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_adaptive_max_sleep_delay</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_api_bk_commit_interval</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_api_disable_rowlock</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_api_enable_binlog</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_api_enable_mdl</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_api_trx_level</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_autoextend_increment</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_autoinc_lock_mode</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_available_undo_logs</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_background_drop_list_empty</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_buffer_pool_bytes_data</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_buffer_pool_bytes_dirty</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_buffer_pool_chunk_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_buffer_pool_dump_at_shutdown</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_buffer_pool_dump_now</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_buffer_pool_dump_pct</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>Innodb_buffer_pool_dump_status</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_buffer_pool_filename</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_buffer_pool_instances</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_buffer_pool_load_abort</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_buffer_pool_load_at_startup</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_buffer_pool_load_now</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>Innodb_buffer_pool_load_status</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_buffer_pool_pages_data</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_buffer_pool_pages_dirty</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_buffer_pool_pages_flushed</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_buffer_pool_pages_free</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_buffer_pool_pages_latched</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_buffer_pool_pages_misc</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_buffer_pool_pages_total</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_buffer_pool_read_ahead</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_buffer_pool_read_ahead_evicted</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_buffer_pool_read_ahead_rnd</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_buffer_pool_read_requests</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_buffer_pool_reads</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_buffer_pool_resize_status</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_buffer_pool_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Varia</td> </tr><tr><th>Innodb_buffer_pool_wait_free</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_buffer_pool_write_requests</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_change_buffer_max_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_change_buffering</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_change_buffering_debug</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_checksum_algorithm</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_checksums</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_cmp_per_index_enabled</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_commit_concurrency</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_compress_debug</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_compression_failure_threshold_pct</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_compression_level</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_compression_pad_pct_max</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_concurrency_tickets</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_data_file_path</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_data_fsyncs</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_data_home_dir</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_data_pending_fsyncs</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_data_pending_reads</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_data_pending_writes</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_data_read</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_data_reads</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_data_writes</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_data_written</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_dblwr_pages_written</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_dblwr_writes</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_deadlock_detect</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_default_row_format</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_disable_resize_buffer_pool_debug</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_disable_sort_file_cache</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_doublewrite</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_fast_shutdown</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_fil_make_page_dirty_debug</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_file_format</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_file_format_check</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_file_format_max</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_file_per_table</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_fill_factor</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_flush_log_at_timeout</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_flush_log_at_trx_commit</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_flush_method</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_flush_neighbors</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_flush_sync</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_flushing_avg_loops</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_force_load_corrupted</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_force_recovery</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_ft_aux_table</th> <td></td> <td></td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_ft_cache_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_ft_enable_diag_print</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_ft_enable_stopword</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Ambos</td> <td>Sim</td> </tr><tr><th>innodb_ft_max_token_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_ft_min_token_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_ft_num_word_optimize</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_ft_result_cache_limit</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_ft_server_stopword_table</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_ft_sort_pll_degree</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_ft_total_cache_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_ft_user_stopword_table</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Ambos</td> <td>Sim</td> </tr><tr><th>Innodb_have_atomic_builtins</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_io_capacity</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_io_capacity_max</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_large_prefix</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_limit_optimistic_insert_debug</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_lock_wait_timeout</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Ambos</td> <td>Sim</td> </tr><tr><th>innodb_locks_unsafe_for_binlog</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_log_buffer_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_log_checkpoint_now</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_log_checksums</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_log_compressed_pages</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_log_file_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_log_files_in_group</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_log_group_home_dir</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_log_waits</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_log_write_ahead_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>Innodb_log_write_requests</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_log_writes</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_lru_scan_depth</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_max_dirty_pages_pct</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_max_dirty_pages_pct_lwm</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_max_purge_lag</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_max_purge_lag_delay</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_max_undo_log_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_merge_threshold_set_all_debug</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_monitor_disable</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_monitor_enable</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_monitor_reset</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_monitor_reset_all</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>Innodb_num_open_files</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_numa_interleave</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_old_blocks_pct</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_old_blocks_time</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_online_alter_log_max_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_open_files</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_optimize_fulltext_only</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>Innodb_os_log_fsyncs</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_os_log_pending_fsyncs</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_os_log_pending_writes</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_os_log_written</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_page_cleaners</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_page_size</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_page_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_pages_created</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_pages_read</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_pages_written</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_print_all_deadlocks</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_purge_batch_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_purge_rseg_truncate_frequency</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_purge_threads</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_random_read_ahead</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_read_ahead_threshold</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_read_io_threads</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_read_only</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_replication_delay</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_rollback_on_timeout</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_rollback_segments</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>Innodb_row_lock_current_waits</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_row_lock_time</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_row_lock_time_avg</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_row_lock_time_max</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_row_lock_waits</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_rows_deleted</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_rows_inserted</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_rows_read</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_rows_updated</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_saved_page_number_debug</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_sort_buffer_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_spin_wait_delay</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_stats_auto_recalc</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_stats_include_delete_marked</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_stats_method</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_stats_on_metadata</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_stats_persistent</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_stats_persistent_sample_pages</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_stats_sample_pages</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_stats_transient_sample_pages</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb-status-file</th> <td>Sim</td> <td>Sim</td> <td></td> <td></td> <td></td> <td></td> </tr><tr><th>innodb_status_output</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_status_output_locks</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_strict_mode</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Ambos</td> <td>Sim</td> </tr><tr><th>innodb_support_xa</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Ambos</td> <td>Sim</td> </tr><tr><th>innodb_sync_array_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_sync_debug</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_sync_spin_loops</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_table_locks</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Ambos</td> <td>Sim</td> </tr><tr><th>innodb_temp_data_file_path</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_thread_concurrency</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_thread_sleep_delay</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_tmpdir</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Ambos</td> <td>Sim</td> </tr><tr><th>Innodb_truncated_status_writes</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_trx_purge_view_update_only_debug</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_trx_rseg_n_slots_debug</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_undo_directory</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_undo_log_truncate</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_undo_logs</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_undo_tablespaces</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_use_native_aio</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_version</th> <td></td> <td></td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_write_io_threads</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>checks únicos</th> <td></td> <td></td> <td>Sim</td> <td></td> <td>Ambos</td> <td>Sim</td> </tr></tbody></table>

### Opções de comando do InnoDB

- `--innodb[=valor]`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Controla o carregamento do mecanismo de armazenamento `InnoDB`, se o servidor foi compilado com suporte ao `InnoDB`. Esta opção tem um formato triestado, com valores possíveis de `OFF`, `ON` ou `FORCE`. Consulte a Seção 5.5.1, “Instalando e Desinstalando Plugins”.

  Para desabilitar o `InnoDB`, use `--innodb=OFF` ou `--skip-innodb`. Nesse caso, como o motor de armazenamento padrão é o `InnoDB`, o servidor não será iniciado a menos que você também use `--default-storage-engine` e `--default-tmp-storage-engine` para definir o padrão para algum outro motor tanto para tabelas permanentes quanto `TEMPORARY`.

  O mecanismo de armazenamento `InnoDB` não pode mais ser desativado, e as opções `--innodb=OFF` e `--skip-innodb` estão desatualizadas e não têm efeito. Seu uso resulta em um aviso. Você deve esperar que essas opções sejam removidas em uma futura versão do MySQL.

- `--innodb-status-file`

  <table frame="box" rules="all" summary="Propriedades para o arquivo de status innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb-status-file[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

  A opção de inicialização `--innodb-status-file` controla se o `InnoDB` cria um arquivo chamado `innodb_status.pid` no diretório de dados e escreve a saída `SHOW ENGINE INNODB STATUS` nele a cada 15 segundos, aproximadamente.

  O arquivo `innodb_status.pid` não é criado por padrão. Para criá-lo, inicie o **mysqld** com a opção `--innodb-status-file`. O `InnoDB` remove o arquivo quando o servidor é desligado normalmente. Se ocorrer um desligamento anormal, o arquivo de status pode precisar ser removido manualmente.

  A opção `--innodb-status-file` é destinada ao uso temporário, pois a geração de saída do `SHOW ENGINE INNODB STATUS` pode afetar o desempenho, e o arquivo `innodb_status.pid` pode se tornar bastante grande com o tempo.

  Para obter informações relacionadas, consulte a Seção 14.18.2, “Habilitar monitores InnoDB”.

- `--skip-innodb`

  Desative o mecanismo de armazenamento `InnoDB`. Veja a descrição de `--innodb`.

### Variáveis de sistema do InnoDB

- `daemon_memcached_enable_binlog`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_enable_binlog"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-enable-binlog[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_enable_binlog</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

  Ative essa opção no servidor de origem para usar o plugin `InnoDB **memcached` (`daemon_memcached`) com o log binário do MySQL. Essa opção só pode ser definida durante o início do servidor. Você também deve habilitar o log binário do MySQL no servidor de origem usando a opção `--log-bin`.

  Para obter mais informações, consulte a Seção 14.21.6, “O Plugin e a Replicação do InnoDB memcached”.

- `daemon_memcached_engine_lib_name`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_engine_lib_name"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-engine-lib-name=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_engine_lib_name</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>innodb_engine.so</code>]]</td> </tr></tbody></table>

  Especifica a biblioteca compartilhada que implementa o plugin **memcached** do InnoDB.

  Para obter mais informações, consulte a Seção 14.21.3, “Configurando o Plugin InnoDB memcached”.

- `daemon_memcached_engine_lib_path`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_engine_lib_path"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-engine-lib-path=dir_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_engine_lib_path</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>

  O caminho do diretório que contém a biblioteca compartilhada que implementa o plugin `memcached` do `InnoDB`. O valor padrão é NULL, representando o diretório do plugin MySQL. Você não deve precisar modificar este parâmetro, a menos que especifique um plugin `memcached` para um motor de armazenamento diferente que esteja localizado fora do diretório do plugin MySQL.

  Para obter mais informações, consulte a Seção 14.21.3, “Configurando o Plugin InnoDB memcached”.

- `daemon_memcached_option`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_option"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-option=options</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_option</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>

  Usado para passar opções separadas por espaços ao daemon de cache de memória subjacente **memcached** durante o início. Por exemplo, você pode alterar a porta em que o **memcached** escuta, reduzir o número máximo de conexões simultâneas, alterar o tamanho máximo de memória para um par chave-valor ou habilitar mensagens de depuração para o log de erros.

  Consulte a Seção 14.21.3, “Configurando o Plugin InnoDB memcached”, para obter detalhes de uso. Para informações sobre as opções do **memcached**, consulte a página do manual do **memcached**.

- `daemon_memcached_r_batch_size`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_r_batch_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-r-batch-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_r_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1073741824</code>]]</td> </tr></tbody></table>

  Especifica quantos **memcached** operações de leitura (`get` operações) devem ser realizadas antes de realizar um `COMMIT` para iniciar uma nova transação. É o equivalente a `daemon_memcached_w_batch_size`.

  Este valor é definido como 1 por padrão, para que quaisquer alterações feitas na tabela por meio de instruções SQL sejam imediatamente visíveis às operações do **memcached**. Você pode aumentá-lo para reduzir o overhead de comitês frequentes em um sistema onde a tabela subjacente está sendo acessada apenas por meio da interface do **memcached**. Se você definir o valor muito grande, a quantidade de dados de desfazer ou refazer pode impor algum overhead de armazenamento, como em qualquer transação de longa duração.

  Para obter mais informações, consulte a Seção 14.21.3, “Configurando o Plugin InnoDB memcached”.

- `daemon_memcached_w_batch_size`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_w_batch_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-w-batch-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_w_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>

  Especifica quantos **memcached** operações de escrita, como `add`, `set` e `incr`, devem ser realizadas antes de realizar um `COMMIT` para iniciar uma nova transação. É o equivalente a `daemon_memcached_r_batch_size`.

  Este valor é definido como 1 por padrão, assumindo que os dados armazenados são importantes para serem preservados em caso de uma interrupção e devem ser imediatamente comprometidos. Ao armazenar dados não críticos, você pode aumentar esse valor para reduzir o overhead das operações de escrita não comprometidas frequentes; mas, então, as últimas operações de escrita não comprometidas *`N`*-1 podem ser perdidas se ocorrer uma saída inesperada.

  Para obter mais informações, consulte a Seção 14.21.3, “Configurando o Plugin InnoDB memcached”.

- `ignore_builtin_innodb`

  <table frame="box" rules="all" summary="Propriedades para ignore_builtin_innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ignore-builtin-innodb[={OFF|ON}]</code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ignore_builtin_innodb</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr></tbody></table>

  Em versões anteriores do MySQL, a ativação dessa variável fazia com que o servidor se comportasse como se o `InnoDB` embutido não estivesse presente, o que permitia que o `Plugin InnoDB` fosse usado. No MySQL 5.7, o `InnoDB` é o mecanismo de armazenamento padrão e o `Plugin InnoDB` não é usado, então essa variável é ignorada.

- `innodb_adaptive_flushing`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Especifica se a taxa de limpeza de páginas sujas no pool de buffers do `InnoDB` deve ser ajustada dinamicamente com base na carga de trabalho. Ajuste dinâmico da taxa de limpeza visa evitar picos de atividade de E/S. Esta configuração está habilitada por padrão. Consulte a Seção 14.8.3.5, “Configurando a Limpeza do Pool de Buffers”, para obter mais informações. Para obter conselhos gerais sobre o ajuste de E/S, consulte a Seção 8.5.8, “Otimizando o E/S de Disco do InnoDB”.

- `innodb_adaptive_flushing_lwm`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Define a marca de água baixa que representa a porcentagem da capacidade do log de refazer para a qual o esvaziamento adaptativo é habilitado. Para mais informações, consulte a Seção 14.8.3.5, “Configurando o esvaziamento do Pool de Buffer”.

- `innodb_adaptive_hash_index`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Se o índice de hash adaptável do InnoDB está habilitado ou desabilitado. Pode ser desejável, dependendo da sua carga de trabalho, habilitar ou desabilitar dinamicamente o índice de hash adaptável para melhorar o desempenho das consultas. Como o índice de hash adaptável pode não ser útil para todas as cargas de trabalho, realize benchmarks com ele habilitado e desabilitado, usando cargas de trabalho realistas. Consulte a Seção 14.5.3, “Índice de Hash Adaptável”, para obter detalhes.

  Esta variável está habilitada por padrão. Você pode modificar este parâmetro usando a instrução `SET GLOBAL`, sem precisar reiniciar o servidor. Para alterar o ajuste em tempo de execução, são necessários privilégios suficientes para definir variáveis de sistema globais. Consulte a Seção 5.1.8.1, “Privilégios de Variáveis de Sistema”. Você também pode usar `--skip-innodb-adaptive-hash-index` no início do servidor para desabilitá-la.

  Desativar o índice de hash adaptativo esvazia a tabela de hash imediatamente. As operações normais podem continuar enquanto a tabela de hash estiver vazia, e as consultas que estavam usando o acesso à tabela de hash acessam o índice B-trees diretamente. Quando o índice de hash adaptativo é reativado, a tabela de hash é preenchida novamente durante a operação normal.

- `innodb_adaptive_hash_index_parts`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Divide o sistema de busca de índice de hash adaptativo. Cada índice está vinculado a uma partição específica, com cada partição protegida por um gatilho separado.

  Em versões anteriores, o sistema de busca por índice de hash adaptativo era protegido por um único bloqueio (`btr_search_latch`), o que poderia se tornar um ponto de conflito. Com a introdução da opção `innodb_adaptive_hash_index_parts`, o sistema de busca é dividido em 8 partes por padrão. O valor máximo é de 512.

  Para informações relacionadas, consulte a Seção 14.5.3, “Índice Hash Adaptativo”.

- `innodb_adaptive_max_sleep_delay`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Permite que o `InnoDB` ajuste automaticamente o valor de `innodb_thread_sleep_delay` para cima ou para baixo de acordo com a carga de trabalho atual. Qualquer valor diferente de zero habilita o ajuste dinâmico e automático do valor de `innodb_thread_sleep_delay`, até o valor máximo especificado na opção `innodb_adaptive_max_sleep_delay`. O valor representa o número de microsegundos. Esta opção pode ser útil em sistemas ocupados, com mais de 16 threads `InnoDB`. (Na prática, é mais valiosa para sistemas MySQL com centenas ou milhares de conexões simultâneas.)

  Para obter mais informações, consulte a Seção 14.8.5, “Configurando Concorrência de Fila para InnoDB”.

- `innodb_api_bk_commit_interval`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Com que frequência você deseja comprometer automaticamente as conexões ociosas que utilizam a interface \`InnoDB **memcached**, em segundos. Para obter mais informações, consulte a Seção 14.21.5.4, “Controlar o comportamento transacional do plugin InnoDB memcached”.

- `innodb_api_disable_rowlock`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Use esta opção para desabilitar bloqueios de linha quando o **memcached** do **InnoDB** executa operações DML. Por padrão, o **innodb_api_disable_rowlock** está desativado, o que significa que o **memcached** solicita bloqueios de linha para operações `get` e `set`. Quando o **innodb_api_disable_rowlock** está ativado, o **memcached** solicita um bloqueio de tabela em vez de bloqueios de linha.

  `innodb_api_disable_rowlock` não é dinâmico. Ele deve ser especificado na linha de comando do **mysqld** ou inserido no arquivo de configuração do MySQL. A configuração entra em vigor quando o plugin é instalado, o que ocorre quando o servidor MySQL é iniciado.

  Para obter mais informações, consulte a Seção 14.21.5.4, “Controlar o comportamento transacional do plugin InnoDB memcached”.

- `innodb_api_enable_binlog`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Permite que você use o plugin `InnoDB **memcached**` com o log binário do MySQL. Para obter mais informações, consulte Habilitar o log binário do InnoDB memcached.

- `innodb_api_enable_mdl`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Bloqueia a tabela usada pelo plugin **memcached** do **InnoDB**, para que não possa ser excluída ou alterada por DDL através da interface SQL. Para mais informações, consulte a Seção 14.21.5.4, “Controlar o comportamento transacional do plugin memcached do InnoDB”.

- `innodb_api_trx_level`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Controla o nível de isolamento de transação em consultas processadas pela interface **memcached**. As constantes correspondentes aos nomes familiares são:

  - 0 = `LEIA NÃO COMPROMETIDA`
  - 1 = `LEIA COM PROMESSA`
  - 2 = `REPEATABLE READ`
  - 3 = `SERIALIZÁVEL`

  Para obter mais informações, consulte a Seção 14.21.5.4, “Controlar o comportamento transacional do plugin InnoDB memcached”.

- `innodb_autoextend_increment`

  <table frame="box" rules="all" summary="Propriedades para o arquivo de status innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb-status-file[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

  O tamanho do incremento (em megabytes) para ampliar o tamanho de um arquivo de espaço de tabela do sistema `InnoDB` que se autoexpande quando ele fica cheio. O valor padrão é 64. Para informações relacionadas, consulte Configuração do arquivo de dados do espaço de tabela do sistema e Redimensionamento do espaço de tabela do sistema.

  A configuração `innodb_autoextend_increment` não afeta os arquivos do espaço de tabela por arquivo ou os arquivos do espaço de tabela em geral. Esses arquivos são auto-extendidos independentemente da configuração `innodb_autoextend_increment`. As extensões iniciais são em pequenas quantidades, após as quais as extensões ocorrem em incrementos de 4 MB.

- `innodb_autoinc_lock_mode`

  <table frame="box" rules="all" summary="Propriedades para o arquivo de status innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb-status-file[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

  O modo de bloqueio a ser usado para gerar valores de autoincremento. Os valores permitidos são 0, 1 ou 2, para tradicional, consecutivo ou entrelaçado, respectivamente. O ajuste padrão é 1 (consecutivo). Para as características de cada modo de bloqueio de autoincremento, consulte Modos de Bloqueio de Autoincremento do InnoDB.

- `innodb_background_drop_list_empty`

  <table frame="box" rules="all" summary="Propriedades para o arquivo de status innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb-status-file[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

  Ativação da opção de depuração `innodb_background_drop_list_empty` ajuda a evitar falhas nos casos de teste, atrasando a criação da tabela até que a lista de eliminação em segundo plano esteja vazia. Por exemplo, se o caso de teste A colocar a tabela `t1` na lista de eliminação em segundo plano, o caso de teste B aguarda até que a lista de eliminação em segundo plano esteja vazia antes de criar a tabela `t1`.

- `innodb_buffer_pool_chunk_size`

  <table frame="box" rules="all" summary="Propriedades para o arquivo de status innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb-status-file[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

  `innodb_buffer_pool_chunk_size` define o tamanho do bloco para as operações de redimensionamento do pool de buffer do `InnoDB`.

  Para evitar a cópia de todas as páginas do pool de buffers durante as operações de redimensionamento, a operação é realizada em "pedaços". Por padrão, o tamanho do "chunk" do `innodb_buffer_pool_chunk_size` é de 128 MB (134217728 bytes). O número de páginas contidas em um "chunk" depende do valor de `innodb_page_size`. O `innodb_buffer_pool_chunk_size` pode ser aumentado ou diminuído em unidades de 1 MB (1048576 bytes).

  As seguintes condições se aplicam ao alterar o valor `innodb_buffer_pool_chunk_size`:

  - Se `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances` for maior que o tamanho atual do pool de buffers quando o pool de buffers é inicializado, `innodb_buffer_pool_chunk_size` é truncado para `innodb_buffer_pool_size` / `innodb_buffer_pool_instances`.

  - O tamanho do pool de tampão deve sempre ser igual ou múltiplo de `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`. Se você alterar `innodb_buffer_pool_chunk_size`, `innodb_buffer_pool_size` será arredondado automaticamente para um valor que seja igual ou múltiplo de `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`. O ajuste ocorre quando o pool de tampão é inicializado.

  Importante

  É preciso ter cuidado ao alterar `innodb_buffer_pool_chunk_size`, pois alterar esse valor pode aumentar automaticamente o tamanho do pool de buffers. Antes de alterar `innodb_buffer_pool_chunk_size`, calcule o efeito que ele tem no `innodb_buffer_pool_size` para garantir que o tamanho do pool de buffers resultante seja aceitável.

  Para evitar possíveis problemas de desempenho, o número de fragmentos (`innodb_buffer_pool_size` / `innodb_buffer_pool_chunk_size`) não deve exceder 1000.

  A variável `innodb_buffer_pool_size` é dinâmica, o que permite redimensionar o pool de buffers enquanto o servidor estiver online. No entanto, o tamanho do pool de buffers deve ser igual ou múltiplo de `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`, e alterar qualquer uma dessas configurações de variáveis requer o reinício do servidor.

  Consulte a Seção 14.8.3.1, “Configurando o Tamanho do Pool de Armazenamento de Buffer do InnoDB”, para obter mais informações.

- `innodb_buffer_pool_dump_at_shutdown`

  <table frame="box" rules="all" summary="Propriedades para o arquivo de status innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb-status-file[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

  Especifica se as páginas armazenadas no pool de buffer do `InnoDB` devem ser gravadas quando o servidor MySQL é desligado, para encurtar o processo de aquecimento na próxima reinicialização. Tipicamente, é usado em combinação com `innodb_buffer_pool_load_at_startup`. A opção `innodb_buffer_pool_dump_pct` define a porcentagem das páginas do pool de buffer mais recentemente usadas para serem descartadas.

  Tanto `innodb_buffer_pool_dump_at_shutdown` quanto `innodb_buffer_pool_load_at_startup` estão habilitados por padrão.

  Para obter mais informações, consulte a Seção 14.8.3.6, “Salvar e restaurar o estado do pool de buffers”.

- `innodb_buffer_pool_dump_now`

  <table frame="box" rules="all" summary="Propriedades para o arquivo de status innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb-status-file[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

  Faz imediatamente um registro das páginas armazenadas em cache no pool de buffer do `InnoDB`. Tipicamente usado em combinação com `innodb_buffer_pool_load_now`.

  Ativação de `innodb_buffer_pool_dump_now` aciona a ação de gravação, mas não altera o ajuste da variável, que sempre permanece em `OFF` ou `0`. Para visualizar o status do descarte do buffer pool após a execução de um descarte, consulte a variável `Innodb_buffer_pool_dump_status`.

  Para obter mais informações, consulte a Seção 14.8.3.6, “Salvar e restaurar o estado do pool de buffers”.

- `innodb_buffer_pool_dump_pct`

  <table frame="box" rules="all" summary="Propriedades para o arquivo de status innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb-status-file[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

  Especifica a porcentagem das páginas mais recentemente usadas para cada pool de buffers para leitura e descarte. O intervalo é de 1 a 100. O valor padrão é 25. Por exemplo, se houver 4 pools de buffers com 100 páginas cada, e `innodb_buffer_pool_dump_pct` estiver definido para 25, as 25 páginas mais recentemente usadas de cada pool de buffers serão descartadas.

  A alteração no valor padrão de `innodb_buffer_pool_dump_pct` coincide com as alterações nos valores padrão de `innodb_buffer_pool_dump_at_shutdown` e `innodb_buffer_pool_load_at_startup`, que são habilitados por padrão no MySQL 5.7.

- `innodb_buffer_pool_filename`

  <table frame="box" rules="all" summary="Propriedades para o arquivo de status innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb-status-file[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

  Especifica o nome do arquivo que contém a lista de IDs de tablespace e IDs de página produzidos por `innodb_buffer_pool_dump_at_shutdown` ou `innodb_buffer_pool_dump_now`. Os IDs de tablespace e IDs de página são salvos no seguinte formato: `space, page_id`. Por padrão, o arquivo é chamado `ib_buffer_pool` e está localizado no diretório de dados `InnoDB`. Uma localização não padrão deve ser especificada em relação ao diretório de dados.

  Um nome de arquivo pode ser especificado em tempo de execução, usando uma instrução `SET`:

  ```sql
  SET GLOBAL innodb_buffer_pool_filename='file_name';
  ```

  Você também pode especificar um nome de arquivo na inicialização, em uma string de inicialização ou em um arquivo de configuração do MySQL. Ao especificar um nome de arquivo na inicialização, o arquivo deve existir ou o `InnoDB` retornará um erro de inicialização indicando que não existe tal arquivo ou diretório.

  Para obter mais informações, consulte a Seção 14.8.3.6, “Salvar e restaurar o estado do pool de buffers”.

- `innodb_buffer_pool_instances`

  <table frame="box" rules="all" summary="Propriedades para o arquivo de status innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb-status-file[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

  O número de regiões em que o pool de buffer do `InnoDB` é dividido. Para sistemas com pools de buffer na faixa de vários gigabytes, dividir o pool de buffer em instâncias separadas pode melhorar a concorrência, reduzindo a concorrência à medida que diferentes threads leem e escrevem em páginas armazenadas em cache. Cada página que é armazenada ou lida no pool de buffer é atribuída aleatoriamente a uma das instâncias do pool de buffer, usando uma função de hash. Cada instância do pool de buffer gerencia suas próprias listas de livre, listas de esvaziamento, LRUs e todas as outras estruturas de dados conectadas a um pool de buffer, e é protegida por seu próprio mutex do pool de buffer.

  Esta opção só tem efeito quando você define `innodb_buffer_pool_size` para 1 GB ou mais. O tamanho total do pool de buffers é dividido entre todos os pools de buffers. Para obter a melhor eficiência, especifique uma combinação de `innodb_buffer_pool_instances` e `innodb_buffer_pool_size` de modo que cada instância do pool de buffers tenha pelo menos 1 GB.

  O valor padrão em sistemas Windows de 32 bits depende do valor de `innodb_buffer_pool_size`, conforme descrito abaixo:

  - Se `innodb_buffer_pool_size` for maior que 1,3 GB, o valor padrão para `innodb_buffer_pool_instances` é `innodb_buffer_pool_size`/128 MB, com solicitações individuais de alocação de memória para cada bloco. O valor de 1,3 GB foi escolhido como limite em que há um risco significativo de o Windows de 32 bits não conseguir alocar o espaço de endereçamento contínuo necessário para um único pool de buffers.

  - Caso contrário, o padrão é 1.

  Em todas as outras plataformas, o valor padrão é 8 quando `innodb_buffer_pool_size` é maior ou igual a 1 GB. Caso contrário, o padrão é 1.

  Para informações relacionadas, consulte a Seção 14.8.3.1, “Configurando o tamanho do pool de buffers do InnoDB”.

- `innodb_buffer_pool_load_abort`

  <table frame="box" rules="all" summary="Propriedades para o arquivo de status innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb-status-file[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

  Interrompe o processo de restauração do conteúdo do pool de buffers do `InnoDB`, acionado pelo `innodb_buffer_pool_load_at_startup` ou `innodb_buffer_pool_load_now`.

  Ativação de `innodb_buffer_pool_load_abort` aciona a ação de interrupção, mas não altera o ajuste da variável, que sempre permanece em `OFF` ou `0`. Para visualizar o status da carga do buffer pool após a execução de uma ação de interrupção, consulte a variável `Innodb_buffer_pool_load_status`.

  Para obter mais informações, consulte a Seção 14.8.3.6, “Salvar e restaurar o estado do pool de buffers”.

- `innodb_buffer_pool_load_at_startup`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_enable_binlog"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-enable-binlog[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_enable_binlog</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

  Especifica que, ao inicializar o servidor MySQL, o pool de buffers `InnoDB` é aquecido automaticamente ao carregar as mesmas páginas que ele estava armazenando em um momento anterior. Tipicamente, é usado em combinação com `innodb_buffer_pool_dump_at_shutdown`.

  Tanto `innodb_buffer_pool_dump_at_shutdown` quanto `innodb_buffer_pool_load_at_startup` estão habilitados por padrão.

  Para obter mais informações, consulte a Seção 14.8.3.6, “Salvar e restaurar o estado do pool de buffers”.

- `innodb_buffer_pool_load_now`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_enable_binlog"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-enable-binlog[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_enable_binlog</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

  Acelera imediatamente o pool de buffers do `InnoDB` carregando páginas de dados sem esperar por uma reinicialização do servidor. Pode ser útil para restaurar a memória cache a um estado conhecido durante o benchmarking ou para preparar o servidor MySQL para retomar sua carga de trabalho normal após executar consultas para relatórios ou manutenção.

  Ativação de `innodb_buffer_pool_load_now` aciona a ação de carregamento, mas não altera o ajuste da variável, que sempre permanece em `OFF` ou `0`. Para visualizar o progresso do carregamento do buffer pool após o acionamento de um carregamento, consulte a variável `Innodb_buffer_pool_load_status`.

  Para obter mais informações, consulte a Seção 14.8.3.6, “Salvar e restaurar o estado do pool de buffers”.

- `innodb_buffer_pool_size`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_enable_binlog"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-enable-binlog[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_enable_binlog</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

  O tamanho em bytes do pool de buffers, a área de memória onde o `InnoDB` armazena os dados de tabelas e índices. O valor padrão é de 134217728 bytes (128 MB). O valor máximo depende da arquitetura da CPU; o máximo é de 4294967295 (232-1) em sistemas de 32 bits e 18446744073709551615 (264-1) em sistemas de 64 bits. Em sistemas de 32 bits, a arquitetura da CPU e o sistema operacional podem impor um tamanho máximo prático menor do que o máximo declarado. Quando o tamanho do pool de buffers é maior que 1 GB, definir `innodb_buffer_pool_instances` para um valor maior que 1 pode melhorar a escalabilidade em um servidor ocupado.

  Um pool de tampão maior requer menos I/O de disco para acessar os mesmos dados da tabela mais de uma vez. Em um servidor de banco de dados dedicado, você pode definir o tamanho do pool de tampão para 80% do tamanho da memória física da máquina. Esteja ciente dos seguintes problemas potenciais ao configurar o tamanho do pool de tampão e esteja preparado para reduzir o tamanho do pool de tampão, se necessário.

  - A competição pela memória física pode causar paginação no sistema operacional.

  - O `InnoDB` reserva memória adicional para buffers e estruturas de controle, de modo que o espaço total alocado seja aproximadamente 10% maior que o tamanho especificado do conjunto de buffers.

  - O espaço de endereçamento do pool de buffers deve ser contínuo, o que pode ser um problema em sistemas Windows com DLLs que são carregadas em endereços específicos.

  - O tempo para inicializar o pool de buffers é aproximadamente proporcional ao seu tamanho. Em instâncias com pools de buffers grandes, o tempo de inicialização pode ser significativo. Para reduzir o período de inicialização, você pode salvar o estado do pool de buffers ao desligar o servidor e restaurá-lo ao iniciar o servidor. Consulte a Seção 14.8.3.6, “Salvar e Restaurar o Estado do Pool de Buffers”.

  Quando você aumenta ou diminui o tamanho do pool de buffer, a operação é realizada em partes. O tamanho da parte é definido pela variável `innodb_buffer_pool_chunk_size`, que tem um valor padrão de 128 MB.

  O tamanho do pool de tampão deve sempre ser igual ou múltiplo de `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`. Se você alterar o tamanho do pool de tampão para um valor que não seja igual ou múltiplo de `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`, o tamanho do pool de tampão será automaticamente ajustado para um valor que seja igual ou múltiplo de `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`.

  `innodb_buffer_pool_size` pode ser definido dinamicamente, o que permite redimensionar o pool de buffers sem precisar reiniciar o servidor. A variável `Innodb_buffer_pool_resize_status` informa o status das operações de redimensionamento do pool de buffers online. Consulte a Seção 14.8.3.1, “Configurando o Tamanho do Pool de Buffers InnoDB”, para obter mais informações.

- `innodb_change_buffer_max_size`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_enable_binlog"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-enable-binlog[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_enable_binlog</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

  Tamanho máximo do buffer de alterações do `InnoDB`, como porcentagem do tamanho total do pool de buffers. Você pode aumentar esse valor para um servidor MySQL com alta atividade de inserção, atualização e exclusão, ou diminuí-lo para um servidor MySQL com dados inalterados usados para relatórios. Para mais informações, consulte a Seção 14.5.2, “Buffer de Alterações”. Para conselhos gerais sobre o ajuste de E/S, consulte a Seção 8.5.8, “Otimização do E/S de Disco do InnoDB”.

- `innodb_change_buffering`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_enable_binlog"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-enable-binlog[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_enable_binlog</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

  Se o `InnoDB` realiza o bufferamento de alterações, uma otimização que adiatra as operações de escrita para índices secundários para que as operações de E/S possam ser realizadas sequencialmente. Os valores permitidos estão descritos na tabela a seguir.

  **Tabela 14.19 Valores permitidos para innodb_change_buffering**

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_enable_binlog"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-enable-binlog[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_enable_binlog</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

  Para obter mais informações, consulte a Seção 14.5.2, “Alterar o buffer”. Para obter conselhos gerais sobre o ajuste de E/S, consulte a Seção 8.5.8, “Otimizando o E/S de disco do InnoDB”.

- `innodb_change_buffering_debug`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_enable_binlog"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-enable-binlog[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_enable_binlog</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

  Define uma bandeira de depuração para o buffer de alterações do `InnoDB`. Um valor de 1 força todas as alterações no buffer de alterações. Um valor de 2 causa uma saída inesperada durante a fusão. Um valor padrão de 0 indica que a bandeira de depuração do buffer de alterações não está definida. Esta opção só está disponível quando o suporte de depuração está compilado com a opção **CMake** `WITH_DEBUG`.

- `innodb_checksum_algorithm`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_enable_binlog"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-enable-binlog[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_enable_binlog</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

  Especifica como gerar e verificar o checksum armazenado nos blocos de disco dos espaços de tabelas do `InnoDB`. `crc32` é o valor padrão a partir do MySQL 5.7.7.

  `innodb_checksum_algorithm` substitui a opção `innodb_checksums`. Os seguintes valores foram fornecidos para compatibilidade, até e incluindo o MySQL 5.7.6:

  - `innodb_checksums=ON` é o mesmo que `innodb_checksum_algorithm=innodb`.

  - `innodb_checksums=OFF` é o mesmo que `innodb_checksum_algorithm=none`.

  A partir do MySQL 5.7.7, com um valor padrão de `innodb_checksum_algorithm` de crc32, `innodb_checksums=ON` agora é o mesmo que `innodb_checksum_algorithm=crc32`. `innodb_checksums=OFF` ainda é o mesmo que `innodb_checksum_algorithm=none`.

  Para evitar conflitos, remova as referências a `innodb_checksums` dos arquivos de configuração do MySQL e dos scripts de inicialização.

  O valor `innodb` é compatível com versões anteriores do MySQL. O valor `crc32` utiliza um algoritmo que é mais rápido para calcular o checksum de cada bloco modificado e para verificar os checksums de cada leitura de disco. Ele examina blocos de 64 bits de cada vez, o que é mais rápido que o algoritmo de checksum `innodb`, que examina blocos de 8 bits de cada vez. O valor `none` escreve um valor constante no campo checksum em vez de calcular um valor baseado nos dados do bloco. Os blocos de um espaço de tabelas podem usar uma mistura de valores antigos, novos e sem checksum, sendo atualizados gradualmente à medida que os dados são modificados; uma vez que os blocos de um espaço de tabelas são modificados para usar o algoritmo `crc32`, as tabelas associadas não podem ser lidas por versões anteriores do MySQL.

  A forma rigorosa de um algoritmo de verificação de integridade de dados reporta um erro se encontrar um valor de verificação de integridade válido, mas não correspondente, em um espaço de tabelas. Recomenda-se que você use apenas configurações rigorosas em uma nova instância, para configurar espaços de tabelas pela primeira vez. As configurações rigorosas são um pouco mais rápidas, porque não precisam calcular todos os valores de verificação de integridade durante as leituras do disco.

  Nota

  Antes do MySQL 5.7.8, um ajuste de modo rigoroso para `innodb_checksum_algorithm` fazia com que o `InnoDB` parasse ao encontrar um *válido*, mas não correspondente, checksum. No MySQL 5.7.8 e versões posteriores, apenas uma mensagem de erro é impressa e a página é aceita como válida se tiver um checksum `innodb`, `crc32` ou `none` válido.

  A tabela a seguir mostra a diferença entre os valores das opções `none`, `innodb` e `crc32`, e seus equivalentes rígidos. `none`, `innodb` e `crc32` escrevem o tipo especificado de valor de verificação em cada bloco de dados, mas, para compatibilidade, aceitam outros valores de verificação quando verificam um bloco durante uma operação de leitura. As configurações rígidas também aceitam valores de verificação válidos, mas imprimem uma mensagem de erro quando um valor de verificação não correspondente válido é encontrado. O uso da forma rígida pode tornar a verificação mais rápida se todos os arquivos de dados `InnoDB` em uma instância forem criados com um valor idêntico de `innodb_checksum_algorithm`.

  **Tabela 14.20 Valores permitidos para innodb_checksum_algorithm**

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_enable_binlog"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-enable-binlog[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_enable_binlog</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

  As versões do MySQL Enterprise Backup até 3.8.0 não suportam a realização de backups de espaços de tabela que utilizam verificações de checksum CRC32. O MySQL Enterprise Backup adiciona suporte para verificações de checksum CRC32 na versão 3.8.1, com algumas limitações. Consulte o Histórico de Alterações do MySQL Enterprise Backup 3.8.1 para obter mais informações.

- `innodb_checksums`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_enable_binlog"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-enable-binlog[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_enable_binlog</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

  O `InnoDB` pode usar a validação de checksum em todas as páginas do espaço de tabela lidas do disco para garantir uma maior tolerância a falhas de hardware ou arquivos de dados corrompidos. Essa validação é ativada por padrão. Em circunstâncias especiais (como quando executa benchmarks), essa funcionalidade de segurança pode ser desativada com `--skip-innodb-checksums`. Você pode especificar o método de cálculo do checksum usando a opção `innodb_checksum_algorithm`.

  `innodb_checksums` está desatualizado e foi substituído por `innodb_checksum_algorithm`.

  Antes do MySQL 5.7.7, `innodb_checksums=ON` é o mesmo que `innodb_checksum_algorithm=innodb`. A partir do MySQL 5.7.7, o valor padrão de `innodb_checksum_algorithm` é `crc32`, e `innodb_checksums=ON` é o mesmo que `innodb_checksum_algorithm=crc32`. `innodb_checksums=OFF` é o mesmo que `innodb_checksum_algorithm=none`.

  Remova quaisquer opções `innodb_checksums` dos seus arquivos de configuração e scripts de inicialização para evitar conflitos com `innodb_checksum_algorithm`. `innodb_checksums=OFF` define automaticamente `innodb_checksum_algorithm=none`. `innodb_checksums=ON` é ignorado e substituído por qualquer outro ajuste para `innodb_checksum_algorithm`.

- `innodb_cmp_per_index_enabled`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_engine_lib_name"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-engine-lib-name=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_engine_lib_name</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>innodb_engine.so</code>]]</td> </tr></tbody></table>

  Habilita estatísticas relacionadas à compressão por índice na tabela do esquema de informações `INNODB_CMP_PER_INDEX`. Como essas estatísticas podem ser caras de coletar, habilite essa opção apenas em instâncias de desenvolvimento, teste ou replica durante o ajuste de desempenho relacionado às tabelas compactadas do `InnoDB`.

  Para obter mais informações, consulte a Seção 24.4.7, “As tabelas INFORMATION_SCHEMA INNODB_CMP_PER_INDEX e INNODB_CMP_PER_INDEX_RESET”, e a Seção 14.9.1.4, “Monitoramento da compactação de tabelas InnoDB em tempo de execução”.

- `innodb_commit_concurrency`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_engine_lib_name"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-engine-lib-name=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_engine_lib_name</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>innodb_engine.so</code>]]</td> </tr></tbody></table>

  O número de threads que podem ser comprometidos ao mesmo tempo. Um valor de 0 (padrão) permite que qualquer número de transações seja comprometido simultaneamente.

  O valor de `innodb_commit_concurrency` não pode ser alterado dinamicamente de zero para um valor não nulo ou vice-versa. O valor pode ser alterado de um valor não nulo para outro.

- `innodb_compress_debug`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_engine_lib_name"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-engine-lib-name=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_engine_lib_name</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>innodb_engine.so</code>]]</td> </tr></tbody></table>

  Compreende todas as tabelas usando um algoritmo de compressão especificado, sem precisar definir um atributo `COMPRESSION` para cada tabela. Esta opção só está disponível se o suporte de depuração estiver compilado usando a opção `WITH_DEBUG` do **CMake**.

  Para informações relacionadas, consulte a Seção 14.9.2, “Compressão de Páginas InnoDB”.

- `innodb_compression_failure_threshold_pct`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_engine_lib_name"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-engine-lib-name=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_engine_lib_name</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>innodb_engine.so</code>]]</td> </tr></tbody></table>

  Define o limiar de taxa de falha de compressão para uma tabela, como uma porcentagem, no ponto em que o MySQL começa a adicionar espaços de preenchimento dentro das páginas compactadas para evitar falhas de compactação caras. Quando esse limiar é ultrapassado, o MySQL começa a deixar espaço livre adicional dentro de cada nova página compactada, ajustando dinamicamente a quantidade de espaço livre até a porcentagem do tamanho da página especificada por `innodb_compression_pad_pct_max`. Um valor de zero desativa o mecanismo que monitora a eficiência da compactação e ajusta dinamicamente a quantidade de preenchimento.

  Para obter mais informações, consulte a Seção 14.9.1.6, “Compressão para cargas de trabalho OLTP”.

- `innodb_compression_level`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_engine_lib_name"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-engine-lib-name=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_engine_lib_name</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>innodb_engine.so</code>]]</td> </tr></tbody></table>

  Especifica o nível de compressão zlib a ser usado para tabelas e índices compactados do `InnoDB`. Um valor maior permite que você coloque mais dados em um dispositivo de armazenamento, às custas de mais overhead de CPU durante a compressão. Um valor menor permite reduzir o overhead de CPU quando o espaço de armazenamento não é crítico ou você espera que os dados não sejam especialmente compressivos.

  Para obter mais informações, consulte a Seção 14.9.1.6, “Compressão para cargas de trabalho OLTP”.

- `innodb_compression_pad_pct_max`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_engine_lib_name"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-engine-lib-name=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_engine_lib_name</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>innodb_engine.so</code>]]</td> </tr></tbody></table>

  Especifica a porcentagem máxima que pode ser reservada como espaço livre dentro de cada página compactada, permitindo espaço para reorganizar o log de modificações e os dados dentro da página quando uma tabela ou índice compactado é atualizado e os dados podem ser recompactados. Aplica-se apenas quando `innodb_compression_failure_threshold_pct` é definido para um valor diferente de zero e a taxa de falhas de compactação ultrapassa o ponto de corte.

  Para obter mais informações, consulte a Seção 14.9.1.6, “Compressão para cargas de trabalho OLTP”.

- `innodb_concurrency_tickets`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_engine_lib_name"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-engine-lib-name=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_engine_lib_name</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>innodb_engine.so</code>]]</td> </tr></tbody></table>

  Determina o número de threads que podem entrar no `InnoDB` simultaneamente. Uma thread é colocada em uma fila quando tenta entrar no `InnoDB` se o número de threads já tiver atingido o limite de concorrência. Quando uma thread é permitida a entrar no `InnoDB`, ela recebe um número de "ingressos" igual ao valor de `innodb_concurrency_tickets`, e a thread pode entrar e sair livremente do `InnoDB` até que tenha usado seus ingressos. Após esse ponto, a thread novamente fica sujeita à verificação de concorrência (e possível fila) da próxima vez que tentar entrar no `InnoDB`. O valor padrão é 5000.

  Com um pequeno valor de `innodb_concurrency_tickets`, transações pequenas que precisam processar apenas algumas linhas competem de forma justa com transações maiores que processam muitas linhas. A desvantagem de um pequeno valor de `innodb_concurrency_tickets` é que transações grandes precisam percorrer a fila muitas vezes antes de poderem ser concluídas, o que aumenta o tempo necessário para concluir sua tarefa.

  Com um grande valor de `innodb_concurrency_tickets`, as grandes transações gastam menos tempo esperando uma posição no final da fila (controlada por `innodb_thread_concurrency`) e mais tempo recuperando linhas. As grandes transações também requerem menos viagens pela fila para completar sua tarefa. A desvantagem de um grande valor de `innodb_concurrency_tickets` é que muitas transações grandes rodando ao mesmo tempo podem deixar menores transações famintas, fazendo com que elas precisem esperar por um tempo mais longo antes de serem executadas.

  Com um valor de `innodb_thread_concurrency` não nulo, você pode precisar ajustar o valor de `innodb_concurrency_tickets` para cima ou para baixo para encontrar o equilíbrio ótimo entre transações maiores e menores. O relatório `SHOW ENGINE INNODB STATUS` mostra o número de ingressos restantes para uma transação em execução em sua passagem atual na fila. Esses dados também podem ser obtidos da coluna `TRX_CONCURRENCY_TICKETS` da tabela `INNODB_TRX` do Schema de Informações.

  Para obter mais informações, consulte a Seção 14.8.5, “Configurando Concorrência de Fila para InnoDB”.

- `innodb_data_file_path`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_engine_lib_name"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-engine-lib-name=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_engine_lib_name</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>innodb_engine.so</code>]]</td> </tr></tbody></table>

  Define o nome, o tamanho e os atributos dos arquivos de dados dos espaços de tabela do sistema `InnoDB`. Se você não especificar um valor para `innodb_data_file_path`, o comportamento padrão é criar um único arquivo de dados auto-extensível, ligeiramente maior que 12 MB, com o nome `ibdata1`.

  A sintaxe completa para uma especificação de arquivo de dados inclui o nome do arquivo, o tamanho do arquivo, o atributo `autoextend` e o atributo `max`:

  ```sql
  file_name:file_size[:autoextend[:max:max_file_size]]
  ```

  Os tamanhos dos arquivos são especificados em kilobytes, megabytes ou gigabytes, anexando `K`, `M` ou `G` ao valor do tamanho. Se você especificar o tamanho do arquivo de dados em kilobytes, faça isso em múltiplos de 1024. Caso contrário, os valores em KB são arredondados para o limite mais próximo de megabyte (MB). A soma dos tamanhos dos arquivos deve ser, no mínimo, ligeiramente maior que 12 MB.

  Para obter informações adicionais sobre a configuração, consulte Configuração do arquivo de dados do espaço de tabelas do sistema. Para instruções de redimensionamento, consulte Redimensionamento do espaço de tabelas do sistema.

- `innodb_data_home_dir`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_engine_lib_name"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-engine-lib-name=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_engine_lib_name</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>innodb_engine.so</code>]]</td> </tr></tbody></table>

  A parte comum do caminho do diretório para os arquivos de dados do espaço de tabela do sistema `InnoDB`. O valor padrão é o diretório `data` do MySQL. O ajuste é concatenado com o ajuste `innodb_data_file_path`. Se você especificar o valor como uma string vazia, pode especificar um caminho absoluto para `innodb_data_file_path`.

  Um traço final é necessário ao especificar um valor para `innodb_data_home_dir`. Por exemplo:

  ```sql
  [mysqld]
  innodb_data_home_dir = /path/to/myibdata/
  ```

  Essa configuração não afeta a localização dos espaços de tabelas por arquivo.

  Para informações relacionadas, consulte a Seção 14.8.1, “Configuração de Inicialização do InnoDB”.

- `innodb_deadlock_detect`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_engine_lib_name"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-engine-lib-name=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_engine_lib_name</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>innodb_engine.so</code>]]</td> </tr></tbody></table>

  Esta opção é usada para desabilitar a detecção de impasses. Em sistemas de alta concorrência, a detecção de impasses pode causar um atraso quando vários threads aguardam o mesmo bloqueio. Às vezes, pode ser mais eficiente desabilitar a detecção de impasses e confiar no ajuste `innodb_lock_wait_timeout` para o rollback de transações quando um impasse ocorre.

  Para informações relacionadas, consulte a Seção 14.7.5.2, “Detecção de Enganelamento”.

- `innodb_default_row_format`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_engine_lib_path"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-engine-lib-path=dir_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_engine_lib_path</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>

  A opção `innodb_default_row_format` define o formato de linha padrão para as tabelas `InnoDB` e tabelas temporárias criadas pelo usuário. O ajuste padrão é `DYNAMIC`. Outros valores permitidos são `COMPACT` e `REDUNDANT`. O formato de linha `COMPRESSED`, que não é suportado para uso no espaço de tabela do sistema, não pode ser definido como padrão.

  As tabelas recém-criadas usam o formato de linha definido por `innodb_default_row_format` quando uma opção `ROW_FORMAT` não é especificada explicitamente ou quando `ROW_FORMAT=DEFAULT` é usada.

  Quando uma opção `ROW_FORMAT` não é especificada explicitamente ou quando `ROW_FORMAT=DEFAULT` é usada, qualquer operação que reconstrua uma tabela também altera silenciosamente o formato da linha da tabela para o formato definido por `innodb_default_row_format`. Para obter mais informações, consulte Definindo o Formato da Linha de uma Tabela.

  As tabelas temporárias internas do `InnoDB` criadas pelo servidor para processar consultas usam o formato de linha `DYNAMIC`, independentemente da configuração `innodb_default_row_format`.

- `innodb_disable_sort_file_cache`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_engine_lib_path"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-engine-lib-path=dir_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_engine_lib_path</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>

  Desabilita o cache do sistema de arquivos do sistema operacional para arquivos temporários de ordenação por junção. O efeito é abrir esses arquivos com o equivalente a `O_DIRECT`.

- `innodb_disable_resize_buffer_pool_debug`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_engine_lib_path"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-engine-lib-path=dir_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_engine_lib_path</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>

  Desabilita o redimensionamento do pool de buffer do `InnoDB`. Esta opção só está disponível se o suporte de depuração estiver compilado com a opção `WITH_DEBUG` do **CMake**.

- `innodb_doublewrite`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_engine_lib_path"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-engine-lib-path=dir_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_engine_lib_path</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>

  Quando ativada (padrão), a `InnoDB` armazena todos os dados duas vezes, primeiro no buffer de dupla escrita e depois nos arquivos de dados reais. Essa variável pode ser desativada com `--skip-innodb-doublewrite` para benchmarks ou casos em que é necessário o melhor desempenho, em vez de se preocupar com a integridade dos dados ou possíveis falhas.

  Se os arquivos de dados do espaço de tabela do sistema (`ibdata*`) estiverem localizados em dispositivos Fusion-io que suportam escritas atômicas, o buffer de escrita dupla será desativado automaticamente e as escritas atômicas do Fusion-io serão usadas para todos os arquivos de dados. Como o ajuste do buffer de escrita dupla é global, o buffer de escrita dupla também será desativado para arquivos de dados localizados em hardware não Fusion-io. Esse recurso é suportado apenas em hardware Fusion-io e só está habilitado para o Fusion-io NVMFS no Linux. Para aproveitar ao máximo esse recurso, é recomendado o ajuste `innodb_flush_method` de `O_DIRECT`.

  Para informações relacionadas, consulte a Seção 14.6.5, “Buffer de Doublewrite”.

- `innodb_fast_shutdown`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_engine_lib_path"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-engine-lib-path=dir_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_engine_lib_path</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>

  O modo de desligamento do `InnoDB`. Se o valor for 0, o `InnoDB` realiza um desligamento lento, uma purga completa e uma fusão do buffer de alterações antes de desligar. Se o valor for 1 (o padrão), o `InnoDB` ignora essas operações ao desligar, um processo conhecido como desligamento rápido. Se o valor for 2, o `InnoDB` esvazia seus logs e desliga-se completamente, como se o MySQL tivesse falhado; nenhuma transação confirmada é perdida, mas a operação de recuperação após o crash faz com que a próxima inicialização demore mais tempo.

  O desligamento lento pode levar minutos, ou até horas em casos extremos, quando quantidades substanciais de dados ainda estão em buffer. Use a técnica de desligamento lento antes de fazer uma atualização ou uma downgrade entre as versões principais do MySQL, para que todos os arquivos de dados estejam totalmente preparados, caso o processo de atualização atualize o formato do arquivo.

  Use `innodb_fast_shutdown=2` em situações de emergência ou de solução de problemas, para obter o desligamento mais rápido possível se os dados estiverem em risco de corrupção.

- `innodb_fil_make_page_dirty_debug`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_engine_lib_path"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-engine-lib-path=dir_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_engine_lib_path</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>

  Por padrão, ao definir `innodb_fil_make_page_dirty_debug` para o ID de um espaço de tabelas, a primeira página do espaço de tabelas é imediatamente marcada como suja. Se `innodb_saved_page_number_debug` estiver definido para um valor não padrão, definir `innodb_fil_make_page_dirty_debug` marca a página especificada como suja. A opção `innodb_fil_make_page_dirty_debug` só está disponível se o suporte de depuração estiver compilado com a opção `WITH_DEBUG` do **CMake**.

- `innodb_file_format`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_engine_lib_path"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-engine-lib-path=dir_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_engine_lib_path</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>

  Habilita um formato de arquivo `InnoDB` para espaços de tabelas por arquivo. Os formatos de arquivo suportados são `Antelope` e `Barracuda`. `Antelope` é o formato de arquivo original do `InnoDB`, que suporta os formatos de linha `REDUNDANT` e `COMPACT`. `Barracuda` é o formato de arquivo mais recente, que suporta os formatos de linha `COMPRESSED` e `DYNAMIC`.

  Os formatos de linha `COMPRESSADA` e `DINÂMICA` permitem recursos importantes de armazenamento para tabelas `InnoDB`. Veja a Seção 14.11, “Formatos de Linha InnoDB”.

  A alteração do ajuste `innodb_file_format` não afeta o formato de arquivo dos arquivos do espaço de tabela `InnoDB` existentes.

  A configuração `innodb_file_format` não se aplica a espaços de tabelas gerais, que suportam tabelas de todos os formatos de linha. Consulte a Seção 14.6.3.3, “Espaços de tabelas gerais”.

  O valor padrão de `innodb_file_format` foi alterado para `Barracuda` no MySQL 5.7.

  A configuração `innodb_file_format` é ignorada ao criar tabelas que utilizam o formato de linha `DYNAMIC`. Uma tabela criada com o formato de linha `DYNAMIC` sempre usa o formato de arquivo `Barracuda`, independentemente da configuração `innodb_file_format`. Para usar o formato de linha `COMPRESSED`, `innodb_file_format` deve ser definido como `Barracuda`.

  A opção `innodb_file_format` está desatualizada; espere-se que ela seja removida em uma futura versão. O propósito da opção `innodb_file_format` era permitir que os usuários dessem um passo atrás para a versão integrada do `InnoDB` em versões anteriores do MySQL. Agora que essas versões do MySQL chegaram ao fim de seus ciclos de vida do produto, o suporte para downgrade fornecido por essa opção não é mais necessário.

  Para obter mais informações, consulte a Seção 14.10, “Gerenciamento do formato de arquivo InnoDB”.

- `innodb_file_format_check`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_engine_lib_path"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-engine-lib-path=dir_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_engine_lib_path</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>

  Essa variável pode ser definida como 1 ou 0 ao iniciar o servidor para habilitar ou desabilitar se o `InnoDB` verifica a tag de formato de arquivo nos espaços de tabela do sistema (por exemplo, `Antelope` ou `Barracuda`). Se a tag for verificada e for maior que a suportada pela versão atual do `InnoDB`, um erro ocorre e o `InnoDB` não inicia. Se a tag não for maior, o `InnoDB` define o valor de `innodb_file_format_max` como a tag de formato de arquivo.

  Nota

  Apesar de o valor padrão às vezes ser exibido como `ON` ou `OFF`, sempre use os valores numéricos 1 ou 0 para ativar ou desativar essa opção em seu arquivo de configuração ou string de linha de comando.

  Para obter mais informações, consulte a Seção 14.10.2.1, “Verificação de compatibilidade ao iniciar o InnoDB”.

  A opção `innodb_file_format_check` é desaconselhada juntamente com a opção `innodb_file_format`. Você deve esperar que ambas as opções sejam removidas em uma futura versão.

- `innodb_file_format_max`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_engine_lib_path"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-engine-lib-path=dir_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_engine_lib_path</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>

  Ao iniciar o servidor, o `InnoDB` define o valor desta variável para a tag de formato de arquivo nos espaços de tabela do sistema (por exemplo, `Antelope` ou `Barracuda`). Se o servidor criar ou abrir uma tabela com um formato de arquivo "superior", ele define o valor de `innodb_file_format_max` para esse formato.

  Para informações relacionadas, consulte a Seção 14.10, “Gerenciamento do Formato de Arquivo InnoDB”.

  A opção `innodb_file_format_max` é desaconselhada juntamente com a opção `innodb_file_format`. Você deve esperar que ambas as opções sejam removidas em uma futura versão.

- `innodb_file_per_table`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_engine_lib_path"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-engine-lib-path=dir_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_engine_lib_path</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>

  Quando `innodb_file_per_table` está habilitado, as tabelas são criadas em espaços de tabelas por arquivo por padrão. Quando desabilitado, as tabelas são criadas no espaço de tabelas do sistema por padrão. Para informações sobre espaços de tabelas por arquivo, consulte a Seção 14.6.3.2, “Espaços de tabelas por arquivo”. Para informações sobre o espaço de tabelas do sistema `InnoDB`, consulte a Seção 14.6.3.1, “O espaço de tabelas do sistema”.

  A variável `innodb_file_per_table` pode ser configurada em tempo de execução usando uma instrução `SET GLOBAL`, especificada na linha de comando durante o início ou especificada em um arquivo de opção. A configuração em tempo de execução requer privilégios suficientes para definir variáveis de sistema globais (consulte a Seção 5.1.8.1, “Privilégios de Variáveis de Sistema”) e afeta imediatamente o funcionamento de todas as conexões.

  Quando uma tabela que reside em um espaço de tabelas por arquivo é truncada ou excluída, o espaço liberado é devolvido ao sistema operacional. Ao truncar ou excluir uma tabela que reside no espaço de tabelas do sistema, apenas o espaço liberado no espaço de tabelas do sistema é liberado. O espaço liberado no espaço de tabelas do sistema pode ser reutilizado para dados do `InnoDB`, mas não é devolvido ao sistema operacional, pois os arquivos de dados do espaço de tabelas do sistema nunca são reduzidos.

  Quando o `innodb_file_per_table` está habilitado, uma operação de cópia de tabela `ALTER TABLE` em uma tabela que reside no espaço de tabelas do sistema recria implicitamente a tabela em um espaço de tabelas por arquivo. Para evitar que isso ocorra, desabilite o `innodb_file_per_table` antes de executar operações de `ALTER TABLE` de cópia de tabela em tabelas que residem no espaço de tabelas do sistema.

  A configuração `innodb_file_per-table` não afeta a criação de tabelas temporárias. As tabelas temporárias são criadas no espaço de tabelas temporárias. Consulte a Seção 14.6.3.5, “O Espaço de Tabelas Temporárias”.

- `innodb_fill_factor`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_option"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-option=options</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_option</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>

  O `InnoDB` realiza uma carga em massa ao criar ou reconstruir índices. Esse método de criação de índices é conhecido como "construção de índice ordenado".

  `innodb_fill_factor` define a porcentagem de espaço em cada página da árvore B que é preenchida durante a construção de um índice ordenado, com o espaço restante reservado para o crescimento futuro do índice. Por exemplo, definir `innodb_fill_factor` para 80 reserva 20% do espaço em cada página da árvore B para o crescimento futuro do índice. As porcentagens reais podem variar. O ajuste `innodb_fill_factor` é interpretado como um indicativo em vez de um limite rígido.

  Um ajuste de `innodb_fill_factor` de 100 deixa 1/16 do espaço nas páginas do índice agrupado livre para o crescimento futuro do índice.

  `innodb_fill_factor` aplica-se tanto às páginas de folhas de B-tree quanto às páginas não-folhas. Não se aplica a páginas externas usadas para entradas `TEXT` ou `BLOB`.

  Para obter mais informações, consulte a Seção 14.6.2.3, “Construções de índices ordenados”.

- `innodb_flush_log_at_timeout`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_option"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-option=options</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_option</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>

  Escreva e limpe os logs a cada `N` segundos. O `innodb_flush_log_at_timeout` permite que o período de tempo de espera entre os limpos seja aumentado para reduzir o processo de limpeza e evitar o impacto no desempenho do commit do grupo de log binário. O ajuste padrão para `innodb_flush_log_at_timeout` é uma vez por segundo.

- `innodb_flush_log_at_trx_commit`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_option"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-option=options</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_option</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>

  Controla o equilíbrio entre a estrita conformidade ACID para operações de commit e o melhor desempenho que é possível quando as operações de E/S relacionadas ao commit são reorganizadas e realizadas em lotes. Você pode obter um melhor desempenho ao alterar o valor padrão, mas, nesse caso, você pode perder transações em caso de falha.

  - A configuração padrão de 1 é necessária para a conformidade completa com ACID. Os logs são escritos e descarregados no disco em cada commit de transação.

  - Com um valor de 0, os logs são escritos e descarregados no disco uma vez por segundo. As transações para as quais os logs não foram descarregados podem ser perdidas em um crash.

  - Com um nível de 2, os logs são escritos após cada commit de transação e descarregados no disco uma vez por segundo. As transações para as quais os logs não foram descarregados podem ser perdidas em um crash.

  - Para as configurações 0 e 2, o esvaziamento uma vez por segundo não é garantido a 100%. O esvaziamento pode ocorrer com mais frequência devido a alterações no DDL e outras atividades internas do `InnoDB` que fazem com que os logs sejam esvaziados independentemente da configuração `innodb_flush_log_at_trx_commit`, e, às vezes, com menos frequência devido a problemas de agendamento. Se os logs forem esvaziados uma vez por segundo, até um segundo de transações pode ser perdido em um crash. Se os logs forem esvaziados com mais ou menos frequência do que uma vez por segundo, a quantidade de transações que podem ser perdidas varia de acordo.

  - A frequência de varredura do log é controlada pelo `innodb_flush_log_at_timeout`, que permite definir a frequência de varredura do log para *`N`* segundos (onde *`N`* é de `1 a 2700`, com um valor padrão de 1). No entanto, qualquer encerramento inesperado do processo do **mysqld** pode apagar até *`N`* segundos de transações.

  - As alterações no DDL e outras atividades internas do `InnoDB` limpem o log independentemente da configuração `innodb_flush_log_at_trx_commit`.

  - A recuperação de falhas do `InnoDB` funciona independentemente da configuração `innodb_flush_log_at_trx_commit`. As transações são aplicadas totalmente ou apagadas totalmente.

  Para a durabilidade e consistência em uma configuração de replicação que utiliza o `InnoDB` com transações:

  - Se o registro binário estiver habilitado, defina `sync_binlog=1`.

  - Sempre defina `innodb_flush_log_at_trx_commit=1`.

  Para obter informações sobre a combinação de configurações em uma réplica que seja mais resistente a interrupções inesperadas, consulte a Seção 16.3.2, “Tratamento de uma Interrupção Inesperada de uma Réplica”.

  Cuidado

  Muitos sistemas operacionais e alguns hardwares de disco enganam a operação de gravação no disco. Eles podem informar ao **mysqld** que a gravação ocorreu, mesmo que não tenha. Nesse caso, a durabilidade das transações não é garantida, mesmo com as configurações recomendadas, e, no pior dos casos, uma queda de energia pode corromper os dados do `InnoDB`. O uso de um cache de disco com bateria no controlador de disco SCSI ou no próprio disco acelera as gravação no disco e torna a operação mais segura. Você também pode tentar desativar o cache de gravação no disco em caches de hardware.

- `innodb_flush_method`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_option"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-option=options</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_option</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>

  Define o método usado para limpar os arquivos de dados e os arquivos de log do InnoDB, o que pode afetar o desempenho de E/S.

  Se `innodb_flush_method` estiver definido como `NULL` em um sistema semelhante ao Unix, a opção `fsync` é usada por padrão. Se `innodb_flush_method` estiver definido como `NULL` no Windows, a opção `async_unbuffered` é usada por padrão.

  As opções `innodb_flush_method` para sistemas semelhantes ao Unix incluem:

  - `fsync`: O `InnoDB` usa a chamada de sistema `fsync()` para esvaziar tanto os arquivos de dados quanto os de log. `fsync` é o ajuste padrão.

  - `O_DSYNC`: O `InnoDB` usa `O_SYNC` para abrir e limpar os arquivos de log e `fsync()` para limpar os arquivos de dados. O `InnoDB` não usa `O_DSYNC` diretamente porque houve problemas com isso em muitas variedades de Unix.

  - `littlesync`: Esta opção é usada para testes internos de desempenho e atualmente não é suportada. Use por sua conta e risco.

  - `nosync`: Esta opção é usada para testes internos de desempenho e atualmente não é suportada. Use por sua conta e risco.

  - `O_DIRECT`: O `InnoDB` usa `O_DIRECT` (ou `fsync()` no Solaris) para abrir os arquivos de dados e usa `fsync()` para esvaziar tanto os arquivos de dados quanto os de log. Esta opção está disponível em algumas versões do GNU/Linux, FreeBSD e Solaris.

  - `O_DIRECT_NO_FSYNC`: O `InnoDB` usa `O_DIRECT` durante o esvaziamento de E/S, mas ignora a chamada de sistema `fsync()` após cada operação de escrita.

    Antes do MySQL 5.7.25, essa configuração não é adequada para sistemas de arquivos como XFS e EXT4, que exigem uma chamada de sistema `fsync()` para sincronizar as alterações dos metadados do sistema de arquivos. Se você não tiver certeza se o seu sistema de arquivos requer uma chamada de sistema `fsync()` para sincronizar as alterações dos metadados do sistema de arquivos, use `O_DIRECT` em vez disso.

    A partir do MySQL 5.7.25, o `fsync()` é chamado após a criação de um novo arquivo, após o aumento do tamanho do arquivo e após a fechamento de um arquivo, para garantir que as alterações dos metadados do sistema de arquivos sejam sincronizadas. A chamada de sistema `fsync()` ainda é ignorada após cada operação de escrita.

    A perda de dados é possível se os arquivos de log de refazer e os arquivos de dados estiverem em dispositivos de armazenamento diferentes, e uma saída inesperada ocorrer antes que os dados sejam apagados do cache de um dispositivo que não seja alimentado por bateria. Se você estiver usando ou planejando usar diferentes dispositivos de armazenamento para arquivos de log de refazer e arquivos de dados, e seus arquivos de dados estiverem em um dispositivo com um cache que não seja alimentado por bateria, use `O_DIRECT` em vez disso.

  As opções `innodb_flush_method` para sistemas Windows incluem:

  - `async_unbuffered`: O `InnoDB` utiliza o Windows I/O assíncrono e I/O não bufferizado. `async_unbuffered` é o ajuste padrão em sistemas Windows.

    Executar o servidor MySQL em um disco rígido de setor de 4K no Windows não é suportado com `async_unbuffered`. A solução é usar `innodb_flush_method=normal`.

  - `normal`: O `InnoDB` usa I/O assíncrono simulado e I/O com buffer.

  - `unbuffered`: o `InnoDB` usa I/O assíncrono simulado e I/O não bufferizado.

  Como cada configuração afeta o desempenho depende da configuração do hardware e da carga de trabalho. Faça um benchmark da sua configuração específica para decidir qual configuração usar ou se deve manter a configuração padrão. Examine a variável `Innodb_data_fsyncs` para ver o número total de chamadas `fsync()` para cada configuração. A combinação de operações de leitura e escrita na sua carga de trabalho pode afetar o desempenho de uma configuração. Por exemplo, em um sistema com um controlador RAID de hardware e cache de escrita com suporte a bateria, o `O_DIRECT` pode ajudar a evitar o buffer duplo entre o pool de buffers do `InnoDB` e o cache do sistema de arquivos do sistema operacional. Em alguns sistemas onde os arquivos de dados e log do `InnoDB` estão localizados em um SAN, o valor padrão ou `O_DSYNC` pode ser mais rápido para uma carga de trabalho com muitas instruções `SELECT`. Sempre teste este parâmetro com hardware e carga de trabalho que reflitam seu ambiente de produção. Para obter conselhos gerais sobre o ajuste de I/O, consulte a Seção 8.5.8, “Otimizando o I/O de Disco do InnoDB”.

- `innodb_flush_neighbors`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_option"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-option=options</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_option</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>

  Especifica se o esvaziamento de uma página do pool de buffer do `InnoDB` também esvazia outras páginas sujas da mesma extensão.

  - Um valor de 0 desativa `innodb_flush_neighbors`. Páginas sujas no mesmo intervalo não são descartadas.

  - A configuração padrão de 1 esvazia páginas sujas adjacentes no mesmo intervalo.

  - Uma configuração de 2 varreduras de páginas sujas na mesma extensão.

  Quando os dados da tabela são armazenados em um dispositivo de armazenamento HDD tradicional, o esvaziamento de páginas vizinhas em uma única operação reduz o overhead de I/O (principalmente para operações de busca no disco) em comparação com o esvaziamento de páginas individuais em momentos diferentes. Para dados da tabela armazenados em SSD, o tempo de busca não é um fator significativo e você pode desativar essa configuração para espalhar as operações de escrita. Para informações relacionadas, consulte a Seção 14.8.3.5, “Configurando o esvaziamento do Pool de Buffer”.

- `innodb_flush_sync`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_option"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-option=options</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_option</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>

  A variável `innodb_flush_sync`, que está habilitada por padrão, faz com que o ajuste `innodb_io_capacity` seja ignorado durante os picos de atividade de E/S que ocorrem nos pontos de verificação. Para aderir à taxa de E/S definida pelo ajuste `innodb_io_capacity`, desabilite `innodb_flush_sync`.

  Para obter informações sobre a configuração da variável `innodb_flush_sync`, consulte a Seção 14.8.8, “Configurando a Capacidade de E/S do InnoDB”.

- `innodb_flushing_avg_loops`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_option"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-option=options</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_option</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>

  Número de iterações para as quais o `InnoDB` mantém o instantâneo anteriormente calculado do estado de esvaziamento, controlando a rapidez com que o esvaziamento adaptativo responde às mudanças nas cargas de trabalho. Aumentar o valor faz com que a taxa de operações de esvaziamento mude de forma suave e gradual à medida que a carga de trabalho muda. Diminuir o valor faz com que o esvaziamento adaptativo ajuste-se rapidamente às mudanças na carga de trabalho, o que pode causar picos na atividade de esvaziamento se a carga de trabalho aumentar e diminuir de repente.

  Para informações relacionadas, consulte a Seção 14.8.3.5, “Configurando o esvaziamento do pool de buffers”.

- `innodb_force_load_corrupted`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_option"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-option=options</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_option</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>

  Permite que o `InnoDB` carregue tabelas marcadas como corrompidas durante o início da inicialização. Use apenas durante a solução de problemas, para recuperar dados que, de outra forma, seriam inacessíveis. Quando a solução de problemas estiver concluída, desative essa configuração e reinicie o servidor.

- `innodb_force_recovery`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_option"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-option=options</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_option</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>

  O modo de recuperação de falhas, normalmente alterado apenas em situações graves de solução de problemas. Os valores possíveis variam de 0 a 6. Para saber os significados desses valores e informações importantes sobre `innodb_force_recovery`, consulte a Seção 14.22.2, “Forçando a Recuperação do InnoDB”.

  Aviso

  Estabeleça essa variável apenas com um valor maior que 0 em uma situação de emergência, para que você possa iniciar o `InnoDB` e fazer o dump de suas tabelas. Como medida de segurança, o `InnoDB` impede as operações `INSERT`, `UPDATE` ou `DELETE` quando `innodb_force_recovery` é maior que 0. Um ajuste de `innodb_force_recovery` de 4 ou maior coloca o `InnoDB` no modo de leitura somente.

  Essas restrições podem fazer com que os comandos de administração de replicação falhem com um erro, pois as configurações de replicação, como `relay_log_info_repository=TABLE` e `master_info_repository=TABLE`, armazenam informações em tabelas `InnoDB`.

- `innodb_ft_aux_table`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_option"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-option=options</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_option</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>

  Especifica o nome qualificado de uma tabela `InnoDB` que contém um índice `FULLTEXT`. Esta variável é destinada a fins de diagnóstico e só pode ser definida em tempo de execução. Por exemplo:

  ```sql
  SET GLOBAL innodb_ft_aux_table = 'test/t1';
  ```

  Depois de definir essa variável para um nome no formato `db_name/table_name`, as tabelas do `INFORMATION_SCHEMA` `INNODB_FT_INDEX_TABLE`, `INNODB_FT_INDEX_CACHE`, `INNODB_FT_CONFIG`, `INNODB_FT_DELETED` e `INNODB_FT_BEING_DELETED` mostrarão informações sobre o índice de pesquisa para a tabela especificada.

  Para obter mais informações, consulte a Seção 14.16.4, “Tabelas de Índices FULLTEXT do InnoDB INFORMATION_SCHEMA”.

- `innodb_ft_cache_size`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_r_batch_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-r-batch-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_r_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1073741824</code>]]</td> </tr></tbody></table>

  A memória alocada, em bytes, para o cache do índice de pesquisa `FULLTEXT` do `InnoDB`, que armazena um documento analisado na memória durante a criação de um índice `FULLTEXT` do `InnoDB`. As inserções e atualizações do índice são comprometidas no disco apenas quando o limite de tamanho `innodb_ft_cache_size` é atingido. `innodb_ft_cache_size` define o tamanho do cache por tabela. Para definir um limite global para todas as tabelas, consulte `innodb_ft_total_cache_size`.

  Para obter mais informações, consulte o cache de índice de texto completo do InnoDB.

- `innodb_ft_enable_diag_print`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_r_batch_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-r-batch-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_r_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1073741824</code>]]</td> </tr></tbody></table>

  Se habilitar ou não a saída de diagnóstico de pesquisa de texto completo (FTS) adicional. Esta opção é destinada principalmente ao depuração avançada do FTS e não é de interesse para a maioria dos usuários. A saída é impressa no log de erros e inclui informações como:

  - Progresso da sincronização do índice FTS (quando o limite do cache FTS é atingido). Por exemplo:

    ```sql
    FTS SYNC for table test, deleted count: 100 size: 10000 bytes
    SYNC words: 100
    ```

  - A FTS otimiza o progresso. Por exemplo:

    ```sql
    FTS start optimize test
    FTS_OPTIMIZE: optimize "mysql"
    FTS_OPTIMIZE: processed "mysql"
    ```

  - Progresso da construção do índice FTS. Por exemplo:

    ```sql
    Number of doc processed: 1000
    ```

  - Para consultas do FTS, a árvore de análise da consulta, o peso das palavras, o tempo de processamento da consulta e o uso de memória são impressos. Por exemplo:

    ```sql
    FTS Search Processing time: 1 secs: 100 millisec: row(s) 10000
    Full Search Memory: 245666 (bytes),  Row: 10000
    ```

- `innodb_ft_enable_stopword`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_r_batch_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-r-batch-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_r_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1073741824</code>]]</td> </tr></tbody></table>

  Especifica que um conjunto de palavras-chave é associado a um índice `FULLTEXT` de `InnoDB` no momento em que o índice é criado. Se a opção `innodb_ft_user_stopword_table` for definida, as palavras-chave são retiradas dessa tabela. Caso contrário, se a opção `innodb_ft_server_stopword_table` for definida, as palavras-chave são retiradas dessa tabela. Caso contrário, é usado um conjunto padrão de palavras-chave embutido.

  Para mais informações, consulte a Seção 12.9.4, “Palavras-chave de parada de texto completo”.

- `innodb_ft_max_token_size`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_r_batch_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-r-batch-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_r_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1073741824</code>]]</td> </tr></tbody></table>

  Comprimento máximo de caracteres das palavras armazenadas em um índice `FULLTEXT` do `InnoDB`. Definir um limite para esse valor reduz o tamanho do índice, acelerando assim as consultas, ao omitir palavras longas ou coleções arbitrárias de letras que não são palavras reais e provavelmente não serão termos de pesquisa.

  Para obter mais informações, consulte a Seção 12.9.6, “Ajuste fino da pesquisa de texto completo do MySQL”.

- `innodb_ft_min_token_size`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_r_batch_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-r-batch-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_r_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1073741824</code>]]</td> </tr></tbody></table>

  Comprimento mínimo das palavras armazenadas em um índice `FULLTEXT` do `InnoDB`. Aumentar esse valor reduz o tamanho do índice, acelerando assim as consultas, ao omitir palavras comuns que provavelmente não serão significativas em um contexto de pesquisa, como as palavras em inglês “a” e “to”. Para conteúdo que utiliza um conjunto de caracteres CJK (Chinês, Japonês, Coreano), especifique um valor de 1.

  Para obter mais informações, consulte a Seção 12.9.6, “Ajuste fino da pesquisa de texto completo do MySQL”.

- `innodb_ft_num_word_optimize`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_r_batch_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-r-batch-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_r_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1073741824</code>]]</td> </tr></tbody></table>

  Número de palavras a serem processadas durante cada operação `OPTIMIZE TABLE` em um índice `FULLTEXT` de `InnoDB`. Como uma operação de inserção ou atualização em massa em uma tabela que contém um índice de pesquisa full-text pode exigir uma manutenção substancial do índice para incorporar todas as alterações, você pode executar uma série de declarações `OPTIMIZE TABLE`, cada uma retomando o ponto onde a última deixou.

  Para obter mais informações, consulte a Seção 12.9.6, “Ajuste fino da pesquisa de texto completo do MySQL”.

- `innodb_ft_result_cache_limit`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_r_batch_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-r-batch-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_r_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1073741824</code>]]</td> </tr></tbody></table>

  O limite de cache de resultados de consulta de pesquisa full-text `InnoDB` (definido em bytes) por consulta de pesquisa full-text ou por thread. Os resultados intermediários e finais de consulta de pesquisa full-text `InnoDB` são mantidos na memória. Use `innodb_ft_result_cache_limit` para definir um limite de tamanho para o cache de resultados de consulta de pesquisa full-text para evitar o consumo excessivo de memória em caso de resultados muito grandes de consulta de pesquisa full-text `InnoDB` (milhões ou centenas de milhões de linhas, por exemplo). A memória é alocada conforme necessário quando uma consulta de pesquisa full-text é processada. Se o limite de tamanho do cache de resultados for atingido, um erro é retornado indicando que a consulta excede a memória máxima permitida.

  O valor máximo de `innodb_ft_result_cache_limit` para todos os tipos de plataforma e tamanhos de bits é 2\*\*32-1.

- `innodb_ft_server_stopword_table`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_r_batch_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-r-batch-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_r_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1073741824</code>]]</td> </tr></tbody></table>

  Esta opção é usada para especificar sua própria lista de palavras-chave `FULLTEXT` do `InnoDB` para todas as tabelas `InnoDB`. Para configurar sua própria lista de palavras-chave para uma tabela `InnoDB` específica, use `innodb_ft_user_stopword_table`.

  Defina `innodb_ft_server_stopword_table` para o nome da tabela que contém uma lista de palavras-chave, no formato `db_name/table_name`.

  A tabela de palavras-chave deve existir antes de você configurar `innodb_ft_server_stopword_table`. `innodb_ft_enable_stopword` deve estar habilitado e a opção `innodb_ft_server_stopword_table` deve ser configurada antes de você criar o índice `FULLTEXT`.

  A tabela de palavras-chave deve ser uma tabela `InnoDB`, contendo uma única coluna `VARCHAR` chamada `valor`.

  Para mais informações, consulte a Seção 12.9.4, “Palavras-chave de parada de texto completo”.

- `innodb_ft_sort_pll_degree`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_r_batch_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-r-batch-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_r_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1073741824</code>]]</td> </tr></tbody></table>

  Número de threads usados em paralelo para indexar e tokenizar texto em um índice `FULLTEXT` de `InnoDB` ao criar um índice de pesquisa.

  Para informações relacionadas, consulte a Seção 14.6.2.4, “Índices de Texto Completo InnoDB” e `innodb_sort_buffer_size`.

- `innodb_ft_total_cache_size`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_r_batch_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-r-batch-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_r_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1073741824</code>]]</td> </tr></tbody></table>

  A memória total alocada, em bytes, para o cache do índice de pesquisa full-text `InnoDB` para todas as tabelas. Criar várias tabelas, cada uma com um índice de pesquisa `FULLTEXT`, pode consumir uma parte significativa da memória disponível. `innodb_ft_total_cache_size` define um limite de memória global para todos os índices de pesquisa full-text para ajudar a evitar o consumo excessivo de memória. Se o limite global for atingido por uma operação de índice, uma sincronização forçada é acionada.

  Para obter mais informações, consulte o cache de índice de texto completo do InnoDB.

- `innodb_ft_user_stopword_table`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_w_batch_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-w-batch-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_w_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>

  Esta opção é usada para especificar sua própria lista de palavras-chave `FULLTEXT` do `InnoDB` em uma tabela específica. Para configurar sua própria lista de palavras-chave para todas as tabelas `InnoDB`, use `innodb_ft_server_stopword_table`.

  Defina `innodb_ft_user_stopword_table` para o nome da tabela que contém uma lista de palavras-chave, no formato `db_name/table_name`.

  A tabela de palavras-chave de parada deve existir antes de você configurar `innodb_ft_user_stopword_table`. `innodb_ft_enable_stopword` deve estar habilitado e `innodb_ft_user_stopword_table` deve ser configurado antes de você criar o índice `FULLTEXT`.

  A tabela de palavras-chave deve ser uma tabela `InnoDB`, contendo uma única coluna `VARCHAR` chamada `valor`.

  Para mais informações, consulte a Seção 12.9.4, “Palavras-chave de parada de texto completo”.

- `innodb_io_capacity`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_w_batch_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-w-batch-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_w_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>

  A variável `innodb_io_capacity` define o número de operações de E/S por segundo (IOPS) disponíveis para as tarefas em segundo plano do `InnoDB`, como o esvaziamento de páginas do pool de buffer e a fusão de dados do buffer de alterações.

  Para obter informações sobre a configuração da variável `innodb_io_capacity`, consulte a Seção 14.8.8, “Configurando a Capacidade de E/S do InnoDB”.

- `innodb_io_capacity_max`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_w_batch_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-w-batch-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_w_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>

  Se a atividade de limpeza ficar para trás, o `InnoDB` pode realizar a limpeza de forma mais agressiva, com uma taxa maior de operações de E/S por segundo (IOPS) do que a definida pela variável `innodb_io_capacity`. A variável `innodb_io_capacity_max` define um número máximo de IOPS realizados pelas tarefas de segundo plano do `InnoDB` nessas situações.

  Para obter informações sobre a configuração da variável `innodb_io_capacity_max`, consulte a Seção 14.8.8, “Configurando a Capacidade de E/S do InnoDB”.

- `innodb_large_prefix`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_w_batch_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-w-batch-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_w_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>

  Quando essa opção estiver habilitada, prefixos de chave de índice mais longos que 767 bytes (até 3072 bytes) serão permitidos para tabelas `InnoDB` que utilizam o formato de linha `DINÂMICO` ou `COMPRESSADO`. Consulte a Seção 14.23, “Limites do InnoDB”, para os máximos associados aos prefixos de chave de índice em diferentes configurações.

  Para tabelas que usam o formato de linha `REDUNDANT` ou `COMPACT`, essa opção não afeta o comprimento permitido do prefixo da chave de índice.

  `innodb_large_prefix` está habilitado por padrão no MySQL 5.7. Essa mudança coincide com a alteração do valor padrão para `innodb_file_format`, que é definido como `Barracuda` por padrão no MySQL 5.7. Juntas, essas mudanças de valor padrão permitem que prefixos de chaves de índice maiores sejam criados ao usar o formato de linha `DINÂMICO` ou `COMPRESSADO`. Se qualquer uma dessas opções for definida para um valor não padrão, os prefixos de chaves de índice maiores que 767 bytes são truncados silenciosamente.

  `innodb_large_prefix` está desatualizado; espere que ele seja removido em uma futura versão. `innodb_large_prefix` foi introduzido para desabilitar prefixos de chaves de índice grandes para compatibilidade com versões anteriores do `InnoDB` que não suportam prefixos de chaves de índice grandes.

- `innodb_limit_optimistic_insert_debug`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_w_batch_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-w-batch-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_w_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>

  Limita o número de registros por página de árvore B. Um valor padrão de 0 significa que nenhum limite é imposto. Esta opção só está disponível se o suporte de depuração estiver compilado com a opção `WITH_DEBUG` do **CMake**.

- `innodb_lock_wait_timeout`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_w_batch_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-w-batch-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_w_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>

  O tempo em segundos que uma transação do `InnoDB` espera por um bloqueio de linha antes de desistir. O valor padrão é de 50 segundos. Uma transação que tenta acessar uma linha bloqueada por outra transação do `InnoDB` aguarda, no máximo, esse número de segundos para obter acesso de escrita à linha antes de emitir o seguinte erro:

  ```sql
  ERROR 1205 (HY000): Lock wait timeout exceeded; try restarting transaction
  ```

  Quando ocorre um tempo de espera de bloqueio, a declaração atual é revertida (não a transação inteira). Para reverter toda a transação, inicie o servidor com a opção `--innodb-rollback-on-timeout`. Veja também a Seção 14.22.4, “Tratamento de Erros do InnoDB”.

  Você pode diminuir esse valor para aplicações altamente interativas ou sistemas OLTP, para exibir o feedback do usuário rapidamente ou colocar a atualização em uma fila para processamento mais tarde. Você pode aumentar esse valor para operações de back-end de longa duração, como uma etapa de transformação em um data warehouse que espera que outras grandes operações de inserção ou atualização sejam concluídas.

  `innodb_lock_wait_timeout` aplica-se apenas aos bloqueios de linha do `InnoDB`. Um bloqueio de tabela do MySQL não ocorre dentro do `InnoDB`, e esse tempo de espera não se aplica a espera por bloqueios de tabela.

  O valor de espera de bloqueio não se aplica a deadlocks quando o `innodb_deadlock_detect` está habilitado (o padrão), porque o `InnoDB` detecta deadlocks imediatamente e desfaz uma das transações em deadlock. Quando o `innodb_deadlock_detect` está desabilitado, o `InnoDB` depende do `innodb_lock_wait_timeout` para desfazer a transação em deadlock quando ocorre um deadlock. Veja a Seção 14.7.5.2, “Detecção de Deadlocks”.

  `innodb_lock_wait_timeout` pode ser definido em tempo de execução com a instrução `SET GLOBAL` ou `SET SESSION`. Para alterar a configuração `GLOBAL`, é necessário ter privilégios suficientes para definir variáveis de sistema globais (consulte a Seção 5.1.8.1, “Privilégios de Variáveis de Sistema”) e isso afeta o funcionamento de todos os clientes que se conectam posteriormente. Qualquer cliente pode alterar a configuração `SESSION` para `innodb_lock_wait_timeout`, o que afeta apenas esse cliente.

- `innodb_locks_unsafe_for_binlog`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_w_batch_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-w-batch-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_w_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>

  Essa variável afeta a forma como o `InnoDB` usa o bloqueio de lacuna para pesquisas e varreduras de índices. `innodb_locks_unsafe_for_binlog` está desatualizado; espere que ele seja removido em uma futura versão do MySQL.

  Normalmente, o `InnoDB` usa um algoritmo chamado bloqueio de próxima chave que combina o bloqueio de linha de índice com o bloqueio de lacuna. O `InnoDB` realiza o bloqueio de nível de linha de forma que, ao pesquisar ou percorrer um índice de tabela, ele define bloqueios compartilhados ou exclusivos nos registros do índice que encontra. Assim, os bloqueios de nível de linha são, na verdade, bloqueios de registro de índice. Além disso, um bloqueio de próxima chave em um registro de índice também afeta a lacuna antes do registro de índice. Ou seja, um bloqueio de próxima chave é um bloqueio de registro de índice mais um bloqueio de lacuna na lacuna que precede o registro de índice. Se uma sessão tiver um bloqueio compartilhado ou exclusivo no registro `R` em um índice, outra sessão não pode inserir um novo registro de índice na lacuna imediatamente antes de `R` na ordem do índice. Veja a Seção 14.7.1, “Bloqueio InnoDB”.

  Por padrão, o valor de `innodb_locks_unsafe_for_binlog` é 0 (desativado), o que significa que o bloqueio de lacuna está habilitado: o `InnoDB` usa bloqueios de próximo-chave para pesquisas e varreduras de índice. Para habilitar a variável, defina-a para 1. Isso faz com que o bloqueio de lacuna seja desativado: o `InnoDB` usa apenas bloqueios de registro de índice para pesquisas e varreduras de índice.

  Ativação de `innodb_locks_unsafe_for_binlog` não desativa o uso de bloqueio de lacuna para verificação de restrições de chave estrangeira ou verificação de chaves duplicadas.

  Os efeitos de habilitar `innodb_locks_unsafe_for_binlog` são os mesmos de definir o nível de isolamento de transação para `READ COMMITTED`, com essas exceções:

  - Ativar `innodb_locks_unsafe_for_binlog` é um ajuste global e afeta todas as sessões, enquanto o nível de isolamento pode ser definido globalmente para todas as sessões ou individualmente por sessão.

  - `innodb_locks_unsafe_for_binlog` pode ser definido apenas no início do servidor, enquanto o nível de isolamento pode ser definido no início ou alterado durante a execução.

  Portanto, `READ COMMITTED` oferece um controle mais fino e flexível do que `innodb_locks_unsafe_for_binlog`. Para obter mais informações sobre o efeito do nível de isolamento no bloqueio de lacuna, consulte a Seção 14.7.2.1, “Níveis de Isolamento de Transações”.

  Ativação de `innodb_locks_unsafe_for_binlog` pode causar problemas fantasmários, pois outras sessões podem inserir novas linhas nos espaços vazios quando o bloqueio de gaps está desativado. Suponha que haja um índice na coluna `id` da tabela `child` e que você queira ler e bloquear todas as linhas da tabela com um valor de identificador maior que 100, com a intenção de atualizar alguma coluna nas linhas selecionadas mais tarde:

  ```sql
  SELECT * FROM child WHERE id > 100 FOR UPDATE;
  ```

  A consulta examina o índice a partir do primeiro registro em que o `id` é maior que 100. Se as blocações definidas nos registros do índice nessa faixa não bloqueiam inserções feitas nos intervalos, outra sessão pode inserir uma nova linha na tabela. Portanto, se você executar novamente a mesma consulta dentro da mesma transação, verá uma nova linha no conjunto de resultados retornado pela consulta. Isso também significa que, se novos itens forem adicionados ao banco de dados, o `InnoDB` não garante serializabilidade. Portanto, se `innodb_locks_unsafe_for_binlog` estiver habilitado, o `InnoDB` garante, no máximo, um nível de isolamento de `LEIA COM PROMESSA`. (A serializabilidade de conflitos ainda é garantida.) Para mais informações sobre fantasmas, consulte a Seção 14.7.4, “Linhas Fantasmas”.

  Ativação de `innodb_locks_unsafe_for_binlog` tem efeitos adicionais:

  - Para as instruções `UPDATE` ou `DELETE`, o `InnoDB` mantém travamentos apenas para as linhas que ele atualiza ou exclui. Os travamentos de registro para linhas não correspondentes são liberados após o MySQL ter avaliado a condição `WHERE`. Isso reduz significativamente a probabilidade de deadlocks, mas ainda podem ocorrer.

  - Para as instruções `UPDATE`, se uma linha já estiver bloqueada, o `InnoDB` realiza uma leitura "semi-consistente", retornando a versão mais recente comprometida ao MySQL para que o MySQL possa determinar se a linha corresponde à condição `WHERE` da `UPDATE`. Se a linha corresponder (deve ser atualizada), o MySQL lê a linha novamente e, desta vez, o `InnoDB` a bloqueia ou aguarda por um bloqueio nela.

  Considere o exemplo a seguir, começando com esta tabela:

  ```sql
  CREATE TABLE t (a INT NOT NULL, b INT) ENGINE = InnoDB;
  INSERT INTO t VALUES (1,2),(2,3),(3,2),(4,3),(5,2);
  COMMIT;
  ```

  Neste caso, a tabela não tem índices, portanto, as pesquisas e varreduras de índice usam o índice agrupado oculto para o bloqueio de registros (consulte a Seção 14.6.2.1, “Indizes Agrupados e Secundários”).

  Suponha que um cliente execute uma `UPDATE` usando essas instruções:

  ```sql
  SET autocommit = 0;
  UPDATE t SET b = 5 WHERE b = 3;
  ```

  Suponha também que um segundo cliente execute uma `UPDATE` executando essas instruções após as instruções do primeiro cliente:

  ```sql
  SET autocommit = 0;
  UPDATE t SET b = 4 WHERE b = 2;
  ```

  À medida que o `InnoDB` executa cada `UPDATE`, ele primeiro adquire um bloqueio exclusivo para cada linha e, em seguida, determina se deve modificá-la. Se o `InnoDB` não modificar a linha e `innodb_locks_unsafe_for_binlog` estiver habilitado, ele libera o bloqueio. Caso contrário, o `InnoDB` retém o bloqueio até o final da transação. Isso afeta o processamento da transação da seguinte forma.

  Se `innodb_locks_unsafe_for_binlog` estiver desativado, o primeiro `UPDATE` adquire x-locks e não libera nenhum deles:

  ```sql
  x-lock(1,2); retain x-lock
  x-lock(2,3); update(2,3) to (2,5); retain x-lock
  x-lock(3,2); retain x-lock
  x-lock(4,3); update(4,3) to (4,5); retain x-lock
  x-lock(5,2); retain x-lock
  ```

  O segundo `UPDATE` bloqueia assim que tenta adquirir quaisquer bloqueios (porque o primeiro `UPDATE` reteriu bloqueios em todas as linhas) e não prossegue até que o primeiro `UPDATE` commit ou rollback:

  ```sql
  x-lock(1,2); block and wait for first UPDATE to commit or roll back
  ```

  Se `innodb_locks_unsafe_for_binlog` estiver habilitado, o primeiro `UPDATE` adquire x-locks e libera esses locks para as linhas que ele não modifica:

  ```sql
  x-lock(1,2); unlock(1,2)
  x-lock(2,3); update(2,3) to (2,5); retain x-lock
  x-lock(3,2); unlock(3,2)
  x-lock(4,3); update(4,3) to (4,5); retain x-lock
  x-lock(5,2); unlock(5,2)
  ```

  Para a segunda `UPDATE`, o `InnoDB` realiza uma leitura "semi-consistente", retornando a versão mais recente comprometida de cada linha para o MySQL, para que o MySQL possa determinar se a linha corresponde à condição `WHERE` da `UPDATE`:

  ```sql
  x-lock(1,2); update(1,2) to (1,4); retain x-lock
  x-lock(2,3); unlock(2,3)
  x-lock(3,2); update(3,2) to (3,4); retain x-lock
  x-lock(4,3); unlock(4,3)
  x-lock(5,2); update(5,2) to (5,4); retain x-lock
  ```

- `innodb_log_buffer_size`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_w_batch_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-w-batch-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_w_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>

  O tamanho em bytes do buffer que o `InnoDB` usa para gravar nos arquivos de log no disco. O valor padrão mudou de 8 MB para 16 MB com a introdução dos valores `innodb_page_size` de 32 KB e 64 KB. Um buffer de log grande permite que transações grandes sejam executadas sem a necessidade de gravar o log no disco antes do commit das transações. Portanto, se você tiver transações que atualizam, inserem ou excluem muitas linhas, aumentar o tamanho do buffer de log economiza o I/O do disco. Para informações relacionadas, consulte Configuração de Memória e Seção 8.5.4, “Otimizando o Registro de Redo do InnoDB”. Para conselhos gerais sobre o ajuste de I/O, consulte Seção 8.5.8, “Otimizando o I/O do Disco do InnoDB”.

- `innodb_log_checkpoint_now`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_w_batch_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-w-batch-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_w_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>

  Ative esta opção de depuração para forçar o `InnoDB` a escrever um ponto de verificação. Esta opção só está disponível se o suporte de depuração estiver compilado com a opção `WITH_DEBUG` do **CMake**.

- `innodb_log_checksums`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_w_batch_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-w-batch-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_w_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>

  Habilita ou desabilita verificações de checksums para páginas do log de reverso.

  `innodb_log_checksums=ON` habilita o algoritmo de verificação de checksum `CRC-32C` para as páginas do log de refazer. Quando `innodb_log_checksums` está desativado, o conteúdo do campo de verificação de checksum da página do log de refazer é ignorado.

  Os checksums nas páginas do cabeçalho do log de refazer e nas páginas de verificação de ponto de controle do log de refazer nunca são desativados.

- `innodb_log_compressed_pages`

  <table frame="box" rules="all" summary="Propriedades para ignore_builtin_innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ignore-builtin-innodb[={OFF|ON}]</code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ignore_builtin_innodb</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr></tbody></table>

  Especifica se as imagens das páginas recompressas são escritas no log de refazer. A recompressão pode ocorrer quando alterações são feitas nos dados comprimidos.

  `innodb_log_compressed_pages` está habilitado por padrão para evitar a corrupção que poderia ocorrer se uma versão diferente do algoritmo de compressão `zlib` fosse usada durante a recuperação. Se você tem certeza de que a versão do `zlib` não está sujeita a alterações, pode desabilitar `innodb_log_compressed_pages` para reduzir a geração de log de redo para cargas de trabalho que modificam dados comprimidos.

  Para medir o efeito de habilitar ou desabilitar `innodb_log_compressed_pages`, compare a geração de log de redo para ambas as configurações sob a mesma carga de trabalho. As opções para medir a geração de log de redo incluem observar o `Número de sequência do log` (LSN) na seção `LOG` do resultado do comando `SHOW ENGINE INNODB STATUS`, ou monitorar o status `Innodb_os_log_written` para o número de bytes escritos nos arquivos de log de redo.

  Para informações relacionadas, consulte a Seção 14.9.1.6, “Compressão para cargas de trabalho OLTP”.

- `innodb_log_file_size`

  <table frame="box" rules="all" summary="Propriedades para ignore_builtin_innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ignore-builtin-innodb[={OFF|ON}]</code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ignore_builtin_innodb</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr></tbody></table>

  O tamanho em bytes de cada arquivo de registro em um grupo de registros. O tamanho combinado dos arquivos de registro (`innodb_log_file_size` \* `innodb_log_files_in_group`) não pode exceder um valor máximo ligeiramente inferior a 512 GB. Um par de arquivos de registro de 255 GB, por exemplo, se aproxima do limite, mas não o ultrapassa. O valor padrão é de 48 MB.

  Geralmente, o tamanho combinado dos arquivos de registro deve ser grande o suficiente para que o servidor possa suavizar picos e vales na atividade da carga de trabalho, o que muitas vezes significa que há espaço suficiente no pool de log redo para lidar com mais de uma hora de atividade de escrita. Quanto maior o valor, menor será a atividade de esvaziamento do checkpoint no pool de buffer, economizando I/O no disco. Arquivos de registro maiores também tornam a recuperação após falhas mais lenta.

  O valor mínimo de `innodb_log_file_size` foi aumentado de 1 MB para 4 MB no MySQL 5.7.11.

  Para informações relacionadas, consulte Configuração do arquivo de registro Redo. Para conselhos gerais sobre o ajuste de E/S, consulte a Seção 8.5.8, “Otimização do E/S do disco InnoDB”.

- `innodb_log_files_in_group`

  <table frame="box" rules="all" summary="Propriedades para ignore_builtin_innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ignore-builtin-innodb[={OFF|ON}]</code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ignore_builtin_innodb</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr></tbody></table>

  O número de arquivos de registro na grupo de registro. O `InnoDB` escreve nos arquivos de forma circular. O valor padrão (e recomendado) é 2. A localização dos arquivos é especificada por `innodb_log_group_home_dir`. O tamanho combinado dos arquivos de registro (`innodb_log_file_size` \* `innodb_log_files_in_group`) pode chegar a 512 GB.

  Para obter informações relacionadas, consulte Configuração do arquivo de registro Redo.

- `innodb_log_group_home_dir`

  <table frame="box" rules="all" summary="Propriedades para ignore_builtin_innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ignore-builtin-innodb[={OFF|ON}]</code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ignore_builtin_innodb</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr></tbody></table>

  O caminho do diretório para os arquivos de log de reverso do `InnoDB`, cujo número é especificado por `innodb_log_files_in_group`. Se você não especificar nenhuma variável de log do `InnoDB`, o padrão é criar dois arquivos chamados `ib_logfile0` e `ib_logfile1` no diretório de dados do MySQL. O tamanho do arquivo de log é fornecido pela variável de sistema `innodb_log_file_size`.

  Para obter informações relacionadas, consulte Configuração do arquivo de registro Redo.

- `innodb_log_write_ahead_size`

  <table frame="box" rules="all" summary="Propriedades para ignore_builtin_innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ignore-builtin-innodb[={OFF|ON}]</code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ignore_builtin_innodb</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr></tbody></table>

  Define o tamanho do bloco de pré-gravação para o log de refazer, em bytes. Para evitar o "leitura durante a gravação", defina `innodb_log_write_ahead_size` para corresponder ao tamanho do bloco de cache do sistema operacional ou do sistema de arquivos. O ajuste padrão é de 8192 bytes. A leitura durante a gravação ocorre quando os blocos do log de refazer não são completamente armazenados no cache do sistema operacional ou do sistema de arquivos devido a uma incompatibilidade entre o tamanho do bloco de pré-gravação do log de refazer e o tamanho do bloco de cache do sistema operacional ou do sistema de arquivos.

  Os valores válidos para `innodb_log_write_ahead_size` são múltiplos do tamanho do bloco do arquivo de log do `InnoDB` (2n). O valor mínimo é o tamanho do bloco do arquivo de log do `InnoDB` (512). A escrita antecipada não ocorre quando o valor mínimo é especificado. O valor máximo é igual ao valor de `innodb_page_size`. Se você especificar um valor para `innodb_log_write_ahead_size` que é maior que o valor de `innodb_page_size`, o ajuste `innodb_log_write_ahead_size` é truncado para o valor de `innodb_page_size`.

  Definir o valor de `innodb_log_write_ahead_size` muito baixo em relação ao tamanho do bloco de cache do sistema operacional ou do sistema de arquivos resulta em "leitura durante a escrita". Definir o valor muito alto pode ter um pequeno impacto no desempenho do `fsync` para gravações de arquivos de log devido ao fato de vários blocos serem escritos de uma só vez.

  Para informações relacionadas, consulte a Seção 8.5.4, “Otimização do Registro de Redo do InnoDB”.

- `innodb_lru_scan_depth`

  <table frame="box" rules="all" summary="Propriedades para ignore_builtin_innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ignore-builtin-innodb[={OFF|ON}]</code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ignore_builtin_innodb</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr></tbody></table>

  Um parâmetro que influencia os algoritmos e heurísticas para a operação de limpeza do pool de buffers do `InnoDB`. Principalmente de interesse para especialistas em desempenho que ajustam cargas de trabalho intensivas em I/O. Ele especifica, por instância do pool de buffers, até que ponto o thread de limpeza de páginas do pool de buffers examina a lista de páginas LRU em busca de páginas sujas para serem limpas. Esta é uma operação em segundo plano realizada uma vez por segundo.

  Um valor menor que o padrão é geralmente adequado para a maioria das cargas de trabalho. Um valor muito maior do que o necessário pode afetar o desempenho. Considere apenas aumentar o valor se você tiver capacidade de E/S adicional sob uma carga de trabalho típica. Por outro lado, se uma carga de trabalho intensiva em escrita saturar sua capacidade de E/S, diminua o valor, especialmente no caso de um grande pool de buffers.

  Ao ajustar `innodb_lru_scan_depth`, comece com um valor baixo e configure o ajuste para cima, com o objetivo de raramente ver páginas livres iguais a zero. Além disso, considere ajustar `innodb_lru_scan_depth` ao alterar o número de instâncias do pool de buffers, pois `innodb_lru_scan_depth` \* `innodb_buffer_pool_instances` define a quantidade de trabalho realizada pelo fio de limpeza de páginas a cada segundo.

  Para informações relacionadas, consulte a Seção 14.8.3.5, “Configurando o Limpeza do Pool de Armazenamento de Buffer”. Para conselhos gerais sobre o ajuste de E/S, consulte a Seção 8.5.8, “Otimizando o E/S de Disco do InnoDB”.

- `innodb_max_dirty_pages_pct`

  <table frame="box" rules="all" summary="Propriedades para ignore_builtin_innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ignore-builtin-innodb[={OFF|ON}]</code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ignore_builtin_innodb</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr></tbody></table>

  O `InnoDB` tenta esvaziar os dados do pool de buffer para que a porcentagem de páginas sujas não exceda esse valor. O valor padrão é 75.

  O ajuste `innodb_max_dirty_pages_pct` estabelece um alvo para o esvaziamento de atividades. Ele não afeta a taxa de esvaziamento. Para obter informações sobre como gerenciar a taxa de esvaziamento, consulte a Seção 14.8.3.5, “Configurando o esvaziamento do Pool de Buffer”.

  Para informações relacionadas, consulte a Seção 14.8.3.5, “Configurando o Limpeza do Pool de Armazenamento de Buffer”. Para conselhos gerais sobre o ajuste de E/S, consulte a Seção 8.5.8, “Otimizando o E/S de Disco do InnoDB”.

- `innodb_max_dirty_pages_pct_lwm`

  <table frame="box" rules="all" summary="Propriedades para ignore_builtin_innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ignore-builtin-innodb[={OFF|ON}]</code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ignore_builtin_innodb</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr></tbody></table>

  Define uma marca de água baixa que representa a porcentagem de páginas sujas para a qual o pré-lavagem é habilitado para controlar a proporção de páginas sujas. O valor padrão de 0 desabilita o comportamento de pré-lavagem completamente. O valor configurado deve sempre ser menor que o valor de `innodb_max_dirty_pages_pct`. Para mais informações, consulte a Seção 14.8.3.5, “Configurando a Lavagem do Pool de Buffer”.

- `innodb_max_purge_lag`

  <table frame="box" rules="all" summary="Propriedades para ignore_builtin_innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ignore-builtin-innodb[={OFF|ON}]</code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ignore_builtin_innodb</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr></tbody></table>

  Define o atraso máximo desejado para a purga. Se esse valor for excedido, uma demora é imposta nas operações `INSERT`, `UPDATE` e `DELETE` para permitir que a purga alcance o ritmo desejado. O valor padrão é 0, o que significa que não há atraso máximo para a purga e nenhuma demora.

  Para obter mais informações, consulte a Seção 14.8.10, “Configuração de Limpeza”.

- `innodb_max_purge_lag_delay`

  <table frame="box" rules="all" summary="Propriedades para ignore_builtin_innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ignore-builtin-innodb[={OFF|ON}]</code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ignore_builtin_innodb</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr></tbody></table>

  Especifica o atraso máximo em microsegundos para o atraso imposto quando o limite `innodb_max_purge_lag` é excedido. O valor especificado `innodb_max_purge_lag_delay` é um limite superior para o período de atraso calculado pela fórmula `innodb_max_purge_lag`.

  Para obter mais informações, consulte a Seção 14.8.10, “Configuração de Limpeza”.

- `innodb_max_undo_log_size`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Define um tamanho limite para os espaços de tabelas de reversão. Se um espaço de tabelas de reversão exceder esse limite, ele pode ser marcado para truncação quando o `innodb_undo_log_truncate` estiver habilitado. O valor padrão é de 1073741824 bytes (1024 MiB).

  Para obter mais informações, consulte "Truncando espaços de tabelas Undo".

- `innodb_merge_threshold_set_all_debug`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Define um valor percentual para páginas inteiras de páginas de índice que substitui o ajuste atual de `MERGE_THRESHOLD` para todos os índices que estão atualmente no cache do dicionário. Esta opção só está disponível se o suporte de depuração estiver compilado com a opção `WITH_DEBUG` do **CMake**. Para informações relacionadas, consulte a Seção 14.8.12, “Configurando o Limite de Fusão para Páginas de Índice”.

- `innodb_monitor_disable`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Essa variável atua como um interruptor, desabilitando os contadores de métricas do `InnoDB`. Os dados dos contadores podem ser consultados usando a tabela do esquema de informações `INNODB_METRICS`. Para informações de uso, consulte a Seção 14.16.6, “Tabela de Métricas do esquema de informações InnoDB”.

  `innodb_monitor_disable='latch'` desativa a coleta de estatísticas para `SHOW ENGINE INNODB MUTEX`. Para mais informações, consulte a Seção 13.7.5.15, "Instrução SHOW ENGINE".

- `innodb_monitor_enable`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Essa variável atua como um interruptor, permitindo que os contadores de métricas do `InnoDB` sejam ativados. Os dados dos contadores podem ser consultados usando a tabela do esquema de informações `INNODB_METRICS`. Para informações sobre o uso, consulte a Seção 14.16.6, “Tabela de Métricas do esquema de informações InnoDB”.

  `innodb_monitor_enable='latch'` habilita a coleta de estatísticas para `SHOW ENGINE INNODB MUTEX`. Para mais informações, consulte a Seção 13.7.5.15, "Instrução SHOW ENGINE".

- `innodb_monitor_reset`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Essa variável atua como um interruptor, redefinindo o valor de contagem dos contadores de métricas do `InnoDB` para zero. Os dados dos contadores podem ser consultados usando a tabela do esquema de informações `INNODB_METRICS`. Para informações de uso, consulte a Seção 14.16.6, “Tabela de Métricas do InnoDB INFORMATION_SCHEMA”.

  `innodb_monitor_reset='latch'` redefiniu as estatísticas relatadas por `SHOW ENGINE INNODB MUTEX`. Para mais informações, consulte a Seção 13.7.5.15, "Instrução SHOW ENGINE".

- `innodb_monitor_reset_all`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Essa variável atua como um interruptor, redefinindo todos os valores (mínimo, máximo, etc.) dos contadores de métricas do `InnoDB`. Os dados dos contadores podem ser consultados usando a tabela do esquema de informações `INNODB_METRICS`. Para informações de uso, consulte a Seção 14.16.6, “Tabela de Métricas do InnoDB INFORMATION_SCHEMA”.

- `innodb_numa_interleave`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Habilita a política de interligação de memória NUMA para a alocação do pool de buffers do **InnoDB**. Quando o `innodb_numa_interleave` é habilitado, a política de memória NUMA é definida como `MPOL_INTERLEAVE` para o processo **mysqld**. Após a alocação do pool de buffers do **InnoDB**, a política de memória NUMA é definida de volta para `MPOL_DEFAULT`. Para que a opção `innodb_numa_interleave` esteja disponível, o MySQL deve ser compilado em um sistema Linux habilitado para NUMA.

  A partir do MySQL 5.7.17, o **CMake** define o valor padrão `WITH_NUMA` com base no suporte `NUMA` da plataforma atual. Para mais informações, consulte a Seção 2.8.7, “Opções de Configuração de Código-Fonte do MySQL”.

- `innodb_old_blocks_pct`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Especifica a porcentagem aproximada do pool de buffers do `InnoDB` usado para a sublista de blocos antigos. A faixa de valores é de 5 a 95. O valor padrão é 37 (ou seja, 3/8 do pool). Frequentemente usado em combinação com `innodb_old_blocks_time`.

  Para obter mais informações, consulte a Seção 14.8.3.3, “Tornando o Scan do Pool de Armazenamento de Buffer Resistente”. Para informações sobre a gestão do pool de armazenamento de buffer, o algoritmo LRU e as políticas de remoção, consulte a Seção 14.5.1, “Pool de Armazenamento de Buffer”.

- `innodb_old_blocks_time`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Valores não nulos protegem o pool de buffers de serem preenchidos com dados que são referenciados apenas por um curto período, como durante uma varredura completa da tabela. Aumentar esse valor oferece mais proteção contra varreduras completas da tabela que interfiram com os dados armazenados no pool de buffers.

  Especifica por quantos milissegundos um bloco inserido na antiga sublista deve permanecer lá após seu primeiro acesso antes de poder ser movido para a nova sublista. Se o valor for 0, um bloco inserido na antiga sublista se move imediatamente para a nova sublista na primeira vez que é acessado, independentemente de quanto tempo após a inserção o acesso ocorrer. Se o valor for maior que 0, os blocos permanecem na antiga sublista até que um acesso ocorra, pelo menos, tantos milissegundos após o primeiro acesso. Por exemplo, um valor de 1000 faz com que os blocos permaneçam na antiga sublista por 1 segundo após o primeiro acesso antes de se tornarem elegíveis para serem movidos para a nova sublista.

  O valor padrão é 1000.

  Essa variável é frequentemente usada em combinação com `innodb_old_blocks_pct`. Para mais informações, consulte a Seção 14.8.3.3, “Tornando o Scan do Pool de Buffer Resistente”. Para informações sobre a gestão do pool de buffer, o algoritmo LRU e as políticas de despejo, consulte a Seção 14.5.1, “Pool de Buffer”.

- `innodb_online_alter_log_max_size`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Especifica um limite superior em bytes para o tamanho dos arquivos de registro temporários usados durante operações DDL online para tabelas `InnoDB`. Há um arquivo de registro para cada índice sendo criado ou tabela sendo alterada. Esse arquivo de registro armazena os dados inseridos, atualizados ou excluídos na tabela durante a operação DDL. O arquivo de registro temporário é estendido conforme necessário pelo valor de `innodb_sort_buffer_size`, até o máximo especificado por `innodb_online_alter_log_max_size`. Se um arquivo de registro temporário exceder o limite de tamanho superior, a operação `ALTER TABLE` falha e todas as operações DML concorrentes não confirmadas são revertidas. Assim, um valor grande para essa opção permite que mais DML ocorram durante uma operação DDL online, mas também estende o período de tempo no final da operação DDL quando a tabela é bloqueada para aplicar os dados do log.

- `innodb_open_files`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Especifica o número máximo de arquivos que o `InnoDB` pode ter abertos de uma só vez. O valor mínimo é 10. Se `innodb_file_per_table` estiver desativado, o valor padrão é 300; caso contrário, o valor padrão é 300 ou o ajuste `table_open_cache`, dependendo do que for maior.

- `innodb_optimize_fulltext_only`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Altera a forma como o comando `OPTIMIZE TABLE` opera em tabelas `InnoDB`. É destinado a ser ativado temporariamente durante operações de manutenção para tabelas `InnoDB` com índices `FULLTEXT`.

  Por padrão, `OPTIMIZE TABLE` reorganiza os dados no índice agrupado da tabela. Quando essa opção está habilitada, `OPTIMIZE TABLE` ignora a reorganização dos dados da tabela e, em vez disso, processa os dados de token recém-adicionados, excluídos e atualizados para os índices `FULLTEXT` do `InnoDB`. Para mais informações, consulte Otimização de índices de texto completo do InnoDB.

- `innodb_page_cleaners`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  O número de threads de limpeza de páginas que limpam páginas sujas das instâncias do pool de buffers. Os threads de limpeza de páginas realizam a listagem de limpeza e a limpeza LRU. Um único thread de limpeza de páginas foi introduzido no MySQL 5.6 para desviar o trabalho de limpeza do pool de buffers do fio mestre do `InnoDB`. No MySQL 5.7, o `InnoDB` oferece suporte para múltiplos threads de limpeza de páginas. Um valor de 1 mantém a configuração anterior ao MySQL 5.7, na qual há um único thread de limpeza de páginas. Quando há múltiplos threads de limpeza de páginas, as tarefas de limpeza do pool de buffers para cada instância do pool de buffers são enviadas para threads de limpeza de páginas ociosos. O valor padrão `innodb_page_cleaners` foi alterado de 1 para 4 no MySQL 5.7. Se o número de threads de limpeza de páginas exceder o número de instâncias do pool de buffers, o `innodb_page_cleaners` é automaticamente definido para o mesmo valor que o `innodb_buffer_pool_instances`.

  Se sua carga de trabalho estiver ligada à escrita de I/O ao descartar páginas sujas das instâncias do pool de buffers para os arquivos de dados, e se o hardware do seu sistema tiver capacidade disponível, aumentar o número de threads do limpador de páginas pode ajudar a melhorar o desempenho da escrita de I/O.

  O suporte para limpeza de páginas multithread foi estendido para as fases de desligamento e recuperação no MySQL 5.7.

  A chamada de sistema `setpriority()` é usada em plataformas Linux onde é suportada e onde o usuário de execução **mysqld** está autorizado a dar prioridade às threads `page_cleaner` em relação a outras threads do MySQL e do `InnoDB`, para ajudar a limpeza de páginas a acompanhar a carga de trabalho atual. O suporte à `setpriority()` é indicado por esta mensagem de inicialização do `InnoDB`:

  ```sql
  [Note] InnoDB: If the mysqld execution user is authorized, page cleaner
  thread priority can be changed. See the man page of setpriority().
  ```

  Para sistemas onde o início e o término do servidor não são gerenciados pelo systemd, a autorização de execução do **mysqld** pode ser configurada em `/etc/security/limits.conf`. Por exemplo, se o **mysqld** for executado com o usuário `mysql`, você pode autorizar o usuário `mysql` adicionando essas linhas em `/etc/security/limits.conf`:

  ```sql
  mysql              hard    nice       -20
  mysql              soft    nice       -20
  ```

  Para sistemas gerenciados pelo systemd, o mesmo pode ser alcançado especificando `LimitNICE=-20` em um arquivo de configuração localizado do systemd. Por exemplo, crie um arquivo chamado `override.conf` em `/etc/systemd/system/mysqld.service.d/override.conf` e adicione esta entrada:

  ```sql
  [Service]
  LimitNICE=-20
  ```

  Depois de criar ou alterar o `override.conf`, recarregue a configuração do systemd e, em seguida, peça ao systemd para reiniciar o serviço MySQL:

  ```sql
  systemctl daemon-reload
  systemctl restart mysqld  # RPM platforms
  systemctl restart mysql   # Debian platforms
  ```

  Para obter mais informações sobre como usar um arquivo de configuração do systemd localizado, consulte Configurando o systemd para MySQL.

  Após autorizar o usuário de execução do **mysqld**, use o comando **cat** para verificar os limites de **Nice** configurados para o processo **mysqld**:

  ```sql
  $> cat /proc/mysqld_pid/limits | grep nice
  Max nice priority         18446744073709551596 18446744073709551596
  ```

- `innodb_page_size`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Especifica o tamanho da página para os espaços de tabelas `InnoDB`. Os valores podem ser especificados em bytes ou kilobytes. Por exemplo, um valor de tamanho de página de 16 kilobytes pode ser especificado como 16384, 16KB ou 16k.

  `innodb_page_size` só pode ser configurado antes de inicializar a instância do MySQL e não pode ser alterado depois. Se nenhum valor for especificado, a instância é inicializada usando o tamanho de página padrão. Veja a Seção 14.8.1, “Configuração de Inicialização do InnoDB”.

  O suporte para tamanhos de página de 32 KB e 64 KB foi adicionado no MySQL 5.7. Para ambos os tamanhos de página de 32 KB e 64 KB, o comprimento máximo da linha é de aproximadamente 16.000 bytes. `ROW_FORMAT=COMPRESSED` não é suportado quando `innodb_page_size` está definido para 32 KB ou 64 KB. Para `innodb_page_size=32k`, o tamanho do intervalo é de 2 MB. Para `innodb_page_size=64 KB`, o tamanho do intervalo é de 4 MB. `innodb_log_buffer_size` deve ser definido para pelo menos 16 M (o padrão) ao usar tamanhos de página de 32 KB ou 64 KB.

  O tamanho padrão de página de 16 KB ou maior é apropriado para uma ampla gama de cargas de trabalho, especialmente para consultas que envolvem varreduras de tabelas e operações de manipulação de dados de massa (DML) que envolvem atualizações em massa. Tamanhos de página menores podem ser mais eficientes para cargas de trabalho OLTP que envolvem muitos escritos pequenos, onde a concorrência pode ser um problema quando páginas únicas contêm muitas linhas. Páginas menores também podem ser eficientes com dispositivos de armazenamento SSD, que geralmente usam tamanhos de bloco pequenos. Manter o tamanho de página do `InnoDB` próximo ao tamanho do bloco do dispositivo de armazenamento minimiza a quantidade de dados não alterados que são reescritos no disco.

  O tamanho mínimo do arquivo para o primeiro arquivo de dados do espaço de tabela do sistema (`ibdata1`) difere dependendo do valor de `innodb_page_size`. Consulte a descrição da opção `innodb_data_file_path` para obter mais informações.

  Uma instância do MySQL que utiliza um tamanho de página `InnoDB` específico não pode usar arquivos de dados ou arquivos de log de uma instância que utiliza um tamanho de página diferente.

  Para obter conselhos gerais sobre o ajuste de E/S, consulte a Seção 8.5.8, “Otimização do E/S do disco InnoDB”.

- `innodb_print_all_deadlocks`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Quando essa opção está habilitada, as informações sobre todos os bloqueios em transações de usuários do `InnoDB` são registradas no log de erro do `mysqld`. Caso contrário, você verá informações apenas sobre o último bloqueio, usando o comando `SHOW ENGINE INNODB STATUS`. Um bloqueio ocasional no `InnoDB` não é necessariamente um problema, porque o `InnoDB` detecta a condição imediatamente e desfaz uma das transações automaticamente. Você pode usar essa opção para solucionar o motivo pelo qual os bloqueios estão ocorrendo se uma aplicação não tiver a lógica apropriada de tratamento de erros para detectar o desfazimento e tentar novamente sua operação. Um grande número de bloqueios pode indicar a necessidade de reestruturar transações que emitem declarações DML ou `SELECT ... FOR UPDATE` para múltiplas tabelas, para que cada transação acesse as tabelas na mesma ordem, evitando assim a condição de bloqueio.

  Para informações relacionadas, consulte a Seção 14.7.5, "Bloqueios em InnoDB".

- `innodb_purge_batch_size`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Define o número de páginas do log de desfazer que são limpas e processadas em um único lote da lista de histórico. Em uma configuração de limpeza multissulíngula, o fio de limpeza do coordenador divide `innodb_purge_batch_size` por `innodb_purge_threads` e atribui esse número de páginas a cada fio de limpeza. A variável `innodb_purge_batch_size` também define o número de páginas do log de desfazer que são liberadas após cada 128 iterações pelos logs de desfazer.

  A opção `innodb_purge_batch_size` é destinada a ajustes avançados de desempenho em combinação com a configuração `innodb_purge_threads`. A maioria dos usuários não precisa alterar `innodb_purge_batch_size` do seu valor padrão.

  Para informações relacionadas, consulte a Seção 14.8.10, “Configuração de Limpeza”.

- `innodb_purge_threads`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  O número de threads de plano de fundo dedicados à operação de purga do `InnoDB`. Aumentar o valor cria threads de purga adicionais, o que pode melhorar a eficiência em sistemas onde operações de DML são realizadas em várias tabelas.

  Para informações relacionadas, consulte a Seção 14.8.10, “Configuração de Limpeza”.

- `innodb_purge_rseg_truncate_frequency`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Define a frequência com que o sistema de purga libera segmentos de rollback em termos do número de vezes que a purga é invocada. Um espaço de tabela de desfazer não pode ser truncado até que seus segmentos de rollback sejam liberados. Normalmente, o sistema de purga libera segmentos de rollback uma vez a cada 128 vezes que a purga é invocada. O valor padrão é 128. Reduzir esse valor aumenta a frequência com que o thread de purga libera segmentos de rollback.

  `innodb_purge_rseg_truncate_frequency` é destinado ao uso com `innodb_undo_log_truncate`. Para mais informações, consulte Truncando Espaços de Tabelas Undo.

- `innodb_random_read_ahead`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Habilita a técnica de leitura antecipada aleatória para otimizar o I/O do `InnoDB`.

  Para obter detalhes sobre as considerações de desempenho para diferentes tipos de solicitações de leitura antecipada, consulte a Seção 14.8.3.4, “Configurando a Pré-visualização do Pool de Buffer do InnoDB (Leitura Antecipada”)”). Para obter conselhos gerais sobre o ajuste de E/S, consulte a Seção 8.5.8, “Otimizando o E/S do Disco do InnoDB”.

- `innodb_read_ahead_threshold`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Controla a sensibilidade do pré-visualização linear que o `InnoDB` usa para pré-carregar páginas no pool de buffer. Se o `InnoDB` ler pelo menos `innodb_read_ahead_threshold` páginas sequencialmente de um intervalo (64 páginas), ele inicia uma leitura assíncrona para todo o intervalo seguinte. O intervalo de valores permitido é de 0 a 64. Um valor de 0 desabilita a pré-visualização. Para o valor padrão de 56, o `InnoDB` deve ler pelo menos 56 páginas sequencialmente de um intervalo para iniciar uma leitura assíncrona para o intervalo seguinte.

  Saber quantos páginas são lidas pelo mecanismo de leitura antecipada e quantas dessas páginas são expulsas do pool de buffer sem serem acessadas nunca pode ser útil ao ajustar o ajuste `innodb_read_ahead_threshold`. A saída do comando `SHOW ENGINE INNODB STATUS` exibe informações de contador das variáveis de status globais `Innodb_buffer_pool_read_ahead` e `Innodb_buffer_pool_read_ahead_evicted`, que relatam o número de páginas trazidas para o pool de buffer por solicitações de leitura antecipada e o número de páginas expulsas do pool de buffer sem serem acessadas nunca, respectivamente. As variáveis de status relatam valores globais desde o último reinício do servidor.

  `SHOW ENGINE INNODB STATUS` também mostra a taxa na qual as páginas de leitura à frente são lidas e a taxa na qual essas páginas são expulsas sem serem acessadas. As médias por segundo são baseadas nas estatísticas coletadas desde a última invocação de `SHOW ENGINE INNODB STATUS` e são exibidas na seção `BUFFER POOL AND MEMORY` (Pool de Armazenamento de Armazenamento e Memória) do resultado do `SHOW ENGINE INNODB STATUS`.

  Para obter mais informações, consulte a Seção 14.8.3.4, “Configurando a Pré-visualização do Pool de Buffer InnoDB (Leitura Antecipada”)”). Para obter conselhos gerais sobre o ajuste de E/S, consulte a Seção 8.5.8, “Otimizando o E/S de Disco InnoDB”.

- `innodb_read_io_threads`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  O número de threads de E/S para operações de leitura no `InnoDB`. Sua contraparte para threads de escrita é `innodb_write_io_threads`. Para mais informações, consulte a Seção 14.8.6, “Configurando o Número de Threads de E/S InnoDB em Segundo Plano”. Para conselhos gerais sobre o ajuste de E/S, consulte a Seção 8.5.8, “Otimizando o E/S de Disco InnoDB”.

  Nota

  Em sistemas Linux, executar vários servidores MySQL (geralmente mais de 12) com configurações padrão para `innodb_read_io_threads`, `innodb_write_io_threads` e o ajuste `aio-max-nr` do Linux pode exceder os limites do sistema. Idealmente, aumente o ajuste `aio-max-nr`; como solução alternativa, você pode reduzir as configurações de uma ou ambas as variáveis MySQL.

- `innodb_read_only`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Inicia o `InnoDB` no modo de leitura somente. Para distribuir aplicações de banco de dados ou conjuntos de dados em mídia de leitura somente. Também pode ser usado em data warehouses para compartilhar o mesmo diretório de dados entre múltiplas instâncias. Para mais informações, consulte a Seção 14.8.2, “Configurando o InnoDB para Operação de Leitura Somente”.

- `innodb_replication_delay`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  O atraso do fio de replicação em milissegundos em um servidor de replicação quando o `innodb_thread_concurrency` é atingido.

- `innodb_rollback_on_timeout`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  O `InnoDB` desfaz apenas a última instrução de uma transação no limite de tempo por padrão. Se `--innodb-rollback-on-timeout` for especificado, um limite de tempo de transação faz com que o `InnoDB` interrompa e desfaça toda a transação.

  Para obter mais informações, consulte a Seção 14.22.4, “Tratamento de Erros do InnoDB”.

- `innodb_rollback_segments`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Define o número de segmentos de rollback usados pelo `InnoDB` para transações que geram registros de desfazer. O número de transações que cada segmento de rollback suporta depende do tamanho da página do `InnoDB` e do número de logs de desfazer atribuídos a cada transação. Para mais informações, consulte a Seção 14.6.7, “Logs de Desfazer”.

  Um segmento de rollback é sempre atribuído ao espaço de tabelas do sistema, e 32 segmentos de rollback são reservados para uso de tabelas temporárias e residem no espaço de tabelas temporárias (`ibtmp1`). Para alocar um segmento de rollback adicional, o `innodb_rollback_segments` deve ser configurado para um valor maior que 33. Se você configurar espaços de tabelas undo separados, o segmento de rollback no espaço de tabelas do sistema fica inativo.

  Quando `innodb_rollback_segments` é definido como 32 ou menos, o `InnoDB` atribui um segmento de rollback ao espaço de tabela do sistema e 32 ao espaço de tabela temporário.

  Quando `innodb_rollback_segments` é definido para um valor maior que 32, o `InnoDB` atribui um segmento de rollback ao espaço de tabela do sistema, 32 ao espaço de tabela temporário e segmentos de rollback adicionais aos espaços de tabela de desfazer, se estiverem presentes. Se os espaços de tabela de desfazer não estiverem presentes, segmentos de rollback adicionais são atribuídos ao espaço de tabela do sistema.

  Embora você possa aumentar ou diminuir o número de segmentos de rollback usados pelo `InnoDB`, o número de segmentos de rollback fisicamente presentes no sistema nunca diminui. Assim, você pode começar com um valor baixo e aumentá-lo gradualmente para evitar a alocação de segmentos de rollback que não são necessários. O valor padrão e máximo de `innodb_rollback_segments` é 128.

  Para informações relacionadas, consulte a Seção 14.3, “Multiversão InnoDB”. Para informações sobre a configuração de espaços de tabelas de desfazer separados, consulte a Seção 14.6.3.4, “Espaços de tabelas de desfazer”.

- `innodb_saved_page_number_debug`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Salva um número de página. Ao definir a opção `innodb_fil_make_page_dirty_debug`, a página definida por `innodb_saved_page_number_debug` é marcada como suja. A opção `innodb_saved_page_number_debug` só está disponível se o suporte de depuração estiver compilado com a opção **CMake** `WITH_DEBUG`.

- `innodb_sort_buffer_size`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Esta variável define:

  - O tamanho do buffer de classificação para operações DDL online que criam ou reconstroem índices secundários.

  - O valor pelo qual o arquivo de registro temporário é estendido ao registrar DML concorrente durante uma operação de DDL online, e o tamanho do buffer de leitura e do buffer de escrita do arquivo de registro temporário.

  Para informações relacionadas, consulte a Seção 14.13.3, “Requisitos de Espaço DDL Online”.

- `innodb_spin_wait_delay`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  O atraso máximo entre as pesquisas para um bloqueio de rotação. A implementação de nível baixo deste mecanismo varia dependendo da combinação de hardware e sistema operacional, portanto, o atraso não corresponde a um intervalo de tempo fixo. Para mais informações, consulte a Seção 14.8.9, “Configurando a Pesquisa de Bloqueio de Rotação”.

- `innodb_stats_auto_recalc`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Faz com que o `InnoDB` recalcule automaticamente as estatísticas persistentes após as alterações substanciais nos dados de uma tabela. O valor limite é de 10% das linhas da tabela. Esta configuração aplica-se a tabelas criadas quando a opção `innodb_stats_persistent` está habilitada. A recálculo automático das estatísticas também pode ser configurado especificando `STATS_AUTO_RECALC=1` em uma instrução `CREATE TABLE` ou `ALTER TABLE`. A quantidade de dados amostrados para produzir as estatísticas é controlada pela variável `innodb_stats_persistent_sample_pages`.

  Para obter mais informações, consulte a Seção 14.8.11.1, “Configurando Parâmetros de Estatísticas do Optimizer Persistente”.

- `innodb_stats_include_delete_marked`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Por padrão, o `InnoDB` lê dados não confirmados ao calcular estatísticas. No caso de uma transação não confirmada que exclui linhas de uma tabela, o `InnoDB` exclui registros marcados para exclusão ao calcular estimativas de linhas e estatísticas de índices, o que pode levar a planos de execução não ótimos para outras transações que operam na tabela simultaneamente usando um nível de isolamento de transação diferente de `READ UNCOMMITTED`. Para evitar esse cenário, o `innodb_stats_include_delete_marked` pode ser habilitado para garantir que o `InnoDB` inclua registros marcados para exclusão ao calcular estatísticas do otimizador persistentes.

  Quando `innodb_stats_include_delete_marked` está habilitado, o comando `ANALYZE TABLE` considera os registros marcados para exclusão ao recalcular as estatísticas.

  `innodb_stats_include_delete_marked` é um ajuste global que afeta todas as tabelas `InnoDB`. Ele só é aplicável às estatísticas do otimizador persistentes.

  Para informações relacionadas, consulte a Seção 14.8.11.1, “Configurando Parâmetros de Estatísticas do Optimizer Persistente”.

- `innodb_stats_method`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Como o servidor trata os valores `NULL` ao coletar estatísticas sobre a distribuição dos valores de índice para tabelas `InnoDB`. Os valores permitidos são `nulls_equal`, `nulls_unequal` e `nulls_ignored`. Para `nulls_equal`, todos os valores `NULL` de índice são considerados iguais e formam um único grupo de valor com um tamanho igual ao número de valores `NULL`. Para `nulls_unequal`, os valores `NULL` são considerados desiguais, e cada `NULL` forma um grupo de valor distinto de tamanho igual ao número de `NULL`s.

  1. Para `nulls_ignored`, os valores `NULL` são ignorados.

  O método usado para gerar estatísticas de tabela influencia a forma como o otimizador escolhe índices para a execução de consultas, conforme descrito na Seção 8.3.7, “Coleta de Estatísticas de Índices InnoDB e MyISAM”.

- `innodb_stats_on_metadata`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Esta opção só se aplica quando as estatísticas do otimizador estão configuradas para não serem persistentes. As estatísticas do otimizador não são armazenadas em disco quando o `innodb_stats_persistent` está desativado ou quando tabelas individuais são criadas ou alteradas com `STATS_PERSISTENT=0`. Para mais informações, consulte a Seção 14.8.11.2, “Configurando Parâmetros de Estatísticas de Otimizador Não Persistentes”.

  Quando `innodb_stats_on_metadata` está habilitado, o `InnoDB` atualiza estatísticas não persistentes quando são emitidas declarações de metadados, como `SHOW TABLE STATUS` ou ao acessar as tabelas do Schema de Informações `TABLES` ou `STATISTICS`. (Essas atualizações são semelhantes às que ocorrem para `ANALYZE TABLE`.) Quando desabilitado, o `InnoDB` não atualiza estatísticas durante essas operações. Manter a configuração desabilitada pode melhorar a velocidade de acesso para esquemas que têm um grande número de tabelas ou índices. Também pode melhorar a estabilidade dos planos de execução para consultas que envolvem tabelas `InnoDB`.

  Para alterar a configuração, execute a instrução `SET GLOBAL innodb_stats_on_metadata=mode`, onde `mode` pode ser `ON` ou `OFF` (ou `1` ou `0`). Para alterar a configuração, são necessários privilégios suficientes para definir variáveis de sistema globais (consulte a Seção 5.1.8.1, “Privilégios de Variáveis de Sistema”) e isso afeta imediatamente o funcionamento de todas as conexões.

- `innodb_stats_persistent`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Especifica se as estatísticas de índice do InnoDB são persistidas no disco. Caso contrário, as estatísticas podem ser recalculadas frequentemente, o que pode levar a variações nos planos de execução das consultas. Esta configuração é armazenada com cada tabela quando a tabela é criada. Você pode definir `innodb_stats_persistent` a nível global antes de criar uma tabela ou usar a cláusula `STATS_PERSISTENT` das instruções `CREATE TABLE` e `ALTER TABLE` para substituir a configuração de nível global e configurar estatísticas persistentes para tabelas individuais.

  Para obter mais informações, consulte a Seção 14.8.11.1, “Configurando Parâmetros de Estatísticas do Optimizer Persistente”.

- `innodb_stats_persistent_sample_pages`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  O número de páginas de índice a serem amostradas ao estimar a cardinalidade e outras estatísticas para uma coluna indexada, como as calculadas pelo `ANALYSE TABELA`. Aumentar o valor melhora a precisão das estatísticas do índice, o que pode melhorar o plano de execução da consulta, em detrimento do aumento do I/O durante a execução do `ANALYSE TABELA` para uma tabela `InnoDB`. Para mais informações, consulte a Seção 14.8.11.1, “Configurando Parâmetros de Estatísticas do Otimizador Persistente”.

  Nota

  Definir um valor alto para `innodb_stats_persistent_sample_pages` pode resultar em um tempo de execução prolongado para a execução da instrução `ANALYZE TABLE`. Para estimar o número de páginas do banco de dados acessadas pela instrução `ANALYZE TABLE`, consulte a Seção 14.8.11.3, “Estimativa da Complexidade da Instrução ANALYZE TABLE para Tabelas InnoDB”.

  `innodb_stats_persistent_sample_pages` só se aplica quando `innodb_stats_persistent` está habilitado para uma tabela; quando `innodb_stats_persistent` está desativado, `innodb_stats_transient_sample_pages` é aplicado em vez disso.

- `innodb_stats_sample_pages`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Desatualizado. Use `innodb_stats_transient_sample_pages` em vez disso.

- `innodb_stats_transient_sample_pages`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  O número de páginas de índice a serem amostradas ao estimar a cardinalidade e outras estatísticas para uma coluna indexada, como as calculadas pelo `ANALYZE TABLE`. O valor padrão é 8. Aumentar o valor melhora a precisão das estatísticas do índice, o que pode melhorar o plano de execução da consulta, em detrimento do aumento do I/O ao abrir uma tabela `InnoDB` ou recalcular as estatísticas. Para mais informações, consulte a Seção 14.8.11.2, “Configurando Parâmetros de Estatísticas do Otimizador Não Persistente”.

  Nota

  Definir um valor alto para `innodb_stats_transient_sample_pages` pode resultar em um tempo de execução prolongado para a execução da instrução `ANALYZE TABLE`. Para estimar o número de páginas do banco de dados acessadas pela instrução `ANALYZE TABLE`, consulte a Seção 14.8.11.3, “Estimativa da Complexidade da Instrução ANALYZE TABLE para Tabelas InnoDB”.

  `innodb_stats_transient_sample_pages` só se aplica quando `innodb_stats_persistent` está desativado para uma tabela; quando `innodb_stats_persistent` está ativado, `innodb_stats_persistent_sample_pages` se aplica em vez disso. Toma o lugar de `innodb_stats_sample_pages`. Para mais informações, consulte a Seção 14.8.11.2, “Configurando Parâmetros de Estatísticas de Otimizador Não Persistentes”.

- `innodb_status_output`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Habilita ou desabilita a saída periódica para o monitor padrão `InnoDB`. Também é usado em combinação com `innodb_status_output_locks` para habilitar ou desabilitar a saída periódica para o monitor de bloqueio `InnoDB`. Para mais informações, consulte a Seção 14.18.2, “Habilitar monitores InnoDB”.

- `innodb_status_output_locks`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Habilita ou desabilita o Monitor de Bloqueio do `InnoDB`. Quando habilitado, o Monitor de Bloqueio do `InnoDB` imprime informações adicionais sobre os bloqueios na saída `SHOW ENGINE INNODB STATUS` e na saída periódica impressa no log de erros do MySQL. A saída periódica para o Monitor de Bloqueio do `InnoDB` é impressa como parte da saída padrão do Monitor `InnoDB`. Portanto, o Monitor `InnoDB` padrão deve ser habilitado para que o Monitor de Bloqueio do `InnoDB` imprima dados no log de erros do MySQL periodicamente. Para mais informações, consulte a Seção 14.18.2, “Habilitando Monitores InnoDB”.

- `innodb_strict_mode`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Quando o `innodb_strict_mode` está ativado, o `InnoDB` retorna erros em vez de avisos ao verificar opções de tabela inválidas ou incompatíveis.

  Ele verifica se as opções `KEY_BLOCK_SIZE`, `ROW_FORMAT`, `DATA DIRECTORY`, `TEMPORARY` e `TABLESPACE` são compatíveis entre si e com outras configurações.

  `innodb_strict_mode=ON` também habilita uma verificação do tamanho da linha ao criar ou alterar uma tabela, para evitar que as operações `INSERT` ou `UPDATE` falhem devido ao registro ser muito grande para o tamanho de página selecionado.

  Você pode habilitar ou desabilitar `innodb_strict_mode` na linha de comando ao iniciar o `mysqld`, ou em um arquivo de configuração do MySQL. Você também pode habilitar ou desabilitar `innodb_strict_mode` em tempo de execução com a instrução `SET [GLOBAL|SESSION] innodb_strict_mode=mode`, onde `mode` é `ON` ou `OFF`. Alterar o ajuste `GLOBAL` requer privilégios suficientes para definir variáveis de sistema globais (consulte a Seção 5.1.8.1, “Privilégios de Variáveis de Sistema”) e afeta o funcionamento de todos os clientes que se conectam posteriormente. Qualquer cliente pode alterar o ajuste `SESSION` para `innodb_strict_mode`, e o ajuste afeta apenas esse cliente.

- `innodb_support_xa`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Habilita o suporte `InnoDB` para o commit de duas fases em transações XA, causando um esvaziamento adicional do disco para a preparação da transação. O mecanismo XA é usado internamente e é essencial para qualquer servidor que tenha seu log binário ativado e esteja aceitando alterações em seus dados de mais de um fio. Se você desabilitar `innodb_support_xa`, as transações podem ser escritas no log binário em uma ordem diferente da ordem em que o banco de dados ao vivo as está commitando, o que pode produzir dados diferentes quando o log binário é reexibido na recuperação de desastres ou em uma replica. Não desabilite `innodb_support_xa` em um servidor de origem de replicação, a menos que você tenha uma configuração incomum em que apenas um fio seja capaz de alterar dados.

  `innodb_support_xa` está desatualizado; espere-se que ele seja removido em uma futura versão do MySQL. O suporte `InnoDB` para o commit de duas fases em transações XA está sempre ativado a partir do MySQL 5.7.10. Desativar `innodb_support_xa` não é mais permitido, pois isso torna a replicação insegura e impede ganhos de desempenho associados ao commit de grupo de log binário.

- `innodb_sync_array_size`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Define o tamanho da matriz de espera do mutex/bloqueio. O aumento do valor divide a estrutura de dados interna usada para coordenar os threads, proporcionando maior concorrência em cargas de trabalho com um grande número de threads em espera. Esta configuração deve ser configurada quando a instância do MySQL está sendo iniciada e não pode ser alterada posteriormente. O aumento do valor é recomendado para cargas de trabalho que frequentemente produzem um grande número de threads em espera, geralmente maior que 768.

- `innodb_sync_spin_loops`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  O número de vezes que um fio aguarda por um mutex do InnoDB ser liberado antes de o fio ser suspenso.

- `innodb_sync_debug`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Habilita a verificação de depuração da sincronização para o mecanismo de armazenamento `InnoDB`. Esta opção está disponível apenas se o suporte de depuração estiver compilado usando a opção `WITH_DEBUG` do **CMake**.

  Anteriormente, para ativar a verificação de depuração da sincronização do InnoDB, era necessário habilitar a funcionalidade de Sincronização de Depuração usando a opção **CMake** `ENABLE_DEBUG_SYNC`, que foi removida desde então. Essa exigência foi removida no MySQL 5.7 com a introdução dessa variável.

- `innodb_table_locks`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Se `autocommit = 0`, o `InnoDB` respeita `LOCK TABLES`; o MySQL não retorna do `LOCK TABLES ... WRITE` até que todos os outros threads tenham liberado todos os seus bloqueios da tabela. O valor padrão de `innodb_table_locks` é 1, o que significa que `LOCK TABLES` faz com que o `InnoDB` bloqueie uma tabela internamente se `autocommit = 0`.

  `innodb_table_locks = 0` não tem efeito para tabelas bloqueadas explicitamente com `LOCK TABLES ... WRITE`. Ele tem efeito para tabelas bloqueadas para leitura ou escrita por `LOCK TABLES ... WRITE` implicitamente (por exemplo, por meio de gatilhos) ou por `LOCK TABLES ... READ`.

  Para informações relacionadas, consulte a Seção 14.7, “Modelo de Transição e Bloqueio InnoDB”.

- `innodb_temp_data_file_path`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Define o caminho relativo, nome, tamanho e atributos dos arquivos de dados do espaço de dados temporários `InnoDB`. Se você não especificar um valor para `innodb_temp_data_file_path`, o comportamento padrão é criar um único arquivo de dados auto-extensível chamado `ibtmp1` no diretório de dados do MySQL. O tamanho inicial do arquivo é ligeiramente maior que 12 MB.

  A sintaxe completa para a especificação de um arquivo de dados de espaço de tabela temporário inclui o nome do arquivo, o tamanho do arquivo e os atributos `autoextend` e `max`:

  ```sql
  file_name:file_size[:autoextend[:max:max_file_size]]
  ```

  O arquivo de dados do espaço de tabela temporário não pode ter o mesmo nome que outro arquivo de dados do `InnoDB`. Qualquer inabilidade ou erro ao criar um arquivo de dados do espaço de tabela temporário é tratado como fatal e o início do servidor é negado. O espaço de tabela temporário tem um ID de espaço gerado dinamicamente, que pode mudar em cada reinício do servidor.

  Os tamanhos dos arquivos são especificados em KB, MB ou GB (1024 MB) ao anexar `K`, `M` ou `G` ao valor do tamanho. A soma dos tamanhos dos arquivos deve ser ligeiramente maior que 12 MB.

  O limite de tamanho dos arquivos individuais é determinado pelo seu sistema operacional. Você pode definir o tamanho do arquivo para mais de 4 GB em sistemas operacionais que suportam arquivos grandes. O uso de partições de disco bruto para arquivos de dados de espaço de tabela temporário não é suportado.

  Os atributos `autoextend` e `max` podem ser usados apenas para o arquivo de dados especificado na última posição na configuração `innodb_temp_data_file_path`. Por exemplo:

  ```sql
  [mysqld]
  innodb_temp_data_file_path=ibtmp1:50M;ibtmp2:12M:autoextend:max:500M
  ```

  Se você especificar a opção `autoextend`, o `InnoDB` estenderá o arquivo de dados se ele ficar sem espaço livre. O incremento `autoextend` é de 64 MB por padrão. Para modificar o incremento, altere a variável de sistema `innodb_autoextend_increment`.

  O caminho completo do diretório para os arquivos de dados do espaço de tabela temporário é formado pela concatenação dos caminhos definidos por `innodb_data_home_dir` e `innodb_temp_data_file_path`.

  O espaço de tabela temporário é compartilhado por todas as tabelas temporárias não compactadas do `InnoDB`. As tabelas temporárias compactadas residem em arquivos de espaço de tabela por arquivo criados no diretório de arquivos temporários, que é definido pela opção de configuração `tmpdir`.

  Antes de executar o `InnoDB` no modo de leitura somente, defina `innodb_temp_data_file_path` para um local fora do diretório de dados. O caminho deve ser relativo ao diretório de dados. Por exemplo:

  ```sql
  --innodb-temp-data-file-path=../../../tmp/ibtmp1:12M:autoextend
  ```

  Os metadados das tabelas temporárias ativas do `InnoDB` estão localizados na tabela do esquema de informações `INNODB_TEMP_TABLE_INFO`.

  Para informações relacionadas, consulte a Seção 14.6.3.5, “O Espaço de Memória Temporário”.

- `innodb_thread_concurrency`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Define o número máximo de threads permitidas dentro do `InnoDB`. Um valor de 0 (o padrão) é interpretado como concorrência infinita (sem limite). Esta variável é destinada ao ajuste de desempenho em sistemas de alta concorrência.

  O `InnoDB` tenta manter o número de threads dentro do `InnoDB` menor ou igual ao limite `innodb_thread_concurrency`. As threads que estão esperando por bloqueios não são contadas no número de threads que estão executando simultaneamente.

  A configuração correta depende da carga de trabalho e do ambiente de computação. Considere definir essa variável se sua instância do MySQL compartilhar recursos de CPU com outras aplicações ou se sua carga de trabalho ou número de usuários simultâneos estiverem crescendo. Teste uma gama de valores para determinar a configuração que oferece o melhor desempenho. `innodb_thread_concurrency` é uma variável dinâmica, que permite experimentar com diferentes configurações em um sistema de teste em tempo real. Se uma configuração específica estiver funcionando mal, você pode rapidamente definir `innodb_thread_concurrency` de volta para 0.

  Use as seguintes diretrizes para ajudar a encontrar e manter um ambiente apropriado:

  - Se o número de threads de usuário concorrente para uma carga de trabalho for consistentemente pequeno e não afetar o desempenho, defina `innodb_thread_concurrency=0` (sem limite).

  - Se sua carga de trabalho for consistentemente alta ou ocasionalmente aumentar, defina um valor para `innodb_thread_concurrency` e ajuste até encontrar o número de threads que ofereça o melhor desempenho. Por exemplo, suponha que seu sistema tenha tipicamente de 40 a 50 usuários, mas periodicamente o número aumenta para 60, 70 ou mais. Através de testes, você descobre que o desempenho permanece amplamente estável com um limite de 80 usuários simultâneos. Nesse caso, defina `innodb_thread_concurrency` para 80.

  - Se você não quiser que o `InnoDB` use mais de um determinado número de CPUs virtuais para os threads do usuário (20 CPUs virtuais, por exemplo), defina `innodb_thread_concurrency` para esse número (ou possivelmente para um valor menor, dependendo dos testes de desempenho). Se o seu objetivo é isolar o MySQL de outras aplicações, considere vincular o processo `mysqld` exclusivamente às CPUs virtuais. No entanto, esteja ciente de que a vinculação exclusiva pode resultar em uso de hardware não ótimo se o processo `mysqld` não estiver constantemente ocupado. Nesse caso, você pode vincular o processo `mysqld` às CPUs virtuais, mas permitir que outras aplicações usem algumas ou todas as CPUs virtuais.

    Nota

    Do ponto de vista do sistema operacional, usar uma solução de gerenciamento de recursos para gerenciar como o tempo da CPU é compartilhado entre as aplicações pode ser preferível ao vincular o processo `mysqld`. Por exemplo, você pode atribuir 90% do tempo da CPU virtual a uma determinada aplicação enquanto outros processos críticos *não* estão em execução, e escalar esse valor de volta para 40% quando outros processos críticos *estão* em execução.

  - Em alguns casos, o valor ótimo de `innodb_thread_concurrency` pode ser menor que o número de CPUs virtuais.

  - Um valor de `innodb_thread_concurrency` muito alto pode causar uma regressão de desempenho devido ao aumento da concorrência nos recursos e no sistema interno.

  - Monitore e analise seu sistema regularmente. Alterações na carga de trabalho, no número de usuários ou no ambiente de computação podem exigir que você ajuste a configuração `innodb_thread_concurrency`.

  Um valor de 0 desativa os contadores `consultas dentro do InnoDB` e `consultas na fila` na seção `OPERACOES DE LINHAS` do resultado do comando `SHOW ENGINE INNODB STATUS`.

  Para informações relacionadas, consulte a Seção 14.8.5, “Configurando Concorrência de Fila para InnoDB”.

- `innodb_thread_sleep_delay`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Define o tempo que os threads do `InnoDB` dormem antes de se juntarem à fila do `InnoDB`, em microsegundos. O valor padrão é 10000. Um valor de 0 desativa o sono. Você pode definir `innodb_adaptive_max_sleep_delay` para o maior valor que você permitiria para `innodb_thread_sleep_delay`, e o `InnoDB` ajusta automaticamente `innodb_thread_sleep_delay` para cima ou para baixo, dependendo da atividade atual de agendamento de threads. Esse ajuste dinâmico ajuda o mecanismo de agendamento de threads a funcionar de forma suave em momentos em que o sistema está levemente carregado ou quando está operando próximo à capacidade máxima.

  Para obter mais informações, consulte a Seção 14.8.5, “Configurando Concorrência de Fila para InnoDB”.

- `innodb_tmpdir`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Usado para definir um diretório alternativo para arquivos temporários de classificação criados durante operações de `ALTER TABLE` online que reconstruem a tabela.

  As operações `ALTER TABLE` online que recriam a tabela também criam um arquivo de tabela *intermediário* no mesmo diretório da tabela original. A opção `innodb_tmpdir` não é aplicável aos arquivos de tabela intermediários.

  Um valor válido é qualquer caminho de diretório diferente do caminho do diretório de dados do MySQL. Se o valor for NULL (o padrão), os arquivos temporários são criados no diretório temporário do MySQL (`$TMPDIR` no Unix, `%TEMP%` no Windows ou o diretório especificado pela opção de configuração `--tmpdir`). Se um diretório for especificado, a existência do diretório e as permissões são verificadas apenas quando o `innodb_tmpdir` é configurado usando uma instrução `SET`. Se um sintoma for fornecido em uma string de diretório, o sintoma é resolvido e armazenado como um caminho absoluto. O caminho não deve exceder 512 bytes. Uma operação `ALTER TABLE` online relata um erro se o `innodb_tmpdir` for definido para um diretório inválido. O `innodb_tmpdir` substitui a configuração `tmpdir` do MySQL, mas apenas para operações `ALTER TABLE` online.

  O privilégio `FILE` é necessário para configurar `innodb_tmpdir`.

  A opção `innodb_tmpdir` foi introduzida para ajudar a evitar o esvaziamento de um diretório de arquivo temporário localizado em um sistema de arquivos `tmpfs`. Esses esvaziamentos poderiam ocorrer como resultado de grandes arquivos temporários de ordenação criados durante operações `ALTER TABLE` online que reconstruem a tabela.

  Em ambientes de replicação, considere apenas replicar a configuração `innodb_tmpdir` se todos os servidores tiverem o mesmo ambiente do sistema operacional. Caso contrário, a replicação da configuração `innodb_tmpdir` pode resultar em um erro de replicação ao executar operações `ALTER TABLE` online que reconstruam a tabela. Se os ambientes operacionais dos servidores forem diferentes, recomenda-se que você configure `innodb_tmpdir` em cada servidor individualmente.

  Para obter mais informações, consulte a Seção 14.13.3, “Requisitos de Espaço DDL Online”. Para informações sobre operações online de `ALTER TABLE`, consulte a Seção 14.13, “InnoDB e DDL Online”.

- `innodb_trx_purge_view_update_only_debug`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Pausa a limpeza de registros marcados para exclusão enquanto permite que a visualização de limpeza seja atualizada. Esta opção cria artificialmente uma situação em que a visualização de limpeza é atualizada, mas as purges ainda não foram realizadas. Esta opção só está disponível se o suporte de depuração estiver compilado usando a opção `WITH_DEBUG` do **CMake**.

- `innodb_trx_rseg_n_slots_debug`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Define uma bandeira de depuração que limita `TRX_RSEG_N_SLOTS` para um valor específico para a função `trx_rsegf_undo_find_free`, que procura por slots livres para segmentos do log de desfazer. Esta opção só está disponível se o suporte de depuração estiver compilado com a opção **CMake** `WITH_DEBUG`.

- `innodb_undo_directory`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  O caminho onde o `InnoDB` cria espaços de tabelas de desfazer. Tipicamente usado para colocar logs de desfazer em um dispositivo de armazenamento diferente. Usado em conjunto com `innodb_rollback_segments` e `innodb_undo_tablespaces`.

  Não há um valor padrão (é NULL). Se um caminho não for especificado, os espaços de tabela de desfazer são criados no diretório de dados do MySQL, conforme definido por `datadir`.

  Para obter mais informações, consulte a Seção 14.6.3.4, “Desfazer Espaços de Tabela”.

- `innodb_undo_log_truncate`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Quando ativado, os espaços de tabela que excederem o valor limite definido por `innodb_max_undo_log_size` são marcados para serem truncados. Apenas os espaços de tabela de desfazer podem ser truncados. Não é suportado o truncamento de logs de desfazer que residem no espaço de tabela do sistema. Para que o truncamento ocorra, deve haver pelo menos dois espaços de tabela de desfazer e dois logs de desfazer habilitados para uso de espaços de tabela de desfazer. Isso significa que `innodb_undo_tablespaces` deve ser definido para um valor igual ou maior que 2, e `innodb_rollback_segments` deve ser definido para um valor igual ou maior que 35.

  A variável `innodb_purge_rseg_truncate_frequency` pode ser usada para acelerar o truncamento dos espaços de tabelas undo.

  Para obter mais informações, consulte "Truncando espaços de tabelas Undo".

- `innodb_undo_logs`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Nota

  `innodb_undo_logs` está desatualizado; espere que ele seja removido em uma futura versão do MySQL.

  Define o número de segmentos de rollback usados pelo `InnoDB`. A opção `innodb_undo_logs` é um alias para `innodb_rollback_segments`. Para mais informações, consulte a descrição de `innodb_rollback_segments`.

- `innodb_undo_tablespaces`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  O número de espaços de tabela de desfazer usados pelo `InnoDB`. O valor padrão é 0.

  Nota

  `innodb_undo_tablespaces` está desatualizado; espere que ele seja removido em uma futura versão do MySQL.

  Como os registros de desfazer podem se tornar grandes durante transações de longa duração, ter registros de desfazer em vários espaços de tabela reduz o tamanho máximo de qualquer um deles. Os arquivos do espaço de desfazer são criados na localização definida por `innodb_undo_directory`, com nomes na forma de `undoN`, onde *`N`* é uma série sequencial de números inteiros (incluindo zeros no início) que representam o ID do espaço.

  O tamanho inicial de um arquivo de espaço de tabelas de reversão depende do valor `innodb_page_size`. Para o tamanho de página padrão de 16 KB do `InnoDB`, o tamanho inicial do arquivo de espaço de tabelas de reversão é de 10 MiB. Para tamanhos de página de 4 KB, 8 KB, 32 KB e 64 KB, os tamanhos iniciais dos arquivos de espaço de tabelas de reversão são, respectivamente, 7 MiB, 8 MiB, 20 MiB e 40 MiB.

  É necessário ter pelo menos duas tabelas de desfazer para habilitar a truncação dos registros de desfazer. Consulte Truncar tabelas de desfazer.

  Importante

  `innodb_undo_tablespaces` só pode ser configurado antes de inicializar a instância do MySQL e não pode ser alterado depois. Se nenhum valor for especificado, a instância é inicializada com o ajuste padrão de 0. Se tentar reiniciar o `InnoDB` com um número maior de espaços de recuperação do que o especificado quando a instância do MySQL foi inicializada, isso resultará em um erro de inicialização e uma mensagem indicando que o `InnoDB` não encontrou o número esperado de espaços de recuperação.

  32 dos 128 segmentos de rollback são reservados para tabelas temporárias, conforme descrito na Seção 14.6.7, “Registros de Anulação”. Um segmento de rollback é sempre atribuído ao espaço de tabelas do sistema, o que deixa 95 segmentos de rollback disponíveis para espaços de tabelas de anulação. Isso significa que o limite máximo de `innodb_undo_tablespaces` é de 95.

  Para obter mais informações, consulte a Seção 14.6.3.4, “Desfazer Espaços de Tabela”.

- `innodb_use_native_aio`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Especifica se o subsistema de E/S assíncrona do Linux deve ser usado. Esta variável só se aplica a sistemas Linux e não pode ser alterada enquanto o servidor estiver em execução. Normalmente, você não precisa configurar esta opção, pois ela está habilitada por padrão.

  A capacidade de E/S assíncrona que o `InnoDB` tem nos sistemas Windows está disponível nos sistemas Linux. (Outros sistemas semelhantes ao Unix continuam a usar chamadas de E/S síncronas.) Esta funcionalidade melhora a escalabilidade de sistemas fortemente dependentes de E/S, que geralmente mostram muitos leitores/escritores pendentes na saída `SHOW ENGINE INNODB STATUS\G`.

  Executar com um grande número de threads de E/S do InnoDB e, especialmente, executar várias instâncias desse tipo na mesma máquina do servidor pode exceder os limites de capacidade nos sistemas Linux. Nesse caso, você pode receber o seguinte erro:

  ```sql
  EAGAIN: The specified maxevents exceeds the user's limit of available events.
  ```

  Você geralmente pode resolver esse erro escrevendo um limite maior em `/proc/sys/fs/aio-max-nr`.

  No entanto, se um problema com o subsistema de E/S assíncrona do sistema operacional impedir que o `InnoDB` seja iniciado, você pode iniciar o servidor com `innodb_use_native_aio=0`. Essa opção também pode ser desabilitada automaticamente durante a inicialização se o `InnoDB` detectar um problema potencial, como uma combinação de local de `tmpdir`, sistema de arquivos `tmpfs` e kernel Linux que não suporta AIO em `tmpfs`.

  Para obter mais informações, consulte a Seção 14.8.7, “Usando I/O assíncrono no Linux”.

- `innodb_version`

  O número da versão do `InnoDB`. No MySQL 5.7, a numeração de versão separada para `InnoDB` não se aplica e este valor é o mesmo que o número da versão do servidor.

- `innodb_write_io_threads`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  O número de threads de E/S para operações de escrita no `InnoDB`. O valor padrão é 4. Sua contraparte para threads de leitura é `innodb_read_io_threads`. Para mais informações, consulte a Seção 14.8.6, “Configurando o Número de Threads de E/S InnoDB em Segundo Plano”. Para conselhos gerais sobre o ajuste do E/S, consulte a Seção 8.5.8, “Otimizando o E/S de Disco InnoDB”.

  Nota

  Em sistemas Linux, executar vários servidores MySQL (geralmente mais de 12) com configurações padrão para `innodb_read_io_threads`, `innodb_write_io_threads` e o ajuste `aio-max-nr` do Linux pode exceder os limites do sistema. Idealmente, aumente o ajuste `aio-max-nr`; como solução alternativa, você pode reduzir as configurações de uma ou ambas as variáveis MySQL.

  Além disso, considere o valor de `sync_binlog`, que controla a sincronização do log binário com o disco.

  Para obter conselhos gerais sobre o ajuste de E/S, consulte a Seção 8.5.8, “Otimização do E/S do disco InnoDB”.
