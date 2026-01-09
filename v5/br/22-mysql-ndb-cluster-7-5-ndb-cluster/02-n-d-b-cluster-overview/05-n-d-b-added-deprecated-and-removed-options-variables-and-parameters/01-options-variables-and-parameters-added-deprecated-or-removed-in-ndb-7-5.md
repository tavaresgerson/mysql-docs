#### 21.2.5.1 Opções, variáveis e parâmetros adicionados, descontinuados ou removidos no NDB 7.5

- Parâmetros Introduzidos no NDB 7.5
- Parâmetros Desatualizados no NDB 7.5
- Parâmetros removidos na NDB 7.5
- Opções e variáveis introduzidas no NDB 7.5
- Opções e variáveis descontinuadas no NDB 7.5
- Opções e variáveis removidas na NDB 7.5

As próximas seções contêm informações sobre os parâmetros de configuração do nó `NDB` e as opções e variáveis específicas do NDB **mysqld** que foram adicionadas, descontinuadas ou removidas do NDB 7.5.

##### Parâmetros Introduzidos no NDB 7.5

Os seguintes parâmetros de configuração de nó foram adicionados no NDB 7.5.

- `ApiVerbose`: Habilitar depuração da API NDB; para desenvolvimento do NDB. Adicionada no NDB 7.5.2.

##### Parâmetros desatualizados na NDB 7.5

Os seguintes parâmetros de configuração de nó foram descontinuados no NDB 7.5.

- `ExecuteOnComputer`: String que faz referência a um COMPUTADOR definido anteriormente. Desatualizado na NDB 7.5.0.

- `ExecuteOnComputer`: String que faz referência a um COMPUTADOR definido anteriormente. Desatualizado na NDB 7.5.0.

- `ExecuteOnComputer`: String que faz referência a um COMPUTADOR definido anteriormente. Desatualizado na NDB 7.5.0.

##### Parâmetros removidos na NDB 7.5

Os seguintes parâmetros de configuração de nó foram removidos no NDB 7.5.

- `DiskCheckpointSpeed`: Bytes permitidos para serem escritos pelo ponto de verificação, por segundo. Removido no NDB 7.5.0.

- `DiskCheckpointSpeedInRestart`: Bytes permitidos para serem escritos pelo ponto de verificação durante o reinício, por segundo. Removido no NDB 7.5.0.

- `Id`: Número que identifica o nó de dados. Agora desatualizado; use NodeId. Removido no NDB 7.5.0.

- `MaxNoOfSavedEvents`: Não utilizado. Removido na versão NDB 7.5.0.

- `PortNumber`: Porta usada para o transportador SCI. Removido na NDB 7.5.1.

- `PortNumber`: Porta usada para o transportador SHM. Removido na NDB 7.5.1.

- `PortNumber`: Porta usada para o transportador TCP. Removido no NDB 7.5.1.

- `ReservedSendBufferMemory`: Este parâmetro está presente no código NDB, mas não está habilitado. Removido no NDB 7.5.2.

##### Opções e variáveis introduzidas no NDB 7.5

As seguintes variáveis de sistema, variáveis de status e opções de servidor foram adicionadas no NDB 7.5.

- `Ndb_system_name`: Nome do sistema do clúster configurado; vazio se o servidor não estiver conectado ao NDB. Adicionado no NDB 5.7.18-ndb-7.5.7.

- `ndb-allow-copying-alter-table`: Defina para OFF para impedir que a operação ALTER TABLE use operações de cópia em tabelas NDB. Adicionada no NDB 5.7.10-ndb-7.5.0.

- `ndb-cluster-connection-pool-nodeids`: Lista separada por vírgula dos IDs de nó para conexões ao cluster usadas pelo MySQL; o número de nós na lista deve corresponder ao valor definido para `--ndb-cluster-connection-pool`. Adicionada no NDB 5.7.10-ndb-7.5.0.

- `ndb-default-column-format`: Use este valor (FIXED ou DYNAMIC) como padrão para as opções COLUMN_FORMAT e ROW_FORMAT ao criar ou adicionar colunas de tabela. Adicionado no NDB 5.7.11-ndb-7.5.1.

- `ndb-log-fail-terminate`: Finalizar o processo mysqld se a conclusão do registro completo de todos os eventos das linhas encontradas não for possível. Adicionado no NDB 5.7.29-ndb-7.5.18.

- `ndb-log-update-minimal`: Atualizações de log no formato mínimo. Adicionado no NDB 5.7.18-ndb-7.5.7.

- `ndb_data_node_neighbour`: Especifica o nó de dados do cluster "mais próximo" deste servidor MySQL, para dicas de transações e tabelas totalmente replicadas. Adicionado no NDB 5.7.12-ndb-7.5.2.

- `ndb_default_column_format`: Define o formato padrão da linha e o formato de coluna (FIXO ou DINÂMICO) usado para novas tabelas NDB. Adicionado no NDB 5.7.11-ndb-7.5.1.

- `ndb_fully_replicated`: Se as novas tabelas NDB são totalmente replicadas. Adicionada no NDB 5.7.12-ndb-7.5.2.

- `ndb_read_backup`: Habilitar a leitura de qualquer replica para todas as tabelas NDB; use NDB_TABLE=READ_BACKUP={0|1} com CREATE TABLE ou ALTER TABLE para habilitar ou desabilitar para tabelas NDB individuais. Adicionada no NDB 5.7.12-ndb-7.5.2.

##### Opções e variáveis descontinuadas no NDB 7.5

Nenhuma variável de sistema, variável de status ou opção do servidor foi descontinuada no NDB 7.5.

##### Opções e variáveis removidas no NDB 7.5

Nenhuma variável de sistema, variável de status ou opção foi removida no NDB 7.5.
