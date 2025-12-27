### 29.12.5 Tabelas de Eventos de Etapas do Schema de Desempenho

29.12.5.1 Tabela events_stages_current

29.12.5.2 Tabela events_stages_history

29.12.5.3 Tabela events_stages_history_long

O Schema de Desempenho registra as etapas, que são os passos durante o processo de execução de instruções, como a análise de uma instrução, a abertura de uma tabela ou a execução de uma operação `filesort`. As etapas correspondem aos estados dos threads exibidos pelo `SHOW PROCESSLIST` ou visíveis na tabela `PROCESSLIST` do Schema de Informações. As etapas começam e terminam quando os valores dos estados mudam.

Na hierarquia de eventos, os eventos de espera estão dentro dos eventos de etapa, que estão dentro dos eventos de instrução, que estão dentro dos eventos de transação.

Essas tabelas armazenam eventos de etapa:

* `events_stages_current`: O evento de etapa atual para cada thread.

* `events_stages_history`: Os eventos de etapa mais recentes que terminaram por thread.

* `events_stages_history_long`: Os eventos de etapa mais recentes que terminaram globalmente (em todos os threads).

As seções a seguir descrevem as tabelas de eventos de etapa. Há também tabelas resumidas que agregam informações sobre eventos de etapa; veja a Seção 29.12.20.2, “Tabelas de Resumo de Etapas”.

Para obter mais informações sobre a relação entre as três tabelas de eventos de etapa, consulte a Seção 29.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

* Configurando a Coleta de Eventos de Etapa
* Informações de Progresso de Eventos de Etapa

* A tabela `setup_consumers` contém valores de consumidores com nomes correspondentes aos nomes das tabelas de eventos de estágio atuais e históricos. Use esses consumidores para filtrar a coleção de eventos de estágio.

Exceto para os instrumentos que fornecem informações sobre o progresso da declaração, os instrumentos de estágio são desabilitados por padrão. Por exemplo:

```
mysql> SELECT NAME, ENABLED, TIMED
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

Os instrumentos de eventos de estágio que fornecem informações sobre o progresso da declaração são habilitados e temporizados por padrão:

```
mysql> SELECT NAME, ENABLED, TIMED
       FROM performance_schema.setup_instruments
       WHERE ENABLED='YES' AND NAME LIKE "stage/%";
+------------------------------------------------------+---------+-------+
| NAME                                                 | ENABLED | TIMED |
+------------------------------------------------------+---------+-------+
| stage/sql/copy to tmp table                          | YES     | YES   |
| stage/sql/Applying batch of row changes (write)      | YES     | YES   |
| stage/sql/Applying batch of row changes (update)     | YES     | YES   |
| stage/sql/Applying batch of row changes (delete)     | YES     | YES   |
| stage/innodb/alter table (end)                       | YES     | YES   |
| stage/innodb/alter table (flush)                     | YES     | YES   |
| stage/innodb/alter table (insert)                    | YES     | YES   |
| stage/innodb/alter table (log apply index)           | YES     | YES   |
| stage/innodb/alter table (log apply table)           | YES     | YES   |
| stage/innodb/alter table (merge sort)                | YES     | YES   |
| stage/innodb/alter table (read PK and internal sort) | YES     | YES   |
| stage/innodb/buffer pool load                        | YES     | YES   |
| stage/innodb/clone (file copy)                       | YES     | YES   |
| stage/innodb/clone (redo copy)                       | YES     | YES   |
| stage/innodb/clone (page copy)                       | YES     | YES   |
+------------------------------------------------------+---------+-------+
```

Os consumidores de estágio são desabilitados por padrão:

```
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

Para controlar a coleta de eventos de estágio na inicialização do servidor, use linhas como estas no seu arquivo `my.cnf`:

* Habilitar:

  ```
  [mysqld]
  performance-schema-instrument='stage/%=ON'
  performance-schema-consumer-events-stages-current=ON
  performance-schema-consumer-events-stages-history=ON
  performance-schema-consumer-events-stages-history-long=ON
  ```

* Desabilitar:

  ```
  [mysqld]
  performance-schema-instrument='stage/%=OFF'
  performance-schema-consumer-events-stages-current=OFF
  performance-schema-consumer-events-stages-history=OFF
  performance-schema-consumer-events-stages-history-long=OFF
  ```

Para controlar a coleta de eventos de estágio no tempo de execução, atualize as tabelas `setup_instruments` e `setup_consumers`:

* Habilitar:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'YES', TIMED = 'YES'
  WHERE NAME LIKE 'stage/%';

  UPDATE performance_schema.setup_consumers
  SET ENABLED = 'YES'
  WHERE NAME LIKE 'events_stages%';
  ```

* Desabilitar:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'NO', TIMED = 'NO'
  WHERE NAME LIKE 'stage/%';

  UPDATE performance_schema.setup_consumers
  SET ENABLED = 'NO'
  WHERE NAME LIKE 'events_stages%';
  ```

Para coletar apenas eventos de estágio específicos, habilite apenas os instrumentos de estágio correspondentes. Para coletar eventos de estágio apenas para tabelas específicas de eventos de estágio, habilite os instrumentos de estágio, mas apenas os consumidores de estágio correspondentes às tabelas desejadas.

Para obter informações adicionais sobre a configuração da coleta de eventos, consulte a Seção 29.3, “Configuração de Inicialização do Schema de Desempenho”, e a Seção 29.4, “Configuração de Tempo de Execução do Schema de Desempenho”.

#### Informações de Progresso de Eventos de Estágio

As tabelas de eventos de estágio do Schema de Desempenho contêm duas colunas que, juntas, fornecem um indicador de progresso de estágio para cada linha:

* `WORK_COMPLETED`: O número de unidades de trabalho concluídas para o estágio

* `WORK_ESTIMATED`: O número de unidades de trabalho esperadas para o estágio

Cada coluna é `NULL` se nenhuma informação de progresso for fornecida para um instrumento. A interpretação das informações, se estiver disponível, depende inteiramente da implementação do instrumento. As tabelas do Schema de Desempenho fornecem um contêiner para armazenar dados de progresso, mas não fazem suposições sobre a semântica da própria métrica:

* Uma “unidade de trabalho” é uma métrica inteira que aumenta ao longo do tempo durante a execução, como o número de bytes, linhas, arquivos ou tabelas processadas. A definição de “unidade de trabalho” para um instrumento específico é deixada para o código de instrumentação que fornece os dados.

* O valor `WORK_COMPLETED` pode aumentar uma ou muitas unidades de cada vez, dependendo do código instrumentado.

* O valor `WORK_ESTIMATED` pode mudar durante a fase, dependendo do código instrumentado.

A instrumentação para um indicador de progresso de evento de fase pode implementar qualquer um dos seguintes comportamentos:

* Instrumentação de progresso sem progressão

Este é o caso mais típico, onde nenhum dado de progresso é fornecido. As colunas `WORK_COMPLETED` e `WORK_ESTIMATED` são ambas `NULL`.

* Instrumentação de progresso ilimitada

Apenas a coluna `WORK_COMPLETED` é significativa. Nenhum dado é fornecido para a coluna `WORK_ESTIMATED`, que exibe 0.

Consultando a tabela `events_stages_current` para a sessão monitorada, um aplicativo de monitoramento pode relatar quanto trabalho foi realizado até agora, mas não pode relatar se a fase está próxima de ser concluída. Atualmente, nenhuma fase é instrumentada dessa maneira.

* Instrumentação de progresso limitada

As colunas `WORK_COMPLETED` e `WORK_ESTIMATED` são significativas.

Este tipo de indicador de progresso é apropriado para uma operação com um critério de conclusão definido, como o instrumento de cópia de tabela descrito mais adiante. Ao consultar a tabela `events_stages_current` para a sessão monitorada, um aplicativo de monitoramento pode relatar quanto trabalho foi realizado até o momento e pode relatar a porcentagem de conclusão geral para a etapa, calculando a razão `WORK_COMPLETED` / `WORK_ESTIMATED`.

O instrumento `stage/sql/copy to tmp table` ilustra como os indicadores de progresso funcionam. Durante a execução de uma instrução `ALTER TABLE`, o estágio `stage/sql/copy to tmp table` é usado, e este estágio pode ser executado por um tempo potencialmente longo, dependendo do tamanho dos dados a serem copiados.

A tarefa de cópia de tabela tem uma conclusão definida (todas as linhas copiados) e o estágio `stage/sql/copy to tmp table` é instrumentado para fornecer informações de progresso limitadas: A unidade de trabalho usada é o número de linhas copiados, `WORK_COMPLETED` e `WORK_ESTIMATED` são ambos significativos, e sua razão indica a porcentagem de conclusão da tarefa.

Para habilitar o instrumento e os consumidores relevantes, execute as seguintes instruções:

```
UPDATE performance_schema.setup_instruments
SET ENABLED='YES'
WHERE NAME='stage/sql/copy to tmp table';

UPDATE performance_schema.setup_consumers
SET ENABLED='YES'
WHERE NAME LIKE 'events_stages_%';
```

Para ver o progresso de uma instrução `ALTER TABLE` em andamento, selecione a tabela `events_stages_current`.