#### 29.12.11.8 A tabela replication\_asynchronous\_connection\_failover

Esta tabela contém as listas de origem das réplicas para cada canal de replicação para o mecanismo de falha de conexão assíncrona. O mecanismo de falha de conexão assíncrona estabelece automaticamente uma conexão de replicação assíncrona (da origem para a réplica) para uma nova origem da lista apropriada após a falha da conexão existente da réplica para sua origem. Quando a falha de conexão assíncrona é habilitada para um grupo de réplicas gerenciadas pela Replicação em Grupo, as listas de origem são transmitidas para todos os membros do grupo quando eles se juntam e também quando as listas são alteradas.

Você define e gerencia listas de fontes usando as funções `asynchronous_connection_failover_add_source` e `asynchronous_connection_failover_delete_source` para adicionar e remover servidores de origem de replicação da lista de fontes para um canal de replicação. Para adicionar e remover grupos gerenciados de servidores, use as funções `asynchronous_connection_failover_add_managed` e `asynchronous_connection_failover_delete_managed` em vez disso.

Para obter mais informações, consulte a Seção 19.4.9, “Alternar fontes e réplicas com falha de reatamento de conexão assíncrona”.

A tabela `replication_asynchronous_connection_failover` tem essas colunas:

- `CHANNEL_NAME`

  O canal de replicação para o qual este servidor de origem de replicação faz parte da lista de origem. Se a conexão deste canal com sua fonte atual falhar, este servidor de origem de replicação é uma das suas novas fontes potenciais.

- `HOST`

  O nome do host deste servidor de origem de replicação.

- `PORT`

  O número do porto para este servidor de origem de replicação.

- `NETWORK_NAMESPACE`

  O espaço de rede para este servidor de origem de replicação. Se este valor estiver vazio, as conexões usarão o espaço de rede padrão (global).

- `WEIGHT`

  A prioridade deste servidor de origem da fonte de replicação na lista de origem do canal de replicação. O peso varia de 1 a 100, sendo 100 o maior e 50 o padrão. Quando o mecanismo de failover de conexão assíncrona é ativado, a fonte com o ajuste de peso mais alto entre as fontes alternativas listadas na lista de origem do canal é escolhida para a primeira tentativa de conexão. Se essa tentativa não funcionar, a replica tenta com todas as fontes listadas em ordem decrescente de peso, depois começa novamente a partir da fonte com o peso mais alto. Se várias fontes tiverem o mesmo peso, a replica as ordena aleatoriamente.

- `MANAGED_NAME`

  O identificador do grupo gerenciado ao qual o servidor faz parte. Para o serviço gerenciado `GroupReplication`, o identificador é o valor da variável de sistema `group_replication_group_name`.

A tabela `replication_asynchronous_connection_failover` tem esses índices:

- Chave primária em (`CHANNEL_NAME, HOST, PORT, NETWORK_NAMESPACE, MANAGED_NAME`)

`TRUNCATE TABLE` não é permitido para a tabela `replication_asynchronous_connection_failover`.
