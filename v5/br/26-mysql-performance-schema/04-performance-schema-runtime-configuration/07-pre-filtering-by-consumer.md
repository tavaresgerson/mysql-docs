### 25.4.7 Pré-Filtragem por Consumer

A tabela `setup_consumers` lista os tipos de **Consumer** disponíveis e quais estão habilitados:

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

Modifique a tabela `setup_consumers` para afetar a pré-filtragem no estágio do **Consumer** e determinar os destinos para os quais os **events** são enviados. Para habilitar ou desabilitar um **Consumer**, defina seu valor `ENABLED` como `YES` ou `NO`.

Modificações na tabela `setup_consumers` afetam o monitoramento imediatamente.

Se você desabilitar um **Consumer**, o servidor não gasta tempo mantendo destinos para aquele **Consumer**. Por exemplo, se você não se importa com informações históricas de **event**, desabilite os **consumers** de histórico:

```sql
UPDATE performance_schema.setup_consumers
SET ENABLED = 'NO'
WHERE NAME LIKE '%history%';
```

As configurações de **Consumer** na tabela `setup_consumers` formam uma hierarquia de níveis mais altos para mais baixos. Os seguintes princípios se aplicam:

* Destinos associados a um **Consumer** não recebem **events** a menos que o **Performance Schema** verifique o **Consumer** e este esteja habilitado.

* Um **Consumer** é verificado somente se todos os **consumers** dos quais ele depende (se houver) estiverem habilitados.

* Se um **Consumer** não for verificado, ou for verificado, mas estiver desabilitado, outros **consumers** que dependem dele não são verificados.

* **Consumers** dependentes podem ter seus próprios **consumers** dependentes.
* Se um **event** não for enviado a nenhum destino, o **Performance Schema** não o produz.

As listas a seguir descrevem os valores de **Consumer** disponíveis. Para uma discussão sobre diversas configurações representativas de **Consumer** e seu efeito na **instrumentation**, consulte Seção 25.4.8, “Exemplo de Configurações de Consumer”.

* Consumers Global e de Thread
* Consumers de Wait Event
* Consumers de Stage Event
* Consumers de Statement Event
* Consumers de Transaction Event
* Consumer de Statement Digest

#### Consumers Global e de Thread

* `global_instrumentation` é o **Consumer** de nível mais alto. Se `global_instrumentation` for `NO`, ele desabilita a **instrumentation** global. Todas as outras configurações são de nível inferior e não são verificadas; o que elas estiverem definidas não importa. Nenhuma informação global ou por **Thread** é mantida e nenhum **event** individual é coletado nas tabelas `current-events` ou `event-history`. Se `global_instrumentation` for `YES`, o **Performance Schema** mantém informações para estados globais e também verifica o **Consumer** `thread_instrumentation`.

* `thread_instrumentation` é verificado apenas se `global_instrumentation` for `YES`. Caso contrário, se `thread_instrumentation` for `NO`, ele desabilita a **instrumentation** específica de **Thread** e todas as configurações de nível inferior são ignoradas. Nenhuma informação é mantida por **Thread** e nenhum **event** individual é coletado nas tabelas `current-events` ou `event-history`. Se `thread_instrumentation` for `YES`, o **Performance Schema** mantém informações específicas de **Thread** e também verifica os **consumers** `events_xxx_current`.

#### Consumers de Wait Event

Estes **consumers** exigem que tanto `global_instrumentation` quanto `thread_instrumentation` sejam `YES`, ou não serão verificados. Se verificados, eles agem da seguinte forma:

* `events_waits_current`, se `NO`, desabilita a coleta de **wait events** individuais na tabela `events_waits_current`. Se `YES`, habilita a coleta de **wait event** e o **Performance Schema** verifica os **consumers** `events_waits_history` e `events_waits_history_long`.

* `events_waits_history` não é verificado se `event_waits_current` for `NO`. Caso contrário, um valor `events_waits_history` de `NO` ou `YES` desabilita ou habilita a coleta de **wait events** na tabela `events_waits_history`.

* `events_waits_history_long` não é verificado se `event_waits_current` for `NO`. Caso contrário, um valor `events_waits_history_long` de `NO` ou `YES` desabilita ou habilita a coleta de **wait events** na tabela `events_waits_history_long`.

#### Consumers de Stage Event

Estes **consumers** exigem que tanto `global_instrumentation` quanto `thread_instrumentation` sejam `YES`, ou não serão verificados. Se verificados, eles agem da seguinte forma:

* `events_stages_current`, se `NO`, desabilita a coleta de **stage events** individuais na tabela `events_stages_current`. Se `YES`, habilita a coleta de **stage event** e o **Performance Schema** verifica os **consumers** `events_stages_history` e `events_stages_history_long`.

* `events_stages_history` não é verificado se `event_stages_current` for `NO`. Caso contrário, um valor `events_stages_history` de `NO` ou `YES` desabilita ou habilita a coleta de **stage events** na tabela `events_stages_history`.

* `events_stages_history_long` não é verificado se `event_stages_current` for `NO`. Caso contrário, um valor `events_stages_history_long` de `NO` ou `YES` desabilita ou habilita a coleta de **stage events** na tabela `events_stages_history_long`.

#### Consumers de Statement Event

Estes **consumers** exigem que tanto `global_instrumentation` quanto `thread_instrumentation` sejam `YES`, ou não serão verificados. Se verificados, eles agem da seguinte forma:

* `events_statements_current`, se `NO`, desabilita a coleta de **statement events** individuais na tabela `events_statements_current`. Se `YES`, habilita a coleta de **statement event** e o **Performance Schema** verifica os **consumers** `events_statements_history` e `events_statements_history_long`.

* `events_statements_history` não é verificado se `events_statements_current` for `NO`. Caso contrário, um valor `events_statements_history` de `NO` ou `YES` desabilita ou habilita a coleta de **statement events** na tabela `events_statements_history`.

* `events_statements_history_long` não é verificado se `events_statements_current` for `NO`. Caso contrário, um valor `events_statements_history_long` de `NO` ou `YES` desabilita ou habilita a coleta de **statement events** na tabela `events_statements_history_long`.

#### Consumers de Transaction Event

Estes **consumers** exigem que tanto `global_instrumentation` quanto `thread_instrumentation` sejam `YES`, ou não serão verificados. Se verificados, eles agem da seguinte forma:

* `events_transactions_current`, se `NO`, desabilita a coleta de **transaction events** individuais na tabela `events_transactions_current`. Se `YES`, habilita a coleta de **transaction event** e o **Performance Schema** verifica os **consumers** `events_transactions_history` e `events_transactions_history_long`.

* `events_transactions_history` não é verificado se `events_transactions_current` for `NO`. Caso contrário, um valor `events_transactions_history` de `NO` ou `YES` desabilita ou habilita a coleta de **transaction events** na tabela `events_transactions_history`.

* `events_transactions_history_long` não é verificado se `events_transactions_current` for `NO`. Caso contrário, um valor `events_transactions_history_long` de `NO` ou `YES` desabilita ou habilita a coleta de **transaction events** na tabela `events_transactions_history_long`.

#### Consumer de Statement Digest

O **Consumer** `statements_digest` exige que `global_instrumentation` seja `YES` ou ele não será verificado. Não há dependência dos **consumers** de **statement event**, então você pode obter estatísticas por **digest** sem ter que coletar estatísticas em `events_statements_current`, o que é vantajoso em termos de **overhead**. Por outro lado, você pode obter **statements** detalhados em `events_statements_current` sem **digests** (as colunas `DIGEST` e `DIGEST_TEXT` serão `NULL`).

Para mais informações sobre **statement digesting**, consulte Seção 25.10, “Statement Digests do Performance Schema”.