### 24.5.2 A Tabela TP_THREAD_GROUP_STATE do INFORMATION_SCHEMA

A tabela [\`TP_THREAD_GROUP_STATE\`](information-schema-tp-thread-group-state-table.html "24.5.2 The INFORMATION_SCHEMA TP_THREAD_GROUP_STATE Table") possui uma linha por Thread Group no Thread Pool. Cada linha fornece informações sobre o estado atual de um grupo.

A tabela [\`TP_THREAD_GROUP_STATE\`](information-schema-tp-thread-group-state-table.html "24.5.2 The INFORMATION_SCHEMA TP_THREAD_GROUP_STATE Table") possui as seguintes colunas:

* `TP_GROUP_ID`

  O ID do Thread Group. Esta é uma chave única dentro da tabela.

* `CONSUMER THREADS`

  O número de *Consumer Threads* (Threads Consumidoras). Há no máximo uma Thread pronta para iniciar a execução caso as Threads ativas fiquem *stalled* (travadas) ou *blocked* (bloqueadas).

* `RESERVE_THREADS`

  O número de Threads no estado *reserved* (reservado). Isso significa que elas não são iniciadas até que haja a necessidade de despertar uma nova Thread e não haja uma *Consumer Thread*. É aqui que a maioria das Threads fica quando o Thread Group cria mais Threads do que o necessário para a operação normal. Frequentemente, um Thread Group precisa de Threads adicionais por um curto período e depois não precisa mais delas por um tempo. Nesses casos, elas entram no estado reservado e permanecem até serem necessárias novamente. Elas consomem alguns recursos extras de memória, mas nenhum recurso extra de computação.

* `CONNECT_THREAD_COUNT`

  O número de Threads que estão processando ou aguardando para processar a inicialização da conexão e a autenticação. Pode haver um máximo de quatro *Connection Threads* por Thread Group; essas Threads expiram após um período de inatividade.

  Esta coluna foi adicionada no MySQL 5.7.18.

* `CONNECTION_COUNT`

  O número de conexões usando este Thread Group.

* `QUEUED_QUERIES`

  O número de *statements* (instruções) aguardando na fila de alta prioridade.

* `QUEUED_TRANSACTIONS`

  O número de *statements* aguardando na fila de baixa prioridade. Estes são os *statements* iniciais para Transactions que não foram iniciadas, portanto, também representam Transactions em fila (*queued transactions*).

* `STALL_LIMIT`

  O valor da variável de sistema [`thread_pool_stall_limit`](server-system-variables.html#sysvar_thread_pool_stall_limit) para o Thread Group. Este valor é o mesmo para todos os Thread Groups.

* `PRIO_KICKUP_TIMER`

  O valor da variável de sistema [`thread_pool_prio_kickup_timer`](server-system-variables.html#sysvar_thread_pool_prio_kickup_timer) para o Thread Group. Este valor é o mesmo para todos os Thread Groups.

* `ALGORITHM`

  O valor da variável de sistema [`thread_pool_algorithm`](server-system-variables.html#sysvar_thread_pool_algorithm) para o Thread Group. Este valor é o mesmo para todos os Thread Groups.

* `THREAD_COUNT`

  O número de Threads iniciadas no Thread Pool como parte deste Thread Group.

* `ACTIVE_THREAD_COUNT`

  O número de Threads ativas na execução de *statements*.

* `STALLED_THREAD_COUNT`

  O número de *statements stalled* (paralisados/travados) no Thread Group. Um *statement stalled* pode estar em execução, mas da perspectiva do Thread Pool, ele está paralisado e sem fazer progresso. Um *statement* de longa execução rapidamente se enquadra nesta categoria.

* `WAITING_THREAD_NUMBER`

  Se houver uma Thread responsável pela sondagem (*polling*) de *statements* no Thread Group, este campo especifica o número da Thread dentro deste Thread Group. É possível que esta Thread esteja executando um *statement*.

* `OLDEST_QUEUED`

  Por quanto tempo em milissegundos o *statement* mais antigo na fila (*queued*) está esperando pela execução.

* `MAX_THREAD_IDS_IN_GROUP`

  O ID máximo de Thread das Threads no grupo. Este é o mesmo que [`MAX(TP_THREAD_NUMBER)`](aggregate-functions.html#function_max) para as Threads quando selecionadas da tabela [`TP_THREAD_STATE`](information-schema-tp-thread-state-table.html "24.5.4 The INFORMATION_SCHEMA TP_THREAD_STATE Table"). Ou seja, estas duas Queries são equivalentes:

```sql
  SELECT TP_GROUP_ID, MAX_THREAD_IDS_IN_GROUP
  FROM TP_THREAD_GROUP_STATE;

  SELECT TP_GROUP_ID, MAX(TP_THREAD_NUMBER)
  FROM TP_THREAD_STATE GROUP BY TP_GROUP_ID;
  ```