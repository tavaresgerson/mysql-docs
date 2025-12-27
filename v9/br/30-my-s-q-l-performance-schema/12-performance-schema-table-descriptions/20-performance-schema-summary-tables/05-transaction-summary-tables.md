#### 29.12.20.5 Tabelas de Resumo de Transações

O Schema de Desempenho mantém tabelas para coletar eventos de transações atuais e recentes, e agrega essas informações em tabelas de resumo. A Seção 29.12.7, “Tabelas de Transações do Schema de Desempenho”, descreve os eventos sobre os quais os resumos de transações são baseados. Consulte essa discussão para obter informações sobre o conteúdo dos eventos de transação, as tabelas de eventos de transação atuais e históricas, e como controlar a coleta de eventos de transação, que está desativada por padrão.

Informações de resumo de eventos de transação de exemplo:

```
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

Cada tabela de resumo de transação tem uma ou mais colunas de agrupamento para indicar como a tabela agrega eventos. Os nomes dos eventos referem-se a nomes de instrumentos de evento na tabela `setup_instruments`:

* `events_transactions_summary_by_account_by_event_name` tem as colunas `USER`, `HOST` e `EVENT_NAME`. Cada linha resume eventos para uma combinação de conta (usuário e host) e nome de evento.

* `events_transactions_summary_by_host_by_event_name` tem as colunas `HOST` e `EVENT_NAME`. Cada linha resume eventos para um host e nome de evento dados.

* `events_transactions_summary_by_thread_by_event_name` tem as colunas `THREAD_ID` e `EVENT_NAME`. Cada linha resume eventos para um thread e nome de evento dados.

* `events_transactions_summary_by_user_by_event_name` tem as colunas `USER` e `EVENT_NAME`. Cada linha resume eventos para um usuário e nome de evento dados.

* `events_transactions_summary_global_by_event_name` tem uma coluna `EVENT_NAME`. Cada linha resume eventos para um nome de evento dado.

Cada tabela de resumo de transação tem essas colunas de resumo contendo valores agregados:

* `COUNT_STAR`, `SUM_TIMER_WAIT`, `MIN_TIMER_WAIT`, `AVG_TIMER_WAIT`, `MAX_TIMER_WAIT`

Essas colunas são análogas às colunas dos mesmos nomes nas tabelas de resumo de eventos de espera (veja a Seção 29.12.20.1, “Tabelas de Resumo de Eventos de Espera”), exceto que as tabelas de resumo de transações agregam eventos de `events_transactions_current` em vez de `events_waits_current`. Essas colunas resumem transações de leitura/escrita e de leitura/somente leitura.

* `COUNT_READ_WRITE`, `SUM_TIMER_READ_WRITE`, `MIN_TIMER_READ_WRITE`, `AVG_TIMER_READ_WRITE`, `MAX_TIMER_READ_WRITE`

  Estas são semelhantes às colunas `COUNT_STAR` e `xxx_TIMER_WAIT`, mas resumem apenas transações de leitura/escrita. O modo de acesso à transação especifica se as transações operam em modo de leitura/escrita ou de leitura/somente leitura.

* `COUNT_READ_ONLY`, `SUM_TIMER_READ_ONLY`, `MIN_TIMER_READ_ONLY`, `AVG_TIMER_READ_ONLY`, `MAX_TIMER_READ_ONLY`

  Estas são semelhantes às colunas `COUNT_STAR` e `xxx_TIMER_WAIT`, mas resumem apenas transações de leitura/somente leitura. O modo de acesso à transação especifica se as transações operam em modo de leitura/escrita ou de leitura/somente leitura.

As tabelas de resumo de transações têm esses índices:

* `events_transactions_summary_by_account_by_event_name`:

  + Chave primária em (`USER`, `HOST`, `EVENT_NAME`)

* `events_transactions_summary_by_host_by_event_name`:

  + Chave primária em (`HOST`, `EVENT_NAME`)

* `events_transactions_summary_by_thread_by_event_name`:

  + Chave primária em (`THREAD_ID`, `EVENT_NAME`)

* `events_transactions_summary_by_user_by_event_name`:

  + Chave primária em (`USER`, `EVENT_NAME`)

* `events_transactions_summary_global_by_event_name`:

  + Chave primária em (`EVENT_NAME`)

O `TRUNCATE TABLE` é permitido para tabelas de resumo de transações. Ele tem esses efeitos:

* Para tabelas de resumo não agregadas por conta, host ou usuário, o truncamento redefiniu as colunas de resumo para zero em vez de remover linhas.

* Para tabelas de resumo agregadas por conta, host ou usuário, o truncamento remove linhas de contas, hosts ou usuários sem conexões e redefreia as colunas de resumo para zero para as linhas restantes.

Além disso, cada tabela de resumo de transações que é agregada por conta, host, usuário ou thread é implicitamente truncada pelo truncamento da tabela de conexão da qual depende, ou pelo truncamento de `events_transactions_summary_global_by_event_name`. Para detalhes, consulte a Seção 29.12.8, “Tabelas de Conexão do Schema de Desempenho”.

##### Regras de Agregação de Transações

A coleta de eventos de transação ocorre independentemente do nível de isolamento, do modo de acesso ou do modo de autocommit.

A coleta de eventos de transação ocorre para todas as transações não abortadas iniciadas pelo servidor, incluindo transações vazias.

As transações de leitura e escrita são, geralmente, mais intensivas em recursos do que as transações de leitura apenas, portanto, as tabelas de resumo de transação incluem colunas agregadas separadas para transações de leitura e escrita.

Os requisitos de recursos também podem variar com o nível de isolamento da transação. No entanto, assumindo que apenas um nível de isolamento seria usado por servidor, a agregação por nível de isolamento não é fornecida.