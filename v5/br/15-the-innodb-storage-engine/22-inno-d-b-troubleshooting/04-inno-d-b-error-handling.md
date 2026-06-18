### 14.22.4 Tratamento de Erros do InnoDB

Os itens a seguir descrevem como o `InnoDB` executa o tratamento de erros. Às vezes, o `InnoDB` faz o *rollback* apenas do *statement* que falhou; em outras, ele faz o *rollback* da *transaction* inteira.

* Se você ficar sem espaço em disco em um *tablespace*, ocorre um erro do MySQL (`Table is full`) e o `InnoDB` faz o *rollback* do *SQL statement*.

* Um *deadlock* de *transaction* faz com que o `InnoDB` realize o *rollback* da *transaction* inteira. Tente novamente (*Retry*) a *transaction* inteira quando isso acontecer.

  Um *lock wait timeout* (tempo limite de espera por *lock*) faz com que o `InnoDB` realize o *rollback* do *statement* atual (o *statement* que estava esperando pelo *lock* e encontrou o tempo limite). Para que o *rollback* seja feito na *transaction* inteira, inicie o servidor com a opção `--innodb-rollback-on-timeout` habilitada. Tente novamente o *statement* se estiver usando o comportamento padrão, ou a *transaction* inteira se `--innodb-rollback-on-timeout` estiver habilitada.

  Tanto *deadlocks* quanto *lock wait timeouts* são normais em servidores ocupados, e é necessário que as aplicações estejam cientes de que eles podem ocorrer e os tratem realizando novas tentativas (*retrying*). Você pode torná-los menos prováveis realizando o mínimo de trabalho possível entre a primeira alteração de dados durante uma *transaction* e o *commit*, para que os *locks* sejam mantidos pelo menor tempo possível e para o menor número possível de linhas. Às vezes, dividir o trabalho entre diferentes *transactions* pode ser prático e útil.

* Um erro de *duplicate-key* faz o *rollback* do *SQL statement*, caso você não tenha especificado a opção `IGNORE` em seu *statement*.

* Um erro de `row too long error` faz o *rollback* do *SQL statement*.

* Outros erros são em grande parte detectados pela camada de código do MySQL (acima do nível do *storage engine* `InnoDB`), e eles fazem o *rollback* do *SQL statement* correspondente. *Locks* não são liberados em um *rollback* de um único *SQL statement*.

Durante *rollbacks* implícitos, bem como durante a execução de um *SQL statement* `ROLLBACK` explícito, o comando `SHOW PROCESSLIST` exibe `Rolling back` na coluna `State` para a conexão relevante.