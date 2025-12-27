#### 19.4.10.2 Configurando a Replicação Semisincronizada

Ao instalar os plugins de fonte e replica para a replicação semisincronizada (consulte a Seção 19.4.10.1, “Instalando a Replicação Semisincronizada”), as variáveis de sistema tornam-se disponíveis para controlar o comportamento do plugin.

Para verificar os valores atuais das variáveis de status para a replicação semisincronizada, use `SHOW VARIABLES`:

```
mysql> SHOW VARIABLES LIKE 'rpl_semi_sync%';
```

Todas as variáveis de sistema `rpl_semi_sync_xxx` são descritas na Seção 19.1.6.2, “Opções e Variáveis de Fonte de Replicação” e na Seção 19.1.6.3, “Opções e Variáveis de Servidor de Replicação”. Algumas variáveis de sistema importantes são:

`rpl_semi_sync_source_enabled` :   Controla se a replicação semisincronizada está habilitada no servidor de fonte. Para habilitar ou desabilitar o plugin, defina essa variável para 1 ou 0, respectivamente. O valor padrão é 0 (desativado).

`rpl_semi_sync_replica_enabled` :   Controla se a replicação semisincronizada está habilitada no servidor de replica.

`rpl_semi_sync_source_timeout` :   Um valor em milissegundos que controla quanto tempo o servidor de fonte espera por um commit para um reconhecimento da replica antes de expirar e reverter para replicação assíncrona. O valor padrão é 10000 (10 segundos).

`rpl_semi_sync_source_wait_for_replica_count` :   Controla o número de reconhecimentos de replica que o servidor de fonte deve receber por transação antes de retornar à sessão. O valor padrão é 1, o que significa que o servidor de fonte só espera um replica para reconhecer a recepção dos eventos da transação.

A variável de sistema `rpl_semi_sync_source_wait_point` controla o ponto em que um servidor de fonte semisincronizado espera pelo reconhecimento da replica da recepção da transação antes de retornar um status ao cliente que comprometer a transação. Esses valores são permitidos:

* `AFTER_SYNC` (o padrão): A fonte escreve cada transação em seu log binário e na replica, e sincroniza o log binário com o disco. A fonte aguarda o reconhecimento da replica da recepção da transação após a sincronização. Ao receber o reconhecimento, a fonte confirma a transação no motor de armazenamento e retorna um resultado ao cliente, que então pode prosseguir.

* `AFTER_COMMIT`: A fonte escreve cada transação em seu log binário e na replica, sincroniza o log binário e confirma a transação no motor de armazenamento. A fonte aguarda o reconhecimento da replica da recepção da transação após o commit. Ao receber o reconhecimento, a fonte retorna um resultado ao cliente, que então pode prosseguir.

As características de replicação dessas configurações diferem da seguinte forma:

* Com `AFTER_SYNC`, todos os clientes veem a transação confirmada ao mesmo tempo, o que ocorre após ela ter sido reconhecida pela replica e confirmada no motor de armazenamento na fonte. Assim, todos os clientes veem os mesmos dados na fonte.

Em caso de falha da fonte, todas as transações confirmadas na fonte foram replicadas para a replica (salvadas em seu log de retransmissão). Uma saída inesperada da fonte e a transição para a replica são sem perdas, pois a replica está atualizada. Como mencionado acima, a fonte não deve ser reutilizada após a transição.

* Com `AFTER_COMMIT`, o cliente que emite a transação recebe o status de retorno apenas após o servidor confirmar no motor de armazenamento e receber o reconhecimento da replica. Após o commit e antes do reconhecimento da replica, outros clientes podem ver a transação confirmada antes do cliente que está cometendo o commit.

Se algo der errado de modo que a réplica não processe a transação, então, em caso de uma saída inesperada da fonte e failover para a réplica, é possível que esses clientes percam dados em relação ao que viram na fonte.

Você pode melhorar o desempenho da replicação semiesincronizada ao habilitar as variáveis de sistema `replication_sender_observe_commit_only`, que limita os callbacks, e `replication_optimize_for_static_plugin_config`, que adiciona blocos compartilhados e evita aquisições de bloqueios desnecessárias. Esses ajustes ajudam à medida que o número de réplicas aumenta, porque a concorrência por bloqueios pode desacelerar o desempenho. Os servidores de fontes de replicação semiesincronizada também podem obter benefícios de desempenho ao habilitar essas variáveis de sistema, porque eles usam os mesmos mecanismos de bloqueio que as réplicas.