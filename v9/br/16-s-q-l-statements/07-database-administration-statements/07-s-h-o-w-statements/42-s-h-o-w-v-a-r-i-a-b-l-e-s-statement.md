#### 15.7.7.42 Declaração `SHOW VARIABLES`

```
SHOW [GLOBAL | SESSION] VARIABLES
    [LIKE 'pattern' | WHERE expr]
```

`SHOW VARIABLES` exibe os valores das variáveis do sistema MySQL (consulte a Seção 7.1.8, “Variáveis do Sistema do Servidor”). Esta declaração não requer privilégio. Ela requer apenas a capacidade de se conectar ao servidor.

As informações das variáveis do sistema também estão disponíveis nestas fontes:

* Tabelas do Schema de Desempenho. Consulte a Seção 29.12.14, “Tabelas de Variáveis do Sistema do Schema de Desempenho”.

* O comando **mysqladmin variables**. Consulte a Seção 6.5.2, “mysqladmin — Um Programa de Administração do Servidor MySQL”.

Para `SHOW VARIABLES`, uma cláusula `LIKE`, se presente, indica quais nomes de variáveis devem ser correspondidos. Uma cláusula `WHERE` pode ser usada para selecionar linhas com condições mais gerais, conforme discutido na Seção 28.8, “Extensões para Declarações SHOW”.

`SHOW VARIABLES` aceita um modificador opcional de escopo de variável `GLOBAL` ou `SESSION`:

* Com um modificador `GLOBAL`, a declaração exibe os valores das variáveis do sistema globais. Estes são os valores usados para inicializar as variáveis de sessão correspondentes para novas conexões ao MySQL. Se uma variável não tiver um valor global, nenhum valor é exibido.

* Com um modificador `SESSION`, a declaração exibe os valores das variáveis do sistema que estão em vigor para a conexão atual. Se uma variável não tiver um valor de sessão, o valor global é exibido. `LOCAL` é um sinônimo de `SESSION`.

* Se nenhum modificador estiver presente, o padrão é `SESSION`.

O escopo de cada variável do sistema é listado na Seção 7.1.8, “Variáveis do Sistema do Servidor”.

`SHOW VARIABLES` está sujeito a um limite de largura de exibição dependente da versão. Para variáveis com valores muito longos que não são exibidos completamente, use `SELECT` como uma solução alternativa. Por exemplo:

```
SELECT @@GLOBAL.innodb_data_file_path;
```

A maioria das variáveis do sistema pode ser definida na inicialização do servidor (variáveis de leitura somente, como `version_comment`, são exceções). Muitas podem ser alteradas em tempo de execução com a instrução `SET`. Consulte a Seção 7.1.9, “Usando Variáveis de Sistema”, e a Seção 15.7.6.1, “Sintaxe SET para Atribuição de Variáveis”.

A saída parcial é mostrada aqui. A lista de nomes e valores pode diferir para o seu servidor. A Seção 7.1.8, “Variáveis de Sistema do Servidor”, descreve o significado de cada variável, e a Seção 7.1.1, “Configurando o Servidor”, fornece informações sobre como ajustá-las.

```
mysql> SHOW VARIABLES;
+-------------------------------------------------------+-----------------------+
| Variable_name                                         | Value                 |
+-------------------------------------------------------+-----------------------+
| activate_all_roles_on_login                           | OFF                   |
| admin_address                                         |                       |
| admin_port                                            | 33062                 |
| admin_ssl_ca                                          |                       |
| admin_ssl_capath                                      |                       |
| admin_ssl_cert                                        |                       |
| admin_ssl_cipher                                      |                       |
| admin_ssl_crl                                         |                       |
| admin_ssl_crlpath                                     |                       |
| admin_ssl_key                                         |                       |
| admin_tls_ciphersuites                                |                       |
| admin_tls_version                                     | TLSv1.2,TLSv1.3       |
| authentication_policy                                 | *,,                   |
| auto_generate_certs                                   | ON                    |
| auto_increment_increment                              | 1                     |
| auto_increment_offset                                 | 1                     |
| autocommit                                            | ON                    |
| automatic_sp_privileges                               | ON                    |
| avoid_temporal_upgrade                                | OFF                   |
| back_log                                              | 151                   |
| basedir                                               | /local/mysql-8.4/     |
| big_tables                                            | OFF                   |
| bind_address                                          | 127.0.0.1             |
| binlog_cache_size                                     | 32768                 |
| binlog_checksum                                       | CRC32                 |
| binlog_direct_non_transactional_updates               | OFF                   |
| binlog_encryption                                     | OFF                   |
| binlog_error_action                                   | ABORT_SERVER          |
| binlog_expire_logs_auto_purge                         | ON                    |
| binlog_expire_logs_seconds                            | 2592000               |

...

| max_error_count                                       | 1024                  |
| max_execution_time                                    | 0                     |
| max_heap_table_size                                   | 16777216              |
| max_insert_delayed_threads                            | 20                    |
| max_join_size                                         | 18446744073709551615  |
| max_length_for_sort_data                              | 4096                  |
| max_points_in_geometry                                | 65536                 |
| max_prepared_stmt_count                               | 16382                 |
| max_relay_log_size                                    | 0                     |
| max_seeks_for_key                                     | 18446744073709551615  |
| max_sort_length                                       | 1024                  |
| max_sp_recursion_depth                                | 0                     |
| max_user_connections                                  | 0                     |
| max_write_lock_count                                  | 18446744073709551615  |

...

| time_zone                                             | SYSTEM                |
| timestamp                                             | 1682684938.710453     |
| tls_certificates_enforced_validation                  | OFF                   |
| tls_ciphersuites                                      |                       |
| tls_version                                           | TLSv1.2,TLSv1.3       |
| tmp_table_size                                        | 16777216              |
| tmpdir                                                | /tmp                  |
| transaction_alloc_block_size                          | 8192                  |
| transaction_allow_batching                            | OFF                   |
| transaction_isolation                                 | REPEATABLE-READ       |
| transaction_prealloc_size                             | 4096                  |
| transaction_read_only                                 | OFF                   |
| unique_checks                                         | ON                    |
| updatable_views_with_limit                            | YES                   |
| use_secondary_engine                                  | ON                    |
| version                                               | 9.5.0                 |
| version_comment                                       | Source distribution   |
| version_compile_machine                               | x86_64                |
| version_compile_os                                    | Linux                 |
| version_compile_zlib                                  | 1.2.13                |
| wait_timeout                                          | 28800                 |
| warning_count                                         | 0                     |
| windowing_use_high_precision                          | ON                    |
| xa_detach_on_prepare                                  | ON                    |
+-------------------------------------------------------+-----------------------+
```

Com uma cláusula `LIKE`, a instrução exibe apenas as linhas para aquelas variáveis com nomes que correspondem ao padrão. Para obter a linha de uma variável específica, use uma cláusula `LIKE` como mostrado:

```
SHOW VARIABLES LIKE 'max_join_size';
SHOW SESSION VARIABLES LIKE 'max_join_size';
```

Para obter uma lista de variáveis cujo nome corresponda a um padrão, use o caractere curinga `%` em uma cláusula `LIKE`:

```
SHOW VARIABLES LIKE '%size%';
SHOW GLOBAL VARIABLES LIKE '%size%';
```

Os caracteres curinga podem ser usados em qualquer posição dentro do padrão a ser correspondido. Estritamente falando, porque `_` é um curinga que corresponde a qualquer único caractere, você deve escapar `_` como `\_` para correspondê-lo literalmente. Na prática, isso raramente é necessário.