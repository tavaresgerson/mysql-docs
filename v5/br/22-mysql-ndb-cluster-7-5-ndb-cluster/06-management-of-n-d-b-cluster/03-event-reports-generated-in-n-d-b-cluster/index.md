### 21.6.3 Relatórios de Eventos Gerados no NDB Cluster

[21.6.3.1 NDB Cluster Logging Management Commands](mysql-cluster-logging-management-commands.html)

[21.6.3.2 NDB Cluster Log Events](mysql-cluster-log-events.html)

[21.6.3.3 Using CLUSTERLOG STATISTICS in the NDB Cluster Management Client](mysql-cluster-log-statistics.html)

Nesta seção, discutimos os tipos de logs de evento fornecidos pelo NDB Cluster e os tipos de eventos que são registrados.

O NDB Cluster fornece dois tipos de log de evento:

* O cluster log, que inclui eventos gerados por todos os cluster nodes. O cluster log é o log recomendado para a maioria dos usos porque fornece informações de logging para um cluster inteiro em um único local.

  Por padrão, o cluster log é salvo em um arquivo chamado `ndb_node_id_cluster.log`, (onde *`node_id`* é o ID do Node do management server) no [`DataDir`](mysql-cluster-mgm-definition.html#ndbparam-mgmd-datadir) do management server.

  As informações de cluster logging também podem ser enviadas para `stdout` ou para um recurso `syslog`, além ou em vez de serem salvas em um arquivo, conforme determinado pelos valores definidos para os parâmetros de configuração [`DataDir`](mysql-cluster-mgm-definition.html#ndbparam-mgmd-datadir) e [`LogDestination`](mysql-cluster-mgm-definition.html#ndbparam-mgmd-logdestination). Consulte [Seção 21.4.3.5, “Defining an NDB Cluster Management Server”](mysql-cluster-mgm-definition.html "21.4.3.5 Defining an NDB Cluster Management Server"), para mais informações sobre esses parâmetros.

* Os Node logs são locais para cada node.

  A saída gerada pelo logging de eventos do node é escrita no arquivo `ndb_node_id_out.log` (onde *`node_id`* é o ID do Node) no [`DataDir`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datadir) do node. Os logs de eventos do Node são gerados tanto para management nodes quanto para data nodes.

  Os Node logs destinam-se a ser usados apenas durante o desenvolvimento de aplicações ou para o debugging do código da aplicação.

Cada evento reportável pode ser distinguido de acordo com três critérios diferentes:

* *Categoria*: Pode ser qualquer um dos seguintes valores: `STARTUP`, `SHUTDOWN`, `STATISTICS`, `CHECKPOINT`, `NODERESTART`, `CONNECTION`, `ERROR` ou `INFO`.

* *Prioridade*: É representada por um dos números de 0 a 15, inclusive, onde 0 indica “mais importante” e 15 “menos importante”.

* *Nível de Severidade*: Pode ser qualquer um dos seguintes valores: `ALERT`, `CRITICAL`, `ERROR`, `WARNING`, `INFO` ou `DEBUG`.

O cluster log pode ser filtrado por essas propriedades usando o comando [`CLUSTERLOG`](mysql-cluster-logging-management-commands.html "21.6.3.1 NDB Cluster Logging Management Commands") do NDB management client. Este comando afeta apenas o cluster log e não tem efeito sobre os Node logs; o debug logging em um ou mais Node logs pode ser ativado e desativado usando o comando [`NODELOG DEBUG`](mysql-cluster-mgm-client-commands.html#ndbclient-nodelog-debug) do [**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client").

O formato usado no cluster log é o mostrado aqui:

```sql
2007-01-26 19:35:55 [MgmSrvr] INFO     -- Node 1: Data usage is 2%(60 32K pages of total 2560)
2007-01-26 19:35:55 [MgmSrvr] INFO     -- Node 1: Index usage is 1%(24 8K pages of total 2336)
2007-01-26 19:35:55 [MgmSrvr] INFO     -- Node 1: Resource 0 min: 0 max: 639 curr: 0
2007-01-26 19:35:55 [MgmSrvr] INFO     -- Node 2: Data usage is 2%(76 32K pages of total 2560)
2007-01-26 19:35:55 [MgmSrvr] INFO     -- Node 2: Index usage is 1%(24 8K pages of total 2336)
2007-01-26 19:35:55 [MgmSrvr] INFO     -- Node 2: Resource 0 min: 0 max: 639 curr: 0
2007-01-26 19:35:55 [MgmSrvr] INFO     -- Node 3: Data usage is 2%(58 32K pages of total 2560)
2007-01-26 19:35:55 [MgmSrvr] INFO     -- Node 3: Index usage is 1%(25 8K pages of total 2336)
2007-01-26 19:35:55 [MgmSrvr] INFO     -- Node 3: Resource 0 min: 0 max: 639 curr: 0
2007-01-26 19:35:55 [MgmSrvr] INFO     -- Node 4: Data usage is 2%(74 32K pages of total 2560)
2007-01-26 19:35:55 [MgmSrvr] INFO     -- Node 4: Index usage is 1%(25 8K pages of total 2336)
2007-01-26 19:35:55 [MgmSrvr] INFO     -- Node 4: Resource 0 min: 0 max: 639 curr: 0
2007-01-26 19:39:42 [MgmSrvr] INFO     -- Node 4: Node 9 Connected
2007-01-26 19:39:42 [MgmSrvr] INFO     -- Node 1: Node 9 Connected
2007-01-26 19:39:42 [MgmSrvr] INFO     -- Node 1: Node 9: API 5.7.44-ndb-7.5.36
2007-01-26 19:39:42 [MgmSrvr] INFO     -- Node 2: Node 9 Connected
2007-01-26 19:39:42 [MgmSrvr] INFO     -- Node 2: Node 9: API 5.7.44-ndb-7.5.36
2007-01-26 19:39:42 [MgmSrvr] INFO     -- Node 3: Node 9 Connected
2007-01-26 19:39:42 [MgmSrvr] INFO     -- Node 3: Node 9: API 5.7.44-ndb-7.5.36
2007-01-26 19:39:42 [MgmSrvr] INFO     -- Node 4: Node 9: API 5.7.44-ndb-7.5.36
2007-01-26 19:59:22 [MgmSrvr] ALERT    -- Node 2: Node 7 Disconnected
2007-01-26 19:59:22 [MgmSrvr] ALERT    -- Node 2: Node 7 Disconnected
```

Cada linha no cluster log contém as seguintes informações:

* Um timestamp no formato `AAAA-MM-DD HH:MM:SS`.

* O tipo de node que está realizando o logging. No cluster log, este é sempre `[MgmSrvr]`.

* A severidade do evento.
* O ID do node que está reportando o evento.
* Uma descrição do evento. Os tipos de eventos mais comuns a aparecer no log são connections e disconnections entre diferentes nodes no cluster, e quando CHECKPOINTs ocorrem. Em alguns casos, a descrição pode conter informações de status.

Para informações adicionais, consulte [Seção 21.6.3.2, “NDB Cluster Log Events”](mysql-cluster-log-events.html "21.6.3.2 NDB Cluster Log Events").