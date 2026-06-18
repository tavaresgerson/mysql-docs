#### 29.12.11.9 A tabela replication\_asynchronous\_connection\_failover\_managed

Esta tabela contém informações de configuração usadas pelo mecanismo de falha de conexão assíncrona da replica para lidar com grupos gerenciados, incluindo topologias de replicação de grupo.

Quando você adiciona um membro do grupo à lista de fontes e define-o como parte de um grupo gerenciado, o mecanismo de failover de conexão assíncrona atualiza a lista de fontes para mantê-la alinhada com as mudanças de associação, adicionando e removendo membros do grupo automaticamente quando eles se juntam ou saem. Quando o failover de conexão assíncrona é habilitado para um grupo de réplicas gerenciado pelo Grupo de Replicação, as listas de fontes são transmitidas a todos os membros do grupo quando eles se juntam e também quando as listas são alteradas.

O mecanismo de falha de conexão assíncrona realiza a transição para outro servidor disponível na lista de origem se outro servidor disponível na lista de origem tiver uma configuração de prioridade (peso) mais alta. Para um grupo gerenciado, o peso de uma origem é atribuído dependendo se ela é um servidor primário ou secundário. Portanto, assumindo que você configurou o grupo gerenciado para atribuir um peso mais alto a um servidor primário e um peso mais baixo a um servidor secundário, quando o primário for alterado, o peso mais alto será atribuído ao novo primário, e a replica será alterada para a conexão com ele. O mecanismo de falha de conexão assíncrona também realiza a transição de conexão se o servidor de origem gerenciado conectado atualmente sair do grupo gerenciado ou deixar de estar na maioria do grupo gerenciado. Para obter mais informações, consulte a Seção 19.4.9, “Alternar origens e réplicas com falha de conexão assíncrona”.

A tabela `replication_asynchronous_connection_failover_managed` tem essas colunas:

- `CHANNEL_NAME`

  O canal de replicação onde os servidores deste grupo gerenciado operam.

- `MANAGED_NAME`

  O identificador do grupo gerenciado. Para o serviço gerenciado `GroupReplication`, o identificador é o valor da variável de sistema `group_replication_group_name`.

- `MANAGED_TYPE`

  O tipo de serviço gerenciado que o mecanismo de falha de conexão assíncrona oferece para este grupo. O único valor atualmente disponível é `GroupReplication`.

- `CONFIGURATION`

  As informações de configuração para este grupo gerenciado. Para o serviço gerenciado `GroupReplication`, a configuração mostra os pesos atribuídos ao servidor primário do grupo e aos servidores secundários do grupo. Por exemplo: `{"Primary_weight": 80, "Secondary_weight": 60}`

  - `Primary_weight`: Número inteiro entre 0 e 100. Valor padrão é 80.

  - `Secondary_weight`: Número inteiro entre 0 e 100. O valor padrão é 60.

A tabela `replication_asynchronous_connection_failover_managed` tem esses índices:

- Chave primária em (`CHANNEL_NAME, MANAGED_NAME`)

`TRUNCATE TABLE` não é permitido para a tabela `replication_asynchronous_connection_failover_managed`.
