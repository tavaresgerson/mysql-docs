### 25.4.7 Pré-Filtragem por Consumer

A tabela [`setup_consumers`](performance-schema-setup-consumers-table.html "25.12.2.2 The setup_consumers Table") lista os tipos de **Consumer** disponíveis e quais estão habilitados:

```sql
mysql> SELECT * FROM performance_schema.setup_consumers;
+----------------------------------+---------+
| NAME                             | ENABLED |
+----------------------------------+---------+
| events_stages_current            | NO      |
| events_stages_history            | NO      |
| events_stages_history_long       | NO      |
| events_statements_current        | YES     |
| events_statements_history        | YES     |
| events_statements_history_long   | NO      |
| events_transactions_current      | NO      |
| events_transactions_history      | NO      |
| events_transactions_history_long | NO      |
| events_waits_current             | NO      |
| events_waits_history             | NO      |
| events_waits_history_long        | NO      |
| global_instrumentation           | YES     |
| thread_instrumentation           | YES     |
| statements_digest                | YES     |
+----------------------------------+---------+
```

Modifique a tabela [`setup_consumers`](performance-schema-setup-consumers-table.html "25.12.2.2 The setup_consumers Table") para afetar a pré-filtragem no estágio do **Consumer** e determinar os destinos para os quais os **events** são enviados. Para habilitar ou desabilitar um **Consumer**, defina seu valor `ENABLED` como `YES` ou `NO`.

Modificações na tabela [`setup_consumers`](performance-schema-setup-consumers-table.html "25.12.2.2 The setup_consumers Table") afetam o monitoramento imediatamente.

Se você desabilitar um **Consumer**, o servidor não gasta tempo mantendo destinos para aquele **Consumer**. Por exemplo, se você não se importa com informações históricas de **event**, desabilite os **consumers** de histórico:

```sql
UPDATE performance_schema.setup_consumers
SET ENABLED = 'NO'
WHERE NAME LIKE '%history%';
```

As configurações de **Consumer** na tabela [`setup_consumers`](performance-schema-setup-consumers-table.html "25.12.2.2 The setup_consumers Table") formam uma hierarquia de níveis mais altos para mais baixos. Os seguintes princípios se aplicam:

* Destinos associados a um **Consumer** não recebem **events** a menos que o **Performance Schema** verifique o **Consumer** e este esteja habilitado.

* Um **Consumer** é verificado somente se todos os **consumers** dos quais ele depende (se houver) estiverem habilitados.

* Se um **Consumer** não for verificado, ou for verificado, mas estiver desabilitado, outros **consumers** que dependem dele não são verificados.

* **Consumers** dependentes podem ter seus próprios **consumers** dependentes.
* Se um **event** não for enviado a nenhum destino, o **Performance Schema** não o produz.

As listas a seguir descrevem os valores de **Consumer** disponíveis. Para uma discussão sobre diversas configurações representativas de **Consumer** e seu efeito na **instrumentation**, consulte [Seção 25.4.8, “Exemplo de Configurações de Consumer”](performance-schema-consumer-configurations.html "25.4.8 Example Consumer Configurations").

* [Consumers Global e de Thread](performance-schema-consumer-filtering.html#performance-schema-consumer-filtering-global-thread "Global and Thread Consumers")
* [Consumers de Wait Event](performance-schema-consumer-filtering.html#performance-schema-consumer-filtering-wait-event "Wait Event Consumers")
* [Consumers de Stage Event](performance-schema-consumer-filtering.html#performance-schema-consumer-filtering-stage-event "Stage Event Consumers")
* [Consumers de Statement Event](performance-schema-consumer-filtering.html#performance-schema-consumer-filtering-statement-event "Statement Event Consumers")
* [Consumers de Transaction Event](performance-schema-consumer-filtering.html#performance-schema-consumer-filtering-transaction-event "Transaction Event Consumers")
* [Consumer de Statement Digest](performance-schema-consumer-filtering.html#performance-schema-consumer-filtering-statement-digest "Statement Digest Consumer")

#### Consumers Global e de Thread

* `global_instrumentation` é o **Consumer** de nível mais alto. Se `global_instrumentation` for `NO`, ele desabilita a **instrumentation** global. Todas as outras configurações são de nível inferior e não são verificadas; o que elas estiverem definidas não importa. Nenhuma informação global ou por **Thread** é mantida e nenhum **event** individual é coletado nas tabelas `current-events` ou `event-history`. Se `global_instrumentation` for `YES`, o **Performance Schema** mantém informações para estados globais e também verifica o **Consumer** `thread_instrumentation`.

* `thread_instrumentation` é verificado apenas se `global_instrumentation` for `YES`. Caso contrário, se `thread_instrumentation` for `NO`, ele desabilita a **instrumentation** específica de **Thread** e todas as configurações de nível inferior são ignoradas. Nenhuma informação é mantida por **Thread** e nenhum **event** individual é coletado nas tabelas `current-events` ou `event-history`. Se `thread_instrumentation` for `YES`, o **Performance Schema** mantém informações específicas de **Thread** e também verifica os **consumers** `events_xxx_current`.

#### Consumers de Wait Event

Estes **consumers** exigem que tanto `global_instrumentation` quanto `thread_instrumentation` sejam `YES`, ou não serão verificados. Se verificados, eles agem da seguinte forma:

* `events_waits_current`, se `NO`, desabilita a coleta de **wait events** individuais na tabela [`events_waits_current`](performance-schema-events-waits-current-table.html "25.12.4.1 The events_waits_current Table"). Se `YES`, habilita a coleta de **wait event** e o **Performance Schema** verifica os **consumers** `events_waits_history` e `events_waits_history_long`.

* `events_waits_history` não é verificado se `event_waits_current` for `NO`. Caso contrário, um valor `events_waits_history` de `NO` ou `YES` desabilita ou habilita a coleta de **wait events** na tabela [`events_waits_history`](performance-schema-events-waits-history-table.html "25.12.4.2 The events_waits_history Table").

* `events_waits_history_long` não é verificado se `event_waits_current` for `NO`. Caso contrário, um valor `events_waits_history_long` de `NO` ou `YES` desabilita ou habilita a coleta de **wait events** na tabela [`events_waits_history_long`](performance-schema-events-waits-history-long-table.html "25.12.4.3 The events_waits_history_long Table").

#### Consumers de Stage Event

Estes **consumers** exigem que tanto `global_instrumentation` quanto `thread_instrumentation` sejam `YES`, ou não serão verificados. Se verificados, eles agem da seguinte forma:

* `events_stages_current`, se `NO`, desabilita a coleta de **stage events** individuais na tabela [`events_stages_current`](performance-schema-events-stages-current-table.html "25.12.5.1 The events_stages_current Table"). Se `YES`, habilita a coleta de **stage event** e o **Performance Schema** verifica os **consumers** `events_stages_history` e `events_stages_history_long`.

* `events_stages_history` não é verificado se `event_stages_current` for `NO`. Caso contrário, um valor `events_stages_history` de `NO` ou `YES` desabilita ou habilita a coleta de **stage events** na tabela [`events_stages_history`](performance-schema-events-stages-history-table.html "25.12.5.2 The events_stages_history Table").

* `events_stages_history_long` não é verificado se `event_stages_current` for `NO`. Caso contrário, um valor `events_stages_history_long` de `NO` ou `YES` desabilita ou habilita a coleta de **stage events** na tabela [`events_stages_history_long`](performance-schema-events-stages-history-long-table.html "25.12.5.3 The events_stages_history_long Table").

#### Consumers de Statement Event

Estes **consumers** exigem que tanto `global_instrumentation` quanto `thread_instrumentation` sejam `YES`, ou não serão verificados. Se verificados, eles agem da seguinte forma:

* `events_statements_current`, se `NO`, desabilita a coleta de **statement events** individuais na tabela [`events_statements_current`](performance-schema-events-statements-current-table.html "25.12.6.1 The events_statements_current Table"). Se `YES`, habilita a coleta de **statement event** e o **Performance Schema** verifica os **consumers** `events_statements_history` e `events_statements_history_long`.

* `events_statements_history` não é verificado se `events_statements_current` for `NO`. Caso contrário, um valor `events_statements_history` de `NO` ou `YES` desabilita ou habilita a coleta de **statement events** na tabela [`events_statements_history`](performance-schema-events-statements-history-table.html "25.12.6.2 The events_statements_history Table").

* `events_statements_history_long` não é verificado se `events_statements_current` for `NO`. Caso contrário, um valor `events_statements_history_long` de `NO` ou `YES` desabilita ou habilita a coleta de **statement events** na tabela [`events_statements_history_long`](performance-schema-events-statements-history-long-table.html "25.12.6.3 The events_statements_history_long Table").

#### Consumers de Transaction Event

Estes **consumers** exigem que tanto `global_instrumentation` quanto `thread_instrumentation` sejam `YES`, ou não serão verificados. Se verificados, eles agem da seguinte forma:

* `events_transactions_current`, se `NO`, desabilita a coleta de **transaction events** individuais na tabela [`events_transactions_current`](performance-schema-events-transactions-current-table.html "25.12.7.1 The events_transactions_current Table"). Se `YES`, habilita a coleta de **transaction event** e o **Performance Schema** verifica os **consumers** `events_transactions_history` e `events_transactions_history_long`.

* `events_transactions_history` não é verificado se `events_transactions_current` for `NO`. Caso contrário, um valor `events_transactions_history` de `NO` ou `YES` desabilita ou habilita a coleta de **transaction events** na tabela [`events_transactions_history`](performance-schema-events-transactions-history-table.html "25.12.7.2 The events_transactions_history Table").

* `events_transactions_history_long` não é verificado se `events_transactions_current` for `NO`. Caso contrário, um valor `events_transactions_history_long` de `NO` ou `YES` desabilita ou habilita a coleta de **transaction events** na tabela [`events_transactions_history_long`](performance-schema-events-transactions-history-long-table.html "25.12.7.3 The events_transactions_history_long Table").

#### Consumer de Statement Digest

O **Consumer** `statements_digest` exige que `global_instrumentation` seja `YES` ou ele não será verificado. Não há dependência dos **consumers** de **statement event**, então você pode obter estatísticas por **digest** sem ter que coletar estatísticas em [`events_statements_current`](performance-schema-events-statements-current-table.html "25.12.6.1 The events_statements_current Table"), o que é vantajoso em termos de **overhead**. Por outro lado, você pode obter **statements** detalhados em [`events_statements_current`](performance-schema-events-statements-current-table.html "25.12.6.1 The events_statements_current Table") sem **digests** (as colunas `DIGEST` e `DIGEST_TEXT` serão `NULL`).

Para mais informações sobre **statement digesting**, consulte [Seção 25.10, “Statement Digests do Performance Schema”](performance-schema-statement-digests.html "25.10 Performance Schema Statement Digests").