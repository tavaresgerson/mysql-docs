### 14.22.4 Gerenciamento de Erros do InnoDB

Os itens a seguir descrevem como o `InnoDB` gerencia os erros. O `InnoDB` às vezes desfaz apenas a instrução que falhou, outras vezes desfaz toda a transação.

- Se você ficar sem espaço em disco em um espaço de tabelas, um erro "Tabela está cheia" do MySQL ocorre e o `InnoDB` desfaz a instrução SQL.

- Um impasse de transação faz com que o `InnoDB` desfaça toda a transação. Tente a transação inteira quando isso acontecer.

  Um tempo de espera para bloqueio faz com que o `InnoDB` desfaça a declaração atual (a declaração que estava esperando pelo bloqueio e encontrou o tempo de espera). Para fazer com que toda a transação seja desfeita, inicie o servidor com `--innodb-rollback-on-timeout` habilitado. Repita a declaração se estiver usando o comportamento padrão ou toda a transação se `--innodb-rollback-on-timeout` estiver habilitado.

  Ambos os bloqueios e os timeout de espera de bloqueio são normais em servidores movimentados, e é necessário que as aplicações estejam cientes de que isso pode acontecer e lidem com isso tentando novamente. Você pode torná-los menos prováveis fazendo o menor trabalho possível entre a primeira alteração de dados durante uma transação e o commit, para que os bloqueios sejam mantidos por um tempo o mais curto possível e para o menor número possível de linhas. Às vezes, dividir o trabalho entre diferentes transações pode ser prático e útil.

- Um erro de chave duplicada reverte a instrução SQL, se você não tiver especificado a opção `IGNORE` na sua instrução.

- Um erro de "linha muito longa" desfaz a instrução SQL.

- Outros erros são detectados principalmente pela camada de código MySQL (acima do nível do mecanismo de armazenamento `InnoDB`), e eles revertem a declaração SQL correspondente. As bloqueadas não são liberadas em um rollback de uma única declaração SQL.

Durante rollback implícitos, bem como durante a execução de uma instrução SQL explícita `ROLLBACK`, o `SHOW PROCESSLIST` exibe "Rolling back" na coluna `Estado` para a conexão relevante.
