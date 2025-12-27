### 17.12.8 Limitações de DDL Online

As seguintes limitações se aplicam às operações de DDL online:

* A tabela é copiada ao criar um índice em uma `TABELA TEMPORÁRIA`.

* A cláusula `ALTER TABLE` com `LOCK=NONE` não é permitida se houver restrições `ON...CASCADE` ou `ON...SET NULL` na tabela.

* Antes que uma operação de DDL online in-place possa ser concluída, ela deve esperar por transações que mantenham bloqueios de metadados na tabela para serem confirmadas ou revertidas. Uma operação de DDL online pode exigir brevemente um bloqueio exclusivo de metadados na tabela durante sua fase de execução e sempre requer um bloqueio de metadados na fase final da operação ao atualizar a definição da tabela. Consequentemente, transações que mantêm bloqueios de metadados na tabela podem fazer com que uma operação de DDL online seja bloqueada. As transações que mantêm bloqueios de metadados na tabela podem ter sido iniciadas antes ou durante a operação de DDL online. Uma transação em execução longa ou inativa que mantém um bloqueio de metadados na tabela pode fazer com que uma operação de DDL online expire.

* Ao executar uma operação de DDL online in-place, o thread que executa a declaração `ALTER TABLE` aplica um registro online de operações de DML que foram executadas simultaneamente na mesma tabela a partir de outros threads de conexão. Quando as operações de DML são aplicadas, é possível encontrar um erro de entrada de chave duplicada (ERRO 1062 (23000): Entrada duplicada), mesmo que a entrada duplicada seja apenas temporária e seja revertida por uma entrada posterior no registro online. Isso é semelhante à ideia de uma verificação de restrição de chave estrangeira no `InnoDB`, na qual as restrições devem ser mantidas durante uma transação.

* `OPTIMIZE TABLE` para uma tabela `InnoDB` é mapeado para uma operação `ALTER TABLE` para reconstruir a tabela e atualizar as estatísticas de índice e liberar espaço não utilizado no índice agrupado. Os índices secundários não são criados de forma eficiente porque as chaves são inseridas na ordem em que apareceram na chave primária. `OPTIMIZE TABLE` é suportado com a adição do suporte de DDL online para reconstruir tabelas `InnoDB` regulares e particionadas.

* Tabelas criadas antes do MySQL 5.6 que incluem colunas temporais (`DATE`, `DATETIME` ou `TIMESTAMP`) e não foram reconstruídas usando  `ALGORITHM=COPY` não suportam `ALGORITHM=INPLACE`. Neste caso, uma operação `ALTER TABLE ... ALGORITHM=INPLACE` retorna o seguinte erro:

  ```
  ERROR 1846 (0A000): ALGORITHM=INPLACE is not supported.
  Reason: Cannot change column type INPLACE. Try ALGORITHM=COPY.
  ```

* As seguintes limitações são geralmente aplicáveis às operações de DDL online em tabelas grandes que envolvem a reconstrução da tabela:

  + Não há mecanismo para pausar uma operação de DDL online ou para controlar o uso de I/O ou CPU para uma operação de DDL online.

  + O cancelamento de uma operação de DDL online pode ser caro caso a operação falhe.

  + Operações de DDL online de longa duração podem causar atraso na replicação. Uma operação de DDL online deve terminar de ser executada na fonte antes de ser executada na replica. Além disso, o DML que foi processado simultaneamente na fonte só é processado na replica após a operação de DDL na replica ser concluída.

Para informações adicionais relacionadas à execução de operações de DDL online em tabelas grandes, consulte a Seção 17.12.2, “Desempenho e Concorrência de DDL Online”.