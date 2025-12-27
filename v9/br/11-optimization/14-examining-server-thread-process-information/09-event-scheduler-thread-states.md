### 10.14.9 Estados de Threads do Agendamento de Eventos

Estes estados ocorrem para a thread do Agendamento de Eventos, threads que são criadas para executar eventos agendados, ou threads que encerram o agendamento.

* `Limpar`

  A thread do agendamento ou uma thread que estava executando um evento está terminando e está prestes a encerrar.

* `Inicializado`

  A thread do agendamento ou uma thread que executa um evento foi inicializada.

* `Aguardando próxima ativação`

  O agendamento tem uma fila de eventos não vazia, mas a próxima ativação está no futuro.

* `Aguardando o término do agendamento`

  O thread emitiu `SET GLOBAL event_scheduler=OFF` e está aguardando o término do agendamento.

* `Aguardando fila vazia`

  A fila de eventos do agendamento está vazia e está dormindo.