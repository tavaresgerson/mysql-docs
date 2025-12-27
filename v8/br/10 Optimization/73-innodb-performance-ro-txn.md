### 10.5.3 Otimizando Transações de Leitura Única do InnoDB

O `InnoDB` pode evitar o overhead associado à configuração do ID da transação (`TRX_ID` campo) para transações que são conhecidas como de leitura única. Um ID de transação é necessário apenas para uma transação que pode realizar operações de escrita ou bloqueio de leituras, como `SELECT ... FOR UPDATE`. Eliminar IDs de transação desnecessários reduz o tamanho das estruturas de dados internas que são consultadas cada vez que uma consulta ou declaração de alteração de dados constrói uma visão de leitura.

O `InnoDB` detecta transações de leitura única quando:

* A transação é iniciada com a declaração `START TRANSACTION READ ONLY`. Nesse caso, tentar fazer alterações no banco de dados (para `InnoDB`, `MyISAM` ou outros tipos de tabelas) causa um erro, e a transação continua no estado de leitura única:

  ```
  ERROR 1792 (25006): Cannot execute statement in a READ ONLY transaction.
  ```

  Você ainda pode fazer alterações em tabelas temporárias específicas da sessão em uma transação de leitura única, ou emitir consultas de bloqueio para elas, porque essas alterações e bloqueios não são visíveis para nenhuma outra transação.
* O ajuste `autocommit` está ativado, garantindo que a transação seja uma única declaração, e a única declaração que compõe a transação é uma consulta `SELECT` que não usa uma cláusula `FOR UPDATE` ou `LOCK IN SHARED MODE`. Ou seja, uma consulta `SELECT` que não usa uma cláusula `FOR UPDATE` ou `LOCK IN SHARED MODE`.
* A transação é iniciada sem a opção `READ ONLY`, mas nenhuma atualização ou declaração que bloqueie explicitamente linhas ainda foi executada. Até que atualizações ou bloqueios explícitos sejam necessários, uma transação permanece no modo de leitura única.

Assim, para uma aplicação intensiva em leitura, como um gerador de relatórios, você pode ajustar uma sequência de consultas `InnoDB agrupando-as dentro de `START TRANSACTION READ ONLY` e `COMMIT`, ou ativando o ajuste `autocommit` antes de executar as consultas `SELECT`, ou simplesmente evitando quaisquer declarações de alteração de dados intercaladas com as consultas.

Para obter informações sobre `START TRANSACTION` e `autocommit`, consulte a Seção 15.3.1, “Instruções `START TRANSACTION`, `COMMIT` e `ROLLBACK`”.

::: info Nota

Transações que se qualificam como auto-commit, não bloqueiam e são apenas de leitura (AC-NL-RO) são excluídas de certas estruturas de dados internas do `InnoDB` e, portanto, não são listadas na saída `SHOW ENGINE INNODB STATUS`.