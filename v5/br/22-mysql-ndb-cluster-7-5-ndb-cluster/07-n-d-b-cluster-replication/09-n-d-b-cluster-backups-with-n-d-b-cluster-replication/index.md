### 21.7.9 Backups do NDB Cluster com Replication do NDB Cluster

[21.7.9.1 NDB Cluster Replication: Automatizando a Sincronização da Replica com o Binary Log da Source](mysql-cluster-replication-auto-sync.html)

[21.7.9.2 Point-In-Time Recovery Usando NDB Cluster Replication](mysql-cluster-replication-pitr.html)

Esta seção discute como fazer Backups e restaurá-los usando o NDB Cluster Replication. Presumimos que os servidores de Replication já foram configurados conforme abordado anteriormente (consulte [Seção 21.7.5, “Preparando o NDB Cluster para Replication”](mysql-cluster-replication-preparation.html "21.7.5 Preparing the NDB Cluster for Replication"), e as seções imediatamente seguintes). Tendo isso sido feito, o procedimento para fazer um Backup e restaurá-lo é o seguinte:

1. Existem dois métodos diferentes pelos quais o Backup pode ser iniciado.

   * **Método A.** Este método exige que o processo de Backup do Cluster tenha sido previamente habilitado no servidor Source, antes de iniciar o processo de Replication. Isso pode ser feito incluindo a seguinte linha em uma seção `[mysql_cluster]` no arquivo `my.cnf`, onde *`management_host`* é o endereço IP ou nome do host do servidor de Management [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") para o Cluster Source, e *`port`* é o número da porta do servidor de Management:

     ```sql
     ndb-connectstring=management_host[:port]
     ```

     Nota

     O número da porta precisa ser especificado apenas se a porta padrão (1186) não estiver sendo usada. Consulte [Seção 21.3.3, “Configuração Inicial do NDB Cluster”](mysql-cluster-install-configuration.html "21.3.3 Initial Configuration of NDB Cluster"), para obter mais informações sobre portas e alocação de portas no NDB Cluster.

     Neste caso, o Backup pode ser iniciado executando esta instrução na Source de Replication:

     ```sql
     shellS> ndb_mgm -e "START BACKUP"
     ```

   * **Método B.** Se o arquivo `my.cnf` não especificar onde encontrar o Management host, você pode iniciar o processo de Backup passando esta informação para o Management Client [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") como parte do comando [`START BACKUP`](mysql-cluster-backup-using-management-client.html "21.6.8.2 Using The NDB Cluster Management Client to Create a Backup"). Isso pode ser feito conforme mostrado aqui, onde *`management_host`* e *`port`* são o nome do host e o número da porta do servidor de Management:

     ```sql
     shellS> ndb_mgm management_host:port -e "START BACKUP"
     ```

     Em nosso cenário, conforme descrito anteriormente (consulte [Seção 21.7.5, “Preparando o NDB Cluster para Replication”](mysql-cluster-replication-preparation.html "21.7.5 Preparing the NDB Cluster for Replication")), isso seria executado da seguinte forma:

     ```sql
     shellS> ndb_mgm rep-source:1186 -e "START BACKUP"
     ```

2. Copie os arquivos de Backup do Cluster para a Replica que está sendo colocada online. Cada sistema executando um processo [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon") para o Cluster Source contém arquivos de Backup do Cluster, e *todos* esses arquivos devem ser copiados para a Replica para garantir um Restore bem-sucedido. Os arquivos de Backup podem ser copiados para qualquer diretório no computador onde o Management host da Replica reside, desde que os binários MySQL e NDB tenham permissões de leitura nesse diretório. Neste caso, assumimos que esses arquivos foram copiados para o diretório `/var/BACKUPS/BACKUP-1`.

   Embora não seja necessário que o Cluster Replica tenha o mesmo número de processos [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon") (Data nodes) que a Source, é altamente recomendável que este número seja o mesmo. *É* necessário que a Replica seja iniciada com a opção [`--skip-slave-start`](replication-options-replica.html#option_mysqld_skip-slave-start), para evitar a inicialização prematura do processo de Replication.

3. Crie quaisquer Databases no Cluster Replica que estejam presentes no Cluster Source e que devem ser replicados.

   Importante

   Uma instrução [`CREATE DATABASE`](create-database.html "13.1.11 CREATE DATABASE Statement") (ou [`CREATE SCHEMA`](create-database.html "13.1.11 CREATE DATABASE Statement")) correspondente a cada Database a ser replicado deve ser executada em cada SQL node no Cluster Replica.

4. Reinicie o Cluster Replica usando esta instrução no cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"):

   ```sql
   mysqlR> RESET SLAVE;
   ```

5. Agora você pode iniciar o processo de Restore do Cluster na Replica usando o comando [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") para cada arquivo de Backup, um por vez. Para o primeiro, é necessário incluir a opção `-m` para restaurar o Cluster Metadata, conforme mostrado aqui:

   ```sql
   shellR> ndb_restore -c replica_host:port -n node-id \
           -b backup-id -m -r dir
   ```

   *`dir`* é o caminho para o diretório onde os arquivos de Backup foram colocados na Replica. Para os comandos [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") correspondentes aos arquivos de Backup restantes, a opção `-m` *não* deve ser usada.

   Para restaurar de um Cluster Source com quatro Data nodes (conforme mostrado na figura em [Seção 21.7, “NDB Cluster Replication”](mysql-cluster-replication.html "21.7 NDB Cluster Replication")) onde os arquivos de Backup foram copiados para o diretório `/var/BACKUPS/BACKUP-1`, a sequência correta de comandos a ser executada na Replica pode ser semelhante a esta:

   ```sql
   shellR> ndb_restore -c replica-host:1186 -n 2 -b 1 -m \
           -r ./var/BACKUPS/BACKUP-1
   shellR> ndb_restore -c replica-host:1186 -n 3 -b 1 \
           -r ./var/BACKUPS/BACKUP-1
   shellR> ndb_restore -c replica-host:1186 -n 4 -b 1 \
           -r ./var/BACKUPS/BACKUP-1
   shellR> ndb_restore -c replica-host:1186 -n 5 -b 1 -e \
           -r ./var/BACKUPS/BACKUP-1
   ```

   Importante

   A opção `-e` (ou [`--restore-epoch`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_restore-epoch)) na invocação final de [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") neste exemplo é necessária para garantir que o Epoch seja escrito na tabela `mysql.ndb_apply_status` da Replica. Sem esta informação, a Replica não pode sincronizar corretamente com a Source. (Consulte [Seção 21.5.24, “ndb_restore — Restore de um NDB Cluster Backup”](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup").)

6. Agora você precisa obter o Epoch mais recente da tabela `ndb_apply_status` na Replica (conforme discutido em [Seção 21.7.8, “Implementando Failover com NDB Cluster Replication”](mysql-cluster-replication-failover.html "21.7.8 Implementing Failover with NDB Cluster Replication")):

   ```sql
   mysqlR> SELECT @latest:=MAX(epoch)
           FROM mysql.ndb_apply_status;
   ```

7. Usando `@latest` como o valor de Epoch obtido na etapa anterior, você pode obter a posição de início correta `@pos` no Binary Log file correto `@file` da tabela `mysql.ndb_binlog_index` na Source. A Query mostrada aqui obtém estes valores das colunas `next_position` e `next_file` do último Epoch aplicado antes da posição de Restore lógica:

   ```sql
   mysqlS> SELECT
        ->     @file:=SUBSTRING_INDEX(next_file, '/', -1),
        ->     @pos:=next_position
        -> FROM mysql.ndb_binlog_index
        -> WHERE epoch > @latest
        -> ORDER BY epoch ASC LIMIT 1;
   ```

   Caso não haja tráfego de Replication no momento, você pode obter informações semelhantes executando [`SHOW MASTER STATUS`](show-master-status.html "13.7.5.23 SHOW MASTER STATUS Statement") na Source e usando o valor mostrado na coluna `Position` da saída para o arquivo cujo nome tem o sufixo com o maior valor para todos os arquivos mostrados na coluna `File`. Neste caso, você deve determinar qual arquivo é este e fornecer o nome na próxima etapa manualmente ou analisando a saída com um script.

8. Usando os valores obtidos na etapa anterior, agora você pode emitir a instrução [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") apropriada no cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") da Replica:

   ```sql
   mysqlR> CHANGE MASTER TO
        ->     MASTER_LOG_FILE='@file',
        ->     MASTER_LOG_POS=@pos;
   ```

9. Agora que a Replica sabe a partir de qual ponto e em qual Binary Log file começar a ler os dados da Source, você pode fazer com que a Replica comece a replicar com esta instrução:

   ```sql
   mysqlR> START SLAVE;
   ```

Para realizar um Backup e Restore em um segundo canal de Replication, é necessário apenas repetir estas etapas, substituindo os nomes de host e IDs da Source e Replica secundárias pelos da Source e Replica primárias onde for apropriado, e executando as instruções precedentes nelas.

Para obter informações adicionais sobre como realizar Backups de Cluster e restaurar o Cluster a partir de Backups, consulte [Seção 21.6.8, “Online Backup do NDB Cluster”](mysql-cluster-backup.html "21.6.8 Online Backup of NDB Cluster").
