#### 21.6.15.23 A tabela ndbinfo logbuffers

A tabela `logbuffer` fornece informações sobre o uso do buffer de log do NDB Cluster.

A tabela `logbuffers` contém as seguintes colunas:

- `node_id`

  O ID deste nó de dados.

- `log_type`

  Tipo de log. Em NDB 7.5, um dos seguintes: `REDO` ou `DD-UNDO`. Em NDB 7.6, um dos seguintes: `REDO`, `DD-UNDO`, `BACKUP-DATA` ou `BACKUP-LOG`.

- `log_id`

  O ID do log; para arquivos de log de desfazer de dados de disco, este é o mesmo valor exibido na coluna `LOGFILE_GROUP_NUMBER` da tabela do esquema de informações `FILES` e também o valor exibido na coluna `log_id` da tabela `ndbinfo` `logspaces`

- `log_part`

  O número do item do log

- `total`

  Espaço total disponível para este log

- "usada"

  Espaço utilizado por este log

##### Notas

O NDB 7.6.6 disponibiliza linhas da tabela `logbuffers` que refletem dois tipos adicionais de log ao realizar um backup do NDB. Uma dessas linhas tem o tipo de log `BACKUP-DATA`, que mostra a quantidade de buffer de dados usado durante o backup para copiar fragmentos para arquivos de backup. A outra linha tem o tipo de log `BACKUP-LOG`, que exibe a quantidade de buffer de log usado durante o backup para registrar as alterações feitas após o início do backup. Cada uma dessas linhas `log_type` é mostrada na tabela `logbuffers` para cada nó de dados no clúster. Essas linhas não estão presentes a menos que um backup do NDB esteja sendo realizado atualmente. (Bug #25822988)
