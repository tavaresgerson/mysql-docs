### 29.4.7 Pré-filtragem pelo consumidor

A tabela `setup_consumers` lista os tipos de consumidor disponíveis e quais estão habilitados:

```
mysql> SELECT * FROM performance_schema.setup_consumers;
+----------------------------------+---------+
| NAME                             | ENABLED |
+----------------------------------+---------+
| events_stages_current            | NO      |
| events_stages_history            | NO      |
| events_stages_history_long       | NO      |
| events_statements_cpu            | NO      |
| events_statements_current        | YES     |
| events_statements_history        | YES     |
| events_statements_history_long   | NO      |
| events_transactions_current      | YES     |
| events_transactions_history      | YES     |
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

```
UPDATE performance_schema.setup_consumers
SET ENABLED = 'NO'
WHERE NAME LIKE '%history%';
```

As configurações de consumo na tabela `setup_consumers` formam uma hierarquia de níveis mais altos para níveis mais baixos. Os seguintes princípios se aplicam:

- Os destinos associados a um consumidor não recebem eventos a menos que o Schema de Desempenho verifique o consumidor e o consumidor esteja habilitado.

- Um consumidor só é verificado se todos os consumidores a que ele depende (se houver) estiverem habilitados.

- Se um consumidor não for verificado ou for verificado, mas desabilitado, outros consumidores que dependem dele não serão verificados.

- Os consumidores dependentes podem ter seus próprios consumidores dependentes.

- Se um evento não for enviado para nenhum destino, o Schema de Desempenho não o produz.

As listas a seguir descrevem os valores de consumo disponíveis. Para discussão sobre várias configurações de consumo representativas e seu efeito na instrumentação, consulte a Seção 29.4.8, “Configurações de Consumo Exemplos”.

- Consumidores globais e de fio
- Esperar Eventos Consumidores
- Evento em palco Consumidores
- Evento de declaração para consumidores
- Evento de transação Consumidores
- Resumo de declaração do consumidor

#### Consumidores globais e de fio

- `global_instrumentation` é o consumidor de nível mais alto. Se `global_instrumentation` for `NO`, ele desativa a instrumentação global. Todas as outras configurações são de nível inferior e não são verificadas; não importa para o que elas estejam configuradas. Nenhuma informação global ou por thread é mantida e nenhum evento individual é coletado nas tabelas de eventos atuais ou histórico de eventos. Se `global_instrumentation` for `YES`, o Schema de Desempenho mantém informações para estados globais e também verifica o consumidor `thread_instrumentation`.

- `thread_instrumentation` é verificado apenas se `global_instrumentation` é `YES`. Caso contrário, se `thread_instrumentation` for `NO`, desativa a instrumentação específica de threads e todas as configurações de nível mais baixo são ignoradas. Nenhuma informação é mantida por thread e nenhum evento individual é coletado nas tabelas de eventos atuais ou histórico de eventos. Se `thread_instrumentation` for `YES`, o Schema de Desempenho mantém informações específicas de threads e também verifica os consumidores de `events_xxx_current`.

#### Esperar Eventos Consumidores

Esses consumidores exigem que tanto `global_instrumentation` quanto `thread_instrumentation` sejam `YES` ou eles não serão verificados. Se verificados, eles atuam da seguinte forma:

- `events_waits_current`, se `NO`, desativa a coleta de eventos de espera individuais na tabela `events_waits_current`. Se `YES`, habilita a coleta de eventos de espera e o Schema de Desempenho verifica os consumidores `events_waits_history` e `events_waits_history_long`.

- `events_waits_history` não é verificado se `event_waits_current` é `NO`. Caso contrário, um valor `events_waits_history` de `NO` ou `YES` desabilita ou habilita a coleta de eventos de espera na tabela `events_waits_history`.

- `events_waits_history_long` não é verificado se `event_waits_current` é `NO`. Caso contrário, um valor `events_waits_history_long` de `NO` ou `YES` desabilita ou habilita a coleta de eventos de espera na tabela `events_waits_history_long`.

#### Evento em palco Consumidores

Esses consumidores exigem que tanto `global_instrumentation` quanto `thread_instrumentation` sejam `YES` ou eles não serão verificados. Se verificados, eles atuam da seguinte forma:

- `events_stages_current`, se `NO`, desativa a coleta de eventos de estágio na tabela `events_stages_current`. Se `YES`, habilita a coleta de eventos de estágio e o Schema de Desempenho verifica os consumidores `events_stages_history` e `events_stages_history_long`.

- `events_stages_history` não é verificado se `event_stages_current` é `NO`. Caso contrário, um valor `events_stages_history` de `NO` ou `YES` desabilita ou habilita a coleta de eventos de estágio na tabela `events_stages_history`.

- `events_stages_history_long` não é verificado se `event_stages_current` é `NO`. Caso contrário, um valor `events_stages_history_long` de `NO` ou `YES` desabilita ou habilita a coleta de eventos de estágio na tabela `events_stages_history_long`.

#### Evento de declaração para consumidores

Esses consumidores exigem que tanto `global_instrumentation` quanto `thread_instrumentation` sejam `YES` ou eles não serão verificados. Se verificados, eles atuam da seguinte forma:

- `events_statements_cpu`, se `NO`, desativa a medição de `CPU_TIME`. Se `YES`, e a instrumentação estiver habilitada e cronometrada, `CPU_TIME` é medido.

- `events_statements_current`, se `NO`, desativa a coleta de eventos de declaração individuais na tabela `events_statements_current`. Se `YES`, habilita a coleta de eventos de declaração e o Schema de Desempenho verifica os consumidores `events_statements_history` e `events_statements_history_long`.

- `events_statements_history` não é verificado se `events_statements_current` é `NO`. Caso contrário, um valor `events_statements_history` de `NO` ou `YES` desabilita ou habilita a coleta de eventos de declaração na tabela `events_statements_history`.

- `events_statements_history_long` não é verificado se `events_statements_current` é `NO`. Caso contrário, um valor `events_statements_history_long` de `NO` ou `YES` desabilita ou habilita a coleta de eventos de declaração na tabela `events_statements_history_long`.

#### Evento de transação Consumidores

Esses consumidores exigem que tanto `global_instrumentation` quanto `thread_instrumentation` sejam `YES` ou eles não serão verificados. Se verificados, eles atuam da seguinte forma:

- `events_transactions_current`, se `NO`, desativa a coleta de eventos de transação individuais na tabela `events_transactions_current`. Se `YES`, habilita a coleta de eventos de transação e o Schema de Desempenho verifica os consumidores `events_transactions_history` e `events_transactions_history_long`.

- `events_transactions_history` não é verificado se `events_transactions_current` é `NO`. Caso contrário, um valor `events_transactions_history` de `NO` ou `YES` desabilita ou habilita a coleta de eventos de transação na tabela `events_transactions_history`.

- `events_transactions_history_long` não é verificado se `events_transactions_current` é `NO`. Caso contrário, um valor `events_transactions_history_long` de `NO` ou `YES` desabilita ou habilita a coleta de eventos de transação na tabela `events_transactions_history_long`.

#### Resumo de declaração do consumidor

O consumidor `statements_digest` exige que o `global_instrumentation` seja `YES` ou ele não será verificado. Não há dependência dos consumidores de eventos de declaração, então você pode obter estatísticas por digestes sem ter que coletar estatísticas em `events_statements_current`, o que é vantajoso em termos de overhead. Por outro lado, você pode obter declarações detalhadas em `events_statements_current` sem digests (as colunas `DIGEST` e `DIGEST_TEXT` são `NULL` neste caso).

Para obter mais informações sobre a digestão de declarações, consulte a Seção 29.10, “Digestas e Amostragem de Declarações do Schema de Desempenho”.
