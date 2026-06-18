#### 15.1.20.12 Configurando as Opções de Comentário do NDB

- Opções de NDB\_COLUMN
- Opções da Tabela NDB

É possível definir uma série de opções específicas para o NDB Cluster na tabela de comentários ou nos comentários das colunas de uma tabela `NDB`. Opções de nível de tabela para controlar a leitura de qualquer replica e o equilíbrio de partições podem ser incorporadas em um comentário de tabela usando `NDB_TABLE`.

`NDB_COLUMN` pode ser usado em um comentário de coluna para definir o tamanho da coluna da tabela de partes do blob usada para armazenar partes dos valores do blob por `NDB` até seu máximo. Isso funciona para as colunas `BLOB`, `MEDIUMBLOB`, `LONGBLOB`, `TEXT`, `MEDIUMTEXT`, `LONGTEXT` e `JSON`. A partir do NDB 8.0.30, um comentário de coluna também pode ser usado para controlar o tamanho em linha de uma coluna de blob. Os comentários `NDB_COLUMN` não suportam as colunas `TINYBLOB` ou `TINYTEXT`, pois essas têm uma parte em linha (apenas) de tamanho fixo e nenhuma parte separada para armazenar em outro lugar.

`NDB_TABLE` pode ser usado em um comentário de tabela para definir opções relacionadas ao equilíbrio da partição e se a tabela é totalmente replicada, entre outras.

O restante desta seção descreve essas opções e seu uso.

##### Opções de NDB\_COLUMN

No NDB Cluster, um comentário de coluna em uma declaração `CREATE TABLE` ou `ALTER TABLE` também pode ser usado para especificar uma opção `NDB_COLUMN`. A partir da versão 8.0.30, o `NDB` suporta duas opções de comentário de coluna `BLOB_INLINE_SIZE` e `MAX_BLOB_PART_SIZE`. (Antes do NDB 8.0.30, apenas o `MAX_BLOB_PART_SIZE` era suportado.) A sintaxe para essa opção é mostrada aqui:

```
COMMENT 'NDB_COLUMN=speclist'

speclist := spec[,spec]

spec :=
    BLOB_INLINE_SIZE=value
  | MAX_BLOB_PART_SIZE[={0|1}]
```

`BLOB_INLINE_SIZE` especifica o número de bytes a serem armazenados inline pelo campo; seu valor esperado é um inteiro no intervalo de 1 a 29980, inclusive. Definir um valor maior que 29980 gera um erro; definir um valor menor que 1 é permitido, mas faz com que o tamanho inline padrão para o tipo de campo seja usado.

Você deve estar ciente de que o valor máximo para essa opção é, na verdade, o número máximo de bytes que podem ser armazenados em uma única linha de uma tabela `NDB`; cada coluna na linha contribui para esse total.

Além disso, lembre-se, especialmente ao trabalhar com colunas `TEXT`, que o valor definido por `MAX_BLOB_PART_SIZE` ou `BLOB_INLINE_SIZE` representa o tamanho da coluna em bytes. Isso não indica o número de caracteres, que varia de acordo com o conjunto de caracteres e a ordenação usados pela coluna.

Para ver os efeitos dessa opção, crie primeiro uma tabela com duas colunas `BLOB`, uma (`b1`) sem opções extras e outra (`b2`) com uma configuração para `BLOB_INLINE_SIZE`, conforme mostrado aqui:

```
mysql> CREATE TABLE t1 (
    ->    a INT NOT NULL PRIMARY KEY,
    ->    b1 BLOB,
    ->    b2 BLOB COMMENT 'NDB_COLUMN=BLOB_INLINE_SIZE=8000'
    ->  ) ENGINE NDB;
Query OK, 0 rows affected (0.32 sec)
```

Você pode ver as configurações do `BLOB_INLINE_SIZE` para as colunas `BLOB` consultando a tabela `ndbinfo.blobs`, da seguinte forma:

```
mysql> SELECT
    ->   column_name AS 'Column Name',
    ->   inline_size AS 'Inline Size',
    ->   part_size AS 'Blob Part Size'
    -> FROM ndbinfo.blobs
    -> WHERE table_name = 't1';
+-------------+-------------+----------------+
| Column Name | Inline Size | Blob Part Size |
+-------------+-------------+----------------+
| b1          |         256 |           2000 |
| b2          |        8000 |           2000 |
+-------------+-------------+----------------+
2 rows in set (0.01 sec)
```

Você também pode verificar a saída do utilitário **ndb\_desc**, como mostrado aqui, com as linhas relevantes exibidas usando texto em negrito:

```
$> ndb_desc -d test t1
-- t --
Version: 1
Fragment type: HashMapPartition
K Value: 6
Min load factor: 78
Max load factor: 80
Temporary table: no
Number of attributes: 3
Number of primary keys: 1
Length of frm data: 945
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
-- Attributes --
a Int PRIMARY KEY DISTRIBUTION KEY AT=FIXED ST=MEMORY
b1 Blob(256,2000,0) NULL AT=MEDIUM_VAR ST=MEMORY BV=2 BT=NDB$BLOB_64_1
b2 Blob(8000,2000,0) NULL AT=MEDIUM_VAR ST=MEMORY BV=2 BT=NDB$BLOB_64_2
-- Indexes --
PRIMARY KEY(a) - UniqueHashIndex
PRIMARY(a) - OrderedIndex
```

`BLOB_INLINE_SIZE` não tem efeito nas colunas `TINYBLOB`. No NDB 8.0.41 e versões posteriores, ele é desabilitado com `TINYBLOB` e causa um aviso se usado.

Para `MAX_BLOB_PART_SIZE`, o sinal `=` e o valor que o segue são opcionais. O uso de qualquer valor diferente de 0 ou 1 resulta em um erro de sintaxe.

O efeito de usar `MAX_BLOB_PART_SIZE` em um comentário de coluna é definir o tamanho da parte do blob de uma coluna `TEXT` ou `BLOB` para o número máximo de bytes suportado por `NDB` (13948). Esta opção pode ser aplicada a qualquer tipo de coluna blob suportado pelo MySQL, exceto `TINYBLOB` ou `TINYTEXT` (`BLOB`, `MEDIUMBLOB`, `LONGBLOB`, `TEXT`, `MEDIUMTEXT`, `LONGTEXT`). Ao contrário de `BLOB_INLINE_SIZE`, `MAX_BLOB_PART_SIZE` não tem efeito sobre as colunas `JSON`.

Para ver os efeitos dessa opção, primeiro executamos a seguinte instrução SQL no cliente **mysql** para criar uma tabela com duas colunas `BLOB`, uma (`c1`) sem opções extras e outra (`c2`) com `MAX_BLOB_PART_SIZE`:

```
mysql> CREATE TABLE test.t2 (
    ->   p INT PRIMARY KEY,
    ->   c1 BLOB,
    ->   c2 BLOB COMMENT 'NDB_COLUMN=MAX_BLOB_PART_SIZE'
    -> ) ENGINE NDB;
Query OK, 0 rows affected (0.32 sec)
```

No shell do sistema, execute o utilitário **ndb\_desc** para obter informações sobre a tabela recém-criada, conforme mostrado neste exemplo:

```
$> ndb_desc -d test t2
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

As informações da coluna na saída estão listadas em `Attributes`; para as colunas `c1` e `c2`, elas são exibidas aqui em texto em negrito. Para `c1`, o tamanho da parte do blob é de 2000, o valor padrão; para `c2`, é de 13948, conforme definido por `MAX_BLOB_PART_SIZE`.

Você também pode consultar a tabela `ndbinfo.blobs` para ver isso, como mostrado aqui:

```
mysql> SELECT
    ->   column_name AS 'Column Name',
    ->   inline_size AS 'Inline Size',
    ->   part_size AS 'Blob Part Size'
    -> FROM ndbinfo.blobs
    -> WHERE table_name = 't2';
+-------------+-------------+----------------+
| Column Name | Inline Size | Blob Part Size |
+-------------+-------------+----------------+
| c1          |         256 |           2000 |
| c2          |         256 |          13948 |
+-------------+-------------+----------------+
2 rows in set (0.00 sec)
```

Você pode alterar o tamanho da parte do blob para uma coluna de blob específica de uma tabela `NDB` usando uma instrução `ALTER TABLE` como esta, e verificar as alterações posteriormente usando `SHOW CREATE TABLE`:

```
mysql> ALTER TABLE test.t2
    ->    DROP COLUMN c1,
    ->     ADD COLUMN c1 BLOB COMMENT 'NDB_COLUMN=MAX_BLOB_PART_SIZE',
    ->     CHANGE COLUMN c2 c2 BLOB AFTER c1;
Query OK, 0 rows affected (0.47 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> SHOW CREATE TABLE test.t2\G
*************************** 1. row ***************************
       Table: t
Create Table: CREATE TABLE `t2` (
  `p` int(11) NOT NULL,
  `c1` blob COMMENT 'NDB_COLUMN=MAX_BLOB_PART_SIZE',
  `c2` blob,
  PRIMARY KEY (`p`)
) ENGINE=ndbcluster DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.00 sec)

mysql> EXIT
Bye
```

A saída do **ndb\_desc** mostra que os tamanhos das partes de blob das colunas foram alterados conforme esperado:

```
$> ndb_desc -d test t2
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
```

Você também pode ver a mudança executando a consulta novamente contra `ndbinfo.blobs`:

```
mysql> SELECT
    ->   column_name AS 'Column Name',
    ->   inline_size AS 'Inline Size',
    ->   part_size AS 'Blob Part Size'
    -> FROM ndbinfo.blobs
    -> WHERE table_name = 't2';
+-------------+-------------+----------------+
| Column Name | Inline Size | Blob Part Size |
+-------------+-------------+----------------+
| c1          |         256 |          13948 |
| c2          |         256 |           2000 |
+-------------+-------------+----------------+
2 rows in set (0.00 sec)
```

É possível definir tanto `BLOB_INLINE_SIZE` quanto `MAX_BLOB_PART_SIZE` para uma coluna de blob, conforme mostrado nesta declaração `CREATE TABLE`:

```
mysql> CREATE TABLE test.t3 (
    ->   p INT NOT NULL PRIMARY KEY,
    ->   c1 JSON,
    ->   c2 JSON COMMENT 'NDB_COLUMN=BLOB_INLINE_SIZE=5000,MAX_BLOB_PART_SIZE'
    -> ) ENGINE NDB;
Query OK, 0 rows affected (0.28 sec)
```

A consulta à tabela `blobs` nos mostra que a declaração funcionou conforme o esperado:

```
mysql> SELECT
    ->   column_name AS 'Column Name',
    ->   inline_size AS 'Inline Size',
    ->   part_size AS 'Blob Part Size'
    -> FROM ndbinfo.blobs
    -> WHERE table_name = 't3';
+-------------+-------------+----------------+
| Column Name | Inline Size | Blob Part Size |
+-------------+-------------+----------------+
| c1          |        4000 |           8100 |
| c2          |        5000 |           8100 |
+-------------+-------------+----------------+
2 rows in set (0.00 sec)
```

Você também pode verificar se a declaração funcionou verificando a saída do **ndb\_desc**.

Para alterar o tamanho da parte blob de uma coluna, é necessário usar uma cópia `ALTER TABLE`; essa operação não pode ser realizada online (consulte a Seção 25.6.12, “Operações online com ALTER TABLE no NDB Cluster”).

Para obter mais informações sobre como o `NDB` armazena colunas de tipos blob, consulte os Requisitos de Armazenamento de Tipo de String.

##### Opções da Tabela NDB

Para uma tabela de um cluster NDB, o comentário da tabela em uma declaração `CREATE TABLE` ou `ALTER TABLE` também pode ser usado para especificar uma opção `NDB_TABLE`, que consiste em um ou mais pares nome-valor, separados por vírgulas, se necessário, seguindo a string `NDB_TABLE=`. A sintaxe completa para nomes e valores é mostrada aqui:

```
COMMENT="NDB_TABLE=ndb_table_option[,ndb_table_option[,...]]"

ndb_table_option: {
    NOLOGGING={1 | 0}
  | READ_BACKUP={1 | 0}
  | PARTITION_BALANCE={FOR_RP_BY_NODE | FOR_RA_BY_NODE | FOR_RP_BY_LDM
                      | FOR_RA_BY_LDM | FOR_RA_BY_LDM_X_2
                      | FOR_RA_BY_LDM_X_3 | FOR_RA_BY_LDM_X_4}
  | FULLY_REPLICATED={1 | 0}
}
```

Espaços não são permitidos dentro da string entre aspas. A string é case-insensitive.

As quatro opções da tabela `NDB` que podem ser definidas como parte de um comentário dessa forma são descritas com mais detalhes nos próximos parágrafos.

`NOLOGGING`: Por padrão, as tabelas `NDB` são registradas e pontos de controle são criados. Isso as torna resistentes a falhas de todo o clúster. Ao usar `NOLOGGING` ao criar ou alterar uma tabela, significa que essa tabela não é registrada novamente ou incluída em pontos de controle locais. Nesse caso, a tabela ainda é replicada em todos os nós de dados para alta disponibilidade e atualizada usando transações, mas as alterações feitas nela não são registradas nos logs de registro do nó de dados e seu conteúdo não é registrado em pontos de controle no disco; ao recuperar de uma falha de clúster, o clúster retém a definição da tabela, mas nenhuma de suas linhas — ou seja, a tabela está vazia.

O uso de tabelas sem registro dessas reduz as demandas do nó de dados em I/O de disco e armazenamento, além da CPU para o checkpointing da CPU. Isso pode ser adequado para dados de curta duração que são frequentemente atualizados e onde a perda de todos os dados no improvável caso de falha total do cluster é aceitável.

Também é possível usar a variável de sistema `ndb_table_no_logging` para fazer com que quaisquer tabelas NDB criadas ou alteradas enquanto essa variável estiver em vigor se comportem como se tivessem sido criadas com o comentário `NOLOGGING`. Ao contrário do uso direto do comentário, neste caso, não há nada na saída de `SHOW CREATE TABLE` para indicar que é uma tabela não registrada. Recomenda-se o uso da abordagem de comentário da tabela, pois oferece controle por tabela da funcionalidade, e esse aspecto do esquema da tabela está embutido na declaração de criação da tabela, onde pode ser facilmente encontrado por ferramentas baseadas em SQL.

`READ_BACKUP`: Definir essa opção para 1 tem o mesmo efeito que se `ndb_read_backup` estivesse habilitado; habilita a leitura de qualquer replica. Isso melhora significativamente o desempenho das leituras da tabela a um custo relativamente baixo para o desempenho de escrita. A partir do NDB 8.0.19, 1 é o padrão para `READ_BACKUP`, e o padrão para `ndb_read_backup` é `ON` (anteriormente, a leitura de qualquer replica estava desabilitada por padrão).

Você pode definir `READ_BACKUP` para uma tabela existente online, usando uma declaração `ALTER TABLE` semelhante a uma das mostradas aqui:

```
ALTER TABLE ... ALGORITHM=INPLACE, COMMENT="NDB_TABLE=READ_BACKUP=1";

ALTER TABLE ... ALGORITHM=INPLACE, COMMENT="NDB_TABLE=READ_BACKUP=0";
```

Para obter mais informações sobre a opção `ALGORITHM` para `ALTER TABLE`, consulte a Seção 25.6.12, “Operações online com ALTER TABLE no NDB Cluster”.

`PARTITION_BALANCE`: Oferece controle adicional sobre a atribuição e o posicionamento das partições. Os seguintes quatro esquemas são suportados:

1. `FOR_RP_BY_NODE`: Uma partição por nó.

   Apenas um LDM em cada nó armazena uma partição primária. Cada partição é armazenada no mesmo LDM (mesma ID) em todos os nós.

2. `FOR_RA_BY_NODE`: Uma partição por grupo de nós.

   Cada nó armazena uma única partição, que pode ser uma replica primária ou uma replica de backup. Cada partição é armazenada no mesmo LDM em todos os nós.

3. `FOR_RP_BY_LDM`: Uma partição para cada LDM em cada nó; o padrão.

   Este é o ambiente usado se `READ_BACKUP` estiver definido como 1.

4. `FOR_RA_BY_LDM`: Uma partição por LDM em cada grupo de nós.

   Essas partições podem ser primárias ou de backup.

5. `FOR_RA_BY_LDM_X_2`: Duas partições por LDM em cada grupo de nós.

   Essas partições podem ser primárias ou de backup.

6. `FOR_RA_BY_LDM_X_3`: Três partições por LDM em cada grupo de nós.

   Essas partições podem ser primárias ou de backup.

7. `FOR_RA_BY_LDM_X_4`: Quatro partições por LDM em cada grupo de nós.

   Essas partições podem ser primárias ou de backup.

`PARTITION_BALANCE` é a interface preferida para definir o número de partições por tabela. O uso de `MAX_ROWS` para forçar o número de partições é desaconselhável, mas continua sendo suportado para compatibilidade com versões anteriores; está sujeito à remoção em uma futura versão do MySQL NDB Cluster. (Bug #81759, Bug #23544301)

`FULLY_REPLICATED` controla se a tabela é replicada completamente, ou seja, se cada nó de dados tem uma cópia completa da tabela. Para habilitar a replicação completa da tabela, use `FULLY_REPLICATED=1`.

Essa configuração também pode ser controlada usando a variável de sistema `ndb_fully_replicated`. Definindo-a como `ON`, a opção é ativada por padrão para todas as novas tabelas `NDB`; o padrão é `OFF`. A variável de sistema `ndb_data_node_neighbour` também é usada para tabelas totalmente replicadas, para garantir que, quando uma tabela totalmente replicada é acessada, acessemos o nó de dados que é local para este servidor MySQL.

Um exemplo de uma declaração `CREATE TABLE` usando um comentário assim ao criar uma tabela `NDB` é mostrado aqui:

```
mysql> CREATE TABLE t1 (
     >     c1 INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
     >     c2 VARCHAR(100),
     >     c3 VARCHAR(100) )
     > ENGINE=NDB
     >
COMMENT="NDB_TABLE=READ_BACKUP=0,PARTITION_BALANCE=FOR_RP_BY_NODE";
```

O comentário é exibido como parte da saída do `SHOW CREATE TABLE`. O texto do comentário também está disponível ao consultar a tabela do Schema de Informações do MySQL `TABLES`, como neste exemplo:

```
mysql> SELECT TABLE_NAME, TABLE_SCHEMA, TABLE_COMMENT
     > FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME="t1"\G
*************************** 1. row ***************************
   TABLE_NAME: t1
 TABLE_SCHEMA: test
TABLE_COMMENT: NDB_TABLE=READ_BACKUP=0,PARTITION_BALANCE=FOR_RP_BY_NODE
1 row in set (0.01 sec)
```

Essa sintaxe de comentário também é suportada com as declarações `ALTER TABLE` para tabelas `NDB`, como mostrado aqui:

```
mysql> ALTER TABLE t1 COMMENT="NDB_TABLE=PARTITION_BALANCE=FOR_RA_BY_NODE";
Query OK, 0 rows affected (0.40 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

A partir da versão 8.0.21 do NDB, a coluna `TABLE_COMMENT` exibe o comentário necessário para recriar a tabela, pois segue a instrução `ALTER TABLE`, da seguinte forma:

```
mysql> SELECT TABLE_NAME, TABLE_SCHEMA, TABLE_COMMENT
    ->     FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME="t1"\G
*************************** 1. row ***************************
   TABLE_NAME: t1
 TABLE_SCHEMA: test
TABLE_COMMENT: NDB_TABLE=READ_BACKUP=0,PARTITION_BALANCE=FOR_RP_BY_NODE
1 row in set (0.01 sec)
```

```
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

Tenha em mente que um comentário de tabela usado com `ALTER TABLE` substitui qualquer comentário existente que a tabela possa ter.

```
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

Antes da versão 8.0.21 do NDB, o comentário da tabela usado com `ALTER TABLE` substituía qualquer comentário existente que a tabela pudesse ter tido. Isso significava que, por exemplo, o valor `READ_BACKUP` não era transferido para o novo comentário definido pela instrução `ALTER TABLE`, e que quaisquer valores não especificados retornavam aos seus valores padrão. (BUG#30428829) Assim, não havia mais nenhuma maneira de usar o SQL para recuperar o valor previamente definido para o comentário. Para evitar que os valores dos comentários retornem aos seus valores padrão, era necessário preservar quaisquer valores dessas strings de comentário existentes e incluí-los no comentário passado para `ALTER TABLE`.

Você também pode ver o valor da opção `PARTITION_BALANCE` na saída do **ndb\_desc**. **ndb\_desc** também mostra se as opções `READ_BACKUP` e `FULLY_REPLICATED` estão definidas para a tabela. Consulte a descrição deste programa para obter mais informações.
