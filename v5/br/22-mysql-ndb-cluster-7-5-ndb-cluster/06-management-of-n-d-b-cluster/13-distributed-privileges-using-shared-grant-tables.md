### 21.6.13 Privilégios Distribuídos Usando Shared Grant Tables

O NDB Cluster suporta a distribuição de usuários e privilégios MySQL em todos os SQL nodes em um NDB Cluster. Este suporte não está habilitado por padrão; você deve seguir o procedimento descrito nesta seção para ativá-lo.

Normalmente, as tabelas de privilégios de usuário de cada servidor MySQL no `database` `mysql` devem usar o storage engine [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine"), o que significa que uma conta de usuário e seus privilégios associados criados em um SQL node não estão disponíveis nos outros SQL nodes do cluster. Um arquivo SQL, `ndb_dist_priv.sql`, fornecido com a distribuição do NDB Cluster, pode ser encontrado no diretório `share` dentro do diretório de instalação do MySQL.

O primeiro passo para habilitar os privilégios distribuídos é carregar este script em um MySQL Server que funcione como um SQL node (que chamaremos daqui em diante de target SQL node ou MySQL Server). Você pode fazer isso executando o seguinte comando no shell do sistema no target SQL node, após mudar para o diretório de instalação do MySQL (onde *`options`* representa quaisquer opções adicionais necessárias para se conectar a este SQL node):

```sql
$> mysql options -uroot < share/ndb_dist_priv.sql
```

A importação de `ndb_dist_priv.sql` cria várias stored routines (seis stored procedures e uma stored function) no `database` `mysql` no target SQL node. Após se conectar ao SQL node no [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client (como o usuário `root` do MySQL), você pode verificar se elas foram criadas, como mostrado aqui:

```sql
mysql> SELECT ROUTINE_NAME, ROUTINE_SCHEMA, ROUTINE_TYPE
    ->     FROM INFORMATION_SCHEMA.ROUTINES
    ->     WHERE ROUTINE_NAME LIKE 'mysql_cluster%'
    ->     ORDER BY ROUTINE_TYPE;
+---------------------------------------------+----------------+--------------+
| ROUTINE_NAME                                | ROUTINE_SCHEMA | ROUTINE_TYPE |
+---------------------------------------------+----------------+--------------+
| mysql_cluster_privileges_are_distributed    | mysql          | FUNCTION     |
| mysql_cluster_backup_privileges             | mysql          | PROCEDURE    |
| mysql_cluster_move_grant_tables             | mysql          | PROCEDURE    |
| mysql_cluster_move_privileges               | mysql          | PROCEDURE    |
| mysql_cluster_restore_local_privileges      | mysql          | PROCEDURE    |
| mysql_cluster_restore_privileges            | mysql          | PROCEDURE    |
| mysql_cluster_restore_privileges_from_local | mysql          | PROCEDURE    |
+---------------------------------------------+----------------+--------------+
7 rows in set (0.01 sec)
```

A stored procedure chamada `mysql_cluster_move_privileges` cria cópias de backup das tabelas de privilégios existentes e, em seguida, as converte para [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6").

`mysql_cluster_move_privileges` executa o backup e a conversão em duas etapas. A primeira etapa é chamar `mysql_cluster_backup_privileges`, que cria dois conjuntos de cópias no `database` `mysql`:

* Um conjunto de cópias locais que usam o storage engine [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine"). Seus nomes são gerados adicionando o sufixo `_backup` aos nomes originais das tabelas de privilégios.

* Um conjunto de cópias distribuídas que usam o storage engine [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"). Estas tabelas são nomeadas prefixando `ndb_` e anexando `_backup` aos nomes das tabelas originais.

Após a criação das cópias, `mysql_cluster_move_privileges` invoca `mysql_cluster_move_grant_tables`, que contém as instruções [`ALTER TABLE ... ENGINE = NDB`](alter-table.html "13.1.8 ALTER TABLE Statement") que convertem as tabelas do sistema mysql para [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6").

Normalmente, você não deve invocar `mysql_cluster_backup_privileges` nem `mysql_cluster_move_grant_tables` manualmente; estas stored procedures destinam-se apenas ao uso por `mysql_cluster_move_privileges`.

Embora as tabelas de privilégios originais sejam submetidas a backup automaticamente, é sempre uma boa prática criar backups manuais das tabelas de privilégios existentes em todos os SQL nodes afetados antes de prosseguir. Você pode fazer isso usando [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") de maneira semelhante à mostrada aqui:

```sql
$> mysqldump options -uroot \
    mysql user db tables_priv columns_priv procs_priv proxies_priv > backup_file
```

Para realizar a conversão, você deve estar conectado ao target SQL node usando o [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client (novamente, como o usuário `root` do MySQL). Invoque a stored procedure desta forma:

```sql
mysql> CALL mysql.mysql_cluster_move_privileges();
Query OK, 0 rows affected (22.32 sec)
```

Dependendo do número de linhas nas tabelas de privilégios, este procedimento pode levar algum tempo para ser executado. Se algumas das tabelas de privilégios estiverem vazias, você poderá ver um ou mais avisos "No data - zero rows fetched, selected, or processed" quando `mysql_cluster_move_privileges` retornar. Nesses casos, os avisos podem ser ignorados com segurança. Para verificar se a conversão foi bem-sucedida, você pode usar a stored function `mysql_cluster_privileges_are_distributed`, conforme mostrado aqui:

```sql
mysql> SELECT CONCAT(
    ->    'Conversion ',
    ->    IF(mysql.mysql_cluster_privileges_are_distributed(), 'succeeded', 'failed'),
    ->    '.')
    ->    AS Result;
+-----------------------+
| Result                |
+-----------------------+
| Conversion succeeded. |
+-----------------------+
1 row in set (0.00 sec)
```

`mysql_cluster_privileges_are_distributed` verifica a existência das tabelas de privilégios distribuídas e retorna `1` se todas as tabelas de privilégios estiverem distribuídas; caso contrário, retorna `0`.

Você pode verificar se os backups foram criados usando uma Query como esta:

```sql
mysql> SELECT TABLE_NAME, ENGINE FROM INFORMATION_SCHEMA.TABLES
    ->     WHERE TABLE_SCHEMA = 'mysql' AND TABLE_NAME LIKE '%backup'
    ->     ORDER BY ENGINE;
+-------------------------+------------+
| TABLE_NAME              | ENGINE     |
+-------------------------+------------+
| db_backup               | MyISAM     |
| user_backup             | MyISAM     |
| columns_priv_backup     | MyISAM     |
| tables_priv_backup      | MyISAM     |
| proxies_priv_backup     | MyISAM     |
| procs_priv_backup       | MyISAM     |
| ndb_columns_priv_backup | ndbcluster |
| ndb_user_backup         | ndbcluster |
| ndb_tables_priv_backup  | ndbcluster |
| ndb_proxies_priv_backup | ndbcluster |
| ndb_procs_priv_backup   | ndbcluster |
| ndb_db_backup           | ndbcluster |
+-------------------------+------------+
12 rows in set (0.00 sec)
```

Uma vez feita a conversão para privilégios distribuídos, sempre que uma conta de usuário MySQL for criada, excluída (dropped) ou tiver seus privilégios atualizados em qualquer SQL node, as alterações entrarão em vigor imediatamente em todos os outros MySQL Servers anexados ao cluster. Uma vez que os privilégios são distribuídos, quaisquer novos MySQL Servers que se conectarem ao cluster participarão automaticamente na distribuição.

Note

Para os clients conectados aos SQL nodes no momento em que `mysql_cluster_move_privileges` é executado, pode ser necessário executar [`FLUSH PRIVILEGES`](flush.html#flush-privileges) nesses SQL nodes, ou desconectar e depois reconectar os clients, para que esses clients possam ver as alterações nos privilégios.

Todos os privilégios de usuário MySQL são distribuídos por todos os MySQL Servers conectados. Isso inclui quaisquer privilégios associados a views e stored routines, embora a distribuição de views e stored routines em si não seja atualmente suportada.

Caso um SQL node se desconecte do cluster enquanto `mysql_cluster_move_privileges` estiver em execução, você deve excluir (drop) suas tabelas de privilégios após reconectar-se ao cluster, usando uma instrução como [`DROP TABLE IF EXISTS mysql.user mysql.db mysql.tables_priv mysql.columns_priv mysql.procs_priv`](drop-table.html "13.1.29 DROP TABLE Statement"). Isso faz com que o SQL node use as shared privilege tables em vez de suas próprias versões locais. Isso não é necessário ao conectar um novo SQL node ao cluster pela primeira vez.

No caso de um restart inicial de todo o cluster (todos os data nodes desligados e depois iniciados novamente com [`--initial`](mysql-cluster-programs-ndbd.html#option_ndbd_initial)), as shared privilege tables são perdidas. Se isso acontecer, você pode restaurá-las usando o target SQL node original, seja a partir dos backups feitos por `mysql_cluster_move_privileges` ou a partir de um dump file criado com [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program"). Se você precisar usar um novo MySQL Server para realizar a restauração, você deve iniciá-lo com [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables) ao se conectar ao cluster pela primeira vez; depois disso, você pode restaurar as privilege tables localmente e, em seguida, distribuí-las novamente usando `mysql_cluster_move_privileges`. Após restaurar e distribuir as tabelas, você deve reiniciar este MySQL Server sem a opção [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables).

Você também pode restaurar as tabelas distribuídas usando [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") [`--restore-privilege-tables`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_restore-privilege-tables) a partir de um backup feito usando [`START BACKUP`](mysql-cluster-backup-using-management-client.html "21.6.8.2 Using The NDB Cluster Management Client to Create a Backup") no [**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client") client. (As tabelas [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") criadas por `mysql_cluster_move_privileges` não são submetidas a backup pelo comando `START BACKUP`.) Por padrão, [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") não restaura as tabelas de privilégios; a opção [`--restore-privilege-tables`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_restore-privilege-tables) faz com que ele o faça.

Você pode restaurar os privilégios locais do SQL node usando um de dois procedimentos. `mysql_cluster_restore_privileges` funciona da seguinte forma:

1. Se cópias das tabelas `mysql.ndb_*_backup` estiverem disponíveis, tente restaurar as tabelas do sistema a partir delas.

2. Caso contrário, tente restaurar as tabelas do sistema a partir dos backups locais chamados `*_backup` (sem o prefixo `ndb_`).

O outro procedimento, chamado `mysql_cluster_restore_local_privileges`, restaura as tabelas do sistema a partir dos backups locais apenas, sem verificar os backups `ndb_*`.

As tabelas do sistema recriadas por `mysql_cluster_restore_privileges` ou `mysql_cluster_restore_local_privileges` usam o storage engine padrão do MySQL Server; elas não são compartilhadas ou distribuídas de forma alguma e não usam o storage engine [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") do NDB Cluster.

A stored procedure adicional `mysql_cluster_restore_privileges_from_local` destina-se ao uso por `mysql_cluster_restore_privileges` e `mysql_cluster_restore_local_privileges`. Ela não deve ser invocada diretamente.

Important

Aplicações que acessam os dados do NDB Cluster diretamente, incluindo aplicações NDB API e ClusterJ, não estão sujeitas ao sistema de privilégios MySQL. Isso significa que, uma vez distribuídas as grant tables, elas podem ser acessadas livremente por tais aplicações, assim como podem acessar quaisquer outras tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"). Em particular, você deve ter em mente que *aplicações NDB API e ClusterJ podem ler e escrever nomes de usuários (user names), nomes de hosts (host names), hashes de senha (password hashes) e qualquer outro conteúdo das distributed grant tables sem quaisquer restrições*.