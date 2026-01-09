## 25.15 Variáveis do Sistema de Schema de Desempenho

O Schema de Desempenho implementa várias variáveis de sistema que fornecem informações de configuração:

```sql
mysql> SHOW VARIABLES LIKE 'perf%';
+----------------------------------------------------------+-------+
| Variable_name                                            | Value |
+----------------------------------------------------------+-------+
| performance_schema                                       | ON    |
| performance_schema_accounts_size                         | -1    |
| performance_schema_digests_size                          | 10000 |
| performance_schema_events_stages_history_long_size       | 10000 |
| performance_schema_events_stages_history_size            | 10    |
| performance_schema_events_statements_history_long_size   | 10000 |
| performance_schema_events_statements_history_size        | 10    |
| performance_schema_events_transactions_history_long_size | 10000 |
| performance_schema_events_transactions_history_size      | 10    |
| performance_schema_events_waits_history_long_size        | 10000 |
| performance_schema_events_waits_history_size             | 10    |
| performance_schema_hosts_size                            | -1    |
| performance_schema_max_cond_classes                      | 80    |
| performance_schema_max_cond_instances                    | -1    |
| performance_schema_max_digest_length                     | 1024  |
| performance_schema_max_file_classes                      | 50    |
| performance_schema_max_file_handles                      | 32768 |
| performance_schema_max_file_instances                    | -1    |
| performance_schema_max_index_stat                        | -1    |
| performance_schema_max_memory_classes                    | 320   |
| performance_schema_max_metadata_locks                    | -1    |
| performance_schema_max_mutex_classes                     | 200   |
| performance_schema_max_mutex_instances                   | -1    |
| performance_schema_max_prepared_statements_instances     | -1    |
| performance_schema_max_program_instances                 | -1    |
| performance_schema_max_rwlock_classes                    | 40    |
| performance_schema_max_rwlock_instances                  | -1    |
| performance_schema_max_socket_classes                    | 10    |
| performance_schema_max_socket_instances                  | -1    |
| performance_schema_max_sql_text_length                   | 1024  |
| performance_schema_max_stage_classes                     | 150   |
| performance_schema_max_statement_classes                 | 192   |
| performance_schema_max_statement_stack                   | 10    |
| performance_schema_max_table_handles                     | -1    |
| performance_schema_max_table_instances                   | -1    |
| performance_schema_max_table_lock_stat                   | -1    |
| performance_schema_max_thread_classes                    | 50    |
| performance_schema_max_thread_instances                  | -1    |
| performance_schema_session_connect_attrs_size            | 512   |
| performance_schema_setup_actors_size                     | -1    |
| performance_schema_setup_objects_size                    | -1    |
| performance_schema_users_size                            | -1    |
+----------------------------------------------------------+-------+
```

As variáveis do sistema do Schema de Desempenho podem ser definidas na linha de comando ou em arquivos de opção durante o início do servidor, e muitas podem ser definidas durante a execução. Consulte Seção 25.13, “Referência de Opções e Variáveis do Schema de Desempenho”.

O Schema de Desempenho dimensiona automaticamente os valores de vários de seus parâmetros ao iniciar o servidor, se não forem definidos explicitamente. Para mais informações, consulte Seção 25.3, “Configuração de Inicialização do Schema de Desempenho”.

As variáveis do sistema do esquema de desempenho têm os seguintes significados:

- `performance_schema`

  <table frame="box" rules="all" summary="Propriedades para performance_schema"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema">performance_schema</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>

  O valor desta variável é `ON` ou `OFF` para indicar se o Schema de Desempenho está habilitado. Por padrão, o valor é `ON`. Ao iniciar o servidor, você pode especificar essa variável sem valor ou com o valor `ON` ou 1 para habilitá-la, ou com o valor `OFF` ou 0 para desabilitá-la.

  Mesmo quando o Schema de Desempenho está desativado, ele continua a preencher as tabelas `global_variables`, `session_variables`, `global_status` e `session_status`. Isso ocorre conforme necessário para permitir que os resultados das instruções `SHOW VARIABLES` e `SHOW STATUS` sejam extraídos dessas tabelas, dependendo da configuração da variável de sistema `show_compatibiliy_56`.

- `performance_schema_accounts_size`

  <table frame="box" rules="all" summary="Propriedades para performance_schema_accounts_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-accounts-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_accounts_size">performance_schema_accounts_size</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>

  O número de linhas na tabela `accounts`. Se essa variável for 0, o Schema de Desempenho não mantém estatísticas de conexão na tabela `accounts` ou informações da variável de status na tabela `status_by_account`.

- `performance_schema_digests_size`

  <table frame="box" rules="all" summary="Propriedades para performance_schema_digests_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-digests-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_digests_size">performance_schema_digests_size</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>

  O número máximo de linhas na tabela `events_statements_summary_by_digest`. Se esse limite for ultrapassado, de modo que um digest não possa ser instrumentado, o Schema de Desempenho incrementa a variável de status `Performance_schema_digest_lost`.

  Para obter mais informações sobre a digestão de declarações, consulte Seção 25.10, “Digestas de declarações do Schema de Desempenho”.

- `performance_schema_events_stages_history_long_size`

  <table frame="box" rules="all" summary="Propriedades para performance_schema_events_stages_history_long_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-events-stages-history-long-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_events_stages_history_long_size">performance_schema_events_stages_history_long_size</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>

  O número de linhas na tabela `events_stages_history_long`.

- `performance_schema_events_stages_history_size`

  <table frame="box" rules="all" summary="Propriedades para performance_schema_events_stages_history_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-events-stages-history-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_events_stages_history_size">performance_schema_events_stages_history_size</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1024</code>]]</td> </tr></tbody></table>

  O número de linhas por fio na tabela `events_stages_history`.

- `performance_schema_events_statements_history_long_size`

  <table frame="box" rules="all" summary="Propriedades para performance_schema_events_statements_history_long_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-events-statements-history-long-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_events_statements_history_long_size">performance_schema_events_statements_history_long_size</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>

  O número de linhas na tabela `events_statements_history_long`.

- `performance_schema_events_statements_history_size`

  <table frame="box" rules="all" summary="Propriedades para performance_schema_events_statements_history_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-events-statements-history-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_events_statements_history_size">performance_schema_events_statements_history_size</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1024</code>]]</td> </tr></tbody></table>

  O número de linhas por fio na tabela `events_statements_history`.

- `performance_schema_events_transactions_history_long_size`

  <table frame="box" rules="all" summary="Propriedades para performance_schema_events_transactions_history_long_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-events-transactions-history-long-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_events_transactions_history_long_size">performance_schema_events_transactions_history_long_size</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>

  O número de linhas na tabela `events_transactions_history_long`.

- `performance_schema_events_transactions_history_size`

  <table frame="box" rules="all" summary="Propriedades para performance_schema_events_transactions_history_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-events-transactions-history-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_events_transactions_history_size">performance_schema_events_transactions_history_size</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1024</code>]]</td> </tr></tbody></table>

  O número de linhas por fio na tabela `events_transactions_history`.

- `performance_schema_events_waits_history_long_size`

  <table frame="box" rules="all" summary="Propriedades para performance_schema_events_waits_history_long_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-events-waits-history-long-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_events_waits_history_long_size">performance_schema_events_waits_history_long_size</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>

  O número de linhas na tabela `events_waits_history_long`.

- `performance_schema_events_waits_history_size`

  <table frame="box" rules="all" summary="Propriedades para performance_schema_accounts_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-accounts-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_accounts_size">performance_schema_accounts_size</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>0

  O número de linhas por fio na tabela `events_waits_history`.

- `performance_schema_hosts_size`

  <table frame="box" rules="all" summary="Propriedades para performance_schema_accounts_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-accounts-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_accounts_size">performance_schema_accounts_size</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>1

  O número de linhas na tabela `hosts`. Se essa variável for 0, o Schema de Desempenho não mantém estatísticas de conexão na tabela `hosts` ou informações da variável de status na tabela `status_by_host`.

- `performance_schema_max_cond_classes`

  <table frame="box" rules="all" summary="Propriedades para performance_schema_accounts_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-accounts-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_accounts_size">performance_schema_accounts_size</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>2

  O número máximo de instrumentos de condição. Para obter informações sobre como definir e usar essa variável, consulte Seção 25.7, "Monitoramento do Status do Schema de Desempenho".

- `performance_schema_max_cond_instances`

  <table frame="box" rules="all" summary="Propriedades para performance_schema_accounts_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-accounts-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_accounts_size">performance_schema_accounts_size</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>3

  O número máximo de objetos de condição instrumentados. Para obter informações sobre como definir e usar essa variável, consulte Seção 25.7, "Monitoramento do Status do Schema de Desempenho".

- `performance_schema_max_digest_length`

  <table frame="box" rules="all" summary="Propriedades para performance_schema_accounts_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-accounts-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_accounts_size">performance_schema_accounts_size</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>4

  O número máximo de bytes de memória reservado por declaração para a computação de valores de digestão de declarações normalizados no Gerenciamento de Desempenho. Esta variável está relacionada a `max_digest_length`; consulte a descrição dessa variável em Seção 5.1.7, “Variáveis do Sistema do Servidor”.

  Para obter mais informações sobre a digestão de declarações, incluindo considerações sobre o uso da memória, consulte Seção 25.10, “Digestas de Declarações do Schema de Desempenho”.

- `performance_schema_max_file_classes`

  <table frame="box" rules="all" summary="Propriedades para performance_schema_accounts_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-accounts-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_accounts_size">performance_schema_accounts_size</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>5

  O número máximo de instrumentos de arquivo. Para obter informações sobre como definir e usar essa variável, consulte Seção 25.7, “Monitoramento do estado do esquema de desempenho”.

- `performance_schema_max_file_handles`

  <table frame="box" rules="all" summary="Propriedades para performance_schema_accounts_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-accounts-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_accounts_size">performance_schema_accounts_size</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>6

  O número máximo de objetos de arquivo abertos. Para obter informações sobre como definir e usar essa variável, consulte Seção 25.7, "Monitoramento do estado do esquema de desempenho".

  O valor de `performance_schema_max_file_handles` deve ser maior que o valor de `open_files_limit`: `open_files_limit` afeta o número máximo de manipuladores de arquivos abertos que o servidor pode suportar e `performance_schema_max_file_handles` afeta quantos desses manipuladores de arquivos podem ser instrumentados.

- `performance_schema_max_file_instances`

  <table frame="box" rules="all" summary="Propriedades para performance_schema_accounts_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-accounts-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_accounts_size">performance_schema_accounts_size</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>7

  O número máximo de objetos de arquivo instrumentados. Para obter informações sobre como definir e usar essa variável, consulte Seção 25.7, “Monitoramento do estado do esquema de desempenho”.

- `performance_schema_max_index_stat`

  <table frame="box" rules="all" summary="Propriedades para performance_schema_accounts_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-accounts-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_accounts_size">performance_schema_accounts_size</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>8

  O número máximo de índices para os quais o Schema de Desempenho mantém estatísticas. Se esse limite for excedido, de modo que as estatísticas dos índices sejam perdidas, o Schema de Desempenho incrementa a variável de status `Performance_schema_index_stat_lost`. O valor padrão é ajustado automaticamente com base no valor de `performance_schema_max_table_instances`.

- `performance_schema_max_memory_classes`

  <table frame="box" rules="all" summary="Propriedades para performance_schema_accounts_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-accounts-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_accounts_size">performance_schema_accounts_size</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>9

  O número máximo de instrumentos de memória. Para obter informações sobre como definir e usar essa variável, consulte Seção 25.7, "Monitoramento do Status do Schema de Desempenho".

- `performance_schema_max_metadata_locks`

  <table frame="box" rules="all" summary="Propriedades para performance_schema_digests_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-digests-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_digests_size">performance_schema_digests_size</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>0

  O número máximo de instrumentos de bloqueio de metadados. Esse valor controla o tamanho da tabela `metadata_locks`. Se esse valor for excedido, de modo que um bloqueio de metadados não possa ser instrumentado, o Schema de Desempenho incrementa a variável de status `Performance_schema_metadata_lock_lost`.

- `performance_schema_max_mutex_classes`

  <table frame="box" rules="all" summary="Propriedades para performance_schema_digests_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-digests-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_digests_size">performance_schema_digests_size</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>1

  O número máximo de instrumentos de mutex. Para obter informações sobre como definir e usar essa variável, consulte Seção 25.7, "Monitoramento do estado do esquema de desempenho".

- `performance_schema_max_mutex_instances`

  <table frame="box" rules="all" summary="Propriedades para performance_schema_digests_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-digests-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_digests_size">performance_schema_digests_size</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>2

  O número máximo de objetos de mutex instrumentados. Para obter informações sobre como definir e usar essa variável, consulte Seção 25.7, “Monitoramento do Status do Schema de Desempenho”.

- `performance_schema_max_prepared_statements_instances`

  <table frame="box" rules="all" summary="Propriedades para performance_schema_digests_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-digests-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_digests_size">performance_schema_digests_size</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>3

  O número máximo de linhas na tabela `prepared_statements_instances`. Se esse limite for ultrapassado, de modo que um comando preparado não possa ser instrumentado, o Schema de Desempenho incrementa a variável de status `Performance_schema_prepared_statements_lost`. Para obter informações sobre como definir e usar essa variável, consulte Seção 25.7, “Monitoramento de Status do Schema de Desempenho”.

  O valor padrão desta variável é dimensionado automaticamente com base no valor da variável de sistema `max_prepared_stmt_count`.

- `performance_schema_max_rwlock_classes`

  <table frame="box" rules="all" summary="Propriedades para performance_schema_digests_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-digests-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_digests_size">performance_schema_digests_size</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>4

  O número máximo de instrumentos rwlock. Para obter informações sobre como definir e usar essa variável, consulte Seção 25.7, "Monitoramento do estado do esquema de desempenho".

- `performance_schema_max_program_instances`

  <table frame="box" rules="all" summary="Propriedades para performance_schema_digests_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-digests-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_digests_size">performance_schema_digests_size</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>5

  O número máximo de programas armazenados para os quais o Schema de Desempenho mantém estatísticas. Se esse limite for excedido, o Schema de Desempenho incrementa a variável de status `Performance_schema_program_lost`. Para obter informações sobre como definir e usar essa variável, consulte Seção 25.7, “Monitoramento do Status do Schema de Desempenho”.

- `performance_schema_max_rwlock_instances`

  <table frame="box" rules="all" summary="Propriedades para performance_schema_digests_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-digests-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_digests_size">performance_schema_digests_size</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>6

  O número máximo de objetos instrumentados de rwlock. Para obter informações sobre como definir e usar essa variável, consulte Seção 25.7, “Monitoramento do Status do Schema de Desempenho”.

- `performance_schema_max_socket_classes`

  <table frame="box" rules="all" summary="Propriedades para performance_schema_digests_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-digests-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_digests_size">performance_schema_digests_size</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>7

  O número máximo de instrumentos de soquete. Para obter informações sobre como definir e usar essa variável, consulte Seção 25.7, "Monitoramento do estado do esquema de desempenho".

- `performance_schema_max_socket_instances`

  <table frame="box" rules="all" summary="Propriedades para performance_schema_digests_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-digests-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_digests_size">performance_schema_digests_size</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>8

  O número máximo de objetos de soquete instrumentados. Para obter informações sobre como definir e usar essa variável, consulte Seção 25.7, “Monitoramento do Status do Schema de Desempenho”.

- `performance_schema_max_sql_text_length`

  <table frame="box" rules="all" summary="Propriedades para performance_schema_digests_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-digests-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_digests_size">performance_schema_digests_size</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>9

  O número máximo de bytes usados para armazenar instruções SQL na coluna `SQL_TEXT` das tabelas de eventos de instruções `[events_statements_current]` (performance-schema-events-statements-current-table.html), `[events_statements_history]` (performance-schema-events-statements-history-table.html) e `[events_statements_history_long]` (performance-schema-events-statements-history-long-table.html). Qualquer byte em excesso de `[performance_schema_max_sql_text_length]` (performance-schema-system-variables.html#sysvar\_performance\_schema\_max\_sql\_text\_length) é descartado e não aparece na coluna `SQL_TEXT`. As instruções que diferem apenas após esse número inicial de bytes são indistinguíveis nesta coluna.

  Reduzir o valor de `performance_schema_max_sql_text_length` diminui o uso de memória, mas faz com que mais instruções se tornem indistinguíveis se diferirem apenas no final. Aumentar o valor aumenta o uso de memória, mas permite que instruções mais longas sejam distinguidas.

- `performance_schema_max_stage_classes`

  <table frame="box" rules="all" summary="Propriedades para performance_schema_events_stages_history_long_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-events-stages-history-long-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_events_stages_history_long_size">performance_schema_events_stages_history_long_size</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>0

  O número máximo de instrumentos de palco. Para obter informações sobre como definir e usar essa variável, consulte Seção 25.7, "Monitoramento do Status do Schema de Desempenho".

- `performance_schema_max_statement_classes`

  <table frame="box" rules="all" summary="Propriedades para performance_schema_events_stages_history_long_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-events-stages-history-long-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_events_stages_history_long_size">performance_schema_events_stages_history_long_size</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>1

  O número máximo de instrumentos de declaração. Para obter informações sobre como definir e usar essa variável, consulte Seção 25.7, “Monitoramento do Status do Schema de Desempenho”.

  O valor padrão é calculado no momento da construção do servidor com base no número de comandos no protocolo cliente/servidor e no número de tipos de instruções SQL suportados pelo servidor.

  Essa variável não deve ser alterada, a menos que seja definida como 0 para desativar toda a instrumentação de instruções e salvar toda a memória associada a ela. Definir a variável com valores diferentes do padrão não oferece nenhum benefício; em particular, valores maiores que o padrão causam a alocação de mais memória do que o necessário.

- `performance_schema_max_statement_stack`

  <table frame="box" rules="all" summary="Propriedades para performance_schema_events_stages_history_long_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-events-stages-history-long-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_events_stages_history_long_size">performance_schema_events_stages_history_long_size</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>2

  A profundidade máxima de chamadas de programas armazenados aninhados para as quais o Schema de Desempenho mantém estatísticas. Quando esse limite é ultrapassado, o Schema de Desempenho incrementa a variável de status `Performance_schema_nested_statement_lost` para cada instrução de programa armazenado executada.

- `performance_schema_max_table_handles`

  <table frame="box" rules="all" summary="Propriedades para performance_schema_events_stages_history_long_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-events-stages-history-long-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_events_stages_history_long_size">performance_schema_events_stages_history_long_size</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>3

  O número máximo de objetos de tabela abertos. Esse valor controla o tamanho da tabela `table_handles`. Se esse valor for excedido, de modo que um handle de tabela não possa ser instrumentado, o Schema de Desempenho incrementa a variável de status `Performance_schema_table_handles_lost`. Para obter informações sobre como definir e usar essa variável, consulte Seção 25.7, “Monitoramento de Status do Schema de Desempenho”.

- `performance_schema_max_table_instances`

  <table frame="box" rules="all" summary="Propriedades para performance_schema_events_stages_history_long_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-events-stages-history-long-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_events_stages_history_long_size">performance_schema_events_stages_history_long_size</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>4

  O número máximo de objetos de tabela instrumentados. Para obter informações sobre como definir e usar essa variável, consulte Seção 25.7, “Monitoramento do Status do Schema de Desempenho”.

- `performance_schema_max_table_lock_stat`

  <table frame="box" rules="all" summary="Propriedades para performance_schema_events_stages_history_long_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-events-stages-history-long-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_events_stages_history_long_size">performance_schema_events_stages_history_long_size</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>5

  O número máximo de tabelas para as quais o Schema de Desempenho mantém estatísticas de bloqueio. Se esse limite for ultrapassado, de modo que as estatísticas de bloqueio de tabelas sejam perdidas, o Schema de Desempenho incrementa a variável de status `Performance_schema_table_lock_stat_lost`.

- `performance_schema_max_thread_classes`

  <table frame="box" rules="all" summary="Propriedades para performance_schema_events_stages_history_long_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-events-stages-history-long-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_events_stages_history_long_size">performance_schema_events_stages_history_long_size</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>6

  O número máximo de instrumentos de fio. Para obter informações sobre como definir e usar essa variável, consulte Seção 25.7, "Monitoramento do Status do Schema de Desempenho".

- `performance_schema_max_thread_instances`

  <table frame="box" rules="all" summary="Propriedades para performance_schema_events_stages_history_long_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-events-stages-history-long-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_events_stages_history_long_size">performance_schema_events_stages_history_long_size</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>7

  O número máximo de objetos de fio instrumentados. O valor controla o tamanho da tabela `threads`. Se esse máximo for excedido, de modo que um fio não possa ser instrumentado, o Schema de Desempenho incrementa a variável de status `Performance_schema_thread_instances_lost`. Para obter informações sobre como definir e usar essa variável, consulte Seção 25.7, “Monitoramento de Status do Schema de Desempenho”.

  A variável de sistema `max_connections` afeta quantos threads podem ser executados no servidor. A variável de sistema `performance_schema_max_thread_instances` afeta quantos desses threads em execução podem ser instrumentados.

  As tabelas `variables_by_thread` e `status_by_thread` contêm informações sobre variáveis de sistema e status apenas sobre os threads em primeiro plano. Se nem todos os threads estiverem instrumentados pelo Schema de Desempenho, essa tabela pode perder algumas linhas. Nesse caso, a variável de status `Performance_schema_thread_instances_lost` é maior que zero.

- `performance_schema_session_connect_attrs_size`

  <table frame="box" rules="all" summary="Propriedades para performance_schema_events_stages_history_long_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-events-stages-history-long-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_events_stages_history_long_size">performance_schema_events_stages_history_long_size</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>8

  A quantidade de memória pré-alocate por fio reservada para armazenar pares chave-valor de atributos de conexão. Se o tamanho agregado dos dados de atributos de conexão enviados por um cliente for maior que essa quantidade, o Gerenciamento de Desempenho truncá-losá os dados do atributo, incrementará a variável de status `Performance_schema_session_connect_attrs_lost` e escreverá uma mensagem no log de erro, indicando que a truncagem ocorreu se o valor da variável de sistema `log_error_verbosity` for maior que 1.

  O valor padrão de `performance_schema_session_connect_attrs_size` é dimensionado automaticamente ao iniciar o servidor. Esse valor pode ser pequeno, portanto, se ocorrer uma truncagem (`Performance_schema_session_connect_attrs_lost` tornar-se não nulo), você pode querer definir `performance_schema_session_connect_attrs_size` explicitamente para um valor maior.

  Embora o valor máximo permitido de `performance_schema_session_connect_attrs_size` seja de 1 MB, o máximo efetivo é de 64 KB, pois o servidor impõe um limite de 64 KB ao tamanho agregado dos dados dos atributos de conexão que ele pode aceitar. Se um cliente tentar enviar mais de 64 KB de dados de atributo, o servidor rejeita a conexão. Para mais informações, consulte Seção 25.12.9, “Tabelas de Atributos de Conexão do Schema de Desempenho”.

- `performance_schema_setup_actors_size`

  <table frame="box" rules="all" summary="Propriedades para performance_schema_events_stages_history_long_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-events-stages-history-long-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_events_stages_history_long_size">performance_schema_events_stages_history_long_size</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>9

  O número de linhas na tabela `setup_actors`.

- `performance_schema_setup_objects_size`

  <table frame="box" rules="all" summary="Propriedades para performance_schema_events_stages_history_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-events-stages-history-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_events_stages_history_size">performance_schema_events_stages_history_size</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1024</code>]]</td> </tr></tbody></table>0

  O número de linhas na tabela `setup_objects`.

- `performance_schema_show_processlist`

  <table frame="box" rules="all" summary="Propriedades para performance_schema_events_stages_history_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-events-stages-history-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_events_stages_history_size">performance_schema_events_stages_history_size</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1024</code>]]</td> </tr></tbody></table>1

  A instrução `SHOW PROCESSLIST` fornece informações sobre os processos ao coletar dados de todas as threads ativas. A variável `performance_schema_show_processlist` determina qual implementação do `SHOW PROCESSLIST` deve ser usada:

  - A implementação padrão itera por threads ativas a partir do gerenciador de threads, mantendo um mutex global. Isso tem consequências negativas de desempenho, especialmente em sistemas ocupados.

  - A implementação alternativa `SHOW PROCESSLIST` é baseada na tabela do Schema de Desempenho `processlist`. Essa implementação consulta dados de threads ativas do Schema de Desempenho em vez do gerenciador de threads e não requer um mutex.

  Para habilitar a implementação alternativa, habilite a variável de sistema `performance_schema_show_processlist`. Para garantir que as implementações padrão e alternativa forneçam as mesmas informações, devem ser atendidas certas exigências de configuração; consulte Seção 25.12.16.3, “A tabela processlist”.

- `performance_schema_users_size`

  <table frame="box" rules="all" summary="Propriedades para performance_schema_events_stages_history_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-events-stages-history-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_events_stages_history_size">performance_schema_events_stages_history_size</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1024</code>]]</td> </tr></tbody></table>2

  O número de linhas na tabela `users`. Se essa variável for 0, o Schema de Desempenho não mantém estatísticas de conexão na tabela `users` ou informações da variável de status na tabela `status_by_user`.
