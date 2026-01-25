## 25.15 Variáveis de Sistema do Performance Schema

O Performance Schema implementa diversas variáveis de sistema que fornecem informações de configuração:

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

As variáveis de sistema do Performance Schema podem ser definidas na inicialização do servidor (server startup) na linha de comando ou em arquivos de opções, e muitas podem ser definidas em tempo de execução (runtime). Consulte [Seção 25.13, “Referência de Opções e Variáveis do Performance Schema”](performance-schema-option-variable-reference.html "25.13 Referência de Opções e Variáveis do Performance Schema").

O Performance Schema dimensiona automaticamente os valores de vários de seus parâmetros na inicialização do servidor se eles não forem definidos explicitamente. Para mais informações, consulte [Seção 25.3, “Configuração de Inicialização do Performance Schema”](performance-schema-startup-configuration.html "25.3 Configuração de Inicialização do Performance Schema").

As variáveis de sistema do Performance Schema têm os seguintes significados:

* [`performance_schema`](performance-schema-system-variables.html#sysvar_performance_schema)

  <table frame="box" rules="all" summary="Propriedades para performance_schema"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--performance-schema[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>performance_schema</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  O valor desta variável é `ON` ou `OFF` para indicar se o Performance Schema está habilitado. Por padrão, o valor é `ON`. Na inicialização do servidor, você pode especificar esta variável sem valor ou com o valor `ON` ou 1 para habilitá-la, ou com o valor `OFF` ou 0 para desabilitá-la.

  Mesmo quando o Performance Schema está desabilitado, ele continua a popular as tabelas [`global_variables`], [`session_variables`], [`global_status`] e [`session_status`]. Isso ocorre conforme necessário para permitir que os resultados das instruções [`SHOW VARIABLES`] e [`SHOW STATUS`] sejam obtidos dessas tabelas, dependendo da configuração da variável de sistema `show_compatibiliy_56`.

* [`performance_schema_accounts_size`](performance-schema-system-variables.html#sysvar_performance_schema_accounts_size)

  <table frame="box" rules="all" summary="Propriedades para performance_schema_accounts_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--performance-schema-accounts-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>performance_schema_accounts_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr></tbody></table>

  O número de linhas na tabela [`accounts`]. Se esta variável for 0, o Performance Schema não mantém estatísticas de conexão na tabela [`accounts`] ou informações de variáveis de status na tabela [`status_by_account`].

* [`performance_schema_digests_size`](performance-schema-system-variables.html#sysvar_performance_schema_digests_size)

  <table frame="box" rules="all" summary="Propriedades para performance_schema_digests_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--performance-schema-digests-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>performance_schema_digests_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa autosizing; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr></tbody></table>

  O número máximo de linhas na tabela [`events_statements_summary_by_digest`]. Se este máximo for excedido de forma que um digest não possa ser instrumentado, o Performance Schema incrementa a variável de status [`Performance_schema_digest_lost`].

  Para mais informações sobre statement digesting, consulte [Seção 25.10, “Statement Digests do Performance Schema”](performance-schema-statement-digests.html "25.10 Statement Digests do Performance Schema").

* [`performance_schema_events_stages_history_long_size`](performance-schema-system-variables.html#sysvar_performance_schema_events_stages_history_long_size)

  <table frame="box" rules="all" summary="Propriedades para performance_schema_events_stages_history_long_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--performance-schema-events-stages-history-long-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>performance_schema_events_stages_history_long_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa autosizing; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr></tbody></table>

  O número de linhas na tabela [`events_stages_history_long`].

* [`performance_schema_events_stages_history_size`](performance-schema-system-variables.html#sysvar_performance_schema_events_stages_history_size)

  <table frame="box" rules="all" summary="Propriedades para performance_schema_events_stages_history_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--performance-schema-events-stages-history-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>performance_schema_events_stages_history_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa autosizing; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor Máximo</th> <td><code>1024</code></td> </tr></tbody></table>

  O número de linhas por Thread na tabela [`events_stages_history`].

* [`performance_schema_events_statements_history_long_size`](performance-schema-system-variables.html#sysvar_performance_schema_events_statements_history_long_size)

  <table frame="box" rules="all" summary="Propriedades para performance_schema_events_statements_history_long_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--performance-schema-events-statements-history-long-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>performance_schema_events_statements_history_long_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa autosizing; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr></tbody></table>

  O número de linhas na tabela [`events_statements_history_long`].

* [`performance_schema_events_statements_history_size`](performance-schema-system-variables.html#sysvar_performance_schema_events_statements_history_size)

  <table frame="box" rules="all" summary="Propriedades para performance_schema_events_statements_history_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--performance-schema-events-statements-history-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>performance_schema_events_statements_history_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa autosizing; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor Máximo</th> <td><code>1024</code></td> </tr></tbody></table>

  O número de linhas por Thread na tabela [`events_statements_history`].

* [`performance_schema_events_transactions_history_long_size`](performance-schema-system-variables.html#sysvar_performance_schema_events_transactions_history_long_size)

  <table frame="box" rules="all" summary="Propriedades para performance_schema_events_transactions_history_long_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--performance-schema-events-transactions-history-long-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>performance_schema_events_transactions_history_long_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa autosizing; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr></tbody></table>

  O número de linhas na tabela [`events_transactions_history_long`].

* [`performance_schema_events_transactions_history_size`](performance-schema-system-variables.html#sysvar_performance_schema_events_transactions_history_size)

  <table frame="box" rules="all" summary="Propriedades para performance_schema_events_transactions_history_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--performance-schema-events-transactions-history-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>performance_schema_events_transactions_history_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa autosizing; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor Máximo</th> <td><code>1024</code></td> </tr></tbody></table>

  O número de linhas por Thread na tabela [`events_transactions_history`].

* [`performance_schema_events_waits_history_long_size`](performance-schema-system-variables.html#sysvar_performance_schema_events_waits_history_long_size)

  <table frame="box" rules="all" summary="Propriedades para performance_schema_events_waits_history_long_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--performance-schema-events-waits-history-long-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>performance_schema_events_waits_history_long_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa autosizing; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr></tbody></table>

  O número de linhas na tabela [`events_waits_history_long`].

* [`performance_schema_events_waits_history_size`](performance-schema-system-variables.html#sysvar_performance_schema_events_waits_history_size)

  <table frame="box" rules="all" summary="Propriedades para performance_schema_accounts_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--performance-schema-accounts-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>performance_schema_accounts_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr></tbody></table>

  O número de linhas por Thread na tabela [`events_waits_history`].

* [`performance_schema_hosts_size`](performance-schema-system-variables.html#sysvar_performance_schema_hosts_size)

  <table frame="box" rules="all" summary="Propriedades para performance_schema_accounts_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--performance-schema-accounts-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>performance_schema_accounts_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr></tbody></table>

  O número de linhas na tabela [`hosts`]. Se esta variável for 0, o Performance Schema não mantém estatísticas de conexão na tabela [`hosts`] ou informações de variáveis de status na tabela [`status_by_host`].

* [`performance_schema_max_cond_classes`](performance-schema-system-variables.html#sysvar_performance_schema_max_cond_classes)

  <table frame="box" rules="all" summary="Propriedades para performance_schema_accounts_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--performance-schema-accounts-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>performance_schema_accounts_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr></tbody></table>

  O número máximo de condition instruments. Para informações sobre como configurar e usar esta variável, consulte [Seção 25.7, “Monitoramento de Status do Performance Schema”](performance-schema-status-monitoring.html "25.7 Monitoramento de Status do Performance Schema").

* [`performance_schema_max_cond_instances`](performance-schema-system-variables.html#sysvar_performance_schema_max_cond_instances)

  <table frame="box" rules="all" summary="Propriedades para performance_schema_accounts_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--performance-schema-accounts-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>performance_schema_accounts_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr></tbody></table>

  O número máximo de objetos de condition instrumentados. Para informações sobre como configurar e usar esta variável, consulte [Seção 25.7, “Monitoramento de Status do Performance Schema”](performance-schema-status-monitoring.html "25.7 Monitoramento de Status do Performance Schema").

* [`performance_schema_max_digest_length`](performance-schema-system-variables.html#sysvar_performance_schema_max_digest_length)

  <table frame="box" rules="all" summary="Propriedades para performance_schema_accounts_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--performance-schema-accounts-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>performance_schema_accounts_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr></tbody></table>

  O número máximo de bytes de memória reservado por statement para o cálculo de valores de statement digest normalizados no Performance Schema. Esta variável está relacionada a [`max_digest_length`]; consulte a descrição dessa variável em [Seção 5.1.7, “Variáveis de Sistema do Servidor”](server-system-variables.html "5.1.7 Variáveis de Sistema do Servidor").

  Para mais informações sobre statement digesting, incluindo considerações sobre o uso de memória, consulte [Seção 25.10, “Statement Digests do Performance Schema”](performance-schema-statement-digests.html "25.10 Statement Digests do Performance Schema").

* [`performance_schema_max_file_classes`](performance-schema-system-variables.html#sysvar_performance_schema_max_file_classes)

  <table frame="box" rules="all" summary="Propriedades para performance_schema_accounts_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--performance-schema-accounts-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>performance_schema_accounts_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr></tbody></table>

  O número máximo de file instruments. Para informações sobre como configurar e usar esta variável, consulte [Seção 25.7, “Monitoramento de Status do Performance Schema”](performance-schema-status-monitoring.html "25.7 Monitoramento de Status do Performance Schema").

* [`performance_schema_max_file_handles`](performance-schema-system-variables.html#sysvar_performance_schema_max_file_handles)

  <table frame="box" rules="all" summary="Propriedades para performance_schema_accounts_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--performance-schema-accounts-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>performance_schema_accounts_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr></tbody></table>

  O número máximo de objetos de file abertos. Para informações sobre como configurar e usar esta variável, consulte [Seção 25.7, “Monitoramento de Status do Performance Schema”](performance-schema-status-monitoring.html "25.7 Monitoramento de Status do Performance Schema").

  O valor de [`performance_schema_max_file_handles`] deve ser maior do que o valor de [`open_files_limit`]: [`open_files_limit`] afeta o número máximo de file handles abertos que o servidor pode suportar e [`performance_schema_max_file_handles`] afeta quantos desses file handles podem ser instrumentados.

* [`performance_schema_max_file_instances`](performance-schema-system-variables.html#sysvar_performance_schema_max_file_instances)

  <table frame="box" rules="all" summary="Propriedades para performance_schema_accounts_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--performance-schema-accounts-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>performance_schema_accounts_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr></tbody></table>

  O número máximo de objetos de file instrumentados. Para informações sobre como configurar e usar esta variável, consulte [Seção 25.7, “Monitoramento de Status do Performance Schema”](performance-schema-status-monitoring.html "25.7 Monitoramento de Status do Performance Schema").

* [`performance_schema_max_index_stat`](performance-schema-system-variables.html#sysvar_performance_schema_max_index_stat)

  <table frame="box" rules="all" summary="Propriedades para performance_schema_accounts_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--performance-schema-accounts-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>performance_schema_accounts_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr></tbody></table>

  O número máximo de Indexes para os quais o Performance Schema mantém estatísticas. Se este máximo for excedido de forma que as estatísticas do Index sejam perdidas, o Performance Schema incrementa a variável de status [`Performance_schema_index_stat_lost`]. O valor padrão é dimensionado automaticamente usando o valor de [`performance_schema_max_table_instances`].

* [`performance_schema_max_memory_classes`](performance-schema-system-variables.html#sysvar_performance_schema_max_memory_classes)

  <table frame="box" rules="all" summary="Propriedades para performance_schema_accounts_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--performance-schema-accounts-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>performance_schema_accounts_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr></tbody></table>

  O número máximo de memory instruments. Para informações sobre como configurar e usar esta variável, consulte [Seção 25.7, “Monitoramento de Status do Performance Schema”](performance-schema-status-monitoring.html "25.7 Monitoramento de Status do Performance Schema").

* [`performance_schema_max_metadata_locks`](performance-schema-system-variables.html#sysvar_performance_schema_max_metadata_locks)

  <table frame="box" rules="all" summary="Propriedades para performance_schema_digests_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--performance-schema-digests-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>performance_schema_digests_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa autosizing; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr></tbody></table>

  O número máximo de metadata Lock instruments. Este valor controla o tamanho da tabela [`metadata_locks`]. Se este máximo for excedido de forma que um metadata Lock não possa ser instrumentado, o Performance Schema incrementa a variável de status [`Performance_schema_metadata_lock_lost`].

* [`performance_schema_max_mutex_classes`](performance-schema-system-variables.html#sysvar_performance_schema_max_mutex_classes)

  <table frame="box" rules="all" summary="Propriedades para performance_schema_digests_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--performance-schema-digests-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>performance_schema_digests_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa autosizing; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr></tbody></table>

  O número máximo de mutex instruments. Para informações sobre como configurar e usar esta variável, consulte [Seção 25.7, “Monitoramento de Status do Performance Schema”](performance-schema-status-monitoring.html "25.7 Monitoramento de Status do Performance Schema").

* [`performance_schema_max_mutex_instances`](performance-schema-system-variables.html#sysvar_performance_schema_max_mutex_instances)

  <table frame="box" rules="all" summary="Propriedades para performance_schema_digests_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--performance-schema-digests-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>performance_schema_digests_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa autosizing; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr></tbody></table>

  O número máximo de objetos de mutex instrumentados. Para informações sobre como configurar e usar esta variável, consulte [Seção 25.7, “Monitoramento de Status do Performance Schema”](performance-schema-status-monitoring.html "25.7 Monitoramento de Status do Performance Schema").

* [`performance_schema_max_prepared_statements_instances`](performance-schema-system-variables.html#sysvar_performance_schema_max_prepared_statements_instances)

  <table frame="box" rules="all" summary="Propriedades para performance_schema_digests_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--performance-schema-digests-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>performance_schema_digests_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa autosizing; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr></tbody></table>

  O número máximo de linhas na tabela [`prepared_statements_instances`]. Se este máximo for excedido de forma que um prepared statement não possa ser instrumentado, o Performance Schema incrementa a variável de status [`Performance_schema_prepared_statements_lost`]. Para informações sobre como configurar e usar esta variável, consulte [Seção 25.7, “Monitoramento de Status do Performance Schema”](performance-schema-status-monitoring.html "25.7 Monitoramento de Status do Performance Schema").

  O valor padrão desta variável é dimensionado automaticamente com base no valor da variável de sistema [`max_prepared_stmt_count`].

* [`performance_schema_max_rwlock_classes`](performance-schema-system-variables.html#sysvar_performance_schema_max_rwlock_classes)

  <table frame="box" rules="all" summary="Propriedades para performance_schema_digests_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--performance-schema-digests-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>performance_schema_digests_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa autosizing; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr></tbody></table>

  O número máximo de rwlock instruments. Para informações sobre como configurar e usar esta variável, consulte [Seção 25.7, “Monitoramento de Status do Performance Schema”](performance-schema-status-monitoring.html "25.7 Monitoramento de Status do Performance Schema").

* [`performance_schema_max_program_instances`](performance-schema-system-variables.html#sysvar_performance_schema_max_program_instances)

  <table frame="box" rules="all" summary="Propriedades para performance_schema_digests_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--performance-schema-digests-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>performance_schema_digests_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa autosizing; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr></tbody></table>

  O número máximo de stored programs para os quais o Performance Schema mantém estatísticas. Se este máximo for excedido, o Performance Schema incrementa a variável de status [`Performance_schema_program_lost`]. Para informações sobre como configurar e usar esta variável, consulte [Seção 25.7, “Monitoramento de Status do Performance Schema”](performance-schema-status-monitoring.html "25.7 Monitoramento de Status do Performance Schema").

* [`performance_schema_max_rwlock_instances`](performance-schema-system-variables.html#sysvar_performance_schema_max_rwlock_instances)

  <table frame="box" rules="all" summary="Propriedades para performance_schema_digests_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--performance-schema-digests-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>performance_schema_digests_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa autosizing; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr></tbody></table>

  O número máximo de objetos de rwlock instrumentados. Para informações sobre como configurar e usar esta variável, consulte [Seção 25.7, “Monitoramento de Status do Performance Schema”](performance-schema-status-monitoring.html "25.7 Monitoramento de Status do Performance Schema").

* [`performance_schema_max_socket_classes`](performance-schema-system-variables.html#sysvar_performance_schema_max_socket_classes)

  <table frame="box" rules="all" summary="Propriedades para performance_schema_digests_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--performance-schema-digests-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>performance_schema_digests_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa autosizing; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr></tbody></table>

  O número máximo de socket instruments. Para informações sobre como configurar e usar esta variável, consulte [Seção 25.7, “Monitoramento de Status do Performance Schema”](performance-schema-status-monitoring.html "25.7 Monitoramento de Status do Performance Schema").

* [`performance_schema_max_socket_instances`](performance-schema-system-variables.html#sysvar_performance_schema_max_socket_instances)

  <table frame="box" rules="all" summary="Propriedades para performance_schema_digests_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--performance-schema-digests-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>performance_schema_digests_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa autosizing; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr></tbody></table>

  O número máximo de objetos de socket instrumentados. Para informações sobre como configurar e usar esta variável, consulte [Seção 25.7, “Monitoramento de Status do Performance Schema”](performance-schema-status-monitoring.html "25.7 Monitoramento de Status do Performance Schema").

* [`performance_schema_max_sql_text_length`](performance-schema-system-variables.html#sysvar_performance_schema_max_sql_text_length)

  <table frame="box" rules="all" summary="Propriedades para performance_schema_digests_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--performance-schema-digests-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>performance_schema_digests_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa autosizing; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr></tbody></table>

  O número máximo de bytes usados para armazenar SQL statements na coluna `SQL_TEXT` das tabelas de statement events [`events_statements_current`], [`events_statements_history`] e [`events_statements_history_long`]. Qualquer byte que exceda [`performance_schema_max_sql_text_length`] é descartado e não aparece na coluna `SQL_TEXT`. Statements que diferem apenas após esse número inicial de bytes são indistinguíveis nesta coluna.

  Diminuir o valor de [`performance_schema_max_sql_text_length`] reduz o uso de memória, mas faz com que mais statements se tornem indistinguíveis se diferirem apenas no final. Aumentar o valor aumenta o uso de memória, mas permite que statements mais longos sejam distinguidos.

* [`performance_schema_max_stage_classes`](performance-schema-system-variables.html#sysvar_performance_schema_max_stage_classes)

  <table frame="box" rules="all" summary="Propriedades para performance_schema_events_stages_history_long_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--performance-schema-events-stages-history-long-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>performance_schema_events_stages_history_long_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa autosizing; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr></tbody></table>

  O número máximo de stage instruments. Para informações sobre como configurar e usar esta variável, consulte [Seção 25.7, “Monitoramento de Status do Performance Schema”](performance-schema-status-monitoring.html "25.7 Monitoramento de Status do Performance Schema").

* [`performance_schema_max_statement_classes`](performance-schema-system-variables.html#sysvar_performance_schema_max_statement_classes)

  <table frame="box" rules="all" summary="Propriedades para performance_schema_events_stages_history_long_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--performance-schema-events-stages-history-long-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>performance_schema_events_stages_history_long_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa autosizing; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr></tbody></table>

  O número máximo de statement instruments. Para informações sobre como configurar e usar esta variável, consulte [Seção 25.7, “Monitoramento de Status do Performance Schema”](performance-schema-status-monitoring.html "25.7 Monitoramento de Status do Performance Schema").

  O valor padrão é calculado no momento da compilação do servidor com base no número de comandos no protocolo cliente/servidor e no número de tipos de SQL statement suportados pelo servidor.

  Esta variável não deve ser alterada, a menos que seja para defini-la como 0 para desabilitar toda a instrumentação de statement e economizar toda a memória associada a ela. Definir a variável para valores não zero diferentes do padrão não traz benefícios; em particular, valores maiores do que o padrão causam a alocação de mais memória do que o necessário.

* [`performance_schema_max_statement_stack`](performance-schema-system-variables.html#sysvar_performance_schema_max_statement_stack)

  <table frame="box" rules="all" summary="Propriedades para performance_schema_events_stages_history_long_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--performance-schema-events-stages-history-long-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>performance_schema_events_stages_history_long_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa autosizing; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr></tbody></table>

  A profundidade máxima de chamadas aninhadas de stored program para as quais o Performance Schema mantém estatísticas. Quando este máximo é excedido, o Performance Schema incrementa a variável de status [`Performance_schema_nested_statement_lost`] para cada stored program statement executado.

* [`performance_schema_max_table_handles`](performance-schema-system-variables.html#sysvar_performance_schema_max_table_handles)

  <table frame="box" rules="all" summary="Propriedades para performance_schema_events_stages_history_long_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--performance-schema-events-stages-history-long-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>performance_schema_events_stages_history_long_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa autosizing; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr></tbody></table>

  O número máximo de objetos de tabela abertos. Este valor controla o tamanho da tabela [`table_handles`]. Se este máximo for excedido de forma que um table handle não possa ser instrumentado, o Performance Schema incrementa a variável de status [`Performance_schema_table_handles_lost`]. Para informações sobre como configurar e usar esta variável, consulte [Seção 25.7, “Monitoramento de Status do Performance Schema”](performance-schema-status-monitoring.html "25.7 Monitoramento de Status do Performance Schema").

* [`performance_schema_max_table_instances`](performance-schema-system-variables.html#sysvar_performance_schema_max_table_instances)

  <table frame="box" rules="all" summary="Propriedades para performance_schema_events_stages_history_long_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--performance-schema-events-stages-history-long-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>performance_schema_events_stages_history_long_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa autosizing; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr></tbody></table>

  O número máximo de objetos de tabela instrumentados. Para informações sobre como configurar e usar esta variável, consulte [Seção 25.7, “Monitoramento de Status do Performance Schema”](performance-schema-status-monitoring.html "25.7 Monitoramento de Status do Performance Schema").

* [`performance_schema_max_table_lock_stat`](performance-schema-system-variables.html#sysvar_performance_schema_max_table_lock_stat)

  <table frame="box" rules="all" summary="Propriedades para performance_schema_events_stages_history_long_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--performance-schema-events-stages-history-long-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>performance_schema_events_stages_history_long_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa autosizing; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr></tbody></table>

  O número máximo de tabelas para as quais o Performance Schema mantém estatísticas de Lock. Se este máximo for excedido de forma que as estatísticas de table Lock sejam perdidas, o Performance Schema incrementa a variável de status [`Performance_schema_table_lock_stat_lost`].

* [`performance_schema_max_thread_classes`](performance-schema-system-variables.html#sysvar_performance_schema_max_thread_classes)

  <table frame="box" rules="all" summary="Propriedades para performance_schema_events_stages_history_long_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--performance-schema-events-stages-history-long-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>performance_schema_events_stages_history_long_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa autosizing; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr></tbody></table>

  O número máximo de Thread instruments. Para informações sobre como configurar e usar esta variável, consulte [Seção 25.7, “Monitoramento de Status do Performance Schema”](performance-schema-status-monitoring.html "25.7 Monitoramento de Status do Performance Schema").

* [`performance_schema_max_thread_instances`](performance-schema-system-variables.html#sysvar_performance_schema_max_thread_instances)

  <table frame="box" rules="all" summary="Propriedades para performance_schema_events_stages_history_long_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--performance-schema-events-stages-history-long-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>performance_schema_events_stages_history_long_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa autosizing; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr></tbody></table>

  O número máximo de objetos de Thread instrumentados. O valor controla o tamanho da tabela [`threads`]. Se este máximo for excedido de forma que um Thread não possa ser instrumentado, o Performance Schema incrementa a variável de status [`Performance_schema_thread_instances_lost`]. Para informações sobre como configurar e usar esta variável, consulte [Seção 25.7, “Monitoramento de Status do Performance Schema”](performance-schema-status-monitoring.html "25.7 Monitoramento de Status do Performance Schema").

  A variável de sistema [`max_connections`] afeta quantos Threads podem ser executados no servidor. [`performance_schema_max_thread_instances`] afeta quantos desses Threads em execução podem ser instrumentados.

  As tabelas [`variables_by_thread`] e [`status_by_thread`] contêm informações de variáveis de sistema e status apenas sobre Threads de primeiro plano (foreground Threads). Se nem todos os Threads forem instrumentados pelo Performance Schema, esta tabela pode perder algumas linhas. Neste caso, a variável de status [`Performance_schema_thread_instances_lost`] é maior que zero.

* [`performance_schema_session_connect_attrs_size`](performance-schema-system-variables.html#sysvar_performance_schema_session_connect_attrs_size)

  <table frame="box" rules="all" summary="Propriedades para performance_schema_events_stages_history_long_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--performance-schema-events-stages-history-long-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>performance_schema_events_stages_history_long_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa autosizing; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr></tbody></table>

  A quantidade de memória pré-alocada por Thread reservada para armazenar pares chave-valor (key-value pairs) de atributos de conexão. Se o tamanho agregado dos dados de atributo de conexão enviados por um cliente for maior do que essa quantidade, o Performance Schema trunca os dados de atributo, incrementa a variável de status [`Performance_schema_session_connect_attrs_lost`] e escreve uma mensagem no error log indicando que ocorreu o truncamento se o valor da variável de sistema [`log_error_verbosity`] for maior que 1.

  O valor padrão de [`performance_schema_session_connect_attrs_size`] é dimensionado automaticamente na inicialização do servidor. Este valor pode ser pequeno, então, se ocorrer truncamento ([`Performance_schema_session_connect_attrs_lost`] se tornar diferente de zero), você pode querer definir [`performance_schema_session_connect_attrs_size`] explicitamente para um valor maior.

  Embora o valor máximo permitido para [`performance_schema_session_connect_attrs_size`] seja 1MB, o máximo efetivo é 64KB porque o servidor impõe um limite de 64KB no tamanho agregado dos dados de atributo de conexão que pode aceitar. Se um cliente tentar enviar mais de 64KB de dados de atributo, o servidor rejeita a conexão. Para mais informações, consulte [Seção 25.12.9, “Tabelas de Atributos de Conexão do Performance Schema”](performance-schema-connection-attribute-tables.html "25.12.9 Tabelas de Atributos de Conexão do Performance Schema").

* [`performance_schema_setup_actors_size`](performance-schema-system-variables.html#sysvar_performance_schema_setup_actors_size)

  <table frame="box" rules="all" summary="Propriedades para performance_schema_events_stages_history_long_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--performance-schema-events-stages-history-long-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>performance_schema_events_stages_history_long_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa autosizing; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr></tbody></table>

  O número de linhas na tabela [`setup_actors`].

* [`performance_schema_setup_objects_size`](performance-schema-system-variables.html#sysvar_performance_schema_setup_objects_size)

  <table frame="box" rules="all" summary="Propriedades para performance_schema_events_stages_history_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--performance-schema-events-stages-history-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>performance_schema_events_stages_history_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa autosizing; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor Máximo</th> <td><code>1024</code></td> </tr></tbody></table>

  O número de linhas na tabela [`setup_objects`].

* [`performance_schema_show_processlist`](performance-schema-system-variables.html#sysvar_performance_schema_show_processlist)

  <table frame="box" rules="all" summary="Propriedades para performance_schema_events_stages_history_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--performance-schema-events-stages-history-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>performance_schema_events_stages_history_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa autosizing; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor Máximo</th> <td><code>1024</code></td> </tr></tbody></table>

  A instrução [`SHOW PROCESSLIST`] fornece informações de processo coletando dados de Thread de todos os Threads ativos. A variável [`performance_schema_show_processlist`] determina qual implementação [`SHOW PROCESSLIST`] usar:

  + A implementação padrão itera sobre Threads ativos de dentro do gerenciador de Threads enquanto mantém um mutex global. Isso tem consequências negativas de Performance, particularmente em sistemas ocupados.

  + A implementação alternativa [`SHOW PROCESSLIST`] é baseada na tabela [`processlist`] do Performance Schema. Esta implementação consulta dados de Threads ativos do Performance Schema em vez do gerenciador de Threads e não requer um mutex.

  Para habilitar a implementação alternativa, habilite a variável de sistema [`performance_schema_show_processlist`]. Para garantir que as implementações padrão e alternativa forneçam as mesmas informações, certos requisitos de configuração devem ser atendidos; consulte [Seção 25.12.16.3, “A Tabela processlist”](performance-schema-processlist-table.html "25.12.16.3 A Tabela processlist").

* [`performance_schema_users_size`](performance-schema-system-variables.html#sysvar_performance_schema_users_size)

  <table frame="box" rules="all" summary="Propriedades para performance_schema_events_stages_history_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--performance-schema-events-stages-history-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>performance_schema_events_stages_history_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa autosizing; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor Máximo</th> <td><code>1024</code></td> </tr></tbody></table>

  O número de linhas na tabela [`users`]. Se esta variável for 0, o Performance Schema não mantém estatísticas de conexão na tabela [`users`] ou informações de variáveis de status na tabela [`status_by_user`].