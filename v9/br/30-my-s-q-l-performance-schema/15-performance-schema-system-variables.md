## 29.15 Variáveis do Sistema do Schema de Desempenho

O Schema de Desempenho implementa várias variáveis de sistema que fornecem informações de configuração:

```
mysql> SHOW VARIABLES LIKE 'perf%';
+----------------------------------------------------------+-------+
| Variable_name                                            | Value |
+----------------------------------------------------------+-------+
| performance_schema                                       | ON    |
| performance_schema_accounts_size                         | -1    |
| performance_schema_digests_size                          | 10000 |
| performance_schema_error_size                            | 5377  |
| performance_schema_events_stages_history_long_size       | 10000 |
| performance_schema_events_stages_history_size            | 10    |
| performance_schema_events_statements_history_long_size   | 10000 |
| performance_schema_events_statements_history_size        | 10    |
| performance_schema_events_transactions_history_long_size | 10000 |
| performance_schema_events_transactions_history_size      | 10    |
| performance_schema_events_waits_history_long_size        | 10000 |
| performance_schema_events_waits_history_size             | 10    |
| performance_schema_hosts_size                            | -1    |
| performance_schema_max_cond_classes                      | 150   |
| performance_schema_max_cond_instances                    | -1    |
| performance_schema_max_digest_length                     | 1024  |
| performance_schema_max_digest_sample_age                 | 60    |
| performance_schema_max_file_classes                      | 80    |
| performance_schema_max_file_handles                      | 32768 |
| performance_schema_max_file_instances                    | -1    |
| performance_schema_max_index_stat                        | -1    |
| performance_schema_max_memory_classes                    | 470   |
| performance_schema_max_metadata_locks                    | -1    |
| performance_schema_max_meter_classes                     | 30    |
| performance_schema_max_metric_classes                    | 600   |
| performance_schema_max_mutex_classes                     | 350   |
| performance_schema_max_mutex_instances                   | -1    |
| performance_schema_max_prepared_statements_instances     | -1    |
| performance_schema_max_program_instances                 | -1    |
| performance_schema_max_rwlock_classes                    | 100   |
| performance_schema_max_rwlock_instances                  | -1    |
| performance_schema_max_socket_classes                    | 10    |
| performance_schema_max_socket_instances                  | -1    |
| performance_schema_max_sql_text_length                   | 1024  |
| performance_schema_max_stage_classes                     | 175   |
| performance_schema_max_statement_classes                 | 220   |
| performance_schema_max_statement_stack                   | 10    |
| performance_schema_max_table_handles                     | -1    |
| performance_schema_max_table_instances                   | -1    |
| performance_schema_max_table_lock_stat                   | -1    |
| performance_schema_max_thread_classes                    | 100   |
| performance_schema_max_thread_instances                  | -1    |
| performance_schema_session_connect_attrs_size            | 512   |
| performance_schema_setup_actors_size                     | -1    |
| performance_schema_setup_objects_size                    | -1    |
| performance_schema_show_processlist                      | OFF   |
| performance_schema_users_size                            | -1    |
+----------------------------------------------------------+-------+
```

As variáveis de sistema do Schema de Desempenho podem ser definidas na inicialização do servidor na linha de comando ou em arquivos de opção, e muitas podem ser definidas em tempo de execução. Veja a Seção 29.13, “Referência de Opções e Variáveis do Schema de Desempenho”.

O Schema de Desempenho define automaticamente os valores de vários de seus parâmetros na inicialização do servidor, se não forem definidos explicitamente. Para mais informações, consulte a Seção 29.3, “Configuração de Inicialização do Schema de Desempenho”.

As variáveis de sistema do Schema de Desempenho têm os seguintes significados:

* `performance_schema`

  <table frame="box" rules="all" summary="Propriedades para performance_schema"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--performance-schema[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema">performance_schema</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Definição de Variável"><code>SET_VAR</code></a> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  O valor desta variável é `ON` ou `OFF` para indicar se o Schema de Desempenho está habilitado. Por padrão, o valor é `ON`. Na inicialização do servidor, você pode especificar esta variável sem valor ou com um valor de `ON` ou 1 para a habilitar, ou com um valor de `OFF` ou 0 para desabilitá-la.

Mesmo quando o Schema de Desempenho é desativado, ele continua a preencher as tabelas `global_variables`, `session_variables`, `global_status` e `session_status`. Isso ocorre conforme necessário para permitir que os resultados das declarações `SHOW VARIABLES` e `SHOW STATUS` sejam extraídos dessas tabelas. O Schema de Desempenho também preenche algumas das tabelas de replicação quando desativado.

* `performance_schema_accounts_size`

  <table frame="box" rules="all" summary="Propriedades para performance_schema_accounts_size"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--performance-schema-accounts-size=#</code></td> </tr><tr><th>Variável do Sistema</th> <td><code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_accounts_size">performance_schema_accounts_size</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de Sugestão de Configuração</th> <td>Não</td> </tr><tr><th>Hinta de Sugestão de Configuração `SET_VAR`</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr></tbody></table>

  O número de linhas na tabela `accounts`. Se essa variável for 0, o Schema de Desempenho não mantém estatísticas de conexão na tabela `accounts` ou informações de variáveis de status na tabela `status_by_account`.

* `performance_schema_error_size`

  <table frame="box" rules="all" summary="Propriedades para performance_schema_error_size"><tbody><tr><th>Formato de linha de comando</th> <td><code>--performance-schema-error-size=#</code></td> </tr><tr><th>Variável do sistema</th> <td><code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_error_size">performance_schema_error_size</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code> (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>-1</code> (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td><code>1048576</code></td> </tr></tbody></table>

  O número máximo de linhas na tabela `events_statements_summary_by_digest`. Se esse máximo for excedido de forma que um digest não possa ser instrumentado, o Schema de Desempenho incrementa a variável de status `Performance_schema_digest_lost`.

  Para mais informações sobre digestes de declarações, consulte a Seção 29.10, “Digestas e Amostragem de Declarações do Schema de Desempenho”.

* `performance_schema_error_size`

<table frame="box" rules="all" summary="Propriedades para performance_schema_error_size">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--performance-schema-error-size=#</code></td>
  </tr>
  <tr>
    <th>Variável do sistema</th>
    <td><code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_error_size">performance_schema_error_size</a></code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code>número de códigos de erro do servidor</code></td>
  </tr>
  <tr>
    <th>Valor mínimo</th>
    <td><code>0</code></td>
  </tr>
  <tr>
    <th>Valor máximo</th>
    <td><code>1048576</code></td>
  </tr>
</table>

  O número de códigos de erro do servidor instrumentados. O valor padrão é o número real de códigos de erro do servidor. Embora o valor possa ser definido em qualquer lugar de 0 até o máximo, o uso pretendido é defini-lo para o valor padrão (para instrumar todos os erros) ou 0 (para instrumar nenhum erro).

  As informações de erro são agregadas em tabelas de resumo; veja a Seção 29.12.20.11, “Tabelas de Resumo de Erros”. Se ocorrer um erro que não for instrumentado, as informações para a ocorrência são agregadas à linha `NULL` em cada tabela de resumo; ou seja, à linha com `ERROR_NUMBER=0`, `ERROR_NAME=NULL` e `SQLSTATE=NULL`.

* `performance_schema_events_stages_history_long_size`

<table frame="box" rules="all" summary="Propriedades para performance_schema_events_stages_history_long_size">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--performance-schema-events-stages-history-long-size=#</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_events_stages_history_long_size">performance_schema_events_stages_history_long_size</a></code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de Sintaxe de Definição de Variável</th>
    <td><code>SET_VAR</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>-1</code> (significa autodimensionamento; não atribua este valor literal)</td>
  </tr>
  <tr>
    <th>Valor Mínimo</th>
    <td><code>-1</code> (significa autoescalonamento; não atribua este valor literal)</td>
  </tr>
  <tr>
    <th>Valor Máximo</th>
    <td><code>1048576</code></td>
  </tr>
</table>

Número de linhas na tabela `events_stages_history_long`.

<table frame="box" rules="all" summary="Propriedades para performance_schema_events_stages_history_size">
  <tr><th>Formato de Linha de Comando</th> <td><code>--performance-schema-events-stages-history-size=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_events_stages_history_size">performance_schema_events_stages_history_size</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>-1</code> (significa autodimensionamento; não atribua este valor literal)</td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoescalonamento; não atribua este valor literal)</td> </tr>
  <tr><th>Valor Máximo</th> <td><code>1024</code></td> </tr>
</table>

Número de linhas por thread na tabela `events_stages_history`.

<table frame="box" rules="all" summary="Propriedades para performance_schema_events_statements_history_long_size">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--performance-schema-events-statements-history-long-size=#</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_events_statements_history_long_size">performance_schema_events_statements_history_long_size</a></code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de Sintaxe de Definição de Variável</th>
    <td><code>SET_VAR</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>-1</code> (significa autodimensionamento; não atribua este valor literal)</td>
  </tr>
  <tr>
    <th>Valor Mínimo</th>
    <td><code>-1</code> (significa autoescalonamento; não atribua este valor literal)</td>
  </tr>
  <tr>
    <th>Valor Máximo</th>
    <td><code>1048576</code></td>
  </tr>
</table>

Número de linhas na tabela `events_statements_history_long`.

<table frame="box" rules="all" summary="Propriedades para performance_schema_events_statements_history_size">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--performance-schema-events-statements-history-size=#</code></td>
  </tr>
  <tr>
    <th>Variável do sistema</th>
    <td><code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_events_statements_history_size">performance_schema_events_statements_history_size</a></code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de definição de variável"><code>SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code>-1</code> (significa autodimensionamento; não atribua este valor literal)</td>
  </tr>
  <tr>
    <th>Valor mínimo</th>
    <td><code>-1</code> (significa autoescalonamento; não atribua este valor literal)</td>
  </tr>
  <tr>
    <th>Valor máximo</th>
    <td><code>1024</code></td>
  </tr>
</table>

Número de linhas por thread na tabela `events_statements_history`.

<table frame="box" rules="all" summary="Propriedades para performance_schema_events_transactions_history_long_size">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--performance-schema-events-transactions-history-long-size=#</code></td>
  </tr>
  <tr>
    <th>Variável do sistema</th>
    <td><code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_events_transactions_history_long_size">performance_schema_events_transactions_history_long_size</a></code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de sintaxe de definição de variável</th>
    <td><code>SET_VAR</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code>-1</code> (significa autodimensionamento; não atribua este valor literal)</td>
  </tr>
  <tr>
    <th>Valor mínimo</th>
    <td><code>-1</code> (significa autoescalonamento; não atribua este valor literal)</td>
  </tr>
  <tr>
    <th>Valor máximo</th>
    <td><code>1048576</code></td>
  </tr>
</table>

Número de linhas na tabela `events_transactions_history_long`.

<table frame="box" rules="all" summary="Propriedades para performance_schema_events_transactions_history_size">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--performance-schema-events-transactions-history-size=#</code></td>
  </tr>
  <tr>
    <th>Variável do sistema</th>
    <td><code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_events_transactions_history_size">performance_schema_events_transactions_history_size</a></code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code>-1</code> (significa autodimensionamento; não atribua este valor literal)</td>
  </tr>
  <tr>
    <th>Valor mínimo</th>
    <td><code>-1</code> (significa autoescalonamento; não atribua este valor literal)</td>
  </tr>
  <tr>
    <th>Valor máximo</th>
    <td><code>1024</code></td>
  </tr>
</table>

  O número de linhas por thread na tabela `events_transactions_history`.

<table frame="box" rules="all" summary="Propriedades para performance_schema_events_waits_history_size">
  <tr><th>Formato de linha de comando</th> <td><code>--performance-schema-events-waits-history-size=#</code></td> </tr>
  <tr><th>Variável do sistema</th> <td><code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_events_waits_history_size">performance_schema_events_waits_history_size</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor padrão</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr>
  <tr><th>Valor mínimo</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr>
  <tr><th>Valor máximo</th> <td><code>1048576</code></td> </tr>
</table>

Número de linhas na tabela `events_waits_history_long`.

<table frame="box" rules="all" summary="Propriedades para performance_schema_accounts_size">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--performance-schema-accounts-size=#</code></td>
  </tr>
  <tr>
    <th>Variável do sistema</th>
    <td><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_accounts_size">performance_schema_accounts_size</a></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td>
  </tr>
  <tr>
    <th>Valor mínimo</th>
    <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td>
  </tr>
  <tr>
    <th>Valor máximo</th>
    <td><code>1048576</code></td>
  </tr>
</table>

  O número de linhas por thread na tabela `events_waits_history`.

<table frame="box" rules="all" summary="Propriedades para performance_schema_accounts_size">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--performance-schema-accounts-size=#</code></td>
  </tr>
  <tr>
    <th>Variável do sistema</th>
    <td><code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_accounts_size">performance_schema_accounts_size</a></code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></th></td>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code>-1</code> (significa autoescalonamento; não atribua este valor literal)</td>
  </tr>
  <tr>
    <th>Valor mínimo</th>
    <td><code>-1</code> (significa autoescalonamento; não atribua este valor literal)</td>
  </tr>
  <tr>
    <th>Valor máximo</th>
    <td><code>1048576</code></td>
  </tr>
</table>
2. O número de linhas na tabela `hosts`. Se esta variável for 0, o Performance Schema não mantém estatísticas de conexão na tabela `hosts` ou informações de variáveis de status na tabela `status_by_host`.

<table frame="box" rules="all" summary="Propriedades para performance_schema_accounts_size">
  <tr><th>Formato de Linha de Comando</th> <td><code>--performance-schema-max-cond-instances=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_max_cond_instances">performance_schema_max_cond_instances</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr>
  <tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr>
</table>

O número máximo de instrumentos de condição. Para obter informações sobre como configurar e usar essa variável, consulte a Seção 29.7, “Monitoramento do Status do Schema de Desempenho”.

* `performance_schema_max_cond_instances`

<table frame="box" rules="all" summary="Propriedades para performance_schema_accounts_size">
  <tr><th>Formato de Linha de Comando</th> <td><code>--performance-schema-accounts-size=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_accounts_size">performance_schema_accounts_size</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr>
  <tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr>
</table>

O número máximo de objetos de condição instrumentados. Para obter informações sobre como configurar e usar essa variável, consulte a Seção 29.7, “Monitoramento do Status do Schema de Desempenho”.

* `performance_schema_max_digest_length`

<table frame="box" rules="all" summary="Propriedades para performance_schema_accounts_size"><tbody><tr><th>Formato de linha de comando</th> <td><code>--performance-schema-accounts-size=#</code></td> </tr><tr><th>Variável do sistema</th> <td><code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_accounts_size">performance_schema_accounts_size</a></code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td><code>1048576</code></td> </tr></tbody></table>

O número máximo de bytes de memória reservado por declaração para a computação de valores de digestão de declarações normalizados no Schema de Desempenho. Esta variável está relacionada com `max_digest_length`; consulte a descrição dessa variável na Seção 7.1.8, “Variáveis do Sistema do Servidor”.

Para mais informações sobre a digestão de declarações, incluindo considerações sobre o uso de memória, consulte a Seção 29.10, “Digestas e Amostragem de Declarações do Schema de Desempenho”.

* `performance_schema_max_digest_sample_age`

<table frame="box" rules="all" summary="Propriedades para performance_schema_accounts_size">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--performance-schema-accounts-size=#</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_accounts_size">performance_schema_accounts_size</a></code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td>
  </tr>
  <tr>
    <th>Valor Mínimo</th>
    <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td>
  </tr>
  <tr>
    <th>Valor Máximo</th>
    <td><code>1048576</code></td>
  </tr>
</table>

Esta variável afeta a amostragem de declarações para a tabela `events_statements_summary_by_digest`. Quando uma nova linha de tabela é inserida, a declaração que produziu o valor da linha digest é armazenada como a declaração atual associada ao digest. Posteriormente, quando o servidor vê outras declarações com o mesmo valor de digest, ele determina se deve usar a nova declaração para substituir a declaração de amostra atual (ou seja, se deve resampler). A política de resampling é baseada nos tempos de espera comparativos da declaração de amostra atual e da nova declaração e, opcionalmente, na idade da declaração de amostra atual:

+ Resampling baseado em tempos de espera: Se o novo tempo de espera da declaração for maior que o da declaração atual da amostra, ela se torna a declaração atual da amostra.

+ Resampling baseado na idade: Se a variável de sistema `performance_schema_max_digest_sample_age` tiver um valor maior que zero e a declaração atual da amostra tiver mais de tantos segundos de idade, a declaração atual é considerada "muito antiga" e a nova declaração a substitui. Isso ocorre mesmo que o tempo de espera da nova declaração seja menor que o da declaração atual da amostra.

Para informações sobre a amostragem de declarações, consulte a Seção 29.10, "Digestas e Amostragem de Declarações do Schema de Desempenho".

* `performance_schema_max_file_classes`

<table frame="box" rules="all" summary="Propriedades para performance_schema_accounts_size">
  <tr><th>Formato de Linha de Comando</th> <td><code>--performance-schema-accounts-size=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_accounts_size">performance_schema_accounts_size</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr>
  <tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr>
</table>

O número máximo de instrumentos de arquivo. Para obter informações sobre como configurar e usar essa variável, consulte a Seção 29.7, “Monitoramento do Status do Schema de Desempenho”.

* `performance_schema_max_file_handles`

<table frame="box" rules="all" summary="Propriedades para performance_schema_accounts_size">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--performance-schema-accounts-size=#</code></td>
  </tr>
  <tr>
    <th>Variável do sistema</th>
    <td><code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_accounts_size">performance_schema_accounts_size</a></code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Hint de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variáveis"><code>SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td>
  </tr>
  <tr>
    <th>Valor mínimo</th>
    <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td>
  </tr>
  <tr>
    <th>Valor máximo</th>
    <td><code>1048576</code></td>
  </tr>
</table>

  O número máximo de objetos de arquivo abertos. Para obter informações sobre como configurar e usar essa variável, consulte a Seção 29.7, “Monitoramento do Status do Schema de Desempenho”.

  O valor de `performance_schema_max_file_handles` deve ser maior que o valor de `open_files_limit`: `open_files_limit` afeta o número máximo de manipuladores de arquivo abertos que o servidor pode suportar e `performance_schema_max_file_handles` afeta quantos desses manipuladores de arquivo podem ser instrumentados.

* `performance_schema_max_file_instances`

<table frame="box" rules="all" summary="Propriedades para performance_schema_accounts_size">
  <tr><th>Formato de Linha de Comando</th> <td><code>--performance-schema-accounts-size=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_accounts_size">performance_schema_accounts_size</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoscaling; não atribua este valor literal)</td> </tr>
  <tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr>
</table>

O número máximo de objetos de arquivo instrumentados. Para obter informações sobre como configurar e usar essa variável, consulte a Seção 29.7, “Monitoramento do Status do Schema de Desempenho”.

* `performance_schema_max_index_stat`

<table frame="box" rules="all" summary="Propriedades para performance_schema_digests_size">
  <tr><th>Formato de Linha de Comando</th> <td><code>--performance-schema-digests-size=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_digests_size">performance_schema_digests_size</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>-1</code> (significa autodimensionamento; não atribua este valor literal)</td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoescalonamento; não atribua este valor literal)</td> </tr>
  <tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr>
</table>

O número máximo de índices para os quais o Schema de Desempenho mantém estatísticas. Se esse máximo for excedido, de modo que as estatísticas dos índices sejam perdidas, o Schema de Desempenho incrementa a variável de status `Performance_schema_index_stat_lost`. O valor padrão é autodimensionado usando o valor de `performance_schema_max_table_instances`.

* `performance_schema_max_memory_classes`

<table frame="box" rules="all" summary="Propriedades para performance_schema_digests_size">
  <tr><th>Formato de Linha de Comando</th> <td><code>--performance-schema-digests-size=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_digests_size">performance_schema_digests_size</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de definição de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>-1</code> (significa autodimensionamento; não atribua este valor literal)</td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoescalonamento; não atribua este valor literal)</td> </tr>
  <tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr>
</table>

O número máximo de instrumentos de memória. Para obter informações sobre como definir e usar essa variável, consulte a Seção 29.7, “Monitoramento do Status do Schema de Desempenho”.

* `performance_schema_max_metadata_locks`

<table frame="box" rules="all" summary="Propriedades para performance_schema_digests_size">
  <tr><th>Formato de Linha de Comando</th> <td><code>--performance-schema-digests-size=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_digests_size">performance_schema_digests_size</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>-1</code> (significa autodimensionamento; não atribua este valor literal)</td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoescalonamento; não atribua este valor literal)</td> </tr>
  <tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr>
</table>

O número máximo de instrumentos de bloqueio de metadados. Esse valor controla o tamanho da tabela `metadata_locks`. Se esse máximo for excedido de forma que um bloqueio de metadados não possa ser instrumentado, o Schema de Desempenho incrementa a variável de status `Performance_schema_metadata_lock_lost`.

* `performance_schema_max_meter_classes`

<table frame="box" rules="all" summary="Propriedades para performance_schema_digests_size">
  <tr><th>Formato de linha de comando</th> <td><code>--performance-schema-digests-size=#</code></td> </tr>
  <tr><th>Variável do sistema</th> <td><code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_digests_size">performance_schema_digests_size</a></code></td> </tr>
  <tr><th>Âmbito</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variáveis"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor padrão</th> <td><code>-1</code> (significa autodimensionamento; não atribua este valor literal)</td> </tr>
  <tr><th>Valor mínimo</th> <td><code>-1</code> (significa autoescalonamento; não atribua este valor literal)</td> </tr>
  <tr><th>Valor máximo</th> <td><code>1048576</code></td> </tr>
</table>

Número máximo de instrumentos de medidor que podem ser criados

<table frame="box" rules="all" summary="Propriedades para performance_schema_digests_size">
  <tr><th>Formato de Linha de Comando</th> <td><code>--performance-schema-digests-size=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_digests_size">performance_schema_digests_size</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variáveis"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>-1</code> (significa autodimensionamento; não atribua este valor literal)</td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoescalonamento; não atribua este valor literal)</td> </tr>
  <tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr>
</table>

Número máximo de instrumentos de métricas que podem ser criados.

* `performance_schema_max_mutex_classes`

<table frame="box" rules="all" summary="Propriedades para performance_schema_digests_size">
  <tr><th>Formato de Linha de Comando</th> <td><code>--performance-schema-digests-size=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_digests_size">performance_schema_digests_size</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de definição de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>-1</code> (significa autodimensionamento; não atribua este valor literal)</td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoescalonamento; não atribua este valor literal)</td> </tr>
  <tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr>
</table>

O número máximo de instrumentos de mutex. Para obter informações sobre como definir e usar essa variável, consulte a Seção 29.7, “Monitoramento do Status do Schema de Desempenho”.

* `performance_schema_max_mutex_instances`

<table frame="box" rules="all" summary="Propriedades para performance_schema_digests_size">
  <tr><th>Formato de Linha de Comando</th> <td><code>--performance-schema-digests-size=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_digests_size">performance_schema_digests_size</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>-1</code> (significa autodimensionamento; não atribua este valor literal)</td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoescalonamento; não atribua este valor literal)</td> </tr>
  <tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr>
</table>

O número máximo de objetos de mutex instrumentados. Para obter informações sobre como configurar e usar essa variável, consulte a Seção 29.7, “Monitoramento do Status do Schema de Desempenho”.

* `performance_schema_max_prepared_statements_instances`

<table frame="box" rules="all" summary="Propriedades para performance_schema_digests_size">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--performance-schema-digests-size=#</code></td>
  </tr>
  <tr>
    <th>Variável do sistema</th>
    <td><code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_digests_size">performance_schema_digests_size</a></code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code>-1</code> (significa autodimensionamento; não atribua este valor literal)</td>
  </tr>
  <tr>
    <th>Valor mínimo</th>
    <td><code>-1</code> (significa autoescalonamento; não atribua este valor literal)</td>
  </tr>
  <tr>
    <th>Valor máximo</th>
    <td><code>1048576</code></td>
  </tr>
</table>

  O número máximo de linhas na tabela `prepared_statements_instances`. Se esse máximo for excedido de forma que uma declaração preparada não possa ser instrumentada, o Schema de Desempenho incrementa a variável de status `Performance_schema_prepared_statements_lost`. Para obter informações sobre como configurar e usar essa variável, consulte a Seção 29.7, “Monitoramento de Status do Schema de Desempenho”.

  O valor padrão dessa variável é dimensionado automaticamente com base no valor da variável de sistema `max_prepared_stmt_count`.

<table frame="box" rules="all" summary="Propriedades para performance_schema_digests_size">
  <tr><th>Formato de Linha de Comando</th> <td><code>--performance-schema-digests-size=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_digests_size">performance_schema_digests_size</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de definição de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>-1</code> (significa autodimensionamento; não atribua este valor literal)</td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoescalonamento; não atribua este valor literal)</td> </tr>
  <tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr>
</table>

O número máximo de instrumentos rwlock. Para obter informações sobre como definir e usar essa variável, consulte a Seção 29.7, “Monitoramento do Status do Schema de Desempenho”.

* `performance_schema_max_program_instances`

<table frame="box" rules="all" summary="Propriedades para performance_schema_digests_size">
  <tr><th>Formato de Linha de Comando</th> <td><code>--performance-schema-digests-size=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_digests_size">performance_schema_digests_size</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>-1</code> (significa autodimensionamento; não atribua este valor literal)</td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoescalonamento; não atribua este valor literal)</td> </tr>
  <tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr>
</table>

O número máximo de programas armazenados para os quais o Schema de Desempenho mantém estatísticas. Se esse máximo for excedido, o Schema de Desempenho incrementa a variável de status `Performance_schema_program_lost`. Para obter informações sobre como configurar e usar essa variável, consulte a Seção 29.7, “Monitoramento de Status do Schema de Desempenho”.

* `performance_schema_max_rwlock_instances`

<table frame="box" rules="all" summary="Propriedades para performance_schema_error_size">
  <tr><th>Formato de Linha de Comando</th> <td><code>--performance-schema-error-size=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_error_size">performance_schema_error_size</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variáveis"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>número de códigos de erros do servidor</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr>
</table>

O número máximo de objetos de rwlock instrumentados. Para obter informações sobre como configurar e usar essa variável, consulte a Seção 29.7, “Monitoramento do Status do Schema de Desempenho”.

* `performance_schema_max_socket_classes`

<table frame="box" rules="all" summary="Propriedades para performance_schema_error_size">
  <tr><th>Formato de Linha de Comando</th> <td><code>--performance-schema-error-size=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_error_size">performance_schema_error_size</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>número de códigos de erros do servidor</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr>
</table>

O número máximo de instrumentos de soquete. Para obter informações sobre como configurar e usar essa variável, consulte a Seção 29.7, “Monitoramento do Status do Schema de Desempenho”.

* `performance_schema_max_socket_instances`

<table frame="box" rules="all" summary="Propriedades para performance_schema_error_size">
  <tr><th>Formato de Linha de Comando</th> <td><code>--performance-schema-error-size=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_error_size">performance_schema_error_size</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variáveis"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>número de códigos de erro do servidor</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr>
</table>

O número máximo de objetos de soquete instrumentados. Para obter informações sobre como configurar e usar essa variável, consulte a Seção 29.7, “Monitoramento do Status do Schema de Desempenho”.

* `performance_schema_max_sql_text_length`

<table frame="box" rules="all" summary="Propriedades para performance_schema_error_size">
  <tr>
    <th>Formato de Linha de Comando</th> <td><code>--performance-schema-error-size=#</code></td> </tr>
    <tr>
      <th>Variável do Sistema</th> <td><code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_error_size">performance_schema_error_size</a></code></td> </tr>
    </tr>
    <tr>
      <th>Alcance</th> <td>Global</td> </tr>
    </tr>
    <tr>
      <th>Dinâmico</th> <td>Não</td> </tr>
    </tr>
    <tr>
      <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variáveis"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
    </tr>
    <tr>
      <th>Tipo</th> <td>Inteiro</td> </tr>
    </tr>
    <tr>
      <th>Valor Padrão</th> <td><code>número de códigos de erro do servidor</code></td> </tr>
    </tr>
    <tr>
      <th>Valor Mínimo</th> <td><code>0</code></td> </tr>
    </tr>
    <tr>
      <th>Valor Máximo</th> <td><code>1048576</code></td> </tr>
    </tr>
  </table>
3. O número máximo de bytes usado para armazenar instruções SQL. O valor se aplica ao armazenamento necessário para essas colunas:

  + A coluna `SQL_TEXT` das tabelas de eventos `events_statements_current`, `events_statements_history` e `events_statements_history_long`.

  + A coluna `QUERY_SAMPLE_TEXT` da tabela de resumo `events_statements_summary_by_digest`.

  Quaisquer bytes em excesso de `performance_schema_max_sql_text_length` são descartados e não aparecem na coluna. As instruções que diferem apenas após tantos bytes iniciais são indistinguíveis na coluna.

Reduzir o valor de `performance_schema_max_sql_text_length` diminui o uso de memória, mas faz com que mais instruções se tornem indistinguíveis se diferirem apenas no final. Aumentar o valor aumenta o uso de memória, mas permite que instruções mais longas sejam distinguidas.

* `performance_schema_max_stage_classes`

  <table frame="box" rules="all" summary="Propriedades para performance_schema_error_size"><tbody><tr><th>Formato de linha de comando</th> <td><code>--performance-schema-error-size=#</code></td> </tr><tr><th>Variável do sistema</th> <td><code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_error_size">performance_schema_error_size</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dica de sintaxe <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de configuração de variáveis"><code>SET_VAR</a></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>número de códigos de erro do servidor</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>1048576</code></td> </tr></tbody></table>

  O número máximo de instrumentos de estágio. Para obter informações sobre como configurar e usar essa variável, consulte a Seção 29.7, “Monitoramento do Status do Schema de Desempenho”.

* `performance_schema_max_statement_classes`

<table frame="box" rules="all" summary="Propriedades para performance_schema_error_size">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--performance-schema-error-size=#</code></td>
  </tr>
  <tr>
    <th>Variável do sistema</th>
    <td><code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_error_size">performance_schema_error_size</a></code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code>número de códigos de erro do servidor</code></td>
  </tr>
  <tr>
    <th>Valor mínimo</th>
    <td><code>0</code></td>
  </tr>
  <tr>
    <th>Valor máximo</th>
    <td><code>1048576</code></td>
  </tr>
</table>

  O número máximo de instrumentos de declaração. Para obter informações sobre como configurar e usar essa variável, consulte a Seção 29.7, “Monitoramento do Status do Schema de Desempenho”.

  O valor padrão é calculado no momento da construção do servidor com base no número de comandos no protocolo cliente/servidor e no número de tipos de declarações SQL suportados pelo servidor.

  Essa variável não deve ser alterada, a menos que seja definida como 0 para desativar toda a instrumentação de declarações e salvar toda a memória associada a ela. Definir o valor da variável para valores diferentes do padrão não traz benefícios; em particular, valores maiores que o padrão causam a alocação de mais memória do que o necessário.

* `performance_schema_max_statement_stack`

<table frame="box" rules="all" summary="Propriedades para performance_schema_error_size">
  <tr>
    <th>Formato de Linha de Comando</th> <td><code>--performance-schema-error-size=#</code></td> </tr>
    <tr>
      <th>Variável do Sistema</th> <td><code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_error_size">performance_schema_error_size</a></code></td> </tr>
    </tr>
    <tr>
      <th>Alcance</th> <td>Global</td> </tr>
    </tr>
    <tr>
      <th>Dinâmico</th> <td>Não</td> </tr>
    </tr>
    <tr>
      <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variáveis"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
    </tr>
    <tr>
      <th>Tipo</th> <td>Inteiro</td> </tr>
    </tr>
    <tr>
      <th>Valor Padrão</th> <td><code>número de códigos de erro do servidor</code></td> </tr>
    </tr>
    <tr>
      <th>Valor Mínimo</th> <td><code>0</code></td> </tr>
    </tr>
    <tr>
      <th>Valor Máximo</th> <td><code>1048576</code></td> </tr>
    </tr>
  </table>
6. A profundidade máxima de chamadas de programas armazenados aninhados para as quais o Schema de Desempenho mantém estatísticas. Quando esse máximo é excedido, o Schema de Desempenho incrementa a variável de status `Performance_schema_nested_statement_lost` para cada instrução de programa armazenado executada.

<table frame="box" rules="all" summary="Propriedades para performance_schema_error_size">
  <tr><th>Formato de Linha de Comando</th> <td><code>--performance-schema-error-size=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_error_size">performance_schema_error_size</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variáveis"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>número de códigos de erro do servidor</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr>
</table>

O número máximo de objetos de tabela abertos. Esse valor controla o tamanho da tabela `table_handles`. Se esse máximo for excedido, de modo que um handle de tabela não possa ser instrumentado, o Schema de Desempenho incrementa a variável de status `Performance_schema_table_handles_lost`. Para obter informações sobre como configurar e usar essa variável, consulte a Seção 29.7, “Monitoramento de Status do Schema de Desempenho”.

* `performance_schema_max_table_instances`

<table frame="box" rules="all" summary="Propriedades para performance_schema_error_size">
  <tr><th>Formato de Linha de Comando</th> <td><code>--performance-schema-error-size=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_error_size">performance_schema_error_size</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variáveis"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>número de códigos de erro do servidor</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr>
</table>

O número máximo de objetos de tabela instrumentados. Para obter informações sobre como configurar e usar essa variável, consulte a Seção 29.7, “Monitoramento do Status do Schema de Desempenho”.

* `performance_schema_max_table_lock_stat`

<table frame="box" rules="all" summary="Propriedades para performance_schema_error_size">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--performance-schema-error-size=#</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_error_size">performance_schema_error_size</a></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmica</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variáveis"><code>SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>número de códigos de erro do servidor</code></td>
  </tr>
  <tr>
    <th>Valor Mínimo</th>
    <td><code>0</code></td>
  </tr>
  <tr>
    <th>Valor Máximo</th>
    <td><code>1048576</code></td>
  </tr>
</table>

<table frame="box" rules="all" summary="Propriedades para performance_schema_events_stages_history_long_size">
  <tr>
    <th>Formato de Linha de Comando</th> <td><code>--performance-schema-events-stages-history-long-size=#</code></td> </tr>
    <tr>
      <th>Variável do Sistema</th> <td><code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_events_stages_history_long_size">performance_schema_events_stages_history_long_size</a></code></td> </tr>
    </tr>
    <tr>
      <th>Alcance</th> <td>Global</td> </tr>
    </tr>
    <tr>
      <th>Dinâmico</th> <td>Não</td> </tr>
    </tr>
    <tr>
      <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
    </tr>
    <tr>
      <th>Tipo</th> <td>Inteiro</td> </tr>
    </tr>
    <tr>
      <th>Valor Padrão</th> <td><code>-1</code> (significa autodimensionamento; não atribua este valor literal)</td> </tr>
    </tr>
    <tr>
      <th>Valor Mínimo</th> <td><code>-1</code> (significa autoescalonamento; não atribua este valor literal)</td> </tr>
    </tr>
    <tr>
      <th>Valor Máximo</th> <td><code>1048576</code></td> </tr>
  </table>
0

O número máximo de instrumentos de thread. Para obter informações sobre como configurar e usar essa variável, consulte a Seção 29.7, “Monitoramento do Status do Schema de Desempenho”.

* `performance_schema_max_thread_instances`

<table frame="box" rules="all" summary="Propriedades para performance_schema_events_stages_history_long_size">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--performance-schema-events-stages-history-long-size=#</code></td>
  </tr>
  <tr>
    <th>Variável do sistema</th>
    <td><code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_events_stages_history_long_size">performance_schema_events_stages_history_long_size</a></code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code>-1</code> (significa autodimensionamento; não atribua este valor literal)</td>
  </tr>
  <tr>
    <th>Valor mínimo</th>
    <td><code>-1</code> (significa autoescalonamento; não atribua este valor literal)</td>
  </tr>
  <tr>
    <th>Valor máximo</th>
    <td><code>1048576</code></td>
  </tr>
</table>

  O número máximo de objetos de thread instrumentados. O valor controla o tamanho da tabela `threads`. Se esse máximo for excedido de forma que um thread não possa ser instrumentado, o Performance Schema incrementa a variável de status `Performance_schema_thread_instances_lost`. Para obter informações sobre como configurar e usar essa variável, consulte a Seção 29.7, “Monitoramento de Status do Performance Schema”.

  A variável do sistema `max_connections` afeta quantos threads podem rodar no servidor. `performance_schema_max_thread_instances` afeta quantos desses threads em execução podem ser instrumentados.

As tabelas `variables_by_thread` e `status_by_thread` contêm informações sobre variáveis de sistema e status apenas sobre os threads em primeiro plano. Se nem todos os threads estiverem instrumentados pelo Schema de Desempenho, essa tabela perderá algumas linhas. Nesse caso, a variável de status `Performance_schema_thread_instances_lost` é maior que zero.

* `performance_schema_session_connect_attrs_size`

  <table frame="box" rules="all" summary="Propriedades para performance_schema_events_stages_history_long_size"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--performance-schema-events-stages-history-long-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_events_stages_history_long_size">performance_schema_events_stages_history_long_size</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sinal de Hint para Configuração de Variáveis"><code>SET_VAR</code></a></code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr></tbody></table>

A quantidade de memória pré-alocada por fio reservada para armazenar pares chave-valor de atributos de conexão. Se o tamanho agregado dos dados de atributos de conexão enviados por um cliente for maior que esse valor, o Gerenciamento de Desempenho truncá-losá os dados do atributo, incrementará a variável `Performance_schema_session_connect_attrs_lost` e escreverá uma mensagem no log de erro, indicando que a truncação ocorreu, se a variável de sistema `log_error_verbosity` for maior que 1. Um atributo `_truncated` também será adicionado aos atributos de sessão com um valor indicando quantos bytes foram perdidos, se o buffer do atributo tiver espaço suficiente. Isso permite que o Gerenciamento de Desempenho exiba informações de truncação por conexão nas tabelas de atributos de conexão. Essas informações podem ser examinadas sem precisar verificar o log de erro.

O valor padrão de `performance_schema_session_connect_attrs_size` é dimensionado automaticamente no início do servidor. Esse valor pode ser pequeno, portanto, se ocorrer a truncação (`Performance_schema_session_connect_attrs_lost` se tornar não nulo), você pode querer definir explicitamente `performance_schema_session_connect_attrs_size` para um valor maior.

Embora o valor máximo permitido de `performance_schema_session_connect_attrs_size` seja de 1 MB, o máximo efetivo é de 64 KB, pois o servidor impõe um limite de 64 KB ao tamanho agregado dos dados de atributos de conexão que aceita. Se um cliente tentar enviar mais de 64 KB de dados de atributo, o servidor rejeitará a conexão. Para mais informações, consulte a Seção 29.12.9, “Tabelas de Atributos de Conexão do Gerenciamento de Desempenho”.

* `performance_schema_setup_actors_size`

<table frame="box" rules="all" summary="Propriedades para performance_schema_events_stages_history_long_size">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--performance-schema-events-stages-history-long-size=#</code></td>
  </tr>
  <tr>
    <th>Variável do sistema</th>
    <td><code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_events_stages_history_long_size">performance_schema_events_stages_history_long_size</a></code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de sintaxe de definição de variável</th>
    <td><code>SET_VAR</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code>-1</code> (significa autodimensionamento; não atribua este valor literal)</td>
  </tr>
  <tr>
    <th>Valor mínimo</th>
    <td><code>-1</code> (significa autoescalonamento; não atribua este valor literal)</td>
  </tr>
  <tr>
    <th>Valor máximo</th>
    <td><code>1048576</code></td>
  </tr>
</table>
3. O número de linhas na tabela `setup_actors`.

<table frame="box" rules="all" summary="Propriedades para performance_schema_events_stages_history_long_size">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--performance-schema-events-stages-history-long-size=#</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_events_stages_history_long_size">performance_schema_events_stages_history_long_size</a></code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>-1</code> (significa autodimensionamento; não atribua este valor literal)</td>
  </tr>
  <tr>
    <th>Valor Mínimo</th>
    <td><code>-1</code> (significa autoescalonamento; não atribua este valor literal)</td>
  </tr>
  <tr>
    <th>Valor Máximo</th>
    <td><code>1048576</code></td>
  </tr>
</table>
4. Número de linhas na tabela `setup_objects`.

<table frame="box" rules="all" summary="Propriedades para performance_schema_events_stages_history_long_size">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--performance-schema-events-stages-history-long-size=#</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_events_stages_history_long_size">performance_schema_events_stages_history_long_size</a></code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de Sintaxe de Definição de Variável</th>
    <td><code>SET_VAR</a></code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>-1</code> (significa autodimensionamento; não atribua este valor literal)</td>
  </tr>
  <tr>
    <th>Valor Mínimo</th>
    <td><code>-1</code> (significa autoescalonamento; não atribua este valor literal)</td>
  </tr>
  <tr>
    <th>Valor Máximo</th>
    <td><code>1048576</code></td>
  </tr>
</table>

  A instrução `SHOW PROCESSLIST` fornece informações sobre os processos ao coletar dados de todos os threads ativos. A variável `performance_schema_show_processlist` determina qual implementação da instrução `SHOW PROCESSLIST` usar:

  + A implementação padrão itera por threads ativos a partir do gerenciador de threads enquanto mantém um mutex global. Isso tem consequências negativas para o desempenho, especialmente em sistemas ocupados.

A implementação alternativa `SHOW PROCESSLIST` é baseada na tabela `processlist` do Schema de Desempenho. Essa implementação consulta dados de threads ativas do Schema de Desempenho em vez do gerenciador de threads e não requer um mutex.

Para habilitar a implementação alternativa, habilite a variável de sistema `performance_schema_show_processlist`. Para garantir que as implementações padrão e alternativa forneçam as mesmas informações, devem ser atendidas certas exigências de configuração; consulte a Seção 29.12.22.9, “A tabela processlist”.

* `performance_schema_users_size`

  <table frame="box" rules="all" summary="Propriedades para performance_schema_events_stages_history_long_size"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--performance-schema-events-stages-history-long-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_events_stages_history_long_size">performance_schema_events_stages_history_long_size</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de Sintaxe de Configuração <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Hinta de Configuração de Variáveis"><code>SET_VAR</a></code> Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoscalabilidade; não atribua este valor literal)</td> </tr><tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr></tbody></table>

O número de linhas na tabela `users`. Se essa variável for 0, o Schema de Desempenho não mantém estatísticas de conexão na tabela `users` ou informações de variáveis de status na tabela `status_by_user`.

* `performance_schema_max_logger_classes`

  <table frame="box" rules="all" summary="Propriedades para performance_schema_events_stages_history_long_size"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--performance-schema-events-stages-history-long-size=#</code></td> </tr><tr><th>Variável do Sistema</th> <td><code><a class="link" href="performance-schema-system-variables.html#sysvar_performance_schema_events_stages_history_long_size">performance_schema_events_stages_history_long_size</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de Sintaxe de Configuração de Hinta</th> <td><code>SET_VAR</code></a></td> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa autodimensionamento; não atribua esse valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>-1</code> (significa autoescalonamento; não atribua esse valor literal)</td> </tr><tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr></tbody></table>

  O valor indica o número máximo de instrumentos de clientes de registro que podem ser criados. A modificação desse ajuste requer o reinício do servidor.