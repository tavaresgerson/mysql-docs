### 17.20.5 Gerenciamento de Erros do InnoDB

Os seguintes itens descrevem como o `InnoDB` gerencia erros. O `InnoDB` às vezes desfaz apenas a instrução que falhou, outras vezes desfaz toda a transação.

* Se você esgotar o espaço em disco em um espaço de tabelas, ocorre um erro "Tabela está cheia" do MySQL e o `InnoDB` desfaz a instrução SQL.

* Um impasse de transação faz o `InnoDB` desfazer toda a transação. Tente a transação inteira quando isso acontecer.

* Um timeout de espera de bloqueio faz o `InnoDB` desfazer a instrução atual (a instrução que estava esperando o bloqueio e encontrou o timeout). Para desfazer toda a transação, inicie o servidor com `--innodb-rollback-on-timeout` habilitado. Tente a instrução se usar o comportamento padrão, ou toda a transação se `--innodb-rollback-on-timeout` estiver habilitado.

* Ambos os impasses e timeouts de espera de bloqueio são normais em servidores ocupados e é necessário que as aplicações estejam cientes de que podem ocorrer e as lidem tentando novamente. Você pode torná-los menos prováveis fazendo o menor trabalho possível entre a primeira alteração de dados durante uma transação e o commit, para que os bloqueios sejam mantidos por um tempo o mais curto possível e pelo menor número possível de linhas. Às vezes, dividir o trabalho entre diferentes transações pode ser prático e útil.

* Um erro de chave duplicada desfaz a instrução SQL, se você não especificar a opção `IGNORE` na sua instrução.

* Um erro de "linha muito longa" desfaz a instrução SQL.

* Outros erros são detectados principalmente pela camada de código do MySQL (acima do nível do motor de armazenamento `InnoDB`), e eles desfazem a instrução SQL correspondente. Os bloqueios não são liberados em um desfazamento de uma única instrução SQL.

Durante rollback implícitos, bem como durante a execução de uma instrução SQL explícita `ROLLBACK`, o comando `SHOW PROCESSLIST` exibe "Rolling back" na coluna "Estado" para a conexão relevante.