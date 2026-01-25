#### 13.1.18.9 Configurando Opções de Comentário NDB

* [Opções NDB_COLUMN](create-table-ndb-comment-options.html#create-table-ndb-comment-column-options "NDB_COLUMN Options")
* [Opções NDB_TABLE](create-table-ndb-comment-options.html#create-table-ndb-comment-table-options "NDB_TABLE Options")

É possível configurar diversas opções específicas do NDB Cluster no comentário da tabela ou nos comentários das colunas de uma tabela [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"). Opções de nível de tabela para controlar a leitura de qualquer réplica e o balanceamento de partição podem ser incorporadas em um comentário de tabela usando `NDB_TABLE`.

`NDB_COLUMN` pode ser usado em um comentário de coluna para definir o tamanho máximo da coluna da tabela de partes do blob usada pelo `NDB` para armazenar partes de valores de blob. Isso funciona para colunas [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types"), `MEDIUMBLOB`, `LONGBLOB`, [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types"), `MEDIUMTEXT`, `LONGTEXT` e [`JSON`](json.html "11.5 The JSON Data Type").

`NDB_TABLE` pode ser usado em um comentário de tabela para definir opções relacionadas ao balanceamento de partição e se a tabela está totalmente replicada, entre outras.

O restante desta seção descreve estas opções e seu uso.

##### Opções NDB_COLUMN

No NDB Cluster, um comentário de coluna em uma instrução `CREATE TABLE` ou [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") também pode ser usado para especificar uma opção `NDB_COLUMN`. O NDB 7.5 e 7.6 suportam uma única opção de comentário de coluna, `MAX_BLOB_PART_SIZE`; a sintaxe para esta opção é mostrada aqui:

```sql
COMMENT 'NDB_COLUMN=MAX_BLOB_PART_SIZE[={0|1}]'
```

O sinal de `=` e o valor que o segue são opcionais. O uso de qualquer valor diferente de 0 ou 1 resulta em um erro de sintaxe.

O efeito de usar `MAX_BLOB_PART_SIZE` em um comentário de coluna é definir o tamanho da parte do blob de uma coluna [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") ou [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") para o número máximo de bytes suportados para isso pelo `NDB` (13948). Esta opção pode ser aplicada a qualquer tipo de coluna blob suportada pelo MySQL, exceto `TINYBLOB` ou `TINYTEXT` (`BLOB`, `MEDIUMBLOB`, `LONGBLOB`, `TEXT`, `MEDIUMTEXT`, `LONGTEXT`). `MAX_BLOB_PART_SIZE` não tem efeito em colunas `JSON`.

Você também deve ter em mente, especialmente ao trabalhar com colunas `TEXT`, que o valor definido por `MAX_BLOB_PART_SIZE` representa o tamanho da coluna em bytes. Ele não indica o número de caracteres, que varia de acordo com o character set e a collation usados pela coluna.

Para ver os efeitos desta opção, primeiro executamos a seguinte instrução SQL no cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") para criar uma tabela com duas colunas `BLOB`, uma (`c1`) sem opções extras e outra (`c2`) com `MAX_BLOB_PART_SIZE`:

```sql
mysql> CREATE TABLE test.t (
    ->   p INT PRIMARY KEY,
    ->   c1 BLOB,
    ->   c2 BLOB COMMENT 'NDB_COLUMN=MAX_BLOB_PART_SIZE'
    -> ) ENGINE NDB;
Query OK, 0 rows affected (0.32 sec)
```

A partir do shell do sistema, execute o utilitário [**ndb_desc**](mysql-cluster-programs-ndb-desc.html "21.5.10 ndb_desc — Describe NDB Tables") para obter informações sobre a tabela recém-criada, conforme mostrado neste exemplo:

```sql
$> ndb_desc -d test t
-- t --
Version: 1
Fragment type: HashMapPartition
K Value: 6
Min load factor: 78
Max load factor: 80
Temporary table: no
Number of attributes: 3
Number of primary keys: 1
Length of frm data: 324
Row Checksum: 1
Row GCI: 1
SingleUserMode: 0
ForceVarPart: 1
FragmentCount: 2
ExtraRowGciBits: 0
ExtraRowAuthorBits: 0
TableStatus: Retrieved
HashMap: DEFAULT-HASHMAP-3840-2
-- Attributes --
p Int PRIMARY KEY DISTRIBUTION KEY AT=FIXED ST=MEMORY
c1 Blob(256,2000,0) NULL AT=MEDIUM_VAR ST=MEMORY BV=2 BT=NDB$BLOB_22_1
c2 Blob(256,13948,0) NULL AT=MEDIUM_VAR ST=MEMORY BV=2 BT=NDB$BLOB_22_2
-- Indexes --
PRIMARY KEY(p) - UniqueHashIndex
PRIMARY(p) - OrderedIndex
```

As informações da coluna na saída são listadas em `Attributes`; para as colunas `c1` e `c2`, elas são exibidas aqui em texto enfatizado. Para `c1`, o tamanho da parte do blob é 2000, o valor padrão; para `c2`, é 13948, conforme definido por `MAX_BLOB_PART_SIZE`.

Você pode alterar o tamanho da parte do blob para uma determinada coluna blob de uma tabela `NDB` usando uma instrução `ALTER TABLE` como esta, e verificando as alterações posteriormente usando [`SHOW CREATE TABLE`](show-create-table.html "13.7.5.10 SHOW CREATE TABLE Statement"):

```sql
mysql> ALTER TABLE test.t
    ->    DROP COLUMN c1,
    ->     ADD COLUMN c1 BLOB COMMENT 'NDB_COLUMN=MAX_BLOB_PART_SIZE',
    ->     CHANGE COLUMN c2 c2 BLOB AFTER c1;
Query OK, 0 rows affected (0.47 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> SHOW CREATE TABLE test.t\G
*************************** 1. row ***************************
       Table: t
Create Table: CREATE TABLE `t` (
  `p` int(11) NOT NULL,
  `c1` blob COMMENT 'NDB_COLUMN=MAX_BLOB_PART_SIZE',
  `c2` blob,
  PRIMARY KEY (`p`)
) ENGINE=ndbcluster DEFAULT CHARSET=latin1
1 row in set (0.00 sec)

mysql> EXIT
Bye
```

A saída de [**ndb_desc**](mysql-cluster-programs-ndb-desc.html "21.5.10 ndb_desc — Describe NDB Tables") mostra que os tamanhos das partes do blob das colunas foram alterados conforme o esperado:

```sql
$> ndb_desc -d test t
-- t --
Version: 16777220
Fragment type: HashMapPartition
K Value: 6
Min load factor: 78
Max load factor: 80
Temporary table: no
Number of attributes: 3
Number of primary keys: 1
Length of frm data: 324
Row Checksum: 1
Row GCI: 1
SingleUserMode: 0
ForceVarPart: 1
FragmentCount: 2
ExtraRowGciBits: 0
ExtraRowAuthorBits: 0
TableStatus: Retrieved
HashMap: DEFAULT-HASHMAP-3840-2
-- Attributes --
p Int PRIMARY KEY DISTRIBUTION KEY AT=FIXED ST=MEMORY
c1 Blob(256,13948,0) NULL AT=MEDIUM_VAR ST=MEMORY BV=2 BT=NDB$BLOB_26_1
c2 Blob(256,2000,0) NULL AT=MEDIUM_VAR ST=MEMORY BV=2 BT=NDB$BLOB_26_2
-- Indexes --
PRIMARY KEY(p) - UniqueHashIndex
PRIMARY(p) - OrderedIndex

NDBT_ProgramExit: 0 - OK
```

A alteração do tamanho da parte do blob de uma coluna deve ser feita usando um `ALTER TABLE` de cópia (copying `ALTER TABLE`); esta operação não pode ser realizada online (consulte [Section 21.6.12, “Online Operations with ALTER TABLE in NDB Cluster”](mysql-cluster-online-operations.html "21.6.12 Online Operations with ALTER TABLE in NDB Cluster")).

Para obter mais informações sobre como o [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") armazena colunas de tipos blob, consulte [String Type Storage Requirements](storage-requirements.html#data-types-storage-reqs-strings "String Type Storage Requirements").

##### Opções NDB_TABLE

Para uma tabela do NDB Cluster, o comentário da tabela em uma instrução `CREATE TABLE` ou [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") também pode ser usado para especificar uma opção `NDB_TABLE`, que consiste em um ou mais pares nome-valor, separados por vírgulas, se necessário, após a string `NDB_TABLE=`. A sintaxe completa para nomes e valores é mostrada aqui:

```sql
COMMENT="NDB_TABLE=ndb_table_option[,ndb_table_option[,..."

ndb_table_option: {
    NOLOGGING={1 | 0}
  | READ_BACKUP={1 | 0}
  | PARTITION_BALANCE={FOR_RP_BY_NODE | FOR_RA_BY_NODE | FOR_RP_BY_LDM
                      | FOR_RA_BY_LDM | FOR_RA_BY_LDM_X_2
                      | FOR_RA_BY_LDM_X_3 | FOR_RA_BY_LDM_X_4}
  | FULLY_REPLICATED={1 | 0}
}
```

Não são permitidos espaços dentro da string entre aspas. A string não diferencia maiúsculas de minúsculas (case-insensitive).

As quatro opções de tabela `NDB` que podem ser definidas como parte de um comentário desta forma são descritas com mais detalhes nos próximos parágrafos.

`NOLOGGING`: Por padrão, as tabelas `NDB` são logadas (logged) e checkpointadas (checkpointed). Isso as torna duráveis a falhas de cluster inteiras. Usar `NOLOGGING` ao criar ou alterar uma tabela significa que esta tabela não é logada com redo log nem incluída em checkpoints locais. Neste caso, a tabela ainda é replicada entre os data nodes para alta disponibilidade e atualizada usando transações, mas as alterações feitas nela não são registradas nos redo logs do data node, e seu conteúdo não é checkpointado para o disco; ao se recuperar de uma falha de cluster, o cluster retém a definição da tabela, mas nenhuma de suas linhas — ou seja, a tabela fica vazia.

O uso dessas tabelas sem logging reduz as demandas do data node em I/O de disco e armazenamento, bem como o uso de CPU para o checkpointing. Isso pode ser adequado para dados de curta duração que são frequentemente atualizados e onde a perda de todos os dados no evento improvável de uma falha total do cluster é aceitável.

Também é possível usar a variável de sistema [`ndb_table_no_logging`](mysql-cluster-options-variables.html#sysvar_ndb_table_no_logging) para fazer com que quaisquer tabelas NDB criadas ou alteradas enquanto esta variável estiver em vigor se comportem como se tivessem sido criadas com o comentário `NOLOGGING`. Ao contrário de quando o comentário é usado diretamente, neste caso não há nada na saída de [`SHOW CREATE TABLE`](show-create-table.html "13.7.5.10 SHOW CREATE TABLE Statement") que indique que é uma tabela sem logging. A abordagem de usar o comentário da tabela é recomendada, pois oferece controle por tabela do recurso, e este aspecto do schema da tabela é incorporado na instrução de criação da tabela, onde pode ser encontrado facilmente por ferramentas baseadas em SQL.

`READ_BACKUP`: Definir esta opção como 1 tem o mesmo efeito que se [`ndb_read_backup`](mysql-cluster-options-variables.html#sysvar_ndb_read_backup) estivesse habilitado; permite a leitura a partir de qualquer réplica. Fazer isso melhora muito o desempenho das leituras da tabela a um custo relativamente pequeno para o desempenho de escrita.

A partir do MySQL NDB Cluster 7.5.3, você pode definir `READ_BACKUP` para uma tabela existente online (Bug #80858, Bug #23001617), usando uma instrução `ALTER TABLE` semelhante a uma das mostradas aqui:

```sql
ALTER TABLE ... ALGORITHM=INPLACE, COMMENT="NDB_TABLE=READ_BACKUP=1";

ALTER TABLE ... ALGORITHM=INPLACE, COMMENT="NDB_TABLE=READ_BACKUP=0";
```

Antes do MySQL NDB Cluster 7.5.4, definir `READ_BACKUP` como 1 também fazia com que `FRAGMENT_COUNT_TYPE` fosse definido como `ONE_PER_LDM_PER_NODE_GROUP`.

Para obter mais informações sobre a opção `ALGORITHM` para `ALTER TABLE`, consulte [Section 21.6.12, “Online Operations with ALTER TABLE in NDB Cluster”](mysql-cluster-online-operations.html "21.6.12 Online Operations with ALTER TABLE in NDB Cluster").

`PARTITION_BALANCE`: Fornece controle adicional sobre a atribuição e o posicionamento de partições. Os quatro esquemas a seguir são suportados:

1. `FOR_RP_BY_NODE`: Uma partição por node.

   Apenas um LDM em cada node armazena uma partição Primary. Cada partição é armazenada no mesmo LDM (mesmo ID) em todos os nodes.

2. `FOR_RA_BY_NODE`: Uma partição por node group.

   Cada node armazena uma única partição, que pode ser uma réplica Primary ou uma réplica Backup. Cada partição é armazenada no mesmo LDM em todos os nodes.

3. `FOR_RP_BY_LDM`: Uma partição para cada LDM em cada node; o padrão.

   Este é o mesmo comportamento anterior ao MySQL NDB Cluster 7.5.2, exceto por um mapeamento ligeiramente diferente de partições para LDMs, começando com o LDM 0 e colocando uma partição por node group, depois passando para o próximo LDM.

   No MySQL NDB Cluster 7.5.4 e posterior, esta é a configuração usada se `READ_BACKUP` estiver definido como 1. (Bug #82634, Bug #24482114)

4. `FOR_RA_BY_LDM`: Uma partição por LDM em cada node group.

   Estas partições podem ser partições Primary ou Backup.

   Antes do MySQL NDB Cluster 7.5.4, esta era a configuração usada se `READ_BACKUP` estivesse definido como 1.

5. `FOR_RA_BY_LDM_X_2`: Duas partições por LDM em cada node group.

   Estas partições podem ser partições Primary ou Backup.

   Esta configuração foi adicionada no NDB 7.5.4.

6. `FOR_RA_BY_LDM_X_3`: Três partições por LDM em cada node group.

   Estas partições podem ser partições Primary ou Backup.

   Esta configuração foi adicionada no NDB 7.5.4.

7. `FOR_RA_BY_LDM_X_4`: Quatro partições por LDM em cada node group.

   Estas partições podem ser partições Primary ou Backup.

   Esta configuração foi adicionada no NDB 7.5.4.

A partir do NDB 7.5.4, `PARTITION_BALANCE` é a interface preferida para definir o número de partições por tabela. Usar `MAX_ROWS` para forçar o número de partições está descontinuado (deprecated) a partir do NDB 7.5.4, continua a ser suportado no NDB 7.6 para compatibilidade com versões anteriores, mas está sujeito a ser removido em uma versão futura do MySQL NDB Cluster. (Bug #81759, Bug #23544301)

Antes do MySQL NDB Cluster 7.5.4, `PARTITION_BALANCE` era nomeado `FRAGMENT_COUNT_TYPE` e aceitava como seu valor um de (na mesma ordem da lista mostrada) `ONE_PER_NODE`, `ONE_PER_NODE_GROUP`, `ONE_PER_LDM_PER_NODE` ou `ONE_PER_LDM_PER_NODE_GROUP`. (Bug #81761, Bug #23547525)

`FULLY_REPLICATED` controla se a tabela está totalmente replicada, ou seja, se cada data node possui uma cópia completa da tabela. Para habilitar a replicação total da tabela, use `FULLY_REPLICATED=1`.

Esta configuração também pode ser controlada usando a variável de sistema `ndb_fully_replicated`. Definir como `ON` habilita a opção por padrão para todas as novas tabelas `NDB`; o padrão é `OFF`, o que mantém o comportamento anterior (como no MySQL NDB Cluster 7.5.1 e anteriores, antes que o suporte para tabelas totalmente replicadas fosse introduzido). A variável de sistema [`ndb_data_node_neighbour`](mysql-cluster-options-variables.html#sysvar_ndb_data_node_neighbour) também é usada para tabelas totalmente replicadas, para garantir que, quando uma tabela totalmente replicada é acessada, acessamos o data node que é local para este MySQL Server.

Um exemplo de instrução `CREATE TABLE` usando tal comentário ao criar uma tabela `NDB` é mostrado aqui:

```sql
mysql> CREATE TABLE t1 (
     >     c1 INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
     >     c2 VARCHAR(100),
     >     c3 VARCHAR(100) )
     > ENGINE=NDB
     >
COMMENT="NDB_TABLE=READ_BACKUP=0,PARTITION_BALANCE=FOR_RP_BY_NODE";
```

O comentário é exibido como parte da saída de [`SHOW CREATE TABLE`](show-create-table.html "13.7.5.10 SHOW CREATE TABLE Statement"). O texto do comentário também está disponível consultando a tabela [`TABLES`](information-schema-tables-table.html "24.3.25 The INFORMATION_SCHEMA TABLES Table") do Information Schema do MySQL, como neste exemplo:

```sql
mysql> SELECT TABLE_NAME, TABLE_SCHEMA, TABLE_COMMENT
     > FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME="t1"\G
*************************** 1. row ***************************
   TABLE_NAME: t1
 TABLE_SCHEMA: test
TABLE_COMMENT: NDB_TABLE=READ_BACKUP=0,PARTITION_BALANCE=FOR_RP_BY_NODE
1 row in set (0.01 sec)
```

Esta sintaxe de comentário também é suportada com instruções [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") para tabelas `NDB`, conforme mostrado aqui:

```sql
mysql> ALTER TABLE t1 COMMENT="NDB_TABLE=PARTITION_BALANCE=FOR_RA_BY_NODE";
Query OK, 0 rows affected (0.40 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

A partir do NDB 7.6.15, a coluna `TABLE_COMMENT` exibe o comentário que é necessário para recriar a tabela como está após a instrução `ALTER TABLE`, desta forma:

```sql
mysql> SELECT TABLE_NAME, TABLE_SCHEMA, TABLE_COMMENT
    ->     FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME="t1"\G
*************************** 1. row ***************************
   TABLE_NAME: t1
 TABLE_SCHEMA: test
TABLE_COMMENT: NDB_TABLE=READ_BACKUP=0,PARTITION_BALANCE=FOR_RP_BY_NODE
1 row in set (0.01 sec)
```

```sql
mysql> SELECT TABLE_NAME, TABLE_SCHEMA, TABLE_COMMENT
     > FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME="t1";
+------------+--------------+--------------------------------------------------+
| TABLE_NAME | TABLE_SCHEMA | TABLE_COMMENT                                    |
+------------+--------------+--------------------------------------------------+
| t1         | c            | NDB_TABLE=PARTITION_BALANCE=FOR_RA_BY_NODE       |
| t1         | d            |                                                  |
+------------+--------------+--------------------------------------------------+
2 rows in set (0.01 sec)
```

Lembre-se de que um comentário de tabela usado com `ALTER TABLE` substitui qualquer comentário existente que a tabela possa ter.

```sql
mysql> ALTER TABLE t1 COMMENT="NDB_TABLE=PARTITION_BALANCE=FOR_RA_BY_NODE";
Query OK, 0 rows affected (0.40 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> SELECT TABLE_NAME, TABLE_SCHEMA, TABLE_COMMENT
     > FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME="t1";
+------------+--------------+--------------------------------------------------+
| TABLE_NAME | TABLE_SCHEMA | TABLE_COMMENT                                    |
+------------+--------------+--------------------------------------------------+
| t1         | c            | NDB_TABLE=PARTITION_BALANCE=FOR_RA_BY_NODE       |
| t1         | d            |                                                  |
+------------+--------------+--------------------------------------------------+
2 rows in set (0.01 sec)
```

Antes do NDB 7.6.15, o comentário da tabela usado com `ALTER TABLE` substituía qualquer comentário existente que a tabela pudesse ter. Isso significava que (por exemplo) o valor de `READ_BACKUP` não era transferido para o novo comentário definido pela instrução `ALTER TABLE`, e quaisquer valores não especificados voltavam aos seus padrões. (BUG#30428829) Não havia, portanto, mais nenhuma maneira usando SQL de recuperar o valor definido anteriormente para o comentário. Para evitar que os valores de comentário voltassem aos seus padrões, era necessário preservar todos esses valores da string de comentário existente e incluí-los no comentário passado para `ALTER TABLE`.

Você também pode ver o valor da opção `PARTITION_BALANCE` na saída de [**ndb_desc**](mysql-cluster-programs-ndb-desc.html "21.5.10 ndb_desc — Describe NDB Tables"). O [**ndb_desc**](mysql-cluster-programs-ndb-desc.html "21.5.10 ndb_desc — Describe NDB Tables") também mostra se as opções `READ_BACKUP` e `FULLY_REPLICATED` estão definidas para a tabela. Consulte a descrição deste programa para obter mais informações.