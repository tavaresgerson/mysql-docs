#### 25.6.15.44 A tabela ndbinfo logspaces

Esta tabela fornece informações sobre o uso do espaço de log do NDB Cluster.

A tabela `logspaces` contém as seguintes colunas:

* `node_id`

  O ID deste nó de dados.

* `log_type`

  Tipo de log; um dos valores: `REDO` ou `DD-UNDO`.

* `node_id`

  O ID do log; para arquivos de log de undo de dados em disco, este é o mesmo valor exibido na coluna `LOGFILE_GROUP_NUMBER` da tabela `FILES` do Esquema de Informações `FILES`, bem como o valor exibido para a coluna `log_id` da tabela `ndbinfo` `logbuffers`

* `log_part`

  O número da parte do log.

* `total`

  Espaço total disponível para este log.

* `used`

  Espaço usado por este log.