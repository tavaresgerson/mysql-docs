### 8.5.3 Otimização de Transações de Leitura Apenas de Leitura do InnoDB

O `InnoDB` pode evitar o overhead associado à configuração do ID da transação (`TRX_ID` campo) para transações que são conhecidas como de leitura somente. Um ID de transação é necessário apenas para uma transação que possa realizar operações de escrita ou bloqueio de leituras, como `SELECT ... FOR UPDATE`. A eliminação de IDs de transação desnecessários reduz o tamanho das estruturas de dados internas que são consultadas sempre que uma consulta ou uma declaração de alteração de dados constrói uma visão de leitura.

O `InnoDB` detecta transações somente de leitura quando:

- A transação é iniciada com a instrução `START TRANSACTION READ ONLY`. Nesse caso, tentar fazer alterações no banco de dados (para `InnoDB`, `MyISAM` ou outros tipos de tabelas) causa um erro, e a transação continua no estado de leitura apenas:

  ```sql
  ERROR 1792 (25006): Cannot execute statement in a READ ONLY transaction.
  ```

  Você ainda pode fazer alterações em tabelas temporárias específicas de sessão em uma transação apenas de leitura ou emitir consultas de bloqueio para elas, porque essas alterações e bloqueios não são visíveis para nenhuma outra transação.

- A configuração `autocommit` está ativada, garantindo que a transação seja uma única instrução e que a única instrução que compõe a transação seja uma instrução `SELECT` sem bloqueio (`non-locking`). Ou seja, uma `SELECT` que não utiliza a cláusula `FOR UPDATE` ou `LOCK IN SHARED MODE`.

- A transação é iniciada sem a opção `LEITURA SOMENTE`, mas ainda não foram executadas nenhuma atualização ou declaração que bloqueie explicitamente as linhas. Até que atualizações ou bloqueios explícitos sejam necessários, a transação permanece no modo de leitura somente.

Assim, para uma aplicação intensiva em leitura, como um gerador de relatórios, você pode ajustar uma sequência de consultas do `InnoDB` agrupando-as dentro de `START TRANSACTION READ ONLY` e `COMMIT`, ou ativando a configuração `autocommit` antes de executar as instruções `SELECT`, ou simplesmente evitando qualquer declaração de alteração de dados intercalada com as consultas.

Para obter informações sobre `START TRANSACTION` e `autocommit`, consulte a Seção 13.3.1, “Instruções START TRANSACTION, COMMIT e ROLLBACK”.

Nota

As transações que se qualificam como auto-commit, sem bloqueio e apenas de leitura (AC-NL-RO) são excluídas de certas estruturas de dados internas do `InnoDB` e, portanto, não são listadas na saída do `SHOW ENGINE INNODB STATUS`.
