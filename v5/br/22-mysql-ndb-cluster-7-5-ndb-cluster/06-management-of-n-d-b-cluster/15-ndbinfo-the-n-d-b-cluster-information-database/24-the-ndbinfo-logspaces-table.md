#### 21.6.15.24 A Tabela ndbinfo logspaces

Esta tabela fornece informações sobre o uso de espaço de log (log space usage) no NDB Cluster.

A tabela `logspaces` contém as seguintes colunas:

* `node_id`

  O ID deste nó de dados (data node).

* `log_type`

  Tipo de log; um de: `REDO` ou `DD-UNDO`.

* `log_id`

  O ID do log; para arquivos de undo log do Disk Data, este valor é o mesmo mostrado na coluna `LOGFILE_GROUP_NUMBER` da tabela `FILES` do Information Schema, bem como o valor mostrado para a coluna `log_id` da tabela ndbinfo `logbuffers`.

* `log_part`

  O número da parte (part number) do log.

* `total`

  Espaço total disponível para este log.

* `used`

  Espaço usado por este log.