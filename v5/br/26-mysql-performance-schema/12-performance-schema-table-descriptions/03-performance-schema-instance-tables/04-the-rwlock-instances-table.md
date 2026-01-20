#### 25.12.3.4 A tabela rwlock_instances

A tabela `rwlock_instances` lista todas as instâncias de rwlock (bloqueio de leitura/escrita) vistas pelo Schema de Desempenho enquanto o servidor está em execução. Um `rwlock` é um mecanismo de sincronização usado no código para garantir que os threads em um determinado momento possam ter acesso a algum recurso comum seguindo certas regras. O recurso é dito estar "protegido" pelo `rwlock`. O acesso é compartilhado (muitos threads podem ter um bloqueio de leitura ao mesmo tempo), exclusivo (apenas um thread pode ter um bloqueio de escrita em um determinado momento) ou compartilhado-exclusivo (um thread pode ter um bloqueio de escrita enquanto permite leituras inconsistentes por outros threads). O acesso compartilhado-exclusivo é conhecido como `sxlock` e otimiza a concorrência e melhora a escalabilidade para cargas de trabalho de leitura/escrita.

Dependendo de quantos threads estão solicitando um bloqueio e da natureza dos bloqueios solicitados, o acesso pode ser concedido no modo compartilhado, no modo exclusivo, no modo compartilhado-exclusivo ou não ser concedido, aguardando que outros threads terminem primeiro.

A tabela `rwlock_instances` tem as seguintes colunas:

- `NOME`

  O nome do instrumento associado ao bloqueio.

- `OBJECT_INSTANCE_BEGIN`

  O endereço em memória da trava instrumentada.

- `WRITE_LOCKED_BY_THREAD_ID`

  Quando um thread atualmente tem um `rwlock` bloqueado no modo exclusivo (escrita), `WRITE_LOCKED_BY_THREAD_ID` é o `THREAD_ID` do thread que está bloqueando, caso contrário, é `NULL`.

- `READ_LOCKED_BY_COUNT`

  Quando um thread atualmente tem um `rwlock` bloqueado no modo compartilhado (leitura), `READ_LOCKED_BY_COUNT` é incrementado por

  1. Este é um contador apenas, então não pode ser usado diretamente para descobrir qual thread possui uma trava de leitura, mas pode ser usado para verificar se há uma disputa de leitura em um `rwlock` e ver quantos leitores estão atualmente ativos.

A operação `TRUNCATE TABLE` não é permitida para a tabela `rwlock_instances`.

Ao realizar consultas em ambas as tabelas a seguir, um aplicativo de monitoramento ou um DBA pode detectar alguns gargalos ou bloqueios entre os threads que envolvem bloqueios:

- `events_waits_current`, para ver por que uma thread está esperando por um `rwlock`

- `rwlock_instances`, para ver qual outro thread atualmente possui um `rwlock`

Há uma limitação: o `rwlock_instances` pode ser usado apenas para identificar o thread que está segurando um bloqueio de escrita, mas não os threads que estão segurando um bloqueio de leitura.
