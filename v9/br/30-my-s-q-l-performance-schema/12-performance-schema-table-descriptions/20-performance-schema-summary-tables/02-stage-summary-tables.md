#### 29.12.20.2 Tabelas de Resumo de Etapas

O Schema de Desempenho mantém tabelas para coletar eventos atuais e recentes de etapas e agrega essas informações em tabelas de resumo. A Seção 29.12.5, “Tabelas de Eventos de Etapas do Schema de Desempenho”, descreve os eventos sobre os quais os resumos de etapas são baseados. Consulte essa discussão para obter informações sobre o conteúdo dos eventos de etapas, as tabelas de eventos de etapas atuais e históricas, e como controlar a coleta de eventos de etapas, que está desativada por padrão.

Informações de resumo de evento de etapa de exemplo:

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

* `events_stages_summary_by_account_by_event_name` tem as colunas `EVENT_NAME`, `USER` e `HOST`. Cada linha resume eventos para uma combinação de conta (usuário e host) e nome de evento.

* `events_stages_summary_by_host_by_event_name` tem as colunas `EVENT_NAME` e `HOST`. Cada linha resume eventos para um host e nome de evento.

* `events_stages_summary_by_thread_by_event_name` tem as colunas `THREAD_ID` e `EVENT_NAME`. Cada linha resume eventos para um ID de thread e nome de evento.

* `events_stages_summary_by_user_by_event_name` tem as colunas `EVENT_NAME` e `USER`. Cada linha resume eventos para um usuário e nome de evento.

* `events_stages_summary_global_by_event_name` tem uma coluna `EVENT_NAME`. Cada linha resume eventos para um nome de evento dado.

Cada tabela de resumo de estágio tem essas colunas de resumo contendo valores agregados: `COUNT_STAR`, `SUM_TIMER_WAIT`, `MIN_TIMER_WAIT`, `AVG_TIMER_WAIT` e `MAX_TIMER_WAIT`. Essas colunas são análogas às colunas dos mesmos nomes nas tabelas de resumo de eventos de espera (ver Seção 29.12.20.1, “Tabelas de Resumo de Eventos de Espera”), exceto que as tabelas de resumo de estágio agregam eventos de `events_stages_current` em vez de `events_waits_current`.

As tabelas de resumo de estágio têm esses índices:

* `events_stages_summary_by_account_by_event_name`:

  + Chave primária em (`USER`, `HOST`, `EVENT_NAME`)

* `events_stages_summary_by_host_by_event_name`:

  + Chave primária em (`HOST`, `EVENT_NAME`)

* `events_stages_summary_by_thread_by_event_name`:

  + Chave primária em (`THREAD_ID`, `EVENT_NAME`)

* `events_stages_summary_by_user_by_event_name`:

  + Chave primária em (`USER`, `EVENT_NAME`)

* `events_stages_summary_global_by_event_name`:

  + Chave primária em (`EVENT_NAME`)

O `TRUNCATE TABLE` é permitido para as tabelas de resumo de estágio. Ele tem esses efeitos:

* Para tabelas de resumo não agregadas por conta, host ou usuário, o truncamento redefiniu as colunas de resumo para zero em vez de remover linhas.

* Para tabelas de resumo agregadas por conta, host ou usuário, o truncamento remove linhas para contas, hosts ou usuários sem conexões e redefiniu as colunas de resumo para zero para as linhas restantes.

Além disso, cada tabela de resumo de estágio que é agregada por conta, host, usuário ou thread é truncada implicitamente pelo truncamento da tabela de conexão na qual depende, ou pelo truncamento de `events_stages_summary_global_by_event_name`. Para detalhes, consulte a Seção 29.12.8, “Tabelas de Conexão do Schema de Desempenho”.