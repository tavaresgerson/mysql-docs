### 25.4.7 Pré-filtragem pelo consumidor

A tabela `setup_consumers` lista os tipos de consumidores disponíveis e quais estão habilitados:

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

Modifique a tabela `setup_consumers` para afetar o pré-filtro na etapa do consumidor e determinar os destinos para os quais os eventos são enviados. Para habilitar ou desabilitar um consumidor, defina o valor `ENABLED` para `YES` ou `NO`.

As modificações na tabela `setup_consumers` afetam o monitoramento imediatamente.

Se você desativar um consumidor, o servidor não gastará tempo mantendo destinos para esse consumidor. Por exemplo, se você não se importar com informações de eventos históricos, desative os consumidores de histórico:

```sql
UPDATE performance_schema.setup_consumers
SET ENABLED = 'NO'
WHERE NAME LIKE '%history%';
```

As configurações de consumidor na tabela `setup_consumers` formam uma hierarquia de níveis mais altos para níveis mais baixos. Os seguintes princípios se aplicam:

- Os destinos associados a um consumidor não recebem eventos a menos que o Schema de Desempenho verifique o consumidor e o consumidor esteja habilitado.

- Um consumidor só é verificado se todos os consumidores a que ele depende (se houver) estiverem habilitados.

- Se um consumidor não for verificado ou for verificado, mas desabilitado, outros consumidores que dependem dele não serão verificados.

- Os consumidores dependentes podem ter seus próprios consumidores dependentes.

- Se um evento não for enviado para nenhum destino, o Schema de Desempenho não o produz.

As listas a seguir descrevem os valores de consumo disponíveis. Para discussão sobre várias configurações de consumo representativas e seu efeito na instrumentação, consulte Seção 25.4.8, “Configurações de Consumidor de Exemplo”.

- Consumidores de Schema Global e de Fio
- Consumidores de eventos de espera
- Evento de palco Consumidores de esquema de desempenho
- Evento de declaração de consumo de esquema de desempenho
- Eventos de transação Consumidores
- Resumo de declaração do consumidor do esquema de desempenho

#### Consumidores globais e de thread

- `global_instrumentation` é o consumidor de nível mais alto. Se `global_instrumentation` for `NO`, ele desativa a instrumentação global. Todos os outros ajustes são de nível inferior e não são verificados; não importa para o que eles estejam configurados. Nenhuma informação global ou por thread é mantida e nenhum evento individual é coletado nas tabelas de eventos atuais ou histórico de eventos. Se `global_instrumentation` for `YES`, o Schema de Desempenho mantém informações para estados globais e também verifica o consumidor `thread_instrumentation`.

- A `thread_instrumentation` é verificada apenas se `global_instrumentation` for `YES`. Caso contrário, se `thread_instrumentation` for `NO`, ela desativa a instrumentação específica para o thread e todas as configurações de nível mais baixo são ignoradas. Nenhuma informação é mantida por thread e nenhum evento individual é coletado nas tabelas de eventos atuais ou histórico de eventos. Se `thread_instrumentation` for `YES`, o Schema de Desempenho mantém informações específicas para o thread e também verifica os consumidores `events_xxx_current`.

#### Esperar Eventos Consumidores

Esses consumidores exigem que `global_instrumentation` e `thread_instrumentation` estejam configurados como `YES` ou eles não serão verificados. Se configurados, eles atuam da seguinte forma:

- `events_waits_current`, se `NO`, desabilita a coleta de eventos de espera individuais na tabela `events_waits_current`. Se `YES`, habilita a coleta de eventos de espera e o Schema de Desempenho verifica os consumidores `events_waits_history` e `events_waits_history_long`.

- `events_waits_history` não é verificado se `event_waits_current` for `NO`. Caso contrário, um valor de `events_waits_history` de `NO` ou `YES` desabilita ou habilita a coleta de eventos de espera na tabela `[events_waits_history]` (performance-schema-events-waits-history-table.html).

- `events_waits_history_long` não é verificado se `event_waits_current` for `NO`. Caso contrário, um valor de `events_waits_history_long` de `NO` ou `YES` desabilita ou habilita a coleta de eventos de espera na tabela `[events_waits_history_long]` (performance-schema-events-waits-history-long-table.html).

#### Evento em palco Consumidores

Esses consumidores exigem que `global_instrumentation` e `thread_instrumentation` estejam configurados como `YES` ou eles não serão verificados. Se configurados, eles atuam da seguinte forma:

- `events_stages_current`, se `NO`, desabilita a coleta de eventos individuais de estágio na tabela ``events_stages_current`. Se `YES`, habilita a coleta de eventos de estágio e o Schema de Desempenho verifica os consumidores `events_stages_history`e`events_stages_history_long\`.

- `events_stages_history` não é verificado se `event_stages_current` for `NO`. Caso contrário, um valor de `events_stages_history` de `NO` ou `YES` desabilita ou habilita a coleta de eventos de estágios na tabela `[events_stages_history]` (performance-schema-events-stages-history-table.html).

- `events_stages_history_long` não é verificado se `event_stages_current` for `NO`. Caso contrário, um valor de `events_stages_history_long` de `NO` ou `YES` desabilita ou habilita a coleta de eventos de estágios na tabela `[events_stages_history_long]` (performance-schema-events-stages-history-long-table.html).

#### Evento de declaração para consumidores

Esses consumidores exigem que `global_instrumentation` e `thread_instrumentation` estejam configurados como `YES` ou eles não serão verificados. Se configurados, eles atuam da seguinte forma:

- `events_statements_current`, se `NO`, desabilita a coleta de eventos de declarações individuais na tabela `events_statements_current`. Se `YES`, habilita a coleta de eventos de declarações e o Schema de Desempenho verifica os consumidores `events_statements_history` e `events_statements_history_long`.

- `events_statements_history` não é verificado se `events_statements_current` for `NO`. Caso contrário, um valor de `events_statements_history` de `NO` ou `YES` desabilita ou habilita a coleta de eventos de declarações na tabela `[events_statements_history]` (performance-schema-events-statements-history-table.html).

- `events_statements_history_long` não é verificado se `events_statements_current` for `NO`. Caso contrário, um valor de `events_statements_history_long` de `NO` ou `YES` desabilita ou habilita a coleta de eventos de declarações na tabela `[events_statements_history_long]` (performance-schema-events-statements-history-long-table.html).

#### Evento de transação Consumidores

Esses consumidores exigem que `global_instrumentation` e `thread_instrumentation` estejam configurados como `YES` ou eles não serão verificados. Se configurados, eles atuam da seguinte forma:

- `events_transactions_current`, se `NO`, desabilita a coleta de eventos de transações individuais na tabela ``events_transactions_current`. Se `YES`, habilita a coleta de eventos de transações e o Schema de Desempenho verifica os consumidores `events_transactions_history`e`events_transactions_history_long\`.

- `events_transactions_history` não é verificado se `events_transactions_current` for `NO`. Caso contrário, um valor de `events_transactions_history` de `NO` ou `YES` desabilita ou habilita a coleta de eventos de transações na tabela `[events_transactions_history]` (performance-schema-events-transactions-history-table.html).

- `events_transactions_history_long` não é verificado se `events_transactions_current` for `NO`. Caso contrário, um valor de `events_transactions_history_long` de `NO` ou `YES` desabilita ou habilita a coleta de eventos de transações na tabela `[events_transactions_history_long]` (performance-schema-events-transactions-history-long-table.html).

#### Resumo de declaração do consumidor

O consumidor `statements_digest` exige que `global_instrumentation` seja `YES` ou ele não será verificado. Não há dependência dos consumidores de eventos de declarações, então você pode obter estatísticas por digest sem precisar coletar estatísticas em `events_statements_current`, o que é vantajoso em termos de overhead. Por outro lado, você pode obter declarações detalhadas em `events_statements_current` sem digests (as colunas `DIGEST` e `DIGEST_TEXT` são `NULL`).

Para obter mais informações sobre a digestão de declarações, consulte Seção 25.10, “Digestas de declarações do Schema de Desempenho”.
