#### 29.12.3.4 A tabela `rwlock_instances`

A tabela `rwlock_instances` lista todas as instâncias de `rwlock` (bloqueio de leitura/escrita) observadas pelo Schema de Desempenho enquanto o servidor está em execução. Um `rwlock` é um mecanismo de sincronização usado no código para garantir que os threads em um determinado momento possam ter acesso a um recurso comum seguindo certas regras. O recurso é dito estar “protegido” pelo `rwlock`. O acesso é compartilhado (muitos threads podem ter um bloqueio de leitura ao mesmo tempo), exclusivo (apenas um thread pode ter um bloqueio de escrita em um determinado momento) ou compartilhado-exclusivo (um thread pode ter um bloqueio de escrita enquanto permite leituras inconsistentes por outros threads). O acesso compartilhado-exclusivo é conhecido como `sxlock` e otimiza a concorrência e melhora a escalabilidade para cargas de trabalho de leitura/escrita.

Dependendo de quantos threads estão solicitando um bloqueio e da natureza dos bloqueamentos solicitados, o acesso pode ser concedido no modo compartilhado, exclusivo, compartilhado-exclusivo ou não concedido, aguardando que outros threads terminem primeiro.

A tabela `rwlock_instances` tem as seguintes colunas:

* `NAME`

  O nome do instrumento associado ao bloqueio.

* `OBJECT_INSTANCE_BEGIN`

  O endereço na memória do bloqueio instrumentado.

* `WRITE_LOCKED_BY_THREAD_ID`

  Quando um thread atualmente tem um `rwlock` bloqueado no modo exclusivo (escrita), `WRITE_LOCKED_BY_THREAD_ID` é o `THREAD_ID` do thread que está bloqueando, caso contrário, é `NULL`.

* `READ_LOCKED_BY_COUNT`

  Quando um thread atualmente tem um `rwlock` bloqueado no modo compartilhado (leitura), `READ_LOCKED_BY_COUNT` é incrementado em

  1. Esse é um contador apenas, então não pode ser usado diretamente para encontrar qual thread possui um bloqueio de leitura, mas pode ser usado para ver se há uma disputa de leitura em um `rwlock` e ver quantos leitores estão atualmente ativos.

A tabela `rwlock_instances` tem esses índices:

* Chave primária em (`OBJECT_INSTANCE_BEGIN`)
* Índice em (`NAME`)
* Índice em (`WRITE_LOCKED_BY_THREAD_ID`)

O `TRUNCATE TABLE` não é permitido para a tabela `rwlock_instances`.

Ao realizar consultas em ambas as tabelas a seguir, um aplicativo de monitoramento ou um DBA pode detectar alguns gargalos ou bloqueios entre os threads que envolvem travamentos:

* `events_waits_current`, para ver em que `rwlock` um thread está esperando

* `rwlock_instances`, para ver qual outro thread atualmente possui um `rwlock`

Há uma limitação: A `rwlock_instances` pode ser usada apenas para identificar o thread que está segurando um bloqueio de escrita, mas não os threads que estão segurando um bloqueio de leitura.