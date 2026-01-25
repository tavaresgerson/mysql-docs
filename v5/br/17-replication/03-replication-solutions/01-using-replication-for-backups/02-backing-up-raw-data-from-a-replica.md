#### 16.3.1.2 Backup de Dados Brutos a partir de uma Replica

Para garantir a integridade dos arquivos que são copiados, o backup dos arquivos de dados brutos na sua Replica MySQL deve ocorrer enquanto o servidor da Replica estiver desligado. Se o servidor MySQL ainda estiver em execução, tarefas em segundo plano podem continuar atualizando os arquivos do Database, particularmente aquelas envolvendo storage engines com processos em segundo plano, como o `InnoDB`. Com o `InnoDB`, esses problemas devem ser resolvidos durante a recuperação de falhas (crash recovery), mas como o servidor da Replica pode ser desligado durante o processo de backup sem afetar a execução do Source, faz sentido tirar proveito dessa capacidade.

Para desligar o servidor e fazer o backup dos arquivos:

1. Desligue o servidor MySQL da Replica:

   ```sql
   $> mysqladmin shutdown
   ```

2. Copie os arquivos de dados. Você pode usar qualquer utilitário de cópia ou arquivamento adequado, incluindo **cp**, **tar** ou **WinZip**. Por exemplo, assumindo que o diretório de dados (data directory) esteja localizado sob o diretório atual, você pode arquivar o diretório inteiro da seguinte forma:

   ```sql
   $> tar cf /tmp/dbbackup.tar ./data
   ```

3. Inicie o servidor MySQL novamente. Em Unix:

   ```sql
   $> mysqld_safe &
   ```

   Em Windows:

   ```sql
   C:\> "C:\Program Files\MySQL\MySQL Server 5.7\bin\mysqld"
   ```

Normalmente, você deve fazer o backup do diretório de dados (data directory) inteiro para o servidor MySQL da Replica. Se você deseja poder restaurar os dados e operar como uma Replica (por exemplo, em caso de falha da Replica), além dos dados da Replica, você também deve fazer o backup dos arquivos de status da Replica, dos repositórios de metadados de replication e dos arquivos relay log. Esses arquivos são necessários para retomar a replication após a restauração dos dados da Replica.

Se você perder os relay logs, mas ainda tiver o arquivo `relay-log.info`, você pode verificá-lo para determinar até onde o replication SQL thread foi executado nos binary logs do Source. Em seguida, você pode usar [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") com as opções `MASTER_LOG_FILE` e `MASTER_LOG_POS` para instruir a Replica a reler os binary logs a partir desse ponto. Isso requer que os binary logs ainda existam no servidor Source.

Se a sua Replica estiver replicando instruções [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement"), você também deve fazer o backup de quaisquer arquivos `SQL_LOAD-*` que existam no diretório que a Replica usa para essa finalidade. A Replica precisa desses arquivos para retomar a replication de quaisquer operações [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") interrompidas. A localização deste diretório é o valor da variável de sistema [`slave_load_tmpdir`](replication-options-replica.html#sysvar_slave_load_tmpdir). Se o servidor não foi iniciado com essa variável configurada, a localização do diretório é o valor da variável de sistema [`tmpdir`](server-system-variables.html#sysvar_tmpdir).