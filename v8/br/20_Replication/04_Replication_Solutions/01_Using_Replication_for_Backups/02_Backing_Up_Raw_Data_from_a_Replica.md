#### 19.4.1.2 Fazer backup de dados brutos de uma réplica

Para garantir a integridade dos arquivos copiados, a cópia dos arquivos de dados brutos no seu servidor replica do MySQL deve ser realizada enquanto o servidor replica estiver desligado. Se o servidor MySQL ainda estiver em execução, as tarefas em segundo plano podem continuar atualizando os arquivos do banco de dados, especialmente aqueles que envolvem motores de armazenamento com processos em segundo plano, como `InnoDB`. Com `InnoDB`, esses problemas devem ser resolvidos durante a recuperação após falhas, mas, como o servidor replica pode ser desligado durante o processo de backup sem afetar a execução da fonte, faz sentido aproveitar essa capacidade.

Para desligar o servidor e fazer backup dos arquivos:

1. Desligue o servidor MySQL replica:

   ```
   $> mysqladmin shutdown
   ```

2. Copie os arquivos de dados. Você pode usar qualquer utilitário de cópia ou arquivamento adequado, incluindo **cp**, **tar** ou **WinZip**. Por exemplo, assumindo que o diretório de dados está localizado sob o diretório atual, você pode arquivar todo o diretório da seguinte forma:

   ```
   $> tar cf /tmp/dbbackup.tar ./data
   ```

3. Reinicie o servidor MySQL. Sob Unix:

   ```
   $> mysqld_safe &
   ```

   No Windows:

   ```
   C:\> "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld"
   ```

Normalmente, você deve fazer backup de todo o diretório de dados do servidor MySQL replica. Se você quiser ser capaz de restaurar os dados e operar como uma replica (por exemplo, em caso de falha da replica), além dos dados, você precisa ter o repositório de metadados de conexão da replica e o repositório de metadados do aplicador, além dos arquivos de log de relevo. Esses itens são necessários para retomar a replicação após restaurar os dados da replica. Supondo que as tabelas tenham sido usadas para o repositório de metadados de conexão da replica e o repositório de metadados do aplicador (veja a Seção 19.2.4, “Repositórios de Log de Relevo e Metadados de Replicação”), o que é o padrão no MySQL 8.0, essas tabelas são feitas backup juntamente com o diretório de dados. Se os arquivos tiverem sido usados para os repositórios, o que é desaconselhável, você deve fazer backup desses arquivos separadamente. Os arquivos de log de relevo devem ser feitos backup separadamente se tiverem sido colocados em um local diferente do diretório de dados.

Se você perder os registros do retransmissor, mas ainda tiver o arquivo `relay-log.info`, você pode verificá-lo para determinar até onde o thread de replicação SQL foi executado nos logs binários da fonte. Em seguida, você pode usar a instrução `CHANGE REPLICATION SOURCE TO` (a partir do MySQL 8.0.23) ou a instrução `CHANGE MASTER TO` (antes do MySQL 8.0.23) com as opções `SOURCE_LOG_FILE` | `MASTER_LOG_FILE` e `SOURCE_LOG_POS` | `MASTER_LOG_POS` para dizer à replica que leia novamente os logs binários a partir desse ponto. Isso exige que os logs binários ainda existam no servidor de origem.

Se sua replica estiver replicando declarações `LOAD DATA`, você também deve fazer backup de quaisquer arquivos `SQL_LOAD-*` que existam no diretório que a replica usa para esse propósito. A replica precisa desses arquivos para retomar a replicação de quaisquer operações `LOAD DATA` interrompidas. A localização desse diretório é o valor da variável de sistema `replica_load_tmpdir` (a partir do MySQL 8.0.26) ou `slave_load_tmpdir` (antes do MySQL 8.0.26). Se o servidor não foi iniciado com essa variável definida, a localização do diretório é o valor da variável de sistema `tmpdir`.
