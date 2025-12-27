### 10.14.7 Estados de Conexão de Replicação

Estes estados de thread ocorrem em um servidor de replicação, mas estão associados a threads de conexão, e não a threads de I/O ou SQL.

* `Mudando mestre`

  `Mudando a fonte de replicação`

  O thread está processando uma declaração `CHANGE REPLICATION SOURCE TO`.

* `Matando escravo`

  O thread está processando uma declaração `STOP REPLICA`.

* `Abrindo a tabela de dump do mestre`

  Este estado ocorre após `Criando tabela a partir do dump do mestre`.

* `Lendo dados da tabela de dump do mestre`

  Este estado ocorre após `Abrindo a tabela de dump do mestre`.

* `Reestruturando o índice na tabela de dump do mestre`

  Este estado ocorre após `Lendo dados da tabela de dump do mestre`.