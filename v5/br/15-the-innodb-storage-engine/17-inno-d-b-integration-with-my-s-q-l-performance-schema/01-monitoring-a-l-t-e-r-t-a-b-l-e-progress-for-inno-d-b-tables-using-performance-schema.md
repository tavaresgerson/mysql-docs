### 14.17.1 Monitoramento do Progresso de ALTER TABLE para Tabelas InnoDB Usando o Performance Schema

Você pode monitorar o progresso de `ALTER TABLE` para tabelas `InnoDB` usando o Performance Schema.

Existem sete *stage events* (eventos de estágio) que representam diferentes fases da operação `ALTER TABLE`. Cada *stage event* relata um total contínuo de `WORK_COMPLETED` (trabalho concluído) e `WORK_ESTIMATED` (trabalho estimado) para a operação `ALTER TABLE` geral à medida que ela avança por suas diferentes fases. `WORK_ESTIMATED` é calculado usando uma fórmula que leva em conta todo o trabalho que o `ALTER TABLE` executa e pode ser revisado durante o processamento do `ALTER TABLE`. Os valores de `WORK_COMPLETED` e `WORK_ESTIMATED` são uma representação abstrata de todo o trabalho realizado pelo `ALTER TABLE`.

Em ordem de ocorrência, os *stage events* do `ALTER TABLE` incluem:

* `stage/innodb/alter table (read PK and internal sort)`: Este estágio está ativo quando o `ALTER TABLE` está na fase de leitura da Primary Key (*reading-primary-key phase*). Ele começa com `WORK_COMPLETED=0` e `WORK_ESTIMATED` definido para o número estimado de páginas na Primary Key. Quando o estágio é concluído, `WORK_ESTIMATED` é atualizado para o número real de páginas na Primary Key.

* `stage/innodb/alter table (merge sort)`: Este estágio é repetido para cada Index adicionado pela operação `ALTER TABLE`.

* `stage/innodb/alter table (insert)`: Este estágio é repetido para cada Index adicionado pela operação `ALTER TABLE`.

* `stage/innodb/alter table (log apply index)`: Este estágio inclui a aplicação do DML log gerado enquanto o `ALTER TABLE` estava em execução.

* `stage/innodb/alter table (flush)`: Antes do início deste estágio, `WORK_ESTIMATED` é atualizado com uma estimativa mais precisa, baseada no comprimento da *flush list*.

* `stage/innodb/alter table (log apply table)`: Este estágio inclui a aplicação do DML log concorrente gerado enquanto o `ALTER TABLE` estava em execução. A duração desta fase depende da extensão das alterações da tabela. Esta fase é instantânea se nenhum DML concorrente foi executado na tabela.

* `stage/innodb/alter table (end)`: Inclui qualquer trabalho restante que apareceu após a fase de *flush*, como reaplicar DML que foi executado na tabela enquanto o `ALTER TABLE` estava em execução.

Nota

Os *stage events* `ALTER TABLE` do `InnoDB` atualmente não contabilizam a adição de *spatial indexes* (índices espaciais).

#### Exemplo de Monitoramento de ALTER TABLE Usando o Performance Schema

O exemplo a seguir demonstra como habilitar os instrumentos de *stage event* `stage/innodb/alter table%` e as tabelas *consumer* relacionadas para monitorar o progresso do `ALTER TABLE`. Para informações sobre os instrumentos de *stage event* do Performance Schema e *consumers* relacionados, consulte a Seção 25.12.5, “Performance Schema Stage Event Tables”.

1. Habilite os instrumentos `stage/innodb/alter%`:

   ```sql
   mysql> UPDATE performance_schema.setup_instruments
          SET ENABLED = 'YES'
          WHERE NAME LIKE 'stage/innodb/alter%';
   Query OK, 7 rows affected (0.00 sec)
   Rows matched: 7  Changed: 7  Warnings: 0
   ```

2. Habilite as tabelas *consumer* de *stage event*, que incluem `events_stages_current`, `events_stages_history` e `events_stages_history_long`.

   ```sql
   mysql> UPDATE performance_schema.setup_consumers
          SET ENABLED = 'YES'
          WHERE NAME LIKE '%stages%';
   Query OK, 3 rows affected (0.00 sec)
   Rows matched: 3  Changed: 3  Warnings: 0
   ```

3. Execute uma operação `ALTER TABLE`. Neste exemplo, uma coluna `middle_name` é adicionada à tabela *employees* do *sample database* *employees*.

   ```sql
   mysql> ALTER TABLE employees.employees ADD COLUMN middle_name varchar(14) AFTER first_name;
   Query OK, 0 rows affected (9.27 sec)
   Records: 0  Duplicates: 0  Warnings: 0
   ```

4. Verifique o progresso da operação `ALTER TABLE` consultando a tabela `events_stages_current` do Performance Schema. O *stage event* exibido difere dependendo de qual fase do `ALTER TABLE` está em andamento. A coluna `WORK_COMPLETED` mostra o trabalho concluído. A coluna `WORK_ESTIMATED` fornece uma estimativa do trabalho restante.

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

   A tabela `events_stages_current` retorna um *empty set* (conjunto vazio) se a operação `ALTER TABLE` foi concluída. Neste caso, você pode verificar a tabela `events_stages_history` para visualizar os dados do evento da operação concluída. Por exemplo:

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

   Conforme mostrado acima, o valor de `WORK_ESTIMATED` foi revisado durante o processamento do `ALTER TABLE`. O trabalho estimado após a conclusão do estágio inicial é 1213. Quando o processamento do `ALTER TABLE` foi concluído, `WORK_ESTIMATED` foi definido para o valor real, que é 1981.