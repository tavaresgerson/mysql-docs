### 21.5.10 ndb_desc — Descreve Tabelas NDB

[**ndb_desc**](mysql-cluster-programs-ndb-desc.html "21.5.10 ndb_desc — Describe NDB Tables") fornece uma descrição detalhada de uma ou mais tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6").

#### Uso

```sql
ndb_desc -c connection_string tbl_name -d db_name [options]

ndb_desc -c connection_string index_name -d db_name -t tbl_name
```

Opções adicionais que podem ser usadas com [**ndb_desc**](mysql-cluster-programs-ndb-desc.html "21.5.10 ndb_desc — Describe NDB Tables") estão listadas mais adiante nesta seção.

#### Exemplo de Saída

Instruções de criação e população de tabela MySQL:

```sql
USE test;

CREATE TABLE fish (
    id INT(11) NOT NULL AUTO_INCREMENT,
    name VARCHAR(20) NOT NULL,
    length_mm INT(11) NOT NULL,
    weight_gm INT(11) NOT NULL,

    PRIMARY KEY pk (id),
    UNIQUE KEY uk (name)
) ENGINE=NDB;

INSERT INTO fish VALUES
    (NULL, 'guppy', 35, 2), (NULL, 'tuna', 2500, 150000),
    (NULL, 'shark', 3000, 110000), (NULL, 'manta ray', 1500, 50000),
    (NULL, 'grouper', 900, 125000), (NULL ,'puffer', 250, 2500);
```

Saída de [**ndb_desc**](mysql-cluster-programs-ndb-desc.html "21.5.10 ndb_desc — Describe NDB Tables"):

```sql
$> ./ndb_desc -c localhost fish -d test -p
-- fish --
Version: 2
Fragment type: HashMapPartition
K Value: 6
Min load factor: 78
Max load factor: 80
Temporary table: no
Number of attributes: 4
Number of primary keys: 1
Length of frm data: 337
Max Rows: 0
Row Checksum: 1
Row GCI: 1
SingleUserMode: 0
ForceVarPart: 1
PartitionCount: 2
FragmentCount: 2
PartitionBalance: FOR_RP_BY_LDM
ExtraRowGciBits: 0
ExtraRowAuthorBits: 0
TableStatus: Retrieved
Table options:
HashMap: DEFAULT-HASHMAP-3840-2
-- Attributes --
id Int PRIMARY KEY DISTRIBUTION KEY AT=FIXED ST=MEMORY AUTO_INCR
name Varchar(20;latin1_swedish_ci) NOT NULL AT=SHORT_VAR ST=MEMORY DYNAMIC
length_mm Int NOT NULL AT=FIXED ST=MEMORY DYNAMIC
weight_gm Int NOT NULL AT=FIXED ST=MEMORY DYNAMIC
-- Indexes --
PRIMARY KEY(id) - UniqueHashIndex
PRIMARY(id) - OrderedIndex
uk(name) - OrderedIndex
uk$unique(name) - UniqueHashIndex
-- Per partition info --
Partition       Row count       Commit count    Frag fixed memory       Frag varsized memory    Extent_space    Free extent_space
0               2               2               32768                   32768                   0               0
1               4               4               32768                   32768                   0               0


NDBT_ProgramExit: 0 - OK
```

Informações sobre múltiplas tabelas podem ser obtidas em uma única invocação de [**ndb_desc**] usando seus nomes, separados por espaços. Todas as tabelas devem estar no mesmo Database.

Você pode obter informações adicionais sobre um Index específico usando a opção `--table` (forma abreviada: `-t`) e fornecendo o nome do Index como o primeiro argumento para [**ndb_desc**], conforme mostrado aqui:

```sql
$> ./ndb_desc uk -d test -t fish
-- uk --
Version: 2
Base table: fish
Number of attributes: 1
Logging: 0
Index type: OrderedIndex
Index status: Retrieved
-- Attributes --
name Varchar(20;latin1_swedish_ci) NOT NULL AT=SHORT_VAR ST=MEMORY
-- IndexTable 10/uk --
Version: 2
Fragment type: FragUndefined
K Value: 6
Min load factor: 78
Max load factor: 80
Temporary table: yes
Number of attributes: 2
Number of primary keys: 1
Length of frm data: 0
Max Rows: 0
Row Checksum: 1
Row GCI: 1
SingleUserMode: 2
ForceVarPart: 0
PartitionCount: 2
FragmentCount: 2
FragmentCountType: ONE_PER_LDM_PER_NODE
ExtraRowGciBits: 0
ExtraRowAuthorBits: 0
TableStatus: Retrieved
Table options:
-- Attributes --
name Varchar(20;latin1_swedish_ci) NOT NULL AT=SHORT_VAR ST=MEMORY
NDB$TNODE Unsigned [64] PRIMARY KEY DISTRIBUTION KEY AT=FIXED ST=MEMORY
-- Indexes --
PRIMARY KEY(NDB$TNODE) - UniqueHashIndex

NDBT_ProgramExit: 0 - OK
```

Quando um Index é especificado desta forma, as opções [`--extra-partition-info`](mysql-cluster-programs-ndb-desc.html#option_ndb_desc_extra-partition-info) e [`--extra-node-info`](mysql-cluster-programs-ndb-desc.html#option_ndb_desc_extra-node-info) não têm efeito.

A coluna `Version` na saída contém a versão do objeto schema da tabela. Para obter informações sobre a interpretação deste valor, consulte [NDB Schema Object Versions](/doc/ndb-internals/en/ndb-internals-schema-object-versions.html).

Três das propriedades da tabela que podem ser definidas usando comentários `NDB_TABLE` incorporados nas instruções [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") e [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") também são visíveis na saída de [**ndb_desc**]. O `FRAGMENT_COUNT_TYPE` da tabela é sempre mostrado na coluna `FragmentCountType`. `READ_ONLY` e `FULLY_REPLICATED`, se definidos como 1, são mostrados na coluna `Table options`. Você pode ver isso após executar a seguinte instrução [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") no cliente [**mysql**]:

```sql
mysql> ALTER TABLE fish COMMENT='NDB_TABLE=READ_ONLY=1,FULLY_REPLICATED=1';
1 row in set, 1 warning (0.00 sec)

mysql> SHOW WARNINGS\G
+---------+------+---------------------------------------------------------------------------------------------------------+
| Level   | Code | Message                                                                                                 |
+---------+------+---------------------------------------------------------------------------------------------------------+
| Warning | 1296 | Got error 4503 'Table property is FRAGMENT_COUNT_TYPE=ONE_PER_LDM_PER_NODE but not in comment' from NDB |
+---------+------+---------------------------------------------------------------------------------------------------------+
1 row in set (0.00 sec)
```

O aviso é emitido porque `READ_ONLY=1` exige que o tipo de contagem de fragmentos da tabela seja (ou seja definido como) `ONE_PER_LDM_PER_NODE_GROUP`; o `NDB` define isso automaticamente em tais casos. Você pode verificar se a instrução `ALTER TABLE` tem o efeito desejado usando [`SHOW CREATE TABLE`](show-create-table.html "13.7.5.10 SHOW CREATE TABLE Statement"):

```sql
mysql> SHOW CREATE TABLE fish\G
*************************** 1. row ***************************
       Table: fish
Create Table: CREATE TABLE `fish` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `length_mm` int(11) NOT NULL,
  `weight_gm` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk` (`name`)
) ENGINE=ndbcluster DEFAULT CHARSET=latin1
COMMENT='NDB_TABLE=READ_BACKUP=1,FULLY_REPLICATED=1'
1 row in set (0.01 sec)
```

Como `FRAGMENT_COUNT_TYPE` não foi definido explicitamente, seu valor não é mostrado no texto do comentário impresso por `SHOW CREATE TABLE`. O [**ndb_desc**], no entanto, exibe o valor atualizado para este atributo. A coluna `Table options` mostra as propriedades binárias que acabaram de ser habilitadas. Você pode ver isso na saída mostrada aqui (texto enfatizado):

```sql
$> ./ndb_desc -c localhost fish -d test -p
-- fish --
Version: 4
Fragment type: HashMapPartition
K Value: 6
Min load factor: 78
Max load factor: 80
Temporary table: no
Number of attributes: 4
Number of primary keys: 1
Length of frm data: 380
Max Rows: 0
Row Checksum: 1
Row GCI: 1
SingleUserMode: 0
ForceVarPart: 1
PartitionCount: 1
FragmentCount: 1
FragmentCountType: ONE_PER_LDM_PER_NODE_GROUP
ExtraRowGciBits: 0
ExtraRowAuthorBits: 0
TableStatus: Retrieved
Table options: readbackup, fullyreplicated
HashMap: DEFAULT-HASHMAP-3840-1
-- Attributes --
id Int PRIMARY KEY DISTRIBUTION KEY AT=FIXED ST=MEMORY AUTO_INCR
name Varchar(20;latin1_swedish_ci) NOT NULL AT=SHORT_VAR ST=MEMORY DYNAMIC
length_mm Int NOT NULL AT=FIXED ST=MEMORY DYNAMIC
weight_gm Int NOT NULL AT=FIXED ST=MEMORY DYNAMIC
-- Indexes --
PRIMARY KEY(id) - UniqueHashIndex
PRIMARY(id) - OrderedIndex
uk(name) - OrderedIndex
uk$unique(name) - UniqueHashIndex
-- Per partition info --
Partition       Row count       Commit count    Frag fixed memory       Frag varsized memory    Extent_space    Free extent_space

NDBT_ProgramExit: 0 - OK
```

Para mais informações sobre essas propriedades de tabela, consulte [Seção 13.1.18.9, “Definindo Opções de Comentário NDB”](create-table-ndb-comment-options.html "13.1.18.9 Setting NDB Comment Options").

As colunas `Extent_space` e `Free extent_space` são aplicáveis apenas a tabelas `NDB` que possuem colunas em disco; para tabelas que possuem apenas colunas in-memory, essas colunas sempre contêm o valor `0`.

Para ilustrar seu uso, modificamos o exemplo anterior. Primeiro, devemos criar os objetos Disk Data necessários, conforme mostrado aqui:

```sql
CREATE LOGFILE GROUP lg_1
    ADD UNDOFILE 'undo_1.log'
    INITIAL_SIZE 16M
    UNDO_BUFFER_SIZE 2M
    ENGINE NDB;

ALTER LOGFILE GROUP lg_1
    ADD UNDOFILE 'undo_2.log'
    INITIAL_SIZE 12M
    ENGINE NDB;

CREATE TABLESPACE ts_1
    ADD DATAFILE 'data_1.dat'
    USE LOGFILE GROUP lg_1
    INITIAL_SIZE 32M
    ENGINE NDB;

ALTER TABLESPACE ts_1
    ADD DATAFILE 'data_2.dat'
    INITIAL_SIZE 48M
    ENGINE NDB;
```

(Para mais informações sobre as instruções que acabaram de ser mostradas e os objetos criados por elas, consulte [Seção 21.6.11.1, “NDB Cluster Disk Data Objects”](mysql-cluster-disk-data-objects.html "21.6.11.1 NDB Cluster Disk Data Objects"), bem como [Seção 13.1.15, “Instrução CREATE LOGFILE GROUP”](create-logfile-group.html "13.1.15 CREATE LOGFILE GROUP Statement"), e [Seção 13.1.19, “Instrução CREATE TABLESPACE”](create-tablespace.html "13.1.19 CREATE TABLESPACE Statement").)

Agora podemos criar e popular uma versão da tabela `fish` que armazena 2 de suas colunas em disco (excluindo a versão anterior da tabela primeiro, se ela já existir):

```sql
CREATE TABLE fish (
    id INT(11) NOT NULL AUTO_INCREMENT,
    name VARCHAR(20) NOT NULL,
    length_mm INT(11) NOT NULL,
    weight_gm INT(11) NOT NULL,

    PRIMARY KEY pk (id),
    UNIQUE KEY uk (name)
) TABLESPACE ts_1 STORAGE DISK
ENGINE=NDB;

INSERT INTO fish VALUES
    (NULL, 'guppy', 35, 2), (NULL, 'tuna', 2500, 150000),
    (NULL, 'shark', 3000, 110000), (NULL, 'manta ray', 1500, 50000),
    (NULL, 'grouper', 900, 125000), (NULL ,'puffer', 250, 2500);
```

Quando executado contra esta versão da tabela, [**ndb_desc**] exibe a seguinte saída:

```sql
$> ./ndb_desc -c localhost fish -d test -p
-- fish --
Version: 1
Fragment type: HashMapPartition
K Value: 6
Min load factor: 78
Max load factor: 80
Temporary table: no
Number of attributes: 4
Number of primary keys: 1
Length of frm data: 346
Max Rows: 0
Row Checksum: 1
Row GCI: 1
SingleUserMode: 0
ForceVarPart: 1
PartitionCount: 2
FragmentCount: 2
FragmentCountType: ONE_PER_LDM_PER_NODE
ExtraRowGciBits: 0
ExtraRowAuthorBits: 0
TableStatus: Retrieved
Table options:
HashMap: DEFAULT-HASHMAP-3840-2
-- Attributes --
id Int PRIMARY KEY DISTRIBUTION KEY AT=FIXED ST=MEMORY AUTO_INCR
name Varchar(20;latin1_swedish_ci) NOT NULL AT=SHORT_VAR ST=MEMORY
length_mm Int NOT NULL AT=FIXED ST=DISK
weight_gm Int NOT NULL AT=FIXED ST=DISK
-- Indexes --
PRIMARY KEY(id) - UniqueHashIndex
PRIMARY(id) - OrderedIndex
uk(name) - OrderedIndex
uk$unique(name) - UniqueHashIndex
-- Per partition info --
Partition       Row count       Commit count    Frag fixed memory       Frag varsized memory    Extent_space    Free extent_space
0               2               2               32768                   32768                   1048576         1044440
1               4               4               32768                   32768                   1048576         1044400


NDBT_ProgramExit: 0 - OK
```

Isto significa que 1048576 bytes são alocados do tablespace para esta tabela em cada partição, dos quais 1044440 bytes permanecem livres para armazenamento adicional. Em outras palavras, 1048576 - 1044440 = 4136 bytes por partição estão sendo usados atualmente para armazenar os dados das colunas baseadas em disco desta tabela. O número de bytes mostrado como `Free extent_space` está disponível apenas para armazenar dados de coluna em disco da tabela `fish`; por esta razão, não é visível ao selecionar da tabela [`FILES`](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table") do Information Schema.

Para tabelas totalmente replicadas, [**ndb_desc**] mostra apenas os nós que contêm réplicas de fragmentos de partição primários; nós com réplicas de fragmentos de cópia (somente) são ignorados. Começando com o NDB 7.5.4, você pode obter tais informações, usando o cliente [**mysql**], das tabelas [`table_distribution_status`](mysql-cluster-ndbinfo-table-distribution-status.html "21.6.15.36 The ndbinfo table_distribution_status Table"), [`table_fragments`](mysql-cluster-ndbinfo-table-fragments.html "21.6.15.37 The ndbinfo table_fragments Table"), [`table_info`](mysql-cluster-ndbinfo-table-info.html "21.6.15.38 The ndbinfo table_info Table") e [`table_replicas`](mysql-cluster-ndbinfo-table-replicas.html "21.6.15.39 The ndbinfo table_replicas Table") no Database [`ndbinfo`](mysql-cluster-ndbinfo.html "21.6.15 ndbinfo: The NDB Cluster Information Database").

As opções que podem ser usadas com [**ndb_desc**] são mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 21.29 Opções de linha de comando usadas com o programa ndb_desc**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Formato</th> <th>Descrição</th> <th>Adicionada, Descontinuada ou Removida</th> </tr></thead><tbody><tr> <th><p> <code>--auto-inc</code>, </p><p> <code> -a </code> </p></th> <td>Mostra o próximo valor para a coluna AUTO_INCREMENT se a tabela tiver uma</td> <td><p> ADICIONADA: NDB 7.6.14 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--blob-info</code>, </p><p> <code> -b </code> </p></th> <td>Inclui informações de partição para tabelas BLOB na saída. Requer que a opção -p também seja usada</td> <td><p> (Suportada em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --character-sets-dir=path </code> </p></th> <td>Diretório contendo character sets</td> <td><p> (Suportada em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --connect-retries=# </code> </p></th> <td>Número de vezes para tentar novamente a conexão antes de desistir</td> <td><p> (Suportada em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --connect-retry-delay=# </code> </p></th> <td>Número de segundos de espera entre as tentativas de contato com o servidor de gerenciamento</td> <td><p> (Suportada em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--connect-string=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p> (Suportada em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--context</code>, </p><p> <code> -x </code> </p></th> <td>Mostra informações extras para a tabela, como Database, schema, nome e ID interno</td> <td><p> ADICIONADA: NDB 7.6.14 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --core-file </code> </p></th> <td>Escreve core file em caso de erro; usado na depuração</td> <td><p> (Suportada em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--database=name</code>, </p><p> <code> -d name </code> </p></th> <td>Nome do Database contendo a tabela</td> <td><p> (Suportada em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-extra-file=path </code> </p></th> <td>Lê o arquivo fornecido após a leitura dos arquivos globais</td> <td><p> (Suportada em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-file=path </code> </p></th> <td>Lê as opções default apenas do arquivo fornecido</td> <td><p> (Suportada em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-group-suffix=string </code> </p></th> <td>Também lê grupos com concat(group, suffix)</td> <td><p> (Suportada em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--extra-node-info</code>, </p><p> <code> -n </code> </p></th> <td>Inclui mapeamentos de partição para data node na saída; requer --extra-partition-info</td> <td><p> (Suportada em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--extra-partition-info</code>, </p><p> <code> -p </code> </p></th> <td>Exibe informações sobre partições</td> <td><p> (Suportada em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--help</code>, </p><p> <code> -? </code> </p></th> <td>Exibe texto de ajuda e sai</td> <td><p> (Suportada em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --login-path=path </code> </p></th> <td>Lê o path fornecido do login file</td> <td><p> (Suportada em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-connectstring=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>Define a connect string para conexão com ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Sobrescreve entradas em NDB_CONNECTSTRING e my.cnf</td> <td><p> (Suportada em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-mgmd-host=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p> (Suportada em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --ndb-nodeid=# </code> </p></th> <td>Define o ID de node para este node, sobrescrevendo qualquer ID definido por --ndb-connectstring</td> <td><p> (Suportada em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --ndb-optimized-node-selection </code> </p></th> <td>Habilita otimizações para seleção de nodes para transactions. Habilitado por default; use --skip-ndb-optimized-node-selection para desabilitar</td> <td><p> (Suportada em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --no-defaults </code> </p></th> <td>Não lê as opções default de nenhum arquivo de opção, exceto o login file</td> <td><p> (Suportada em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --print-defaults </code> </p></th> <td>Imprime a lista de argumentos do programa e sai</td> <td><p> (Suportada em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--retries=#</code>, </p><p> <code> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_retries">-r
                #</a> </code> </p></th> <td>Número de vezes para tentar novamente a conexão (uma vez por segundo)</td> <td><p> (Suportada em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--table=name</code>, </p><p> <code> -t name </code> </p></th> <td>Especifica a tabela na qual buscar um Index. Quando esta opção é usada, -p e -n não têm efeito e são ignoradas</td> <td><p> (Suportada em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--unqualified</code>, </p><p> <code> -u </code> </p></th> <td>Usa nomes de tabela não qualificados</td> <td><p> (Suportada em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--usage</code>, </p><p> <code> -? </code> </p></th> <td>Exibe texto de ajuda e sai; o mesmo que --help</td> <td><p> (Suportada em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--version</code>, </p><p> <code> -V </code> </p></th> <td>Exibe informações de versão e sai</td> <td><p> (Suportada em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody></table>

* `--auto-inc`, `-a`

  Mostra o próximo valor para a coluna `AUTO_INCREMENT` de uma tabela, se ela tiver uma.

* `--blob-info`, `-b`

  Inclui informações sobre colunas [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") e [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") subordinadas.

  O uso desta opção também requer o uso da opção [`--extra-partition-info`](mysql-cluster-programs-ndb-desc.html#option_ndb_desc_extra-partition-info) (`-p`).

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Diretório contendo character sets.

* `--connect-retries`

  <table frame="box" rules="all" summary="Properties for connect-retries"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Default</th> <td><code>12</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>12</code></td> </tr></tbody></table>

  Número de vezes para tentar novamente a conexão antes de desistir.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Default</th> <td><code>5</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>5</code></td> </tr></tbody></table>

  Número de segundos de espera entre as tentativas de contato com o servidor de gerenciamento.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for connect-string"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Default</th> <td><code>[none]</code></td> </tr></tbody></table>

  O mesmo que --ndb-connectstring.

* `--context`, `-x`

  Mostra informações contextuais adicionais para a tabela, como schema, nome do Database, nome da tabela e o ID interno da tabela.

* `--core-file`

  <table frame="box" rules="all" summary="Properties for core-file"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--core-file</code></td> </tr></tbody></table>

  Escreve core file em caso de erro; usado na depuração (debugging).

* `--database=db_name`, `-d`

  Especifica o Database no qual a tabela deve ser encontrada.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Default</th> <td><code>[none]</code></td> </tr></tbody></table>

  Lê o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for defaults-file"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--defaults-file=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Default</th> <td><code>[none]</code></td> </tr></tbody></table>

  Lê as opções default apenas do arquivo fornecido.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--defaults-group-suffix=string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Default</th> <td><code>[none]</code></td> </tr></tbody></table>

  Também lê grupos com concat(group, suffix).

* `--extra-node-info`, `-n`

  Inclui informações sobre os mapeamentos entre partições de tabela e os data nodes nos quais elas residem. Esta informação pode ser útil para verificar mecanismos de distribuição awareness e suportar um acesso à aplicação mais eficiente aos dados armazenados no NDB Cluster.

  O uso desta opção também requer o uso da opção [`--extra-partition-info`](mysql-cluster-programs-ndb-desc.html#option_ndb_desc_extra-partition-info) (`-p`).

* `--extra-partition-info`, `-p`

  Imprime informações adicionais sobre as partições da tabela.

* `--help`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Exibe texto de ajuda e sai.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Lê o path fornecido do login file.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Define a connect string para conexão com ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Sobrescreve entradas em NDB_CONNECTSTRING e my.cnf.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  O mesmo que --ndb-connectstring.

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Define o ID de node para este node, sobrescrevendo qualquer ID definido por --ndb-connectstring.

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Habilita otimizações para seleção de nodes para transactions. Habilitado por default; use `--skip-ndb-optimized-node-selection` para desabilitar.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Não lê as opções default de nenhum arquivo de opção, exceto o login file.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Imprime a lista de argumentos do programa e sai.

* `--retries=#`, `-r`

  Tenta conectar-se este número de vezes antes de desistir. Uma tentativa de conexão é feita por segundo.

* `--table=tbl_name`, `-t`

  Especifica a tabela na qual buscar um Index.

* `--unqualified`, `-u`

  Usa nomes de tabela não qualificados.

* `--usage`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Exibe texto de ajuda e sai; o mesmo que --help.

* `--version`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Exibe informações de versão e sai.

No NDB 7.5.3 e posterior, os Indexes de tabela listados na saída são ordenados por ID. Anteriormente, isso não era determinístico e podia variar entre plataformas. (Bug #81763, Bug #23547742)