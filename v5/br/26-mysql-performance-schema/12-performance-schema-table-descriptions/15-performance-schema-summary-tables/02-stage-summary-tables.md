#### 25.12.15.2 Tabelas de Resumo de Stage

O Performance Schema mantém tabelas para coletar Stage Events atuais e recentes, e agrega essa informação em tabelas de resumo. [Section 25.12.5, “Performance Schema Stage Event Tables”](performance-schema-stage-tables.html "25.12.5 Performance Schema Stage Event Tables") descreve os Events nos quais os resumos de Stage são baseados. Consulte essa discussão para obter informações sobre o conteúdo dos Stage Events, as tabelas de Stage Event atuais e históricas, e como controlar a coleta de Stage Events, que está desabilitada por padrão.

Exemplo de informação de resumo de Stage Event:

```sql
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

Cada tabela de resumo de Stage possui uma ou mais colunas de agrupamento para indicar como a tabela agrega os Events. Os nomes dos Events referem-se aos nomes dos instrumentos de Event na tabela [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table"):

* [`events_stages_summary_by_account_by_event_name`](performance-schema-stage-summary-tables.html "25.12.15.2 Stage Summary Tables") possui as colunas `EVENT_NAME`, `USER` e `HOST`. Cada linha resume Events para uma determinada account (combinação de user e host) e nome de Event.

* [`events_stages_summary_by_host_by_event_name`](performance-schema-stage-summary-tables.html "25.12.15.2 Stage Summary Tables") possui as colunas `EVENT_NAME` e `HOST`. Cada linha resume Events para um determinado host e nome de Event.

* [`events_stages_summary_by_thread_by_event_name`](performance-schema-stage-summary-tables.html "25.12.15.2 Stage Summary Tables") possui as colunas `THREAD_ID` e `EVENT_NAME`. Cada linha resume Events para um determinado Thread e nome de Event.

* [`events_stages_summary_by_user_by_event_name`](performance-schema-stage-summary-tables.html "25.12.15.2 Stage Summary Tables") possui as colunas `EVENT_NAME` e `USER`. Cada linha resume Events para um determinado user e nome de Event.

* [`events_stages_summary_global_by_event_name`](performance-schema-stage-summary-tables.html "25.12.15.2 Stage Summary Tables") possui uma coluna `EVENT_NAME`. Cada linha resume Events para um determinado nome de Event.

Cada tabela de resumo de Stage possui as seguintes colunas de resumo contendo valores agregados: `COUNT_STAR`, `SUM_TIMER_WAIT`, `MIN_TIMER_WAIT`, `AVG_TIMER_WAIT` e `MAX_TIMER_WAIT`. Essas colunas são análogas às colunas de mesmos nomes nas tabelas de resumo de Wait Event (consulte [Section 25.12.15.1, “Wait Event Summary Tables”](performance-schema-wait-summary-tables.html "25.12.15.1 Wait Event Summary Tables")), exceto que as tabelas de resumo de Stage agregam Events de [`events_stages_current`](performance-schema-events-stages-current-table.html "25.12.5.1 The events_stages_current Table") em vez de [`events_waits_current`](performance-schema-events-waits-current-table.html "25.12.4.1 The events_waits_current Table").

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") é permitido para tabelas de resumo de Stage. Isso causa os seguintes efeitos:

* Para tabelas de resumo que não são agregadas por account, host ou user, o truncation redefine as colunas de resumo para zero, em vez de remover as linhas.

* Para tabelas de resumo agregadas por account, host ou user, o truncation remove as linhas para accounts, hosts ou users sem conexões, e redefine as colunas de resumo para zero para as linhas restantes.

Além disso, cada tabela de resumo de Stage que é agregada por account, host, user ou Thread é implicitamente truncated pelo truncation da tabela de conexão da qual ela depende, ou pelo truncation de [`events_stages_summary_global_by_event_name`](performance-schema-stage-summary-tables.html "25.12.15.2 Stage Summary Tables"). Para detalhes, consulte [Section 25.12.8, “Performance Schema Connection Tables”](performance-schema-connection-tables.html "25.12.8 Performance Schema Connection Tables").