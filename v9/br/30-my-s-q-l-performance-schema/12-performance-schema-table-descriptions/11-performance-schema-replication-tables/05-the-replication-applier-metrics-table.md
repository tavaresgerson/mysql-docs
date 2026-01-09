#### 29.12.11.5 A tabela `replication_applier_metrics`

Esta tabela fornece estatísticas do aplicador de replicação, como tempos de espera, contagem de espera, contagem de transações, contagem de eventos e contagem de bytes para o coordenador do aplicador.

Observação

Esta tabela requer a instalação do componente `replication_applier_metrics`, que está disponível apenas na Edição Empresarial do MySQL. Consulte a Seção 7.5.6.1, “Componente de Metas do Aplicador de Replicação”, para obter mais informações.

A tabela `replication_applier_metrics` tem as seguintes colunas:

* `CHANNEL_NAME`

  O canal de replicação. Consulte a Seção 19.2.2, “Canais de Replicação”.

* `TOTAL_ACTIVE_TIME_DURATION`

  O tempo total ativo do coordenador desde que as medições foram reiniciadas. Se o aplicador for parado e reiniciado, todos os períodos ativos são somados.

  Esta informação é redefinida quando o servidor replicador é reiniciado. Não é redefinida quando o aplicador para.

* `LAST_APPLIER_START`

  A última vez (desde o início do servidor) que o aplicador do canal foi iniciado. Este valor é redefinido cada vez que o aplicador do canal nomeado na coluna `CHANNEL_NAME` é iniciado (ou reiniciado).

* `TRANSACTIONS_COMMITTED_COUNT`

  O número de transações comprometidas desde a última vez que as métricas foram redefinidas.

  Esta informação é redefinida quando a replicação é reiniciada ou quando o usuário emite `RESET REPLICA`. Não é redefinida quando o aplicador para.

* `TRANSACTIONS_ONGOING_COUNT`

  O número de transações em andamento. Uma transação é marcada como em andamento quando seu primeiro evento é agendado em um trabalhador; esse contador diminui quando a transação é comprometida.

* `TRANSACTIONS_PENDING_COUNT`

O número de transações pendentes à espera de aplicação. Uma transação é considerada pendente quando está em fila no log de retransmissão e não é mais considerada pendente quando é confirmada. Esse número inclui quaisquer transações em andamento.

Quando o servidor é reiniciado com logs de retransmissão existentes, o número de transações pendentes só é conhecido após todos os logs de retransmissão antigos terem sido consumidos. Até que isso ocorra, o valor exibido nesta coluna é `NULL`.

* `TRANSACTIONS_COMMITTED_SIZE_BYTES_SUM`

  O tamanho total, em bytes, de todas as transações confirmadas desde a última vez que as métricas foram redefinidas.

  Essa informação é redefinida quando a replica é reiniciada ou quando o usuário emite `RESET REPLICA`. Não é redefinida quando o aplicador para.

* `TRANSACTIONS_ONGOING_FULL_SIZE_BYTES_SUM`

  O tamanho total (em bytes) de todas as transações atualmente sendo executadas pelos trabalhadores. Esse valor aumenta para o primeiro evento GTID ou (para transações compactadas) o primeiro evento de payload de transação agendado para cada transação e diminui quando uma transação é confirmada.

* `TRANSACTIONS_ONGOING_PROGRESS_SIZE_BYTES_SUM`

  O tamanho (em bytes) das partes das transações que já foram executadas para transações em andamento. Esse valor aumenta à medida que os eventos são processados para cada transação e diminui sempre que uma transação é confirmada.

* `TRANSACTIONS_PENDING_SIZE_BYTES_SUM`

  O tamanho, em bytes, de todas as transações à espera de execução. Esse valor aumenta quando um evento GTID ou (para transações compactadas) o primeiro evento de payload de transação é enfileirado no log de retransmissão e diminui sempre que uma transação é confirmada.

Uma transação é considerada pendente quando está em fila no log de retransmissão e não é mais considerada pendente quando é confirmada. Esse número inclui quaisquer transações em andamento.

Quando o servidor é reiniciado com logs de retransmissão existentes, o número de transações pendentes só é conhecido após todos os logs de retransmissão antigos terem sido consumidos. Até que isso ocorra, o valor exibido nesta coluna é `NULL`.

* `EVENTS_COMMITTED_COUNT`

  O número de eventos confirmados desde a última vez que as métricas foram redefinidas. Para transações compactadas, isso conta eventos embutidos, mas não eventos de carga útil.

  Essa informação é redefinida quando a replica é reiniciada ou o usuário emite `RESET REPLICA`. Não é redefinida quando o aplicável para de funcionar.

* `WAITS_FOR_WORK_FROM_SOURCE_COUNT`

  O número de vezes que o servidor esperou por trabalho do provedor, ou seja, esperando que o log de retransmissão crescesse, desde a última vez que as métricas foram redefinidas. É possível que esse contador aumente quando não há trabalho a ser feito; o coordenador executa uma série contínua de ciclos de espera.

  Essa informação é redefinida quando a replica é reiniciada ou o usuário emite `RESET REPLICA`. Não é redefinida quando o aplicável para de funcionar.

* `WAITS_FOR_WORK_FROM_SOURCE_SUM_TIME`

  O tempo gasto esperando por trabalho do provedor, ou seja, esperando que o log de retransmissão crescesse desde a última vez que as métricas foram redefinidas.

  Essa informação é redefinida quando a replica é reiniciada ou o usuário emite `RESET REPLICA`. Não é redefinida quando o aplicável para de funcionar.

* `WAITS_FOR_AVAILABLE_WORKER_COUNT`

  O número de vezes que o coordenador esperou enquanto agendava uma transação até que um trabalhador se tornasse disponível.

Essas informações são redefinidas quando a replica é reiniciada ou quando o usuário emite `RESET REPLICA`. Elas não são redefinidas quando o aplicador para.

* `WAITS_FOR_AVAILABLE_WORKER_SUM_TIME`

  O tempo agregado em nanosegundos que o coordenador esperou enquanto agendava uma transação até que um trabalhador se tornasse disponível.

  Essas informações são redefinidas quando a replica é reiniciada ou quando o usuário emite `RESET REPLICA`. Elas não são redefinidas quando o aplicador para.

* `WAITS_COMMIT_SCHEDULE_DEPENDENCY_COUNT`

  O número de vezes que o coordenador esperou por uma transação dependente anterior se comprometer.

  Essas informações são redefinidas quando a replica é reiniciada ou quando o usuário emite `RESET REPLICA`. Elas não são redefinidas quando o aplicador para.

* `WAITS_COMMIT_SCHEDULE_DEPENDENCY_SUM_TIME`

  O tempo agregado que o coordenador esperou por uma transação dependente anterior se comprometer.

  Essas informações são redefinidas quando a replica é reiniciada ou quando o canal na replica é excluído. Elas não são redefinidas quando o aplicador para.

* `WAITS_FOR_WORKER_QUEUE_MEMORY_COUNT`

  O número de vezes que o coordenador esperou enquanto agendava um trabalhador para processar um evento até que o trabalhador reduziu o tamanho de sua fila para menos de `replica_pending_jobs_size_max` bytes.

  Essas informações são redefinidas quando a replica é reiniciada ou quando o canal na replica é excluído. Elas não são redefinidas quando o aplicador para.

* `WAITS_FOR_WORKER_QUEUE_MEMORY_SUM_TIME`

  O tempo agregado que o coordenador esperou para agendar um trabalhador para processar um evento até que o trabalhador reduziu o tamanho de sua fila para menos de `replica_pending_jobs_size_max` bytes.

  Essas informações são redefinidas quando a replica é reiniciada ou quando o canal na replica é excluído. Elas não são redefinidas quando o aplicador para.

* `WAITS_WORKER_QUEUES_FULL_COUNT`

  O número de vezes que o coordenador esperou porque não havia vagas vazias para adicionar mais tarefas à fila de trabalho.

  Essa informação é redefinida quando a replica é reiniciada ou o canal na replica é excluído. Não é redefinida quando o aplicável para de funcionar.

* `WAITS_WORKER_QUEUES_FULL_SUM_TIME`

  O tempo agregado que o coordenador esperou porque não havia vagas vazias para adicionar mais tarefas à fila de trabalho.

  Essa informação é redefinida quando a replica é reiniciada ou o canal na replica é excluído. Não é redefinida quando o aplicável para de funcionar.

* `WAITS_DUE_TO_COMMIT_ORDER_COUNT`

  O número de vezes que os trabalhadores esperaram por transações anteriores serem confirmadas antes de poderem confirmar suas próprias transações.

  Essa informação é redefinida quando a replica é reiniciada ou o canal na replica é excluído. Não é redefinida quando o aplicável para de funcionar.

* `WAITS_DUE_TO_COMMIT_ORDER_SUM_TIME`

  O tempo em nanosegundos que os trabalhadores esperaram por transações anteriores serem confirmadas antes de poderem confirmar suas próprias transações.

  Essa informação é redefinida quando a replica é reiniciada ou o canal na replica é excluído. Não é redefinida quando o aplicável para de funcionar.

* `TIME_TO_READ_FROM_RELAY_LOG_SUM_TIME`

  O tempo cumulativo gasto pelo coordenador lendo eventos do log do relé desde que as métricas foram redefinidas.

  Essa informação é redefinida quando a replica é reiniciada ou o canal na replica é excluído. Não é redefinida quando o aplicável para de funcionar.