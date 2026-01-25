#### 25.12.3.4 A Tabela rwlock_instances

A tabela [`rwlock_instances`](performance-schema-rwlock-instances-table.html "25.12.3.4 The rwlock_instances Table") lista todas as instâncias de [rwlock](glossary.html#glos_rw_lock "rw-lock") (read write lock) vistas pelo Performance Schema enquanto o server está em execução. Um `rwlock` é um mecanismo de sincronização usado no código para garantir que os threads em um dado momento possam ter acesso a algum recurso comum seguindo certas regras. O recurso é dito ser "protegido" pelo `rwlock`. O acesso é compartilhado (shared) (muitos threads podem ter um read lock ao mesmo tempo), exclusivo (exclusive) (apenas um thread pode ter um write lock em um dado momento), ou compartilhado-exclusivo (shared-exclusive) (um thread pode ter um write lock enquanto permite reads inconsistentes por outros threads). O acesso compartilhado-exclusivo é também conhecido como `sxlock` e otimiza a concurrency e melhora a scalability para workloads de leitura e escrita (read-write).

Dependendo de quantos threads estão solicitando um lock, e da natureza dos locks solicitados, o acesso pode ser concedido no modo shared, modo exclusive, modo shared-exclusive ou não ser concedido, aguardando que outros threads terminem primeiro.

A tabela [`rwlock_instances`](performance-schema-rwlock-instances-table.html "25.12.3.4 The rwlock_instances Table") possui estas colunas:

* `NAME`

  O nome do instrument associado ao lock.

* `OBJECT_INSTANCE_BEGIN`

  O endereço na memória do lock instrumentado.

* `WRITE_LOCKED_BY_THREAD_ID`

  Quando um thread atualmente tem um `rwlock` bloqueado no modo exclusive (write), `WRITE_LOCKED_BY_THREAD_ID` é o `THREAD_ID` do thread que está bloqueando (locking thread); caso contrário, é `NULL`.

* `READ_LOCKED_BY_COUNT`

  Quando um thread atualmente tem um `rwlock` bloqueado no modo shared (read), `READ_LOCKED_BY_COUNT` é incrementado em 1. Este é apenas um contador, portanto, não pode ser usado diretamente para descobrir qual thread detém um read lock, mas pode ser usado para ver se há uma contenção de leitura (read contention) em um `rwlock` e quantos leitores estão ativos no momento.

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") não é permitido para a tabela [`rwlock_instances`](performance-schema-rwlock-instances-table.html "25.12.3.4 The rwlock_instances Table").

Ao executar Queries em ambas as tabelas a seguir, um aplicativo de monitoramento ou um DBA pode detectar gargalos (bottlenecks) ou deadlocks entre threads que envolvam locks:

* [`events_waits_current`](performance-schema-events-waits-current-table.html "25.12.4.1 The events_waits_current Table"), para ver por qual `rwlock` um thread está esperando

* [`rwlock_instances`](performance-schema-rwlock-instances-table.html "25.12.3.4 The rwlock_instances Table"), para ver qual outro thread atualmente possui um `rwlock`

Há uma limitação: A tabela [`rwlock_instances`](performance-schema-rwlock-instances-table.html "25.12.3.4 The rwlock_instances Table") pode ser usada apenas para identificar o thread que detém um write lock, mas não os threads que detêm um read lock.