#### 21.5.24.2 Restauração para um número diferente de nós de dados

É possível restaurar de um backup do NDB para um clúster com um número diferente de nós de dados em relação ao original a partir do qual o backup foi feito. As duas seções a seguir discutem, respectivamente, os casos em que o clúster de destino tem um número menor ou maior de nós de dados em relação à fonte do backup.

##### 21.5.24.2.1 Restauração com menos nós do que o original

Você pode restaurar para um clúster com menos nós de dados do que o original, desde que o maior número de nós seja um múltiplo par do menor número. No exemplo a seguir, usamos um backup feito em um clúster com quatro nós de dados para um clúster com dois nós de dados.

1. O servidor de gerenciamento do clúster original está no host `host10`. O clúster original tem quatro nós de dados, com os IDs dos nós e os nomes dos hosts mostrados no seguinte extrato do arquivo `config.ini` do servidor de gerenciamento:

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

   Acreditamos que cada nó de dados foi originalmente iniciado com **ndbmtd** `--ndb-connectstring=host10` ou o equivalente.

2. Realize um backup da maneira normal. Consulte Seção 21.6.8.2, “Usando o Cliente de Gerenciamento do NDB Cluster para Criar um Backup” para obter informações sobre como fazer isso.

3. Aqui estão listados os arquivos criados pelo backup em cada nó de dados, onde *`N`* é o ID do nó e *`B`* é o ID do backup.

   - `BACKUP-B-0.N.Data`
   - `BACKUP-B.N.ctl`
   - `BACKUP-B.N.log`

   Esses arquivos são encontrados em `BackupDataDir`/BACKUP/BACKUP-B\`, em cada nó de dados. Para o resto deste exemplo, assumimos que o ID de backup é 1.

   Tenha todos esses arquivos disponíveis para serem copiados posteriormente para os novos nós de dados (onde eles podem ser acessados no sistema de arquivos local do nó de dados por **ndb_restore**). É mais simples copiá-los para um único local; assumimos que você fez isso.

4. O servidor de gerenciamento do clúster de destino está no host `host20`, e o destino tem dois nós de dados, com os IDs dos nós e os nomes dos hosts mostrados, a partir do arquivo `config.ini` do servidor de gerenciamento em `host20`:

   ```sql
   [ndbd]
   NodeId=3
   hostname=host3

   [ndbd]
   NodeId=5
   hostname=host5
   ```

   Cada um dos nós de dados nos hosts `host3` e `host5` deve ser iniciado com **ndbmtd** `-c host20` `--initial` ou o equivalente, para que o novo (alvo) cluster comece com sistemas de arquivos de nó de dados limpos.

5. Copie dois conjuntos diferentes de dois arquivos de backup para cada um dos nós de dados de destino. Para este exemplo, copie os arquivos de backup dos nós 2 e 4 do cluster original para o nó 3 no cluster de destino. Estes arquivos estão listados aqui:

   - `BACKUP-1-0.2.Data`
   - `BACKUP-1.2.ctl`
   - `BACKUP-1.2.log`
   - `BACKUP-1-0.4.Data`
   - `BACKUP-1.4.ctl`
   - `BACKUP-1.4.log`

   Em seguida, copie os arquivos de backup dos nós 6 e 8 para o nó 5; esses arquivos estão listados na lista a seguir:

   - `BACKUP-1-0.6.Data`
   - `BACKUP-1.6.ctl`
   - `BACKUP-1.6.log`
   - `BACKUP-1-0.8.Data`
   - `BACKUP-1.8.ctl`
   - `BACKUP-1.8.log`

   Para o restante deste exemplo, assumimos que os arquivos de backup respectivos foram salvos no diretório `/BACKUP-1` em cada um dos nós 3 e 5.

6. Em cada um dos dois nós de dados de destino, você deve restaurar a partir de ambos os conjuntos de backups. Primeiro, restaure os backups dos nós 2 e 4 para o nó 3, invocando **ndb_restore** no `host3` conforme mostrado aqui:

   ```sql
   $> ndb_restore -c host20 --nodeid=2 --backupid=1 --restore-data --backup-path=/BACKUP-1

   $> ndb_restore -c host20 --nodeid=4 --backupid=1 --restore-data --backup-path=/BACKUP-1
   ```

   Em seguida, restaure os backups dos nós 6 e 8 para o nó 5, invocando **ndb_restore** no `host5`, da seguinte forma:

   ```sql
   $> ndb_restore -c host20 --nodeid=6 --backupid=1 --restore-data --backup-path=/BACKUP-1

   $> ndb_restore -c host20 --nodeid=8 --backupid=1 --restore-data --backup-path=/BACKUP-1
   ```

##### 21.5.24.2.2 Restauração em mais nós do que o original

O ID do nó especificado para um comando **ndb_restore** é o do nó no backup original e não o do nó de dados para o qual ele será restaurado. Ao realizar um backup usando o método descrito nesta seção, o **ndb_restore** se conecta ao servidor de gerenciamento e obtém uma lista dos nós de dados no clúster para o qual o backup está sendo restaurado. Os dados restaurados são distribuídos de acordo, de modo que o número de nós no clúster de destino não precisa ser conhecido ou calculado ao realizar o backup.

Nota

Ao alterar o número total de threads LCP ou threads LQH por grupo de nós, você deve recriar o esquema a partir do backup criado usando **mysqldump**.

1. *Crie o backup dos dados*. Você pode fazer isso invocando o comando **ndb_mgm** do cliente `START BACKUP` no shell do sistema, da seguinte maneira:

   ```sql
   $> ndb_mgm -e "START BACKUP 1"
   ```

   Isso pressupõe que o ID de backup desejado é 1.

2. Crie um backup do esquema. No NDB 7.5.2 e versões posteriores, essa etapa é necessária apenas se o número total de threads LCP ou threads LQH por grupo de nós for alterado.

   ```sql
   $> mysqldump --no-data --routines --events --triggers --databases > myschema.sql
   ```

   Importante

   Depois de criar o backup nativo `NDB` usando **ndb_mgm**, você não deve fazer nenhuma alteração no esquema antes de criar o backup do esquema, caso contrário.

3. Copie o diretório de backup para o novo clúster. Por exemplo, se o backup que você deseja restaurar tiver o ID 1 e `BackupDataDir` = `/backups/node_nodeid`, então o caminho do backup neste nó é `/backups/node_1/BACKUP/BACKUP-1`. Dentro deste diretório, há três arquivos, listados aqui:

   - `BACKUP-1-0.1.Data`
   - `BACKUP-1.1.ctl`
   - `BACKUP-1.1.log`

   Você deve copiar todo o diretório para o novo nó.

   Se você precisasse criar um arquivo de esquema, copie-o para um local em um nó SQL onde ele possa ser lido pelo **mysqld**.

Não há necessidade de restaurar o backup a partir de um ou mais nós específicos.

Para restaurar a partir do backup recém-criado, siga os passos abaixo:

1. *Restaure o esquema*.

   - Se você criou um arquivo de backup de esquema separado usando **mysqldump**, importe este arquivo usando o cliente **mysql**, de forma semelhante ao que está mostrado aqui:

     ```sql
     $> mysql < myschema.sql
     ```

     Ao importar o arquivo do esquema, você pode precisar especificar as opções `--user` e `--password` (e possivelmente outras) além do que está mostrado, para que o cliente **mysql** possa se conectar ao servidor MySQL.

   - Se você não precisasse criar um arquivo de esquema, você pode recriar o esquema usando **ndb_restore** `--restore-meta` (forma abreviada `-m`), semelhante ao que está mostrado aqui:

     ```sql
     $> ndb_restore --nodeid=1 --backupid=1 --restore-meta --backup-path=/backups/node_1/BACKUP/BACKUP-1
     ```

     **ndb_restore** deve ser capaz de entrar em contato com o servidor de gerenciamento; adicione a opção `--ndb-connectstring` se e quando necessário para tornar isso possível.

2. *Restaure os dados*. Isso precisa ser feito uma vez para cada nó de dados no cluster original, cada vez usando o ID do nó do nó em questão. Supondo que originalmente houvesse 4 nós de dados, o conjunto de comandos necessários seria algo como:

   ```sql
   ndb_restore --nodeid=1 --backupid=1 --restore-data --backup-path=/backups/node_1/BACKUP/BACKUP-1 --disable-indexes
   ndb_restore --nodeid=2 --backupid=1 --restore-data --backup-path=/backups/node_2/BACKUP/BACKUP-1 --disable-indexes
   ndb_restore --nodeid=3 --backupid=1 --restore-data --backup-path=/backups/node_3/BACKUP/BACKUP-1 --disable-indexes
   ndb_restore --nodeid=4 --backupid=1 --restore-data --backup-path=/backups/node_4/BACKUP/BACKUP-1 --disable-indexes
   ```

   Esses podem ser executados em paralelo.

   Certifique-se de adicionar a opção `--ndb-connectstring` conforme necessário.

3. *Recompile os índices*. Estes foram desativados pela opção `--disable-indexes` usada nos comandos mostrados anteriormente. Recriar os índices evita erros devido ao fato de o restore não ser consistente em todos os pontos. Recompilar os índices também pode melhorar o desempenho em alguns casos. Para recompilar os índices, execute o seguinte comando uma vez, em um único nó:

   ```sql
   $> ndb_restore --nodeid=1 --backupid=1 --backup-path=/backups/node_1/BACKUP/BACKUP-1 --rebuild-indexes
   ```

   Como mencionado anteriormente, você pode precisar adicionar a opção `--ndb-connectstring`, para que o **ndb_restore** possa entrar em contato com o servidor de gerenciamento.
