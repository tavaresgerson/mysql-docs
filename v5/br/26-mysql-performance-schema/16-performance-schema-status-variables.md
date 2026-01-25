## 25.16 Variáveis de Status do Performance Schema

O Performance Schema implementa várias variáveis de status que fornecem informações sobre instrumentação que não pôde ser carregada ou criada devido a restrições de memória:

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

Para obter informações sobre como usar essas variáveis para verificar o status do Performance Schema, consulte [Seção 25.7, “Monitoramento de Status do Performance Schema”](performance-schema-status-monitoring.html "25.7 Monitoramento de Status do Performance Schema").

As variáveis de status do Performance Schema têm os seguintes significados:

* [`Performance_schema_accounts_lost`](performance-schema-status-variables.html#statvar_Performance_schema_accounts_lost)

  O número de vezes que uma linha não pôde ser adicionada à tabela [`accounts`] porque estava cheia.

* [`Performance_schema_cond_classes_lost`](performance-schema-status-variables.html#statvar_Performance_schema_cond_classes_lost)

  Quantos instrumentos de condição não puderam ser carregados.

* [`Performance_schema_cond_instances_lost`](performance-schema-status-variables.html#statvar_Performance_schema_cond_instances_lost)

  Quantas instâncias de instrumentos de condição não puderam ser criadas.

* [`Performance_schema_digest_lost`](performance-schema-status-variables.html#statvar_Performance_schema_digest_lost)

  O número de instâncias de digest que não puderam ser instrumentadas na tabela [`events_statements_summary_by_digest`]. Isso pode ser diferente de zero se o valor de [`performance_schema_digests_size`] for muito pequeno.

* [`Performance_schema_file_classes_lost`](performance-schema-status-variables.html#statvar_Performance_schema_file_classes_lost)

  Quantos instrumentos de arquivo não puderam ser carregados.

* [`Performance_schema_file_handles_lost`](performance-schema-status-variables.html#statvar_Performance_schema_file_handles_lost)

  Quantas instâncias de instrumentos de arquivo não puderam ser abertas.

* [`Performance_schema_file_instances_lost`](performance-schema-status-variables.html#statvar_Performance_schema_file_instances_lost)

  Quantas instâncias de instrumentos de arquivo não puderam ser criadas.

* [`Performance_schema_hosts_lost`](performance-schema-status-variables.html#statvar_Performance_schema_hosts_lost)

  O número de vezes que uma linha não pôde ser adicionada à tabela [`hosts`] porque estava cheia.

* [`Performance_schema_index_stat_lost`](performance-schema-status-variables.html#statvar_Performance_schema_index_stat_lost)

  O número de Indexes para os quais as estatísticas foram perdidas. Isso pode ser diferente de zero se o valor de [`performance_schema_max_index_stat`] for muito pequeno.

* [`Performance_schema_locker_lost`](performance-schema-status-variables.html#statvar_Performance_schema_locker_lost)

  Quantos eventos são “perdidos” ou não registrados, devido às seguintes condições:

  + Eventos são recursivos (por exemplo, esperar por A causou uma espera em B, que causou uma espera em C).

  + A profundidade da pilha de eventos aninhados é maior do que o limite imposto pela implementação.

  Os eventos registrados pelo Performance Schema não são recursivos, portanto, esta variável deve ser sempre 0.

* [`Performance_schema_memory_classes_lost`](performance-schema-status-variables.html#statvar_Performance_schema_memory_classes_lost)

  O número de vezes que um instrumento de memória não pôde ser carregado.

* [`Performance_schema_metadata_lock_lost`](performance-schema-status-variables.html#statvar_Performance_schema_metadata_lock_lost)

  O número de Metadata Locks que não puderam ser instrumentados na tabela [`metadata_locks`]. Isso pode ser diferente de zero se o valor de [`performance_schema_max_metadata_locks`] for muito pequeno.

* [`Performance_schema_mutex_classes_lost`](performance-schema-status-variables.html#statvar_Performance_schema_mutex_classes_lost)

  Quantos instrumentos Mutex não puderam ser carregados.

* [`Performance_schema_mutex_instances_lost`](performance-schema-status-variables.html#statvar_Performance_schema_mutex_instances_lost)

  Quantas instâncias de instrumentos Mutex não puderam ser criadas.

* [`Performance_schema_nested_statement_lost`](performance-schema-status-variables.html#statvar_Performance_schema_nested_statement_lost)

  O número de Statements de programas armazenados para os quais as estatísticas foram perdidas. Isso pode ser diferente de zero se o valor de [`performance_schema_max_statement_stack`] for muito pequeno.

* [`Performance_schema_prepared_statements_lost`](performance-schema-status-variables.html#statvar_Performance_schema_prepared_statements_lost)

  O número de Prepared Statements que não puderam ser instrumentados na tabela [`prepared_statements_instances`]. Isso pode ser diferente de zero se o valor de [`performance_schema_max_prepared_statements_instances`] for muito pequeno.

* [`Performance_schema_program_lost`](performance-schema-status-variables.html#statvar_Performance_schema_program_lost)

  O número de programas armazenados para os quais as estatísticas foram perdidas. Isso pode ser diferente de zero se o valor de [`performance_schema_max_program_instances`] for muito pequeno.

* [`Performance_schema_rwlock_classes_lost`](performance-schema-status-variables.html#statvar_Performance_schema_rwlock_classes_lost)

  Quantos instrumentos RWLock não puderam ser carregados.

* [`Performance_schema_rwlock_instances_lost`](performance-schema-status-variables.html#statvar_Performance_schema_rwlock_instances_lost)

  Quantas instâncias de instrumentos RWLock não puderam ser criadas.

* [`Performance_schema_session_connect_attrs_lost`](performance-schema-status-variables.html#statvar_Performance_schema_session_connect_attrs_lost)

  O número de conexões para as quais ocorreu truncamento de atributo de conexão. Para uma determinada conexão, se o cliente enviar pares de chave-valor de atributo de conexão cujo tamanho agregado for maior do que o armazenamento reservado permitido pelo valor da variável de sistema [`performance_schema_session_connect_attrs_size`], o Performance Schema trunca os dados do atributo e incrementa [`Performance_schema_session_connect_attrs_lost`]. Se este valor for diferente de zero, você pode querer definir [`performance_schema_session_connect_attrs_size`] para um valor maior.

  Para mais informações sobre atributos de conexão, consulte [Seção 25.12.9, “Tabelas de Atributos de Conexão do Performance Schema”](performance-schema-connection-attribute-tables.html "25.12.9 Tabelas de Atributos de Conexão do Performance Schema").

* [`Performance_schema_socket_classes_lost`](performance-schema-status-variables.html#statvar_Performance_schema_socket_classes_lost)

  Quantos instrumentos de Socket não puderam ser carregados.

* [`Performance_schema_socket_instances_lost`](performance-schema-status-variables.html#statvar_Performance_schema_socket_instances_lost)

  Quantas instâncias de instrumentos de Socket não puderam ser criadas.

* [`Performance_schema_stage_classes_lost`](performance-schema-status-variables.html#statvar_Performance_schema_stage_classes_lost)

  Quantos instrumentos de Stage não puderam ser carregados.

* [`Performance_schema_statement_classes_lost`](performance-schema-status-variables.html#statvar_Performance_schema_statement_classes_lost)

  Quantos instrumentos de Statement não puderam ser carregados.

* [`Performance_schema_table_handles_lost`](performance-schema-status-variables.html#statvar_Performance_schema_table_handles_lost)

  Quantas instâncias de instrumentos de tabela não puderam ser abertas. Isso pode ser diferente de zero se o valor de [`performance_schema_max_table_handles`] for muito pequeno.

* [`Performance_schema_table_instances_lost`](performance-schema-status-variables.html#statvar_Performance_schema_table_instances_lost)

  Quantas instâncias de instrumentos de tabela não puderam ser criadas.

* [`Performance_schema_table_lock_stat_lost`](performance-schema-status-variables.html#statvar_Performance_schema_table_lock_stat_lost)

  O número de tabelas para as quais as estatísticas de Lock foram perdidas. Isso pode ser diferente de zero se o valor de [`performance_schema_max_table_lock_stat`] for muito pequeno.

* [`Performance_schema_thread_classes_lost`](performance-schema-status-variables.html#statvar_Performance_schema_thread_classes_lost)

  Quantos instrumentos de Thread não puderam ser carregados.

* [`Performance_schema_thread_instances_lost`](performance-schema-status-variables.html#statvar_Performance_schema_thread_instances_lost)

  O número de instâncias de Thread que não puderam ser instrumentadas na tabela [`threads`]. Isso pode ser diferente de zero se o valor de [`performance_schema_max_thread_instances`] for muito pequeno.

* [`Performance_schema_users_lost`](performance-schema-status-variables.html#statvar_Performance_schema_users_lost)

  O número de vezes que uma linha não pôde ser adicionada à tabela [`users`] porque estava cheia.