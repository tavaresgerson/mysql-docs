## 14.22 Solução de Problemas do InnoDB

14.22.1 Solução de Problemas de I/O do InnoDB

14.22.2 Forçando a Recuperação do InnoDB

14.22.3 Solução de Problemas em Operações do Data Dictionary do InnoDB

14.22.4 Tratamento de Erros do InnoDB

As seguintes diretrizes gerais se aplicam à solução de problemas do `InnoDB`:

* Quando uma operação falhar ou você suspeitar de um bug, verifique o error log do servidor MySQL (consulte Seção 5.4.2, “The Error Log”). O Server Error Message Reference fornece informações de solução de problemas para alguns dos erros comuns específicos do `InnoDB` que você pode encontrar.

* Se a falha estiver relacionada a um Deadlock, execute com a opção `innodb_print_all_deadlocks` ativada para que os detalhes sobre cada Deadlock sejam impressos no error log do servidor MySQL. Para obter informações sobre Deadlocks, consulte Seção 14.7.5, “Deadlocks in InnoDB”.

* Problemas relacionados ao Data Dictionary do `InnoDB` incluem falhas nas instruções `CREATE TABLE` (arquivos de Table órfãos), incapacidade de abrir arquivos do `InnoDB` e erros de `system cannot find the path specified`. Para obter informações sobre esses tipos de problemas e erros, consulte Seção 14.22.3, “Solução de Problemas em Operações do Data Dictionary do InnoDB”.

* Ao solucionar problemas, geralmente é melhor executar o servidor MySQL a partir do prompt de comando, em vez de usar o **mysqld_safe** ou como um Windows service. Assim, você pode ver o que o **mysqld** imprime no console e ter uma melhor compreensão do que está acontecendo. No Windows, inicie o **mysqld** com a opção `--console` para direcionar a saída para a janela do console.

* Ative os `InnoDB` Monitors para obter informações sobre um problema (consulte Seção 14.18, “InnoDB Monitors”). Se o problema estiver relacionado ao desempenho, ou se o seu servidor parecer travado (hung), você deve ativar o Monitor padrão para imprimir informações sobre o estado interno do `InnoDB`. Se o problema for com Locks, ative o Lock Monitor. Se o problema for com a criação de Table, Tablespaces ou operações do Data Dictionary, consulte as system tables do InnoDB Information Schema para examinar o conteúdo do Data Dictionary interno do `InnoDB`.

  O `InnoDB` ativa temporariamente a saída padrão do `InnoDB` Monitor sob as seguintes condições:

  + Uma longa espera por semaphore
  + O `InnoDB` não consegue encontrar blocos livres no Buffer Pool
  + Mais de 67% do Buffer Pool está ocupado por lock heaps ou pelo adaptive hash index

* Se você suspeitar que uma Table está corrompida, execute `CHECK TABLE` nessa Table.