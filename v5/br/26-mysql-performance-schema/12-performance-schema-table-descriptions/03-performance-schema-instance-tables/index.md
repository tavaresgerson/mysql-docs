### 25.12.3 Tabelas de Instâncias do Performance Schema

[25.12.3.1 A Tabela cond_instances](performance-schema-cond-instances-table.html)

[25.12.3.2 A Tabela file_instances](performance-schema-file-instances-table.html)

[25.12.3.3 A Tabela mutex_instances](performance-schema-mutex-instances-table.html)

[25.12.3.4 A Tabela rwlock_instances](performance-schema-rwlock-instances-table.html)

[25.12.3.5 A Tabela socket_instances](performance-schema-socket-instances-table.html)

Tabelas de instâncias documentam quais tipos de objetos são instrumentados. Elas fornecem nomes de eventos e notas explicativas ou informações de status:

* [`cond_instances`](performance-schema-cond-instances-table.html "25.12.3.1 A Tabela cond_instances"): Instâncias de objeto de sincronização Condition

* [`file_instances`](performance-schema-file-instances-table.html "25.12.3.2 A Tabela file_instances"): Instâncias de arquivo
* [`mutex_instances`](performance-schema-mutex-instances-table.html "25.12.3.3 A Tabela mutex_instances"): Instâncias de objeto de sincronização Mutex

* [`rwlock_instances`](performance-schema-rwlock-instances-table.html "25.12.3.4 A Tabela rwlock_instances"): Instâncias de objeto de sincronização Lock

* [`socket_instances`](performance-schema-socket-instances-table.html "25.12.3.5 A Tabela socket_instances"): Instâncias de conexão ativas

Estas tabelas listam objetos de sincronização, arquivos e conexões instrumentados. Existem três tipos de objetos de sincronização: `cond`, `mutex` e `rwlock`. Cada tabela de instância possui uma coluna `EVENT_NAME` ou `NAME` para indicar o instrumento associado a cada linha. Os nomes dos instrumentos podem ter múltiplas partes e formar uma hierarquia, conforme discutido na [Seção 25.6, “Convenções de Nomenclatura de Instrumentos do Performance Schema”](performance-schema-instrument-naming.html "25.6 Convenções de Nomenclatura de Instrumentos do Performance Schema").

As colunas `mutex_instances.LOCKED_BY_THREAD_ID` e `rwlock_instances.WRITE_LOCKED_BY_THREAD_ID` são extremamente importantes para investigar *bottlenecks* de performance ou *deadlocks*. Para exemplos de como usá-las para essa finalidade, consulte a [Seção 25.19, “Usando o Performance Schema para Diagnosticar Problemas”](performance-schema-examples.html "25.19 Usando o Performance Schema para Diagnosticar Problemas")