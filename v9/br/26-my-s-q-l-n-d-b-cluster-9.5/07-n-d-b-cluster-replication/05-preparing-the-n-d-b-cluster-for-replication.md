### 25.7.5 Preparando o NDB Cluster para Replicação

Preparar o NDB Cluster para replicação consiste nas seguintes etapas:

1. Verifique todos os servidores MySQL quanto à compatibilidade de versão (consulte a Seção 25.7.2, “Requisitos Gerais para Replicação de NDB Cluster”).

2. Crie uma conta de replicação no Cluster de origem com os privilégios apropriados, usando as seguintes duas instruções SQL:

   ```
   mysqlS> CREATE USER 'replica_user'@'replica_host'
        -> IDENTIFIED BY 'replica_password';

   mysqlS> GRANT REPLICATION SLAVE ON *.*
        -> TO 'replica_user'@'replica_host';
   ```

   Na instrução anterior, *`replica_user`* é o nome do usuário da conta de replicação, *`replica_host`* é o nome do host ou endereço IP da replica, e *`replica_password`* é a senha para atribuir a essa conta.

   Por exemplo, para criar uma conta de usuário de replica com o nome `myreplica`, logando-se a partir do host chamado `replica-host` e usando a senha `53cr37`, use as seguintes instruções `CREATE USER` e `GRANT`:

   ```
   mysqlS> CREATE USER 'myreplica'@'replica-host'
        -> IDENTIFIED BY '53cr37';

   mysqlS> GRANT REPLICATION SLAVE ON *.*
        -> TO 'myreplica'@'replica-host';
   ```

   Por razões de segurança, é preferível usar uma conta de usuário única — não empregada para nenhum outro propósito — para a conta de replicação.

3. Configure a replica para usar a fonte. Usando o cliente **mysql**, isso pode ser feito com a instrução `CHANGE REPLICATION SOURCE TO`:

   ```
   mysqlR> CHANGE REPLICATION SOURCE TO
        -> SOURCE_HOST='source_host',
        -> SOURCE_PORT=source_port,
        -> SOURCE_USER='replica_user',
        -> SOURCE_PASSWORD='replica_password';
   ```

   Na instrução anterior, *`source_host`* é o nome do host ou endereço IP da fonte de replicação, *`source_port`* é a porta para a replica usar ao se conectar à fonte, *`replica_user`* é o nome de usuário configurado para a replica na fonte, e *`replica_password`* é a senha configurada para essa conta de usuário na etapa anterior.

   Por exemplo, para dizer à replica que use o servidor MySQL cujo nome de host é `rep-source` com a conta de replicação criada na etapa anterior, use a seguinte instrução:

   ```
   mysqlR> CHANGE REPLICATION SOURCE TO
        -> SOURCE_HOST='rep-source',
        -> SOURCE_PORT=3306,
        -> SOURCE_USER='myreplica',
        -> SOURCE_PASSWORD='53cr37';
   ```

Para obter uma lista completa das opções que podem ser usadas com essa declaração, consulte a Seção 15.4.2.2, “ALTERE A FONTE DE REPLICAÇÃO PARA a Declaração”.

Para fornecer a capacidade de backup de replicação, também é necessário adicionar uma opção `--ndb-connectstring` ao arquivo `my.cnf` da replica antes de iniciar o processo de replicação. Consulte a Seção 25.7.9, “Backup de Clúster NDB com Replicação de Clúster NDB”, para obter detalhes.

Para opções adicionais que podem ser definidas no `my.cnf` para réplicas, consulte a Seção 19.1.6, “Opções e Variáveis de Registro Binário e Replicação”.

4. Se o clúster de origem já estiver em uso, você pode criar um backup do clúster de origem e carregá-lo na replica para reduzir o tempo necessário para que a replica se sincronize com o clúster de origem. Se a replica também estiver executando o NDB Cluster, isso pode ser feito usando o procedimento de backup e restauração descrito na Seção 25.7.9, “Backup de Clúster NDB com Replicação de Clúster NDB”.

```
   ndb-connectstring=management_host[:port]
   ```

No caso de você *não* estar usando o NDB Cluster na replica, você pode criar um backup com este comando no clúster de origem:

```
   shellS> mysqldump --source-data=1
   ```

Em seguida, importe o dump de dados resultante na replica copiando o arquivo de dump para ela. Depois disso, você pode usar o cliente **mysql** para importar os dados do dumpfile para o banco de dados da replica, como mostrado aqui, onde *`dump_file`* é o nome do arquivo gerado usando **mysqldump** no clúster de origem, e *`db_name`* é o nome do banco de dados a ser replicado:

```
   shellR> mysql -u root -p db_name < dump_file
   ```

Para obter uma lista completa das opções para usar com **mysqldump**, consulte a Seção 6.5.4, “mysqldump — Um Programa de Backup de Banco de Dados”.

Nota

Se você copiar os dados para a replica dessa maneira, certifique-se de que você interrompa a replica de tentar se conectar à fonte para começar a replicar antes que todos os dados tenham sido carregados. Você pode fazer isso iniciando a replica com `--skip-replica-start`. Uma vez que o carregamento de dados tenha sido concluído, siga as etapas adicionais descritas nas próximas duas seções.

5. Certifique-se de que cada servidor MySQL que atua como fonte de replicação seja atribuído um ID de servidor único e tenha o registro binário habilitado, usando o formato baseado em linhas. (Veja a Seção 19.2.1, “Formatos de Replicação”.) Além disso, recomendamos fortemente habilitar a variável de sistema `replica_allow_batching` (o padrão).

Use `--ndb-replica-batch-size` para definir o tamanho de lote usado para gravações na replica em vez de `--ndb-batch-size`, e `--ndb-replica-blob-write-batch-bytes` em vez de `--ndb-blob-write-batch-bytes` para determinar o tamanho de lote usado pelo aplicativo de replicação para gravar dados de blobs. Todas essas opções podem ser definidas no arquivo `my.cnf` do servidor de origem ou na linha de comando ao iniciar o processo **mysqld** da origem. Consulte a Seção 25.7.6, “Iniciando a Replicação do NDB Cluster (Canal de Replicação Único”)”), para obter mais informações.