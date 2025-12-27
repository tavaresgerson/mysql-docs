### 10.14.9 Estados de Threads do Agendamento de Eventos

Estes estados ocorrem para o thread do Agendamento de Eventos, threads que são criados para executar eventos agendados, ou threads que terminam o agendamento.

* `Limpar`

  O thread do agendamento ou um thread que estava executando um evento está terminando e está prestes a encerrar.
* `Inicializado`

  O thread do agendamento ou um thread que executa um evento foi inicializado.
* `Aguardando próxima ativação`

  O agendamento tem uma fila de eventos não vazia, mas a próxima ativação está no futuro.
* `Aguardando o término do agendamento`

  O thread emitiu `SET GLOBAL event_scheduler=OFF` e está aguardando o término do agendamento.
* `Aguardando fila vazia`

  A fila de eventos do agendamento está vazia e está dormindo.