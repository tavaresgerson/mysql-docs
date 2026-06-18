### 14.18.3 Funções de Failover do Canal de Replicação Assíncrona

As seguintes funções, disponíveis a partir do MySQL 8.0.22 para replicação de origem padrão para replica e a partir do MySQL 8.0.23 para replicação por grupo, permitem que você adicione e remova servidores de origem de replicação da lista de origem para um canal de replicação. A partir do MySQL 8.0.27, você também pode limpar a lista de origem para um servidor.

**Tabela 14.27 Funções do Canal de Failover**

<table summary="Uma referência que lista as funções usadas para controlar o failover assíncrono para um canal ou servidor específico."><thead><tr><th>Nome</th> <th>Descrição</th> <th>Introduzido</th> </tr></thead><tbody><tr><th>[[<code>asynchronous_connection_failover_add_managed()</code>]]</th> <td>Adicione as informações de configuração do servidor de origem do membro do grupo a uma lista de origem do canal de replicação</td> <td>8.0.23</td> </tr><tr><th>[[<code>asynchronous_connection_failover_add_source()</code>]]</th> <td>Adicione as informações de configuração do servidor de origem ao servidor à lista de fontes de um canal de replicação</td> <td>8.0.22</td> </tr><tr><th>[[<code>asynchronous_connection_failover_delete_managed()</code>]]</th> <td>Remover um grupo gerenciado de uma lista de fontes de canal de replicação</td> <td>8.0.23</td> </tr><tr><th>[[<code>asynchronous_connection_failover_delete_source()</code>]]</th> <td>Remover um servidor de origem de uma lista de fontes de um canal de replicação</td> <td>8.0.22</td> </tr><tr><th>[[<code>asynchronous_connection_failover_reset()</code>]]</th> <td>Remova todos os ajustes relacionados à replicação em grupo e ao failover assíncrono</td> <td>8.0.27</td> </tr></tbody></table>

O mecanismo de falha de conexão assíncrona estabelece automaticamente uma conexão de replicação assíncrona (da fonte para a réplica) para uma nova fonte da lista apropriada após a conexão existente da réplica para sua fonte falhar. A partir do MySQL 8.0.23, a conexão também é alterada se a fonte atualmente conectada não tiver a prioridade mais alta ponderada no grupo. Para servidores de fontes de replicação de grupo que são definidos como parte de um grupo gerenciado, a conexão também é transferida para outro membro do grupo se a fonte atualmente conectada sair do grupo ou não estiver mais na maioria. Para obter mais informações sobre o mecanismo, consulte a Seção 19.4.9, “Alternar fontes e réplicas com falha de conexão assíncrona”.

As listas de códigos são armazenadas nas tabelas `mysql.replication_asynchronous_connection_failover` e `mysql.replication_asynchronous_connection_failover_managed` e podem ser visualizadas na tabela do Gerenciamento de Desempenho `replication_asynchronous_connection_failover`.

Se o canal de replicação estiver em um primário de replicação em grupo para um grupo onde o failover entre réplicas está ativo, a lista de fontes é transmitida para todos os membros do grupo quando eles se juntam ou quando é atualizada por qualquer método. O failover entre réplicas é controlado pela ação do membro `mysql_start_failover_channels_if_primary`, que é habilitada por padrão, e pode ser desativada usando a função `group_replication_disable_member_action`.

- `asynchronous_connection_failover_add_managed()`

  Adicione as informações de configuração para um servidor de origem de replicação que faz parte de um grupo gerenciado (um membro do grupo de replicação de grupo) à lista de origem para um canal de replicação. Você só precisa adicionar um membro do grupo. A replicação adiciona automaticamente o restante da atual associação do grupo e, em seguida, mantém a lista de origem atualizada de acordo com as alterações na associação.

  Sintaxe:

  ```
  asynchronous_connection_failover_add_managed(channel, managed_type, managed_name, host, port, network_namespace, primary_weight, secondary_weight)
  ```

  Argumentos:

  - `channel`: O canal de replicação para o qual este servidor de origem de replicação faz parte da lista de origem.

  - `managed_type`: O tipo de serviço gerenciado que o mecanismo de falha de conexão assíncrona deve fornecer para este servidor. O único valor atualmente aceito é `GroupReplication`.

  - `managed_name`: O identificador do grupo gerenciado ao qual o servidor faz parte. Para o serviço gerenciado `GroupReplication`, o identificador é o valor da variável de sistema `group_replication_group_name`.

  - `host`: O nome do host deste servidor de origem de replicação.

  - `port`: O número de porta para este servidor de origem de replicação.

  - `network_namespace`: O espaço de rede para este servidor de origem de replicação. Especifique uma string vazia, pois este parâmetro é reservado para uso futuro.

  - `primary_weight`: A prioridade deste servidor de origem de replicação na lista de origem do canal de replicação quando ele está atuando como o primário para o grupo gerenciado. O peso varia de 1 a 100, sendo 100 o maior valor. Para o primário, 80 é um peso adequado. O mecanismo de failover de conexão assíncrona é ativado se a fonte atualmente conectada não for a de maior peso no grupo. Supondo que você configure o grupo gerenciado para dar um peso maior ao primário e um peso menor ao secundário, quando o primário for alterado, seu peso aumenta e a replicação é alterada na conexão com ele.

  - `secondary_weight`: A prioridade deste servidor de origem de replicação na lista de origem do canal de replicação quando ele está atuando como secundário no grupo gerenciado. O peso varia de 1 a 100, sendo 100 o maior valor. Para um secundário, um peso de 60 é adequado.

  Valor de retorno:

  Uma cadeia que contém o resultado da operação, por exemplo, se foi bem-sucedida ou

  Exemplo:

  ```
  SELECT asynchronous_connection_failover_add_managed('channel2', 'GroupReplication', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '127.0.0.1', 3310, '', 80, 60);
  +----------------------------------------------------------------------------------------------------------------------------------------------------+
  | asynchronous_connection_failover_add_source('channel2', 'GroupReplication', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '127.0.0.1', 3310, '', 80, 60) |
  +----------------------------------------------------------------------------------------------------------------------------------------------------+
  | Source managed configuration details successfully inserted.                                                                                        |
  +----------------------------------------------------------------------------------------------------------------------------------------------------+
  ```

  Para obter mais informações, consulte a Seção 19.4.9, “Alternar fontes e réplicas com falha de reatamento de conexão assíncrona”.

- `asynchronous_connection_failover_add_source()`

  Adicione as informações de configuração para um servidor de origem de replicação à lista de origem de um canal de replicação.

  Sintaxe:

  ```
  asynchronous_connection_failover_add_source(channel, host, port, network_namespace, weight)
  ```

  Argumentos:

  - `channel`: O canal de replicação para o qual este servidor de origem de replicação faz parte da lista de origem.

  - `host`: O nome do host deste servidor de origem de replicação.

  - `port`: O número de porta para este servidor de origem de replicação.

  - `network_namespace`: O espaço de rede para este servidor de origem de replicação. Especifique uma string vazia, pois este parâmetro é reservado para uso futuro.

  - `weight`: A prioridade deste servidor de origem da replicação na lista de origem do canal de replicação. A prioridade varia de 1 a 100, sendo 100 a maior e 50 a padrão. Quando o mecanismo de failover de conexão assíncrona é ativado, a fonte com a configuração de prioridade mais alta entre as fontes alternativas listadas na lista de origem do canal é escolhida para a primeira tentativa de conexão. Se essa tentativa não funcionar, a replica tenta com todas as fontes listadas em ordem decrescente de prioridade, depois começa novamente a partir da fonte de maior prioridade. Se várias fontes tiverem a mesma prioridade, a replica as ordena aleatoriamente. A partir do MySQL 8.0.23, o mecanismo de failover de conexão assíncrona é ativado se a fonte atualmente conectada não for a mais ponderada no grupo.

  Valor de retorno:

  Uma cadeia que contém o resultado da operação, por exemplo, se foi bem-sucedida ou

  Exemplo:

  ```
  SELECT asynchronous_connection_failover_add_source('channel2', '127.0.0.1', 3310, '', 80);
  +-------------------------------------------------------------------------------------------------+
  | asynchronous_connection_failover_add_source('channel2', '127.0.0.1', 3310, '', 80)              |
  +-------------------------------------------------------------------------------------------------+
  | Source configuration details successfully inserted.                                             |
  +-------------------------------------------------------------------------------------------------+
  ```

  Para obter mais informações, consulte a Seção 19.4.9, “Alternar fontes e réplicas com falha de reatamento de conexão assíncrona”.

- `asynchronous_connection_failover_delete_managed()`

  Remova um grupo gerenciado inteiro da lista de origem para um canal de replicação. Ao usar essa função, todos os servidores de origem de replicação definidos no grupo gerenciado são removidos da lista de origem do canal.

  Sintaxe:

  ```
  asynchronous_connection_failover_delete_managed(channel, managed_name)
  ```

  Argumentos:

  - `channel`: O canal de replicação para o qual este servidor de origem de replicação fazia parte da lista de origem.

  - `managed_name`: O identificador do grupo gerenciado ao qual o servidor faz parte. Para o serviço gerenciado `GroupReplication`, o identificador é o valor da variável de sistema `group_replication_group_name`.

  Valor de retorno:

  Uma cadeia que contém o resultado da operação, por exemplo, se foi bem-sucedida ou

  Exemplo:

  ```
  SELECT asynchronous_connection_failover_delete_managed('channel2', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
  +-----------------------------------------------------------------------------------------------------+
  | asynchronous_connection_failover_delete_managed('channel2', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa') |
  +-----------------------------------------------------------------------------------------------------+
  | Source managed configuration details successfully deleted.                                          |
  +-----------------------------------------------------------------------------------------------------+
  ```

  Para obter mais informações, consulte a Seção 19.4.9, “Alternar fontes e réplicas com falha de reatamento de conexão assíncrona”.

- `asynchronous_connection_failover_delete_source()`

  Remova as informações de configuração de um servidor de origem de replicação da lista de origem de um canal de replicação.

  Sintaxe:

  ```
  asynchronous_connection_failover_delete_source(channel, host, port, network_namespace)
  ```

  Argumentos:

  - `channel`: O canal de replicação para o qual este servidor de origem de replicação fazia parte da lista de origem.

  - `host`: O nome do host deste servidor de origem de replicação.

  - `port`: O número de porta para este servidor de origem de replicação.

  - `network_namespace`: O espaço de rede para este servidor de origem de replicação. Especifique uma string vazia, pois este parâmetro é reservado para uso futuro.

  Valor de retorno:

  Uma cadeia que contém o resultado da operação, por exemplo, se foi bem-sucedida ou

  Exemplo:

  ```
  SELECT asynchronous_connection_failover_delete_source('channel2', '127.0.0.1', 3310, '');
  +------------------------------------------------------------------------------------------------+
  | asynchronous_connection_failover_delete_source('channel2', '127.0.0.1', 3310, '')              |
  +------------------------------------------------------------------------------------------------+
  | Source configuration details successfully deleted.                                             |
  +------------------------------------------------------------------------------------------------+
  ```

  Para obter mais informações, consulte a Seção 19.4.9, “Alternar fontes e réplicas com falha de reatamento de conexão assíncrona”.

- `asynchronous_connection_failover_reset()`

  Remova todos os ajustes relacionados ao mecanismo de falha de conexão assíncrona. A função limpa as tabelas do Schema de Desempenho `replication_asynchronous_connection_failover` e `replication_asynchronous_connection_failover_managed`.

  `asynchronous_connection_failover_reset()` pode ser usado apenas em um servidor que atualmente não faz parte de um grupo e que não tem nenhum canal de replicação em execução. Você pode usar essa função para limpar um servidor que não está mais sendo usado em um grupo gerenciado.

  Sintaxe:

  ```
  STRING asynchronous_connection_failover_reset()
  ```

  Argumentos:

  None.

  Valor de retorno:

  Uma cadeia que contém o resultado da operação, por exemplo, se foi bem-sucedida ou

  Exemplo:

  ```
  mysql> SELECT asynchronous_connection_failover_reset();
  +-------------------------------------------------------------------------+
  | asynchronous_connection_failover_reset()                                |
  +-------------------------------------------------------------------------+
  | The UDF asynchronous_connection_failover_reset() executed successfully. |
  +-------------------------------------------------------------------------+
  1 row in set (0.00 sec)
  ```

  Para obter mais informações, consulte a Seção 19.4.9, “Alternar fontes e réplicas com falha de reatamento de conexão assíncrona”.
