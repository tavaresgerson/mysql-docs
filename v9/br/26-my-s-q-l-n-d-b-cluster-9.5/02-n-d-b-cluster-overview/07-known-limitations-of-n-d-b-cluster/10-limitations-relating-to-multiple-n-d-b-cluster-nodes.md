#### 25.2.7.10 Limitações relacionadas a múltiplos nós do clúster NDB

**Nodos SQL múltiplos.** Abaixo estão as questões relacionadas ao uso de múltiplos servidores MySQL como nós SQL do clúster NDB, e são específicas ao mecanismo de armazenamento `NDBCLUSTER`:

* **Programas armazenados não distribuídos.** Procedimentos armazenados, funções armazenadas, gatilhos e eventos agendados são todos suportados por tabelas usando o mecanismo de armazenamento `NDB`, mas esses não se propagam automaticamente entre os Servidores MySQL que atuam como nós SQL do clúster, e devem ser recriados separadamente em cada nó SQL. Veja Rotinas e gatilhos armazenados no NDB Cluster.

* **Nenhuma bloqueio de tabela distribuído.** Uma declaração `LOCK TABLES` ou chamada `GET_LOCK()` funciona apenas para o nó SQL em que o bloqueio é emitido; nenhum outro nó SQL no clúster "ve" este bloqueio. Isso é verdade para um bloqueio emitido por qualquer declaração que bloqueie tabelas como parte de suas operações. (Veja o próximo item para um exemplo.)

* **Bloqueio de tabela implementado em `NDBCLUSTER` pode ser feito em um aplicativo de API, e garantir que todas as aplicações comecem definindo `LockMode` para `LM_Read` ou `LM_Exclusive`. Para mais informações sobre como fazer isso, veja a descrição de `NdbOperation::getLockHandle()` no *Guia de API do NDB Cluster*.

* **Operações de alteração de tabela.** `ALTER TABLE` não está totalmente bloqueando ao executar múltiplos Servidores MySQL (nós SQL). (Como discutido no item anterior, o NDB Cluster não suporta bloqueios de tabela distribuídos.)

**Nodos de gerenciamento múltiplos.** Ao usar múltiplos servidores de gerenciamento:

* Se algum dos servidores de gerenciamento estiverem rodando no mesmo host, você deve atribuir IDs explícitos aos nós nas cadeias de conexão, pois a alocação automática de IDs de nó não funciona em múltiplos servidores de gerenciamento no mesmo host. Isso não é necessário se cada servidor de gerenciamento estiver em um host diferente.

* Quando um servidor de gerenciamento começa, ele primeiro verifica se há outros servidores de gerenciamento no mesmo NDB Cluster e, após a conexão bem-sucedida com o outro servidor de gerenciamento, usa seus dados de configuração. Isso significa que as opções de inicialização `--reload` e `--initial` do servidor de gerenciamento são ignoradas, a menos que o servidor de gerenciamento seja o único em execução. Isso também significa que, ao realizar um reinício contínuo de um NDB Cluster com múltiplos nós de gerenciamento, o servidor de gerenciamento lê seu próprio arquivo de configuração se (e apenas se) ele for o único servidor de gerenciamento em execução neste NDB Cluster. Veja a Seção 25.6.5, “Realizando um Reinício Contínuo de um NDB Cluster”, para mais informações.

**Endereços de rede múltiplos.** Endereços de rede múltiplos por nó de dados não são suportados. O uso desses pode causar problemas: Em caso de falha de um nó de dados, um nó SQL aguarda confirmação de que o nó de dados caiu, mas nunca a recebe porque outra rota para esse nó de dados permanece aberta. Isso pode tornar o cluster inoperável.

Nota

É possível usar múltiplas *interfaces* de hardware de rede (como placas Ethernet) para um único nó de dados, mas elas devem estar vinculadas ao mesmo endereço. Isso também significa que não é possível usar mais de uma seção `[tcp]` por conexão no arquivo `config.ini`. Veja a Seção 25.4.3.10, “Conexões TCP/IP de NDB Cluster”, para mais informações.