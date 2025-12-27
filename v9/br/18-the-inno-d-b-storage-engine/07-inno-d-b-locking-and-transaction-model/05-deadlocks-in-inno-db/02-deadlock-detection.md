#### 17.7.5.2 Detecção de Engarrafamento

Quando a detecção de engarrafamento está habilitada (o padrão), o `InnoDB` detecta automaticamente os engarrafamentos de transações e desfaz uma ou mais transações para quebrar o engarrafamento. O `InnoDB` tenta desfazer transações pequenas, onde o tamanho de uma transação é determinado pelo número de linhas inseridas, atualizadas ou excluídas.

O `InnoDB` está ciente dos bloqueios de tabela se `innodb_table_locks = 1` (o padrão) e `autocommit = 0`, e a camada MySQL acima dele sabe sobre bloqueios de nível de linha. Caso contrário, o `InnoDB` não pode detectar engarrafamentos em que um conjunto de bloqueios de tabela definido por uma instrução `LOCK TABLES` do MySQL ou um conjunto de bloqueios definido por um mecanismo de armazenamento diferente do `InnoDB` esteja envolvido. Resolva essas situações definindo o valor da variável de sistema `innodb_lock_wait_timeout`.

Se a seção `LATEST DETECTED DEADLOCK` (Engarrafamento Detectada Mais Recentemente) da saída do Monitor do `InnoDB` incluir uma mensagem indicando BUSCA EXTREMAMENTE PROFUNDA OU LONGA NA TELA DE ESPERA DO GRÁFICO, DESFAZEMOS A SEGUINTE TRANSAÇÃO, isso indica que o número de transações na lista de espera atingiu um limite de 200. Uma lista de espera que exceda 200 transações é tratada como um engarrafamento e a transação que tenta verificar a lista de espera é desfeita. O mesmo erro também pode ocorrer se o thread de bloqueio precisar consultar mais de 1.000.000 de bloqueios detidas por transações na lista de espera.

Para técnicas de organização das operações de banco de dados para evitar engarrafamentos, consulte a Seção 17.7.5, “Engarrafamentos no `InnoDB’”.

##### Desabilitação da Detecção de Engarrafamento

Em sistemas de alta concorrência, a detecção de travamento pode causar um atraso quando vários threads aguardam o mesmo bloqueio. Às vezes, pode ser mais eficiente desabilitar a detecção de travamento e confiar no ajuste `innodb_lock_wait_timeout` para o rollback de transações quando ocorre um travamento. A detecção de travamento pode ser desativada usando a variável `innodb_deadlock_detect`.