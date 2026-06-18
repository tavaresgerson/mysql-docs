#### 29.12.16.2 Tabela tp\_thread\_group\_stats

Nota

A tabela Schema de Desempenho descrita aqui está disponível a partir do MySQL 8.0.14. Antes do MySQL 8.0.14, use a tabela correspondente `INFORMATION_SCHEMA`; veja a Seção 28.5.3, “A tabela INFORMATION\_SCHEMA TP\_THREAD\_GROUP\_STATS”.

A tabela `tp_thread_group_stats` relata estatísticas por grupo de threads. Há uma linha por grupo.

A tabela `tp_thread_group_stats` tem essas colunas:

- `TP_GROUP_ID`

  O ID do grupo de fios. Este é uma chave única dentro da tabela.

- `CONNECTIONS_STARTED`

  O número de conexões começou.

- `CONNECTIONS_CLOSED`

  Número de conexões fechadas.

- `QUERIES_EXECUTED`

  O número de declarações executadas. Esse número é incrementado quando uma declaração começa a ser executada, não quando ela termina.

- `QUERIES_QUEUED`

  O número de declarações recebidas que estavam em fila para execução. Isso não conta as declarações que o grupo de threads conseguiu começar a executar imediatamente sem colocar em fila, o que pode acontecer nas condições descritas na Seção 7.6.3.3, "Operação do Pool de Threads".

- `THREADS_STARTED`

  Número de threads iniciadas.

- `PRIO_KICKUPS`

  O número de declarações que foram movidas da fila de baixa prioridade para a fila de alta prioridade com base no valor da variável de sistema `thread_pool_prio_kickup_timer`. Se esse número aumentar rapidamente, considere aumentar o valor dessa variável. Um contador que aumenta rapidamente indica que o sistema de priorização não está impedindo que as transações comecem muito cedo. Para `InnoDB`, isso provavelmente significa um desempenho em declínio devido ao número excessivo de transações concorrentes.

- `STALLED_QUERIES_EXECUTED`

  O número de declarações que foram definidas como bloqueadas devido à execução por mais tempo do que o valor da variável de sistema `thread_pool_stall_limit`.

- `BECOME_CONSUMER_THREAD`

  O número de vezes que o fio foi atribuído ao papel de fio consumidor.

- `BECOME_RESERVE_THREAD`

  O número de vezes que os threads foram atribuídos ao papel de thread de reserva.

- `BECOME_WAITING_THREAD`

  O número de vezes que os threads receberam o papel de thread de servidor. Quando as instruções são colocadas em fila, isso acontece com muita frequência, mesmo em operação normal, então aumentos rápidos nesse valor são normais no caso de um sistema altamente carregado, onde as instruções estão em fila.

- `WAKE_THREAD_STALL_CHECKER`

  O número de vezes que o fio de verificação da barraca decidiu acordar ou criar um fio para possivelmente lidar com algumas declarações ou cuidar do papel do fio do garçom.

- `SLEEP_WAITS`

  O número de espera `THD_WAIT_SLEEP`. Estes ocorrem quando os threads entram em suspensão (por exemplo, ao chamar a função `SLEEP()`).

- `DISK_IO_WAITS`

  O número de espera `THD_WAIT_DISKIO`. Essas ocorrem quando os threads realizam operações de E/S de disco que provavelmente não atingem o cache do sistema de arquivos. Essas espera ocorrem quando o pool de buffers lê e escreve dados no disco, e não para leituras normais de e escritas em arquivos.

- `ROW_LOCK_WAITS`

  O número de `THD_WAIT_ROW_LOCK` aguarda a liberação de um bloqueio de linha por outra transação.

- `GLOBAL_LOCK_WAITS`

  O número de espera `THD_WAIT_GLOBAL_LOCK` por um bloqueio global para ser liberado.

- `META_DATA_LOCK_WAITS`

  O número de `THD_WAIT_META_DATA_LOCK` aguarda a liberação de um bloqueio de metadados.

- `TABLE_LOCK_WAITS`

  O número de `THD_WAIT_TABLE_LOCK` aguarda por uma tabela ser desbloqueada que a declaração precisa acessar.

- `USER_LOCK_WAITS`

  O número de `THD_WAIT_USER_LOCK` aguarda por um bloqueio especial construído pelo fio de usuário.

- `BINLOG_WAITS`

  O número de `THD_WAIT_BINLOG_WAITS` aguarda que o log binário fique livre.

- `GROUP_COMMIT_WAITS`

  O número de espera `THD_WAIT_GROUP_COMMIT`. Estes ocorrem quando um compromisso de grupo deve esperar que as outras partes completem sua parte de uma transação.

- `FSYNC_WAITS`

  O número de espera de `THD_WAIT_SYNC` por uma operação de sincronização de arquivos.

A tabela `tp_thread_group_stats` tem esses índices:

- Índice único em (`TP_GROUP_ID`)

`TRUNCATE TABLE` não é permitido para a tabela `tp_thread_group_stats`.
