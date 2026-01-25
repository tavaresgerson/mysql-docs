#### 21.5.24.2 Restaurando para um número diferente de data nodes

É possível restaurar de um Backup NDB para um Cluster que tenha um número diferente de Data Nodes do que o original do qual o Backup foi tirado. As duas seções a seguir discutem, respectivamente, os casos em que o Cluster de destino tem um número menor ou maior de Data Nodes do que a origem do Backup.

##### 21.5.24.2.1 Restaurando para Menos Nodes do que o Original

Você pode restaurar para um Cluster com menos Data Nodes do que o original, desde que o número maior de Nodes seja um múltiplo par do número menor. No exemplo a seguir, usamos um Backup tirado em um Cluster com quatro Data Nodes para um Cluster com dois Data Nodes.

1. O Management Server para o Cluster original está no host `host10`. O Cluster original tem quatro Data Nodes, com os Node IDs e nomes de host mostrados no seguinte trecho do arquivo `config.ini` do Management Server:

   ```sql
   [ndbd]
   NodeId=2
   HostName=host2

   [ndbd]
   NodeId=4
   HostName=host4

   [ndbd]
   NodeId=6
   HostName=host6

   [ndbd]
   NodeId=8
   HostName=host8
   ```

   Assumimos que cada Data Node foi iniciado originalmente com [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)") [`--ndb-connectstring=host10`](mysql-cluster-programs-ndbd.html#option_ndbd_ndb-connectstring) ou o equivalente.

2. Realize um Backup da maneira normal. Consulte [Seção 21.6.8.2, “Usando O Cliente de Gerenciamento do NDB Cluster para Criar um Backup”](mysql-cluster-backup-using-management-client.html "21.6.8.2 Using The NDB Cluster Management Client to Create a Backup"), para obter informações sobre como fazer isso.

3. Os arquivos criados pelo Backup em cada Data Node estão listados aqui, onde *`N`* é o Node ID e *`B`* é o Backup ID.

   * `BACKUP-B-0.N.Data`
   * `BACKUP-B.N.ctl`
   * `BACKUP-B.N.log`

   Esses arquivos são encontrados em [`BackupDataDir`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-backupdatadir)`/BACKUP/BACKUP-B`, em cada Data Node. Para o restante deste exemplo, assumimos que o Backup ID é 1.

   Mantenha todos esses arquivos disponíveis para posterior cópia para os novos Data Nodes (onde podem ser acessados no sistema de arquivos local do Data Node por [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup")). É mais simples copiar todos eles para um único local; assumimos que foi isso que você fez.

4. O Management Server para o Cluster de destino está no host `host20`, e o destino tem dois Data Nodes, com os Node IDs e nomes de host mostrados, a partir do arquivo `config.ini` do Management Server em `host20`:

   ```sql
   [ndbd]
   NodeId=3
   hostname=host3

   [ndbd]
   NodeId=5
   hostname=host5
   ```

   Cada um dos processos do Data Node em `host3` e `host5` deve ser iniciado com [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)") `-c host20` [`--initial`](mysql-cluster-programs-ndbd.html#option_ndbd_initial) ou o equivalente, para que o novo Cluster (de destino) comece com sistemas de arquivos de Data Node limpos.

5. Copie dois conjuntos diferentes de dois arquivos de Backup para cada um dos Data Nodes de destino. Para este exemplo, copie os arquivos de Backup dos Nodes 2 e 4 do Cluster original para o Node 3 no Cluster de destino. Estes arquivos estão listados aqui:

   * `BACKUP-1-0.2.Data`
   * `BACKUP-1.2.ctl`
   * `BACKUP-1.2.log`
   * `BACKUP-1-0.4.Data`
   * `BACKUP-1.4.ctl`
   * `BACKUP-1.4.log`

   Em seguida, copie os arquivos de Backup dos Nodes 6 e 8 para o Node 5; estes arquivos são mostrados na seguinte lista:

   * `BACKUP-1-0.6.Data`
   * `BACKUP-1.6.ctl`
   * `BACKUP-1.6.log`
   * `BACKUP-1-0.8.Data`
   * `BACKUP-1.8.ctl`
   * `BACKUP-1.8.log`

   Para o restante deste exemplo, assumimos que os respectivos arquivos de Backup foram salvos no diretório `/BACKUP-1` em cada um dos Nodes 3 e 5.

6. Em cada um dos dois Data Nodes de destino, você deve restaurar a partir de ambos os conjuntos de Backups. Primeiro, restaure os Backups dos Nodes 2 e 4 para o Node 3 invocando [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") em `host3` conforme mostrado aqui:

   ```sql
   $> ndb_restore -c host20 --nodeid=2 --backupid=1 --restore-data --backup-path=/BACKUP-1

   $> ndb_restore -c host20 --nodeid=4 --backupid=1 --restore-data --backup-path=/BACKUP-1
   ```

   Em seguida, restaure os Backups dos Nodes 6 e 8 para o Node 5 invocando [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") em `host5`, assim:

   ```sql
   $> ndb_restore -c host20 --nodeid=6 --backupid=1 --restore-data --backup-path=/BACKUP-1

   $> ndb_restore -c host20 --nodeid=8 --backupid=1 --restore-data --backup-path=/BACKUP-1
   ```

##### 21.5.24.2.2 Restaurando para Mais Nodes do que o Original

O Node ID especificado para um dado comando [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") é o do Node no Backup original e não o do Data Node para o qual deve ser restaurado. Ao realizar um Backup usando o método descrito nesta seção, [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") conecta-se ao Management Server e obtém uma lista de Data Nodes no Cluster para o qual o Backup está sendo restaurado. Os dados restaurados são distribuídos de acordo, de modo que o número de Nodes no Cluster de destino não precisa ser conhecido ou calculado ao realizar o Backup.

Note

Ao alterar o número total de LCP Threads ou LQH Threads por grupo de Nodes, você deve recriar o Schema a partir do Backup criado usando [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program").

1. *Crie o Backup dos dados*. Você pode fazer isso invocando o comando `START BACKUP` do cliente [**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client") a partir do shell do sistema, assim:

   ```sql
   $> ndb_mgm -e "START BACKUP 1"
   ```

   Isso assume que o Backup ID desejado é 1.

2. Crie um Backup do Schema. No NDB 7.5.2 e posterior, esta etapa é necessária apenas se o número total de LCP Threads ou LQH Threads por grupo de Nodes for alterado.

   ```sql
   $> mysqldump --no-data --routines --events --triggers --databases > myschema.sql
   ```

   Important

   Depois de ter criado o Backup nativo do `NDB` usando [**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client"), você não deve fazer nenhuma alteração de Schema antes de criar o Backup do Schema, se o fizer.

3. Copie o diretório de Backup para o novo Cluster. Por exemplo, se o Backup que você deseja restaurar tiver ID 1 e `BackupDataDir` = `/backups/node_nodeid`, então o caminho para o Backup neste Node é `/backups/node_1/BACKUP/BACKUP-1`. Dentro deste diretório, existem três arquivos, listados aqui:

   * `BACKUP-1-0.1.Data`
   * `BACKUP-1.1.ctl`
   * `BACKUP-1.1.log`

   Você deve copiar o diretório inteiro para o novo Node.

   Se você precisou criar um arquivo de Schema, copie-o para um local em um SQL Node onde ele possa ser lido por [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server").

Não há exigência de que o Backup seja restaurado a partir de um Node ou Nodes específicos.

Para restaurar a partir do Backup recém-criado, execute as seguintes etapas:

1. *Restaure o Schema*.

   * Se você criou um arquivo de Backup de Schema separado usando [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program"), importe este arquivo usando o cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"), de forma semelhante ao que é mostrado aqui:

     ```sql
     $> mysql < myschema.sql
     ```

     Ao importar o arquivo de Schema, pode ser necessário especificar as opções [`--user`](mysql-command-options.html#option_mysql_user) e [`--password`](mysql-command-options.html#option_mysql_password) (e possivelmente outras) além do que é mostrado, para que o cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") possa se conectar ao MySQL Server.

   * Se você *não* precisou criar um arquivo de Schema, você pode recriá-lo usando [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") [`--restore-meta`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_restore-meta) (forma abreviada `-m`), de forma semelhante ao que é mostrado aqui:

     ```sql
     $> ndb_restore --nodeid=1 --backupid=1 --restore-meta --backup-path=/backups/node_1/BACKUP/BACKUP-1
     ```

     [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") deve ser capaz de contatar o Management Server; adicione a opção [`--ndb-connectstring`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_ndb-connectstring) se e quando necessário para tornar isso possível.

2. *Restaure os dados*. Isso precisa ser feito uma vez para cada Data Node no Cluster original, usando o Node ID desse Data Node a cada vez. Assumindo que havia 4 Data Nodes originalmente, o conjunto de comandos necessários seria algo parecido com isto:

   ```sql
   ndb_restore --nodeid=1 --backupid=1 --restore-data --backup-path=/backups/node_1/BACKUP/BACKUP-1 --disable-indexes
   ndb_restore --nodeid=2 --backupid=1 --restore-data --backup-path=/backups/node_2/BACKUP/BACKUP-1 --disable-indexes
   ndb_restore --nodeid=3 --backupid=1 --restore-data --backup-path=/backups/node_3/BACKUP/BACKUP-1 --disable-indexes
   ndb_restore --nodeid=4 --backupid=1 --restore-data --backup-path=/backups/node_4/BACKUP/BACKUP-1 --disable-indexes
   ```

   Estes podem ser executados em paralelo.

   Certifique-se de adicionar a opção [`--ndb-connectstring`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_ndb-connectstring) conforme necessário.

3. *Reconstrua os Indexes*. Estes foram desabilitados pela opção [`--disable-indexes`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_disable-indexes) usada nos comandos mostrados. A recriação dos Indexes evita erros devido ao fato de o Restore não ser consistente em todos os pontos. A reconstrução dos Indexes também pode melhorar o Performance em alguns casos. Para reconstruir os Indexes, execute o seguinte comando uma vez, em um único Node:

   ```sql
   $> ndb_restore --nodeid=1 --backupid=1 --backup-path=/backups/node_1/BACKUP/BACKUP-1 --rebuild-indexes
   ```

   Conforme mencionado anteriormente, você pode precisar adicionar a opção [`--ndb-connectstring`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_ndb-connectstring), para que [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") possa contatar o Management Server.