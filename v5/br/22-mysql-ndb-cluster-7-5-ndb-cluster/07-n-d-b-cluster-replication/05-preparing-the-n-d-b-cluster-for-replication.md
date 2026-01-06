### 21.7.5 Preparando o NDB Cluster para Replicação

Preparar o cluster do NDB para a replicação consiste nas seguintes etapas:

1. Verifique a compatibilidade de versão de todos os servidores MySQL (consulte Seção 21.7.2, “Requisitos Gerais para a Replicação do NDB Cluster”).

2. Crie uma conta de replicação no cluster de origem com os privilégios apropriados, usando as seguintes duas instruções SQL:

   ```sql
   mysqlS> CREATE USER 'replica_user'@'replica_host'
        -> IDENTIFIED BY 'replica_password';

   mysqlS> GRANT REPLICATION SLAVE ON *.*
        -> TO 'replica_user'@'replica_host';
   ```

   Na declaração anterior, *`replica_user`* é o nome do usuário da conta de replicação, *`replica_host`* é o nome do host ou endereço IP da replica, e *`replica_password`* é a senha a ser atribuída a essa conta.

   Por exemplo, para criar uma conta de usuário replica com o nome `myreplica`, faça login no host chamado `replica-host` e use a senha `53cr37`, use as seguintes instruções `CREATE USER` e `GRANT`:

   ```sql
   mysqlS> CREATE USER 'myreplica'@'replica-host'
        -> IDENTIFIED BY '53cr37';

   mysqlS> GRANT REPLICATION SLAVE ON *.*
        -> TO 'myreplica'@'replica-host';
   ```

   Por razões de segurança, é preferível usar uma conta de usuário única — que não seja usada para nenhum outro propósito — para a conta de replicação.

3. Configure a replica para usar a fonte. Usando o cliente **mysql**, isso pode ser feito com a seguinte instrução `CHANGE MASTER TO`:

   ```sql
   mysqlR> CHANGE MASTER TO
        -> MASTER_HOST='source_host',
        -> MASTER_PORT=source_port,
        -> MASTER_USER='replica_user',
        -> MASTER_PASSWORD='replica_password';
   ```

   Na declaração anterior, *`source_host`* é o nome do host ou o endereço IP da fonte de replicação, *`source_port`* é a porta que a replica deve usar ao se conectar à fonte, *`replica_user`* é o nome de usuário configurado para a replica na fonte e *`replica_password`* é a senha configurada para essa conta de usuário na etapa anterior.

   Por exemplo, para dizer à replica que use o servidor MySQL cujo nome de host é `rep-source` com a conta de replicação criada na etapa anterior, use a seguinte declaração:

   ```sql
   mysqlR> CHANGE MASTER TO
        -> MASTER_HOST='rep-source',
        -> MASTER_PORT=3306,
        -> MASTER_USER='myreplica',
        -> MASTER_PASSWORD='53cr37';
   ```

   Para uma lista completa das opções que podem ser usadas com essa declaração, consulte Seção 13.4.2.1, "ALTERAR MASTER PARA Declaração".

   Para fornecer a capacidade de backup de replicação, você também precisa adicionar uma opção `--ndb-connectstring` ao arquivo `my.cnf` da replica antes de iniciar o processo de replicação. Consulte Seção 21.7.9, “Backup de NDB Cluster com Replicação de NDB Cluster” para obter detalhes.

   Para obter opções adicionais que podem ser definidas em `my.cnf` para réplicas, consulte Seção 16.1.6, “Opções e variáveis de replicação e registro binário”.

4. Se o cluster de origem já estiver em uso, você pode criar um backup do cluster de origem e carregá-lo na replica para reduzir o tempo necessário para que a replica se sincronize com o cluster de origem. Se a replica também estiver executando o NDB Cluster, isso pode ser feito usando o procedimento de backup e restauração descrito em Seção 21.7.9, “Backup e restauração do NDB Cluster com replicação do NDB Cluster”.

   ```sql
   ndb-connectstring=management_host[:port]
   ```

   Caso você não esteja usando o NDB Cluster na replica, você pode criar um backup com este comando na fonte:

   ```sql
   shellS> mysqldump --master-data=1
   ```

   Em seguida, importe o dump de dados resultante na replica copiando o arquivo de dump para ela. Depois disso, você pode usar o cliente **mysql** para importar os dados do arquivo de dump para o banco de dados da replica, conforme mostrado aqui, onde *`dump_file`* é o nome do arquivo gerado usando **mysqldump** na fonte, e *`db_name`* é o nome do banco de dados a ser replicado:

   ```sql
   shellR> mysql -u root -p db_name < dump_file
   ```

   Para uma lista completa das opções que podem ser usadas com **mysqldump**, consulte Seção 4.5.4, “mysqldump — Um programa de backup de banco de dados”.

   Nota

   Se você copiar os dados para a replica dessa maneira, certifique-se de que a replica seja iniciada com a opção `--skip-slave-start` na linha de comando, caso contrário, inclua `skip-slave-start` no arquivo `my.cnf` da replica para evitar que ela tente se conectar à fonte para começar a replicar antes que todos os dados sejam carregados. Uma vez que o carregamento de dados seja concluído, siga as etapas adicionais descritas nas duas seções seguintes.

5. Certifique-se de que cada servidor MySQL que atua como fonte de replicação tenha um ID de servidor exclusivo e que o registro binário esteja habilitado, usando o formato baseado em linhas. (Veja Seção 16.2.1, “Formatos de Replicação”). Além disso, recomendamos habilitar a variável de sistema `slave_allow_batching`; a partir do NDB 7.6.23, uma mensagem de aviso é emitida se essa variável estiver definida como `OFF`. Você também deve considerar aumentar os valores usados com as opções `--ndb-batch-size` e `--ndb-blob-write-batch-bytes`. Todas essas opções podem ser definidas no arquivo `my.cnf` do servidor fonte ou na linha de comando ao iniciar o processo do **mysqld** fonte. Consulte Seção 21.7.6, “Iniciando a Replicação do NDB Cluster (Canal de Replicação Único)” para obter mais informações.
