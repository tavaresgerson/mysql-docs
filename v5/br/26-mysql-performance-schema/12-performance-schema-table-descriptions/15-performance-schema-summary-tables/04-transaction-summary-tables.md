#### 25.12.15.4 Tabelas de Resumo de Transações

O Performance Schema mantém tabelas para coletar eventos de transação atuais e recentes, e agrega essas informações em tabelas de resumo. [Seção 25.12.7, “Tabelas de Transações do Performance Schema”](performance-schema-transaction-tables.html "25.12.7 Performance Schema Transaction Tables") descreve os eventos nos quais os resumos de transações são baseados. Consulte essa discussão para obter informações sobre o conteúdo dos eventos de transação, as tabelas de eventos de transação atuais e históricas, e como controlar a coleta de eventos de transação, que é desabilitada por padrão.

Exemplo de informações de resumo de eventos de transação:

```sql
mysql> SELECT *
       FROM performance_schema.events_transactions_summary_global_by_event_name
       LIMIT 1\G
*************************** 1. row ***************************
          EVENT_NAME: transaction
          COUNT_STAR: 5
      SUM_TIMER_WAIT: 19550092000
      MIN_TIMER_WAIT: 2954148000
      AVG_TIMER_WAIT: 3910018000
      MAX_TIMER_WAIT: 5486275000
    COUNT_READ_WRITE: 5
SUM_TIMER_READ_WRITE: 19550092000
MIN_TIMER_READ_WRITE: 2954148000
AVG_TIMER_READ_WRITE: 3910018000
MAX_TIMER_READ_WRITE: 5486275000
     COUNT_READ_ONLY: 0
 SUM_TIMER_READ_ONLY: 0
 MIN_TIMER_READ_ONLY: 0
 AVG_TIMER_READ_ONLY: 0
 MAX_TIMER_READ_ONLY: 0
```

Cada tabela de resumo de transações possui uma ou mais colunas de agrupamento para indicar como a tabela agrega eventos. Os nomes dos eventos se referem aos nomes dos instrumentos de evento na tabela [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table"):

* [`events_transactions_summary_by_account_by_event_name`](performance-schema-transaction-summary-tables.html "25.12.15.4 Transaction Summary Tables") possui as colunas `USER`, `HOST` e `EVENT_NAME`. Cada linha resume eventos para uma determinada conta (combinação de user e host) e nome de evento.

* [`events_transactions_summary_by_host_by_event_name`](performance-schema-transaction-summary-tables.html "25.12.15.4 Transaction Summary Tables") possui as colunas `HOST` e `EVENT_NAME`. Cada linha resume eventos para um determinado host e nome de evento.

* [`events_transactions_summary_by_thread_by_event_name`](performance-schema-transaction-summary-tables.html "25.12.15.4 Transaction Summary Tables") possui as colunas `THREAD_ID` e `EVENT_NAME`. Cada linha resume eventos para um determinado Thread e nome de evento.

* [`events_transactions_summary_by_user_by_event_name`](performance-schema-transaction-summary-tables.html "25.12.15.4 Transaction Summary Tables") possui as colunas `USER` e `EVENT_NAME`. Cada linha resume eventos para um determinado user e nome de evento.

* [`events_transactions_summary_global_by_event_name`](performance-schema-transaction-summary-tables.html "25.12.15.4 Transaction Summary Tables") possui uma coluna `EVENT_NAME`. Cada linha resume eventos para um determinado nome de evento.

Cada tabela de resumo de transações possui estas colunas de resumo contendo valores agregados:

* `COUNT_STAR`, `SUM_TIMER_WAIT`, `MIN_TIMER_WAIT`, `AVG_TIMER_WAIT`, `MAX_TIMER_WAIT`

  Essas colunas são análogas às colunas de mesmos nomes nas tabelas de resumo de eventos de espera (consulte [Seção 25.12.15.1, “Tabelas de Resumo de Eventos de Espera”](performance-schema-wait-summary-tables.html "25.12.15.1 Wait Event Summary Tables")), exceto que as tabelas de resumo de transações agregam eventos de [`events_transactions_current`](performance-schema-events-transactions-current-table.html "25.12.7.1 The events_transactions_current Table") em vez de [`events_waits_current`](performance-schema-events-waits-current-table.html "25.12.4.1 The events_waits_current Table"). Essas colunas resumem transações read-write e read-only.

* `COUNT_READ_WRITE`, `SUM_TIMER_READ_WRITE`, `MIN_TIMER_READ_WRITE`, `AVG_TIMER_READ_WRITE`, `MAX_TIMER_READ_WRITE`

  Estas são semelhantes às colunas `COUNT_STAR` e `xxx_TIMER_WAIT`, mas resumem apenas transações read-write. O Access Mode da transação especifica se as transações operam em modo read/write ou read-only.

* `COUNT_READ_ONLY`, `SUM_TIMER_READ_ONLY`, `MIN_TIMER_READ_ONLY`, `AVG_TIMER_READ_ONLY`, `MAX_TIMER_READ_ONLY`

  Estas são semelhantes às colunas `COUNT_STAR` e `xxx_TIMER_WAIT`, mas resumem apenas transações read-only. O Access Mode da transação especifica se as transações operam em modo read/write ou read-only.

O [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") é permitido para tabelas de resumo de transações. Ele tem os seguintes efeitos:

* Para tabelas de resumo que não são agregadas por conta, host ou user, o TRUNCATE redefine as colunas de resumo para zero, em vez de remover as linhas.

* Para tabelas de resumo agregadas por conta, host ou user, o TRUNCATE remove as linhas para contas, hosts ou users sem conexões, e redefine as colunas de resumo para zero para as linhas restantes.

Além disso, cada tabela de resumo de transações que é agregada por conta, host, user ou Thread é implicitamente truncada pelo TRUNCATE da tabela de conexão da qual ela depende, ou pelo TRUNCATE de [`events_transactions_summary_global_by_event_name`](performance-schema-transaction-summary-tables.html "25.12.15.4 Transaction Summary Tables"). Para detalhes, consulte [Seção 25.12.8, “Tabelas de Conexão do Performance Schema”](performance-schema-connection-tables.html "25.12.8 Performance Schema Connection Tables").

##### Regras de Agregação de Transações

A coleta de eventos de transação ocorre independentemente do nível de isolation, Access Mode ou modo autocommit.

A coleta de eventos de transação ocorre para todas as transações não abortadas iniciadas pelo servidor, incluindo transações vazias.

Transações read-write são geralmente mais intensivas em recursos do que transações read-only; portanto, as tabelas de resumo de transações incluem colunas agregadas separadas para transações read-write e read-only.

Os requisitos de recursos também podem variar com o nível de isolation da transação. No entanto, presumindo que apenas um nível de isolation seria usado por servidor, a agregação por nível de isolation não é fornecida.