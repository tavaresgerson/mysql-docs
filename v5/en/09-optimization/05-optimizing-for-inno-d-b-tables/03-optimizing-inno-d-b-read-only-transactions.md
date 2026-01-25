### 8.5.3 Otimizando Transações Read-Only do InnoDB

O `InnoDB` pode evitar a sobrecarga associada à configuração do ID de transação (campo `TRX_ID`) para transações que são conhecidas por serem read-only. Um ID de transação é necessário apenas para uma transação que possa realizar operações de escrita ou leituras com Lock (locking reads), como `SELECT ... FOR UPDATE`. Eliminar IDs de transação desnecessários reduz o tamanho das estruturas de dados internas que são consultadas cada vez que uma Query ou instrução de alteração de dados constrói uma read view.

O `InnoDB` detecta transações read-only quando:

* A transação é iniciada com a instrução `START TRANSACTION READ ONLY`. Neste caso, tentar fazer alterações no Database (para tabelas `InnoDB`, `MyISAM` ou outros tipos) causa um erro, e a transação continua no estado read-only:

  ```sql
  ERROR 1792 (25006): Cannot execute statement in a READ ONLY transaction.
  ```

  Você ainda pode fazer alterações em tabelas temporárias específicas da sessão em uma transação read-only, ou emitir Locking Queries para elas, porque essas alterações e Locks não são visíveis para nenhuma outra transação.

* A configuração `autocommit` está ativada, de modo que a transação é garantida ser uma única instrução, e a instrução única que compõe a transação é uma instrução `SELECT` “non-locking”. Ou seja, um `SELECT` que não utiliza uma cláusula `FOR UPDATE` ou `LOCK IN SHARED MODE`.

* A transação é iniciada sem a opção `READ ONLY`, mas nenhuma atualização ou instrução que explicitamente bloqueie linhas foi executada ainda. Até que atualizações ou Locks explícitos sejam necessários, uma transação permanece no modo read-only.

Assim, para um aplicativo com uso intensivo de leitura (read-intensive), como um gerador de relatórios, você pode ajustar uma sequência de Queries `InnoDB` agrupando-as dentro de `START TRANSACTION READ ONLY` e `COMMIT`, ou ativando a configuração `autocommit` antes de executar as instruções `SELECT`, ou simplesmente evitando quaisquer instruções de alteração de dados intercaladas com as Queries.

Para informações sobre `START TRANSACTION` e `autocommit`, consulte a Seção 13.3.1, “Instruções START TRANSACTION, COMMIT e ROLLBACK”.

Nota

Transações que se qualificam como auto-commit, non-locking e read-only (AC-NL-RO) são mantidas fora de certas estruturas de dados internas do `InnoDB` e, portanto, não são listadas na saída de `SHOW ENGINE INNODB STATUS`.