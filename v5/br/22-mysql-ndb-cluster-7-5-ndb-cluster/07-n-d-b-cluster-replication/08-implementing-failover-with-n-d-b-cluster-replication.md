### 21.7.8 Implementando Failover com a Replicação do NDB Cluster

Caso o processo de replicação primária do grupo falhe, é possível alternar para o canal de replicação secundário. O procedimento a seguir descreve os passos necessários para realizar isso.

1. Obtenha a hora do ponto de verificação global (GCP) mais recente. Ou seja, você precisa determinar a época mais recente da tabela `ndb_apply_status` no cluster de replica, que pode ser encontrada usando a seguinte consulta:

   ```sql
   mysqlR'> SELECT @latest:=MAX(epoch)
         ->        FROM mysql.ndb_apply_status;
   ```

   Em uma topologia de replicação circular, com uma fonte e uma replica executando em cada host, quando você estiver usando `ndb_log_apply_status=1`, as épocas do NDB Cluster são escritas nos logs binários das réplicas. Isso significa que a tabela `ndb_apply_status` contém informações tanto para a replica neste host quanto para qualquer outro host que atue como replica do servidor de fonte de replicação executando neste host.

   Neste caso, você precisa determinar a última época nesta réplica, excluindo quaisquer épocas de quaisquer outras réplicas neste log binário da réplica que não estiverem listadas nas opções `IGNORE_SERVER_IDS` da declaração `CHANGE MASTER TO` usada para configurar esta réplica. A razão para a exclusão dessas épocas é que as linhas na tabela `mysql.ndb_apply_status` cujos IDs de servidor têm uma correspondência na lista `IGNORE_SERVER_IDS` da declaração `CHANGE MASTER TO` usada para preparar a fonte desta réplica também são consideradas de servidores locais, além daquelas que têm o próprio ID de servidor da réplica. Você pode recuperar essa lista como `Replicate_Ignore_Server_Ids` a partir da saída de `SHOW SLAVE STATUS`. Assumemos que você obteve essa lista e está substituindo-a por *`ignore_server_ids`* na consulta mostrada aqui, que, como a versão anterior da consulta, seleciona a maior época em uma variável chamada `@latest`:

   ```sql
   mysqlR'> SELECT @latest:=MAX(epoch)
         ->        FROM mysql.ndb_apply_status
         ->        WHERE server_id NOT IN (ignore_server_ids);
   ```

   Em alguns casos, pode ser mais simples ou mais eficiente (ou ambos) usar uma lista dos IDs do servidor a serem incluídos e `server_id IN server_id_list` na condição `WHERE` da consulta anterior.

2. Usando as informações obtidas da consulta mostrada no Passo 1, obtenha os registros correspondentes da tabela `ndb_binlog_index` no cluster de origem.

   Você pode usar a seguinte consulta para obter os registros necessários da tabela `ndb_binlog_index` na fonte:

   ```sql
   mysqlS'> SELECT
       ->     @file:=SUBSTRING_INDEX(next_file, '/', -1),
       ->     @pos:=next_position
       -> FROM mysql.ndb_binlog_index
       -> WHERE epoch = @latest;
   ```

   Estes são os registros salvos na fonte desde o falecimento do canal de replicação primário. Usamos uma variável de usuário `@latest` aqui para representar o valor obtido no Passo 1. Claro, não é possível que uma instância de **mysqld** acesse diretamente as variáveis de usuário definidas em outra instância do servidor. Esses valores devem ser "conectados" à segunda consulta manualmente ou por uma aplicação.

   Importante

   Você deve garantir que a replicação **mysqld** seja iniciada com `--slave-skip-errors=ddl_exist_errors` antes de executar `START SLAVE`. Caso contrário, a replicação pode parar com erros de DDL duplicados.

3. Agora é possível sincronizar o canal secundário executando a seguinte consulta no servidor replica secundário:

   ```sql
   mysqlR'> CHANGE MASTER TO
         ->     MASTER_LOG_FILE='@file',
         ->     MASTER_LOG_POS=@pos;
   ```

   Novamente, empregamos variáveis de usuário (neste caso, `@file` e `@pos`) para representar os valores obtidos na Etapa 2 e aplicados na Etapa 3; na prática, esses valores devem ser inseridos manualmente ou usando uma aplicação que possa acessar ambos os servidores envolvidos.

   Nota

   `@file` é um valor de string, como `'/var/log/mysql/replication-source-bin.00001'`, e, portanto, deve ser citado quando usado em código SQL ou de aplicação. No entanto, o valor representado por `@pos` *não* deve ser citado. Embora o MySQL normalmente tente converter strings em números, este caso é uma exceção.

4. Agora você pode iniciar a replicação no canal secundário emitindo a declaração apropriada na replica secundária **mysqld**:

   ```sql
   mysqlR'> START SLAVE;
   ```

Depois que o canal de replicação secundário estiver ativo, você pode investigar a falha do canal primário e efetuar as correções necessárias. As ações precisas necessárias para isso dependem das razões pelas quais o canal primário falhou.

Aviso

O canal de replicação secundário só deve ser iniciado se e quando o canal de replicação primário falhar. Executar vários canais de replicação simultaneamente pode resultar na criação de registros duplicados indesejados nas réplicas.

Se a falha estiver limitada a um único servidor, em teoria, seria possível replicar de *`S`* para *`R'`* ou de *`S'`* para *`R`*.
