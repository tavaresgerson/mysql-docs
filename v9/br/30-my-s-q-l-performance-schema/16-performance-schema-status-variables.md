## Variáveis de Status do Schema de Desempenho

O Schema de Desempenho implementa várias variáveis de status que fornecem informações sobre a instrumentação que não pôde ser carregada ou criada devido a restrições de memória:

```
mysql> SHOW STATUS LIKE 'perf%';
+-------------------------------------------------------+-------+
| Variable_name                                         | Value |
+-------------------------------------------------------+-------+
| Performance_schema_accounts_lost                      | 0     |
| Performance_schema_cond_classes_lost                  | 0     |
| Performance_schema_cond_instances_lost                | 0     |
| Performance_schema_digest_lost                        | 0     |
| Performance_schema_file_classes_lost                  | 0     |
| Performance_schema_file_handles_lost                  | 0     |
| Performance_schema_file_instances_lost                | 0     |
| Performance_schema_hosts_lost                         | 0     |
| Performance_schema_index_stat_lost                    | 0     |
| Performance_schema_locker_lost                        | 0     |
| Performance_schema_memory_classes_lost                | 0     |
| Performance_schema_metadata_lock_lost                 | 0     |
| Performance_schema_meter_lost                         | 0     |
| Performance_schema_metric_lost                        | 0     |
| Performance_schema_mutex_classes_lost                 | 0     |
| Performance_schema_mutex_instances_lost               | 0     |
| Performance_schema_nested_statement_lost              | 0     |
| Performance_schema_prepared_statements_lost           | 0     |
| Performance_schema_program_lost                       | 0     |
| Performance_schema_rwlock_classes_lost                | 0     |
| Performance_schema_rwlock_instances_lost              | 0     |
| Performance_schema_session_connect_attrs_longest_seen | 131   |
| Performance_schema_session_connect_attrs_lost         | 0     |
| Performance_schema_socket_classes_lost                | 0     |
| Performance_schema_socket_instances_lost              | 0     |
| Performance_schema_stage_classes_lost                 | 0     |
| Performance_schema_statement_classes_lost             | 0     |
| Performance_schema_table_handles_lost                 | 0     |
| Performance_schema_table_instances_lost               | 0     |
| Performance_schema_table_lock_stat_lost               | 0     |
| Performance_schema_thread_classes_lost                | 0     |
| Performance_schema_thread_instances_lost              | 0     |
| Performance_schema_users_lost                         | 0     |
+-------------------------------------------------------+-------+
```

Para obter informações sobre como usar essas variáveis para verificar o status do Schema de Desempenho, consulte a Seção 29.7, “Monitoramento do Status do Schema de Desempenho”.

As variáveis de status do Schema de Desempenho têm os seguintes significados:

* `Performance_schema_accounts_lost`

  O número de vezes que uma linha não pôde ser adicionada à tabela `accounts` porque estava cheia.

* `Performance_schema_cond_classes_lost`

  Quantos instrumentos de condição não puderam ser carregados.

* `Performance_schema_cond_instances_lost`

  Quantos instâncias de instrumentos de condição não puderam ser criadas.

* `Performance_schema_digest_lost`

  O número de instâncias de digest que não puderam ser instrumentadas na tabela `events_statements_summary_by_digest`. Isso pode ser diferente de zero se o valor de `performance_schema_digests_size` for muito pequeno.

* `Performance_schema_file_classes_lost`

  Quantos instrumentos de arquivo não puderam ser carregados.

* `Performance_schema_file_handles_lost`

  Quantos instâncias de instrumentos de arquivo não puderam ser abertas.

* `Performance_schema_file_instances_lost`

  Quantos instâncias de instrumentos de arquivo não puderam ser criadas.

* `Performance_schema_hosts_lost`

  O número de vezes que uma linha não pôde ser adicionada à tabela `hosts` porque estava cheia.

* `Performance_schema_index_stat_lost`

  O número de índices para os quais as estatísticas foram perdidas. Isso pode ser diferente de zero se o valor de `performance_schema_max_index_stat` for muito pequeno.

* `Performance_schema_locker_lost`

  Quantos eventos estão “perdidos” ou não registrados, devido às seguintes condições:

+ Os eventos são recursivos (por exemplo, a espera por A causou uma espera em B, que causou uma espera em C).

+ A profundidade da pilha de eventos aninhados é maior que o limite imposto pela implementação.

+ Os eventos registrados pelo Schema de Desempenho não são recursivos, portanto, essa variável deve sempre ser 0.

* `Performance_schema_memory_classes_lost`

  O número de vezes que um instrumento de memória não pôde ser carregado.

* `Performance_schema_metadata_lock_lost`

  O número de blocos de metadados que não puderam ser instrumentados na tabela `metadata_locks`. Isso pode ser diferente de zero se o valor de `performance_schema_max_metadata_locks` for muito pequeno.

* `Performance_schema_meter_lost`

  Número de instrumentos de medidor que não conseguiram ser criados.

* `Performance_schema_metric_lost`

  Número de instrumentos de métrica que não conseguiram ser criados.

* `Performance_schema_mutex_classes_lost`

  Quantos instrumentos de mutex não puderam ser carregados.

* `Performance_schema_mutex_instances_lost`

  Quantos instâncias de instrumentos de mutex não puderam ser criadas.

* `Performance_schema_nested_statement_lost`

  O número de instruções de programa armazenadas para as quais as estatísticas foram perdidas. Isso pode ser diferente de zero se o valor de `performance_schema_max_statement_stack` for muito pequeno.

* `Performance_schema_prepared_statements_lost`

  O número de instruções preparadas que não puderam ser instrumentadas na tabela `prepared_statements_instances`. Isso pode ser diferente de zero se o valor de `performance_schema_max_prepared_statements_instances` for muito pequeno.

* `Performance_schema_program_lost`

  O número de programas armazenados para os quais as estatísticas foram perdidas. Isso pode ser diferente de zero se o valor de `performance_schema_max_program_instances` for muito pequeno.

* `Performance_schema_rwlock_classes_lost`

  Quantos instrumentos de rwlock não puderam ser carregados.

* `Performance_schema_rwlock_instances_lost`

  Quantas instâncias do instrumento `rwlock` não puderam ser criadas.

* `Performance_schema_session_connect_attrs_longest_seen`

  Além da verificação do limite de tamanho do atributo de conexão realizada pelo Schema de Desempenho contra o valor da variável de sistema `performance_schema_session_connect_attrs_size`, o servidor realiza uma verificação preliminar, impondo um limite de 64KB ao tamanho agregado dos dados dos atributos de conexão que aceita. Se um cliente tentar enviar mais de 64KB de dados de atributo, o servidor rejeita a conexão. Caso contrário, o servidor considera o buffer de atributo válido e registra o tamanho do buffer mais longo desse tipo na variável de status `Performance_schema_session_connect_attrs_longest_seen`. Se esse valor for maior que `performance_schema_session_connect_attrs_size`, os DBA podem querer aumentar o último valor, ou, como alternativa, investigar quais clientes estão enviando grandes quantidades de dados de atributo.

  Para mais informações sobre atributos de conexão, consulte a Seção 29.12.9, “Tabelas de Atributos de Conexão do Schema de Desempenho”.

* `Performance_schema_session_connect_attrs_lost`

  O número de conexões para as quais ocorreu a redução de atributos de conexão. Para uma conexão dada, se o cliente enviar pares de chave-valor de atributos de conexão para os quais o tamanho agregado é maior que o armazenamento reservado permitido pelo valor da variável de sistema `performance_schema_session_connect_attrs_size`, o Schema de Desempenho reduz os dados do atributo e incrementa `Performance_schema_session_connect_attrs_lost`. Se esse valor for diferente de zero, você pode querer definir `performance_schema_session_connect_attrs_size` para um valor maior.

Para obter mais informações sobre os atributos de conexão, consulte a Seção 29.12.9, “Tabelas de atributos de conexão do Schema de Desempenho”.

* `Performance_schema_socket_classes_lost`

  Quantos instrumentos de soquete não puderam ser carregados.

* `Performance_schema_socket_instances_lost`

  Quantos instâncias de instrumentos de soquete não puderam ser criadas.

* `Performance_schema_stage_classes_lost`

  Quantos instrumentos de estágio não puderam ser carregados.

* `Performance_schema_statement_classes_lost`

  Quantos instrumentos de declaração não puderam ser carregados.

* `Performance_schema_table_handles_lost`

  Quantas instâncias de instrumentos de tabela não puderam ser abertas. Isso pode ser diferente de zero se o valor de `performance_schema_max_table_handles` for muito pequeno.

* `Performance_schema_table_instances_lost`

  Quantas instâncias de instrumentos de tabela não puderam ser criadas.

* `Performance_schema_table_lock_stat_lost`

  O número de tabelas para as quais as estatísticas de bloqueio foram perdidas. Isso pode ser diferente de zero se o valor de `performance_schema_max_table_lock_stat` for muito pequeno.

* `Performance_schema_thread_classes_lost`

  Quantos instrumentos de thread não puderam ser carregados.

* `Performance_schema_thread_instances_lost`

  O número de instâncias de thread que não puderam ser instrumentadas na tabela `threads`. Isso pode ser diferente de zero se o valor de `performance_schema_max_thread_instances` for muito pequeno.

* `Performance_schema_users_lost`

  O número de vezes que uma linha não pôde ser adicionada à tabela `users` porque estava cheia.

* `Performance_schema_logger_lost`

  Exibe o número de instrumentos de registro que não conseguiram ser criados.