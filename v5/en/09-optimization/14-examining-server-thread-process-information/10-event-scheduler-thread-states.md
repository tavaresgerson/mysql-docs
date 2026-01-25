### 8.14.10 Estados de Thread do Event Scheduler

Esses estados ocorrem para o Thread do Event Scheduler, threads que são criados para executar eventos agendados ou threads que encerram o scheduler.

* `Clearing`

  O thread do scheduler ou um thread que estava executando um evento está em processo de encerramento e está prestes a finalizar.

* `Initialized`

  O thread do scheduler ou um thread que executa um evento foi inicializado.

* `Waiting for next activation`

  O scheduler tem uma fila de eventos (event queue) não vazia, mas a próxima activation está no futuro.

* `Waiting for scheduler to stop`

  O thread emitiu `SET GLOBAL event_scheduler=OFF` e está aguardando o scheduler parar.

* `Waiting on empty queue`

  A fila de eventos (event queue) do scheduler está vazia e ele está dormindo.