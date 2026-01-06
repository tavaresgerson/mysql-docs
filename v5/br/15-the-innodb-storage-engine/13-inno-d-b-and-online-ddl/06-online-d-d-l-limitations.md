### 14.13.6 Limitações do DDL online

As seguintes limitações se aplicam às operações DDL online:

- A tabela é copiada ao criar um índice em uma `TÁBUA TEMPORÁRIA`.

- A cláusula `ALTER TABLE` `LOCK=NONE` não é permitida se houver restrições `ON...CASCADE` ou `ON...SET NULL` na tabela.

- Antes que uma operação de DDL online possa terminar, ela deve esperar que as transações que mantêm bloqueios de metadados na tabela sejam confirmadas ou revertidas. Uma operação de DDL online pode exigir brevemente um bloqueio exclusivo de metadados na tabela durante sua fase de execução e sempre requer um bloqueio de metadados na fase final da operação ao atualizar a definição da tabela. Consequentemente, as transações que mantêm bloqueios de metadados na tabela podem fazer com que uma operação de DDL online seja bloqueada. As transações que mantêm bloqueios de metadados na tabela podem ter sido iniciadas antes ou durante a operação de DDL online. Uma transação em execução longa ou inativa que mantém um bloqueio de metadados na tabela pode fazer com que uma operação de DDL online seja temporariamente suspensa.

- Uma operação DDL online em uma tabela em uma relação de chave estrangeira não aguarda a execução de uma transação na outra tabela na relação de chave estrangeira para ser confirmada ou revertida. A transação mantém um bloqueio de metadados exclusivo na tabela que está sendo atualizada e um bloqueio de metadados compartilhado na tabela relacionada à chave estrangeira (requisitado para a verificação da chave estrangeira). O bloqueio de metadados compartilhado permite que a operação DDL online prossiga, mas bloqueia a operação em sua fase final, quando um bloqueio de metadados exclusivo é necessário para atualizar a definição da tabela. Esse cenário pode resultar em deadlocks, pois outras transações aguardam o término da operação DDL online.

- Ao executar uma operação online de DDL, o fio que executa a instrução `ALTER TABLE` aplica um registro online das operações DML que foram executadas simultaneamente na mesma tabela a partir de outros fios de conexão. Quando as operações DML são aplicadas, é possível encontrar um erro de entrada de chave duplicada (ERRO 1062 (23000): Entrada duplicada), mesmo que a entrada duplicada seja apenas temporária e seja revertida por uma entrada posterior no registro online. Isso é semelhante à ideia de uma verificação de restrição de chave estrangeira no `InnoDB`, na qual as restrições devem ser mantidas durante uma transação.

- A opção `OPTIMIZE TABLE` para uma tabela `InnoDB` é mapeada para uma operação `ALTER TABLE` para reconstruir a tabela e atualizar as estatísticas dos índices e liberar espaço não utilizado no índice agrupado. Os índices secundários não são criados de forma eficiente porque as chaves são inseridas na ordem em que apareceram na chave primária. A opção `OPTIMIZE TABLE` é suportada com a adição do suporte online para DDL para reconstruir tabelas `InnoDB` regulares e particionadas.

- Tabelas criadas antes do MySQL 5.6 que incluem colunas temporais (`DATE`, `DATETIME` ou `TIMESTAMP`) e não foram reconstruídas usando `ALGORITHM=COPY` não suportam `ALGORITHM=INPLACE`. Nesse caso, uma operação `ALTER TABLE ... ALGORITHM=INPLACE` retorna o seguinte erro:

  ```sql
  ERROR 1846 (0A000): ALGORITHM=INPLACE is not supported.
  Reason: Cannot change column type INPLACE. Try ALGORITHM=COPY.
  ```

- As seguintes limitações geralmente se aplicam a operações de DDL online em tabelas grandes que envolvem a reconstrução da tabela:

  - Não há mecanismo para pausar uma operação de DDL online ou para limitar o uso de I/O ou CPU para uma operação de DDL online.

  - O rollback de uma operação DDL online pode ser caro caso a operação falhe.

  - Operações de DDL online de longa duração podem causar atraso na replicação. Uma operação de DDL online deve ser concluída na fonte antes de ser executada na replica. Além disso, a DML processada simultaneamente na fonte só é processada na replica após a operação de DDL na replica ser concluída.

  Para obter informações adicionais sobre a execução de operações DDL online em tabelas grandes, consulte a Seção 14.13.2, “Desempenho e Concorrência DDL Online”.
