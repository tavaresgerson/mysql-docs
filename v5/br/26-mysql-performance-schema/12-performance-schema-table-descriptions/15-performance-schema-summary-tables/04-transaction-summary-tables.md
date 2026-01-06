#### 25.12.15.4 Tabelas de Resumo de Transações

O Schema de Desempenho mantém tabelas para coletar eventos de transações atuais e recentes, e agrega essas informações em tabelas resumidas. Seção 25.12.7, “Tabelas de Transações do Schema de Desempenho” descreve os eventos sobre os quais os resumos de transações são baseados. Consulte essa discussão para obter informações sobre o conteúdo dos eventos de transação, as tabelas de eventos de transação atuais e históricas, e como controlar a coleta de eventos de transação, que está desativada por padrão.

Resumo das informações de evento de transação exemplo:

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

Cada tabela de resumo de transação tem uma ou mais colunas de agrupamento para indicar como a tabela agrega eventos. Os nomes dos eventos referem-se aos nomes dos instrumentos de evento na tabela `setup_instruments`:

- O `events_transactions_summary_by_account_by_event_name` possui as colunas `USER`, `HOST` e `EVENT_NAME`. Cada linha resume os eventos para uma conta específica (combinação de usuário e host) e nome do evento.

- O `events_transactions_summary_by_host_by_event_name` possui as colunas `HOST` e `EVENT_NAME`. Cada linha resume os eventos para um determinado host e nome de evento.

- O `events_transactions_summary_by_thread_by_event_name` possui as colunas `THREAD_ID` e `EVENT_NAME`. Cada linha resume os eventos para um determinado thread e nome de evento.

- O `events_transactions_summary_by_user_by_event_name` possui as colunas `USER` e `EVENT_NAME`. Cada linha resume os eventos para um usuário e um nome de evento específicos.

- O `events_transactions_summary_global_by_event_name` possui uma coluna `EVENT_NAME`. Cada linha resume os eventos para um nome de evento específico.

Cada tabela de resumo de transação tem essas colunas de resumo contendo valores agregados:

- `COUNT_STAR`, `SUM_TIMER_WAIT`, `MIN_TIMER_WAIT`, `AVG_TIMER_WAIT`, `MAX_TIMER_WAIT`

  Essas colunas são análogas às colunas dos mesmos nomes nas tabelas de resumo de eventos de espera (consulte Seção 25.12.15.1, “Tabelas de Resumo de Eventos de Espera”), exceto que as tabelas de resumo de transações agregam eventos de `events_transactions_current` em vez de `events_waits_current`. Essas colunas resumem transações de leitura/escrita e de leitura apenas.

- `CONTAR_LEITURA_ESCRITA`, `SOMAR_TEMPO_LEITURA_ESCRITA`, `MIN_TEMPO_LEITURA_ESCRITA`, `AVG_TEMPO_LEITURA_ESCRITA`, `MAX_TEMPO_LEITURA_ESCRITA`

  Esses são semelhantes às colunas `COUNT_STAR` e `xxx_TIMER_WAIT`, mas resumem apenas as transações de leitura/escrita. O modo de acesso à transação especifica se as transações operam em modo de leitura/escrita ou apenas de leitura.

- `COUNT_READ_ONLY`, `SUM_TIMER_READ_ONLY`, `MIN_TIMER_READ_ONLY`, `AVG_TIMER_READ_ONLY`, `MAX_TIMER_READ_ONLY`

  Esses são semelhantes às colunas `COUNT_STAR` e `xxx_TIMER_WAIT`, mas resumem apenas as transações de leitura somente. O modo de acesso à transação especifica se as transações operam em modo de leitura/escrita ou de leitura somente.

A opção `TRUNCATE TABLE` é permitida para tabelas de resumo de transações. Ela tem esses efeitos:

- Para tabelas resumidas que não são agregadas por conta, host ou usuário, o truncamento redefine as colunas resumidas para zero, em vez de remover linhas.

- Para tabelas resumidas agregadas por conta, host ou usuário, o truncamento remove linhas de contas, hosts ou usuários sem conexões e redefiniu as colunas resumidas para zero para as linhas restantes.

Além disso, cada tabela de resumo de transação que é agregada por conta, host, usuário ou thread é implicitamente truncada pela truncagem da tabela de conexão na qual ela depende, ou pela truncagem de `events_transactions_summary_global_by_event_name`. Para obter detalhes, consulte Seção 25.12.8, “Tabelas de Conexão do Schema de Desempenho”.

##### Regras de Agregação de Transações

A coleta de eventos de transação ocorre independentemente do nível de isolamento, do modo de acesso ou do modo de autocommit.

A coleta de eventos de transação ocorre para todas as transações não abortadas iniciadas pelo servidor, incluindo transações vazias.

As transações de leitura/escrita geralmente são mais intensivas em recursos do que as transações de leitura apenas, portanto, as tabelas de resumo de transações incluem colunas agregadas separadas para transações de leitura/escrita e de leitura apenas.

Os requisitos de recursos também podem variar com o nível de isolamento de transação. No entanto, assumindo que apenas um nível de isolamento seria usado por servidor, a agregação por nível de isolamento não é fornecida.
