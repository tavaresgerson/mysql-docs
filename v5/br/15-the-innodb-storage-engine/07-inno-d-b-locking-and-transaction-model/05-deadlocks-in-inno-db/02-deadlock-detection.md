#### 14.7.5.2 Detecção de Congelamento

Quando a detecção de impasses está habilitada (o padrão), o `InnoDB` detecta automaticamente impasses de transações e desfaz uma ou mais transações para quebrar o impasse. O `InnoDB` tenta desfazer transações pequenas, onde o tamanho de uma transação é determinado pelo número de linhas inseridas, atualizadas ou excluídas.

O `InnoDB` está ciente das blocações de tabela se `innodb_table_locks = 1` (o padrão) e `autocommit = 0`, e a camada MySQL acima dele sabe sobre blocações de nível de linha. Caso contrário, o `InnoDB` não consegue detectar deadlocks quando um conjunto de bloqueio de tabela definido por uma instrução `LOCK TABLES` do MySQL ou um conjunto de bloqueio definido por um mecanismo de armazenamento diferente do `InnoDB` está envolvido. Resolva essas situações definindo o valor da variável de sistema `innodb_lock_wait_timeout`.

Se a seção `Última Ocultação de Engarrafamento` do Monitor do `InnoDB` incluir uma mensagem que diz: “PESQUISA EXTREMAMENTE PROFUNDA OU LONGA NA TÁBUA DE LOCK WAITS-FOR AGORA, REVERTIREMOS A TRANSACÇÃO”, isso indica que o número de transações na lista de espera atingiu um limite de 200. Uma lista de espera que exceda 200 transações é tratada como um engarrafamento e a transação que tenta verificar a lista de espera é revertida. O mesmo erro também pode ocorrer se o thread de bloqueio precisar consultar mais de 1.000.000 de bloqueios detidos por transações na lista de espera.

Para técnicas de organização das operações de banco de dados para evitar deadlocks, consulte a Seção 14.7.5, “Deadlocks no InnoDB”.

##### Desativando a detecção de deadlocks

Em sistemas de alta concorrência, a detecção de travamento pode causar um atraso quando vários threads aguardam o mesmo bloqueio. Às vezes, pode ser mais eficiente desabilitar a detecção de travamento e confiar no ajuste `innodb_lock_wait_timeout` para o rollback de transações quando ocorre um travamento. A detecção de travamento pode ser desativada usando a variável `innodb_deadlock_detect`.
