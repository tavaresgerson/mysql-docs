## 17.14 Opções de inicialização do InnoDB e variáveis do sistema

* Opções de inicialização do InnoDB
* Variáveis do sistema do InnoDB

* As variáveis do sistema que são verdadeiras ou falsas podem ser habilitadas na inicialização do servidor ao nomeá-las, ou desabilitadas usando o prefixo `--skip-`. Por exemplo, para habilitar ou desabilitar o índice de hash adaptativo `InnoDB`, você pode usar `--innodb-adaptive-hash-index` ou `--skip-innodb-adaptive-hash-index` na linha de comando, ou `innodb_adaptive_hash_index` ou `skip_innodb_adaptive_hash_index` em um arquivo de opção.

* Algumas descrições de variáveis referem-se a “ativar” ou “desativar” uma variável. Essas variáveis podem ser ativadas com a declaração `SET` definindo-as como `ON` ou `1`, ou desativadas definindo-as como `OFF` ou `0`. Variáveis booleanas podem ser definidas no início com os valores `ON`, `TRUE`, `OFF` e `FALSE` (não sensíveis ao caso), bem como `1` e `0`. Ver Seção 6.2.2.4, “Modificadores de Opção do Programa”.

* As variáveis do sistema que aceitam um valor numérico podem ser especificadas como `--var_name=value` na linha de comando ou como `var_name=value` em arquivos de opção.

* Muitas variáveis do sistema podem ser alteradas em tempo de execução (consulte a Seção 7.1.9.2, “Variáveis de sistema dinâmicas”).

* Para informações sobre os modificadores de escopo de variáveis `GLOBAL` e `SESSION`, consulte a documentação da declaração `SET`.

* Algumas opções controlam os locais e o layout dos arquivos de dados do `InnoDB`. A Seção 17.8.1, “Configuração de Inicialização do InnoDB”, explica como usar essas opções.

* Algumas opções, que você pode não usar inicialmente, ajudam a ajustar as características de desempenho do `InnoDB` com base na capacidade da máquina e no volume de trabalho do seu banco de dados.

* Para mais informações sobre a especificação de opções e variáveis do sistema, consulte a Seção 6.2.2, “Especificação de opções do programa”.

**Tabela 17.24 Opção e Referência de Variável InnoDB**

<table frame="box" rules="all" summary="Reference for InnoDB command-line options and system variables."><col style="width: 20%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><thead><tr><th scope="col">Name</th> <th scope="col">Cmd-Line</th> <th scope="col">Option File</th> <th scope="col">System Var</th> <th scope="col">Status Var</th> <th scope="col">Var Scope</th> <th scope="col">Dynamic</th> </tr></thead><tbody><tr><th scope="row">daemon_memcached_enable_binlog</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">daemon_memcached_engine_lib_name</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">daemon_memcached_engine_lib_path</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">daemon_memcached_option</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">daemon_memcached_r_batch_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">daemon_memcached_w_batch_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">foreign_key_checks</th> <td></td> <td></td> <td>Yes</td> <td></td> <td>Both</td> <td>Yes</td> </tr><tr><th scope="row">innodb</th> <td>Yes</td> <td>Yes</td> <td></td> <td></td> <td></td> <td></td> </tr><tr><th scope="row">innodb_adaptive_flushing</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_adaptive_flushing_lwm</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_adaptive_hash_index</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_adaptive_hash_index_parts</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_adaptive_max_sleep_delay</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_api_bk_commit_interval</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_api_disable_rowlock</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_api_enable_binlog</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_api_enable_mdl</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_api_trx_level</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_autoextend_increment</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_autoinc_lock_mode</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_background_drop_list_empty</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">Innodb_buffer_pool_bytes_data</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Innodb_buffer_pool_bytes_dirty</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_buffer_pool_chunk_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_buffer_pool_debug</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_buffer_pool_dump_at_shutdown</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_buffer_pool_dump_now</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_buffer_pool_dump_pct</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">Innodb_buffer_pool_dump_status</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_buffer_pool_filename</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_buffer_pool_in_core_file</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_buffer_pool_instances</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_buffer_pool_load_abort</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_buffer_pool_load_at_startup</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_buffer_pool_load_now</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">Innodb_buffer_pool_load_status</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Innodb_buffer_pool_pages_data</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Innodb_buffer_pool_pages_dirty</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Innodb_buffer_pool_pages_flushed</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Innodb_buffer_pool_pages_free</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Innodb_buffer_pool_pages_latched</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Innodb_buffer_pool_pages_misc</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Innodb_buffer_pool_pages_total</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Innodb_buffer_pool_read_ahead</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Innodb_buffer_pool_read_ahead_evicted</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Innodb_buffer_pool_read_ahead_rnd</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Innodb_buffer_pool_read_requests</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Innodb_buffer_pool_reads</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Innodb_buffer_pool_resize_status</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_buffer_pool_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">Innodb_buffer_pool_wait_free</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Innodb_buffer_pool_write_requests</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_change_buffer_max_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_change_buffering</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_change_buffering_debug</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_checkpoint_disabled</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_checksum_algorithm</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_cmp_per_index_enabled</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_commit_concurrency</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_compress_debug</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_compression_failure_threshold_pct</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_compression_level</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_compression_pad_pct_max</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_concurrency_tickets</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_data_file_path</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Innodb_data_fsyncs</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_data_home_dir</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Innodb_data_pending_fsyncs</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Innodb_data_pending_reads</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Innodb_data_pending_writes</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Innodb_data_read</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Innodb_data_reads</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Innodb_data_writes</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Innodb_data_written</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Innodb_dblwr_pages_written</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Innodb_dblwr_writes</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_ddl_buffer_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Session</td> <td>Yes</td> </tr><tr><th scope="row">innodb_ddl_log_crash_reset_debug</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_ddl_threads</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Session</td> <td>Yes</td> </tr><tr><th scope="row">innodb_deadlock_detect</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_dedicated_server</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_default_row_format</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_directories</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_disable_sort_file_cache</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_doublewrite</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Varies</td> </tr><tr><th scope="row">innodb_doublewrite_batch_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_doublewrite_dir</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_doublewrite_files</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_doublewrite_pages</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_fast_shutdown</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_fil_make_page_dirty_debug</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_file_per_table</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_fill_factor</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_flush_log_at_timeout</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_flush_log_at_trx_commit</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_flush_method</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_flush_neighbors</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_flush_sync</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_flushing_avg_loops</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_force_load_corrupted</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_force_recovery</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_fsync_threshold</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_ft_aux_table</th> <td></td> <td></td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_ft_cache_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_ft_enable_diag_print</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_ft_enable_stopword</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Both</td> <td>Yes</td> </tr><tr><th scope="row">innodb_ft_max_token_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_ft_min_token_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_ft_num_word_optimize</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_ft_result_cache_limit</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_ft_server_stopword_table</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_ft_sort_pll_degree</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_ft_total_cache_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_ft_user_stopword_table</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Both</td> <td>Yes</td> </tr><tr><th scope="row">Innodb_have_atomic_builtins</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_idle_flush_pct</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_io_capacity</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_io_capacity_max</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_limit_optimistic_insert_debug</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_lock_wait_timeout</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Both</td> <td>Yes</td> </tr><tr><th scope="row">innodb_log_buffer_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Varies</td> </tr><tr><th scope="row">innodb_log_checkpoint_fuzzy_now</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_log_checkpoint_now</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_log_checksums</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_log_compressed_pages</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_log_file_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_log_files_in_group</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_log_group_home_dir</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_log_spin_cpu_abs_lwm</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_log_spin_cpu_pct_hwm</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_log_wait_for_flush_spin_hwm</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">Innodb_log_waits</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_log_write_ahead_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">Innodb_log_write_requests</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_log_writer_threads</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">Innodb_log_writes</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_lru_scan_depth</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_max_dirty_pages_pct</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_max_dirty_pages_pct_lwm</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_max_purge_lag</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_max_purge_lag_delay</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_max_undo_log_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_merge_threshold_set_all_debug</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_monitor_disable</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_monitor_enable</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_monitor_reset</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_monitor_reset_all</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">Innodb_num_open_files</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_numa_interleave</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_old_blocks_pct</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_old_blocks_time</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_online_alter_log_max_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_open_files</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Varies</td> </tr><tr><th scope="row">innodb_optimize_fulltext_only</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">Innodb_os_log_fsyncs</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Innodb_os_log_pending_fsyncs</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Innodb_os_log_pending_writes</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Innodb_os_log_written</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_page_cleaners</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Innodb_page_size</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_page_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Innodb_pages_created</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Innodb_pages_read</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Innodb_pages_written</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_parallel_read_threads</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Session</td> <td>Yes</td> </tr><tr><th scope="row">innodb_print_all_deadlocks</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_print_ddl_logs</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_purge_batch_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_purge_rseg_truncate_frequency</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_purge_threads</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_random_read_ahead</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_read_ahead_threshold</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_read_io_threads</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_read_only</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_redo_log_archive_dirs</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_redo_log_capacity</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">Innodb_redo_log_capacity_resized</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Innodb_redo_log_checkpoint_lsn</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Innodb_redo_log_current_lsn</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Innodb_redo_log_enabled</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_redo_log_encrypt</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">Innodb_redo_log_flushed_to_disk_lsn</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Innodb_redo_log_logical_size</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Innodb_redo_log_physical_size</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Innodb_redo_log_read_only</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Innodb_redo_log_resize_status</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Innodb_redo_log_uuid</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_replication_delay</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_rollback_on_timeout</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_rollback_segments</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">Innodb_row_lock_current_waits</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Innodb_row_lock_time</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Innodb_row_lock_time_avg</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Innodb_row_lock_time_max</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Innodb_row_lock_waits</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Innodb_rows_deleted</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Innodb_rows_inserted</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Innodb_rows_read</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Innodb_rows_updated</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_saved_page_number_debug</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_segment_reserve_factor</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_sort_buffer_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_spin_wait_delay</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_spin_wait_pause_multiplier</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_stats_auto_recalc</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_stats_include_delete_marked</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_stats_method</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_stats_on_metadata</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_stats_persistent</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_stats_persistent_sample_pages</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_stats_transient_sample_pages</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb-status-file</th> <td>Yes</td> <td>Yes</td> <td></td> <td></td> <td></td> <td></td> </tr><tr><th scope="row">innodb_status_output</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_status_output_locks</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_strict_mode</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Both</td> <td>Yes</td> </tr><tr><th scope="row">innodb_sync_array_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_sync_debug</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_sync_spin_loops</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">Innodb_system_rows_deleted</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Innodb_system_rows_inserted</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Innodb_system_rows_read</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Innodb_system_rows_updated</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_table_locks</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Both</td> <td>Yes</td> </tr><tr><th scope="row">innodb_temp_data_file_path</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_temp_tablespaces_dir</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_thread_concurrency</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_thread_sleep_delay</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_tmpdir</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Both</td> <td>Yes</td> </tr><tr><th scope="row">Innodb_truncated_status_writes</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_trx_purge_view_update_only_debug</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_trx_rseg_n_slots_debug</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_undo_directory</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_undo_log_encrypt</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_undo_log_truncate</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_undo_tablespaces</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Varies</td> </tr><tr><th scope="row">Innodb_undo_tablespaces_active</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Innodb_undo_tablespaces_explicit</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Innodb_undo_tablespaces_implicit</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Innodb_undo_tablespaces_total</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_use_fdatasync</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">innodb_use_native_aio</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_validate_tablespace_paths</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_version</th> <td></td> <td></td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">innodb_write_io_threads</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">unique_checks</th> <td></td> <td></td> <td>Yes</td> <td></td> <td>Both</td> <td>Yes</td> </tr></tbody></table>

### Opções de inicialização do InnoDB

* `--innodb[=value]`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>

Controla o carregamento do motor de armazenamento `InnoDB`, se o servidor foi compilado com suporte ao `InnoDB`. Esta opção tem um formato triestático, com valores possíveis de `OFF`, `ON` ou `FORCE`. Veja a Seção 7.6.1, “Instalando e Desinstalando Plugins”.

Para desabilitar `InnoDB`, use `--innodb=OFF` ou `--skip-innodb`. Nesse caso, como o motor de armazenamento padrão é `InnoDB`, o servidor não inicia a menos que você também use `--default-storage-engine` e `--default-tmp-storage-engine` para definir o padrão para algum outro motor tanto para tabelas permanentes quanto para `TEMPORARY`.

O motor de armazenamento `InnoDB` não pode mais ser desativado, e as opções `--innodb=OFF` e `--skip-innodb` são desatualizadas e não têm efeito. Seu uso resulta em um aviso. Espere que essas opções sejam removidas em um lançamento futuro do MySQL.

* `--innodb-dedicated-server`

  <table frame="box" rules="all" summary="Properties for innodb-dedicated-server"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

Quando essa opção é definida ao iniciar o servidor com `--innodb-dedicated-server` ou `--innodb-dedicated-server=ON`, seja na linha de comando ou em um arquivo `my.cnf`, o `InnoDB` calcula e define automaticamente os valores das seguintes variáveis:

+ `innodb_buffer_pool_size`  
  + `innodb_redo_log_capacity` ou, antes do MySQL 8.0.30, `innodb_log_file_size` e `innodb_log_files_in_group`.

+ `innodb_flush_method`

Nota

`innodb_log_file_size` e `innodb_log_files_in_group` são descontinuados no MySQL 8.0.30. Essas variáveis são substituídas por `innodb_redo_log_capacity`. Veja a Seção 17.6.5, “Redo Log”.

Você deve considerar o uso de `--innodb-dedicated-server` apenas se a instância do MySQL estiver em um servidor dedicado onde ela pode usar todos os recursos do sistema disponíveis. Não é recomendado usar essa opção se a instância do MySQL compartilhar recursos do sistema com outras aplicações.

É fortemente recomendado que você leia a Seção 17.8.12, “Habilitar Configuração Automática InnoDB para um Servidor MySQL Dedicado”, antes de usar essa opção em produção.

* `--innodb-status-file`

  <table frame="box" rules="all" summary="Properties for innodb-status-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb-status-file[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

A opção de inicialização `--innodb-status-file` controla se `InnoDB` cria um arquivo com o nome `innodb_status.pid` no diretório de dados e escreve a saída [`SHOW ENGINE INNODB STATUS`](show-engine.html "15.7.7.15 SHOW ENGINE Statement") nele a cada 15 segundos, aproximadamente.

O arquivo `innodb_status.pid` não é criado por padrão. Para criá-lo, inicie o **mysqld** com a opção `--innodb-status-file`. `InnoDB` remove o arquivo quando o servidor é desligado normalmente. Se ocorrer um desligamento anormal, o arquivo de status pode ter que ser removido manualmente.

A opção `--innodb-status-file` é destinada ao uso temporário, pois a geração de saída `SHOW ENGINE INNODB STATUS`(show-engine.html "15.7.7.15 SHOW ENGINE Statement") pode afetar o desempenho, e o arquivo `innodb_status.pid` pode se tornar bastante grande ao longo do tempo.

Para informações relacionadas, consulte a Seção 17.17.2, “Habilitar monitores InnoDB”.

* `--skip-innodb`

Desative o mecanismo de armazenamento `InnoDB`. Veja a descrição de `--innodb`.

### Variáveis do sistema InnoDB

* `daemon_memcached_enable_binlog`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_enable_binlog"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-enable-binlog[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_enable_binlog</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

Ative esta opção no servidor de origem para usar o plugin `InnoDB` **memcached]] (`daemon_memcached`) com o log binário do MySQL. Esta opção só pode ser definida na inicialização do servidor. Você também deve habilitar o log binário do MySQL no servidor de origem usando a opção `--log-bin`.

Para mais informações, consulte a Seção 17.20.7, “O Plugin InnoDB memcached e Replicação”.

* `daemon_memcached_engine_lib_name`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_engine_lib_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-engine-lib-name=file_name</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_engine_lib_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>innodb_engine.so</code></td> </tr></tbody></table>

Especifica a biblioteca compartilhada que implementa o plugin `InnoDB` **memcached**.

Para mais informações, consulte a Seção 17.20.3, “Configurando o Plugin InnoDB memcached”.

* `daemon_memcached_engine_lib_path`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_engine_lib_path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-engine-lib-path=dir_name</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_engine_lib_path</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>NULL</code></td> </tr></tbody></table>

O caminho do diretório que contém a biblioteca compartilhada que implementa o plugin `InnoDB` **memcached**. O valor padrão é NULL, representando o diretório do plugin MySQL. Você não deve precisar modificar este parâmetro, a menos que especifique um plugin `memcached` para um motor de armazenamento diferente que esteja localizado fora do diretório do plugin MySQL.

Para mais informações, consulte a Seção 17.20.3, “Configurando o Plugin InnoDB memcached”.

* `daemon_memcached_option`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_option"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-option=options</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_option</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>

Usado para passar opções separadas por espaço no memcached para o daemon de cache de memória subjacente **memcached** durante o início. Por exemplo, você pode alterar a porta na qual o **memcached** escuta, reduzir o número máximo de conexões simultâneas, alterar o tamanho máximo de memória para um par chave-valor ou habilitar mensagens de depuração para o log de erro.

Consulte a Seção 17.20.3, “Configurando o Plugin InnoDB memcached”, para obter detalhes de uso. Para informações sobre as opções do **memcached**, consulte a página do manual do **memcached**.

* `daemon_memcached_r_batch_size`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_r_batch_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-r-batch-size=#</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_r_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr></tbody></table>

Especifica quantas operações de leitura do **memcached** (operações `get`) devem ser realizadas antes de realizar uma `COMMIT` para iniciar uma nova transação. É o equivalente a `daemon_memcached_w_batch_size`.

Esse valor é definido como 1 por padrão, para que quaisquer alterações feitas na tabela por meio de declarações SQL sejam imediatamente visíveis às operações do **memcached**. Você pode aumentá-lo para reduzir o custo de comitentes frequentes em um sistema onde a tabela subjacente só está sendo acessada por meio da interface do **memcached**. Se você definir o valor muito grande, a quantidade de dados de desfazer ou refazer pode impor algum custo de armazenamento, como em qualquer transação de longa duração.

Para mais informações, consulte a Seção 17.20.3, “Configurando o Plugin InnoDB memcached”.

* `daemon_memcached_w_batch_size`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_w_batch_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-w-batch-size=#</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_w_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>1048576</code></td> </tr></tbody></table>

Especifica quantas operações de escrita do **memcached**, como `add`, `set` e `incr`, devem ser realizadas antes de realizar uma `COMMIT` para iniciar uma nova transação. Contraparte de `daemon_memcached_r_batch_size`.

Este valor é definido como 1 por padrão, assumindo que os dados armazenados são importantes para preservar em caso de uma interrupção e devem ser imediatamente comprometidos. Ao armazenar dados não críticos, você pode aumentar esse valor para reduzir o overhead de comitamentos frequentes; mas, então, as últimas operações de escrita *`N`*-1 não comprometidas podem ser perdidas se ocorrer uma saída inesperada.

Para mais informações, consulte a Seção 17.20.3, “Configurando o Plugin InnoDB memcached”.

* `innodb_adaptive_flushing`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>0

Especifica se ajustar dinamicamente a taxa de limpeza de páginas sujas no pool de buffers `InnoDB` com base na carga de trabalho. Ajustar a taxa de limpeza dinamicamente visa evitar picos de atividade de E/S. Esta configuração é habilitada por padrão. Consulte a Seção 17.8.3.5, “Configurando a Limpeza do Pool de Buffers”, para obter mais informações. Para obter conselhos gerais sobre o ajuste de E/S, consulte a Seção 10.5.8, “Otimizando o E/S de Disco do InnoDB”.

* `innodb_adaptive_flushing_lwm`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>1

Define a marca de água baixa que representa a porcentagem da capacidade do log de refazer em que [limpagem adaptativa][(glossary.html#glos_adaptive_flushing "adaptive flushing")] é habilitada. Para mais informações, consulte a Seção 17.8.3.5, “Configurando a Limpeza do Pool de Buffer”.

* `innodb_adaptive_hash_index`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>2

Se o `InnoDB` [índice de hash adaptável](glossary.html#glos_adaptive_hash_index "adaptive hash index") está habilitado ou desabilitado. Pode ser desejável, dependendo da sua carga de trabalho, habilitar ou desabilitar dinamicamente o [índice de hash adaptável](glossary.html#glos_adaptive_hash_index "adaptive hash index") para melhorar o desempenho das consultas. Como o índice de hash adaptável pode não ser útil para todas as cargas de trabalho, realize benchmarks com ele habilitado e desabilitado, usando cargas de trabalho realistas. Veja a Seção 17.5.3, “Índice de Hash Adaptável”, para detalhes.

Essa variável é ativada por padrão. Você pode modificar esse parâmetro usando a declaração `SET GLOBAL`, sem precisar reiniciar o servidor. Alterar o ajuste em tempo de execução requer privilégios suficientes para definir variáveis de sistema globais. Veja a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”. Você também pode usar `--skip-innodb-adaptive-hash-index` no início do servidor para desativá-la.

Desabilitando o índice de hash adaptável, o quadro de hash é imediatamente esvaziado. As operações normais podem continuar enquanto o quadro de hash é esvaziado, e as consultas que estavam usando o acesso ao quadro de hash acessam o índice B-trees diretamente. Quando o índice de hash adaptável é reativado, o quadro de hash é preenchido novamente durante a operação normal.

* `innodb_adaptive_hash_index_parts`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>3

Dividir o sistema de busca de índice de hash adaptativo. Cada índice está vinculado a uma partição específica, com cada partição protegida por um gatilho separado.

O sistema de busca de índice de hash adaptável é dividido em 8 partes por padrão. O ajuste máximo é de 512.

Para informações relacionadas, consulte a Seção 17.5.3, “Índice Hash Adaptativo”.

* `innodb_adaptive_max_sleep_delay`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>4

Permite que `InnoDB` ajuste automaticamente o valor de `innodb_thread_sleep_delay` para cima ou para baixo de acordo com a carga de trabalho atual. Qualquer valor não nulo permite o ajuste automático e dinâmico do valor de `innodb_thread_sleep_delay`, até o valor máximo especificado na opção `innodb_adaptive_max_sleep_delay`. O valor representa o número de microsegundos. Esta opção pode ser útil em sistemas ocupados, com mais de 16 threads `InnoDB`. (Na prática, é mais valioso para sistemas MySQL com centenas ou milhares de conexões simultâneas.)

Para mais informações, consulte a Seção 17.8.4, “Configurando Concorrência de Fuso para InnoDB”.

* `innodb_api_bk_commit_interval`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>5

Com que frequência auto-commitar conexões ociosas que utilizam a interface `InnoDB` **memcached**, em segundos. Para mais informações, consulte a Seção 17.20.6.4, “Controlando o comportamento transacional do plugin memcached InnoDB”.

* `innodb_api_disable_rowlock`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>6

Use esta opção para desabilitar os bloqueios de linha quando o **memcached** `InnoDB` realiza operações DML. Por padrão, o `innodb_api_disable_rowlock` é desativado, o que significa que o **memcached** solicita bloqueios de linha para as operações `get` e `set`. Quando o `innodb_api_disable_rowlock` é ativado, o **memcached** solicita um bloqueio de tabela em vez de bloqueios de linha.

`innodb_api_disable_rowlock` não é dinâmico. Ele deve ser especificado na linha de comando do **mysqld** ou inserido no arquivo de configuração do MySQL. A configuração entra em vigor quando o plugin é instalado, o que ocorre quando o servidor MySQL é iniciado.

Para mais informações, consulte a Seção 17.20.6.4, “Controlar o comportamento transacional do plugin memcached do InnoDB”.

* `innodb_api_enable_binlog`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>7

Permite que você use o plugin `InnoDB` **memcached** com o log binário do MySQL. Para mais informações, consulte Habilitar o log binário InnoDB memcached.

* `innodb_api_enable_mdl`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>8

Bloqueia a tabela usada pelo plugin `InnoDB` **memcached**, para que não possa ser removida ou alterada por DDL através da interface SQL. Para mais informações, consulte a Seção 17.20.6.4, “Controlando o comportamento transacional do plugin memcached InnoDB”.

* `innodb_api_trx_level`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>9

Controla o nível de isolamento de transação em consultas processadas pela interface **memcached**. As constantes correspondentes aos nomes familiares são:

+ 0 = `READ UNCOMMITTED`  
  + 1 = `READ COMMITTED`  
  + 2 = `REPEATABLE READ`  
  + 3 = `SERIALIZABLE`

Para mais informações, consulte a Seção 17.20.6.4, “Controlar o comportamento transacional do plugin memcached do InnoDB”.

* `innodb_autoextend_increment`

  <table frame="box" rules="all" summary="Properties for innodb-dedicated-server"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>0

O tamanho de incremento (em megabytes) para a extensão do tamanho de um arquivo `InnoDB` [espaço de tabela automática](glossary.html#glos_system_tablespace "system tablespace") quando ele se torna cheio. O valor padrão é 64. Para informações relacionadas, consulte Configuração do arquivo de dados do espaço de tabela do sistema e Redimensionamento do espaço de tabela do sistema.

O ajuste `innodb_autoextend_increment` não afeta os arquivos do espaço de tabela por tabela ou os arquivos de espaço de tabela geral (glossary.html#glos_general_tablespace "general tablespace"). Esses arquivos são auto-extendidos, independentemente do ajuste `innodb_autoextend_increment`. As extensões iniciais são em pequenas quantidades, após as quais as extensões ocorrem em incrementos de 4 MB.

* `innodb_autoinc_lock_mode`

  <table frame="box" rules="all" summary="Properties for innodb-dedicated-server"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>1

O modo de bloqueio a ser usado para gerar valores de autoincremento. Os valores permitidos são 0, 1 ou 2, para tradicional, consecutivo ou entrelaçado, respectivamente.

A configuração padrão é 2 (entrelaçada) a partir do MySQL 8.0 e 1 (consecutiva) antes disso. A mudança para o modo de bloqueio entrelaçado como configuração padrão reflete a mudança da replicação baseada em declarações para a replicação baseada em linhas como o tipo de replicação padrão, que ocorreu no MySQL 5.7. A replicação baseada em declarações requer o modo de bloqueio de autoincremento consecutivo para garantir que os valores de autoincremento sejam atribuídos em uma ordem previsível e repetida para uma sequência dada de declarações SQL, enquanto a replicação baseada em linhas não é sensível à ordem de execução das declarações SQL.

Para as características de cada modo de bloqueio, consulte Modos de bloqueio de AUTO_INCREMENT do InnoDB.

* `innodb_background_drop_list_empty`

  <table frame="box" rules="all" summary="Properties for innodb-dedicated-server"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>2

Ativação da opção de depuração `innodb_background_drop_list_empty` ajuda a evitar falhas nos casos de teste, atrasando a criação da tabela até que a lista de itens em segundo plano esteja vazia. Por exemplo, se o caso de teste A coloca a tabela `t1` na lista de itens em segundo plano, o caso de teste B espera até que a lista de itens em segundo plano esteja vazia antes de criar a tabela `t1`.

* `innodb_buffer_pool_chunk_size`

  <table frame="box" rules="all" summary="Properties for innodb-dedicated-server"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>3

`innodb_buffer_pool_chunk_size` define o tamanho do bloco para as operações de redimensionamento do pool de buffer de `InnoDB`.

Para evitar a cópia de todas as páginas do pool de buffer durante operações de redimensionamento, a operação é realizada em "pedaços". Por padrão, `innodb_buffer_pool_chunk_size` é de 128 MB (134217728 bytes). O número de páginas contidas em um pedaço depende do valor de `innodb_page_size`. `innodb_buffer_pool_chunk_size` pode ser aumentado ou diminuído em unidades de 1 MB (1048576 bytes).

As seguintes condições se aplicam ao alterar o valor de `innodb_buffer_pool_chunk_size`:

+ Se `innodb_buffer_pool_chunk_size` * `innodb_buffer_pool_instances` for maior que o tamanho atual do pool de buffer quando o pool de buffer é inicializado, `innodb_buffer_pool_chunk_size` é truncado para `innodb_buffer_pool_size` / `innodb_buffer_pool_instances`.

O tamanho do buffer deve sempre ser igual a ou múltiplo de `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`. Se alterar `innodb_buffer_pool_chunk_size`, `innodb_buffer_pool_size` é automaticamente arredondado para um valor que é igual a ou múltiplo de `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`. O ajuste ocorre quando o buffer é inicializado.

Importante

É necessário ter cuidado ao alterar `innodb_buffer_pool_chunk_size`, pois alterar esse valor pode aumentar automaticamente o tamanho do pool de buffer. Antes de alterar `innodb_buffer_pool_chunk_size`, calcule seu efeito em `innodb_buffer_pool_size` para garantir que o tamanho resultante do pool de buffer seja aceitável.

Para evitar possíveis problemas de desempenho, o número de fragmentos (`innodb_buffer_pool_size` / `innodb_buffer_pool_chunk_size`) não deve exceder 1000.

A variável `innodb_buffer_pool_size` é dinâmica, o que permite o redimensionamento do pool de buffers enquanto o servidor está online. No entanto, o tamanho do pool de buffers deve ser igual ou múltiplo de `innodb_buffer_pool_chunk_size` * `innodb_buffer_pool_instances`, e alterar qualquer um desses ajustes de variável requer o reinício do servidor.

Veja a Seção 17.8.3.1, “Configurando o tamanho do buffer do InnoDB”, para mais informações.

* `innodb_buffer_pool_debug`

  <table frame="box" rules="all" summary="Properties for innodb-dedicated-server"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>4

Ativação desta opção permite múltiplas instâncias do buffer pool quando o buffer pool tem menos de 1 GB de tamanho, ignorando a restrição de tamanho mínimo do buffer pool de 1 GB imposta no `innodb_buffer_pool_instances`. A opção `innodb_buffer_pool_debug` só está disponível se o suporte de depuração for compilado usando a opção `WITH_DEBUG` **CMake**.

* `innodb_buffer_pool_dump_at_shutdown`

  <table frame="box" rules="all" summary="Properties for innodb-dedicated-server"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>5

Especifica se as páginas cacheadas no pool de buffer `InnoDB` devem ser registradas quando o servidor MySQL é desligado, para encurtar o processo de aquecimento na próxima reinicialização. Tipicamente usado em combinação com `innodb_buffer_pool_load_at_startup`. A opção `innodb_buffer_pool_dump_pct` define a porcentagem de páginas do pool de buffer mais recentemente usadas para ser descarregada.

Ambos os `innodb_buffer_pool_dump_at_shutdown` e `innodb_buffer_pool_load_at_startup` são habilitados por padrão.

Para mais informações, consulte a Seção 17.8.3.6, “Salvar e restaurar o estado do pool de buffer”.

* `innodb_buffer_pool_dump_now`

  <table frame="box" rules="all" summary="Properties for innodb-dedicated-server"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>6

Faz imediatamente um registro das páginas armazenadas em cache no pool de buffer `InnoDB`. Tipicamente usado em combinação com `innodb_buffer_pool_load_now`.

Ativação de `innodb_buffer_pool_dump_now` aciona a ação de gravação, mas não altera o ajuste da variável, que sempre permanece `OFF` ou `0`. Para visualizar o status do buffer pool após o disparo de um dump, consulte a variável `Innodb_buffer_pool_dump_status`.

Ativação de `innodb_buffer_pool_dump_now` desencadeia a ação de descarte, mas não altera o ajuste da variável, que sempre permanece `OFF` ou `0`. Para visualizar o status do descarte do pool de buffer após o desencadeamento de um descarte, consulte a variável `Innodb_buffer_pool_dump_status`.

Para mais informações, consulte a Seção 17.8.3.6, “Salvar e restaurar o estado do pool de buffer”.

* `innodb_buffer_pool_dump_pct`

  <table frame="box" rules="all" summary="Properties for innodb-dedicated-server"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>7

Especifica a porcentagem das páginas mais recentemente usadas para cada pool de buffer para leitura e descarte. A faixa é de 1 a 100. O valor padrão é 25. Por exemplo, se houver 4 pools de buffer com 100 páginas cada, e `innodb_buffer_pool_dump_pct` estiver definido em 25, as 25 páginas mais recentemente usadas de cada pool de buffer são descartadas.

* `innodb_buffer_pool_filename`

  <table frame="box" rules="all" summary="Properties for innodb-dedicated-server"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>8

Especifica o nome do arquivo que contém a lista de IDs de tablespace e IDs de página produzidos por `innodb_buffer_pool_dump_at_shutdown` ou `innodb_buffer_pool_dump_now`. Os IDs de tablespace e IDs de página são salvos no seguinte formato: `space, page_id`. Por padrão, o arquivo é denominado `ib_buffer_pool` e está localizado no diretório de dados `InnoDB`. Um local não padrão deve ser especificado em relação ao diretório de dados.

Um nome de arquivo pode ser especificado em tempo de execução, usando uma declaração `SET`:

  ```
  SET GLOBAL innodb_buffer_pool_filename='file_name';
  ```

Você também pode especificar um nome de arquivo no início, em uma string de inicialização ou em um arquivo de configuração do MySQL. Ao especificar um nome de arquivo no início, o arquivo deve existir ou `InnoDB` retorna um erro de inicialização indicando que não existe tal arquivo ou diretório.

Para mais informações, consulte a Seção 17.8.3.6, “Salvar e restaurar o estado do pool de buffer”.

* `innodb_buffer_pool_in_core_file`

  <table frame="box" rules="all" summary="Properties for innodb-dedicated-server"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>9

Desabilitando a variável `innodb_buffer_pool_in_core_file`, o tamanho dos arquivos principais é reduzido, excluindo as páginas do pool de buffers `InnoDB`. Para usar essa variável, a variável `core_file` deve ser habilitada e o sistema operacional deve suportar a extensão não POSIX de `MADV_DONTDUMP` para `madvise()`, que é suportada no Linux 3.4 e versões posteriores. Para mais informações, consulte a Seção 17.8.3.7, “Excluindo páginas do pool de buffers dos arquivos principais”.

* `innodb_buffer_pool_instances`

  <table frame="box" rules="all" summary="Properties for innodb-status-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb-status-file[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>0

O número de regiões em que o pool de buffer `InnoDB` é dividido. Para sistemas com pools de buffer na faixa de vários gigabytes, dividir o pool de buffer em instâncias separadas pode melhorar a concorrência, reduzindo a concorrência à medida que diferentes threads leem e escrevem em páginas armazenadas em cache. Cada página que é armazenada ou lida com o pool de buffer é atribuída aleatoriamente a uma das instâncias do pool de buffer, usando uma função de hashing. Cada instância do pool de buffer gerencia suas próprias listas de livre, listas de esvaziamento, LRUs e todas as outras estruturas de dados conectadas a um pool de buffer, e é protegida por seu próprio mutex do pool de buffer.

Essa opção só tem efeito quando se define `innodb_buffer_pool_size` para 1 GB ou mais. O tamanho total do conjunto de buffers é dividido entre todos os conjuntos de buffers. Para a melhor eficiência, especifique uma combinação de `innodb_buffer_pool_instances` e `innodb_buffer_pool_size` de modo que cada instância do conjunto de buffers seja de pelo menos 1 GB.

O valor padrão em sistemas Windows de 32 bits depende do valor de `innodb_buffer_pool_size`, conforme descrito abaixo:

+ Se `innodb_buffer_pool_size` for maior que 1,3 GB, o padrão para `innodb_buffer_pool_instances` é `innodb_buffer_pool_size`/128 MB, com solicitações individuais de alocação de memória para cada fragmento. 1,3 GB foi escolhido como o limite em que há risco significativo de o Windows de 32 bits não ser capaz de alocar o espaço de endereçamento contínuo necessário para um único pool de buffers.

+ Caso contrário, o padrão é 1.

Em todas as outras plataformas, o valor padrão é 8 quando `innodb_buffer_pool_size` é maior ou igual a 1 GB. Caso contrário, o padrão é 1.

Para informações relacionadas, consulte a Seção 17.8.3.1, “Configurando o tamanho do buffer do InnoDB”.

* `innodb_buffer_pool_load_abort`

  <table frame="box" rules="all" summary="Properties for innodb-status-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb-status-file[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>1

Interrompe o processo de restauração dos conteúdos do pool de tampão `InnoDB`, desencadeado por `innodb_buffer_pool_load_at_startup` ou `innodb_buffer_pool_load_now`.

Ativação de `innodb_buffer_pool_load_abort` desencadeia a ação de interrupção, mas não altera o ajuste da variável, que sempre permanece `OFF` ou `0`. Para visualizar o status da carga do pool de buffers após o desencadeamento de uma ação de interrupção, consulte a variável `Innodb_buffer_pool_load_status`.

Para mais informações, consulte a Seção 17.8.3.6, “Salvar e restaurar o estado do pool de buffer”.

* `innodb_buffer_pool_load_at_startup`

  <table frame="box" rules="all" summary="Properties for innodb-status-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb-status-file[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>2

Especifica que, no início do servidor MySQL, o pool de buffers `InnoDB` é aquecido automaticamente ao carregar as mesmas páginas que ele continha em um momento anterior. Tipicamente usado em combinação com `innodb_buffer_pool_dump_at_shutdown`.

Ambos os `innodb_buffer_pool_dump_at_shutdown` e `innodb_buffer_pool_load_at_startup` são habilitados por padrão.

Para mais informações, consulte a Seção 17.8.3.6, “Salvar e restaurar o estado do pool de buffer”.

* `innodb_buffer_pool_load_now`

  <table frame="box" rules="all" summary="Properties for innodb-status-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb-status-file[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>3

Acalenta imediatamente o pool de buffers `InnoDB` carregando páginas de dados sem esperar por uma reinicialização do servidor. Pode ser útil para retornar a memória de cache a um estado conhecido durante o benchmark ou para preparar o servidor MySQL para retomar sua carga de trabalho normal após executar consultas para relatórios ou manutenção.

Ativação de `innodb_buffer_pool_load_now` aciona a ação de carga, mas não altera o ajuste da variável, que sempre permanece `OFF` ou `0`. Para visualizar o progresso da carga do pool de buffer após o disparo de uma carga, consulte a variável `Innodb_buffer_pool_load_status`.

Para mais informações, consulte a Seção 17.8.3.6, “Salvar e restaurar o estado do pool de buffer”.

* `innodb_buffer_pool_size`

  <table frame="box" rules="all" summary="Properties for innodb-status-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb-status-file[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>4

O tamanho em bytes do pool de buffer, a área de memória onde o `InnoDB` armazena tabelas e dados de índice. O valor padrão é de 134217728 bytes (128 MB). O valor máximo depende da arquitetura da CPU; o máximo é de 4294967295 (232-1) em sistemas de 32 bits e 18446744073709551615 (264-1) em sistemas de 64 bits. Em sistemas de 32 bits, a arquitetura da CPU e o sistema operacional podem impor um tamanho máximo prático menor que o máximo declarado. Quando o tamanho do pool de buffer é maior que 1 GB, definir `innodb_buffer_pool_instances` para um valor maior que 1 pode melhorar a escalabilidade em um servidor ocupado.

Um pool de tampão maior requer menos I/O de disco para acessar os mesmos dados da tabela mais de uma vez. Em um servidor de banco de dados dedicado, você pode definir o tamanho do pool de tampão para 80% do tamanho da memória física da máquina. Esteja ciente dos seguintes problemas potenciais ao configurar o tamanho do pool de tampão e esteja preparado para reduzir o tamanho do pool de tampão, se necessário.

+ A competição pela memória física pode causar paginação no sistema operacional.

+ `InnoDB` reserva memória adicional para buffers e estruturas de controle, de modo que o espaço total alocado seja aproximadamente 10% maior que o tamanho especificado do conjunto de buffers.

+ O espaço de endereçamento do pool de buffer deve ser contínuo, o que pode ser um problema em sistemas Windows com DLLs que carregam em endereços específicos.

+ O tempo para inicializar o pool de buffers é aproximadamente proporcional ao seu tamanho. Em instâncias com grandes pools de buffers, o tempo de inicialização pode ser significativo. Para reduzir o período de inicialização, você pode salvar o estado do pool de buffers na desligada do servidor e restaurá-lo na inicialização do servidor. Veja a Seção 17.8.3.6, “Salvar e restaurar o estado do pool de buffers”.

Quando você aumenta ou diminui o tamanho do conjunto de buffer, a operação é realizada em partes. O tamanho da parte é definido pela variável `innodb_buffer_pool_chunk_size`, que tem um valor padrão de 128 MB.

O tamanho do pool de buffer deve sempre ser igual a ou múltiplo de `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`. Se alterar o tamanho do pool de buffer para um valor que não é igual a ou múltiplo de `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`, o tamanho do pool de buffer é automaticamente ajustado para um valor que é igual a ou múltiplo de `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`.

`innodb_buffer_pool_size` pode ser configurado dinamicamente, o que permite redimensionar o pool de buffers sem precisar reiniciar o servidor. A variável de status `Innodb_buffer_pool_resize_status` relata o status das operações de redimensionamento do pool de buffers online. Consulte a Seção 17.8.3.1, “Configurando o tamanho do pool de buffers InnoDB”, para obter mais informações.

Se o servidor for iniciado com `--innodb-dedicated-server`, o valor `innodb_buffer_pool_size` é determinado automaticamente se não for explicitamente definido. Para mais informações, consulte a Seção 17.8.12, “Habilitar configuração automática do InnoDB para um servidor MySQL dedicado”.

* `innodb_change_buffer_max_size`

  <table frame="box" rules="all" summary="Properties for innodb-status-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb-status-file[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>5

Tamanho máximo para o buffer de alteração `InnoDB`, como uma porcentagem do tamanho total do pool de buffers. Você pode aumentar esse valor para um servidor MySQL com atividade pesada de inserção, atualização e exclusão, ou diminuí-lo para um servidor MySQL com dados inalterados usados para relatórios. Para mais informações, consulte a Seção 17.5.2, “Buffer de Alteração”. Para conselhos gerais de ajuste de E/S, consulte a Seção 10.5.8, “Otimização do E/S de Disco InnoDB”.

* `innodb_change_buffering`

  <table frame="box" rules="all" summary="Properties for innodb-status-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb-status-file[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>6

Se o `InnoDB` realiza o bufferamento de mudanças, uma otimização que adira operações de escrita a índices secundários para que as operações de E/S possam ser realizadas sequencialmente. Os valores permitidos são descritos na tabela a seguir. Os valores também podem ser especificados numericamente.

**Tabela 17.25 Valores permitidos para innodb_change_buffering**

  <table frame="box" rules="all" summary="Properties for innodb-status-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb-status-file[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>7

Para mais informações, consulte a Seção 17.5.2, “Alinhar o buffer”. Para conselhos gerais sobre o ajuste de E/S, consulte a Seção 10.5.8, “Otimizando o E/S do disco InnoDB”.

* `innodb_change_buffering_debug`

  <table frame="box" rules="all" summary="Properties for innodb-status-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb-status-file[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>8

Define uma bandeira de depuração para o bufferamento de mudanças de `InnoDB`. Um valor de 1 força todas as mudanças no buffer de mudanças. Um valor de 2 causa uma saída inesperada na fusão. Um valor padrão de 0 indica que a bandeira de depuração de bufferamento de mudanças não está definida. Esta opção só está disponível quando o suporte de depuração é compilado usando a opção **CMake** `WITH_DEBUG`.

* `innodb_checkpoint_disabled`

  <table frame="box" rules="all" summary="Properties for innodb-status-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb-status-file[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>9

Esta é uma opção de depuração destinada apenas para uso especializado de depuração. Ela desativa os pontos de verificação para que uma saída deliberada do servidor sempre inicie a recuperação do `InnoDB`. Ela só deve ser habilitada por um curto intervalo, tipicamente antes de executar operações DML que escrevem entradas de registro de revisão que exigiriam recuperação após uma saída do servidor. Esta opção só está disponível se o suporte de depuração for compilado usando a opção `WITH_DEBUG` **CMake**.

* `innodb_checksum_algorithm`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_enable_binlog"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-enable-binlog[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_enable_binlog</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>0

Especifica como gerar e verificar o checksum armazenado nos blocos de disco dos espaços de tabela `InnoDB`. O valor padrão para `innodb_checksum_algorithm` é `crc32`.

As versões do MySQL Enterprise Backup até 3.8.0 não suportam a realização de backups de espaços de tabela que utilizam verificações de CRC32. O MySQL Enterprise Backup adiciona suporte para verificações de CRC32 na versão 3.8.1, com algumas limitações. Consulte o Histórico de alterações do MySQL Enterprise Backup 3.8.1 para obter mais informações.

O valor `innodb` é compatível com versões anteriores do MySQL. O valor `crc32` utiliza um algoritmo que é mais rápido para calcular o checksum de cada bloco modificado e para verificar os checksums de cada leitura de disco. Ele examina blocos de 64 bits de cada vez, o que é mais rápido do que o algoritmo de checksum `innodb`, que examina blocos de 8 bits de cada vez. O valor `none` escreve um valor constante no campo de checksum em vez de calcular um valor baseado nos dados do bloco. Os blocos em um espaço de tabelas podem usar uma mistura de valores antigos, novos e sem checksum, sendo atualizados gradualmente à medida que os dados são modificados; uma vez que os blocos em um espaço de tabelas são modificados para usar o algoritmo `crc32`, as tabelas associadas não podem ser lidas por versões anteriores do MySQL.

A forma rigorosa de um algoritmo de verificação de checksum reporta um erro se encontrar um valor de checksum válido, mas não correspondente, em um espaço de tabelas. É recomendável que você use apenas configurações rigorosas em uma nova instância, para configurar espaços de tabelas pela primeira vez. As configurações rigorosas são um pouco mais rápidas, porque não precisam calcular todos os valores de checksum durante as leituras do disco.

A tabela a seguir mostra a diferença entre os valores das opções `none`, `innodb` e `crc32`, e seus equivalentes rigorosos. `none`, `innodb` e `crc32` escrevem o tipo especificado de valor de verificação em cada bloco de dados, mas, para compatibilidade, aceitam outros valores de verificação quando verificam um bloco durante uma operação de leitura. As configurações rigorosas também aceitam valores de verificação válidos, mas exibem uma mensagem de erro quando um valor de verificação não correspondente válido é encontrado. O uso da forma rigorosa pode tornar a verificação mais rápida se todos os arquivos de dados `InnoDB` em uma instância forem criados sob um valor idêntico de `innodb_checksum_algorithm`.

**Tabela 17.26 Valores permitidos para innodb_checksum_algorithm**

  <table frame="box" rules="all" summary="Properties for daemon_memcached_enable_binlog"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-enable-binlog[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_enable_binlog</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>1

* `innodb_cmp_per_index_enabled`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_enable_binlog"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-enable-binlog[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_enable_binlog</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>2

Permite estatísticas relacionadas à compressão por índice na tabela do esquema de informações `INNODB_CMP_PER_INDEX`. Como essas estatísticas podem ser caras de coletar, ative essa opção apenas em instâncias de desenvolvimento, teste ou replica durante o ajuste de desempenho relacionado às tabelas compactadas `InnoDB`.

Para mais informações, consulte a [Seção 28.4.8, “As tabelas INFORMATION_SCHEMA INNODB_CMP_PER_INDEX e INNODB_CMP_PER_INDEX_RESET”][(information-schema-innodb-cmp-per-index-table.html "28.4.8 The INFORMATION_SCHEMA INNODB_CMP_PER_INDEX and INNODB_CMP_PER_INDEX_RESET Tables")] e a Seção 17.9.1.4, “Monitoramento da compactação de tabela InnoDB em tempo real”.

* `innodb_commit_concurrency`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_enable_binlog"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-enable-binlog[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_enable_binlog</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>3

O número de threads que podem ser comprometidas ao mesmo tempo. Um valor de 0 (padrão) permite que qualquer número de transações sejam comprometidas simultaneamente.

O valor de `innodb_commit_concurrency` não pode ser alterado em tempo de execução de zero para não zero ou vice-versa. O valor pode ser alterado de um valor não zero para outro.

* `innodb_compress_debug`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_enable_binlog"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-enable-binlog[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_enable_binlog</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>4

Compacta todas as tabelas usando um algoritmo de compactação especificado, sem precisar definir um atributo `COMPRESSION` para cada tabela. Esta opção só está disponível se o suporte de depuração estiver compilado usando a opção `WITH_DEBUG` **CMake**.

Para informações relacionadas, consulte a Seção 17.9.2, “Compressão de página InnoDB”.

* `innodb_compression_failure_threshold_pct`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_enable_binlog"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-enable-binlog[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_enable_binlog</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>5

Define o limite de taxa de falha de compressão para uma tabela, em porcentagem, no ponto em que o MySQL começa a adicionar preenchimento dentro das páginas compactadas para evitar falhas de compressão caras (glossary.html#glos_compression_failure "compression failure"). Quando esse limite é ultrapassado, o MySQL começa a deixar espaço livre adicional dentro de cada nova página compactada, ajustando dinamicamente a quantidade de espaço livre até a porcentagem do tamanho da página especificada por `innodb_compression_pad_pct_max`. Um valor de zero desativa o mecanismo que monitora a eficiência da compressão e ajusta dinamicamente a quantidade de preenchimento.

Para mais informações, consulte a Seção 17.9.1.6, “Compressão para cargas de trabalho OLTP”.

* `innodb_compression_level`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_enable_binlog"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-enable-binlog[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_enable_binlog</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>6

Especifica o nível de compressão zlib a ser usado para tabelas e índices comprimidos `InnoDB`. Um valor mais alto permite que você coloque mais dados em um dispositivo de armazenamento, às custas de mais sobrecarga de CPU durante a compressão. Um valor mais baixo permite reduzir a sobrecarga de CPU quando o espaço de armazenamento não é crítico, ou você espera que os dados não sejam especialmente compressivos.

Para mais informações, consulte a Seção 17.9.1.6, “Compressão para cargas de trabalho OLTP”.

* `innodb_compression_pad_pct_max`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_enable_binlog"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-enable-binlog[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_enable_binlog</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>7

Especifica a porcentagem máxima que pode ser reservada como espaço livre dentro de cada página comprimida, permitindo espaço para reorganizar o registro de dados e de modificação dentro da página quando uma tabela ou índice comprimido é atualizado e os dados podem ser recomprimidos. Aplica-se apenas quando `innodb_compression_failure_threshold_pct` é definido com um valor não nulo e a taxa de [falhas de compressão](glossary.html#glos_compression_failure "compression failure") passa pelo ponto de corte.

Para mais informações, consulte a Seção 17.9.1.6, “Compressão para cargas de trabalho OLTP”.

* `innodb_concurrency_tickets`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_enable_binlog"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-enable-binlog[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_enable_binlog</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>8

Determina o número de threads que podem entrar simultaneamente em `InnoDB`. Uma thread é colocada em uma fila quando tenta entrar em `InnoDB` se o número de threads já tiver atingido o limite de concorrência. Quando uma thread é permitida a entrar em `InnoDB`, recebe um número de "bilhetes" igual ao valor de `innodb_concurrency_tickets`, e a thread pode entrar e sair livremente em `InnoDB` até esgotar seus bilhetes. Após esse ponto, a thread novamente fica sujeita à verificação de concorrência (e possível fila) na próxima vez que tentar entrar em `InnoDB`. O valor padrão é 5000.

Com um pequeno valor de `innodb_concurrency_tickets`, pequenas transações que precisam processar apenas algumas linhas competem de forma justa com transações maiores que processam muitas linhas. A desvantagem de um pequeno valor de `innodb_concurrency_tickets` é que grandes transações devem percorrer a fila muitas vezes antes de poderem ser concluídas, o que estende o tempo necessário para completar sua tarefa.

Com um grande valor de `innodb_concurrency_tickets`, as grandes transações gastam menos tempo esperando uma posição no final da fila (controlada por `innodb_thread_concurrency`) e mais tempo recuperando linhas. As grandes transações também requerem menos viagens pela fila para completar sua tarefa. A desvantagem de um grande valor de `innodb_concurrency_tickets` é que muitas transações grandes rodando ao mesmo tempo podem deixar as menores famintas, fazendo com que elas precisem esperar um tempo mais longo antes de serem executadas.

Com um valor não nulo de `innodb_thread_concurrency`, você pode precisar ajustar o valor de `innodb_concurrency_tickets` para cima ou para baixo para encontrar o equilíbrio ótimo entre transações maiores e menores. O relatório `SHOW ENGINE INNODB STATUS` mostra o número de ingressos restantes para uma transação em execução em sua passagem atual na fila. Esses dados também podem ser obtidos da coluna `TRX_CONCURRENCY_TICKETS` do esquema de informações `INNODB_TRX` da tabela.

Para mais informações, consulte a Seção 17.8.4, “Configurando Concorrência de Fuso para InnoDB”.

* `innodb_data_file_path`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_enable_binlog"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-enable-binlog[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_enable_binlog</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>9

Define o nome, o tamanho e os atributos dos arquivos de dados dos espaços de sistema `InnoDB`. Se você não especificar um valor para `innodb_data_file_path`, o comportamento padrão é criar um único arquivo de dados auto-extensibile, ligeiramente maior que 12 MB, denominado `ibdata1`.

A sintaxe completa para uma especificação de arquivo de dados inclui o nome do arquivo, o tamanho do arquivo, os atributos `autoextend` e `max`:

  ```
  file_name:file_size[:autoextend[:max:max_file_size]]
  ```

Os tamanhos dos arquivos são especificados em kilobytes, megabytes ou gigabytes, anexando `K`, `M` ou `G` ao valor do tamanho. Se especificar o tamanho do arquivo de dados em kilobytes, faça isso em múltiplos de 1024. Caso contrário, os valores em KB são arredondados para o próximo limite de megabyte (MB). A soma dos tamanhos dos arquivos deve, no mínimo, ser ligeiramente maior que 12 MB.

Para informações adicionais sobre configuração, consulte Configuração do arquivo de dados do sistema de tabelas. Para instruções de redimensionamento, consulte Redimensionamento do espaço de tabelas do sistema.

* `innodb_data_home_dir`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_engine_lib_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-engine-lib-name=file_name</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_engine_lib_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>innodb_engine.so</code></td> </tr></tbody></table>0

A parte comum do caminho do diretório para os arquivos de dados dos `InnoDB` [espaço de tabela do sistema](glossary.html#glos_system_tablespace "system tablespace") O valor padrão é o diretório MySQL `data`. O ajuste é concatenado com o ajuste `innodb_data_file_path`, a menos que esse ajuste seja definido com um caminho absoluto.

É necessário incluir uma barra final quando especificar um valor para `innodb_data_home_dir`. Por exemplo:

  ```
  [mysqld]
  innodb_data_home_dir = /path/to/myibdata/
  ```

Essa configuração não afeta a localização dos file-per-table tablespaces.

Para informações relacionadas, consulte a Seção 17.8.1, “Configuração de inicialização do InnoDB”.

* `innodb_ddl_buffer_size`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_engine_lib_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-engine-lib-name=file_name</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_engine_lib_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>innodb_engine.so</code></td> </tr></tbody></table>1

Define o tamanho máximo do buffer para operações DDL. O ajuste padrão é de 1048576 bytes (aproximadamente 1 MB). Aplica-se a operações DDL online que criam ou reconstroem índices secundários. Consulte a Seção 17.12.4, “Gestão de memória DDL online”. O tamanho máximo do buffer por thread DDL é o tamanho máximo do buffer dividido pelo número de threads DDL (`innodb_ddl_buffer_size`/`innodb_ddl_threads`).

* `innodb_ddl_log_crash_reset_debug`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_engine_lib_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-engine-lib-name=file_name</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_engine_lib_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>innodb_engine.so</code></td> </tr></tbody></table>2

Ative esta opção de depuração para redefinir os contadores de injeção de falhas de registro DDL para 1. Esta opção só está disponível quando o suporte de depuração é compilado usando a opção `WITH_DEBUG` **CMake**.

* `innodb_ddl_threads`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_engine_lib_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-engine-lib-name=file_name</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_engine_lib_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>innodb_engine.so</code></td> </tr></tbody></table>3

Define o número máximo de threads paralelas para as fases de ordenação e construção da criação de índices. Aplica-se a operações DDL online que criam ou reconstroem índices secundários. Para informações relacionadas, consulte a Seção 17.12.5, “Configurando Threads Paralelas para Operações DDL Online”, e a Seção 17.12.4, “Gestão de Memória DDL Online”.

* `innodb_deadlock_detect`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_engine_lib_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-engine-lib-name=file_name</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_engine_lib_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>innodb_engine.so</code></td> </tr></tbody></table>4

Esta opção é usada para desabilitar a detecção de bloqueio. Em sistemas de alta concorrência, a detecção de bloqueio pode causar um atraso quando vários threads aguardam o mesmo bloqueio. Às vezes, pode ser mais eficiente desabilitar a detecção de bloqueio e confiar na configuração `innodb_lock_wait_timeout` para o rollback de transações quando ocorre um bloqueio.

Para informações relacionadas, consulte a Seção 17.7.5.2, “Detecção de deadlock”.

* `innodb_default_row_format`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_engine_lib_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-engine-lib-name=file_name</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_engine_lib_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>innodb_engine.so</code></td> </tr></tbody></table>5

A opção `innodb_default_row_format` define o formato de linha padrão para as tabelas `InnoDB` e tabelas temporárias criadas pelo usuário. O ajuste padrão é `DYNAMIC`. Outros valores permitidos são `COMPACT` e `REDUNDANT`. O formato de linha `COMPRESSED`, que não é suportado para uso nas tabelas do [espaço de tabela do sistema](glossary.html#glos_system_tablespace "system tablespace"), não pode ser definido como padrão.

As tabelas recém-criadas utilizam o formato de linha definido por `innodb_default_row_format` quando uma opção `ROW_FORMAT` não é especificada explicitamente ou quando `ROW_FORMAT=DEFAULT` é utilizado.

Quando uma opção `ROW_FORMAT` não é especificada explicitamente ou quando `ROW_FORMAT=DEFAULT` é usado, qualquer operação que reconstrua uma tabela também muda silenciosamente o formato da linha da tabela para o formato definido por `innodb_default_row_format`. Para mais informações, consulte Definindo o Formato da Linha de uma Tabela.

As tabelas temporárias internas `InnoDB` criadas pelo servidor para processar consultas utilizam o formato de linha `DYNAMIC`, independentemente da configuração `innodb_default_row_format`.

* `innodb_directories`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_engine_lib_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-engine-lib-name=file_name</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_engine_lib_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>innodb_engine.so</code></td> </tr></tbody></table>6

Define diretórios para varredura no início para arquivos de tablespace. Esta opção é usada ao mover ou restaurar arquivos de tablespace para um novo local enquanto o servidor está offline. Também é usada para especificar diretórios de arquivos de tablespace criados usando um caminho absoluto ou que residem fora do diretório de dados.

A descoberta de tablespace durante a recuperação de falhas depende da configuração `innodb_directories` para identificar os tablespace referenciados nos logs de redo. Para mais informações, consulte Descoberta de tablespace durante a recuperação de falhas.

O valor padrão é NULL, mas os diretórios definidos por `innodb_data_home_dir`, `innodb_undo_directory` e `datadir` são sempre anexados ao valor do argumento `innodb_directories` quando o `InnoDB` constrói uma lista de diretórios para varredura no início. Esses diretórios são anexados independentemente de uma configuração `innodb_directories` ser especificada explicitamente.

`innodb_directories` pode ser especificado como uma opção em um comando de inicialização ou em um arquivo de opção do MySQL. Aspas cercam o valor do argumento porque, caso contrário, alguns interpretadores de comando interpretam ponto e vírgula (`;`) como um caractere especial. (Por exemplo, as escovas Unix o tratam como um terminador de comando.)

Comando de inicialização:

  ```
  mysqld --innodb-directories="directory_path_1;directory_path_2"
  ```

Arquivo de opções do MySQL:

  ```
  [mysqld]
  innodb_directories="directory_path_1;directory_path_2"
  ```

As expressões wildcard não podem ser usadas para especificar diretórios.

O `innodb_directories` também percorre os subdiretórios dos diretórios especificados. Os diretórios e subdiretórios duplicados são descartados da lista de diretórios a serem analisados.

Para mais informações, consulte a Seção 17.6.3.6, “Mover arquivos do Tablespace enquanto o servidor está fora de linha”.

* `innodb_disable_sort_file_cache`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_engine_lib_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-engine-lib-name=file_name</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_engine_lib_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>innodb_engine.so</code></td> </tr></tbody></table>7

Desabilita o cache do sistema de arquivos do sistema operacional para arquivos temporários de ordenação por junção. O efeito é abrir esses arquivos com o equivalente a `O_DIRECT`.

* `innodb_doublewrite`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_engine_lib_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-engine-lib-name=file_name</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_engine_lib_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>innodb_engine.so</code></td> </tr></tbody></table>8

A variável `innodb_doublewrite` controla o buffer de escrita dupla. O buffer de escrita dupla é ativado por padrão na maioria dos casos.

Antes do MySQL 8.0.30, você pode definir `innodb_doublewrite` para `ON` ou `OFF` ao iniciar o servidor para habilitar ou desabilitar o buffer de escrita dupla, respectivamente. A partir do MySQL 8.0.30, `innodb_doublewrite` também suporta as configurações `DETECT_AND_RECOVER` e `DETECT_ONLY`.

O ajuste `DETECT_AND_RECOVER` é o mesmo que o ajuste `ON`. Com este ajuste, o buffer de dupla escrita é totalmente habilitado, com o conteúdo da página do banco de dados sendo escrito no buffer de dupla escrita onde é acessado durante a recuperação para corrigir escritas de página incompletas.

Com o ajuste `DETECT_ONLY`, apenas os metadados são escritos no buffer de dupla gravação. O conteúdo das páginas do banco de dados não é escrito no buffer de dupla gravação, e a recuperação não usa o buffer de dupla gravação para corrigir escritas de página incompletas. Este ajuste leve é destinado a detectar escritas de página incompletas apenas.

MySQL 8.0.30 em diante suporta mudanças dinâmicas no ajuste `innodb_doublewrite` que habilita o buffer de escrita dupla, entre `ON`, `DETECT_AND_RECOVER` e `DETECT_ONLY`. O MySQL não suporta mudanças dinâmicas entre um ajuste que habilita o buffer de escrita dupla e `OFF` ou vice-versa.

Se o buffer de escrita dupla estiver localizado em um dispositivo Fusion-io que suporte escritas atômicas, o buffer de escrita dupla será automaticamente desativado e os escritos de arquivos de dados serão realizados usando escritas atômicas da Fusion-io. No entanto, esteja ciente de que a configuração `innodb_doublewrite` é global. Quando o buffer de escrita dupla é desativado, ele é desativado para todos os arquivos de dados, incluindo aqueles que não residem em hardware Fusion-io. Este recurso é suportado apenas em hardware Fusion-io e é habilitado apenas para NVMFS da Fusion-io no Linux. Para aproveitar plenamente este recurso, é recomendada a configuração `innodb_flush_method` de `O_DIRECT`.

Para informações relacionadas, consulte a Seção 17.6.4, "Buffer de dupla gravação".

* `innodb_doublewrite_batch_size`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_engine_lib_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-engine-lib-name=file_name</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_engine_lib_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>innodb_engine.so</code></td> </tr></tbody></table>9

Essa variável era destinada a representar o número de páginas de dupla escrita a serem escritas em um lote. Essa funcionalidade foi substituída por `innodb_doublewrite_pages`.

Para mais informações, consulte a Seção 17.6.4, "Buffer de dupla gravação".

* `innodb_doublewrite_dir`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_engine_lib_path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-engine-lib-path=dir_name</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_engine_lib_path</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>NULL</code></td> </tr></tbody></table>0

Define o diretório para arquivos de doublewrite. Se não for especificado nenhum diretório, os arquivos de doublewrite são criados no diretório `innodb_data_home_dir`, que é o diretório padrão de dados, se não for especificado.

Para mais informações, consulte a Seção 17.6.4, "Buffer de dupla gravação".

* `innodb_doublewrite_files`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_engine_lib_path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-engine-lib-path=dir_name</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_engine_lib_path</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>NULL</code></td> </tr></tbody></table>1

Define o número de arquivos de dupla gravação. Por padrão, são criados dois arquivos de dupla gravação para cada instância de pool de buffers.

Como mínimo, existem dois arquivos de dupla gravação. O número máximo de arquivos de dupla gravação é duas vezes o número de instâncias do pool de buffer. (O número de instâncias do pool de buffer é controlado pela variável `innodb_buffer_pool_instances`.

Para mais informações, consulte a Seção 17.6.4, "Buffer de dupla gravação".

* `innodb_doublewrite_pages`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_engine_lib_path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-engine-lib-path=dir_name</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_engine_lib_path</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>NULL</code></td> </tr></tbody></table>2

Define o número máximo de páginas de dupla gravação por thread para uma gravação em lote. Se nenhum valor for especificado, `innodb_doublewrite_pages` é definido como o valor de `innodb_write_io_threads`.

O valor padrão mudou de 4 (copiado de `innodb_write_io_threads` no 8.0) para 128 no MySQL 8.4.0. Esse valor pequeno pode causar muitas operações fsync para operações de escrita dupla. Para informações relacionadas, consulte a Seção 10.5.8, “Otimizando o I/O de disco do InnoDB”.

Para mais informações, consulte a Seção 17.6.4, "Buffer de dupla gravação".

* `innodb_extend_and_initialize`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_engine_lib_path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-engine-lib-path=dir_name</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_engine_lib_path</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>NULL</code></td> </tr></tbody></table>3

Controla a alocação de espaço para arquivos por tabela e espaços de tabela gerais em sistemas Linux.

Quando habilitado, `InnoDB` escreve NULLs em páginas recém-alojadas. Quando desabilitado, o espaço é alocado usando chamadas de `posix_fallocate()`, que reservam espaço sem escrever fisicamente NULLs.

Para mais informações, consulte a Seção 17.6.3.8, “Otimizando a alocação de espaço do Tablespace no Linux”.

* `innodb_fast_shutdown`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_engine_lib_path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-engine-lib-path=dir_name</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_engine_lib_path</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>NULL</code></td> </tr></tbody></table>4

O modo de desligamento `InnoDB`. Se o valor for 0, `InnoDB` realiza um desligamento lento, uma purga completa e uma fusão de buffer antes de desligar. Se o valor for 1 (o padrão), `InnoDB` ignora essas operações no desligamento, um processo conhecido como desligamento rápido. Se o valor for 2, `InnoDB` esvazia seus logs e desliga-se frio, como se o MySQL tivesse falhado; nenhuma transação comprometida é perdida, mas a operação de recuperação do crash faz com que a próxima inicialização demore mais tempo.

O desligamento lento pode levar minutos, ou até horas em casos extremos, onde quantidades substanciais de dados ainda estão armazenadas. Use a técnica de desligamento lento antes de fazer uma atualização ou uma atualização para uma versão anterior entre as principais versões do MySQL, para que todos os arquivos de dados estejam totalmente preparados, caso o processo de atualização atualize o formato do arquivo.

Use `innodb_fast_shutdown=2` em situações de emergência ou de solução de problemas, para obter o desligamento mais rápido possível, se os dados estiverem em risco de corrupção.

* `innodb_fil_make_page_dirty_debug`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_engine_lib_path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-engine-lib-path=dir_name</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_engine_lib_path</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>NULL</code></td> </tr></tbody></table>5

Por padrão, definir `innodb_fil_make_page_dirty_debug` para o ID de um espaço de tabela imediatamente contamina a primeira página do espaço de tabela. Se `innodb_saved_page_number_debug` estiver definido para um valor não padrão, definir `innodb_fil_make_page_dirty_debug` contamina a página especificada. A opção `innodb_fil_make_page_dirty_debug` só está disponível se o suporte de depuração estiver compilado usando a opção `WITH_DEBUG` **CMake**.

* `innodb_file_per_table`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_engine_lib_path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-engine-lib-path=dir_name</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_engine_lib_path</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>NULL</code></td> </tr></tbody></table>6

Quando o `innodb_file_per_table` está habilitado, as tabelas são criadas em espaços de tabelas por arquivo por padrão. Quando desabilitado, as tabelas são criadas no espaço de tabelas do sistema por padrão. Para informações sobre espaços de tabelas por arquivo, consulte a Seção 17.6.3.2, “Espaços de tabelas por arquivo”. Para informações sobre o espaço de tabelas do sistema `InnoDB`, consulte a Seção 17.6.3.1, “O espaço de tabelas do sistema”.

A variável `innodb_file_per_table` pode ser configurada em tempo de execução usando uma declaração `SET GLOBAL`(set-variable.html "15.7.6.1 SET Syntax for Variable Assignment"), especificada na linha de comando no início ou especificada em um arquivo de opção. A configuração em tempo de execução requer privilégios suficientes para definir variáveis de sistema globais (consulte Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”) e afeta imediatamente o funcionamento de todas as conexões.

Quando uma tabela que reside em um espaço de tabela por arquivo é truncada ou eliminada, o espaço liberado é devolvido ao sistema operacional. Ao truncar ou eliminar uma tabela que reside no espaço de tabelas do sistema, apenas o espaço liberado no espaço de tabelas do sistema é liberado. O espaço liberado no espaço de tabelas do sistema pode ser usado novamente para dados do `InnoDB`, mas não é devolvido ao sistema operacional, pois os arquivos de dados do espaço de tabelas do sistema nunca encolhem.

O ajuste `innodb_file_per-table` não afeta a criação de tabelas temporárias. A partir do MySQL 8.0.14, as tabelas temporárias são criadas em espaços temporários de tabelas de sessão e, antes disso, em um espaço temporário de tabelas global. Veja a Seção 17.6.3.5, “Espaços temporários de tabelas”.

* `innodb_fill_factor`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_engine_lib_path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-engine-lib-path=dir_name</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_engine_lib_path</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>NULL</code></td> </tr></tbody></table>7

`InnoDB` realiza uma carga em massa ao criar ou reconstruir índices. Esse método de criação de índices é conhecido como "construção de índice ordenado".

`innodb_fill_factor` define a porcentagem de espaço em cada página do B-tree que é preenchida durante a construção de um índice ordenado, com o espaço restante reservado para o crescimento futuro do índice. Por exemplo, definir `innodb_fill_factor` para 80 reserva 20 por cento do espaço em cada página do B-tree para o crescimento futuro do índice. As porcentagens reais podem variar. O ajuste `innodb_fill_factor` é interpretado como um aviso em vez de um limite rígido.

Uma configuração `innodb_fill_factor` de 100 deixa 1/16 do espaço em páginas de índice agrupado livre para crescimento futuro do índice.

`innodb_fill_factor` se aplica tanto às páginas de folha de árvore B quanto às páginas não-folha. Não se aplica às páginas externas utilizadas para as entradas de `TEXT` ou `BLOB`.

Para mais informações, consulte a Seção 17.6.2.3, “Construções de índices ordenados”.

* `innodb_flush_log_at_timeout`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_engine_lib_path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-engine-lib-path=dir_name</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_engine_lib_path</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>NULL</code></td> </tr></tbody></table>8

Escreva e limpe os logs a cada *`N`* segundos. `innodb_flush_log_at_timeout` permite que o período de espera entre limpos seja aumentado para reduzir o limpe e evitar o impacto no desempenho do commit do grupo de log binário. O ajuste padrão para `innodb_flush_log_at_timeout` é uma vez por segundo.

* `innodb_flush_log_at_trx_commit`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_engine_lib_path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-engine-lib-path=dir_name</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_engine_lib_path</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>NULL</code></td> </tr></tbody></table>9

Controla o equilíbrio entre a estrita conformidade ACID para operações de commit e o desempenho mais alto que é possível quando as operações de E/S relacionadas ao commit são reorganizadas e realizadas em lotes. Você pode obter um desempenho melhor ao alterar o valor padrão, mas então pode perder transações em um crash.

+ O ajuste padrão de 1 é necessário para o cumprimento completo da ACID. Os registros são escritos e descarregados no disco em cada commit de transação.

+ Com um ajuste de 0, os registros são escritos e descarregados no disco uma vez por segundo. As transações para as quais os registros não foram descarregados podem ser perdidas em um acidente.

+ Com um parâmetro de 2, os registros são escritos após cada compromisso de transação e apagados no disco uma vez por segundo. As transações para as quais os registros não foram apagados podem ser perdidas em um acidente.

+ Para as configurações 0 e 2, o esvaziamento uma vez por segundo não é garantido 100%. O esvaziamento pode ocorrer com mais frequência devido a alterações no DDL e outras atividades internas do `InnoDB` que fazem com que os registros sejam esvaziados independentemente da configuração do `innodb_flush_log_at_trx_commit`, e, às vezes, com menos frequência devido a problemas de cronograma. Se os registros forem esvaziados uma vez por segundo, até um segundo de transações pode ser perdido em um crash. Se os registros forem esvaziados com mais frequência ou menos frequência do que uma vez por segundo, a quantidade de transações que podem ser perdidas varia conforme isso.

A frequência de esvaziamento do log é controlada por `innodb_flush_log_at_timeout`, que permite definir a frequência de esvaziamento do log para *`N`* segundos (onde *`N`* é `1 ... 2700`, com um valor padrão de 1). No entanto, qualquer saída inesperada do processo do **mysqld** pode apagar até *`N`* segundos de transações.

+ As alterações no DDL e outras atividades internas do `InnoDB` limpem o log independentemente da configuração do `innodb_flush_log_at_trx_commit`.

+ `InnoDB` assegura a recuperação de falhas independentemente da configuração de `innodb_flush_log_at_trx_commit`. As transações são aplicadas totalmente ou apagadas totalmente.

Para durabilidade e consistência em um conjunto de replicação que utiliza `InnoDB` com transações:

+ Se o registro binário estiver habilitado, defina `sync_binlog=1`.

+ Sempre defina `innodb_flush_log_at_trx_commit=1`.

Para informações sobre a combinação de configurações em uma réplica que é mais resistente a interrupções inesperadas, consulte a Seção 19.4.2, “Tratamento de uma interrupção inesperada de uma réplica”.

Cuidado

Muitos sistemas operacionais e alguns hardwares de disco enganam a operação de varredura para disco. Eles podem informar ao **mysqld** que a varredura ocorreu, mesmo que não tenha. Neste caso, a durabilidade das transações não é garantida mesmo com as configurações recomendadas, e, no pior dos casos, uma falta de energia pode corromper os dados do `InnoDB`. Usar um cache de disco com bateria no controlador de disco SCSI ou no próprio disco acelera as varreduras de arquivos e torna a operação mais segura. Você também pode tentar desativar o cache de escritas de disco em caches de hardware.

* `innodb_flush_method`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_option"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-option=options</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_option</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>0

Define o método usado para limpar os dados para `InnoDB` [arquivos de dados](glossary.html#glos_data_files "data files") e [arquivos de log](glossary.html#glos_log_file "log file"), que podem afetar o desempenho de E/S.

Nos sistemas semelhantes ao Unix, o valor padrão é `fsync`. Em Windows, o valor padrão é `unbuffered`.

Nota

Em MySQL 8.0, as opções `innodb_flush_method` podem ser especificadas numericamente.

As opções `innodb_flush_method` para sistemas semelhantes ao Unix incluem:

+ `fsync` ou `0`: `InnoDB` utiliza a chamada de sistema `fsync()` para esvaziar tanto os arquivos de dados quanto os arquivos de registro. `fsync` é o ajuste padrão.

+ `O_DSYNC` ou `1`: `InnoDB` usa `O_SYNC` para abrir e esvaziar os arquivos de registro, e `fsync()` para esvaziar os arquivos de dados. `InnoDB` não usa `O_DSYNC` diretamente porque houve problemas com isso em muitas variedades de Unix.

+ `littlesync` ou `2`: Esta opção é usada para testes internos de desempenho e atualmente não é suportada. Use por sua conta e risco.

+ `nosync` ou `3`: Esta opção é usada para testes internos de desempenho e atualmente não é suportada. Use por sua conta e risco.

+ `O_DIRECT` ou `4`: `InnoDB` utiliza `O_DIRECT` (ou `directio()` no Solaris) para abrir os arquivos de dados e utiliza `fsync()` para esvaziar tanto os arquivos de dados quanto os de log. Esta opção está disponível em algumas versões do GNU/Linux, FreeBSD e Solaris.

+ `O_DIRECT_NO_FSYNC`: `InnoDB` utiliza `O_DIRECT` durante o fluxo de I/O, mas ignora a chamada de sistema `fsync()` após cada operação de escrita.

Antes do MySQL 8.0.14, essa configuração não é adequada para sistemas de arquivos como XFS e EXT4, que requerem uma chamada de sistema `fsync()` para sincronizar as mudanças de metadados do sistema de arquivos. Se você não tem certeza se seu sistema de arquivos requer uma chamada de sistema `fsync()` para sincronizar as mudanças de metadados do sistema de arquivos, use `O_DIRECT` em vez disso.

A partir do MySQL 8.0.14, `fsync()` é chamado após a criação de um novo arquivo, após o aumento do tamanho do arquivo e após a fechamento de um arquivo, para garantir que as mudanças de metadados do sistema de arquivos sejam sincronizadas. A chamada ao sistema `fsync()` ainda é ignorada após cada operação de escrita.

A perda de dados é possível se os arquivos de registro de refazer e os arquivos de dados estiverem em dispositivos de armazenamento diferentes, e uma saída inesperada ocorrer antes que as gravações dos arquivos de dados sejam apagadas de um cache de dispositivo que não seja alimentado por bateria. Se você estiver usando ou pretende usar diferentes dispositivos de armazenamento para arquivos de registro de refazer e arquivos de dados, e seus arquivos de dados estiverem em um dispositivo com um cache que não seja alimentado por bateria, use `O_DIRECT` em vez disso.

Em plataformas que suportam as chamadas de sistema `fdatasync()`, a variável `innodb_use_fdatasync`, introduzida no MySQL 8.0.26, permite que as opções `innodb_flush_method` que utilizam `fsync()` sejam substituídas por `fdatasync()`. Uma chamada de sistema `fdatasync()` não limpa as alterações no metadados do arquivo, a menos que seja necessário para a recuperação subsequente de dados, proporcionando um benefício potencial de desempenho.

As opções `innodb_flush_method` para sistemas Windows incluem:

+ `unbuffered` ou `0`: `InnoDB` utiliza E/S não tamponada.

Nota

Executar o servidor MySQL em um disco rígido de setor de 4K no Windows não é suportado com `unbuffered`. A solução é usar `innodb_flush_method=normal`.

+ `normal` ou `1`: `InnoDB` utiliza I/O com buffer.

Como cada configuração afeta o desempenho depende da configuração do hardware e da carga de trabalho. Faça uma comparação da sua configuração específica para decidir qual configuração usar ou se deve manter a configuração padrão. Examine a variável de status `Innodb_data_fsyncs` para ver o número total de chamadas `fsync()` (ou chamadas `fdatasync()` se `innodb_use_fdatasync` estiver habilitado) para cada configuração. A mistura de operações de leitura e escrita na sua carga de trabalho pode afetar o desempenho de uma configuração. Por exemplo, em um sistema com um controlador de RAID de hardware e cache de escrita com suporte a bateria, `O_DIRECT` pode ajudar a evitar o buffer duplo entre o pool de buffers `InnoDB` e o cache do sistema de arquivos do sistema operacional. Em alguns sistemas onde os arquivos de dados e log `InnoDB` estão localizados em um SAN, o valor padrão ou `O_DSYNC` pode ser mais rápido para uma carga de trabalho com operações de leitura predominantes e principalmente com `SELECT` instruções. Sempre teste este parâmetro com hardware e carga de trabalho que reflitam seu ambiente de produção. Para obter conselhos gerais sobre o ajuste de I/O, consulte a Seção 10.5.8, “Otimizando o I/O de disco do InnoDB”.

Se o servidor for iniciado com `--innodb-dedicated-server`, o valor de `innodb_flush_method` é definido automaticamente se não for explicitamente definido. Para mais informações, consulte a Seção 17.8.12, “Habilitar configuração automática do InnoDB para um servidor MySQL dedicado”.

* `innodb_flush_neighbors`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_option"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-option=options</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_option</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>1

Especifica se o esvaziamento de uma página do pool de buffer `InnoDB` também esvazia outras páginas [sujas](glossary.html#glos_dirty_page "dirty page") no mesmo intervalo.

+ Uma configuração de 0 desativa `innodb_flush_neighbors`. Páginas sujas na mesma extensão não são descartadas.

+ Uma configuração de 1 esvaziamento de páginas sujas consecutivas na mesma extensão.

+ Uma configuração de 2 varreduras de páginas sujas na mesma extensão.

Quando os dados da tabela são armazenados em um dispositivo de armazenamento HDD tradicional, o esvaziamento de tais páginas vizinhas em uma operação reduz o overhead de I/O (principalmente para operações de busca de disco) em comparação com o esvaziamento de páginas individuais em diferentes momentos. Para dados da tabela armazenados em SSD, o tempo de busca não é um fator significativo e você pode definir essa opção para 0 para espalhar as operações de escrita. Para informações relacionadas, consulte a Seção 17.8.3.5, “Configurando o esvaziamento do Pool de Buffer”.

* `innodb_flush_sync`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_option"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-option=options</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_option</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>2

A variável `innodb_flush_sync`, que é habilitada por padrão, faz com que as configurações dos `innodb_io_capacity` e `innodb_io_capacity_max` sejam ignoradas durante os surtos de atividade de E/S que ocorrem em pontos de verificação. Para aderir à taxa de E/S definida por `innodb_io_capacity` e `innodb_io_capacity_max`, desabilite `innodb_flush_sync`.

Para obter informações sobre a configuração da variável `innodb_flush_sync`, consulte a Seção 17.8.7, “Configurando a capacidade de E/S do InnoDB”.

* `innodb_flushing_avg_loops`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_option"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-option=options</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_option</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>3

Número de iterações para as quais `InnoDB` mantém o instantâneo previamente calculado do estado de limpeza, controlando a rapidez com que [limpeza adaptativa][(glossary.html#glos_adaptive_flushing "adaptive flushing")] responde às mudanças nas cargas de trabalho. Aumentar o valor faz com que a taxa de operações de limpeza mude de forma suave e gradual à medida que a carga de trabalho muda. Diminuir o valor faz com que a limpeza adaptativa ajuste-se rapidamente às mudanças na carga de trabalho, o que pode causar picos na atividade de limpeza se a carga de trabalho aumentar e diminuir de repente.

Para informações relacionadas, consulte a Seção 17.8.3.5, “Configurando o esvaziamento do Pool de tampão”.

* `innodb_force_load_corrupted`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_option"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-option=options</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_option</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>4

Permite que `InnoDB` carregue tabelas no início que estejam marcadas como corrompidas. Use apenas durante a solução de problemas, para recuperar dados que, de outra forma, seriam inacessíveis. Quando a solução de problemas estiver concluída, desative essa configuração e reinicie o servidor.

* `innodb_force_recovery`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_option"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-option=options</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_option</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>5

O modo de recuperação de falha, normalmente alterado apenas em situações graves de depuração. Os valores possíveis são de 0 a 6. Para os significados desses valores e informações importantes sobre `innodb_force_recovery`, consulte a Seção 17.21.3, “Forçando a recuperação do InnoDB”.

Aviso

Apenas defina essa variável para um valor maior que 0 em uma situação de emergência, para que você possa iniciar `InnoDB` e descartar suas tabelas. Como medida de segurança, `InnoDB` impede operações de `INSERT`, `UPDATE` ou `DELETE` quando `innodb_force_recovery` é maior que 0. Um ajuste de `innodb_force_recovery` de 4 ou mais coloca `InnoDB` no modo de leitura somente.

Essas restrições podem fazer com que os comandos de administração de replicação falhem com um erro, pois os registros do status da replicação são armazenados nas tabelas `InnoDB`.

* `innodb_fsync_threshold`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_option"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-option=options</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_option</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>6

Por padrão, quando o `InnoDB` cria um novo arquivo de dados, como um novo arquivo de registro ou arquivo de espaço de tabelas, o arquivo é totalmente escrito na memória cache do sistema operacional antes de ser descarregado no disco, o que pode causar uma grande quantidade de atividade de escrita no disco de uma só vez. Para forçar limpezas periódicas e menores dos dados da memória cache do sistema operacional, você pode usar a variável `innodb_fsync_threshold` para definir um valor limite, em bytes. Quando o limite de bytes é atingido, o conteúdo da memória cache do sistema operacional é descarregado no disco. O valor padrão de 0 força o comportamento padrão, que é descarregar os dados no disco apenas após um arquivo ser totalmente escrito na cache.

Especificar um limite para forçar limpezas periódicas menores pode ser benéfico em casos em que múltiplas instâncias do MySQL utilizam os mesmos dispositivos de armazenamento. Por exemplo, criar uma nova instância do MySQL e seus arquivos de dados associados pode causar grandes picos de atividade de escrita em disco, impedindo o desempenho de outras instâncias do MySQL que utilizam os mesmos dispositivos de armazenamento. Configurar um limite ajuda a evitar tais picos de atividade de escrita.

* `innodb_ft_aux_table`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_option"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-option=options</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_option</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>7

Especifica o nome qualificado de uma tabela `InnoDB` que contém um índice `FULLTEXT`. Esta variável é destinada a fins diagnósticos e só pode ser definida em tempo de execução. Por exemplo:

  ```
  SET GLOBAL innodb_ft_aux_table = 'test/t1';
  ```

Depois de definir essa variável para um nome no formato `db_name/table_name`, as tabelas `INFORMATION_SCHEMA`, `INNODB_FT_INDEX_TABLE`, `INNODB_FT_INDEX_CACHE`, `INNODB_FT_CONFIG`, `INNODB_FT_DELETED` e `INNODB_FT_BEING_DELETED` mostram informações sobre o índice de pesquisa para a tabela especificada.

Para mais informações, consulte a Seção 17.15.4, “Tabelas de índice FULLTEXT do InnoDB INFORMATION_SCHEMA”.

* `innodb_ft_cache_size`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_option"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-option=options</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_option</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>8

A memória alocada, em bytes, para o cache do índice de pesquisa `InnoDB` `FULLTEXT`, que mantém um documento analisado na memória enquanto cria um índice `InnoDB` `FULLTEXT`. As inserções e atualizações do índice são comprometidas apenas no disco quando o limite de tamanho `innodb_ft_cache_size` é atingido. `innodb_ft_cache_size` define o tamanho do cache por tabela. Para definir um limite global para todas as tabelas, consulte `innodb_ft_total_cache_size`.

Para mais informações, consulte Cache de índice de texto completo do InnoDB.

* `innodb_ft_enable_diag_print`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_option"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-option=options</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_option</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>9

Se deve habilitar a saída de diagnóstico de pesquisa de texto completo (FTS) adicional. Esta opção é destinada principalmente ao depuração avançada do FTS e não interessa à maioria dos usuários. A saída é impressa no log de erro e inclui informações como:

+ Progresso da sincronização do índice FTS (quando o limite do cache FTS é atingido). Por exemplo:

    ```
    FTS SYNC for table test, deleted count: 100 size: 10000 bytes
    SYNC words: 100
    ```

+ O FTS otimiza o progresso. Por exemplo:

    ```
    FTS start optimize test
    FTS_OPTIMIZE: optimize "mysql"
    FTS_OPTIMIZE: processed "mysql"
    ```

+ Progresso da construção do índice FTS. Por exemplo:

    ```
    Number of doc processed: 1000
    ```

+ Para consultas do FTS, a árvore de análise da consulta, o peso da palavra, o tempo de processamento da consulta e o uso de memória são impressos. Por exemplo:

    ```
    FTS Search Processing time: 1 secs: 100 millisec: row(s) 10000
    Full Search Memory: 245666 (bytes),  Row: 10000
    ```

* `innodb_ft_enable_stopword`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_r_batch_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-r-batch-size=#</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_r_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr></tbody></table>0

Especifica que um conjunto de palavras não contextuais é associado a um índice `InnoDB` `FULLTEXT` no momento em que o índice é criado. Se a opção `innodb_ft_user_stopword_table` estiver definida, as palavras não contextuais são retiradas daquela tabela. Caso contrário, se a opção `innodb_ft_server_stopword_table` estiver definida, as palavras não contextuais são retiradas daquela tabela. Caso contrário, um conjunto padrão de palavras não contextuais é usado.

Para mais informações, consulte a Seção 14.9.4, “Palavras-chave de texto completo”.

* `innodb_ft_max_token_size`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_r_batch_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-r-batch-size=#</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_r_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr></tbody></table>1

Comprimento máximo de caracteres das palavras que são armazenadas em um índice `InnoDB` `FULLTEXT`. Definir um limite para esse valor reduz o tamanho do índice, acelerando assim as consultas, ao omitir palavras longas ou coleções arbitrárias de letras que não são palavras reais e que provavelmente não serão termos de pesquisa.

Para mais informações, consulte a Seção 14.9.6, “Ajustando o Full-Text Search do MySQL”.

* `innodb_ft_min_token_size`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_r_batch_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-r-batch-size=#</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_r_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr></tbody></table>2

Comprimento mínimo das palavras que são armazenadas em um índice `InnoDB` `FULLTEXT`. Aumentar esse valor reduz o tamanho do índice, acelerando assim as consultas, ao omitir palavras comuns que provavelmente não serão significativas em um contexto de pesquisa, como as palavras em inglês “a” e “to”. Para conteúdo que utiliza um conjunto de caracteres CJK (Chinês, Japonês, Coreano), especifique um valor de 1.

Para mais informações, consulte a Seção 14.9.6, “Ajustando o Full-Text Search do MySQL”.

* `innodb_ft_num_word_optimize`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_r_batch_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-r-batch-size=#</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_r_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr></tbody></table>3

Número de palavras a serem processadas durante cada operação `OPTIMIZE TABLE` em um índice `InnoDB` `FULLTEXT`. Como uma operação de inserção ou atualização em massa em uma tabela que contém um índice de pesquisa full-text pode exigir uma manutenção substancial do índice para incorporar todas as alterações, você pode realizar uma série de declarações `OPTIMIZE TABLE`, cada uma pegando onde a última deixou.

Para mais informações, consulte a Seção 14.9.6, “Ajustando o Full-Text Search do MySQL”.

* `innodb_ft_result_cache_limit`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_r_batch_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-r-batch-size=#</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_r_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr></tbody></table>4

O limite de cache do resultado da consulta de pesquisa de texto completo `InnoDB` (definido em bytes) por consulta de pesquisa de texto completo ou por thread. Os resultados intermediários e finais da consulta de pesquisa de texto completo `InnoDB` são mantidos na memória. Use `innodb_ft_result_cache_limit` para definir um limite de tamanho no cache do resultado da consulta de pesquisa de texto completo para evitar o consumo excessivo de memória no caso de resultados de consulta de pesquisa de texto completo muito grandes (por exemplo, milhões ou centenas de milhões de linhas). A memória é alocada conforme necessário quando uma consulta de pesquisa de texto completo é processada. Se o limite de tamanho do cache do resultado da consulta for atingido, um erro é retornado indicando que a consulta excede a memória máxima permitida.

O valor máximo de `innodb_ft_result_cache_limit` para todos os tipos de plataforma e tamanhos de bits é 2\*\*32-1.

* `innodb_ft_server_stopword_table`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_r_batch_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-r-batch-size=#</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_r_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr></tbody></table>5

Esta opção é usada para especificar sua própria lista de palavras não indexadas `InnoDB` `FULLTEXT` para todas as tabelas `InnoDB`. Para configurar sua própria lista de palavras não indexadas para uma tabela específica `InnoDB`, use `innodb_ft_user_stopword_table`.

Defina `innodb_ft_server_stopword_table` com o nome da tabela que contém uma lista de palavras irrelevantes, no formato `db_name/table_name`.

A tabela de palavras-chave deve existir antes de configurar `innodb_ft_server_stopword_table`. `innodb_ft_enable_stopword` deve ser habilitado e a opção `innodb_ft_server_stopword_table` deve ser configurada antes de criar o índice `FULLTEXT`.

A tabela de palavras-chave deve ser uma tabela `InnoDB`, contendo uma única coluna `VARCHAR` denominada `value`.

Para mais informações, consulte a Seção 14.9.4, “Palavras-chave de texto completo”.

* `innodb_ft_sort_pll_degree`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_r_batch_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-r-batch-size=#</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_r_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr></tbody></table>6

Número de threads usadas em paralelo para indexar e tokenizar texto em um índice `InnoDB` `FULLTEXT` ao construir um índice de [índice de busca](glossary.html#glos_search_index "search index").

Para informações relacionadas, consulte a Seção 17.6.2.4, “Indekses de Texto Completo InnoDB”, e `innodb_sort_buffer_size`.

* `innodb_ft_total_cache_size`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_r_batch_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-r-batch-size=#</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_r_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr></tbody></table>7

A memória total alocada, em bytes, para o cache do índice de pesquisa de texto completo `InnoDB` para todas as tabelas. Criar várias tabelas, cada uma com um índice de pesquisa `FULLTEXT`, pode consumir uma parte significativa da memória disponível. `innodb_ft_total_cache_size` define um limite de memória global para todos os índices de pesquisa de texto completo para ajudar a evitar o consumo excessivo de memória. Se o limite global for atingido por uma operação de índice, uma sincronização forçada é acionada.

Para mais informações, consulte Cache de índice de texto completo do InnoDB.

* `innodb_ft_user_stopword_table`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_r_batch_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-r-batch-size=#</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_r_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr></tbody></table>8

Esta opção é usada para especificar sua própria lista de palavras não indexadas `InnoDB` `FULLTEXT` em uma tabela específica. Para configurar sua própria lista de palavras não indexadas para todas as tabelas `InnoDB`, use `innodb_ft_server_stopword_table`.

Defina `innodb_ft_user_stopword_table` com o nome da tabela que contém uma lista de palavras irrelevantes, no formato `db_name/table_name`.

A tabela de palavras-chave deve existir antes de configurar `innodb_ft_user_stopword_table`. `innodb_ft_enable_stopword` deve ser habilitado e `innodb_ft_user_stopword_table` deve ser configurado antes de criar o índice `FULLTEXT`.

A tabela de palavras-chave deve ser uma tabela `InnoDB`, contendo uma única coluna `VARCHAR` denominada `value`.

Para mais informações, consulte a Seção 14.9.4, “Palavras-chave de texto completo”.

* `innodb_idle_flush_pct`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_r_batch_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-r-batch-size=#</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_r_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr></tbody></table>9

Limita a limpeza de página quando o `InnoDB` está parado. O valor do `innodb_idle_flush_pct` é uma porcentagem do ajuste do `innodb_io_capacity`, que define o número de operações de E/S por segundo disponíveis para o `InnoDB`. Para mais informações, consulte Limitar a limpeza de buffer durante períodos de parada.

* `innodb_io_capacity`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_w_batch_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-w-batch-size=#</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_w_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>1048576</code></td> </tr></tbody></table>0

A variável `innodb_io_capacity` define o número de operações de E/S por segundo (IOPS) disponíveis para as tarefas de segundo plano `InnoDB`, como o esvaziamento de páginas do [buffer pool](glossary.html#glos_buffer_pool "buffer pool") e a fusão de dados do buffer de alterações.

Para obter informações sobre a configuração da variável `innodb_io_capacity`, consulte a Seção 17.8.7, “Configurando a capacidade de E/S do InnoDB”.

* `innodb_io_capacity_max`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_w_batch_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-w-batch-size=#</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_w_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>1048576</code></td> </tr></tbody></table>1

Se a atividade de limpeza ficar para trás, `InnoDB` pode realizar uma limpeza mais agressiva, com uma taxa mais alta de operações de entrada/saída por segundo (IOPS) do que a definida pela variável `innodb_io_capacity`. A variável `innodb_io_capacity_max` define um número máximo de IOPS realizados por tarefas de segundo plano `InnoDB` nessas situações. Esta opção não controla o comportamento de `innodb_flush_sync`.

Para obter informações sobre a configuração da variável `innodb_io_capacity_max`, consulte a Seção 17.8.7, “Configurando a capacidade de E/S do InnoDB”.

* `innodb_limit_optimistic_insert_debug`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_w_batch_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-w-batch-size=#</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_w_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>1048576</code></td> </tr></tbody></table>2

Limita o número de registros por página de árvore B. Um valor padrão de 0 significa que não há limite imposto. Esta opção só está disponível se o suporte de depuração for compilado usando a opção `WITH_DEBUG` **CMake**.

* `innodb_lock_wait_timeout`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_w_batch_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-w-batch-size=#</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_w_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>1048576</code></td> </tr></tbody></table>3

O tempo em segundos que a transação `InnoDB` espera por um bloqueio de linha antes de desistir. O valor padrão é de 50 segundos. Uma transação que tenta acessar uma linha que está bloqueada por outra transação `InnoDB` espera no máximo esse número de segundos para obter acesso de escrita à linha antes de emitir o seguinte erro:

  ```
  ERROR 1205 (HY000): Lock wait timeout exceeded; try restarting transaction
  ```

Quando ocorre um timeout de espera de bloqueio, a declaração atual é revertida (não a transação inteira). Para reverter a transação inteira, inicie o servidor com a opção `--innodb-rollback-on-timeout`. Veja também a Seção 17.21.5, “Tratamento de Erros do InnoDB”.

Você pode diminuir esse valor para aplicações altamente interativas ou sistemas OLTP, para exibir o feedback do usuário rapidamente ou colocar a atualização em uma fila para processamento mais tarde. Você pode aumentar esse valor para operações de back-end de longa duração, como uma etapa de transformação em um armazém de dados que espera que outras grandes operações de inserção ou atualização sejam concluídas.

`innodb_lock_wait_timeout` se aplica aos bloqueios de linha `InnoDB`. Um bloqueio de tabela MySQL não ocorre dentro de `InnoDB` e este tempo de espera não se aplica a espera por bloqueios de tabela.

O valor do tempo de espera da espera de bloqueio não se aplica a deadlocks quando `innodb_deadlock_detect` está habilitado (o padrão), porque `InnoDB` detecta deadlocks imediatamente e desfaz uma das transações em deadlock. Quando `innodb_deadlock_detect` está desabilitado, `InnoDB` depende de `innodb_lock_wait_timeout` para o rollback de transações quando ocorre um deadlock. Veja a Seção 17.7.5.2, “Detecção de Deadlock”.

`innodb_lock_wait_timeout` pode ser definido em tempo de execução com as declarações `SET GLOBAL` ou `SET SESSION`. Para alterar a definição de `GLOBAL`, é necessário privilégios suficientes para definir variáveis de sistema globais (consulte Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”) e isso afeta o funcionamento de todos os clientes que se conectam posteriormente. Qualquer cliente pode alterar a definição de `SESSION` para `innodb_lock_wait_timeout`, o que afeta apenas esse cliente.

* `innodb_log_buffer_size`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_w_batch_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-w-batch-size=#</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_w_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>1048576</code></td> </tr></tbody></table>4

O tamanho em bytes do buffer que `InnoDB` usa para gravar nos arquivos de registro (glossary.html#glos_log_file "log file") no disco. O padrão é 16 MB. Um buffer de registro grande permite que transações grandes sejam executadas sem a necessidade de gravar o registro no disco antes do comprometimento das transações. Assim, se você tem transações que atualizam, inserem ou excluem muitas linhas, aumentar o buffer de registro salva o I/O do disco. Para informações relacionadas, consulte Configuração de memória e Seção 10.5.4, “Otimizando o registro de refazer do InnoDB”. Para conselhos gerais sobre o ajuste de I/O, consulte Seção 10.5.8, “Otimizando o I/O de disco do InnoDB”.

* `innodb_log_checkpoint_fuzzy_now`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_w_batch_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-w-batch-size=#</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_w_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>1048576</code></td> </tr></tbody></table>5

Ative esta opção de depuração para forçar o `InnoDB` a escrever um ponto de verificação difuso. Esta opção só está disponível se o suporte de depuração for compilado usando a opção `WITH_DEBUG` **CMake**.

* `innodb_log_checkpoint_now`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_w_batch_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-w-batch-size=#</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_w_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>1048576</code></td> </tr></tbody></table>6

Ative esta opção de depuração para forçar o `InnoDB` a escrever um ponto de verificação. Esta opção só está disponível se o suporte de depuração for compilado usando a opção `WITH_DEBUG` **CMake**.

* `innodb_log_checksums`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_w_batch_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-w-batch-size=#</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_w_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>1048576</code></td> </tr></tbody></table>7

Habilita ou desabilita verificações de checksums para páginas do log de refazer.

`innodb_log_checksums=ON` permite o algoritmo de verificação de checksum `CRC-32C` para páginas de log de refazer. Quando `innodb_log_checksums` é desativado, o conteúdo do campo de verificação de checksum da página de log de refazer é ignorado.

Os checksums nas páginas do cabeçalho do log de refazer e nas páginas de verificação de ponto de controle do log de refazer nunca são desativados.

* `innodb_log_compressed_pages`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_w_batch_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-w-batch-size=#</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_w_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>1048576</code></td> </tr></tbody></table>8

Especifica se as imagens das páginas re-comprimidas são escritas no log de refazer. A recompressão pode ocorrer quando alterações são feitas nos dados comprimidos.

`innodb_log_compressed_pages` é ativado por padrão para evitar corrupção que poderia ocorrer se uma versão diferente do algoritmo de compressão `zlib` fosse usada durante a recuperação. Se você tem certeza de que a versão `zlib` não está sujeita a alterações, pode desativar `innodb_log_compressed_pages` para reduzir a geração de registro de revisão para cargas de trabalho que modificam dados comprimidos.

Para medir o efeito de habilitar ou desabilitar `innodb_log_compressed_pages`, compare a geração de registro de revisão para ambos os ajustes sob a mesma carga de trabalho. As opções para medir a geração de registro de revisão incluem observar o `Log sequence number` (LSN) na seção `LOG` do [`SHOW ENGINE INNODB STATUS`](show-engine.html "15.7.7.15 SHOW ENGINE Statement") de saída, ou monitorar o status do `Innodb_os_log_written` para o número de bytes escritos nos arquivos de registro de revisão.

Para informações relacionadas, consulte a Seção 17.9.1.6, “Compressão para cargas de trabalho OLTP”.

* `innodb_log_file_size`

  <table frame="box" rules="all" summary="Properties for daemon_memcached_w_batch_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon-memcached-w-batch-size=#</code></td> </tr><tr><th>Deprecated</th> <td>8.0.22</td> </tr><tr><th>System Variable</th> <td><code>daemon_memcached_w_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>1048576</code></td> </tr></tbody></table>9

Nota

`innodb_log_file_size` e `innodb_log_files_in_group` são descontinuados no MySQL 8.0.30. Essas variáveis são substituídas por `innodb_redo_log_capacity`. Para mais informações, consulte a Seção 17.6.5, “Redo Log”.

O tamanho em bytes de cada arquivo de registro (glossary.html#glos_log_file "log file") em um grupo de registro (glossary.html#glos_log_group "log group"). O tamanho combinado dos arquivos de registro (`innodb_log_file_size` * `innodb_log_files_in_group`) não pode exceder um valor máximo que é um pouco menos que 512 GB. Um par de arquivos de registro de 255 GB, por exemplo, se aproxima do limite, mas não o excede. O valor padrão é de 48 MB.

Geralmente, o tamanho combinado dos arquivos de registro deve ser grande o suficiente para que o servidor possa suavizar picos e vales na atividade de carga de trabalho, o que muitas vezes significa que há espaço suficiente para o registro redo para lidar com mais de uma hora de atividade de escrita. Quanto maior o valor, menos atividade de esvaziamento de verificação de ponto de controle é necessária no buffer pool, economizando I/O de disco. Arquivos de registro maiores também tornam [recuperação em caso de falha][(glossary.html#glos_crash_recovery "crash recovery")] mais lentos.

O mínimo `innodb_log_file_size` é de 4 MB.

Para informações relacionadas, consulte Configuração do log de refazer. Para conselhos gerais sobre o ajuste de E/S, consulte a Seção 10.5.8, “Otimizando o E/S do disco InnoDB”.

Se o servidor for iniciado com `--innodb-dedicated-server`, o valor de `innodb_log_file_size` é definido automaticamente se não for explicitamente definido. Para mais informações, consulte a Seção 17.8.12, “Habilitar configuração automática do InnoDB para um servidor MySQL dedicado”.

* `innodb_log_files_in_group`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>00

Nota

`innodb_log_file_size` e `innodb_log_files_in_group` são descontinuados no MySQL 8.0.30. Essas variáveis são substituídas por `innodb_redo_log_capacity`. Para mais informações, consulte a Seção 17.6.5, “Redo Log”.

O número de arquivos de registro no grupo de registro. `InnoDB` escreve nos arquivos de forma circular. O valor padrão (e recomendado) é 2. A localização dos arquivos é especificada por `innodb_log_group_home_dir`. O tamanho combinado dos arquivos de registro (`innodb_log_file_size` \* `innodb_log_files_in_group`) pode ser de até 512 GB.

Para informações relacionadas, consulte Configuração do Log Redo.

Se o servidor for iniciado com `--innodb-dedicated-server`, o valor de `innodb_log_files_in_group` é definido automaticamente se não for explicitamente definido. Para mais informações, consulte a Seção 17.8.12, “Habilitar configuração automática do InnoDB para um servidor MySQL dedicado”.

* `innodb_log_group_home_dir`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>01

O caminho do diretório para os arquivos de registro de refazer `InnoDB`.

Para informações relacionadas, consulte Configuração do Log Redo.

* `innodb_log_spin_cpu_abs_lwm`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>02

Define o valor mínimo de uso da CPU abaixo do qual os threads do usuário não giram mais enquanto aguardam um redo esvaziado. O valor é expresso como uma soma do uso de núcleos da CPU. Por exemplo, o valor padrão de 80 é 80% de um único núcleo da CPU. Em um sistema com um processador multicore, um valor de 150 representa 100% de uso de um núcleo da CPU mais 50% de uso de um segundo núcleo da CPU.

Para informações relacionadas, consulte a Seção 10.5.4, “Otimizando o registro InnoDB Redo”.

* `innodb_log_spin_cpu_pct_hwm`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>03

Define o valor máximo de uso da CPU acima do qual os threads do usuário não giram mais enquanto aguardam um redo esvaziado. O valor é expresso como uma porcentagem do poder de processamento total combinado de todos os núcleos da CPU. O valor padrão é de 50%. Por exemplo, o uso de 100% de dois núcleos da CPU é de 50% do poder de processamento total da CPU em um servidor com quatro núcleos da CPU.

A variável `innodb_log_spin_cpu_pct_hwm` respeita a afinidade do processador. Por exemplo, se um servidor tiver 48 núcleos, mas o processo **mysqld** estiver vinculado a apenas quatro núcleos da CPU, os outros 44 núcleos da CPU serão ignorados.

Para informações relacionadas, consulte a Seção 10.5.4, “Otimizando o registro InnoDB Redo”.

* `innodb_log_wait_for_flush_spin_hwm`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>04

Define o tempo médio máximo de esvaziamento do log após o qual os threads do usuário não retornam a girar enquanto aguardam o redo esvaziado. O valor padrão é de 400 microsegundos.

Para informações relacionadas, consulte a Seção 10.5.4, “Otimizando o registro InnoDB Redo”.

* `innodb_log_write_ahead_size`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>05

Define o tamanho do bloco de pré-escrita para o log de refazer, em bytes. Para evitar o "leitura na escrita", defina `innodb_log_write_ahead_size` de forma a corresponder ao tamanho do bloco de cache do sistema operacional ou do sistema de arquivos. O ajuste padrão é de 8192 bytes. A leitura na escrita ocorre quando os blocos do log de refazer não são totalmente cacheados no sistema operacional ou no sistema de arquivos devido a uma incompatibilidade entre o tamanho do bloco de pré-escrita do log de refazer e o tamanho do bloco de cache do sistema operacional ou do sistema de arquivos.

Os valores válidos para `innodb_log_write_ahead_size` são múltiplos do tamanho do bloco de arquivo de registro `InnoDB` (2n). O valor mínimo é o tamanho do bloco de arquivo de registro `InnoDB` (512). O pré-escrito não ocorre quando o valor mínimo é especificado. O valor máximo é igual ao valor de `innodb_page_size`. Se você especificar um valor para `innodb_log_write_ahead_size` que é maior que o valor de `innodb_page_size`, a configuração de `innodb_log_write_ahead_size` é truncada para o valor de `innodb_page_size`.

Definir o valor `innodb_log_write_ahead_size` muito baixo em relação ao tamanho do bloco de cache do sistema operacional ou do sistema de arquivos resulta em "leitura-escrita". Definir o valor muito alto pode ter um pequeno impacto no desempenho do `fsync` para gravações de arquivos de log devido ao fato de vários blocos serem escritos de uma só vez.

Para informações relacionadas, consulte a Seção 10.5.4, “Otimizando o registro InnoDB Redo”.

* `innodb_log_writer_threads`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>06

Permite que os threads de escritor de registro dedicado escrevam registros de registro de refazer do buffer de registro para os buffers do sistema e limpem os buffers do sistema para os arquivos de registro de refazer. Os threads de escritor de registro dedicado podem melhorar o desempenho em sistemas de alta concorrência, mas, para sistemas de baixa concorrência, desativar os threads de escritor de registro dedicado oferece um melhor desempenho.

Para mais informações, consulte a Seção 10.5.4, “Otimizando o registro InnoDB Redo”.

* `innodb_lru_scan_depth`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>07

Um parâmetro que influencia os algoritmos e heurísticas para a operação de esvaziamento do pool de buffers `InnoDB`. Principalmente de interesse para especialistas em desempenho que ajustam cargas de trabalho intensivas em I/O. Especifica, por instância do pool de buffers, até onde a lista de páginas LRU do thread de limpeza de páginas procura [páginas sujas][(glossary.html#glos_dirty_page "dirty page")] para esvaziar. Esta é uma operação de fundo realizada uma vez por segundo.

Um ajuste menor que o padrão é geralmente adequado para a maioria das cargas de trabalho. Um valor muito maior do que o necessário pode impactar o desempenho. Apenas considere aumentar o valor se você tiver capacidade de E/S disponível em uma carga de trabalho típica. Por outro lado, se uma carga de trabalho intensiva de escrita saturar sua capacidade de E/S, diminua o valor, especialmente no caso de um grande pool de buffers.

Ao ajustar `innodb_lru_scan_depth`, comece com um valor baixo e configure o ajuste para cima, com o objetivo de raramente ver páginas livres em zero. Além disso, considere ajustar `innodb_lru_scan_depth` quando alterar o número de instâncias do buffer pool, pois `innodb_lru_scan_depth` * `innodb_buffer_pool_instances` define a quantidade de trabalho realizada pelo fio de limpeza de página a cada segundo.

Para informações relacionadas, consulte a Seção 17.8.3.5, “Configurando o esvaziamento do buffer pool”. Para conselhos gerais sobre o ajuste de E/S, consulte a Seção 10.5.8, “Otimizando o E/S do disco InnoDB”.

* `innodb_max_dirty_pages_pct`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>08

`InnoDB` tenta limpar os dados do pool de buffer para que a porcentagem de [páginas sujas][(glossary.html#glos_dirty_page "dirty page")] não exceda esse valor.

O ajuste `innodb_max_dirty_pages_pct` estabelece um alvo para a atividade de limpeza. Não afeta a taxa de limpeza. Para informações sobre a gestão da taxa de limpeza, consulte a Seção 17.8.3.5, “Configurando a Limpeza do Banco de Armazenamento”.

Para informações relacionadas, consulte a Seção 17.8.3.5, “Configurando o esvaziamento do buffer pool”. Para conselhos gerais sobre o ajuste de E/S, consulte a Seção 10.5.8, “Otimizando o E/S do disco InnoDB”.

* `innodb_max_dirty_pages_pct_lwm`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>09

Define uma marca de água baixa que representa a porcentagem de páginas sujas na qual o pré-lavamento é habilitado para controlar a proporção de páginas sujas. Um valor de 0 desativa o comportamento de pré-lavamento completamente. O valor configurado deve sempre ser menor que o valor `innodb_max_dirty_pages_pct`. Para mais informações, consulte a Seção 17.8.3.5, “Configurando o Pré-lavamento do Pool de Buffer”.

* `innodb_max_purge_lag`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>10

Define o atraso máximo desejado para a purga. Se esse valor for excedido, um atraso é imposto nas operações de `INSERT`, `UPDATE` e `DELETE` para permitir tempo para que a purga se atualize. O valor padrão é 0, o que significa que não há atraso máximo de purga e nenhum atraso.

Para mais informações, consulte a Seção 17.8.9, “Configuração de Purga”.

* `innodb_max_purge_lag_delay`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>11

Especifica o atraso máximo em microsegundos para o atraso imposto quando o limite `innodb_max_purge_lag` é excedido. O valor especificado `innodb_max_purge_lag_delay` é um limite superior para o período de atraso calculado pela fórmula `innodb_max_purge_lag`.

Para mais informações, consulte a Seção 17.8.9, “Configuração de Purga”.

* `innodb_max_undo_log_size`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>12

Define um tamanho limite para os espaços de tabelas de desfazer. Se um espaço de tabelas de desfazer exceder o limite, ele pode ser marcado para truncamento quando o `innodb_undo_log_truncate` está habilitado. O valor padrão é de 1073741824 bytes (1024 MiB).

Para mais informações, consulte o artigo "Truncar espaços de tabela Undo".

* `innodb_merge_threshold_set_all_debug`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>13

Define um valor percentual de página cheia para páginas de índice que substitui o ajuste atual do `MERGE_THRESHOLD` para todos os índices que estão atualmente na cache do dicionário. Esta opção só está disponível se o suporte de depuração estiver compilado usando a opção `WITH_DEBUG` **CMake**. Para informações relacionadas, consulte a Seção 17.8.11, “Configurando o Limite de Fusão para Páginas de Índice”.

* `innodb_monitor_disable`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>14

Essa variável atua como um interruptor, desabilitando os contadores de métricas `InnoDB`. Os dados do contador podem ser consultados usando a tabela do Esquema de Informação `INNODB_METRICS`. Para informações de uso, consulte a Seção 17.15.6, “Tabela de Métricas do Esquema de Informação InnoDB”.

`innodb_monitor_disable='latch'` desativa a coleta de estatísticas para `SHOW ENGINE INNODB MUTEX`(show-engine.html "15.7.7.15 SHOW ENGINE Statement"). Para mais informações, consulte a Seção 15.7.7.15, “Declaração SHOW ENGINE”.

* `innodb_monitor_enable`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>15

Essa variável atua como um interruptor, permitindo que os contadores de métricas `InnoDB` sejam utilizados. Os dados do contador podem ser consultados usando a tabela do Esquema de Informação `INNODB_METRICS`. Para informações de uso, consulte a Seção 17.15.6, “Tabela de Métricas do Esquema de Informação InnoDB”.

`innodb_monitor_enable='latch'` permite a coleta de estatísticas para `SHOW ENGINE INNODB MUTEX`(show-engine.html "15.7.7.15 SHOW ENGINE Statement"). Para mais informações, consulte a Seção 15.7.7.15, “Declaração SHOW ENGINE”.

* `innodb_monitor_reset`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>16

Essa variável atua como um interruptor, redefinindo o valor de contagem para os contadores de métricas `InnoDB`. Os dados do contador podem ser consultados usando a tabela do Esquema de Informação `INNODB_METRICS`. Para informações de uso, consulte a Seção 17.15.6, “Tabela de Métricas do Esquema de Informação InnoDB”.

`innodb_monitor_reset='latch'` refaz as estatísticas relatadas por `SHOW ENGINE INNODB MUTEX`(show-engine.html "15.7.7.15 SHOW ENGINE Statement"). Para mais informações, consulte a Seção 15.7.7.15, “Declaração SHOW ENGINE”.

* `innodb_monitor_reset_all`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>17

Essa variável atua como um interruptor, redefinindo todos os valores (mínimo, máximo, etc.) para os contadores de métricas de `InnoDB`. Os dados do contador podem ser consultados usando a tabela do Esquema de Informação `INNODB_METRICS`. Para informações de uso, consulte a Seção 17.15.6, “Tabela de Métricas do Esquema de Informação InnoDB”.

* `innodb_numa_interleave`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>18

Permite a política de interligação de memória NUMA para a alocação do pool de buffers `InnoDB`. Quando o `innodb_numa_interleave` é habilitado, a política de memória NUMA é definida para `MPOL_INTERLEAVE` para o processo **mysqld**. Após a alocação do pool de buffers `InnoDB`, a política de memória NUMA é definida de volta para `MPOL_DEFAULT`. Para que a opção `innodb_numa_interleave` esteja disponível, o MySQL deve ser compilado em um sistema Linux habilitado para NUMA.

**CMake** define o valor padrão `WITH_NUMA` com base no suporte do `NUMA` da plataforma atual. Para mais informações, consulte a Seção 2.8.7, “Opções de Configuração de Fonte do MySQL”.

* `innodb_old_blocks_pct`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>19

Especifica a porcentagem aproximada do pool de buffer `InnoDB` usado para a sublista de blocos antigos. A faixa de valores é de 5 a 95. O valor padrão é 37 (ou seja, 3/8 do pool). Frequentemente usado em combinação com `innodb_old_blocks_time`.

Para mais informações, consulte a Seção 17.8.3.3, “Tornando o Scan do Buffer Pool Resistente”. Para informações sobre a gestão do buffer pool, o algoritmo LRU e as políticas de expulsão, consulte a Seção 17.5.1, “Buffer Pool”.

* `innodb_old_blocks_time`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>20

Valores não nulos protegem o pool de buffer de ser preenchido com dados que são referenciados apenas por um breve período, como durante um [escaneamento completo da tabela][(glossary.html#glos_full_table_scan "full table scan")]. Aumentar esse valor oferece mais proteção contra escaneamentos completos da tabela que interferem com os dados cacheados no pool de buffer.

Especifica por quanto tempo, em milissegundos, um bloco inserido na sublista antiga deve permanecer lá após seu primeiro acesso antes de poder ser movido para a nova sublista. Se o valor for 0, um bloco inserido na sublista antiga se move imediatamente para a nova sublista na primeira vez que é acessado, independentemente de quanto tempo após a inserção ocorrer o acesso. Se o valor for maior que 0, os blocos permanecem na sublista antiga até que ocorra um acesso de pelo menos tantos milissegundos após o primeiro acesso. Por exemplo, um valor de 1000 faz com que os blocos permaneçam na sublista antiga por 1 segundo após o primeiro acesso antes de se tornarem elegíveis para serem movidos para a nova sublista.

O valor padrão é 1000.

Essa variável é frequentemente usada em combinação com `innodb_old_blocks_pct`. Para mais informações, consulte a Seção 17.8.3.3, “Tornando o Scan do Buffer Resistente”. Para informações sobre a gestão do buffer pool, o algoritmo LRU e as políticas de expulsão, consulte a Seção 17.5.1, “Buffer Pool”.

* `innodb_online_alter_log_max_size`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>21

Especifica um limite superior em bytes sobre o tamanho dos arquivos de registro temporários usados durante as operações de [online DDL][(glossary.html#glos_online_ddl "online DDL")] para as tabelas `InnoDB`. Há um arquivo de registro para cada índice sendo criado ou tabela sendo alterada. Este arquivo de registro armazena dados inseridos, atualizados ou excluídos na tabela durante a operação de DDL. O arquivo de registro temporário é estendido quando necessário pelo valor de `innodb_sort_buffer_size`, até o máximo especificado por `innodb_online_alter_log_max_size`. Se um arquivo de registro temporário exceder o limite de tamanho superior, a operação `ALTER TABLE` falha e todas as operações DML concorrentes não comprometidas são revertidas. Assim, um valor grande para esta opção permite que mais DML ocorra durante uma operação de DDL online, mas também estende o período de tempo no final da operação de DDL quando a tabela é bloqueada para aplicar os dados do log.

* `innodb_open_files`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>22

Especifica o número máximo de arquivos que o `InnoDB` pode ter abertos ao mesmo tempo. O valor mínimo é 10. Se o `innodb_file_per_table` estiver desativado, o valor padrão é 300; caso contrário, o valor padrão é 300 ou o ajuste do `table_open_cache`, dependendo do que for maior.

A partir do MySQL 8.0.28, o limite `innodb_open_files` pode ser definido em tempo de execução usando uma declaração `SELECT innodb_set_open_files_limit(N)`, onde *`N`* é o limite desejado `innodb_open_files`; por exemplo:

  ```
  mysql> SELECT innodb_set_open_files_limit(1000);
  ```

A declaração executa um procedimento armazenado que define o novo limite. Se o procedimento for bem-sucedido, ele retorna o valor do limite recém-definido; caso contrário, uma mensagem de falha é retornada.

Não é permitido definir `innodb_open_files` usando uma declaração `SET`. Para definir `innodb_open_files` em tempo de execução, use a declaração `SELECT innodb_set_open_files_limit(N)` descrita acima.

A definição de `innodb_open_files=default` não é suportada. Apenas valores inteiros são permitidos.

A partir do MySQL 8.0.28, para evitar que arquivos não gerenciados LRU consumam todo o limite `innodb_open_files`, os arquivos não gerenciados LRU são limitados a 90 por cento do limite `innodb_open_files`, que reserva 10 por cento do limite `innodb_open_files` para arquivos gerenciados LRU.

Os arquivos de espaço de tabela temporários não foram contados para o limite `innodb_open_files` do MySQL 8.0.24 ao MySQL 8.0.27.

* `innodb_optimize_fulltext_only`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>23

Altera a forma como `OPTIMIZE TABLE` opera em tabelas de `InnoDB`. Destinado a ser habilitado temporariamente, durante operações de manutenção para tabelas de `InnoDB` com índices de `FULLTEXT`.

Por padrão, `OPTIMIZE TABLE` reorganiza os dados no índice agrupado da tabela. Quando esta opção é habilitada, `OPTIMIZE TABLE` ignora a reorganização dos dados da tabela e, em vez disso, processa os dados de token recém-adicionados, excluídos e atualizados para os índices `InnoDB` e `FULLTEXT` de `OPTIMIZE TABLE`. Para mais informações, consulte Otimização de índices full-text InnoDB.

* `innodb_page_cleaners`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>24

O número de threads de limpeza de página que limpem páginas sujas das instâncias do pool de buffer. As threads de limpeza de página realizam a limpeza da lista de limpeza e a limpeza LRU. Quando há várias threads de limpeza de página, as tarefas de limpeza do buffer para cada instância do pool de buffer são enviadas para as threads de limpeza de página ociosas. O valor padrão de `innodb_page_cleaners` é 4. Se o número de threads de limpeza de página exceder o número de instâncias do pool de buffer, `innodb_page_cleaners` é automaticamente definido com o mesmo valor que `innodb_buffer_pool_instances`.

Se sua carga de trabalho estiver vinculada à escrita de I/O quando você esvazia páginas sujas das instâncias do pool de buffer para arquivos de dados, e se o hardware do seu sistema tiver capacidade disponível, aumentar o número de threads de limpeza de página pode ajudar a melhorar o desempenho da escrita de I/O.

O suporte para limpeza de página multithread é estendido para as fases de desligamento e recuperação.

A chamada de sistema `setpriority()` é usada em plataformas Linux onde é suportada e onde o usuário de execução do **mysqld** está autorizado a dar prioridade a `page_cleaner` threads em relação a outros threads do MySQL e `InnoDB` para ajudar a manter o esvaziamento de páginas em sintonia com a carga de trabalho atual. O suporte ao `setpriority()` é indicado por esta mensagem de inicialização `InnoDB`:

  ```
  [Note] InnoDB: If the mysqld execution user is authorized, page cleaner
  thread priority can be changed. See the man page of setpriority().
  ```

Para sistemas onde o início e o término do servidor não são gerenciados pelo systemd, a autorização de execução do usuário do **mysqld** pode ser configurada em `/etc/security/limits.conf`. Por exemplo, se o **mysqld** for executado sob o usuário `mysql`, você pode autorizar o usuário `mysql` adicionando essas linhas em `/etc/security/limits.conf`:

  ```
  mysql              hard    nice       -20
  mysql              soft    nice       -20
  ```

Para sistemas gerenciados pelo systemd, o mesmo pode ser alcançado especificando `LimitNICE=-20` em um arquivo de configuração localizado do systemd. Por exemplo, crie um arquivo chamado `override.conf` em `/etc/systemd/system/mysqld.service.d/override.conf` e adicione esta entrada:

  ```
  [Service]
  LimitNICE=-20
  ```

Depois de criar ou alterar `override.conf`, recarregue a configuração do systemd, em seguida, diga ao systemd para reiniciar o serviço MySQL:

  ```
  systemctl daemon-reload
  systemctl restart mysqld  # RPM platforms
  systemctl restart mysql   # Debian platforms
  ```

Para obter mais informações sobre o uso de um arquivo de configuração do systemd localizado, consulte Configurando o systemd para MySQL.

Após autorizar o usuário de execução do **mysqld**, use o comando **cat** para verificar os limites configurados do `Nice` para o processo **mysqld**:

  ```
  $> cat /proc/mysqld_pid/limits | grep nice
  Max nice priority         18446744073709551596 18446744073709551596
  ```

* `innodb_page_size`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>25

Especifica o tamanho da página para os espaços de tabelas `InnoDB`. Os valores podem ser especificados em bytes ou kilobytes. Por exemplo, um valor de tamanho de página de 16 kilobytes pode ser especificado como 16384, 16KB ou 16k.

`innodb_page_size` só pode ser configurado antes de inicializar a instância do MySQL e não pode ser alterado posteriormente. Se não for especificado nenhum valor, a instância é inicializada usando o tamanho padrão da página. Veja a Seção 17.8.1, “Configuração de inicialização do InnoDB”.

Para tamanhos de página de 32 KB e 64 KB, o comprimento máximo da linha é de aproximadamente 16000 bytes. `ROW_FORMAT=COMPRESSED` não é suportado quando `innodb_page_size` está definido para 32 KB ou 64 KB. Para `innodb_page_size=32KB`, o tamanho do alcance é de 2 MB. Para `innodb_page_size=64KB`, o tamanho do alcance é de 4 MB. `innodb_log_buffer_size` deve ser definido como pelo menos 16 M (o padrão) ao usar tamanhos de página de 32 KB ou 64 KB.

O tamanho de página padrão de 16 KB ou maior é apropriado para uma ampla gama de cargas de trabalho, particularmente para consultas que envolvem varreduras de tabela e operações de manipulação de dados de massa (DML) que envolvem atualizações em massa. Tamanhos de página menores podem ser mais eficientes para cargas de trabalho OLTP que envolvem muitos pequenos escritos, onde a concorrência pode ser um problema quando páginas únicas contêm muitas linhas. Páginas menores também podem ser eficientes com dispositivos de armazenamento SSD, que geralmente usam tamanhos de bloco pequenos. Manter o tamanho de página `InnoDB` próximo ao tamanho do bloco do dispositivo de armazenamento minimiza a quantidade de dados não alterados que são reescritos no disco.

O tamanho mínimo do arquivo dos primeiros dados do espaço de tabela do sistema (`ibdata1`) difere dependendo do valor do `innodb_page_size`. Consulte a descrição da opção `innodb_data_file_path` para obter mais informações.

Uma instância do MySQL que utiliza um tamanho de página específico do `InnoDB` não pode usar arquivos de dados ou arquivos de registro de uma instância que utiliza um tamanho de página diferente.

Para obter conselhos gerais sobre o ajuste de E/S, consulte a Seção 10.5.8, “Otimizando o E/S do disco InnoDB”.

* `innodb_parallel_read_threads`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>26

Define o número de threads que podem ser usadas para leituras paralelas de índices agrupados. O varredura paralela de partições é suportada a partir do MySQL 8.0.17. As threads de leitura paralelas podem melhorar o desempenho do `CHECK TABLE`. As leituras do índice agrupado são realizadas duas vezes durante uma operação de `CHECK TABLE`(check-table.html "15.7.3.2 CHECK TABLE Statement"). A segunda leitura pode ser realizada em paralelo. Este recurso não se aplica a varreduras de índices secundários. A variável de sessão `innodb_parallel_read_threads` deve ser definida com um valor maior que 1 para que ocorram leituras paralelas de índices agrupados. O número real de threads usadas para realizar uma leitura paralela de índice agrupado é determinado pelo ajuste `innodb_parallel_read_threads` ou pelo número de subárvores de índice a serem varridas, o que for menor. As páginas lidas no buffer pool durante a varredura são mantidas na extremidade da lista LRU do buffer pool para que possam ser descartadas rapidamente quando páginas livres do buffer pool são necessárias.

A partir do MySQL 8.0.17, o número máximo de threads de leitura paralelas (256) é o número total de threads para todas as conexões do cliente. Se o limite de threads for atingido, as conexões retornam a usar uma única thread.

* `innodb_print_all_deadlocks`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>27

Quando esta opção está habilitada, as informações sobre todos os deadlocks nas transações do usuário `InnoDB` são registradas no `mysqld` [registro de erros](error-log.html "7.4.2 The Error Log"). Caso contrário, você verá informações sobre apenas o último deadlock, usando o comando `SHOW ENGINE INNODB STATUS`. Um deadlock ocasional `InnoDB` não é necessariamente um problema, porque `InnoDB` detecta a condição imediatamente e desfaz uma das transações automaticamente. Você pode usar esta opção para solucionar o motivo pelo qual os deadlocks estão ocorrendo, se um aplicativo não tiver a lógica apropriada de tratamento de erros para detectar o rollback e repetir sua operação. Um grande número de deadlocks pode indicar a necessidade de estruturar as transações que emitem declarações DML ou `SELECT ... FOR UPDATE` para múltiplas tabelas, para que cada transação acesse as tabelas na mesma ordem, evitando assim a condição de deadlock.

Para informações relacionadas, consulte a Seção 17.7.5, "Bloqueios em InnoDB".

* `innodb_print_ddl_logs`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>28

Ativação desta opção faz com que o MySQL escreva logs de DDL em `stderr`. Para mais informações, consulte Visualizando logs de DDL.

* `innodb_purge_batch_size`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>29

Define o número de páginas do registro de desfazer que são limpas e processadas em um lote da lista de histórico. Em uma configuração de purga multithread, o thread de purga do coordenador divide `innodb_purge_batch_size` por `innodb_purge_threads` e atribui esse número de páginas a cada thread de purga. A variável `innodb_purge_batch_size` também define o número de páginas do registro de desfazer que são liberadas após cada 128 iterações pelos registros de desfazer.

A opção `innodb_purge_batch_size` é destinada a ajustes avançados de desempenho em combinação com a configuração `innodb_purge_threads`. A maioria dos usuários não precisa alterar `innodb_purge_batch_size` do seu valor padrão.

Para informações relacionadas, consulte a Seção 17.8.9, “Configuração de Purga”.

* `innodb_purge_threads`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>30

O número de threads de fundo dedicadas à operação de purga `InnoDB`. Aumentar o valor cria threads de purga adicionais, o que pode melhorar a eficiência em sistemas onde operações de DML são realizadas em múltiplas tabelas.

Para informações relacionadas, consulte a Seção 17.8.9, “Configuração de Purga”.

* `innodb_purge_rseg_truncate_frequency`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>31

Define a frequência com que o sistema de purga libera segmentos de recuo em termos do número de vezes que a purga é invocada. Um espaço de tabela de desfazer não pode ser truncado até que seus segmentos de recuo sejam liberados. Normalmente, o sistema de purga libera segmentos de recuo uma vez a cada 128 vezes que a purga é invocada. O valor padrão é 128. Reduzir esse valor aumenta a frequência com que o thread de purga libera segmentos de recuo.

`innodb_purge_rseg_truncate_frequency` é destinado ao uso com `innodb_undo_log_truncate`. Para mais informações, consulte "Trituração de Undo Tablespaces".

* `innodb_random_read_ahead`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>32

Permite a técnica de leitura prévia aleatória para otimizar o `InnoDB` de E/S.

Para obter detalhes sobre as considerações de desempenho para diferentes tipos de solicitações de leitura antecipada, consulte a Seção 17.8.3.4, “Configurando a pré-visualização do buffer do InnoDB (Leitura antecipada”)”). Para conselhos gerais sobre o ajuste de E/S, consulte a Seção 10.5.8, “Otimizando o E/S do disco do InnoDB”.

* `innodb_read_ahead_threshold`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>33

Controla a sensibilidade do pré-leitura linear que o `InnoDB` usa para pré-carregar páginas no pool de buffer. Se o `InnoDB` lê pelo menos `innodb_read_ahead_threshold` páginas sequencialmente de um intervalo (64 páginas), ele inicia uma leitura assíncrona para todo o intervalo seguinte. A faixa de valores permitida é de 0 a 64. Um valor de 0 desativa o pré-leitura. Para o valor padrão de 56, o `InnoDB` deve ler pelo menos 56 páginas sequencialmente de um intervalo para iniciar uma leitura assíncrona para o intervalo seguinte.

Saber quantos páginas são lidas através do mecanismo de leitura antecipada e quantas dessas páginas são expulsas do pool de buffer sem serem acessadas nunca, pode ser útil ao ajustar o ajuste do `innodb_read_ahead_threshold`. A saída `SHOW ENGINE INNODB STATUS` exibe informações de contagem das variáveis de status globais (show-engine.html "15.7.7.15 SHOW ENGINE Statement") e (glossary.html#glos_buffer_pool "buffer pool"), que relatam o número de páginas trazidas para o [pool de buffer][(glossary.html#glos_buffer_pool "buffer pool")] por solicitações de leitura antecipada, e o número de páginas dessas que são expulsas do pool de buffer sem serem acessadas nunca, respectivamente. As variáveis de status relatam valores globais desde a última reinicialização do servidor.

`SHOW ENGINE INNODB STATUS`](show-engine.html "15.7.7.15 SHOW ENGINE Statement") também mostra a taxa na qual as páginas de leitura são lidas e a taxa na qual essas páginas são expulsas sem serem acessadas. As médias por segundo são baseadas nas estatísticas coletadas desde a última invocação de `SHOW ENGINE INNODB STATUS` e são exibidas na seção `BUFFER POOL AND MEMORY` do [`SHOW ENGINE INNODB STATUS`](show-engine.html "15.7.7.15 SHOW ENGINE Statement") de saída.

Para mais informações, consulte a Seção 17.8.3.4, “Configurando a pré-visualização do buffer do InnoDB (leitura antecipada”)”). Para conselhos gerais sobre o ajuste de E/S, consulte a Seção 10.5.8, “Otimizando o E/S do disco do InnoDB”.

* `innodb_read_io_threads`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>34

O número de threads de E/S para operações de leitura em `InnoDB`. Sua contraparte para threads de escrita é `innodb_write_io_threads`. Para mais informações, consulte a Seção 17.8.5, “Configurando o Número de Threads de E/S de InnoDB de Fundo”. Para conselhos gerais sobre o ajuste de E/S, consulte a Seção 10.5.8, “Otimizando o E/S de Disco do InnoDB”.

Nota

Nos sistemas Linux, executar vários servidores MySQL (tipicamente mais de 12) com configurações padrão para `innodb_read_io_threads`, `innodb_write_io_threads` e a configuração Linux `aio-max-nr` pode exceder os limites do sistema. Idealmente, aumente a configuração `aio-max-nr`; como uma solução alternativa, você pode reduzir as configurações de uma ou ambas as variáveis MySQL.

* `innodb_read_only`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>35

Começa `InnoDB` no modo de leitura somente. Para distribuir aplicações de banco de dados ou conjuntos de dados em mídia de leitura somente. Também pode ser usado em armazéns de dados para compartilhar o mesmo diretório de dados entre múltiplas instâncias. Para mais informações, consulte a Seção 17.8.2, “Configurando o InnoDB para operação de leitura somente”.

Anteriormente, habilitar a variável de sistema `innodb_read_only` impediu a criação e a eliminação de tabelas apenas para o mecanismo de armazenamento `InnoDB`. A partir do MySQL 8.0, habilitar `innodb_read_only` impede essas operações para todos os mecanismos de armazenamento. As operações de criação e eliminação de tabelas para qualquer mecanismo de armazenamento modificam as tabelas do dicionário de dados no banco de dados do sistema `mysql`, mas essas tabelas usam o mecanismo de armazenamento `InnoDB` e não podem ser modificadas quando `innodb_read_only` está habilitado. O mesmo princípio se aplica a outras operações de tabela que exigem a modificação de tabelas do dicionário de dados. Exemplos:

+ Se a variável de sistema `innodb_read_only` estiver habilitada, (analyze-table.html "15.7.3.1 ANALYZE TABLE Statement") pode falhar porque não consegue atualizar as tabelas de estatísticas no dicionário de dados, que utilizam `InnoDB`. Para operações `ANALYZE TABLE` que atualizam a distribuição de chaves, a falha pode ocorrer mesmo que a operação atualize a própria tabela (por exemplo, se for uma tabela `MyISAM`). Para obter as estatísticas de distribuição atualizadas, defina `information_schema_stats_expiry=0`.

+ `ALTER TABLE tbl_name ENGINE=engine_name`(alter-table.html "15.1.9 ALTER TABLE Statement") falha porque atualiza a designação do motor de armazenamento, que é armazenada no dicionário de dados.

Além disso, outras tabelas no banco de dados do sistema `mysql` utilizam o mecanismo de armazenamento `InnoDB` no MySQL 8.0. Tornar essas tabelas apenas de leitura resulta em restrições em operações que as modificam. Exemplos:

Os relatórios de gerenciamento de contas, como `CREATE USER` e `GRANT`, falham porque as tabelas de concessão utilizam `InnoDB`.

As declarações de gerenciamento de plugins `INSTALL PLUGIN` e `UNINSTALL PLUGIN` falham porque a tabela do sistema `mysql.plugin` usa `InnoDB`.

As declarações de gerenciamento de funções carregáveis `CREATE FUNCTION`(create-function-loadable.html "15.7.4.1 CREATE FUNCTION Statement for Loadable Functions") e `DROP FUNCTION`(drop-function-loadable.html "15.7.4.2 DROP FUNCTION Statement for Loadable Functions") falham porque a tabela de sistema `mysql.func` usa `InnoDB`.

* `innodb_redo_log_archive_dirs`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>36

Define diretórios marcados onde os arquivos de arquivo de log de refazer podem ser criados. Você pode definir vários diretórios marcados em uma lista separada por ponto e vírgula. Por exemplo:

  ```
  innodb_redo_log_archive_dirs='label1:/backups1;label2:/backups2'
  ```

Uma etiqueta pode ser qualquer sequência de caracteres, com exceção de colchetes (:), que não são permitidos. Uma etiqueta vazia também é permitida, mas o colon (:) ainda é necessário neste caso.

Um caminho deve ser especificado e o diretório deve existir. O caminho pode conter colchetes (':'), mas pontos e virgulas (;) não são permitidos.

* `innodb_redo_log_capacity`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>37

Define a quantidade de espaço em disco ocupado pelos arquivos de log de refazer.

`innodb_redo_log_capacity` substitui as variáveis `innodb_log_files_in_group` e `innodb_log_file_size`, que são ignoradas se `innodb_redo_log_capacity` for definido.

Se `innodb_redo_log_capacity` não for definido e se nem `innodb_log_file_size` nem `innodb_log_files_in_group` forem definidos, então o valor padrão de `innodb_redo_log_capacity` é utilizado.

Se `innodb_redo_log_capacity` não estiver definido e se `innodb_log_file_size` e/ou `innodb_log_files_in_group` estiverem definidos, então a capacidade do log de refazer do InnoDB é calculada como *(innodb_log_files_in_group * innodb_log_file_size)*. Esse cálculo não modifica o valor do ajuste do não utilizado `innodb_redo_log_capacity`.

A variável de status do servidor `Innodb_redo_log_capacity_resized` indica a capacidade total do log de refazer para todos os arquivos de log de refazer.

Se o servidor for iniciado com `--innodb-dedicated-server`, o valor de `innodb_redo_log_capacity` é definido automaticamente se não for explicitamente definido. Para mais informações, consulte a Seção 17.8.12, “Habilitar configuração automática do InnoDB para um servidor MySQL dedicado”.

Para mais informações, consulte a Seção 17.6.5, “Registro de Refazer”.

* `innodb_redo_log_encrypt`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>38

Controla a criptografia dos dados do log de revisão para tabelas criptografadas usando o recurso de criptografia de dados em repouso `InnoDB` [(innodb-data-encryption.html "17.13 InnoDB Data-at-Rest Encryption")]. A criptografia dos dados do log de revisão é desativada por padrão. Para mais informações, consulte Criptografia de Log de Revisão.

* `innodb_replication_delay`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>39

O atraso do fio de replicação em milissegundos em um servidor replica se o `innodb_thread_concurrency` for atingido.

* `innodb_rollback_on_timeout`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>40

`InnoDB` [reverte](glossary.html#glos_rollback "rollback") apenas a última declaração em um timeout de transação por padrão. Se `--innodb-rollback-on-timeout` for especificado, um timeout de transação faz com que `InnoDB` interrompa e requeira a transação inteira.

Para mais informações, consulte a Seção 17.21.5, “Tratamento de Erros InnoDB”.

* `innodb_rollback_segments`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>41

`innodb_rollback_segments` define o número de segmentos de recuo alocados para cada espaço de tabelas de desfazer e o espaço de tabelas temporárias global para transações que geram registros de desfazer. O número de transações que cada segmento de recuo suporta depende do tamanho da página `InnoDB` e do número de registros de desfazer atribuídos a cada transação. Para mais informações, consulte a Seção 17.6.6, “Registros de desfazer”.

Para informações relacionadas, consulte a Seção 17.3, “InnoDB Multi-Versioning”. Para informações sobre espaços de tabela de desfazer, consulte a Seção 17.6.3.4, “Espaços de tabela de desfazer”.

* `innodb_saved_page_number_debug`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>42

Salva um número de página. Definir a opção `innodb_fil_make_page_dirty_debug` suja a página definida por `innodb_saved_page_number_debug`. A opção `innodb_saved_page_number_debug` só está disponível se o suporte de depuração estiver compilado usando a opção `WITH_DEBUG` **CMake**.

* `innodb_segment_reserve_factor`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>43

Define a porcentagem de páginas de segmento de arquivo de espaço de tabela reservadas como páginas vazias. O ajuste é aplicável a arquivos por tabela e espaços de tabela gerais. O ajuste `innodb_segment_reserve_factor` padrão é de 12,5%, que é a mesma porcentagem de páginas reservadas em versões anteriores do MySQL.

Para mais informações, consulte Configurando a porcentagem de páginas de segmento de arquivo reservado.

* `innodb_sort_buffer_size`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>44

Esta variável define:

+ O tamanho do buffer de ordenação para operações DDL online que criam ou reconstruem índices secundários. No entanto, a partir do MySQL 8.0.27, essa responsabilidade é suportada pela variável `innodb_ddl_buffer_size`.

+ O valor pelo qual o arquivo de registro temporário é estendido ao registrar DML concorrente durante uma operação de DDL online, e o tamanho do buffer de leitura e escrita do arquivo de registro temporário.

Para informações relacionadas, consulte a Seção 17.12.3, “Requisitos de Espaço DDL Online”.

* `innodb_spin_wait_delay`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>45

O atraso máximo entre as pesquisas para um bloqueio de rotação. A implementação de nível baixo deste mecanismo varia dependendo da combinação de hardware e sistema operacional, portanto, o atraso não corresponde a um intervalo de tempo fixo.

Pode ser usado em combinação com a variável `innodb_spin_wait_pause_multiplier` para maior controle sobre a duração dos atrasos de verificação de spin-lock.

Para mais informações, consulte a Seção 17.8.8, “Configurando a Pesquisa de Bloqueio Spin”.

* `innodb_spin_wait_pause_multiplier`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>46

Define um valor de multiplicador usado para determinar o número de instruções PAUSE em loops de espera de rotação que ocorrem quando um thread espera para adquirir um mutex ou bloqueio de leitura/escrita.

Para mais informações, consulte a Seção 17.8.8, “Configurando a Pesquisa de Bloqueio Spin”.

* `innodb_stats_auto_recalc`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>47

Faz com que `InnoDB` recálcule automaticamente [estatísticas persistentes](glossary.html#glos_persistent_statistics "persistent statistics") após as alterações substanciais nos dados de uma tabela. O valor limite é de 10% das linhas da tabela. Esta configuração aplica-se a tabelas criadas quando a opção `innodb_stats_persistent` está habilitada. A recálculo automático das estatísticas também pode ser configurado especificando `STATS_AUTO_RECALC=1` em uma declaração de `CREATE TABLE` ou `ALTER TABLE`. A quantidade de dados amostrados para produzir as estatísticas é controlada pela variável `innodb_stats_persistent_sample_pages`.

Para mais informações, consulte a Seção 17.8.10.1, “Configurando Parâmetros de Estatísticas de Optimizer Persistente”.

* `innodb_stats_include_delete_marked`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>48

Por padrão, `InnoDB` lê dados não comprometidos ao calcular estatísticas. No caso de uma transação não comprometida que exclui linhas de uma tabela, `InnoDB` exclui registros que estão marcados para exclusão ao calcular estimativas de linha e estatísticas de índice, o que pode levar a planos de execução não ótimos para outras transações que operam na tabela simultaneamente usando um nível de isolamento de transação diferente de `READ UNCOMMITTED`. Para evitar esse cenário, `innodb_stats_include_delete_marked` pode ser habilitado para garantir que `InnoDB` inclua registros marcados para exclusão ao calcular estatísticas de otimizador persistente.

Quando `innodb_stats_include_delete_marked` está habilitado, `ANALYZE TABLE` considera os registros marcados para exclusão ao recalcular as estatísticas.

`innodb_stats_include_delete_marked` é um ajuste global que afeta todas as tabelas `InnoDB`. É aplicável apenas a estatísticas de otimizador persistentes.

Para informações relacionadas, consulte a Seção 17.8.10.1, “Configurando Parâmetros de Estatísticas de Optimizer Persistente”.

* `innodb_stats_method`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>49

Como o servidor trata os valores de `NULL` ao coletar estatísticas sobre a distribuição dos valores do índice para as tabelas de `InnoDB`. Os valores permitidos são `nulls_equal`, `nulls_unequal` e `nulls_ignored`. Para `nulls_equal`, todos os valores de índice de `NULL` são considerados iguais e formam um único grupo de tamanho igual ao número de valores de `NULL`. Para `nulls_unequal`, os valores de `NULL` são considerados desiguais, e cada `NULL` forma um grupo de tamanho distinto

1. Para `nulls_ignored`, os valores de `NULL` são ignorados.

O método usado para gerar estatísticas de tabela influencia a forma como o otimizador escolhe índices para a execução de consultas, conforme descrito na Seção 10.3.8, "Coleta de Estatísticas de Índices de InnoDB e MyISAM".

* `innodb_stats_on_metadata`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>50

Esta opção só se aplica quando as estatísticas do otimizador são configuradas para não serem persistentes. As estatísticas do otimizador não são armazenadas em disco quando o `innodb_stats_persistent` é desativado ou quando tabelas individuais são criadas ou alteradas com o `STATS_PERSISTENT=0`. Para mais informações, consulte a Seção 17.8.10.2, “Configurando Parâmetros de Estatísticas de Otimizador Não Persistente”.

Quando `innodb_stats_on_metadata` está habilitado, `InnoDB` atualiza estatísticas não persistentes quando declarações de metadados, como [`SHOW TABLE STATUS`](show-table-status.html "15.7.7.38 SHOW TABLE STATUS Statement") ou ao acessar as tabelas do Esquema de Informação `TABLES` ou `STATISTICS`, são feitas. (Essas atualizações são semelhantes ao que acontece para [`ANALYZE TABLE`](analyze-table.html "15.7.3.1 ANALYZE TABLE Statement").) Quando desabilitado, `InnoDB` não atualiza estatísticas durante essas operações. Deixar a configuração desativada pode melhorar a velocidade de acesso para esquemas que têm um grande número de tabelas ou índices. Também pode melhorar a estabilidade dos [planos de execução](glossary.html#glos_query_execution_plan "query execution plan") para consultas que envolvem tabelas de `InnoDB`.

Para alterar o ajuste, emita a declaração `SET GLOBAL innodb_stats_on_metadata=mode`, onde `mode` é `ON` ou `OFF` (ou `1` ou `0`). Alterar o ajuste requer privilégios suficientes para definir variáveis de sistema global (consulte Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”) e afeta imediatamente o funcionamento de todas as conexões.

* `innodb_stats_persistent`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>51

Especifica se as estatísticas de índice `InnoDB` são persistidas no disco. Caso contrário, as estatísticas podem ser recalculadas frequentemente, o que pode levar a variações nos planos de execução da consulta (glossary.html#glos_query_execution_plan "query execution plan"). Esta configuração é armazenada em cada tabela quando a tabela é criada. Você pode definir `innodb_stats_persistent` no nível global antes de criar uma tabela, ou usar a cláusula `STATS_PERSISTENT` das declarações `CREATE TABLE` e `ALTER TABLE` para sobrepor a configuração de nível global e configurar estatísticas persistentes para tabelas individuais.

Para mais informações, consulte a Seção 17.8.10.1, “Configurando Parâmetros de Estatísticas de Optimizer Persistente”.

* `innodb_stats_persistent_sample_pages`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>52

O número de páginas de índice a serem amostradas ao estimar a cardinalidade e outras estatísticas para uma coluna indexada, como as calculadas por `ANALYZE TABLE`. Aumentar o valor melhora a precisão das estatísticas do índice, o que pode melhorar o [plano de execução de consulta][(glossary.html#glos_query_execution_plan "query execution plan")], às custas do aumento do I/O durante a execução de `ANALYZE TABLE` para uma tabela `InnoDB`. Para mais informações, consulte a Seção 17.8.10.1, “Configurando Parâmetros de Estatísticas de Otimizador Persistente”.

Nota

Definir um valor alto para `innodb_stats_persistent_sample_pages` pode resultar em um tempo de execução `ANALYZE TABLE` (analyze-table.html "15.7.3.1 ANALYZE TABLE Statement") longo. Para estimar o número de páginas de banco de dados acessadas por `ANALYZE TABLE` (analyze-table.html "15.7.3.1 ANALYZE TABLE Statement"), consulte a Seção 17.8.10.3, “Estimativa da Complexidade da Tabela ANALYZE para Tabelas InnoDB”.

`innodb_stats_persistent_sample_pages` só se aplica quando `innodb_stats_persistent` está habilitado para uma tabela; quando `innodb_stats_persistent` está desativado, `innodb_stats_transient_sample_pages` se aplica em vez disso.

* `innodb_stats_transient_sample_pages`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>53

O número de páginas de índice a serem amostradas ao estimar a cardinalidade e outras estatísticas para uma coluna indexada, como as calculadas por `ANALYZE TABLE`. O valor padrão é 8. Aumentar o valor melhora a precisão das estatísticas do índice, o que pode melhorar o [plano de execução da consulta][(glossary.html#glos_query_execution_plan "query execution plan")], às custas do aumento do I/O ao abrir uma tabela `InnoDB` ou recalcular as estatísticas. Para mais informações, consulte a Seção 17.8.10.2, “Configurando Parâmetros de Estatísticas de Otimizador Não Persistente”.

Nota

Definir um valor alto para `innodb_stats_transient_sample_pages` pode resultar em um tempo de execução `ANALYZE TABLE` (analyze-table.html "15.7.3.1 ANALYZE TABLE Statement") longo. Para estimar o número de páginas de banco de dados acessadas por `ANALYZE TABLE` (analyze-table.html "15.7.3.1 ANALYZE TABLE Statement"), consulte a Seção 17.8.10.3, “Estimativa da Complexidade da Tabela ANALYZE para Tabelas InnoDB”.

`innodb_stats_transient_sample_pages` só se aplica quando `innodb_stats_persistent` está desativado para uma tabela; quando `innodb_stats_persistent` está habilitado, `innodb_stats_persistent_sample_pages` se aplica em vez disso. Toma o lugar de `innodb_stats_sample_pages`. Para mais informações, consulte a Seção 17.8.10.2, “Configurando Parâmetros de Estatísticas de Otimizador Não Persistente”.

* `innodb_status_output`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>54

Habilita ou desabilita a saída periódica para o monitor padrão `InnoDB`. Também utilizado em combinação com `innodb_status_output_locks` para habilitar ou desabilitar a saída periódica para o monitor de bloqueio `InnoDB`. Para mais informações, consulte a Seção 17.17.2, “Habilitando monitores InnoDB”.

* `innodb_status_output_locks`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>55

Habilita ou desabilita o Monitor de bloqueio `InnoDB`. Quando habilitado, o Monitor de bloqueio `InnoDB` imprime informações adicionais sobre os bloqueios nos `SHOW ENGINE INNODB STATUS` de saída e na saída periódica impressa no log de erro do MySQL. A saída periódica para o Monitor de bloqueio `InnoDB` é impressa como parte da saída padrão do Monitor `InnoDB`. Portanto, o Monitor padrão `InnoDB` deve ser habilitado para que o Monitor de bloqueio `InnoDB` imprima dados no log de erro do MySQL periodicamente. Para mais informações, consulte a Seção 17.17.2, “Habilitando monitores InnoDB”.

* `innodb_strict_mode`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>56

Quando o `innodb_strict_mode` está habilitado, o `InnoDB` retorna erros em vez de avisos ao verificar opções de tabela inválidas ou incompatíveis.

Verifica se as opções `KEY_BLOCK_SIZE`, `ROW_FORMAT`, `DATA DIRECTORY`, `TEMPORARY` e `TABLESPACE` são compatíveis entre si e com outras configurações.

`innodb_strict_mode=ON` também permite uma verificação do tamanho da linha ao criar ou alterar uma tabela, para evitar que `INSERT` ou `UPDATE` falhem devido ao registro ser muito grande para o tamanho de página selecionado.

Você pode habilitar ou desabilitar `innodb_strict_mode` na linha de comando ao iniciar `mysqld`, ou em um arquivo de configuração MySQL [(glossary.html#glos_configuration_file "configuration file")]. Você também pode habilitar ou desabilitar `innodb_strict_mode` em tempo real com a declaração `SET [GLOBAL|SESSION] innodb_strict_mode=mode`, onde `mode` é `ON` ou `OFF`. Alterar o ajuste de `GLOBAL` requer privilégios suficientes para definir variáveis de sistema globais (consulte Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”) e afeta o funcionamento de todos os clientes que se conectam posteriormente. Qualquer cliente pode alterar o ajuste de `SESSION` para `innodb_strict_mode`, e o ajuste afeta apenas esse cliente.

A partir do MySQL 8.0.26, definir o valor da sessão desta variável do sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios da Variável do Sistema”.

* `innodb_sync_array_size`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>57

Define o tamanho do array de espera do mutex/bloqueio. Aumentar o valor divide a estrutura de dados interna usada para coordenar os threads, para maior concorrência em cargas de trabalho com um grande número de threads em espera. Este ajuste deve ser configurado quando a instância do MySQL está sendo iniciada e não pode ser alterado posteriormente. O aumento do valor é recomendado para cargas de trabalho que frequentemente produzem um grande número de threads em espera, tipicamente maior que 768.

* `innodb_sync_spin_loops`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>58

O número de vezes que um fio espera que um `InnoDB` mutex seja liberado antes de o fio ser suspenso.

* `innodb_sync_debug`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>59

Permite a verificação de sincronização de depuração para o motor de armazenamento `InnoDB`. Esta opção só está disponível se o suporte de depuração for compilado usando a opção `WITH_DEBUG` **CMake**.

* `innodb_table_locks`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>60

Se `autocommit = 0`, `InnoDB` honra [`LOCK TABLES`](lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements"); o MySQL não retorna de `LOCK TABLES ... WRITE` até que todos os outros threads tenham liberado todos os seus bloqueios para a tabela. O valor padrão de `innodb_table_locks` é 1, o que significa que `LOCK TABLES` faz com que o InnoDB bloqueie uma tabela internamente se `autocommit = 0`.

`innodb_table_locks = 0` não tem efeito para tabelas bloqueadas explicitamente com [`LOCK TABLES ... WRITE`](lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements"). Tem efeito para tabelas bloqueadas para leitura ou escrita por [`LOCK TABLES ... WRITE`](lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements") implicitamente (por exemplo, através de gatilhos) ou por [`LOCK TABLES ... READ`](lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements").

Para informações relacionadas, consulte a Seção 17.7, “Bloqueio e Modelo de Transação InnoDB”.

* `innodb_temp_data_file_path`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>61

Define o caminho relativo, nome, tamanho e atributos dos arquivos de dados do espaço de tabela temporário global. O espaço de tabela temporário global armazena segmentos de rollback para as alterações feitas em tabelas temporárias criadas pelo usuário.

Se não for especificado nenhum valor para `innodb_temp_data_file_path`, o comportamento padrão é criar um único arquivo de dados auto-extensibile chamado `ibtmp1` no diretório `innodb_data_home_dir`. O tamanho inicial do arquivo é ligeiramente maior que 12 MB.

A sintaxe para uma especificação de arquivo de dados de espaço de tabela temporário global inclui o nome do arquivo, o tamanho do arquivo e os atributos `autoextend` e `max`:

  ```
  file_name:file_size[:autoextend[:max:max_file_size]]
  ```

O arquivo de dados do espaço de tabela temporário global não pode ter o mesmo nome que outro arquivo de dados do `InnoDB`. Qualquer incapacidade ou erro na criação do arquivo de dados do espaço de tabela temporário global é tratado como fatal e o início do servidor é negado.

Os tamanhos dos arquivos são especificados em KB, MB ou GB, anexando `K`, `M` ou `G` ao valor do tamanho. A soma dos tamanhos dos arquivos deve ser ligeiramente maior que 12 MB.

O limite de tamanho dos arquivos individuais é determinado pelo sistema operacional. O tamanho do arquivo pode ser maior que 4 GB em sistemas operacionais que suportam arquivos grandes. O uso de partições de disco bruto para arquivos de dados do espaço de tabela temporário global não é suportado.

Os atributos `autoextend` e `max` podem ser usados apenas para o arquivo de dados especificado na última posição do ajuste `innodb_temp_data_file_path`. Por exemplo:

  ```
  [mysqld]
  innodb_temp_data_file_path=ibtmp1:50M;ibtmp2:12M:autoextend:max:500M
  ```

A opção `autoextend` faz com que o arquivo de dados aumente automaticamente em tamanho quando ele fica sem espaço livre. O `autoextend` de incremento é de 64 MB por padrão. Para modificar o incremento, altere o ajuste da variável `innodb_autoextend_increment`.

O caminho do diretório para os arquivos de dados do espaço de tabela temporário global é formado pela concatenação dos caminhos definidos por `innodb_data_home_dir` e `innodb_temp_data_file_path`.

Antes de executar `InnoDB` no modo de leitura somente, defina `innodb_temp_data_file_path` em um local fora do diretório de dados. O caminho deve ser relativo ao diretório de dados. Por exemplo:

  ```
  --innodb-temp-data-file-path=../../../tmp/ibtmp1:12M:autoextend
  ```

Para mais informações, consulte a seção Espaço de tabela temporário global.

* `innodb_temp_tablespaces_dir`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>62

Define a localização onde `InnoDB` cria um conjunto de espaços temporários de tabelas de sessão no início. O local padrão é o diretório `#innodb_temp` no diretório de dados. É permitido um caminho totalmente qualificado ou um caminho relativo ao diretório de dados.

A partir do MySQL 8.0.16, os espaços temporários de tabelas de sessão armazenam sempre tabelas temporárias criadas pelo usuário e tabelas temporárias internas criadas pelo otimizador usando `InnoDB`. (Anteriormente, o mecanismo de armazenamento em disco para tabelas temporárias internas era determinado pela variável de sistema `internal_tmp_disk_storage_engine`, que não é mais suportada. Veja Motor de armazenamento para tabelas temporárias internas em disco.)

Para mais informações, consulte Espaços de tabela temporários de sessão.

* `innodb_thread_concurrency`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>63

Define o número máximo de threads permitidas dentro de `InnoDB`. Um valor de 0 (padrão) é interpretado como concorrência infinita (sem limite). Esta variável é destinada ao ajuste de desempenho em sistemas de alta concorrência.

`InnoDB` tenta manter o número de threads dentro de `InnoDB` menor ou igual ao limite de `innodb_thread_concurrency`. As threads que estão esperando por bloqueios não são contadas no número de threads que estão sendo executadas simultaneamente.

O ajuste correto depende da carga de trabalho e do ambiente de computação. Considere definir essa variável se sua instância MySQL compartilhar recursos de CPU com outras aplicações ou se sua carga de trabalho ou número de usuários concorrentes estiver crescendo. Teste uma gama de valores para determinar o ajuste que oferece o melhor desempenho. `innodb_thread_concurrency` é uma variável dinâmica, que permite experimentar diferentes configurações em um sistema de teste ao vivo. Se uma configuração específica apresentar um desempenho ruim, você pode rapidamente definir `innodb_thread_concurrency` de volta para 0.

Utilize as seguintes diretrizes para ajudar a encontrar e manter um ambiente apropriado:

+ Se o número de threads de usuários concorrentes para uma carga de trabalho for consistentemente pequeno e não afetar o desempenho, defina `innodb_thread_concurrency=0` (sem limite).

+ Se sua carga de trabalho é consistentemente pesada ou ocasionalmente aumenta, defina um valor de `innodb_thread_concurrency` e ajuste até encontrar o número de threads que oferece o melhor desempenho. Por exemplo, suponha que seu sistema tenha tipicamente de 40 a 50 usuários, mas periodicamente o número aumenta para 60, 70 ou mais. Através de testes, você descobre que o desempenho permanece em grande parte estável com um limite de 80 usuários simultâneos. Neste caso, defina `innodb_thread_concurrency` para 80.

+ Se você não quiser que `InnoDB` use mais de um certo número de CPUs virtuais para os threads do usuário (20 CPUs virtuais, por exemplo), defina `innodb_thread_concurrency` para esse número (ou possivelmente menor, dependendo dos testes de desempenho). Se o seu objetivo é isolar o MySQL de outras aplicações, considere vincular o processo `mysqld` exclusivamente às CPUs virtuais. No entanto, esteja ciente de que a vinculação exclusiva pode resultar em uso de hardware não ótimo se o processo `mysqld` não estiver consistentemente ocupado. Neste caso, você pode vincular o processo `mysqld` às CPUs virtuais, mas permitir que outras aplicações usem algumas ou todas as CPUs virtuais.

Nota

Do ponto de vista do sistema operacional, usar uma solução de gerenciamento de recursos para gerenciar como o tempo da CPU é compartilhado entre aplicativos pode ser preferível ao vincular o processo `mysqld`. Por exemplo, você pode atribuir 90% do tempo de CPU virtual a um aplicativo específico, enquanto outros processos críticos *não* estão em execução, e escalar esse valor de volta para 40% quando outros processos críticos *estão* em execução.

+ Em alguns casos, o ajuste ótimo do `innodb_thread_concurrency` pode ser menor que o número de CPUs virtuais.

+ Um valor de `innodb_thread_concurrency` que é muito alto pode causar regressão de desempenho devido ao aumento da disputa nos recursos e no sistema interno.

+ Monitore e analise seu sistema regularmente. Alterações na carga de trabalho, número de usuários ou ambiente de computação podem exigir que você ajuste o ajuste `innodb_thread_concurrency`.

Um valor de 0 desativa os contadores `queries inside InnoDB` e `queries in queue` na seção `SHOW ENGINE INNODB STATUS` de saída do `ROW OPERATIONS`.

Para informações relacionadas, consulte a Seção 17.8.4, “Configurando Concorrência de Fuso para InnoDB”.

* `innodb_thread_sleep_delay`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>64

Quanto tempo os `InnoDB` permanecem dormindo antes de se juntarem à fila do `InnoDB`, em microsegundos. O valor padrão é 10000. Um valor de 0 desativa o sono. Você pode definir o `innodb_adaptive_max_sleep_delay` para o valor mais alto que você permitiria para o `innodb_thread_sleep_delay`, e o `InnoDB` ajusta automaticamente o `innodb_thread_sleep_delay` para cima ou para baixo, dependendo da atividade atual de escalonamento de threads. Esse ajuste dinâmico ajuda o mecanismo de escalonamento de threads a funcionar de forma suave em momentos em que o sistema está levemente carregado ou quando está operando próximo à capacidade máxima.

Para mais informações, consulte a Seção 17.8.4, “Configurando Concorrência de Fuso para InnoDB”.

* `innodb_tmpdir`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>65

Usado para definir um diretório alternativo para arquivos temporários de classificação criados durante as operações online `ALTER TABLE` (alter-table.html "15.1.9 ALTER TABLE Statement") que reconstruem a tabela.

As operações online `ALTER TABLE` que reconstroem a tabela também criam um arquivo de tabela *intermediário* no mesmo diretório que a tabela original. A opção `innodb_tmpdir` não é aplicável a arquivos de tabela intermediários.

Um valor válido é qualquer caminho de diretório, exceto o caminho do diretório de dados do MySQL. Se o valor for NULL (o padrão), os arquivos temporários são criados no diretório temporário do MySQL (`$TMPDIR` em Unix, `%TEMP%` em Windows ou o diretório especificado pela opção de configuração `--tmpdir`). Se um diretório é especificado, a existência do diretório e as permissões são verificadas apenas quando `innodb_tmpdir` é configurado usando uma declaração `SET`. Se um symlink é fornecido em uma string de diretório, o symlink é resolvido e armazenado como um caminho absoluto. O caminho não deve exceder 512 bytes. Uma operação online `ALTER TABLE` reporta um erro se `innodb_tmpdir` for definido para um diretório inválido. `innodb_tmpdir` substitui a configuração do MySQL `tmpdir`, mas apenas para operações online `ALTER TABLE`.

O privilégio `FILE` é necessário para configurar `innodb_tmpdir`.

A opção `innodb_tmpdir` foi introduzida para ajudar a evitar o transbordamento de um diretório de arquivo temporário localizado em um sistema de arquivos `tmpfs`. Tais transbordamentos poderiam ocorrer como resultado de grandes arquivos temporários de classificação criados durante operações de `ALTER TABLE` (alter-table.html "15.1.9 ALTER TABLE Statement") online que reconstruem a tabela.

Em ambientes de replicação, considere apenas replicar o ajuste `innodb_tmpdir` se todos os servidores tiverem o mesmo ambiente de sistema operacional. Caso contrário, replicar o ajuste `innodb_tmpdir` pode resultar em um erro de replicação ao executar operações online `ALTER TABLE` que reconstruem a tabela. Se os ambientes operacionais dos servidores forem diferentes, é recomendável que você configure `innodb_tmpdir` em cada servidor individualmente.

Para mais informações, consulte a Seção 17.12.3, “Requisitos de Espaço DDL Online”. Para informações sobre operações online `ALTER TABLE`(alter-table.html "15.1.9 ALTER TABLE Statement"), consulte a Seção 17.12, “InnoDB e DDL Online”.

* `innodb_trx_purge_view_update_only_debug`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>66

Pausa a limpeza de registros marcados para exclusão enquanto permite que a visualização de limpeza seja atualizada. Esta opção cria artificialmente uma situação em que a visualização de limpeza é atualizada, mas as limpezas ainda não foram realizadas. Esta opção só está disponível se o suporte de depuração for compilado usando a opção `WITH_DEBUG` **CMake**.

* `innodb_trx_rseg_n_slots_debug`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>67

Define uma bandeira de depuração que limita `TRX_RSEG_N_SLOTS` a um valor dado para a função `trx_rsegf_undo_find_free`, que procura slots livres para segmentos do log de desfazer. Esta opção só está disponível se o suporte de depuração for compilado usando a opção **CMake** `WITH_DEBUG`.

* `innodb_undo_directory`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>68

O caminho onde o `InnoDB` cria espaços de tabelas de desfazer. Tipicamente, é usado para colocar espaços de tabelas de desfazer em um dispositivo de armazenamento diferente.

Não há um valor padrão (é NULL). Se a variável `innodb_undo_directory` estiver indefinida, os espaços de tabela de desfazer são criados no diretório de dados.

Os espaços de tabela de desfazer padrão (`innodb_undo_001` e `innodb_undo_002`) criados quando a instância do MySQL é inicializada sempre residem no diretório definido pela variável `innodb_undo_directory`.

As tabelas espaços criadas usando a sintaxe `CREATE UNDO TABLESPACE` são criadas no diretório definido pela variável `innodb_undo_directory` se um caminho diferente não for especificado.

Para mais informações, consulte a Seção 17.6.3.4, “Refazer Espaços de Tabela”.

* `innodb_undo_log_encrypt`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>69

Controla a criptografia dos dados do registro de desfazer para tabelas criptografadas usando o recurso de criptografia de dados em repouso `InnoDB` [(innodb-data-encryption.html "17.13 InnoDB Data-at-Rest Encryption")]. Aplica-se apenas aos registros de desfazer que residem em espaços de tabelas de desfazer separados (glossary.html#glos_undo_tablespace "undo tablespace"). Veja a Seção 17.6.3.4, “Espaços de tabelas de desfazer”. A criptografia não é suportada para dados de registro de desfazer que residem no espaço de tabelas do sistema. Para mais informações, consulte Criptografia de registro de desfazer.

* `innodb_undo_log_truncate`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>70

Quando habilitado, os tablespaces que excedem o valor limite definido por `innodb_max_undo_log_size` são marcados para truncação. Apenas os tablespaces de desfazer podem ser truncados. Não é possível realizar a truncação de logs de desfazer que residem no tablespace de sistema. Para que a truncagem ocorra, deve haver pelo menos dois tablespaces de desfazer.

A variável `innodb_purge_rseg_truncate_frequency` pode ser usada para acelerar o truncamento de espaços de tabela de desfazer.

Para mais informações, consulte o artigo "Truncar espaços de tabela Undo".

* `innodb_undo_tablespaces`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>71

Define o número de espaços de tabela de desfazer usados por `InnoDB`. O valor padrão e mínimo é 2.

Nota

A variável `innodb_undo_tablespaces` é desatualizada e não é mais configurável a partir do MySQL 8.0.14. Espere que ela seja removida em uma versão futura.

Para mais informações, consulte a Seção 17.6.3.4, “Refazer Espaços de Tabela”.

* `innodb_use_fdatasync`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>72

Em plataformas que suportam as chamadas de sistema `fdatasync()`, habilitar a variável `innodb_use_fdatasync` permite o uso de `fdatasync()` em vez das chamadas de sistema `fsync()` para limpezas do sistema operacional. Uma chamada `fdatasync()` não limpa as alterações no metadados do arquivo, a menos que seja necessário para a recuperação subsequente de dados, proporcionando um benefício potencial de desempenho.

Um subconjunto dos `innodb_flush_method` de configurações, como `fsync`, `O_DSYNC` e `O_DIRECT`, utiliza `fsync()` chamadas de sistema. A variável `innodb_use_fdatasync` é aplicável ao usar essas configurações.

* `innodb_use_native_aio`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>73

Especifica se o subsistema de E/S assíncrono deve ser usado. Essa variável não pode ser alterada enquanto o servidor estiver em execução. Normalmente, você não precisa configurar essa opção, porque ela é habilitada por padrão.

Essa funcionalidade melhora a escalabilidade de sistemas fortemente dependentes de I/O, que geralmente apresentam muitos leitores/escritores pendentes na saída do `SHOW ENGINE INNODB STATUS`.

Executar com um grande número de threads de E/S `InnoDB` e, especialmente, executar várias instâncias dessas no mesmo servidor pode exceder os limites de capacidade nos sistemas Linux. Nesse caso, você pode receber o seguinte erro:

  ```
  EAGAIN: The specified maxevents exceeds the user's limit of available events.
  ```

Você pode, normalmente, resolver esse erro escrevendo um limite maior para `/proc/sys/fs/aio-max-nr`.

No entanto, se um problema com o subsistema de E/S assíncrona no SO impedir que o `InnoDB` seja iniciado, você pode iniciar o servidor com o `innodb_use_native_aio=0`. Esta opção também pode ser desativada automaticamente durante o arranque se o `InnoDB` detectar um problema potencial, como uma combinação de localização do `tmpdir`, sistema de arquivos do `tmpfs` e kernel Linux que não suporta AIO no `tmpfs`.

Para mais informações, consulte a Seção 17.8.6, “Usando I/O assíncrono no Linux”.

* `innodb_validate_tablespace_paths`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>74

Validação do caminho do arquivo do tablespace. Ao iniciar, `InnoDB` valida os caminhos dos arquivos de tablespace conhecidos contra os caminhos dos arquivos de tablespace armazenados no dicionário de dados, no caso de os arquivos de tablespace terem sido movidos para um local diferente. A variável `innodb_validate_tablespace_paths` permite desabilitar a validação do caminho do tablespace. Este recurso é destinado a ambientes onde os arquivos de tablespace não são movidos. A desativação da validação do caminho melhora o tempo de inicialização em sistemas com um grande número de arquivos de tablespace.

Aviso

Iniciar o servidor com a validação do caminho do espaço de tabela desativada após a movimentação dos arquivos do espaço de tabela pode levar a comportamento indefinido.

Para mais informações, consulte a Seção 17.6.3.7, “Desabilitando a validação do caminho do tablespace”.

* `innodb_version`

O número de versão `InnoDB`. No MySQL 8.0, a numeração de versão separada para `InnoDB` não se aplica e este valor é o mesmo que o número `version` do servidor.

* `innodb_write_io_threads`

  <table frame="box" rules="all" summary="Properties for innodb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--innodb[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>FORCE</code></p></td> </tr></tbody></table>75

O número de threads de E/S para operações de escrita em `InnoDB`. O valor padrão é 4. Sua contraparte para threads de leitura é `innodb_read_io_threads`. Para mais informações, consulte a Seção 17.8.5, “Configurando o Número de Threads de E/S de InnoDB de Fundo”. Para conselhos gerais sobre o ajuste de E/S, consulte a Seção 10.5.8, “Otimizando o E/S de Disco do InnoDB”.

Nota

Nos sistemas Linux, executar vários servidores MySQL (tipicamente mais de 12) com configurações padrão para `innodb_read_io_threads`, `innodb_write_io_threads` e a configuração Linux `aio-max-nr` pode exceder os limites do sistema. Idealmente, aumente a configuração `aio-max-nr`; como uma solução alternativa, você pode reduzir as configurações de uma ou ambas as variáveis MySQL.

Considere também o valor de `sync_binlog`, que controla a sincronização do log binário com o disco.

Para obter conselhos gerais sobre o ajuste de E/S, consulte a Seção 10.5.8, “Otimizando o E/S do disco InnoDB”.