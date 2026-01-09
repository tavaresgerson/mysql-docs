### 21.5.10 ndb\_desc — Descreva as tabelas NDB

**ndb\_desc** fornece uma descrição detalhada de uma ou mais tabelas de `NDB`.

#### Uso

```sql
ndb_desc -c connection_string tbl_name -d db_name [options]

ndb_desc -c connection_string index_name -d db_name -t tbl_name
```

As opções adicionais que podem ser usadas com **ndb\_desc** estão listadas mais adiante nesta seção.

#### Saída de amostra

Declarações de criação e população de tabelas MySQL:

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

Saída de **ndb\_desc**:

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

Informações sobre várias tabelas podem ser obtidas em uma única invocação de **ndb\_desc** usando seus nomes, separados por espaços. Todas as tabelas devem estar no mesmo banco de dados.

Você pode obter informações adicionais sobre um índice específico usando a opção `--table` (forma abreviada: `-t`) e fornecendo o nome do índice como o primeiro argumento para **ndb\_desc**, conforme mostrado aqui:

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

Quando um índice é especificado dessa maneira, as opções `--extra-partition-info` e `--extra-node-info` não têm efeito.

A coluna `Version` no resultado contém a versão do objeto do esquema da tabela. Para obter informações sobre como interpretar esse valor, consulte Versões de Objetos do Esquema do NDB.

Três das propriedades da tabela que podem ser definidas usando comentários `NDB_TABLE` embutidos nas instruções `CREATE TABLE` e `ALTER TABLE` também são visíveis na saída de **ndb\_desc**. O `FRAGMENT_COUNT_TYPE` da tabela é sempre exibido na coluna `FragmentCountType`. `READ_ONLY` e `FULLY_REPLICATED`, se definidos para 1, são exibidos na coluna `Table options`. Você pode ver isso após executar a seguinte instrução `ALTER TABLE` no cliente **mysql**:

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

O aviso é emitido porque `READ_ONLY=1` exige que o tipo de contagem de fragmentos da tabela seja (ou seja definido como) `ONE_PER_LDM_PER_NODE_GROUP`; o `NDB` define isso automaticamente nesses casos. Você pode verificar que a instrução `ALTER TABLE` teve o efeito desejado usando `SHOW CREATE TABLE`:

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

Como o `FRAGMENT_COUNT_TYPE` não foi definido explicitamente, seu valor não é exibido no texto do comentário impresso pelo `SHOW CREATE TABLE`. **ndb\_desc**, no entanto, exibe o valor atualizado para este atributo. A coluna `Opções da tabela` mostra as propriedades binárias que foram habilitadas. Você pode ver isso na saída mostrada aqui (texto destacado):

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

Para obter mais informações sobre essas propriedades da tabela, consulte Seção 13.1.18.9, “Definindo opções de comentário NDB”.

As colunas `Extent_space` e `Free extent_space` são aplicáveis apenas a tabelas `NDB` que possuem colunas no disco; para tabelas que possuem apenas colunas de memória, essas colunas sempre contêm o valor `0`.

Para ilustrar seu uso, modificamos o exemplo anterior. Primeiro, devemos criar os objetos de Dados de Disco necessários, conforme mostrado aqui:

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

(Para mais informações sobre as declarações mostradas e os objetos criados por elas, consulte Seção 21.6.11.1, “Objetos de dados de disco do NDB Cluster”, bem como Seção 13.1.15, “Declaração CREATE LOGFILE GROUP” e Seção 13.1.19, “Declaração CREATE TABLESPACE”.)

Agora podemos criar e povoar uma versão da tabela `fish` que armazena 2 de suas colunas no disco (excluindo a versão anterior da tabela, se ela já existir):

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

Quando executado contra esta versão da tabela, **ndb\_desc** exibe a seguinte saída:

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

Isso significa que 1048576 bytes são alocados do espaço de tabelas para esta tabela em cada partição, dos quais 1044440 bytes permanecem livres para armazenamento adicional. Em outras palavras, 1048576 - 1044440 = 4136 bytes por partição estão atualmente sendo usados para armazenar os dados das colunas baseadas em disco desta tabela. O número de bytes exibido como `Espaço de extensão livre` está disponível para armazenamento de dados de coluna em disco da tabela `fish` apenas; por essa razão, ele não é visível ao selecionar a tabela do Schema de Informações `FILES`.

Para tabelas totalmente replicadas, **ndb\_desc** mostra apenas os nós que contêm réplicas de fragmentos de partição primária; os nós com réplicas de fragmentos de cópia (somente) são ignorados. A partir do NDB 7.5.4, você pode obter essas informações, usando o cliente **mysql**, nas tabelas `**table_distribution_status**`, `**table_fragments**`, `**table_info**` e `**table_replicas**` no banco de dados `**ndbinfo**`.

As opções que podem ser usadas com **ndb\_desc** estão mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 21.29 Opções de linha de comando usadas com o programa ndb\_desc**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th scope="col">Formato</th> <th scope="col">Descrição</th> <th scope="col">Adicionado, Descontinuado ou Removido</th> </tr></thead><tbody><tr> <th scope="row"><p>[[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_context">-x</a> </code>],</p><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_context">-x</a> </code>] </p></th> <td>Mostre o próximo valor para a coluna AUTO_INCREMENT se a tabela tiver uma</td> <td><p>ADICIONADO: NDB 7.6.14</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[PH_HTML_CODE_<code class="option"><a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_database">--database=name</a></code>],</p><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_database">-d name</a> </code>] </p></th> <td>Incluir informações de partição para tabelas BLOB no resultado. Requer que a opção -p também seja usada</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_defaults-extra-file">--defaults-extra-file=path</a> </code>] </p></th> <td>Diretório contendo conjuntos de caracteres</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_defaults-file">--defaults-file=path</a> </code>] </p></th> <td>Número de vezes para tentar a conexão novamente antes de desistir</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_defaults-group-suffix">--defaults-group-suffix=string</a> </code>] </p></th> <td>Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[PH_HTML_CODE_<code class="option"><a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_extra-node-info">--extra-node-info</a></code>],</p><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_extra-node-info">-n</a> </code>] </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[PH_HTML_CODE_<code class="option"><a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_extra-partition-info">--extra-partition-info</a></code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_context">-x</a> </code>]] </p></th> <td>Mostre informações extras para a tabela, como banco de dados, esquema, nome e ID interno</td> <td><p>ADICIONADO: NDB 7.6.14</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_auto-inc">-a</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_context">-x</a> </code>] </p></th> <td>Escreva o arquivo de núcleo em erro; usado no depuração</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_database">--database=name</a></code>]],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_database">-d name</a> </code>]] </p></th> <td>Nome do banco de dados que contém a tabela</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_defaults-extra-file">--defaults-extra-file=path</a> </code>]] </p></th> <td>Leia o arquivo fornecido após os arquivos globais terem sido lidos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_defaults-file">--defaults-file=path</a> </code>]] </p></th> <td>Ler opções padrão a partir do arquivo fornecido apenas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_defaults-group-suffix">--defaults-group-suffix=string</a> </code>]] </p></th> <td>Leia também grupos com concatenação(grupo, sufixo)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_extra-node-info">--extra-node-info</a></code>]],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_extra-node-info">-n</a> </code>]] </p></th> <td>Incluir mapeamentos de partição para nó de dados no resultado; requer --extra-partition-info</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_extra-partition-info">--extra-partition-info</a></code>]],</p><p> [[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_blob-info">--blob-info</a></code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_context">-x</a> </code>] </p></th> <td>Exibir informações sobre partições</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_blob-info">--blob-info</a></code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_context">-x</a> </code>],</p><p> [[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_blob-info">--blob-info</a></code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_database">--database=name</a></code>] </p></th> <td>Exibir texto de ajuda e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_blob-info">--blob-info</a></code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_database">-d name</a> </code>] </p></th> <td>Leia o caminho fornecido a partir do arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_blob-info">--blob-info</a></code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_defaults-extra-file">--defaults-extra-file=path</a> </code>],</p><p> [[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_blob-info">--blob-info</a></code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_defaults-file">--defaults-file=path</a> </code>] </p></th> <td>Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:por<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_context">-x</a> </code>". Substitui as entradas no NDB_CONNECTSTRING e no my.cnf</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_blob-info">--blob-info</a></code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_defaults-group-suffix">--defaults-group-suffix=string</a> </code>],</p><p> [[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_blob-info">--blob-info</a></code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_extra-node-info">--extra-node-info</a></code>] </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_blob-info">--blob-info</a></code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_extra-node-info">-n</a> </code>] </p></th> <td>Defina o ID do nó para este nó, substituindo qualquer ID definida pela opção --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_blob-info">--blob-info</a></code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_extra-partition-info">--extra-partition-info</a></code>] </p></th> <td>Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use --skip-ndb-optimized-node-selection para desativá-lo</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_blob-info">-b</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_context">-x</a> </code>] </p></th> <td>Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_blob-info">-b</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_context">-x</a> </code>] </p></th> <td>Imprimir a lista de argumentos do programa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_blob-info">-b</a> </code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_database">--database=name</a></code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_blob-info">-b</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_database">-d name</a> </code>] </p></th> <td>Número de vezes para tentar a conexão novamente (uma vez por segundo)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_blob-info">-b</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_defaults-extra-file">--defaults-extra-file=path</a> </code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_blob-info">-b</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_defaults-file">--defaults-file=path</a> </code>] </p></th> <td>Especifique a tabela em que deseja encontrar um índice. Quando esta opção é usada, -p e -n não têm efeito e são ignorados.</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_blob-info">-b</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_defaults-group-suffix">--defaults-group-suffix=string</a> </code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_blob-info">-b</a> </code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_extra-node-info">--extra-node-info</a></code>] </p></th> <td>Use nomes de tabelas não qualificados</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_blob-info">-b</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_extra-node-info">-n</a> </code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_blob-info">-b</a> </code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_extra-partition-info">--extra-partition-info</a></code>] </p></th> <td>Exibir texto de ajuda e sair; o mesmo que --help</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_character-sets-dir">--character-sets-dir=path</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_context">-x</a> </code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_character-sets-dir">--character-sets-dir=path</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_context">-x</a> </code>] </p></th> <td>Exibir informações da versão e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody></table>

- `--auto-inc`, `-a`

  Mostre o próximo valor para a coluna `AUTO_INCREMENT` de uma tabela, se ela tiver uma.

- `--blob-info`, `-b`

  Inclua informações sobre as colunas subordinadas `BLOB` e `TEXT` (blob.html).

  O uso desta opção também requer o uso da opção `--extra-partition-info` (`-p`).

- `--character-sets-dir`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>

  Diretório contendo conjuntos de caracteres.

- `--connect-retries`

  <table frame="box" rules="all" summary="Propriedades para tentativas de conexão de reposição"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--connect-retries=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">12</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">12</code>]]</td> </tr></tbody></table>

  Número de vezes para tentar a conexão novamente antes de desistir.

- `--connect-retry-delay`

  <table frame="box" rules="all" summary="Propriedades para connect-retry-delay"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--connect-retry-delay=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">5</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">5</code>]]</td> </tr></tbody></table>

  Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento.

- `--connect-string`

  <table frame="box" rules="all" summary="Propriedades para a string de conexão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--connect-string=connection_string</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>

  O mesmo que --ndb-connectstring.

- `--context`, `-x`

  Mostre informações contextuais adicionais para a tabela, como esquema, nome do banco de dados, nome da tabela e ID interno da tabela.

- `--core-file`

  <table frame="box" rules="all" summary="Propriedades para arquivo de núcleo"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--core-file</code>]]</td> </tr></tbody></table>

  Escreva o arquivo de núcleo em erro; usado no depuração.

- `--database=db_name`, `-d`

  Especifique o banco de dados em que a tabela deve ser encontrada.

- `--defaults-extra-file`

  <table frame="box" rules="all" summary="Propriedades para defaults-extra-file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--defaults-extra-file=path</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>

  Leia o arquivo fornecido após a leitura dos arquivos globais.

- `--defaults-file`

  <table frame="box" rules="all" summary="Propriedades para arquivo de falhas"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--defaults-file=path</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>

  Leia as opções padrão do arquivo fornecido.

- `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Propriedades para defaults-group-suffix"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--defaults-group-suffix=string</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>

  Leia também grupos com concatenação (grupo, sufixo).

- `--extra-node-info`, `-n`

  Inclua informações sobre as mapeiações entre as partições da tabela e os nós de dados nos quais elas residem. Essas informações podem ser úteis para verificar os mecanismos de conscientização da distribuição e suportar o acesso mais eficiente das aplicações aos dados armazenados no NDB Cluster.

  O uso desta opção também requer o uso da opção `--extra-partition-info` (`-p`).

- `--extra-partition-info`, `-p`

  Imprima informações adicionais sobre as partições da tabela.

- `--help`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--help</code>]]</td> </tr></tbody></table>

  Exibir texto de ajuda e sair.

- `--login-path`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>0

  Leia o caminho fornecido a partir do arquivo de login.

- `--ndb-connectstring`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>1

  Defina a string de conexão para se conectar ao ndb\_mgmd. Sintaxe: "\[nodeid=id;]\[host=]hostname\[:port]". Oculte entradas no NDB\_CONNECTSTRING e no my.cnf.

- `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>2

  O mesmo que --ndb-connectstring.

- `--ndb-nodeid`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>3

  Defina o ID do nó para este nó, substituindo qualquer ID definida pela opção --ndb-connectstring.

- `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>4

  Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

- `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>5

  Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login.

- `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>6

  Imprima a lista de argumentos do programa e saia.

- `--retries=#`, `-r`

  Tente se conectar várias vezes antes de desistir. Uma tentativa de conexão é feita a cada segundo.

- `--table=tbl_name`, `-t`

  Especifique a tabela em que procurar um índice.

- `--unqualified`, `-u`

  Use nomes de tabelas não qualificados.

- `--usage`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>7

  Exibir texto de ajuda e sair; o mesmo que --help.

- `--version`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>8

  Exibir informações da versão e sair.

No NDB 7.5.3 e versões posteriores, os índices de tabela listados na saída são ordenados por ID. Anteriormente, isso não era determinístico e podia variar entre plataformas. (Bug #81763, Bug #23547742)
