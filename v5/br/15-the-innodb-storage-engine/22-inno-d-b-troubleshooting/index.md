## 14.22 Solução de problemas do InnoDB

14.22.1 Solução de problemas com problemas de I/O do InnoDB

14.22.2 Forçar a recuperação do InnoDB

14.22.3 Solução de problemas das operações do dicionário de dados InnoDB

14.22.4 Gerenciamento de Erros do InnoDB

As seguintes diretrizes gerais se aplicam ao solução de problemas do `InnoDB`:

- Quando uma operação falhar ou você suspeitar de um erro, consulte o log de erros do servidor MySQL (consulte a Seção 5.4.2, “O Log de Erros”). O Referência de Mensagens de Erro do Servidor fornece informações para solução de problemas para alguns dos erros específicos do `InnoDB` comuns que você pode encontrar.

- Se a falha estiver relacionada a um impasse, execute com a opção `innodb_print_all_deadlocks` habilitada para que detalhes sobre cada impasse sejam impressos no log de erro do servidor MySQL. Para obter informações sobre impasses, consulte a Seção 14.7.5, “Impasses no InnoDB”.

- Os problemas relacionados ao dicionário de dados do `InnoDB` incluem declarações `CREATE TABLE` falhas (arquivos de tabela órfã), incapacidade de abrir arquivos `InnoDB` e erros de sistema não encontrando o caminho especificado. Para obter informações sobre esse tipo de problema e erro, consulte a Seção 14.22.3, “Solução de problemas de operações do dicionário de dados do InnoDB”.

- Ao resolver problemas, geralmente é melhor executar o servidor MySQL a partir do prompt de comando, em vez de usar o **mysqld\_safe** ou como um serviço do Windows. Você pode então ver o que o **mysqld** imprime no console e, assim, ter uma melhor compreensão do que está acontecendo. No Windows, inicie o **mysqld** com a opção `--console` para direcionar a saída para a janela do console.

- Ative os monitores do `InnoDB` para obter informações sobre um problema (consulte a Seção 14.18, “Monitores do InnoDB”). Se o problema estiver relacionado ao desempenho ou se o servidor parecer estar parado, você deve ativar o monitor padrão para imprimir informações sobre o estado interno do `InnoDB`. Se o problema estiver relacionado a bloqueios, ative o monitor de bloqueios. Se o problema estiver relacionado à criação de tabelas, aos espaços de tabelas ou às operações do dicionário de dados, consulte as tabelas do esquema de informações do InnoDB para examinar o conteúdo do dicionário de dados interno do `InnoDB`.

  O `InnoDB` habilita temporariamente a saída padrão do Monitor `InnoDB` nas seguintes condições:

  - Uma longa espera por um semaforo

  - `InnoDB` não consegue encontrar blocos livres no pool de buffer

  - Mais de 67% do pool de tampão está ocupado por pilhas de bloqueio ou pelo índice de hash adaptativo

- Se você suspeitar que uma tabela está corrompida, execute `CHECK TABLE` naquela tabela.
