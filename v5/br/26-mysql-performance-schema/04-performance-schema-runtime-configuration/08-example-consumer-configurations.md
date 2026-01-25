### 25.4.8 Exemplos de Configurações de Consumers

As configurações de consumer na tabela [`setup_consumers`](performance-schema-setup-consumers-table.html "25.12.2.2 The setup_consumers Table") formam uma hierarquia de níveis mais altos para mais baixos. A discussão a seguir descreve como os consumers funcionam, mostrando configurações específicas e seus efeitos à medida que as configurações de consumer são ativadas progressivamente de cima para baixo. Os valores de consumer mostrados são representativos. Os princípios gerais descritos aqui se aplicam a outros valores de consumer que possam estar disponíveis.

As descrições das configurações ocorrem em ordem crescente de funcionalidade e overhead. Se você não precisar das informações fornecidas pela ativação de configurações de nível inferior, desabilite-as, e o Performance Schema executará menos código em seu nome e você terá menos informação para analisar.

A tabela [`setup_consumers`](performance-schema-setup-consumers-table.html "25.12.2.2 The setup_consumers Table") contém a seguinte hierarquia de valores:

```sql
global_instrumentation
 thread_instrumentation
   events_waits_current
     events_waits_history
     events_waits_history_long
   events_stages_current
     events_stages_history
     events_stages_history_long
   events_statements_current
     events_statements_history
     events_statements_history_long
   events_transactions_current
     events_transactions_history
     events_transactions_history_long
 statements_digest
```

Nota
Na hierarquia de consumer, os consumers para waits, stages, statements e transactions estão todos no mesmo nível. Isso difere da hierarquia de aninhamento de event, na qual wait events se aninham em stage events, que se aninham em statement events, que se aninham em transaction events.

Se uma determinada configuração de consumer for `NO`, o Performance Schema desabilita a instrumentation associada a esse consumer e ignora todas as configurações de nível inferior. Se uma determinada configuração for `YES`, o Performance Schema habilita a instrumentation associada a ela e verifica as configurações no próximo nível mais baixo. Para uma descrição das regras para cada consumer, consulte [Seção 25.4.7, “Pré-Filtragem por Consumer”](performance-schema-consumer-filtering.html "25.4.7 Pre-Filtering by Consumer").

Por exemplo, se `global_instrumentation` estiver ativada, `thread_instrumentation` é verificada. Se `thread_instrumentation` estiver ativada, os consumers `events_xxx_current` são verificados. Se, dentre estes, `events_waits_current` estiver ativado, `events_waits_history` e `events_waits_history_long` são verificados.

Cada uma das descrições de configuração a seguir indica quais elementos de setup o Performance Schema verifica e quais tabelas de saída ele mantém (ou seja, para quais tabelas ele coleta informações).

* [Nenhuma Instrumentation](performance-schema-consumer-configurations.html#performance-schema-consumer-configurations-no-instrumentation "No Instrumentation")
* [Somente Instrumentation Global](performance-schema-consumer-configurations.html#performance-schema-consumer-configurations-global-instrumentation-only "Global Instrumentation Only")
* [Somente Instrumentation Global e Thread](performance-schema-consumer-configurations.html#performance-schema-consumer-configurations-global-and-thread-instrumentation-only "Global and Thread Instrumentation Only")
* [Instrumentation Global, Thread e Current-Event](performance-schema-consumer-configurations.html#performance-schema-consumer-configurations-global-thread-and-current-event-instrumentation "Global, Thread, and Current-Event Instrumentation")
* [Instrumentation Global, Thread, Current-Event e Event-History](performance-schema-consumer-configurations.html#performance-schema-consumer-configurations-global-thread-current-event-and-event-history-instrumentation "Global, Thread, Current-Event, and Event-History instrumentation")

#### Nenhuma Instrumentation

Estado da configuração do Server:

```sql
mysql> SELECT * FROM performance_schema.setup_consumers;
+---------------------------+---------+
| NAME                      | ENABLED |
+---------------------------+---------+
| global_instrumentation    | NO      |
...
+---------------------------+---------+
```

Nesta configuração, nada é instrumentado.

Elementos de Setup verificados:

* Tabela [`setup_consumers`](performance-schema-setup-consumers-table.html "25.12.2.2 The setup_consumers Table"), consumer `global_instrumentation`

Tabelas de saída mantidas:

* Nenhuma

#### Somente Instrumentation Global

Estado da configuração do Server:

```sql
mysql> SELECT * FROM performance_schema.setup_consumers;
+---------------------------+---------+
| NAME                      | ENABLED |
+---------------------------+---------+
| global_instrumentation    | YES     |
| thread_instrumentation    | NO      |
...
+---------------------------+---------+
```

Nesta configuração, a instrumentation é mantida apenas para estados globais. A instrumentation por Thread é desabilitada.

Elementos de Setup adicionais verificados, em relação à configuração anterior:

* Tabela [`setup_consumers`](performance-schema-setup-consumers-table.html "25.12.2.2 The setup_consumers Table"), consumer `thread_instrumentation`

* Tabela [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table")
* Tabela [`setup_objects`](performance-schema-setup-objects-table.html "25.12.2.4 The setup_objects Table")
* Tabela [`setup_timers`](performance-schema-setup-timers-table.html "25.12.2.5 The setup_timers Table")

Tabelas de saída adicionais mantidas, em relação à configuração anterior:

* [`mutex_instances`](performance-schema-mutex-instances-table.html "25.12.3.3 The mutex_instances Table")
* [`rwlock_instances`](performance-schema-rwlock-instances-table.html "25.12.3.4 The rwlock_instances Table")
* [`cond_instances`](performance-schema-cond-instances-table.html "25.12.3.1 The cond_instances Table")
* [`file_instances`](performance-schema-file-instances-table.html "25.12.3.2 The file_instances Table")
* [`users`](performance-schema-users-table.html "25.12.8.3 The users Table")
* [`hosts`](performance-schema-hosts-table.html "25.12.8.2 The hosts Table")
* [`accounts`](performance-schema-accounts-table.html "25.12.8.1 The accounts Table")
* [`socket_summary_by_event_name`](performance-schema-socket-summary-tables.html "25.12.15.8 Socket Summary Tables")
* [`file_summary_by_instance`](performance-schema-file-summary-tables.html "25.12.15.6 File I/O Summary Tables")
* [`file_summary_by_event_name`](performance-schema-file-summary-tables.html "25.12.15.6 File I/O Summary Tables")
* [`objects_summary_global_by_type`](performance-schema-objects-summary-global-by-type-table.html "25.12.15.5 Object Wait Summary Table")
* [`memory_summary_global_by_event_name`](performance-schema-memory-summary-tables.html "25.12.15.9 Memory Summary Tables")
* [`table_lock_waits_summary_by_table`](performance-schema-table-wait-summary-tables.html#performance-schema-table-lock-waits-summary-by-table-table "25.12.15.7.3 The table_lock_waits_summary_by_table Table")
* [`table_io_waits_summary_by_index_usage`](performance-schema-table-wait-summary-tables.html#performance-schema-table-io-waits-summary-by-index-usage-table "25.12.15.7.2 The table_io_waits_summary_by_index_usage Table")
* [`table_io_waits_summary_by_table`](performance-schema-table-wait-summary-tables.html#performance-schema-table-io-waits-summary-by-table-table "25.12.15.7.1 The table_io_waits_summary_by_table Table")
* [`events_waits_summary_by_instance`](performance-schema-wait-summary-tables.html "25.12.15.1 Wait Event Summary Tables")
* [`events_waits_summary_global_by_event_name`](performance-schema-wait-summary-tables.html "25.12.15.1 Wait Event Summary Tables")
* [`events_stages_summary_global_by_event_name`](performance-schema-stage-summary-tables.html "25.12.15.2 Stage Summary Tables")
* [`events_statements_summary_global_by_event_name`](performance-schema-statement-summary-tables.html "25.12.15.3 Statement Summary Tables")
* [`events_transactions_summary_global_by_event_name`](performance-schema-transaction-summary-tables.html "25.12.15.4 Transaction Summary Tables")

#### Somente Instrumentation Global e Thread

Estado da configuração do Server:

```sql
mysql> SELECT * FROM performance_schema.setup_consumers;
+----------------------------------+---------+
| NAME                             | ENABLED |
+----------------------------------+---------+
| global_instrumentation           | YES     |
| thread_instrumentation           | YES     |
| events_waits_current             | NO      |
...
| events_stages_current            | NO      |
...
| events_statements_current        | NO      |
...
| events_transactions_current      | NO      |
...
+----------------------------------+---------+
```

Nesta configuração, a instrumentation é mantida globalmente e por Thread. Nenhum event individual é coletado nas tabelas current-events ou event-history.

Elementos de Setup adicionais verificados, em relação à configuração anterior:

* Tabela [`setup_consumers`](performance-schema-setup-consumers-table.html "25.12.2.2 The setup_consumers Table"), consumers `events_xxx_current`, onde *`xxx`* é `waits`, `stages`, `statements`, `transactions`

* Tabela [`setup_actors`](performance-schema-setup-actors-table.html "25.12.2.1 The setup_actors Table")
* Coluna `threads.instrumented`

Tabelas de saída adicionais mantidas, em relação à configuração anterior:

* `events_xxx_summary_by_yyy_by_event_name`, onde *`xxx`* é `waits`, `stages`, `statements`, `transactions`; e *`yyy`* é `thread`, `user`, `host`, `account`

#### Instrumentation Global, Thread e Current-Event

Estado da configuração do Server:

```sql
mysql> SELECT * FROM performance_schema.setup_consumers;
+----------------------------------+---------+
| NAME                             | ENABLED |
+----------------------------------+---------+
| global_instrumentation           | YES     |
| thread_instrumentation           | YES     |
| events_waits_current             | YES     |
| events_waits_history             | NO      |
| events_waits_history_long        | NO      |
| events_stages_current            | YES     |
| events_stages_history            | NO      |
| events_stages_history_long       | NO      |
| events_statements_current        | YES     |
| events_statements_history        | NO      |
| events_statements_history_long   | NO      |
| events_transactions_current      | YES     |
| events_transactions_history      | NO      |
| events_transactions_history_long | NO      |
...
+----------------------------------+---------+
```

Nesta configuração, a instrumentation é mantida globalmente e por Thread. Events individuais são coletados na tabela current-events, mas não nas tabelas event-history.

Elementos de Setup adicionais verificados, em relação à configuração anterior:

* Consumers `events_xxx_history`, onde *`xxx`* é `waits`, `stages`, `statements`, `transactions`

* Consumers `events_xxx_history_long`, onde *`xxx`* é `waits`, `stages`, `statements`, `transactions`

Tabelas de saída adicionais mantidas, em relação à configuração anterior:

* `events_xxx_current`, onde *`xxx`* é `waits`, `stages`, `statements`, `transactions`

#### Instrumentation Global, Thread, Current-Event e Event-History

A configuração anterior não coleta event history porque os consumers `events_xxx_history` e `events_xxx_history_long` estão desabilitados. Esses consumers podem ser habilitados separadamente ou juntos para coletar event history por Thread, globalmente, ou ambos.

Esta configuração coleta event history por Thread, mas não globalmente:

```sql
mysql> SELECT * FROM performance_schema.setup_consumers;
+----------------------------------+---------+
| NAME                             | ENABLED |
+----------------------------------+---------+
| global_instrumentation           | YES     |
| thread_instrumentation           | YES     |
| events_waits_current             | YES     |
| events_waits_history             | YES     |
| events_waits_history_long        | NO      |
| events_stages_current            | YES     |
| events_stages_history            | YES     |
| events_stages_history_long       | NO      |
| events_statements_current        | YES     |
| events_statements_history        | YES     |
| events_statements_history_long   | NO      |
| events_transactions_current      | YES     |
| events_transactions_history      | YES     |
| events_transactions_history_long | NO      |
...
+----------------------------------+---------+
```

Tabelas de Event-History mantidas para esta configuração:

* `events_xxx_history`, onde *`xxx`* é `waits`, `stages`, `statements`, `transactions`

Esta configuração coleta event history globalmente, mas não por Thread:

```sql
mysql> SELECT * FROM performance_schema.setup_consumers;
+----------------------------------+---------+
| NAME                             | ENABLED |
+----------------------------------+---------+
| global_instrumentation           | YES     |
| thread_instrumentation           | YES     |
| events_waits_current             | YES     |
| events_waits_history             | NO      |
| events_waits_history_long        | YES     |
| events_stages_current            | YES     |
| events_stages_history            | NO      |
| events_stages_history_long       | YES     |
| events_statements_current        | YES     |
| events_statements_history        | NO      |
| events_statements_history_long   | YES     |
| events_transactions_current      | YES     |
| events_transactions_history      | NO      |
| events_transactions_history_long | YES     |
...
+----------------------------------+---------+
```

Tabelas de Event-History mantidas para esta configuração:

* `events_xxx_history_long`, onde *`xxx`* é `waits`, `stages`, `statements`, `transactions`

Esta configuração coleta event history por Thread e globalmente:

```sql
mysql> SELECT * FROM performance_schema.setup_consumers;
+----------------------------------+---------+
| NAME                             | ENABLED |
+----------------------------------+---------+
| global_instrumentation           | YES     |
| thread_instrumentation           | YES     |
| events_waits_current             | YES     |
| events_waits_history             | YES     |
| events_waits_history_long        | YES     |
| events_stages_current            | YES     |
| events_stages_history            | YES     |
| events_stages_history_long       | YES     |
| events_statements_current        | YES     |
| events_statements_history        | YES     |
| events_statements_history_long   | YES     |
| events_transactions_current      | YES     |
| events_transactions_history      | YES     |
| events_transactions_history_long | YES     |
...
+----------------------------------+---------+
```

Tabelas de Event-History mantidas para esta configuração:

* `events_xxx_history`, onde *`xxx`* é `waits`, `stages`, `statements`, `transactions`

* `events_xxx_history_long`, onde *`xxx`* é `waits`, `stages`, `statements`, `transactions`
