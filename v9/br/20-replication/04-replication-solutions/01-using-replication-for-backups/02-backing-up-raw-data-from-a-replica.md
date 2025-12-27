#### 19.4.1.2 Fazer backup de dados brutos de uma réplica

Para garantir a integridade dos arquivos copiados, o backup dos arquivos de dados brutos na sua réplica MySQL deve ser feito enquanto o servidor da réplica estiver desligado. Se o servidor MySQL ainda estiver em execução, as tarefas em segundo plano podem estar atualizando os arquivos do banco de dados, especialmente aqueles que envolvem motores de armazenamento com processos em segundo plano, como o `InnoDB`. Com o `InnoDB`, esses problemas devem ser resolvidos durante a recuperação de falhas, mas como o servidor da réplica pode ser desligado durante o processo de backup sem afetar a execução da fonte, faz sentido aproveitar essa capacidade.

Para desligar o servidor e fazer o backup dos arquivos:

1. Desligue o servidor MySQL da réplica:

   ```
   $> mysqladmin shutdown
   ```

2. Copie os arquivos de dados. Você pode usar qualquer utilitário de cópia ou arquivamento adequado, incluindo **cp**, **tar** ou **WinZip**. Por exemplo, assumindo que o diretório de dados está localizado sob o diretório atual, você pode arquivar todo o diretório da seguinte forma:

   ```
   $> tar cf /tmp/dbbackup.tar ./data
   ```

3. Inicie o servidor MySQL novamente. Sob Unix:

   ```
   $> mysqld_safe &
   ```

   Sob Windows:

   ```
   C:\> "C:\Program Files\MySQL\MySQL Server 9.5\bin\mysqld"
   ```

Normalmente, você deve fazer backup do diretório de dados inteiro do servidor MySQL replica. Se você quiser ser capaz de restaurar os dados e operar como uma replica (por exemplo, em caso de falha da replica), além dos dados, você precisa ter o repositório de metadados de conexão da replica e o repositório de metadados do aplicador, além dos arquivos de log de relevo. Esses itens são necessários para retomar a replicação após restaurar os dados da replica. Supondo que as tabelas tenham sido usadas para o repositório de metadados de conexão da replica e o repositório de metadados do aplicador (veja a Seção 19.2.4, “Repositórios de Log de Relevo e Metadados de Replicação”), o que é o padrão no MySQL 9.5, essas tabelas são feitas backup junto com o diretório de dados. Se os arquivos tiverem sido usados para os repositórios, o que é desaconselhável, você deve fazer backup desses arquivos separadamente. Os arquivos de log de relevo devem ser feitos backup separadamente se tiverem sido colocados em um local diferente do diretório de dados.

Se você perder os logs de relevo, mas ainda tiver o arquivo `relay-log.info`, você pode verificá-lo para determinar até que ponto o thread SQL de replicação foi executado nos logs binários da fonte. Então, você pode usar `CHANGE REPLICATION SOURCE TO` com as opções `SOURCE_LOG_FILE` e `SOURCE_LOG_POS` para dizer à replica para reler os logs binários a partir desse ponto. Isso requer que os logs binários ainda existam no servidor fonte.

Se sua réplica estiver replicando instruções `LOAD DATA`, você também deve fazer backup de quaisquer arquivos `SQL_LOAD-*` que existam no diretório que a réplica usa para esse propósito. A réplica precisa desses arquivos para retomar a replicação de quaisquer operações `LOAD DATA` interrompidas. A localização desse diretório é o valor da variável de sistema `replica_load_tmpdir`. Se o servidor não foi iniciado com essa variável definida, a localização do diretório é o valor da variável de sistema `tmpdir`.