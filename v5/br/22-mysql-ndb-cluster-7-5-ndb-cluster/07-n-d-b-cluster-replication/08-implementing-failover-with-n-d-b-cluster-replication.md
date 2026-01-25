### 21.7.8 Implementando Failover com Replicação NDB Cluster

No caso de o processo de Replication primário do Cluster falhar, é possível alternar para o Channel de Replication secundário. O procedimento a seguir descreve as etapas necessárias para realizar isso.

1. Obtenha o tempo do Global Checkpoint (GCP) mais recente. Ou seja, você precisa determinar o Epoch mais recente da tabela `ndb_apply_status` no Cluster Replica, o que pode ser encontrado usando a seguinte Query:

   ```sql
   mysqlR'> SELECT @latest:=MAX(epoch)
         ->        FROM mysql.ndb_apply_status;
   ```

   Em uma topologia de Replication circular, com um Source e um Replica rodando em cada Host, quando você está usando `ndb_log_apply_status=1`, os Epochs do NDB Cluster são escritos nos Binary Logs dos Replicas. Isso significa que a tabela `ndb_apply_status` contém informações para o Replica neste Host, bem como para qualquer outro Host que atue como um Replica do Replication Source Server rodando neste Host.

   Neste caso, você precisa determinar o Epoch mais recente neste Replica, excluindo quaisquer Epochs de quaisquer outros Replicas no Binary Log deste Replica que não estavam listados nas opções `IGNORE_SERVER_IDS` do Statement [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") usado para configurar este Replica. A razão para excluir tais Epochs é que as linhas na tabela `mysql.ndb_apply_status` cujos Server IDs correspondem à lista `IGNORE_SERVER_IDS` do Statement `CHANGE MASTER TO` usado para preparar o Source deste Replica também são consideradas provenientes de Servers locais, além daquelas que possuem o Server ID do próprio Replica. Você pode recuperar esta lista como `Replicate_Ignore_Server_Ids` a partir da saída de [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement"). Assumimos que você obteve esta lista e a está substituindo por *`ignore_server_ids`* na Query mostrada aqui, que, assim como a versão anterior da Query, seleciona o maior Epoch para uma variável nomeada `@latest`:

   ```sql
   mysqlR'> SELECT @latest:=MAX(epoch)
         ->        FROM mysql.ndb_apply_status
         ->        WHERE server_id NOT IN (ignore_server_ids);
   ```

   Em alguns casos, pode ser mais simples ou mais eficiente (ou ambos) usar uma lista dos Server IDs a serem incluídos e `server_id IN server_id_list` na condição `WHERE` da Query anterior.

2. Usando a informação obtida na Query mostrada na Etapa 1, obtenha os registros correspondentes da tabela `ndb_binlog_index` no Source Cluster.

   Você pode usar a seguinte Query para obter os registros necessários da tabela `ndb_binlog_index` no Source:

   ```sql
   mysqlS'> SELECT
       ->     @file:=SUBSTRING_INDEX(next_file, '/', -1),
       ->     @pos:=next_position
       -> FROM mysql.ndb_binlog_index
       -> WHERE epoch = @latest;
   ```

   Estes são os registros salvos no Source desde a falha do Channel de Replication primário. Empregamos uma variável de usuário `@latest` aqui para representar o valor obtido na Etapa 1. Obviamente, não é possível para uma instância [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") acessar variáveis de usuário definidas em outra instância Server diretamente. Esses valores devem ser “inseridos” na segunda Query manualmente ou por uma aplicação.

   **Importante**

   Você deve garantir que o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") Replica seja iniciado com [`--slave-skip-errors=ddl_exist_errors`](replication-options-replica.html#option_mysqld_slave-skip-errors) antes de executar [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement"). Caso contrário, o Replication pode parar com erros DDL duplicados.

3. Agora é possível sincronizar o Channel secundário executando a seguinte Query no Server Replica secundário:

   ```sql
   mysqlR'> CHANGE MASTER TO
         ->     MASTER_LOG_FILE='@file',
         ->     MASTER_LOG_POS=@pos;
   ```

   Novamente, empregamos variáveis de usuário (neste caso `@file` e `@pos`) para representar os valores obtidos na Etapa 2 e aplicados na Etapa 3; na prática, esses valores devem ser inseridos manualmente ou usando uma aplicação que possa acessar ambos os Servers envolvidos.

   **Nota**

   `@file` é um valor string, como `'/var/log/mysql/replication-source-bin.00001'`, e portanto deve ser citado (entre aspas) ao ser usado em código SQL ou de aplicação. No entanto, o valor representado por `@pos` *não* deve ser citado. Embora o MySQL normalmente tente converter strings em números, este caso é uma exceção.

4. Você pode agora iniciar o Replication no Channel secundário emitindo o Statement apropriado no [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") Replica secundário:

   ```sql
   mysqlR'> START SLAVE;
   ```

Assim que o Channel de Replication secundário estiver ativo, você pode investigar a falha do primário e realizar os reparos. As ações precisas necessárias para fazer isso dependem das razões pelas quais o Channel primário falhou.

**Aviso**

O Channel de Replication secundário deve ser iniciado somente se e quando o Channel de Replication primário tiver falhado. Executar múltiplos Channels de Replication simultaneamente pode resultar na criação de registros duplicados indesejados nos Replicas.

Se a falha estiver limitada a um único Server, deve ser teoricamente possível replicar de *`S`* para *`R'`*, ou de *`S'`* para *`R`*.