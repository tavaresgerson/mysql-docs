### 25.7.9 Resumos de Backups do NDB Cluster com a Replicação do NDB Cluster

25.7.9.1 Replicação do NDB Cluster: Automatização da Sincronização da Replicação com o Log Binário de Fonte

25.7.9.2 Recuperação em Ponto no Tempo Usando a Replicação do NDB Cluster

Esta seção discute a realização de backups e a restauração a partir deles usando a replicação do NDB Cluster. Assumemos que os servidores de replicação já foram configurados como mencionado anteriormente (veja a Seção 25.7.5, “Preparando o NDB Cluster para Replicação”, e as seções imediatamente seguintes). Após isso, o procedimento para realizar um backup e, em seguida, restaurá-lo é o seguinte:

1. Existem dois métodos diferentes pelos quais o backup pode ser iniciado.

   * **Método A.** Este método exige que o processo de backup do cluster tenha sido habilitado previamente no servidor de origem, antes de iniciar o processo de replicação. Isso pode ser feito incluindo a seguinte linha em uma seção `[mysql_cluster]` no arquivo `my.cnf`, onde *`management_host`* é o endereço IP ou nome de host do servidor de gerenciamento `NDB` do cluster de origem, e *`port`* é o número de porta do servidor de gerenciamento:

     ```
     ndb-connectstring=management_host[:port]
     ```

     Nota

     O número de porta precisa ser especificado apenas se a porta padrão (1186) não estiver sendo usada. Consulte a Seção 25.3.3, “Configuração Inicial do NDB Cluster”, para mais informações sobre portas e alocação de portas no NDB Cluster.

     Neste caso, o backup pode ser iniciado executando esta declaração na fonte de replicação:

     ```
     shellS> ndb_mgm -e "START BACKUP"
     ```

* **Método B.** Se o arquivo `my.cnf` não especificar onde encontrar o host de gerenciamento, você pode iniciar o processo de backup passando essas informações ao cliente de gerenciamento `NDB` como parte do comando `START BACKUP`. Isso pode ser feito conforme mostrado aqui, onde *`management_host`* e *`port`* são o nome do host e o número de porta do servidor de gerenciamento:

     ```
     shellS> ndb_mgm management_host:port -e "START BACKUP"
     ```

     No nosso cenário descrito anteriormente (veja a Seção 25.7.5, “Preparando o Clúster NDB para Replicação”), isso seria executado da seguinte forma:

     ```
     shellS> ndb_mgm rep-source:1186 -e "START BACKUP"
     ```

2. Copie os arquivos de backup do clúster para a replica que está sendo colocada em linha. Cada sistema que executa um processo **ndbd** para o clúster de origem tem arquivos de backup do clúster localizados nele, e *todos* desses arquivos devem ser copiados para a replica para garantir uma restauração bem-sucedida. Os arquivos de backup podem ser copiados para qualquer diretório no computador onde o host de gerenciamento da replica reside, desde que os binários MySQL e NDB tenham permissões de leitura nesse diretório. Neste caso, assumimos que esses arquivos foram copiados para o diretório `/var/BACKUPS/BACKUP-1`.

   Embora não seja necessário que o clúster de replica tenha o mesmo número de nós de dados que o clúster de origem, é altamente recomendável que esse número seja o mesmo. É necessário que o processo de replicação seja impedido de iniciar quando o servidor de replica for iniciado. Você pode fazer isso iniciando a replica com `--skip-replica-start`.

3. Crie quaisquer bancos de dados no clúster de replica que estejam presentes no clúster de origem e que devam ser replicados.

   Importante

   Uma declaração `CREATE DATABASE` (ou `CREATE SCHEMA`) correspondente a cada banco de dados a ser replicado deve ser executada em cada nó SQL no clúster de replica.

4. Resete o cluster replica usando esta declaração no cliente **mysql**:

   ```
   mysqlR> RESET REPLICA;
   ```

5. Agora você pode iniciar o processo de restauração do cluster na replica usando o comando **ndb_restore** para cada arquivo de backup, uma a uma. Para o primeiro deles, é necessário incluir a opção `-m` para restaurar os metadados do cluster, como mostrado aqui:

   ```
   shellR> ndb_restore -c replica_host:port -n node-id \
           -b backup-id -m -r dir
   ```

   *`dir`* é o caminho para o diretório onde os arquivos de backup foram colocados na replica. Para os comandos **ndb_restore** correspondentes aos arquivos de backup restantes, a opção `-m` *não* deve ser usada.

   Para restaurar de um cluster fonte com quatro nós de dados (como mostrado na figura na Seção 25.7, “Replicação de Clusters NDB”) onde os arquivos de backup foram copiados para o diretório `/var/BACKUPS/BACKUP-1`, a sequência correta de comandos a serem executados na replica pode parecer assim:

   ```
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

   A opção `-e` (ou `--restore-epoch`) na invocação final de **ndb_restore** neste exemplo é necessária para garantir que o epígrafe seja escrito na tabela `mysql.ndb_apply_status` da replica. Sem essa informação, a replica não pode se sincronizar corretamente com a fonte. (Veja a Seção 25.5.23, “ndb_restore — Restaurar um Backup de Cluster NDB”).

6. Agora você precisa obter o epígrafe mais recente da tabela `ndb_apply_status` na replica (como discutido na Seção 25.7.8, “Implementando Failover com Replicação de Clusters NDB”):

   ```
   mysqlR> SELECT @latest:=MAX(epoch)
           FROM mysql.ndb_apply_status;
   ```

7. Usando `@latest` como o valor da época obtido no passo anterior, você pode obter a posição inicial correta `@pos` no arquivo de log binário correto `@file` da tabela `mysql.ndb_binlog_index` na fonte. A consulta mostrada aqui obtém essas informações das colunas `Position` e `File` da última época aplicada antes da posição de restauração lógica:

   ```
   mysqlS> SELECT
        ->     @file:=SUBSTRING_INDEX(File, '/', -1),
        ->     @pos:=Position
        -> FROM mysql.ndb_binlog_index
        -> WHERE epoch > @latest
        -> ORDER BY epoch ASC LIMIT 1;
   ```

   No caso de não haver tráfego de replicação atualmente, você pode obter informações semelhantes executando `SHOW BINARY LOG STATUS` na fonte e usando o valor mostrado na coluna `Position` do resultado para o arquivo cujo nome tem o sufixo com o maior valor para todos os arquivos mostrados na coluna `File`. Neste caso, você deve determinar qual é esse arquivo e fornecer o nome no próximo passo manualmente ou analisando o resultado com um script.

8. Usando os valores obtidos no passo anterior, você agora pode emitir a instrução apropriada no cliente **mysql** da replica. Use a seguinte instrução `CHANGE REPLICATION SOURCE TO`:

   ```
   mysqlR> CHANGE REPLICATION SOURCE TO
        ->     SOURCE_LOG_FILE='@file',
        ->     SOURCE_LOG_POS=@pos;
   ```

9. Agora que a replica sabe a partir de que ponto no arquivo de log binário começar a ler dados da fonte, você pode fazer com que a replica comece a replicar com essa instrução:

   ```
   mysqlR> START REPLICA;
   ```

Para realizar um backup e restauração em um segundo canal de replicação, é necessário apenas repetir esses passos, substituindo os nomes de host e IDs da fonte secundária e replica pelaqueles dos servidores de fonte e replica primários, conforme apropriado, e executando as instruções anteriores neles.

Para obter informações adicionais sobre como realizar backups de cluster e restaurar o cluster a partir de backups, consulte a Seção 25.6.8, “Backup Online do NDB Cluster”.