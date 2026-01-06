#### 25.12.15.8 Tabelas de Resumo de Soquetes

Essas tabelas de resumo de soquetes agregam informações de temporizador e contagem de bytes para operações de soquete:

- `socket_summary_by_event_name`: Estatísticas agregadas de temporizador e contagem de bytes geradas pelos instrumentos `wait/io/socket/*` para todas as operações de E/S de socket, por instrumento de socket.

- `socket_summary_by_instance`: Estatísticas agregadas de temporizador e contagem de bytes geradas pelos instrumentos `wait/io/socket/*` para todas as operações de E/S de socket, por instância de socket. Quando uma conexão é encerrada, a linha correspondente a ela em `socket_summary_by_instance` é excluída.

As tabelas de resumo de soquetes não agregam as espera geradas por eventos `idle` enquanto os soquetes estão aguardando o próximo pedido do cliente. Para agregações de eventos `idle`, use as tabelas de resumo de eventos de espera; consulte Seção 25.12.15.1, “Tabelas de Resumo de Eventos de Espera”.

Cada tabela de resumo de soquete tem uma ou mais colunas de agrupamento para indicar como a tabela agrega eventos. Os nomes dos eventos referem-se aos nomes dos instrumentos de evento na tabela `setup_instruments`:

- O `socket_summary_by_event_name` possui uma coluna `EVENT_NAME`. Cada linha resume os eventos para um nome de evento específico.

- O `socket_summary_by_instance` possui uma coluna `OBJECT_INSTANCE_BEGIN`. Cada linha resume os eventos para um objeto específico.

Cada tabela de resumo de soquete tem essas colunas de resumo contendo valores agregados:

- `COUNT_STAR`, `SUM_TIMER_WAIT`, `MIN_TIMER_WAIT`, `AVG_TIMER_WAIT`, `MAX_TIMER_WAIT`

  Essas colunas agregam todas as operações.

- `CONTAR_LEITURA`, `SOMAR_TEMPO_LEITURA`, `MIN_TEMPO_LEITURA`, `AVG_TEMPO_LEITURA`, `MAX_TEMPO_LEITURA`, `SOMAR_NUMERO_DE_BYTES_LEITURA`

  Essas colunas agregam todas as operações de recebimento (`RECV`, `RECVFROM` e `RECVMSG`).

- `COUNT_WRITE`, `SUM_TIMER_WRITE`, `MIN_TIMER_WRITE`, `AVG_TIMER_WRITE`, `MAX_TIMER_WRITE`, `SUM_NUMBER_OF_BYTES_WRITE`

  Essas colunas agregam todas as operações de envio (`SEND`, `SENDTO` e `SENDMSG`).

- `CONTAGEM_MISC`, `SOMA_TIMER_MISC`, `MIN_TIMER_MISC`, `MÉDIA_TIMER_MISC`, `MAX_TIMER_MISC`

  Essas colunas agregam todas as outras operações de soquete, como `CONNECT`, `LISTEN`, `ACCEPT`, `CLOSE` e `SHUTDOWN`. Não há contagem de bytes para essas operações.

A tabela `socket_summary_by_instance` também possui uma coluna `EVENT_NAME` que indica a classe do socket: `client_connection`, `server_tcpip_socket`, `server_unix_socket`. Essa coluna pode ser agrupada para isolar, por exemplo, a atividade do cliente da atividade dos sockets de escuta do servidor.

A opção `TRUNCATE TABLE` é permitida para tabelas de resumo de sockets. Exceto para `events_statements_summary_by_digest`, o tt redefiniu as colunas de resumo para zero em vez de remover linhas.
