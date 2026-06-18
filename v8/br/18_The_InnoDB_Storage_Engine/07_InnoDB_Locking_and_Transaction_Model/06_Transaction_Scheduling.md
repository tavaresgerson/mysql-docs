### 17.7.6 Agendamento de transações

O `InnoDB` utiliza o algoritmo de agendamento de transações conscientes de contenção (CATS) para priorizar as transações que estão aguardando por bloqueios. Quando várias transações estão aguardando por um bloqueio no mesmo objeto, o algoritmo CATS determina qual transação receberá o bloqueio primeiro.

O algoritmo CATS prioriza as transações em espera atribuindo um peso de agendamento, que é calculado com base no número de transações que um bloco de transações bloqueia. Por exemplo, se duas transações estão esperando por um bloqueio no mesmo objeto, a transação que bloqueia mais transações recebe um peso de agendamento maior. Se os pesos forem iguais, a prioridade é dada à transação que está esperando por mais tempo.

Nota

Antes do MySQL 8.0.20, `InnoDB` também usa um algoritmo de Primeiro A Adicionado Primeiro (FIFO) para agendar transações, e o algoritmo CATS é usado apenas em situações de alta concorrência por bloqueios. As melhorias no algoritmo CATS no MySQL 8.0.20 tornaram o algoritmo FIFO redundante, permitindo sua remoção. A agendamento de transações anteriormente realizado pelo algoritmo FIFO é realizado pelo algoritmo CATS a partir do MySQL 8.0.20. Em alguns casos, essa mudança pode afetar a ordem em que as transações recebem bloqueios.

Você pode visualizar os pesos de agendamento de transações consultando a coluna `TRX_SCHEDULE_WEIGHT` na tabela Schema de Informações `INNODB_TRX`. Os pesos são calculados apenas para transações em espera. As transações em espera são aquelas em um estado de execução de transação `LOCK WAIT`, conforme relatado pela coluna `TRX_STATE`. Uma transação que não está esperando por um bloqueio reporta um valor NULL `TRX_SCHEDULE_WEIGHT`.

Contôres `INNODB_METRICS` são fornecidos para monitorar eventos de agendamento de transações em nível de código. Para obter informações sobre o uso dos contôres `INNODB_METRICS`, consulte a Seção 17.15.6, “Tabela de métricas do esquema de informações InnoDB”.

- `lock_rec_release_attempts`

  O número de tentativas para liberar bloqueios de registro. Uma única tentativa pode resultar no lançamento de zero ou mais bloqueios de registro, pois pode haver zero ou mais bloqueios de registro em uma única estrutura.

- `lock_rec_grant_attempts`

  O número de tentativas para conceder bloqueios de registro. Uma única tentativa pode resultar em zero ou mais registros sendo concedidos.

- `lock_schedule_refreshes`

  O número de vezes que o gráfico de espera foi analisado para atualizar os pesos das transações agendadas.
