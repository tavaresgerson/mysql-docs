## 25.17 Modelo de Alocação de Memória do Schema de Desempenho

O Schema de Desempenho utiliza este modelo de alocação de memória:

- Pode alocar memória na inicialização do servidor

- Pode alocar memória adicional durante a operação do servidor

- Nunca libere memória durante a operação do servidor (embora possa ser reciclada)

- Liberar toda a memória usada ao desligar

O resultado é relaxar as restrições de memória para que o Schema de Desempenho possa ser usado com menos configuração e diminuir a pegada de memória para que o consumo aumente com a carga do servidor. A memória usada depende da carga realmente observada, não da carga estimada ou explicitamente configurada.

Vários parâmetros de dimensionamento do Schema de Desempenho são escalonados automaticamente e não precisam ser configurados explicitamente, a menos que você queira estabelecer um limite explícito para a alocação de memória:

```sql
performance_schema_accounts_size
performance_schema_hosts_size
performance_schema_max_cond_instances
performance_schema_max_file_instances
performance_schema_max_index_stat
performance_schema_max_metadata_locks
performance_schema_max_mutex_instances
performance_schema_max_prepared_statements_instances
performance_schema_max_program_instances
performance_schema_max_rwlock_instances
performance_schema_max_socket_instances
performance_schema_max_table_handles
performance_schema_max_table_instances
performance_schema_max_table_lock_stat
performance_schema_max_thread_instances
performance_schema_users_size
```

Para um parâmetro autoescalonado, a configuração funciona da seguinte maneira:

- Com o valor definido como -1 (padrão), o parâmetro é escalado automaticamente:

  - O buffer interno correspondente está inicialmente vazio e nenhuma memória é alocada.

  - À medida que o Schema de Desempenho coleta dados, a memória é alocada no buffer correspondente. O tamanho do buffer é ilimitado e pode aumentar com a carga.

- Com o valor definido como 0:

  - O buffer interno correspondente está inicialmente vazio e nenhuma memória é alocada.

- Com o valor definido como *`N`* > 0:

  - O buffer interno correspondente está inicialmente vazio e nenhuma memória é alocada.

  - À medida que o Schema de Desempenho coleta dados, a memória é alocada no buffer correspondente, até que o tamanho do buffer atinja *`N`*.

  - Quando o tamanho do buffer atinge *`N`*, mais memória não é alocada. Os dados coletados pelo Schema de Desempenho para este buffer são perdidos e quaisquer contadores correspondentes de "instância perdida" são incrementados.

Para ver quanto memória o Schema de Desempenho está usando, verifique os instrumentos projetados para esse propósito. O Schema de Desempenho aloca memória internamente e associa cada buffer a um instrumento dedicado, para que o consumo de memória possa ser rastreado até os buffers individuais. Os instrumentos com o prefixo `memory/performance_schema/` mostram quanto memória está alocada para esses buffers internos. Os buffers são globais para o servidor, então os instrumentos são exibidos apenas na tabela `memory_summary_global_by_event_name`, e não em outras tabelas `memory_summary_by_xxx_by_event_name`.

Esta consulta mostra as informações associadas aos instrumentos de memória:

```sql
SELECT * FROM performance_schema.memory_summary_global_by_event_name
WHERE EVENT_NAME LIKE 'memory/performance_schema/%';
```
