### 8.14.9 Estados de Thread do NDB Cluster

* `Committing events to binlog`
* `Opening mysql.ndb_apply_status`
* `Processing events`

  A thread está processando eventos para o *binary logging*.

* `Processing events from schema table`

  A thread está executando o trabalho de replicação de *schema*.

* `Shutting down`
* `Syncing ndb table schema operation and binlog`

  Isso é usado para ter um *binary log* correto das operações de *schema* para o NDB.

* `Waiting for allowed to take ndbcluster global schema lock`

  A thread está esperando permissão para obter um *global schema lock*.

* `Waiting for event from ndbcluster`

  O servidor está atuando como um nó SQL em um NDB Cluster e está conectado a um nó de gerenciamento de *cluster*.

* `Waiting for first event from ndbcluster`
* `Waiting for ndbcluster binlog update to reach current position`
* `Waiting for ndbcluster global schema lock`

  A thread está esperando que um *global schema lock* mantido por outra *thread* seja liberado.

* `Waiting for ndbcluster to start`
* `Waiting for schema epoch`

  A thread está esperando por uma *schema epoch* (ou seja, um *global checkpoint*).