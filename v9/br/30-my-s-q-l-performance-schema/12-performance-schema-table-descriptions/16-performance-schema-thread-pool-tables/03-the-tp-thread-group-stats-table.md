#### 29.12.16.3 A tabela `tp_thread_group_stats`

A tabela `tp_thread_group_stats` reporta estatísticas por grupo de threads. Há uma linha por grupo.

A tabela `tp_thread_group_stats` tem as seguintes colunas:

* `TP_GROUP_ID`

  O ID do grupo de threads. Este é uma chave única dentro da tabela.

* `CONNECTIONS_STARTED`

  O número de conexões iniciadas.

* `CONNECTIONS_CLOSED`

  O número de conexões fechadas.

* `QUERIES_EXECUTED`

  O número de instruções executadas. Este número é incrementado quando uma instrução começa a ser executada, não quando ela termina.

* `QUERIES_QUEUED`

  O número de instruções recebidas que foram colocadas em fila para execução. Este número não conta as instruções que o grupo de threads conseguiu começar a executar imediatamente sem colocar em fila, o que pode acontecer nas condições descritas na Seção 7.6.3.3, “Operação do Pool de Threads”.

* `THREADS_STARTED`

  O número de threads iniciados.

* `PRIO_KICKUPS`

  O número de instruções que foram movidas da fila de baixa prioridade para a fila de alta prioridade com base no valor da variável de sistema `thread_pool_prio_kickup_timer`. Se este número aumentar rapidamente, considere aumentar o valor dessa variável. Um contador que aumenta rapidamente significa que o sistema de prioridade não está impedindo que as transações comecem muito cedo. Para o `InnoDB`, isso provavelmente significa um desempenho deteriorado devido a muitas transações concorrentes.

* `STALLED_QUERIES_EXECUTED`

  O número de instruções que foram definidas como paradas devido à execução por mais tempo do que o valor da variável de sistema `thread_pool_stall_limit`.

* `BECOME_CONSUMER_THREAD`

  O número de vezes que os threads receberam o papel de thread consumidor.

* `BECOME_RESERVE_THREAD`

  O número de vezes que os threads receberam o papel de thread de reserva.

* `BECOME_WAITING_THREAD`

  O número de vezes que os threads receberam o papel de thread de atendente. Quando as instruções são colocadas em fila, isso acontece com frequência, mesmo em operação normal, então aumentos rápidos neste valor são normais no caso de um sistema altamente carregado onde as instruções estão em fila.

* `WAKE_THREAD_STALL_CHECKER`

  O número de vezes que o thread de verificador de travamento decidiu acordar ou criar um thread para possivelmente lidar com algumas instruções ou cuidar do papel do thread de atendente.

* `SLEEP_WAITS`

  O número de `THD_WAIT_SLEEP`. Estes ocorrem quando os threads entram em sono (por exemplo, ao chamar a função `SLEEP()`).

* `DISK_IO_WAITS`

  O número de `THD_WAIT_DISKIO`. Estes ocorrem quando os threads realizam operações de E/S de disco que provavelmente não atingem o cache do sistema de arquivos. Tais espera ocorre quando o pool de buffers lê e escreve dados no disco, e não para leituras normais de e escritas em arquivos.

* `ROW_LOCK_WAITS`

  O número de `THD_WAIT_ROW_LOCK` esperas para a liberação de um bloqueio de linha por outra transação.

* `GLOBAL_LOCK_WAITS`

  O número de `THD_WAIT_GLOBAL_LOCK` esperas para a liberação de um bloqueio global.

* `META_DATA_LOCK_WAITS`

  O número de `THD_WAIT_META_DATA_LOCK` esperas para a liberação de um bloqueio de metadados.

* `TABLE_LOCK_WAITS`

  O número de `THD_WAIT_TABLE_LOCK` esperas para que uma tabela seja desbloqueada que a instrução precisa acessar.

* `USER_LOCK_WAITS`

  O número de `THD_WAIT_USER_LOCK` esperas para um bloqueio especial construído pelo thread do usuário.

* `BINLOG_WAITS`

  O número de `THD_WAIT_BINLOG_WAITS` esperas para que o log binário fique livre.

* `GROUP_COMMIT_WAITS`

  O número de `THD_WAIT_GROUP_COMMIT` esperas. Estes ocorrem quando um compromisso de grupo deve esperar que as outras partes completem sua parte de uma transação.

* `FSYNC_WAITS`

O número de `THD_WAIT_SYNC` espera por uma operação de sincronização de arquivo.

A tabela `tp_thread_group_stats` tem esses índices:

* Índice único em (`TP_GROUP_ID`)

O `TRUNCATE TABLE` não é permitido para a tabela `tp_thread_group_stats`.