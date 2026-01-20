### 24.5.2 A tabela INFORMATION_SCHEMA TP_THREAD_GROUP_STATE

A tabela [`TP_THREAD_GROUP_STATE`](https://pt.wikipedia.org/wiki/TP_THREAD_GROUP_STATE) tem uma linha por grupo de threads no pool de threads. Cada linha fornece informações sobre o estado atual de um grupo.

A tabela [`TP_THREAD_GROUP_STATE`](https://pt.wikipedia.org/wiki/TP_THREAD_GROUP_STATE) tem as seguintes colunas:

- `TP_GROUP_ID`

  O ID do grupo de fios. Este é uma chave única dentro da tabela.

- `CORRENTES PARA CONSUMIDORES`

  Número de threads de consumo. Há, no máximo, uma thread pronta para começar a execução se as threads ativas ficarem paralisadas ou bloqueadas.

- `RESERVE_THREADS`

  O número de threads no estado reservado. Isso significa que eles não são iniciados até que haja a necessidade de acordar um novo thread e não haja um thread consumidor. É aqui que a maioria dos threads termina quando o grupo de threads criou mais threads do que o necessário para o funcionamento normal. Muitas vezes, um grupo de threads precisa de threads adicionais por um curto período e, em seguida, não precisa mais deles por um tempo. Nesse caso, eles entram no estado reservado e permanecem até serem necessários novamente. Eles ocupam alguns recursos de memória extras, mas não recursos de computação extras.

- `CONNECT_THREAD_COUNT`

  O número de threads que estão processando ou aguardando para processar a inicialização e autenticação da conexão. Pode haver um máximo de quatro threads de conexão por grupo de threads; essas threads expiram após um período de inatividade.

  Esta coluna foi adicionada no MySQL 5.7.18.

- `CONEXÃO_CONTAS`

  O número de conexões que utilizam este grupo de fios.

- `PERGUNTAS EM PROGÊSSEO`

  Número de declarações aguardando na fila de alta prioridade.

- `TRANSACOES_EM_ARMAZENAMENTO`

  O número de declarações na fila de baixa prioridade. São as declarações iniciais para transações que ainda não foram iniciadas, portanto, também representam transações em fila.

- `STALL_LIMIT`

  O valor da variável de sistema `thread_pool_stall_limit` para o grupo de threads. Este é o mesmo valor para todos os grupos de threads.

- `PRIO_KICKUP_TIMER`

  O valor da variável de sistema `thread_pool_prio_kickup_timer` para o grupo de threads. Este é o mesmo valor para todos os grupos de threads.

- ALGORITMO

  O valor da variável de sistema `thread_pool_algorithm` para o grupo de threads. Este é o mesmo valor para todos os grupos de threads.

- `CONTADOR_DE_CORRENTE`

  O número de threads iniciadas na pilha de threads como parte deste grupo de threads.

- `CONTADOR_DE_CORRENTE_ATIVA`

  O número de threads ativos para executar instruções.

- `CONTADOR_DE_CORRUPÇÃO_DE_CORRENTE`

  O número de declarações paralisadas no grupo de threads. Uma declaração paralisada pode estar sendo executada, mas, do ponto de vista de um pool de threads, está paralisada e não está progredindo. Uma declaração de longa duração acaba rapidamente nesta categoria.

- `WAITING_THREAD_NUMBER`

  Se houver um thread que lida com a consulta de declarações no grupo de fios, isso especifica o número do thread dentro deste grupo de fios. É possível que este thread esteja executando uma declaração.

- `MAIOR_EM_A_ORDEM`

  Quanto tempo, em milissegundos, a declaração mais antiga na fila de espera tem aguardado para ser executada.

- `MAX_THREAD_IDS_IN_GROUP`

  O ID máximo do thread dos fios no grupo. Isso é o mesmo que `MAX(TP_THREAD_NUMBER)` para os fios quando selecionados da tabela `TP_THREAD_STATE`. Ou seja, essas duas consultas são equivalentes:

  ```sql
  SELECT TP_GROUP_ID, MAX_THREAD_IDS_IN_GROUP
  FROM TP_THREAD_GROUP_STATE;

  SELECT TP_GROUP_ID, MAX(TP_THREAD_NUMBER)
  FROM TP_THREAD_STATE GROUP BY TP_GROUP_ID;
  ```
