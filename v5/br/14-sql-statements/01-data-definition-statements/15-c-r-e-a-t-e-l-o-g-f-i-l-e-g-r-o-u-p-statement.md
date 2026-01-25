### 13.1.15 Instrução CREATE LOGFILE GROUP

```sql
CREATE LOGFILE GROUP logfile_group
    ADD UNDOFILE 'undo_file'
    [INITIAL_SIZE [=] initial_size]
    [UNDO_BUFFER_SIZE [=] undo_buffer_size]
    [REDO_BUFFER_SIZE [=] redo_buffer_size]
    [NODEGROUP [=] nodegroup_id]
    [WAIT]
    [COMMENT [=] 'string']
    ENGINE [=] engine_name
```

Esta instrução cria um novo `log file group` nomeado *`logfile_group`* contendo um único arquivo `UNDO` chamado '*`undo_file`*'. Uma instrução [`CREATE LOGFILE GROUP`](create-logfile-group.html "13.1.15 CREATE LOGFILE GROUP Statement") possui uma e apenas uma cláusula `ADD UNDOFILE`. Para regras sobre a nomeação de `log file groups`, consulte [Seção 9.2, “Nomes de Objetos de Schema”](identifiers.html "9.2 Schema Object Names").

Nota

Todos os objetos Disk Data do NDB Cluster compartilham o mesmo `namespace`. Isso significa que *cada objeto Disk Data* deve ter um nome exclusivo (e não apenas cada objeto Disk Data de um determinado tipo). Por exemplo, você não pode ter um `tablespace` e um `log file group` com o mesmo nome, ou um `tablespace` e um `data file` com o mesmo nome.

Pode haver apenas um `log file group` por instância do NDB Cluster a qualquer momento.

O parâmetro opcional `INITIAL_SIZE` define o tamanho inicial do arquivo `UNDO`; se não for especificado, o padrão é `128M` (128 megabytes). O parâmetro opcional `UNDO_BUFFER_SIZE` define o tamanho usado pelo `UNDO buffer` para o `log file group`; O valor padrão para `UNDO_BUFFER_SIZE` é `8M` (oito megabytes); este valor não pode exceder a quantidade de memória do sistema disponível. Ambos os parâmetros são especificados em bytes. Opcionalmente, você pode seguir um ou ambos com uma abreviatura de uma letra para a ordem de magnitude, semelhante àquelas usadas em `my.cnf`. Geralmente, esta é uma das letras `M` (para megabytes) ou `G` (para gigabytes).

A memória usada para `UNDO_BUFFER_SIZE` é proveniente do `pool` global cujo tamanho é determinado pelo valor do parâmetro de configuração do `data node` [`SharedGlobalMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-sharedglobalmemory). Isso inclui qualquer valor padrão implícito para esta opção pela configuração do parâmetro de configuração do `data node` [`InitialLogFileGroup`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-initiallogfilegroup).

O máximo permitido para `UNDO_BUFFER_SIZE` é 629145600 (600 MB).

Em sistemas de 32 bits, o valor máximo suportado para `INITIAL_SIZE` é 4294967296 (4 GB). (Bug #29186)

O valor mínimo permitido para `INITIAL_SIZE` é 1048576 (1 MB).

A opção `ENGINE` determina o `storage engine` a ser usado por este `log file group`, sendo *`engine_name`* o nome do `storage engine`. No MySQL 5.7, este deve ser [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") (ou [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6")). Se `ENGINE` não for definido, o MySQL tenta usar o `engine` especificado pela variável de sistema do servidor [`default_storage_engine`](server-system-variables.html#sysvar_default_storage_engine) (anteriormente `storage_engine`). Em qualquer caso, se o `engine` não for especificado como [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") ou [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), a instrução `CREATE LOGFILE GROUP` parece ser bem-sucedida, mas na verdade falha ao criar o `log file group`, conforme mostrado aqui:

```sql
mysql> CREATE LOGFILE GROUP lg1
    ->     ADD UNDOFILE 'undo.dat' INITIAL_SIZE = 10M;
Query OK, 0 rows affected, 1 warning (0.00 sec)

mysql> SHOW WARNINGS;
+-------+------+------------------------------------------------------------------------------------------------+
| Level | Code | Message                                                                                        |
+-------+------+------------------------------------------------------------------------------------------------+
| Error | 1478 | Table storage engine 'InnoDB' does not support the create option 'TABLESPACE or LOGFILE GROUP' |
+-------+------+------------------------------------------------------------------------------------------------+
1 row in set (0.00 sec)

mysql> DROP LOGFILE GROUP lg1 ENGINE = NDB;
ERROR 1529 (HY000): Failed to drop LOGFILE GROUP

mysql> CREATE LOGFILE GROUP lg1
    ->     ADD UNDOFILE 'undo.dat' INITIAL_SIZE = 10M
    ->     ENGINE = NDB;
Query OK, 0 rows affected (2.97 sec)
```

O fato de a instrução `CREATE LOGFILE GROUP` não retornar um erro quando um `storage engine` que não seja `NDB` é nomeado, mas sim parecer ser bem-sucedida, é um problema conhecido que esperamos resolver em uma versão futura do NDB Cluster.

*`REDO_BUFFER_SIZE`*, `NODEGROUP`, `WAIT` e `COMMENT` são analisados (parsed), mas ignorados, e, portanto, não têm efeito no MySQL 5.7. Essas opções destinam-se a expansões futuras.

Quando usado com `ENGINE [=] NDB`, um `log file group` e o arquivo `UNDO log` associado são criados em cada `data node` do Cluster. Você pode verificar se os arquivos `UNDO` foram criados e obter informações sobre eles consultando a tabela `FILES` do Information Schema. Por exemplo:

```sql
mysql> SELECT LOGFILE_GROUP_NAME, LOGFILE_GROUP_NUMBER, EXTRA
    -> FROM INFORMATION_SCHEMA.FILES
    -> WHERE FILE_NAME = 'undo_10.dat';
+--------------------+----------------------+----------------+
| LOGFILE_GROUP_NAME | LOGFILE_GROUP_NUMBER | EXTRA          |
+--------------------+----------------------+----------------+
| lg_3               |                   11 | CLUSTER_NODE=3 |
| lg_3               |                   11 | CLUSTER_NODE=4 |
+--------------------+----------------------+----------------+
2 rows in set (0.06 sec)
```

[`CREATE LOGFILE GROUP`](create-logfile-group.html "13.1.15 CREATE LOGFILE GROUP Statement") é útil apenas com `Disk Data storage` para NDB Cluster. Consulte [Seção 21.6.11, “Tabelas Disk Data do NDB Cluster”](mysql-cluster-disk-data.html "21.6.11 NDB Cluster Disk Data Tables").