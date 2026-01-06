#### 21.2.7.10 Limitações relacionadas a múltiplos nós do cluster NDB

**Nodos SQL múltiplos.** Abaixo estão os problemas relacionados ao uso de múltiplos servidores MySQL como nós SQL do NDB Cluster, e são específicos ao mecanismo de armazenamento `NDBCLUSTER`:

- **Programas armazenados não são distribuídos.** Procedimentos armazenados, funções armazenadas, gatilhos e eventos agendados são suportados por tabelas usando o mecanismo de armazenamento `NDB`, mas esses não são propagados automaticamente entre Servidores MySQL que atuam como nós SQL do Cluster e devem ser recriados separadamente em cada nó SQL. Veja Programas Armazenados no NDB Cluster.

- **Nenhuma bloqueio de tabela distribuído.** Uma declaração `LOCK TABLES` ou uma chamada `GET_LOCK()` funciona apenas para o nó SQL no qual o bloqueio é emitido; nenhum outro nó SQL no clúster "ve" este bloqueio. Isso é verdade para um bloqueio emitido por qualquer declaração que bloqueie tabelas como parte de suas operações. (Veja o próximo item para um exemplo.)

  A implementação de bloqueios de tabela no `NDBCLUSTER` pode ser feita em um aplicativo de API, e garantir que todas as aplicações comecem definindo `LockMode` para `LM_Read` ou `LM_Exclusive`. Para obter mais informações sobre como fazer isso, consulte a descrição de `NdbOperation::getLockHandle()` no *Guia de API do NDB Cluster*.

- **Operações de ALTER TABLE.** `ALTER TABLE` não bloqueia completamente quando executa múltiplos servidores MySQL (nós SQL). (Como discutido no item anterior, o NDB Cluster não suporta bloqueios distribuídos de tabelas.)

**Nodos de gerenciamento múltiplos.** Ao usar múltiplos servidores de gerenciamento:

- Se algum dos servidores de gerenciamento estiver rodando no mesmo host, você deve atribuir IDs explícitos aos nós nas cadeias de conexão, pois a alocação automática de IDs de nó não funciona em múltiplos servidores de gerenciamento no mesmo host. Isso não é necessário se cada servidor de gerenciamento estiver em um host diferente.

- Quando um servidor de gerenciamento é iniciado, ele primeiro verifica se há outros servidores de gerenciamento no mesmo NDB Cluster. Após a conexão bem-sucedida com o outro servidor de gerenciamento, ele usa os dados de configuração. Isso significa que as opções de inicialização `--reload` e `--initial` são ignoradas, a menos que o servidor de gerenciamento seja o único em execução. Isso também significa que, ao realizar um reinício contínuo de um NDB Cluster com vários nós de gerenciamento, o servidor de gerenciamento lê seu próprio arquivo de configuração se (e apenas se) ele for o único servidor de gerenciamento em execução neste NDB Cluster. Consulte Seção 21.6.5, “Realizando um Reinício Contínuo de um NDB Cluster” para obter mais informações.

**Endereços de rede múltiplos.** Endereços de rede múltiplos por nó de dados não são suportados. O uso desses endereços pode causar problemas: em caso de falha de um nó de dados, um nó SQL aguarda confirmação de que o nó de dados caiu, mas nunca recebe essa confirmação porque outra rota para esse nó de dados permanece aberta. Isso pode tornar o clúster inoperável.

Nota

É possível usar várias *interfaces* (como placas Ethernet) de hardware de rede para um único nó de dados, mas elas devem estar vinculadas ao mesmo endereço. Isso também significa que não é possível usar mais de uma seção `[tcp]` por conexão no arquivo `config.ini`. Consulte Seção 21.4.3.10, “Conexões TCP/IP do NDB Cluster” para obter mais informações.
