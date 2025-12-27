### 29.4.7 Pré-filtragem pelo Consumidor

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

Modifique a tabela `setup_consumers` para afetar o pré-filtro no estágio do consumidor e determinar os destinos para os quais os eventos são enviados. Para habilitar ou desabilitar um consumidor, defina seu valor `ENABLED` para `YES` ou `NO`.

As modificações na tabela `setup_consumers` afetam o monitoramento imediatamente.

Se você desabilitar um consumidor, o servidor não gasta tempo mantendo destinos para esse consumidor. Por exemplo, se você não se importa com a informação histórica dos eventos, desabilite os consumidores de histórico:

```
UPDATE performance_schema.setup_consumers
SET ENABLED = 'NO'
WHERE NAME LIKE '%history%';
```

As configurações do consumidor na tabela `setup_consumers` formam uma hierarquia de níveis mais altos para níveis mais baixos. Os seguintes princípios se aplicam:

* Os destinos associados a um consumidor não recebem eventos a menos que o Schema de Desempenho verifique o consumidor e o consumidor esteja habilitado.

* Um consumidor é verificado apenas se todos os consumidores de que depende (se houver) estiverem habilitados.

* Se um consumidor não for verificado ou for verificado, mas desabilitado, outros consumidores que dependem dele não serão verificados.

* Consumidores dependentes podem ter seus próprios consumidores dependentes.
* Se um evento não for enviado para nenhum destino, o Schema de Desempenho não o produz.

As listas a seguir descrevem os valores de consumidor disponíveis. Para discussão de várias configurações de consumidor representativas e seu efeito na instrumentação, consulte a Seção 29.4.8, “Configurações de Consumidor Exemplo”.

* Consumidores Globais e de Fio
* Consumidores de Evento de Espera
* Consumidores de Evento de Estágio
* Consumidores de Evento de Declaração
* Consumidores de Evento de Transação
* Consumidor de Digest de Declaração

#### Consumidores Globais e de Fio


* `global_instrumentation` é o consumidor de nível mais alto. Se `global_instrumentation` for `NO`, ele desativa a instrumentação global. Todos os outros ajustes são de nível inferior e não são verificados; não importa para o que eles estejam configurados. Nenhuma informação global ou por thread é mantida e nenhum evento individual é coletado nas tabelas de eventos atuais ou de histórico de eventos. Se `global_instrumentation` for `YES`, o Schema de Desempenho mantém informações para estados globais e também verifica os consumidores `thread_instrumentation`.

* `thread_instrumentation` é verificado apenas se `global_instrumentation` for `YES`. Caso contrário, se `thread_instrumentation` for `NO`, ele desativa a instrumentação específica para threads e todos os ajustes de nível inferior são ignorados. Nenhuma informação é mantida por thread e nenhum evento individual é coletado nas tabelas de eventos atuais ou de histórico de eventos. Se `thread_instrumentation` for `YES`, o Schema de Desempenho mantém informações específicas para threads e também verifica os consumidores `events_xxx_current`.

#### Consumidores de Eventos de Aguardar

Esses consumidores exigem que `global_instrumentation` e `thread_instrumentation` estejam configurados como `YES` para serem verificados. Se verificados, eles atuam da seguinte forma:

* `events_waits_current`, se `NO`, desativa a coleta de eventos de espera individuais na tabela `events_waits_current`. Se `YES`, habilita a coleta de eventos de espera e o Schema de Desempenho verifica os consumidores `events_waits_history` e `events_waits_history_long`.

* `events_waits_history` não é verificado se `event_waits_current` for `NO`. Caso contrário, um valor de `events_waits_history` de `NO` ou `YES` desativa ou habilita a coleta de eventos de espera na tabela `events_waits_history`.

* `events_waits_history_long` não é verificado se `event_waits_current` for `NO`. Caso contrário, um valor de `events_waits_history_long` de `NO` ou `YES` desabilita ou habilita a coleta de eventos de espera na tabela `events_waits_history_long`.

#### Consumidores de Eventos de Estágio

Esses consumidores exigem que `global_instrumentation` e `thread_instrumentation` estejam em `YES` ou eles não são verificados. Se verificados, atuam da seguinte forma:

* `events_stages_current`, se `NO`, desabilita a coleta de eventos de estágio individuais na tabela `events_stages_current`. Se `YES`, habilita a coleta de eventos de estágio e o Schema de Desempenho verifica os consumidores `events_stages_history` e `events_stages_history_long`.

* `events_stages_history` não é verificado se `event_stages_current` for `NO`. Caso contrário, um valor de `events_stages_history` de `NO` ou `YES` desabilita ou habilita a coleta de eventos de estágio na tabela `events_stages_history`.

* `events_stages_history_long` não é verificado se `event_stages_current` for `NO`. Caso contrário, um valor de `events_stages_history_long` de `NO` ou `YES` desabilita ou habilita a coleta de eventos de estágio na tabela `events_stages_history_long`.

#### Consumidores de Eventos de Declaração

Esses consumidores exigem que `global_instrumentation` e `thread_instrumentation` estejam em `YES` ou eles não são verificados. Se verificados, atuam da seguinte forma:

* `events_statements_cpu`, se `NO`, desabilita a medição de `CPU_TIME`. Se `YES`, e a instrumentação estiver habilitada e temporizada, `CPU_TIME` é medido.

* `events_statements_current`, se `NO`, desabilita a coleta de eventos de declaração individuais na tabela `events_statements_current`. Se `YES`, habilita a coleta de eventos de declaração e o Schema de Desempenho verifica os consumidores `events_statements_history` e `events_statements_history_long`.

* `events_statements_history` não é verificado se `events_statements_current` for `NO`. Caso contrário, um valor de `events_statements_history` de `NO` ou `YES` desabilita ou habilita a coleta de eventos de declarações na tabela `events_statements_history`.

* `events_statements_history_long` não é verificado se `events_statements_current` for `NO`. Caso contrário, um valor de `events_statements_history_long` de `NO` ou `YES` desabilita ou habilita a coleta de eventos de declarações na tabela `events_statements_history_long`.

#### Consumidores de Eventos de Transação

Esses consumidores exigem que `global_instrumentation` e `thread_instrumentation` estejam em `YES` ou eles não são verificados. Se verificados, atuam da seguinte forma:

* `events_transactions_current`, se `NO`, desabilita a coleta de eventos de transações individuais na tabela `events_transactions_current`. Se `YES`, habilita a coleta de eventos de transações e o Schema de Desempenho verifica os consumidores `events_transactions_history` e `events_transactions_history_long`.

* `events_transactions_history` não é verificado se `events_transactions_current` for `NO`. Caso contrário, um valor de `events_transactions_history` de `NO` ou `YES` desabilita ou habilita a coleta de eventos de transações na tabela `events_transactions_history`.

* `events_transactions_history_long` não é verificado se `events_transactions_current` for `NO`. Caso contrário, um valor de `events_transactions_history_long` de `NO` ou `YES` desabilita ou habilita a coleta de eventos de transações na tabela `events_transactions_history_long`.

#### Consumidor de Digest de Declarações
* `events_statements_history` não é verificado se `events_statements_current` for `NO`. Caso contrário, um valor de `events_statements_history` de `NO` ou `YES` desabilita ou habilita a coleta de eventos de declarações na tabela `events_statements_history`.

* `events_statements_history_long` não é verificado se `events_statements_current` for `NO`. Caso contrário, um valor de `events_statements_history_long` de `NO` ou `YES` desabilita ou habilita a coleta de eventos de declarações na tabela `events_statements_history_long`.

O consumidor `statements_digest` exige que `global_instrumentation` seja `YES` ou ele não será verificado. Não há dependência dos consumidores de eventos de declaração, então você pode obter estatísticas por digest sem precisar coletar estatísticas em `events_statements_current`, o que é vantajoso em termos de overhead. Por outro lado, você pode obter declarações detalhadas em `events_statements_current` sem digests (as colunas `DIGEST` e `DIGEST_TEXT` são `NULL` neste caso).

Para obter mais informações sobre a digestão de declarações, consulte a Seção 29.10, “Digestas e Amostragem de Declarações do Schema de Desempenho”.