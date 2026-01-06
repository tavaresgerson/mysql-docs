#### 16.3.1.2 Fazer backup de dados brutos de uma réplica

Para garantir a integridade dos arquivos copiados, a cópia dos arquivos de dados brutos no seu servidor replica do MySQL deve ser realizada enquanto o servidor replica estiver desligado. Se o servidor MySQL ainda estiver em execução, as tarefas em segundo plano podem continuar atualizando os arquivos do banco de dados, especialmente aqueles que envolvem motores de armazenamento com processos em segundo plano, como o `InnoDB`. Com o `InnoDB`, esses problemas devem ser resolvidos durante a recuperação em caso de falha, mas como o servidor replica pode ser desligado durante o processo de backup sem afetar a execução da fonte, faz sentido aproveitar essa capacidade.

Para desligar o servidor e fazer backup dos arquivos:

1. Desligue o servidor MySQL replica:

   ```sql
   $> mysqladmin shutdown
   ```

2. Copie os arquivos de dados. Você pode usar qualquer utilitário de cópia ou arquivamento adequado, incluindo **cp**, **tar** ou **WinZip**. Por exemplo, assumindo que o diretório de dados está localizado sob o diretório atual, você pode arquivar todo o diretório da seguinte forma:

   ```sql
   $> tar cf /tmp/dbbackup.tar ./data
   ```

3. Reinicie o servidor MySQL. Sob Unix:

   ```sql
   $> mysqld_safe &
   ```

   No Windows:

   ```sql
   C:\> "C:\Program Files\MySQL\MySQL Server 5.7\bin\mysqld"
   ```

Normalmente, você deve fazer backup de todo o diretório de dados do servidor MySQL replica. Se você quiser ser capaz de restaurar os dados e operar como uma replica (por exemplo, em caso de falha da replica), além dos dados da replica, você também deve fazer backup dos arquivos de status da replica, dos repositórios de metadados de replicação e dos arquivos de log de retransmissão. Esses arquivos são necessários para retomar a replicação após restaurar os dados da replica.

Se você perder os registros do repositório, mas ainda tiver o arquivo `relay-log.info`, você pode verificá-lo para determinar até que ponto o thread de replicação SQL foi executado nos logs binários da fonte. Em seguida, você pode usar `CHANGE MASTER TO` com as opções `MASTER_LOG_FILE` e `MASTER_LOG_POS` para dizer à replica para reler os logs binários a partir desse ponto. Isso exige que os logs binários ainda existam no servidor fonte.

Se sua replica estiver replicando as instruções `LOAD DATA`, você também deve fazer backup de quaisquer arquivos `SQL_LOAD-*` que existam no diretório que a replica usa para esse propósito. A replica precisa desses arquivos para retomar a replicação de quaisquer operações de `LOAD DATA` interrompidas. A localização desse diretório é o valor da variável de sistema `slave_load_tmpdir`. Se o servidor não foi iniciado com essa variável definida, a localização do diretório é o valor da variável de sistema `tmpdir`.
