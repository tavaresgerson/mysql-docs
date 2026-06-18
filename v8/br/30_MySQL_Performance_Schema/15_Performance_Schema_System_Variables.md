## 29.15 Variáveis do Sistema de Schema de Desempenho

O Schema de Desempenho implementa várias variáveis de sistema que fornecem informações de configuração:

```
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
| performance_schema_max_mutex_classes                     | 350   |
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

As variáveis do sistema do Schema de Desempenho podem ser definidas na linha de comando ou em arquivos de opção durante o início do servidor, e muitas podem ser definidas durante a execução. Consulte a Seção 29.13, “Referência de Opções e Variáveis do Schema de Desempenho”.

O Schema de Desempenho dimensiona automaticamente os valores de vários de seus parâmetros ao iniciar o servidor, se não forem definidos explicitamente. Para mais informações, consulte a Seção 29.3, “Configuração de Inicialização do Schema de Desempenho”.

As variáveis do sistema do esquema de desempenho têm os seguintes significados:

- `performance_schema`

  <table summary="Propriedades para performance_schema"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>performance_schema</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>

  O valor desta variável é `ON` ou `OFF` para indicar se o Schema de Desempenho está habilitado. Por padrão, o valor é `ON`. Ao iniciar o servidor, você pode especificar esta variável sem valor ou com o valor `ON` ou 1 para habilitá-la, ou com o valor `OFF` ou 0 para desabilitá-la.

  Mesmo quando o Schema de Desempenho está desativado, ele continua a preencher as tabelas `global_variables`, `session_variables`, `global_status` e `session_status`. Isso ocorre conforme necessário para permitir que os resultados das instruções `SHOW VARIABLES` e `SHOW STATUS` sejam extraídos dessas tabelas. O Schema de Desempenho também preenche algumas das tabelas de replicação quando desativado.

- `performance_schema_accounts_size`

  <table summary="Propriedades para performance_schema_accounts_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-accounts-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>performance_schema_accounts_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>

  O número de linhas na tabela `accounts`. Se essa variável for 0, o Gerenciamento de Desempenho não mantém estatísticas de conexão na tabela `accounts` ou informações da variável de status na tabela `status_by_account`.

- `performance_schema_digests_size`

  <table summary="Propriedades para performance_schema_digests_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-digests-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>performance_schema_digests_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>

  O número máximo de linhas na tabela `events_statements_summary_by_digest`. Se esse limite for ultrapassado, de modo que não seja possível instrumar um digest, o Schema de Desempenho incrementa a variável de status `Performance_schema_digest_lost`.

  Para obter mais informações sobre a digestão de declarações, consulte a Seção 29.10, “Digestas e Amostragem de Declarações do Schema de Desempenho”.

- `performance_schema_error_size`

  <table summary="Propriedades para performance_schema_error_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-error-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>performance_schema_error_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>number of server error codes</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>

  O número de códigos de erro de servidor instrumentados. O valor padrão é o número real de códigos de erro de servidor. Embora o valor possa ser definido em qualquer lugar de 0 até o máximo, o uso pretendido é configurá-lo para o valor padrão (para instrurar todos os erros) ou 0 (para instrurar nenhum erro).

  As informações de erro são agregadas em tabelas resumidas; consulte a Seção 29.12.20.11, “Tabelas de Resumo de Erros”. Se ocorrer um erro que não seja instrumentado, as informações sobre a ocorrência são agregadas à linha `NULL` em cada tabela resumida; ou seja, à linha com `ERROR_NUMBER=0`, `ERROR_NAME=NULL` e `SQLSTATE=NULL`.

- `performance_schema_events_stages_history_long_size`

  <table summary="Propriedades para performance_schema_events_stages_history_long_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-events-stages-history-long-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>performance_schema_events_stages_history_long_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>

  O número de linhas na tabela `events_stages_history_long`.

- `performance_schema_events_stages_history_size`

  <table summary="Propriedades para performance_schema_events_stages_history_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-events-stages-history-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>performance_schema_events_stages_history_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1024</code>]]</td> </tr></tbody></table>

  O número de linhas por fio na tabela `events_stages_history`.

- `performance_schema_events_statements_history_long_size`

  <table summary="Propriedades para performance_schema_events_statements_history_long_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-events-statements-history-long-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>performance_schema_events_statements_history_long_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>

  O número de linhas na tabela `events_statements_history_long`.

- `performance_schema_events_statements_history_size`

  <table summary="Propriedades para performance_schema_events_statements_history_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-events-statements-history-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>performance_schema_events_statements_history_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1024</code>]]</td> </tr></tbody></table>

  O número de linhas por fio na tabela `events_statements_history`.

- `performance_schema_events_transactions_history_long_size`

  <table summary="Propriedades para performance_schema_events_transactions_history_long_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-events-transactions-history-long-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>performance_schema_events_transactions_history_long_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>

  O número de linhas na tabela `events_transactions_history_long`.

- `performance_schema_events_transactions_history_size`

  <table summary="Propriedades para performance_schema_events_transactions_history_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-events-transactions-history-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>performance_schema_events_transactions_history_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1024</code>]]</td> </tr></tbody></table>

  O número de linhas por fio na tabela `events_transactions_history`.

- `performance_schema_events_waits_history_long_size`

  <table summary="Propriedades para performance_schema_accounts_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-accounts-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>performance_schema_accounts_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>0

  O número de linhas na tabela `events_waits_history_long`.

- `performance_schema_events_waits_history_size`

  <table summary="Propriedades para performance_schema_accounts_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-accounts-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>performance_schema_accounts_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>1

  O número de linhas por fio na tabela `events_waits_history`.

- `performance_schema_hosts_size`

  <table summary="Propriedades para performance_schema_accounts_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-accounts-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>performance_schema_accounts_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>2

  O número de linhas na tabela `hosts`. Se essa variável for 0, o Gerenciamento de Desempenho não mantém estatísticas de conexão na tabela `hosts` ou informações da variável de status na tabela `status_by_host`.

- `performance_schema_max_cond_classes`

  <table summary="Propriedades para performance_schema_accounts_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-accounts-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>performance_schema_accounts_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>3

  O número máximo de instrumentos de condição. Para obter informações sobre como definir e usar essa variável, consulte a Seção 29.7, “Monitoramento do Status do Schema de Desempenho”.

- `performance_schema_max_cond_instances`

  <table summary="Propriedades para performance_schema_accounts_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-accounts-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>performance_schema_accounts_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>4

  O número máximo de objetos de condição instrumentados. Para obter informações sobre como definir e usar essa variável, consulte a Seção 29.7, “Monitoramento do Status do Schema de Desempenho”.

- `performance_schema_max_digest_length`

  <table summary="Propriedades para performance_schema_accounts_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-accounts-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>performance_schema_accounts_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>5

  O número máximo de bytes de memória reservados por instrução para a computação de valores normalizados de digestes de instruções no Gerenciamento de Desempenho. Esta variável está relacionada a `max_digest_length`; consulte a descrição dessa variável na Seção 7.1.8, “Variáveis do Sistema do Servidor”.

  Para obter mais informações sobre a digestão de declarações, incluindo considerações sobre o uso da memória, consulte a Seção 29.10, “Digestas e Amostragem de Declarações do Schema de Desempenho”.

- `performance_schema_max_digest_sample_age`

  <table summary="Propriedades para performance_schema_accounts_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-accounts-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>performance_schema_accounts_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>6

  Esta variável afeta a amostragem de declarações para a tabela `events_statements_summary_by_digest`. Quando uma nova linha de tabela é inserida, a declaração que produziu o valor do resumo da linha é armazenada como a declaração de amostra atual associada ao resumo. Em seguida, quando o servidor vê outras declarações com o mesmo valor de resumo, ele determina se deve usar a nova declaração para substituir a declaração de amostra atual (ou seja, se deve fazer uma nova amostragem). A política de amostragem múltipla é baseada nos tempos de espera comparativos da declaração de amostra atual e da nova declaração e, opcionalmente, na idade da declaração de amostra atual:

  - Reescalonamento com base nos tempos de espera: Se o novo tempo de espera da declaração for maior que o da declaração da amostra atual, ela se torna a declaração da amostra atual.

  - Reescalonamento com base na idade: Se a variável de sistema `performance_schema_max_digest_sample_age` tiver um valor maior que zero e a declaração de amostra atual tiver mais de tantos segundos, a declaração atual é considerada “muito antiga” e a nova declaração a substitui. Isso ocorre mesmo se o tempo de espera da nova declaração for menor que o da declaração de amostra atual.

  Para obter informações sobre a amostragem de declarações, consulte a Seção 29.10, “Resumo e Amostragem de Declarações do Schema de Desempenho”.

- `performance_schema_max_file_classes`

  <table summary="Propriedades para performance_schema_accounts_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-accounts-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>performance_schema_accounts_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>7

  O número máximo de instrumentos de arquivo. Para obter informações sobre como definir e usar essa variável, consulte a Seção 29.7, “Monitoramento do Status do Schema de Desempenho”.

- `performance_schema_max_file_handles`

  <table summary="Propriedades para performance_schema_accounts_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-accounts-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>performance_schema_accounts_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>8

  O número máximo de objetos de arquivo abertos. Para obter informações sobre como definir e usar essa variável, consulte a Seção 29.7, “Monitoramento do Status do Schema de Desempenho”.

  O valor de `performance_schema_max_file_handles` deve ser maior que o valor de `open_files_limit`: `open_files_limit` afeta o número máximo de conexões de arquivo abertas que o servidor pode suportar e `performance_schema_max_file_handles` afeta quantos desses endereços de arquivo podem ser instrumentados.

- `performance_schema_max_file_instances`

  <table summary="Propriedades para performance_schema_accounts_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-accounts-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>performance_schema_accounts_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>9

  O número máximo de objetos de arquivo instrumentados. Para obter informações sobre como definir e usar essa variável, consulte a Seção 29.7, “Monitoramento do Status do Schema de Desempenho”.

- `performance_schema_max_index_stat`

  <table summary="Propriedades para performance_schema_digests_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-digests-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>performance_schema_digests_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>0

  O número máximo de índices para os quais o Schema de Desempenho mantém estatísticas. Se esse limite for excedido, de modo que as estatísticas dos índices sejam perdidas, o Schema de Desempenho incrementa a variável de status `Performance_schema_index_stat_lost`. O valor padrão é dimensionado automaticamente com base no valor de `performance_schema_max_table_instances`.

- `performance_schema_max_memory_classes`

  <table summary="Propriedades para performance_schema_digests_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-digests-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>performance_schema_digests_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>1

  O número máximo de instrumentos de memória. Para obter informações sobre como definir e usar essa variável, consulte a Seção 29.7, “Monitoramento do Status do Schema de Desempenho”.

- `performance_schema_max_metadata_locks`

  <table summary="Propriedades para performance_schema_digests_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-digests-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>performance_schema_digests_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>2

  O número máximo de instrumentos de bloqueio de metadados. Esse valor controla o tamanho da tabela `metadata_locks`. Se esse máximo for excedido, de modo que um bloqueio de metadados não possa ser instrumentado, o Schema de Desempenho incrementa a variável de status `Performance_schema_metadata_lock_lost`.

- `performance_schema_max_mutex_classes`

  <table summary="Propriedades para performance_schema_digests_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-digests-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>performance_schema_digests_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>3

  O número máximo de instrumentos de mutex. Para obter informações sobre como definir e usar essa variável, consulte a Seção 29.7, “Monitoramento do Status do Schema de Desempenho”.

- `performance_schema_max_mutex_instances`

  <table summary="Propriedades para performance_schema_digests_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-digests-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>performance_schema_digests_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>4

  O número máximo de objetos de mutex instrumentados. Para obter informações sobre como definir e usar essa variável, consulte a Seção 29.7, “Monitoramento do Status do Schema de Desempenho”.

- `performance_schema_max_prepared_statements_instances`

  <table summary="Propriedades para performance_schema_digests_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-digests-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>performance_schema_digests_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>5

  O número máximo de linhas na tabela `prepared_statements_instances`. Se esse limite for excedido, de modo que uma instrução preparada não possa ser instrumentada, o Schema de Desempenho incrementa a variável de status `Performance_schema_prepared_statements_lost`. Para obter informações sobre como definir e usar essa variável, consulte a Seção 29.7, “Monitoramento de Status do Schema de Desempenho”.

  O valor padrão desta variável é dimensionado automaticamente com base no valor da variável de sistema `max_prepared_stmt_count`.

- `performance_schema_max_rwlock_classes`

  <table summary="Propriedades para performance_schema_digests_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-digests-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>performance_schema_digests_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>6

  O número máximo de instrumentos rwlock. Para obter informações sobre como definir e usar essa variável, consulte a Seção 29.7, “Monitoramento do Status do Schema de Desempenho”.

- `performance_schema_max_program_instances`

  <table summary="Propriedades para performance_schema_digests_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-digests-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>performance_schema_digests_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>7

  O número máximo de programas armazenados para os quais o Schema de Desempenho mantém estatísticas. Se esse limite for ultrapassado, o Schema de Desempenho incrementa a variável de status `Performance_schema_program_lost`. Para obter informações sobre como definir e usar essa variável, consulte a Seção 29.7, “Monitoramento de Status do Schema de Desempenho”.

- `performance_schema_max_rwlock_instances`

  <table summary="Propriedades para performance_schema_digests_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-digests-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>performance_schema_digests_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>8

  O número máximo de objetos instrumentados de rwlock. Para obter informações sobre como definir e usar essa variável, consulte a Seção 29.7, “Monitoramento do Status do Schema de Desempenho”.

- `performance_schema_max_socket_classes`

  <table summary="Propriedades para performance_schema_digests_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-digests-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>performance_schema_digests_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>9

  O número máximo de instrumentos de soquete. Para obter informações sobre como definir e usar essa variável, consulte a Seção 29.7, “Monitoramento do Status do Schema de Desempenho”.

- `performance_schema_max_socket_instances`

  <table summary="Propriedades para performance_schema_error_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-error-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>performance_schema_error_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>number of server error codes</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>0

  O número máximo de objetos de soquete instrumentados. Para obter informações sobre como definir e usar essa variável, consulte a Seção 29.7, “Monitoramento do Status do Schema de Desempenho”.

- `performance_schema_max_sql_text_length`

  <table summary="Propriedades para performance_schema_error_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-error-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>performance_schema_error_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>number of server error codes</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>1

  O número máximo de bytes usados para armazenar instruções SQL. O valor se aplica ao armazenamento necessário para essas colunas:

  - A coluna `SQL_TEXT` das tabelas de eventos das declarações `events_statements_current`, `events_statements_history` e `events_statements_history_long`.

  - A coluna `QUERY_SAMPLE_TEXT` da tabela de resumo `events_statements_summary_by_digest`.

  Quaisquer bytes que excedam `performance_schema_max_sql_text_length` são descartados e não aparecem na coluna. As declarações que diferem apenas após tantos bytes iniciais são indistinguíveis na coluna.

  Reduzir o valor de `performance_schema_max_sql_text_length` diminui o uso de memória, mas faz com que mais instruções se tornem indistinguíveis se diferirem apenas no final. Aumentar o valor aumenta o uso de memória, mas permite que instruções mais longas sejam distinguidas.

- `performance_schema_max_stage_classes`

  <table summary="Propriedades para performance_schema_error_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-error-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>performance_schema_error_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>number of server error codes</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>2

  O número máximo de instrumentos de palco. Para obter informações sobre como definir e usar essa variável, consulte a Seção 29.7, “Monitoramento do Status do Schema de Desempenho”.

- `performance_schema_max_statement_classes`

  <table summary="Propriedades para performance_schema_error_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-error-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>performance_schema_error_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>number of server error codes</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>3

  O número máximo de instrumentos de declaração. Para obter informações sobre como definir e usar essa variável, consulte a Seção 29.7, “Monitoramento do Status do Schema de Desempenho”.

  O valor padrão é calculado no momento da construção do servidor com base no número de comandos no protocolo cliente/servidor e no número de tipos de instruções SQL suportados pelo servidor.

  Essa variável não deve ser alterada, a menos que seja definida como 0 para desativar toda a instrumentação de instruções e salvar toda a memória associada a ela. Definir a variável com valores diferentes do padrão não oferece nenhum benefício; em particular, valores maiores que o padrão causam a alocação de mais memória do que o necessário.

- `performance_schema_max_statement_stack`

  <table summary="Propriedades para performance_schema_error_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-error-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>performance_schema_error_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>number of server error codes</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>4

  A profundidade máxima de chamadas de programas armazenados aninhados para as quais o Schema de Desempenho mantém estatísticas. Quando esse limite é ultrapassado, o Schema de Desempenho incrementa a variável de status `Performance_schema_nested_statement_lost` para cada instrução de programa armazenado executada.

- `performance_schema_max_table_handles`

  <table summary="Propriedades para performance_schema_error_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-error-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>performance_schema_error_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>number of server error codes</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>5

  O número máximo de objetos de tabela abertos. Esse valor controla o tamanho da tabela `table_handles`. Se esse valor for excedido de forma que um handle de tabela não possa ser instrumentado, o Schema de Desempenho incrementa a variável de status `Performance_schema_table_handles_lost`. Para obter informações sobre como definir e usar essa variável, consulte a Seção 29.7, “Monitoramento de Status do Schema de Desempenho”.

- `performance_schema_max_table_instances`

  <table summary="Propriedades para performance_schema_error_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-error-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>performance_schema_error_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>number of server error codes</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>6

  O número máximo de objetos de tabela instrumentados. Para obter informações sobre como definir e usar essa variável, consulte a Seção 29.7, “Monitoramento do Status do Schema de Desempenho”.

- `performance_schema_max_table_lock_stat`

  <table summary="Propriedades para performance_schema_error_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-error-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>performance_schema_error_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>number of server error codes</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>7

  O número máximo de tabelas para as quais o Schema de Desempenho mantém estatísticas de bloqueio. Se esse limite for ultrapassado, de modo que as estatísticas de bloqueio de tabelas sejam perdidas, o Schema de Desempenho incrementa a variável de status `Performance_schema_table_lock_stat_lost`.

- `performance_schema_max_thread_classes`

  <table summary="Propriedades para performance_schema_error_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-error-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>performance_schema_error_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>number of server error codes</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>8

  O número máximo de instrumentos de fio. Para obter informações sobre como definir e usar essa variável, consulte a Seção 29.7, “Monitoramento do Status do Schema de Desempenho”.

- `performance_schema_max_thread_instances`

  <table summary="Propriedades para performance_schema_error_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-error-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>performance_schema_error_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>number of server error codes</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>9

  O número máximo de objetos de fio instrumentados. O valor controla o tamanho da tabela `threads`. Se esse limite for excedido, de modo que um fio não possa ser instrumentado, o Schema de Desempenho incrementa a variável de status `Performance_schema_thread_instances_lost`. Para obter informações sobre como definir e usar essa variável, consulte a Seção 29.7, “Monitoramento de Status do Schema de Desempenho”.

  A variável de sistema `max_connections` afeta quantos threads podem rodar no servidor. `performance_schema_max_thread_instances` afeta quantos desses threads em execução podem ser instrumentados.

  As tabelas `variables_by_thread` e `status_by_thread` contêm informações sobre variáveis de sistema e status apenas sobre os threads em primeiro plano. Se nem todos os threads estiverem instrumentados pelo Schema de Desempenho, essa tabela perderá algumas linhas. Nesse caso, a variável de status `Performance_schema_thread_instances_lost` é maior que zero.

- `performance_schema_session_connect_attrs_size`

  <table summary="Propriedades para performance_schema_events_stages_history_long_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-events-stages-history-long-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>performance_schema_events_stages_history_long_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>0

  A quantidade de memória pré-alocate por fio reservada para armazenar pares chave-valor de atributos de conexão. Se o tamanho agregado dos dados de atributos de conexão enviados por um cliente for maior que essa quantidade, o Schema de Desempenho corta os dados do atributo, incrementa a variável de status `Performance_schema_session_connect_attrs_lost` e escreve uma mensagem no log de erro indicando que a corte ocorreu se a variável de sistema `log_error_verbosity` for maior que 1. Um atributo `_truncated` também é adicionado aos atributos de sessão com um valor indicando quantos bytes foram perdidos, se o buffer do atributo tiver espaço suficiente. Isso permite que o Schema de Desempenho exiba informações de corte por conexão nas tabelas de atributos de conexão. Essa informação pode ser examinada sem precisar verificar o log de erro.

  O valor padrão de `performance_schema_session_connect_attrs_size` é dimensionado automaticamente ao iniciar o servidor. Esse valor pode ser pequeno, portanto, se ocorrer truncação (`Performance_schema_session_connect_attrs_lost` se tornar não nulo), você pode querer definir `performance_schema_session_connect_attrs_size` explicitamente para um valor maior.

  Embora o valor máximo permitido do `performance_schema_session_connect_attrs_size` seja de 1 MB, o valor máximo efetivo é de 64 KB, pois o servidor impõe um limite de 64 KB ao tamanho agregado dos dados do atributo de conexão que aceita. Se um cliente tentar enviar mais de 64 KB de dados do atributo, o servidor rejeita a conexão. Para mais informações, consulte a Seção 29.12.9, “Tabelas de Atributos de Conexão do Schema de Desempenho”.

- `performance_schema_setup_actors_size`

  <table summary="Propriedades para performance_schema_events_stages_history_long_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-events-stages-history-long-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>performance_schema_events_stages_history_long_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>1

  O número de linhas na tabela `setup_actors`.

- `performance_schema_setup_objects_size`

  <table summary="Propriedades para performance_schema_events_stages_history_long_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-events-stages-history-long-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>performance_schema_events_stages_history_long_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>2

  O número de linhas na tabela `setup_objects`.

- `performance_schema_show_processlist`

  <table summary="Propriedades para performance_schema_events_stages_history_long_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-events-stages-history-long-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>performance_schema_events_stages_history_long_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>3

  A declaração `SHOW PROCESSLIST` fornece informações sobre o processo, coletando dados de threads de todos os threads ativos. A variável `performance_schema_show_processlist` determina qual implementação de `SHOW PROCESSLIST` deve ser usada:

  - A implementação padrão itera por threads ativas a partir do gerenciador de threads, mantendo um mutex global. Isso tem consequências negativas de desempenho, especialmente em sistemas ocupados.

  - A implementação alternativa `SHOW PROCESSLIST` é baseada na tabela do Schema de Desempenho `processlist`. Essa implementação consulta dados de threads ativas do Schema de Desempenho em vez do gerenciador de threads e não requer um mutex.

  Para habilitar a implementação alternativa, habilite a variável de sistema `performance_schema_show_processlist`. Para garantir que as implementações padrão e alternativa forneçam as mesmas informações, devem ser atendidas certas exigências de configuração; consulte a Seção 29.12.21.7, “A Tabela processlist”.

- `performance_schema_users_size`

  <table summary="Propriedades para performance_schema_events_stages_history_long_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--performance-schema-events-stages-history-long-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>performance_schema_events_stages_history_long_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>-1</code>]] (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]] (significa autoescalonamento; não atribua este valor literal)</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>4

  O número de linhas na tabela `users`. Se essa variável for 0, o Gerenciamento de Desempenho não mantém estatísticas de conexão na tabela `users` ou informações da variável de status na tabela `status_by_user`.
