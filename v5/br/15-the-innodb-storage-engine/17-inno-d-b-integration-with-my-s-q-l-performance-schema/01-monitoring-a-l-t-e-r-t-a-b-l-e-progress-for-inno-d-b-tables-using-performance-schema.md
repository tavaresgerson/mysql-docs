### 14.17.1 Monitoramento do progresso da alteração de tabelas ALTER TABLE para tabelas InnoDB usando o Gerenciador de Desempenho

Você pode monitorar o progresso da instrução `ALTER TABLE` para tabelas `InnoDB` usando o Gerenciador de Desempenho.

Existem sete eventos de estágio que representam diferentes fases da `ALTER TABLE`. Cada evento de estágio relata um total em andamento de `WORK_COMPLETED` e `WORK_ESTIMATED` para a operação geral de `ALTER TABLE` à medida que ela progride por suas diferentes fases. `WORK_ESTIMATED` é calculado usando uma fórmula que leva em consideração todo o trabalho que a `ALTER TABLE` realiza e pode ser revisada durante o processamento da `ALTER TABLE`. Os valores de `WORK_COMPLETED` e `WORK_ESTIMATED` são uma representação abstrata de todo o trabalho realizado pela `ALTER TABLE`.

Em ordem de ocorrência, os eventos da etapa `ALTER TABLE` incluem:

- `stage/innodb/alter table (leitura de PK e ordenação interna)`: Esta etapa está ativa quando o `ALTER TABLE` está na fase de leitura de chave primária. Ela começa com `WORK_COMPLETED=0` e `WORK_ESTIMATED` definido para o número estimado de páginas na chave primária. Quando a etapa é concluída, `WORK_ESTIMATED` é atualizado para o número real de páginas na chave primária.

- `stage/innodb/alter table (merge sort)`: Esta etapa é repetida para cada índice adicionado pela operação `ALTER TABLE`.

- `stage/innodb/alter table (insert)`: Esta etapa é repetida para cada índice adicionado pela operação `ALTER TABLE`.

- `stage/innodb/alter table (log apply index)`: Esta etapa inclui a aplicação do log de DML gerado enquanto o `ALTER TABLE` estava em execução.

- `stage/innodb/alter table (flush)`: Antes que essa etapa comece, o `WORK_ESTIMATED` é atualizado com uma estimativa mais precisa, com base na extensão da lista de esvaziamento.

- `stage/innodb/alter table (log apply table)`: Esta etapa inclui a aplicação do log de DML concorrente gerado enquanto o `ALTER TABLE` estava em execução. A duração desta fase depende da extensão das alterações na tabela. Esta fase é instantânea se nenhuma DML concorrente tiver sido executada na tabela.

- `stage/innodb/alter table (end)`: Inclui qualquer trabalho restante que apareceu após a fase de esvaziamento, como a reaplicação de DML que foi executada na tabela enquanto o `ALTER TABLE` estava em execução.

Nota

Os eventos da etapa `ALTER TABLE` do `InnoDB` atualmente não consideram a adição de índices espaciais.

#### ALTER TABLE Monitoramento Exemplo Usando o Gerenciamento de Desempenho

O exemplo a seguir demonstra como habilitar os instrumentos do evento `stage/innodb/alter table%` e as tabelas de consumo relacionadas para monitorar o progresso da instrução `ALTER TABLE`. Para obter informações sobre os instrumentos de eventos de estágios do Schema de Desempenho e os consumidores relacionados, consulte a Seção 25.12.5, “Tabelas de Eventos de Estágio do Schema de Desempenho”.

1. Ative os instrumentos `stage/innodb/alter%`:

   ```sql
   mysql> UPDATE performance_schema.setup_instruments
          SET ENABLED = 'YES'
          WHERE NAME LIKE 'stage/innodb/alter%';
   Query OK, 7 rows affected (0.00 sec)
   Rows matched: 7  Changed: 7  Warnings: 0
   ```

2. Ative as tabelas de consumidores de eventos de palco, que incluem `events_stages_current`, `events_stages_history` e `events_stages_history_long`.

   ```sql
   mysql> UPDATE performance_schema.setup_consumers
          SET ENABLED = 'YES'
          WHERE NAME LIKE '%stages%';
   Query OK, 3 rows affected (0.00 sec)
   Rows matched: 3  Changed: 3  Warnings: 0
   ```

3. Execute uma operação `ALTER TABLE`. Neste exemplo, uma coluna `middle_name` é adicionada à tabela `employees` do banco de dados de amostra de funcionários.

   ```sql
   mysql> ALTER TABLE employees.employees ADD COLUMN middle_name varchar(14) AFTER first_name;
   Query OK, 0 rows affected (9.27 sec)
   Records: 0  Duplicates: 0  Warnings: 0
   ```

4. Verifique o progresso da operação `ALTER TABLE` consultando a tabela `events_stages_current` do Schema de Desempenho. O evento do estágio mostrado difere dependendo da fase da `ALTER TABLE` que está em andamento. A coluna `WORK_COMPLETED` mostra o trabalho concluído. A coluna `WORK_ESTIMATED` fornece uma estimativa do trabalho restante.

   ```sql
   mysql> SELECT EVENT_NAME, WORK_COMPLETED, WORK_ESTIMATED
          FROM performance_schema.events_stages_current;
   +------------------------------------------------------+----------------+----------------+
   | EVENT_NAME                                           | WORK_COMPLETED | WORK_ESTIMATED |
   +------------------------------------------------------+----------------+----------------+
   | stage/innodb/alter table (read PK and internal sort) |            280 |           1245 |
   +------------------------------------------------------+----------------+----------------+
   1 row in set (0.01 sec)
   ```

   A tabela `events_stages_current` retorna um conjunto vazio se a operação `ALTER TABLE` tiver sido concluída. Nesse caso, você pode consultar a tabela `events_stages_history` para visualizar os dados do evento da operação concluída. Por exemplo:

   ```sql
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

   Como mostrado acima, o valor `WORK_ESTIMATED` foi revisado durante o processamento de `ALTER TABLE`. O trabalho estimado após a conclusão da etapa inicial é

   1213. Quando o processamento de `ALTER TABLE` foi concluído, o valor de `WORK_ESTIMATED` foi definido para o valor real, que é 1981.
