#### 15.1.24.12 Configurando Opções de Comentário NDB

* Opções NDB\_COLUMN
* Opções NDB\_TABLE

É possível definir várias opções específicas para o NDB Cluster no comentário da tabela ou nos comentários das colunas de uma tabela `NDB`. Opções de nível de tabela para controlar a leitura de qualquer replica e o equilíbrio de partições podem ser incorporadas em um comentário de tabela usando `NDB_TABLE`.

`NDB_COLUMN` pode ser usado em um comentário de coluna para definir o tamanho da coluna da tabela de partes do blob usada para armazenar partes dos valores do blob pelo `NDB` até seu máximo. Isso funciona para colunas `BLOB`, `MEDIUMBLOB`, `LONGBLOB`, `TEXT`, `MEDIUMTEXT`, `LONGTEXT` e `JSON`. Um comentário de coluna também pode ser usado para controlar o tamanho inline de uma coluna de blob. Comentários `NDB_COLUMN` não suportam colunas `TINYBLOB` ou `TINYTEXT`, pois essas têm uma parte inline (apenas) de tamanho fixo e nenhuma parte separada para armazenar em outro lugar.

`NDB_TABLE` pode ser usado em um comentário de tabela para definir opções relacionadas ao equilíbrio de partições e se a tabela é totalmente replicada, entre outras. O restante desta seção descreve essas opções e seu uso.

##### Opções NDB\_COLUMN

No NDB Cluster, um comentário de coluna em uma declaração `CREATE TABLE` ou `ALTER TABLE` também pode ser usado para especificar uma opção `NDB_COLUMN`. O `NDB` suporta duas opções de comentário de coluna `BLOB_INLINE_SIZE` e `MAX_BLOB_PART_SIZE`. A sintaxe para essas opções é mostrada aqui:

```
COMMENT 'NDB_COLUMN=speclist'

speclist := spec[,spec]

spec :=
    BLOB_INLINE_SIZE=value
  | MAX_BLOB_PART_SIZE[={0|1}]
```

`BLOB_INLINE_SIZE` especifica o número de bytes a ser armazenado inline pela coluna; seu valor esperado é um inteiro no intervalo de 1 a 29980, inclusive. Definir um valor maior que 29980 gera um erro; definir um valor menor que 1 é permitido, mas faz com que o tamanho inline padrão para o tipo de coluna seja usado.

Você deve estar ciente de que o valor máximo para essa opção é, na verdade, o número máximo de bytes que podem ser armazenados em uma única linha de uma tabela `NDB`; cada coluna na linha contribui para esse total.

Você também deve ter em mente, especialmente ao trabalhar com colunas `TEXT`, que o valor definido por `MAX_BLOB_PART_SIZE` ou `BLOB_INLINE_SIZE` representa o tamanho da coluna em bytes. Isso não indica o número de caracteres, que varia de acordo com o conjunto de caracteres e a ordenação usados pela coluna.

Para ver os efeitos dessa opção, primeiro crie uma tabela com duas colunas `BLOB`, uma (`b1`) sem opções extras e outra (`b2`) com um ajuste para `BLOB_INLINE_SIZE`, como mostrado aqui:

```
mysql> CREATE TABLE t1 (
    ->    a INT NOT NULL PRIMARY KEY,
    ->    b1 BLOB,
    ->    b2 BLOB COMMENT 'NDB_COLUMN=BLOB_INLINE_SIZE=8000'
    ->  ) ENGINE NDB;
Query OK, 0 rows affected (0.32 sec)
```

Você pode ver as configurações de `BLOB_INLINE_SIZE` para as colunas `BLOB` fazendo uma consulta à tabela `ndbinfo.blobs`, assim:

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

Você também pode verificar a saída da utilidade **ndb\_desc**, como mostrado aqui, com as linhas relevantes exibidas em texto destacado:

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

`BLOB_INLINE_SIZE` não é permitido com colunas `TINYBLOB` e causa um aviso se usado.

Para `MAX_BLOB_PART_SIZE`, o sinal `=` e o valor que o segue são opcionais. Usar qualquer valor diferente de 0 ou 1 resulta em um erro de sintaxe.

O efeito de usar `MAX_BLOB_PART_SIZE` em um comentário de coluna é definir o tamanho da parte do blob de uma coluna `TEXT` ou `BLOB` para o número máximo de bytes suportado por `NDB` (13948). Essa opção pode ser aplicada a qualquer tipo de coluna `BLOB` suportado pelo MySQL, exceto `TINYBLOB` ou `TINYTEXT` (`BLOB`, `MEDIUMBLOB`, `LONGBLOB`, `TEXT`, `MEDIUMTEXT`, `LONGTEXT`). Ao contrário de `BLOB_INLINE_SIZE`, `MAX_BLOB_PART_SIZE` não tem efeito em colunas `JSON`.

Para ver os efeitos dessa opção, primeiro executamos a seguinte instrução SQL no cliente **mysql** para criar uma tabela com duas colunas `BLOB`, uma (`c1`) sem opções extras e outra (`c2`) com `MAX_BLOB_PART_SIZE`:

```
mysql> CREATE TABLE test.t2 (
    ->   p INT PRIMARY KEY,
    ->   c1 BLOB,
    ->   c2 BLOB COMMENT 'NDB_COLUMN=MAX_BLOB_PART_SIZE'
    -> ) ENGINE NDB;
Query OK, 0 rows affected (0.32 sec)
```

Do shell do sistema, execute o utilitário **ndb\_desc** para obter informações sobre a tabela recém-criada, como mostrado neste exemplo:

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

As informações das colunas na saída estão listadas sob `Atributos`; para as colunas `c1` e `c2`, elas são exibidas aqui em texto em negrito. Para `c1`, o tamanho da parte do blob é de 2000, o valor padrão; para `c2`, é de 13948, conforme definido por `MAX_BLOB_PART_SIZE`.

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

Você pode alterar o tamanho da parte do blob para uma coluna `BLOB` de uma tabela `NDB` usando uma instrução `ALTER TABLE`, como esta, e verificar as alterações depois usando `SHOW CREATE TABLE`:

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

A saída do **ndb\_desc** mostra que os tamanhos das partes do blob das colunas foram alterados conforme esperado:

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

É possível definir tanto `BLOB_INLINE_SIZE` quanto `MAX_BLOB_PART_SIZE` para uma coluna `BLOB`, como mostrado nesta instrução `CREATE TABLE`:

```
mysql> CREATE TABLE test.t3 (
    ->   p INT NOT NULL PRIMARY KEY,
    ->   c1 JSON,
    ->   c2 JSON COMMENT 'NDB_COLUMN=BLOB_INLINE_SIZE=5000,MAX_BLOB_PART_SIZE'
    -> ) ENGINE NDB;
Query OK, 0 rows affected (0.28 sec)
```

Consultar a tabela `blobs` nos mostra que a instrução funcionou conforme esperado:

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

Você também pode verificar que a instrução funcionou verificando a saída do **ndb\_desc**.

Alterar o tamanho da parte do blob de uma coluna deve ser feito usando uma cópia de `ALTER TABLE`; essa operação não pode ser realizada online (veja a Seção 25.6.12, “Operações Online com ALTER TABLE no NDB Cluster”).

Para mais informações sobre como o `NDB` armazena colunas de tipos `BLOB`, consulte Requisitos de Armazenamento de Tipo de Caractere.

##### Opções da Tabela NDB

Para uma tabela de um NDB Cluster, o comentário da tabela em uma instrução `CREATE TABLE` ou `ALTER TABLE` também pode ser usado para especificar uma opção `NDB_TABLE`, que consiste em um ou mais pares nome-valor, separados por vírgulas, se necessário, seguindo a string `NDB_TABLE=`. A sintaxe completa para nomes e valores é mostrada aqui:

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

As quatro opções de tabela `NDB` que podem ser definidas como parte de um comentário dessa forma são descritas com mais detalhes nos próximos parágrafos.

`NOLOGGING`: Por padrão, as tabelas `NDB` são registradas e checkpointeadas. Isso as torna duráveis em caso de falhas inteiras do cluster. Usar `NOLOGGING` ao criar ou alterar uma tabela significa que essa tabela não é registrada novamente ou incluída em checkpoints locais. Neste caso, a tabela ainda é replicada em todos os nós de dados para alta disponibilidade e atualizada usando transações, mas as alterações feitas nela não são registradas nos logs de redo do nó de dados e seu conteúdo não é checkpointado em disco; ao recuperar de uma falha do cluster, o cluster retém a definição da tabela, mas nenhuma de suas linhas — ou seja, a tabela está vazia.

Usar tabelas sem registro dessas reduz as demandas do nó de dados em I/O de disco e armazenamento, bem como na CPU para checkpointing CPU. Isso pode ser adequado para dados de curta duração que são frequentemente atualizados e onde a perda de todos os dados no improvável caso de uma falha total do cluster é aceitável.

Também é possível usar a variável de sistema `ndb_table_no_logging` para fazer com que quaisquer tabelas NDB criadas ou alteradas enquanto essa variável estiver em vigor se comportem como se tivessem sido criadas com o comentário `NOLOGGING`. Ao contrário do uso direto do comentário, não há nada na saída do `SHOW CREATE TABLE` nesse caso para indicar que é uma tabela sem registro. Recomenda-se usar a abordagem com o comentário da tabela, pois oferece controle por tabela sobre o recurso, e esse aspecto do esquema da tabela está embutido na declaração de criação da tabela, onde pode ser facilmente encontrado por ferramentas baseadas em SQL.

`READ_BACKUP`: Definir essa opção para 1 tem o mesmo efeito que se `ndb_read_backup` estivesse habilitado; habilita a leitura de qualquer replica. Isso melhora significativamente o desempenho das leituras da tabela a um custo relativamente baixo no desempenho de escrita. 1 é o padrão para `READ_BACKUP`, e o padrão para `ndb_read_backup` é `ON` (anteriormente, a leitura de qualquer replica era desabilitada por padrão).

Você pode definir `READ_BACKUP` para uma tabela existente online, usando uma declaração `ALTER TABLE` semelhante àquela mostrada aqui:

```
ALTER TABLE ... ALGORITHM=INPLACE, COMMENT="NDB_TABLE=READ_BACKUP=1";

ALTER TABLE ... ALGORITHM=INPLACE, COMMENT="NDB_TABLE=READ_BACKUP=0";
```

Para mais informações sobre a opção `ALGORITHM` para `ALTER TABLE`, consulte a Seção 25.6.12, “Operações Online com ALTER TABLE no NDB Cluster”.

`PARTITION_BALANCE`: Fornece controle adicional sobre a atribuição e o posicionamento das partições. Os seguintes quatro esquemas são suportados:

1. `FOR_RP_BY_NODE`: Uma partição por nó.

   Apenas um LDM em cada nó armazena uma partição primária. Cada partição é armazenada no mesmo LDM (mesma ID) em todos os nós.

2. `FOR_RA_BY_NODE`: Uma partição por grupo de nós.

   Cada nó armazena uma única partição, que pode ser uma replica primária ou uma replica de backup. Cada partição é armazenada no mesmo LDM em todos os nós.

3. `FOR_RP_BY_LDM`: Uma partição para cada LDM em cada nó; o padrão.

   Esta é a configuração usada se `READ_BACKUP` for definido como 1.

4. `FOR_RA_BY_LDM`: Uma partição por LDM em cada grupo de nós.

   Essas partições podem ser primárias ou de backup.

5. `FOR_RA_BY_LDM_X_2`: Duas partições por LDM em cada grupo de nós.

   Essas partições podem ser primárias ou de backup.

6. `FOR_RA_BY_LDM_X_3`: Três partições por LDM em cada grupo de nós.

   Essas partições podem ser primárias ou de backup.

7. `FOR_RA_BY_LDM_X_4`: Quatro partições por LDM em cada grupo de nós.

   Essas partições podem ser primárias ou de backup.

`PARTITION_BALANCE` é a interface preferida para definir o número de partições por tabela. Usar `MAX_ROWS` para forçar o número de partições é desatualizado, mas continua a ser suportado para compatibilidade com versões anteriores; está sujeito à remoção em uma futura versão do MySQL NDB Cluster. (Bug #81759, Bug #23544301)

`FULLY_REPLICATED` controla se a tabela é totalmente replicada, ou seja, se cada nó de dados tem uma cópia completa da tabela. Para habilitar a replicação completa da tabela, use `FULLY_REPLICATED=1`.

Essa configuração também pode ser controlada usando a variável de sistema `ndb_fully_replicated`. Definindo-a como `ON`, a opção é habilitada por padrão para todas as novas tabelas `NDB`; o padrão é `OFF`. A variável de sistema `ndb_data_node_neighbour` também é usada para tabelas totalmente replicadas, para garantir que, quando uma tabela totalmente replicada é acessada, acessamos o nó de dados que é local para este servidor MySQL.

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

O comentário é exibido como parte da saída do `SHOW CREATE TABLE`. O texto do comentário também está disponível ao consultar a tabela do Esquema de Informações do MySQL `TABLES`, como neste exemplo:

```
mysql> SELECT TABLE_NAME, TABLE_SCHEMA, TABLE_COMMENT
     > FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME="t1"\G
*************************** 1. row ***************************
   TABLE_NAME: t1
 TABLE_SCHEMA: test
TABLE_COMMENT: NDB_TABLE=READ_BACKUP=0,PARTITION_BALANCE=FOR_RP_BY_NODE
1 row in set (0.01 sec)
```

Esta sintaxe de comentário também é suportada com as instruções `ALTER TABLE` para tabelas `NDB`, como mostrado aqui:

```
mysql> ALTER TABLE t1 COMMENT="NDB_TABLE=PARTITION_BALANCE=FOR_RA_BY_NODE";
Query OK, 0 rows affected (0.40 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

A coluna `TABLE_COMMENT` exibe o comentário que é necessário para recriar a tabela, pois está seguindo a instrução `ALTER TABLE`, como este:

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

Lembre-se de que um comentário de tabela usado com `ALTER TABLE` substitui qualquer comentário existente que a tabela possa ter.

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

Você também pode ver o valor da opção `PARTITION_BALANCE` na saída do **ndb\_desc**. **ndb\_desc** também mostra se as opções `READ_BACKUP` e `FULLY_REPLICATED` estão definidas para a tabela. Veja a descrição deste programa para mais informações.