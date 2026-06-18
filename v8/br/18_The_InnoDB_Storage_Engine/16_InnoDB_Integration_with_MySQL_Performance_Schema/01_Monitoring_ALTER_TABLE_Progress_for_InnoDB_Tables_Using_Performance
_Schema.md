### 17.16.1 Monitoramento do progresso da alteração de tabelas ALTER TABLE para tabelas InnoDB usando o Gerenciador de Desempenho

Você pode monitorar o progresso do `ALTER TABLE` para as tabelas `InnoDB` usando o Schema de Desempenho.

Existem sete eventos em estágio que representam diferentes fases do `ALTER TABLE`. Cada evento em estágio reporta um total em execução de `WORK_COMPLETED` e `WORK_ESTIMATED` para a operação geral `ALTER TABLE` à medida que ela progride por suas diferentes fases. `WORK_ESTIMATED` é calculado usando uma fórmula que leva em conta todo o trabalho que `ALTER TABLE` realiza, e pode ser revisado durante o processamento de `ALTER TABLE`. Os valores de `WORK_COMPLETED` e `WORK_ESTIMATED` são uma representação abstrata de todo o trabalho realizado por `ALTER TABLE`.

Em ordem de ocorrência, os eventos da fase `ALTER TABLE` incluem:

- `stage/innodb/alter table (read PK and internal sort)`: Esta etapa é ativa quando `ALTER TABLE` está na fase de leitura de chave primária. Ela começa com `WORK_COMPLETED=0` e `WORK_ESTIMATED` definidos para o número estimado de páginas na chave primária. Quando a etapa é concluída, `WORK_ESTIMATED` é atualizado para o número real de páginas na chave primária.

- `stage/innodb/alter table (merge sort)`: Esta etapa é repetida para cada índice adicionado pela operação `ALTER TABLE`.

- `stage/innodb/alter table (insert)`: Esta etapa é repetida para cada índice adicionado pela operação `ALTER TABLE`.

- `stage/innodb/alter table (log apply index)`: Esta etapa inclui a aplicação do log de DML gerado enquanto o `ALTER TABLE` estava em execução.

- `stage/innodb/alter table (flush)`: Antes que esta etapa comece, `WORK_ESTIMATED` é atualizado com uma estimativa mais precisa, com base na extensão da lista de limpeza.

- `stage/innodb/alter table (log apply table)`: Esta etapa inclui a aplicação do log de DML concorrente gerado enquanto o `ALTER TABLE` estava em execução. A duração desta fase depende da extensão das alterações na tabela. Esta fase é instantânea se nenhuma DML concorrente tiver sido executada na tabela.

- `stage/innodb/alter table (end)`: Inclui qualquer trabalho restante que apareceu após a fase de limpeza, como a reexecução de DML que foi executada na tabela enquanto o `ALTER TABLE` estava em execução.

Nota

Os eventos de estágio `InnoDB` e `ALTER TABLE` atualmente não incluem a adição de índices espaciais.

#### ALTER TABLE Monitoramento Exemplo Usando o Gerenciamento de Desempenho

O exemplo a seguir demonstra como habilitar os instrumentos de eventos de estágio `stage/innodb/alter table%` e as tabelas de consumidores relacionadas para monitorar o progresso do `ALTER TABLE`. Para obter informações sobre os instrumentos de eventos de estágio do Schema de Desempenho e os consumidores relacionados, consulte a Seção 29.12.5, “Tabelas de Eventos de Estágio do Schema de Desempenho”.

1. Ative os instrumentos `stage/innodb/alter%`:

   ```
   mysql> UPDATE performance_schema.setup_instruments
          SET ENABLED = 'YES'
          WHERE NAME LIKE 'stage/innodb/alter%';
   Query OK, 7 rows affected (0.00 sec)
   Rows matched: 7  Changed: 7  Warnings: 0
   ```

2. Ative as tabelas de consumo de eventos de palco, que incluem `events_stages_current`, `events_stages_history` e `events_stages_history_long`.

   ```
   mysql> UPDATE performance_schema.setup_consumers
          SET ENABLED = 'YES'
          WHERE NAME LIKE '%stages%';
   Query OK, 3 rows affected (0.00 sec)
   Rows matched: 3  Changed: 3  Warnings: 0
   ```

3. Execute uma operação `ALTER TABLE`. Neste exemplo, uma coluna `middle_name` é adicionada à tabela de funcionários do banco de dados de amostra de funcionários.

   ```
   mysql> ALTER TABLE employees.employees ADD COLUMN middle_name varchar(14) AFTER first_name;
   Query OK, 0 rows affected (9.27 sec)
   Records: 0  Duplicates: 0  Warnings: 0
   ```

4. Verifique o progresso da operação `ALTER TABLE` consultando a tabela do Schema de Desempenho `events_stages_current`. O evento de estágio mostrado difere dependendo da fase `ALTER TABLE` que está em andamento atualmente. A coluna `WORK_COMPLETED` mostra o trabalho concluído. A coluna `WORK_ESTIMATED` fornece uma estimativa do trabalho restante.

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

   A tabela `events_stages_current` retorna um conjunto vazio se a operação `ALTER TABLE` tiver sido concluída. Nesse caso, você pode consultar a tabela `events_stages_history` para visualizar os dados do evento da operação concluída. Por exemplo:

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

   Como mostrado acima, o valor `WORK_ESTIMATED` foi revisado durante o processamento de `ALTER TABLE`. O trabalho estimado após a conclusão da etapa inicial é

   1213. Quando o processamento de `ALTER TABLE` foi concluído, `WORK_ESTIMATED` foi definido para o valor real, que é 1981.
