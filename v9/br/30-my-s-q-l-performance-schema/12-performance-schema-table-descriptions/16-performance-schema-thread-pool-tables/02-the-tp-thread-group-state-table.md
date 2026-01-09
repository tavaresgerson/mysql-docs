#### 29.12.16.2 A tabela `tp_thread_group_state`

A tabela `tp_thread_group_state` tem uma linha por grupo de threads no pool de threads. Cada linha fornece informações sobre o estado atual de um grupo.

A tabela `tp_thread_group_state` tem as seguintes colunas:

* `TP_GROUP_ID`

  O ID do grupo de threads. Este é uma chave única dentro da tabela.

* `CONSUMER THREADS`

  O número de threads consumidores. Há, no máximo, um thread pronto para começar a executar se os threads ativos ficarem parados ou bloqueados.

* `RESERVE_THREADS`

  O número de threads no estado reservado. Isso significa que eles não são iniciados até que haja a necessidade de acordar um novo thread e não haja nenhum thread consumidor. É aqui que a maioria dos threads termina quando o grupo de threads cria mais threads do que são necessários para o funcionamento normal. Muitas vezes, um grupo de threads precisa de threads adicionais por um curto período e, em seguida, não precisa deles novamente por um tempo. Nesse caso, eles entram no estado reservado e permanecem até serem necessários novamente. Eles ocupam alguns recursos de memória extras, mas não recursos de computação extras.

* `CONNECT_THREAD_COUNT`

  O número de threads que estão processando ou aguardando o processamento da inicialização e autenticação da conexão. Pode haver um máximo de quatro threads de conexão por grupo de threads; esses threads expiram após um período de inatividade.

* `CONNECTION_COUNT`

  O número de conexões usando este grupo de threads.

* `QUEUED_QUERIES`

  O número de instruções esperando na fila de alta prioridade.

* `QUEUED_TRANSACTIONS`

  O número de instruções esperando na fila de baixa prioridade. Essas são as instruções iniciais para transações que ainda não foram iniciadas, então elas também representam transações em fila.

* `STALL_LIMIT`

O valor da variável de sistema `thread_pool_stall_limit` para o grupo de threads. Este é o mesmo valor para todos os grupos de threads.

* `PRIO_KICKUP_TIMER`

  O valor da variável de sistema `thread_pool_prio_kickup_timer` para o grupo de threads. Este é o mesmo valor para todos os grupos de threads.

* `ALGORITHM`

  O valor da variável de sistema `thread_pool_algorithm` para o grupo de threads. Este é o mesmo valor para todos os grupos de threads.

* `THREAD_COUNT`

  O número de threads iniciados na piscina de threads como parte deste grupo de threads.

* `ACTIVE_THREAD_COUNT`

  O número de threads ativos na execução de instruções.

* `STALLED_THREAD_COUNT`

  O número de instruções paralisadas no grupo de threads. Uma instrução paralisada pode estar sendo executada, mas, do ponto de vista da piscina de threads, está paralisada e não está progredindo. Uma instrução de longa duração acaba rapidamente nesta categoria.

* `WAITING_THREAD_NUMBER`

  Se houver um thread lidando com a consulta de instruções no grupo de threads, isso especifica o número do thread dentro deste grupo de threads. É possível que este thread esteja executando uma instrução.

* `OLDEST_QUEUED`

  Durante quanto tempo em milissegundos a instrução mais antiga na fila está esperando para ser executada.

* `MAX_THREAD_IDS_IN_GROUP`

  O máximo ID de thread dos threads no grupo. Este é o mesmo que `MAX(TP_THREAD_NUMBER)` para os threads quando selecionados da tabela `tp_thread_state`. Ou seja, essas duas consultas são equivalentes:

  ```
  SELECT TP_GROUP_ID, MAX_THREAD_IDS_IN_GROUP
  FROM tp_thread_group_state;

  SELECT TP_GROUP_ID, MAX(TP_THREAD_NUMBER)
  FROM tp_thread_state GROUP BY TP_GROUP_ID;
  ```

* `EFFECTIVE_MAX_TRANSACTIONS_LIMIT`

  O valor `max_transactions_limit_per_tg` efetivo para o grupo.

* `NUM_QUERY_THREADS`

  O número de threads de trabalhador no grupo.

* `TIME_OF_LAST_THREAD_CREATION`

  O momento em que o thread foi criado pela última vez.

* `NUM_CONNECT_HANDLER_THREAD_IN_SLEEP`

O número de threads de manipulador de conexão inativa.

* `THREADS_BOUND_TO_TRANSACTION`

  O número de threads em uma transação ativa, que deve ser menor que `thread_pool_max_transactions_limit`; isso é definido apenas quando `thread_pool_max_transactions_limit` não é `0`.

* `QUERY_THREADS_COUNT`

  o mesmo que num_threads_de_consulta, mas usado para propósitos diferentes?

* `TIME_OF_EARLIEST_CON_EXPIRE`

  Um timestamp que mostra o ponto mais cedo no tempo em que uma conexão deve expirar.

A tabela `tp_thread_group_state` tem um índice; este é um índice único na coluna `TP_GROUP_ID`.

`TRUNCATE TABLE` não é permitido para a tabela `tp_thread_group_state`.