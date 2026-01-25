#### 21.6.3.1 Comandos de Gerenciamento de Logging do NDB Cluster

[**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client") suporta vários comandos de gerenciamento relacionados ao log do cluster e aos logs dos nodes. Na lista a seguir, *`node_id`* denota o ID de um nó de armazenamento (storage node ID) ou a palavra-chave `ALL`, que indica que o comando deve ser aplicado a todos os data nodes do cluster.

* `CLUSTERLOG ON`

  Liga o log do cluster.

* `CLUSTERLOG OFF`

  Desliga o log do cluster.

* `CLUSTERLOG INFO`

  Fornece informações sobre as configurações do log do cluster.

* `node_id CLUSTERLOG category=threshold`

  Registra eventos da *`category`* com prioridade menor ou igual a *`threshold`* no log do cluster.

* `CLUSTERLOG TOGGLE severity_level`

  Alterna o logging de eventos do cluster do *`severity_level`* especificado.

A tabela a seguir descreve a configuração padrão (para todos os data nodes) do limite (threshold) da categoria do log do cluster. Se um evento tiver uma prioridade com um valor menor ou igual ao limite de prioridade, ele será reportado no log do cluster.

Nota

Os eventos são reportados por data node, e o limite (threshold) pode ser configurado para valores diferentes em nodes diferentes.

**Tabela 21.48 Categorias do log do Cluster, com configuração de limite padrão**

<table><thead><tr> <th>Categoria</th> <th>Limite Padrão (Todos os Data Nodes)</th> </tr></thead><tbody><tr> <td><code>STARTUP</code></td> <td><code>7</code></td> </tr><tr> <td><code>SHUTDOWN</code></td> <td><code>7</code></td> </tr><tr> <td><code>STATISTICS</code></td> <td><code>7</code></td> </tr><tr> <td><code>CHECKPOINT</code></td> <td><code>7</code></td> </tr><tr> <td><code>NODERESTART</code></td> <td><code>7</code></td> </tr><tr> <td><code>CONNECTION</code></td> <td><code>8</code></td> </tr><tr> <td><code>ERROR</code></td> <td><code>15</code></td> </tr><tr> <td><code>INFO</code></td> <td><code>7</code></td> </tr><tr> <td><code>BACKUP</code></td> <td><code>15</code></td> </tr><tr> <td><code>CONGESTION</code></td> <td><code>7</code></td> </tr><tr> <td><code>SCHEMA</code></td> <td><code>7</code></td> </tr></tbody></table>

A categoria `STATISTICS` pode fornecer uma grande quantidade de dados úteis. Consulte [Seção 21.6.3.3, “Utilizando CLUSTERLOG STATISTICS no Cliente de Gerenciamento do NDB Cluster”](mysql-cluster-log-statistics.html "21.6.3.3 Using CLUSTERLOG STATISTICS in the NDB Cluster Management Client"), para mais informações.

Os Limites (Thresholds) são usados para filtrar eventos dentro de cada categoria. Por exemplo, um evento `STARTUP` com prioridade 3 não é registrado a menos que o limite para `STARTUP` seja definido como 3 ou superior. Somente eventos com prioridade 3 ou inferior são enviados se o limite for 3.

A tabela a seguir mostra os níveis de severidade de eventos.

Nota

Estes correspondem aos níveis de `syslog` do Unix, exceto por `LOG_EMERG` e `LOG_NOTICE`, que não são usados ou mapeados.

**Tabela 21.49 Níveis de severidade de evento**

<table><col style="width: 20%"/><col style="width: 20%"/><col style="width: 60%"/><thead><tr> <th>Valor do Nível de Severidade</th> <th>Severidade</th> <th>Descrição</th> </tr></thead><tbody><tr> <th>1</th> <td><code>ALERT</code></td> <td>Uma condição que deve ser corrigida imediatamente, como um Database de sistema corrompido</td> </tr><tr> <th>2</th> <td><code>CRITICAL</code></td> <td>Condições críticas, como erros de dispositivo ou recursos insuficientes</td> </tr><tr> <th>3</th> <td><code>ERROR</code></td> <td>Condições que devem ser corrigidas, como erros de configuração</td> </tr><tr> <th>4</th> <td><code>WARNING</code></td> <td>Condições que não são erros, mas que podem exigir tratamento especial</td> </tr><tr> <th>5</th> <td><code>INFO</code></td> <td>Mensagens informativas</td> </tr><tr> <th>6</th> <td><code>DEBUG</code></td> <td>Mensagens de Debugging usadas para o desenvolvimento do <code>NDBCLUSTER</code></td> </tr></tbody></table>

Os níveis de severidade de evento podem ser ligados ou desligados usando `CLUSTERLOG TOGGLE`. Se um nível de severidade estiver ligado, todos os eventos com uma prioridade menor ou igual aos limites da categoria são registrados. Se o nível de severidade estiver desligado, nenhum evento pertencente a esse nível de severidade será registrado.

Importante

Os níveis de log do cluster são definidos por [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon"), por assinante (subscriber). Isto significa que, em um NDB Cluster com múltiplos management servers, usar um comando `CLUSTERLOG` em uma instância do [**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client") conectado a um management server afeta apenas os logs gerados por esse management server, mas não por nenhum dos outros. Isso também significa que, caso um dos management servers seja reiniciado, apenas os logs gerados por esse management server são afetados pela redefinição dos níveis de log causada pela reinicialização.
