### 25.7.5 Preparando o NDB Cluster para Replicação

Preparar o cluster do NDB para a replicação consiste nas seguintes etapas:

1. Verifique a compatibilidade de versão de todos os servidores MySQL (consulte a Seção 25.7.2, “Requisitos Gerais para a Replicação do NDB Cluster”).

2. Crie uma conta de replicação no cluster de origem com os privilégios apropriados, usando as seguintes duas instruções SQL:

   ```
   mysqlS> CREATE USER 'replica_user'@'replica_host'
        -> IDENTIFIED BY 'replica_password';

   mysqlS> GRANT REPLICATION SLAVE ON *.*
        -> TO 'replica_user'@'replica_host';
   ```

   Na declaração anterior, `replica_user` é o nome do usuário da conta de replicação, `replica_host` é o nome do host ou endereço IP da replica, e `replica_password` é a senha a ser atribuída a essa conta.

   Por exemplo, para criar uma conta de usuário replica com o nome `myreplica`, faça login a partir do host chamado `replica-host` e use a senha `53cr37`, use as seguintes instruções `CREATE USER` e `GRANT`:

   ```
   mysqlS> CREATE USER 'myreplica'@'replica-host'
        -> IDENTIFIED BY '53cr37';

   mysqlS> GRANT REPLICATION SLAVE ON *.*
        -> TO 'myreplica'@'replica-host';
   ```

   Por razões de segurança, é preferível usar uma conta de usuário única — que não seja usada para nenhum outro propósito — para a conta de replicação.

3. Configure a replica para usar a fonte. Com o cliente **mysql**, isso pode ser feito com a instrução `CHANGE REPLICATION SOURCE TO` (começando com NDB 8.0.23) ou a instrução `CHANGE MASTER TO` (antes de NDB 8.0.23):

   ```
   mysqlR> CHANGE MASTER TO
        -> MASTER_HOST='source_host',
        -> MASTER_PORT=source_port,
        -> MASTER_USER='replica_user',
        -> MASTER_PASSWORD='replica_password';
   ```

   A partir da versão NDB 8.0.23, você também pode usar a seguinte declaração:

   ```
   mysqlR> CHANGE REPLICATION SOURCE TO
        -> SOURCE_HOST='source_host',
        -> SOURCE_PORT=source_port,
        -> SOURCE_USER='replica_user',
        -> SOURCE_PASSWORD='replica_password';
   ```

   Na declaração anterior, `source_host` é o nome do host ou o endereço IP da fonte de replicação, `source_port` é a porta que a replica deve usar ao se conectar à fonte, `replica_user` é o nome de usuário configurado para a replica na fonte e `replica_password` é a senha configurada para essa conta de usuário na etapa anterior.

   Por exemplo, para dizer à replica que use o servidor MySQL cujo nome de host é `rep-source` com a conta de replicação criada no passo anterior, use a seguinte declaração:

   ```
   mysqlR> CHANGE MASTER TO
        -> MASTER_HOST='rep-source',
        -> MASTER_PORT=3306,
        -> MASTER_USER='myreplica',
        -> MASTER_PASSWORD='53cr37';
   ```

   A partir da versão NDB 8.0.23, você também pode usar a seguinte declaração:

   ```
   mysqlR> CHANGE REPLICATION SOURCE TO
        -> SOURCE_HOST='rep-source',
        -> SOURCE_PORT=3306,
        -> SOURCE_USER='myreplica',
        -> SOURCE_PASSWORD='53cr37';
   ```

   Para uma lista completa das opções que podem ser usadas com essa declaração, consulte a Seção 15.4.2.1, “ALTERAR MASTER PARA”.

   Para fornecer a capacidade de backup de replicação, você também precisa adicionar uma opção `--ndb-connectstring` ao arquivo `my.cnf` da replica antes de iniciar o processo de replicação. Consulte a Seção 25.7.9, “Backup de NDB Cluster com Replicação de NDB Cluster”, para obter detalhes.

   Para obter opções adicionais que podem ser definidas em `my.cnf` para réplicas, consulte a Seção 19.1.6, “Opções e variáveis de replicação e registro binário”.

4. Se o cluster de origem já estiver em uso, você pode criar um backup do cluster de origem e carregá-lo na replica para reduzir o tempo necessário para que a replica se sincronize com o cluster de origem. Se a replica também estiver executando o NDB Cluster, isso pode ser feito usando o procedimento de backup e restauração descrito na Seção 25.7.9, “Backup do NDB Cluster com Replicação do NDB Cluster”.

   ```
   ndb-connectstring=management_host[:port]
   ```

   Caso você não esteja usando o NDB Cluster na replica, você pode criar um backup com este comando na fonte:

   ```
   shellS> mysqldump --master-data=1
   ```

   Em seguida, importe o dump de dados resultante na replica copiando o arquivo de dump para ela. Depois disso, você pode usar o cliente **mysql** para importar os dados do arquivo de dump para o banco de dados da replica, conforme mostrado aqui, onde `dump_file` é o nome do arquivo gerado usando **mysqldump** na fonte, e `db_name` é o nome do banco de dados a ser replicado:

   ```
   shellR> mysql -u root -p db_name < dump_file
   ```

   Para uma lista completa das opções que podem ser usadas com o **mysqldump**, consulte a Seção 6.5.4, “mysqldump — Um programa de backup de banco de dados”.

   Nota

   Se você copiar os dados para a replica dessa maneira, certifique-se de que você interrompa a replica de tentar se conectar à fonte para começar a replicar antes que todos os dados tenham sido carregados. Você pode fazer isso iniciando a replica com a opção `--skip-slave-start` na linha de comando, incluindo `skip-slave-start` no arquivo `my.cnf` da replica ou começando com NDB 8.0.24, configurando a variável de sistema `skip_slave_start`. A partir de NDB 8.0.26, use `--skip-replica-start` ou `skip_replica_start` em vez disso. Uma vez que o carregamento de dados tenha sido concluído, siga as etapas adicionais descritas nas duas seções seguintes.

5. Certifique-se de que cada servidor MySQL que atua como fonte de replicação tenha um ID de servidor exclusivo e que o registro binário esteja habilitado, usando o formato baseado em linhas. (Veja a Seção 19.2.1, “Formatos de Replicação”.) Além disso, recomendamos fortemente habilitar a variável de sistema `replica_allow_batching` (NDB 8.0.26 e versões posteriores; antes do NDB 8.0.26, use `slave_allow_batching`). A partir do NDB 8.0.30, isso está habilitado por padrão.

   Se você estiver usando uma versão do NDB Cluster anterior à NDB 8.0.30, também deve considerar aumentar os valores usados com as opções `--ndb-batch-size` e `--ndb-blob-write-batch-bytes`. No NDB 8.0.30 e versões posteriores, use `--ndb-replica-batch-size` para definir o tamanho do lote usado para gravações na replica, em vez de `--ndb-batch-size`, e `--ndb-replica-blob-write-batch-bytes` em vez de `--ndb-blob-write-batch-bytes` para determinar o tamanho do lote usado pelo aplicativo de replicação para gravação de dados blob. Todas essas opções podem ser definidas no arquivo `my.cnf` do servidor de origem ou na linha de comando ao iniciar o processo **mysqld** da origem. Consulte a Seção 25.7.6, “Iniciando a Replicação do NDB Cluster (Canal de Replicação Único”)”), para obter mais informações.
