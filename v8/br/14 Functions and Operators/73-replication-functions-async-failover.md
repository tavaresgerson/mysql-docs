### 14.18.3 Funções de Failover do Canal de Replicação Assíncrona

As seguintes funções permitem que você adicione ou remova servidores de origem de replicação de uma lista de origem para um canal de replicação, bem como limpe a lista de origem para um servidor específico.

**Tabela 14.27 Funções de Canal de Failover**

<table><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>asynchronous_connection_failover_add_managed()</code></td> <td> Adiciona informações de configuração do servidor membro do grupo à lista de origem de um canal de replicação </td> </tr><tr><td><code>asynchronous_connection_failover_add_source()</code></td> <td> Adiciona informações de configuração do servidor fonte a uma lista de origem de um canal de replicação </td> </tr><tr><td><code>asynchronous_connection_failover_delete_managed()</code></td> <td> Remove um grupo gerenciado de uma lista de origem de um canal de replicação </td> </tr><tr><td><code>asynchronous_connection_failover_delete_source()</code></td> <td> Remove um servidor fonte de uma lista de origem de um canal de replicação </td> </tr><tr><td><code>asynchronous_connection_failover_reset()</code></td> <td> Remove todas as configurações relacionadas ao failover de replicação de grupo assíncrono </td> </tr></tbody></table>

O mecanismo de failover de conexão assíncrona estabelece automaticamente uma conexão de replicação assíncrona (da fonte para a replica) para uma nova fonte da lista apropriada após a conexão existente da replica para sua fonte falhar. A conexão também é alterada se a fonte atualmente conectada não tiver a prioridade mais alta ponderada no grupo. Para servidores de origem de replicação de Grupo que são definidos como parte de um grupo gerenciado, a conexão também é falhada para outro membro do grupo se a fonte atualmente conectada sair do grupo ou não estiver mais na maioria. Para mais informações sobre o mecanismo, consulte a Seção 19.4.9, “Alternar Fontes e Replicas com Failover de Conexão Assíncrona”.

As listas de fontes são armazenadas nas tabelas `mysql.replication_asynchronous_connection_failover` e `mysql.replication_asynchronous_connection_failover_managed` e podem ser visualizadas na tabela do Gerenciamento de Desempenho `replication_asynchronous_connection_failover`.

Se o canal de replicação estiver em um primário de Replicação em Grupo para um grupo onde o failover entre réplicas está ativo, a lista de fontes é transmitida para todos os membros do grupo quando eles se juntam ou quando é atualizado por qualquer método. O failover entre réplicas é controlado pela ação `mysql_start_failover_channels_if_primary`, que é habilitada por padrão, e pode ser desabilitada usando a função `group_replication_disable_member_action`.

*  `asynchronous_connection_failover_add_managed()`

  Adicione informações de configuração para um servidor de fonte de replicação que faz parte de um grupo gerenciado (um membro do grupo de Replicação em Grupo) à lista de fontes de um canal de replicação. Você só precisa adicionar um membro do grupo. A réplica adiciona automaticamente o restante da atual composição do grupo, e depois mantém a lista de fontes atualizada de acordo com a mudança na composição.

  Sintaxe:

  ```
  asynchronous_connection_failover_add_managed(channel, managed_type, managed_name, host, port, network_namespace, primary_weight, secondary_weight)
  ```

  Argumentos:

+ *`channel`*: O canal de replicação para o qual este servidor de origem de replicação faz parte da lista de origem.
  + *`managed_type`*: O tipo de serviço gerenciado que o mecanismo de falha de conexão de conexão assíncrona deve fornecer para este servidor. O único valor atualmente aceito é `GroupReplication`.
  + *`managed_name`*: O identificador do grupo gerenciado para o qual o servidor faz parte. Para o serviço gerenciado `GroupReplication`, o identificador é o valor da variável de sistema `group_replication_group_name`.
  + *`host`*: O nome do host deste servidor de origem de replicação.
  + *`port`*: O número de porta para este servidor de origem de replicação.
  + *`network_namespace`*: O namespace de rede para este servidor de origem de replicação. Especifique uma string vazia, pois este parâmetro é reservado para uso futuro.
  + *`primary_weight`*: A prioridade deste servidor de origem de replicação na lista de origem do canal de replicação quando ele atua como o primário para o grupo gerenciado. O peso varia de 1 a 100, sendo 100 o maior. Para o primário, 80 é um peso adequado. O mecanismo de falha de conexão de conexão assíncrona é ativado se a fonte atualmente conectada não for a de maior peso no grupo. Supondo que você configure o grupo gerenciado para dar um peso maior a um primário e um peso menor a um secundário, quando o primário mudar, seu peso aumenta e a replica muda na conexão com ele.
  + *`secondary_weight`*: A prioridade deste servidor de origem de replicação na lista de origem do canal de replicação quando ele atua como secundário no grupo gerenciado. O peso varia de 1 a 100, sendo 100 o maior. Para um secundário, 60 é um peso adequado.

Adicione informações de configuração para um servidor de fonte de replicação à lista de fontes de um canal de replicação.

Sintaxe:

```
  SELECT asynchronous_connection_failover_add_managed('channel2', 'GroupReplication', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '127.0.0.1', 3310, '', 80, 60);
  +----------------------------------------------------------------------------------------------------------------------------------------------------+
  | asynchronous_connection_failover_add_source('channel2', 'GroupReplication', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '127.0.0.1', 3310, '', 80, 60) |
  +----------------------------------------------------------------------------------------------------------------------------------------------------+
  | Source managed configuration details successfully inserted.                                                                                        |
  +----------------------------------------------------------------------------------------------------------------------------------------------------+
  ```

Argumentos:

+ *`channel`*: O canal de replicação para o qual este servidor de fonte de replicação faz parte da lista de fontes.
+ *`host`*: O nome do host para este servidor de fonte de replicação.
+ *`port`*: O número de porta para este servidor de fonte de replicação.
+ *`network_namespace`*: O namespace de rede para este servidor de fonte de replicação. Especifique uma string vazia, pois este parâmetro é reservado para uso futuro.
+ *`weight`*: A prioridade deste servidor de fonte de replicação na lista de fontes do canal de replicação. A prioridade varia de 1 a 100, sendo 100 a mais alta e 50 a padrão. Quando o mecanismo de failover de conexão assíncrona é ativado, a fonte com a configuração de prioridade mais alta entre as fontes alternativas listadas na lista de fontes do canal é escolhida para a primeira tentativa de conexão. Se essa tentativa não funcionar, a replica tenta com todas as fontes listadas em ordem decrescente de prioridade, depois começa novamente com a fonte de prioridade mais alta. Se várias fontes tiverem a mesma prioridade, a replica as ordena aleatoriamente. O mecanismo de failover de conexão assíncrona é ativado se a fonte atualmente conectada não for a mais pesada no grupo.

Valor de retorno:

Uma string contendo o resultado da operação, por exemplo, se foi bem-sucedida ou não.

Exemplo:

```
  asynchronous_connection_failover_add_source(channel, host, port, network_namespace, weight)
  ```

Para obter mais informações, consulte a Seção 19.4.9, “Alternar fontes e réplicas com failover de conexão assíncrona”.
*  `asynchronous_connection_failover_delete_managed()`

+ *`channel`*: O canal de replicação para o qual este servidor de origem de replicação fazia parte da lista de fontes.
  + *`managed_name`*: O identificador do grupo gerenciado para o qual o servidor faz parte. Para o serviço gerenciado `GroupReplication`, o identificador é o valor da variável de sistema `group_replication_group_name`.

  Valor de retorno:

  Uma string contendo o resultado da operação, por exemplo, se foi bem-sucedida ou não.

  Exemplo:

  ```
  SELECT asynchronous_connection_failover_add_source('channel2', '127.0.0.1', 3310, '', 80);
  +-------------------------------------------------------------------------------------------------+
  | asynchronous_connection_failover_add_source('channel2', '127.0.0.1', 3310, '', 80)              |
  +-------------------------------------------------------------------------------------------------+
  | Source configuration details successfully inserted.                                             |
  +-------------------------------------------------------------------------------------------------+
  ```

  Para mais informações, consulte a Seção 19.4.9, “Alternar fontes e réplicas com failover de conexão assíncrona”.
*  `asynchronous_connection_failover_delete_source()`

  Remover as informações de configuração para um servidor de origem de replicação da lista de fontes para um canal de replicação.

  Sintaxe:

  ```
  asynchronous_connection_failover_delete_managed(channel, managed_name)
  ```

  Argumentos:

  + *`channel`*: O canal de replicação para o qual este servidor de origem de replicação fazia parte da lista de fontes.
  + *`host`*: O nome do host para este servidor de origem de replicação.
  + *`port`*: O número de porta para este servidor de origem de replicação.
  + *`network_namespace`*: O namespace de rede para este servidor de origem de replicação. Especifique uma string vazia, pois este parâmetro é reservado para uso futuro.

  Valor de retorno:

  Uma string contendo o resultado da operação, por exemplo, se foi bem-sucedida ou não.

  Exemplo:

  ```
  SELECT asynchronous_connection_failover_delete_managed('channel2', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
  +-----------------------------------------------------------------------------------------------------+
  | asynchronous_connection_failover_delete_managed('channel2', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa') |
  +-----------------------------------------------------------------------------------------------------+
  | Source managed configuration details successfully deleted.                                          |
  +-----------------------------------------------------------------------------------------------------+
  ```

  Para mais informações, consulte a Seção 19.4.9, “Alternar fontes e réplicas com failover de conexão assíncrona”.
*  `asynchronous_connection_failover_reset()`

  Remover todas as configurações relacionadas ao mecanismo de failover de conexão assíncrona. A função limpa as tabelas do Schema de Desempenho `replication_asynchronous_connection_failover` e `replication_asynchronous_connection_failover_managed`.

`asynchronous_connection_failover_reset()` pode ser usado apenas em um servidor que atualmente não faz parte de um grupo e que não está executando nenhum canal de replicação. Você pode usar essa função para limpar um servidor que não está mais sendo usado em um grupo gerenciado.

Sintaxe:

```
  asynchronous_connection_failover_delete_source(channel, host, port, network_namespace)
  ```

Argumentos:

Nenhum.

Valor de retorno:

Uma string contendo o resultado da operação, por exemplo, se foi bem-sucedida ou não.

Exemplo:

```
  SELECT asynchronous_connection_failover_delete_source('channel2', '127.0.0.1', 3310, '');
  +------------------------------------------------------------------------------------------------+
  | asynchronous_connection_failover_delete_source('channel2', '127.0.0.1', 3310, '')              |
  +------------------------------------------------------------------------------------------------+
  | Source configuration details successfully deleted.                                             |
  +------------------------------------------------------------------------------------------------+
  ```

Para obter mais informações, consulte a Seção 19.4.9, “Alternar fontes e réplicas com failover de conexão assíncrona”.