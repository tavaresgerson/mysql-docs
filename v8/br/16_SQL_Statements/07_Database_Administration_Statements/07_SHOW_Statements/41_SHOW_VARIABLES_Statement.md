#### 15.7.7.41 Declaração de VARIÁVEIS EXIBIR

```
SHOW [GLOBAL | SESSION] VARIABLES
    [LIKE 'pattern' | WHERE expr]
```

`SHOW VARIABLES` exibe os valores das variáveis de sistema do MySQL (consulte a Seção 7.1.8, “Variáveis de Sistema do Servidor”). Esta declaração não requer privilégios. Ela requer apenas a capacidade de se conectar ao servidor.

As informações das variáveis do sistema também estão disponíveis nessas fontes:

- Tabelas do Schema de Desempenho. Veja a Seção 29.12.14, “Tabelas de Variáveis de Sistema do Schema de Desempenho”.

- O comando **mysqladmin variáveis**. Veja a Seção 6.5.2, “mysqladmin — Um programa de administração do servidor MySQL”.

Para `SHOW VARIABLES`, uma cláusula `LIKE`, se presente, indica quais nomes de variáveis devem ser correspondidos. Uma cláusula `WHERE` pode ser usada para selecionar linhas com condições mais gerais, conforme discutido na Seção 28.8, “Extensões para Declarações SHOW”.

`SHOW VARIABLES` aceita um modificador opcional de escopo da variável `GLOBAL` ou `SESSION`:

- Com o modificador `GLOBAL`, a declaração exibe os valores das variáveis de sistema globais. Estes são os valores usados para inicializar as variáveis de sessão correspondentes para novas conexões ao MySQL. Se uma variável não tiver um valor global, nenhum valor será exibido.

- Com o modificador `SESSION`, a declaração exibe os valores das variáveis do sistema que estão em vigor para a conexão atual. Se uma variável não tiver um valor de sessão, o valor global será exibido. `LOCAL` é sinônimo de `SESSION`.

- Se nenhum modificador estiver presente, o padrão é `SESSION`.

O escopo de cada variável do sistema está listado na Seção 7.1.8, "Variáveis do Sistema do Servidor".

`SHOW VARIABLES` está sujeito a um limite de largura de exibição dependente da versão. Para variáveis com valores muito longos que não são exibidos completamente, use `SELECT` como uma solução alternativa. Por exemplo:

```
SELECT @@GLOBAL.innodb_data_file_path;
```

A maioria das variáveis do sistema pode ser definida na inicialização do servidor (variáveis de leitura somente, como `version_comment`, são exceções). Muitas podem ser alteradas em tempo de execução com a instrução `SET`. Consulte a Seção 7.1.9, “Usando Variáveis do Sistema”, e a Seção 15.7.6.1, “Sintaxe SET para Atribuição de Variáveis”.

Aqui é mostrado o resultado parcial. A lista de nomes e valores pode diferir para o seu servidor. A Seção 7.1.8, “Variáveis do Sistema do Servidor”, descreve o significado de cada variável, e a Seção 7.1.1, “Configurando o Servidor”, fornece informações sobre como ajustá-las.

```
mysql> SHOW VARIABLES;
+--------------------------------------------+------------------------------+
| Variable_name                              | Value                        |
+--------------------------------------------+------------------------------+
| activate_all_roles_on_login                | OFF                          |
| auto_generate_certs                        | ON                           |
| auto_increment_increment                   | 1                            |
| auto_increment_offset                      | 1                            |
| autocommit                                 | ON                           |
| automatic_sp_privileges                    | ON                           |
| avoid_temporal_upgrade                     | OFF                          |
| back_log                                   | 151                          |
| basedir                                    | /usr/                        |
| big_tables                                 | OFF                          |
| bind_address                               | *                            |
| binlog_cache_size                          | 32768                        |
| binlog_checksum                            | CRC32                        |
| binlog_direct_non_transactional_updates    | OFF                          |
| binlog_error_action                        | ABORT_SERVER                 |
| binlog_expire_logs_seconds                 | 2592000                      |
| binlog_format                              | ROW                          |
| binlog_group_commit_sync_delay             | 0                            |
| binlog_group_commit_sync_no_delay_count    | 0                            |
| binlog_gtid_simple_recovery                | ON                           |
| binlog_max_flush_queue_time                | 0                            |
| binlog_order_commits                       | ON                           |
| binlog_row_image                           | FULL                         |
| binlog_row_metadata                        | MINIMAL                      |
| binlog_row_value_options                   |                              |
| binlog_rows_query_log_events               | OFF                          |
| binlog_stmt_cache_size                     | 32768                        |
| binlog_transaction_dependency_history_size | 25000                        |
| binlog_transaction_dependency_tracking     | COMMIT_ORDER                 |
| block_encryption_mode                      | aes-128-ecb                  |
| bulk_insert_buffer_size                    | 8388608                      |

...

| max_allowed_packet                         | 67108864                     |
| max_binlog_cache_size                      | 18446744073709547520         |
| max_binlog_size                            | 1073741824                   |
| max_binlog_stmt_cache_size                 | 18446744073709547520         |
| max_connect_errors                         | 100                          |
| max_connections                            | 151                          |
| max_delayed_threads                        | 20                           |
| max_digest_length                          | 1024                         |
| max_error_count                            | 1024                         |
| max_execution_time                         | 0                            |
| max_heap_table_size                        | 16777216                     |
| max_insert_delayed_threads                 | 20                           |
| max_join_size                              | 18446744073709551615         |

...

| thread_handling                            | one-thread-per-connection    |
| thread_stack                               | 286720                       |
| time_zone                                  | SYSTEM                       |
| timestamp                                  | 1530906638.765316            |
| tls_version                                | TLSv1.2,TLSv1.3              |
| tmp_table_size                             | 16777216                     |
| tmpdir                                     | /tmp                         |
| transaction_alloc_block_size               | 8192                         |
| transaction_allow_batching                 | OFF                          |
| transaction_isolation                      | REPEATABLE-READ              |
| transaction_prealloc_size                  | 4096                         |
| transaction_read_only                      | OFF                          |
| transaction_write_set_extraction           | XXHASH64                     |
| unique_checks                              | ON                           |
| updatable_views_with_limit                 | YES                          |
| version                                    | 8.0.44                       |
| version_comment                            | MySQL Community Server - GPL |
| version_compile_machine                    | x86_64                       |
| version_compile_os                         | Linux                        |
| version_compile_zlib                       | 1.2.11                       |
| wait_timeout                               | 28800                        |
| warning_count                              | 0                            |
| windowing_use_high_precision               | ON                           |
+--------------------------------------------+------------------------------+
```

Com uma cláusula `LIKE`, a declaração exibe apenas as linhas para aquelas variáveis com nomes que correspondem ao padrão. Para obter a linha de uma variável específica, use uma cláusula `LIKE` como mostrado:

```
SHOW VARIABLES LIKE 'max_join_size';
SHOW SESSION VARIABLES LIKE 'max_join_size';
```

Para obter uma lista de variáveis cujo nome corresponda a um padrão, use o caractere de substituição `%` em uma cláusula `LIKE`:

```
SHOW VARIABLES LIKE '%size%';
SHOW GLOBAL VARIABLES LIKE '%size%';
```

Os caracteres curinga podem ser usados em qualquer posição dentro do padrão a ser correspondido. De forma estrita, porque `_` é um curinga que corresponde a qualquer caractere único, você deve escapar dele como `_` para correspondê-lo literalmente. Na prática, isso raramente é necessário.
