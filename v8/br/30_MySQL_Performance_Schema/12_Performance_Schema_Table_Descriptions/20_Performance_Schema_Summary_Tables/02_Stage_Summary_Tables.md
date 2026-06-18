#### 29.12.20.2 Tabelas de Resumo das Fases

O Schema de Desempenho mantém tabelas para coletar eventos de estágio atuais e recentes, e agrega essas informações em tabelas resumidas. A Seção 29.12.5, “Tabelas de Eventos de Estágio do Schema de Desempenho”, descreve os eventos sobre os quais os resumos de estágio são baseados. Consulte essa discussão para obter informações sobre o conteúdo dos eventos de estágio, as tabelas de eventos de estágio atuais e históricas, e como controlar a coleta de eventos de estágio, que está desativada por padrão.

Resumo das informações do evento de estágio:

```
mysql> SELECT *
       FROM performance_schema.events_stages_summary_global_by_event_name\G
...
*************************** 5. row ***************************
    EVENT_NAME: stage/sql/checking permissions
    COUNT_STAR: 57
SUM_TIMER_WAIT: 26501888880
MIN_TIMER_WAIT: 7317456
AVG_TIMER_WAIT: 464945295
MAX_TIMER_WAIT: 12858936792
...
*************************** 9. row ***************************
    EVENT_NAME: stage/sql/closing tables
    COUNT_STAR: 37
SUM_TIMER_WAIT: 662606568
MIN_TIMER_WAIT: 1593864
AVG_TIMER_WAIT: 17907891
MAX_TIMER_WAIT: 437977248
...
```

Cada tabela de resumo de etapa tem uma ou mais colunas de agrupamento para indicar como a tabela agrega eventos. Os nomes dos eventos referem-se aos nomes dos instrumentos de evento na tabela `setup_instruments`:

- A tabela `events_stages_summary_by_account_by_event_name` possui as colunas `EVENT_NAME`, `USER` e `HOST`. Cada linha resume os eventos para uma conta específica (combinação de usuário e host) e o nome do evento.

- A tabela `events_stages_summary_by_host_by_event_name` possui as colunas `EVENT_NAME` e `HOST`. Cada linha resume os eventos para um determinado host e nome de evento.

- A coluna `events_stages_summary_by_thread_by_event_name` tem as colunas `THREAD_ID` e `EVENT_NAME`. Cada linha resume os eventos para um determinado fio e nome de evento.

- A tabela `events_stages_summary_by_user_by_event_name` possui as colunas `EVENT_NAME` e `USER`. Cada linha resume os eventos para um usuário e um nome de evento específicos.

- A coluna `events_stages_summary_global_by_event_name` tem uma coluna `EVENT_NAME`. Cada linha resume os eventos para um nome de evento específico.

Cada tabela de resumo de estágio tem essas colunas de resumo contendo valores agregados: `COUNT_STAR`, `SUM_TIMER_WAIT`, `MIN_TIMER_WAIT`, `AVG_TIMER_WAIT` e `MAX_TIMER_WAIT`. Essas colunas são análogas às colunas dos mesmos nomes nas tabelas de resumo de eventos de espera (ver Seção 29.12.20.1, “Tabelas de Resumo de Eventos de Espera”), exceto que as tabelas de resumo de estágio agregam eventos de `events_stages_current` em vez de `events_waits_current`.

As tabelas de resumo do estágio têm esses índices:

- `events_stages_summary_by_account_by_event_name`:

  - Chave primária em (`USER`, `HOST`, `EVENT_NAME`)

- `events_stages_summary_by_host_by_event_name`:

  - Chave primária em (`HOST`, `EVENT_NAME`)

- `events_stages_summary_by_thread_by_event_name`:

  - Chave primária em (`THREAD_ID`, `EVENT_NAME`)

- `events_stages_summary_by_user_by_event_name`:

  - Chave primária em (`USER`, `EVENT_NAME`)

- `events_stages_summary_global_by_event_name`:

  - Chave primária em (`EVENT_NAME`)

`TRUNCATE TABLE` é permitido para tabelas de resumo de estágios. Ele tem esses efeitos:

- Para tabelas resumidas que não são agregadas por conta, host ou usuário, o truncamento redefine as colunas resumidas para zero, em vez de remover linhas.

- Para tabelas resumidas agregadas por conta, host ou usuário, o truncamento remove linhas de contas, hosts ou usuários sem conexões e redefiniu as colunas resumidas para zero para as linhas restantes.

Além disso, cada tabela de resumo de estágio que é agregada por conta, host, usuário ou thread é implicitamente truncada pela truncagem da tabela de conexão da qual depende, ou pela truncagem de `events_stages_summary_global_by_event_name`. Para obter detalhes, consulte a Seção 29.12.8, “Tabelas de Conexão do Schema de Desempenho”.
