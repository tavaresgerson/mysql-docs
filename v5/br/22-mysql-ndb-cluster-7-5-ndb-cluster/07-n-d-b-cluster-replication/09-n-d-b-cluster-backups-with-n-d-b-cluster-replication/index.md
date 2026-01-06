### 21.7.9 Resgate de clusters NDB Com a Replicação do NDB Cluster

21.7.9.1 Replicação de NDB Cluster: Automatização da Sincronização da Replicação com o Log Binário de Fonte

21.7.9.2 Recuperação no Ponto de Tempo Usando a Replicação do NDB Cluster

Esta seção discute a criação de backups e a restauração a partir deles usando a replicação do NDB Cluster. Suponhamos que os servidores de replicação já tenham sido configurados como mencionado anteriormente (veja Seção 21.7.5, “Preparando o NDB Cluster para Replicação” e as seções imediatamente seguintes). Após isso, o procedimento para criar um backup e, em seguida, restaurá-lo é o seguinte:

1. Existem dois métodos diferentes pelos quais o backup pode ser iniciado.

   - **Método A.** Este método exige que o processo de backup do cluster tenha sido habilitado anteriormente no servidor de origem, antes de iniciar o processo de replicação. Isso pode ser feito incluindo a seguinte linha em uma seção `[mysql_cluster]` no arquivo `my.cnf`, onde *`management_host`* é o endereço IP ou nome de host do servidor de gerenciamento do `NDB` do cluster de origem, e *`port`* é o número da porta do servidor de gerenciamento:

     ```sql
     ndb-connectstring=management_host[:port]
     ```

     Nota

     O número do porto precisa ser especificado apenas se a porta padrão (1186) não estiver sendo usada. Consulte Seção 21.3.3, “Configuração Inicial do NDB Cluster” para obter mais informações sobre portas e alocação de portas no NDB Cluster.

     Nesse caso, o backup pode ser iniciado executando essa instrução na fonte de replicação:

     ```sql
     shellS> ndb_mgm -e "START BACKUP"
     ```

   - **Método B.** Se o arquivo `my.cnf` não especificar onde encontrar o host de gerenciamento, você pode iniciar o processo de backup passando essas informações ao cliente de gerenciamento do `NDB` como parte do comando `START BACKUP`. Isso pode ser feito conforme mostrado aqui, onde *`management_host`* e *`port`* são o nome do host e o número da porta do servidor de gerenciamento:

     ```sql
     shellS> ndb_mgm management_host:port -e "START BACKUP"
     ```

     No nosso cenário descrito anteriormente (veja Seção 21.7.5, “Preparando o NDB Cluster para Replicação”), isso seria executado da seguinte forma:

     ```sql
     shellS> ndb_mgm rep-source:1186 -e "START BACKUP"
     ```

2. Copie os arquivos de backup do clúster para a réplica que está sendo colocada em linha. Cada sistema que executa um processo **ndbd** para o clúster de origem tem arquivos de backup do clúster localizados nele, e *todos* desses arquivos devem ser copiados para a réplica para garantir um restabelecimento bem-sucedido. Os arquivos de backup podem ser copiados para qualquer diretório no computador onde o host de gerenciamento da réplica reside, desde que os binários MySQL e NDB tenham permissões de leitura nesse diretório. Neste caso, assumimos que esses arquivos foram copiados para o diretório `/var/BACKUPS/BACKUP-1`.

   Embora não seja necessário que o clúster de replica tenha o mesmo número de processos **ndbd** (nós de dados) que o da fonte, é altamente recomendável que esse número seja o mesmo. É *necessário* que a replica seja iniciada com a opção `--skip-slave-start`, para evitar o início prematuro do processo de replicação.

3. Crie quaisquer bancos de dados no clúster de replica que estejam presentes no clúster de origem e que devam ser replicados.

   Importante

   Uma instrução `CREATE DATABASE` (ou `CREATE SCHEMA`) correspondente a cada banco de dados a ser replicado deve ser executada em cada nó SQL do clúster de replicação.

4. Reinicie o cluster de replicação usando esta declaração no cliente **mysql**:

   ```sql
   mysqlR> RESET SLAVE;
   ```

5. Agora você pode iniciar o processo de restauração do clúster na replica usando o comando **ndb\_restore** para cada arquivo de backup, uma a uma. Para o primeiro deles, é necessário incluir a opção `-m` para restaurar os metadados do clúster, conforme mostrado aqui:

   ```sql
   shellR> ndb_restore -c replica_host:port -n node-id \
           -b backup-id -m -r dir
   ```

   *`dir`* é o caminho para o diretório onde os arquivos de backup foram colocados na replica. Para os comandos **ndb\_restore** correspondentes aos arquivos de backup restantes, a opção `-m` *não* deve ser usada.

   Para restaurar a partir de um cluster de origem com quatro nós de dados (como mostrado na figura na Seção 21.7, “Replicação de Clusters NDB”), onde os arquivos de backup foram copiados para o diretório `/var/BACKUP/BACKUP-1`, a sequência correta de comandos a serem executados na replica pode parecer assim:

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

   A opção `-e` (ou `--restore-epoch` em mysql-cluster-programs-ndb-restore.html#option\_ndb\_restore\_restore-epoch) na invocação final do **ndb\_restore** neste exemplo é necessária para garantir que o epígrafe seja escrito na tabela `mysql.ndb_apply_status` da replica. Sem essa informação, a replica não pode se sincronizar corretamente com a fonte. (Veja Seção 21.5.24, “ndb\_restore — Restaurar um backup do NDB Cluster”).

6. Agora, você precisa obter a época mais recente da tabela `ndb_apply_status` na replica (como discutido em Seção 21.7.8, “Implementando Failover com Replicação de NDB Cluster”):

   ```sql
   mysqlR> SELECT @latest:=MAX(epoch)
           FROM mysql.ndb_apply_status;
   ```

7. Usando `@latest` como o valor da época obtido no passo anterior, você pode obter a posição inicial correta `@pos` no arquivo de log binário correto `@file` a partir da tabela `mysql.ndb_binlog_index` na fonte. A consulta mostrada aqui obtém esses valores das colunas `next_position` e `next_file` da última época aplicada antes da posição de restauração lógica:

   ```sql
   mysqlS> SELECT
        ->     @file:=SUBSTRING_INDEX(next_file, '/', -1),
        ->     @pos:=next_position
        -> FROM mysql.ndb_binlog_index
        -> WHERE epoch > @latest
        -> ORDER BY epoch ASC LIMIT 1;
   ```

   Caso atualmente não haja tráfego de replicação, você pode obter informações semelhantes executando `SHOW MASTER STATUS` na fonte e usando o valor exibido na coluna `Position` do resultado para o arquivo cujo nome tem o sufixo com o maior valor para todos os arquivos exibidos na coluna `File`. Nesse caso, você deve determinar qual é esse arquivo e fornecer o nome no próximo passo manualmente ou analisando o resultado com um script.

8. Usando os valores obtidos na etapa anterior, você pode agora emitir a declaração apropriada `CHANGE MASTER TO` no cliente **mysql** da replica:

   ```sql
   mysqlR> CHANGE MASTER TO
        ->     MASTER_LOG_FILE='@file',
        ->     MASTER_LOG_POS=@pos;
   ```

9. Agora que a replica sabe a partir de qual ponto do arquivo de log binário começar a ler os dados da fonte, você pode fazer com que a replica comece a replicar com essa declaração:

   ```sql
   mysqlR> START SLAVE;
   ```

Para realizar uma cópia de segurança e restauração em um segundo canal de replicação, é necessário apenas repetir esses passos, substituindo os nomes de host e IDs da fonte secundária e da replica pelos dos servidores de fonte primária e replica, conforme apropriado, e executando as declarações anteriores neles.

Para obter informações adicionais sobre como realizar backups de cluster e restaurar o cluster a partir de backups, consulte Seção 21.6.8, “Backup Online do NDB Cluster”.
