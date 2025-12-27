### 10.14.8 Estados de Fios de NDB Cluster

* `Eventos de commit no binlog`
* `Abrindo mysql.ndb_apply_status`
* `Processando eventos`

  O fio está processando eventos para o registro binário.

* `Processando eventos da tabela de esquema`

  O fio está realizando o trabalho de replicação de esquema.

* `Parando`
* `Sincronizando a operação de esquema e binlog do ndb`

  Isso é usado para ter um log binário correto das operações de esquema no NDB.

* `Aguardando permissão para assumir o bloqueio global de esquema do ndbcluster`

  O fio está aguardando permissão para assumir um bloqueio global de esquema.

* `Aguardando evento do ndbcluster`

  O servidor está atuando como um nó SQL em um NDB Cluster e está conectado a um nó de gerenciamento de cluster.

* `Aguardando o primeiro evento do ndbcluster`
* `Aguardando que a atualização do binlog do ndbcluster atinja a posição atual`

* `Aguardando o bloqueio global de esquema do ndbcluster`

  O fio está aguardando que um bloqueio global de esquema mantido por outro fio seja liberado.

* `Aguardando que o ndbcluster comece`
* `Aguardando a época do esquema`

  O fio está aguardando uma época de esquema (ou seja, um ponto de verificação global).