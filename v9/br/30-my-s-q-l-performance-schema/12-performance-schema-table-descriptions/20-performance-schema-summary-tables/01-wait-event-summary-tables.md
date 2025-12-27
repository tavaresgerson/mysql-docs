#### 29.12.20.1 Resumo de tabelas de eventos de espera

O Schema de Desempenho mantém tabelas para coletar eventos de espera atuais e recentes, e agrega essas informações em tabelas de resumo. A Seção 29.12.4, “Tabelas de Eventos de Espera do Schema de Desempenho”, descreve os eventos sobre os quais os resumos de espera são baseados. Consulte essa discussão para obter informações sobre o conteúdo dos eventos de espera, as tabelas de eventos de espera atuais e recentes, e como controlar a coleta de eventos de espera, que está desativada por padrão.

Informações de resumo de eventos de espera de exemplo:

```
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

Cada tabela de resumo de eventos de espera tem uma ou mais colunas de agrupamento para indicar como a tabela agrega eventos. Os nomes dos eventos referem-se a nomes de instrumentos de evento na tabela `setup_instruments`:

* `events_waits_summary_by_account_by_event_name` tem as colunas `EVENT_NAME`, `USER` e `HOST`. Cada linha resume eventos para uma conta específica (combinação de usuário e host) e nome de evento.

* `events_waits_summary_by_host_by_event_name` tem as colunas `EVENT_NAME` e `HOST`. Cada linha resume eventos para um host específico e nome de evento.

* `events_waits_summary_by_instance` tem as colunas `EVENT_NAME` e `OBJECT_INSTANCE_BEGIN`. Cada linha resume eventos para um nome de evento específico e objeto. Se um instrumento é usado para criar múltiplas instâncias, cada instância tem um valor único de `OBJECT_INSTANCE_BEGIN` e é resumida separadamente nesta tabela.

* `events_waits_summary_by_thread_by_event_name` tem as colunas `THREAD_ID` e `EVENT_NAME`. Cada linha resume eventos para um thread específico e nome de evento.

* `events_waits_summary_by_user_by_event_name` tem as colunas `EVENT_NAME` e `USER`. Cada linha resume eventos para um usuário específico e nome de evento.

* `events_waits_summary_global_by_event_name` tem uma coluna `EVENT_NAME`. Cada linha resume eventos para um nome de evento específico. Um instrumento pode ser usado para criar múltiplas instâncias do objeto instrumentado. Por exemplo, se houver um instrumento para um mutex que é criado para cada conexão, há tantas instâncias quanto conexões. A linha de resumo do instrumento resume todas essas instâncias.

Cada tabela de resumo de eventos de espera tem essas colunas de resumo contendo valores agregados:

* `COUNT_STAR`

  O número de eventos resumidos. Esse valor inclui todos os eventos, sejam eles temporizados ou não.

* `SUM_TIMER_WAIT`

  O tempo total de espera dos eventos temporizados resumidos. Esse valor é calculado apenas para eventos temporizados, pois os eventos não temporizados têm um tempo de espera de `NULL`. O mesmo vale para os outros valores `xxx_TIMER_WAIT`.

* `MIN_TIMER_WAIT`

  O tempo mínimo de espera dos eventos temporizados resumidos.

* `AVG_TIMER_WAIT`

  O tempo médio de espera dos eventos temporizados resumidos.

* `MAX_TIMER_WAIT`

  O tempo máximo de espera dos eventos temporizados resumidos.

As tabelas de resumo de eventos de espera têm esses índices:

* `events_waits_summary_by_account_by_event_name`:

  + Chave primária em (`USER`, `HOST`, `EVENT_NAME`)

* `events_waits_summary_by_host_by_event_name`:

  + Chave primária em (`HOST`, `EVENT_NAME`)

* `events_waits_summary_by_instance`:

  + Chave primária em (`OBJECT_INSTANCE_BEGIN`)

  + ÍNDICE em (`EVENT_NAME`)
* `events_waits_summary_by_thread_by_event_name`:

  + Chave primária em (`THREAD_ID`, `EVENT_NAME`)

* `events_waits_summary_by_user_by_event_name`:

  + Chave primária em (`USER`, `EVENT_NAME`)

* `events_waits_summary_global_by_event_name`:

  + Chave primária em (`EVENT_NAME`)

A `TRUNCATE TABLE` é permitida para tabelas de resumo de espera. Ela tem esses efeitos:

* Para tabelas de espera que não são agregadas por conta, host ou usuário, o truncamento redefine as colunas de resumo para zero, em vez de remover linhas.

* Para tabelas de espera agregadas por conta, host ou usuário, o truncamento remove linhas de contas, hosts ou usuários sem conexões e redefine as colunas de resumo para zero para as linhas restantes.

Além disso, cada tabela de resumo de espera que é agregada por conta, host, usuário ou thread é implicitamente truncada pelo truncamento da tabela de conexão na qual depende, ou pelo truncamento de `events_waits_summary_global_by_event_name`. Para obter detalhes, consulte a Seção 29.12.8, “Tabelas de Conexão do Schema de Desempenho”.