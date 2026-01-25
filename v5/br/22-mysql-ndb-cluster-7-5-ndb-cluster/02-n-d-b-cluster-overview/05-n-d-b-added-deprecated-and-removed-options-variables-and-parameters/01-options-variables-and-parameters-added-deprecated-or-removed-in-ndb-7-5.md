#### 21.2.5.1 Opções, Variáveis e Parâmetros Adicionados, Descontinuados ou Removidos no NDB 7.5

* [Parâmetros Introduzidos no NDB 7.5](mysql-cluster-added-deprecated-removed-7-5.html#params-added-ndb-7.5 "Parâmetros Introduzidos no NDB 7.5")
* [Parâmetros Descontinuados no NDB 7.5](mysql-cluster-added-deprecated-removed-7-5.html#params-deprecated-ndb-7.5 "Parâmetros Descontinuados no NDB 7.5")
* [Parâmetros Removidos no NDB 7.5](mysql-cluster-added-deprecated-removed-7-5.html#params-removed-ndb-7.5 "Parâmetros Removidos no NDB 7.5")
* [Opções e Variáveis Introduzidas no NDB 7.5](mysql-cluster-added-deprecated-removed-7-5.html#optvars-added-ndb-7.5 "Opções e Variáveis Introduzidas no NDB 7.5")
* [Opções e Variáveis Descontinuadas no NDB 7.5](mysql-cluster-added-deprecated-removed-7-5.html#optvars-deprecated-ndb-7.5 "Opções e Variáveis Descontinuadas no NDB 7.5")
* [Opções e Variáveis Removidas no NDB 7.5](mysql-cluster-added-deprecated-removed-7-5.html#optvars-removed-ndb-7.5 "Opções e Variáveis Removidas no NDB 7.5")

As próximas seções contêm informações sobre parâmetros de configuração de node do `NDB` e opções e variáveis específicas do NDB para [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") que foram adicionados, descontinuados ou removidos do NDB 7.5.

##### Parâmetros Introduzidos no NDB 7.5

Os seguintes parâmetros de configuração de node foram adicionados no NDB 7.5.

* `ApiVerbose`: Habilita a depuração da NDB API; para desenvolvimento NDB. Adicionado no NDB 7.5.2.

##### Parâmetros Descontinuados no NDB 7.5

Os seguintes parâmetros de configuração de node foram descontinuados no NDB 7.5.

* `ExecuteOnComputer`: String que referencia um COMPUTER definido anteriormente. Descontinuado no NDB 7.5.0.

* `ExecuteOnComputer`: String que referencia um COMPUTER definido anteriormente. Descontinuado no NDB 7.5.0.

* `ExecuteOnComputer`: String que referencia um COMPUTER definido anteriormente. Descontinuado no NDB 7.5.0.

##### Parâmetros Removidos no NDB 7.5

Os seguintes parâmetros de configuração de node foram removidos no NDB 7.5.

* `DiskCheckpointSpeed`: Bytes permitidos a serem escritos pelo checkpoint, por segundo. Removido no NDB 7.5.0.

* `DiskCheckpointSpeedInRestart`: Bytes permitidos a serem escritos pelo checkpoint durante o restart, por segundo. Removido no NDB 7.5.0.

* `Id`: Número que identifica o data node. Agora descontinuado; use NodeId em seu lugar. Removido no NDB 7.5.0.

* `MaxNoOfSavedEvents`: Não usado. Removido no NDB 7.5.0.

* `PortNumber`: Porta usada para o transporter SCI. Removido no NDB 7.5.1.

* `PortNumber`: Porta usada para o transporter SHM. Removido no NDB 7.5.1.

* `PortNumber`: Porta usada para o transporter TCP. Removido no NDB 7.5.1.

* `ReservedSendBufferMemory`: Este parâmetro está presente no código NDB, mas não está habilitado. Removido no NDB 7.5.2.

##### Opções e Variáveis Introduzidas no NDB 7.5

As seguintes variáveis de sistema, variáveis de status e opções de servidor foram adicionadas no NDB 7.5.

* `Ndb_system_name`: Nome do sistema Cluster configurado; vazio se o server não estiver conectado ao NDB. Adicionado no NDB 5.7.18-ndb-7.5.7.

* `ndb-allow-copying-alter-table`: Defina como OFF para impedir que ALTER TABLE use operações de cópia em tabelas NDB. Adicionado no NDB 5.7.10-ndb-7.5.0.

* `ndb-cluster-connection-pool-nodeids`: Lista de node IDs separada por vírgulas para conexões com o cluster usadas pelo MySQL; o número de nodes na lista deve corresponder ao valor definido para --ndb-cluster-connection-pool. Adicionado no NDB 5.7.10-ndb-7.5.0.

* `ndb-default-column-format`: Use este valor (FIXED ou DYNAMIC) por padrão para as opções COLUMN_FORMAT e ROW_FORMAT ao criar ou adicionar colunas de tabela. Adicionado no NDB 5.7.11-ndb-7.5.1.

* `ndb-log-fail-terminate`: Finaliza o processo mysqld se o log completo de todos os row events encontrados não for possível. Adicionado no NDB 5.7.29-ndb-7.5.18.

* `ndb-log-update-minimal`: Faz o log de updates em formato minimalista. Adicionado no NDB 5.7.18-ndb-7.5.7.

* `ndb_data_node_neighbour`: Especifica o data node do cluster "mais próximo" deste MySQL Server, para otimização (hinting) de transações e tabelas totalmente replicadas. Adicionado no NDB 5.7.12-ndb-7.5.2.

* `ndb_default_column_format`: Define o formato de row padrão e o column format (FIXED ou DYNAMIC) usados para novas tabelas NDB. Adicionado no NDB 5.7.11-ndb-7.5.1.

* `ndb_fully_replicated`: Indica se novas tabelas NDB são totalmente replicadas. Adicionado no NDB 5.7.12-ndb-7.5.2.

* `ndb_read_backup`: Habilita a leitura a partir de qualquer réplica para todas as tabelas NDB; use NDB_TABLE=READ_BACKUP={0|1} com CREATE TABLE ou ALTER TABLE para habilitar ou desabilitar para tabelas NDB individuais. Adicionado no NDB 5.7.12-ndb-7.5.2.

##### Opções e Variáveis Descontinuadas no NDB 7.5

Nenhuma variável de sistema, variável de status ou opção de servidor foi descontinuada no NDB 7.5.

##### Opções e Variáveis Removidas no NDB 7.5

Nenhuma variável de sistema, variável de status ou opção foi removida no NDB 7.5.