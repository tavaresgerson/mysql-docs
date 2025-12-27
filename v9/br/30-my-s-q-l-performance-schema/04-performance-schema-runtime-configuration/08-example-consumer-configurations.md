### 29.4.8 Exemplo de Configurações de Consumidor

As configurações de consumidor na tabela `setup_consumers` formam uma hierarquia de níveis mais altos para níveis mais baixos. A discussão a seguir descreve como os consumidores funcionam, mostrando configurações específicas e seus efeitos à medida que as configurações de consumidor são habilitadas progressivamente de alto para baixo. Os valores dos consumidores mostrados são representativos. Os princípios gerais descritos aqui se aplicam a outros valores de consumidor que podem estar disponíveis.

As descrições de configuração ocorrem em ordem de funcionalidade e overhead crescentes. Se você não precisar das informações fornecidas ao habilitar configurações de nível mais baixo, desabilite-as para que o Schema de Desempenho execute menos código em seu nome e haja menos informações para analisar.

A tabela `setup_consumers` contém a seguinte hierarquia de valores:

```
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

Na hierarquia de consumidor, os consumidores para espera, estágios, declarações e transações estão todos no mesmo nível. Isso difere da hierarquia de ninhamento de eventos, para a qual os eventos de espera se aninham dentro dos eventos de estágio, que se aninham dentro dos eventos de declaração, que se aninham dentro dos eventos de transação.

Se uma configuração de consumidor específica for `NO`, o Schema de Desempenho desabilita a instrumentação associada ao consumidor e ignora todas as configurações de nível mais baixo. Se uma configuração específica for `YES`, o Schema de Desempenho habilita a instrumentação associada a ela e verifica as configurações no nível imediatamente mais baixo. Para uma descrição das regras para cada consumidor, consulte a Seção 29.4.7, “Pré-filtragem por Consumidor”.

Por exemplo, se `global_instrumentation` estiver habilitado, `thread_instrumentation` será verificado. Se `thread_instrumentation` estiver habilitado, os consumidores `events_xxx_current` serão verificados. Se `events_waits_current` estiver habilitado, `events_waits_history` e `events_waits_history_long` serão verificados.

Cada uma das seguintes descrições de configuração indica quais elementos de configuração o Schema de Desempenho verifica e quais tabelas de saída mantém (ou seja, para quais tabelas coleta informações).

* Sem Instrumentação
* Apenas Instrumentação Global
* Apenas Instrumentação Global e de Fuso
* Instrumentação Global, de Fuso e de Eventos Atuais
* Instrumentação Global, de Fuso, de Eventos Atuais e de Histórico de Eventos

#### Sem Instrumentação

Estado da configuração do servidor:

```
mysql> SELECT * FROM performance_schema.setup_consumers;
+---------------------------+---------+
| NAME                      | ENABLED |
+---------------------------+---------+
| global_instrumentation    | NO      |
...
+---------------------------+---------+
```

Nesta configuração, nada é instrumentado.

Elementos de configuração verificados:

* Tabela `setup_consumers`, consumidor `global_instrumentation`

Tabelas de saída mantidas:

* Nenhuma

#### Apenas Instrumentação Global

Estado da configuração do servidor:

```
mysql> SELECT * FROM performance_schema.setup_consumers;
+---------------------------+---------+
| NAME                      | ENABLED |
+---------------------------+---------+
| global_instrumentation    | YES     |
| thread_instrumentation    | NO      |
...
+---------------------------+---------+
```

Nesta configuração, a instrumentação é mantida apenas para estados globais. A instrumentação por fuso é desabilitada.

Elementos de configuração adicionais verificados, em relação à configuração anterior:

* Tabela `setup_consumers`, consumidor `thread_instrumentation`
* Tabela `setup_instruments`
* Tabela `setup_objects`

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

#### Apenas Instrumentação Global e de Trânsito

Estado de configuração do servidor:

```
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

Nesta configuração, a instrumentação é mantida globalmente e por transito. Nenhum evento individual é coletado nas tabelas de eventos atuais ou de histórico de eventos.

Elementos de configuração adicionais verificados, em relação à configuração anterior:

* Tabela `setup_consumers`, consumidores `events_xxx_current`, onde *`xxx`* é `waits`, `stages`, `statements`, `transactions`
* Tabela `setup_actors`
* Coluna `threads.instrumented`

Tabelas de saída adicionais mantidas, em relação à configuração anterior:
```
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
```71nFSUcnEs```
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
```4329HZtMSl```
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
```jRDkKrw5HM```
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
```M7pUCU9LF6```

Tabelas de histórico de eventos mantidas para esta configuração:

* `events_xxx_history`, onde *`xxx`* é `waits`, `stages`, `statements`, `transactions`

* `events_xxx_history_long`, onde *`xxx`* é `waits`, `stages`, `statements`, `transactions`