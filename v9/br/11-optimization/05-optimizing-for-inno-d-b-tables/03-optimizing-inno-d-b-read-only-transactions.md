### 10.5.3 Otimizando Transações de Leitura Única do InnoDB

O `InnoDB` pode evitar o overhead associado à configuração do ID da transação (`TRX_ID` campo) para transações que são conhecidas como de leitura única. Um ID de transação é necessário apenas para uma transação que possa realizar operações de escrita ou bloqueio de leituras, como `SELECT ... FOR UPDATE`. A eliminação de IDs de transação desnecessários reduz o tamanho das estruturas de dados internas que são consultadas cada vez que uma consulta ou declaração de alteração de dados constrói uma visão de leitura.

O `InnoDB` detecta transações de leitura única quando:

* A transação é iniciada com a instrução `START TRANSACTION READ ONLY`. Nesse caso, tentar fazer alterações no banco de dados (para `InnoDB`, `MyISAM` ou outros tipos de tabelas) causa um erro, e a transação continua no estado de leitura única:

  ```
  ERROR 1792 (25006): Cannot execute statement in a READ ONLY transaction.
  ```

  Você ainda pode fazer alterações em tabelas temporárias específicas da sessão em uma transação de leitura única, ou emitir consultas de bloqueio para elas, porque essas alterações e bloqueios não são visíveis para nenhuma outra transação.

* O ajuste `autocommit` está ativado, garantindo que a transação seja uma única instrução, e a única instrução que compõe a transação é uma instrução `SELECT` que não usa uma cláusula `FOR UPDATE` ou `LOCK IN SHARED MODE`. Isso significa uma `SELECT` que não usa uma cláusula `FOR UPDATE` ou `LOCK IN SHARED MODE`.

* A transação é iniciada sem a opção `READ ONLY`, mas ainda não foram executadas atualizações ou declarações que explicitamente bloqueiam linhas. Até que atualizações ou bloqueios explícitos sejam necessários, uma transação permanece no modo de leitura única.

Assim, para uma aplicação intensiva em leitura, como um gerador de relatórios, você pode ajustar uma sequência de consultas `InnoDB` agrupando-as dentro de `START TRANSACTION READ ONLY` e `COMMIT`, ou ativando a configuração `autocommit` antes de executar as instruções `SELECT`, ou simplesmente evitando qualquer declaração de alteração de dados intercalada com as consultas.

Para informações sobre `START TRANSACTION` e `autocommit`, consulte a Seção 15.3.1, “Instruções START TRANSACTION, COMMIT e ROLLBACK”.

Observação

As transações que se qualificam como auto-commit, não bloqueantes e de leitura apenas (AC-NL-RO) são excluídas de certas estruturas de dados internas do `InnoDB` e, portanto, não estão listadas na saída `SHOW ENGINE INNODB STATUS`.