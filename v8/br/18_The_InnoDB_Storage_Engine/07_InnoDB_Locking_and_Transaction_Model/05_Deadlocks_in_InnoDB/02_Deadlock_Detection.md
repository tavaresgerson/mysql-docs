#### 17.7.5.2 Detecção de Engano

Quando a detecção de impasses está habilitada (o padrão), o `InnoDB` detecta automaticamente impasses de transações e desfaz uma transação ou transações para quebrar o impasse. O `InnoDB` tenta escolher pequenas transações para desfazer, onde o tamanho de uma transação é determinado pelo número de linhas inseridas, atualizadas ou excluídas.

`InnoDB` está ciente de bloqueios de tabela se `innodb_table_locks = 1` (o padrão) e `autocommit = 0` estiverem ativados, e a camada MySQL acima dele sabe sobre bloqueios de nível de linha. Caso contrário, `InnoDB` não consegue detectar deadlocks quando um conjunto de bloqueios de tabela definido por uma instrução MySQL `LOCK TABLES` ou um bloqueio definido por um mecanismo de armazenamento diferente de `InnoDB` estiver envolvido. Resolva essas situações definindo o valor da variável de sistema `innodb_lock_wait_timeout`.

Se a seção `LATEST DETECTED DEADLOCK` do monitor `InnoDB` de saída incluir uma mensagem indicando PESQUISA COM DEMAIS PROFUNDIDADE OU COM DEMAIS DURAÇÃO NA TÁBUA DE ESPERA-POR-GRAFICA, REVERTIRÁ A TRANSACÇÃO SEGUINTE. Isso indica que o número de transações na lista de espera atingiu um limite de 200. Uma lista de espera que exceda 200 transações é tratada como um impasse e a transação que tenta verificar a lista de espera é revertida. O mesmo erro também pode ocorrer se o thread de bloqueio precisar consultar mais de 1.000.000 de bloqueios detidas por transações na lista de espera.

Para técnicas de organização das operações de banco de dados para evitar deadlocks, consulte a Seção 17.7.5, “Deadlocks no InnoDB”.

##### Desativando a detecção de deadlocks

Em sistemas de alta concorrência, a detecção de travamento pode causar um atraso quando vários threads aguardam o mesmo bloqueio. Às vezes, pode ser mais eficiente desativar a detecção de travamento e confiar na configuração `innodb_lock_wait_timeout` para o rollback de transações quando ocorre um travamento. A detecção de travamento pode ser desativada usando a variável `innodb_deadlock_detect`.
