### 25.6.3 Relatórios de Eventos Gerados no NDB Cluster

25.6.3.1 Comandos de Gerenciamento de Registro do NDB Cluster

25.6.3.2 Eventos de Registro do NDB Cluster

25.6.3.3 Uso das Estatísticas CLUSTERLOG no Cliente de Gerenciamento do NDB Cluster

Nesta seção, discutimos os tipos de logs de eventos fornecidos pelo NDB Cluster e os tipos de eventos registrados.

O NDB Cluster fornece dois tipos de log de eventos:

* O log do cluster, que inclui eventos gerados por todos os nós do cluster. O log do cluster é o log recomendado para a maioria dos usos porque fornece informações de registro para todo o cluster em um único local.

  Por padrão, o log do cluster é salvo em um arquivo chamado `ndb_node_id_cluster.log`, (onde *`node_id`* é o ID do nó do servidor de gerenciamento) no `DataDir` do servidor de gerenciamento.

  As informações de registro do cluster também podem ser enviadas para `stdout` ou uma facilidade `syslog`, além de ou em vez de serem salvas em um arquivo, conforme determinado pelos valores definidos para os parâmetros de configuração `DataDir` e `LogDestination`. Consulte a Seção 25.4.3.5, “Definindo um Servidor de Gerenciamento de NDB Cluster”, para obter mais informações sobre esses parâmetros.

* Os logs de nó são locais para cada nó.

  A saída gerada pelo registro de eventos de nó é escrita no arquivo `ndb_node_id_out.log` (onde *`node_id`* é o ID do nó do nó) no `DataDir` do nó. Os logs de eventos de nó são gerados tanto para nós de gerenciamento quanto para nós de dados.

  Os logs de nó são destinados a serem usados apenas durante o desenvolvimento da aplicação ou para depuração do código da aplicação.

Cada evento reportável pode ser distinguido de acordo com três critérios diferentes:

* *Categoria*: Isso pode ser qualquer um dos seguintes valores: `STARTUP`, `SHUTDOWN`, `STATISTICS`, `CHECKPOINT`, `NODERESTART`, `CONNECTION`, `ERROR` ou `INFO`.

* *Prioridade*: Isso é representado por um dos números de 0 a 15, inclusive, onde 0 indica “mais importante” e 15 “menos importante”.

* *Nível de gravidade*: Isso pode ser qualquer um dos seguintes valores: `ON`, `DEBUG`, `INFO`, `WARNING`, `ERROR`, `CRITICAL`, `ALERT` ou `ALL`. (Isso também é às vezes referido como o nível de log.)

O log do cluster pode ser filtrado nessas propriedades usando o comando `CLUSTERLOG` do cliente de gerenciamento NDB. Esse comando afeta apenas o log do cluster e não tem efeito nos logs dos nós; o registro de depuração em um ou mais logs de nós pode ser ativado ou desativado usando o comando **ndb_mgm** `NODELOG DEBUG`.

O formato usado em uma mensagem de log gerada pelo NDB Cluster é mostrado aqui:

```
timestamp [node_type] level -- Node node_id: message
```

Cada linha no log, ou mensagem de log, contém as seguintes informações:

* Um *`timestamp`* no formato `YYYY-MM-DD HH:MM:SS`. O valor do timestamp atualmente resolve em segundos inteiros apenas; frações de segundos não são suportadas.

* O *`node_type`*, ou tipo de nó ou aplicativo que está realizando o registro. No log do cluster, isso é sempre `[MgmSrvr]`; no log do nó de dados, é sempre `[ndbd]`. `[NdbApi]` e outros valores são possíveis em logs gerados por aplicativos e ferramentas da API NDB.

* O *`level`* do evento, às vezes também referido como seu nível de gravidade ou nível de log. Consulte anteriormente nesta seção, bem como na Seção 25.6.3.1, “Comandos de Gerenciamento de Registro de NDB Cluster”, para mais informações sobre os níveis de gravidade.

* O ID do nó que relata o evento (*`node_id`*).

* Uma *mensagem* contendo uma descrição do evento. Os tipos mais comuns de eventos que aparecem no log são as conexões e desconexões entre diferentes nós no clúster e quando ocorrem os pontos de verificação. Em alguns casos, a descrição pode conter status ou outras informações.

Uma amostra de um log de clúster real é mostrada aqui:

```
2021-06-10 10:01:07 [MgmtSrvr] INFO     -- Node 5: Start phase 5 completed (system restart)
2021-06-10 10:01:07 [MgmtSrvr] INFO     -- Node 6: Start phase 5 completed (system restart)
2021-06-10 10:01:07 [MgmtSrvr] INFO     -- Node 5: Start phase 6 completed (system restart)
2021-06-10 10:01:07 [MgmtSrvr] INFO     -- Node 6: Start phase 6 completed (system restart)
2021-06-10 10:01:07 [MgmtSrvr] INFO     -- Node 5: President restarts arbitration thread [state=1]
2021-06-10 10:01:07 [MgmtSrvr] INFO     -- Node 5: Start phase 7 completed (system restart)
2021-06-10 10:01:07 [MgmtSrvr] INFO     -- Node 6: Start phase 7 completed (system restart)
2021-06-10 10:01:07 [MgmtSrvr] INFO     -- Node 5: Start phase 8 completed (system restart)
2021-06-10 10:01:07 [MgmtSrvr] INFO     -- Node 6: Start phase 8 completed (system restart)
2021-06-10 10:01:07 [MgmtSrvr] INFO     -- Node 5: Start phase 9 completed (system restart)
2021-06-10 10:01:07 [MgmtSrvr] INFO     -- Node 6: Start phase 9 completed (system restart)
2021-06-10 10:01:07 [MgmtSrvr] INFO     -- Node 5: Start phase 50 completed (system restart)
2021-06-10 10:01:07 [MgmtSrvr] INFO     -- Node 6: Start phase 50 completed (system restart)
2021-06-10 10:01:07 [MgmtSrvr] INFO     -- Node 5: Start phase 101 completed (system restart)
2021-06-10 10:01:07 [MgmtSrvr] INFO     -- Node 6: Start phase 101 completed (system restart)
2021-06-10 10:01:07 [MgmtSrvr] INFO     -- Node 5: Started (mysql-9.5.0 ndb-9.5.0)
2021-06-10 10:01:07 [MgmtSrvr] INFO     -- Node 6: Started (mysql-9.5.0 ndb-9.5.0)
2021-06-10 10:01:07 [MgmtSrvr] INFO     -- Node 5: Node 50: API mysql-9.5.0 ndb-9.5.0
2021-06-10 10:01:07 [MgmtSrvr] INFO     -- Node 6: Node 50: API mysql-9.5.0 ndb-9.5.0
2021-06-10 10:01:08 [MgmtSrvr] INFO     -- Node 6: Prepare arbitrator node 50 [ticket=75fd00010fa8b608]
2021-06-10 10:01:08 [MgmtSrvr] INFO     -- Node 5: Started arbitrator node 50 [ticket=75fd00010fa8b608]
2021-06-10 10:01:08 [MgmtSrvr] INFO     -- Node 6: Communication to Node 100 opened
2021-06-10 10:01:08 [MgmtSrvr] INFO     -- Node 6: Communication to Node 101 opened
2021-06-10 10:01:08 [MgmtSrvr] INFO     -- Node 5: Communication to Node 100 opened
2021-06-10 10:01:08 [MgmtSrvr] INFO     -- Node 5: Communication to Node 101 opened
2021-06-10 10:01:36 [MgmtSrvr] INFO     -- Alloc node id 100 succeeded
2021-06-10 10:01:36 [MgmtSrvr] INFO     -- Nodeid 100 allocated for API at 127.0.0.1
2021-06-10 10:01:36 [MgmtSrvr] INFO     -- Node 100: mysqld --server-id=1
2021-06-10 10:01:36 [MgmtSrvr] INFO     -- Node 5: Node 100 Connected
2021-06-10 10:01:36 [MgmtSrvr] INFO     -- Node 6: Node 100 Connected
2021-06-10 10:01:36 [MgmtSrvr] INFO     -- Node 5: Node 100: API mysql-9.5.0 ndb-9.5.0
2021-06-10 10:01:36 [MgmtSrvr] INFO     -- Node 6: Node 100: API mysql-9.5.0 ndb-9.5.0
```

Para informações adicionais, consulte a Seção 25.6.3.2, “Eventos de Log de Clúster NDB”.