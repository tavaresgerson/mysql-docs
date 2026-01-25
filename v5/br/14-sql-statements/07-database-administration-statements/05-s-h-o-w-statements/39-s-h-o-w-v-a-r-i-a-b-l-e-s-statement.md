#### 13.7.5.39 Instrução SHOW VARIABLES

```sql
SHOW [GLOBAL | SESSION] VARIABLES
    [LIKE 'pattern' | WHERE expr]
```

Nota

O valor da System Variable [`show_compatibility_56`](server-system-variables.html#sysvar_show_compatibility_56) afeta as informações disponíveis e os privilégios exigidos para a instrução descrita aqui. Para detalhes, consulte a descrição dessa Variable em [Seção 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables").

A instrução [`SHOW VARIABLES`](show-variables.html "13.7.5.39 SHOW VARIABLES Statement") exibe os valores das System Variables do MySQL (consulte [Seção 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables")). Esta instrução não exige nenhum privilege. Ela requer apenas a capacidade de conectar-se ao server.

Informações sobre System Variables também estão disponíveis nas seguintes fontes:

* Tabelas do Performance Schema. Consulte [Seção 25.12.13, “Performance Schema System Variable Tables”](performance-schema-system-variable-tables.html "25.12.13 Performance Schema System Variable Tables").

* As tabelas [`GLOBAL_VARIABLES`](information-schema-variables-table.html "24.3.11 The INFORMATION_SCHEMA GLOBAL_VARIABLES and SESSION_VARIABLES Tables") e [`SESSION_VARIABLES`](information-schema-variables-table.html "24.3.11 The INFORMATION_SCHEMA GLOBAL_VARIABLES and SESSION_VARIABLES Tables"). Consulte [Seção 24.3.11, “The INFORMATION_SCHEMA GLOBAL_VARIABLES and SESSION_VARIABLES Tables”](information-schema-variables-table.html "24.3.11 The INFORMATION_SCHEMA GLOBAL_VARIABLES and SESSION_VARIABLES Tables").

* O comando [**mysqladmin variables**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program"). Consulte [Seção 4.5.2, “mysqladmin — A MySQL Server Administration Program”](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program").

Para [`SHOW VARIABLES`](show-variables.html "13.7.5.39 SHOW VARIABLES Statement"), uma cláusula [`LIKE`](string-comparison-functions.html#operator_like), se presente, indica quais nomes de Variable devem ser correspondidos. Uma cláusula `WHERE` pode ser fornecida para selecionar linhas usando condições mais gerais, conforme discutido em [Seção 24.8, “Extensions to SHOW Statements”](extended-show.html "24.8 Extensions to SHOW Statements").

[`SHOW VARIABLES`](show-variables.html "13.7.5.39 SHOW VARIABLES Statement") aceita um modificador opcional de escopo de Variable, `GLOBAL` ou `SESSION`:

* Com um modificador `GLOBAL`, a instrução exibe valores de System Variables globais. Estes são os valores usados para inicializar as Variables de sessão correspondentes para novas conexões ao MySQL. Se uma Variable não tiver um valor global, nenhum valor será exibido.

* Com um modificador `SESSION`, a instrução exibe os valores de System Variables que estão em vigor para a conexão atual. Se uma Variable não tiver um valor de sessão, o valor global será exibido. `LOCAL` é um sinônimo para `SESSION`.

* Se nenhum modificador estiver presente, o padrão é `SESSION`.

O escopo para cada System Variable está listado em [Seção 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables").

[`SHOW VARIABLES`](show-variables.html "13.7.5.39 SHOW VARIABLES Statement") está sujeito a um limite de largura de exibição que depende da versão. Para Variables com valores muito longos que não são exibidos completamente, use [`SELECT`](select.html "13.2.9 SELECT Statement") como uma solução alternativa (workaround). Por exemplo:

```sql
SELECT @@GLOBAL.innodb_data_file_path;
```

A maioria das System Variables pode ser definida na inicialização do server (Variables somente leitura, como [`version_comment`](server-system-variables.html#sysvar_version_comment), são exceções). Muitas podem ser alteradas em runtime com a instrução [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment"). Consulte [Seção 5.1.8, “Using System Variables”](using-system-variables.html "5.1.8 Using System Variables") e [Seção 13.7.4.1, “SET Syntax for Variable Assignment”](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment").

A saída parcial é mostrada aqui. A lista de nomes e valores pode ser diferente para o seu server. [Seção 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables") descreve o significado de cada Variable, e [Seção 5.1.1, “Configuring the Server”](server-configuration.html "5.1.1 Configuring the Server") fornece informações sobre o seu ajuste (tuning).

```sql
mysql> SHOW VARIABLES;
+-----------------------------------------+---------------------------+
| Variable_name                           | Value                     |
+-----------------------------------------+---------------------------+
| auto_increment_increment                | 1                         |
| auto_increment_offset                   | 1                         |
| autocommit                              | ON                        |
| automatic_sp_privileges                 | ON                        |
| back_log                                | 50                        |
| basedir                                 | /home/jon/bin/mysql-5.5   |
| big_tables                              | OFF                       |
| binlog_cache_size                       | 32768                     |
| binlog_direct_non_transactional_updates | OFF                       |
| binlog_format                           | STATEMENT                 |
| binlog_stmt_cache_size                  | 32768                     |
| bulk_insert_buffer_size                 | 8388608                   |
...
| max_allowed_packet                      | 4194304                   |
| max_binlog_cache_size                   | 18446744073709547520      |
| max_binlog_size                         | 1073741824                |
| max_binlog_stmt_cache_size              | 18446744073709547520      |
| max_connect_errors                      | 100                       |
| max_connections                         | 151                       |
| max_delayed_threads                     | 20                        |
| max_error_count                         | 64                        |
| max_heap_table_size                     | 16777216                  |
| max_insert_delayed_threads              | 20                        |
| max_join_size                           | 18446744073709551615      |
...

| thread_handling                         | one-thread-per-connection |
| thread_stack                            | 262144                    |
| time_format                             | %H:%i:%s                  |
| time_zone                               | SYSTEM                    |
| timestamp                               | 1316689732                |
| tmp_table_size                          | 16777216                  |
| tmpdir                                  | /tmp                      |
| transaction_alloc_block_size            | 8192                      |
| transaction_isolation                   | REPEATABLE-READ           |
| transaction_prealloc_size               | 4096                      |
| transaction_read_only                   | OFF                       |
| tx_isolation                            | REPEATABLE-READ           |
| tx_read_only                            | OFF                       |
| unique_checks                           | ON                        |
| updatable_views_with_limit              | YES                       |
| version                                 | 5.7.44                    |
| version_comment                         | Source distribution       |
| version_compile_machine                 | x86_64                    |
| version_compile_os                      | Linux                     |
| wait_timeout                            | 28800                     |
| warning_count                           | 0                         |
+-----------------------------------------+---------------------------+
```

Com uma cláusula [`LIKE`](string-comparison-functions.html#operator_like), a instrução exibe apenas linhas para as Variables cujos nomes correspondem ao padrão. Para obter a linha de uma Variable específica, use uma cláusula [`LIKE`](string-comparison-functions.html#operator_like) conforme mostrado:

```sql
SHOW VARIABLES LIKE 'max_join_size';
SHOW SESSION VARIABLES LIKE 'max_join_size';
```

Para obter uma lista de Variables cujos nomes correspondem a um padrão, use o caractere wildcard `%` em uma cláusula [`LIKE`](string-comparison-functions.html#operator_like):

```sql
SHOW VARIABLES LIKE '%size%';
SHOW GLOBAL VARIABLES LIKE '%size%';
```

Caracteres wildcard podem ser usados em qualquer posição dentro do padrão a ser correspondido. Estritamente falando, como `_` é um wildcard que corresponde a qualquer caractere único, você deve escapá-lo como `\_` para corresponder a ele literalmente. Na prática, isso raramente é necessário.