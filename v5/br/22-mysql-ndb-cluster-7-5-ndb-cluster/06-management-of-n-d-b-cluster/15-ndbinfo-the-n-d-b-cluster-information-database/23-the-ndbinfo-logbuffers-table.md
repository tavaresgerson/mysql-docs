#### 21.6.15.23 A Tabela ndbinfo logbuffers

A tabela `logbuffers` fornece informações sobre o uso do log buffer no NDB Cluster.

A tabela `logbuffers` contém as seguintes colunas:

* `node_id`

  O ID deste data node.

* `log_type`

  Tipo de log. No NDB 7.5, um dos seguintes: `REDO` ou `DD-UNDO`. No NDB 7.6, um dos seguintes: `REDO`, `DD-UNDO`, `BACKUP-DATA` ou `BACKUP-LOG`.

* `log_id`

  O log ID; para arquivos Disk Data undo log, este é o mesmo valor mostrado na coluna `LOGFILE_GROUP_NUMBER` da tabela Information Schema [`FILES`](information-schema-files-table.html "24.3.9 A Tabela INFORMATION_SCHEMA FILES"), bem como o valor mostrado para a coluna `log_id` da tabela `ndbinfo` [`logspaces`](mysql-cluster-ndbinfo-logspaces.html "21.6.15.24 A Tabela ndbinfo logspaces")

* `log_part`

  O número da parte do log

* `total`

  Espaço total disponível para este log

* `used`

  Espaço usado por este log

##### Notas

O NDB 7.6.6 disponibiliza linhas na tabela `logbuffers` refletindo dois tipos de log adicionais ao realizar um backup do NDB. Uma dessas linhas possui o `log_type` `BACKUP-DATA`, que mostra a quantidade de data buffer usada durante o backup para copiar fragmentos para arquivos de backup. A outra linha possui o `log_type` `BACKUP-LOG`, que exibe a quantidade de log buffer usada durante o backup para registrar alterações feitas após o início do backup. Uma linha de cada um desses `log_type` é mostrada na tabela `logbuffers` para cada data node no Cluster. Essas linhas não estão presentes, a menos que um backup do NDB esteja sendo realizado no momento. (Bug #25822988)