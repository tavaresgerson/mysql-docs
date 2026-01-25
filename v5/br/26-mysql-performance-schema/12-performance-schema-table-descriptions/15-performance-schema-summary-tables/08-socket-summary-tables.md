#### 25.12.15.8 Tabelas de Resumo de Socket

Estas tabelas de resumo de Socket agregam informações de Timer e contagem de bytes para operações de Socket:

* [`socket_summary_by_event_name`](performance-schema-socket-summary-tables.html "25.12.15.8 Socket Summary Tables"): Estatísticas agregadas de Timer e contagem de bytes geradas pelos instrumentos `wait/io/socket/*` para todas as operações de I/O de Socket, por instrumento de Socket.

* [`socket_summary_by_instance`](performance-schema-socket-summary-tables.html "25.12.15.8 Socket Summary Tables"): Estatísticas agregadas de Timer e contagem de bytes geradas pelos instrumentos `wait/io/socket/*` para todas as operações de I/O de Socket, por Instance de Socket. Quando uma Connection é encerrada, a linha em [`socket_summary_by_instance`](performance-schema-socket-summary-tables.html "25.12.15.8 Socket Summary Tables") correspondente a ela é excluída.

As tabelas de resumo de Socket não agregam esperas geradas por Events `idle` enquanto os Sockets aguardam a próxima Request do Client. Para agregações de Events `idle`, use as tabelas de resumo de Wait Events; consulte [Section 25.12.15.1, “Wait Event Summary Tables”](performance-schema-wait-summary-tables.html "25.12.15.1 Wait Event Summary Tables").

Cada tabela de resumo de Socket tem uma ou mais colunas de agrupamento para indicar como a tabela agrega Events. Os nomes dos Events referem-se aos nomes dos instrumentos de Event na tabela [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table"):

* [`socket_summary_by_event_name`](performance-schema-socket-summary-tables.html "25.12.15.8 Socket Summary Tables") possui uma coluna `EVENT_NAME`. Cada linha resume Events para um determinado nome de Event.

* [`socket_summary_by_instance`](performance-schema-socket-summary-tables.html "25.12.15.8 Socket Summary Tables") possui uma coluna `OBJECT_INSTANCE_BEGIN`. Cada linha resume Events para um determinado Object.

Cada tabela de resumo de Socket possui estas colunas de resumo contendo valores agregados:

* `COUNT_STAR`, `SUM_TIMER_WAIT`, `MIN_TIMER_WAIT`, `AVG_TIMER_WAIT`, `MAX_TIMER_WAIT`

  Estas colunas agregam todas as operações.

* `COUNT_READ`, `SUM_TIMER_READ`, `MIN_TIMER_READ`, `AVG_TIMER_READ`, `MAX_TIMER_READ`, `SUM_NUMBER_OF_BYTES_READ`

  Estas colunas agregam todas as operações de recebimento (`RECV`, `RECVFROM` e `RECVMSG`).

* `COUNT_WRITE`, `SUM_TIMER_WRITE`, `MIN_TIMER_WRITE`, `AVG_TIMER_WRITE`, `MAX_TIMER_WRITE`, `SUM_NUMBER_OF_BYTES_WRITE`

  Estas colunas agregam todas as operações de envio (`SEND`, `SENDTO` e `SENDMSG`).

* `COUNT_MISC`, `SUM_TIMER_MISC`, `MIN_TIMER_MISC`, `AVG_TIMER_MISC`, `MAX_TIMER_MISC`

  Estas colunas agregam todas as outras operações de Socket, como `CONNECT`, `LISTEN`, `ACCEPT`, `CLOSE` e `SHUTDOWN`. Não há contagens de bytes para estas operações.

A tabela [`socket_summary_by_instance`](performance-schema-socket-summary-tables.html "25.12.15.8 Socket Summary Tables") também possui uma coluna `EVENT_NAME` que indica a classe do Socket: `client_connection`, `server_tcpip_socket`, `server_unix_socket`. Esta coluna pode ser usada para agrupar e isolar, por exemplo, a atividade do Client da atividade dos Sockets de escuta do Server.

O [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") é permitido para as tabelas de resumo de Socket. Exceto para [`events_statements_summary_by_digest`](performance-schema-statement-summary-tables.html "25.12.15.3 Statement Summary Tables"), ele redefine as colunas de resumo para zero em vez de remover as linhas.