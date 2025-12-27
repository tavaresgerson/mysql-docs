### 17.7.6 Agendamento de Transações

O `InnoDB` utiliza o algoritmo de Agendamento de Transações Atento à Concorrência (CATS) para priorizar as transações que estão aguardando por bloqueios. Quando várias transações estão aguardando por um bloqueio no mesmo objeto, o algoritmo CATS determina qual transação receberá o bloqueio primeiro.

O algoritmo CATS prioriza as transações em espera atribuindo um peso de agendamento, que é calculado com base no número de transações que uma transação bloqueia. Por exemplo, se duas transações estão aguardando por um bloqueio no mesmo objeto, a transação que bloqueia mais transações recebe um peso de agendamento maior. Se os pesos forem iguais, a prioridade é dada à transação que está em espera por mais tempo.

Você pode visualizar os pesos de agendamento de transações consultando a coluna `TRX_SCHEDULE_WEIGHT` na tabela `INNODB_TRX` do Schema de Informações `INNODB_METRICS`. Os pesos são calculados apenas para transações em espera. As transações em espera são aquelas em um estado de execução de transação `LOCK WAIT`, conforme relatado pela coluna `TRX_STATE`. Uma transação que não está aguardando por um bloqueio reporta um valor NULL para `TRX_SCHEDULE_WEIGHT`.

Os contadores `INNODB_METRICS` são fornecidos para monitorar eventos de agendamento de transações em nível de código. Para obter informações sobre o uso dos contadores `INNODB_METRICS`, consulte a Seção 17.15.6, “Tabela de Metricas do Schema de Informações InnoDB”.

* `lock_rec_release_attempts`

  O número de tentativas para liberar bloqueios de registro. Uma única tentativa pode resultar em zero ou mais bloqueios de registro sendo liberados, pois pode haver zero ou mais bloqueios de registro em uma única estrutura.

* `lock_rec_grant_attempts`

  O número de tentativas para conceder bloqueios de registro. Uma única tentativa pode resultar em zero ou mais bloqueios de registro sendo concedidos.

* `lock_schedule_refreshes`

O número de vezes que o gráfico de espera foi analisado para atualizar os pesos das transações agendadas.