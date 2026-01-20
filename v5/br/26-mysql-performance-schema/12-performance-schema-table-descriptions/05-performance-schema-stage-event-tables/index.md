### 25.12.5 Tabelas de Eventos de Estágio do Schema de Desempenho

25.12.5.1 Tabela events_stages_current

25.12.5.2 A tabela events_stages_history

25.12.5.3 A tabela events_stages_history_long

Os estágios dos instrumentos do Schema de Desempenho, que são etapas durante o processo de execução de declarações, como a análise de uma declaração, a abertura de uma tabela ou a execução de uma operação `filesort`. Os estágios correspondem aos estados do thread exibidos pelo `SHOW PROCESSLIST` ou que são visíveis na tabela do Schema de Informações `PROCESSLIST`. Os estágios começam e terminam quando os valores de estado mudam.

Na hierarquia de eventos, os eventos de espera estão dentro dos eventos de estágio, que estão dentro dos eventos de declaração, que estão dentro dos eventos de transação.

Essas tabelas armazenam eventos de estágio:

- `eventos_stages_current`: O evento atual da etapa para cada thread.

- `eventos_stages_history`: Os eventos mais recentes dos estágios que terminaram por thread.

- `eventos_stages_history_long`: Os eventos mais recentes dos estágios que terminaram globalmente (em todos os threads).

As seções a seguir descrevem as tabelas de eventos de palco. Há também tabelas resumidas que agregam informações sobre eventos de palco; veja Seção 25.12.15.2, “Tabelas de Resumo de Palco”.

Para obter mais informações sobre a relação entre as três tabelas de eventos em etapas, consulte Seção 25.9, "Tabelas do Schema de Desempenho para Eventos Atuais e Históricos".

- Configurando a Coleta de Eventos de Estágio
- Informações sobre o progresso do evento em palco

#### Configurando a Coleta de Eventos de Estágio

Para controlar se os eventos de estágio devem ser coletados, defina o estado dos instrumentos e dos consumidores relevantes:

- A tabela `setup_instruments` contém instrumentos com nomes que começam com `stage`. Use esses instrumentos para habilitar ou desabilitar a coleta de classes individuais de eventos de palco.

- A tabela `setup_consumers` contém os valores dos consumidores com nomes correspondentes aos nomes das tabelas de eventos de estágio atuais e históricos. Use esses consumidores para filtrar a coleção de eventos de estágio.

Além dos instrumentos que fornecem informações sobre o progresso da declaração, os instrumentos de estágio são desabilitados por padrão. Por exemplo:

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

Os instrumentos de eventos em estágio que fornecem informações sobre o progresso da declaração estão habilitados e temporizados por padrão:

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

Os consumidores do estágio são desabilitados por padrão:

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

Para controlar a coleta de eventos de estágio ao iniciar o servidor, use linhas como estas no seu arquivo `my.cnf`:

- Ativar:

  ```sql
  [mysqld]
  performance-schema-instrument='stage/%=ON'
  performance-schema-consumer-events-stages-current=ON
  performance-schema-consumer-events-stages-history=ON
  performance-schema-consumer-events-stages-history-long=ON
  ```

- Desativar:

  ```sql
  [mysqld]
  performance-schema-instrument='stage/%=OFF'
  performance-schema-consumer-events-stages-current=OFF
  performance-schema-consumer-events-stages-history=OFF
  performance-schema-consumer-events-stages-history-long=OFF
  ```

Para controlar a coleta de eventos de estágio em tempo de execução, atualize as tabelas `setup_instruments` e `setup_consumers`:

- Ativar:

  ```sql
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'YES', TIMED = 'YES'
  WHERE NAME LIKE 'stage/%';

  UPDATE performance_schema.setup_consumers
  SET ENABLED = 'YES'
  WHERE NAME LIKE 'events_stages%';
  ```

- Desativar:

  ```sql
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'NO', TIMED = 'NO'
  WHERE NAME LIKE 'stage/%';

  UPDATE performance_schema.setup_consumers
  SET ENABLED = 'NO'
  WHERE NAME LIKE 'events_stages%';
  ```

Para coletar apenas eventos específicos de palco, habilite apenas os instrumentos de palco correspondentes. Para coletar eventos de palco apenas para tabelas específicas de eventos de palco, habilite os instrumentos de palco, mas apenas os consumidores de palco correspondentes às tabelas desejadas.

A tabela `setup_timers` contém uma linha com o valor `NAME` de `stage`, que indica a unidade para o cronometramento de eventos de estágio. A unidade padrão é `NANOSECOND`:

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

Para alterar a unidade de temporização, modifique o valor `TIMER_NAME`:

```sql
UPDATE performance_schema.setup_timers
SET TIMER_NAME = 'MICROSECOND'
WHERE NAME = 'stage';
```

Para obter informações adicionais sobre a configuração da coleta de eventos, consulte Seção 25.3, “Configuração de Inicialização do Schema de Desempenho” e Seção 25.4, “Configuração de Execução em Tempo Real do Schema de Desempenho”.

#### Informações sobre o progresso do evento em andamento

As tabelas de eventos do estágio do Schema de Desempenho contêm duas colunas que, juntas, fornecem um indicador de progresso do estágio para cada linha:

- `WORK_COMPLETED`: Número de unidades de trabalho concluídas para a etapa

- `WORK_ESTIMATED`: O número de unidades de trabalho esperadas para a etapa

Cada coluna é `NULL` se nenhuma informação de progresso for fornecida para um instrumento. A interpretação das informações, se estiverem disponíveis, depende inteiramente da implementação do instrumento. As tabelas do Schema de Desempenho fornecem um contêiner para armazenar dados de progresso, mas não fazem suposições sobre a semântica da própria métrica:

- Uma "unidade de trabalho" é uma métrica inteira que aumenta ao longo do tempo durante a execução, como o número de bytes, linhas, arquivos ou tabelas processadas. A definição de "unidade de trabalho" para um instrumento específico é deixada para o código de instrumentação que fornece os dados.

- O valor `WORK_COMPLETED` pode aumentar uma ou várias unidades de cada vez, dependendo do código instrumentado.

- O valor `WORK_ESTIMATED` pode mudar durante a fase, dependendo do código instrumentado.

O instrumento para um indicador de progresso de um evento em palco pode implementar qualquer um dos seguintes comportamentos:

- Sem instrumentação de progresso

  Este é o caso mais típico, onde não são fornecidos dados de progresso. As colunas `WORK_COMPLETED` e `WORK_ESTIMATED` estão ambas em `NULL`.

- Instrumentação de progresso sem limites

  Apenas a coluna `WORK_COMPLETED` é significativa. Não há dados fornecidos para a coluna `WORK_ESTIMATED`, que exibe 0.

  Ao consultar a tabela `events_stages_current` para a sessão monitorada, um aplicativo de monitoramento pode relatar quanto trabalho já foi realizado até o momento, mas não pode relatar se o estágio está próximo de ser concluído. Atualmente, nenhum estágio é instrumentado dessa forma.

- Instrumentação de progresso limitado

  As colunas `WORK_COMPLETED` e `WORK_ESTIMATED` são ambas significativas.

  Esse tipo de indicador de progresso é apropriado para uma operação com um critério de conclusão definido, como o instrumento de cópia de tabelas descrito mais adiante. Ao consultar a tabela `events_stages_current` para a sessão monitorada, um aplicativo de monitoramento pode relatar quanto trabalho já foi realizado até o momento e pode relatar o percentual de conclusão geral para a etapa, calculando a razão `WORK_COMPLETED` / `WORK_ESTIMATED`.

A ferramenta `stage/sql/copy to tmp table` ilustra como funcionam os indicadores de progresso. Durante a execução de uma instrução `ALTER TABLE` (alter-table.html), a etapa `stage/sql/copy to tmp table` é usada, e essa etapa pode demorar muito tempo para ser executada, dependendo do tamanho dos dados a serem copiados.

A tarefa de cópia de tabela tem uma finalização definida (todas as linhas copiadas), e a etapa `stage/sql/copy to tmp table` é instrumentada para fornecer informações de progresso limitadas: A unidade de trabalho usada é o número de linhas copiadas, `WORK_COMPLETED` e `WORK_ESTIMATED` são ambos significativos, e sua proporção indica a porcentagem de tarefa concluída.

Para habilitar o instrumento e os consumidores relevantes, execute as seguintes declarações:

```sql
UPDATE performance_schema.setup_instruments
SET ENABLED='YES'
WHERE NAME='stage/sql/copy to tmp table';

UPDATE performance_schema.setup_consumers
SET ENABLED='YES'
WHERE NAME LIKE 'events_stages_%';
```

Para ver o progresso de uma instrução `ALTER TABLE` em andamento, selecione a tabela `events_stages_current` (performance-schema-events-stages-current-table.html).
