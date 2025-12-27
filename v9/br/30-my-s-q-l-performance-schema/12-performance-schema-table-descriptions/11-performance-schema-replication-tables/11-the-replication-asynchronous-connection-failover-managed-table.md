#### 29.12.11.11 A tabela `replication_asynchronous_connection_failover_managed`

Esta tabela contém informações de configuração usadas pelo mecanismo de falha de conexão assíncrona da replica para gerenciar grupos gerenciados, incluindo topologias de replicação de grupo.

Quando você adiciona um membro do grupo à lista de origem e o define como parte de um grupo gerenciado, o mecanismo de falha de conexão assíncrona atualiza a lista de origem para mantê-la alinhada com as mudanças de associação, adicionando e removendo membros do grupo automaticamente à medida que eles se juntam ou saem. Quando a falha de conexão assíncrona é habilitada para um grupo de réplicas gerenciadas pelo Grupo de Replicação, as listas de origem são transmitidas a todos os membros do grupo quando eles se juntam e também quando as listas mudam.

O mecanismo de falha de conexão assíncrona falha na conexão se outro servidor disponível na lista de origem tiver um conjunto de prioridades (peso) mais alto. Para um grupo gerenciado, o peso de uma fonte é atribuído dependendo se é um servidor primário ou secundário. Portanto, assumindo que você configurou o grupo gerenciado para dar um peso maior a um primário e um peso menor a um secundário, quando o primário muda, o peso mais alto é atribuído ao novo primário, então a replica muda a conexão para ele. O mecanismo de falha de conexão assíncrona também muda a conexão se o servidor de origem gerenciado atualmente conectado sair do grupo gerenciado ou deixar de estar na maioria no grupo gerenciado. Para mais informações, consulte a Seção 19.4.9, “Alternar Fontes e Réplicas com Falha de Conexão Assíncrona”.

A tabela `replication_asynchronous_connection_failover_managed` tem essas colunas:

* `CHANNEL_NAME`

  O canal de replicação onde os servidores deste grupo gerenciado operam.

* `MANAGED_NAME`

O identificador do grupo gerenciado. Para o serviço gerenciado `GroupReplication`, o identificador é o valor da variável de sistema `group_replication_group_name`.

* `MANAGED_TYPE`

  O tipo de serviço gerenciado que o mecanismo de falha de conexão assíncrona fornece para este grupo. O único valor atualmente disponível é `GroupReplication`.

* `CONFIGURATION`

  As informações de configuração para este grupo gerenciado. Para o serviço gerenciado `GroupReplication`, a configuração mostra os pesos atribuídos ao servidor primário do grupo e aos servidores secundários do grupo. Por exemplo: `{"Primary_weight": 80, "Secondary_weight": 60}`

  + `Primary_weight`: Inteiro entre 0 e 100. Valor padrão é 80.

  + `Secondary_weight`: Inteiro entre 0 e 100. Valor padrão é 60.

A tabela `replication_asynchronous_connection_failover_managed` tem esses índices:

* Chave primária em (`CHANNEL_NAME, MANAGED_NAME`)

O `TRUNCATE TABLE` não é permitido para a tabela `replication_asynchronous_connection_failover_managed`.