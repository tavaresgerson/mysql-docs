#### 25.6.15.43 A tabela ndbinfo logbuffers

A tabela `logbuffer` fornece informações sobre o uso do buffer de log do NDB Cluster.

A tabela `logbuffers` contém as seguintes colunas:

* `node_id`

  O ID deste nó de dados.

* `log_type`

  Tipo de log. Um dos valores: `REDO`, `DD-UNDO`, `BACKUP-DATA` ou `BACKUP-LOG`.

* `log_id`

  O ID do log; para arquivos de log de undo de dados do disco, este é o mesmo valor exibido na coluna `LOGFILE_GROUP_NUMBER` da tabela `FILES` do Esquema de Informações `FILES` e também o valor exibido para a coluna `log_id` da tabela `logspaces` do `ndbinfo`.

* `log_part`

  O número da parte do log

* `total`

  Espaço total disponível para este log

##### Notas

As linhas da tabela `logbuffers` que refletem dois tipos de log adicionais estão disponíveis ao realizar um backup do NDB. Uma dessas linhas tem o tipo de log `BACKUP-DATA`, que mostra a quantidade de buffer de dados usado durante o backup para copiar fragmentos para arquivos de backup. A outra linha tem o tipo de log `BACKUP-LOG`, que exibe a quantidade de buffer de log usado durante o backup para registrar as alterações feitas após o início do backup. Uma de cada linha `log_type` é exibida na tabela `logbuffers` para cada nó de dados no cluster. Essas linhas não estão presentes a menos que um backup do NDB esteja sendo realizado atualmente.