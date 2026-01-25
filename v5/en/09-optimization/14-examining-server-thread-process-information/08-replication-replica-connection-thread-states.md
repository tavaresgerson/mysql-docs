### 8.14.8 Estados de Thread de Conexão da Réplica de Replicação

Esses estados de thread ocorrem em um servidor réplica, mas estão associados a threads de conexão, e não aos threads de I/O ou SQL.

* `Changing master`

  O thread está processando uma instrução `CHANGE MASTER TO`.

* `Killing slave`

  O thread está processando uma instrução `STOP SLAVE`.

* `Opening master dump table`

  Este estado ocorre após `Creating table from master dump`.

* `Reading master dump table data`

  Este estado ocorre após `Opening master dump table`.

* `Rebuilding the index on master dump table`

  Este estado ocorre após `Reading master dump table data`.