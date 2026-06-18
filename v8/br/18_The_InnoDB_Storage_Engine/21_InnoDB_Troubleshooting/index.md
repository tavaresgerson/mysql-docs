## 17.21 Solução de problemas do InnoDB

17.21.1 Solução de problemas com problemas de I/O do InnoDB

17.21.2 Solução de problemas de falhas na recuperação

17.21.3 Forçar a recuperação do InnoDB

17.21.4 Solução de problemas das operações do dicionário de dados do InnoDB

17.21.5 Gerenciamento de Erros do InnoDB

As seguintes diretrizes gerais se aplicam ao solução de problemas do `InnoDB`:

- Quando uma operação falhar ou você suspeitar de um erro, consulte o log de erros do servidor MySQL (consulte a Seção 7.4.2, “O Log de Erros”). A Referência de Mensagens de Erro do Servidor fornece informações para solução de problemas para alguns dos erros específicos do `InnoDB` que você pode encontrar.

- Se a falha estiver relacionada a um impasse, execute com a opção `innodb_print_all_deadlocks` habilitada para que detalhes sobre cada impasse sejam impressos no log de erro do servidor MySQL. Para obter informações sobre impasses, consulte a Seção 17.7.5, “Impasses no InnoDB”.

- Se o problema estiver relacionado ao dicionário de dados `InnoDB`, consulte a Seção 17.21.4, “Soluções de problemas nas operações do dicionário de dados InnoDB”.

- Ao resolver problemas, geralmente é melhor executar o servidor MySQL a partir do prompt de comando, em vez de usar o **mysqld\_safe** ou como um serviço do Windows. Você pode então ver o que o **mysqld** imprime no console e, assim, ter uma melhor compreensão do que está acontecendo. No Windows, inicie o **mysqld** com a opção `--console` para direcionar a saída para a janela do console.

- Ative os monitores `InnoDB` para obter informações sobre um problema (consulte a Seção 17.17, “Monitores InnoDB”). Se o problema estiver relacionado ao desempenho ou se o servidor parecer estar parado, você deve ativar o Monitor padrão para imprimir informações sobre o estado interno de `InnoDB`. Se o problema estiver relacionado a bloqueios, ative o Monitor de Bloqueios. Se o problema estiver relacionado à criação de tabelas, aos espaços de tabelas ou às operações do dicionário de dados, consulte as tabelas do esquema de informações InnoDB para examinar o conteúdo do dicionário de dados interno `InnoDB`.

  `InnoDB` habilita temporariamente a saída padrão do Monitor `InnoDB` nas seguintes condições:

  - Uma longa espera por um semaforo

  - `InnoDB` não consegue encontrar blocos livres no pool de buffer

  - Mais de 67% do pool de tampão está ocupado por pilhas de bloqueio ou pelo índice de hash adaptativo

- Se você suspeitar que uma tabela está corrompida, execute `CHECK TABLE` naquela tabela.
