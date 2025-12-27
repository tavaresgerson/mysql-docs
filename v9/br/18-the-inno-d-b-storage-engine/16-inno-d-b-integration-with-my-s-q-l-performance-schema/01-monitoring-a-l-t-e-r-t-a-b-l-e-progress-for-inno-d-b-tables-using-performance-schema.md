### 17.16.1 Monitoramento do progresso da alteração de tabela para tabelas InnoDB usando o Gerenciamento de Desempenho

Você pode monitorar o progresso da alteração de tabela para tabelas `InnoDB` usando o Gerenciamento de Desempenho.

Existem sete eventos de estágio que representam diferentes fases da alteração de tabela. Cada evento de estágio relata um total em andamento de `WORK_COMPLETED` e `WORK_ESTIMATED` para a operação geral de alteração de tabela à medida que ela avança pelas diferentes fases. `WORK_ESTIMATED` é calculado usando uma fórmula que leva em consideração todo o trabalho que a alteração de tabela realiza e pode ser revisada durante o processamento da alteração de tabela. Os valores de `WORK_COMPLETED` e `WORK_ESTIMATED` são uma representação abstrata de todo o trabalho realizado pela alteração de tabela.

Na ordem de ocorrência, os eventos de estágio da alteração de tabela incluem:

* `stage/innodb/alter table (read PK and internal sort)`: Este estágio está ativo quando a alteração de tabela está na fase de leitura de chave primária. Ele começa com `WORK_COMPLETED=0` e `WORK_ESTIMATED` definido para o número estimado de páginas na chave primária. Quando o estágio é concluído, `WORK_ESTIMATED` é atualizado para o número real de páginas na chave primária.

* `stage/innodb/alter table (merge sort)`: Este estágio é repetido para cada índice adicionado pela operação de alteração de tabela.

* `stage/innodb/alter table (insert)`: Este estágio é repetido para cada índice adicionado pela operação de alteração de tabela.

* `stage/innodb/alter table (log apply index)`: Este estágio inclui a aplicação do log de DML gerado enquanto a alteração de tabela estava em execução.

* `stage/innodb/alter table (flush)`: Antes que este estágio comece, `WORK_ESTIMATED` é atualizado com uma estimativa mais precisa, com base na extensão da lista de esvaziamento.

* `stage/innodb/alter table (log apply table)`: Esta etapa inclui a aplicação do log de DML concorrente gerado enquanto o `ALTER TABLE` estava em execução. A duração desta fase depende da extensão das alterações na tabela. Esta fase é instantânea se nenhum DML concorrente foi executado na tabela.

* `stage/innodb/alter table (end)`: Inclui qualquer trabalho restante que apareceu após a fase de esvaziamento, como a reaplicação de DML que foi executada na tabela enquanto o `ALTER TABLE` estava em execução.

Nota

Os eventos de etapa `ALTER TABLE` do `InnoDB` atualmente não consideram a adição de índices espaciais.

#### Exemplo de Monitoramento de ALTER TABLE Usando o Gerenciamento de Desempenho

O exemplo a seguir demonstra como habilitar os instrumentos de eventos de etapa `stage/innodb/alter%` e as tabelas de consumidores relacionadas para monitorar o progresso do `ALTER TABLE`. Para informações sobre os instrumentos de eventos de etapa do Gerenciamento de Desempenho e as tabelas de consumidores relacionadas, consulte a Seção 29.12.5, “Tabelas de Eventos de Etapa do Gerenciamento de Desempenho”.

1. Habilite os instrumentos `stage/innodb/alter%`:

   ```
   mysql> UPDATE performance_schema.setup_instruments
          SET ENABLED = 'YES'
          WHERE NAME LIKE 'stage/innodb/alter%';
   Query OK, 7 rows affected (0.00 sec)
   Rows matched: 7  Changed: 7  Warnings: 0
   ```

2. Habilite as tabelas de consumidores de eventos de etapa, que incluem `events_stages_current`, `events_stages_history` e `events_stages_history_long`.

   ```
   mysql> UPDATE performance_schema.setup_consumers
          SET ENABLED = 'YES'
          WHERE NAME LIKE '%stages%';
   Query OK, 3 rows affected (0.00 sec)
   Rows matched: 3  Changed: 3  Warnings: 0
   ```

3. Execute uma operação de `ALTER TABLE`. Neste exemplo, uma coluna `middle_name` é adicionada à tabela `employees` do banco de dados de amostra `employees`.

   ```
   mysql> ALTER TABLE employees.employees ADD COLUMN middle_name varchar(14) AFTER first_name;
   Query OK, 0 rows affected (9.27 sec)
   Records: 0  Duplicates: 0  Warnings: 0
   ```

4. Verifique o progresso da operação de `ALTER TABLE` consultando a tabela `events_stages_current` do Gerenciamento de Desempenho. O evento de etapa mostrado difere dependendo da fase de `ALTER TABLE` que está atualmente em progresso. A coluna `WORK_COMPLETED` mostra o trabalho concluído. A coluna `WORK_ESTIMATED` fornece uma estimativa do trabalho restante.

   ```
   mysql> SELECT EVENT_NAME, WORK_COMPLETED, WORK_ESTIMATED
          FROM performance_schema.events_stages_current;
   +------------------------------------------------------+----------------+----------------+
   | EVENT_NAME                                           | WORK_COMPLETED | WORK_ESTIMATED |
   +------------------------------------------------------+----------------+----------------+
   | stage/innodb/alter table (read PK and internal sort) |            280 |           1245 |
   +------------------------------------------------------+----------------+----------------+
   1 row in set (0.01 sec)
   ```

A tabela `events_stages_current` retorna um conjunto vazio se a operação `ALTER TABLE` tiver sido concluída. Nesse caso, você pode verificar a tabela `events_stages_history` para visualizar os dados do evento para a operação concluída. Por exemplo:

```
   mysql> SELECT EVENT_NAME, WORK_COMPLETED, WORK_ESTIMATED
          FROM performance_schema.events_stages_history;
   +------------------------------------------------------+----------------+----------------+
   | EVENT_NAME                                           | WORK_COMPLETED | WORK_ESTIMATED |
   +------------------------------------------------------+----------------+----------------+
   | stage/innodb/alter table (read PK and internal sort) |            886 |           1213 |
   | stage/innodb/alter table (flush)                     |           1213 |           1213 |
   | stage/innodb/alter table (log apply table)           |           1597 |           1597 |
   | stage/innodb/alter table (end)                       |           1597 |           1597 |
   | stage/innodb/alter table (log apply table)           |           1981 |           1981 |
   +------------------------------------------------------+----------------+----------------+
   5 rows in set (0.00 sec)
   ```

Como mostrado acima, o valor `WORK_ESTIMATED` foi revisado durante o processamento da `ALTER TABLE`. O trabalho estimado após a conclusão da etapa inicial é de 1213. Quando o processamento da `ALTER TABLE` foi concluído, o `WORK_ESTIMATED` foi definido para o valor real, que é 1981.