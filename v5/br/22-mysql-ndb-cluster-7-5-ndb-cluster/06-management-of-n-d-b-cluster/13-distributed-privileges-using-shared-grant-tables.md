### 21.6.13 Privilégios distribuídos usando tabelas de concessão compartilhadas

O NDB Cluster suporta a distribuição de usuários e privilégios do MySQL em todos os nós SQL de um NDB Cluster. Esse suporte não está habilitado por padrão; você deve seguir o procedimento descrito nesta seção para habilitá-lo.

Normalmente, as tabelas de privilégios do usuário de cada servidor MySQL no banco de dados `mysql` devem usar o mecanismo de armazenamento `MyISAM`, o que significa que uma conta de usuário e seus privilégios associados criados em um nó SQL não estão disponíveis nos outros nós SQL do clúster. Um arquivo SQL `ndb_dist_priv.sql` fornecido com a distribuição do NDB Cluster pode ser encontrado no diretório `share` no diretório de instalação do MySQL.

O primeiro passo para habilitar privilégios distribuídos é carregar este script em um servidor MySQL que funcione como um nó SQL (a partir de agora, referimo-nos a ele como o nó SQL de destino ou servidor MySQL). Você pode fazer isso executando o seguinte comando no shell do sistema no nó SQL de destino após mudar para o diretório de instalação do MySQL (*`options`* representa quaisquer opções adicionais necessárias para se conectar a este nó SQL):

```sql
$> mysql options -uroot < share/ndb_dist_priv.sql
```

A importação de `ndb_dist_priv.sql` cria vários procedimentos armazenados (seis procedimentos armazenados e uma função armazenada) no banco de dados `mysql` no nó SQL de destino. Após se conectar ao nó SQL no cliente **mysql** (como usuário `root` do MySQL), você pode verificar se eles foram criados conforme mostrado aqui:

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

O procedimento armazenado chamado `mysql_cluster_move_privileges` cria cópias de backup das tabelas de privilégios existentes e, em seguida, as converte em `NDB`.

`mysql_cluster_move_privileges` realiza o backup e a conversão em duas etapas. A primeira etapa é chamar `mysql_cluster_backup_privileges`, que cria dois conjuntos de cópias no banco de dados `mysql`:

- Um conjunto de cópias locais que utilizam o mecanismo de armazenamento `MyISAM`. Seus nomes são gerados adicionando o sufixo `_backup` aos nomes originais das tabelas de privilégios.

- Um conjunto de cópias distribuídas que utilizam o mecanismo de armazenamento `NDBCLUSTER`. Essas tabelas são nomeadas prefixando `ndb_` e adicionando `_backup` aos nomes das tabelas originais.

Após a criação das cópias, o `mysql_cluster_move_privileges` invoca o `mysql_cluster_move_grant_tables`, que contém as instruções `ALTER TABLE ... ENGINE = NDB` que convertem as tabelas do sistema do MySQL para `NDB`.

Normalmente, você não deve invocar manualmente `mysql_cluster_backup_privileges` ou `mysql_cluster_move_grant_tables`; esses procedimentos armazenados são destinados apenas para uso pelo `mysql_cluster_move_privileges`.

Embora as tabelas de privilégios originais sejam copiadas automaticamente, é sempre uma boa ideia criar backups manualmente das tabelas de privilégios existentes em todos os nós SQL afetados antes de prosseguir. Você pode fazer isso usando **mysqldump** de uma maneira semelhante à mostrada aqui:

```sql
$> mysqldump options -uroot \
    mysql user db tables_priv columns_priv procs_priv proxies_priv > backup_file
```

Para realizar a conversão, você deve estar conectado ao nó SQL de destino usando o cliente **mysql** (novamente, como usuário `root` do MySQL). Inicie o procedimento armazenado da seguinte maneira:

```sql
mysql> CALL mysql.mysql_cluster_move_privileges();
Query OK, 0 rows affected (22.32 sec)
```

Dependendo do número de linhas nas tabelas de privilégios, este procedimento pode levar algum tempo para ser executado. Se algumas das tabelas de privilégios estiverem vazias, você pode ver um ou mais avisos de "Nenhum dado - zero linhas recuperadas, selecionadas ou processadas" quando o `mysql_cluster_move_privileges` retornar. Nesses casos, os avisos podem ser ignorados com segurança. Para verificar se a conversão foi bem-sucedida, você pode usar a função armazenada `mysql_cluster_privileges_are_distributed`, conforme mostrado aqui:

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

Você pode verificar se os backups foram criados usando uma consulta como esta:

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

Depois que a conversão para privilégios distribuídos for realizada, qualquer vez que uma conta de usuário do MySQL for criada, eliminada ou seus privilégios forem atualizados em qualquer nó SQL, as alterações entram em vigor imediatamente em todos os outros servidores MySQL conectados ao clúster. Uma vez que os privilégios sejam distribuídos, quaisquer novos servidores MySQL que se conectarem ao clúster participarão automaticamente da distribuição.

Nota

Para clientes conectados a nós SQL no momento em que o `mysql_cluster_move_privileges` é executado, você pode precisar executar `FLUSH PRIVILEGES` nesses nós SQL ou desconectar e reconectar os clientes para que eles possam ver as alterações nos privilégios.

Todos os privilégios de usuário do MySQL são distribuídos entre todos os servidores MySQL conectados. Isso inclui quaisquer privilégios associados a visualizações e rotinas armazenadas, embora a distribuição das visualizações e das rotinas armazenadas não seja atualmente suportada.

No caso de um nó SQL se desconectar do clúster enquanto o `mysql_cluster_move_privileges` estiver em execução, você deve descartar suas tabelas de privilégios após reconectar-se ao clúster, usando uma instrução como `DROP TABLE IF EXISTS mysql.user mysql.db mysql.tables_priv mysql.columns_priv mysql.procs_priv`. Isso faz com que o nó SQL use as tabelas de privilégios compartilhadas em vez de suas próprias versões locais delas. Isso não é necessário ao conectar um novo nó SQL ao clúster pela primeira vez.

No caso de um reinício inicial de todo o clúster (todos os nós de dados são desligados e, em seguida, reiniciados com `--initial`), as tabelas de privilégios compartilhados são perdidas. Se isso acontecer, você pode restaurá-las usando o nó SQL alvo original, seja a partir dos backups feitos pelo `mysql_cluster_move_privileges` ou de um arquivo de dump criado com **mysqldump**. Se você precisar usar um novo servidor MySQL para realizar a restauração, você deve iniciá-lo com \[`--skip-grant-tables`]\(server-options.html#option\_mysqld\_skip-grant-tables] ao se conectar ao clúster pela primeira vez; depois disso, você pode restaurar as tabelas de privilégios localmente e, em seguida, distribuí-las novamente usando `mysql_cluster_move_privileges`. Após a restauração e distribuição das tabelas, você deve reiniciar esse servidor MySQL sem a opção `--skip-grant-tables`.

Você também pode restaurar as tabelas distribuídas usando **ndb\_restore** `--restore-privilege-tables` de um backup feito usando `START BACKUP` no cliente **ndb\_mgm**. (As tabelas `MyISAM` criadas por `mysql_cluster_move_privileges` não são respaldadas pelo comando `START BACKUP`. O **ndb\_restore** não restaura as tabelas de privilégio por padrão; a opção `--restore-privilege-tables` faz isso.)

Você pode restaurar os privilégios locais do nó SQL usando um dos dois procedimentos. `mysql_cluster_restore_privileges` funciona da seguinte maneira:

1. Se estiverem disponíveis cópias das tabelas `mysql.ndb_*_backup`, tente restaurar as tabelas do sistema a partir delas.

2. Caso contrário, tente restaurar as tabelas do sistema a partir dos backups locais com o nome `*_backup` (sem o prefixo `ndb_`).

O outro procedimento, chamado `mysql_cluster_restore_local_privileges`, restaura as tabelas do sistema apenas a partir dos backups locais, sem verificar os backups `ndb_*`.

As tabelas do sistema recriadas por `mysql_cluster_restore_privileges` ou `mysql_cluster_restore_local_privileges` usam o mecanismo de armazenamento padrão do servidor MySQL; elas não são compartilhadas ou distribuídas de nenhuma forma e não usam o mecanismo de armazenamento do NDB Cluster `NDB`.

O procedimento armazenado adicional `mysql_cluster_restore_privileges_from_local` é destinado ao uso de `mysql_cluster_restore_privileges` e `mysql_cluster_restore_local_privileges`. Ele não deve ser invocado diretamente.

Importante

Os aplicativos que acessam diretamente os dados do NDB Cluster, incluindo aplicativos da API NDB e ClusterJ, não estão sujeitos ao sistema de privilégios do MySQL. Isso significa que, uma vez que você tenha distribuído as tabelas de concessão, esses aplicativos podem acessar livremente essas tabelas, assim como qualquer outra tabela do `NDB`. Em particular, você deve ter em mente que *aplicativos da API NDB e ClusterJ podem ler e escrever nomes de usuário, nomes de host, hashes de senha e qualquer outro conteúdo das tabelas de concessão distribuídas sem quaisquer restrições*.
