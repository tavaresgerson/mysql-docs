### 8.14.8 Estados de Conexão de Replicação de Fila de Conexão de Replicação

Estes estados de thread ocorrem em um servidor de replicação, mas estão associados a threads de conexão, e não a threads de E/S ou SQL.

* `Changing master`

  O thread está processando uma declaração `CHANGE MASTER TO`.

* `Killing slave`

  O thread está processando uma declaração `STOP SLAVE`.

* `Opening master dump table`

  Esse estado ocorre após a criação da tabela a partir do backup mestre (`Creating table from master dump`).

* `Reading master dump table data`

  Esse estado ocorre após a "Abertura da tabela de dump mestre".

* `Rebuilding the index on master dump table`

  Esse estado ocorre após a leitura dos dados da tabela de dump mestre.
