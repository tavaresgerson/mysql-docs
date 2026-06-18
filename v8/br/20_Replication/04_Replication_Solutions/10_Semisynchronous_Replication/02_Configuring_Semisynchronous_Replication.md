#### 19.4.10.2 Configurando a Replicação Semisincronizada

Quando você instala os plugins de fonte e replicação semiesincronizada (consulte a Seção 19.4.10.1, “Instalando Replicação Semiesincronizada”), as variáveis do sistema ficam disponíveis para controlar o comportamento do plugin.

Para verificar os valores atuais das variáveis de status para replicação semiesincronizada, use `SHOW VARIABLES`:

```
mysql> SHOW VARIABLES LIKE 'rpl_semi_sync%';
```

A partir do MySQL 8.0.26, novas versões dos plugins de fonte e replica são fornecidas, que substituem os termos “master” e “slave” por “fonte” e “replica” nas variáveis de sistema e variáveis de status. Se você instalar os novos plugins `rpl_semi_sync_source` e `rpl_semi_sync_replica`, as novas variáveis de sistema e variáveis de status estarão disponíveis, mas as antigas não. Se você instalar os antigos plugins `rpl_semi_sync_master` e `rpl_semi_sync_slave`, as antigas variáveis de sistema e variáveis de status estarão disponíveis, mas as novas não. Você não pode ter ambas as versões nova e antiga do plugin relevante instalado em uma instância.

Todas as variáveis de sistema `rpl_semi_sync_xxx` são descritas na Seção 19.1.6.2, “Opções e Variáveis de Fonte de Replicação” e na Seção 19.1.6.3, “Opções e Variáveis de Servidor de Replicação”. Algumas variáveis de sistema importantes são:

`rpl_semi_sync_source_enabled` ou `rpl_semi_sync_master_enabled` :   Controla se a replicação semisoincronizada está habilitada no servidor de origem. Para habilitar ou desabilitar o plugin, defina essa variável para 1 ou 0, respectivamente. O padrão é 0 (desativado).

`rpl_semi_sync_replica_enabled` ou `rpl_semi_sync_slave_enabled` :   Controla se a replicação semisoincronizada está habilitada na replica.

`rpl_semi_sync_source_timeout` ou `rpl_semi_sync_master_timeout` : Um valor em milissegundos que controla quanto tempo a fonte espera por um commit para receber um reconhecimento de uma réplica antes de expirar e reverter para replicação assíncrona. O valor padrão é 10000 (10 segundos).

`rpl_semi_sync_source_wait_for_replica_count` ou `rpl_semi_sync_master_wait_for_slave_count` :   Controla o número de confirmações de replicação que a fonte deve receber por transação antes de retornar à sessão. O padrão é 1, o que significa que a fonte só espera uma replica para confirmar a recepção dos eventos da transação.

A variável de sistema `rpl_semi_sync_source_wait_point` ou `rpl_semi_sync_master_wait_point` controla o ponto em que um servidor de origem semisoincronizado aguarda a confirmação da replicação da recepção da transação antes de retornar um status ao cliente que comprometeu a transação. Esses valores são permitidos:

- `AFTER_SYNC` (padrão): A fonte escreve cada transação no seu log binário e na replica, e sincroniza o log binário com o disco. A fonte aguarda a confirmação da replica sobre a recepção da transação após a sincronização. Ao receber a confirmação, a fonte confirma a transação no mecanismo de armazenamento e retorna um resultado ao cliente, que pode então prosseguir.

- `AFTER_COMMIT`: A fonte escreve cada transação no seu log binário e na replica, sincroniza o log binário e confirma a transação no motor de armazenamento. A fonte aguarda a confirmação da replica sobre a recepção da transação após o commit. Ao receber a confirmação, a fonte retorna um resultado ao cliente, que pode então prosseguir.

As características de replicação desses ajustes diferem da seguinte forma:

- Com `AFTER_SYNC`, todos os clientes veem a transação comprometida ao mesmo tempo, ou seja, após ela ter sido reconhecida pela replica e comprometida no motor de armazenamento na fonte. Assim, todos os clientes veem os mesmos dados na fonte.

  Em caso de falha na fonte, todas as transações realizadas na fonte foram replicadas para a replica (salvadas em seu log de retransmissão). Uma saída inesperada da fonte e a transição para a replica são irreversíveis porque a replica está atualizada. Como mencionado acima, a fonte não deve ser reutilizada após a transição.

- Com `AFTER_COMMIT`, o cliente que emite a transação recebe o status de retorno apenas após o servidor comprometer o mecanismo de armazenamento e receber o reconhecimento da replica. Após o compromisso e antes do reconhecimento da replica, outros clientes podem ver a transação comprometida antes do cliente que está comprometedor.

  Se algo der errado de modo que a réplica não processe a transação, então, em caso de uma saída inesperada da fonte e failover para a réplica, é possível que esses clientes percam dados em relação ao que viram na fonte.

A partir do MySQL 8.0.23, você pode melhorar o desempenho da replicação semi-sincronizada ao habilitar as variáveis de sistema `replication_sender_observe_commit_only`, que limita os callbacks, e `replication_optimize_for_static_plugin_config`, que adiciona bloqueios compartilhados e evita aquisições de bloqueios desnecessárias. Essas configurações ajudam à medida que o número de réplicas aumenta, pois a concorrência por bloqueios pode desacelerar o desempenho. Os servidores de origem da replicação semi-sincronizada também podem obter benefícios de desempenho ao habilitar essas variáveis de sistema, pois eles usam os mesmos mecanismos de bloqueio que as réplicas.
