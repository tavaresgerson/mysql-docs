### 25.5.9 ndb_desc — Descrever Tabelas NDB

O **ndb_desc** fornece uma descrição detalhada de uma ou mais tabelas `NDB`.

#### Uso

```
ndb_desc -c connection_string tbl_name -d db_name [options]

ndb_desc -c connection_string index_name -d db_name -t tbl_name
```

As opções adicionais que podem ser usadas com **ndb_desc** estão listadas mais adiante nesta seção.

#### Saída de Exemplo

Declarações de criação e população de tabelas MySQL:

```
USE test;

CREATE TABLE fish (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(20) NOT NULL,
    length_mm INT NOT NULL,
    weight_gm INT NOT NULL,

    PRIMARY KEY pk (id),
    UNIQUE KEY uk (name)
) ENGINE=NDB;

INSERT INTO fish VALUES
    (NULL, 'guppy', 35, 2), (NULL, 'tuna', 2500, 150000),
    (NULL, 'shark', 3000, 110000), (NULL, 'manta ray', 1500, 50000),
    (NULL, 'grouper', 900, 125000), (NULL ,'puffer', 250, 2500);
```

Saída do **ndb_desc**:

```
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
```

Informações sobre múltiplas tabelas podem ser obtidas em uma única invocação do **ndb_desc** usando seus nomes, separados por espaços. Todas as tabelas devem estar no mesmo banco de dados.

Você pode obter informações adicionais sobre um índice específico usando a opção `--table` (forma abreviada: `-t`) e fornecendo o nome do índice como o primeiro argumento para **ndb_desc**, como mostrado aqui:

```
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
```

Quando um índice é especificado dessa maneira, as opções `--extra-partition-info` e `--extra-node-info` não têm efeito.

A coluna `Version` na saída contém a versão do objeto de esquema da tabela. Para informações sobre a interpretação desse valor, consulte Objetos de Esquema NDB.

Três das propriedades da tabela que podem ser definidas usando comentários `NDB_TABLE` embutidos em declarações `CREATE TABLE` e `ALTER TABLE` são também visíveis na saída do **ndb_desc**. O `FRAGMENT_COUNT_TYPE` da tabela é sempre mostrado na coluna `FragmentCountType`. `READ_ONLY` e `FULLY_REPLICATED`, se definidos para 1, são mostrados na coluna `Table options`. Você pode ver isso após executar a seguinte declaração `ALTER TABLE` no cliente **mysql**:

```
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

O aviso é emitido porque `READ_ONLY=1` exige que o tipo de contagem de fragmentos da tabela seja (ou seja definido para) `ONE_PER_LDM_PER_NODE_GROUP`; o `NDB` define isso automaticamente nesses casos. Você pode verificar que a declaração `ALTER TABLE` teve o efeito desejado usando `SHOW CREATE TABLE`:

```
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
) ENGINE=ndbcluster DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
COMMENT='NDB_TABLE=READ_BACKUP=1,FULLY_REPLICATED=1'
1 row in set (0.01 sec)
```

Como o `FRAGMENT_COUNT_TYPE` não foi definido explicitamente, seu valor não é exibido no texto do comentário impresso pelo `SHOW CREATE TABLE`. O **ndb_desc**, no entanto, exibe o valor atualizado para esse atributo. A coluna `Opções da tabela` mostra as propriedades binárias que foram habilitadas. Você pode ver isso na saída mostrada aqui (texto destacado):

```
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
```

Para obter mais informações sobre essas propriedades da tabela, consulte a Seção 15.1.24.12, “Definindo opções de comentário NDB”.

As colunas `Extent_space` e `Free extent_space` são aplicáveis apenas a tabelas `NDB` que têm colunas no disco; para tabelas que têm apenas colunas de memória, essas colunas sempre contêm o valor `0`.

Para ilustrar seu uso, modificamos o exemplo anterior. Primeiro, devemos criar os objetos de Dados de Disco necessários, como mostrado aqui:

```
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

(Para mais informações sobre as declarações mostradas e os objetos criados por elas, consulte a Seção 25.6.11.1, “Objetos de Dados de Disco de NDB Cluster”, bem como a Seção 15.1.20, “Declaração CREATE LOGFILE GROUP” e a Seção 15.1.25, “Declaração CREATE TABLESPACE”.)

Agora podemos criar e preencher uma versão da tabela `fish` que armazena 2 de suas colunas no disco (excluindo a versão anterior da tabela, se ela já existir):

```
DROP TABLE IF EXISTS fish;

CREATE TABLE fish (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(20) NOT NULL,
    length_mm INT NOT NULL,
    weight_gm INT NOT NULL,

    PRIMARY KEY pk (id),
    UNIQUE KEY uk (name)
) TABLESPACE ts_1 STORAGE DISK
ENGINE=NDB;

INSERT INTO fish VALUES
    (NULL, 'guppy', 35, 2), (NULL, 'tuna', 2500, 150000),
    (NULL, 'shark', 3000, 110000), (NULL, 'manta ray', 1500, 50000),
    (NULL, 'grouper', 900, 125000), (NULL ,'puffer', 250, 2500);
```

Quando executado contra essa versão da tabela, o **ndb_desc** exibe a seguinte saída:

```
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
Length of frm data: 1001
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
Table options: readbackup
HashMap: DEFAULT-HASHMAP-3840-2
Tablespace id: 16
Tablespace: ts_1
-- Attributes --
id Int PRIMARY KEY DISTRIBUTION KEY AT=FIXED ST=MEMORY AUTO_INCR
name Varchar(80;utf8mb4_0900_ai_ci) NOT NULL AT=SHORT_VAR ST=MEMORY
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
```

Isso significa que 1048576 bytes são alocados do espaço de tabelas para essa tabela em cada partição, dos quais 1044440 bytes permanecem livres para armazenamento adicional. Em outras palavras, 1048576 - 1044440 = 4136 bytes por partição estão atualmente sendo usados para armazenar os dados das colunas baseadas em disco dessa tabela. O número de bytes exibido como `Espaço de extensão livre` está disponível para armazenamento de dados de colunas em disco da tabela `fish`; por esse motivo, ele não é visível ao selecionar a partir da tabela do Schema de Informações `FILES`.

`ID do espaço de tabelas` e `Espaço de tabela` também são exibidos para tabelas de Dados de Disco.

Para tabelas totalmente replicadas, **ndb_desc** mostra apenas os nós que contêm réplicas de fragmentos de partição primária; nós com réplicas de fragmentos de cópia (somente) são ignorados. Você pode obter essas informações, usando o cliente **mysql**, a partir das tabelas `table_distribution_status`, `table_fragments`, `table_info` e `table_replicas` no banco de dados `ndbinfo`.

Todas as opções que podem ser usadas com **ndb_desc** são mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

* `--auto-inc`, `-a`

  Mostrar o próximo valor para a coluna `AUTO_INCREMENT` de uma tabela, se ela tiver um.

* `--blob-info`, `-b`

  Incluir informações sobre colunas subordinadas `BLOB` e `TEXT`.

  O uso desta opção também requer o uso da opção `--extra-partition-info` (`-p`).

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--character-sets-dir=caminho</code></td> </tr></tbody></table>

  Diretório contendo conjuntos de caracteres.

* `--connect-retries`

<table frame="box" rules="all" summary="Propriedades para connect-retries">
  <tr><th>Formato de linha de comando</th> <td><code>--connect-retries=#</code></td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor padrão</th> <td><code>12</code></td> </tr>
  <tr><th>Valor mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor máximo</th> <td><code>12</code></td> </tr>
</table>

  Número de vezes para tentar a conexão novamente antes de desistir.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Propriedades para connect-retry-delay">
    <tr><th>Formato de linha de comando</th> <td><code>--connect-retry-delay=#</code></td> </tr>
    <tr><th>Tipo</th> <td>Inteiro</td> </tr>
    <tr><th>Valor padrão</th> <td><code>5</code></td> </tr>
    <tr><th>Valor mínimo</th> <td><code>0</code></td> </tr>
    <tr><th>Valor máximo</th> <td><code>5</code></td> </tr>
  </table>

  Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento.

* `--connect-string`

  <table frame="box" rules="all" summary="Propriedades para connect-string">
    <tr><th>Formato de linha de comando</th> <td><code>--connect-string=connection_string</code></td> </tr>
    <tr><th>Tipo</th> <td>String</td> </tr>
    <tr><th>Valor padrão</th> <td><code>[none]</code></td> </tr>
  </table>

  O mesmo que `--ndb-connectstring`.

* `--context`, `-x`

  Mostrar informações contextuais adicionais para a tabela, como esquema, nome do banco de dados, nome da tabela e ID interno da tabela.

* `--core-file`

<table frame="box" rules="all" summary="Propriedades para o arquivo de configuração">
  <tr><th>Formato de linha de comando</th> <td><code>--arquivo-de-configuração</code></td> </tr>
</table>

Escrever o arquivo de configuração em caso de erro; usado em depuração.

* `--database=nome_do_banco`, `-d`

Especificar o banco de dados em que a tabela deve ser encontrada.

* `--defaults-extra-file`

<table frame="box" rules="all" summary="Propriedades para defaults-extra-file"><tbody>
  <tr><th>Formato de linha de comando</th> <td><code>--defaults-extra-file=caminho</code></td> </tr>
  <tr><th>Tipo</th> <td>String</td> </tr>
  <tr><th>Valor padrão</th> <td><code>[nenhum]</code></td> </tr>
</tbody></table>

Ler o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-file`

<table frame="box" rules="all" summary="Propriedades para defaults-file"><tbody>
  <tr><th>Formato de linha de comando</th> <td><code>--defaults-file=caminho</code></td> </tr>
  <tr><th>Tipo</th> <td>String</td> </tr>
  <tr><th>Valor padrão</th> <td><code>[nenhum]</code></td> </tr>
</tbody></table>

Ler as opções padrão do arquivo fornecido apenas.

* `--defaults-group-suffix`

<table frame="box" rules="all" summary="Propriedades para defaults-group-suffix"><tbody>
  <tr><th>Formato de linha de comando</th> <td><code>--defaults-group-suffix=string</code></td> </tr>
  <tr><th>Tipo</th> <td>String</td> </tr>
  <tr><th>Valor padrão</th> <td><code>[nenhum]</code></td> </tr>
</tbody></table>

Também ler grupos com concatenação (grupo, sufixo).

* `--extra-node-info`, `-n`

Inclua informações sobre as mapeiações entre as partições da tabela e os nós de dados nos quais elas residem. Essas informações podem ser úteis para verificar mecanismos de conscientização sobre a distribuição e suportar o acesso mais eficiente das aplicações aos dados armazenados no NDB Cluster.

O uso desta opção também requer o uso da opção `--extra-partition-info` (`-p`).

* `--extra-partition-info`, `-p`

Imprima informações adicionais sobre as partições da tabela.

* `--help`

<table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></tbody></table>

Exibir texto de ajuda e sair.

* `--login-path`

<table frame="box" rules="all" summary="Propriedades para login-path"><tbody><tr><th>Formato de linha de comando</th> <td><code>--login-path=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

Ler o caminho fornecido a partir do arquivo de login.

* `--no-login-paths`

<table frame="box" rules="all" summary="Propriedades para tentativas de conexão"><tbody><tr><th>Formato de linha de comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>12</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>12</code></td> </tr></tbody></table>

Ignorar a leitura de opções a partir do arquivo de caminho de login.

* `--ndb-connectstring`

<table frame="box" rules="all" summary="Propriedades para connect-retries">
  <tr><th>Formato de Linha de Comando</th> <td><code>--connect-retries=#</code></td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>12</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>12</code></td> </tr>
</table>

  Defina a string de conexão para a conexão com o **ndb_mgmd**. Sintaxe: `[nodeid=id;][host=]hostname[:port]`. Sobrina as entradas em `NDB_CONNECTSTRING` e `my.cnf`.

* `--ndb-mgm-tls`

  <table frame="box" rules="all" summary="Propriedades para connect-retries">
    <tr><th>Formato de Linha de Comando</th> <td><code>--connect-retries=#</code></td> </tr>
    <tr><th>Tipo</th> <td>Inteiro</td> </tr>
    <tr><th>Valor Padrão</th> <td><code>12</code></td> </tr>
    <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
    <tr><th>Valor Máximo</th> <td><code>12</code></td> </tr>
  </table>

  Define o nível de suporte TLS necessário para se conectar ao servidor de gerenciamento; um dos `relaxed` ou `strict`. `relaxed` (o padrão) significa que uma conexão TLS é tentada, mas o sucesso não é necessário; `strict` significa que o TLS é necessário para se conectar.

* `--ndb-mgmd-host`

<table frame="box" rules="all" summary="Propriedades para connect-retries">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--connect-retries=#</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code>12</code></td>
  </tr>
  <tr>
    <th>Valor mínimo</th>
    <td><code>0</code></td>
  </tr>
  <tr>
    <th>Valor máximo</th>
    <td><code>12</code></td>
  </tr>
  </table>
3

  O mesmo que `--ndb-connectstring`.

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Propriedades para connect-retries">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code>--connect-retries=#</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>Inteiro</td>
    </tr>
    <tr>
      <th>Valor padrão</th>
      <td><code>12</code></td>
    </tr>
    <tr>
      <th>Valor mínimo</th>
      <td><code>0</code></td>
    </tr>
    <tr>
      <th>Valor máximo</th>
      <td><code>12</code></td>
    </tr>
  </table>
4

  Defina o ID do nó para este nó, substituindo qualquer ID definido por `--ndb-connectstring`.

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Propriedades para connect-retries">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code>--connect-retries=#</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>Inteiro</td>
    </tr>
    <tr>
      <th>Valor padrão</th>
      <td><code>12</code></td>
    </tr>
    <tr>
      <th>Valor mínimo</th>
      <td><code>0</code></td>
    </tr>
    <tr>
      <th>Valor máximo</th>
      <td><code>12</code></td>
    </tr>
  </table>
5

Habilitar otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

* `--ndb-tls-search-path`

  <table frame="box" rules="all" summary="Propriedades para retries de conexão"><tr><th>Formato de linha de comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>12</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>12</code></td> </tr> </tbody></table>

  Especificar uma lista de diretórios para procurar um arquivo CA. Em plataformas Unix, os nomes dos diretórios são separados por colchetes (`:`); em sistemas Windows, o caractere ponto e vírgula (`;`) é usado como separador. Uma referência de diretório pode ser relativa ou absoluta; pode conter uma ou mais variáveis de ambiente, cada uma denotada por um sinal de dólar prefixado (`$`), e expandida antes de ser usada.

  A busca começa com o diretório mais à esquerda nomeado e prossegue de esquerda para direita até que um arquivo seja encontrado. Uma string vazia denota um caminho de busca vazio, o que faz com que todas as buscas falhem. Uma string composta por um único ponto (`.`) indica que o caminho de busca é limitado ao diretório de trabalho atual.

  Se não for fornecido um caminho de busca, o valor padrão embutido é usado. Esse valor depende da plataforma usada: em Windows, é `\ndb-tls`; em outras plataformas (incluindo Linux), é `$HOME/ndb-tls`. Isso pode ser substituído compilando o NDB Cluster usando `-DWITH_NDB_TLS_SEARCH_PATH`.

* `--no-defaults`

<table frame="box" rules="all" summary="Propriedades para connect-retries">
  <tr><th>Formato de linha de comando</th> <td><code>--connect-retries=#</code></td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor padrão</th> <td><code>12</code></td> </tr>
  <tr><th>Valor mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor máximo</th> <td><code>12</code></td> </tr>
</table>

  Não leia opções padrão de nenhum arquivo de opção, exceto o arquivo de login.

* `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para connect-retries">
    <tr><th>Formato de linha de comando</th> <td><code>--connect-retries=#</code></td> </tr>
    <tr><th>Tipo</th> <td>Inteiro</td> </tr>
    <tr><th>Valor padrão</th> <td><code>12</code></td> </tr>
    <tr><th>Valor mínimo</th> <td><code>0</code></td> </tr>
    <tr><th>Valor máximo</th> <td><code>12</code></td> </tr>
  </table>

  Imprima a lista de argumentos do programa e saia.

* `--retries=#`, `-r`

  Tente se conectar quantas vezes forem necessárias antes de desistir. Uma tentativa de conexão é feita por segundo.

* `--table=tbl_name`, `-t`

  Especifique a tabela em que procurar um índice.

* `--unqualified`, `-u`

  Use nomes de tabela não qualificados.

* `--usage`

<table frame="box" rules="all" summary="Propriedades para connect-retries">
  <tr><th>Formato de linha de comando</th> <td><code>--connect-retries=#</code></td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor padrão</th> <td><code>12</code></td> </tr>
  <tr><th>Valor mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor máximo</th> <td><code>12</code></td> </tr>
</table>

9 Exibir texto de ajuda e sair; o mesmo que `--help`.

* `--version`

<table frame="box" rules="all" summary="Propriedades para connect-retry-delay">
  <tr><th>Formato de linha de comando</th> <td><code>--connect-retry-delay=#</code></td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor padrão</th> <td><code>5</code></td> </tr>
  <tr><th>Valor mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor máximo</th> <td><code>5</code></td> </tr>
</table>

Os índices da tabela listados na saída estão ordenados por ID.