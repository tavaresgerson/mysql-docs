#### 29.12.20.9 Tabelas de Resumo de Soquetes

Essas tabelas de resumo de soquetes agregam informações de temporizador e contagem de bytes para operações de soquete:

- `socket_summary_by_event_name`: Estatísticas de temporizador agregado e contagem de bytes geradas pelos instrumentos `wait/io/socket/*` para todas as operações de E/S de soquete, por instrumento de soquete.

- `socket_summary_by_instance`: Estatísticas de temporizador agregado e contagem de bytes geradas pelos instrumentos `wait/io/socket/*` para todas as operações de E/S de soquete, por instância de soquete. Quando uma conexão é encerrada, a linha correspondente a ela no `socket_summary_by_instance` é excluída.

As tabelas de resumo de soquetes não agregam as espera geradas por eventos `idle` enquanto os soquetes estão aguardando o próximo pedido do cliente. Para as agregações de eventos `idle`, use as tabelas de resumo de eventos de espera; veja a Seção 29.12.20.1, “Tabelas de Resumo de Eventos de Espera”.

Cada tabela de resumo de soquete tem uma ou mais colunas de agrupamento para indicar como a tabela agrega eventos. Os nomes dos eventos referem-se aos nomes dos instrumentos de evento na tabela `setup_instruments`:

- A coluna `socket_summary_by_event_name` tem uma coluna `EVENT_NAME`. Cada linha resume os eventos para um nome de evento específico.

- A coluna `socket_summary_by_instance` tem uma coluna `OBJECT_INSTANCE_BEGIN`. Cada linha resume os eventos para um objeto específico.

Cada tabela de resumo de soquete tem essas colunas de resumo contendo valores agregados:

- `COUNT_STAR`, `SUM_TIMER_WAIT`, `MIN_TIMER_WAIT`, `AVG_TIMER_WAIT`, `MAX_TIMER_WAIT`

  Essas colunas agregam todas as operações.

- `COUNT_READ`, `SUM_TIMER_READ`, `MIN_TIMER_READ`, `AVG_TIMER_READ`, `MAX_TIMER_READ`, `SUM_NUMBER_OF_BYTES_READ`

  Essas colunas agregam todas as operações de recebimento (`RECV`, `RECVFROM` e `RECVMSG`).

- `COUNT_WRITE`, `SUM_TIMER_WRITE`, `MIN_TIMER_WRITE`, `AVG_TIMER_WRITE`, `MAX_TIMER_WRITE`, `SUM_NUMBER_OF_BYTES_WRITE`

  Essas colunas agregam todas as operações de envio (`SEND`, `SENDTO` e `SENDMSG`).

- `COUNT_MISC`, `SUM_TIMER_MISC`, `MIN_TIMER_MISC`, `AVG_TIMER_MISC`, `MAX_TIMER_MISC`

  Essas colunas agregam todas as outras operações de soquete, como `CONNECT`, `LISTEN`, `ACCEPT`, `CLOSE` e `SHUTDOWN`. Não há contagem de bytes para essas operações.

A tabela `socket_summary_by_instance` também possui uma coluna `EVENT_NAME` que indica a classe do soquete: `client_connection`, `server_tcpip_socket`, `server_unix_socket`. Essa coluna pode ser agrupada para isolar, por exemplo, a atividade do cliente da atividade dos soquetes de escuta do servidor.

As tabelas de resumo de soquetes têm esses índices:

- `socket_summary_by_event_name`:

  - Chave primária em (`EVENT_NAME`)
- `socket_summary_by_instance`:

  - Chave primária em (`OBJECT_INSTANCE_BEGIN`)

  - Índice sobre (`EVENT_NAME`)

`TRUNCATE TABLE` é permitido para tabelas de resumo de soquetes. Exceto para `events_statements_summary_by_digest`, ele reescreve as colunas de resumo para zero em vez de remover linhas.
