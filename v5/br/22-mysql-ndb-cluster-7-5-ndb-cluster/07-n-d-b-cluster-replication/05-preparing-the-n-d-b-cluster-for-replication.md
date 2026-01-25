### 21.7.5 Preparando o NDB Cluster para Replication

A preparação do NDB Cluster para Replication consiste nas seguintes etapas:

1. Verifique a compatibilidade de versão de todos os servidores MySQL (veja [Seção 21.7.2, “Requisitos Gerais para NDB Cluster Replication”](mysql-cluster-replication-general.html "21.7.2 Requisitos Gerais para NDB Cluster Replication")).

2. Crie uma conta de Replication no Source Cluster com os privilégios apropriados, usando as duas instruções SQL seguintes:

   ```sql
   mysqlS> CREATE USER 'replica_user'@'replica_host'
        -> IDENTIFIED BY 'replica_password';

   mysqlS> GRANT REPLICATION SLAVE ON *.*
        -> TO 'replica_user'@'replica_host';
   ```

   Na instrução anterior, *`replica_user`* é o nome de usuário da conta de Replication, *`replica_host`* é o host name ou endereço IP da Replica, e *`replica_password`* é a password a ser atribuída a esta conta.

   Por exemplo, para criar uma conta de usuário de Replica com o nome `myreplica`, que fará login a partir do host chamado `replica-host` e usando a password `53cr37`, use as seguintes instruções [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") e [`GRANT`](grant.html "13.7.1.4 GRANT Statement"):

   ```sql
   mysqlS> CREATE USER 'myreplica'@'replica-host'
        -> IDENTIFIED BY '53cr37';

   mysqlS> GRANT REPLICATION SLAVE ON *.*
        -> TO 'myreplica'@'replica-host';
   ```

   Por motivos de segurança, é preferível usar uma conta de usuário única — não empregada para qualquer outra finalidade — para a conta de Replication.

3. Configure a Replica para usar o Source. Usando o cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"), isso pode ser realizado com a seguinte instrução [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement"):

   ```sql
   mysqlR> CHANGE MASTER TO
        -> MASTER_HOST='source_host',
        -> MASTER_PORT=source_port,
        -> MASTER_USER='replica_user',
        -> MASTER_PASSWORD='replica_password';
   ```

   Na instrução anterior, *`source_host`* é o host name ou endereço IP do Source de Replication, *`source_port`* é a Port que a Replica deve usar ao se conectar ao Source, *`replica_user`* é o user name configurado para a Replica no Source, e *`replica_password`* é a password definida para essa conta de usuário na etapa anterior.

   Por exemplo, para instruir a Replica a usar o servidor MySQL cujo host name é `rep-source` com a conta de Replication criada na etapa anterior, use a seguinte instrução:

   ```sql
   mysqlR> CHANGE MASTER TO
        -> MASTER_HOST='rep-source',
        -> MASTER_PORT=3306,
        -> MASTER_USER='myreplica',
        -> MASTER_PASSWORD='53cr37';
   ```

   Para uma lista completa de opções que podem ser usadas com esta instrução, veja [Seção 13.4.2.1, “CHANGE MASTER TO Statement”](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement").

   Para fornecer a capacidade de Backup de Replication, você também precisa adicionar uma opção [`--ndb-connectstring`](mysql-cluster-options-variables.html#option_mysqld_ndb-connectstring) ao arquivo `my.cnf` da Replica antes de iniciar o processo de Replication. Veja [Seção 21.7.9, “Backups de NDB Cluster com NDB Cluster Replication”](mysql-cluster-replication-backups.html "21.7.9 NDB Cluster Backups With NDB Cluster Replication"), para detalhes.

   Para opções adicionais que podem ser definidas em `my.cnf` para Replicas, veja [Seção 16.1.6, “Opções e Variáveis de Replication e Binary Logging”](replication-options.html "16.1.6 Replication and Binary Logging Options and Variables").

4. Se o Source Cluster já estiver em uso, você pode criar um Backup do Source e carregá-lo na Replica para reduzir a quantidade de tempo necessária para que a Replica se sincronize com o Source. Se a Replica também estiver executando o NDB Cluster, isso pode ser realizado usando o procedimento de Backup e Restore descrito em [Seção 21.7.9, “Backups de NDB Cluster com NDB Cluster Replication”](mysql-cluster-replication-backups.html "21.7.9 NDB Cluster Backups With NDB Cluster Replication").

   ```sql
   ndb-connectstring=management_host[:port]
   ```

   No caso de você *não* estar usando o NDB Cluster na Replica, você pode criar um Backup com este comando no Source:

   ```sql
   shellS> mysqldump --master-data=1
   ```

   Em seguida, importe o Data Dump resultante para a Replica, copiando o Dump File para ela. Depois disso, você pode usar o cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") para importar os dados do Dump File para o Database da Replica, como mostrado aqui, onde *`dump_file`* é o nome do arquivo que foi gerado usando [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") no Source, e *`db_name`* é o nome do Database a ser replicado:

   ```sql
   shellR> mysql -u root -p db_name < dump_file
   ```

   Para uma lista completa de opções a serem usadas com [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program"), veja [Seção 4.5.4, “mysqldump — A Database Backup Program”](mysqldump.html "4.5.4 mysqldump — A Database Backup Program").

   Nota
   Se você copiar os dados para a Replica desta maneira, você deve garantir que a Replica seja iniciada com a opção [`--skip-slave-start`](replication-options-replica.html#option_mysqld_skip-slave-start) na linha de comando, ou então incluir `skip-slave-start` no arquivo `my.cnf` da Replica para evitar que ela tente se conectar ao Source para começar a replicar antes que todos os dados tenham sido carregados. Assim que o carregamento dos dados for concluído, siga as etapas adicionais descritas nas próximas duas seções.

5. Certifique-se de que cada servidor MySQL atuando como Source de Replication tenha um Server ID exclusivo atribuído e tenha o Binary Logging habilitado, usando o formato baseado em row. (Veja [Seção 16.2.1, “Replication Formats”](replication-formats.html "16.2.1 Replication Formats").) Além disso, recomendamos habilitar a variável de sistema [`slave_allow_batching`](mysql-cluster-options-variables.html#sysvar_slave_allow_batching); a partir do NDB 7.6.23, um Warning é emitido se esta variável estiver definida como `OFF`. Você também deve considerar aumentar os valores usados com as opções [`--ndb-batch-size`](mysql-cluster-options-variables.html#option_mysqld_ndb-batch-size) e [`--ndb-blob-write-batch-bytes`](mysql-cluster-options-variables.html#option_mysqld_ndb-blob-write-batch-bytes). Todas estas opções podem ser definidas tanto no arquivo `my.cnf` do Source Server quanto na linha de comando ao iniciar o processo [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") do Source. Veja [Seção 21.7.6, “Iniciando NDB Cluster Replication (Single Replication Channel)”](mysql-cluster-replication-starting.html "21.7.6 Starting NDB Cluster Replication (Single Replication Channel)"), para mais informações.