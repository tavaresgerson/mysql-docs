## 25.16 Variáveis de status do esquema de desempenho

O Schema de Desempenho implementa várias variáveis de status que fornecem informações sobre a instrumentação que não puderam ser carregadas ou criadas devido a restrições de memória:

```sql
mysql> SHOW STATUS LIKE 'perf%';
+-------------------------------------------+-------+
| Variable_name                             | Value |
+-------------------------------------------+-------+
| Performance_schema_accounts_lost          | 0     |
| Performance_schema_cond_classes_lost      | 0     |
| Performance_schema_cond_instances_lost    | 0     |
| Performance_schema_file_classes_lost      | 0     |
| Performance_schema_file_handles_lost      | 0     |
| Performance_schema_file_instances_lost    | 0     |
| Performance_schema_hosts_lost             | 0     |
| Performance_schema_locker_lost            | 0     |
| Performance_schema_mutex_classes_lost     | 0     |
| Performance_schema_mutex_instances_lost   | 0     |
| Performance_schema_rwlock_classes_lost    | 0     |
| Performance_schema_rwlock_instances_lost  | 0     |
| Performance_schema_socket_classes_lost    | 0     |
| Performance_schema_socket_instances_lost  | 0     |
| Performance_schema_stage_classes_lost     | 0     |
| Performance_schema_statement_classes_lost | 0     |
| Performance_schema_table_handles_lost     | 0     |
| Performance_schema_table_instances_lost   | 0     |
| Performance_schema_thread_classes_lost    | 0     |
| Performance_schema_thread_instances_lost  | 0     |
| Performance_schema_users_lost             | 0     |
+-------------------------------------------+-------+
```

Para obter informações sobre como usar essas variáveis para verificar o status do Schema de Desempenho, consulte Seção 25.7, “Monitoramento do Status do Schema de Desempenho”.

As variáveis de status do esquema de desempenho têm os seguintes significados:

- `Performance_schema_accounts_lost`

  O número de vezes em que uma linha não pôde ser adicionada à tabela `accounts` porque estava cheia.

- `Performance_schema_cond_classes_lost`

  Quantos instrumentos de condição não puderam ser carregados.

- `Performance_schema_cond_instances_lost`

  Quantas instâncias de instrumentos de condição não puderam ser criadas.

- `Performance_schema_digest_lost`

  O número de instâncias de digest que não puderam ser instrumentadas na tabela `events_statements_summary_by_digest`. Este valor pode ser diferente de zero se o valor de `performance_schema_digests_size` for muito pequeno.

- `Performance_schema_file_classes_lost`

  Quantos instrumentos de arquivo não puderam ser carregados.

- `Performance_schema_file_handles_lost`

  Quantas instâncias de instrumento de arquivo não puderam ser abertas.

- `Performance_schema_file_instances_lost`

  Quantas instâncias de instrumento de arquivo não puderam ser criadas.

- `Performance_schema_hosts_lost`

  O número de vezes em que uma linha não pôde ser adicionada à tabela `hosts` porque estava cheia.

- `Performance_schema_index_stat_lost`

  O número de índices para os quais as estatísticas foram perdidas. Isso pode ser diferente de zero se o valor de `performance_schema_max_index_stat` for muito pequeno.

- `Performance_schema_locker_lost`

  Quantos eventos estão "perdidos" ou não registrados devido às seguintes condições:

  - Os eventos são recursivos (por exemplo, esperar por A causou uma espera em B, que causou uma espera em C).

  - A profundidade da pilha de eventos aninhados é maior que o limite imposto pela implementação.

  Os eventos registrados pelo Schema de Desempenho não são recursivos, portanto, essa variável deve sempre ser 0.

- `Performance_schema_memory_classes_lost`

  Número de vezes em que um instrumento de memória não pôde ser carregado.

- `Performance_schema_metadata_lock_lost`

  O número de bloqueios de metadados que não puderam ser instrumentados na tabela `metadata_locks`. Este valor pode ser diferente de zero se o valor de `performance_schema_max_metadata_locks` for muito pequeno.

- `Performance_schema_mutex_classes_lost`

  Quantos instrumentos de mutex não puderam ser carregados.

- `Performance_schema_mutex_instances_lost`

  Quantas instâncias do instrumento mutex não puderam ser criadas.

- `Performance_schema_nested_statement_lost`

  O número de instruções de programa armazenado para as quais as estatísticas foram perdidas. Isso pode ser diferente de zero se o valor de `performance_schema_max_statement_stack` for muito pequeno.

- `Performance_schema_prepared_statements_lost`

  O número de declarações preparadas que não puderam ser instrumentadas na tabela `prepared_statements_instances`. Este valor pode ser diferente de zero se o valor de `performance_schema_max_prepared_statements_instances` for muito pequeno.

- `Performance_schema_program_lost`

  O número de programas armazenados para os quais as estatísticas foram perdidas. Este número pode ser diferente de zero se o valor de `performance_schema_max_program_instances` for muito pequeno.

- `Performance_schema_rwlock_classes_lost`

  Quantos instrumentos rwlock não puderam ser carregados.

- `Performance_schema_rwlock_instances_lost`

  Quantas instâncias do instrumento rwlock não puderam ser criadas.

- `Performance_schema_session_connect_attrs_lost`

  O número de conexões para as quais ocorreu a redução de atributos de conexão. Para uma conexão específica, se o cliente enviar pares de chaves e valores de atributos de conexão para os quais o tamanho agregado for maior que o armazenamento reservado permitido pelo valor da variável de sistema `performance_schema_session_connect_attrs_size`, o Schema de Desempenho corta os dados dos atributos e incrementa `Performance_schema_session_connect_attrs_lost`. Se esse valor for diferente de zero, você pode querer definir `performance_schema_session_connect_attrs_size` para um valor maior.

  Para obter mais informações sobre os atributos de conexão, consulte Seção 25.12.9, “Tabelas de atributos de conexão do Schema de desempenho”.

- `Performance_schema_socket_classes_lost`

  Quantos instrumentos de soquete não puderam ser carregados.

- `Performance_schema_socket_instances_lost`

  Quantas instâncias do instrumento de soquete não puderam ser criadas.

- `Performance_schema_stage_classes_lost`

  Quantos instrumentos de palco não puderam ser carregados.

- \[`Classes de declarações do esquema de desempenho perdidas`]\(performance-schema-status-variables.html#statvar\_Classes de declarações do esquema de desempenho perdidas)

  Quantos instrumentos de declaração não puderam ser carregados.

- `Performance_schema_table_handles_lost`

  Quantas instâncias de instrumentos de tabela não puderam ser abertas. Isso pode ser um número não nulo se o valor de `performance_schema_max_table_handles` for muito pequeno.

- `Performance_schema_table_instances_lost`

  Quantas instâncias de instrumento de tabela não puderam ser criadas.

- `Performance_schema_table_lock_stat_lost`

  O número de tabelas para as quais as estatísticas de bloqueio foram perdidas. Este valor pode ser diferente de zero se o valor de `performance_schema_max_table_lock_stat` for muito pequeno.

- `Performance_schema_thread_classes_lost`

  Quantos instrumentos de fio não puderam ser carregados.

- `Performance_schema_thread_instances_lost`

  O número de instâncias de threads que não puderam ser instrumentadas na tabela `threads`. Esse valor pode ser diferente de zero se o valor de `performance_schema_max_thread_instances` for muito pequeno.

- `Performance_schema_users_lost`

  O número de vezes em que uma linha não pôde ser adicionada à tabela `users` porque estava cheia.
