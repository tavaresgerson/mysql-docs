## 25.17 O Modelo de Memory-Allocation do Performance Schema

O Performance Schema usa este modelo de alocação de memória (*memory allocation*):

* Pode alocar memória na inicialização do server (*server startup*)
* Pode alocar memória adicional durante a operação do server
* Nunca libera memória durante a operação do server (embora possa ser reciclada)
* Libera toda a memória usada no encerramento (*shutdown*)

O resultado é flexibilizar as restrições de memória (*memory constraints*) para que o Performance Schema possa ser usado com menos configuração, e diminuir o *memory footprint* (uso de memória) para que o consumo escale de acordo com a carga do server (*server load*). A memória usada depende da carga realmente observada, e não da carga estimada ou configurada explicitamente.

Vários parâmetros de dimensionamento (*sizing parameters*) do Performance Schema são *autoscaled* (dimensionados automaticamente) e não precisam ser configurados explicitamente, a menos que você queira estabelecer um limite explícito para a *memory allocation* (alocação de memória):

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

Para um parâmetro *autoscaled*, a configuração funciona da seguinte forma:

* Com o valor definido como -1 (o default), o parâmetro é *autoscaled*:

  + O *buffer* interno correspondente fica vazio inicialmente e nenhuma memória é alocada.

  + À medida que o Performance Schema coleta dados, a memória é alocada no *buffer* correspondente. O tamanho do *buffer* é ilimitado (*unbounded*) e pode crescer com a carga.

* Com o valor definido como 0:

  + O *buffer* interno correspondente fica vazio inicialmente e nenhuma memória é alocada.

* Com o valor definido como *`N`* > 0:

  + O *buffer* interno correspondente fica vazio inicialmente e nenhuma memória é alocada.

  + À medida que o Performance Schema coleta dados, a memória é alocada no *buffer* correspondente, até que o tamanho do *buffer* atinja *`N`*.

  + Uma vez que o tamanho do *buffer* atinja *`N`*, nenhuma outra memória é alocada. Os dados coletados pelo Performance Schema para este *buffer* são perdidos, e quaisquer contadores de "instância perdida" (*lost instance*) correspondentes são incrementados.

Para ver quanta memória o Performance Schema está usando, verifique os *instruments* (instrumentos) projetados para esse fim. O Performance Schema aloca memória internamente e associa cada *buffer* a um *instrument* dedicado para que o consumo de memória possa ser rastreado até *buffers* individuais. Os *instruments* nomeados com o prefixo `memory/performance_schema/` exibem quanta memória é alocada para esses *buffers* internos. Os *buffers* são globais ao server, portanto, os *instruments* são exibidos apenas na tabela [`memory_summary_global_by_event_name`](performance-schema-memory-summary-tables.html "25.12.15.9 Memory Summary Tables"), e não em outras tabelas `memory_summary_by_xxx_by_event_name`.

Esta Query mostra as informações associadas aos *memory instruments*:

```sql
SELECT * FROM performance_schema.memory_summary_global_by_event_name
WHERE EVENT_NAME LIKE 'memory/performance_schema/%';
```