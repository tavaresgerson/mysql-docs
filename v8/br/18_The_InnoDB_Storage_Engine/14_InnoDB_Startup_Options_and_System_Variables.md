## 17.14 Opções de inicialização do InnoDB e variáveis do sistema

- Opções de inicialização do InnoDB

- Variáveis de sistema do InnoDB

- As variáveis do sistema que são verdadeiras ou falsas podem ser habilitadas na inicialização do servidor ao nomeá-las ou desabilitadas usando o prefixo `--skip-`. Por exemplo, para habilitar ou desabilitar o índice de hash adaptativo `InnoDB`, você pode usar `--innodb-adaptive-hash-index` ou `--skip-innodb-adaptive-hash-index` na linha de comando ou `innodb_adaptive_hash_index` ou `skip_innodb_adaptive_hash_index` em um arquivo de opção.

- Algumas descrições de variáveis referem-se a “ativar” ou “desativar” uma variável. Essas variáveis podem ser ativadas com a instrução `SET` definindo-as para `ON` ou `1`, ou desativadas definindo-as para `OFF` ou `0`. As variáveis booleanas podem ser definidas no início para os valores `ON`, `TRUE`, `OFF` e `FALSE` (não case-sensitive), bem como `1` e `0`. Veja a Seção 6.2.2.4, “Modificadores de Opção do Programa”.

- As variáveis do sistema que aceitam um valor numérico podem ser especificadas como `--var_name=value` na linha de comando ou como `var_name=value` em arquivos de opções.

- Muitas variáveis do sistema podem ser alteradas em tempo de execução (consulte a Seção 7.1.9.2, “Variáveis de sistema dinâmicas”).

- Para obter informações sobre os modificadores de escopo das variáveis `GLOBAL` e `SESSION`, consulte a documentação da instrução `SET`.

- Algumas opções controlam os locais e o layout dos arquivos de dados `InnoDB`. A Seção 17.8.1, “Configuração de Inicialização do InnoDB”, explica como usar essas opções.

- Algumas opções, que você pode não usar inicialmente, ajudam a ajustar as características de desempenho do `InnoDB` com base na capacidade da máquina e no volume de trabalho do banco de dados.

- Para obter mais informações sobre a especificação de opções e variáveis do sistema, consulte a Seção 6.2.2, “Especificação de Opções do Programa”.

**Tabela 17.24 Opção e Referência de Variável InnoDB**

<table summary="Referência para as opções de linha de comando do InnoDB e variáveis do sistema."><thead><tr><th scope="col">Nome</th> <th scope="col">Linha de comando</th> <th scope="col">Arquivo de Opções</th> <th scope="col">Sistema Var</th> <th scope="col">Status Var</th> <th scope="col">Var Scope</th> <th scope="col">Dinâmico</th> </tr></thead><tbody><tr><th>daemon_memcached_enable_binlog</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>daemon_memcached_engine_lib_name</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>daemon_memcached_engine_lib_path</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>daemon_memcached_option</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>daemon_memcached_r_batch_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>daemon_memcached_w_batch_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>checks_de_chave_estrangeira</th> <td></td> <td></td> <td>Sim</td> <td></td> <td>Ambos</td> <td>Sim</td> </tr><tr><th>innodb</th> <td>Sim</td> <td>Sim</td> <td></td> <td></td> <td></td> <td></td> </tr><tr><th>innodb_adaptive_flushing</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_adaptive_flushing_lwm</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_adaptive_hash_index</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_adaptive_hash_index_parts</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_adaptive_max_sleep_delay</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_api_bk_commit_interval</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_api_disable_rowlock</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_api_enable_binlog</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_api_enable_mdl</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_api_trx_level</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_autoextend_increment</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_autoinc_lock_mode</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_background_drop_list_empty</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_buffer_pool_bytes_data</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_buffer_pool_bytes_dirty</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_buffer_pool_chunk_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_buffer_pool_debug</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_buffer_pool_dump_at_shutdown</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_buffer_pool_dump_now</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_buffer_pool_dump_pct</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>Innodb_buffer_pool_dump_status</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_buffer_pool_filename</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_buffer_pool_in_core_file</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_buffer_pool_instances</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_buffer_pool_load_abort</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_buffer_pool_load_at_startup</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_buffer_pool_load_now</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>Innodb_buffer_pool_load_status</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_buffer_pool_pages_data</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_buffer_pool_pages_dirty</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_buffer_pool_pages_flushed</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_buffer_pool_pages_free</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_buffer_pool_pages_latched</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_buffer_pool_pages_misc</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_buffer_pool_pages_total</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_buffer_pool_read_ahead</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_buffer_pool_read_ahead_evicted</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_buffer_pool_read_ahead_rnd</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_buffer_pool_read_requests</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_buffer_pool_reads</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_buffer_pool_resize_status</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_buffer_pool_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>Innodb_buffer_pool_wait_free</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_buffer_pool_write_requests</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_change_buffer_max_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_change_buffering</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_change_buffering_debug</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_checkpoint_disabled</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_checksum_algorithm</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_cmp_per_index_enabled</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_commit_concurrency</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_compress_debug</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_compression_failure_threshold_pct</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_compression_level</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_compression_pad_pct_max</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_concurrency_tickets</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_data_file_path</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_data_fsyncs</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_data_home_dir</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_data_pending_fsyncs</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_data_pending_reads</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_data_pending_writes</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_data_read</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_data_reads</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_data_writes</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_data_written</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_dblwr_pages_written</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_dblwr_writes</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_ddl_buffer_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Sessão</td> <td>Sim</td> </tr><tr><th>innodb_ddl_log_crash_reset_debug</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_ddl_threads</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Sessão</td> <td>Sim</td> </tr><tr><th>innodb_deadlock_detect</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_dedicated_server</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_default_row_format</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_directories</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_disable_sort_file_cache</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_doublewrite</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Varia</td> </tr><tr><th>innodb_doublewrite_batch_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_doublewrite_dir</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_doublewrite_files</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_doublewrite_pages</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_fast_shutdown</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_fil_make_page_dirty_debug</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_file_per_table</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_fill_factor</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_flush_log_at_timeout</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_flush_log_at_trx_commit</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_flush_method</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_flush_neighbors</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_flush_sync</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_flushing_avg_loops</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_force_load_corrupted</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_force_recovery</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_fsync_threshold</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_ft_aux_table</th> <td></td> <td></td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_ft_cache_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_ft_enable_diag_print</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_ft_enable_stopword</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Ambos</td> <td>Sim</td> </tr><tr><th>innodb_ft_max_token_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_ft_min_token_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_ft_num_word_optimize</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_ft_result_cache_limit</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_ft_server_stopword_table</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_ft_sort_pll_degree</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_ft_total_cache_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_ft_user_stopword_table</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Ambos</td> <td>Sim</td> </tr><tr><th>Innodb_have_atomic_builtins</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_idle_flush_pct</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_io_capacity</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_io_capacity_max</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_limit_optimistic_insert_debug</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_lock_wait_timeout</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Ambos</td> <td>Sim</td> </tr><tr><th>innodb_log_buffer_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Varia</td> </tr><tr><th>innodb_log_checkpoint_fuzzy_now</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_log_checkpoint_now</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_log_checksums</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_log_compressed_pages</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_log_file_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_log_files_in_group</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_log_group_home_dir</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_log_spin_cpu_abs_lwm</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_log_spin_cpu_pct_hwm</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_log_wait_for_flush_spin_hwm</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>Innodb_log_waits</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_log_write_ahead_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>Innodb_log_write_requests</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_log_writer_threads</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>Innodb_log_writes</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_lru_scan_depth</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_max_dirty_pages_pct</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_max_dirty_pages_pct_lwm</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_max_purge_lag</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_max_purge_lag_delay</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_max_undo_log_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_merge_threshold_set_all_debug</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_monitor_disable</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_monitor_enable</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_monitor_reset</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_monitor_reset_all</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>Innodb_num_open_files</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_numa_interleave</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_old_blocks_pct</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_old_blocks_time</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_online_alter_log_max_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_open_files</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Varia</td> </tr><tr><th>innodb_optimize_fulltext_only</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>Innodb_os_log_fsyncs</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_os_log_pending_fsyncs</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_os_log_pending_writes</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_os_log_written</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_page_cleaners</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_page_size</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_page_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_pages_created</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_pages_read</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_pages_written</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_parallel_read_threads</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Sessão</td> <td>Sim</td> </tr><tr><th>innodb_print_all_deadlocks</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_print_ddl_logs</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_purge_batch_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_purge_rseg_truncate_frequency</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_purge_threads</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_random_read_ahead</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_read_ahead_threshold</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_read_io_threads</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_read_only</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_redo_log_archive_dirs</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_redo_log_capacity</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_redo_log_capacity_resized</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_redo_log_checkpoint_lsn</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_redo_log_current_lsn</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_redo_log_enabled</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_redo_log_encrypt</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>Innodb_redo_log_flushed_to_disk_lsn</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_redo_log_logical_size</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_redo_log_physical_size</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_redo_log_read_only</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_redo_log_resize_status</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_redo_log_uuid</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_replication_delay</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_rollback_on_timeout</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_rollback_segments</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>Innodb_row_lock_current_waits</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_row_lock_time</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_row_lock_time_avg</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_row_lock_time_max</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_row_lock_waits</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_rows_deleted</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_rows_inserted</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_rows_read</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_rows_updated</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_saved_page_number_debug</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_segment_reserve_factor</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_sort_buffer_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_spin_wait_delay</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_spin_wait_pause_multiplier</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_stats_auto_recalc</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_stats_include_delete_marked</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_stats_method</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_stats_on_metadata</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_stats_persistent</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_stats_persistent_sample_pages</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_stats_transient_sample_pages</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb-status-file</th> <td>Sim</td> <td>Sim</td> <td></td> <td></td> <td></td> <td></td> </tr><tr><th>innodb_status_output</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_status_output_locks</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_strict_mode</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Ambos</td> <td>Sim</td> </tr><tr><th>innodb_sync_array_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_sync_debug</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_sync_spin_loops</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>Innodb_system_rows_deleted</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_system_rows_inserted</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_system_rows_read</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_system_rows_updated</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_table_locks</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Ambos</td> <td>Sim</td> </tr><tr><th>innodb_temp_data_file_path</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_temp_tablespaces_dir</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_thread_concurrency</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_thread_sleep_delay</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_tmpdir</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Ambos</td> <td>Sim</td> </tr><tr><th>Innodb_truncated_status_writes</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_trx_purge_view_update_only_debug</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_trx_rseg_n_slots_debug</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_undo_directory</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_undo_log_encrypt</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_undo_log_truncate</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_undo_tablespaces</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Varia</td> </tr><tr><th>Innodb_undo_tablespaces_active</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_undo_tablespaces_explicit</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_undo_tablespaces_implicit</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Innodb_undo_tablespaces_total</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_use_fdatasync</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>innodb_use_native_aio</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_validate_tablespace_paths</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_version</th> <td></td> <td></td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>innodb_write_io_threads</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>checks únicos</th> <td></td> <td></td> <td>Sim</td> <td></td> <td>Ambos</td> <td>Sim</td> </tr></tbody></table>

### Opções de inicialização do InnoDB

- `--innodb[=value]`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  Controla o carregamento do motor de armazenamento `InnoDB`, se o servidor foi compilado com suporte ao `InnoDB`. Esta opção tem um formato triestado, com valores possíveis de `OFF`, `ON` ou `FORCE`. Veja a Seção 7.6.1, “Instalando e Desinstalando Plugins”.

  Para desabilitar `InnoDB`, use `--innodb=OFF` ou `--skip-innodb`. Nesse caso, como o motor de armazenamento padrão é `InnoDB`, o servidor não inicia a menos que você também use `--default-storage-engine` e `--default-tmp-storage-engine` para definir o padrão para algum outro motor tanto para tabelas permanentes quanto para `TEMPORARY`.

  O mecanismo de armazenamento `InnoDB` não pode mais ser desativado, e as opções `--innodb=OFF` e `--skip-innodb` estão desatualizadas e não têm efeito. Seu uso resulta em um aviso. Espere que essas opções sejam removidas em uma futura versão do MySQL.

- `--innodb-dedicated-server`

  <table summary="Propriedades para servidor dedicado innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb-dedicated-server[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>innodb_dedicated_server</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

  Quando essa opção é definida ao iniciar o servidor com `--innodb-dedicated-server` ou `--innodb-dedicated-server=ON`, seja na linha de comando ou em um arquivo `my.cnf`, o `InnoDB` calcula e define automaticamente os valores das seguintes variáveis:

  - `innodb_buffer_pool_size`

  - `innodb_redo_log_capacity` ou, antes do MySQL 8.0.30, `innodb_log_file_size` e `innodb_log_files_in_group`.

  - `innodb_flush_method`

  Nota

  `innodb_log_file_size` e `innodb_log_files_in_group` são desaconselhados no MySQL 8.0.30. Essas variáveis são substituídas por `innodb_redo_log_capacity`. Veja a Seção 17.6.5, “Registro de Refazer”.

  Você deve considerar o uso de `--innodb-dedicated-server` apenas se a instância do MySQL estiver em um servidor dedicado, onde ela possa usar todos os recursos do sistema disponíveis. Não é recomendado usar essa opção se a instância do MySQL compartilhar recursos do sistema com outras aplicações.

  É altamente recomendável que você leia a Seção 17.8.12, “Habilitar a Configuração Automática do InnoDB para um Servidor MySQL Dedicado”, antes de usar essa opção em produção.

- `--innodb-status-file`

  <table summary="Propriedades para o arquivo de status innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb-status-file[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

  A opção de inicialização `--innodb-status-file` controla se `InnoDB` cria um arquivo chamado `innodb_status.pid` no diretório de dados e escreve o `SHOW ENGINE INNODB STATUS` de saída nele a cada 15 segundos, aproximadamente.

  O arquivo `innodb_status.pid` não é criado por padrão. Para criá-lo, inicie o **mysqld** com a opção `--innodb-status-file`. `InnoDB` remove o arquivo quando o servidor é desligado normalmente. Se ocorrer um desligamento anormal, o arquivo de status pode precisar ser removido manualmente.

  A opção `--innodb-status-file` é destinada ao uso temporário, pois a geração de saída `SHOW ENGINE INNODB STATUS` pode afetar o desempenho, e o arquivo `innodb_status.pid` pode se tornar bastante grande com o tempo.

  Para obter informações relacionadas, consulte a Seção 17.17.2, “Habilitar monitores InnoDB”.

- `--skip-innodb`

  Desative o mecanismo de armazenamento `InnoDB`. Veja a descrição de `--innodb`.

### Variáveis de sistema do InnoDB

- `daemon_memcached_enable_binlog`

  <table summary="Propriedades para daemon_memcached_enable_binlog"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-enable-binlog[={OFF|ON}]</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_enable_binlog</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

  Ative esta opção no servidor de origem para usar o plugin `InnoDB` **memcached** (`daemon_memcached`) com o log binário do MySQL. Esta opção só pode ser definida durante o início do servidor. Você também deve habilitar o log binário do MySQL no servidor de origem usando a opção `--log-bin`.

  Para obter mais informações, consulte a Seção 17.20.7, “O Plugin InnoDB memcached e a Replicação”.

- `daemon_memcached_engine_lib_name`

  <table summary="Propriedades para daemon_memcached_engine_lib_name"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-engine-lib-name=file_name</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_engine_lib_name</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>innodb_engine.so</code>]]</td> </tr></tbody></table>

  Especifica a biblioteca compartilhada que implementa o plugin `InnoDB` **memcached**.

  Para obter mais informações, consulte a Seção 17.20.3, “Configurando o Plugin InnoDB memcached”.

- `daemon_memcached_engine_lib_path`

  <table summary="Propriedades para daemon_memcached_engine_lib_path"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-engine-lib-path=dir_name</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_engine_lib_path</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>

  O caminho do diretório que contém a biblioteca compartilhada que implementa o plugin `InnoDB` **memcached**. O valor padrão é NULL, representando o diretório do plugin MySQL. Você não deve precisar modificar este parâmetro, a menos que especifique um plugin `memcached` para um motor de armazenamento diferente que esteja localizado fora do diretório do plugin MySQL.

  Para obter mais informações, consulte a Seção 17.20.3, “Configurando o Plugin InnoDB memcached”.

- `daemon_memcached_option`

  <table summary="Propriedades para daemon_memcached_option"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-option=options</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_option</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>

  Usado para passar opções separadas por espaços ao daemon de cache de memória subjacente **memcached** durante o início. Por exemplo, você pode alterar a porta em que o **memcached** escuta, reduzir o número máximo de conexões simultâneas, alterar o tamanho máximo de memória para um par chave-valor ou habilitar mensagens de depuração para o log de erros.

  Consulte a Seção 17.20.3, “Configurando o Plugin InnoDB memcached”, para obter detalhes de uso. Para informações sobre as opções do **memcached**, consulte a página do manual do **memcached**.

- `daemon_memcached_r_batch_size`

  <table summary="Propriedades para daemon_memcached_r_batch_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-r-batch-size=#</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_r_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1073741824</code>]]</td> </tr></tbody></table>

  Especifica quantos **memcached** operações de leitura (operações `get`) devem ser realizadas antes de realizar uma `COMMIT` para iniciar uma nova transação. É o equivalente de `daemon_memcached_w_batch_size`.

  Este valor é definido como 1 por padrão, para que quaisquer alterações feitas na tabela por meio de instruções SQL sejam imediatamente visíveis às operações do **memcached**. Você pode aumentá-lo para reduzir o overhead de comitês frequentes em um sistema onde a tabela subjacente está sendo acessada apenas por meio da interface do **memcached**. Se você definir o valor muito grande, a quantidade de dados de desfazer ou refazer pode impor algum overhead de armazenamento, como em qualquer transação de longa duração.

  Para obter mais informações, consulte a Seção 17.20.3, “Configurando o Plugin InnoDB memcached”.

- `daemon_memcached_w_batch_size`

  <table summary="Propriedades para daemon_memcached_w_batch_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-w-batch-size=#</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_w_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>

  Especifica quantos **memcached** operações de escrita, como `add`, `set` e `incr`, devem ser realizadas antes de realizar uma `COMMIT` para iniciar uma nova transação. É o equivalente a `daemon_memcached_r_batch_size`.

  Este valor é definido como 1 por padrão, assumindo que os dados armazenados são importantes para serem preservados em caso de uma interrupção e devem ser imediatamente comprometidos. Ao armazenar dados não críticos, você pode aumentar esse valor para reduzir o overhead das operações de escrita frequentes; mas, então, as últimas operações de escrita não comprometidas `N`-1 podem ser perdidas se ocorrer uma saída inesperada.

  Para obter mais informações, consulte a Seção 17.20.3, “Configurando o Plugin InnoDB memcached”.

- `innodb_adaptive_flushing`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>0

  Especifica se a taxa de limpeza de páginas sujas no pool de buffers `InnoDB` deve ser ajustada dinamicamente com base na carga de trabalho. Ajuste dinâmico da taxa de limpeza visa evitar picos de atividade de E/S. Esta configuração está habilitada por padrão. Consulte a Seção 17.8.3.5, “Configurando a Limpeza do Pool de Buffers”, para obter mais informações. Para obter conselhos gerais sobre o ajuste de E/S, consulte a Seção 10.5.8, “Otimizando o E/S de Disco do InnoDB”.

- `innodb_adaptive_flushing_lwm`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>1

  Define a marca de água baixa que representa a porcentagem da capacidade do log de refazer para a qual o esvaziamento adaptativo é habilitado. Para mais informações, consulte a Seção 17.8.3.5, “Configurando o esvaziamento do Pool de Buffer”.

- `innodb_adaptive_hash_index`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>2

  Se o índice de hash adaptável `InnoDB` está habilitado ou desabilitado. Pode ser desejável, dependendo da sua carga de trabalho, habilitar ou desabilitar dinamicamente o índice de hash adaptável para melhorar o desempenho das consultas. Como o índice de hash adaptável pode não ser útil para todas as cargas de trabalho, realize benchmarks com ele habilitado e desabilitado, usando cargas de trabalho realistas. Consulte a Seção 17.5.3, “Índice de Hash Adaptável”, para obter detalhes.

  Esta variável está habilitada por padrão. Você pode modificar este parâmetro usando a instrução `SET GLOBAL`, sem precisar reiniciar o servidor. Para alterar o ajuste em tempo de execução, são necessários privilégios suficientes para definir variáveis de sistema globais. Consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”. Você também pode usar `--skip-innodb-adaptive-hash-index` no início do servidor para desabilitá-la.

  Desativar o índice de hash adaptativo esvazia a tabela de hash imediatamente. As operações normais podem continuar enquanto a tabela de hash estiver vazia, e as consultas que estavam usando o acesso à tabela de hash acessam o índice B-trees diretamente. Quando o índice de hash adaptativo é reativado, a tabela de hash é preenchida novamente durante a operação normal.

- `innodb_adaptive_hash_index_parts`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>3

  Divide o sistema de busca de índice de hash adaptativo. Cada índice está vinculado a uma partição específica, com cada partição protegida por um gatilho separado.

  O sistema de busca por índice de hash adaptativo é dividido em 8 partes por padrão. O valor máximo é de 512.

  Para informações relacionadas, consulte a Seção 17.5.3, “Índice Hash Adaptativo”.

- `innodb_adaptive_max_sleep_delay`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>4

  Permite que `InnoDB` ajuste automaticamente o valor de `innodb_thread_sleep_delay` para cima ou para baixo de acordo com a carga de trabalho atual. Qualquer valor não nulo habilita o ajuste dinâmico e automático do valor de `innodb_thread_sleep_delay`, até o valor máximo especificado na opção `innodb_adaptive_max_sleep_delay`. O valor representa o número de microsegundos. Esta opção pode ser útil em sistemas ocupados, com mais de 16 threads `InnoDB`. (Na prática, é mais valiosa para sistemas MySQL com centenas ou milhares de conexões simultâneas.)

  Para obter mais informações, consulte a Seção 17.8.4, “Configurando Concorrência de Fila para InnoDB”.

- `innodb_api_bk_commit_interval`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>5

  Com que frequência você deseja comprometer automaticamente as conexões ociosas que utilizam a interface `InnoDB` **memcached**, em segundos. Para obter mais informações, consulte a Seção 17.20.6.4, “Controlar o comportamento transacional do plugin memcached do InnoDB”.

- `innodb_api_disable_rowlock`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>6

  Use esta opção para desabilitar bloqueios de linha quando o **memcached** com `InnoDB` executa operações DML. Por padrão, o `innodb_api_disable_rowlock` está desativado, o que significa que o **memcached** solicita bloqueios de linha para as operações `get` e `set`. Quando o `innodb_api_disable_rowlock` está ativado, o **memcached** solicita um bloqueio de tabela em vez de bloqueios de linha.

  `innodb_api_disable_rowlock` não é dinâmico. Ele deve ser especificado na linha de comando do **mysqld** ou inserido no arquivo de configuração do MySQL. A configuração entra em vigor quando o plugin é instalado, o que ocorre quando o servidor MySQL é iniciado.

  Para obter mais informações, consulte a Seção 17.20.6.4, “Controlar o comportamento transacional do plugin memcached do InnoDB”.

- `innodb_api_enable_binlog`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>7

  Permite que você use o plugin `InnoDB` **memcached** com o log binário do MySQL. Para obter mais informações, consulte Habilitar o log binário do InnoDB memcached.

- `innodb_api_enable_mdl`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>8

  Bloqueia a tabela usada pelo plugin `InnoDB` **memcached**, para que não possa ser excluída ou alterada por DDL através da interface SQL. Para mais informações, consulte a Seção 17.20.6.4, “Controlar o comportamento transacional do plugin memcached InnoDB”.

- `innodb_api_trx_level`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>9

  Controla o nível de isolamento de transação em consultas processadas pela interface **memcached**. As constantes correspondentes aos nomes familiares são:

  - 0 = `READ UNCOMMITTED`
  - 1 = `READ COMMITTED`
  - 2 = `REPEATABLE READ`
  - 3 = `SERIALIZABLE`

  Para obter mais informações, consulte a Seção 17.20.6.4, “Controlar o comportamento transacional do plugin memcached do InnoDB”.

- `innodb_autoextend_increment`

  <table summary="Propriedades para servidor dedicado innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb-dedicated-server[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>innodb_dedicated_server</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>0

  O tamanho do incremento (em megabytes) para ampliar o tamanho de um arquivo de espaço de tabela de sistema `InnoDB` que se autoexpande quando ele fica cheio. O valor padrão é 64. Para informações relacionadas, consulte Configuração do arquivo de dados do espaço de tabela do sistema e Redimensionamento do espaço de tabela do sistema.

  O ajuste `innodb_autoextend_increment` não afeta os arquivos do espaço de tabela por arquivo ou os arquivos do espaço de tabela em geral. Esses arquivos são auto-extendidos independentemente do ajuste `innodb_autoextend_increment`. As extensões iniciais são em pequenas quantidades, após as quais as extensões ocorrem em incrementos de 4 MB.

- `innodb_autoinc_lock_mode`

  <table summary="Propriedades para servidor dedicado innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb-dedicated-server[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>innodb_dedicated_server</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>1

  O modo de bloqueio a ser usado para gerar valores de autoincremento. Os valores permitidos são 0, 1 ou 2, para tradicional, consecutivo ou entrelaçado, respectivamente.

  O padrão é 2 (interlaçado) a partir do MySQL 8.0 e 1 (consecutivo) antes disso. A mudança para o modo de bloqueio interlaçado como padrão reflete a mudança da replicação baseada em instruções para a replicação baseada em linhas como o tipo de replicação padrão, que ocorreu no MySQL 5.7. A replicação baseada em instruções requer o modo de bloqueio de autoincremento consecutivo para garantir que os valores de autoincremento sejam atribuídos em uma ordem previsível e repetiível para uma sequência específica de instruções SQL, enquanto a replicação baseada em linhas não é sensível à ordem de execução das instruções SQL.

  Para as características de cada modo de bloqueio, consulte Modos de Bloqueio AUTO\_INCREMENT do InnoDB.

- `innodb_background_drop_list_empty`

  <table summary="Propriedades para servidor dedicado innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb-dedicated-server[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>innodb_dedicated_server</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>2

  Ativação da opção de depuração `innodb_background_drop_list_empty` ajuda a evitar falhas nos casos de teste, atrasando a criação da tabela até que a lista de itens em segundo plano esteja vazia. Por exemplo, se o caso de teste A colocar a tabela `t1` na lista de itens em segundo plano, o caso de teste B aguarda até que a lista de itens em segundo plano esteja vazia antes de criar a tabela `t1`.

- `innodb_buffer_pool_chunk_size`

  <table summary="Propriedades para servidor dedicado innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb-dedicated-server[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>innodb_dedicated_server</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>3

  `innodb_buffer_pool_chunk_size` define o tamanho do bloco para as operações de redimensionamento do pool de buffers `InnoDB`.

  Para evitar a cópia de todas as páginas do pool de buffers durante as operações de redimensionamento, a operação é realizada em "pedaços". Por padrão, `innodb_buffer_pool_chunk_size` é de 128 MB (134217728 bytes). O número de páginas contidas em um pedaço depende do valor de `innodb_page_size`. `innodb_buffer_pool_chunk_size` pode ser aumentado ou diminuído em unidades de 1 MB (1048576 bytes).

  As seguintes condições se aplicam ao alterar o valor `innodb_buffer_pool_chunk_size`:

  - Se `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances` for maior que o tamanho atual do pool de buffers quando o pool de buffers é inicializado, `innodb_buffer_pool_chunk_size` é truncado para `innodb_buffer_pool_size` / `innodb_buffer_pool_instances`.

  - O tamanho do pool de tampão deve sempre ser igual a ou múltiplo de `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`. Se você alterar `innodb_buffer_pool_chunk_size`, `innodb_buffer_pool_size` será automaticamente arredondado para um valor que é igual a ou múltiplo de `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`. O ajuste ocorre quando o pool de tampão é inicializado.

  Importante

  É preciso ter cuidado ao alterar `innodb_buffer_pool_chunk_size`, pois alterar esse valor pode aumentar automaticamente o tamanho do pool de buffers. Antes de alterar `innodb_buffer_pool_chunk_size`, calcule seu efeito em `innodb_buffer_pool_size` para garantir que o tamanho do pool de buffers resultante seja aceitável.

  Para evitar possíveis problemas de desempenho, o número de fragmentos (`innodb_buffer_pool_size` / `innodb_buffer_pool_chunk_size`) não deve exceder 1000.

  A variável `innodb_buffer_pool_size` é dinâmica, o que permite redimensionar o pool de buffers enquanto o servidor estiver online. No entanto, o tamanho do pool de buffers deve ser igual ou múltiplo de `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`, e alterar qualquer uma dessas configurações de variável requer o reinício do servidor.

  Consulte a Seção 17.8.3.1, “Configurando o Tamanho do Pool de Armazenamento de Buffer do InnoDB”, para obter mais informações.

- `innodb_buffer_pool_debug`

  <table summary="Propriedades para servidor dedicado innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb-dedicated-server[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>innodb_dedicated_server</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>4

  Ativação desta opção permite múltiplas instâncias do pool de buffers quando o tamanho do pool de buffers é menor que 1 GB, ignorando a restrição de tamanho mínimo do pool de buffers de 1 GB imposta no `innodb_buffer_pool_instances`. A opção `innodb_buffer_pool_debug` está disponível apenas se o suporte de depuração for compilado usando a opção `WITH_DEBUG` **CMake**.

- `innodb_buffer_pool_dump_at_shutdown`

  <table summary="Propriedades para servidor dedicado innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb-dedicated-server[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>innodb_dedicated_server</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>5

  Especifica se as páginas armazenadas no pool de buffers `InnoDB` devem ser gravadas quando o servidor MySQL é desligado, para encurtar o processo de aquecimento na próxima reinicialização. Tipicamente usado em combinação com `innodb_buffer_pool_load_at_startup`. A opção `innodb_buffer_pool_dump_pct` define a porcentagem das páginas do pool de buffers mais recentemente usadas para serem descartadas.

  Ambos os `innodb_buffer_pool_dump_at_shutdown` e `innodb_buffer_pool_load_at_startup` estão habilitados por padrão.

  Para obter mais informações, consulte a Seção 17.8.3.6, “Salvar e restaurar o estado do pool de buffers”.

- `innodb_buffer_pool_dump_now`

  <table summary="Propriedades para servidor dedicado innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb-dedicated-server[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>innodb_dedicated_server</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>6

  Faz imediatamente um registro das páginas armazenadas em cache no pool de buffers `InnoDB`. Tipicamente usado em combinação com `innodb_buffer_pool_load_now`.

  A ativação de `innodb_buffer_pool_dump_now` aciona a ação de gravação, mas não altera o ajuste da variável, que sempre permanece em `OFF` ou `0`. Para visualizar o status do cache de depuração após a ativação de uma depuração, consulte a variável `Innodb_buffer_pool_dump_status`.

  A ativação de `innodb_buffer_pool_dump_now` aciona a ação de dump, mas não altera o ajuste da variável, que sempre permanece em `OFF` ou `0`. Para visualizar o status do dump do pool de buffers após a ativação de um dump, consulte a variável `Innodb_buffer_pool_dump_status`.

  Para obter mais informações, consulte a Seção 17.8.3.6, “Salvar e restaurar o estado do pool de buffers”.

- `innodb_buffer_pool_dump_pct`

  <table summary="Propriedades para servidor dedicado innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb-dedicated-server[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>innodb_dedicated_server</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>7

  Especifica a porcentagem das páginas mais recentemente usadas para cada pool de buffers para leitura e descarte. O intervalo é de 1 a 100. O valor padrão é 25. Por exemplo, se houver 4 pools de buffers com 100 páginas cada, e `innodb_buffer_pool_dump_pct` estiver definido para 25, as 25 páginas mais recentemente usadas de cada pool de buffers serão descartadas.

- `innodb_buffer_pool_filename`

  <table summary="Propriedades para servidor dedicado innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb-dedicated-server[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>innodb_dedicated_server</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>8

  Especifica o nome do arquivo que contém a lista de IDs de tablespace e IDs de página produzidos por `innodb_buffer_pool_dump_at_shutdown` ou `innodb_buffer_pool_dump_now`. Os IDs de tablespace e IDs de página são salvos no seguinte formato: `space, page_id`. Por padrão, o arquivo é chamado de `ib_buffer_pool` e está localizado no diretório de dados `InnoDB`. Uma localização não padrão deve ser especificada em relação ao diretório de dados.

  Um nome de arquivo pode ser especificado em tempo de execução, usando uma declaração `SET`:

  ```
  SET GLOBAL innodb_buffer_pool_filename='file_name';
  ```

  Você também pode especificar um nome de arquivo na inicialização, em uma string de inicialização ou em um arquivo de configuração do MySQL. Ao especificar um nome de arquivo na inicialização, o arquivo deve existir ou `InnoDB` retorna um erro de inicialização indicando que não existe tal arquivo ou diretório.

  Para obter mais informações, consulte a Seção 17.8.3.6, “Salvar e restaurar o estado do pool de buffers”.

- `innodb_buffer_pool_in_core_file`

  <table summary="Propriedades para servidor dedicado innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb-dedicated-server[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>innodb_dedicated_server</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>9

  Desativar a variável `innodb_buffer_pool_in_core_file` reduz o tamanho dos arquivos principais excluindo as páginas do pool de buffers `InnoDB`. Para usar essa variável, a variável `core_file` deve estar habilitada e o sistema operacional deve suportar a extensão não POSIX `MADV_DONTDUMP` para `madvise()`, que é suportada no Linux 3.4 e versões posteriores. Para mais informações, consulte a Seção 17.8.3.7, “Excluindo Páginas do Pool de Buffers dos Arquivos Principais”.

- `innodb_buffer_pool_instances`

  <table summary="Propriedades para o arquivo de status innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb-status-file[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>0

  O número de regiões em que o pool de buffers `InnoDB` é dividido. Para sistemas com pools de buffers na faixa de vários gigabytes, dividir o pool de buffers em instâncias separadas pode melhorar a concorrência, reduzindo a concorrência à medida que diferentes threads leem e escrevem em páginas armazenadas em cache. Cada página que é armazenada ou lida no pool de buffers é atribuída aleatoriamente a uma das instâncias do pool de buffers, usando uma função de hash. Cada instância do pool de buffers gerencia suas próprias listas de livre, listas de esvaziamento, LRUs e todas as outras estruturas de dados conectadas a um pool de buffers, e é protegida por seu próprio mutex do pool de buffers.

  Esta opção só tem efeito quando você define `innodb_buffer_pool_size` para 1 GB ou mais. O tamanho total do pool de buffers é dividido entre todos os pools de buffers. Para obter a melhor eficiência, especifique uma combinação de `innodb_buffer_pool_instances` e `innodb_buffer_pool_size` de modo que cada instância do pool de buffers tenha pelo menos 1 GB.

  O valor padrão em sistemas Windows de 32 bits depende do valor de `innodb_buffer_pool_size`, conforme descrito abaixo:

  - Se `innodb_buffer_pool_size` for maior que 1,3 GB, o padrão para `innodb_buffer_pool_instances` é `innodb_buffer_pool_size`/128 MB, com solicitações individuais de alocação de memória para cada bloco. O limite de 1,3 GB foi escolhido porque há um risco significativo de o Windows de 32 bits não conseguir alocar o espaço de endereçamento contínuo necessário para um único pool de buffers.

  - Caso contrário, o padrão é 1.

  Em todas as outras plataformas, o valor padrão é 8 quando `innodb_buffer_pool_size` é maior ou igual a 1GB. Caso contrário, o padrão é 1.

  Para informações relacionadas, consulte a Seção 17.8.3.1, “Configurando o tamanho do pool de buffers do InnoDB”.

- `innodb_buffer_pool_load_abort`

  <table summary="Propriedades para o arquivo de status innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb-status-file[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>1

  Interrompe o processo de restauração dos conteúdos do pool de buffers `InnoDB` acionado por `innodb_buffer_pool_load_at_startup` ou `innodb_buffer_pool_load_now`.

  A ativação de `innodb_buffer_pool_load_abort` aciona a ação de interrupção, mas não altera o ajuste da variável, que sempre permanece em `OFF` ou `0`. Para visualizar o status da carga do pool de buffers após a ativação de uma ação de interrupção, consulte a variável `Innodb_buffer_pool_load_status`.

  Para obter mais informações, consulte a Seção 17.8.3.6, “Salvar e restaurar o estado do pool de buffers”.

- `innodb_buffer_pool_load_at_startup`

  <table summary="Propriedades para o arquivo de status innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb-status-file[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>2

  Especifica que, ao inicializar o servidor MySQL, o pool de buffers `InnoDB` é aquecido automaticamente ao carregar as mesmas páginas que ele continha em um momento anterior. Tipicamente usado em combinação com `innodb_buffer_pool_dump_at_shutdown`.

  Ambos os `innodb_buffer_pool_dump_at_shutdown` e `innodb_buffer_pool_load_at_startup` estão habilitados por padrão.

  Para obter mais informações, consulte a Seção 17.8.3.6, “Salvar e restaurar o estado do pool de buffers”.

- `innodb_buffer_pool_load_now`

  <table summary="Propriedades para o arquivo de status innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb-status-file[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>3

  Acelera imediatamente o pool de buffers `InnoDB` carregando páginas de dados sem esperar por uma reinicialização do servidor. Pode ser útil para retornar a memória cache a um estado conhecido durante o benchmarking ou para preparar o servidor MySQL para retomar sua carga de trabalho normal após executar consultas para relatórios ou manutenção.

  A ativação de `innodb_buffer_pool_load_now` aciona a ação de carregamento, mas não altera o ajuste da variável, que sempre permanece em `OFF` ou `0`. Para visualizar o progresso do carregamento do pool de buffers após o acionamento de um carregamento, consulte a variável `Innodb_buffer_pool_load_status`.

  Para obter mais informações, consulte a Seção 17.8.3.6, “Salvar e restaurar o estado do pool de buffers”.

- `innodb_buffer_pool_size`

  <table summary="Propriedades para o arquivo de status innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb-status-file[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>4

  O tamanho em bytes do pool de buffers, a área de memória onde o `InnoDB` armazena os dados da tabela e do índice. O valor padrão é de 134217728 bytes (128 MB). O valor máximo depende da arquitetura da CPU; o máximo é de 4294967295 (232-1) em sistemas de 32 bits e 18446744073709551615 (264-1) em sistemas de 64 bits. Em sistemas de 32 bits, a arquitetura da CPU e o sistema operacional podem impor um tamanho máximo prático menor do que o máximo declarado. Quando o tamanho do pool de buffers é maior que 1 GB, definir `innodb_buffer_pool_instances` para um valor maior que 1 pode melhorar a escalabilidade em um servidor ocupado.

  Um pool de tampão maior requer menos I/O de disco para acessar os mesmos dados da tabela mais de uma vez. Em um servidor de banco de dados dedicado, você pode definir o tamanho do pool de tampão para 80% do tamanho da memória física da máquina. Esteja ciente dos seguintes problemas potenciais ao configurar o tamanho do pool de tampão e esteja preparado para reduzir o tamanho do pool de tampão, se necessário.

  - A competição pela memória física pode causar paginação no sistema operacional.

  - O `InnoDB` reserva memória adicional para buffers e estruturas de controle, de modo que o espaço total alocado seja aproximadamente 10% maior que o tamanho especificado do conjunto de buffers.

  - O espaço de endereçamento do pool de buffers deve ser contínuo, o que pode ser um problema em sistemas Windows com DLLs que são carregadas em endereços específicos.

  - O tempo para inicializar o pool de buffers é aproximadamente proporcional ao seu tamanho. Em instâncias com pools de buffers grandes, o tempo de inicialização pode ser significativo. Para reduzir o período de inicialização, você pode salvar o estado do pool de buffers ao desligar o servidor e restaurá-lo ao iniciar o servidor. Consulte a Seção 17.8.3.6, “Salvar e Restaurar o Estado do Pool de Buffers”.

  Quando você aumenta ou diminui o tamanho do pool de buffers, a operação é realizada em partes. O tamanho da parte é definido pela variável `innodb_buffer_pool_chunk_size`, que tem um valor padrão de 128 MB.

  O tamanho do pool de tampão deve sempre ser igual a ou múltiplo de `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`. Se você alterar o tamanho do pool de tampão para um valor que não seja igual a ou múltiplo de `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`, o tamanho do pool de tampão será automaticamente ajustado para um valor que seja igual a ou múltiplo de `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`.

  O `innodb_buffer_pool_size` pode ser configurado dinamicamente, o que permite redimensionar o pool de buffers sem precisar reiniciar o servidor. A variável de status `Innodb_buffer_pool_resize_status` informa o status das operações de redimensionamento do pool de buffers online. Consulte a Seção 17.8.3.1, “Configurando o Tamanho do Pool de Buffers do InnoDB”, para obter mais informações.

  Se o servidor for iniciado com `--innodb-dedicated-server`, o valor `innodb_buffer_pool_size` será determinado automaticamente, se não estiver explicitamente definido. Para mais informações, consulte a Seção 17.8.12, “Habilitar Configuração Automática do InnoDB para um Servidor MySQL Dedicado”.

- `innodb_change_buffer_max_size`

  <table summary="Propriedades para o arquivo de status innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb-status-file[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>5

  Tamanho máximo do buffer de alteração `InnoDB`, como porcentagem do tamanho total do pool de buffers. Você pode aumentar esse valor para um servidor MySQL com alta atividade de inserção, atualização e exclusão, ou diminuí-lo para um servidor MySQL com dados inalterados usados para relatórios. Para mais informações, consulte a Seção 17.5.2, “Buffer de Alteração”. Para conselhos gerais de ajuste de E/S, consulte a Seção 10.5.8, “Otimização do E/S de Disco InnoDB”.

- `innodb_change_buffering`

  <table summary="Propriedades para o arquivo de status innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb-status-file[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>6

  Se o `InnoDB` realizar o bufferamento de alterações, uma otimização que adiatra as operações de escrita para índices secundários para que as operações de E/S possam ser realizadas sequencialmente. Os valores permitidos estão descritos na tabela a seguir. Os valores também podem ser especificados numericamente.

  **Tabela 17.25 Valores permitidos para innodb\_change\_buffering**

  <table summary="Propriedades para o arquivo de status innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb-status-file[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>7

  Para obter mais informações, consulte a Seção 17.5.2, “Alterar o buffer”. Para obter conselhos gerais sobre o ajuste de E/S, consulte a Seção 10.5.8, “Otimizando o E/S de disco do InnoDB”.

- `innodb_change_buffering_debug`

  <table summary="Propriedades para o arquivo de status innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb-status-file[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>8

  Define uma bandeira de depuração para o buffer de alterações `InnoDB`. Um valor de 1 força todas as alterações no buffer de alterações. Um valor de 2 causa uma saída inesperada durante a fusão. Um valor padrão de 0 indica que a bandeira de depuração do buffer de alterações não está definida. Esta opção só está disponível quando o suporte de depuração está compilado com a opção **CMake** `WITH_DEBUG`.

- `innodb_checkpoint_disabled`

  <table summary="Propriedades para o arquivo de status innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb-status-file[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>9

  Esta é uma opção de depuração destinada apenas ao uso de depuração especializada. Ela desabilita os pontos de verificação para que uma saída deliberada do servidor sempre inicie a recuperação `InnoDB`. Deve ser habilitada apenas por um curto período, geralmente antes de executar operações DML que escrevem entradas do log de refazer que exijam recuperação após uma saída do servidor. Esta opção só está disponível se o suporte de depuração estiver compilado usando a opção `WITH_DEBUG` **CMake**.

- `innodb_checksum_algorithm`

  <table summary="Propriedades para daemon_memcached_enable_binlog"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-enable-binlog[={OFF|ON}]</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_enable_binlog</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>0

  Especifica como gerar e verificar o checksum armazenado nos blocos de disco das tabelaspaces `InnoDB`. O valor padrão para `innodb_checksum_algorithm` é `crc32`.

  As versões do MySQL Enterprise Backup até 3.8.0 não suportam a realização de backups de espaços de tabela que utilizam verificações de checksum CRC32. O MySQL Enterprise Backup adiciona suporte para verificações de checksum CRC32 na versão 3.8.1, com algumas limitações. Consulte o Histórico de Alterações do MySQL Enterprise Backup 3.8.1 para obter mais informações.

  O valor `innodb` é compatível com versões anteriores do MySQL. O valor `crc32` utiliza um algoritmo que é mais rápido para calcular o checksum de cada bloco modificado e para verificar os checksums de cada leitura de disco. Ele examina blocos de 64 bits de cada vez, o que é mais rápido do que o algoritmo de checksum `innodb`, que examina blocos de 8 bits de cada vez. O valor `none` escreve um valor constante no campo checksum em vez de calcular um valor baseado nos dados do bloco. Os blocos de um espaço de tabelas podem usar uma mistura de valores antigos, novos e sem checksum, sendo atualizados gradualmente à medida que os dados são modificados; uma vez que os blocos em um espaço de tabelas são modificados para usar o algoritmo `crc32`, as tabelas associadas não podem ser lidas por versões anteriores do MySQL.

  A forma rigorosa de um algoritmo de verificação de integridade de dados reporta um erro se encontrar um valor de verificação de integridade válido, mas não correspondente, em um espaço de tabelas. Recomenda-se que você use apenas configurações rigorosas em uma nova instância, para configurar espaços de tabelas pela primeira vez. As configurações rigorosas são um pouco mais rápidas, porque não precisam calcular todos os valores de verificação de integridade durante as leituras do disco.

  A tabela a seguir mostra a diferença entre os valores das opções `none`, `innodb` e `crc32` e seus equivalentes estritos. `none`, `innodb` e `crc32` escrevem o tipo especificado de valor de verificação em cada bloco de dados, mas, para compatibilidade, aceitam outros valores de verificação quando verificam um bloco durante uma operação de leitura. As configurações estritas também aceitam valores de verificação válidos, mas imprimem uma mensagem de erro quando um valor de verificação não correspondente válido é encontrado. O uso da forma estrita pode tornar a verificação mais rápida se todos os arquivos de dados `InnoDB` em uma instância forem criados com um valor idêntico de `innodb_checksum_algorithm`.

  **Tabela 17.26 Valores permitidos para innodb\_checksum\_algorithm**

  <table summary="Propriedades para daemon_memcached_enable_binlog"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-enable-binlog[={OFF|ON}]</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_enable_binlog</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>1

- `innodb_cmp_per_index_enabled`

  <table summary="Propriedades para daemon_memcached_enable_binlog"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-enable-binlog[={OFF|ON}]</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_enable_binlog</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>2

  Habilita estatísticas relacionadas à compressão por índice na tabela do esquema de informações `INNODB_CMP_PER_INDEX`. Como essas estatísticas podem ser caras de coletar, habilite essa opção apenas em instâncias de desenvolvimento, teste ou replica durante o ajuste de desempenho relacionado às tabelas compactadas `InnoDB`.

  Para obter mais informações, consulte a Seção 28.4.8, “As tabelas INFORMATION\_SCHEMA INNODB\_CMP\_PER\_INDEX e INNODB\_CMP\_PER\_INDEX\_RESET”, e a Seção 17.9.1.4, “Monitoramento da compactação de tabelas InnoDB em tempo de execução”.

- `innodb_commit_concurrency`

  <table summary="Propriedades para daemon_memcached_enable_binlog"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-enable-binlog[={OFF|ON}]</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_enable_binlog</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>3

  O número de threads que podem ser comprometidos ao mesmo tempo. Um valor de 0 (padrão) permite que qualquer número de transações seja comprometido simultaneamente.

  O valor de `innodb_commit_concurrency` não pode ser alterado em tempo de execução de zero para não zero ou vice-versa. O valor pode ser alterado de um valor não zero para outro.

- `innodb_compress_debug`

  <table summary="Propriedades para daemon_memcached_enable_binlog"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-enable-binlog[={OFF|ON}]</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_enable_binlog</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>4

  Compreende todas as tabelas usando um algoritmo de compressão especificado, sem precisar definir um atributo `COMPRESSION` para cada tabela. Esta opção só está disponível se o suporte de depuração estiver compilado usando a opção `WITH_DEBUG` **CMake**.

  Para informações relacionadas, consulte a Seção 17.9.2, “Compressão de Páginas InnoDB”.

- `innodb_compression_failure_threshold_pct`

  <table summary="Propriedades para daemon_memcached_enable_binlog"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-enable-binlog[={OFF|ON}]</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_enable_binlog</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>5

  Define o limiar de taxa de falha de compressão para uma tabela, como uma porcentagem, no ponto em que o MySQL começa a adicionar espaços de preenchimento dentro das páginas compactadas para evitar falhas caras de compressão. Quando esse limiar é ultrapassado, o MySQL começa a deixar espaço livre adicional dentro de cada nova página compactada, ajustando dinamicamente a quantidade de espaço livre até a porcentagem do tamanho da página especificada por `innodb_compression_pad_pct_max`. Um valor de zero desativa o mecanismo que monitora a eficiência da compressão e ajusta dinamicamente a quantidade de espaços de preenchimento.

  Para obter mais informações, consulte a Seção 17.9.1.6, “Compressão para cargas de trabalho OLTP”.

- `innodb_compression_level`

  <table summary="Propriedades para daemon_memcached_enable_binlog"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-enable-binlog[={OFF|ON}]</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_enable_binlog</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>6

  Especifica o nível de compressão zlib a ser usado para tabelas e índices comprimidos `InnoDB`. Um valor maior permite que você coloque mais dados em um dispositivo de armazenamento, às custas de mais overhead da CPU durante a compressão. Um valor menor permite reduzir o overhead da CPU quando o espaço de armazenamento não é crítico ou você espera que os dados não sejam especialmente compressivos.

  Para obter mais informações, consulte a Seção 17.9.1.6, “Compressão para cargas de trabalho OLTP”.

- `innodb_compression_pad_pct_max`

  <table summary="Propriedades para daemon_memcached_enable_binlog"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-enable-binlog[={OFF|ON}]</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_enable_binlog</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>7

  Especifica a porcentagem máxima que pode ser reservada como espaço livre dentro de cada página compactada, permitindo espaço para reorganizar o log de dados e de modificações dentro da página quando uma tabela ou índice compactado é atualizado e os dados podem ser recompactados. Aplica-se apenas quando `innodb_compression_failure_threshold_pct` é definido para um valor diferente de zero e a taxa de falhas de compactação ultrapassa o ponto de corte.

  Para obter mais informações, consulte a Seção 17.9.1.6, “Compressão para cargas de trabalho OLTP”.

- `innodb_concurrency_tickets`

  <table summary="Propriedades para daemon_memcached_enable_binlog"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-enable-binlog[={OFF|ON}]</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_enable_binlog</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>8

  Determina o número de threads que podem entrar em `InnoDB` simultaneamente. Uma thread é colocada em uma fila quando tenta entrar em `InnoDB` se o número de threads já tiver atingido o limite de concorrência. Quando uma thread é permitida a entrar em `InnoDB`, ela recebe um número de "bilhetes" igual ao valor de `innodb_concurrency_tickets`, e a thread pode entrar e sair livremente de `InnoDB` até que tenha usado seus bilhetes. Após esse ponto, a thread novamente fica sujeita à verificação de concorrência (e possível fila) da próxima vez que tentar entrar em `InnoDB`. O valor padrão é 5000.

  Com um pequeno valor de `innodb_concurrency_tickets`, pequenas transações que precisam processar apenas algumas linhas competem de forma justa com transações maiores que processam muitas linhas. A desvantagem de um pequeno valor de `innodb_concurrency_tickets` é que grandes transações precisam percorrer a fila muitas vezes antes de poderem ser concluídas, o que aumenta o tempo necessário para concluir sua tarefa.

  Com um grande valor de `innodb_concurrency_tickets`, as transações grandes gastam menos tempo esperando uma posição no final da fila (controlada por `innodb_thread_concurrency`) e mais tempo recuperando linhas. As transações grandes também requerem menos viagens pela fila para completar sua tarefa. A desvantagem de um grande valor de `innodb_concurrency_tickets` é que muitas transações grandes rodando ao mesmo tempo podem sufocar transações menores, fazendo com que elas precisem esperar por um tempo mais longo antes de serem executadas.

  Com um valor não nulo de `innodb_thread_concurrency`, você pode precisar ajustar o valor de `innodb_concurrency_tickets` para cima ou para baixo para encontrar o equilíbrio ótimo entre transações maiores e menores. O relatório `SHOW ENGINE INNODB STATUS` mostra o número de ingressos restantes para uma transação em execução em sua passagem atual na fila. Esses dados também podem ser obtidos a partir da coluna `TRX_CONCURRENCY_TICKETS` da tabela do Schema de Informações `INNODB_TRX`.

  Para obter mais informações, consulte a Seção 17.8.4, “Configurando Concorrência de Fila para InnoDB”.

- `innodb_data_file_path`

  <table summary="Propriedades para daemon_memcached_enable_binlog"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-enable-binlog[={OFF|ON}]</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_enable_binlog</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>9

  Define o nome, o tamanho e os atributos dos arquivos de dados dos espaços de sistema `InnoDB`. Se você não especificar um valor para `innodb_data_file_path`, o comportamento padrão é criar um único arquivo de dados de autoextensão, ligeiramente maior que 12 MB, com o nome `ibdata1`.

  A sintaxe completa para uma especificação de arquivo de dados inclui o nome do arquivo, o tamanho do arquivo, os atributos `autoextend` e `max`:

  ```
  file_name:file_size[:autoextend[:max:max_file_size]]
  ```

  Os tamanhos dos arquivos são especificados em kilobytes, megabytes ou gigabytes, anexando `K`, `M` ou `G` ao valor do tamanho. Se especificar o tamanho do arquivo de dados em kilobytes, faça isso em múltiplos de 1024. Caso contrário, os valores em KB são arredondados para o limite mais próximo de megabyte (MB). A soma dos tamanhos dos arquivos deve ser, no mínimo, ligeiramente maior que 12 MB.

  Para obter informações adicionais sobre a configuração, consulte Configuração do arquivo de dados do espaço de tabelas do sistema. Para instruções de redimensionamento, consulte Redimensionamento do espaço de tabelas do sistema.

- `innodb_data_home_dir`

  <table summary="Propriedades para daemon_memcached_engine_lib_name"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-engine-lib-name=file_name</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_engine_lib_name</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>innodb_engine.so</code>]]</td> </tr></tbody></table>0

  A parte comum do caminho do diretório para os arquivos de dados dos espaços de tabela do sistema `InnoDB`. O valor padrão é o diretório MySQL `data`. O ajuste é concatenado com o ajuste `innodb_data_file_path`, a menos que esse ajuste seja definido com um caminho absoluto.

  É necessário usar um traço final ao especificar um valor para `innodb_data_home_dir`. Por exemplo:

  ```
  [mysqld]
  innodb_data_home_dir = /path/to/myibdata/
  ```

  Essa configuração não afeta a localização dos espaços de tabelas por arquivo.

  Para informações relacionadas, consulte a Seção 17.8.1, “Configuração de Inicialização do InnoDB”.

- `innodb_ddl_buffer_size`

  <table summary="Propriedades para daemon_memcached_engine_lib_name"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-engine-lib-name=file_name</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_engine_lib_name</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>innodb_engine.so</code>]]</td> </tr></tbody></table>1

  Define o tamanho máximo do buffer para operações DDL. O ajuste padrão é de 1048576 bytes (aproximadamente 1 MB). Aplica-se a operações DDL online que criam ou reconstroem índices secundários. Consulte a Seção 17.12.4, “Gestão de Memória DDL Online”. O tamanho máximo do buffer por fio DDL é o tamanho máximo do buffer dividido pelo número de fios DDL (`innodb_ddl_buffer_size`/`innodb_ddl_threads`).

- `innodb_ddl_log_crash_reset_debug`

  <table summary="Propriedades para daemon_memcached_engine_lib_name"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-engine-lib-name=file_name</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_engine_lib_name</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>innodb_engine.so</code>]]</td> </tr></tbody></table>2

  Ative esta opção de depuração para reiniciar os contadores de injeção de falhas no log DDL para 1. Esta opção só está disponível quando o suporte de depuração é compilado usando a opção `WITH_DEBUG` **CMake**.

- `innodb_ddl_threads`

  <table summary="Propriedades para daemon_memcached_engine_lib_name"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-engine-lib-name=file_name</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_engine_lib_name</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>innodb_engine.so</code>]]</td> </tr></tbody></table>3

  Define o número máximo de threads paralelas para as fases de ordenação e construção da criação do índice. Aplica-se a operações DDL online que criam ou reconstroem índices secundários. Para informações relacionadas, consulte a Seção 17.12.5, “Configurando Threads Paralelas para Operações DDL Online”, e a Seção 17.12.4, “Gestão de Memória DDL Online”.

- `innodb_deadlock_detect`

  <table summary="Propriedades para daemon_memcached_engine_lib_name"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-engine-lib-name=file_name</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_engine_lib_name</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>innodb_engine.so</code>]]</td> </tr></tbody></table>4

  Esta opção é usada para desabilitar a detecção de impasses. Em sistemas de alta concorrência, a detecção de impasses pode causar um atraso quando vários threads aguardam o mesmo bloqueio. Às vezes, pode ser mais eficiente desabilitar a detecção de impasses e confiar na configuração `innodb_lock_wait_timeout` para o rollback de transações quando um impasse ocorre.

  Para informações relacionadas, consulte a Seção 17.7.5.2, “Detecção de Engarrafamento”.

- `innodb_default_row_format`

  <table summary="Propriedades para daemon_memcached_engine_lib_name"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-engine-lib-name=file_name</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_engine_lib_name</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>innodb_engine.so</code>]]</td> </tr></tbody></table>5

  A opção `innodb_default_row_format` define o formato de linha padrão para as tabelas `InnoDB` e tabelas temporárias criadas pelo usuário. O ajuste padrão é `DYNAMIC`. Outros valores permitidos são `COMPACT` e `REDUNDANT`. O formato de linha `COMPRESSED`, que não é suportado para uso no espaço de tabela do sistema, não pode ser definido como padrão.

  As tabelas recém-criadas usam o formato de linha definido por `innodb_default_row_format` quando uma opção `ROW_FORMAT` não é especificada explicitamente ou quando `ROW_FORMAT=DEFAULT` é usado.

  Quando uma opção `ROW_FORMAT` não é especificada explicitamente ou quando `ROW_FORMAT=DEFAULT` é usada, qualquer operação que reconstrua uma tabela também altera silenciosamente o formato da linha da tabela para o formato definido por `innodb_default_row_format`. Para obter mais informações, consulte Definindo o Formato da Linha de uma Tabela.

  As tabelas temporárias internas `InnoDB` criadas pelo servidor para processar consultas usam o formato de linha `DYNAMIC`, independentemente da configuração `innodb_default_row_format`.

- `innodb_directories`

  <table summary="Propriedades para daemon_memcached_engine_lib_name"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-engine-lib-name=file_name</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_engine_lib_name</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>innodb_engine.so</code>]]</td> </tr></tbody></table>6

  Define diretórios para varredura no início para arquivos de espaço de tabela. Esta opção é usada ao mover ou restaurar arquivos de espaço de tabela para um novo local enquanto o servidor está offline. Também é usada para especificar diretórios de arquivos de espaço de tabela criados usando um caminho absoluto ou que residem fora do diretório de dados.

  A descoberta do tablespace durante a recuperação de falhas depende da configuração `innodb_directories` para identificar os tablespaces referenciados nos logs de redo. Para mais informações, consulte Descoberta de Tablespace Durante a Recuperação de Falhas.

  O valor padrão é NULL, mas os diretórios definidos por `innodb_data_home_dir`, `innodb_undo_directory` e `datadir` são sempre anexados ao valor do argumento `innodb_directories` quando o `InnoDB` constrói uma lista de diretórios para varredura no momento do início. Esses diretórios são anexados, independentemente de uma configuração `innodb_directories` ser especificada explicitamente.

  `innodb_directories` pode ser especificado como uma opção em um comando de inicialização ou em um arquivo de opção do MySQL. Aspas cercam o valor do argumento, pois, caso contrário, alguns interpretadores de comandos interpretam o ponto e vírgula (`;`) como um caractere especial. (Por exemplo, as caixas de texto do Unix o tratam como um marcador de fim de comando.)

  Comando de inicialização:

  ```
  mysqld --innodb-directories="directory_path_1;directory_path_2"
  ```

  Arquivo de opção do MySQL:

  ```
  [mysqld]
  innodb_directories="directory_path_1;directory_path_2"
  ```

  Expressões com asteriscos não podem ser usadas para especificar diretórios.

  A varredura `innodb_directories` também percorre os subdiretórios dos diretórios especificados. Diretórios e subdiretórios duplicados são descartados da lista de diretórios a serem verificados.

  Para obter mais informações, consulte a Seção 17.6.3.6, “Mover arquivos do espaço de tabela enquanto o servidor estiver offline”.

- `innodb_disable_sort_file_cache`

  <table summary="Propriedades para daemon_memcached_engine_lib_name"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-engine-lib-name=file_name</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_engine_lib_name</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>innodb_engine.so</code>]]</td> </tr></tbody></table>7

  Desabilita o cache do sistema de arquivos do sistema operacional para arquivos temporários de ordenação por junção. O efeito é abrir esses arquivos com o equivalente a `O_DIRECT`.

- `innodb_doublewrite`

  <table summary="Propriedades para daemon_memcached_engine_lib_name"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-engine-lib-name=file_name</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_engine_lib_name</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>innodb_engine.so</code>]]</td> </tr></tbody></table>8

  A variável `innodb_doublewrite` controla o buffer de escrita dupla. O buffer de escrita dupla está ativado por padrão na maioria dos casos.

  Antes do MySQL 8.0.30, você pode definir `innodb_doublewrite` para `ON` ou `OFF` ao iniciar o servidor para habilitar ou desabilitar o buffer de escrita dupla, respectivamente. A partir do MySQL 8.0.30, `innodb_doublewrite` também suporta as configurações `DETECT_AND_RECOVER` e `DETECT_ONLY`.

  A configuração `DETECT_AND_RECOVER` é a mesma da configuração `ON`. Com essa configuração, o buffer de dupla gravação é totalmente habilitado, com o conteúdo da página do banco de dados sendo escrito no buffer de dupla gravação onde é acessado durante a recuperação para corrigir escritas de páginas incompletas.

  Com a configuração `DETECT_ONLY`, apenas os metadados são escritos no buffer de dupla gravação. O conteúdo da página do banco de dados não é escrito no buffer de dupla gravação, e a recuperação não usa o buffer de dupla gravação para corrigir escritas de páginas incompletas. Esta configuração leve é destinada apenas para detectar escritas de páginas incompletas.

  A partir do MySQL 8.0.30, o suporte a alterações dinâmicas no ajuste `innodb_doublewrite` que habilita o buffer de escrita dupla está disponível entre `ON`, `DETECT_AND_RECOVER` e `DETECT_ONLY`. O MySQL não suporta alterações dinâmicas entre um ajuste que habilita o buffer de escrita dupla e `OFF` ou vice-versa.

  Se o buffer de escrita dupla estiver localizado em um dispositivo Fusion-io que suporte escritas atômicas, o buffer de escrita dupla será desativado automaticamente e as escritas de arquivos de dados serão realizadas usando escritas atômicas do Fusion-io. No entanto, esteja ciente de que o ajuste `innodb_doublewrite` é global. Quando o buffer de escrita dupla é desativado, ele é desativado para todos os arquivos de dados, incluindo aqueles que não residem no hardware Fusion-io. Este recurso é suportado apenas no hardware Fusion-io e só está habilitado para o Fusion-io NVMFS no Linux. Para aproveitar ao máximo este recurso, é recomendado um ajuste `innodb_flush_method` de `O_DIRECT`.

  Para informações relacionadas, consulte a Seção 17.6.4, “Buffer de Doublewrite”.

- `innodb_doublewrite_batch_size`

  <table summary="Propriedades para daemon_memcached_engine_lib_name"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-engine-lib-name=file_name</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_engine_lib_name</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>innodb_engine.so</code>]]</td> </tr></tbody></table>9

  Essa variável era destinada a representar o número de páginas de dupla gravação a serem escritas em um lote. Essa funcionalidade foi substituída por `innodb_doublewrite_pages`.

  Para obter mais informações, consulte a Seção 17.6.4, “Buffer de escrita dupla”.

- `innodb_doublewrite_dir`

  <table summary="Propriedades para daemon_memcached_engine_lib_path"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-engine-lib-path=dir_name</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_engine_lib_path</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>0

  Define o diretório para arquivos de dupla gravação. Se nenhum diretório for especificado, os arquivos de dupla gravação serão criados no diretório `innodb_data_home_dir`, que, por padrão, é o diretório de dados, se não for especificado.

  Para obter mais informações, consulte a Seção 17.6.4, “Buffer de escrita dupla”.

- `innodb_doublewrite_files`

  <table summary="Propriedades para daemon_memcached_engine_lib_path"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-engine-lib-path=dir_name</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_engine_lib_path</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>1

  Define o número de arquivos de dupla gravação. Por padrão, dois arquivos de dupla gravação são criados para cada instância de pool de buffers.

  No mínimo, existem dois arquivos de dupla gravação. O número máximo de arquivos de dupla gravação é duas vezes o número de instâncias do pool de buffers. (O número de instâncias do pool de buffers é controlado pela variável `innodb_buffer_pool_instances`.)

  Para obter mais informações, consulte a Seção 17.6.4, “Buffer de escrita dupla”.

- `innodb_doublewrite_pages`

  <table summary="Propriedades para daemon_memcached_engine_lib_path"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-engine-lib-path=dir_name</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_engine_lib_path</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>2

  Define o número máximo de páginas de escrita dupla por fio para uma escrita em lote. Se nenhum valor for especificado, `innodb_doublewrite_pages` é definido com o valor de `innodb_write_io_threads`.

  O valor padrão mudou de 4 (copiado de `innodb_write_io_threads` no 8.0) para 128 no MySQL 8.4.0. Esse valor pequeno poderia causar muitas operações fsync para operações de escrita dupla. Para informações relacionadas, consulte a Seção 10.5.8, “Otimizando o I/O de Disco do InnoDB”.

  Para obter mais informações, consulte a Seção 17.6.4, “Buffer de escrita dupla”.

- `innodb_extend_and_initialize`

  <table summary="Propriedades para daemon_memcached_engine_lib_path"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-engine-lib-path=dir_name</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_engine_lib_path</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>3

  Controla como o espaço é alocado para arquivos por tabela e espaços de tabela gerais em sistemas Linux.

  Quando ativado, `InnoDB` escreve NULOS em páginas recém-alocadas. Quando desativado, o espaço é alocado usando chamadas `posix_fallocate()`, que reservam espaço sem escrever fisicamente NULOS.

  Para obter mais informações, consulte a Seção 17.6.3.8, “Otimizando a Alocação de Espaço de Tablespace no Linux”.

- `innodb_fast_shutdown`

  <table summary="Propriedades para daemon_memcached_engine_lib_path"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-engine-lib-path=dir_name</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_engine_lib_path</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>4

  O modo de desligamento `InnoDB`. Se o valor for 0, `InnoDB` realiza um desligamento lento, uma purga completa e uma fusão de buffers antes de desligar. Se o valor for 1 (o padrão), `InnoDB` ignora essas operações ao desligar, um processo conhecido como desligamento rápido. Se o valor for 2, `InnoDB` esvazia seus logs e desliga-se completamente, como se o MySQL tivesse falhado; nenhuma transação confirmada é perdida, mas a operação de recuperação de falhas faz com que o próximo início seja mais demorado.

  O desligamento lento pode levar minutos, ou até horas em casos extremos, quando quantidades substanciais de dados ainda estão em buffer. Use a técnica de desligamento lento antes de fazer uma atualização ou uma downgrade entre as versões principais do MySQL, para que todos os arquivos de dados estejam totalmente preparados, caso o processo de atualização atualize o formato do arquivo.

  Use `innodb_fast_shutdown=2` em situações de emergência ou de solução de problemas, para obter o desligamento mais rápido possível se os dados estiverem em risco de corrupção.

- `innodb_fil_make_page_dirty_debug`

  <table summary="Propriedades para daemon_memcached_engine_lib_path"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-engine-lib-path=dir_name</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_engine_lib_path</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>5

  Por padrão, definir `innodb_fil_make_page_dirty_debug` para o ID de um espaço de tabelas suja imediatamente a primeira página do espaço de tabelas. Se `innodb_saved_page_number_debug` for definido para um valor não padrão, definir `innodb_fil_make_page_dirty_debug` suja a página especificada. A opção `innodb_fil_make_page_dirty_debug` só está disponível se o suporte de depuração for compilado usando a opção `WITH_DEBUG` **CMake**.

- `innodb_file_per_table`

  <table summary="Propriedades para daemon_memcached_engine_lib_path"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-engine-lib-path=dir_name</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_engine_lib_path</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>6

  Quando o `innodb_file_per_table` está habilitado, as tabelas são criadas em espaços de tabelas por arquivo por padrão. Quando desabilitado, as tabelas são criadas no espaço de tabelas do sistema por padrão. Para informações sobre espaços de tabelas por arquivo, consulte a Seção 17.6.3.2, “Espaços de tabelas por arquivo”. Para informações sobre o espaço de tabelas do sistema `InnoDB`, consulte a Seção 17.6.3.1, “O espaço de tabelas do sistema”.

  A variável `innodb_file_per_table` pode ser configurada em tempo de execução usando uma instrução `SET GLOBAL`, especificada na linha de comando durante o início ou especificada em um arquivo de opção. A configuração em tempo de execução requer privilégios suficientes para definir variáveis de sistema globais (consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”) e afeta imediatamente o funcionamento de todas as conexões.

  Quando uma tabela que reside em um espaço de tabelas por arquivo é truncada ou excluída, o espaço liberado é devolvido ao sistema operacional. Ao truncar ou excluir uma tabela que reside no espaço de tabelas do sistema, apenas o espaço liberado no espaço de tabelas do sistema é liberado. O espaço liberado no espaço de tabelas do sistema pode ser usado novamente para dados `InnoDB`, mas não é devolvido ao sistema operacional, pois os arquivos de dados do espaço de tabelas do sistema nunca diminuem.

  A configuração `innodb_file_per-table` não afeta a criação de tabelas temporárias. A partir do MySQL 8.0.14, as tabelas temporárias são criadas em espaços temporários de sessão e, antes disso, em um espaço temporário de tabelas global. Veja a Seção 17.6.3.5, “Espaços Temporários de Tabelas”.

- `innodb_fill_factor`

  <table summary="Propriedades para daemon_memcached_engine_lib_path"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-engine-lib-path=dir_name</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_engine_lib_path</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>7

  `InnoDB` realiza uma carga em massa ao criar ou reconstruir índices. Esse método de criação de índices é conhecido como "construção de índice ordenado".

  `innodb_fill_factor` define a porcentagem de espaço em cada página da árvore B que é preenchida durante a construção de um índice ordenado, com o espaço restante reservado para o crescimento futuro do índice. Por exemplo, definir `innodb_fill_factor` para 80 reserva 20% do espaço em cada página da árvore B para o crescimento futuro do índice. As porcentagens reais podem variar. A configuração `innodb_fill_factor` é interpretada como um indicativo em vez de um limite rígido.

  Uma configuração `innodb_fill_factor` de 100 deixa 1/16 do espaço nas páginas do índice agrupado livre para o crescimento futuro do índice.

  `innodb_fill_factor` se aplica tanto às páginas de folhas de árvore B quanto às páginas não-folhas. Não se aplica às páginas externas usadas para entradas `TEXT` ou `BLOB`.

  Para obter mais informações, consulte a Seção 17.6.2.3, “Construções de índices ordenados”.

- `innodb_flush_log_at_timeout`

  <table summary="Propriedades para daemon_memcached_engine_lib_path"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-engine-lib-path=dir_name</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_engine_lib_path</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>8

  Escreva e limpe os logs a cada `N` segundos. `innodb_flush_log_at_timeout` permite que o período de tempo de espera entre limpezas seja aumentado para reduzir o número de limpezas e evitar o impacto no desempenho do commit do grupo de log binário. O ajuste padrão para `innodb_flush_log_at_timeout` é uma vez por segundo.

- `innodb_flush_log_at_trx_commit`

  <table summary="Propriedades para daemon_memcached_engine_lib_path"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-engine-lib-path=dir_name</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_engine_lib_path</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>9

  Controla o equilíbrio entre a estrita conformidade ACID para operações de commit e o melhor desempenho que é possível quando as operações de E/S relacionadas ao commit são reorganizadas e realizadas em lotes. Você pode obter um melhor desempenho ao alterar o valor padrão, mas, nesse caso, você pode perder transações em caso de falha.

  - A configuração padrão de 1 é necessária para a conformidade completa com ACID. Os logs são escritos e descarregados no disco em cada commit de transação.

  - Com um valor de 0, os logs são escritos e descarregados no disco uma vez por segundo. As transações para as quais os logs não foram descarregados podem ser perdidas em um crash.

  - Com um nível de 2, os logs são escritos após cada commit de transação e descarregados no disco uma vez por segundo. As transações para as quais os logs não foram descarregados podem ser perdidas em um crash.

  - Para as configurações 0 e 2, o esvaziamento uma vez por segundo não é garantido a 100%. O esvaziamento pode ocorrer com mais frequência devido às alterações no DDL e outras atividades internas `InnoDB` que fazem com que os logs sejam esvaziados independentemente da configuração `innodb_flush_log_at_trx_commit`, e, às vezes, com menos frequência devido a problemas de agendamento. Se os logs forem esvaziados uma vez por segundo, até um segundo de transações pode ser perdido em um crash. Se os logs forem esvaziados com mais ou menos frequência do que uma vez por segundo, a quantidade de transações que podem ser perdidas varia de acordo.

  - A frequência de esvaziamento do log é controlada por `innodb_flush_log_at_timeout`, que permite definir a frequência de esvaziamento do log para `N` segundos (onde `N` é `1 ... 2700`, com um valor padrão de 1). No entanto, qualquer encerramento inesperado do processo **mysqld** pode apagar até `N` segundos de transações.

  - As alterações no DDL e outras atividades internas do `InnoDB` limpem o log independentemente da configuração do `innodb_flush_log_at_trx_commit`.

  - A recuperação de falhas do `InnoDB` funciona independentemente da configuração do `innodb_flush_log_at_trx_commit`. As transações são aplicadas totalmente ou apagadas totalmente.

  Para a durabilidade e consistência em uma configuração de replicação que usa `InnoDB` com transações:

  - Se o registro binário estiver habilitado, defina `sync_binlog=1`.

  - Sempre defina `innodb_flush_log_at_trx_commit=1`.

  Para obter informações sobre a combinação de configurações em uma réplica que seja mais resistente a interrupções inesperadas, consulte a Seção 19.4.2, “Tratamento de uma Interrupção Inesperada de uma Réplica”.

  Cuidado

  Muitos sistemas operacionais e alguns hardwares de disco enganam a operação de gravação no disco. Eles podem informar ao **mysqld** que a gravação ocorreu, mesmo que não tenha. Nesse caso, a durabilidade das transações não é garantida, mesmo com as configurações recomendadas, e, no pior dos casos, uma queda de energia pode corromper os dados do `InnoDB`. O uso de um cache de disco com bateria no controlador de disco SCSI ou no próprio disco acelera as gravação no disco e torna a operação mais segura. Você também pode tentar desativar o cache de gravação no disco em caches de hardware.

- `innodb_flush_method`

  <table summary="Propriedades para daemon_memcached_option"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-option=options</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_option</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>0

  Define o método usado para limpar os dados nos arquivos de dados `InnoDB` e os arquivos de log, o que pode afetar o desempenho de E/S.

  Nos sistemas Unix-like, o valor padrão é `fsync`. No Windows, o valor padrão é `unbuffered`.

  Nota

  No MySQL 8.0, as opções `innodb_flush_method` podem ser especificadas numericamente.

  As opções `innodb_flush_method` para sistemas semelhantes ao Unix incluem:

  - `fsync` ou `0`: `InnoDB` usa a chamada de sistema `fsync()` para limpar tanto os arquivos de dados quanto os arquivos de log. `fsync` é o ajuste padrão.

  - `O_DSYNC` ou `1`: `InnoDB` usa `O_SYNC` para abrir e limpar os arquivos de log, e `fsync()` para limpar os arquivos de dados. `InnoDB` não usa `O_DSYNC` diretamente porque houve problemas com isso em muitas variedades de Unix.

  - `littlesync` ou `2`: Esta opção é usada para testes internos de desempenho e atualmente não é suportada. Use por sua conta e risco.

  - `nosync` ou `3`: Esta opção é usada para testes internos de desempenho e atualmente não é suportada. Use por sua conta e risco.

  - `O_DIRECT` ou `4`: `InnoDB` usa `O_DIRECT` (ou `directio()` no Solaris) para abrir os arquivos de dados e usa `fsync()` para esvaziar tanto os arquivos de dados quanto os de log. Esta opção está disponível em algumas versões do GNU/Linux, FreeBSD e Solaris.

  - `O_DIRECT_NO_FSYNC`: `InnoDB` usa `O_DIRECT` durante o esvaziamento de E/S, mas ignora a chamada de sistema `fsync()` após cada operação de escrita.

    Antes do MySQL 8.0.14, essa configuração não é adequada para sistemas de arquivos como XFS e EXT4, que exigem uma chamada de sistema `fsync()` para sincronizar as alterações dos metadados do sistema de arquivos. Se você não tiver certeza se o seu sistema de arquivos requer uma chamada de sistema `fsync()` para sincronizar as alterações dos metadados do sistema de arquivos, use `O_DIRECT` em vez disso.

    A partir do MySQL 8.0.14, `fsync()` é chamado após a criação de um novo arquivo, após o aumento do tamanho do arquivo e após a fechamento de um arquivo, para garantir que as alterações dos metadados do sistema de arquivos sejam sincronizadas. A chamada de sistema `fsync()` ainda é ignorada após cada operação de escrita.

    A perda de dados é possível se os arquivos de log de refazer e os arquivos de dados estiverem em dispositivos de armazenamento diferentes, e uma saída inesperada ocorrer antes que os dados sejam apagados do cache de um dispositivo que não seja alimentado por bateria. Se você estiver usando ou planejando usar diferentes dispositivos de armazenamento para arquivos de log de refazer e arquivos de dados, e seus arquivos de dados estiverem em um dispositivo com um cache que não seja alimentado por bateria, use `O_DIRECT` em vez disso.

  Em plataformas que suportam chamadas de sistema `fdatasync()`, a variável `innodb_use_fdatasync`, introduzida no MySQL 8.0.26, permite que opções `innodb_flush_method` que utilizam `fsync()` usem `fdatasync()` em vez disso. Uma chamada de sistema `fdatasync()` não esvazia as alterações no metadados do arquivo, a menos que seja necessário para a recuperação subsequente de dados, proporcionando um potencial benefício de desempenho.

  As opções `innodb_flush_method` para sistemas Windows incluem:

  - `unbuffered` ou `0`: `InnoDB` usa I/O não tamponado.

    Nota

    Executar o servidor MySQL em um disco rígido de setor de 4K no Windows não é suportado com `unbuffered`. A solução é usar `innodb_flush_method=normal`.

  - `normal` ou `1`: `InnoDB` usa I/O com buffer.

  Como cada configuração afeta o desempenho depende da configuração do hardware e da carga de trabalho. Faça um benchmark da sua configuração específica para decidir qual configuração usar ou se deve manter a configuração padrão. Examine a variável de status `Innodb_data_fsyncs` para ver o número total de chamadas `fsync()` (ou chamadas `fdatasync()` se `innodb_use_fdatasync` estiver habilitado) para cada configuração. A combinação de operações de leitura e escrita na sua carga de trabalho pode afetar o desempenho de uma configuração. Por exemplo, em um sistema com um controlador de RAID de hardware e cache de escrita com suporte a bateria, `O_DIRECT` pode ajudar a evitar o bufferamento duplo entre o pool de buffers `InnoDB` e o cache do sistema de arquivos do sistema operacional. Em alguns sistemas onde os arquivos de dados e log `InnoDB` estão localizados em um SAN, o valor padrão ou `O_DSYNC` pode ser mais rápido para uma carga de trabalho com muitas instruções `SELECT`. Sempre teste este parâmetro com hardware e carga de trabalho que reflitam seu ambiente de produção. Para obter conselhos gerais sobre o ajuste de I/O, consulte a Seção 10.5.8, “Otimizando o I/O do InnoDB Disk”.

  Se o servidor for iniciado com `--innodb-dedicated-server`, o valor de `innodb_flush_method` será definido automaticamente, caso não seja explicitamente definido. Para mais informações, consulte a Seção 17.8.12, “Habilitar Configuração Automática do InnoDB para um Servidor MySQL Dedicado”.

- `innodb_flush_neighbors`

  <table summary="Propriedades para daemon_memcached_option"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-option=options</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_option</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>1

  Especifica se o esvaziamento de uma página do pool de memória `InnoDB` também esvazia outras páginas sujas da mesma extensão.

  - Um valor de 0 desativa `innodb_flush_neighbors`. Páginas sujas na mesma extensão não são descartadas.

  - Uma configuração de 1 varredura de páginas sujas contíguas na mesma extensão.

  - Uma configuração de 2 varreduras de páginas sujas na mesma extensão.

  Quando os dados da tabela são armazenados em um dispositivo de armazenamento HDD tradicional, o esvaziamento de páginas vizinhas em uma única operação reduz o overhead de I/O (principalmente para operações de busca no disco) em comparação com o esvaziamento de páginas individuais em momentos diferentes. Para dados da tabela armazenados em SSD, o tempo de busca não é um fator significativo e você pode definir essa opção para 0 para espalhar as operações de escrita. Para informações relacionadas, consulte a Seção 17.8.3.5, “Configurando o esvaziamento do Pool de Buffer”.

- `innodb_flush_sync`

  <table summary="Propriedades para daemon_memcached_option"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-option=options</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_option</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>2

  A variável `innodb_flush_sync`, que está habilitada por padrão, faz com que as configurações `innodb_io_capacity` e `innodb_io_capacity_max` sejam ignoradas durante os picos de atividade de E/S que ocorrem em pontos de verificação. Para aderir à taxa de E/S definida por `innodb_io_capacity` e `innodb_io_capacity_max`, desative `innodb_flush_sync`.

  Para obter informações sobre a configuração da variável `innodb_flush_sync`, consulte a Seção 17.8.7, “Configurando a Capacidade de Entrada/Saída do InnoDB”.

- `innodb_flushing_avg_loops`

  <table summary="Propriedades para daemon_memcached_option"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-option=options</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_option</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>3

  Número de iterações para as quais `InnoDB` mantém o instantâneo anteriormente calculado do estado de esvaziamento, controlando a rapidez com que o esvaziamento adaptativo responde às mudanças nas cargas de trabalho. Aumentar o valor faz com que a taxa de operações de esvaziamento mude de forma suave e gradual à medida que a carga de trabalho muda. Diminuir o valor faz com que o esvaziamento adaptativo ajuste-se rapidamente às mudanças na carga de trabalho, o que pode causar picos na atividade de esvaziamento se a carga de trabalho aumentar e diminuir de repente.

  Para informações relacionadas, consulte a Seção 17.8.3.5, “Configurando o esvaziamento do pool de buffers”.

- `innodb_force_load_corrupted`

  <table summary="Propriedades para daemon_memcached_option"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-option=options</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_option</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>4

  Permita que o `InnoDB` carregue tabelas ao iniciar que estejam marcadas como corrompidas. Use apenas durante a solução de problemas, para recuperar dados que, de outra forma, seriam inacessíveis. Quando a solução de problemas estiver concluída, desative essa configuração e reinicie o servidor.

- `innodb_force_recovery`

  <table summary="Propriedades para daemon_memcached_option"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-option=options</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_option</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>5

  O modo de recuperação de falha, normalmente alterado apenas em situações graves de solução de problemas. Os valores possíveis são de 0 a 6. Para os significados desses valores e informações importantes sobre `innodb_force_recovery`, consulte a Seção 17.21.3, “Forçando a Recuperação do InnoDB”.

  Aviso

  Estabeleça essa variável apenas com um valor maior que 0 em uma situação de emergência, para que você possa iniciar `InnoDB` e descartar suas tabelas. Como medida de segurança, `InnoDB` impede as operações de `INSERT`, `UPDATE` ou `DELETE` quando `innodb_force_recovery` é maior que 0. Um ajuste de `innodb_force_recovery` de 4 ou maior coloca `InnoDB` no modo de leitura somente.

  Essas restrições podem fazer com que os comandos de administração de replicação falhem com um erro, pois os logs do status da replicação são armazenados nas tabelas `InnoDB`.

- `innodb_fsync_threshold`

  <table summary="Propriedades para daemon_memcached_option"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-option=options</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_option</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>6

  Por padrão, quando o `InnoDB` cria um novo arquivo de dados, como um novo arquivo de log ou arquivo de espaço de tabelas, o arquivo é totalmente escrito no cache do sistema operacional antes de ser descarregado no disco, o que pode causar uma grande quantidade de atividade de escrita no disco de uma só vez. Para forçar limpezas periódicas e menores dos dados do cache do sistema operacional, você pode usar a variável `innodb_fsync_threshold` para definir um valor limite, em bytes. Quando o limite de bytes é atingido, o conteúdo do cache do sistema operacional é descarregado no disco. O valor padrão de 0 força o comportamento padrão, que é descarregar os dados no disco apenas após um arquivo ser totalmente escrito no cache.

  Especificar um limite para forçar limpezas periódicas menores pode ser benéfico em casos em que múltiplas instâncias do MySQL utilizam os mesmos dispositivos de armazenamento. Por exemplo, criar uma nova instância do MySQL e seus arquivos de dados associados pode causar grandes picos de atividade de escrita no disco, impedindo o desempenho de outras instâncias do MySQL que utilizam os mesmos dispositivos de armazenamento. Configurar um limite ajuda a evitar tais picos de atividade de escrita.

- `innodb_ft_aux_table`

  <table summary="Propriedades para daemon_memcached_option"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-option=options</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_option</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>7

  Especifica o nome qualificado de uma tabela `InnoDB` que contém um índice `FULLTEXT`. Esta variável é destinada a fins de diagnóstico e só pode ser definida em tempo de execução. Por exemplo:

  ```
  SET GLOBAL innodb_ft_aux_table = 'test/t1';
  ```

  Depois de definir essa variável para um nome no formato `db_name/table_name`, as tabelas `INFORMATION_SCHEMA`, `INNODB_FT_INDEX_TABLE`, `INNODB_FT_INDEX_CACHE`, `INNODB_FT_CONFIG`, `INNODB_FT_DELETED` e `INNODB_FT_BEING_DELETED` mostrarão informações sobre o índice de pesquisa da tabela especificada.

  Para obter mais informações, consulte a Seção 17.15.4, “Tabelas de Índices FULLTEXT do InnoDB INFORMATION\_SCHEMA”.

- `innodb_ft_cache_size`

  <table summary="Propriedades para daemon_memcached_option"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-option=options</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_option</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>8

  A memória alocada, em bytes, para o cache do índice de pesquisa `InnoDB` `FULLTEXT` `InnoDB` `FULLTEXT`, que armazena um documento analisado na memória enquanto cria um índice `innodb_ft_cache_size` `innodb_ft_cache_size`. As inserções e atualizações do índice são comprometidas no disco apenas quando o limite de tamanho `innodb_ft_total_cache_size` é atingido. `innodb_ft_total_cache_size` define o tamanho do cache por tabela. Para definir um limite global para todas as tabelas, consulte `innodb_ft_total_cache_size`.

  Para obter mais informações, consulte o cache de índice de texto completo do InnoDB.

- `innodb_ft_enable_diag_print`

  <table summary="Propriedades para daemon_memcached_option"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-option=options</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_option</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>9

  Se habilitar ou não a saída de diagnóstico de pesquisa de texto completo (FTS) adicional. Esta opção é destinada principalmente ao depuração avançada do FTS e não é de interesse para a maioria dos usuários. A saída é impressa no log de erros e inclui informações como:

  - Progresso da sincronização do índice FTS (quando o limite do cache FTS é atingido). Por exemplo:

    ```
    FTS SYNC for table test, deleted count: 100 size: 10000 bytes
    SYNC words: 100
    ```

  - A FTS otimiza o progresso. Por exemplo:

    ```
    FTS start optimize test
    FTS_OPTIMIZE: optimize "mysql"
    FTS_OPTIMIZE: processed "mysql"
    ```

  - Progresso da construção do índice FTS. Por exemplo:

    ```
    Number of doc processed: 1000
    ```

  - Para consultas do FTS, a árvore de análise da consulta, o peso das palavras, o tempo de processamento da consulta e o uso de memória são impressos. Por exemplo:

    ```
    FTS Search Processing time: 1 secs: 100 millisec: row(s) 10000
    Full Search Memory: 245666 (bytes),  Row: 10000
    ```

- `innodb_ft_enable_stopword`

  <table summary="Propriedades para daemon_memcached_r_batch_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-r-batch-size=#</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_r_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1073741824</code>]]</td> </tr></tbody></table>0

  Especifica que um conjunto de palavras-chave está associado a um índice `InnoDB` `FULLTEXT` no momento em que o índice é criado. Se a opção `innodb_ft_user_stopword_table` estiver definida, as palavras-chave são retiradas daquela tabela. Caso contrário, se a opção `innodb_ft_server_stopword_table` estiver definida, as palavras-chave são retiradas daquela tabela. Caso contrário, um conjunto padrão de palavras-chave padrão é usado.

  Para obter mais informações, consulte a Seção 14.9.4, “Palavras-chave de parada de texto completo”.

- `innodb_ft_max_token_size`

  <table summary="Propriedades para daemon_memcached_r_batch_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-r-batch-size=#</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_r_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1073741824</code>]]</td> </tr></tbody></table>1

  Comprimento máximo de caracteres das palavras armazenadas em um índice `InnoDB` `FULLTEXT`. Definir um limite para esse valor reduz o tamanho do índice, acelerando assim as consultas, ao omitir palavras longas ou coleções arbitrárias de letras que não são palavras reais e provavelmente não serão termos de pesquisa.

  Para obter mais informações, consulte a Seção 14.9.6, “Ajuste fino da pesquisa de texto completo do MySQL”.

- `innodb_ft_min_token_size`

  <table summary="Propriedades para daemon_memcached_r_batch_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-r-batch-size=#</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_r_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1073741824</code>]]</td> </tr></tbody></table>2

  Comprimento mínimo das palavras armazenadas em um índice `InnoDB` `FULLTEXT`. Aumentar esse valor reduz o tamanho do índice, acelerando assim as consultas, ao omitir palavras comuns que provavelmente não serão significativas em um contexto de pesquisa, como as palavras em inglês “a” e “to”. Para conteúdo que utiliza um conjunto de caracteres CJK (Chinês, Japonês, Coreano), especifique um valor de 1.

  Para obter mais informações, consulte a Seção 14.9.6, “Ajuste fino da pesquisa de texto completo do MySQL”.

- `innodb_ft_num_word_optimize`

  <table summary="Propriedades para daemon_memcached_r_batch_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-r-batch-size=#</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_r_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1073741824</code>]]</td> </tr></tbody></table>3

  Número de palavras a serem processadas durante cada operação `OPTIMIZE TABLE` em um índice `InnoDB` `FULLTEXT`. Como uma operação de inserção ou atualização em massa em uma tabela que contém um índice de pesquisa full-text pode exigir uma manutenção substancial do índice para incorporar todas as alterações, você pode realizar uma série de instruções `OPTIMIZE TABLE`, cada uma retomando onde a última deixou.

  Para obter mais informações, consulte a Seção 14.9.6, “Ajuste fino da pesquisa de texto completo do MySQL”.

- `innodb_ft_result_cache_limit`

  <table summary="Propriedades para daemon_memcached_r_batch_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-r-batch-size=#</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_r_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1073741824</code>]]</td> </tr></tbody></table>4

  O limite de cache do resultado da consulta de pesquisa de texto completo `InnoDB` (definido em bytes) por consulta de pesquisa de texto completo ou por fio. Os resultados intermediários e finais da consulta de pesquisa de texto completo `InnoDB` são mantidos na memória. Use `innodb_ft_result_cache_limit` para definir um limite de tamanho no cache do resultado da consulta de pesquisa de texto completo para evitar o consumo excessivo de memória em caso de resultados muito grandes da consulta de pesquisa de texto completo `InnoDB` (milhões ou centenas de milhões de linhas, por exemplo). A memória é alocada conforme necessário quando uma consulta de pesquisa de texto completo é processada. Se o limite de tamanho do cache do resultado da consulta for atingido, um erro é retornado indicando que a consulta excede a memória máxima permitida.

  O valor máximo de `innodb_ft_result_cache_limit` para todos os tipos de plataforma e tamanhos de bits é 2\*\*32-1.

- `innodb_ft_server_stopword_table`

  <table summary="Propriedades para daemon_memcached_r_batch_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-r-batch-size=#</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_r_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1073741824</code>]]</td> </tr></tbody></table>5

  Esta opção é usada para especificar sua própria lista de palavras-chave `InnoDB` `FULLTEXT` de índice para todas as tabelas `InnoDB`. Para configurar sua própria lista de palavras-chave para uma tabela específica `InnoDB`, use `innodb_ft_user_stopword_table`.

  Defina `innodb_ft_server_stopword_table` com o nome da tabela que contém uma lista de palavras-chave irrelevantes, no formato `db_name/table_name`.

  A tabela de palavras-chave deve existir antes de você configurar `innodb_ft_server_stopword_table`. `innodb_ft_enable_stopword` deve estar habilitado e a opção `innodb_ft_server_stopword_table` deve ser configurada antes de você criar o índice `FULLTEXT`.

  A tabela de palavras-chave deve ser uma tabela `InnoDB`, contendo uma única coluna `VARCHAR` chamada `value`.

  Para obter mais informações, consulte a Seção 14.9.4, “Palavras-chave de parada de texto completo”.

- `innodb_ft_sort_pll_degree`

  <table summary="Propriedades para daemon_memcached_r_batch_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-r-batch-size=#</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_r_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1073741824</code>]]</td> </tr></tbody></table>6

  Número de threads usados em paralelo para indexar e tokenizar texto em um índice `InnoDB` `FULLTEXT` ao criar um índice de pesquisa.

  Para informações relacionadas, consulte a Seção 17.6.2.4, “Índices de Texto Completo InnoDB”, e `innodb_sort_buffer_size`.

- `innodb_ft_total_cache_size`

  <table summary="Propriedades para daemon_memcached_r_batch_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-r-batch-size=#</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_r_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1073741824</code>]]</td> </tr></tbody></table>7

  A memória total alocada, em bytes, para o cache do índice de pesquisa de texto completo `InnoDB` para todas as tabelas. Criar várias tabelas, cada uma com um índice de pesquisa `FULLTEXT`, pode consumir uma parte significativa da memória disponível. `innodb_ft_total_cache_size` define um limite de memória global para todos os índices de pesquisa de texto completo para ajudar a evitar o consumo excessivo de memória. Se o limite global for atingido por uma operação de índice, uma sincronização forçada é acionada.

  Para obter mais informações, consulte o cache de índice de texto completo do InnoDB.

- `innodb_ft_user_stopword_table`

  <table summary="Propriedades para daemon_memcached_r_batch_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-r-batch-size=#</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_r_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1073741824</code>]]</td> </tr></tbody></table>8

  Esta opção é usada para especificar sua própria lista de palavras-chave de parada `InnoDB` `FULLTEXT` em uma tabela específica. Para configurar sua própria lista de palavras-chave para todas as tabelas `InnoDB`, use `innodb_ft_server_stopword_table`.

  Defina `innodb_ft_user_stopword_table` com o nome da tabela que contém uma lista de palavras-chave irrelevantes, no formato `db_name/table_name`.

  A tabela de palavras-chave deve existir antes de você configurar `innodb_ft_user_stopword_table`. `innodb_ft_enable_stopword` deve estar habilitado e `innodb_ft_user_stopword_table` deve ser configurado antes de você criar o índice `FULLTEXT`.

  A tabela de palavras-chave deve ser uma tabela `InnoDB`, contendo uma única coluna `VARCHAR` chamada `value`.

  Para obter mais informações, consulte a Seção 14.9.4, “Palavras-chave de parada de texto completo”.

- `innodb_idle_flush_pct`

  <table summary="Propriedades para daemon_memcached_r_batch_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-r-batch-size=#</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_r_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1073741824</code>]]</td> </tr></tbody></table>9

  Limita o esvaziamento da página quando o `InnoDB` está inativo. O valor `innodb_idle_flush_pct` é uma porcentagem do ajuste `innodb_io_capacity`, que define o número de operações de E/S por segundo disponíveis para o `InnoDB`. Para mais informações, consulte Limitar o esvaziamento do buffer durante períodos de inatividade.

- `innodb_io_capacity`

  <table summary="Propriedades para daemon_memcached_w_batch_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-w-batch-size=#</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_w_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>0

  A variável `innodb_io_capacity` define o número de operações de E/S por segundo (IOPS) disponíveis para as tarefas em segundo plano `InnoDB`, como o esvaziamento de páginas do pool de buffer e a fusão de dados do buffer de alterações.

  Para obter informações sobre a configuração da variável `innodb_io_capacity`, consulte a Seção 17.8.7, “Configurando a Capacidade de Entrada/Saída do InnoDB”.

- `innodb_io_capacity_max`

  <table summary="Propriedades para daemon_memcached_w_batch_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-w-batch-size=#</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_w_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>1

  Se a atividade de limpeza ficar para trás, o `InnoDB` pode realizar a limpeza de forma mais agressiva, com uma taxa de operações de entrada/saída (IOPS) por segundo (IOPS) maior do que a definida pela variável `innodb_io_capacity`. A variável `innodb_io_capacity_max` define um número máximo de IOPS realizados pelas tarefas de segundo plano do `InnoDB` nessas situações. Esta opção não controla o comportamento do `innodb_flush_sync`.

  Para obter informações sobre a configuração da variável `innodb_io_capacity_max`, consulte a Seção 17.8.7, “Configurando a Capacidade de Entrada/Saída do InnoDB”.

- `innodb_limit_optimistic_insert_debug`

  <table summary="Propriedades para daemon_memcached_w_batch_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-w-batch-size=#</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_w_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>2

  Limita o número de registros por página de árvore B. Um valor padrão de 0 significa que nenhum limite é imposto. Esta opção só está disponível se o suporte de depuração estiver compilado usando a opção `WITH_DEBUG` **CMake**.

- `innodb_lock_wait_timeout`

  <table summary="Propriedades para daemon_memcached_w_batch_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-w-batch-size=#</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_w_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>3

  O tempo em segundos que uma transação `InnoDB` aguarda por um bloqueio de linha antes de desistir. O valor padrão é de 50 segundos. Uma transação que tenta acessar uma linha bloqueada por outra transação `InnoDB` aguarda, no máximo, esse número de segundos para obter acesso de escrita à linha antes de emitir o seguinte erro:

  ```
  ERROR 1205 (HY000): Lock wait timeout exceeded; try restarting transaction
  ```

  Quando ocorre um tempo de espera de bloqueio, a declaração atual é revertida (não a transação inteira). Para reverter toda a transação, inicie o servidor com a opção `--innodb-rollback-on-timeout`. Veja também a Seção 17.21.5, “Tratamento de Erros do InnoDB”.

  Você pode diminuir esse valor para aplicações altamente interativas ou sistemas OLTP, para exibir o feedback do usuário rapidamente ou colocar a atualização em uma fila para processamento mais tarde. Você pode aumentar esse valor para operações de back-end de longa duração, como uma etapa de transformação em um data warehouse que espera que outras grandes operações de inserção ou atualização sejam concluídas.

  O `innodb_lock_wait_timeout` se aplica aos bloqueios de linha `InnoDB`. Um bloqueio de tabela do MySQL não ocorre dentro de `InnoDB` e este tempo de espera não se aplica a espera por bloqueios de tabela.

  O valor de espera de bloqueio não se aplica a deadlocks quando o `innodb_deadlock_detect` está habilitado (o padrão), porque o `InnoDB` detecta deadlocks imediatamente e desfaz uma das transações em deadlock. Quando o `innodb_deadlock_detect` está desabilitado, o `InnoDB` depende do `innodb_lock_wait_timeout` para o rollback de transações quando ocorre um deadlock. Veja a Seção 17.7.5.2, “Detecção de Deadlocks”.

  `innodb_lock_wait_timeout` pode ser definido em tempo de execução com as instruções `SET GLOBAL` ou `SET SESSION`. Para alterar o ajuste de `GLOBAL`, é necessário ter privilégios suficientes para definir variáveis de sistema globais (consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”) e isso afeta o funcionamento de todos os clientes que se conectam posteriormente. Qualquer cliente pode alterar o ajuste de `SESSION` para `innodb_lock_wait_timeout`, o que afeta apenas esse cliente.

- `innodb_log_buffer_size`

  <table summary="Propriedades para daemon_memcached_w_batch_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-w-batch-size=#</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_w_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>4

  O tamanho em bytes do buffer que `InnoDB` usa para gravar os arquivos de log no disco. O padrão é de 16 MB. Um buffer de log grande permite que transações grandes sejam executadas sem a necessidade de gravar o log no disco antes do commit das transações. Portanto, se você tiver transações que atualizam, inserem ou excluem muitas linhas, aumentar o tamanho do buffer de log economiza o I/O do disco. Para informações relacionadas, consulte Configuração de Memória e Seção 10.5.4, “Otimizando o Registro de Redo do InnoDB”. Para conselhos gerais sobre o ajuste de I/O, consulte Seção 10.5.8, “Otimizando o I/O do Disco do InnoDB”.

- `innodb_log_checkpoint_fuzzy_now`

  <table summary="Propriedades para daemon_memcached_w_batch_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-w-batch-size=#</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_w_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>5

  Ative esta opção de depuração para forçar o `InnoDB` a escrever um ponto de verificação difuso. Esta opção só está disponível se o suporte de depuração estiver compilado usando a opção `WITH_DEBUG` **CMake**.

- `innodb_log_checkpoint_now`

  <table summary="Propriedades para daemon_memcached_w_batch_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-w-batch-size=#</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_w_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>6

  Ative esta opção de depuração para forçar o `InnoDB` a escrever um ponto de verificação. Esta opção só está disponível se o suporte de depuração estiver compilado usando a opção `WITH_DEBUG` **CMake**.

- `innodb_log_checksums`

  <table summary="Propriedades para daemon_memcached_w_batch_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-w-batch-size=#</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_w_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>7

  Habilita ou desabilita verificações de checksums para páginas do log de reverso.

  O `innodb_log_checksums=ON` habilita o algoritmo de verificação de checksum `CRC-32C` para páginas de log de refazer. Quando o `innodb_log_checksums` é desativado, o conteúdo do campo de verificação de checksum da página de log de refazer é ignorado.

  Os checksums nas páginas do cabeçalho do log de refazer e nas páginas de verificação de ponto de controle do log de refazer nunca são desativados.

- `innodb_log_compressed_pages`

  <table summary="Propriedades para daemon_memcached_w_batch_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-w-batch-size=#</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_w_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>8

  Especifica se as imagens das páginas recompressas são escritas no log de refazer. A recompressão pode ocorrer quando alterações são feitas nos dados comprimidos.

  `innodb_log_compressed_pages` está habilitado por padrão para evitar corrupções que poderiam ocorrer se uma versão diferente do algoritmo de compressão `zlib` fosse usada durante a recuperação. Se você tem certeza de que a versão `zlib` não está sujeita a alterações, pode desabilitar `innodb_log_compressed_pages` para reduzir a geração de log de revisão para cargas de trabalho que modificam dados comprimidos.

  Para medir o efeito de habilitar ou desabilitar `innodb_log_compressed_pages`, compare a geração de log de revisão para ambas as configurações sob a mesma carga de trabalho. As opções para medir a geração de log de revisão incluem observar o `Log sequence number` (LSN) na seção `LOG` do output do `SHOW ENGINE INNODB STATUS`, ou monitorar o status do `Innodb_os_log_written` para o número de bytes escritos nos arquivos de log de revisão.

  Para informações relacionadas, consulte a Seção 17.9.1.6, “Compressão para cargas de trabalho OLTP”.

- `innodb_log_file_size`

  <table summary="Propriedades para daemon_memcached_w_batch_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon-memcached-w-batch-size=#</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.22</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>daemon_memcached_w_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>9

  Nota

  `innodb_log_file_size` e `innodb_log_files_in_group` são desaconselhados no MySQL 8.0.30. Essas variáveis são substituídas por `innodb_redo_log_capacity`. Para mais informações, consulte a Seção 17.6.5, “Registro de Refazer”.

  O tamanho em bytes de cada arquivo de registro em um grupo de registros. O tamanho combinado dos arquivos de registro (`innodb_log_file_size` \* `innodb_log_files_in_group`) não pode exceder um valor máximo que é ligeiramente inferior a 512 GB. Um par de arquivos de registro de 255 GB, por exemplo, se aproxima do limite, mas não o ultrapassa. O valor padrão é de 48 MB.

  Geralmente, o tamanho combinado dos arquivos de registro deve ser grande o suficiente para que o servidor possa suavizar picos e vales na atividade da carga de trabalho, o que muitas vezes significa que há espaço suficiente no pool de log redo para lidar com mais de uma hora de atividade de escrita. Quanto maior o valor, menor será a atividade de esvaziamento do checkpoint no pool de buffer, economizando I/O no disco. Arquivos de registro maiores também tornam a recuperação após falhas mais lenta.

  O mínimo `innodb_log_file_size` é de 4 MB.

  Para informações relacionadas, consulte Configuração do Log de Refazer. Para conselhos gerais sobre o ajuste de E/S, consulte a Seção 10.5.8, “Otimização do E/S de Disco do InnoDB”.

  Se o servidor for iniciado com `--innodb-dedicated-server`, o valor de `innodb_log_file_size` será definido automaticamente, caso não seja explicitamente definido. Para mais informações, consulte a Seção 17.8.12, “Habilitar Configuração Automática do InnoDB para um Servidor MySQL Dedicado”.

- `innodb_log_files_in_group`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>00

  Nota

  `innodb_log_file_size` e `innodb_log_files_in_group` são desaconselhados no MySQL 8.0.30. Essas variáveis são substituídas por `innodb_redo_log_capacity`. Para mais informações, consulte a Seção 17.6.5, “Registro de Refazer”.

  O número de arquivos de registro na grupo de registro. `InnoDB` escreve nos arquivos de forma circular. O valor padrão (e recomendado) é 2. A localização dos arquivos é especificada por `innodb_log_group_home_dir`. O tamanho combinado dos arquivos de registro (`innodb_log_file_size` \* `innodb_log_files_in_group`) pode chegar a 512 GB.

  Para informações relacionadas, consulte Configuração do Log de Refazer.

  Se o servidor for iniciado com `--innodb-dedicated-server`, o valor de `innodb_log_files_in_group` será definido automaticamente, caso não seja explicitamente definido. Para mais informações, consulte a Seção 17.8.12, “Habilitar Configuração Automática do InnoDB para um Servidor MySQL Dedicado”.

- `innodb_log_group_home_dir`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>01

  O caminho do diretório dos arquivos de registro de refazer `InnoDB`.

  Para informações relacionadas, consulte Configuração do Log de Refazer.

- `innodb_log_spin_cpu_abs_lwm`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>02

  Define o valor mínimo de uso da CPU abaixo do qual os threads do usuário não giram mais enquanto aguardam o redo esvaziado. O valor é expresso como uma soma do uso de núcleos da CPU. Por exemplo, o valor padrão de 80 é 80% de um único núcleo da CPU. Em um sistema com um processador multi-core, um valor de 150 representa 100% de uso de um núcleo da CPU mais 50% de uso de um segundo núcleo da CPU.

  Para informações relacionadas, consulte a Seção 10.5.4, “Otimização do Registro de Redo InnoDB”.

- `innodb_log_spin_cpu_pct_hwm`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>03

  Define o valor máximo de uso da CPU acima do qual os threads do usuário não giram mais enquanto aguardam a reinicialização do redo. O valor é expresso como uma porcentagem do poder de processamento total combinado de todos os núcleos da CPU. O valor padrão é de 50%. Por exemplo, o uso de 100% de dois núcleos da CPU é de 50% do poder de processamento total da CPU em um servidor com quatro núcleos da CPU.

  A variável `innodb_log_spin_cpu_pct_hwm` respeita a afinidade do processador. Por exemplo, se um servidor tiver 48 núcleos, mas o processo **mysqld** estiver vinculado apenas a quatro núcleos da CPU, os outros 44 núcleos da CPU serão ignorados.

  Para informações relacionadas, consulte a Seção 10.5.4, “Otimização do Registro de Redo InnoDB”.

- `innodb_log_wait_for_flush_spin_hwm`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>04

  Define o tempo médio máximo de esvaziamento do log após o qual os threads do usuário não giram mais enquanto aguardam o redo esvaziado. O valor padrão é de 400 microsegundos.

  Para informações relacionadas, consulte a Seção 10.5.4, “Otimização do Registro de Redo InnoDB”.

- `innodb_log_write_ahead_size`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>05

  Define o tamanho do bloco de pré-gravação para o log de refazer, em bytes. Para evitar o "leitura durante a gravação", defina `innodb_log_write_ahead_size` para corresponder ao tamanho do bloco de cache do sistema operacional ou do sistema de arquivos. O ajuste padrão é de 8192 bytes. A leitura durante a gravação ocorre quando os blocos do log de refazer não são completamente armazenados no cache do sistema operacional ou do sistema de arquivos devido a uma incompatibilidade entre o tamanho do bloco de pré-gravação do log de refazer e o tamanho do bloco de cache do sistema operacional ou do sistema de arquivos.

  Os valores válidos para `innodb_log_write_ahead_size` são múltiplos do tamanho do bloco de arquivo de log `InnoDB` (2n). O valor mínimo é o tamanho do bloco de arquivo de log `InnoDB` (512). O pré-armazenamento não ocorre quando o valor mínimo é especificado. O valor máximo é igual ao valor de `innodb_page_size`. Se você especificar um valor para `innodb_log_write_ahead_size` que é maior que o valor de `innodb_page_size`, o ajuste `innodb_log_write_ahead_size` é truncado para o valor de `innodb_page_size`.

  Definir o valor `innodb_log_write_ahead_size` muito baixo em relação ao tamanho do bloco de cache do sistema operacional ou do sistema de arquivos resulta em "leitura-gravação". Definir o valor muito alto pode ter um pequeno impacto no desempenho do `fsync` para gravações de arquivos de log devido ao fato de vários blocos serem escritos de uma só vez.

  Para informações relacionadas, consulte a Seção 10.5.4, “Otimização do Registro de Redo InnoDB”.

- `innodb_log_writer_threads`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>06

  Habilita threads dedicadas para gravação de logs que permitem a escrita de registros do log de refazer do buffer de log para os buffers do sistema e o esvaziamento dos buffers do sistema para os arquivos de log de refazer. Threads dedicadas para gravação de logs podem melhorar o desempenho em sistemas de alta concorrência, mas, para sistemas de baixa concorrência, desativar as threads dedicadas para gravação de logs oferece um melhor desempenho.

  Para obter mais informações, consulte a Seção 10.5.4, “Otimização do registro de reinicialização do InnoDB”.

- `innodb_lru_scan_depth`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>07

  Um parâmetro que influencia os algoritmos e heurísticas para a operação de limpeza do pool de buffers `InnoDB`. Principalmente de interesse para especialistas em desempenho que ajustam cargas de trabalho intensivas em I/O. Ele especifica, por instância do pool de buffers, até que ponto o thread de limpeza de página do pool de buffers examina a lista de páginas LRU em busca de páginas sujas para serem limpas. Esta é uma operação em segundo plano realizada uma vez por segundo.

  Um valor menor que o padrão é geralmente adequado para a maioria das cargas de trabalho. Um valor muito maior do que o necessário pode afetar o desempenho. Considere apenas aumentar o valor se você tiver capacidade de E/S adicional sob uma carga de trabalho típica. Por outro lado, se uma carga de trabalho intensiva em escrita saturar sua capacidade de E/S, diminua o valor, especialmente no caso de um grande pool de buffers.

  Ao ajustar `innodb_lru_scan_depth`, comece com um valor baixo e configure a configuração para cima com o objetivo de raramente ver páginas livres zero. Além disso, considere ajustar `innodb_lru_scan_depth` ao alterar o número de instâncias do pool de buffers, pois `innodb_lru_scan_depth` \* `innodb_buffer_pool_instances` define a quantidade de trabalho realizada pelo fio de limpeza de páginas a cada segundo.

  Para informações relacionadas, consulte a Seção 17.8.3.5, “Configurando o Limpeza do Pool de Armazenamento de Buffer”. Para conselhos gerais sobre o ajuste de E/S, consulte a Seção 10.5.8, “Otimizando o E/S de Disco do InnoDB”.

- `innodb_max_dirty_pages_pct`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>08

  `InnoDB` tenta limpar os dados do pool de buffer para que a porcentagem de páginas sujas não ultrapasse esse valor.

  A configuração `innodb_max_dirty_pages_pct` estabelece um alvo para a atividade de esvaziamento. Ela não afeta a taxa de esvaziamento. Para obter informações sobre como gerenciar a taxa de esvaziamento, consulte a Seção 17.8.3.5, “Configurando o esvaziamento do Pool de Armazenamento de Buffer”.

  Para informações relacionadas, consulte a Seção 17.8.3.5, “Configurando o Limpeza do Pool de Armazenamento de Buffer”. Para conselhos gerais sobre o ajuste de E/S, consulte a Seção 10.5.8, “Otimizando o E/S de Disco do InnoDB”.

- `innodb_max_dirty_pages_pct_lwm`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>09

  Define uma marca de água baixa que representa a porcentagem de páginas sujas para a qual o pré-lavagem é habilitado para controlar a proporção de páginas sujas. Um valor de 0 desabilita o comportamento de pré-lavagem completamente. O valor configurado deve sempre ser menor que o valor `innodb_max_dirty_pages_pct`. Para mais informações, consulte a Seção 17.8.3.5, “Configurando a Lavagem do Pool de Buffer”.

- `innodb_max_purge_lag`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>10

  Define o atraso máximo desejado para a purga. Se esse valor for excedido, uma demora é imposta nas operações `INSERT`, `UPDATE` e `DELETE` para permitir que a purga alcance o ritmo desejado. O valor padrão é 0, o que significa que não há atraso máximo para a purga e nenhuma demora.

  Para obter mais informações, consulte a Seção 17.8.9, “Configuração de Limpeza”.

- `innodb_max_purge_lag_delay`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>11

  Especifica o atraso máximo em microsegundos para o atraso imposto quando o limite `innodb_max_purge_lag` é excedido. O valor especificado `innodb_max_purge_lag_delay` é um limite superior para o período de atraso calculado pela fórmula `innodb_max_purge_lag`.

  Para obter mais informações, consulte a Seção 17.8.9, “Configuração de Limpeza”.

- `innodb_max_undo_log_size`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>12

  Define um tamanho limite para os espaços de tabelas de desfazer. Se um espaço de tabelas de desfazer exceder esse limite, ele pode ser marcado para truncação quando o `innodb_undo_log_truncate` estiver habilitado. O valor padrão é de 1073741824 bytes (1024 MiB).

  Para obter mais informações, consulte "Truncando espaços de tabelas Undo".

- `innodb_merge_threshold_set_all_debug`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>13

  Define um valor percentual para páginas de índice que substitui o ajuste atual do `MERGE_THRESHOLD` para todos os índices que estão atualmente no cache do dicionário. Esta opção só está disponível se o suporte de depuração estiver compilado usando a opção `WITH_DEBUG` **CMake**. Para informações relacionadas, consulte a Seção 17.8.11, “Configurando o Limite de Fusão para Páginas de Índice”.

- `innodb_monitor_disable`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>14

  Essa variável atua como um interruptor, desabilitando os contadores de métricas `InnoDB`. Os dados dos contadores podem ser consultados usando a tabela do esquema de informações `INNODB_METRICS`. Para informações de uso, consulte a Seção 17.15.6, “Tabela de Métricas do Esquema de Informações InnoDB”.

  `innodb_monitor_disable='latch'` desativa a coleta de estatísticas para `SHOW ENGINE INNODB MUTEX`. Para mais informações, consulte a Seção 15.7.7.15, “Instrução SHOW ENGINE”.

- `innodb_monitor_enable`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>15

  Essa variável atua como um interruptor, permitindo o uso dos contadores de métricas `InnoDB`. Os dados dos contadores podem ser consultados usando a tabela do esquema de informações `INNODB_METRICS`. Para informações de uso, consulte a Seção 17.15.6, “Tabela de Métricas do Esquema de Informações InnoDB”.

  `innodb_monitor_enable='latch'` permite a coleta de estatísticas para `SHOW ENGINE INNODB MUTEX`. Para mais informações, consulte a Seção 15.7.7.15, “Instrução SHOW ENGINE”.

- `innodb_monitor_reset`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>16

  Essa variável atua como um interruptor, redefinindo o valor de contagem para os contadores de métricas `InnoDB`. Os dados do contador podem ser consultados usando a tabela do esquema de informações `INNODB_METRICS`. Para informações de uso, consulte a Seção 17.15.6, “Tabela de Métricas do Esquema de Informações InnoDB”.

  `innodb_monitor_reset='latch'` redefiniu as estatísticas relatadas por `SHOW ENGINE INNODB MUTEX`. Para mais informações, consulte a Seção 15.7.7.15, “Instrução SHOW ENGINE”.

- `innodb_monitor_reset_all`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>17

  Essa variável atua como um interruptor, redefinindo todos os valores (mínimo, máximo, etc.) para os contadores de métricas `InnoDB`. Os dados do contador podem ser consultados usando a tabela do Esquema de Informações `INNODB_METRICS`. Para informações de uso, consulte a Seção 17.15.6, “Tabela de Métricas do Esquema de Informações InnoDB”.

- `innodb_numa_interleave`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>18

  Habilita a política de interligação de memória NUMA para a alocação do pool de búferes `InnoDB`. Quando o `innodb_numa_interleave` é habilitado, a política de memória NUMA é definida para `MPOL_INTERLEAVE` para o processo **mysqld**. Após a alocação do pool de búferes `InnoDB`, a política de memória NUMA é redefinida para `MPOL_DEFAULT`. Para que a opção `innodb_numa_interleave` esteja disponível, o MySQL deve ser compilado em um sistema Linux habilitado para NUMA.

  O **CMake** define o valor padrão do `WITH_NUMA` com base no suporte do `NUMA` na plataforma atual. Para mais informações, consulte a Seção 2.8.7, “Opções de Configuração de Código de Fonte do MySQL”.

- `innodb_old_blocks_pct`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>19

  Especifica a porcentagem aproximada do pool de buffers `InnoDB` usado para a sublista de blocos antigos. A faixa de valores é de 5 a 95. O valor padrão é 37 (ou seja, 3/8 do pool). Frequentemente usado em combinação com `innodb_old_blocks_time`.

  Para obter mais informações, consulte a Seção 17.8.3.3, “Tornando o Scan do Pool de Armazenamento de Buffer Resistente”. Para informações sobre a gestão do pool de armazenamento de buffer, o algoritmo LRU e as políticas de remoção, consulte a Seção 17.5.1, “Pool de Armazenamento de Buffer”.

- `innodb_old_blocks_time`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>20

  Valores não nulos protegem o pool de buffers de serem preenchidos com dados que são referenciados apenas por um curto período, como durante uma varredura completa da tabela. Aumentar esse valor oferece mais proteção contra varreduras completas da tabela que interfiram com os dados armazenados no pool de buffers.

  Especifica por quantos milissegundos um bloco inserido na antiga sublista deve permanecer lá após seu primeiro acesso antes de poder ser movido para a nova sublista. Se o valor for 0, um bloco inserido na antiga sublista se move imediatamente para a nova sublista na primeira vez que é acessado, independentemente de quanto tempo após a inserção o acesso ocorrer. Se o valor for maior que 0, os blocos permanecem na antiga sublista até que um acesso ocorra, pelo menos, tantos milissegundos após o primeiro acesso. Por exemplo, um valor de 1000 faz com que os blocos permaneçam na antiga sublista por 1 segundo após o primeiro acesso antes de se tornarem elegíveis para serem movidos para a nova sublista.

  O valor padrão é 1000.

  Essa variável é frequentemente usada em combinação com `innodb_old_blocks_pct`. Para mais informações, consulte a Seção 17.8.3.3, “Tornando a varredura do Pool de Armazenamento de Buffer Resistente”. Para informações sobre a gestão do Pool de Armazenamento de Buffer, o algoritmo LRU e as políticas de despejo, consulte a Seção 17.5.1, “Pool de Armazenamento de Buffer”.

- `innodb_online_alter_log_max_size`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>21

  Especifica um limite superior em bytes para o tamanho dos arquivos de registro temporários usados durante operações DDL online para tabelas de `InnoDB`. Há um arquivo de registro para cada índice sendo criado ou tabela sendo alterada. Esse arquivo de registro armazena os dados inseridos, atualizados ou excluídos na tabela durante a operação DDL. O arquivo de registro temporário é estendido conforme necessário pelo valor de `innodb_sort_buffer_size`, até o máximo especificado por `innodb_online_alter_log_max_size`. Se um arquivo de registro temporário exceder o limite de tamanho superior, a operação `ALTER TABLE` falha e todas as operações DML concorrentes não confirmadas são revertidas. Assim, um valor grande para essa opção permite que mais DML ocorra durante uma operação DDL online, mas também estende o período de tempo no final da operação DDL quando a tabela é bloqueada para aplicar os dados do log.

- `innodb_open_files`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>22

  Especifica o número máximo de arquivos que o `InnoDB` pode ter abertos de uma só vez. O valor mínimo é 10. Se o `innodb_file_per_table` estiver desativado, o valor padrão é 300; caso contrário, o valor padrão é 300 ou o ajuste do `table_open_cache`, dependendo do que for maior.

  A partir do MySQL 8.0.28, o limite `innodb_open_files` pode ser definido em tempo de execução usando uma instrução `SELECT innodb_set_open_files_limit(N)`, onde `N` é o limite desejado `innodb_open_files`; por exemplo:

  ```
  mysql> SELECT innodb_set_open_files_limit(1000);
  ```

  A declaração executa um procedimento armazenado que define o novo limite. Se o procedimento for bem-sucedido, ele retorna o valor do limite recém-definido; caso contrário, uma mensagem de falha é retornada.

  Não é permitido definir `innodb_open_files` usando uma declaração `SET`. Para definir `innodb_open_files` em tempo de execução, use a declaração `SELECT innodb_set_open_files_limit(N)` descrita acima.

  A definição de `innodb_open_files=default` não é suportada. Apenas valores inteiros são permitidos.

  A partir do MySQL 8.0.28, para evitar que arquivos gerenciados fora do LRU consumam todo o limite `innodb_open_files`, os arquivos gerenciados fora do LRU estão limitados a 90% do limite `innodb_open_files`, que reserva 10% do limite `innodb_open_files` para arquivos gerenciados pelo LRU.

  Os arquivos de espaço de tabela temporários não eram contabilizados para o limite `innodb_open_files` do MySQL 8.0.24 ao MySQL 8.0.27.

- `innodb_optimize_fulltext_only`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>23

  Altera a forma como o `OPTIMIZE TABLE` opera nas tabelas `InnoDB`. Destinado a ser ativado temporariamente, durante operações de manutenção para tabelas `InnoDB` com índices `FULLTEXT`.

  Por padrão, `OPTIMIZE TABLE` reorganiza os dados no índice agrupado da tabela. Quando essa opção está habilitada, `OPTIMIZE TABLE` ignora a reorganização dos dados da tabela e, em vez disso, processa os dados de token recém-adicionados, excluídos e atualizados para os índices `InnoDB` `FULLTEXT` da tabela. Para obter mais informações, consulte Otimização de índices de texto completos do InnoDB.

- `innodb_page_cleaners`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>24

  O número de threads de limpeza de páginas que limpam páginas sujas das instâncias do pool de buffers. As threads de limpeza de páginas realizam a limpeza da lista de buffers e a limpeza LRU. Quando há várias threads de limpeza de páginas, as tarefas de limpeza do buffer para cada instância do pool de buffers são enviadas para as threads de limpeza de páginas ociosas. O valor padrão de `innodb_page_cleaners` é 4. Se o número de threads de limpeza de páginas exceder o número de instâncias do pool de buffers, `innodb_page_cleaners` é automaticamente definido para o mesmo valor que `innodb_buffer_pool_instances`.

  Se sua carga de trabalho estiver ligada à escrita de I/O ao descartar páginas sujas das instâncias do pool de buffers para os arquivos de dados, e se o hardware do seu sistema tiver capacidade disponível, aumentar o número de threads do limpador de páginas pode ajudar a melhorar o desempenho da escrita de I/O.

  O suporte para limpeza de páginas multithread é estendido para as fases de desligamento e recuperação.

  A chamada de sistema `setpriority()` é usada em plataformas Linux, onde é suportada, e onde o usuário de execução **mysqld** está autorizado a dar prioridade a `page_cleaner` threads sobre outros threads MySQL e `InnoDB` para ajudar a manter o sincronismo com a carga de trabalho atual. O suporte a `setpriority()` é indicado por esta mensagem de inicialização `InnoDB`:

  ```
  [Note] InnoDB: If the mysqld execution user is authorized, page cleaner
  thread priority can be changed. See the man page of setpriority().
  ```

  Para sistemas onde o início e o término do servidor não são gerenciados pelo systemd, a autorização de execução do usuário **mysqld** pode ser configurada em `/etc/security/limits.conf`. Por exemplo, se o **mysqld** for executado sob o usuário `mysql`, você pode autorizar o usuário `mysql` adicionando essas linhas em `/etc/security/limits.conf`:

  ```
  mysql              hard    nice       -20
  mysql              soft    nice       -20
  ```

  Para sistemas gerenciados pelo systemd, o mesmo pode ser alcançado especificando `LimitNICE=-20` em um arquivo de configuração localizado do systemd. Por exemplo, crie um arquivo chamado `override.conf` em `/etc/systemd/system/mysqld.service.d/override.conf` e adicione esta entrada:

  ```
  [Service]
  LimitNICE=-20
  ```

  Após criar ou alterar `override.conf`, recarregue a configuração do systemd e, em seguida, peça ao systemd para reiniciar o serviço MySQL:

  ```
  systemctl daemon-reload
  systemctl restart mysqld  # RPM platforms
  systemctl restart mysql   # Debian platforms
  ```

  Para obter mais informações sobre como usar um arquivo de configuração do systemd localizado, consulte Configurando o systemd para MySQL.

  Após autorizar o usuário de execução do **mysqld**, use o comando **cat** para verificar os limites configurados do `Nice` para o processo **mysqld**:

  ```
  $> cat /proc/mysqld_pid/limits | grep nice
  Max nice priority         18446744073709551596 18446744073709551596
  ```

- `innodb_page_size`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>25

  Especifica o tamanho da página para os espaços de tabelas `InnoDB`. Os valores podem ser especificados em bytes ou kilobytes. Por exemplo, um valor de tamanho de página de 16 kilobytes pode ser especificado como 16384, 16KB ou 16k.

  `innodb_page_size` só pode ser configurado antes de inicializar a instância do MySQL e não pode ser alterado depois. Se nenhum valor for especificado, a instância é inicializada com o tamanho de página padrão. Consulte a Seção 17.8.1, “Configuração de Inicialização do InnoDB”.

  Para tamanhos de página de 32 KB e 64 KB, o comprimento máximo da linha é de aproximadamente 16.000 bytes. `ROW_FORMAT=COMPRESSED` não é suportado quando `innodb_page_size` está definido para 32 KB ou 64 KB. Para `innodb_page_size=32KB`, o tamanho do escopo é de 2 MB. Para `innodb_page_size=64KB`, o tamanho do escopo é de 4 MB. `innodb_log_buffer_size` deve ser definido para pelo menos 16 M (o padrão) ao usar tamanhos de página de 32 KB ou 64 KB.

  O tamanho padrão de página de 16 KB ou maior é apropriado para uma ampla gama de cargas de trabalho, especialmente para consultas que envolvem varreduras de tabelas e operações de manipulação de dados de massa (DML) que envolvem atualizações em massa. Tamanhos de página menores podem ser mais eficientes para cargas de trabalho OLTP que envolvem muitos pequenos registros, onde a concorrência pode ser um problema quando páginas únicas contêm muitas linhas. Páginas menores também podem ser eficientes com dispositivos de armazenamento SSD, que geralmente usam tamanhos de bloco pequenos. Manter o tamanho da página `InnoDB` próximo ao tamanho do bloco do dispositivo de armazenamento minimiza a quantidade de dados não alterados que são reescritos no disco.

  O tamanho mínimo do arquivo para o primeiro arquivo de dados do espaço de tabela do sistema (`ibdata1`) difere dependendo do valor de `innodb_page_size`. Consulte a descrição da opção `innodb_data_file_path` para obter mais informações.

  Uma instância do MySQL que utiliza um tamanho de página específico `InnoDB` não pode usar arquivos de dados ou arquivos de log de uma instância que utiliza um tamanho de página diferente.

  Para obter conselhos gerais sobre o ajuste de E/S, consulte a Seção 10.5.8, “Otimização do E/S do disco InnoDB”.

- `innodb_parallel_read_threads`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>26

  Define o número de threads que podem ser usados para leituras paralelas de índices agrupados. A varredura paralela de partições é suportada a partir do MySQL 8.0.17. Os threads de leitura paralela podem melhorar o desempenho do `CHECK TABLE`. As leituras `InnoDB` do índice agrupado são realizadas duas vezes durante uma operação `CHECK TABLE`. A segunda leitura pode ser realizada em paralelo. Este recurso não se aplica às varreduras de índices secundários. A variável de sessão `innodb_parallel_read_threads` deve ser definida para um valor maior que 1 para que as leituras paralelas de índices agrupados ocorram. O número real de threads usados para realizar uma leitura paralela de índice agrupado é determinado pelo ajuste `innodb_parallel_read_threads` ou pelo número de subárvores de índice a serem varridas, o que for menor. As páginas lidas no pool de buffers durante a varredura são mantidas na extremidade da lista LRU do pool de buffers para que possam ser descartadas rapidamente quando forem necessárias páginas livres no pool de buffers.

  A partir do MySQL 8.0.17, o número máximo de threads de leitura paralelas (256) é o número total de threads para todas as conexões de cliente. Se o limite de threads for atingido, as conexões retornam a usar uma única thread.

- `innodb_print_all_deadlocks`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>27

  Quando essa opção está habilitada, as informações sobre todos os bloqueios em transações de usuários `InnoDB` são registradas no log de erro `mysqld`. Caso contrário, você verá informações apenas sobre o último bloqueio, usando o comando `SHOW ENGINE INNODB STATUS`. Um bloqueio ocasional `InnoDB` não é necessariamente um problema, porque `InnoDB` detecta a condição imediatamente e desfaz uma das transações automaticamente. Você pode usar essa opção para solucionar o motivo pelo qual os bloqueios estão ocorrendo, se um aplicativo não tiver a lógica apropriada de tratamento de erros para detectar o rollback e tentar novamente sua operação. Um grande número de bloqueios pode indicar a necessidade de reestruturar transações que emitem instruções DML ou `SELECT ... FOR UPDATE` para múltiplas tabelas, para que cada transação acesse as tabelas na mesma ordem, evitando assim a condição de bloqueio.

  Para informações relacionadas, consulte a Seção 17.7.5, "Bloqueios em InnoDB".

- `innodb_print_ddl_logs`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>28

  Ativação desta opção faz com que o MySQL escreva logs de DDL em `stderr`. Para mais informações, consulte Visualizar logs de DDL.

- `innodb_purge_batch_size`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>29

  Define o número de páginas do log de desfazer que são limpas e processadas em um lote da lista de histórico. Em uma configuração de limpeza multisserial, o fio de limpeza do coordenador divide `innodb_purge_batch_size` por `innodb_purge_threads` e atribui esse número de páginas a cada fio de limpeza. A variável `innodb_purge_batch_size` também define o número de páginas do log de desfazer que são liberadas após cada 128 iterações pelos logs de desfazer.

  A opção `innodb_purge_batch_size` é destinada ao ajuste avançado de desempenho em combinação com a configuração `innodb_purge_threads`. A maioria dos usuários não precisa alterar `innodb_purge_batch_size` do seu valor padrão.

  Para informações relacionadas, consulte a Seção 17.8.9, “Configuração de Purga”.

- `innodb_purge_threads`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>30

  O número de threads de plano de fundo dedicados à operação de purga `InnoDB`. Aumentar o valor cria threads de purga adicionais, o que pode melhorar a eficiência em sistemas onde operações de DML são realizadas em várias tabelas.

  Para informações relacionadas, consulte a Seção 17.8.9, “Configuração de Purga”.

- `innodb_purge_rseg_truncate_frequency`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>31

  Define a frequência com que o sistema de purga libera segmentos de rollback em termos do número de vezes que a purga é invocada. Um espaço de tabela de desfazer não pode ser truncado até que seus segmentos de rollback sejam liberados. Normalmente, o sistema de purga libera segmentos de rollback uma vez a cada 128 vezes que a purga é invocada. O valor padrão é 128. Reduzir esse valor aumenta a frequência com que o thread de purga libera segmentos de rollback.

  `innodb_purge_rseg_truncate_frequency` é destinado para uso com `innodb_undo_log_truncate`. Para mais informações, consulte "Truncando Espaços de Tabelas Desfazer".

- `innodb_random_read_ahead`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>32

  Habilita a técnica de leitura antecipada aleatória para otimizar o I/O do `InnoDB`.

  Para obter detalhes sobre as considerações de desempenho para diferentes tipos de solicitações de leitura antecipada, consulte a Seção 17.8.3.4, “Configurando a Pré-visualização do Pool de Buffer do InnoDB (Leitura Antecipada”)”). Para obter conselhos gerais sobre o ajuste de E/S, consulte a Seção 10.5.8, “Otimizando o E/S do Disco do InnoDB”.

- `innodb_read_ahead_threshold`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>33

  Controla a sensibilidade do pré-visualização linear que o `InnoDB` usa para pré-carregar páginas no pool de buffer. Se o `InnoDB` lê pelo menos `innodb_read_ahead_threshold` páginas sequencialmente de um intervalo (64 páginas), ele inicia uma leitura assíncrona para todo o intervalo seguinte. A faixa de valores permitida é de 0 a 64. Um valor de 0 desabilita a pré-visualização. Para o valor padrão de 56, o `InnoDB` deve ler pelo menos 56 páginas sequencialmente de um intervalo para iniciar uma leitura assíncrona para o intervalo seguinte.

  Saber quantos páginas são lidas através do mecanismo de leitura antecipada e quantas dessas páginas são expulsas do pool de buffer sem serem acessadas nunca pode ser útil ao ajustar o ajuste `innodb_read_ahead_threshold`. A saída `SHOW ENGINE INNODB STATUS` exibe informações do contador das variáveis de status globais `Innodb_buffer_pool_read_ahead` e `Innodb_buffer_pool_read_ahead_evicted`, que relatam o número de páginas trazidas para o pool de buffer por solicitações de leitura antecipada e o número de páginas expulsas do pool de buffer sem serem acessadas nunca, respectivamente. As variáveis de status relatam valores globais desde o último reinício do servidor.

  `SHOW ENGINE INNODB STATUS` também mostra a taxa na qual as páginas de leitura antecipada são lidas e a taxa na qual essas páginas são expulsas sem serem acessadas. As médias por segundo são baseadas nas estatísticas coletadas desde a última invocação de `SHOW ENGINE INNODB STATUS` e são exibidas na seção `BUFFER POOL AND MEMORY` do `SHOW ENGINE INNODB STATUS` de saída.

  Para obter mais informações, consulte a Seção 17.8.3.4, “Configurando a Pré-visualização do Pool de Buffer InnoDB (Leitura Antecipada”)”). Para obter conselhos gerais sobre o ajuste de E/S, consulte a Seção 10.5.8, “Otimizando o E/S de Disco InnoDB”.

- `innodb_read_io_threads`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>34

  O número de threads de E/S para operações de leitura em `InnoDB`. Sua contraparte para threads de escrita é `innodb_write_io_threads`. Para mais informações, consulte a Seção 17.8.5, “Configurando o Número de Threads de E/S InnoDB em Segundo Plano”. Para conselhos gerais sobre o ajuste de E/S, consulte a Seção 10.5.8, “Otimizando o E/S de Disco InnoDB”.

  Nota

  Em sistemas Linux, executar vários servidores MySQL (geralmente mais de 12) com configurações padrão para os ajustes `innodb_read_io_threads`, `innodb_write_io_threads` e o ajuste `aio-max-nr` do Linux pode exceder os limites do sistema. Idealmente, aumente o ajuste `aio-max-nr`; como solução alternativa, você pode reduzir as configurações de uma ou ambas as variáveis MySQL.

- `innodb_read_only`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>35

  Começa `InnoDB` no modo de leitura somente. Para distribuir aplicações de banco de dados ou conjuntos de dados em mídia de leitura somente. Também pode ser usado em armazéns de dados para compartilhar o mesmo diretório de dados entre múltiplas instâncias. Para mais informações, consulte a Seção 17.8.2, “Configurando o InnoDB para Operação de Leitura Somente”.

  Anteriormente, a ativação da variável de sistema `innodb_read_only` impediu a criação e a remoção de tabelas apenas para o mecanismo de armazenamento `InnoDB`. A partir do MySQL 8.0, a ativação de `innodb_read_only` impede essas operações para todos os mecanismos de armazenamento. As operações de criação e remoção de tabelas para qualquer mecanismo de armazenamento modificam as tabelas do dicionário de dados no banco de dados do sistema `mysql`, mas essas tabelas usam o mecanismo de armazenamento `InnoDB` e não podem ser modificadas quando `innodb_read_only` está ativado. O mesmo princípio se aplica a outras operações de tabela que exigem a modificação de tabelas do dicionário de dados. Exemplos:

  - Se a variável de sistema `innodb_read_only` estiver habilitada, o `ANALYZE TABLE` pode falhar porque ele não pode atualizar as tabelas de estatísticas no dicionário de dados, que usam `InnoDB`. Para operações `ANALYZE TABLE` que atualizam a distribuição de chaves, o erro pode ocorrer mesmo se a operação atualizar a própria tabela (por exemplo, se for uma tabela `MyISAM`). Para obter as estatísticas de distribuição atualizadas, defina `information_schema_stats_expiry=0`.

  - O `ALTER TABLE tbl_name ENGINE=engine_name` falha porque atualiza a designação do motor de armazenamento, que está armazenada no dicionário de dados.

  Além disso, outras tabelas no banco de dados do sistema `mysql` usam o mecanismo de armazenamento `InnoDB` no MySQL 8.0. Tornar essas tabelas apenas de leitura resulta em restrições sobre operações que as modifiquem. Exemplos:

  - Os relatórios de gerenciamento de contas, como `CREATE USER` e `GRANT`, falham porque as tabelas de concessão usam `InnoDB`.

  - As declarações de gerenciamento de plugins `INSTALL PLUGIN` e `UNINSTALL PLUGIN` falham porque a tabela de sistema `mysql.plugin` usa `InnoDB`.

  - As instruções de gerenciamento de funções carregáveis `CREATE FUNCTION` e `DROP FUNCTION` falham porque a tabela de sistema `mysql.func` usa `InnoDB`.

- `innodb_redo_log_archive_dirs`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>36

  Define diretórios com rótulos onde os arquivos de arquivo do log de refazer podem ser criados. Você pode definir vários diretórios com rótulos em uma lista separada por ponto e vírgula. Por exemplo:

  ```
  innodb_redo_log_archive_dirs='label1:/backups1;label2:/backups2'
  ```

  Uma etiqueta pode ser qualquer sequência de caracteres, com exceção dos colchetes (:), que não são permitidos. Uma etiqueta vazia também é permitida, mas o colon (:) ainda é necessário nesse caso.

  Um caminho deve ser especificado e o diretório deve existir. O caminho pode conter dois pontos (:), mas dois pontos e vírgulas (;) não são permitidos.

- `innodb_redo_log_capacity`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>37

  Define a quantidade de espaço em disco ocupado pelos arquivos de log de refazer.

  `innodb_redo_log_capacity` substitui as variáveis `innodb_log_files_in_group` e `innodb_log_file_size`, que são ignoradas se `innodb_redo_log_capacity` for definido.

  Se `innodb_redo_log_capacity` não for definido e se nem `innodb_log_file_size` nem `innodb_log_files_in_group` forem definidos, então o valor padrão de `innodb_redo_log_capacity` será utilizado.

  Se `innodb_redo_log_capacity` não estiver definido e se `innodb_log_file_size` e/ou `innodb_log_files_in_group` estiverem definidos, a capacidade do log de reverso do InnoDB será calculada como *(innodb\_log\_files\_in\_group \* innodb\_log\_file\_size)*. Esse cálculo não altera o valor da configuração `innodb_redo_log_capacity` não utilizada.

  A variável de status do servidor `Innodb_redo_log_capacity_resized` indica a capacidade total do log de reverso para todos os arquivos de log de reverso.

  Se o servidor for iniciado com `--innodb-dedicated-server`, o valor de `innodb_redo_log_capacity` será definido automaticamente, caso não seja explicitamente definido. Para mais informações, consulte a Seção 17.8.12, “Habilitar Configuração Automática do InnoDB para um Servidor MySQL Dedicado”.

  Para obter mais informações, consulte a Seção 17.6.5, “Registro de Refazer”.

- `innodb_redo_log_encrypt`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>38

  Controla a criptografia dos dados do log de revisão para tabelas criptografadas usando o recurso de criptografia de dados em repouso `InnoDB`. A criptografia dos dados do log de revisão é desativada por padrão. Para obter mais informações, consulte Criptografia do Log de Revisão.

- `innodb_replication_delay`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>39

  Atraso do fio de replicação em milissegundos em um servidor de replicação se `innodb_thread_concurrency` for atingido.

- `innodb_rollback_on_timeout`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>40

  `InnoDB` desfaz apenas a última declaração em um tempo limite de transação por padrão. Se `--innodb-rollback-on-timeout` for especificado, um tempo limite de transação faz com que `InnoDB` interrompa e desfaça toda a transação.

  Para obter mais informações, consulte a Seção 17.21.5, “Tratamento de Erros do InnoDB”.

- `innodb_rollback_segments`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>41

  `innodb_rollback_segments` define o número de segmentos de rollback alocados para cada espaço de tabela de desfazer e o espaço de tabela temporária global para transações que geram registros de desfazer. O número de transações que cada segmento de rollback suporta depende do tamanho da página `InnoDB` e do número de logs de desfazer atribuídos a cada transação. Para mais informações, consulte a Seção 17.6.6, “Logs de Desfazer”.

  Para informações relacionadas, consulte a Seção 17.3, “Multiversão InnoDB”. Para informações sobre os espaços de tabelas de desfazer, consulte a Seção 17.6.3.4, “Espaços de tabelas de desfazer”.

- `innodb_saved_page_number_debug`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>42

  Salva um número de página. Definir a opção `innodb_fil_make_page_dirty_debug` suja a página definida por `innodb_saved_page_number_debug`. A opção `innodb_saved_page_number_debug` só está disponível se o suporte de depuração estiver compilado usando a opção `WITH_DEBUG` **CMake**.

- `innodb_segment_reserve_factor`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>43

  Define a porcentagem de páginas de segmentos de arquivo de espaço de tabela reservadas como páginas vazias. O ajuste é aplicável a espaços de tabela por arquivo e espaços de tabela gerais. O ajuste padrão `innodb_segment_reserve_factor` é de 12,5%, que é a mesma porcentagem de páginas reservadas em versões anteriores do MySQL.

  Para obter mais informações, consulte Configurando a porcentagem de páginas de segmentos de arquivo reservados.

- `innodb_sort_buffer_size`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>44

  Esta variável define:

  - O tamanho do buffer de classificação para operações DDL online que criam ou reconstroem índices secundários. No entanto, a partir do MySQL 8.0.27, essa responsabilidade é incorporada pela variável `innodb_ddl_buffer_size`.

  - O valor pelo qual o arquivo de registro temporário é estendido ao registrar DML concorrente durante uma operação de DDL online, e o tamanho do buffer de leitura e do buffer de escrita do arquivo de registro temporário.

  Para informações relacionadas, consulte a Seção 17.12.3, “Requisitos de Espaço DDL Online”.

- `innodb_spin_wait_delay`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>45

  O atraso máximo entre as pesquisas para um bloqueio de rotação. A implementação de nível baixo deste mecanismo varia dependendo da combinação de hardware e sistema operacional, portanto, o atraso não corresponde a um intervalo de tempo fixo.

  Pode ser usado em combinação com a variável `innodb_spin_wait_pause_multiplier` para maior controle sobre a duração dos atrasos de pesquisa de bloqueio de rotação.

  Para obter mais informações, consulte a Seção 17.8.8, “Configurando a Pesquisa de Bloqueio de Rotação”.

- `innodb_spin_wait_pause_multiplier`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>46

  Define um valor de multiplicador usado para determinar o número de instruções PAUSE em loops de espera de rotação que ocorrem quando um thread aguarda para adquirir um mutex ou bloqueio de leitura/escrita.

  Para obter mais informações, consulte a Seção 17.8.8, “Configurando a Pesquisa de Bloqueio de Rotação”.

- `innodb_stats_auto_recalc`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>47

  Faz com que `InnoDB` recalcule automaticamente as estatísticas persistentes após a alteração substancial dos dados em uma tabela. O valor limite é de 10% das linhas da tabela. Esta configuração aplica-se a tabelas criadas quando a opção `innodb_stats_persistent` está habilitada. A recálculo automático das estatísticas também pode ser configurado especificando `STATS_AUTO_RECALC=1` em uma declaração `CREATE TABLE` ou `ALTER TABLE`. A quantidade de dados amostrados para produzir as estatísticas é controlada pela variável `innodb_stats_persistent_sample_pages`.

  Para obter mais informações, consulte a Seção 17.8.10.1, “Configurando Parâmetros de Estatísticas do Optimizer Persistente”.

- `innodb_stats_include_delete_marked`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>48

  Por padrão, `InnoDB` lê dados não comprometidos ao calcular estatísticas. No caso de uma transação não comprometida que exclui linhas de uma tabela, `InnoDB` exclui registros marcados para exclusão ao calcular estimativas de linhas e estatísticas de índices, o que pode levar a planos de execução não ótimos para outras transações que operam na tabela simultaneamente usando um nível de isolamento de transação diferente de `READ UNCOMMITTED`. Para evitar esse cenário, `innodb_stats_include_delete_marked` pode ser habilitado para garantir que `InnoDB` inclua registros marcados para exclusão ao calcular estatísticas do otimizador persistente.

  Quando o `innodb_stats_include_delete_marked` está ativado, o `ANALYZE TABLE` considera os registros marcados para exclusão ao recalcular as estatísticas.

  `innodb_stats_include_delete_marked` é um ajuste global que afeta todas as tabelas `InnoDB`. É aplicável apenas às estatísticas de otimizador persistentes.

  Para informações relacionadas, consulte a Seção 17.8.10.1, “Configurando Parâmetros de Estatísticas do Optimizer Persistente”.

- `innodb_stats_method`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>49

  Como o servidor trata os valores de `NULL` ao coletar estatísticas sobre a distribuição dos valores de índice para as tabelas de `InnoDB`. Os valores permitidos são `nulls_equal`, `nulls_unequal` e `nulls_ignored`. Para `nulls_equal`, todos os valores de índice `NULL` são considerados iguais e formam um único grupo de valores com um tamanho igual ao número de valores de `NULL`. Para `nulls_unequal`, os valores de `NULL` são considerados desiguais, e cada `NULL` forma um grupo de valores distinto de tamanho

  1. Para os valores `nulls_ignored` e `NULL`, os valores são ignorados.

  O método usado para gerar estatísticas de tabela influencia a forma como o otimizador escolhe índices para a execução de consultas, conforme descrito na Seção 10.3.8, “Coleta de Estatísticas de Índices InnoDB e MyISAM”.

- `innodb_stats_on_metadata`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>50

  Esta opção só se aplica quando as estatísticas do otimizador estão configuradas para não serem persistentes. As estatísticas do otimizador não são armazenadas em disco quando o `innodb_stats_persistent` está desativado ou quando tabelas individuais são criadas ou alteradas com o `STATS_PERSISTENT=0`. Para mais informações, consulte a Seção 17.8.10.2, “Configurando Parâmetros de Estatísticas de Otimizador Não Persistentes”.

  Quando `innodb_stats_on_metadata` está habilitado, `InnoDB` atualiza estatísticas não persistentes quando há declarações de metadados, como `SHOW TABLE STATUS` ou ao acessar as tabelas do Schema de Informações `TABLES` ou `STATISTICS`. (Essas atualizações são semelhantes às que ocorrem para `ANALYZE TABLE`.) Quando desabilitado, `InnoDB` não atualiza estatísticas durante essas operações. Deixar a configuração desabilitada pode melhorar a velocidade de acesso para esquemas que têm um grande número de tabelas ou índices. Também pode melhorar a estabilidade dos planos de execução para consultas que envolvem tabelas `InnoDB`.

  Para alterar a configuração, execute a declaração `SET GLOBAL innodb_stats_on_metadata=mode`, onde `mode` é `ON` ou `OFF` (ou `1` ou `0`). Alterar a configuração requer privilégios suficientes para definir variáveis de sistema globais (consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”) e afeta imediatamente o funcionamento de todas as conexões.

- `innodb_stats_persistent`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>51

  Especifica se as estatísticas do índice `InnoDB` são persistidas no disco. Caso contrário, as estatísticas podem ser recalculadas frequentemente, o que pode levar a variações nos planos de execução das consultas. Esta configuração é armazenada com cada tabela quando a tabela é criada. Você pode definir `innodb_stats_persistent` a nível global antes de criar uma tabela ou usar a cláusula `STATS_PERSISTENT` das instruções `CREATE TABLE` e `ALTER TABLE` para sobrescrever a configuração de nível global e configurar estatísticas persistentes para tabelas individuais.

  Para obter mais informações, consulte a Seção 17.8.10.1, “Configurando Parâmetros de Estatísticas do Optimizer Persistente”.

- `innodb_stats_persistent_sample_pages`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>52

  O número de páginas de índice a serem amostradas ao estimar a cardinalidade e outras estatísticas para uma coluna indexada, como as calculadas por `ANALYZE TABLE`. Aumentar o valor melhora a precisão das estatísticas do índice, o que pode melhorar o plano de execução da consulta, em detrimento do aumento do I/O durante a execução de `ANALYZE TABLE` para uma tabela `InnoDB`. Para mais informações, consulte a Seção 17.8.10.1, “Configurando Parâmetros de Estatísticas do Otimizador Persistente”.

  Nota

  Definir um valor alto para `innodb_stats_persistent_sample_pages` pode resultar em um tempo de execução `ANALYZE TABLE` prolongado. Para estimar o número de páginas de banco de dados acessadas por `ANALYZE TABLE`, consulte a Seção 17.8.10.3, “Estimando a Complexidade da Tabela ANALYZE para Tabelas InnoDB”.

  `innodb_stats_persistent_sample_pages` só se aplica quando `innodb_stats_persistent` está habilitado para uma tabela; quando `innodb_stats_persistent` está desativado, `innodb_stats_transient_sample_pages` se aplica em vez disso.

- `innodb_stats_transient_sample_pages`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>53

  O número de páginas de índice a serem amostradas ao estimar a cardinalidade e outras estatísticas para uma coluna indexada, como as calculadas por `ANALYZE TABLE`. O valor padrão é 8. Aumentar o valor melhora a precisão das estatísticas do índice, o que pode melhorar o plano de execução da consulta, em detrimento do aumento do I/O ao abrir uma tabela `InnoDB` ou recalcular as estatísticas. Para mais informações, consulte a Seção 17.8.10.2, “Configurando Parâmetros de Estatísticas de Otimizador Não Persistente”.

  Nota

  Definir um valor alto para `innodb_stats_transient_sample_pages` pode resultar em um tempo de execução `ANALYZE TABLE` prolongado. Para estimar o número de páginas de banco de dados acessadas por `ANALYZE TABLE`, consulte a Seção 17.8.10.3, “Estimando a Complexidade da Tabela ANALYZE para Tabelas InnoDB”.

  `innodb_stats_transient_sample_pages` só se aplica quando `innodb_stats_persistent` está desativado para uma tabela; quando `innodb_stats_persistent` está ativado, `innodb_stats_persistent_sample_pages` se aplica em vez disso. Toma o lugar de `innodb_stats_sample_pages`. Para mais informações, consulte a Seção 17.8.10.2, “Configurando Parâmetros de Estatísticas de Otimizador Não Persistente”.

- `innodb_status_output`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>54

  Habilita ou desabilita a saída periódica para o monitor padrão `InnoDB`. Também é usado em combinação com `innodb_status_output_locks` para habilitar ou desabilitar a saída periódica para o monitor de bloqueio `InnoDB`. Para mais informações, consulte a Seção 17.17.2, “Habilitando Monitores InnoDB”.

- `innodb_status_output_locks`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>55

  Habilita ou desabilita o Monitor de Bloqueio `InnoDB`. Quando habilitado, o Monitor de Bloqueio `InnoDB` imprime informações adicionais sobre os bloqueios na saída `SHOW ENGINE INNODB STATUS` e na saída periódica impressa no log de erros do MySQL. A saída periódica para o Monitor de Bloqueio `InnoDB` é impressa como parte da saída padrão do Monitor `InnoDB`. Portanto, o Monitor padrão `InnoDB` deve ser habilitado para que o Monitor de Bloqueio `InnoDB` imprima dados no log de erros do MySQL periodicamente. Para mais informações, consulte a Seção 17.17.2, “Habilitando Monitores InnoDB”.

- `innodb_strict_mode`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>56

  Quando o `innodb_strict_mode` está ativado, o `InnoDB` retorna erros em vez de avisos ao verificar opções de tabela inválidas ou incompatíveis.

  Ele verifica se as opções `KEY_BLOCK_SIZE`, `ROW_FORMAT`, `DATA DIRECTORY`, `TEMPORARY` e `TABLESPACE` são compatíveis entre si e com outras configurações.

  `innodb_strict_mode=ON` também permite uma verificação do tamanho da linha ao criar ou alterar uma tabela, para evitar que `INSERT` ou `UPDATE` falhem devido ao registro ser muito grande para o tamanho de página selecionado.

  Você pode habilitar ou desabilitar `innodb_strict_mode` na linha de comando ao iniciar `mysqld`, ou em um arquivo de configuração do MySQL. Você também pode habilitar ou desabilitar `innodb_strict_mode` em tempo de execução com a instrução `SET [GLOBAL|SESSION] innodb_strict_mode=mode`, onde `mode` é `ON` ou `OFF`. Alterar o ajuste de `GLOBAL` requer privilégios suficientes para definir variáveis de sistema globais (veja a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”) e afeta o funcionamento de todos os clientes que se conectam posteriormente. Qualquer cliente pode alterar o ajuste de `SESSION` para `innodb_strict_mode`, e o ajuste afeta apenas esse cliente.

  A partir do MySQL 8.0.26, definir o valor da sessão desta variável de sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

- `innodb_sync_array_size`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>57

  Define o tamanho da matriz de espera do mutex/bloqueio. O aumento do valor divide a estrutura de dados interna usada para coordenar os threads, proporcionando maior concorrência em cargas de trabalho com um grande número de threads em espera. Esta configuração deve ser configurada quando a instância do MySQL está sendo iniciada e não pode ser alterada posteriormente. O aumento do valor é recomendado para cargas de trabalho que frequentemente produzem um grande número de threads em espera, geralmente maior que 768.

- `innodb_sync_spin_loops`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>58

  O número de vezes que um fio espera que um `InnoDB` mutex seja liberado antes que o fio seja suspenso.

- `innodb_sync_debug`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>59

  Habilita a verificação de depuração da sincronização para o mecanismo de armazenamento `InnoDB`. Esta opção só está disponível se o suporte de depuração estiver compilado usando a opção `WITH_DEBUG` **CMake**.

- `innodb_table_locks`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>60

  Se `autocommit = 0`, `InnoDB` honram `LOCK TABLES`; o MySQL não retorna de `LOCK TABLES ... WRITE` até que todos os outros threads tenham liberado todos os seus bloqueios para a tabela. O valor padrão de `innodb_table_locks` é 1, o que significa que `LOCK TABLES` faz com que o InnoDB bloqueie uma tabela internamente se `autocommit = 0`.

  `innodb_table_locks = 0` não tem efeito para tabelas bloqueadas explicitamente com `LOCK TABLES ... WRITE`. Ele tem efeito para tabelas bloqueadas para leitura ou escrita por `LOCK TABLES ... WRITE` implicitamente (por exemplo, por meio de gatilhos) ou por `LOCK TABLES ... READ`.

  Para informações relacionadas, consulte a Seção 17.7, “Modelo de Transição e Bloqueio InnoDB”.

- `innodb_temp_data_file_path`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>61

  Define o caminho relativo, o nome, o tamanho e os atributos dos arquivos de dados do espaço de tabelas temporárias globais. O espaço de tabelas temporárias globais armazena segmentos de rollback para alterações feitas em tabelas temporárias criadas pelo usuário.

  Se não for especificado nenhum valor para `innodb_temp_data_file_path`, o comportamento padrão é criar um único arquivo de dados auto-extensível chamado `ibtmp1` no diretório `innodb_data_home_dir`. O tamanho inicial do arquivo é ligeiramente maior que 12 MB.

  A sintaxe para a especificação de um arquivo de dados de espaço de tabela temporário global inclui o nome do arquivo, o tamanho do arquivo e os atributos `autoextend` e `max`:

  ```
  file_name:file_size[:autoextend[:max:max_file_size]]
  ```

  O arquivo de dados do espaço de tabela temporário global não pode ter o mesmo nome que outro arquivo de dados `InnoDB`. Qualquer inabilidade ou erro ao criar o arquivo de dados do espaço de tabela temporário global é tratado como fatal e o início do servidor é negado.

  Os tamanhos dos arquivos são especificados em KB, MB ou GB, anexando `K`, `M` ou `G` ao valor do tamanho. A soma dos tamanhos dos arquivos deve ser ligeiramente maior que 12 MB.

  O limite de tamanho dos arquivos individuais é determinado pelo sistema operacional. O tamanho do arquivo pode ser maior que 4 GB em sistemas operacionais que suportam arquivos grandes. O uso de partições de disco bruto para arquivos de dados de espaço de tabela temporário global não é suportado.

  Os atributos `autoextend` e `max` podem ser usados apenas para o arquivo de dados especificado na última posição do conjunto `innodb_temp_data_file_path`. Por exemplo:

  ```
  [mysqld]
  innodb_temp_data_file_path=ibtmp1:50M;ibtmp2:12M:autoextend:max:500M
  ```

  A opção `autoextend` faz com que o arquivo de dados aumente automaticamente de tamanho quando ele fica sem espaço livre. O incremento `autoextend` é de 64 MB por padrão. Para modificar o incremento, altere o ajuste da variável `innodb_autoextend_increment`.

  O caminho do diretório para os arquivos de dados do espaço de tabela temporário global é formado pela concatenação dos caminhos definidos por `innodb_data_home_dir` e `innodb_temp_data_file_path`.

  Antes de executar `InnoDB` no modo de leitura somente, defina `innodb_temp_data_file_path` para um local fora do diretório de dados. O caminho deve ser relativo ao diretório de dados. Por exemplo:

  ```
  --innodb-temp-data-file-path=../../../tmp/ibtmp1:12M:autoextend
  ```

  Para obter mais informações, consulte Espaço de tabela temporário global.

- `innodb_temp_tablespaces_dir`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>62

  Define a localização onde o `InnoDB` cria um conjunto de espaços de tabelas temporárias de sessão ao iniciar. O local padrão é o diretório `#innodb_temp` no diretório de dados. É permitido um caminho totalmente qualificado ou um caminho relativo ao diretório de dados.

  A partir do MySQL 8.0.16, os espaços de tabelas temporárias de sessão armazenam sempre tabelas temporárias criadas pelo usuário e tabelas temporárias internas criadas pelo otimizador usando `InnoDB`. (Anteriormente, o mecanismo de armazenamento no disco para tabelas temporárias internas era determinado pela variável de sistema `internal_tmp_disk_storage_engine`, que não é mais suportada. Veja Motor de Armazenamento para Tabelas Temporárias Internas no Disco.)

  Para obter mais informações, consulte Sessões de tabelas temporárias.

- `innodb_thread_concurrency`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>63

  Define o número máximo de threads permitidos dentro de `InnoDB`. Um valor de 0 (o padrão) é interpretado como concorrência infinita (sem limite). Esta variável é destinada ao ajuste de desempenho em sistemas de alta concorrência.

  `InnoDB` tenta manter o número de threads dentro de `InnoDB` menor ou igual ao limite `innodb_thread_concurrency`. As threads que estão esperando por bloqueios não são contadas no número de threads que estão executando simultaneamente.

  A configuração correta depende da carga de trabalho e do ambiente de computação. Considere definir essa variável se sua instância do MySQL compartilhar recursos de CPU com outras aplicações ou se sua carga de trabalho ou número de usuários simultâneos estiverem crescendo. Teste uma gama de valores para determinar a configuração que oferece o melhor desempenho. `innodb_thread_concurrency` é uma variável dinâmica, que permite experimentar com diferentes configurações em um sistema de teste em tempo real. Se uma configuração específica estiver funcionando mal, você pode rapidamente definir `innodb_thread_concurrency` de volta para 0.

  Use as seguintes diretrizes para ajudar a encontrar e manter um ambiente apropriado:

  - Se o número de threads de usuário concorrente para uma carga de trabalho for consistentemente pequeno e não afetar o desempenho, defina `innodb_thread_concurrency=0` (sem limite).

  - Se sua carga de trabalho for consistentemente pesada ou ocasionalmente aumentar, defina um valor `innodb_thread_concurrency` e ajuste-o até encontrar o número de threads que ofereça o melhor desempenho. Por exemplo, suponha que seu sistema tenha tipicamente de 40 a 50 usuários, mas periodicamente o número aumenta para 60, 70 ou mais. Através de testes, você descobre que o desempenho permanece amplamente estável com um limite de 80 usuários simultâneos. Neste caso, defina `innodb_thread_concurrency` para 80.

  - Se você não quiser que `InnoDB` use mais de um determinado número de CPUs virtuais para os threads do usuário (20 CPUs virtuais, por exemplo), defina `innodb_thread_concurrency` para esse número (ou possivelmente menor, dependendo dos testes de desempenho). Se o seu objetivo é isolar o MySQL de outras aplicações, considere vincular o processo `mysqld` exclusivamente às CPUs virtuais. No entanto, esteja ciente de que a vinculação exclusiva pode resultar em uso de hardware não ótimo se o processo `mysqld` não estiver consistentemente ocupado. Nesse caso, você pode vincular o processo `mysqld` às CPUs virtuais, mas permitir que outras aplicações usem algumas ou todas as CPUs virtuais.

    Nota

    Do ponto de vista do sistema operacional, usar uma solução de gerenciamento de recursos para gerenciar como o tempo da CPU é compartilhado entre as aplicações pode ser preferível ao vincular o processo `mysqld`. Por exemplo, você pode atribuir 90% do tempo da CPU virtual a uma determinada aplicação enquanto outros processos críticos *não* estão em execução, e escalar esse valor de volta para 40% quando outros processos críticos *estão* em execução.

  - Em alguns casos, o ajuste `innodb_thread_concurrency` ótimo pode ser menor que o número de CPUs virtuais.

  - Um valor `innodb_thread_concurrency` muito alto pode causar uma regressão de desempenho devido ao aumento da concorrência nos recursos e no sistema interno.

  - Monitore e analise seu sistema regularmente. Alterações na carga de trabalho, no número de usuários ou no ambiente de computação podem exigir que você ajuste o ajuste `innodb_thread_concurrency`.

  Um valor de 0 desativa os contadores `queries inside InnoDB` e `queries in queue` na seção `ROW OPERATIONS` do `SHOW ENGINE INNODB STATUS` de saída.

  Para informações relacionadas, consulte a Seção 17.8.4, “Configurando Concorrência de Fila para InnoDB”.

- `innodb_thread_sleep_delay`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>64

  Quanto tempo os threads `InnoDB` dormem antes de se juntarem à fila `InnoDB`, em microsegundos. O valor padrão é 10000. Um valor de 0 desativa o sono. Você pode definir `innodb_adaptive_max_sleep_delay` para o maior valor que você permitiria para `innodb_thread_sleep_delay`, e `InnoDB` ajusta automaticamente `innodb_thread_sleep_delay` para cima ou para baixo, dependendo da atividade atual de agendamento de threads. Esse ajuste dinâmico ajuda o mecanismo de agendamento de threads a funcionar de forma suave em momentos em que o sistema está levemente carregado ou quando está operando próximo à capacidade máxima.

  Para obter mais informações, consulte a Seção 17.8.4, “Configurando Concorrência de Fila para InnoDB”.

- `innodb_tmpdir`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>65

  Usado para definir um diretório alternativo para arquivos temporários de classificação criados durante operações online `ALTER TABLE` que reconstruem a tabela.

  As operações online `ALTER TABLE` que reconstroem a tabela também criam um arquivo de tabela *intermediário* no mesmo diretório da tabela original. A opção `innodb_tmpdir` não é aplicável aos arquivos de tabela intermediários.

  Um valor válido é qualquer caminho de diretório, exceto o caminho do diretório de dados do MySQL. Se o valor for NULL (o padrão), os arquivos temporários são criados no diretório temporário do MySQL (`$TMPDIR` no Unix, `%TEMP%` no Windows ou o diretório especificado pela opção de configuração `--tmpdir`). Se um diretório for especificado, a existência do diretório e as permissões são verificadas apenas quando `innodb_tmpdir` é configurado usando uma declaração `SET`. Se um sintoma for fornecido em uma string de diretório, o sintoma é resolvido e armazenado como um caminho absoluto. O caminho não deve exceder 512 bytes. Uma operação online `ALTER TABLE` reporta um erro se `innodb_tmpdir` for definido para um diretório inválido. `innodb_tmpdir` substitui o ajuste do MySQL `tmpdir`, mas apenas para operações online `ALTER TABLE`.

  O privilégio `FILE` é necessário para configurar `innodb_tmpdir`.

  A opção `innodb_tmpdir` foi introduzida para ajudar a evitar o esvaziamento de um diretório de arquivos temporários localizado em um sistema de arquivos `tmpfs`. Esses esvaziamentos poderiam ocorrer como resultado de grandes arquivos de classificação temporários criados durante operações online de `ALTER TABLE` que reconstruem a tabela.

  Em ambientes de replicação, considere apenas replicar o ajuste `innodb_tmpdir` se todos os servidores tiverem o mesmo ambiente do sistema operacional. Caso contrário, a replicação do ajuste `innodb_tmpdir` pode resultar em um erro de replicação ao executar operações online `ALTER TABLE` que reconstruam a tabela. Se os ambientes operacionais dos servidores forem diferentes, recomenda-se que você configure `innodb_tmpdir` em cada servidor individualmente.

  Para obter mais informações, consulte a Seção 17.12.3, “Requisitos de Espaço DDL Online”. Para informações sobre operações online `ALTER TABLE`, consulte a Seção 17.12, “InnoDB e DDL Online”.

- `innodb_trx_purge_view_update_only_debug`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>66

  Pausa a limpeza de registros marcados para exclusão enquanto permite que a visualização de limpeza seja atualizada. Esta opção cria artificialmente uma situação em que a visualização de limpeza é atualizada, mas as purges ainda não foram realizadas. Esta opção está disponível apenas se o suporte de depuração for compilado usando a opção `WITH_DEBUG` **CMake**.

- `innodb_trx_rseg_n_slots_debug`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>67

  Define uma bandeira de depuração que limita `TRX_RSEG_N_SLOTS` a um valor específico para a função `trx_rsegf_undo_find_free`, que procura por slots livres para segmentos do log de desfazer. Esta opção só está disponível se o suporte de depuração estiver compilado com a opção **CMake** `WITH_DEBUG`.

- `innodb_undo_directory`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>68

  O caminho onde o `InnoDB` cria espaços de tabelas de desfazer. Tipicamente usado para colocar espaços de tabelas de desfazer em um dispositivo de armazenamento diferente.

  Não há um valor padrão (é NULL). Se a variável `innodb_undo_directory` estiver indefinida, os espaços de tabela de desfazer serão criados no diretório de dados.

  Os espaços de tabelas de desfazer padrão (`innodb_undo_001` e `innodb_undo_002`) criados quando a instância do MySQL é inicializada sempre residem no diretório definido pela variável `innodb_undo_directory`.

  As tabelaspaces criadas usando a sintaxe `CREATE UNDO TABLESPACE` são criadas no diretório definido pela variável `innodb_undo_directory`, a menos que um caminho diferente seja especificado.

  Para obter mais informações, consulte a Seção 17.6.3.4, “Desfazer Espaços de Tabela”.

- `innodb_undo_log_encrypt`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>69

  Controla a criptografia dos dados do registro de desfazer para tabelas criptografadas usando o recurso de criptografia de dados em repouso `InnoDB`. Aplica-se apenas aos registros de desfazer que residem em tabelas de desfazer separadas. Consulte a Seção 17.6.3.4, “Tabelas de Desfazer”. A criptografia não é suportada para dados de registro de desfazer que residem no espaço de tabelas do sistema. Para mais informações, consulte Criptografia de Registro de Desfazer.

- `innodb_undo_log_truncate`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>70

  Quando ativado, os espaços de tabela que excedem o valor limite definido por `innodb_max_undo_log_size` são marcados para truncação. Somente os espaços de tabela de desfazer podem ser truncados. A truncação dos logs de desfazer que residem no espaço de tabela do sistema não é suportada. Para que a truncação ocorra, deve haver pelo menos dois espaços de tabela de desfazer.

  A variável `innodb_purge_rseg_truncate_frequency` pode ser usada para acelerar o corte de espaços de tabelas de desfazer.

  Para obter mais informações, consulte "Truncando espaços de tabelas Undo".

- `innodb_undo_tablespaces`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>71

  Define o número de espaços de tabela de desfazer usados por `InnoDB`. O valor padrão e mínimo é 2.

  Nota

  A variável `innodb_undo_tablespaces` está desatualizada e não pode mais ser configurada a partir do MySQL 8.0.14. Espera-se que ela seja removida em uma futura versão.

  Para obter mais informações, consulte a Seção 17.6.3.4, “Desfazer Espaços de Tabela”.

- `innodb_use_fdatasync`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>72

  Em plataformas que suportam chamadas de sistema `fdatasync()`, a ativação da variável `innodb_use_fdatasync` permite o uso de chamadas de sistema `fdatasync()` em vez de `fsync()` para limpezas do sistema operacional. Uma chamada `fdatasync()` não limpa as alterações no metadados do arquivo, a menos que seja necessário para a recuperação subsequente de dados, proporcionando um potencial benefício de desempenho.

  Um subconjunto das configurações de `innodb_flush_method`, como `fsync`, `O_DSYNC` e `O_DIRECT`, utiliza chamadas de sistema `fsync()`. A variável `innodb_use_fdatasync` é aplicável ao usar essas configurações.

- `innodb_use_native_aio`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>73

  Especifica se o subsistema de E/S assíncrona deve ser usado. Essa variável não pode ser alterada enquanto o servidor estiver em execução. Normalmente, você não precisa configurar essa opção, pois ela está habilitada por padrão.

  Essa funcionalidade melhora a escalabilidade de sistemas com grande demanda de I/O, que geralmente apresentam muitos leitores/escritores pendentes na saída `SHOW ENGINE INNODB STATUS`.

  Executar com um grande número de threads de entrada/saída `InnoDB` e, especialmente, executar várias instâncias dessas no mesmo servidor pode exceder os limites de capacidade nos sistemas Linux. Nesse caso, você pode receber o seguinte erro:

  ```
  EAGAIN: The specified maxevents exceeds the user's limit of available events.
  ```

  Você pode normalmente resolver esse erro escrevendo um limite maior para `/proc/sys/fs/aio-max-nr`.

  No entanto, se um problema com o subsistema de E/S assíncrona no SO impedir que o `InnoDB` seja iniciado, você pode iniciar o servidor com o `innodb_use_native_aio=0`. Esta opção também pode ser desativada automaticamente durante a inicialização se o `InnoDB` detectar um problema potencial, como uma combinação de localização `tmpdir`, sistema de arquivos `tmpfs` e kernel Linux que não suporta AIO no `tmpfs`.

  Para obter mais informações, consulte a Seção 17.8.6, “Usando I/O assíncrono no Linux”.

- `innodb_validate_tablespace_paths`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>74

  Controla a validação do caminho do arquivo do espaço de tabela. Ao iniciar, `InnoDB` valida os caminhos dos arquivos de espaço de tabela conhecidos contra os caminhos dos arquivos de espaço de tabela armazenados no dicionário de dados, caso os arquivos de espaço de tabela tenham sido movidos para um local diferente. A variável `innodb_validate_tablespace_paths` permite desabilitar a validação do caminho do espaço de tabela. Este recurso é destinado a ambientes onde os arquivos de espaço de tabela não são movidos. Desabilitar a validação do caminho melhora o tempo de inicialização em sistemas com um grande número de arquivos de espaço de tabela.

  Aviso

  Iniciar o servidor com a validação do caminho do espaço de tabelas desativada após a movimentação dos arquivos do espaço de tabelas pode causar comportamentos indefinidos.

  Para obter mais informações, consulte a Seção 17.6.3.7, “Desativando a Validação do Caminho do Espaço de Tabela”.

- `innodb_version`

  O número de versão `InnoDB`. No MySQL 8.0, a numeração de versão separada para `InnoDB` não se aplica e este valor é o mesmo que o número `version` do servidor.

- `innodb_write_io_threads`

  <table summary="Propriedades para innodb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--innodb[=valu<code>ON</code></code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>75

  O número de threads de E/S para operações de escrita em `InnoDB`. O valor padrão é 4. Sua contraparte para threads de leitura é `innodb_read_io_threads`. Para mais informações, consulte a Seção 17.8.5, “Configurando o Número de Threads de E/S InnoDB em Segundo Plano”. Para conselhos gerais sobre o ajuste do E/S, consulte a Seção 10.5.8, “Otimizando o E/S de Disco InnoDB”.

  Nota

  Em sistemas Linux, executar vários servidores MySQL (geralmente mais de 12) com configurações padrão para os ajustes `innodb_read_io_threads`, `innodb_write_io_threads` e o ajuste `aio-max-nr` do Linux pode exceder os limites do sistema. Idealmente, aumente o ajuste `aio-max-nr`; como solução alternativa, você pode reduzir as configurações de uma ou ambas as variáveis MySQL.

  Além disso, considere o valor de `sync_binlog`, que controla a sincronização do log binário com o disco.

  Para obter conselhos gerais sobre o ajuste de E/S, consulte a Seção 10.5.8, “Otimização do E/S do disco InnoDB”.
