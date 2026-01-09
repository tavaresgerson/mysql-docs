#### 13.7.5.39 Declaração de VARIÁVEIS EXIBIR

```sql
SHOW [GLOBAL | SESSION] VARIABLES
    [LIKE 'pattern' | WHERE expr]
```

Nota

O valor da variável de sistema `show_compatibility_56` afeta as informações disponíveis e os privilégios necessários para a declaração descrita aqui. Para obter detalhes, consulte a descrição dessa variável em Seção 5.1.7, "Variáveis de Sistema do Servidor".

`SHOW VARIABLES` mostra os valores das variáveis do sistema do MySQL (veja Seção 5.1.7, “Variáveis do Sistema do Servidor”). Esta declaração não requer privilégios. Ela requer apenas a capacidade de se conectar ao servidor.

As informações das variáveis do sistema também estão disponíveis nessas fontes:

- Tabelas do Schema de Desempenho. Consulte Seção 25.12.13, "Tabelas de Variáveis de Sistema do Schema de Desempenho".

- As tabelas `[GLOBAL_VARIABLES](https://pt.wikipedia.org/wiki/Tabela_de_vari%C3%A1veis_do_schema_de_informa%C3%A7%C3%A3o)` e `[SESSION_VARIABLES](https://pt.wikipedia.org/wiki/Tabela_de_vari%C3%A1veis_do_schema_de_informa%C3%A7%C3%A3o)`. Veja [Seção 24.3.11, “As tabelas GLOBAL_VARIABLES e SESSION_VARIABLES do schema de informações](https://pt.wikipedia.org/wiki/Tabela_de_vari%C3%A1veis_do_schema_de_informa%C3%A7%C3%A3o).

- O comando **variáveis mysqladmin**. Veja Seção 4.5.2, “mysqladmin — Um programa de administração do servidor MySQL”.

Para `SHOW VARIABLES`, uma cláusula `LIKE` (funções de comparação de strings.html#operador_like), se presente, indica quais nomes de variáveis devem ser correspondidos. Uma cláusula `WHERE` pode ser usada para selecionar linhas com condições mais gerais, conforme discutido em Seção 24.8, “Extensões para Declarações SHOW”.

O `SHOW VARIABLES` aceita um modificador opcional de escopo de variável `GLOBAL` ou `SESSION`:

- Com o modificador `GLOBAL`, a declaração exibe os valores das variáveis de sistema globais. Estes são os valores usados para inicializar as variáveis de sessão correspondentes para novas conexões ao MySQL. Se uma variável não tiver um valor global, nenhum valor será exibido.

- Com o modificador `SESSION`, a instrução exibe os valores das variáveis do sistema que estão em vigor para a conexão atual. Se uma variável não tiver um valor de sessão, o valor global é exibido. `LOCAL` é sinônimo de `SESSION`.

- Se nenhum modificador estiver presente, o padrão é `SESSION`.

O escopo de cada variável do sistema está listado na Seção 5.1.7, “Variáveis do Sistema do Servidor”.

`SHOW VARIABLES` está sujeito a um limite de largura de exibição dependente da versão. Para variáveis com valores muito longos que não são exibidos completamente, use `SELECT` como uma solução alternativa. Por exemplo:

```sql
SELECT @@GLOBAL.innodb_data_file_path;
```

A maioria das variáveis do sistema pode ser definida na inicialização do servidor (variáveis de leitura somente, como `version_comment` são exceções). Muitas podem ser alteradas em tempo de execução com a instrução `SET`. Consulte Seção 5.1.8, “Usando Variáveis de Sistema” e Seção 13.7.4.1, “Sintaxe SET para Atribuição de Variáveis”.

A saída parcial é mostrada aqui. A lista de nomes e valores pode diferir para o seu servidor. Seção 5.1.7, “Variáveis do Sistema do Servidor”, descreve o significado de cada variável, e Seção 5.1.1, “Configurando o Servidor”, fornece informações sobre como ajustá-las.

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

Com uma cláusula `LIKE` (funções de comparação de strings.html#operador_like), a instrução exibe apenas as linhas para aquelas variáveis com nomes que correspondem ao padrão. Para obter a linha de uma variável específica, use uma cláusula `LIKE` (funções de comparação de strings.html#operador_like) conforme mostrado:

```sql
SHOW VARIABLES LIKE 'max_join_size';
SHOW SESSION VARIABLES LIKE 'max_join_size';
```

Para obter uma lista de variáveis cujo nome corresponda a um padrão, use o caractere curinga `%` em uma cláusula `LIKE` (funções de comparação de strings.html#operador_like):

```sql
SHOW VARIABLES LIKE '%size%';
SHOW GLOBAL VARIABLES LIKE '%size%';
```

Os caracteres curinga podem ser usados em qualquer posição dentro do padrão a ser correspondido. De forma estrita, porque `_` é um caractere curinga que corresponde a qualquer único caractere, você deve escapar dele como `_` para correspondê-lo literalmente. Na prática, isso raramente é necessário.
