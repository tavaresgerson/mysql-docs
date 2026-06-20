## 24.5 Tabelas do Pool de Threads do Schema de Informação

As seções a seguir descrevem as tabelas `INFORMATION_SCHEMA` associadas ao plugin de pool de threads (consulte a Seção 5.5.3, “MySQL Enterprise Thread Pool”). Elas fornecem informações sobre a operação do pool de threads:

* `TP_THREAD_GROUP_STATE`: Informações sobre os estados do grupo de threads do pool de threads

* `TP_THREAD_GROUP_STATS`: Estatísticas do grupo de threads

* `TP_THREAD_STATE`: Informações sobre os estados dos threads do pool de threads

As strings nessas tabelas representam instantâneos no tempo. No caso do `TP_THREAD_STATE`, todas as strings de um grupo de threads compreendem um instantâneo no tempo. Assim, o servidor MySQL mantém o mutex do grupo de threads enquanto produz o instantâneo. Mas ele não mantém mutexes em todos os grupos de threads ao mesmo tempo, para evitar que uma declaração contra o `TP_THREAD_STATE` bloqueie todo o servidor MySQL.

As tabelas do pool de threads `INFORMATION_SCHEMA` são implementadas por plugins individuais e a decisão de carregar uma delas pode ser feita independentemente das outras (consulte a Seção 5.5.3.2, “Instalação do Pool de Threads”). No entanto, o conteúdo de todas as tabelas depende do plugin do pool de threads estar habilitado. Se um plugin de tabela estiver habilitado, mas o plugin do pool de threads não estiver, a tabela se torna visível e pode ser acessada, mas está vazia.

### 24.5.1 Informações do esquema de tópicos Referência à tabela Thread Pool

A tabela a seguir resume as tabelas de pool de threads `INFORMATION_SCHEMA`. Para mais detalhes, consulte as descrições das tabelas individuais.

**Tabela 24.7 Tabelas do Pool de Fuso de Informação**

<table frame="box" rules="all" summary="A reference that lists INFORMATION_SCHEMA thread pool tables."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Table Name</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>TP_THREAD_GROUP_STATE</code></td> <td>Estados do grupo de threads do pool de threads</td> </tr><tr><td><code>TP_THREAD_GROUP_STATS</code></td> <td>Estatísticas do grupo de threads do pool de threads</td> </tr><tr><td><code>TP_THREAD_STATE</code></td> <td>Informações sobre o thread do pool de threads</td> </tr></tbody></table>

### 24.5.2 A tabela INFORMATION\_SCHEMA TP\_THREAD\_GROUP\_STATE

A tabela `TP_THREAD_GROUP_STATE` tem uma string por grupo de thread no pool de threads. Cada string fornece informações sobre o estado atual de um grupo.

A tabela `TP_THREAD_GROUP_STATE` tem essas colunas:

* `TP_GROUP_ID`

O ID do grupo de threads. É uma chave única dentro da tabela.

* `CONSUMER THREADS`

O número de threads de consumo. Há, no máximo, uma thread pronta para começar a executar se as threads ativas ficarem paradas ou bloqueadas.

* `RESERVE_THREADS`

O número de threads no estado reservado. Isso significa que elas não são iniciadas até que haja a necessidade de despertar um novo thread e não haja um thread consumidor. É onde a maioria das threads acaba quando o grupo de threads criou mais threads do que o necessário para o funcionamento normal. Muitas vezes, um grupo de threads precisa de threads adicionais por um curto período e, em seguida, não as precisa novamente por um tempo. Neste caso, elas entram no estado reservado e permanecem até serem necessárias novamente. Elas ocupam alguns recursos de memória extras, mas não recursos de computação extras.

* `CONNECT_THREAD_COUNT`

O número de threads que estão processando ou aguardando para processar a inicialização e autenticação da conexão. Pode haver um máximo de quatro threads de conexão por grupo de threads; essas threads expiram após um período de inatividade.

Esta coluna foi adicionada no MySQL 5.7.18.

* `CONNECTION_COUNT`

O número de conexões que utilizam este grupo de threads.

* `QUEUED_QUERIES`

O número de declarações que estão na fila de alta prioridade.

* `QUEUED_TRANSACTIONS`

O número de declarações esperando na fila de baixa prioridade. Estas são as declarações iniciais para transações que não foram iniciadas, portanto, elas também representam transações em fila.

* `STALL_LIMIT`

O valor da variável de sistema `thread_pool_stall_limit` para o grupo de threads. Este é o mesmo valor para todos os grupos de threads.

* `PRIO_KICKUP_TIMER`

O valor da variável de sistema `thread_pool_prio_kickup_timer` para o grupo de threads. Este é o mesmo valor para todos os grupos de threads.

* `ALGORITHM`

O valor da variável de sistema `thread_pool_algorithm` para o grupo de threads. Este é o mesmo valor para todos os grupos de threads.

* `THREAD_COUNT`

O número de threads iniciadas na fila de threads como parte deste grupo de threads.

* `ACTIVE_THREAD_COUNT`

O número de threads ativas para executar instruções.

* `STALLED_THREAD_COUNT`

O número de declarações paralisadas no grupo de threads. Uma declaração paralisada pode estar sendo executada, mas, do ponto de vista de um pool de threads, está paralisada e não está progredindo. Uma declaração de longa duração acaba rapidamente nesta categoria.

* `WAITING_THREAD_NUMBER`

Se houver um thread que lida com a verificação de declarações no grupo de threads, isso especifica o número do thread dentro deste grupo de threads. É possível que este thread possa estar executando uma declaração.

* `OLDEST_QUEUED`

Quanto tempo, em milissegundos, a declaração mais antiga na fila de espera está esperando para ser executada.

* `MAX_THREAD_IDS_IN_GROUP`

O ID máximo do thread dos threads do grupo. Isso é o mesmo que `MAX(TP_THREAD_NUMBER)` para os threads quando selecionados da tabela `TP_THREAD_STATE`. Ou seja, essas duas consultas são equivalentes:

  ```sql
  SELECT TP_GROUP_ID, MAX_THREAD_IDS_IN_GROUP
  FROM TP_THREAD_GROUP_STATE;

  SELECT TP_GROUP_ID, MAX(TP_THREAD_NUMBER)
  FROM TP_THREAD_STATE GROUP BY TP_GROUP_ID;
  ```

### 24.5.3 A tabela INFORMATION\_SCHEMA TP\_THREAD\_GROUP\_STATS

A tabela `TP_THREAD_GROUP_STATS` reporta estatísticas por grupo de threads. Há uma string por grupo.

A tabela `TP_THREAD_GROUP_STATS` tem essas colunas:

* `TP_GROUP_ID`

O ID do grupo de threads. É uma chave única dentro da tabela.

* `CONNECTIONS_STARTED`

O número de conexões iniciadas.

* `CONNECTIONS_CLOSED`

Número de conexões fechadas.

* `QUERIES_EXECUTED`

O número de declarações executadas. Esse número é incrementado quando uma declaração começa a ser executada, não quando ela termina.

* `QUERIES_QUEUED`

O número de declarações recebidas que estavam em fila para execução. Isso não conta as declarações que o grupo de threads conseguiu começar a executar imediatamente sem colocar em fila, o que pode acontecer nas condições descritas na Seção 5.5.3.3, "Operação do Pool de Threads".

* `THREADS_STARTED`

Número de threads iniciadas.

* `PRIO_KICKUPS`

O número de declarações que foram movidas da fila de baixa prioridade para a fila de alta prioridade com base no valor da variável de sistema `thread_pool_prio_kickup_timer`. Se esse número aumentar rapidamente, considere aumentar o valor dessa variável. Um contador que aumenta rapidamente significa que o sistema de priorização não está impedindo que as transações comecem muito cedo. Para `InnoDB`, isso provavelmente significa um desempenho deteriorado devido ao número excessivo de transações concorrentes.

* `STALLED_QUERIES_EXECUTED`

O número de declarações que se tornaram definidas como travadas devido à execução por mais tempo do que o valor da variável do sistema `thread_pool_stall_limit`.

* `BECOME_CONSUMER_THREAD`

O número de vezes que o thread foi atribuído ao papel de thread consumidor.

* `BECOME_RESERVE_THREAD`

O número de vezes que os threads receberam o papel de thread de reserva.

* `BECOME_WAITING_THREAD`

O número de vezes em que os threads receberam o papel de servidor. Quando as instruções são colocadas em fila, isso acontece com frequência, mesmo em operação normal, então aumentos rápidos neste valor são normais no caso de um sistema altamente carregado, onde as instruções estão em fila.

* `WAKE_THREAD_STALL_CHECKER`

O número de vezes que o thread de verificação do ponto de venda decidiu acordar ou criar um thread para possivelmente lidar com algumas declarações ou cuidar do papel do thread do garçom.

* `SLEEP_WAITS`

O número de espera `THD_WAIT_SLEEP`. Esses ocorrem quando os threads entram em sono; por exemplo, ao chamar a função `SLEEP()`.

* `DISK_IO_WAITS`

O número de espera `THD_WAIT_DISKIO`. Esses ocorrem quando os threads realizam operações de E/S de disco que provavelmente não atingem o cache do sistema de arquivos. Tais espera ocorrem quando o pool de buffer lê e escreve dados no disco, e não para leituras normais de e escritas em arquivos.

* `ROW_LOCK_WAITS`

O número de espera `THD_WAIT_ROW_LOCK` para a liberação de um bloqueio de string por outra transação.

* `GLOBAL_LOCK_WAITS`

O número de espera `THD_WAIT_GLOBAL_LOCK` aguarda a liberação de um bloqueio global.

* `META_DATA_LOCK_WAITS`

O número de espera `THD_WAIT_META_DATA_LOCK` aguarda que um bloqueio de metadados seja liberado.

* `TABLE_LOCK_WAITS`

O número de espera `THD_WAIT_TABLE_LOCK` para que uma tabela seja desbloqueada que a declaração precisa acessar.

* `USER_LOCK_WAITS`

O número de espera `THD_WAIT_USER_LOCK` aguarda um bloqueio especial construído pelo thread de usuário.

* `BINLOG_WAITS`

O número de espera `THD_WAIT_BINLOG_WAITS` aguarda que o log binário se torne livre.

* `GROUP_COMMIT_WAITS`

O número de espera `THD_WAIT_GROUP_COMMIT`. Esses ocorrem quando um compromisso de grupo deve esperar que as outras partes completem sua parte de uma transação.

* `FSYNC_WAITS`

O número de espera `THD_WAIT_SYNC` para uma operação de sincronização de arquivos.

### 24.5.4 A tabela INFORMATION\_SCHEMA TP\_THREAD\_STATE

A tabela `TP_THREAD_STATE` tem uma string por thread criado pelo pool de threads para lidar com as conexões.

A tabela `TP_THREAD_STATE` tem essas colunas:

* `TP_GROUP_ID`

O ID do grupo de threads.

* `TP_THREAD_NUMBER`

O ID do thread dentro de seu grupo de threads. `TP_GROUP_ID` e `TP_THREAD_NUMBER` fornecem juntos uma chave única na tabela.

* `PROCESS_COUNT`

O intervalo de 10 ms no qual a declaração que utiliza este thread está atualmente sendo executada. 0 significa que nenhuma declaração está sendo executada, 1 significa que está nos primeiros 10 ms, e assim por diante.

* `WAIT_TYPE`

O tipo de espera do thread. `NULL` significa que o thread não está bloqueado. Caso contrário, o thread está bloqueado por uma chamada para `thd_wait_begin()` e o valor especifica o tipo de espera. As colunas `xxx_WAIT` da tabela `TP_THREAD_GROUP_STATS` acumulam contagens para cada tipo de espera.

O valor `WAIT_TYPE` é uma string que descreve o tipo de espera, conforme mostrado na tabela a seguir.

**Tabela 24.8 Tabela TP\_THREAD\_STATE Valores WAIT\_TYPE**

  <table summary="TP_THREAD_STATE table WAIT_TYPE values. The first column is the wait type. The second column describes the wait type."><col style="width: 35%"/><col style="width: 65%"/><thead><tr> <th>Wait Type</th> <th>Significado</th> </tr></thead><tbody><tr> <td><code>THD_WAIT_SLEEP</code></td> <td>Esperando dormir</td> </tr><tr> <td><code>THD_WAIT_DISKIO</code></td> <td>Esperando por IO de disco</td> </tr><tr> <td><code>THD_WAIT_ROW_LOCK</code></td> <td>Esperando por bloqueio de string</td> </tr><tr> <td><code>THD_WAIT_GLOBAL_LOCK</code></td> <td>Esperando por bloqueio global</td> </tr><tr> <td><code>THD_WAIT_META_DATA_LOCK</code></td> <td>Esperando por bloqueio de metadados</td> </tr><tr> <td><code>THD_WAIT_TABLE_LOCK</code></td> <td>Esperando por bloqueio de mesa</td> </tr><tr> <td><code>THD_WAIT_USER_LOCK</code></td> <td>Esperando bloqueio do usuário</td> </tr><tr> <td><code>THD_WAIT_BINLOG</code></td> <td>Esperando binlog</td> </tr><tr> <td><code>THD_WAIT_GROUP_COMMIT</code></td> <td>Esperando pelo commit do grupo</td> </tr><tr> <td><code>THD_WAIT_SYNC</code></td> <td>Esperando por fsync</td> </tr></tbody></table>
