#### 19.3.3.1 Prerrogativas para a replicação PRIVILEGE\_CHECKS\_USER Conta

A conta de usuário especificada usando a declaração `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` como a conta `PRIVILEGE_CHECKS_USER` para um canal de replicação deve ter o privilégio `REPLICATION_APPLIER`, caso contrário, o fio do aplicador de replicação não será iniciado. Como explicado na Seção 19.3.3, “Verificação de Privilégios de Replicação”, a conta requer privilégios adicionais que são suficientes para aplicar todas as transações esperadas no canal de replicação. Esses privilégios são verificados apenas quando as transações relevantes são executadas.

O uso do registro binário baseado em linhas (`binlog_format=ROW`) é fortemente recomendado para canais de replicação que são protegidos usando uma conta `PRIVILEGE_CHECKS_USER`. Com o registro binário baseado em instruções, alguns privilégios de nível de administrador podem ser necessários para que a conta `PRIVILEGE_CHECKS_USER` execute transações com sucesso. A partir do MySQL 8.0.19, o ajuste `REQUIRE_ROW_FORMAT` pode ser aplicado a canais protegidos, o que restringe o canal de executar eventos que exigiriam esses privilégios.

O privilégio `REPLICATION_APPLIER` permite explicitamente ou implicitamente que a conta `PRIVILEGE_CHECKS_USER` realize as seguintes operações que um fio de replicação precisa realizar:

- Defina o valor das variáveis de sistema `gtid_next`, `original_commit_timestamp`, `original_server_version`, `immediate_server_version` e `pseudo_replica_mode` ou `pseudo_slave_mode` para aplicar metadados e comportamentos apropriados ao executar transações.

- Execute instruções de uso interno `BINLOG` para aplicar a saída do **mysqlbinlog**, desde que a conta também tenha permissão para as tabelas e operações nessas instruções.

- Atualize as tabelas do sistema `mysql.gtid_executed`, `mysql.slave_relay_log_info`, `mysql.slave_worker_info` e `mysql.slave_master_info` para atualizar os metadados de replicação. (Se os eventos acessarem essas tabelas explicitamente para outros propósitos, você deve conceder os privilégios apropriados nas tabelas.)

- Aplicar um log binário `Table_map_log_event`, que fornece metadados da tabela, mas não realiza nenhuma alteração no banco de dados.

Se a opção `REQUIRE_TABLE_PRIMARY_KEY_CHECK` da declaração `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` estiver definida como o padrão de `STREAM`, a conta `PRIVILEGE_CHECKS_USER` precisa de privilégios suficientes para definir variáveis de sessão restritas, para que possa alterar o valor da variável de sistema `sql_require_primary_key` durante a sessão para corresponder ao ajuste replicado da fonte. O privilégio `SESSION_VARIABLES_ADMIN` confere essa capacidade à conta. Esse privilégio também permite que a conta aplique a saída **mysqlbinlog** que foi criada usando a opção `--disable-log-bin`. Se você definir `REQUIRE_TABLE_PRIMARY_KEY_CHECK` para `ON` ou `OFF`, a replica sempre usará esse valor para a variável de sistema `sql_require_primary_key` nas operações de replicação, e assim não precisará desses privilégios de nível de administração de sessão.

Se a criptografia de tabela estiver em uso, a variável de sistema `table_encryption_privilege_check` é definida como `ON`, e o ajuste de criptografia para o espaço de tabelas envolvido em qualquer evento difere do ajuste de criptografia padrão do servidor aplicando (especificado pela variável de sistema `default_table_encryption`), a conta `PRIVILEGE_CHECKS_USER` precisa do privilégio `TABLE_ENCRYPTION_ADMIN` para anular o ajuste de criptografia padrão. É altamente recomendável que você não conceda esse privilégio. Em vez disso, garanta que o ajuste de criptografia padrão em uma replica corresponda ao status de criptografia dos espaços de tabelas que ela replica, e que os membros do grupo de replicação tenham o mesmo ajuste de criptografia padrão, para que o privilégio não seja necessário.

Para executar transações replicadas específicas do log de retransmissão ou transações do **mysqlbinlog** conforme necessário, a conta `PRIVILEGE_CHECKS_USER` deve ter os seguintes privilégios:

- Para uma inserção de linha em formato de registro (que são registrados como `Write_rows_log_event`), o privilégio `INSERT` na tabela relevante.

- Para uma atualização de linha registrada no formato de linha (que são registradas como `Update_rows_log_event`), o privilégio `UPDATE` na tabela relevante.

- Para a exclusão de uma linha registrada no formato de linha `Delete_rows_log_event` (que são registradas como `Delete_rows_log_event`), o privilégio `DELETE` na tabela relevante.

Se o registro binário baseado em instruções estiver em uso (o que não é recomendado com uma conta `PRIVILEGE_CHECKS_USER`), para uma instrução de controle de transação como `BEGIN` ou `COMMIT` ou uma instrução registrada no formato de DML (que são registradas como um `Query_log_event`), a conta `PRIVILEGE_CHECKS_USER` precisa de privilégios para executar a instrução contida no evento.

Se operações `LOAD DATA` precisam ser realizadas no canal de replicação, use o registro binário baseado em linhas (`binlog_format=ROW`). Com esse formato de registro, o privilégio `FILE` não é necessário para executar o evento, então não dê esse privilégio à conta `PRIVILEGE_CHECKS_USER`. O uso do registro binário baseado em linhas é fortemente recomendado para canais de replicação que são protegidos usando uma conta `PRIVILEGE_CHECKS_USER`. Se `REQUIRE_ROW_FORMAT` estiver definida para o canal, o registro binário baseado em linhas é necessário. O `Format_description_log_event`, que exclui quaisquer arquivos temporários criados por eventos `LOAD DATA`, é processado sem verificações de privilégio. Para mais informações, consulte a Seção 19.5.1.19, “Replicação e LOAD DATA”.

Se a variável de sistema `init_replica` ou `init_slave` estiver definida para especificar uma ou mais instruções SQL a serem executadas quando o thread SQL de replicação for iniciado, a conta `PRIVILEGE_CHECKS_USER` deve ter os privilégios necessários para executar essas instruções.

Recomenda-se que você nunca conceda quaisquer privilégios de ACL à conta `PRIVILEGE_CHECKS_USER`, incluindo `CREATE USER`, `CREATE ROLE`, `DROP ROLE` e `GRANT OPTION`, e não permita que a conta atualize a tabela `mysql.user`. Com esses privilégios, a conta poderia ser usada para criar ou modificar contas de usuário no servidor. Para evitar que as declarações de ACL emitidas no servidor de origem sejam replicadas para o canal protegido para execução (onde elas falham na ausência desses privilégios), você pode emitir `SET sql_log_bin = 0` antes de todas as declarações de ACL e `SET sql_log_bin = 1` depois delas, para omitir as declarações do log binário da origem. Alternativamente, você pode definir um banco de dados atual dedicado antes de executar todas as declarações de ACL e usar um filtro de replicação (`--binlog-ignore-db`) para filtrar esse banco de dados na replica.
