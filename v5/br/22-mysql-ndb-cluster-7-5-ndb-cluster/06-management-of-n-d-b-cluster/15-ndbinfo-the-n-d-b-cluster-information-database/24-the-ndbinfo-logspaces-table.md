#### 21.6.15.24 Tabela ndbinfo logspaces

Esta tabela fornece informações sobre o uso do espaço de log do NDB Cluster.

A tabela `logspaces` contém as seguintes colunas:

- `node_id`

  O ID deste nó de dados.

- `log_type`

  Tipo de log; um dos seguintes: `REDO` ou `DD-UNDO`.

- `log_id`

  O ID do log; para arquivos de log de restauração de dados do disco, este é o mesmo valor exibido na coluna `LOGFILE_GROUP_NUMBER` da tabela do esquema de informações `FILES` e também o valor exibido na coluna `log_id` da tabela `ndbinfo` `logbuffers`

- `log_part`

  O número do item do log.

- `total`

  Espaço total disponível para este log.

- "usada"

  Espaço utilizado por este log.
