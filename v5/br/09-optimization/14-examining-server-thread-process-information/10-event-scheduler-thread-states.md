### 8.14.10 Estados de fios do planejador de eventos

Estes estados ocorrem para o fio do Agendamento de Eventos, fios que são criados para executar eventos agendados ou fios que encerram o agendamento.

- `Limpeza`

  O fio do agendador ou um fio que estava executando um evento está terminando e está prestes a terminar.

- `Inicializado`

  O fio do agendador ou um fio que executa um evento foi inicializado.

- "Esperando pela próxima ativação"

  O agendador tem uma fila de eventos não vazia, mas a próxima ativação está no futuro.

- "Esperando que o agendamento pare"

  O fio emitiu `SET GLOBAL event_scheduler=OFF` e está aguardando que o agendamento pare.

- "Esperando na fila vazia"

  A fila de eventos do agendador está vazia e ele está dormindo.
