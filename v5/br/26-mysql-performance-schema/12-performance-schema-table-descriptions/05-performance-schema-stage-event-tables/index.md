### 25.12.5 Tabelas de Eventos de Estágio (Stage Event Tables) do Performance Schema

25.12.5.1 The events_stages_current Table

25.12.5.2 The events_stages_history Table

25.12.5.3 The events_stages_history_long Table

O Performance Schema instrumenta estágios (stages), que são passos durante o processo de execução de Statement, como analisar um Statement (parsing), abrir uma tabela ou realizar uma operação de `filesort`. Os Stages correspondem aos estados de Thread exibidos por `SHOW PROCESSLIST` ou que estão visíveis na tabela `PROCESSLIST` do Information Schema (`information-schema-processlist-table.html`). Os Stages começam e terminam quando os valores de estado mudam.

Dentro da hierarquia de eventos, eventos de espera (wait events) se aninham dentro de eventos de estágio (stage events), que se aninham dentro de eventos de Statement, que se aninham dentro de eventos de transação.

Estas tabelas armazenam eventos de Stage:

* `events_stages_current`: O evento de Stage atual para cada Thread.

* `events_stages_history`: Os eventos de Stage mais recentes que terminaram por Thread.

* `events_stages_history_long`: Os eventos de Stage mais recentes que terminaram globalmente (em todas as Threads).

As seções a seguir descrevem as tabelas de eventos de Stage. Existem também tabelas de resumo que agregam informações sobre eventos de Stage; consulte Seção 25.12.15.2, “Tabelas de Resumo de Stage (Stage Summary Tables)”.

Para mais informações sobre o relacionamento entre as três tabelas de eventos de Stage, consulte Seção 25.9, “Tabelas do Performance Schema para Eventos Atuais e Históricos”.

* Configurando a Coleta de Eventos de Estágio
* Informações de Progresso de Eventos de Estágio

#### Configurando a Coleta de Eventos de Estágio (Stage Event Collection)

Para controlar se os eventos de Stage devem ser coletados, defina o estado dos Instruments e Consumers relevantes:

* A tabela `setup_instruments` contém Instruments com nomes que começam com `stage`. Use estes Instruments para habilitar ou desabilitar a coleta de classes individuais de eventos de Stage.

* A tabela `setup_consumers` contém valores de Consumer com nomes correspondentes aos nomes das tabelas de eventos de Stage atuais e históricas. Use estes Consumers para filtrar a coleta de eventos de Stage.

Exceto pelos Instruments que fornecem informações de progresso de Statement, os Instruments de Stage são desabilitados por padrão. Por exemplo:

```sql
mysql> SELECT *
       FROM performance_schema.setup_instruments
       WHERE NAME RLIKE 'stage/sql/[a-c]';
+----------------------------------------------------+---------+-------+
| NAME                                               | ENABLED | TIMED |
+----------------------------------------------------+---------+-------+
| stage/sql/After create                             | NO      | NO    |
| stage/sql/allocating local table                   | NO      | NO    |
| stage/sql/altering table                           | NO      | NO    |
| stage/sql/committing alter table to storage engine | NO      | NO    |
| stage/sql/Changing master                          | NO      | NO    |
| stage/sql/Checking master version                  | NO      | NO    |
| stage/sql/checking permissions                     | NO      | NO    |
| stage/sql/checking privileges on cached query      | NO      | NO    |
| stage/sql/checking query cache for query           | NO      | NO    |
| stage/sql/cleaning up                              | NO      | NO    |
| stage/sql/closing tables                           | NO      | NO    |
| stage/sql/Connecting to master                     | NO      | NO    |
| stage/sql/converting HEAP to MyISAM                | NO      | NO    |
| stage/sql/Copying to group table                   | NO      | NO    |
| stage/sql/Copying to tmp table                     | NO      | NO    |
| stage/sql/copy to tmp table                        | NO      | NO    |
| stage/sql/Creating sort index                      | NO      | NO    |
| stage/sql/creating table                           | NO      | NO    |
| stage/sql/Creating tmp table                       | NO      | NO    |
+----------------------------------------------------+---------+-------+
```

Os Instruments de eventos de Stage que fornecem informações de progresso de Statement são habilitados e cronometrados (timed) por padrão:

```sql
mysql> SELECT *
       FROM performance_schema.setup_instruments
       WHERE ENABLED='YES' AND NAME LIKE "stage/%";
+------------------------------------------------------+---------+-------+
| NAME                                                 | ENABLED | TIMED |
+------------------------------------------------------+---------+-------+
| stage/sql/copy to tmp table                          | YES     | YES   |
| stage/innodb/alter table (end)                       | YES     | YES   |
| stage/innodb/alter table (flush)                     | YES     | YES   |
| stage/innodb/alter table (insert)                    | YES     | YES   |
| stage/innodb/alter table (log apply index)           | YES     | YES   |
| stage/innodb/alter table (log apply table)           | YES     | YES   |
| stage/innodb/alter table (merge sort)                | YES     | YES   |
| stage/innodb/alter table (read PK and internal sort) | YES     | YES   |
| stage/innodb/buffer pool load                        | YES     | YES   |
+------------------------------------------------------+---------+-------+
```

Os Consumers de Stage são desabilitados por padrão:

```sql
mysql> SELECT *
       FROM performance_schema.setup_consumers
       WHERE NAME LIKE 'events_stages%';
+----------------------------+---------+
| NAME                       | ENABLED |
+----------------------------+---------+
| events_stages_current      | NO      |
| events_stages_history      | NO      |
| events_stages_history_long | NO      |
+----------------------------+---------+
```

Para controlar a coleta de eventos de Stage na inicialização do servidor, use linhas como estas no seu arquivo `my.cnf`:

* Habilitar:

  ```sql
  [mysqld]
  performance-schema-instrument='stage/%=ON'
  performance-schema-consumer-events-stages-current=ON
  performance-schema-consumer-events-stages-history=ON
  performance-schema-consumer-events-stages-history-long=ON
  ```

* Desabilitar:

  ```sql
  [mysqld]
  performance-schema-instrument='stage/%=OFF'
  performance-schema-consumer-events-stages-current=OFF
  performance-schema-consumer-events-stages-history=OFF
  performance-schema-consumer-events-stages-history-long=OFF
  ```

Para controlar a coleta de eventos de Stage em tempo de execução (runtime), atualize as tabelas `setup_instruments` e `setup_consumers`:

* Habilitar:

  ```sql
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'YES', TIMED = 'YES'
  WHERE NAME LIKE 'stage/%';

  UPDATE performance_schema.setup_consumers
  SET ENABLED = 'YES'
  WHERE NAME LIKE 'events_stages%';
  ```

* Desabilitar:

  ```sql
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'NO', TIMED = 'NO'
  WHERE NAME LIKE 'stage/%';

  UPDATE performance_schema.setup_consumers
  SET ENABLED = 'NO'
  WHERE NAME LIKE 'events_stages%';
  ```

Para coletar apenas eventos de Stage específicos, habilite somente os Instruments de Stage correspondentes. Para coletar eventos de Stage apenas para tabelas de eventos de Stage específicas, habilite os Instruments de Stage, mas apenas os Consumers de Stage correspondentes às tabelas desejadas.

A tabela `setup_timers` contém uma linha com um valor `NAME` de `stage` que indica a unidade para o cronometragem de eventos de Stage. A unidade padrão é `NANOSECOND`:

```sql
mysql> SELECT *
       FROM performance_schema.setup_timers
       WHERE NAME = 'stage';
+-------+------------+
| NAME  | TIMER_NAME |
+-------+------------+
| stage | NANOSECOND |
+-------+------------+
```

Para alterar a unidade de cronometragem, modifique o valor de `TIMER_NAME`:

```sql
UPDATE performance_schema.setup_timers
SET TIMER_NAME = 'MICROSECOND'
WHERE NAME = 'stage';
```

Para informações adicionais sobre a configuração da coleta de eventos, consulte Seção 25.3, “Configuração de Inicialização do Performance Schema”, e Seção 25.4, “Configuração de Tempo de Execução do Performance Schema”.

#### Informações de Progresso de Eventos de Estágio (Stage Event Progress Information)

As tabelas de eventos de Stage do Performance Schema contêm duas colunas que, juntas, fornecem um indicador de progresso de Stage para cada linha:

* `WORK_COMPLETED`: O número de unidades de trabalho concluídas para o Stage.

* `WORK_ESTIMATED`: O número de unidades de trabalho esperado para o Stage.

Cada coluna é `NULL` se nenhuma informação de progresso for fornecida para um Instrument. A interpretação da informação, se disponível, depende inteiramente da implementação do Instrument. As tabelas do Performance Schema fornecem um container para armazenar dados de progresso, mas não fazem suposições sobre a semântica da métrica em si:

* Uma "unidade de trabalho" (work unit) é uma métrica inteira que aumenta ao longo do tempo durante a execução, como o número de bytes, linhas, arquivos ou tabelas processadas. A definição de "unidade de trabalho" para um Instrument específico é deixada para o código de instrumentação que fornece os dados.

* O valor de `WORK_COMPLETED` pode aumentar uma ou muitas unidades por vez, dependendo do código instrumentado.

* O valor de `WORK_ESTIMATED` pode mudar durante o Stage, dependendo do código instrumentado.

A instrumentação para um indicador de progresso de evento de Stage pode implementar qualquer um dos seguintes comportamentos:

* Nenhuma instrumentação de progresso

  Este é o caso mais comum, onde nenhum dado de progresso é fornecido. As colunas `WORK_COMPLETED` e `WORK_ESTIMATED` são ambas `NULL`.

* Instrumentação de progresso ilimitado (Unbounded progress instrumentation)

  Apenas a coluna `WORK_COMPLETED` é significativa. Nenhum dado é fornecido para a coluna `WORK_ESTIMATED`, que exibe 0.

  Ao consultar a tabela `events_stages_current` para a sessão monitorada, um aplicativo de monitoramento pode relatar quanto trabalho foi realizado até agora, mas não pode relatar se o Stage está perto da conclusão. Atualmente, nenhum Stage é instrumentado dessa forma.

* Instrumentação de progresso limitado (Bounded progress instrumentation)

  As colunas `WORK_COMPLETED` e `WORK_ESTIMATED` são ambas significativas.

  Este tipo de indicador de progresso é apropriado para uma operação com um critério de conclusão definido, como o Instrument de cópia de tabela descrito posteriormente. Ao consultar a tabela `events_stages_current` para a sessão monitorada, um aplicativo de monitoramento pode relatar quanto trabalho foi realizado até agora, e pode relatar o percentual geral de conclusão para o Stage, calculando a razão `WORK_COMPLETED` / `WORK_ESTIMATED`.

O Instrument `stage/sql/copy to tmp table` ilustra como funcionam os indicadores de progresso. Durante a execução de um Statement `ALTER TABLE`, o Stage `stage/sql/copy to tmp table` é utilizado, e este Stage pode ser executado por um longo período, dependendo do tamanho dos dados a serem copiados.

A tarefa de cópia de tabela tem uma finalização definida (todas as linhas copiadas), e o Stage `stage/sql/copy to tmp table` é instrumentado para fornecer informações de progresso limitado (bounded): A unidade de trabalho utilizada é o número de linhas copiadas, `WORK_COMPLETED` e `WORK_ESTIMATED` são ambos significativos, e sua razão indica o percentual de conclusão da tarefa.

Para habilitar o Instrument e os Consumers relevantes, execute estes Statements:

```sql
UPDATE performance_schema.setup_instruments
SET ENABLED='YES'
WHERE NAME='stage/sql/copy to tmp table';

UPDATE performance_schema.setup_consumers
SET ENABLED='YES'
WHERE NAME LIKE 'events_stages_%';
```

Para ver o progresso de um Statement `ALTER TABLE` em andamento, selecione a partir da tabela `events_stages_current`.