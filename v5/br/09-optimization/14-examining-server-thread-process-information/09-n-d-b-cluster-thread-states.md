### 8.14.9 Estados de fios de clúster do NDB

- `Registrar eventos no binlog`

- `Abrir mysql.ndb_apply_status`

- `Processar eventos`

  O fio está processando eventos para registro binário.

- `Processamento de eventos da tabela de esquema`

  O fio está fazendo o trabalho de replicação de esquema.

- `Desligar`

- Operação de sincronização do esquema da tabela ndb e do binlog

  Isso é usado para ter um registro binário correto das operações do esquema para o NDB.

- `Aguardando permissão para adquirir o bloqueio de esquema global ndbcluster`

  O fio está aguardando permissão para obter um bloqueio de esquema global.

- `Aguardando evento do ndbcluster`

  O servidor está atuando como um nó SQL em um NDB Cluster e está conectado a um nó de gerenciamento de cluster.

- `Aguardando o primeiro evento do ndbcluster`

- `Aguardando a atualização do binlog do ndbcluster para alcançar a posição atual`

- `Aguardando bloqueio do esquema global ndbcluster`

  O fio está esperando que um bloqueio de esquema global mantido por outro fio seja liberado.

- `Aguardando o ndbcluster para iniciar`

- `Esperando pela época do esquema`

  O fio está aguardando uma época do esquema (ou seja, um ponto de verificação global).
