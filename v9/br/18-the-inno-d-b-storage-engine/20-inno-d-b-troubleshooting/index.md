## 17.20 Solução de Problemas do InnoDB

17.20.1 Solução de Problemas de E/S do InnoDB

17.20.2 Solução de Falhas de Recuperação

17.20.3 Forçar a Recuperação do InnoDB

17.20.4 Solução de Problemas com Operações do Dicionário de Dados do InnoDB

17.20.5 Gerenciamento de Erros do InnoDB

As seguintes diretrizes gerais se aplicam à solução de problemas do `InnoDB`:

* Quando uma operação falhar ou você suspeitar de um bug, consulte o log de erro do servidor MySQL (veja a Seção 7.4.2, “O Log de Erro”). A Referência de Mensagens de Erro do Servidor fornece informações sobre a solução de problemas para alguns dos erros específicos do `InnoDB` comuns que você pode encontrar.

* Se a falha estiver relacionada a um impasse, execute com a opção `innodb_print_all_deadlocks` habilitada para que detalhes sobre cada impasse sejam impressos no log de erro do servidor MySQL. Para informações sobre impasses, consulte a Seção 17.7.5, “Impasses no InnoDB”.

* Se o problema estiver relacionado ao dicionário de dados do `InnoDB`, consulte a Seção 17.20.4, “Solução de Problemas com Operações do Dicionário de Dados do InnoDB”.

* Ao solucionar problemas, geralmente é melhor executar o servidor MySQL a partir do prompt de comando, em vez de através do **mysqld_safe** ou como um serviço do Windows. Você pode então ver o que o **mysqld** imprime na console e, assim, ter uma melhor compreensão do que está acontecendo. No Windows, inicie o **mysqld** com a opção `--console` para direcionar a saída para a janela da console.

* Ative os monitores do `InnoDB` para obter informações sobre um problema (consulte a Seção 17.17, “Monitores do `InnoDB`”). Se o problema estiver relacionado ao desempenho ou se o servidor parecer bloqueado, você deve ativar o monitor padrão para imprimir informações sobre o estado interno do `InnoDB`. Se o problema estiver relacionado a bloqueios, ative o monitor de bloqueios. Se o problema estiver relacionado à criação de tabelas, aos espaços de tabelas ou às operações do dicionário de dados, consulte as tabelas do esquema de informações do `InnoDB` para examinar o conteúdo do dicionário de dados interno do `InnoDB`.

O `InnoDB` habilita temporariamente a saída padrão do monitor do `InnoDB` nas seguintes condições:

+ Uma espera longa por semaforos
+ O `InnoDB` não consegue encontrar blocos livres no pool de buffers

+ Mais de 67% do pool de buffers estão ocupados por pilhas de bloqueios ou pelo índice de hash adaptativo

* Se você suspeitar que uma tabela está corrompida, execute `CHECK TABLE` naquela tabela.