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

As variáveis do sistema do Schema de desempenho podem ser definidas na linha de comando ou em arquivos de opção durante o início do servidor, e muitas podem ser definidas durante a execução. Veja a Seção 25.13, “Referência de opção e variável do Schema de desempenho”.

O Schema de Desempenho dimensiona automaticamente os valores de vários de seus parâmetros ao iniciar o servidor, se não forem definidos explicitamente. Para mais informações, consulte a Seção 25.3, “Configuração de Inicialização do Schema de Desempenho”.

As variáveis do sistema do esquema de desempenho têm os seguintes significados:

* `performance_schema`

  <table frame="box" rules="all" summary="Properties for performance_schema"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--performance-schema[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>performance_schema</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

O valor desta variável é `ON` ou `OFF` para indicar se o Schema de Desempenho está habilitado. Por padrão, o valor é `ON`. Na inicialização do servidor, você pode especificar esta variável sem valor ou com um valor de `ON` ou 1 para habilitá-la, ou com um valor de `OFF` ou 0 para desabilitá-la.

Mesmo quando o Schema de Desempenho é desativado, ele continua a preencher as tabelas `global_variables`, `session_variables`, `global_status` e `session_status`. Isso ocorre conforme necessário para permitir que os resultados para as declarações `SHOW VARIABLES` e `SHOW STATUS` sejam extraídos dessas tabelas, dependendo da configuração da variável de sistema `show_compatibiliy_56`.

* `performance_schema_accounts_size`

  <table frame="box" rules="all" summary="Properties for performance_schema_accounts_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--performance-schema-accounts-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>performance_schema_accounts_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code>(significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>-1</code>(significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Maximum Value</th> <td><code>1048576</code></td> </tr></tbody></table>

O número de linhas na tabela `accounts`. Se essa variável for 0, o Schema de Desempenho não mantém estatísticas de conexão na tabela `accounts` ou informações de variáveis de status na tabela `status_by_account`.

* `performance_schema_digests_size`

  <table frame="box" rules="all" summary="Properties for performance_schema_digests_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--performance-schema-digests-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>performance_schema_digests_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code>(significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>-1</code>(significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Maximum Value</th> <td><code>1048576</code></td> </tr></tbody></table>

O número máximo de linhas na tabela `events_statements_summary_by_digest`. Se esse máximo for excedido de tal forma que não seja possível instrumar um digest, o Schema de Desempenho incrementa a variável de status `Performance_schema_digest_lost`.

Para mais informações sobre a digestão de declarações, consulte a Seção 25.10, “Digestas de declarações do Schema de desempenho”.

* `performance_schema_events_stages_history_long_size`

  <table frame="box" rules="all" summary="Properties for performance_schema_events_stages_history_long_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--performance-schema-events-stages-history-long-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>performance_schema_events_stages_history_long_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code>(significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>-1</code>(significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Maximum Value</th> <td><code>1048576</code></td> </tr></tbody></table>

O número de linhas na tabela `events_stages_history_long`.

* `performance_schema_events_stages_history_size`

  <table frame="box" rules="all" summary="Properties for performance_schema_events_stages_history_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--performance-schema-events-stages-history-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>performance_schema_events_stages_history_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code>(significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>-1</code>(significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Maximum Value</th> <td><code>1024</code></td> </tr></tbody></table>

O número de linhas por fio na tabela `events_stages_history`.

* `performance_schema_events_statements_history_long_size`

  <table frame="box" rules="all" summary="Properties for performance_schema_events_statements_history_long_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--performance-schema-events-statements-history-long-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>performance_schema_events_statements_history_long_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code>(significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>-1</code>(significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Maximum Value</th> <td><code>1048576</code></td> </tr></tbody></table>

O número de linhas na tabela `events_statements_history_long`.

* `performance_schema_events_statements_history_size`

  <table frame="box" rules="all" summary="Properties for performance_schema_events_statements_history_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--performance-schema-events-statements-history-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>performance_schema_events_statements_history_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code>(significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>-1</code>(significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Maximum Value</th> <td><code>1024</code></td> </tr></tbody></table>

O número de linhas por fio na tabela `events_statements_history`.

* `performance_schema_events_transactions_history_long_size`

  <table frame="box" rules="all" summary="Properties for performance_schema_events_transactions_history_long_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--performance-schema-events-transactions-history-long-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>performance_schema_events_transactions_history_long_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code>(significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>-1</code>(significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Maximum Value</th> <td><code>1048576</code></td> </tr></tbody></table>

O número de linhas na tabela `events_transactions_history_long`.

* `performance_schema_events_transactions_history_size`

  <table frame="box" rules="all" summary="Properties for performance_schema_events_transactions_history_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--performance-schema-events-transactions-history-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>performance_schema_events_transactions_history_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code>(significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>-1</code>(significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Maximum Value</th> <td><code>1024</code></td> </tr></tbody></table>

O número de linhas por fio na tabela `events_transactions_history`.

* `performance_schema_events_waits_history_long_size`

  <table frame="box" rules="all" summary="Properties for performance_schema_events_waits_history_long_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--performance-schema-events-waits-history-long-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>performance_schema_events_waits_history_long_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code>(significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>-1</code>(significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Maximum Value</th> <td><code>1048576</code></td> </tr></tbody></table>

O número de linhas na tabela `events_waits_history_long`.

* `performance_schema_events_waits_history_size`

  <table frame="box" rules="all" summary="Properties for performance_schema_accounts_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--performance-schema-accounts-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>performance_schema_accounts_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code>(significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>-1</code>(significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Maximum Value</th> <td><code>1048576</code></td> </tr></tbody></table>0

O número de linhas por fio na tabela `events_waits_history`.

* `performance_schema_hosts_size`

  <table frame="box" rules="all" summary="Properties for performance_schema_accounts_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--performance-schema-accounts-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>performance_schema_accounts_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code>(significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>-1</code>(significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Maximum Value</th> <td><code>1048576</code></td> </tr></tbody></table>1

O número de linhas na tabela `hosts`. Se essa variável for 0, o Gerador de Desempenho não mantém estatísticas de conexão na tabela `hosts` ou informações de variáveis de status na tabela `status_by_host`.

* `performance_schema_max_cond_classes`

  <table frame="box" rules="all" summary="Properties for performance_schema_accounts_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--performance-schema-accounts-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>performance_schema_accounts_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code>(significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>-1</code>(significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Maximum Value</th> <td><code>1048576</code></td> </tr></tbody></table>2

O número máximo de instrumentos de condição. Para informações sobre como definir e usar essa variável, consulte a Seção 25.7, “Monitoramento do estado do esquema de desempenho”.

* `performance_schema_max_cond_instances`

  <table frame="box" rules="all" summary="Properties for performance_schema_accounts_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--performance-schema-accounts-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>performance_schema_accounts_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code>(significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>-1</code>(significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Maximum Value</th> <td><code>1048576</code></td> </tr></tbody></table>3

O número máximo de objetos de condição instrumentados. Para informações sobre como definir e usar essa variável, consulte a Seção 25.7, “Monitoramento do estado do esquema de desempenho”.

* `performance_schema_max_digest_length`

  <table frame="box" rules="all" summary="Properties for performance_schema_accounts_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--performance-schema-accounts-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>performance_schema_accounts_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code>(significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>-1</code>(significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Maximum Value</th> <td><code>1048576</code></td> </tr></tbody></table>4

O número máximo de bytes de memória reservados por declaração para o cálculo de valores de digestão de declaração normalizados no Gerador de desempenho. Esta variável está relacionada a `max_digest_length`; consulte a descrição dessa variável na Seção 5.1.7, “Variáveis do sistema do servidor”.

Para mais informações sobre a digestão de declarações, incluindo considerações sobre o uso da memória, consulte a Seção 25.10, “Digestas de declarações do Schema de desempenho”.

* `performance_schema_max_file_classes`

  <table frame="box" rules="all" summary="Properties for performance_schema_accounts_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--performance-schema-accounts-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>performance_schema_accounts_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code>(significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>-1</code>(significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Maximum Value</th> <td><code>1048576</code></td> </tr></tbody></table>5

O número máximo de instrumentos de arquivo. Para informações sobre como definir e usar essa variável, consulte a Seção 25.7, “Monitoramento do estado do esquema de desempenho”.

* `performance_schema_max_file_handles`

  <table frame="box" rules="all" summary="Properties for performance_schema_accounts_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--performance-schema-accounts-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>performance_schema_accounts_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code>(significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>-1</code>(significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Maximum Value</th> <td><code>1048576</code></td> </tr></tbody></table>6

O número máximo de objetos de arquivo abertos. Para informações sobre como definir e usar essa variável, consulte a Seção 25.7, “Monitoramento do estado do esquema de desempenho”.

O valor de `performance_schema_max_file_handles` deve ser maior que o valor de `open_files_limit`: `open_files_limit` afeta o número máximo de manipulações de arquivos abertos que o servidor pode suportar e `performance_schema_max_file_handles` afeta quantas dessas manipulações de arquivos podem ser instrumentadas.

* `performance_schema_max_file_instances`

  <table frame="box" rules="all" summary="Properties for performance_schema_accounts_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--performance-schema-accounts-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>performance_schema_accounts_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code>(significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>-1</code>(significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Maximum Value</th> <td><code>1048576</code></td> </tr></tbody></table>7

O número máximo de objetos de arquivo instrumentados. Para informações sobre como definir e usar essa variável, consulte a Seção 25.7, “Monitoramento do estado do esquema de desempenho”.

* `performance_schema_max_index_stat`

  <table frame="box" rules="all" summary="Properties for performance_schema_accounts_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--performance-schema-accounts-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>performance_schema_accounts_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code>(significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>-1</code>(significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Maximum Value</th> <td><code>1048576</code></td> </tr></tbody></table>8

O número máximo de índices para os quais o Schema de Desempenho mantém estatísticas. Se esse máximo for excedido, de modo que as estatísticas dos índices sejam perdidas, o Schema de Desempenho incrementa a variável de status `Performance_schema_index_stat_lost`. O valor padrão é dimensionado automaticamente usando o valor de `performance_schema_max_table_instances`.

* `performance_schema_max_memory_classes`

  <table frame="box" rules="all" summary="Properties for performance_schema_accounts_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--performance-schema-accounts-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>performance_schema_accounts_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code>(significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>-1</code>(significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Maximum Value</th> <td><code>1048576</code></td> </tr></tbody></table>9

O número máximo de instrumentos de memória. Para informações sobre como configurar e usar essa variável, consulte a Seção 25.7, “Monitoramento do estado do esquema de desempenho”.

* `performance_schema_max_metadata_locks`

  <table frame="box" rules="all" summary="Properties for performance_schema_digests_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--performance-schema-digests-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>performance_schema_digests_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code>(significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>-1</code>(significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Maximum Value</th> <td><code>1048576</code></td> </tr></tbody></table>0

O número máximo de instrumentos de bloqueio de metadados. Esse valor controla o tamanho da tabela `metadata_locks`. Se esse máximo for excedido de tal forma que um bloqueio de metadados não possa ser instrumentado, o Schema de Desempenho incrementa a variável de status `Performance_schema_metadata_lock_lost`.

* `performance_schema_max_mutex_classes`

  <table frame="box" rules="all" summary="Properties for performance_schema_digests_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--performance-schema-digests-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>performance_schema_digests_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code>(significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>-1</code>(significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Maximum Value</th> <td><code>1048576</code></td> </tr></tbody></table>1

O número máximo de instrumentos de mutex. Para obter informações sobre como definir e usar essa variável, consulte a Seção 25.7, “Monitoramento do estado do Schema de desempenho”.

* `performance_schema_max_mutex_instances`

  <table frame="box" rules="all" summary="Properties for performance_schema_digests_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--performance-schema-digests-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>performance_schema_digests_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code>(significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>-1</code>(significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Maximum Value</th> <td><code>1048576</code></td> </tr></tbody></table>2

O número máximo de objetos de mutex instrumentados. Para obter informações sobre como definir e usar essa variável, consulte a Seção 25.7, “Monitoramento do estado do Schema de desempenho”.

* `performance_schema_max_prepared_statements_instances`

  <table frame="box" rules="all" summary="Properties for performance_schema_digests_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--performance-schema-digests-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>performance_schema_digests_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code>(significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>-1</code>(significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Maximum Value</th> <td><code>1048576</code></td> </tr></tbody></table>3

O número máximo de linhas na tabela `prepared_statements_instances`. Se esse máximo for excedido de tal forma que uma declaração preparada não possa ser instrumentada, o Schema de Desempenho incrementa a variável de status `Performance_schema_prepared_statements_lost`. Para informações sobre como definir e usar essa variável, consulte a Seção 25.7, “Monitoramento de Status do Schema de Desempenho”.

O valor padrão desta variável é dimensionado automaticamente com base no valor da variável do sistema `max_prepared_stmt_count`.

* `performance_schema_max_rwlock_classes`

  <table frame="box" rules="all" summary="Properties for performance_schema_digests_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--performance-schema-digests-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>performance_schema_digests_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code>(significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>-1</code>(significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Maximum Value</th> <td><code>1048576</code></td> </tr></tbody></table>4

O número máximo de instrumentos rwlock. Para obter informações sobre como definir e usar essa variável, consulte a Seção 25.7, “Monitoramento do estado do esquema de desempenho”.

* `performance_schema_max_program_instances`

  <table frame="box" rules="all" summary="Properties for performance_schema_digests_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--performance-schema-digests-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>performance_schema_digests_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code>(significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>-1</code>(significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Maximum Value</th> <td><code>1048576</code></td> </tr></tbody></table>5

O número máximo de programas armazenados para os quais o Schema de Desempenho mantém estatísticas. Se esse máximo for excedido, o Schema de Desempenho incrementa a variável de status `Performance_schema_program_lost`. Para obter informações sobre como definir e usar essa variável, consulte a Seção 25.7, “Monitoramento de Status do Schema de Desempenho”.

* `performance_schema_max_rwlock_instances`

  <table frame="box" rules="all" summary="Properties for performance_schema_digests_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--performance-schema-digests-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>performance_schema_digests_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code>(significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>-1</code>(significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Maximum Value</th> <td><code>1048576</code></td> </tr></tbody></table>6

O número máximo de objetos instrumentados de rwlock. Para obter informações sobre como definir e usar essa variável, consulte a Seção 25.7, “Monitoramento do estado do Schema de desempenho”.

* `performance_schema_max_socket_classes`

  <table frame="box" rules="all" summary="Properties for performance_schema_digests_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--performance-schema-digests-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>performance_schema_digests_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code>(significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>-1</code>(significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Maximum Value</th> <td><code>1048576</code></td> </tr></tbody></table>7

O número máximo de instrumentos de soquete. Para obter informações sobre como definir e usar essa variável, consulte a Seção 25.7, “Monitoramento do estado do esquema de desempenho”.

* `performance_schema_max_socket_instances`

  <table frame="box" rules="all" summary="Properties for performance_schema_digests_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--performance-schema-digests-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>performance_schema_digests_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code>(significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>-1</code>(significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Maximum Value</th> <td><code>1048576</code></td> </tr></tbody></table>8

O número máximo de objetos de soquete instrumentados. Para obter informações sobre como definir e usar essa variável, consulte a Seção 25.7, “Monitoramento do estado do esquema de desempenho”.

* `performance_schema_max_sql_text_length`

  <table frame="box" rules="all" summary="Properties for performance_schema_digests_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--performance-schema-digests-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>performance_schema_digests_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code>(significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>-1</code>(significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Maximum Value</th> <td><code>1048576</code></td> </tr></tbody></table>9

O número máximo de bytes utilizados para armazenar declarações SQL nas colunas `SQL_TEXT` das tabelas de eventos de declaração `events_statements_current`, `events_statements_history` e `events_statements_history_long`. Quaisquer bytes em excesso de `performance_schema_max_sql_text_length` são descartados e não aparecem na coluna `SQL_TEXT`. Declarações que diferem apenas após esse número inicial de bytes são indistinguíveis nesta coluna.

A redução do valor de `performance_schema_max_sql_text_length` reduz o uso de memória, mas faz com que mais declarações se tornem indistinguíveis se diferirem apenas no final. O aumento do valor aumenta o uso de memória, mas permite que declarações mais longas sejam distinguidas.

* `performance_schema_max_stage_classes`

  <table frame="box" rules="all" summary="Properties for performance_schema_events_stages_history_long_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--performance-schema-events-stages-history-long-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>performance_schema_events_stages_history_long_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code>(significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>-1</code>(significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Maximum Value</th> <td><code>1048576</code></td> </tr></tbody></table>0

O número máximo de instrumentos de palco. Para informações sobre como definir e usar essa variável, consulte a Seção 25.7, “Monitoramento do estado do esquema de desempenho”.

* `performance_schema_max_statement_classes`

  <table frame="box" rules="all" summary="Properties for performance_schema_events_stages_history_long_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--performance-schema-events-stages-history-long-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>performance_schema_events_stages_history_long_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code>(significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>-1</code>(significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Maximum Value</th> <td><code>1048576</code></td> </tr></tbody></table>1

O número máximo de instrumentos de declaração. Para informações sobre como definir e usar essa variável, consulte a Seção 25.7, “Monitoramento do estado do esquema de desempenho”.

O valor padrão é calculado no momento da construção do servidor com base no número de comandos no protocolo cliente/servidor e no número de tipos de declaração SQL suportados pelo servidor.

Essa variável não deve ser alterada, a menos que seja definida como 0 para desativar toda a instrumentação de declarações e salvar toda a memória associada a ela. Definir a variável com valores não nulos, além do padrão, não traz nenhum benefício; em particular, valores maiores que o padrão causam mais memória sendo alocada do que o necessário.

* `performance_schema_max_statement_stack`

  <table frame="box" rules="all" summary="Properties for performance_schema_events_stages_history_long_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--performance-schema-events-stages-history-long-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>performance_schema_events_stages_history_long_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code>(significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>-1</code>(significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Maximum Value</th> <td><code>1048576</code></td> </tr></tbody></table>2

A profundidade máxima de chamadas de programas armazenados aninhados para as quais o Schema de Desempenho mantém estatísticas. Quando essa máxima é excedida, o Schema de Desempenho incrementa a variável de status `Performance_schema_nested_statement_lost` para cada instrução de programa armazenado executada.

* `performance_schema_max_table_handles`

  <table frame="box" rules="all" summary="Properties for performance_schema_events_stages_history_long_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--performance-schema-events-stages-history-long-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>performance_schema_events_stages_history_long_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code>(significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>-1</code>(significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Maximum Value</th> <td><code>1048576</code></td> </tr></tbody></table>3

O número máximo de objetos de tabela abertos. Esse valor controla o tamanho da tabela `table_handles`. Se esse máximo for excedido de tal forma que um controle de tabela não possa ser instrumentado, o Schema de Desempenho incrementa a variável de status `Performance_schema_table_handles_lost`. Para informações sobre como definir e usar essa variável, consulte a Seção 25.7, “Monitoramento de Status do Schema de Desempenho”.

* `performance_schema_max_table_instances`

  <table frame="box" rules="all" summary="Properties for performance_schema_events_stages_history_long_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--performance-schema-events-stages-history-long-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>performance_schema_events_stages_history_long_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code>(significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>-1</code>(significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Maximum Value</th> <td><code>1048576</code></td> </tr></tbody></table>4

O número máximo de objetos de tabela instrumentados. Para obter informações sobre como definir e usar essa variável, consulte a Seção 25.7, “Monitoramento do estado do Schema de desempenho”.

* `performance_schema_max_table_lock_stat`

  <table frame="box" rules="all" summary="Properties for performance_schema_events_stages_history_long_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--performance-schema-events-stages-history-long-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>performance_schema_events_stages_history_long_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code>(significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>-1</code>(significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Maximum Value</th> <td><code>1048576</code></td> </tr></tbody></table>5

O número máximo de tabelas para as quais o Schema de Desempenho mantém estatísticas de bloqueio. Se esse máximo for excedido, de modo que as estatísticas de bloqueio de tabela sejam perdidas, o Schema de Desempenho incrementa a variável de status `Performance_schema_table_lock_stat_lost`.

* `performance_schema_max_thread_classes`

  <table frame="box" rules="all" summary="Properties for performance_schema_events_stages_history_long_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--performance-schema-events-stages-history-long-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>performance_schema_events_stages_history_long_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code>(significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>-1</code>(significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Maximum Value</th> <td><code>1048576</code></td> </tr></tbody></table>6

O número máximo de instrumentos de fio. Para informações sobre como definir e usar essa variável, consulte a Seção 25.7, “Monitoramento do estado do esquema de desempenho”.

* `performance_schema_max_thread_instances`

  <table frame="box" rules="all" summary="Properties for performance_schema_events_stages_history_long_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--performance-schema-events-stages-history-long-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>performance_schema_events_stages_history_long_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code>(significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>-1</code>(significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Maximum Value</th> <td><code>1048576</code></td> </tr></tbody></table>7

O número máximo de objetos de fio instrumentados. O valor controla o tamanho da tabela `threads`. Se esse máximo for excedido de tal forma que um fio não possa ser instrumentado, o Schema de Desempenho incrementa a variável de status `Performance_schema_thread_instances_lost`. Para informações sobre como definir e usar essa variável, consulte a Seção 25.7, “Monitoramento de Status do Schema de Desempenho”.

A variável de sistema `max_connections` afeta quantos threads podem rodar no servidor. `performance_schema_max_thread_instances` afeta quantos desses threads em execução podem ser instrumentados.

As tabelas `variables_by_thread` e `status_by_thread` contêm informações sobre variáveis de sistema e status apenas sobre os threads de primeiro plano. Se nem todos os threads não forem instrumentados pelo Schema de Desempenho, esta tabela pode não incluir algumas linhas. Neste caso, a variável de status `Performance_schema_thread_instances_lost` é maior que zero.

* `performance_schema_session_connect_attrs_size`

  <table frame="box" rules="all" summary="Properties for performance_schema_events_stages_history_long_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--performance-schema-events-stages-history-long-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>performance_schema_events_stages_history_long_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code>(significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>-1</code>(significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Maximum Value</th> <td><code>1048576</code></td> </tr></tbody></table>8

A quantidade de memória pré-alocada por fio reservada para armazenar pares chave-valor de atributos de conexão. Se o tamanho agregado dos dados de atributos de conexão enviados por um cliente for maior que esse valor, o Gerador de desempenho truncata os dados do atributo, incrementa a variável de status `Performance_schema_session_connect_attrs_lost` e escreve uma mensagem no log de erro, indicando que o truncamento ocorreu se o valor da variável de sistema `log_error_verbosity` for maior que 1.

O valor padrão de `performance_schema_session_connect_attrs_size` é dimensionado automaticamente na inicialização do servidor. Esse valor pode ser pequeno, portanto, se ocorrer uma truncação (`Performance_schema_session_connect_attrs_lost` se tornar não nulo), você pode querer definir explicitamente `performance_schema_session_connect_attrs_size` para um valor maior.

Embora o valor máximo permitido do `performance_schema_session_connect_attrs_size` seja de 1 MB, o máximo efetivo é de 64 KB, pois o servidor impõe um limite de 64 KB ao tamanho agregado dos dados do atributo de conexão que ele pode aceitar. Se um cliente tentar enviar mais de 64 KB de dados de atributo, o servidor rejeita a conexão. Para mais informações, consulte a Seção 25.12.9, “Tabelas de Atributos de Conexão do Schema de Desempenho”.

* `performance_schema_setup_actors_size`

  <table frame="box" rules="all" summary="Properties for performance_schema_events_stages_history_long_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--performance-schema-events-stages-history-long-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>performance_schema_events_stages_history_long_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code>(significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>-1</code>(significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Maximum Value</th> <td><code>1048576</code></td> </tr></tbody></table>9

O número de linhas na tabela `setup_actors`.

* `performance_schema_setup_objects_size`

  <table frame="box" rules="all" summary="Properties for performance_schema_events_stages_history_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--performance-schema-events-stages-history-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>performance_schema_events_stages_history_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code>(significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>-1</code>(significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Maximum Value</th> <td><code>1024</code></td> </tr></tbody></table>0

O número de linhas na tabela `setup_objects`.

* `performance_schema_show_processlist`

  <table frame="box" rules="all" summary="Properties for performance_schema_events_stages_history_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--performance-schema-events-stages-history-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>performance_schema_events_stages_history_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code>(significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>-1</code>(significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Maximum Value</th> <td><code>1024</code></td> </tr></tbody></table>1

A declaração `SHOW PROCESSLIST` fornece informações sobre o processo, coletando dados de todas as threads ativas. A variável `performance_schema_show_processlist` determina qual implementação de `SHOW PROCESSLIST` deve ser usada:

+ A implementação padrão itera em threads ativas a partir do gerenciador de threads, mantendo um mutex global. Isso tem consequências negativas de desempenho, especialmente em sistemas ocupados.

+ A implementação alternativa `SHOW PROCESSLIST` é baseada na tabela do Schema de Desempenho `processlist`. Essa implementação consulta dados de thread ativos do Schema de Desempenho em vez do gerenciador de thread e não requer um mutex.

Para habilitar a implementação alternativa, habilite a variável de sistema `performance_schema_show_processlist`. Para garantir que as implementações padrão e alternativa forneçam as mesmas informações, certos requisitos de configuração devem ser atendidos; consulte a Seção 25.12.16.3, “A tabela processlist”.

* `performance_schema_users_size`

  <table frame="box" rules="all" summary="Properties for performance_schema_events_stages_history_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--performance-schema-events-stages-history-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>performance_schema_events_stages_history_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code>(significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>-1</code>(significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Maximum Value</th> <td><code>1024</code></td> </tr></tbody></table>2

O número de linhas na tabela `users`. Se essa variável for 0, o Gerador de Desempenho não mantém estatísticas de conexão na tabela `users` ou informações de variáveis de status na tabela `status_by_user`.