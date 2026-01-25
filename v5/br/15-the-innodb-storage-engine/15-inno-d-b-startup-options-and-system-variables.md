## 14.15 Opções de Inicialização e Variáveis de Sistema do InnoDB

* Variáveis de sistema que são verdadeiras ou falsas podem ser habilitadas na inicialização do servidor nomeando-as, ou desabilitadas usando um prefixo `--skip-`. Por exemplo, para habilitar ou desabilitar o adaptive hash index do `InnoDB`, você pode usar `--innodb-adaptive-hash-index` ou `--skip-innodb-adaptive-hash-index` na linha de comando, ou `innodb_adaptive_hash_index` ou `skip_innodb_adaptive_hash_index` em um arquivo de opções.

* Variáveis de sistema que aceitam um valor numérico podem ser especificadas como `--var_name=value` na linha de comando ou como `var_name=value` em arquivos de opções.

* Muitas variáveis de sistema podem ser alteradas em tempo de execução (consulte Seção 5.1.8.2, “Variáveis de Sistema Dinâmicas”).

* Para obter informações sobre os modificadores de escopo de variável `GLOBAL` e `SESSION`, consulte a documentação da instrução `SET`.

* Certas opções controlam a localização e o layout dos arquivos de dados do `InnoDB`. A Seção 14.8.1, “Configuração de Inicialização do InnoDB”, explica como usar essas opções.

* Algumas opções, que você pode não usar inicialmente, ajudam a ajustar as características de performance do `InnoDB` com base na capacidade da máquina e na sua workload do Database.

* Para mais informações sobre como especificar opções e variáveis de sistema, consulte a Seção 4.2.2, “Especificando Opções de Programa”.

**Tabela 14.18 Referência de Opções e Variáveis do InnoDB**

<table frame="box" rules="all" summary="Referência para opções de linha de comando e variáveis de sistema do InnoDB."><col style="width: 20%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><thead><tr><th>Nome</th> <th>Linha de Comando</th> <th>Arquivo de Opções</th> <th>Var. de Sistema</th> <th>Var. de Status</th> <th>Escopo da Var.</th> <th>Dinâmica</th> </tr></thead><tbody><tr><th>daemon_memcached_enable_binlog</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>daemon_memcached_engine_lib_name</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>daemon_memcached_engine_lib_path</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>daemon_memcached_option</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>daemon_memcached_r_batch_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>daemon_memcached_w_batch_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>foreign_key_checks</th> <td></td> <td></td> <td>Sim</td> <td></td> <td>Ambos</td> <td>Sim</td> </tr><tr><th>ignore_builtin_innodb</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb</th> <td>Sim</td> <td>Sim</td> <td></td> <td></td> <td></td> <td></td> </tr><tr><th>innodb_adaptive_flushing</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_adaptive_flushing_lwm</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_adaptive_hash_index</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_adaptive_hash_index_parts</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_adaptive_max_sleep_delay</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_api_bk_commit_interval</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_api_disable_rowlock</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_api_enable_binlog</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_api_enable_mdl</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_api_trx_level</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_autoextend_increment</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_autoinc_lock_mode</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_available_undo_logs</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_background_drop_list_empty</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>Innodb_buffer_pool_bytes_data</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_buffer_pool_bytes_dirty</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_buffer_pool_chunk_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_buffer_pool_dump_at_shutdown</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_buffer_pool_dump_now</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_buffer_pool_dump_pct</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>Innodb_buffer_pool_dump_status</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_buffer_pool_filename</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_buffer_pool_instances</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_buffer_pool_load_abort</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_buffer_pool_load_at_startup</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_buffer_pool_load_now</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>Innodb_buffer_pool_load_status</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_buffer_pool_pages_data</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_buffer_pool_pages_dirty</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_buffer_pool_pages_flushed</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_buffer_pool_pages_free</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_buffer_pool_pages_latched</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_buffer_pool_pages_misc</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_buffer_pool_pages_total</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_buffer_pool_read_ahead</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_buffer_pool_read_ahead_evicted</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_buffer_pool_read_ahead_rnd</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_buffer_pool_read_requests</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_buffer_pool_reads</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_buffer_pool_resize_status</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_buffer_pool_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Varia</td> </tr><tr><th>Innodb_buffer_pool_wait_free</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_buffer_pool_write_requests</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_change_buffer_max_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_change_buffering</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_change_buffering_debug</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_checksum_algorithm</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_checksums</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_cmp_per_index_enabled</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_commit_concurrency</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_compress_debug</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_compression_failure_threshold_pct</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_compression_level</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_compression_pad_pct_max</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_concurrency_tickets</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_data_file_path</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_data_fsyncs</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_data_home_dir</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_data_pending_fsyncs</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_data_pending_reads</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_data_pending_writes</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_data_read</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_data_reads</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_data_writes</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_data_written</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_dblwr_pages_written</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_dblwr_writes</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_deadlock_detect</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_default_row_format</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_disable_resize_buffer_pool_debug</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_disable_sort_file_cache</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_doublewrite</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_fast_shutdown</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_fil_make_page_dirty_debug</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_file_format</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_file_format_check</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_file_format_max</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_file_per_table</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_fill_factor</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_flush_log_at_timeout</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_flush_log_at_trx_commit</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_flush_method</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_flush_neighbors</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_flush_sync</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_flushing_avg_loops</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_force_load_corrupted</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_force_recovery</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_ft_aux_table</th> <td></td> <td></td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_ft_cache_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_ft_enable_diag_print</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_ft_enable_stopword</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Ambos</td> <td>Sim</td> </tr><tr><th>innodb_ft_max_token_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_ft_min_token_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_ft_num_word_optimize</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_ft_result_cache_limit</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_ft_server_stopword_table</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_ft_sort_pll_degree</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_ft_total_cache_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_ft_user_stopword_table</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Ambos</td> <td>Sim</td> </tr><tr><th>Innodb_have_atomic_builtins</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_io_capacity</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_io_capacity_max</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_large_prefix</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_limit_optimistic_insert_debug</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_lock_wait_timeout</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Ambos</td> <td>Sim</td> </tr><tr><th>innodb_locks_unsafe_for_binlog</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_log_buffer_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_log_checkpoint_now</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_log_checksums</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_log_compressed_pages</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_log_file_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_log_files_in_group</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_log_group_home_dir</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_log_waits</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_log_write_ahead_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>Innodb_log_write_requests</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_log_writes</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_lru_scan_depth</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_max_dirty_pages_pct</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_max_dirty_pages_pct_lwm</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_max_purge_lag</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_max_purge_lag_delay</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_max_undo_log_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_merge_threshold_set_all_debug</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_monitor_disable</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_monitor_enable</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_monitor_reset</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_monitor_reset_all</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>Innodb_num_open_files</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_numa_interleave</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_old_blocks_pct</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_old_blocks_time</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_online_alter_log_max_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_open_files</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_optimize_fulltext_only</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>Innodb_os_log_fsyncs</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_os_log_pending_fsyncs</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_os_log_pending_writes</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_os_log_written</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_page_cleaners</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_page_size</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_page_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_pages_created</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_pages_read</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_pages_written</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_print_all_deadlocks</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_purge_batch_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_purge_rseg_truncate_frequency</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_purge_threads</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_random_read_ahead</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_read_ahead_threshold</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_read_io_threads</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_read_only</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_replication_delay</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_rollback_on_timeout</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_rollback_segments</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>Innodb_row_lock_current_waits</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_row_lock_time</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_row_lock_time_avg</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_row_lock_time_max</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_row_lock_waits</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_rows_deleted</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_rows_inserted</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_rows_read</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_rows_updated</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_saved_page_number_debug</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_sort_buffer_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_spin_wait_delay</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_stats_auto_recalc</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_stats_include_delete_marked</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_stats_method</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_stats_on_metadata</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_stats_persistent</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_stats_persistent_sample_pages</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_stats_sample_pages</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_stats_transient_sample_pages</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb-status-file</th> <td>Sim</td> <td>Sim</td> <td></td> <td></td> <td></td> <td></td> </tr><tr><th>innodb_status_output</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_status_output_locks</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_strict_mode</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Ambos</td> <td>Sim</td> </tr><tr><th>innodb_support_xa</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Ambos</td> <td>Sim</td> </tr><tr><th>innodb_sync_array_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_sync_debug</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_sync_spin_loops</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_table_locks</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Ambos</td> <td>Sim</td> </tr><tr><th>innodb_temp_data_file_path</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_thread_concurrency</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_thread_sleep_delay</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_tmpdir</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Ambos</td> <td>Sim</td> </tr><tr><th>Innodb_truncated_status_writes</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_trx_purge_view_update_only_debug</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_trx_rseg_n_slots_debug</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_undo_directory</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_undo_log_truncate</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_undo_logs</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_undo_tablespaces</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_use_native_aio</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_version</th> <td></td> <td></td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_write_io_threads</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>unique_checks</th> <td></td> <td></td> <td>Sim</td> <td></td> <td>Ambos</td> <td>Sim</td> </tr></tbody></table>

### Opções de Comando do InnoDB

* `--innodb[=value]`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Controla o carregamento do storage engine `InnoDB`, se o servidor foi compilado com suporte ao `InnoDB`. Esta opção tem um formato tri-estado, com valores possíveis de `OFF`, `ON` ou `FORCE`. Consulte a Seção 5.5.1, “Instalando e Desinstalando Plugins”.

  Para desabilitar o `InnoDB`, use `--innodb=OFF` ou `--skip-innodb`. Neste caso, como o storage engine padrão é o `InnoDB`, o servidor não é iniciado a menos que você também use `--default-storage-engine` e `--default-tmp-storage-engine` para definir o padrão para algum outro engine tanto para tabelas permanentes quanto para tabelas `TEMPORARY`.

  O storage engine `InnoDB` não pode mais ser desabilitado, e as opções `--innodb=OFF` e `--skip-innodb` estão descontinuadas e não têm efeito. O uso delas resulta em um aviso. Você deve esperar que essas opções sejam removidas em uma futura versão do MySQL.

* `--innodb-status-file`

  <table frame="box" rules="all" summary="Propriedades para innodb-status-file"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb-status-file[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  A opção de inicialização `--innodb-status-file` controla se o `InnoDB` cria um arquivo chamado `innodb_status.pid` no data directory e escreve a saída de `SHOW ENGINE INNODB STATUS` nele a cada 15 segundos, aproximadamente.

  O arquivo `innodb_status.pid` não é criado por padrão. Para criá-lo, inicie o **mysqld** com a opção `--innodb-status-file`. O `InnoDB` remove o arquivo quando o servidor é desligado normalmente. Se ocorrer um desligamento anormal, o status file pode precisar ser removido manualmente.

  A opção `--innodb-status-file` é destinada ao uso temporário, pois a geração da saída de `SHOW ENGINE INNODB STATUS` pode afetar a performance, e o arquivo `innodb_status.pid` pode se tornar muito grande ao longo do tempo.

  Para informações relacionadas, consulte a Seção 14.18.2, “Habilitando Monitores do InnoDB”.

* `--skip-innodb`

  Desabilita o storage engine `InnoDB`. Consulte a descrição de `--innodb`.

### Variáveis de Sistema do InnoDB

* `daemon_memcached_enable_binlog`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_enable_binlog"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-enable-binlog[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_enable_binlog</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Habilite esta opção no servidor de origem para usar o plugin **memcached** do `InnoDB` (`daemon_memcached`) com o binary log do MySQL. Esta opção só pode ser definida na inicialização do servidor. Você também deve habilitar o binary log do MySQL no servidor de origem usando a opção `--log-bin`.

  Para mais informações, consulte a Seção 14.21.6, “O Plugin memcached do InnoDB e Replicação”.

* `daemon_memcached_engine_lib_name`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_engine_lib_name"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-engine-lib-name=file_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_engine_lib_name</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>innodb_engine.so</code></td> </tr></tbody></table>

  Especifica a shared library que implementa o plugin **memcached** do `InnoDB`.

  Para mais informações, consulte a Seção 14.21.3, “Configurando o Plugin memcached do InnoDB”.

* `daemon_memcached_engine_lib_path`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_engine_lib_path"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-engine-lib-path=dir_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_engine_lib_path</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  O path do diretório contendo a shared library que implementa o plugin **memcached** do `InnoDB`. O valor padrão é NULL, representando o diretório de plugins do MySQL. Você não deve precisar modificar este parâmetro a menos que esteja especificando um plugin `memcached` para um storage engine diferente que esteja localizado fora do diretório de plugins do MySQL.

  Para mais informações, consulte a Seção 14.21.3, “Configurando o Plugin memcached do InnoDB”.

* `daemon_memcached_option`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_option"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-option=options</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_option</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code></code></td> </tr></tbody></table>

  Usado para passar opções do memcached separadas por espaço para o daemon subjacente de caching de objeto de memória **memcached** na inicialização. Por exemplo, você pode alterar a porta que o **memcached** escuta, reduzir o número máximo de conexões simultâneas, alterar o tamanho máximo da memória para um par chave-valor ou habilitar mensagens de Debug para o error log.

  Consulte a Seção 14.21.3, “Configurando o Plugin memcached do InnoDB”, para detalhes de uso. Para informações sobre opções do **memcached**, consulte a página man do **memcached**.

* `daemon_memcached_r_batch_size`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_r_batch_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-r-batch-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_r_batch_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>1073741824</code></td> </tr></tbody></table>

  Especifica quantas operações de leitura do **memcached** (operações `get`) devem ser realizadas antes de fazer um `COMMIT` para iniciar uma nova transaction. Contraparte de `daemon_memcached_w_batch_size`.

  Este valor é definido como 1 por padrão, para que quaisquer alterações feitas na table através de instruções SQL sejam imediatamente visíveis para as operações do **memcached**. Você pode aumentá-lo para reduzir a sobrecarga de commits frequentes em um sistema onde a table subjacente está sendo acessada apenas através da interface **memcached**. Se você definir o valor muito alto, a quantidade de dados de undo ou redo pode impor alguma sobrecarga de armazenamento, como em qualquer transaction de longa duração.

  Para mais informações, consulte a Seção 14.21.3, “Configurando o Plugin memcached do InnoDB”.

* `daemon_memcached_w_batch_size`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_w_batch_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-w-batch-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_w_batch_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr></tbody></table>

  Especifica quantas operações de gravação do **memcached**, como `add`, `set` e `incr`, devem ser realizadas antes de fazer um `COMMIT` para iniciar uma nova transaction. Contraparte de `daemon_memcached_r_batch_size`.

  Este valor é definido como 1 por padrão, sob a suposição de que os dados armazenados são importantes para preservar em caso de falha e devem ser imediatamente submetidos a commit. Ao armazenar dados não críticos, você pode aumentar este valor para reduzir a sobrecarga de commits frequentes; mas então as últimas *`N`*-1 operações de gravação não submetidas a commit podem ser perdidas se ocorrer uma saída inesperada.

  Para mais informações, consulte a Seção 14.21.3, “Configurando o Plugin memcached do InnoDB”.

* `ignore_builtin_innodb`

  <table frame="box" rules="all" summary="Propriedades para ignore_builtin_innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ignore-builtin-innodb[={OFF|ON}]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Variável de Sistema</th> <td><code>ignore_builtin_innodb</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr></tbody></table>

  Em versões anteriores do MySQL, habilitar esta variável fazia com que o servidor se comportasse como se o `InnoDB` embutido não estivesse presente, o que permitia que o `InnoDB Plugin` fosse usado em seu lugar. No MySQL 5.7, o `InnoDB` é o storage engine padrão e o `InnoDB Plugin` não é usado, então esta variável é ignorada.

* `innodb_adaptive_flushing`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Especifica se a taxa de flushing de dirty pages no Buffer Pool do `InnoDB` deve ser ajustada dinamicamente com base na workload. O ajuste dinâmico da taxa de flush visa evitar picos de atividade de I/O. Esta configuração está habilitada por padrão. Consulte a Seção 14.8.3.5, “Configurando o Flushing do Buffer Pool”, para mais informações. Para conselhos gerais sobre ajuste de I/O, consulte a Seção 8.5.8, “Otimizando I/O de Disco do InnoDB”.

* `innodb_adaptive_flushing_lwm`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Define o limite inferior (low water mark - LWM) que representa a porcentagem da capacidade do redo log na qual o flushing adaptativo é habilitado. Para mais informações, consulte a Seção 14.8.3.5, “Configurando o Flushing do Buffer Pool”.

* `innodb_adaptive_hash_index`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Define se o adaptive hash index do `InnoDB` está habilitado ou desabilitado. Pode ser desejável, dependendo da sua workload, habilitar ou desabilitar dinamicamente o adaptive hash indexing para melhorar a performance da Query. Como o adaptive hash index pode não ser útil para todas as workloads, realize benchmarks com ele tanto habilitado quanto desabilitado, usando workloads realistas. Consulte a Seção 14.5.3, “Adaptive Hash Index”, para detalhes.

  Esta variável está habilitada por padrão. Você pode modificar este parâmetro usando a instrução `SET GLOBAL`, sem reiniciar o servidor. Alterar a configuração em tempo de execução requer privilégios suficientes para definir variáveis de sistema globais. Consulte a Seção 5.1.8.1, “Privilégios de Variáveis de Sistema”. Você também pode usar `--skip-innodb-adaptive-hash-index` na inicialização do servidor para desabilitá-lo.

  Desabilitar o adaptive hash index esvazia a hash table imediatamente. As operações normais podem continuar enquanto a hash table é esvaziada, e as Queries em execução que estavam usando o acesso via hash table acessam as B-trees do Index diretamente. Quando o adaptive hash index é reabilitado, a hash table é populada novamente durante a operação normal.

* `innodb_adaptive_hash_index_parts`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Particiona o sistema de busca do adaptive hash index. Cada Index é vinculado a uma partição específica, com cada partição protegida por um latch separado.

  Em versões anteriores, o sistema de busca do adaptive hash index era protegido por um único latch (`btr_search_latch`), que poderia se tornar um ponto de contenção. Com a introdução da opção `innodb_adaptive_hash_index_parts`, o sistema de busca é particionado em 8 partes por padrão. A configuração máxima é 512.

  Para informações relacionadas, consulte a Seção 14.5.3, “Adaptive Hash Index”.

* `innodb_adaptive_max_sleep_delay`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Permite que o `InnoDB` ajuste automaticamente o valor de `innodb_thread_sleep_delay` para cima ou para baixo de acordo com a workload atual. Qualquer valor não zero habilita o ajuste automatizado e dinâmico do valor `innodb_thread_sleep_delay`, até o valor máximo especificado na opção `innodb_adaptive_max_sleep_delay`. O valor representa o número de microssegundos. Esta opção pode ser útil em sistemas ocupados, com mais de 16 Threads `InnoDB`. (Na prática, é mais valiosa para sistemas MySQL com centenas ou milhares de conexões simultâneas.)

  Para mais informações, consulte a Seção 14.8.5, “Configurando a Concorrência de Threads para o InnoDB”.

* `innodb_api_bk_commit_interval`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Com que frequência as conexões ociosas que usam a interface **memcached** do `InnoDB` fazem auto-commit, em segundos. Para mais informações, consulte a Seção 14.21.5.4, “Controlando o Comportamento Transacional do Plugin memcached do InnoDB”.

* `innodb_api_disable_rowlock`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Use esta opção para desabilitar row locks quando o **memcached** do `InnoDB` realiza operações DML. Por padrão, `innodb_api_disable_rowlock` está desabilitado, o que significa que as requisições do **memcached** solicitam row locks para operações `get` e `set`. Quando `innodb_api_disable_rowlock` está habilitado, o **memcached** solicita um table Lock em vez de row locks.

  `innodb_api_disable_rowlock` não é dinâmico. Deve ser especificado na linha de comando do **mysqld** ou inserido no arquivo de configuração do MySQL. A configuração entra em vigor quando o plugin é instalado, o que ocorre quando o servidor MySQL é iniciado.

  Para mais informações, consulte a Seção 14.21.5.4, “Controlando o Comportamento Transacional do Plugin memcached do InnoDB”.

* `innodb_api_enable_binlog`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Permite que você use o plugin **memcached** do `InnoDB` com o binary log do MySQL. Para mais informações, consulte Habilitando o Binary Log do memcached do InnoDB.

* `innodb_api_enable_mdl`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Bloqueia a table usada pelo plugin **memcached** do `InnoDB`, para que ela não possa ser descartada ou alterada por DDL através da interface SQL. Para mais informações, consulte a Seção 14.21.5.4, “Controlando o Comportamento Transacional do Plugin memcached do InnoDB”.

* `innodb_api_trx_level`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Controla o nível de isolamento de transaction em Queries processadas pela interface **memcached**. As constantes correspondentes aos nomes familiares são:

  + 0 = `READ UNCOMMITTED`
  + 1 = `READ COMMITTED`
  + 2 = `REPEATABLE READ`
  + 3 = `SERIALIZABLE`

  Para mais informações, consulte a Seção 14.21.5.4, “Controlando o Comportamento Transacional do Plugin memcached do InnoDB”.

* `innodb_autoextend_increment`

  <table frame="box" rules="all" summary="Propriedades para innodb-status-file"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb-status-file[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  O tamanho do incremento (em megabytes) para estender o tamanho de um arquivo de tablespace de sistema do `InnoDB` com auto-extensão quando ele fica cheio. O valor padrão é 64. Para informações relacionadas, consulte Configuração do Arquivo de Dados do Tablespace do Sistema e Redimensionando o Tablespace do Sistema.

  A configuração `innodb_autoextend_increment` não afeta os arquivos de tablespace por table (file-per-table tablespace files) ou arquivos de tablespace gerais. Estes arquivos têm auto-extensão, independentemente da configuração `innodb_autoextend_increment`. As extensões iniciais são por pequenas quantidades, após as quais as extensões ocorrem em incrementos de 4MB.

* `innodb_autoinc_lock_mode`

  <table frame="box" rules="all" summary="Propriedades para innodb-status-file"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb-status-file[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  O Lock mode a ser usado para gerar valores de auto-incremento. Os valores permitidos são 0, 1 ou 2, para tradicional, consecutivo ou intercalado (interleaved), respectivamente. A configuração padrão é 1 (consecutivo). Para as características de cada Lock mode, consulte Modos de Lock AUTO_INCREMENT do InnoDB.

* `innodb_background_drop_list_empty`

  <table frame="box" rules="all" summary="Propriedades para innodb-status-file"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb-status-file[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Habilitar a opção de Debug `innodb_background_drop_list_empty` ajuda a evitar falhas em casos de teste, atrasando a criação de tabelas até que a lista de drop em background esteja vazia. Por exemplo, se o caso de teste A colocar a table `t1` na lista de drop em background, o caso de teste B aguarda até que a lista de drop em background esteja vazia antes de criar a table `t1`.

* `innodb_buffer_pool_chunk_size`

  <table frame="box" rules="all" summary="Propriedades para innodb-status-file"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb-status-file[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  `innodb_buffer_pool_chunk_size` define o tamanho do chunk para operações de redimensionamento do Buffer Pool do `InnoDB`.

  Para evitar copiar todas as páginas do Buffer Pool durante operações de redimensionamento, a operação é realizada em “chunks”. Por padrão, `innodb_buffer_pool_chunk_size` é de 128MB (134217728 bytes). O número de páginas contidas em um chunk depende do valor de `innodb_page_size`. `innodb_buffer_pool_chunk_size` pode ser aumentado ou diminuído em unidades de 1MB (1048576 bytes).

  As seguintes condições se aplicam ao alterar o valor de `innodb_buffer_pool_chunk_size`:

  + Se `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances` for maior do que o tamanho atual do Buffer Pool quando o Buffer Pool é inicializado, `innodb_buffer_pool_chunk_size` é truncado para `innodb_buffer_pool_size` / `innodb_buffer_pool_instances`.

  + O tamanho do Buffer Pool deve ser sempre igual ou um múltiplo de `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`. Se você alterar `innodb_buffer_pool_chunk_size`, `innodb_buffer_pool_size` é automaticamente arredondado para um valor que é igual ou um múltiplo de `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`. O ajuste ocorre quando o Buffer Pool é inicializado.

  Importante

  Deve-se ter cuidado ao alterar `innodb_buffer_pool_chunk_size`, pois alterar este valor pode aumentar automaticamente o tamanho do Buffer Pool. Antes de alterar `innodb_buffer_pool_chunk_size`, calcule o efeito que isso terá em `innodb_buffer_pool_size` para garantir que o tamanho resultante do Buffer Pool seja aceitável.

  Para evitar potenciais problemas de performance, o número de chunks (`innodb_buffer_pool_size` / `innodb_buffer_pool_chunk_size`) não deve exceder 1000.

  A variável `innodb_buffer_pool_size` é dinâmica, o que permite redimensionar o Buffer Pool enquanto o servidor está online. No entanto, o tamanho do Buffer Pool deve ser igual ou um múltiplo de `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`, e alterar qualquer uma dessas configurações de variável requer reiniciar o servidor.

  Consulte a Seção 14.8.3.1, “Configurando o Tamanho do Buffer Pool do InnoDB”, para mais informações.

* `innodb_buffer_pool_dump_at_shutdown`

  <table frame="box" rules="all" summary="Propriedades para innodb-status-file"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb-status-file[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Especifica se as páginas armazenadas em cache no Buffer Pool do `InnoDB` devem ser registradas quando o servidor MySQL é desligado, para encurtar o processo de warmup na próxima reinicialização. Tipicamente usado em combinação com `innodb_buffer_pool_load_at_startup`. A opção `innodb_buffer_pool_dump_pct` define a porcentagem das páginas do Buffer Pool usadas mais recentemente a serem despejadas (dump).

  Ambas as opções, `innodb_buffer_pool_dump_at_shutdown` e `innodb_buffer_pool_load_at_startup`, estão habilitadas por padrão.

  Para mais informações, consulte a Seção 14.8.3.6, “Salvando e Restaurando o Estado do Buffer Pool”.

* `innodb_buffer_pool_dump_now`

  <table frame="box" rules="all" summary="Propriedades para innodb-status-file"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb-status-file[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Cria imediatamente um registro das páginas armazenadas em cache no Buffer Pool do `InnoDB`. Tipicamente usado em combinação com `innodb_buffer_pool_load_now`.

  Habilitar `innodb_buffer_pool_dump_now` aciona a ação de registro, mas não altera a configuração da variável, que sempre permanece `OFF` ou `0`. Para visualizar o status do dump do Buffer Pool após acionar um dump, consulte a variável `Innodb_buffer_pool_dump_status`.

  Para mais informações, consulte a Seção 14.8.3.6, “Salvando e Restaurando o Estado do Buffer Pool”.

* `innodb_buffer_pool_dump_pct`

  <table frame="box" rules="all" summary="Propriedades para innodb-status-file"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb-status-file[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Especifica a porcentagem das páginas usadas mais recentemente para cada Buffer Pool a serem lidas e despejadas. O intervalo é de 1 a 100. O valor padrão é 25. Por exemplo, se houver 4 Buffer Pools com 100 páginas cada, e `innodb_buffer_pool_dump_pct` for definido como 25, as 25 páginas usadas mais recentemente de cada Buffer Pool serão despejadas.

  A alteração no valor padrão de `innodb_buffer_pool_dump_pct` coincide com as alterações de valor padrão para `innodb_buffer_pool_dump_at_shutdown` e `innodb_buffer_pool_load_at_startup`, que estão ambos habilitados por padrão no MySQL 5.7.

* `innodb_buffer_pool_filename`

  <table frame="box" rules="all" summary="Propriedades para innodb-status-file"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb-status-file[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Especifica o nome do arquivo que contém a lista de IDs de tablespace e IDs de página produzida por `innodb_buffer_pool_dump_at_shutdown` ou `innodb_buffer_pool_dump_now`. IDs de tablespace e IDs de página são salvos no seguinte formato: `space, page_id`. Por padrão, o arquivo é chamado `ib_buffer_pool` e está localizado no data directory do `InnoDB`. Uma localização não padrão deve ser especificada em relação ao data directory.

  Um nome de arquivo pode ser especificado em tempo de execução, usando uma instrução `SET`:

  ```sql
  SET GLOBAL innodb_buffer_pool_filename='file_name';
  ```

  Você também pode especificar um nome de arquivo na inicialização, em uma string de inicialização ou no arquivo de configuração do MySQL. Ao especificar um nome de arquivo na inicialização, o arquivo deve existir, caso contrário o `InnoDB` retorna um erro de inicialização indicando que não existe tal arquivo ou diretório.

  Para mais informações, consulte a Seção 14.8.3.6, “Salvando e Restaurando o Estado do Buffer Pool”.

* `innodb_buffer_pool_instances`

  <table frame="box" rules="all" summary="Propriedades para innodb-status-file"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb-status-file[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  O número de regiões em que o Buffer Pool do `InnoDB` é dividido. Para sistemas com Buffer Pools na faixa de multi-gigabytes, dividir o Buffer Pool em instâncias separadas pode melhorar a concorrência, reduzindo a contenção à medida que diferentes Threads leem e escrevem em páginas em cache. Cada página que é armazenada ou lida do Buffer Pool é atribuída a uma das instâncias do Buffer Pool aleatoriamente, usando uma função de hashing. Cada instância do Buffer Pool gerencia suas próprias listas livres, listas de flush, LRUs e todas as outras estruturas de dados conectadas a um Buffer Pool, e é protegida por seu próprio mutex de Buffer Pool.

  Esta opção só entra em vigor ao definir `innodb_buffer_pool_size` para 1GB ou mais. O tamanho total do Buffer Pool é dividido entre todas as instâncias do Buffer Pool. Para melhor eficiência, especifique uma combinação de `innodb_buffer_pool_instances` e `innodb_buffer_pool_size` para que cada instância do Buffer Pool tenha pelo menos 1GB.

  O valor padrão em sistemas Windows de 32 bits depende do valor de `innodb_buffer_pool_size`, conforme descrito abaixo:

  + Se `innodb_buffer_pool_size` for maior que 1.3GB, o padrão para `innodb_buffer_pool_instances` é `innodb_buffer_pool_size`/128MB, com solicitações individuais de alocação de memória para cada chunk. 1.3GB foi escolhido como o limite no qual existe um risco significativo para o Windows de 32 bits de ser incapaz de alocar o espaço de endereço contíguo necessário para um único Buffer Pool.

  + Caso contrário, o padrão é 1.

  Em todas as outras plataformas, o valor padrão é 8 quando `innodb_buffer_pool_size` é maior ou igual a 1GB. Caso contrário, o padrão é 1.

  Para informações relacionadas, consulte a Seção 14.8.3.1, “Configurando o Tamanho do Buffer Pool do InnoDB”.

* `innodb_buffer_pool_load_abort`

  <table frame="box" rules="all" summary="Propriedades para innodb-status-file"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb-status-file[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Interrompe o processo de restauração do conteúdo do Buffer Pool do `InnoDB` acionado por `innodb_buffer_pool_load_at_startup` ou `innodb_buffer_pool_load_now`.

  Habilitar `innodb_buffer_pool_load_abort` aciona a ação de aborto, mas não altera a configuração da variável, que sempre permanece `OFF` ou `0`. Para visualizar o status de carregamento do Buffer Pool após acionar uma ação de aborto, consulte a variável `Innodb_buffer_pool_load_status`.

  Para mais informações, consulte a Seção 14.8.3.6, “Salvando e Restaurando o Estado do Buffer Pool”.

* `innodb_buffer_pool_load_at_startup`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_enable_binlog"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-enable-binlog[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_enable_binlog</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Especifica que, na inicialização do servidor MySQL, o Buffer Pool do `InnoDB` é automaticamente aquecido (warmed up) carregando as mesmas páginas que continha em um momento anterior. Tipicamente usado em combinação com `innodb_buffer_pool_dump_at_shutdown`.

  Ambas as opções, `innodb_buffer_pool_dump_at_shutdown` e `innodb_buffer_pool_load_at_startup`, estão habilitadas por padrão.

  Para mais informações, consulte a Seção 14.8.3.6, “Salvando e Restaurando o Estado do Buffer Pool”.

* `innodb_buffer_pool_load_now`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_enable_binlog"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-enable-binlog[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_enable_binlog</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Aquece imediatamente o Buffer Pool do `InnoDB` carregando as páginas de dados sem esperar por uma reinicialização do servidor. Pode ser útil para trazer a memória cache de volta a um estado conhecido durante o benchmarking ou para preparar o servidor MySQL para retomar sua workload normal após executar Queries para relatórios ou manutenção.

  Habilitar `innodb_buffer_pool_load_now` aciona a ação de carregamento, mas não altera a configuração da variável, que sempre permanece `OFF` ou `0`. Para visualizar o progresso do carregamento do Buffer Pool após acionar um load, consulte a variável `Innodb_buffer_pool_load_status`.

  Para mais informações, consulte a Seção 14.8.3.6, “Salvando e Restaurando o Estado do Buffer Pool”.

* `innodb_buffer_pool_size`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_enable_binlog"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-enable-binlog[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_enable_binlog</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  O tamanho em bytes do Buffer Pool, a área de memória onde o `InnoDB` armazena dados de table e Index em cache. O valor padrão é 134217728 bytes (128MB). O valor máximo depende da arquitetura da CPU; o máximo é 4294967295 (2^32-1) em sistemas de 32 bits e 18446744073709551615 (2^64-1) em sistemas de 64 bits. Em sistemas de 32 bits, a arquitetura da CPU e o sistema operacional podem impor um tamanho máximo prático inferior ao máximo declarado. Quando o tamanho do Buffer Pool é maior que 1GB, definir `innodb_buffer_pool_instances` para um valor maior que 1 pode melhorar a escalabilidade em um servidor ocupado.

  Um Buffer Pool maior requer menos I/O de disco para acessar os mesmos dados da table mais de uma vez. Em um servidor de Database dedicado, você pode definir o tamanho do Buffer Pool para 80% da memória física da máquina. Esteja ciente dos seguintes problemas potenciais ao configurar o tamanho do Buffer Pool e esteja preparado para reduzir o tamanho do Buffer Pool, se necessário.

  + A competição pela memória física pode causar paginação no sistema operacional.

  + O `InnoDB` reserva memória adicional para Buffers e estruturas de controle, de modo que o espaço total alocado é aproximadamente 10% maior do que o tamanho do Buffer Pool especificado.

  + O espaço de endereço para o Buffer Pool deve ser contíguo, o que pode ser um problema em sistemas Windows com DLLs que carregam em endereços específicos.

  + O tempo para inicializar o Buffer Pool é aproximadamente proporcional ao seu tamanho. Em instâncias com Buffer Pools grandes, o tempo de inicialização pode ser significativo. Para reduzir o período de inicialização, você pode salvar o estado do Buffer Pool no desligamento do servidor e restaurá-lo na inicialização do servidor. Consulte a Seção 14.8.3.6, “Salvando e Restaurando o Estado do Buffer Pool”.

  Quando você aumenta ou diminui o tamanho do Buffer Pool, a operação é realizada em chunks. O tamanho do chunk é definido pela variável `innodb_buffer_pool_chunk_size`, que tem um padrão de 128 MB.

  O tamanho do Buffer Pool deve ser sempre igual ou um múltiplo de `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`. Se você alterar o tamanho do Buffer Pool para um valor que não seja igual ou um múltiplo de `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`, o tamanho do Buffer Pool é ajustado automaticamente para um valor que seja igual ou um múltiplo de `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`.

  `innodb_buffer_pool_size` pode ser definido dinamicamente, o que permite redimensionar o Buffer Pool sem reiniciar o servidor. A variável de status `Innodb_buffer_pool_resize_status` relata o status das operações de redimensionamento do Buffer Pool online. Consulte a Seção 14.8.3.1, “Configurando o Tamanho do Buffer Pool do InnoDB”, para mais informações.

* `innodb_change_buffer_max_size`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_enable_binlog"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-enable-binlog[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_enable_binlog</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Tamanho máximo para o Change Buffer do `InnoDB`, como uma porcentagem do tamanho total do Buffer Pool. Você pode aumentar este valor para um servidor MySQL com alta atividade de insert, update e delete, ou diminuí-lo para um servidor MySQL com dados imutáveis usados para relatórios. Para mais informações, consulte a Seção 14.5.2, “Change Buffer”. Para conselhos gerais sobre ajuste de I/O, consulte a Seção 8.5.8, “Otimizando I/O de Disco do InnoDB”.

* `innodb_change_buffering`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_enable_binlog"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-enable-binlog[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_enable_binlog</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Se o `InnoDB` realiza o change buffering, uma otimização que atrasa as operações de gravação em Indexes secundários para que as operações de I/O possam ser realizadas sequencialmente. Os valores permitidos são descritos na tabela a seguir.

  **Tabela 14.19 Valores Permitidos para innodb_change_buffering**

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_enable_binlog"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-enable-binlog[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_enable_binlog</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Para mais informações, consulte a Seção 14.5.2, “Change Buffer”. Para conselhos gerais sobre ajuste de I/O, consulte a Seção 8.5.8, “Otimizando I/O de Disco do InnoDB”.

* `innodb_change_buffering_debug`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_enable_binlog"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-enable-binlog[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_enable_binlog</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Define um flag de Debug para o change buffering do `InnoDB`. Um valor de 1 força todas as alterações para o Change Buffer. Um valor de 2 causa uma saída inesperada no merge. Um valor padrão de 0 indica que o flag de Debug do change buffering não está definido. Esta opção só está disponível se o suporte a Debug for compilado usando a opção **CMake** `WITH_DEBUG`.

* `innodb_checksum_algorithm`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_enable_binlog"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-enable-binlog[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_enable_binlog</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Especifica como gerar e verificar o checksum armazenado nos blocos de disco dos tablespaces do `InnoDB`. `crc32` é o valor padrão a partir do MySQL 5.7.7.

  `innodb_checksum_algorithm` substitui a opção `innodb_checksums`. Os seguintes valores foram fornecidos para compatibilidade, até e incluindo o MySQL 5.7.6:

  + `innodb_checksums=ON` é o mesmo que `innodb_checksum_algorithm=innodb`.

  + `innodb_checksums=OFF` é o mesmo que `innodb_checksum_algorithm=none`.

  A partir do MySQL 5.7.7, com um valor padrão de `innodb_checksum_algorithm` igual a `crc32`, `innodb_checksums=ON` agora é o mesmo que `innodb_checksum_algorithm=crc32`. `innodb_checksums=OFF` ainda é o mesmo que `innodb_checksum_algorithm=none`.

  Para evitar conflitos, remova referências a `innodb_checksums` dos arquivos de configuração e scripts de inicialização do MySQL.

  O valor `innodb` é backward-compatible com versões anteriores do MySQL. O valor `crc32` usa um algoritmo mais rápido para calcular o checksum para cada bloco modificado e para verificar os checksums para cada leitura de disco. Ele escaneia blocos de 64 bits por vez, o que é mais rápido do que o algoritmo de checksum `innodb`, que escaneia blocos de 8 bits por vez. O valor `none` escreve um valor constante no campo de checksum em vez de calcular um valor baseado nos dados do bloco. Os blocos em um tablespace podem usar uma mistura de valores de checksum antigos, novos e nulos, sendo atualizados gradualmente à medida que os dados são modificados; uma vez que os blocos em um tablespace são modificados para usar o algoritmo `crc32`, as tabelas associadas não podem ser lidas por versões anteriores do MySQL.

  A forma estrita de um algoritmo de checksum reporta um erro se encontrar um valor de checksum válido, mas não correspondente, em um tablespace. Recomenda-se que você use configurações estritas apenas em uma nova instância, para configurar os tablespaces pela primeira vez. As configurações estritas são um pouco mais rápidas, porque não precisam calcular todos os valores de checksum durante as leituras de disco.

  Note

  Antes do MySQL 5.7.8, uma configuração de modo estrito para `innodb_checksum_algorithm` fazia com que o `InnoDB` parasse ao encontrar um checksum *válido* mas não correspondente. No MySQL 5.7.8 e posterior, apenas uma mensagem de erro é impressa, e a página é aceita como válida se tiver um checksum `innodb`, `crc32` ou `none` válido.

  A tabela a seguir mostra a diferença entre os valores de opção `none`, `innodb` e `crc32`, e suas contrapartes estritas. `none`, `innodb` e `crc32` escrevem o tipo especificado de valor de checksum em cada bloco de dados, mas para compatibilidade aceitam outros valores de checksum ao verificar um bloco durante uma operação de leitura. As configurações estritas também aceitam valores de checksum válidos, mas imprimem uma mensagem de erro quando um valor de checksum válido não correspondente é encontrado. Usar a forma estrita pode tornar a verificação mais rápida se todos os arquivos de dados do `InnoDB` em uma instância forem criados sob um valor `innodb_checksum_algorithm` idêntico.

  **Tabela 14.20 Valores Permitidos para innodb_checksum_algorithm**

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_enable_binlog"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-enable-binlog[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_enable_binlog</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Versões do MySQL Enterprise Backup até 3.8.0 não suportam backup de tablespaces que usam checksums CRC32. O MySQL Enterprise Backup adiciona suporte a checksum CRC32 na versão 3.8.1, com algumas limitações. Consulte o Histórico de Alterações do MySQL Enterprise Backup 3.8.1 para mais informações.

* `innodb_checksums`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_enable_binlog"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-enable-binlog[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_enable_binlog</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  O `InnoDB` pode usar a validação de checksum em todas as páginas de tablespace lidas do disco para garantir tolerância a falhas extra contra falhas de hardware ou arquivos de dados corrompidos. Esta validação é habilitada por padrão. Em circunstâncias especializadas (como ao executar benchmarks) este recurso de segurança pode ser desabilitado com `--skip-innodb-checksums`. Você pode especificar o método de cálculo do checksum usando a opção `innodb_checksum_algorithm`.

  `innodb_checksums` está descontinuada, substituída por `innodb_checksum_algorithm`.

  Antes do MySQL 5.7.7, `innodb_checksums=ON` é o mesmo que `innodb_checksum_algorithm=innodb`. A partir do MySQL 5.7.7, o valor padrão de `innodb_checksum_algorithm` é `crc32`, e `innodb_checksums=ON` é o mesmo que `innodb_checksum_algorithm=crc32`. `innodb_checksums=OFF` é o mesmo que `innodb_checksum_algorithm=none`.

  Remova quaisquer opções `innodb_checksums` de seus arquivos de configuração e scripts de inicialização para evitar conflitos com `innodb_checksum_algorithm`. `innodb_checksums=OFF` define automaticamente `innodb_checksum_algorithm=none`. `innodb_checksums=ON` é ignorado e sobrescrito por qualquer outra configuração para `innodb_checksum_algorithm`.

* `innodb_cmp_per_index_enabled`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_engine_lib_name"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-engine-lib-name=file_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_engine_lib_name</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Habilita estatísticas relacionadas à compressão por Index na tabela `INNODB_CMP_PER_INDEX` do Information Schema. Como essas estatísticas podem ser caras de coletar, habilite esta opção apenas em instâncias de desenvolvimento, teste ou replica durante o ajuste de performance relacionado a tabelas comprimidas do `InnoDB`.

  Para mais informações, consulte a Seção 24.4.7, “As Tabelas INFORMATION_SCHEMA INNODB_CMP_PER_INDEX e INNODB_CMP_PER_INDEX_RESET”, e a Seção 14.9.1.4, “Monitorando a Compressão de Tabela do InnoDB em Tempo de Execução”.

* `innodb_commit_concurrency`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_engine_lib_name"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-engine-lib-name=file_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_engine_lib_name</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  O número de Threads que podem fazer commit ao mesmo tempo. Um valor de 0 (o padrão) permite que qualquer número de transactions faça commit simultaneamente.

  O valor de `innodb_commit_concurrency` não pode ser alterado em tempo de execução de zero para não zero ou vice-versa. O valor pode ser alterado de um valor não zero para outro.

* `innodb_compress_debug`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_engine_lib_name"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-engine-lib-name=file_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_engine_lib_name</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Comprime todas as tabelas usando um algoritmo de compressão especificado sem ter que definir um atributo `COMPRESSION` para cada table. Esta opção só está disponível se o suporte a Debug for compilado usando a opção **CMake** `WITH_DEBUG`.

  Para informações relacionadas, consulte a Seção 14.9.2, “Compressão de Página do InnoDB”.

* `innodb_compression_failure_threshold_pct`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_engine_lib_name"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-engine-lib-name=file_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_engine_lib_name</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Define o limite percentual de taxa de falha de compressão para uma table, momento em que o MySQL começa a adicionar padding dentro das páginas comprimidas para evitar falhas de compressão caras. Quando este limite é ultrapassado, o MySQL começa a deixar espaço livre adicional dentro de cada nova página comprimida, ajustando dinamicamente a quantidade de espaço livre até a porcentagem do tamanho da página especificada por `innodb_compression_pad_pct_max`. Um valor de zero desabilita o mecanismo que monitora a eficiência da compressão e ajusta dinamicamente a quantidade de padding.

  Para mais informações, consulte a Seção 14.9.1.6, “Compressão para Workloads OLTP”.

* `innodb_compression_level`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_engine_lib_name"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-engine-lib-name=file_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_engine_lib_name</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Especifica o nível de compressão zlib a ser usado para tabelas e Indexes comprimidos do `InnoDB`. Um valor mais alto permite que você insira mais dados em um dispositivo de armazenamento, à custa de mais sobrecarga de CPU durante a compressão. Um valor mais baixo permite que você reduza a sobrecarga de CPU quando o espaço de armazenamento não é crítico, ou você espera que os dados não sejam especialmente compressíveis.

  Para mais informações, consulte a Seção 14.9.1.6, “Compressão para Workloads OLTP”.

* `innodb_compression_pad_pct_max`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_engine_lib_name"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-engine-lib-name=file_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_engine_lib_name</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Especifica a porcentagem máxima que pode ser reservada como espaço livre dentro de cada página comprimida, permitindo espaço para reorganizar os dados e o log de modificação dentro da página quando uma table ou Index comprimido é atualizado e os dados podem ser recomprimidos. Aplica-se apenas quando `innodb_compression_failure_threshold_pct` está definido para um valor não zero, e a taxa de falhas de compressão ultrapassa o ponto de corte.

  Para mais informações, consulte a Seção 14.9.1.6, “Compressão para Workloads OLTP”.

* `innodb_concurrency_tickets`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_engine_lib_name"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-engine-lib-name=file_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_engine_lib_name</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Determina o número de Threads que podem entrar no `InnoDB` concorrentemente. Um Thread é colocado em uma fila quando tenta entrar no `InnoDB` se o número de Threads já atingiu o limite de concorrência. Quando um Thread é permitido entrar no `InnoDB`, ele recebe um número de “tickets” igual ao valor de `innodb_concurrency_tickets`, e o Thread pode entrar e sair do `InnoDB` livremente até que tenha esgotado seus tickets. Depois disso, o Thread novamente se torna sujeito à verificação de concorrência (e possível enfileiramento) na próxima vez que tentar entrar no `InnoDB`. O valor padrão é 5000.

  Com um valor pequeno de `innodb_concurrency_tickets`, transactions pequenas que só precisam processar algumas rows competem de forma justa com transactions maiores que processam muitas rows. A desvantagem de um valor pequeno de `innodb_concurrency_tickets` é que transactions grandes devem passar pela fila muitas vezes antes de poderem ser concluídas, o que estende a quantidade de tempo necessária para completar sua tarefa.

  Com um valor grande de `innodb_concurrency_tickets`, transactions grandes gastam menos tempo esperando por uma posição no final da fila (controlada por `innodb_thread_concurrency`) e mais tempo recuperando rows. Transactions grandes também exigem menos viagens pela fila para completar sua tarefa. A desvantagem de um valor grande de `innodb_concurrency_tickets` é que muitas transactions grandes rodando ao mesmo tempo podem privar transactions menores, fazendo-as esperar mais tempo antes de executar.

  Com um valor `innodb_thread_concurrency` não zero, você pode precisar ajustar o valor de `innodb_concurrency_tickets` para cima ou para baixo para encontrar o equilíbrio ideal entre transactions maiores e menores. O relatório `SHOW ENGINE INNODB STATUS` mostra o número de tickets restantes para uma transaction em execução em sua passagem atual pela fila. Esses dados também podem ser obtidos da coluna `TRX_CONCURRENCY_TICKETS` da tabela `INNODB_TRX` do Information Schema.

  Para mais informações, consulte a Seção 14.8.5, “Configurando a Concorrência de Threads para o InnoDB”.

* `innodb_data_file_path`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_engine_lib_name"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-engine-lib-name=file_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_engine_lib_name</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Define o nome, tamanho e atributos dos arquivos de dados do tablespace de sistema do `InnoDB`. Se você não especificar um valor para `innodb_data_file_path`, o comportamento padrão é criar um único arquivo de dados com auto-extensão, um pouco maior que 12MB, chamado `ibdata1`.

  A sintaxe completa para uma especificação de arquivo de dados inclui o nome do arquivo, tamanho do arquivo, atributo `autoextend` e atributo `max`:

  ```sql
  file_name:file_size[:autoextend[:max:max_file_size
  ```

  Os tamanhos de arquivo são especificados em kilobytes, megabytes ou gigabytes anexando `K`, `M` ou `G` ao valor do tamanho. Se estiver especificando o tamanho do arquivo de dados em kilobytes, faça-o em múltiplos de 1024. Caso contrário, os valores em KB são arredondados para o limite de megabytes (MB) mais próximo. A soma dos tamanhos dos arquivos deve ser, no mínimo, um pouco maior que 12MB.

  Para informações adicionais de configuração, consulte Configuração do Arquivo de Dados do Tablespace do Sistema. Para instruções de redimensionamento, consulte Redimensionando o Tablespace do Sistema.

* `innodb_data_home_dir`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_engine_lib_name"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-engine-lib-name=file_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_engine_lib_name</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  A parte comum do path do diretório para os arquivos de dados do tablespace de sistema do `InnoDB`. O valor padrão é o `data` directory do MySQL. A configuração é concatenada com a configuração `innodb_data_file_path`. Se você especificar o valor como uma string vazia, você pode especificar um path absoluto para `innodb_data_file_path`.

  Uma barra final (trailing slash) é necessária ao especificar um valor para `innodb_data_home_dir`. Por exemplo:

  ```sql
  [mysqld]
  innodb_data_home_dir = /path/to/myibdata/
  ```

  Esta configuração não afeta a localização dos tablespaces file-per-table.

  Para informações relacionadas, consulte a Seção 14.8.1, “Configuração de Inicialização do InnoDB”.

* `innodb_deadlock_detect`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_engine_lib_name"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-engine-lib-name=file_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_engine_lib_name</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Esta opção é usada para desabilitar a detecção de Deadlock. Em sistemas de alta concorrência, a detecção de Deadlock pode causar uma lentidão quando vários Threads esperam pelo mesmo Lock. Às vezes, pode ser mais eficiente desabilitar a detecção de Deadlock e confiar na configuração `innodb_lock_wait_timeout` para rollback de transactions quando um Deadlock ocorre.

  Para informações relacionadas, consulte a Seção 14.7.5.2, “Detecção de Deadlock”.

* `innodb_default_row_format`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_engine_lib_path"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-engine-lib-path=dir_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_engine_lib_path</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  A opção `innodb_default_row_format` define o formato de row padrão para tabelas `InnoDB` e tabelas temporárias criadas pelo usuário. A configuração padrão é `DYNAMIC`. Outros valores permitidos são `COMPACT` e `REDUNDANT`. O formato de row `COMPRESSED`, que não é suportado para uso no tablespace do sistema, não pode ser definido como padrão.

  Tabelas recém-criadas usam o formato de row definido por `innodb_default_row_format` quando uma opção `ROW_FORMAT` não é especificada explicitamente ou quando `ROW_FORMAT=DEFAULT` é usado.

  Quando uma opção `ROW_FORMAT` não é especificada explicitamente ou quando `ROW_FORMAT=DEFAULT` é usado, qualquer operação que reconstrua uma table também altera silenciosamente o formato de row da table para o formato definido por `innodb_default_row_format`. Para mais informações, consulte Definindo o Formato de Row de uma Tabela.

  As tabelas temporárias internas do `InnoDB` criadas pelo servidor para processar Queries usam o formato de row `DYNAMIC`, independentemente da configuração `innodb_default_row_format`.

* `innodb_disable_sort_file_cache`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_engine_lib_path"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-engine-lib-path=dir_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_engine_lib_path</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  Desabilita o cache do sistema de arquivos do sistema operacional para arquivos temporários de merge-sort. O efeito é abrir tais arquivos com o equivalente de `O_DIRECT`.

* `innodb_disable_resize_buffer_pool_debug`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_engine_lib_path"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-engine-lib-path=dir_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_engine_lib_path</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  Desabilita o redimensionamento do Buffer Pool do `InnoDB`. Esta opção só está disponível se o suporte a Debug for compilado usando a opção **CMake** `WITH_DEBUG`.

* `innodb_doublewrite`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_engine_lib_path"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-engine-lib-path=dir_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_engine_lib_path</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  Quando habilitado (o padrão), o `InnoDB` armazena todos os dados duas vezes, primeiro no doublewrite buffer, e depois nos arquivos de dados reais. Esta variável pode ser desativada com `--skip-innodb-doublewrite` para benchmarks ou casos em que o desempenho máximo é necessário em vez da preocupação com a integridade dos dados ou possíveis falhas.

  Se os arquivos de dados do tablespace do sistema (arquivos `ibdata*`) estiverem localizados em dispositivos Fusion-io que suportam atomic writes, o doublewrite buffering é automaticamente desabilitado e atomic writes do Fusion-io são usados para todos os arquivos de dados. Como a configuração do doublewrite buffer é global, o doublewrite buffering também é desabilitado para arquivos de dados que residem em hardware não Fusion-io. Este recurso é suportado apenas em hardware Fusion-io e habilitado apenas para Fusion-io NVMFS no Linux. Para tirar o máximo proveito deste recurso, é recomendada uma configuração de `innodb_flush_method` de `O_DIRECT`.

  Para informações relacionadas, consulte a Seção 14.6.5, “Doublewrite Buffer”.

* `innodb_fast_shutdown`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_engine_lib_path"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-engine-lib-path=dir_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_engine_lib_path</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  O modo de desligamento do `InnoDB`. Se o valor for 0, o `InnoDB` realiza um desligamento lento (slow shutdown), um purge completo e um merge do Change Buffer antes de desligar. Se o valor for 1 (o padrão), o `InnoDB` ignora essas operações no desligamento, um processo conhecido como desligamento rápido (fast shutdown). Se o valor for 2, o `InnoDB` faz flush de seus logs e desliga "frio" (cold), como se o MySQL tivesse travado (crashed); nenhuma transaction com commit é perdida, mas a operação de crash recovery fará com que a próxima inicialização demore mais.

  O desligamento lento pode levar minutos, ou até horas em casos extremos onde quantidades substanciais de dados ainda estão em Buffer. Use a técnica de desligamento lento antes de fazer upgrade ou downgrade entre major releases do MySQL, para que todos os arquivos de dados estejam totalmente preparados caso o processo de upgrade atualize o formato do arquivo.

  Use `innodb_fast_shutdown=2` em situações de emergência ou solução de problemas, para obter o desligamento absolutamente mais rápido se os dados estiverem em risco de corrupção.

* `innodb_fil_make_page_dirty_debug`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_engine_lib_path"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-engine-lib-path=dir_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_engine_lib_path</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  Por padrão, definir `innodb_fil_make_page_dirty_debug` para o ID de um tablespace imediatamente torna suja (dirty) a primeira página do tablespace. Se `innodb_saved_page_number_debug` estiver definido para um valor não padrão, definir `innodb_fil_make_page_dirty_debug` torna suja a página especificada. A opção `innodb_fil_make_page_dirty_debug` só está disponível se o suporte a Debug for compilado usando a opção **CMake** `WITH_DEBUG`.

* `innodb_file_format`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_engine_lib_path"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-engine-lib-path=dir_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_engine_lib_path</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  Habilita um formato de arquivo `InnoDB` para tablespaces file-per-table. Os formatos de arquivo suportados são `Antelope` e `Barracuda`. `Antelope` é o formato de arquivo `InnoDB` original, que suporta os formatos de row `REDUNDANT` e `COMPACT`. `Barracuda` é o formato de arquivo mais recente, que suporta os formatos de row `COMPRESSED` e `DYNAMIC`.

  Os formatos de row `COMPRESSED` e `DYNAMIC` habilitam importantes recursos de armazenamento para tabelas `InnoDB`. Consulte a Seção 14.11, “Formatos de Row do InnoDB”.

  Alterar a configuração `innodb_file_format` não afeta o formato de arquivo dos arquivos de tablespace `InnoDB` existentes.

  A configuração `innodb_file_format` não se aplica a tablespaces gerais, que suportam tabelas de todos os formatos de row. Consulte a Seção 14.6.3.3, “Tablespaces Gerais”.

  O valor padrão de `innodb_file_format` foi alterado para `Barracuda` no MySQL 5.7.

  A configuração `innodb_file_format` é ignorada ao criar tabelas que usam o formato de row `DYNAMIC`. Uma table criada usando o formato de row `DYNAMIC` sempre usa o formato de arquivo `Barracuda`, independentemente da configuração `innodb_file_format`. Para usar o formato de row `COMPRESSED`, `innodb_file_format` deve ser definido como `Barracuda`.

  A opção `innodb_file_format` está descontinuada; espere que seja removida em uma futura versão. O propósito da opção `innodb_file_format` era permitir que os usuários fizessem downgrade para a versão embutida do `InnoDB` em versões anteriores do MySQL. Agora que essas versões do MySQL atingiram o fim de seus ciclos de vida de produto, o suporte a downgrade fornecido por esta opção não é mais necessário.

  Para mais informações, consulte a Seção 14.10, “Gerenciamento do Formato de Arquivo do InnoDB”.

* `innodb_file_format_check`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_engine_lib_path"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-engine-lib-path=dir_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_engine_lib_path</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  Esta variável pode ser definida como 1 ou 0 na inicialização do servidor para habilitar ou desabilitar se o `InnoDB` verifica o tag de formato de arquivo no tablespace do sistema (por exemplo, `Antelope` ou `Barracuda`). Se o tag for verificado e for superior ao suportado pela versão atual do `InnoDB`, ocorre um erro e o `InnoDB` não inicia. Se o tag não for superior, o `InnoDB` define o valor de `innodb_file_format_max` para o tag do formato de arquivo.

  Note

  Apesar de o valor padrão ser às vezes exibido como `ON` ou `OFF`, sempre use os valores numéricos 1 ou 0 para ligar ou desligar esta opção em seu arquivo de configuração ou string de linha de comando.

  Para mais informações, consulte a Seção 14.10.2.1, “Verificação de Compatibilidade Quando o InnoDB é Iniciado”.

  A opção `innodb_file_format_check` está descontinuada juntamente com a opção `innodb_file_format`. Você deve esperar que ambas as opções sejam removidas em uma futura versão.

* `innodb_file_format_max`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_engine_lib_path"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-engine-lib-path=dir_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_engine_lib_path</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  Na inicialização do servidor, o `InnoDB` define o valor desta variável para o tag de formato de arquivo no tablespace do sistema (por exemplo, `Antelope` ou `Barracuda`). Se o servidor criar ou abrir uma table com um formato de arquivo “superior”, ele define o valor de `innodb_file_format_max` para esse formato.

  Para informações relacionadas, consulte a Seção 14.10, “Gerenciamento do Formato de Arquivo do InnoDB”.

  A opção `innodb_file_format_max` está descontinuada juntamente com a opção `innodb_file_format`. Você deve esperar que ambas as opções sejam removidas em uma futura versão.

* `innodb_file_per_table`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_engine_lib_path"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-engine-lib-path=dir_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_engine_lib_path</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  Quando `innodb_file_per_table` está habilitado, as tabelas são criadas em tablespaces file-per-table por padrão. Quando desabilitado, as tabelas são criadas no tablespace do sistema por padrão. Para informações sobre tablespaces file-per-table, consulte a Seção 14.6.3.2, “Tablespaces File-Per-Table”. Para informações sobre o tablespace do sistema `InnoDB`, consulte a Seção 14.6.3.1, “O Tablespace do Sistema”.

  A variável `innodb_file_per_table` pode ser configurada em tempo de execução usando uma instrução `SET GLOBAL`, especificada na linha de comando na inicialização ou especificada em um arquivo de opções. A configuração em tempo de execução requer privilégios suficientes para definir variáveis de sistema globais (consulte a Seção 5.1.8.1, “Privilégios de Variáveis de Sistema”) e afeta imediatamente a operação de todas as conexões que se conectarem subsequentemente.

  Quando uma table que reside em um tablespace file-per-table é truncada ou descartada (dropped), o espaço liberado é retornado ao sistema operacional. Truncar ou descartar uma table que reside no tablespace do sistema apenas libera espaço no tablespace do sistema. O espaço liberado no tablespace do sistema pode ser usado novamente para dados do `InnoDB`, mas não é retornado ao sistema operacional, pois os arquivos de dados do tablespace do sistema nunca encolhem.

  Quando `innodb_file_per_table` está habilitado, uma operação `ALTER TABLE` de cópia de table em uma table que reside no tablespace do sistema implicitamente recria a table em um tablespace file-per-table. Para evitar que isso ocorra, desabilite `innodb_file_per_table` antes de executar operações `ALTER TABLE` de cópia de table em tabelas que residem no tablespace do sistema.

  A configuração `innodb_file_per_table` não afeta a criação de tabelas temporárias. As tabelas temporárias são criadas no tablespace temporário. Consulte a Seção 14.6.3.5, “O Tablespace Temporário”.

* `innodb_fill_factor`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_option"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-option=options</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_option</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O `InnoDB` realiza um bulk load ao criar ou reconstruir Indexes. Este método de criação de Index é conhecido como “construção de Index ordenada” (sorted Index build).

  `innodb_fill_factor` define a porcentagem de espaço em cada página B-tree que é preenchida durante uma construção de Index ordenada, com o espaço restante reservado para futuro crescimento do Index. Por exemplo, definir `innodb_fill_factor` para 80 reserva 20% do espaço em cada página B-tree para futuro crescimento do Index. As porcentagens reais podem variar. A configuração `innodb_fill_factor` é interpretada como uma sugestão em vez de um limite rígido.

  Uma configuração `innodb_fill_factor` de 100 deixa 1/16 do espaço nas páginas de Index clusterizado livre para futuro crescimento do Index.

  `innodb_fill_factor` se aplica tanto às páginas folha quanto às páginas não folha do B-tree. Não se aplica a páginas externas usadas para entradas `TEXT` ou `BLOB`.

  Para mais informações, consulte a Seção 14.6.2.3, “Construções de Índice Ordenadas”.

* `innodb_flush_log_at_timeout`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_option"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-option=options</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_option</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr> </tbody></table>

  Escreve e faz flush dos logs a cada *`N`* segundos. `innodb_flush_log_at_timeout` permite que o período de timeout entre flushes seja aumentado para reduzir o flushing e evitar impactar a performance do group commit do binary log. A configuração padrão para `innodb_flush_log_at_timeout` é uma vez por segundo.

* `innodb_flush_log_at_trx_commit`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_option"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-option=options</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_option</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr> </tbody></table>

  Controla o equilíbrio entre a estrita conformidade ACID para operações de commit e a maior performance que é possível quando as operações de I/O relacionadas ao commit são reorganizadas e feitas em batches. Você pode alcançar melhor performance alterando o valor padrão, mas pode perder transactions em caso de falha.

  + A configuração padrão de 1 é necessária para total conformidade ACID. Logs são escritos e submetidos a flush no disco a cada commit de transaction.

  + Com uma configuração de 0, os logs são escritos e submetidos a flush no disco uma vez por segundo. Transactions para as quais os logs não foram submetidos a flush podem ser perdidas em caso de falha.

  + Com uma configuração de 2, os logs são escritos após cada commit de transaction e submetidos a flush no disco uma vez por segundo. Transactions para as quais os logs não foram submetidos a flush podem ser perdidas em caso de falha.

  + Para as configurações 0 e 2, o flushing uma vez por segundo não é 100% garantido. O flushing pode ocorrer com mais frequência devido a alterações DDL e outras atividades internas do `InnoDB` que causam o flush dos logs independentemente da configuração `innodb_flush_log_at_trx_commit`, e às vezes com menos frequência devido a problemas de agendamento. Se os logs forem submetidos a flush uma vez por segundo, até um segundo de transactions pode ser perdido em caso de falha. Se os logs forem submetidos a flush com mais ou menos frequência do que uma vez por segundo, a quantidade de transactions que pode ser perdida varia de acordo.

  + A frequência de flushing do log é controlada por `innodb_flush_log_at_timeout`, que permite definir a frequência de flushing do log para *`N`* segundos (onde *`N`* é `1 ... 2700`, com um valor padrão de 1). No entanto, qualquer saída inesperada do processo **mysqld** pode apagar até *`N`* segundos de transactions.

  + Alterações DDL e outras atividades internas do `InnoDB` submetem o log a flush independentemente da configuração `innodb_flush_log_at_trx_commit`.

  + O crash recovery do `InnoDB` funciona independentemente da configuração `innodb_flush_log_at_trx_commit`. As transactions são aplicadas inteiramente ou apagadas inteiramente.

  Para durabilidade e consistência em uma configuração de Replication que usa `InnoDB` com transactions:

  + Se o binary logging estiver habilitado, defina `sync_binlog=1`.

  + Sempre defina `innodb_flush_log_at_trx_commit=1`.

  Para obter informações sobre a combinação de configurações em uma replica que seja mais resiliente a paradas inesperadas, consulte a Seção 16.3.2, “Lidando com uma Parada Inesperada de uma Replica”.

  Cuidado

  Muitos sistemas operacionais e alguns hardwares de disco enganam a operação de flush-to-disk. Eles podem informar ao **mysqld** que o flush ocorreu, mesmo que não tenha. Neste caso, a durabilidade das transactions não é garantida mesmo com as configurações recomendadas e, no pior dos casos, uma falta de energia pode corromper os dados do `InnoDB`. Usar um disk cache com bateria no controlador de disco SCSI ou no próprio disco acelera os flushes de arquivo e torna a operação mais segura. Você também pode tentar desabilitar o caching de escritas de disco em caches de hardware.

* `innodb_flush_method`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_option"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-option=options</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_option</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr> </tbody></table>

  Define o método usado para fazer flush de dados para arquivos de dados e log files do `InnoDB`, o que pode afetar o throughput de I/O.

  Se `innodb_flush_method` for definido como `NULL` em um sistema tipo Unix, a opção `fsync` é usada por padrão. Se `innodb_flush_method` for definido como `NULL` no Windows, a opção `async_unbuffered` é usada por padrão.

  As opções de `innodb_flush_method` para sistemas tipo Unix incluem:

  + `fsync`: O `InnoDB` usa a chamada de sistema `fsync()` para fazer flush tanto dos arquivos de dados quanto dos log files. `fsync` é a configuração padrão.

  + `O_DSYNC`: O `InnoDB` usa `O_SYNC` para abrir e fazer flush dos log files, e `fsync()` para fazer flush dos arquivos de dados. O `InnoDB` não usa `O_DSYNC` diretamente porque tem havido problemas com ele em muitas variedades de Unix.

  + `littlesync`: Esta opção é usada para testes internos de performance e atualmente não é suportada. Use por sua conta e risco.

  + `nosync`: Esta opção é usada para testes internos de performance e atualmente não é suportada. Use por sua conta e risco.

  + `O_DIRECT`: O `InnoDB` usa `O_DIRECT` (ou `directio()` no Solaris) para abrir os arquivos de dados, e usa `fsync()` para fazer flush tanto dos arquivos de dados quanto dos log files. Esta opção está disponível em algumas versões GNU/Linux, FreeBSD e Solaris.

  + `O_DIRECT_NO_FSYNC`: O `InnoDB` usa `O_DIRECT` durante o flushing de I/O, mas ignora a chamada de sistema `fsync()` após cada operação de escrita.

    Antes do MySQL 5.7.25, esta configuração não é adequada para sistemas de arquivos como XFS e EXT4, que exigem uma chamada de sistema `fsync()` para sincronizar alterações nos metadados do sistema de arquivos. Se você não tiver certeza se seu sistema de arquivos requer uma chamada de sistema `fsync()` para sincronizar alterações nos metadados do sistema de arquivos, use `O_DIRECT` em vez disso.

    A partir do MySQL 5.7.25, `fsync()` é chamado após a criação de um novo arquivo, após aumentar o tamanho do arquivo e após fechar um arquivo, para garantir que as alterações nos metadados do sistema de arquivos sejam sincronizadas. A chamada de sistema `fsync()` ainda é ignorada após cada operação de escrita.

    A perda de dados é possível se os arquivos de redo log e os arquivos de dados residirem em dispositivos de armazenamento diferentes, e ocorrer uma saída inesperada antes que as escritas do arquivo de dados sejam submetidas a flush de um cache de dispositivo que não seja suportado por bateria. Se você usar ou pretender usar dispositivos de armazenamento diferentes para arquivos de redo log e arquivos de dados, e seus arquivos de dados residirem em um dispositivo com um cache que não é suportado por bateria, use `O_DIRECT` em vez disso.

  As opções de `innodb_flush_method` para sistemas Windows incluem:

  + `async_unbuffered`: O `InnoDB` usa I/O assíncrono do Windows e I/O não buffered. `async_unbuffered` é a configuração padrão em sistemas Windows.

    Executar o servidor MySQL em um disco rígido com setor de 4K no Windows não é suportado com `async_unbuffered`. A solução alternativa é usar `innodb_flush_method=normal`.

  + `normal`: O `InnoDB` usa I/O assíncrono simulado e I/O buffered.

  + `unbuffered`: O `InnoDB` usa I/O assíncrono simulado e I/O não buffered.

  Como cada configuração afeta a performance depende da configuração do hardware e da workload. Faça benchmark de sua configuração particular para decidir qual configuração usar, ou se deve manter a configuração padrão. Examine a variável de status `Innodb_data_fsyncs` para ver o número total de chamadas `fsync()` para cada configuração. A mistura de operações de leitura e escrita em sua workload pode afetar o desempenho de uma configuração. Por exemplo, em um sistema com um controlador RAID de hardware e write cache suportado por bateria, `O_DIRECT` pode ajudar a evitar double buffering entre o Buffer Pool do `InnoDB` e o cache do sistema de arquivos do sistema operacional. Em alguns sistemas onde os arquivos de dados e log do `InnoDB` estão localizados em uma SAN, o valor padrão ou `O_DSYNC` pode ser mais rápido para uma workload com muitas leituras e predominantemente instruções `SELECT`. Sempre teste este parâmetro com hardware e workload que reflitam seu ambiente de produção. Para conselhos gerais sobre ajuste de I/O, consulte a Seção 8.5.8, “Otimizando I/O de Disco do InnoDB”.

* `innodb_flush_neighbors`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_option"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-option=options</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_option</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr> </tbody></table>

  Especifica se o flush de uma página do Buffer Pool do `InnoDB` também faz flush de outras dirty pages no mesmo extent.

  + Uma configuração de 0 desabilita `innodb_flush_neighbors`. Dirty pages no mesmo extent não são submetidas a flush.

  + A configuração padrão de 1 faz flush de páginas contíguas sujas no mesmo extent.

  + Uma configuração de 2 faz flush de dirty pages no mesmo extent.

  Quando os dados da table são armazenados em um dispositivo de armazenamento HDD tradicional, fazer flush de tais páginas vizinhas em uma operação reduz a sobrecarga de I/O (principalmente para operações de busca em disco) em comparação com o flush de páginas individuais em momentos diferentes. Para dados de table armazenados em SSD, o tempo de busca não é um fator significativo e você pode desativar esta configuração para distribuir as operações de escrita. Para informações relacionadas, consulte a Seção 14.8.3.5, “Configurando o Flushing do Buffer Pool”.

* `innodb_flush_sync`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_option"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-option=options</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_option</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr> </tbody></table>

  A variável `innodb_flush_sync`, que está habilitada por padrão, faz com que a configuração `innodb_io_capacity` seja ignorada durante picos de atividade de I/O que ocorrem em checkpoints. Para aderir à taxa de I/O definida pela configuração `innodb_io_capacity`, desabilite `innodb_flush_sync`.

  Para obter informações sobre como configurar a variável `innodb_flush_sync`, consulte a Seção 14.8.8, “Configurando a Capacidade de I/O do InnoDB”.

* `innodb_flushing_avg_loops`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_option"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-option=options</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_option</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr> </tbody></table>

  Número de iterações para as quais o `InnoDB` mantém o snapshot calculado anteriormente do estado de flushing, controlando a rapidez com que o flushing adaptativo responde às workloads em mudança. Aumentar o valor faz com que a taxa de operações de flush mude de forma suave e gradual à medida que a workload muda. Diminuir o valor faz com que o flushing adaptativo se ajuste rapidamente às mudanças de workload, o que pode causar picos na atividade de flushing se a workload aumentar e diminuir repentinamente.

  Para informações relacionadas, consulte a Seção 14.8.3.5, “Configurando o Flushing do Buffer Pool”.

* `innodb_force_load_corrupted`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_option"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-option=options</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_option</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr> </tbody></table>

  Permite que o `InnoDB` carregue tabelas na inicialização que estão marcadas como corrompidas. Use apenas durante a solução de problemas, para recuperar dados que de outra forma estariam inacessíveis. Quando a solução de problemas estiver completa, desabilite esta configuração e reinicie o servidor.

* `innodb_force_recovery`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_option"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-option=options</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_option</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr> </tbody></table>

  O modo de crash recovery, tipicamente alterado apenas em situações sérias de solução de problemas. Os valores possíveis são de 0 a 6. Para os significados desses valores e informações importantes sobre `innodb_force_recovery`, consulte a Seção 14.22.2, “Forçando a Recuperação do InnoDB”.

  Aviso

  Defina esta variável para um valor maior que 0 apenas em uma situação de emergência para que você possa iniciar o `InnoDB` e despejar suas tabelas. Como medida de segurança, o `InnoDB` impede operações `INSERT`, `UPDATE` ou `DELETE` quando `innodb_force_recovery` é maior que 0. Uma configuração `innodb_force_recovery` de 4 ou maior coloca o `InnoDB` em modo read-only.

  Estas restrições podem fazer com que comandos de administração de Replication falhem com um erro porque as configurações de Replication como `relay_log_info_repository=TABLE` e `master_info_repository=TABLE` armazenam informações em tabelas `InnoDB`.

* `innodb_ft_aux_table`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_option"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-option=options</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_option</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr> </tbody></table>

  Especifica o nome qualificado de uma table `InnoDB` contendo um Index `FULLTEXT`. Esta variável é destinada a fins de diagnóstico e só pode ser definida em tempo de execução. Por exemplo:

  ```sql
  SET GLOBAL innodb_ft_aux_table = 'test/t1';
  ```

  Depois de definir esta variável para um nome no formato `db_name/table_name`, as tabelas `INFORMATION_SCHEMA` `INNODB_FT_INDEX_TABLE`, `INNODB_FT_INDEX_CACHE`, `INNODB_FT_CONFIG`, `INNODB_FT_DELETED` e `INNODB_FT_BEING_DELETED` mostram informações sobre o Index de busca para a table especificada.

  Para mais informações, consulte a Seção 14.16.4, “Tabelas de Index FULLTEXT do INFORMATION_SCHEMA do InnoDB”.

* `innodb_ft_cache_size`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_r_batch_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-r-batch-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_r_batch_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>1073741824</code></td> </tr></tbody></table>

  A memória alocada, em bytes, para o cache de Index de busca `FULLTEXT` do `InnoDB`, que mantém um documento analisado na memória enquanto cria um Index `FULLTEXT` do `InnoDB`. Inserts e updates de Index são submetidos a commit no disco apenas quando o limite de tamanho de `innodb_ft_cache_size` é atingido. `innodb_ft_cache_size` define o tamanho do cache por base de table. Para definir um limite global para todas as tabelas, consulte `innodb_ft_total_cache_size`.

  Para mais informações, consulte Cache de Index Full-Text do InnoDB.

* `innodb_ft_enable_diag_print`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_r_batch_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-r-batch-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_r_batch_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>1073741824</code></td> </tr></tbody></table>

  Se deve habilitar a saída de diagnóstico adicional de busca de texto completo (FTS). Esta opção é destinada principalmente a Debug de FTS avançado e não é de interesse para a maioria dos usuários. A saída é impressa no error log e inclui informações como:

  + Progresso de sincronização do Index FTS (quando o limite do cache FTS é atingido). Por exemplo:

    ```sql
    FTS SYNC for table test, deleted count: 100 size: 10000 bytes
    SYNC words: 100
    ```

  + Progresso de otimização FTS. Por exemplo:

    ```sql
    FTS start optimize test
    FTS_OPTIMIZE: optimize "mysql"
    FTS_OPTIMIZE: processed "mysql"
    ```

  + Progresso de construção do Index FTS. Por exemplo:

    ```sql
    Number of doc processed: 1000
    ```

  + Para Queries FTS, a árvore de parsing da Query, o peso da palavra, o tempo de processamento da Query e o uso de memória são impressos. Por exemplo:

    ```sql
    FTS Search Processing time: 1 secs: 100 millisec: row(s) 10000
    Full Search Memory: 245666 (bytes),  Row: 10000
    ```

* `innodb_ft_enable_stopword`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_r_batch_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-r-batch-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_r_batch_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>1073741824</code></td> </tr></tbody></table>

  Especifica que um conjunto de stopwords está associado a um Index `FULLTEXT` do `InnoDB` no momento em que o Index é criado. Se a opção `innodb_ft_user_stopword_table` estiver definida, as stopwords são retiradas dessa table. Caso contrário, se a opção `innodb_ft_server_stopword_table` estiver definida, as stopwords são retiradas dessa table. Caso contrário, um conjunto embutido de stopwords padrão é usado.

  Para mais informações, consulte a Seção 12.9.4, “Stopwords de Full-Text”.

* `innodb_ft_max_token_size`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_r_batch_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-r-batch-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_r_batch_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>1073741824</code></td> </tr></tbody></table>

  Comprimento máximo de caracteres das palavras que são armazenadas em um Index `FULLTEXT` do `InnoDB`. Definir um limite neste valor reduz o tamanho do Index, acelerando assim as Queries, omitindo palavras-chave longas ou coleções arbitrárias de letras que não são palavras reais e não são propensas a serem termos de busca.

  Para mais informações, consulte a Seção 12.9.6, “Ajustando a Busca Full-Text do MySQL”.

* `innodb_ft_min_token_size`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_r_batch_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-r-batch-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_r_batch_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>1073741824</code></td> </tr></tbody></table>

  Comprimento mínimo de palavras que são armazenadas em um Index `FULLTEXT` do `InnoDB`. Aumentar este valor reduz o tamanho do Index, acelerando assim as Queries, omitindo palavras comuns que são improváveis de serem significativas em um contexto de busca, como as palavras em inglês “a” e “to”. Para conteúdo usando um conjunto de caracteres CJK (Chinês, Japonês, Coreano), especifique um valor de 1.

  Para mais informações, consulte a Seção 12.9.6, “Ajustando a Busca Full-Text do MySQL”.

* `innodb_ft_num_word_optimize`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_r_batch_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-r-batch-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_r_batch_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>1073741824</code></td> </tr></tbody></table>

  Número de palavras a serem processadas durante cada operação `OPTIMIZE TABLE` em um Index `FULLTEXT` do `InnoDB`. Como uma operação de bulk insert ou update em uma table contendo um Index de busca full-text pode exigir manutenção substancial do Index para incorporar todas as alterações, você pode fazer uma série de instruções `OPTIMIZE TABLE`, cada uma retomando de onde a última parou.

  Para mais informações, consulte a Seção 12.9.6, “Ajustando a Busca Full-Text do MySQL”.

* `innodb_ft_result_cache_limit`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_r_batch_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-r-batch-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_r_batch_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>1073741824</code></td> </tr></tbody></table>

  O limite de cache de resultado de Query de busca full-text do `InnoDB` (definido em bytes) por Query de busca full-text ou por Thread. Os resultados intermediários e finais da Query de busca full-text do `InnoDB` são tratados na memória. Use `innodb_ft_result_cache_limit` para colocar um limite de tamanho no cache de resultado de Query de busca full-text para evitar consumo excessivo de memória em caso de resultados de Query de busca full-text do `InnoDB` muito grandes (milhões ou centenas de milhões de rows, por exemplo). A memória é alocada conforme necessário quando uma Query de busca full-text é processada. Se o limite de tamanho do cache de resultado for atingido, um erro é retornado indicando que a Query excede a memória máxima permitida.

  O valor máximo de `innodb_ft_result_cache_limit` para todos os tipos de plataforma e tamanhos de bit é 2**32-1.

* `innodb_ft_server_stopword_table`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_r_batch_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-r-batch-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_r_batch_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>1073741824</code></td> </tr></tbody></table>

  Esta opção é usada para especificar sua própria lista de stopwords de Index `FULLTEXT` do `InnoDB` para todas as tabelas `InnoDB`. Para configurar sua própria lista de stopwords para uma table `InnoDB` específica, use `innodb_ft_user_stopword_table`.

  Defina `innodb_ft_server_stopword_table` para o nome da table contendo uma lista de stopwords, no formato `db_name/table_name`.

  A table de stopwords deve existir antes de você configurar `innodb_ft_server_stopword_table`. `innodb_ft_enable_stopword` deve estar habilitado e a opção `innodb_ft_server_stopword_table` deve ser configurada antes de você criar o Index `FULLTEXT`.

  A table de stopwords deve ser uma table `InnoDB`, contendo uma única coluna `VARCHAR` chamada `value`.

  Para mais informações, consulte a Seção 12.9.4, “Stopwords de Full-Text”.

* `innodb_ft_sort_pll_degree`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_r_batch_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-r-batch-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_r_batch_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>1073741824</code></td> </tr></tbody></table>

  Número de Threads usados em paralelo para indexar e tokenizar texto em um Index `FULLTEXT` do `InnoDB` ao construir um Index de busca.

  Para informações relacionadas, consulte a Seção 14.6.2.4, “Indexes Full-Text do InnoDB”, e `innodb_sort_buffer_size`.

* `innodb_ft_total_cache_size`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_r_batch_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-r-batch-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_r_batch_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>1073741824</code></td> </tr></tbody></table>

  A memória total alocada, em bytes, para o cache de Index de busca full-text do `InnoDB` para todas as tabelas. Criar inúmeras tabelas, cada uma com um Index de busca `FULLTEXT`, pode consumir uma porção significativa da memória disponível. `innodb_ft_total_cache_size` define um limite de memória global para todos os Indexes de busca full-text para ajudar a evitar consumo excessivo de memória. Se o limite global for atingido por uma operação de Index, um sync forçado é acionado.

  Para mais informações, consulte Cache de Index Full-Text do InnoDB.

* `innodb_ft_user_stopword_table`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_w_batch_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-w-batch-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_w_batch_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr></tbody></table>

  Esta opção é usada para especificar sua própria lista de stopwords de Index `FULLTEXT` do `InnoDB` em uma table específica. Para configurar sua própria lista de stopwords para todas as tabelas `InnoDB`, use `innodb_ft_server_stopword_table`.

  Defina `innodb_ft_user_stopword_table` para o nome da table contendo uma lista de stopwords, no formato `db_name/table_name`.

  A table de stopwords deve existir antes de você configurar `innodb_ft_user_stopword_table`. `innodb_ft_enable_stopword` deve estar habilitado e `innodb_ft_user_stopword_table` deve ser configurado antes de você criar o Index `FULLTEXT`.

  A table de stopwords deve ser uma table `InnoDB`, contendo uma única coluna `VARCHAR` chamada `value`.

  Para mais informações, consulte a Seção 12.9.4, “Stopwords de Full-Text”.

* `innodb_io_capacity`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_w_batch_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-w-batch-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_w_batch_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr></tbody></table>

  A variável `innodb_io_capacity` define o número de operações de I/O por segundo (IOPS) disponíveis para tarefas em background do `InnoDB`, como flushing de páginas do Buffer Pool e merging de dados do Change Buffer.

  Para obter informações sobre como configurar a variável `innodb_io_capacity`, consulte a Seção 14.8.8, “Configurando a Capacidade de I/O do InnoDB”.

* `innodb_io_capacity_max`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_w_batch_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-w-batch-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_w_batch_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr></tbody></table>

  Se a atividade de flushing ficar atrasada, o `InnoDB` pode fazer flush de forma mais agressiva, a uma taxa maior de operações de I/O por segundo (IOPS) do que a definida pela variável `innodb_io_capacity`. A variável `innodb_io_capacity_max` define um número máximo de IOPS realizados por tarefas em background do `InnoDB` em tais situações.

  Para obter informações sobre como configurar a variável `innodb_io_capacity_max`, consulte a Seção 14.8.8, “Configurando a Capacidade de I/O do InnoDB”.

* `innodb_large_prefix`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_w_batch_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-w-batch-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_w_batch_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr></tbody></table>

  Quando esta opção está habilitada, prefixos de chave de Index maiores que 767 bytes (até 3072 bytes) são permitidos para tabelas `InnoDB` que usam o formato de row `DYNAMIC` ou `COMPRESSED`. Consulte a Seção 14.23, “Limites do InnoDB”, para os máximos associados a prefixos de chave de Index sob várias configurações.

  Para tabelas que usam o formato de row `REDUNDANT` ou `COMPACT`, esta opção não afeta o comprimento permitido do prefixo da chave de Index.

  `innodb_large_prefix` está habilitado por padrão no MySQL 5.7. Esta mudança coincide com a alteração do valor padrão para `innodb_file_format`, que é definido como `Barracuda` por padrão no MySQL 5.7. Juntas, essas alterações de valor padrão permitem que prefixos de chave de Index maiores sejam criados ao usar o formato de row `DYNAMIC` ou `COMPRESSED`. Se qualquer uma das opções for definida para um valor não padrão, prefixos de chave de Index maiores que 767 bytes são truncados silenciosamente.

  `innodb_large_prefix` está descontinuada; espere que seja removida em uma futura versão. `innodb_large_prefix` foi introduzida para desabilitar prefixos de chave de Index grandes para compatibilidade com versões anteriores do `InnoDB` que não suportam prefixos de chave de Index grandes.

* `innodb_limit_optimistic_insert_debug`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_w_batch_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-w-batch-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_w_batch_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr></tbody></table>

  Limita o número de registros por página B-tree. Um valor padrão de 0 significa que nenhum limite é imposto. Esta opção só está disponível se o suporte a Debug for compilado usando a opção **CMake** `WITH_DEBUG`.

* `innodb_lock_wait_timeout`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_w_batch_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-w-batch-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_w_batch_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr></tbody></table>

  O tempo de espera em segundos de uma transaction `InnoDB` por um row lock antes de desistir. O valor padrão é 50 segundos. Uma transaction que tenta acessar uma row que está bloqueada por outra transaction `InnoDB` espera no máximo esta quantidade de segundos por acesso de escrita à row antes de emitir o seguinte erro:

  ```sql
  ERROR 1205 (HY000): Lock wait timeout exceeded; try restarting transaction
  ```

  Quando ocorre um timeout de espera por Lock, a instrução atual é revertida (rolled back) (não a transaction inteira). Para que a transaction inteira seja revertida, inicie o servidor com a opção `--innodb-rollback-on-timeout`. Consulte também a Seção 14.22.4, “Tratamento de Erros do InnoDB”.

  Você pode diminuir este valor para aplicações altamente interativas ou sistemas OLTP, para exibir feedback ao usuário rapidamente ou colocar o update em uma fila para processamento posterior. Você pode aumentar este valor para operações de back-end de longa duração, como uma etapa de transformação em um data warehouse que espera que outras grandes operações de insert ou update terminem.

  `innodb_lock_wait_timeout` se aplica apenas a row locks do `InnoDB`. Um table lock do MySQL não acontece dentro do `InnoDB` e este timeout não se aplica a esperas por table locks.

  O valor do timeout de espera por Lock não se aplica a deadlocks quando `innodb_deadlock_detect` está habilitado (o padrão) porque o `InnoDB` detecta deadlocks imediatamente e reverte uma das transactions em Deadlock. Quando `innodb_deadlock_detect` está desabilitado, o `InnoDB` depende de `innodb_lock_wait_timeout` para rollback de transaction quando um Deadlock ocorre. Consulte a Seção 14.7.5.2, “Detecção de Deadlock”.

  `innodb_lock_wait_timeout` pode ser definido em tempo de execução com a instrução `SET GLOBAL` ou `SET SESSION`. Alterar a configuração `GLOBAL` requer privilégios suficientes para definir variáveis de sistema globais (consulte a Seção 5.1.8.1, “Privilégios de Variáveis de Sistema”) e afeta a operação de todos os clientes que se conectarem subsequentemente. Qualquer cliente pode alterar a configuração `SESSION` para `innodb_lock_wait_timeout`, o que afeta apenas esse cliente.

* `innodb_locks_unsafe_for_binlog`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_w_batch_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-w-batch-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_w_batch_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr></tbody></table>

  Esta variável afeta como o `InnoDB` usa gap locking para buscas e Index scans. `innodb_locks_unsafe_for_binlog` está descontinuada; espere que seja removida em uma futura versão do MySQL.

  Normalmente, o `InnoDB` usa um algoritmo chamado next-key locking que combina Index-row locking com gap locking. O `InnoDB` realiza Lock de nível de row de tal forma que, ao buscar ou escanear um Index de table, ele define shared ou exclusive Locks nos registros de Index que encontra. Assim, os Locks de nível de row são na verdade Locks de registro de Index. Além disso, um next-key Lock em um registro de Index também afeta o gap antes do registro de Index. Ou seja, um next-key Lock é um Index-record Lock mais um gap Lock no gap que precede o Index record. Se uma session tiver um shared ou exclusive Lock no registro `R` em um Index, outra session não pode inserir um novo Index record no gap imediatamente antes de `R` na ordem do Index. Consulte a Seção 14.7.1, “Locking do InnoDB”.

  Por padrão, o valor de `innodb_locks_unsafe_for_binlog` é 0 (desabilitado), o que significa que o gap locking está habilitado: o `InnoDB` usa next-key locks para buscas e Index scans. Para habilitar a variável, defina-a como 1. Isso faz com que o gap locking seja desabilitado: o `InnoDB` usa apenas Index-record locks para buscas e Index scans.

  Habilitar `innodb_locks_unsafe_for_binlog` não desabilita o uso de gap locking para verificação de restrição de foreign key ou verificação de chave duplicada.

  Os efeitos de habilitar `innodb_locks_unsafe_for_binlog` são os mesmos que definir o nível de isolamento de transaction para `READ COMMITTED`, com estas exceções:

  + Habilitar `innodb_locks_unsafe_for_binlog` é uma configuração global e afeta todas as sessions, enquanto o nível de isolamento pode ser definido globalmente para todas as sessions, ou individualmente por session.

  + `innodb_locks_unsafe_for_binlog` pode ser definida apenas na inicialização do servidor, enquanto o nível de isolamento pode ser definido na inicialização ou alterado em tempo de execução.

  Portanto, `READ COMMITTED` oferece controle mais fino e flexível do que `innodb_locks_unsafe_for_binlog`. Para mais informações sobre o efeito do nível de isolamento no gap locking, consulte a Seção 14.7.2.1, “Níveis de Isolamento de Transaction”.

  Habilitar `innodb_locks_unsafe_for_binlog` pode causar problemas de phantom porque outras sessions podem inserir novas rows nos gaps quando o gap locking está desabilitado. Suponha que haja um Index na coluna `id` da table `child` e que você queira ler e bloquear todas as rows da table com um valor de identificador maior que 100, com a intenção de atualizar alguma coluna nas rows selecionadas mais tarde:

  ```sql
  SELECT * FROM child WHERE id > 100 FOR UPDATE;
  ```

  A Query escaneia o Index começando do primeiro registro onde o `id` é maior que 100. Se os Locks definidos nos registros de Index nesse range não bloquearem inserts feitos nos gaps, outra session pode inserir uma nova row na table. Consequentemente, se você executasse o mesmo `SELECT` novamente dentro da mesma transaction, você veria uma nova row no conjunto de resultados retornado pela Query. Isso também significa que se novos itens forem adicionados ao Database, o `InnoDB` não garante serializability. Portanto, se `innodb_locks_unsafe_for_binlog` estiver habilitado, o `InnoDB` garante no máximo um nível de isolamento de `READ COMMITTED`. (A serializability de conflito ainda é garantida.) Para mais informações sobre phantoms, consulte a Seção 14.7.4, “Phantom Rows”.

  Habilitar `innodb_locks_unsafe_for_binlog` tem efeitos adicionais:

  + Para instruções `UPDATE` ou `DELETE`, o `InnoDB` mantém Locks apenas para rows que ele atualiza ou deleta. Row locks para rows não correspondentes são liberados após o MySQL ter avaliado a condição `WHERE`. Isso reduz muito a probabilidade de deadlocks, mas eles ainda podem acontecer.

  + Para instruções `UPDATE`, se uma row já estiver bloqueada, o `InnoDB` realiza uma leitura “semi-consistente”, retornando a última versão com commit para o MySQL para que o MySQL possa determinar se a row corresponde à condição `WHERE` do `UPDATE`. Se a row corresponder (deve ser atualizada), o MySQL lê a row novamente e desta vez o `InnoDB` ou a bloqueia ou espera por um Lock nela.

  Considere o seguinte exemplo, começando com esta table:

  ```sql
  CREATE TABLE t (a INT NOT NULL, b INT) ENGINE = InnoDB;
  INSERT INTO t VALUES (1,2),(2,3),(3,2),(4,3),(5,2);
  COMMIT;
  ```

  Neste caso, a table não tem Indexes, então buscas e Index scans usam o Index clusterizado oculto para row locking (consulte a Seção 14.6.2.1, “Indexes Clusterizados e Secundários”).

  Suponha que um cliente execute um `UPDATE` usando estas instruções:

  ```sql
  SET autocommit = 0;
  UPDATE t SET b = 5 WHERE b = 3;
  ```

  Suponha também que um segundo cliente execute um `UPDATE` executando estas instruções após as do primeiro cliente:

  ```sql
  SET autocommit = 0;
  UPDATE t SET b = 4 WHERE b = 2;
  ```

  À medida que o `InnoDB` executa cada `UPDATE`, ele primeiro adquire um exclusive Lock para cada row e, em seguida, determina se deve modificá-la. Se o `InnoDB` não modificar a row e `innodb_locks_unsafe_for_binlog` estiver habilitado, ele libera o Lock. Caso contrário, o `InnoDB` retém o Lock até o final da transaction. Isso afeta o processamento da transaction da seguinte forma.

  Se `innodb_locks_unsafe_for_binlog` estiver desabilitado, o primeiro `UPDATE` adquire x-locks e não libera nenhum deles:

  ```sql
  x-lock(1,2); retain x-lock
  x-lock(2,3); update(2,3) to (2,5); retain x-lock
  x-lock(3,2); retain x-lock
  x-lock(4,3); update(4,3) to (4,5); retain x-lock
  x-lock(5,2); retain x-lock
  ```

  O segundo `UPDATE` bloqueia assim que tenta adquirir qualquer Lock (porque o primeiro update reteve Locks em todas as rows) e não prossegue até que o primeiro `UPDATE` faça commit ou rollback:

  ```sql
  x-lock(1,2); block and wait for first UPDATE to commit or roll back
  ```

  Se `innodb_locks_unsafe_for_binlog` estiver habilitado, o primeiro `UPDATE` adquire x-locks e libera aqueles para as rows que ele não modifica:

  ```sql
  x-lock(1,2); unlock(1,2)
  x-lock(2,3); update(2,3) to (2,5); retain x-lock
  x-lock(3,2); unlock(3,2)
  x-lock(4,3); update(4,3) to (4,5); retain x-lock
  x-lock(5,2); unlock(5,2)
  ```

  Para o segundo `UPDATE`, o `InnoDB` faz uma leitura “semi-consistente”, retornando a última versão com commit de cada row para o MySQL para que o MySQL possa determinar se a row corresponde à condição `WHERE` do `UPDATE`:

  ```sql
  x-lock(1,2); update(1,2) to (1,4); retain x-lock
  x-lock(2,3); unlock(2,3)
  x-lock(3,2); update(3,2) to (3,4); retain x-lock
  x-lock(4,3); unlock(4,3)
  x-lock(5,2); update(5,2) to (5,4); retain x-lock
  ```

* `innodb_log_buffer_size`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_w_batch_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-w-batch-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_w_batch_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr></tbody></table>

  O tamanho em bytes do Buffer que o `InnoDB` usa para escrever nos log files no disco. O valor padrão mudou de 8MB para 16MB com a introdução dos valores de `innodb_page_size` de 32KB e 64KB. Um log Buffer grande permite que transactions grandes sejam executadas sem a necessidade de escrever o log no disco antes que as transactions façam commit. Assim, se você tiver transactions que atualizam, inserem ou deletam muitas rows, aumentar o log Buffer economiza I/O de disco. Para informações relacionadas, consulte Configuração de Memória e Seção 8.5.4, “Otimizando Redo Logging do InnoDB”. Para conselhos gerais sobre ajuste de I/O, consulte a Seção 8.5.8, “Otimizando I/O de Disco do InnoDB”.

* `innodb_log_checkpoint_now`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_w_batch_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-w-batch-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_w_batch_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr></tbody></table>

  Habilite esta opção de Debug para forçar o `InnoDB` a escrever um checkpoint. Esta opção só está disponível se o suporte a Debug for compilado usando a opção **CMake** `WITH_DEBUG`.

* `innodb_log_checksums`

  <table frame="box" rules="all" summary="Propriedades para daemon_memcached_w_batch_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemon-memcached-w-batch-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>daemon_memcached_w_batch_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr></tbody></table>

  Habilita ou desabilita checksums para páginas de redo log.

  `innodb_log_checksums=ON` habilita o algoritmo de checksum `CRC-32C` para páginas de redo log. Quando `innodb_log_checksums` está desabilitado, o conteúdo do campo de checksum da página de redo log é ignorado.

  Checksums na página de cabeçalho do redo log e nas páginas de checkpoint do redo log nunca são desabilitados.

* `innodb_log_compressed_pages`

  <table frame="box" rules="all" summary="Propriedades para ignore_builtin_innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ignore-builtin-innodb[={OFF|ON}]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Variável de Sistema</th> <td><code>ignore_builtin_innodb</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr> </tbody></table>

  Especifica se as imagens de páginas recomprimidas são escritas no redo log. A recompreensão pode ocorrer quando alterações são feitas em dados comprimidos.

  `innodb_log_compressed_pages` está habilitado por padrão para evitar corrupção que poderia ocorrer se uma versão diferente do algoritmo de compressão `zlib` for usada durante o recovery. Se você tiver certeza de que a versão `zlib` não está sujeita a alterações, você pode desabilitar `innodb_log_compressed_pages` para reduzir a geração de redo log para workloads que modificam dados comprimidos.

  Para medir o efeito de habilitar ou desabilitar `innodb_log_compressed_pages`, compare a geração de redo log para ambas as configurações sob a mesma workload. As opções para medir a geração de redo log incluem observar o `Log sequence number` (LSN) na seção `LOG` da saída de `SHOW ENGINE INNODB STATUS`, ou monitorar o status `Innodb_os_log_written` para o número de bytes escritos nos arquivos de redo log.

  Para informações relacionadas, consulte a Seção 14.9.1.6, “Compressão para Workloads OLTP”.

* `innodb_log_file_size`

  <table frame="box" rules="all" summary="Propriedades para ignore_builtin_innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ignore-builtin-innodb[={OFF|ON}]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Variável de Sistema</th> <td><code>ignore_builtin_innodb</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr> </tbody></table>

  O tamanho em bytes de cada log file em um log group. O tamanho combinado dos log files (`innodb_log_file_size` \* `innodb_log_files_in_group`) não pode exceder um valor máximo ligeiramente inferior a 512GB. Um par de log files de 255 GB, por exemplo, se aproxima do limite, mas não o excede. O valor padrão é 48MB.

  Geralmente, o tamanho combinado dos log files deve ser grande o suficiente para que o servidor possa suavizar picos e vales na atividade da workload, o que geralmente significa que há espaço de redo log suficiente para lidar com mais de uma hora de atividade de escrita. Quanto maior o valor, menos atividade de flush de checkpoint é necessária no Buffer Pool, economizando I/O de disco. Log files maiores também tornam o crash recovery mais lento.

  O valor mínimo de `innodb_log_file_size` foi aumentado de 1MB para 4MB no MySQL 5.7.11.

  Para informações relacionadas, consulte Configuração do Arquivo de Redo Log. Para conselhos gerais sobre ajuste de I/O, consulte a Seção 8.5.8, “Otimizando I/O de Disco do InnoDB”.

* `innodb_log_files_in_group`

  <table frame="box" rules="all" summary="Propriedades para ignore_builtin_innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ignore-builtin-innodb[={OFF|ON}]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Variável de Sistema</th> <td><code>ignore_builtin_innodb</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr> </tbody></table>

  O número de log files no log group. O `InnoDB` escreve nos arquivos de forma circular. O valor padrão (e recomendado) é 2. A localização dos arquivos é especificada por `innodb_log_group_home_dir`. O tamanho combinado dos log files (`innodb_log_file_size` \* `innodb_log_files_in_group`) pode ser de até 512GB.

  Para informações relacionadas, consulte Configuração do Arquivo de Redo Log.

* `innodb_log_group_home_dir`

  <table frame="box" rules="all" summary="Propriedades para ignore_builtin_innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ignore-builtin-innodb[={OFF|ON}]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Variável de Sistema</th> <td><code>ignore_builtin_innodb</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr> </tbody></table>

  O path do diretório para os arquivos de redo log do `InnoDB`, cujo número é especificado por `innodb_log_files_in_group`. Se você não especificar nenhuma variável de log do `InnoDB`, o padrão é criar dois arquivos chamados `ib_logfile0` e `ib_logfile1` no data directory do MySQL. O tamanho do log file é dado pela variável de sistema `innodb_log_file_size`.

  Para informações relacionadas, consulte Configuração do Arquivo de Redo Log.

* `innodb_log_write_ahead_size`

  <table frame="box" rules="all" summary="Propriedades para ignore_builtin_innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ignore-builtin-innodb[={OFF|ON}]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Variável de Sistema</th> <td><code>ignore_builtin_innodb</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr> </tbody></table>

  Define o tamanho do bloco write-ahead para o redo log, em bytes. Para evitar “read-on-write”, defina `innodb_log_write_ahead_size` para corresponder ao tamanho do bloco de cache do sistema operacional ou do sistema de arquivos. A configuração padrão é de 8192 bytes. O read-on-write ocorre quando os blocos de redo log não são totalmente armazenados em cache no sistema operacional ou no sistema de arquivos devido a uma incompatibilidade entre o tamanho do bloco write-ahead para o redo log e o tamanho do bloco de cache do sistema operacional ou do sistema de arquivos.

  Os valores válidos para `innodb_log_write_ahead_size` são múltiplos do tamanho do bloco do log file do `InnoDB` (2n). O valor mínimo é o tamanho do bloco do log file do `InnoDB` (512). O write-ahead não ocorre quando o valor mínimo é especificado. O valor máximo é igual ao valor `innodb_page_size`. Se você especificar um valor para `innodb_log_write_ahead_size` que seja maior do que o valor `innodb_page_size`, a configuração `innodb_log_write_ahead_size` é truncada para o valor `innodb_page_size`.

  Definir o valor `innodb_log_write_ahead_size` muito baixo em relação ao tamanho do bloco de cache do sistema operacional ou do sistema de arquivos resulta em “read-on-write”. Definir o valor muito alto pode ter um leve impacto na performance do `fsync` para escritas em log file devido a vários blocos sendo escritos de uma vez.

  Para informações relacionadas, consulte a Seção 8.5.4, “Otimizando Redo Logging do InnoDB”.

* `innodb_lru_scan_depth`

  <table frame="box" rules="all" summary="Propriedades para ignore_builtin_innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ignore-builtin-innodb[={OFF|ON}]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Variável de Sistema</th> <td><code>ignore_builtin_innodb</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr> </tbody></table>

  Um parâmetro que influencia os algoritmos e heurísticas para a operação de flush do Buffer Pool do `InnoDB`. Principalmente de interesse para especialistas em performance que ajustam workloads intensivas em I/O. Ele especifica, por instância de Buffer Pool, o quão longe na lista LRU de páginas do Buffer Pool o Thread page cleaner escaneia em busca de dirty pages para fazer flush. Esta é uma operação em background realizada uma vez por segundo.

  Uma configuração menor que a padrão é geralmente adequada para a maioria das workloads. Um valor muito maior do que o necessário pode impactar a performance. Considere aumentar o valor apenas se você tiver capacidade de I/O de sobra sob uma workload típica. Por outro lado, se uma workload intensiva em escrita saturar sua capacidade de I/O, diminua o valor, especialmente no caso de um Buffer Pool grande.

  Ao ajustar `innodb_lru_scan_depth`, comece com um valor baixo e configure-o para cima com o objetivo de raramente ver zero páginas livres. Além disso, considere ajustar `innodb_lru_scan_depth` ao alterar o número de instâncias do Buffer Pool, já que `innodb_lru_scan_depth` \* `innodb_buffer_pool_instances` define a quantidade de trabalho realizado pelo Thread page cleaner a cada segundo.

  Para informações relacionadas, consulte a Seção 14.8.3.5, “Configurando o Flushing do Buffer Pool”. Para conselhos gerais sobre ajuste de I/O, consulte a Seção 8.5.8, “Otimizando I/O de Disco do InnoDB”.

* `innodb_max_dirty_pages_pct`

  <table frame="box" rules="all" summary="Propriedades para ignore_builtin_innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ignore-builtin-innodb[={OFF|ON}]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Variável de Sistema</th> <td><code>ignore_builtin_innodb</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr> </tbody></table>

  O `InnoDB` tenta fazer flush de dados do Buffer Pool para que a porcentagem de dirty pages não exceda este valor. O valor padrão é 75.

  A configuração `innodb_max_dirty_pages_pct` estabelece um alvo para a atividade de flushing. Não afeta a taxa de flushing. Para obter informações sobre como gerenciar a taxa de flushing, consulte a Seção 14.8.3.5, “Configurando o Flushing do Buffer Pool”.

  Para informações relacionadas, consulte a Seção 14.8.3.5, “Configurando o Flushing do Buffer Pool”. Para conselhos gerais sobre ajuste de I/O, consulte a Seção 8.5.8, “Otimizando I/O de Disco do InnoDB”.

* `innodb_max_dirty_pages_pct_lwm`

  <table frame="box" rules="all" summary="Propriedades para ignore_builtin_innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ignore-builtin-innodb[={OFF|ON}]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Variável de Sistema</th> <td><code>ignore_builtin_innodb</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr> </tbody></table>

  Define um limite inferior (low water mark - LWM) que representa a porcentagem de dirty pages na qual o pré-flushing é habilitado para controlar a proporção de dirty pages. O padrão de 0 desabilita o comportamento de pré-flushing inteiramente. O valor configurado deve ser sempre inferior ao valor `innodb_max_dirty_pages_pct`. Para mais informações, consulte a Seção 14.8.3.5, “Configurando o Flushing do Buffer Pool”.

* `innodb_max_purge_lag`

  <table frame="box" rules="all" summary="Propriedades para ignore_builtin_innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ignore-builtin-innodb[={OFF|ON}]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Variável de Sistema</th> <td><code>ignore_builtin_innodb</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr> </tbody></table>

  Define o máximo de purge lag desejado. Se este valor for excedido, um atraso é imposto nas operações `INSERT`, `UPDATE` e `DELETE` para dar tempo ao purge para alcançá-lo. O valor padrão é 0, o que significa que não há máximo purge lag e nenhum atraso.

  Para mais informações, consulte a Seção 14.8.10, “Configuração de Purge”.

* `innodb_max_purge_lag_delay`

  <table frame="box" rules="all" summary="Propriedades para ignore_builtin_innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ignore-builtin-innodb[={OFF|ON}]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Variável de Sistema</th> <td><code>ignore_builtin_innodb</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr> </tbody></table>

  Especifica o atraso máximo em microssegundos para o atraso imposto quando o limite `innodb_max_purge_lag` é excedido. O valor `innodb_max_purge_lag_delay` especificado é um limite superior no período de atraso calculado pela fórmula `innodb_max_purge_lag`.

  Para mais informações, consulte a Seção 14.8.10, “Configuração de Purge”.

* `innodb_max_undo_log_size`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Define um tamanho de limite para undo tablespaces. Se um undo tablespace exceder o limite, ele pode ser marcado para truncamento quando `innodb_undo_log_truncate` estiver habilitado. O valor padrão é 1073741824 bytes (1024 MiB).

  Para mais informações, consulte Truncando Undo Tablespaces.

* `innodb_merge_threshold_set_all_debug`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Define um valor percentual de preenchimento de página para Index pages que sobrescreve a configuração `MERGE_THRESHOLD` atual para todos os Indexes que estão atualmente no dictionary cache. Esta opção só está disponível se o suporte a Debug for compilado usando a opção **CMake** `WITH_DEBUG`. Para informações relacionadas, consulte a Seção 14.8.12, “Configurando o Merge Threshold para Index Pages”.

* `innodb_monitor_disable`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Esta variável atua como um switch, desabilitando os contadores de métricas do `InnoDB`. Os dados do contador podem ser consultados usando a tabela `INNODB_METRICS` do Information Schema. Para informações de uso, consulte a Seção 14.16.6, “Tabela de Métricas do INFORMATION_SCHEMA do InnoDB”.

  `innodb_monitor_disable='latch'` desabilita a coleta de estatísticas para `SHOW ENGINE INNODB MUTEX`. Para mais informações, consulte a Seção 13.7.5.15, “Instrução SHOW ENGINE”.

* `innodb_monitor_enable`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Esta variável atua como um switch, habilitando os contadores de métricas do `InnoDB`. Os dados do contador podem ser consultados usando a tabela `INNODB_METRICS` do Information Schema. Para informações de uso, consulte a Seção 14.16.6, “Tabela de Métricas do INFORMATION_SCHEMA do InnoDB”.

  `innodb_monitor_enable='latch'` habilita a coleta de estatísticas para `SHOW ENGINE INNODB MUTEX`. Para mais informações, consulte a Seção 13.7.5.15, “Instrução SHOW ENGINE”.

* `innodb_monitor_reset`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Esta variável atua como um switch, redefinindo o valor de contagem para os contadores de métricas do `InnoDB` para zero. Os dados do contador podem ser consultados usando a tabela `INNODB_METRICS` do Information Schema. Para informações de uso, consulte a Seção 14.16.6, “Tabela de Métricas do INFORMATION_SCHEMA do InnoDB”.

  `innodb_monitor_reset='latch'` redefine as estatísticas relatadas por `SHOW ENGINE INNODB MUTEX`. Para mais informações, consulte a Seção 13.7.5.15, “Instrução SHOW ENGINE”.

* `innodb_monitor_reset_all`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Esta variável atua como um switch, redefinindo todos os valores (mínimo, máximo e assim por diante) para os contadores de métricas do `InnoDB`. Os dados do contador podem ser consultados usando a tabela `INNODB_METRICS` do Information Schema. Para informações de uso, consulte a Seção 14.16.6, “Tabela de Métricas do INFORMATION_SCHEMA do InnoDB”.

* `innodb_numa_interleave`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Habilita a política de memória NUMA interleave para alocação do Buffer Pool do `InnoDB`. Quando `innodb_numa_interleave` está habilitado, a política de memória NUMA é definida como `MPOL_INTERLEAVE` para o processo **mysqld**. Após o Buffer Pool do `InnoDB` ser alocado, a política de memória NUMA é definida novamente como `MPOL_DEFAULT`. Para que a opção `innodb_numa_interleave` esteja disponível, o MySQL deve ser compilado em um sistema Linux habilitado para NUMA.

  A partir do MySQL 5.7.17, o **CMake** define o valor padrão `WITH_NUMA` com base no suporte NUMA na plataforma atual. Para mais informações, consulte a Seção 2.8.7, “Opções de Configuração de Fonte do MySQL”.

* `innodb_old_blocks_pct`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Especifica a porcentagem aproximada do Buffer Pool do `InnoDB` usada para a sublista de blocos antigos. O intervalo de valores é de 5 a 95. O valor padrão é 37 (ou seja, 3/8 do Pool). Frequentemente usado em combinação com `innodb_old_blocks_time`.

  Para mais informações, consulte a Seção 14.8.3.3, “Tornando o Buffer Pool Resistente a Scan”. Para informações sobre gerenciamento de Buffer Pool, o algoritmo LRU e políticas de despejo (eviction), consulte a Seção 14.5.1, “Buffer Pool”.

* `innodb_old_blocks_time`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Valores não zero protegem contra o Buffer Pool ser preenchido por dados referenciados apenas por um breve período, como durante um full table scan. Aumentar este valor oferece mais proteção contra a interferência de full table scans com dados armazenados em cache no Buffer Pool.

  Especifica por quanto tempo em milissegundos um bloco inserido na sublista antiga deve permanecer lá após seu primeiro acesso antes de poder ser movido para a nova sublista. Se o valor for 0, um bloco inserido na sublista antiga se move imediatamente para a nova sublista na primeira vez que é acessado, não importa quão logo após a inserção o acesso ocorra. Se o valor for maior que 0, os blocos permanecem na sublista antiga até que um acesso ocorra pelo menos essa quantidade de milissegundos após o primeiro acesso. Por exemplo, um valor de 1000 faz com que os blocos permaneçam na sublista antiga por 1 segundo após o primeiro acesso antes de se tornarem elegíveis para se moverem para a nova sublista.

  O valor padrão é 1000.

  Esta variável é frequentemente usada em combinação com `innodb_old_blocks_pct`. Para mais informações, consulte a Seção 14.8.3.3, “Tornando o Buffer Pool Resistente a Scan”. Para informações sobre gerenciamento de Buffer Pool, o algoritmo LRU e políticas de despejo (eviction), consulte a Seção 14.5.1, “Buffer Pool”.

* `innodb_online_alter_log_max_size`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Especifica um limite superior em bytes no tamanho dos log files temporários usados durante operações DDL online para tabelas `InnoDB`. Há um log file desse tipo para cada Index sendo criado ou table sendo alterada. Este log file armazena dados inseridos, atualizados ou deletados na table durante a operação DDL. O log file temporário é estendido quando necessário pelo valor de `innodb_sort_buffer_size`, até o máximo especificado por `innodb_online_alter_log_max_size`. Se um log file temporário exceder o limite de tamanho superior, a operação `ALTER TABLE` falha e todas as operações DML concorrentes não submetidas a commit são revertidas. Assim, um valor grande para esta opção permite que mais DML ocorra durante uma operação DDL online, mas também estende o período de tempo no final da operação DDL quando a table está bloqueada para aplicar os dados do log.

* `innodb_open_files`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Especifica o número máximo de arquivos que o `InnoDB` pode ter abertos ao mesmo tempo. O valor mínimo é 10. Se `innodb_file_per_table` estiver desabilitado, o valor padrão é 300; caso contrário, o valor padrão é 300 ou a configuração `table_open_cache`, o que for maior.

* `innodb_optimize_fulltext_only`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Altera a forma como `OPTIMIZE TABLE` opera em tabelas `InnoDB`. Destinado a ser habilitado temporariamente, durante operações de manutenção para tabelas `InnoDB` com Indexes `FULLTEXT`.

  Por padrão, `OPTIMIZE TABLE` reorganiza os dados no Index clusterizado da table. Quando esta opção está habilitada, `OPTIMIZE TABLE` ignora a reorganização dos dados da table e, em vez disso, processa dados de tokens recém-adicionados, deletados e atualizados para Indexes `FULLTEXT` do `InnoDB`. Para mais informações, consulte Otimizando Indexes Full-Text do InnoDB.

* `innodb_page_cleaners`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  O número de Threads page cleaner que fazem flush de dirty pages das instâncias do Buffer Pool. Os Threads page cleaner realizam o flushing da lista de flush e da LRU. Um único Thread page cleaner foi introduzido no MySQL 5.6 para descarregar o trabalho de flushing do Buffer Pool do Thread mestre do `InnoDB`. No MySQL 5.7, o `InnoDB` fornece suporte para múltiplos Threads page cleaner. Um valor de 1 mantém a configuração pré-MySQL 5.7, na qual há um único Thread page cleaner. Quando há múltiplos Threads page cleaner, as tarefas de flushing do Buffer Pool para cada instância do Buffer Pool são despachadas para Threads page cleaner ociosos. O valor padrão de `innodb_page_cleaners` foi alterado de 1 para 4 no MySQL 5.7. Se o número de Threads page cleaner exceder o número de instâncias do Buffer Pool, `innodb_page_cleaners` é automaticamente definido para o mesmo valor que `innodb_buffer_pool_instances`.

  Se sua workload for write-IO bound ao fazer flush de dirty pages das instâncias do Buffer Pool para arquivos de dados, e se o hardware do seu sistema tiver capacidade disponível, aumentar o número de Threads page cleaner pode ajudar a melhorar o throughput de write-IO.

  O suporte a page cleaner multithreaded é estendido para as fases de desligamento e recovery no MySQL 5.7.

  A chamada de sistema `setpriority()` é usada em plataformas Linux onde é suportada, e onde o usuário de execução **mysqld** está autorizado a dar prioridade aos Threads `page_cleaner` sobre outros Threads MySQL e `InnoDB` para ajudar o flushing de páginas a acompanhar a workload atual. O suporte a `setpriority()` é indicado por esta mensagem de inicialização do `InnoDB`:

  ```sql
  [Note] InnoDB: If the mysqld execution user is authorized, page cleaner
  thread priority can be changed. See the man page of setpriority().
  ```

  Para sistemas onde a inicialização e o desligamento do servidor não são gerenciados pelo systemd, a autorização do usuário de execução **mysqld** pode ser configurada em `/etc/security/limits.conf`. Por exemplo, se o **mysqld** for executado sob o usuário `mysql`, você pode autorizar o usuário `mysql` adicionando estas linhas a `/etc/security/limits.conf`:

  ```sql
  mysql              hard    nice       -20
  mysql              soft    nice       -20
  ```

  Para sistemas gerenciados pelo systemd, o mesmo pode ser alcançado especificando `LimitNICE=-20` em um arquivo de configuração systemd localizado. Por exemplo, crie um arquivo chamado `override.conf` em `/etc/systemd/system/mysqld.service.d/override.conf` e adicione esta entrada:

  ```sql
  [Service]
  LimitNICE=-20
  ```

  Após criar ou alterar `override.conf`, recarregue a configuração do systemd e, em seguida, instrua o systemd a reiniciar o serviço MySQL:

  ```sql
  systemctl daemon-reload
  systemctl restart mysqld  # RPM platforms
  systemctl restart mysql   # Debian platforms
  ```

  Para mais informações sobre como usar um arquivo de configuração systemd localizado, consulte Configurando systemd para MySQL.

  Após autorizar o usuário de execução **mysqld**, use o comando **cat** para verificar os limites `Nice` configurados para o processo **mysqld**:

  ```sql
  $> cat /proc/mysqld_pid/limits | grep nice
  Max nice priority         18446744073709551596 18446744073709551596
  ```

* `innodb_page_size`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Especifica o tamanho da página para tablespaces do `InnoDB`. Os valores podem ser especificados em bytes ou kilobytes. Por exemplo, um valor de tamanho de página de 16 kilobyte pode ser especificado como 16384, 16KB ou 16k.

  `innodb_page_size` só pode ser configurado antes de inicializar a instância MySQL e não pode ser alterado depois. Se nenhum valor for especificado, a instância é inicializada usando o tamanho de página padrão. Consulte a Seção 14.8.1, “Configuração de Inicialização do InnoDB”.

  O suporte para tamanhos de página de 32KB e 64KB foi adicionado no MySQL 5.7. Para tamanhos de página de 32KB e 64KB, o comprimento máximo da row é de aproximadamente 16000 bytes. `ROW_FORMAT=COMPRESSED` não é suportado quando `innodb_page_size` é definido para 32KB ou 64KB. Para `innodb_page_size=32k`, o tamanho do extent é 2MB. Para `innodb_page_size=64KB`, o tamanho do extent é 4MB. `innodb_log_buffer_size` deve ser definido para pelo menos 16M (o padrão) ao usar tamanhos de página de 32KB ou 64KB.

  O tamanho de página padrão de 16KB ou maior é apropriado para uma ampla gama de workloads, particularmente para Queries envolvendo table scans e operações DML envolvendo bulk updates. Tamanhos de página menores podem ser mais eficientes para workloads OLTP envolvendo muitas escritas pequenas, onde a contenção pode ser um problema quando páginas únicas contêm muitas rows. Páginas menores também podem ser eficientes com dispositivos de armazenamento SSD, que geralmente usam tamanhos de bloco pequenos. Manter o tamanho da página do `InnoDB` próximo ao tamanho do bloco do dispositivo de armazenamento minimiza a quantidade de dados inalterados que são reescritos no disco.

  O tamanho mínimo do arquivo para o primeiro arquivo de dados do tablespace do sistema (`ibdata1`) difere dependendo do valor de `innodb_page_size`. Consulte a descrição da opção `innodb_data_file_path` para mais informações.

  Uma instância MySQL usando um tamanho de página `InnoDB` específico não pode usar arquivos de dados ou log files de uma instância que usa um tamanho de página diferente.

  Para conselhos gerais sobre ajuste de I/O, consulte a Seção 8.5.8, “Otimizando I/O de Disco do InnoDB”.

* `innodb_print_all_deadlocks`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Quando esta opção está habilitada, informações sobre todos os deadlocks em transactions de usuário do `InnoDB` são registradas no error log do `mysqld`. Caso contrário, você verá informações apenas sobre o último Deadlock, usando o comando `SHOW ENGINE INNODB STATUS`. Um Deadlock ocasional do `InnoDB` não é necessariamente um problema, porque o `InnoDB` detecta a condição imediatamente e reverte uma das transactions automaticamente. Você pode usar esta opção para solucionar por que os deadlocks estão ocorrendo se uma aplicação não tiver lógica de tratamento de erros apropriada para detectar o rollback e tentar novamente sua operação. Um grande número de deadlocks pode indicar a necessidade de reestruturar transactions que emitem instruções DML ou `SELECT ... FOR UPDATE` para múltiplas tabelas, para que cada transaction acesse as tabelas na mesma ordem, evitando assim a condição de Deadlock.

  Para informações relacionadas, consulte a Seção 14.7.5, “Deadlocks no InnoDB”.

* `innodb_purge_batch_size`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Define o número de páginas de undo log que o purge analisa e processa em um batch da lista de histórico. Em uma configuração de purge multithreaded, o Thread coordenador do purge divide `innodb_purge_batch_size` por `innodb_purge_threads` e atribui esse número de páginas a cada Thread de purge. A variável `innodb_purge_batch_size` também define o número de páginas de undo log que o purge libera após cada 128 iterações através dos undo logs.

  A opção `innodb_purge_batch_size` destina-se ao ajuste avançado de performance em combinação com a configuração `innodb_purge_threads`. A maioria dos usuários não precisa alterar `innodb_purge_batch_size` de seu valor padrão.

  Para informações relacionadas, consulte a Seção 14.8.10, “Configuração de Purge”.

* `innodb_purge_threads`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  O número de Threads em background dedicados à operação de purge do `InnoDB`. Aumentar o valor cria Threads de purge adicionais, o que pode melhorar a eficiência em sistemas onde operações DML são realizadas em múltiplas tabelas.

  Para informações relacionadas, consulte a Seção 14.8.10, “Configuração de Purge”.

* `innodb_purge_rseg_truncate_frequency`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Define a frequência com que o sistema de purge libera rollback segments em termos do número de vezes que o purge é invocado. Um undo tablespace não pode ser truncado até que seus rollback segments sejam liberados. Normalmente, o sistema de purge libera rollback segments uma vez a cada 128 vezes que o purge é invocado. O valor padrão é 128. Reduzir este valor aumenta a frequência com que o Thread de purge libera rollback segments.

  `innodb_purge_rseg_truncate_frequency` destina-se ao uso com `innodb_undo_log_truncate`. Para mais informações, consulte Truncando Undo Tablespaces.

* `innodb_random_read_ahead`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Habilita a técnica random read-ahead para otimizar o I/O do `InnoDB`.

  Para detalhes sobre considerações de performance para diferentes tipos de solicitações read-ahead, consulte a Seção 14.8.3.4, “Configurando o Prefetching do Buffer Pool do InnoDB (Read-Ahead)”"). Para conselhos gerais sobre ajuste de I/O, consulte a Seção 8.5.8, “Otimizando I/O de Disco do InnoDB”.

* `innodb_read_ahead_threshold`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Controla a sensibilidade do linear read-ahead que o `InnoDB` usa para fazer prefetch de páginas para o Buffer Pool. Se o `InnoDB` ler pelo menos `innodb_read_ahead_threshold` páginas sequencialmente de um extent (64 páginas), ele inicia uma leitura assíncrona para o extent inteiro seguinte. O intervalo permitido de valores é de 0 a 64. Um valor de 0 desabilita o read-ahead. Para o padrão de 56, o `InnoDB` deve ler pelo menos 56 páginas sequencialmente de um extent para iniciar uma leitura assíncrona para o extent seguinte.

  Saber quantas páginas são lidas através do mecanismo read-ahead e quantas dessas páginas são despejadas do Buffer Pool sem nunca serem acessadas pode ser útil ao ajustar a configuração `innodb_read_ahead_threshold`. A saída de `SHOW ENGINE INNODB STATUS` exibe informações de contador das variáveis de status global `Innodb_buffer_pool_read_ahead` e `Innodb_buffer_pool_read_ahead_evicted`, que relatam o número de páginas trazidas para o Buffer Pool por solicitações read-ahead, e o número de tais páginas despejadas do Buffer Pool sem nunca serem acessadas, respectivamente. As variáveis de status relatam valores globais desde a última reinicialização do servidor.

  `SHOW ENGINE INNODB STATUS` também mostra a taxa na qual as páginas read-ahead são lidas e a taxa na qual tais páginas são despejadas sem serem acessadas. As médias por segundo são baseadas nas estatísticas coletadas desde a última invocação de `SHOW ENGINE INNODB STATUS` e são exibidas na seção `BUFFER POOL AND MEMORY` da saída de `SHOW ENGINE INNODB STATUS`.

  Para mais informações, consulte a Seção 14.8.3.4, “Configurando o Prefetching do Buffer Pool do InnoDB (Read-Ahead)”). Para conselhos gerais sobre ajuste de I/O, consulte a Seção 8.5.8, “Otimizando I/O de Disco do InnoDB”.

* `innodb_read_io_threads`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  O número de I/O Threads para operações de leitura no `InnoDB`. Sua contraparte para Threads de escrita é `innodb_write_io_threads`. Para mais informações, consulte a Seção 14.8.6, “Configurando o Número de Threads de I/O em Background do InnoDB”. Para conselhos gerais sobre ajuste de I/O, consulte a Seção 8.5.8, “Otimizando I/O de Disco do InnoDB”.

  Note

  Em sistemas Linux, executar múltiplos servidores MySQL (tipicamente mais de 12) com configurações padrão para `innodb_read_io_threads`, `innodb_write_io_threads` e a configuração Linux `aio-max-nr` pode exceder os limites do sistema. Idealmente, aumente a configuração `aio-max-nr`; como solução alternativa, você pode reduzir as configurações para uma ou ambas as variáveis MySQL.

* `innodb_read_only`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Inicia o `InnoDB` em modo read-only. Para distribuição de aplicações Database ou conjuntos de dados em mídia read-only. Também pode ser usado em data warehouses para compartilhar o mesmo data directory entre múltiplas instâncias. Para mais informações, consulte a Seção 14.8.2, “Configurando o InnoDB para Operação Read-Only”.

* `innodb_replication_delay`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  O atraso do Thread de Replication em milissegundos em um servidor replica se `innodb_thread_concurrency` for atingido.

* `innodb_rollback_on_timeout`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  O `InnoDB` reverte apenas a última instrução em um timeout de transaction por padrão. Se `--innodb-rollback-on-timeout` for especificado, um timeout de transaction faz com que o `InnoDB` aborte e reverta a transaction inteira.

  Para mais informações, consulte a Seção 14.22.4, “Tratamento de Erros do InnoDB”.

* `innodb_rollback_segments`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Define o número de rollback segments usados pelo `InnoDB` para transactions que geram undo records. O número de transactions que cada rollback segment suporta depende do tamanho da página do `InnoDB` e do número de undo logs atribuídos a cada transaction. Para mais informações, consulte a Seção 14.6.7, “Undo Logs”.

  Um rollback segment é sempre atribuído ao tablespace do sistema, e 32 rollback segments são reservados para uso por tabelas temporárias e residem no tablespace temporário (`ibtmp1`). Para alocar rollback segments adicionais, `innodb_rollback_segments` deve ser definido para um valor igual ou maior que 33. Se você configurar undo tablespaces separados, o rollback segment no tablespace do sistema é tornado inativo.

  Quando `innodb_rollback_segments` é definido como 32 ou menos, o `InnoDB` atribui um rollback segment ao tablespace do sistema e 32 ao tablespace temporário.

  Quando `innodb_rollback_segments` é definido para um valor maior que 32, o `InnoDB` atribui um rollback segment ao tablespace do sistema, 32 ao tablespace temporário e rollback segments adicionais a undo tablespaces, se presentes. Se undo tablespaces não estiverem presentes, rollback segments adicionais são atribuídos ao tablespace do sistema.

  Embora você possa aumentar ou diminuir o número de rollback segments usados pelo `InnoDB`, o número de rollback segments fisicamente presentes no sistema nunca diminui. Assim, você pode começar com um valor baixo e aumentá-lo gradualmente para evitar alocar rollback segments que não são necessários. O valor padrão e máximo de `innodb_rollback_segments` é 128.

  Para informações relacionadas, consulte a Seção 14.3, “Multi-Versioning do InnoDB”. Para informações sobre como configurar undo tablespaces separados, consulte a Seção 14.6.3.4, “Undo Tablespaces”.

* `innodb_saved_page_number_debug`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Salva um número de página. Definir a opção `innodb_fil_make_page_dirty_debug` torna suja a página definida por `innodb_saved_page_number_debug`. A opção `innodb_saved_page_number_debug` só está disponível se o suporte a Debug for compilado usando a opção **CMake** `WITH_DEBUG`.

* `innodb_sort_buffer_size`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Esta variável define:

  + O tamanho do sort Buffer para operações DDL online que criam ou reconstroem Indexes secundários.

  + A quantidade pela qual o log file temporário é estendido ao registrar DML concorrente durante uma operação DDL online, e o tamanho do read Buffer e write Buffer do log file temporário.

  Para informações relacionadas, consulte a Seção 14.13.3, “Requisitos de Espaço de DDL Online”.

* `innodb_spin_wait_delay`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  O atraso máximo entre as polls para um spin Lock. A implementação de baixo nível deste mecanismo varia dependendo da combinação de hardware e sistema operacional, então o atraso não corresponde a um intervalo de tempo fixo. Para mais informações, consulte a Seção 14.8.9, “Configurando o Polling de Spin Lock”.

* `innodb_stats_auto_recalc`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Faz com que o `InnoDB` recalcule automaticamente estatísticas persistentes depois que os dados em uma table são alterados substancialmente. O valor limite é 10% das rows na table. Esta configuração se aplica a tabelas criadas quando a opção `innodb_stats_persistent` está habilitada. O recálculo automático de estatísticas também pode ser configurado especificando `STATS_AUTO_RECALC=1` em uma instrução `CREATE TABLE` ou `ALTER TABLE`. A quantidade de dados amostrados para produzir as estatísticas é controlada pela variável `innodb_stats_persistent_sample_pages`.

  Para mais informações, consulte a Seção 14.8.11.1, “Configurando Parâmetros de Estatísticas do Otimizador Persistentes”.

* `innodb_stats_include_delete_marked`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Por padrão, o `InnoDB` lê dados não submetidos a commit ao calcular estatísticas. No caso de uma transaction não submetida a commit que deleta rows de uma table, o `InnoDB` exclui registros marcados para deleção ao calcular estimativas de row e estatísticas de Index, o que pode levar a planos de execução não ideais para outras transactions que estão operando na table concorrentemente usando um nível de isolamento de transaction diferente de `READ UNCOMMITTED`. Para evitar este cenário, `innodb_stats_include_delete_marked` pode ser habilitado para garantir que o `InnoDB` inclua registros marcados para deleção ao calcular estatísticas persistentes do otimizador.

  Quando `innodb_stats_include_delete_marked` está habilitado, `ANALYZE TABLE` considera registros marcados para deleção ao recalcular estatísticas.

  `innodb_stats_include_delete_marked` é uma configuração global que afeta todas as tabelas `InnoDB`. É aplicável apenas a estatísticas persistentes do otimizador.

  Para informações relacionadas, consulte a Seção 14.8.11.1, “Configurando Parâmetros de Estatísticas do Otimizador Persistentes”.

* `innodb_stats_method`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Como o servidor trata valores `NULL` ao coletar estatísticas sobre a distribuição de valores de Index para tabelas `InnoDB`. Os valores permitidos são `nulls_equal`, `nulls_unequal` e `nulls_ignored`. Para `nulls_equal`, todos os valores de Index `NULL` são considerados iguais e formam um único grupo de valores com um tamanho igual ao número de valores `NULL`. Para `nulls_unequal`, os valores `NULL` são considerados desiguais, e cada `NULL` forma um grupo de valor distinto de tamanho

  1. Para `nulls_ignored`, os valores `NULL` são ignorados.

  O método usado para gerar estatísticas da table influencia como o otimizador escolhe Indexes para a execução de Query, conforme descrito na Seção 8.3.7, “Coleta de Estatísticas de Index do InnoDB e MyISAM”.

* `innodb_stats_on_metadata`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Esta opção se aplica apenas quando as estatísticas do otimizador estão configuradas para serem não persistentes. As estatísticas do otimizador não são persistidas no disco quando `innodb_stats_persistent` está desabilitado ou quando tabelas individuais são criadas ou alteradas com `STATS_PERSISTENT=0`. Para mais informações, consulte a Seção 14.8.11.2, “Configurando Parâmetros de Estatísticas do Otimizador Não Persistentes”.

  Quando `innodb_stats_on_metadata` está habilitado, o `InnoDB` atualiza estatísticas não persistentes quando há instruções de metadados como `SHOW TABLE STATUS` ou ao acessar as tabelas `TABLES` ou `STATISTICS` do Information Schema. (Estas atualizações são semelhantes ao que acontece para `ANALYZE TABLE`.) Quando desabilitado, o `InnoDB` não atualiza estatísticas durante essas operações. Deixar a configuração desabilitada pode melhorar a velocidade de acesso para schemas que têm um grande número de tabelas ou Indexes. Também pode melhorar a estabilidade dos planos de execução para Queries que envolvem tabelas `InnoDB`.

  Para alterar a configuração, execute a instrução `SET GLOBAL innodb_stats_on_metadata=mode`, onde `mode` é `ON` ou `OFF` (ou `1` ou `0`). Alterar a configuração `GLOBAL` requer privilégios suficientes para definir variáveis de sistema globais (consulte a Seção 5.1.8.1, “Privilégios de Variáveis de Sistema”) e afeta imediatamente a operação de todas as conexões que se conectarem subsequentemente. Qualquer cliente pode alterar a configuração `SESSION` para `innodb_stats_on_metadata`, e a configuração afeta apenas esse cliente.

* `innodb_stats_persistent`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Especifica se as estatísticas de Index do `InnoDB` são persistidas no disco. Caso contrário, as estatísticas podem ser recalculadas frequentemente, o que pode levar a variações nos planos de execução de Query. Esta configuração é armazenada com cada table quando a table é criada. Você pode definir `innodb_stats_persistent` no nível global antes de criar uma table, ou usar a cláusula `STATS_PERSISTENT` das instruções `CREATE TABLE` e `ALTER TABLE` para sobrescrever a configuração em todo o sistema e configurar estatísticas persistentes para tabelas individuais.

  Para mais informações, consulte a Seção 14.8.11.1, “Configurando Parâmetros de Estatísticas do Otimizador Persistentes”.

* `innodb_stats_persistent_sample_pages`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  O número de páginas de Index a serem amostradas ao estimar a cardinalidade e outras estatísticas para uma coluna indexada, como as calculadas por `ANALYZE TABLE`. Aumentar o valor melhora a precisão das estatísticas de Index, o que pode melhorar o plano de execução de Query, à custa de um aumento de I/O durante a execução de `ANALYZE TABLE` para uma table `InnoDB`. Para mais informações, consulte a Seção 14.8.11.1, “Configurando Parâmetros de Estatísticas do Otimizador Persistentes”.

  Note

  Definir um valor alto para `innodb_stats_persistent_sample_pages` pode resultar em um tempo de execução de `ANALYZE TABLE` prolongado. Para estimar o número de páginas de Database acessadas por `ANALYZE TABLE`, consulte a Seção 14.8.11.3, “Estimando a Complexidade de ANALYZE TABLE para Tabelas InnoDB”.

  `innodb_stats_persistent_sample_pages` se aplica apenas quando `innodb_stats_persistent` está habilitado para uma table; quando `innodb_stats_persistent` está desabilitado, `innodb_stats_transient_sample_pages` se aplica em vez disso.

* `innodb_stats_sample_pages`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Descontinuada. Use `innodb_stats_transient_sample_pages` em vez disso.

* `innodb_stats_transient_sample_pages`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  O número de páginas de Index a serem amostradas ao estimar a cardinalidade e outras estatísticas para uma coluna indexada, como as calculadas por `ANALYZE TABLE`. O valor padrão é 8. Aumentar o valor melhora a precisão das estatísticas de Index, o que pode melhorar o plano de execução de Query, à custa de um aumento de I/O ao abrir uma table `InnoDB` ou recalcular estatísticas. Para mais informações, consulte a Seção 14.8.11.2, “Configurando Parâmetros de Estatísticas do Otimizador Não Persistentes”.

  Note

  Definir um valor alto para `innodb_stats_transient_sample_pages` pode resultar em um tempo de execução de `ANALYZE TABLE` prolongado. Para estimar o número de páginas de Database acessadas por `ANALYZE TABLE`, consulte a Seção 14.8.11.3, “Estimando a Complexidade de ANALYZE TABLE para Tabelas InnoDB”.

  `innodb_stats_transient_sample_pages` se aplica apenas quando `innodb_stats_persistent` está desabilitado para uma table; quando `innodb_stats_persistent` está habilitado, `innodb_stats_persistent_sample_pages` se aplica em vez disso. Substitui `innodb_stats_sample_pages`. Para mais informações, consulte a Seção 14.8.11.2, “Configurando Parâmetros de Estatísticas do Otimizador Não Persistentes”.

* `innodb_status_output`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Habilita ou desabilita a saída periódica para o Monitor `InnoDB` padrão. Também usado em combinação com `innodb_status_output_locks` para habilitar ou desabilitar a saída periódica para o Lock Monitor do `InnoDB`. Para mais informações, consulte a Seção 14.18.2, “Habilitando Monitores do InnoDB”.

* `innodb_status_output_locks`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Habilita ou desabilita o Lock Monitor do `InnoDB`. Quando habilitado, o Lock Monitor do `InnoDB` imprime informações adicionais sobre Locks na saída de `SHOW ENGINE INNODB STATUS` e na saída periódica impressa no error log do MySQL. A saída periódica para o Lock Monitor do `InnoDB` é impressa como parte da saída padrão do Monitor `InnoDB`. O Monitor `InnoDB` padrão deve, portanto, estar habilitado para que o Lock Monitor do `InnoDB` imprima dados no error log do MySQL periodicamente. Para mais informações, consulte a Seção 14.18.2, “Habilitando Monitores do InnoDB”.

* `innodb_strict_mode`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Quando `innodb_strict_mode` está habilitado, o `InnoDB` retorna erros em vez de avisos ao verificar opções de table inválidas ou incompatíveis.

  Ele verifica se as opções `KEY_BLOCK_SIZE`, `ROW_FORMAT`, `DATA DIRECTORY`, `TEMPORARY` e `TABLESPACE` são compatíveis entre si e com outras configurações.

  `innodb_strict_mode=ON` também habilita uma verificação de tamanho de row ao criar ou alterar uma table, para evitar que `INSERT` ou `UPDATE` falhem devido ao registro ser muito grande para o tamanho de página selecionado.

  Você pode habilitar ou desabilitar `innodb_strict_mode` na linha de comando ao iniciar o `mysqld`, ou em um arquivo de configuração do MySQL. Você também pode habilitar ou desabilitar `innodb_strict_mode` em tempo de execução com a instrução `SET [GLOBAL|SESSION] innodb_strict_mode=mode`, onde `mode` é `ON` ou `OFF`. Alterar a configuração `GLOBAL` requer privilégios suficientes para definir variáveis de sistema globais (consulte a Seção 5.1.8.1, “Privilégios de Variáveis de Sistema”) e afeta a operação de todos os clientes que se conectarem subsequentemente. Qualquer cliente pode alterar a configuração `SESSION` para `innodb_strict_mode`, e a configuração afeta apenas esse cliente.

* `innodb_support_xa`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Habilita o suporte do `InnoDB` para two-phase commit em transactions XA, causando um flush de disco extra para a preparação da transaction. O mecanismo XA é usado internamente e é essencial para qualquer servidor que tenha seu binary log ativado e esteja aceitando alterações em seus dados de mais de um Thread. Se você desabilitar `innodb_support_xa`, as transactions podem ser escritas no binary log em uma ordem diferente daquela em que o Database ativo as está submetendo a commit, o que pode produzir dados diferentes quando o binary log é reproduzido em disaster recovery ou em uma replica. Não desabilite `innodb_support_xa` em um servidor de origem de Replication, a menos que você tenha uma configuração incomum onde apenas um Thread é capaz de alterar dados.

  `innodb_support_xa` está descontinuada; espere que seja removida em uma futura versão do MySQL. O suporte do `InnoDB` para two-phase commit em transactions XA está sempre habilitado a partir do MySQL 5.7.10. Desabilitar `innodb_support_xa` não é mais permitido, pois torna a Replication insegura e impede ganhos de performance associados ao binary log group commit.

* `innodb_sync_array_size`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Define o tamanho do array de espera por mutex/Lock. Aumentar o valor divide a estrutura de dados interna usada para coordenar Threads, para maior concorrência em workloads com um grande número de Threads em espera. Esta configuração deve ser configurada quando a instância MySQL está sendo iniciada, e não pode ser alterada depois. Aumentar o valor é recomendado para workloads que frequentemente produzem um grande número de Threads em espera, tipicamente maior que 768.

* `innodb_sync_spin_loops`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  O número de vezes que um Thread espera por um mutex do `InnoDB` ser liberado antes que o Thread seja suspenso.

* `innodb_sync_debug`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Habilita a verificação de Debug de sync para o storage engine `InnoDB`. Esta opção está disponível apenas se o suporte a Debug for compilado usando a opção **CMake** `WITH_DEBUG`.

  Anteriormente, habilitar a verificação de Debug de sync do `InnoDB` exigia que a facilidade Debug Sync fosse habilitada usando a opção **CMake** `ENABLE_DEBUG_SYNC`, que foi removida desde então. Este requisito foi removido no MySQL 5.7 com a introdução desta variável.

* `innodb_table_locks`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Se `autocommit = 0`, o `InnoDB` honra `LOCK TABLES`; o MySQL não retorna de `LOCK TABLES ... WRITE` até que todos os outros Threads tenham liberado todos os seus Locks para a table. O valor padrão de `innodb_table_locks` é 1, o que significa que `LOCK TABLES` faz com que o InnoDB bloqueie uma table internamente se `autocommit = 0`.

  `innodb_table_locks = 0` não tem efeito para tabelas bloqueadas explicitamente com `LOCK TABLES ... WRITE`. Tem efeito para tabelas bloqueadas para leitura ou escrita por `LOCK TABLES ... WRITE` implicitamente (por exemplo, através de triggers) ou por `LOCK TABLES ... READ`.

  Para informações relacionadas, consulte a Seção 14.7, “Modelo de Transação e Locking do InnoDB”.

* `innodb_temp_data_file_path`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Define o path relativo, nome, tamanho e atributos dos arquivos de dados do tablespace temporário do `InnoDB`. Se você não especificar um valor para `innodb_temp_data_file_path`, o comportamento padrão é criar um único arquivo de dados com auto-extensão chamado `ibtmp1` no data directory do MySQL. O tamanho inicial do arquivo é ligeiramente maior que 12MB.

  A sintaxe completa para uma especificação de arquivo de dados do tablespace temporário inclui o nome do arquivo, tamanho do arquivo e atributos `autoextend` e `max`:

  ```sql
  file_name:file_size[:autoextend[:max:max_file_size
  ```

  O arquivo de dados do tablespace temporário não pode ter o mesmo nome que outro arquivo de dados do `InnoDB`. Qualquer incapacidade ou erro ao criar um arquivo de dados do tablespace temporário é tratado como fatal e a inicialização do servidor é recusada. O tablespace temporário tem um ID de espaço gerado dinamicamente, que pode mudar a cada reinicialização do servidor.

  Os tamanhos de arquivo são especificados em KB, MB ou GB (1024MB) anexando `K`, `M` ou `G` ao valor do tamanho. A soma dos tamanhos dos arquivos deve ser ligeiramente maior que 12MB.

  O limite de tamanho dos arquivos individuais é determinado pelo seu sistema operacional. Você pode definir o tamanho do arquivo para mais de 4GB em sistemas operacionais que suportam arquivos grandes. O uso de partições de disco raw para arquivos de dados do tablespace temporário não é suportado.

  Os atributos `autoextend` e `max` podem ser usados apenas para o arquivo de dados que é especificado por último na configuração `innodb_temp_data_file_path`. Por exemplo:

  ```sql
  [mysqld]
  innodb_temp_data_file_path=ibtmp1:50M;ibtmp2:12M:autoextend:max:500M
  ```

  Se você especificar a opção `autoextend`, o `InnoDB` estende o arquivo de dados se ficar sem espaço livre. O incremento `autoextend` é de 64MB por padrão. Para modificar o incremento, altere a variável de sistema `innodb_autoextend_increment`.

  O path completo do diretório para os arquivos de dados do tablespace temporário é formado concatenando os paths definidos por `innodb_data_home_dir` e `innodb_temp_data_file_path`.

  O tablespace temporário é compartilhado por todas as tabelas temporárias `InnoDB` não comprimidas. As tabelas temporárias comprimidas residem em arquivos de tablespace file-per-table criados no diretório de arquivos temporários, que é definido pela opção de configuração `tmpdir`.

  Antes de executar o `InnoDB` em modo read-only, defina `innodb_temp_data_file_path` para um local fora do data directory. O path deve ser relativo ao data directory. Por exemplo:

  ```sql
  --innodb-temp-data-file-path=../../../tmp/ibtmp1:12M:autoextend
  ```

  Metadados sobre tabelas temporárias `InnoDB` ativas estão localizados na tabela `INNODB_TEMP_TABLE_INFO` do Information Schema.

  Para informações relacionadas, consulte a Seção 14.6.3.5, “O Tablespace Temporário”.

* `innodb_thread_concurrency`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Define o número máximo de Threads permitidos dentro do `InnoDB`. Um valor de 0 (o padrão) é interpretado como concorrência infinita (sem limite). Esta variável destina-se ao ajuste de performance em sistemas de alta concorrência.

  O `InnoDB` tenta manter o número de Threads dentro do `InnoDB` menor ou igual ao limite `innodb_thread_concurrency`. Threads esperando por Locks não são contados no número de Threads executando concorrentemente.

  A configuração correta depende da workload e do ambiente de computação. Considere definir esta variável se sua instância MySQL compartilha recursos de CPU com outras aplicações ou se sua workload ou número de usuários concorrentes está crescendo. Teste uma faixa de valores para determinar a configuração que oferece o melhor desempenho. `innodb_thread_concurrency` é uma variável dinâmica, o que permite experimentar diferentes configurações em um sistema de teste ativo. Se uma configuração específica tiver baixo desempenho, você pode rapidamente definir `innodb_thread_concurrency` de volta para 0.

  Use as seguintes diretrizes para ajudar a encontrar e manter uma configuração apropriada:

  + Se o número de user threads concorrentes para uma workload for consistentemente pequeno e não afetar a performance, defina `innodb_thread_concurrency=0` (sem limite).

  + Se sua workload for consistentemente pesada ou ocasionalmente apresentar picos, defina um valor `innodb_thread_concurrency` e ajuste-o até encontrar o número de Threads que oferece o melhor desempenho. Por exemplo, suponha que seu sistema tenha tipicamente 40 a 50 usuários, mas periodicamente o número aumenta para 60, 70 ou mais. Através de testes, você descobre que a performance permanece amplamente estável com um limite de 80 usuários concorrentes. Neste caso, defina `innodb_thread_concurrency` para 80.

  + Se você não quiser que o `InnoDB` use mais do que um certo número de CPUs virtuais para user threads (20 CPUs virtuais, por exemplo), defina `innodb_thread_concurrency` para este número (ou possivelmente menor, dependendo dos testes de performance). Se seu objetivo for isolar o MySQL de outras aplicações, considere vincular o processo `mysqld` exclusivamente às CPUs virtuais. Esteja ciente, no entanto, que a vinculação exclusiva pode resultar em uso não ideal de hardware se o processo `mysqld` não estiver consistentemente ocupado. Neste caso, você pode vincular o processo `mysqld` às CPUs virtuais, mas permitir que outras aplicações usem algumas ou todas as CPUs virtuais.

    Note

    Do ponto de vista do sistema operacional, usar uma solução de gerenciamento de recursos para gerenciar como o tempo de CPU é compartilhado entre aplicações pode ser preferível a vincular o processo `mysqld`. Por exemplo, você pode atribuir 90% do tempo de CPU virtual a uma determinada aplicação enquanto outros processos críticos *não* estão rodando, e reduzir esse valor para 40% quando outros processos críticos *estão* rodando.

  + Em alguns casos, a configuração ideal de `innodb_thread_concurrency` pode ser menor do que o número de CPUs virtuais.

  + Um valor `innodb_thread_concurrency` muito alto pode causar regressão de performance devido ao aumento da contenção em recursos e internos do sistema.

  + Monitore e analise seu sistema regularmente. Alterações na workload, número de usuários ou ambiente de computação podem exigir que você ajuste a configuração `innodb_thread_concurrency`.

  Um valor de 0 desabilita os contadores `queries inside InnoDB` e `queries in queue` na seção `ROW OPERATIONS` da saída de `SHOW ENGINE INNODB STATUS`.

  Para informações relacionadas, consulte a Seção 14.8.5, “Configurando a Concorrência de Threads para o InnoDB”.

* `innodb_thread_sleep_delay`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Define por quanto tempo os Threads do `InnoDB` dormem antes de entrar na fila do `InnoDB`, em microssegundos. O valor padrão é 10000. Um valor de 0 desabilita o sleep. Você pode definir `innodb_adaptive_max_sleep_delay` para o valor mais alto que você permitiria para `innodb_thread_sleep_delay`, e o `InnoDB` ajusta automaticamente `innodb_thread_sleep_delay` para cima ou para baixo dependendo da atividade de agendamento de Thread atual. Este ajuste dinâmico ajuda o mecanismo de agendamento de Thread a funcionar sem problemas durante períodos em que o sistema está com pouca carga ou quando está operando perto da capacidade total.

  Para mais informações, consulte a Seção 14.8.5, “Configurando a Concorrência de Threads para o InnoDB”.

* `innodb_tmpdir`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Usado para definir um diretório alternativo para arquivos temporários de ordenação criados durante operações `ALTER TABLE` online que reconstroem a table.

  Operações `ALTER TABLE` online que reconstroem a table também criam um arquivo de table *intermediário* no mesmo diretório que a table original. A opção `innodb_tmpdir` não é aplicável a arquivos de table intermediários.

  Um valor válido é qualquer path de diretório diferente do path do data directory do MySQL. Se o valor for NULL (o padrão), arquivos temporários são criados no diretório temporário do MySQL (`$TMPDIR` no Unix, `%TEMP%` no Windows, ou o diretório especificado pela opção de configuração `--tmpdir`). Se um diretório for especificado, a existência do diretório e as permissões são verificadas apenas quando `innodb_tmpdir` é configurado usando uma instrução `SET`. Se um symlink for fornecido em uma string de diretório, o symlink é resolvido e armazenado como um path absoluto. O path não deve exceder 512 bytes. Uma operação `ALTER TABLE` online reporta um erro se `innodb_tmpdir` for definido para um diretório inválido. `innodb_tmpdir` sobrescreve a configuração `tmpdir` do MySQL, mas apenas para operações `ALTER TABLE` online.

  O privilégio `FILE` é necessário para configurar `innodb_tmpdir`.

  A opção `innodb_tmpdir` foi introduzida para ajudar a evitar o transbordamento de um diretório de arquivo temporário localizado em um sistema de arquivos `tmpfs`. Tais transbordamentos poderiam ocorrer como resultado de grandes arquivos temporários de ordenação criados durante operações `ALTER TABLE` online que reconstroem a table.

  Em ambientes de Replication, considere replicar a configuração `innodb_tmpdir` apenas se todos os servidores tiverem o mesmo ambiente de sistema operacional. Caso contrário, replicar a configuração `innodb_tmpdir` pode resultar em uma falha de Replication ao executar operações `ALTER TABLE` online que reconstroem a table. Se os ambientes operacionais do servidor diferirem, recomenda-se que você configure `innodb_tmpdir` em cada servidor individualmente.

  Para mais informações, consulte a Seção 14.13.3, “Requisitos de Espaço de DDL Online”. Para informações sobre operações `ALTER TABLE` online, consulte a Seção 14.13, “InnoDB e DDL Online”.

* `innodb_trx_purge_view_update_only_debug`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Pausa o purge de registros marcados para deleção enquanto permite que a purge view seja atualizada. Esta opção cria artificialmente uma situação em que a purge view é atualizada, mas os purges ainda não foram realizados. Esta opção só está disponível se o suporte a Debug for compilado usando a opção **CMake** `WITH_DEBUG`.

* `innodb_trx_rseg_n_slots_debug`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Define um flag de Debug que limita `TRX_RSEG_N_SLOTS` a um determinado valor para a função `trx_rsegf_undo_find_free` que procura slots livres para undo log segments. Esta opção só está disponível se o suporte a Debug for compilado usando a opção **CMake** `WITH_DEBUG`.

* `innodb_undo_directory`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  O path onde o `InnoDB` cria undo tablespaces. Tipicamente usado para colocar undo logs em um dispositivo de armazenamento diferente. Usado em conjunto com `innodb_rollback_segments` e `innodb_undo_tablespaces`.

  Não há valor padrão (é NULL). Se um path não for especificado, os undo tablespaces são criados no data directory do MySQL, conforme definido por `datadir`.

  Para mais informações, consulte a Seção 14.6.3.4, “Undo Tablespaces”.

* `innodb_undo_log_truncate`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Quando habilitado, undo tablespaces que excedem o valor limite definido por `innodb_max_undo_log_size` são marcados para truncamento. Apenas undo tablespaces podem ser truncados. O truncamento de undo logs que residem no tablespace do sistema não é suportado. Para que o truncamento ocorra, deve haver pelo menos dois undo tablespaces e dois undo logs habilitados para redo configurados para usar undo tablespaces. Isso significa que `innodb_undo_tablespaces` deve ser definido para um valor igual ou maior que 2, e `innodb_rollback_segments` deve ser definido para um valor igual ou maior que 35.

  A variável `innodb_purge_rseg_truncate_frequency` pode ser usada para acelerar o truncamento de undo tablespaces.

  Para mais informações, consulte Truncando Undo Tablespaces.

* `innodb_undo_logs`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Note

  `innodb_undo_logs` está descontinuada; espere que seja removida em uma futura versão do MySQL.

  Define o número de rollback segments usados pelo `InnoDB`. A opção `innodb_undo_logs` é um alias para `innodb_rollback_segments`. Para mais informações, consulte a descrição de `innodb_rollback_segments`.

* `innodb_undo_tablespaces`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  O número de undo tablespaces usados pelo `InnoDB`. O valor padrão é 0.

  Note

  `innodb_undo_tablespaces` está descontinuada; espere que seja removida em uma futura versão do MySQL.

  Como os undo logs podem se tornar grandes durante transactions de longa duração, ter undo logs em múltiplos tablespaces reduz o tamanho máximo de qualquer tablespace. Os arquivos de undo tablespace são criados no local definido por `innodb_undo_directory`, com nomes no formato `undoN`, onde *`N`* é uma série sequencial de inteiros (incluindo zeros à esquerda) representando o ID do espaço.

  O tamanho inicial de um arquivo de undo tablespace depende do valor de `innodb_page_size`. Para o tamanho de página `InnoDB` padrão de 16KB, o tamanho inicial do arquivo de undo tablespace é 10MiB. Para tamanhos de página de 4KB, 8KB, 32KB e 64KB, os tamanhos iniciais dos arquivos de undo tablespace são 7MiB, 8MiB, 20MiB e 40MiB, respectivamente.

  É necessário um mínimo de dois undo tablespaces para habilitar o truncamento de undo logs. Consulte Truncando Undo Tablespaces.

  Importante

  `innodb_undo_tablespaces` só pode ser configurado antes de inicializar a instância MySQL e não pode ser alterado depois. Se nenhum valor for especificado, a instância é inicializada usando a configuração padrão de 0. Tentar reiniciar o `InnoDB` com um número maior de undo tablespaces do que o especificado quando a instância MySQL foi inicializada resulta em uma falha de inicialização e um erro indicando que o `InnoDB` não encontrou o número esperado de undo tablespaces.

  32 de 128 rollback segments são reservados para tabelas temporárias, conforme descrito na Seção 14.6.7, “Undo Logs”. Um rollback segment é sempre atribuído ao tablespace do sistema, o que deixa 95 rollback segments disponíveis para undo tablespaces. Isso significa que o limite máximo de `innodb_undo_tablespaces` é 95.

  Para mais informações, consulte a Seção 14.6.3.4, “Undo Tablespaces”.

* `innodb_use_native_aio`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  Especifica se deve usar o subsistema I/O assíncrono do Linux. Esta variável se aplica apenas a sistemas Linux e não pode ser alterada enquanto o servidor está em execução. Normalmente, você não precisa configurar esta opção, pois está habilitada por padrão.

  A capacidade de I/O assíncrono que o `InnoDB` tem em sistemas Windows está disponível em sistemas Linux. (Outros sistemas tipo Unix continuam a usar chamadas de I/O síncronas.) Este recurso melhora a escalabilidade de sistemas intensivos em I/O, que tipicamente mostram muitas leituras/escritas pendentes na saída de `SHOW ENGINE INNODB STATUS\G`.

  Executar com um grande número de I/O Threads do `InnoDB`, e especialmente executar múltiplas instâncias desse tipo na mesma máquina servidora, pode exceder os limites de capacidade em sistemas Linux. Neste caso, você pode receber o seguinte erro:

  ```sql
  EAGAIN: The specified maxevents exceeds the user's limit of available events.
  ```

  Você pode tipicamente resolver este erro escrevendo um limite superior em `/proc/sys/fs/aio-max-nr`.

  No entanto, se um problema com o subsistema I/O assíncrono no SO impedir que o `InnoDB` inicie, você pode iniciar o servidor com `innodb_use_native_aio=0`. Esta opção também pode ser desabilitada automaticamente durante a inicialização se o `InnoDB` detectar um problema potencial, como uma combinação de localização `tmpdir`, sistema de arquivos `tmpfs` e kernel Linux que não suporta AIO em `tmpfs`.

  Para mais informações, consulte a Seção 14.8.7, “Usando I/O Assíncrono no Linux”.

* `innodb_version`

  O número da versão do `InnoDB`. No MySQL 5.7, a numeração de versão separada para o `InnoDB` não se aplica e este valor é o mesmo que o número da `version` do servidor.

* `innodb_write_io_threads`

  <table frame="box" rules="all" summary="Propriedades para innodb"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

  O número de I/O Threads para operações de escrita no `InnoDB`. O valor padrão é 4. Sua contraparte para Threads de leitura é `innodb_read_io_threads`. Para mais informações, consulte a Seção 14.8.6, “Configurando o Número de Threads de I/O em Background do InnoDB”. Para conselhos gerais sobre ajuste de I/O, consulte a Seção 8.5.8, “Otimizando I/O de Disco do InnoDB”.

  Note

  Em sistemas Linux, executar múltiplos servidores MySQL (tipicamente mais de 12) com configurações padrão para `innodb_read_io_threads`, `innodb_write_io_threads` e a configuração Linux `aio-max-nr` pode exceder os limites do sistema. Idealmente, aumente a configuração `aio-max-nr`; como solução alternativa, você pode reduzir as configurações para uma ou ambas as variáveis MySQL.

  Considere também o valor de `sync_binlog`, que controla a sincronização do binary log no disco.

  Para conselhos gerais sobre ajuste de I/O, consulte a Seção 8.5.8, “Otimizando I/O de Disco do InnoDB”.