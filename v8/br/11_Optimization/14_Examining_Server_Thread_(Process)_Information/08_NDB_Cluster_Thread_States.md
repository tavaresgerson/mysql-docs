### 10.14.8 Estados de fio do cluster do NDB

- `Committing events to binlog`

- `Opening mysql.ndb_apply_status`

- `Processing events`

  O fio está processando eventos para registro binário.

- `Processing events from schema table`

  O fio está fazendo o trabalho de replicação de esquema.

- `Shutting down`

- `Syncing ndb table schema operation and binlog`

  Isso é usado para ter um registro binário correto das operações do esquema para o NDB.

- `Waiting for allowed to take ndbcluster global schema lock`

  O fio está aguardando permissão para obter um bloqueio de esquema global.

- `Waiting for event from ndbcluster`

  O servidor está atuando como um nó SQL em um NDB Cluster e está conectado a um nó de gerenciamento de cluster.

- `Waiting for first event from ndbcluster`

- `Waiting for ndbcluster binlog update to reach current position`

- `Waiting for ndbcluster global schema lock`

  O fio está esperando que um bloqueio de esquema global mantido por outro fio seja liberado.

- `Waiting for ndbcluster to start`

- `Waiting for schema epoch`

  O fio está aguardando uma época do esquema (ou seja, um ponto de verificação global).
