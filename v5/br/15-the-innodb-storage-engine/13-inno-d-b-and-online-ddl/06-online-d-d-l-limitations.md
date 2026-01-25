### 14.13.6 Limitações do DDL Online

As seguintes limitações se aplicam às operações DDL online:

* A tabela é copiada ao criar um Index em uma `TEMPORARY TABLE`.

* A cláusula `LOCK=NONE` do `ALTER TABLE` não é permitida se houver Constraints `ON...CASCADE` ou `ON...SET NULL` na tabela.

* Antes que uma operação DDL online possa ser concluída, ela deve esperar que as Transactions que possuem Metadata Locks na tabela façam Commit ou Rollback. Uma operação DDL online pode exigir brevemente um Metadata Lock exclusivo na tabela durante sua fase de execução, e sempre exige um na fase final da operação ao atualizar a definição da tabela. Consequentemente, Transactions que mantêm Metadata Locks na tabela podem fazer com que uma operação DDL online seja bloqueada. As Transactions que mantêm Metadata Locks na tabela podem ter sido iniciadas antes ou durante a operação DDL online. Uma Transaction de longa duração ou inativa que mantém um Metadata Lock na tabela pode causar um Timeout na operação DDL online.

* Uma operação DDL online em uma tabela em um relacionamento de Foreign Key não espera que uma Transaction em execução na outra tabela desse relacionamento faça Commit ou Rollback. A Transaction mantém um Metadata Lock exclusivo na tabela que está sendo atualizada e um Metadata Lock compartilhado na tabela relacionada à Foreign Key (necessário para a verificação da Foreign Key). O Metadata Lock compartilhado permite que a operação DDL online prossiga, mas bloqueia a operação em sua fase final, quando um Metadata Lock exclusivo é necessário para atualizar a definição da tabela. Este cenário pode resultar em Deadlocks enquanto outras Transactions aguardam a conclusão da operação DDL online.

* Ao executar uma operação DDL online, o Thread que executa a instrução `ALTER TABLE` aplica um log online de operações DML que foram executadas concomitantemente na mesma tabela a partir de outros Threads de conexão. Quando as operações DML são aplicadas, é possível encontrar um erro de entrada de chave duplicada (ERROR 1062 (23000): Duplicate entry), mesmo que a entrada duplicada seja apenas temporária e fosse revertida por uma entrada posterior no log online. Isso é semelhante à ideia de uma verificação de Foreign Key Constraint no `InnoDB`, na qual as Constraints devem ser mantidas durante uma Transaction.

* O `OPTIMIZE TABLE` para uma tabela `InnoDB` é mapeado para uma operação `ALTER TABLE` para reconstruir a tabela, atualizar estatísticas do Index e liberar espaço não utilizado no Clustered Index. Os Secondary Indexes não são criados de forma tão eficiente porque as chaves são inseridas na ordem em que apareceram na Primary Key. O `OPTIMIZE TABLE` é suportado com a adição de suporte DDL online para reconstruir tabelas `InnoDB` regulares e particionadas.

* Tabelas criadas antes do MySQL 5.6 que incluem colunas temporais (`DATE`, `DATETIME` ou `TIMESTAMP`) e que não foram reconstruídas usando `ALGORITHM=COPY` não suportam `ALGORITHM=INPLACE`. Neste caso, uma operação `ALTER TABLE ... ALGORITHM=INPLACE` retorna o seguinte erro:

```sql
  ERROR 1846 (0A000): ALGORITHM=INPLACE is not supported.
  Reason: Cannot change column type INPLACE. Try ALGORITHM=COPY.
  ```

* As seguintes limitações são geralmente aplicáveis a operações DDL online em tabelas grandes que envolvem a reconstrução da tabela:

  + Não há um mecanismo para pausar uma operação DDL online ou para limitar (throttle) o uso de I/O ou CPU para uma operação DDL online.

  + O Rollback de uma operação DDL online pode ser custoso caso a operação falhe.

  + Operações DDL online de longa duração podem causar lag de replicação. Uma operação DDL online deve terminar de ser executada na Source antes de ser executada na Replica. Além disso, o DML que foi processado concomitantemente na Source só é processado na Replica após a conclusão da operação DDL na Replica.

Para informações adicionais relacionadas à execução de operações DDL online em tabelas grandes, consulte a Seção 14.13.2, “Desempenho e Concorrência do DDL Online”.