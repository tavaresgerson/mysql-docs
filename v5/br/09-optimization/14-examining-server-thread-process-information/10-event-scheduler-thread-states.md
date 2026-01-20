### 8.14.10 Estados de fios do planejador de eventos

Estes estados ocorrem para o thread do Agendamento de Eventos, fios que são criados para executar eventos agendados ou fios que encerram o agendamento.

* `Clearing`

  O thread do agendador ou um thread que estava executando um evento está terminando e está prestes a terminar.

* `Initialized`

  O thread do agendador ou um thread que executa um evento foi inicializado.

* `Waiting for next activation`

  O agendador tem uma fila de eventos não vazia, mas a próxima ativação está no futuro.

* `Waiting for scheduler to stop`

  O thread emitiu `SET GLOBAL event_scheduler=OFF` e está aguardando que o agendamento pare.

* `Waiting on empty queue`

  A fila de eventos do agendador está vazia e ele está dormindo.
