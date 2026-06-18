### 25.4.8 Exemplos de Configurações de Consumers

As configurações de consumer na tabela `setup_consumers` formam uma hierarquia de níveis mais altos para mais baixos. A discussão a seguir descreve como os consumers funcionam, mostrando configurações específicas e seus efeitos à medida que as configurações de consumer são ativadas progressivamente de cima para baixo. Os valores de consumer mostrados são representativos. Os princípios gerais descritos aqui se aplicam a outros valores de consumer que possam estar disponíveis.

As descrições das configurações ocorrem em ordem crescente de funcionalidade e overhead. Se você não precisar das informações fornecidas pela ativação de configurações de nível inferior, desabilite-as, e o Performance Schema executará menos código em seu nome e você terá menos informação para analisar.

A tabela `setup_consumers` contém a seguinte hierarquia de valores:

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

Se uma determinada configuração de consumer for `NO`, o Performance Schema desabilita a instrumentation associada a esse consumer e ignora todas as configurações de nível inferior. Se uma determinada configuração for `YES`, o Performance Schema habilita a instrumentation associada a ela e verifica as configurações no próximo nível mais baixo. Para uma descrição das regras para cada consumer, consulte Seção 25.4.7, “Pré-Filtragem por Consumer”.

Por exemplo, se `global_instrumentation` estiver ativada, `thread_instrumentation` é verificada. Se `thread_instrumentation` estiver ativada, os consumers `events_xxx_current` são verificados. Se, dentre estes, `events_waits_current` estiver ativado, `events_waits_history` e `events_waits_history_long` são verificados.

Cada uma das descrições de configuração a seguir indica quais elementos de setup o Performance Schema verifica e quais tabelas de saída ele mantém (ou seja, para quais tabelas ele coleta informações).

* Nenhuma Instrumentation
* Somente Instrumentation Global
* Somente Instrumentation Global e Thread
* Instrumentation Global, Thread e Current-Event
* Instrumentation Global, Thread, Current-Event e Event-History

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

* Tabela `setup_consumers`, consumer `global_instrumentation`

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

* Tabela `setup_consumers`, consumer `thread_instrumentation`

* Tabela `setup_instruments`
* Tabela `setup_objects`
* Tabela `setup_timers`

Tabelas de saída adicionais mantidas, em relação à configuração anterior:

* `mutex_instances`
* `rwlock_instances`
* `cond_instances`
* `file_instances`
* `users`
* `hosts`
* `accounts`
* `socket_summary_by_event_name`
* `file_summary_by_instance`
* `file_summary_by_event_name`
* `objects_summary_global_by_type`
* `memory_summary_global_by_event_name`
* `table_lock_waits_summary_by_table`
* `table_io_waits_summary_by_index_usage`
* `table_io_waits_summary_by_table`
* `events_waits_summary_by_instance`
* `events_waits_summary_global_by_event_name`
* `events_stages_summary_global_by_event_name`
* `events_statements_summary_global_by_event_name`
* `events_transactions_summary_global_by_event_name`

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

* Tabela `setup_consumers`, consumers `events_xxx_current`, onde *`xxx`* é `waits`, `stages`, `statements`, `transactions`

* Tabela `setup_actors`
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
