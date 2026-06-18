#### 14.7.5.2 Detecção de Deadlock

Quando a detecção de *deadlock* está habilitada (o padrão), o `InnoDB` detecta automaticamente *deadlocks* de transação e faz o *rollback* de uma transação ou transações para quebrar o *deadlock*. O `InnoDB` tenta escolher transações menores para fazer o *rollback*, onde o tamanho de uma transação é determinado pelo número de linhas inseridas, atualizadas ou excluídas.

O `InnoDB` está ciente de *table locks* se `innodb_table_locks = 1` (o padrão) e `autocommit = 0`, e a camada MySQL acima dele souber sobre *row-level locks*. Caso contrário, o `InnoDB` não pode detectar *deadlocks* onde estejam envolvidos um *table lock* definido por uma instrução `LOCK TABLES` do MySQL ou um *lock* definido por um *storage engine* diferente do `InnoDB`. Resolva essas situações definindo o valor da variável de sistema `innodb_lock_wait_timeout`.

Se a seção `LATEST DETECTED DEADLOCK` da saída do Monitor `InnoDB` incluir uma mensagem indicando: “TOO DEEP OR LONG SEARCH IN THE LOCK TABLE WAITS-FOR GRAPH, WE WILL ROLL BACK FOLLOWING TRANSACTION,” isso indica que o número de transações na lista *wait-for* atingiu um limite de 200. Uma lista *wait-for* que excede 200 transações é tratada como um *deadlock* e a transação que tenta verificar a lista *wait-for* tem seu *rollback* realizado. O mesmo erro também pode ocorrer se o *locking thread* precisar analisar mais de 1.000.000 de *locks* pertencentes a transações na lista *wait-for*.

Para técnicas de organização de operações de *Database* para evitar *deadlocks*, consulte a Seção 14.7.5, “Deadlocks in InnoDB”.

##### Desabilitando a Detecção de Deadlock

Em sistemas de alta concorrência, a detecção de *deadlock* pode causar lentidão quando vários *threads* esperam pelo mesmo *lock*. Às vezes, pode ser mais eficiente desabilitar a detecção de *deadlock* e confiar na configuração `innodb_lock_wait_timeout` para o *rollback* da transação quando um *deadlock* ocorre. A detecção de *deadlock* pode ser desabilitada usando a variável `innodb_deadlock_detect`.