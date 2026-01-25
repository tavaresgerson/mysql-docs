#### 25.12.15.1 Tabelas de Resumo de Eventos de Espera

O Performance Schema mantém tabelas para coletar eventos de espera (wait events) atuais e recentes, e agrega essa informação em tabelas de resumo. [Seção 25.12.4, “Tabelas de Eventos de Espera do Performance Schema”](performance-schema-wait-tables.html "25.12.4 Performance Schema Wait Event Tables") descreve os eventos nos quais os resumos de espera são baseados. Consulte essa discussão para obter informações sobre o conteúdo dos eventos de espera, as tabelas de eventos de espera atuais e recentes, e como controlar a coleta de eventos de espera, que está desabilitada por padrão.

Exemplo de informação de resumo de eventos de espera:

```sql
mysql> SELECT *
       FROM performance_schema.events_waits_summary_global_by_event_name\G
...
*************************** 6. row ***************************
    EVENT_NAME: wait/synch/mutex/sql/BINARY_LOG::LOCK_index
    COUNT_STAR: 8
SUM_TIMER_WAIT: 2119302
MIN_TIMER_WAIT: 196092
AVG_TIMER_WAIT: 264912
MAX_TIMER_WAIT: 569421
...
*************************** 9. row ***************************
    EVENT_NAME: wait/synch/mutex/sql/hash_filo::lock
    COUNT_STAR: 69
SUM_TIMER_WAIT: 16848828
MIN_TIMER_WAIT: 0
AVG_TIMER_WAIT: 244185
MAX_TIMER_WAIT: 735345
...
```

Cada tabela de resumo de eventos de espera possui uma ou mais colunas de agrupamento para indicar como a tabela agrega eventos. Os nomes dos eventos referem-se aos nomes dos instrumentos de evento na tabela [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 A Tabela setup_instruments"):

* [`events_waits_summary_by_account_by_event_name`](performance-schema-stage-summary-tables.html "25.12.15.2 Stage Summary Tables") possui as colunas `EVENT_NAME`, `USER` e `HOST`. Cada linha resume eventos para uma determinada conta (combinação de user e host) e nome do evento.

* [`events_waits_summary_by_host_by_event_name`](performance-schema-stage-summary-tables.html "25.12.15.2 Stage Summary Tables") possui as colunas `EVENT_NAME` e `HOST`. Cada linha resume eventos para um determinado host e nome do evento.

* [`events_waits_summary_by_instance`](performance-schema-wait-summary-tables.html "25.12.15.1 Wait Event Summary Tables") possui as colunas `EVENT_NAME` e `OBJECT_INSTANCE_BEGIN`. Cada linha resume eventos para um determinado nome de evento e objeto. Se um instrumento for usado para criar múltiplas instâncias, cada instância terá um valor `OBJECT_INSTANCE_BEGIN` exclusivo e será resumida separadamente nesta tabela.

* [`events_waits_summary_by_thread_by_event_name`](performance-schema-wait-summary-tables.html "25.12.15.1 Wait Event Summary Tables") possui as colunas `THREAD_ID` e `EVENT_NAME`. Cada linha resume eventos para um determinado thread e nome do evento.

* [`events_waits_summary_by_user_by_event_name`](performance-schema-stage-summary-tables.html "25.12.15.2 Stage Summary Tables") possui as colunas `EVENT_NAME` e `USER`. Cada linha resume eventos para um determinado user e nome do evento.

* [`events_waits_summary_global_by_event_name`](performance-schema-wait-summary-tables.html "25.12.15.1 Wait Event Summary Tables") possui uma coluna `EVENT_NAME`. Cada linha resume eventos para um determinado nome de evento. Um instrumento pode ser usado para criar múltiplas instâncias do objeto instrumentado. Por exemplo, se houver um instrumento para um mutex que é criado para cada conexão, haverá tantas instâncias quanto conexões. A linha de resumo para o instrumento faz o resumo de todas essas instâncias.

Cada tabela de resumo de eventos de espera possui estas colunas de resumo contendo valores agregados:

* `COUNT_STAR`

  O número de eventos resumidos. Este valor inclui todos os eventos, sejam eles cronometrados (timed) ou não cronometrados (nontimed).

* `SUM_TIMER_WAIT`

  O tempo de espera total dos eventos cronometrados (timed events) resumidos. Este valor é calculado apenas para eventos cronometrados porque eventos não cronometrados possuem um tempo de espera `NULL`. O mesmo é verdade para os outros valores `xxx_TIMER_WAIT`.

* `MIN_TIMER_WAIT`

  O tempo de espera mínimo dos eventos cronometrados resumidos.

* `AVG_TIMER_WAIT`

  O tempo de espera médio dos eventos cronometrados resumidos.

* `MAX_TIMER_WAIT`

  O tempo de espera máximo dos eventos cronometrados resumidos.

O [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") é permitido para tabelas de resumo de espera. Ele tem estes efeitos:

* Para tabelas de resumo não agregadas por account, host ou user, o truncation redefine as colunas de resumo para zero, em vez de remover as linhas.

* Para tabelas de resumo agregadas por account, host ou user, o truncation remove linhas para accounts, hosts ou users sem conexões, e redefine as colunas de resumo para zero para as linhas restantes.

Além disso, cada tabela de resumo de espera que é agregada por account, host, user ou thread é implicitamente truncada pelo truncation da tabela de conexão da qual depende, ou pelo truncation de [`events_waits_summary_global_by_event_name`](performance-schema-wait-summary-tables.html "25.12.15.1 Wait Event Summary Tables"). Para detalhes, consulte [Seção 25.12.8, “Tabelas de Conexão do Performance Schema”](performance-schema-connection-tables.html "25.12.8 Performance Schema Connection Tables").