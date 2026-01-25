### 24.5.3 A Tabela INFORMATION_SCHEMA TP_THREAD_GROUP_STATS

A tabela [`TP_THREAD_GROUP_STATS`](information-schema-tp-thread-group-stats-table.html "24.5.3 The INFORMATION_SCHEMA TP_THREAD_GROUP_STATS Table") reporta estatísticas por grupo de Thread. Há uma linha por grupo.

A tabela [`TP_THREAD_GROUP_STATS`](information-schema-tp-thread-group-stats-table.html "24.5.3 The INFORMATION_SCHEMA TP_THREAD_GROUP_STATS Table") possui estas colunas:

* `TP_GROUP_ID`

  O ID do grupo de Thread. Esta é uma chave única (unique key) dentro da tabela.

* `CONNECTIONS_STARTED`

  O número de conexões iniciadas.

* `CONNECTIONS_CLOSED`

  O número de conexões fechadas.

* `QUERIES_EXECUTED`

  O número de instruções (statements) executadas. Este número é incrementado quando uma instrução começa a ser executada, e não quando termina.

* `QUERIES_QUEUED`

  O número de instruções (statements) recebidas que foram enfileiradas (queued) para execução. Isso não conta as instruções que o grupo de Thread conseguiu iniciar a execução imediatamente sem enfileirar (queuing), o que pode ocorrer sob as condições descritas na [Section 5.5.3.3, “Thread Pool Operation”](thread-pool-operation.html "5.5.3.3 Thread Pool Operation").

* `THREADS_STARTED`

  O número de Threads iniciadas.

* `PRIO_KICKUPS`

  O número de instruções que foram movidas da fila de baixa prioridade para a fila de alta prioridade com base no valor da variável de sistema [`thread_pool_prio_kickup_timer`](server-system-variables.html#sysvar_thread_pool_prio_kickup_timer). Se este número aumentar rapidamente, considere aumentar o valor dessa variável. Um contador que aumenta rapidamente significa que o sistema de prioridade não está impedindo que as transações iniciem muito cedo. Para o [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"), isso provavelmente significa deterioração do desempenho devido a muitas transações concorrentes.

* `STALLED_QUERIES_EXECUTED`

  O número de instruções (statements) que foram definidas como *stalled* (paralisadas) por estarem executando por um tempo superior ao valor da variável de sistema [`thread_pool_stall_limit`](server-system-variables.html#sysvar_thread_pool_stall_limit).

* `BECOME_CONSUMER_THREAD`

  O número de vezes que as Threads foram designadas para o papel de *consumer thread*.

* `BECOME_RESERVE_THREAD`

  O número de vezes que as Threads foram designadas para o papel de *reserve thread*.

* `BECOME_WAITING_THREAD`

  O número de vezes que as Threads foram designadas para o papel de *waiter thread* (Thread de espera). Quando as instruções (statements) são enfileiradas (queued), isso acontece com muita frequência, mesmo em operação normal, portanto, aumentos rápidos neste valor são normais no caso de um sistema altamente carregado onde as instruções estão enfileiradas.

* `WAKE_THREAD_STALL_CHECKER`

  O número de vezes que a *stall check thread* decidiu "acordar" (wake) ou criar uma Thread para possivelmente lidar com algumas instruções (statements) ou assumir o papel de *waiter thread*.

* `SLEEP_WAITS`

  O número de esperas `THD_WAIT_SLEEP`. Elas ocorrem quando as Threads entram em suspensão (sleep); por exemplo, ao chamar a função [`SLEEP()`](miscellaneous-functions.html#function_sleep).

* `DISK_IO_WAITS`

  O número de esperas `THD_WAIT_DISKIO`. Elas ocorrem quando as Threads executam I/O de disco que provavelmente não atingirá o cache do sistema de arquivos. Tais esperas ocorrem quando o Buffer Pool lê e escreve dados no disco, e não para leituras e escritas normais em arquivos.

* `ROW_LOCK_WAITS`

  O número de esperas `THD_WAIT_ROW_LOCK` pela liberação de um Row Lock por outra transação.

* `GLOBAL_LOCK_WAITS`

  O número de esperas `THD_WAIT_GLOBAL_LOCK` pela liberação de um Global Lock.

* `META_DATA_LOCK_WAITS`

  O número de esperas `THD_WAIT_META_DATA_LOCK` pela liberação de um Metadata Lock.

* `TABLE_LOCK_WAITS`

  O número de esperas `THD_WAIT_TABLE_LOCK` por uma tabela a ser desbloqueada que a instrução precisa acessar.

* `USER_LOCK_WAITS`

  O número de esperas `THD_WAIT_USER_LOCK` por um Lock especial construído pela Thread do usuário.

* `BINLOG_WAITS`

  O número de esperas `THD_WAIT_BINLOG_WAITS` para que o binary log fique livre.

* `GROUP_COMMIT_WAITS`

  O número de esperas `THD_WAIT_GROUP_COMMIT`. Elas ocorrem quando um *group commit* deve esperar que as outras partes concluam sua porção de uma transação.

* `FSYNC_WAITS`

  O número de esperas `THD_WAIT_SYNC` por uma operação de sincronização de arquivo (*file sync*).